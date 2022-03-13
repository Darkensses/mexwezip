const SEPARATOR = 0x800F // hexeditor: 0F 80

let buffer = new ArrayBuffer(48)
let header = new DataView(buffer);

let headerLocalBin = new DataView(new ArrayBuffer(32));
let headerLocalClut = new DataView(new ArrayBuffer(32));

function calculateHeader(files) {
    // BYTE [00,01]: 48 BYTES + LOCAL_BIN Length
    header.setUint16(0,header.byteLength + files.LOCAL_BIN.length, true); // set true for little endianess

    // WRITE SEPARATOR [02,03]
    header.setUint16(2,SEPARATOR,true);

    // BYTE [04,05]: Sum of 48 bytes + ...
    header.setUint16(
      4,
      header.byteLength +
      files.LOCAL_BIN.length +
      headerLocalBin.byteLength +
      files.GK_LOCAL_BIN.length +
      headerLocalClut.byteLength +
      (files.LOCAL_CLUT.length - 20),
      true
    );

    // WRITE SEPARATOR [06,07]
    header.setUint16(6,SEPARATOR,true);

    // BYTE [08,09]:
    header.setUint16(
        8,
        header.byteLength +
        (32 * 4) +
        files.LOCAL_BIN.length +
        files.GK_LOCAL_BIN.length +
        2 * (files.LOCAL_CLUT.length - 20) +
        files.AWAY_BIN.length,
        true
    );

    // WRITE SEPARATOR [10,11]
    header.setUint16(10,SEPARATOR,true);

    console.log(new Uint8Array(header.buffer));
}

export function createTex(files) {
    calculateHeader(files)
}