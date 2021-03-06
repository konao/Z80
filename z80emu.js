const {
    toHex2, 
    toHex4, 
    A, B, C, D, E, H, L, 
    BC, DE, HL, SP, AF,
    xrct3, xrct2, 
    toRegName,
    calcRelAddr_8
} = require('./Utils');

// 8bitロードグループ
const LD_R_R = 0x40;
const LD_R_N = 0x06;
const LD_R_HL = 0x46;
const LD_R_IX = 0xdd46;
const LD_R_IY = 0xfd46;
const LD_HL_R = 0x70;
const LD_IX_R = 0xdd70;
const LD_IY_R = 0xfd70;
const LD_HL_N = 0x36;
const LD_IX_N = 0xdd36;
const LD_IY_N = 0xfd36;
const LD_A_BC = 0x0a;
const LD_A_DE = 0x1a;
const LD_A_NN = 0x3a;
const LD_BC_A = 0x02;
const LD_DE_A = 0x12;
const LD_NN_A = 0x32;
// const LD_A_I = 0xed57;
// const LD_I_A = 0xed47;
// const LD_A_R = 0xed5f;
// const LD_R_A = 0xed4f;

// 16bitロードグループ
const LD_dd_NN = 0x01
const LD_IX_NN = 0xdd21;
const LD_IY_NN = 0xfd21;
const LD_HL_ADDR = 0x2a;
const LD_dd_ADDR = 0xed4b;
const LD_IX_ADDR = 0xdd2a;
const LD_IY_ADDR = 0xfd2a;
const LD_ADDR_HL = 0x22;
const LD_ADDR_dd = 0xed43;
const LD_ADDR_IX = 0xdd22;
const LD_ADDR_IY = 0xfd22;
const LD_SP_HL = 0xf9;
const LD_SP_IX = 0xddf9;
const LD_SP_IY = 0xfdf9;
const PUSH_qq = 0xc5;
const PUSH_IX = 0xdde5;
const PUSH_IY = 0xfde5;
const POP_qq = 0xc1;
const POP_IX = 0xdde1;
const POP_IY = 0xfde1;

// 交換、ブロック転送、サーチグループ
const EX_DE_HL = 0xeb;
const EX_AF_AFdash = 0x08;
const EXX = 0xd9;
const EX_SP_HL = 0xe3;
const EX_SP_IX = 0xdde3;
const EX_SP_IY = 0xfde3;
const LDI = 0xeda0;
const LDIR = 0xedb0;
const LDD = 0xeda8;
const LDDR = 0xedb8;
const CPI = 0xeda1;
const CPIR = 0xedb1;
const CPD = 0xeda9;
const CPDR = 0xedb9;

// 8bit算術、論理演算グループ
const ADD_A_R = 0x80;
const ADD_A_N = 0xc6;
const ADD_A_HL = 0x86;
const ADD_A_IX = 0xdd86;
const ADD_A_IY = 0xfd86;
const ADC_A_R = 0x88;
const ADC_A_N = 0xce;
const ADC_A_HL = 0x8e;
const ADC_A_IX = 0xdd8e;
const ADC_A_IY = 0xfd8e;
const SUB_A_R = 0x90;
const SUB_A_N = 0xd6;
const SUB_A_HL = 0x96;
const SUB_A_IX = 0xdd96;
const SUB_A_IY = 0xfd96;
const SBC_A_R = 0x98;
const SBC_A_N = 0xde;
const SBC_A_HL = 0x9e;
const SBC_A_IX = 0xdd9e;
const SBC_A_IY = 0xfd9e;
const AND_A_R = 0xa0;
const AND_A_N = 0xe6;
const AND_A_HL = 0xa6;
const AND_A_IX = 0xdda6;
const AND_A_IY = 0xfda6;
const OR_A_R = 0xb0;
const OR_A_N = 0xf6;
const OR_A_HL = 0xb6;
const OR_A_IX = 0xddb6;
const OR_A_IY = 0xfdb6;
const XOR_A_R = 0xa8;
const XOR_A_N = 0xee;
const XOR_A_HL = 0xae;
const XOR_A_IX = 0xddae;
const XOR_A_IY = 0xfdae;
const CP_A_R = 0xb8;
const CP_A_N = 0xfe;
const CP_A_HL = 0xbe;
const CP_A_IX = 0xddbe;
const CP_A_IY = 0xfdbe;
const INC_R = 0x04;
const INC_REF_HL = 0x34;
const INC_REF_IX = 0xdd34;
const INC_REF_IY = 0xfd34;
const DEC_R = 0x05;
const DEC_REF_HL = 0x35;
const DEC_REF_IX = 0xdd35;
const DEC_REF_IY = 0xfd35;

// 汎用算術演算、CPU制御グループ
const DAA = 0x27;
const CPL = 0x2f;
const NEG = 0xed44;
const CCF = 0x3f;
const SCF = 0x37;
const NOP = 0x00;
const HALT = 0x76;
const DI = 0xf3;
const EI = 0xfb;
const IM0 = 0xed46;
const IM1 = 0xed56;
const IM2 = 0xed5e;

// 16bit算術演算グループ
const ADD_HL_ss = 0x09;
const ADC_HL_ss = 0xed4a;
const SBC_HL_ss = 0xed42;
const ADD_IX_pp = 0xdd09;
const ADD_IY_rr = 0xfd09;
const INC_ss = 0x03;
const INC_IX = 0xdd23;
const INC_IY = 0xfd23;
const DEC_ss = 0x0b;
const DEC_IX = 0xdd2b;
const DEC_IY = 0xfd2b;

// ジャンプグループ
const JP = 0xc3;
const JP_cc = 0xc2;
const JR = 0x18;
const JR_C = 0x38;
const JR_NC = 0x30;
const JR_Z = 0x28;
const JR_NZ = 0x20;
const JP_HL = 0xe9;
const JP_IX = 0xdde9;
const JP_IY = 0xfde9;
const DJNZ = 0x10;

// コール、リターングループ
const CALL = 0xcd;
const CALL_cc = 0xc4;
const RET = 0xc9;
const RET_cc = 0xc0;
const RETI = 0xed4d;
const RETN = 0xed45;
const RST = 0xc7;

// ローテイト、シフトグループ
const RLCA = 0x07;
const RLA = 0x17;
const RRCA = 0x0f;
const RRA = 0x1f;
const RLC_r = 0xcb00;
const RLC_HL = 0xcb06;
const RLC_IX = 0xddcb06;
const RLC_IY = 0xfdcb06;
const RL_r = 0xcb10;
const RL_HL = 0xcb16;
const RL_IX = 0xddcb16;
const RL_IY = 0xfdcb16;
const RRC_r = 0xcb08;
const RRC_HL = 0xcb0e;
const RRC_IX = 0xddcb0e;
const RRC_IY = 0xfdcb0e;
const RR_r = 0xcb18;
const RR_HL = 0xcb1e;
const RR_IX = 0xddcb1e;
const RR_IY = 0xfdcb1e;
const SLA_r = 0xcb20;
const SLA_HL = 0xcb26;
const SLA_IX = 0xddcb26;
const SLA_IY = 0xfdcb26;
const SRA_r = 0xcb28;
const SRA_HL = 0xcb2e;
const SRA_IX = 0xddcb2e;
const SRA_IY = 0xfdcb2e;
const SRL_r = 0xcb38;
const SRL_HL = 0xcb3e;
const SRL_IX = 0xddcb3e;
const SRL_IY = 0xfdcb3e;
const RLD = 0xed6f;
const RRD = 0xed67;

// ビット操作グループ
const BIT_b_r = 0xcb40;
const BIT_b_HL = 0xcb46;
const BIT_b_IX = 0xddcb46;
const BIT_b_IY = 0xfdcb46;
const SET_b_r = 0xcbc0;
const SET_b_HL = 0xcbc6;
const SET_b_IX = 0xddcbc6;
const SET_b_IY = 0xfdcb46;
const RES_b_r = 0xcb80;
const RES_b_HL = 0xcb86;
const RES_b_IX = 0xddcb86;
const RES_b_IY = 0xfdcb86;

// 入出力グループ

class Z80 {
    constructor() {
        this.reg8 = new Uint8Array(8);
        this.PC = 0x0000;
        this.SP = 0x0000;
        this.FLG = 0x00;
        this.IX = 0x0000;
        this.IY = 0x0000;
        this.memory = new Uint8Array(0x10000);
    }

    printReg() {
        console.log(`PC: ${this.PC}`);
        console.log(`A:${toHex2(this.reg8[A])}`);
        console.log(`B:${toHex2(this.reg8[B])} C:${toHex2(this.reg8[C])}`);
        console.log(`D:${toHex2(this.reg8[D])} E:${toHex2(this.reg8[E])}`);
        console.log(`H:${toHex2(this.reg8[H])} L:${toHex2(this.reg8[L])}`);
    }

    printInst(inst) {
        console.log(`Inst: ${toHex2(inst.inst)}`);
        console.log(`src: ${toRegName(inst.src)}`);
        console.log(`dest: ${toRegName(inst.dest)}`);
    }

    // 開始アドレスセット
    setStartAddr(addr) {

    }

    // @param PC 解読開始メモリアドレス 
    //
    // @return {
    //  inst:     // 解読した命令
    //  nInst:      // 命令の長さ（バイト数 - opCodeを含む）
    //  
    //  cycles:     // 実行サイクル数
    //
    // （注）PC' = PC + inst.nInstで次の命令の先頭アドレスになる（ただしinstがジャンプ命令だった場合はこの式は当てはまらない）
    decode(PC) {
        const opCode1 = this.memory[PC];
        const opCode2 = this.memory[PC+1];

        // -----------------------------------
        //  NOP（一番よくある命令なので先頭に持ってきた）
        // -----------------------------------
        if (opCode1 === 0x00) {
            return {
                inst: NOP,
                nInst: 1,
                cycles: 4
            }    
        }
        // -----------------------------------
        //  8bitロードグループ
        // -----------------------------------
        else if ((opCode1 & 0xc0) === 0x40) {
            // LD r1, r2
            const dest = xrct3(opCode1, 3);
            const src = xrct3(opCode1, 0);
            return {
                inst: LD_R_R,
                src,
                dest,
                nInst: 1,
                cycles: 4
            }
        }
        else if ((opCode1 & 0xc7) === 0x06) {
            // LD r, n
            const dest = xrct3(opCode1, 3);
            const arg1 = this.memory[PC+1];
            return {
                inst: LD_R_N,
                src: arg1,
                dest,
                nInst: 2,
                cycles: 7
            }
        }
        else if ((opCode1 & 0xc7) === 0x46) {
            // LD r, (HL)
            const dest = xrct3(opCode1, 3);
            return {
                inst: LD_R_HL,
                dest,
                nInst: 1,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && ((opCode2 & 0xc7) === 0x46)) {
            // LD r, (IX+d)
            const dest = xrct3(opCode2, 3);
            const arg1 = this.memory[PC+2];
            return {
                inst: LD_R_IX,
                d: arg1,
                dest,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && ((opCode2 & 0xc7) === 0x46)) {
            // LD r, (IY+d)
            const dest = xrct3(opCode2, 3);
            const arg1 = this.memory[PC+2];
            return {
                inst: LD_R_IY,
                d: arg1,
                dest,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 & 0xf8) === 0x70) {
            // LD (HL), r
            const src = xrct3(opCode1, 0);
            return {
                inst: LD_HL_R,
                src,
                nInst: 1,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && ((opCode2 & 0xf8) === 0x70)) {
            // LD (IX+d), r
            const src = xrct3(opCode2, 0);
            const arg1 = this.memory[PC+2];
            return {
                inst: LD_IX_R,
                src,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && ((opCode2 & 0xf8) === 0x70)) {
            // LD (IY+d), r
            const src = xrct3(opCode2, 0);
            const arg1 = this.memory[PC+2];
            return {
                inst: LD_IY_R,
                src,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 & 0xf8) === 0x70) {
            // LD (HL), n
            const src = this.memory[PC+1];
            return {
                inst: LD_HL_N,
                src,
                nInst: 2,
                cycles: 10
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x36)) {
            // LD (IX+d), n
            const d = this.memory[PC+2];
            const src = this.memory[PC+3];
            return {
                inst: LD_IX_N,
                d,
                src,
                nInst: 4,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x36)) {
            // LD (IY+d), n
            const d = this.memory[PC+2];
            const src = this.memory[PC+3];
            return {
                inst: LD_IY_N,
                d,
                src,
                nInst: 4,
                cycles: 19
            }
        }
        else if (opCode1 === 0x0a) {
            // LD A, (BC)
            return {
                inst: LD_A_BC,
                nInst: 1,
                cycles: 7
            }
        }
        else if (opCode1 === 0x1a) {
            // LD A, (DE)
            return {
                inst: LD_A_DE,
                nInst: 1,
                cycles: 7
            }
        }
        else if (opCode1 === 0x3a) {
            // LD A, (nn)
            const arg1 = this.memory[PC+1];
            const arg2 = this.memory[PC+2];
            const src = (arg2 << 8) | arg1;
            return {
                inst: LD_A_NN,
                src,
                nInst: 3,
                cycles: 13
            }
        }
        else if (opCode1 === 0x02) {
            // LD (BC), A
            return {
                inst: LD_BC_A,
                nInst: 1,
                cycles: 7
            }
        }
        else if (opCode1 === 0x12) {
            // LD (DE), A
            return {
                inst: LD_DE_A,
                nInst: 1,
                cycles: 7
            }
        }
        else if (opCode1 === 0x32) {
            // LD (nn), A
            const arg1 = this.memory[PC+1];
            const arg2 = this.memory[PC+2];
            const dest = (arg2 << 8) | arg1;
            return {
                inst: LD_NN_A,
                dest,
                nInst: 3,
                cycles: 13
            }
        }
        // -----------------------------------
        // 16bitロードグループ
        // -----------------------------------
        else if ((opCode1 & 0xcf) === 0x01) {
            // LD dd, nn
            const dest = xrct2(opCode1, 4);
            const srcL = this.memory[PC+1];
            const srcH = this.memory[PC+2];
            return {
                inst: LD_dd_NN,
                srcL,
                srcH,
                dest,
                nInst: 3,
                cycles: 10
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x21)) {
            // LD IX, nn
            const arg1 = this.memory[PC+2];
            const arg2 = this.memory[PC+3];
            const src = (arg2 << 8) | arg1;
            return {
                inst: LD_IX_NN,
                src,
                nInst: 4,
                cycles: 14
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x21)) {
            // LD IY, nn
            const arg1 = this.memory[PC+2];
            const arg2 = this.memory[PC+3];
            const src = (arg2 << 8) | arg1;
            return {
                inst: LD_IY_NN,
                src,
                nInst: 4,
                cycles: 14
            }
        }
        else if (opCode1 === 0x2a) {
            // LD HL, (nn)
            const srcL = this.memory[PC+1];
            const srcH = this.memory[PC+2];
            return {
                inst: LD_HL_ADDR,
                srcL,
                srcH,
                nInst: 3,
                cycles: 16
            }
        }
        else if ((opCode1 === 0xed) && ((opCode2 & 0xcf) === 0x4b)) {
            // LD dd, (nn)
            const dest = xrct2(opCode2, 4);
            const arg1 = this.memory[PC+2];
            const arg2 = this.memory[PC+3];
            const src = (arg2 << 8) | arg1;
            return {
                inst: LD_dd_ADDR,
                src,
                dest,
                nInst: 4,
                cycles: 20
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x2a)) {
            // LD IX, (nn)
            const arg1 = this.memory[PC+2];
            const arg2 = this.memory[PC+3];
            const src = (arg2 << 8) | arg1;
            return {
                inst: LD_IX_ADDR,
                src,
                nInst: 4,
                cycles: 20
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x2a)) {
            // LD IY, (nn)
            const arg1 = this.memory[PC+2];
            const arg2 = this.memory[PC+3];
            const src = (arg2 << 8) | arg1;
            return {
                inst: LD_IY_ADDR,
                src,
                nInst: 4,
                cycles: 20
            }
        }
        else if (opCode1 === 0x22) {
            // LD (nn), HL
            const arg1 = this.memory[PC+1];
            const arg2 = this.memory[PC+2];
            const dest = (arg2 << 8) | arg1;
            return {
                inst: LD_ADDR_HL,
                dest,
                nInst: 3,
                cycles: 16
            }
        }
        else if ((opCode1 === 0xed) && ((opCode2 & 0xcf) === 0x43)) {
            // LD (nn), dd
            const src = xrct2(opCode2, 4);
            const arg1 = this.memory[PC+2];
            const arg2 = this.memory[PC+3];
            const dest = (arg2 << 8) | arg1;
            return {
                inst: LD_ADDR_dd,
                src,
                dest,
                nInst: 4,
                cycles: 20
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x22)) {
            // LD (nn), IX
            const arg1 = this.memory[PC+2];
            const arg2 = this.memory[PC+3];
            const dest = (arg2 << 8) | arg1;
            return {
                inst: LD_ADDR_IX,
                dest,
                nInst: 4,
                cycles: 20
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x22)) {
            // LD (nn), IY
            const arg1 = this.memory[PC+2];
            const arg2 = this.memory[PC+3];
            const dest = (arg2 << 8) | arg1;
            return {
                inst: LD_ADDR_IY,
                dest,
                nInst: 4,
                cycles: 20
            }
        }
        else if (opCode1 === 0xf9) {
            // LD SP, HL
            return {
                inst: LD_SP_HL,
                nInst: 1,
                cycles: 6
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0xf9)) {
            // LD SP, IX
            return {
                inst: LD_SP_IX,
                nInst: 2,
                cycles: 10
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0xf9)) {
            // LD SP, IY
            return {
                inst: LD_SP_IY,
                nInst: 2,
                cycles: 10
            }
        }
        else if ((opCode1 & 0xcf) === 0xc5) {
            // PUSH qq
            const src = xrct2(opCode1, 4);
            return {
                inst: PUSH_qq,
                src,
                nInst: 1,
                cycles: 11
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0xe5)) {
            // PUSH IX
            return {
                inst: PUSH_IX,
                nInst: 2,
                cycles: 15
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0xe5)) {
            // PUSH IY
            return {
                inst: PUSH_IY,
                nInst: 2,
                cycles: 15
            }
        }
        else if ((opCode1 & 0xcf) === 0xc1) {
            // POP qq
            const dest = xrct2(opCode1, 4);
            return {
                inst: POP_qq,
                dest,
                nInst: 1,
                cycles: 10
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0xe1)) {
            // POP IX
            return {
                inst: POP_IX,
                nInst: 2,
                cycles: 14
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0xe1)) {
            // POP IY
            return {
                inst: POP_IY,
                nInst: 2,
                cycles: 14
            }
        }
        // -----------------------------------
        // 交換、ブロック転送、サーチグループ
        // -----------------------------------
        else if (opCode1 === 0xeb) {
            // EX DE, HL
            return {
                inst: EX_DE_HL,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0x08) {
            // EX AF, AF'
            return {
                inst: EX_AF_AFdash,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0xd9) {
            // EXX
            return {
                inst: EXX,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0xe3) {
            // EX (SP), HL
            return {
                inst: EX_SP_HL,
                nInst: 1,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0xe3)) {
            // EX (SP), IX
            return {
                inst: EX_SP_IX,
                nInst: 2,
                cycles: 23
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0xe3)) {
            // EX (SP), IY
            return {
                inst: EX_SP_IY,
                nInst: 2,
                cycles: 23
            }
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0xa0)) {
            // LDI
            return {
                inst: LDI,
                nInst: 2,
                cycles: 16
            }
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0xb0)) {
            // LDIR
            return {
                inst: LDIR,
                nInst: 2,
                cycles: 21
            }
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0xa8)) {
            // LDD
            return {
                inst: LDD,
                nInst: 2,
                cycles: 16
            }
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0xb8)) {
            // LDDR
            return {
                inst: LDDR,
                nInst: 2,
                cycles: 21
            }
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0xa1)) {
            // CPI
            return {
                inst: CPI,
                nInst: 2,
                cycles: 16
            }
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0xb1)) {
            // CPIR
            return {
                inst: CPIR,
                nInst: 2,
                cycles: 21
            }
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0xa9)) {
            // CPD
            return {
                inst: CPD,
                nInst: 2,
                cycles: 16
            }
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0xb9)) {
            // CPDR
            return {
                inst: CPDR,
                nInst: 2,
                cycles: 21
            }
        }
        // -----------------------------------
        // 8bit算術、論理演算グループ
        // -----------------------------------
        else if ((opCode1 & 0xf8) === 0x80) {
            // ADD A, r
            const src = xrct3(opCode1, 0);
            return {
                inst: ADD_A_R,
                src,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0xc6) {
            // ADD A, n
            const arg1 = this.memory[PC+1];
            return {
                inst: ADD_A_N,
                src: arg1,
                nInst: 2,
                cycles: 7
            }
        }
        else if (opCode1 === 0x86) {
            // ADD A, (HL)
            return {
                inst: ADD_A_HL,
                nInst: 2,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x86)) {
            // ADD A, (IX+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: ADD_A_IX,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x86)) {
            // ADD A, (IY+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: ADD_A_IY,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 & 0xf8) === 0x88) {
            // ADC A, r
            const src = xrct3(opCode1, 0);
            return {
                inst: ADC_A_R,
                src,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0xce) {
            // ADC A, n
            const arg1 = this.memory[PC+1];
            return {
                inst: ADC_A_N,
                src: arg1,
                nInst: 2,
                cycles: 7
            }
        }
        else if (opCode1 === 0x8e) {
            // ADC A, (HL)
            return {
                inst: ADC_A_HL,
                nInst: 2,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x8e)) {
            // ADC A, (IX+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: ADC_A_IX,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x8e)) {
            // ADC A, (IY+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: ADC_A_IY,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 & 0xf8) === 0x90) {
            // SUB A, r
            const src = xrct3(opCode1, 0);
            return {
                inst: SUB_A_R,
                src,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0xd6) {
            // SUB A, n
            const arg1 = this.memory[PC+1];
            return {
                inst: SUB_A_N,
                src: arg1,
                nInst: 2,
                cycles: 7
            }
        }
        else if (opCode1 === 0x96) {
            // SUB A, (HL)
            return {
                inst: SUB_A_HL,
                nInst: 2,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x96)) {
            // SUB A, (IX+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: SUB_A_IX,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x96)) {
            // SUB A, (IY+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: SUB_A_IY,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 & 0xf8) === 0x98) {
            // SBC A, r
            const src = xrct3(opCode1, 0);
            return {
                inst: SBC_A_R,
                src,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0xde) {
            // SBC A, n
            const arg1 = this.memory[PC+1];
            return {
                inst: SBC_A_N,
                src: arg1,
                nInst: 2,
                cycles: 7
            }
        }
        else if (opCode1 === 0x9e) {
            // SBC A, (HL)
            return {
                inst: SBC_A_HL,
                nInst: 2,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x9e)) {
            // SBC A, (IX+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: SBC_A_IX,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x9e)) {
            // SBC A, (IY+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: SBC_A_IY,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 & 0xf8) === 0xa0) {
            // AND A, r
            const src = xrct3(opCode1, 0);
            return {
                inst: AND_A_R,
                src,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0xe6) {
            // AND A, n
            const arg1 = this.memory[PC+1];
            return {
                inst: AND_A_N,
                src: arg1,
                nInst: 2,
                cycles: 7
            }
        }
        else if (opCode1 === 0xa6) {
            // AND A, (HL)
            return {
                inst: AND_A_HL,
                nInst: 2,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0xa6)) {
            // AND A, (IX+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: AND_A_IX,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0xa6)) {
            // AND A, (IY+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: AND_A_IY,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 & 0xf8) === 0xb0) {
            // OR A, r
            const src = xrct3(opCode1, 0);
            return {
                inst: OR_A_R,
                src,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0xf6) {
            // OR A, n
            const arg1 = this.memory[PC+1];
            return {
                inst: OR_A_N,
                src: arg1,
                nInst: 2,
                cycles: 7
            }
        }
        else if (opCode1 === 0xb6) {
            // OR A, (HL)
            return {
                inst: OR_A_HL,
                nInst: 2,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0xb6)) {
            // OR A, (IX+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: OR_A_IX,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0xb6)) {
            // OR A, (IY+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: OR_A_IY,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 & 0xf8) === 0xa8) {
            // XOR A, r
            const src = xrct3(opCode1, 0);
            return {
                inst: XOR_A_R,
                src,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0xee) {
            // XOR A, n
            const arg1 = this.memory[PC+1];
            return {
                inst: XOR_A_N,
                src: arg1,
                nInst: 2,
                cycles: 7
            }
        }
        else if (opCode1 === 0xae) {
            // XOR A, (HL)
            return {
                inst: XOR_A_HL,
                nInst: 2,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0xae)) {
            // XOR A, (IX+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: XOR_A_IX,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0xae)) {
            // XOR A, (IY+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: XOR_A_IY,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 & 0xf8) === 0xb8) {
            // CP A, r
            const src = xrct3(opCode1, 0);
            return {
                inst: CP_A_R,
                src,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0xfe) {
            // CP A, n
            const arg1 = this.memory[PC+1];
            return {
                inst: CP_A_N,
                src: arg1,
                nInst: 2,
                cycles: 7
            }
        }
        else if (opCode1 === 0xbe) {
            // CP A, (HL)
            return {
                inst: CP_A_HL,
                nInst: 2,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0xbe)) {
            // CP A, (IX+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: CP_A_IX,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0xbe)) {
            // CP A, (IY+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: CP_A_IY,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 & 0xc7) === 0x04) {
            // INC r
            const dest = xrct3(opCode1, 3);
            return {
                inst: INC_R,
                dest,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0x34) {
            // INC (HL)
            return {
                inst: INC_REF_HL,
                nInst: 2,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x34)) {
            // INC (IX+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: INC_REF_IX,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x34)) {
            // INC (IY+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: INC_REF_IY,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 & 0xc7) === 0x05) {
            // DEC r
            const dest = xrct3(opCode1, 3);
            return {
                inst: DEC_R,
                dest,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0x35) {
            // DEC (HL)
            return {
                inst: DEC_REF_HL,
                nInst: 2,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x35)) {
            // DEC (IX+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: DEC_REF_IX,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x35)) {
            // DEC (IY+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: DEC_REF_IY,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        // -----------------------------------
        // 汎用算術演算、CPU制御グループ
        // -----------------------------------
        else if (opCode1 === 0x27) {
            return {
                inst: DAA,
                nInst: 1,
                cycles: 4
            }    
        }
        else if (opCode1 === 0x2f) {
            return {
                inst: CPL,
                nInst: 1,
                cycles: 4
            }    
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0x44)) {
            return {
                inst: NEG,
                nInst: 2,
                cycles: 8
            }    
        }
        else if (opCode1 === 0x3f) {
            return {
                inst: CCF,
                nInst: 1,
                cycles: 4
            }    
        }
        else if (opCode1 === 0x37) {
            return {
                inst: SCF,
                nInst: 1,
                cycles: 4
            }    
        }
        else if (opCode1 === 0x76) {
            return {
                inst: HALT,
                nInst: 1,
                cycles: 4
            }    
        }
        else if (opCode1 === 0xf3) {
            return {
                inst: DI,
                nInst: 1,
                cycles: 4
            }    
        }
        else if (opCode1 === 0xfb) {
            return {
                inst: EI,
                nInst: 1,
                cycles: 4
            }    
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0x46)) {
            return {
                inst: IM0,
                nInst: 2,
                cycles: 8
            }    
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0x56)) {
            return {
                inst: IM1,
                nInst: 2,
                cycles: 8
            }    
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0x5e)) {
            return {
                inst: IM2,
                nInst: 2,
                cycles: 8
            }    
        }
        // -----------------------------------
        // 16bit算術演算グループ
        // -----------------------------------
        else if ((opCode1 & 0xcf) === 0x09) {
            const src = xrct2(opCode1, 4);
            return {
                inst: ADD_HL_ss,
                src,
                nInst: 1,
                cycles: 11
            }
        }
        else if ((opCode1 === 0xed) && ((opCode2 & 0xcf) === 0x4a)) {
            const ss = xrct2(opCode2, 4);
            return {
                inst: ADC_HL_ss,
                ss,
                nInst: 2,
                cycles: 15
            }
        }
        else if ((opCode1 === 0xed) && ((opCode2 & 0xcf) === 0x42)) {
            const ss = xrct2(opCode2, 4);
            return {
                inst: SBC_HL_ss,
                ss,
                nInst: 2,
                cycles: 15
            }
        }
        else if ((opCode1 === 0xdd) && ((opCode2 & 0xcf) === 0x09)) {
            const pp = xrct2(opCode2, 4);
            return {
                inst: ADD_IX_pp,
                pp,
                nInst: 2,
                cycles: 15
            }
        }
        else if ((opCode1 === 0xfd) && ((opCode2 & 0xcf) === 0x09)) {
            const rr = xrct2(opCode2, 4);
            return {
                inst: ADD_IY_rr,
                rr,
                nInst: 2,
                cycles: 15
            }
        }
        else if ((opCode1 & 0xcf) === 0x03) {
            const ss = xrct2(opCode1, 4);
            return {
                inst: INC_ss,
                ss,
                nInst: 1,
                cycles: 6
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x23)) {
            return {
                inst: INC_IX,
                nInst: 2,
                cycles: 10
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x23)) {
            return {
                inst: INC_IY,
                nInst: 2,
                cycles: 10
            }
        }
        else if ((opCode1 & 0xcf) === 0x0b) {
            const ss = xrct2(opCode1, 4);
            return {
                inst: DEC_ss,
                ss,
                nInst: 1,
                cycles: 6
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x2b)) {
            return {
                inst: DEC_IX,
                nInst: 2,
                cycles: 10
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x2b)) {
            return {
                inst: DEC_IY,
                nInst: 2,
                cycles: 10
            }
        }
        // -----------------------------------
        // ジャンプグループ
        // -----------------------------------
        else if (opCode1 === 0xc3) {
            // JP nn
            const arg1 = this.memory[PC+1];
            const arg2 = this.memory[PC+2];
            const nn = (arg2 << 8) | arg1;
            return {
                inst: JP,
                nn,
                nInst: 3,
                cycles: 10
            }
        }
        else if ((opCode1 & 0xc7) === 0xc2) {
            // JP cc, nn
            const cc = xrct3(opCode1, 3);
            const arg1 = this.memory[PC+1];
            const arg2 = this.memory[PC+2];
            const nn = (arg2 << 8) | arg1;
            return {
                inst: JP_cc,
                cc,
                nn,
                nInst: 3,
                cycles: 10
            }
        }
        else if (opCode1 === 0x18) {
            // JR e
            const e_2 = this.memory[PC+1];
            return {
                inst: JR,
                e_2,
                nInst: 2,
                cycles: 12
            }
        }
        else if (opCode1 === 0x38) {
            // JR C, e
            const e_2 = this.memory[PC+1];
            return {
                inst: JR_C,
                e_2,
                nInst: 2,
                cycles: 12
            }
        }
        else if (opCode1 === 0x30) {
            // JR NC, e
            const e_2 = this.memory[PC+1];
            return {
                inst: JR_NC,
                e_2,
                nInst: 2,
                cycles: 12
            }
        }
        else if (opCode1 === 0x28) {
            // JR Z, e
            const e_2 = this.memory[PC+1];
            return {
                inst: JR_Z,
                e_2,
                nInst: 2,
                cycles: 12
            }
        }
        else if (opCode1 === 0x20) {
            // JR NZ, e
            const e_2 = this.memory[PC+1];
            return {
                inst: JR_NZ,
                e_2,
                nInst: 2,
                cycles: 12
            }
        }
        else if (opCode1 === 0xe9) {
            // JP (HL)
            return {
                inst: JP_HL,
                nInst: 1,
                cycles: 4
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0xe9)) {
            // JP (IX)
            return {
                inst: JP_IX,
                nInst: 2,
                cycles: 8
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0xe9)) {
            // JP (IY)
            return {
                inst: JP_IY,
                nInst: 2,
                cycles: 8
            }
        }
        else if (opCode1 === 0x10) {
            // DJNZ
            const e_2 = this.memory[PC+1];
            return {
                inst: DJNZ,
                e_2,
                nInst: 2,
                cycles: 13
            }
        }
        // -----------------------------------
        // コール、リターングループ
        // -----------------------------------
        else if (opCode1 === 0xcd) {
            // CALL
            const arg1 = this.memory[PC+1];
            const arg2 = this.memory[PC+2];
            const nn = (arg2 << 8) | arg1;
            return {
                inst: CALL,
                nn,
                nInst: 3,
                cycles: 17
            }
        }
        else if ((opCode1 & 0xc7) === 0xc4) {
            // CALL cc, nn
            const cc = xrct3(opCode1, 3);
            const arg1 = this.memory[PC+1];
            const arg2 = this.memory[PC+2];
            const nn = (arg2 << 8) | arg1;
            return {
                inst: CALL_cc,
                cc,
                nn,
                nInst: 3,
                cycles: 17
            }
        }
        else if (opCode1 === 0xc9) {
            // RET
            return {
                inst: RET,
                nInst: 1,
                cycles: 10
            }
        }
        else if ((opCode1 & 0xc7) === 0xc0) {
            // RET cc
            const cc = xrct3(opCode1, 3);
            return {
                inst: RET_cc,
                cc,
                nInst: 1,
                cycles: 11
            }
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0x4d)) {
            // RETI
            return {
                inst: RETI,
                nInst: 2,
                cycles: 14
            }
        }
        else if ((opCode1 === 0xed) && (opCode2 === 0x45)) {
            // RETN
            return {
                inst: RETN,
                nInst: 2,
                cycles: 14
            }
        }
        else if ((opCode1 & 0xc7) === 0xc7) {
            // RST p
            const p = xrct3(opCode1, 3);
            return {
                inst: RST,
                p,
                nInst: 1,
                cycles: 11
            }
        }

        // -----------------------------------
        // ローテイト、シフトグループ
        // -----------------------------------

        // -----------------------------------
        // ビット操作グループ
        // -----------------------------------
    }

    // 1命令実行
    //
    // @param inst 解読した命令セット
    //
    // 副作用：
    // レジスタの内容が変更される．
    execOneStep() {
        const decodedInst = decode(this.PC);
        switch (decodedInst.inst) {
            case LD_R_R: {
                this.do_LD_R_R(inst);
            }
            case LD_R_N: {
                this.do_LD_R_N(inst);
            }
            case LD_R_HL: {
                this.do_LD_R_HL(inst);
            }
            case LD_R_IX: {
                this.do_LD_R_IX(inst);
            }
            case LD_R_IY: {
                this.do_LD_R_IY(inst);
            }
            case LD_HL_R: {
                this.do_LD_HL_R(inst);
            }
            case LD_IX_R: {
                this.do_LD_IX_R(inst);
            }
            case LD_IY_R: {
                this.do_LD_IY_R(inst);
            }
            case LD_HL_N: {
                this.do_LD_HL_N(inst);
            }
            case LD_IX_N: {
                this.do_LD_IX_N(inst);
            }
            case LD_IY_N: {
                this.do_LD_IY_N(inst);
            }
            case LD_A_BC: {
                this.do_LD_A_BC(inst);
            }
            case LD_A_DE: {
                this.do_LD_A_DE(inst);
            }
            case LD_A_NN: {
                this.do_LD_A_NN(inst);
            }
            case LD_BC_A: {
                this.do_LD_BC_A(inst);
            }
            case LD_DE_A: {
                this.do_LD_DE_A(inst);
            }
            case LD_NN_A: {
                this.do_LD_NN_A(inst);
            }
            case NOP: {
                this.do_NOP(inst);
                break;
            }
            case JP: {
                this.do_JP(inst);
            }
        }
        waitCycles(decodedInst.cycles);
        return;
    }

    // -------------------------------
    //  Helper Methods
    // -------------------------------
    getBC() {
        return (this.reg8[B] << 8) | this.reg8[C];
    }

    getDE() {
        return (this.reg8[D] << 8) | this.reg8[E];
    }

    getHL() {
        return (this.reg8[H] << 8) | this.reg8[L];
    }

    setHL(val16) {
        this.reg8[H] = (val16 >> 8) & 0xff;
        this.reg8[L] = val16 & 0xff;
    }

    // 16bitレジスタの値を得る
    //
    // @param ss レジスタペアを表すビットパターン
    // 00 = BC
    // 01 = DE
    // 10 = HL
    // 11 = SP (regType === 0のとき)
    // 11 = AF (regType !== 0のとき)
    //
    // @param regType .. ssの表すレジスタのタイプ
    // regType === 0 ---> ss=11をSPとみなす
    // regType !== 0 ---> ss=11をAFとみなす
    getReg16(ss, regType) {
        let val16 = 0;
        switch (ss) {
            case 0: {
                val16 = (this.reg[B] << 8) | this.reg[C];
                break;
            }
            case 1: {
                val16 = (this.reg[D] << 8) | this.reg[E];
                break;
            }
            case 2: {
                val16 = (this.reg[H] << 8) | this.reg[L];
                break;
            }
            case 3: {
                if (regType === 0) {
                    // SP
                    val16 = this.SP;
                } else {
                    // AF
                    val16 = (this.reg[A] << 8) | this.FLG;
                }
                break;
            }            
        }
        return val16;
    }

    // 16bitレジスタに値をセット
    //
    // @param ss レジスタペアを表すビットパターン
    // 00 = BC
    // 01 = DE
    // 10 = HL
    // 11 = SP (regType === 0のとき)
    // 11 = AF (regType !== 0のとき)
    //
    // @param regType .. ssの表すレジスタのタイプ
    // regType === 0 ---> ss=11をSPとみなす
    // regType !== 0 ---> ss=11をAFとみなす
    //
    // @param val16 destにセットする16bitの値
    setReg16(ss, regType, val16) {
        const valH = (val16 >> 8) & 0xff;
        const valL = val & 0xff;
        this.loadToReg16(ss, valH, valL, regType);
    }

    // 16bitレジスタへ値をセット
    //
    // @param dest .. 代入先のレジスタを表すビットパターン
    // 00 = BC
    // 01 = DE
    // 10 = HL
    // 11 = SP (regType === 0のとき)
    // 11 = AF (regType !== 0のとき)
    // @param srcH .. 上位バイト
    // @param srcH .. 下位バイト
    // @param regType .. destの表すレジスタのタイプ
    // regType === 0 ---> dest=11をSPとみなす
    // regType !== 0 ---> dest=11をAFとみなす
    loadToReg16(dest, srcH, srcL, regType) {
        switch (dest) {
            case 0: {   // BC
                this.reg[B] = srcH;
                this.reg[C] = srcL;
                break;
            }
            case 1: {   // DE
                this.reg[D] = srcH;
                this.reg[E] = srcL;
                break;
            }
            case 2: {   // HL
                this.reg[H] = srcH;
                this.reg[L] = srcL;
                break;
            }
            case 3: { 
                if (regType === 0) {
                    // SP
                    this.SP = (srcH << 8) | srcL;
                } else {
                    // AF
                    this.reg[A] = srcH;
                    this.FLG = srcL;
                }
                break;
            }
        }    
    }

    // 16bitレジスタからメモリへ値をセット
    //
    // @param src .. 代入元のレジスタを表すビットパターン
    // 00 = BC
    // 01 = DE
    // 10 = HL
    // 11 = SP (regType === 0のとき)
    // 11 = AF (regType !== 0のとき)
    // @param dest .. ストア先のメモリのアドレス
    // @param regType .. srcの表すレジスタのタイプ
    // regType === 0 ---> src=11をSPとみなす
    // regType !== 0 ---> src=11をAFとみなす
    saveFromReg16(src, dest, regType) {
        let valueL = 0;
        let valueH = 0;
        switch (src) {
            case 0: {   // BC
                valueH = this.reg[B];
                valueL = this.reg[C];
                break;
            }
            case 1: {   // DE
                valueH = this.reg[D];
                valueL = this.reg[E];
                break;
            }
            case 2: {   // HL
                valueH = this.reg[H];
                valueL = this.reg[L];
                break;
            }
            case 3: {
                if (regType === 0) {
                    // SP
                    valueH = ((this.SP & 0xff00) >> 8);
                    valueL = (this.SP & 0xff);
                } else {
                    // AF
                    valueH = this.reg[A];
                    valueL = this.FLG;
                }
                break;
            }
            default:
                return;
        }
        this.memory[dest] = valueL;
        this.memory[dest+1] = valueH;
    }

    // ------------------------------------
    //  フラグ操作
    // ------------------------------------

    // --------------------------------
    // C: キャリーフラグ
    // @param bEnable : trueでフラグセット, falseでフラグクリア
    setCF(bEnable) {
        // CF(キャリーフラグ)は0bit目
        if (bEnable) {
            this.FLG = this.FLG | 0x01;
        } else {
            this.FLG = this.FLG & 0xfe;
        }
    }

    // Cフラグの状態を調べる
    // setされていればtrue, そうでなければfalseを返す
    testCF() {
        return (this.FLG & 0x01) === 0 ? false : true;
    }

    // キャリーフラグがsetされていれば1, そうでなければ0を返す
    getCF() {
        return (this.testCF()) ? 1 : 0;
    }

    // --------------------------------
    // N: 加・減算フラグ
    // @param bEnable : trueでフラグセット, falseでフラグクリア
    setNF(bEnable) {
        // NFは1bit目
        if (bEnable) {
            this.FLG = this.FLG | 0x02;
        } else {
            this.FLG = this.FLG & 0xfd;
        }
    }

    // Nフラグの状態を調べる
    // setされていればtrue, そうでなければfalseを返す
    testNF() {
        return (this.FLG & 0x02) === 0 ? false : true;
    }

    // --------------------------------
    // P/V: パリティ/オーバーフローフラグ
    // @param bEnable : trueでフラグセット, falseでフラグクリア
    setPVF(bEnable) {
        // PFは2bit目
        if (bEnable) {
            this.FLG = this.FLG | 0x04;
        } else {
            this.FLG = this.FLG & 0xfb;
        }
    }

    // P/Vフラグの状態を調べる
    // setされていればtrue, そうでなければfalseを返す
    testPVF() {
        return (this.FLG & 0x04) === 0 ? false : true;
    }

    // --------------------------------
    // H: ハーフキャリーフラグ
    // @param bEnable : trueでフラグセット, falseでフラグクリア
    setHF(bEnable) {
        // HFは4bit目
        if (bEnable) {
            this.FLG = this.FLG | 0x10;
        } else {
            this.FLG = this.FLG & 0xef;
        }
    }

    // Hフラグの状態を調べる
    // setされていればtrue, そうでなければfalseを返す
    testHF() {
        return (this.FLG & 0x10) === 0 ? false : true;
    }

    // --------------------------------
    // Z: ゼロフラグ
    // @param bEnable : trueでフラグセット, falseでフラグクリア
    setZF(bEnable) {
        // ZFは6bit目
        if (bEnable) {
            this.FLG = this.FLG | 0x40;
        } else {
            this.FLG = this.FLG & 0xbf;
        }
    }

    // Zフラグの状態を調べる
    // setされていればtrue, そうでなければfalseを返す
    testZF() {
        return (this.FLG & 0x40) === 0 ? false : true;
    }

    // --------------------------------
    // S: サインフラグ
    // @param bEnable : trueでフラグセット, falseでフラグクリア
    setSF(bEnable) {
        // SFは7bit目
        if (bEnable) {
            this.FLG = this.FLG | 0x80;
        } else {
            this.FLG = this.FLG & 0x7f;
        }
    }

    // Sフラグの状態を調べる
    // setされていればtrue, そうでなければfalseを返す
    testSF() {
        return (this.FLG & 0x80) === 0 ? false : true;
    }

    // @param cc 条件ジャンプ・コール用のビットパターン
    // 000 = NZ
    // 001 = Z
    // 010 = NC
    // 011 = C
    // 100 = PO (Parity Odd)
    // 101 = PE (Parity Even)
    // 110 = Plus
    // 111 = Minus
    testCC(cc) {
        switch (cc) {
            case 0: {
                return !self.testZF();
            }
            case 1: {
                return self.testZF();
            }
            case 2: {
                return !self.testCF();
            }
            case 3: {
                return self.testCF();
            }
            case 4: {
                // TODO
                return true;
            }
            case 5: {
                // TODO
                return true;
            }
            case 6: {
                // SF=falseなら正
                return !self.testSF();
            }
            case 7: {
                // SF=trueなら負
                return self.testSF();
            }
        }
        return false;
    }

    // ============================================
    // 各命令の実行
    // ============================================

    // -----------------------------------
    // 8bitロードグループ
    // -----------------------------------
    do_LD_R_R(inst) {
        const src = inst.src;
        const dest = inst.dest;
        this.reg8[dest] = this.reg8[src];
    }

    do_LD_R_N(inst) {
        const src = inst.src;
        const dest = inst.dest;
        this.reg8[dest] = src;
    }

    do_LD_R_HL(inst) {
        const dest = inst.dest;
        const srcAddr = this.getHL();
        this.reg8[dest] = this.memory[srcAddr];
    }

    do_LD_R_IX(inst) {
        const dest = inst.dest;
        const srcAddr = this.IX + inst.d;
        this.reg8[dest] = this.memory[srcAddr];
    }
    
    do_LD_R_IY(inst) {
        const dest = inst.dest;
        const srcAddr = this.IY + inst.d;
        this.reg8[dest] = this.memory[srcAddr];        
    }

    do_LD_HL_R(inst) {
        const src = inst.src;
        const destAddr = this.getHL();
        this.memory[destAddr] = src;
    }

    do_LD_IX_R(inst) {
        const src = inst.src;
        const destAddr = this.IX + inst.d;
        this.memory[destAddr] = src;
    }

    do_LD_IY_R(inst) {
        const src = inst.src;
        const destAddr = this.IY + inst.d;
        this.memory[destAddr] = src;
    }

    do_LD_HL_N(inst) {
        const src = inst.src;
        const destAddr = this.getHL();
        this.memory[destAddr] = src;
    }

    do_LD_IX_N(inst) {
        const src = inst.src;
        const destAddr = this.IX + inst.d;
        this.memory[destAddr] = src;
    }

    do_LD_IY_N(inst) {
        const src = inst.src;
        const destAddr = this.IY + inst.d;
        this.memory[destAddr] = src;
    }

    do_LD_A_BC(inst) {
        const srcAddr = this.getBC();
        this.reg8[A] = this.memory[srcAddr];
    }

    do_LD_A_DE(inst) {
        const srcAddr = this.getDE();
        this.reg8[A] = this.memory[srcAddr];
    }

    do_LD_A_NN(inst) {
        const srcAddr = inst.src;
        this.reg8[A] = this.memory[srcAddr];
    }

    do_LD_BC_A(inst) {
        const destAddr = this.getBC();
        this.memory[srcAddr] = this.reg8[A];
    }

    do_LD_DE_A(inst) {
        const destAddr = this.getDE();
        this.memory[srcAddr] = this.reg8[A];
    }

    do_LD_NN_A(inst) {
        const destAddr = inst.dest;
        this.memory[srcAddr] = this.reg8[A];
    }

    // -----------------------------------
    // 16bitロードグループ
    // -----------------------------------
    do_LD_dd_NN(inst) {
        this.loadToReg16(inst.dest, inst.srcH, inst.srcL, 0);
    }

    do_LD_IX_NN(inst) {
        this.IX = inst.src;
    }

    do_LD_IY_NN(inst) {
        this.IY = inst.src;
    }

    do_LD_HL_ADDR(inst) {
        this.loadToReg16(HL, inst.srcH, inst.srcL, 0);
    }

    do_LD_dd_ADDR(inst) {
        const addr = inst.src;
        const srcL = this.memory[addr];
        const srcH = this.memory[addr+1];
        this.loadToReg16(inst.dest, srcH, srcL, 0);
    }

    do_LD_IX_ADDR(inst) {
        const addr = inst.src;
        const srcL = this.memory[addr];
        const srcH = this.memory[addr+1];
        this.IX = (srcH << 8) | srcL;
    }

    do_LD_IY_ADDR(inst) {
        const addr = inst.src;
        const srcL = this.memory[addr];
        const srcH = this.memory[addr+1];
        this.IY = (srcH << 8) | srcL;
    }

    do_LD_ADDR_HL(inst) {
        this.saveFromReg16(HL, inst.dest, 0);
    }

    do_LD_ADDR_dd(inst) {
        this.saveFromReg16(inst.src, inst.dest, 0);
    }

    do_LD_ADDR_IX(inst) {
        this.memory[inst.dest] = (this.IX & 0xff);
        this.memory[inst.dest+1] = ((this.IX & 0xff00) >> 8);
    }

    do_LD_ADDR_IY(inst) {
        this.memory[inst.dest] = (this.IY & 0xff);
        this.memory[inst.dest+1] = ((this.IY & 0xff00) >> 8);
    }

    do_LD_SP_HL(inst) {
        this.SP = (this.reg8[H] << 8) | this.reg[L];
    }

    do_LD_SP_IX(inst) {
        this.SP = this.IX;
    }

    do_LD_SP_IY(inst) {
        this.SP = this.IY;
    }

    do_PUSH_qq(inst) {
        if (this.SP >= 2) {
            this.SP = this.SP - 2;
            this.saveFromReg16(inst.src, this.SP, 1);
        } else {
            // error
            throw "stack underflow";
        }
    }

    do_PUSH_IX(inst) {
        if (this.SP >= 2) {
            this.SP = this.SP - 2;
            this.memory[this.SP] = (this.IX & 0xff);
            this.memory[this.SP+1] = ((this.IX & 0xff00) >> 8);
        } else {
            // error
            throw "stack underflow";
        }
    }

    do_PUSH_IY(inst) {
        if (this.SP >= 2) {
            this.SP = this.SP - 2;
            this.memory[this.SP] = (this.IY & 0xff);
            this.memory[this.SP+1] = ((this.IY & 0xff00) >> 8);
        } else {
            // error
            throw "stack underflow";
        }
    }

    // 命令にはないが、CALL系命令で使うので用意しておく
    // （ヘルパーメソッド的）
    do_PUSH_PC(inst) {
        if (this.SP >= 2) {
            this.SP = this.SP - 2;
            this.memory[this.SP] = (this.PC & 0xff);
            this.memory[this.SP+1] = ((this.PC & 0xff00) >> 8);
        } else {
            // error
            throw "stack underflow";
        }
    }

    do_POP_qq(inst) {
        if (this.SP <= 0xfffe) {
            const srcL = this.memory[this.SP];
            const srcH = this.memory[this.SP+1];
            this.loadToReg16(inst.dest, srcH, srcL, 1);
            this.SP = this.SP + 2;
        } else {
            // error
            throw "stack overflow";
        }
    }

    do_POP_IX(inst) {
        if (this.SP <= 0xfffe) {
            const srcL = this.memory[this.SP];
            const srcH = this.memory[this.SP+1];
            this.IX = (srcH << 8) | srcL;
            this.SP = this.SP + 2;
        } else {
            // error
            throw "stack overflow";
        }
    }

    do_POP_IY(inst) {
        if (this.SP <= 0xfffe) {
            const srcL = this.memory[this.SP];
            const srcH = this.memory[this.SP+1];
            this.IY = (srcH << 8) | srcL;
            this.SP = this.SP + 2;
        } else {
            // error
            throw "stack overflow";
        }
    }

    // 命令にはないが、RET系命令で使うので用意しておく
    // （ヘルパーメソッド的）
    do_POP_PC(inst) {
        if (this.SP <= 0xfffe) {
            const srcL = this.memory[this.SP];
            const srcH = this.memory[this.SP+1];
            this.PC = (srcH << 8) | srcL;
            this.SP = this.SP + 2;
        } else {
            // error
            throw "stack overflow";
        }
    }

    // -----------------------------------
    // 8bit算術、論理演算グループ
    // -----------------------------------

    // 8bit算術演算の結果をフラグに反映
    updateFLG(result) {
        // キャリーフラグ
        this.setCF(result >= 0x100);

        // ゼロフラグ
        this.setZF(result === 0);

        // サインフラグ
        // 結果が負ならばセット．そうでなければリセット
        this.setSF((result & 0x80) !== 0);

        // TODO
        // まだフラグの反映コードは不十分

        // ハーフキャリーフラグ
        // bit3からのキャリーがあればセット．そうでなければリセット

        // P/V（パリティ・オーバーフロー）フラグ
        // 
    }

    // 16bit算術演算の結果をフラグに反映(1)
    // ADD HL, ss
    // ADD IX, pp
    // ADD IY, rr
    // の3つの命令用
    updateFLG16_ADD(result) {
        // キャリーフラグ
        this.setCF(result >= 0x10000);

        // S, Z, Nフラグは変化なし

        // TODO
        // まだフラグの反映コードは不十分

        // ハーフキャリーフラグ
        // bit11からのキャリーがあればセット．そうでなければリセット
    }

    // 16bit算術演算の結果をフラグに反映(2)
    // ADC HL, ss
    // 専用
    updateFLG16_ADC(result) {
        // キャリーフラグ
        this.setCF(result >= 0x10000);

        // Sフラグ
        this.setSF(result < 0);

        // Zフラグ
        this.setZF(result === 0);

        // Nフラグ
        this.setNF(false);

        // TODO
        // まだフラグの反映コードは不十分

        // ハーフキャリーフラグ
        // bit11からのキャリーがあればセット．そうでなければリセット
    }

    // 16bit算術演算の結果をフラグに反映(2)
    // SBC HL, ss
    // 専用
    updateFLG16_SBC(result) {
        // Sフラグ
        this.setSF(result < 0);

        // Zフラグ
        this.setZF(result === 0);

        // Nフラグ
        this.setNF(true);

        // TODO
        // まだフラグの反映コードは不十分

        // キャリーフラグ
        // ボローがあればセット、そうでなければリセット

        // ハーフキャリーフラグ
        // bit11からのキャリーがあればセット．そうでなければリセット
    }

    do_ADD_A_R(inst) {
        const restmp = this.reg[A] + this.reg[inst.src];
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_ADD_A_N(inst) {
        this.do_ADD_A_R(inst);
    }

    do_ADD_A_REF(addr) {
        const restmp = (this.reg[A] + this.memory[addr]);
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_ADD_A_HL(inst) {
        this.do_ADD_A_REF(this.getHL());
    }

    do_ADD_A_IX(inst) {
        this.do_ADD_A_REF(this.IX + inst.d);  // TODO (overflowチェック)
    }

    do_ADD_A_IY(inst) {
        this.do_ADD_A_REF(this.IY + inst.d);  // TODO (overflowチェック)
    }

    do_ADC_A_R(inst) {
        const restmp = (this.reg[A] + this.reg[inst.src]) + this.getCF();
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_ADC_A_NN(inst) {
        this.do_ADC_R(inst);
    }

    do_ADC_A_REF(addr) {
        const restmp = (this.reg[A] + this.memory[addr]) + this.getCF();
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_ADC_A_HL(inst) {
        this.do_ADC_A_REF(this.getHL());
    }

    do_ADC_A_IX(inst) {
        this.do_ADC_A_REF(this.IX + inst.d);  // TODO (overflowチェック)
    }

    do_ADC_A_IY(inst) {
        this.do_ADC_A_REF(this.IY + inst.d);  // TODO (overflowチェック)
    }

    do_SUB_A_R(inst) {
        const restmp = this.reg[A] - this.reg[inst.src];
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_SUB_A_N(inst) {
        this.do_SUB_A_R(inst);
    }

    do_SUB_A_REF(addr) {
        const restmp = (this.reg[A] - this.memory[addr]);
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_SUB_A_HL(inst) {
        this.do_SUB_A_REF(this.getHL());
    }

    do_SUB_A_IX(inst) {
        this.do_SUB_A_REF(this.IX + inst.d);  // TODO (overflowチェック)
    }

    do_SUB_A_IY(inst) {
        this.do_SUB_A_REF(this.IY + inst.d);  // TODO (overflowチェック)
    }

    do_SBC_A_R(inst) {
        const restmp = this.reg[A] - this.reg[inst.src] - this.getCF();
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_SBC_A_N(inst) {
        this.do_SBC_A_R(inst);
    }

    do_SBC_A_REF(addr) {
        const restmp = (this.reg[A] - this.memory[addr]) - this.getCF();
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_SBC_A_HL(inst) {
        this.do_SBC_A_REF(this.getHL());
    }

    do_SBC_A_IX(inst) {
        this.do_SBC_A_REF(this.IX + inst.d);  // TODO (overflowチェック)
    }

    do_SBC_A_IY(inst) {
        this.do_SBC_A_REF(this.IY + inst.d);  // TODO (overflowチェック)
    }

    do_AND_A_R(inst) {
        const restmp = this.reg[A] & this.reg[inst.src];
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_AND_A_N(inst) {
        this.do_AND_A_R(inst);
    }

    do_AND_A_REF(addr) {
        const restmp = (this.reg[A] & this.memory[addr]);
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_AND_A_HL(inst) {
        this.do_AND_A_REF(this.getHL());
    }

    do_AND_A_IX(inst) {
        this.do_AND_A_REF(this.IX + inst.d);  // TODO (overflowチェック)
    }

    do_AND_A_IY(inst) {
        this.do_AND_A_REF(this.IY + inst.d);  // TODO (overflowチェック)
    }

    do_OR_A_R(inst) {
        const restmp = this.reg[A] | this.reg[inst.src];
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_OR_A_N(inst) {
        this.do_OR_A_R(inst);
    }

    do_OR_A_REF(addr) {
        const restmp = (this.reg[A] | this.memory[addr]);
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_OR_A_HL(inst) {
        this.do_OR_A_REF(this.getHL());
    }

    do_OR_A_IX(inst) {
        this.do_OR_A_REF(this.IX + inst.d);  // TODO (overflowチェック)
    }

    do_OR_A_IY(inst) {
        this.do_OR_A_REF(this.IY + inst.d);  // TODO (overflowチェック)
    }

    do_XOR_A_R(inst) {
        const restmp = this.reg[A] ^ this.reg[inst.src];
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_XOR_A_N(inst) {
        this.do_XOR_A_R(inst);
    }

    do_XOR_A_REF(addr) {
        const restmp = (this.reg[A] ^ this.memory[addr]);
        this.updateFLG(restmp);
        this.reg[A] = restmp & 0xff;
    }

    do_XOR_A_HL(inst) {
        this.do_XOR_A_REF(this.getHL());
    }

    do_XOR_A_IX(inst) {
        this.do_XOR_A_REF(this.IX + inst.d);  // TODO (overflowチェック)
    }

    do_XOR_A_IY(inst) {
        this.do_XOR_A_REF(this.IY + inst.d);  // TODO (overflowチェック)
    }

    do_CP_A_R(inst) {
        const restmp = this.reg[A] - this.reg[inst.src];
        this.updateFLG(restmp);
    }

    do_CP_A_N(inst) {
        this.do_CP_A_R(inst);
    }

    do_CP_REF(addr) {
        const restmp = (this.reg[A] - this.memory[addr]);
        this.updateFLG(restmp);
    }

    do_CP_A_HL(inst) {
        this.do_CP_REF(this.getHL());
    }

    do_CP_A_IX(inst) {
        this.do_CP_REF(this.IX + inst.d);  // TODO (overflowチェック)
    }

    do_CP_A_IY(inst) {
        this.do_CP_REF(this.IY + inst.d);  // TODO (overflowチェック)
    }

    do_INC_R(inst) {
        const restmp = this.reg[inst.dest] + 1;
        this.updateFLG(restmp);
        this.reg[inst.dest] = restmp & 0xff;
    }

    do_INC_REF(addr) {
        const restmp = this.memory[addr] + 1;
        this.updateFLG(restmp);
        this.memory[addr] = restmp & 0xff;
    }

    do_INC_REF_HL(inst) {
        this.do_INC_REF(this.getHL());
    }

    do_INC_REF_IX(inst) {
        this.do_INC_REF(this.IX + inst.d);  // TODO (overflowチェック)
    }

    do_INC_REF_IY(inst) {
        this.do_INC_REF(this.IY + inst.d);  // TODO (overflowチェック)
    }

    do_DEC_R(inst) {
        const restmp = this.reg[inst.dest] - 1;
        this.updateFLG(restmp);
        this.reg[dest] = restmp & 0xff;
    }

    do_DEC_REF(addr) {
        const restmp = this.memory[addr] - 1;
        this.updateFLG(restmp);
        this.memory[addr] = restmp & 0xff;
    }

    do_DEC_REF_HL(inst) {
        this.do_DEC_REF(this.getHL());
    }

    do_DEC_REF_IX(inst) {
        this.do_DEC_REF(this.IX + inst.d);  // TODO (overflowチェック)
    }

    do_DEC_REF_IY(inst) {
        this.do_DEC_REF(this.IY + inst.d);  // TODO (overflowチェック)
    }

    // -----------------------------------
    // 汎用算術演算、CPU制御グループ
    // -----------------------------------

    // -----------------------------------
    // 16bit算術演算グループ
    // -----------------------------------
    do_ADD_HL_ss(inst) {
        const src = this.getReg16(inst.src, 0);
        const dest = this.getHL();
        const restmp = dest + src;
        this.updateFLG16_ADD(restmp);
        this.setHL(restmp & 0xffff);
    }

    do_ADC_HL_ss(inst) {
        const src = this.getReg16(inst.src, 0);
        const dest = this.getHL();
        const restmp = dest + src + this.getCF();
        this.updateFLG16_ADC(restmp);
        this.setHL(restmp & 0xffff);        
    }

    do_SBC_HL_ss(inst) {
        const src = this.getReg16(inst.src, 0);
        const dest = this.getHL();
        const restmp = dest - src - this.getCF();
        this.updateFLG16_SBC(restmp);
        this.setHL(restmp & 0xffff);
    }

    do_ADD_IX_pp(inst) {
        const src = this.getReg16(inst.src, 0);
        const dest = this.IX;
        const restmp = dest + src;
        this.updateFLG16_ADD(restmp);
        this.IX = restmp & 0xffff;
    }

    do_ADD_IY_rr(inst) {
        const src = this.getReg16(inst.src, 0);
        const dest = this.IY;
        const restmp = dest + src;
        this.updateFLG16_ADD(restmp);
        this.IY = restmp & 0xffff;        
    }

    do_INC_ss(inst) {
        const val16 = (this.getReg16(inst.ss, 0) + 1) & 0xffff;
        this.setReg16(inst.ss, 0, val16);
    }

    do_INC_IX(inst) {
        this.IX = (this.IX + 1) & 0xffff;
    }

    do_INC_IY(inst) {
        this.IY = (this.IY + 1) & 0xffff;
    }

    do_DEC_ss(inst) {
        const val16 = (this.getReg16(inst.ss, 0) - 1) & 0xffff;
        this.setReg16(inst.ss, 0, val16);
    }

    do_DEC_IX(inst) {
        this.IX = (this.IX - 1) & 0xffff;
    }

    do_DEC_IY(inst) {
        this.IY = (this.IY - 1) & 0xffff;
    }

    // -----------------------------------
    // ジャンプグループ
    // -----------------------------------

    do_JP(inst) {
        this.PC = inst.nn;
    }

    do_JP_cc(inst) {
        const cc = inst.cc;
        if (self.testCC(cc)) {
            this.PC = inst.nn;
        }
    }

    do_JR_e(inst) {
        // ジャンプ元のアドレス
        const srcAddr = this.PC + 2;    // +2に注意（PCは命令をフェッチした時点で、次の命令の先頭になっているため）
        
        // ジャンプ先のアドレス
        const destAddr = calcRelAddr_8(srcAddr, inst.e_2);

        this.PC = destAddr;
    }

    do_JR_C_e(inst) {
        if (self.testCF()) {
            this.do_JR_e(inst);
        }
    }

    do_JR_NC_e(inst) {
        if (!self.testCF()) {
            this.do_JR_e(inst);
        }
    }

    do_JR_Z_e(inst) {
        if (self.testZF()) {
            this.do_JR_e(inst);
        }
    }

    do_JR_NZ_e(inst) {
        if (!self.testZF()) {
            this.do_JR_e(inst);
        }
    }

    do_JP_HL(inst) {
        this.PC = getHL();
    }

    do_JP_IX(inst) {
        this.PC = this.IX;
    }

    do_JP_IY(inst) {
        this.PC = this.IY;
    }

    do_DJNZ(inst) {
        // （注）DJNZではフラグは変化しない
        const newB = this.reg8[B] - 1;
        this.reg8[B] = newB;
        if (newB !== 0) {
            this.do_JR_e(inst);
        }
    }

    // -----------------------------------
    // コール、リターングループ
    // -----------------------------------
    do_CALL_nn(inst) {
        this.do_PUSH_PC(inst);
        this.PC = inst.nn;
    }

    do_CALL_cc_nn(inst) {
        const cc = inst.cc;
        if (self.testCC(cc)) {
            this.do_CALL_nn(inst);
        }
    }

    do_RET(inst) {
        this.do_POP_PC(inst);
    }

    do_RET_cc(inst) {
        const cc = inst.cc;
        if (self.testCC(cc)) {
            this.do_RET(inst);
        }
    }

    do_RETI(inst) {
        // do nothing
    }

    do_RST(inst) {
        // do nothing
    }

    // -----------------------------------
    // ローテイト、シフトグループ
    // -----------------------------------

    // -----------------------------------
    // ビット操作グループ
    // -----------------------------------

    test1() {
        this.memory[0] = 0x78;  // LD A, B
        this.reg8[B] = 0x10;
        const retInst = this.decode(0);
        // console.log(retInst);
        this.printInst(retInst);
        this.printReg();
    }
}

module.exports = {
    Z80
}