// Minimal WOFF2 writer: wraps TTFs as WOFF2 with Brotli (null glyf/loca transform, which the spec allows).
// Needed because the `brotli` python module / woff2_compress binary are not installed here.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const KNOWN = ['cmap','head','hhea','hmtx','maxp','name','OS/2','post','cvt ','fpgm','glyf','loca','prep','CFF ','VORG','EBDT','EBLC','gasp','hdmx','kern','LTSH','PCLT','VDMX','vhea','vmtx','BASE','GDEF','GPOS','GSUB','EBSC','JSTF','MATH','CBDT','CBLC','COLR','CPAL','SVG ','sbix','acnt','avar','bdat','bloc','bsln','cvar','fdsc','feat','fmtx','fvar','gvar','hsty','just','lcar','mort','morx','opbd','prop','trak','Zapf','Silf','Glat','Gloc','Feat','Sill'];

function base128(n) {
  const out = [];
  do { out.unshift(n & 0x7f); n = Math.floor(n / 128); } while (n > 0);
  for (let i = 0; i < out.length - 1; i++) out[i] |= 0x80;
  return Buffer.from(out);
}
const pad4 = n => (n + 3) & ~3;

export function ttfToWoff2(ttf) {
  const flavor = ttf.readUInt32BE(0);
  const num = ttf.readUInt16BE(4);
  let tables = [];
  for (let i = 0; i < num; i++) {
    const o = 12 + i * 16;
    const tag = ttf.toString('latin1', o, o + 4);
    const off = ttf.readUInt32BE(o + 8), len = ttf.readUInt32BE(o + 12);
    tables.push({ tag, data: ttf.subarray(off, off + len) });
  }
  tables.sort((a, b) => (a.tag < b.tag ? -1 : 1));
  // loca must directly follow glyf
  const gi = tables.findIndex(t => t.tag === 'glyf'), li = tables.findIndex(t => t.tag === 'loca');
  if (gi >= 0 && li >= 0) {
    const [loca] = tables.splice(li, 1);
    tables.splice(tables.findIndex(t => t.tag === 'glyf') + 1, 0, loca);
  }
  const dir = [];
  for (const t of tables) {
    const idx = KNOWN.indexOf(t.tag);
    let flags = idx >= 0 ? idx : 63;
    if (t.tag === 'glyf' || t.tag === 'loca') flags |= 3 << 6; // null transform
    dir.push(Buffer.from([flags]));
    if (idx < 0) dir.push(Buffer.from(t.tag, 'latin1'));
    dir.push(base128(t.data.length));
  }
  const dirBuf = Buffer.concat(dir);
  const raw = Buffer.concat(tables.map(t => t.data));
  const comp = zlib.brotliCompressSync(raw, { params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_FONT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: raw.length,
  } });
  const sfntSize = 12 + 16 * tables.length + tables.reduce((s, t) => s + pad4(t.data.length), 0);
  const headerLen = 48;
  const total = pad4(headerLen + dirBuf.length + comp.length);
  const h = Buffer.alloc(headerLen);
  h.writeUInt32BE(0x774f4632, 0);
  h.writeUInt32BE(flavor, 4);
  h.writeUInt32BE(total, 8);
  h.writeUInt16BE(tables.length, 12);
  h.writeUInt16BE(0, 14);
  h.writeUInt32BE(sfntSize, 16);
  h.writeUInt32BE(comp.length, 20);
  h.writeUInt16BE(1, 24);
  h.writeUInt16BE(0, 26);
  // meta + private block: all zero
  const out = Buffer.concat([h, dirBuf, comp]);
  return Buffer.concat([out, Buffer.alloc(total - out.length)]);
}

if (process.argv[1] && process.argv[1].endsWith('woff2.mjs')) {
  const dir = process.argv[2];
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.ttf'))) {
    const w = ttfToWoff2(fs.readFileSync(path.join(dir, f)));
    const out = path.join(dir, f.replace('.ttf', '.woff2'));
    fs.writeFileSync(out, w);
    console.log(f, '->', out, w.length, 'bytes');
  }
}
