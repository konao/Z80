const toHex2 = (x) => {
    return ('00' + x.toString(16).toUpperCase()).substr(-2);
}

const toHex4 = (x) => {
    return ('0000' + x.toString(16).toUpperCase()).substr(-4);
}

const A = 7;
const B = 0;
const C = 1;
const D = 2;
const E = 3;
const H = 4;
const L = 5;

const BC = 0;
const DE = 1;
const HL = 2;
const SP = 3;
const AF = 3;

// xから3bit抽出
// @param dsp 右シフトビット数
const xrct3 = (x, dsp) => {
    const reg = x >> dsp;
    return reg & 0x07;
}

// xから2bit抽出
// @param dsp 右シフトビット数
const xrct2 = (x, dsp) => {
    const reg = x >> dsp;
    return reg & 0x03;
}

const toRegName = (x) => {
    switch (x) {
        case A: { return 'A' }
        case B: { return 'B' }
        case C: { return 'C' }
        case D: { return 'D' }
        case E: { return 'E' }
        case H: { return 'H' }
        case L: { return 'L' }
    }
}

// xの2の補数を返す
// (xは8bit数値とみなす)
const get2sCmpl_8(x) => {
    const x_8 = x & 0xff;   // 8bitに制限
    return (x_8 ^ 0xff) + 1;    // ^はxorの演算子
}

// addrにoffsetを加えたアドレスを返す
//
// @param addr 基準アドレス
// @param offset オフセット
//
// offsetは8bit（符号付き）
// 0<=offset<=127 --> PC=PC+offset
// 128<=offset<=255 --> PC=PC+offsetの2の補数
const calcRelAddr_8 = (addr, offset) => {
    const off8 = offset & 0xff;
    if ((off8 & 0x80) === 0) {
        // off8は正の数
        return addr + off8;
    } else {
        // off8は負の数
        // off8の2の補数を加える
        return addr + get2sCmpl_8(off8);
    }
}

module.exports = {
    toHex2,
    toHex4,
    A, B, C, D, E, H, L,
    BC, DE, HL, SP, AF,
    xrct3,
    xrct2,
    toRegName,
    get2sCmpl_8,
    calcRelAddr_8
}