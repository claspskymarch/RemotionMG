/**
 * 极简 ZIP 写入器（store / 不压缩），零依赖，仅用于浏览器里把主题包打成一个 .zip 下载。
 * 实现标准 ZIP：每个文件一个本地头 + 数据，末尾中央目录 + 结束记录。
 */

const crcTable: number[] = (() => {
  const t: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

const crc32 = (bytes: Uint8Array): number => {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = crcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

type Entry = {name: Uint8Array; data: Uint8Array; crc: number; offset: number};

/** 把 {文件名: 文本内容} 打成一个 store 模式的 zip Blob。 */
export const makeZip = (files: {name: string; content: string}[]): Blob => {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const entries: Entry[] = [];
  let offset = 0;

  const push = (u: Uint8Array) => {
    chunks.push(u);
    offset += u.length;
  };
  const u16 = (n: number) => new Uint8Array([n & 0xff, (n >>> 8) & 0xff]);
  const u32 = (n: number) =>
    new Uint8Array([n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]);

  for (const f of files) {
    const name = enc.encode(f.name);
    const data = enc.encode(f.content);
    const crc = crc32(data);
    const localOffset = offset;
    // 本地文件头
    push(u32(0x04034b50));
    push(u16(20)); // version needed
    push(u16(0)); // flags
    push(u16(0)); // method = store
    push(u16(0)); // mod time
    push(u16(0)); // mod date
    push(u32(crc));
    push(u32(data.length)); // compressed size
    push(u32(data.length)); // uncompressed size
    push(u16(name.length));
    push(u16(0)); // extra len
    push(name);
    push(data);
    entries.push({name, data, crc, offset: localOffset});
  }

  const cdStart = offset;
  for (const e of entries) {
    push(u32(0x02014b50)); // central dir header
    push(u16(20)); // version made by
    push(u16(20)); // version needed
    push(u16(0)); // flags
    push(u16(0)); // method
    push(u16(0)); // time
    push(u16(0)); // date
    push(u32(e.crc));
    push(u32(e.data.length));
    push(u32(e.data.length));
    push(u16(e.name.length));
    push(u16(0)); // extra
    push(u16(0)); // comment
    push(u16(0)); // disk
    push(u16(0)); // internal attrs
    push(u32(0)); // external attrs
    push(u32(e.offset));
    push(e.name);
  }
  const cdSize = offset - cdStart;

  // 结束记录
  push(u32(0x06054b50));
  push(u16(0)); // disk
  push(u16(0)); // cd disk
  push(u16(entries.length));
  push(u16(entries.length));
  push(u32(cdSize));
  push(u32(cdStart));
  push(u16(0)); // comment len

  return new Blob(chunks as BlobPart[], {type: 'application/zip'});
};
