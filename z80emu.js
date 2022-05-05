const {toHex2, toHex4, A, B, C, D, E, H, L, xrctReg8, toRegName} = require('./Utils');

const NOP = 0x00;

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
const INC_A_R = 0x04;
const INC_A_HL = 0x34;
const INC_A_IX = 0xdd34;
const INC_A_IY = 0xfd34;
const DEC_A_R = 0x05;
const DEC_A_HL = 0x35;
const DEC_A_IX = 0xdd35;
const DEC_A_IY = 0xfd35;

class Z80 {
    constructor() {
        this.reg8 = new Uint8Array(8);
        this.PC = 0x0000;
        this.SP = 0x0000;
        this.FLG = 0x00;
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
        //  8bitロードグループ
        // -----------------------------------
        if ((opCode1 & 0xc0) === 0x40) {
            // LD r1, r2
            const dest = xrctReg8(opCode1, 3);
            const src = xrctReg8(opCode1, 0);
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
            const dest = xrctReg8(opCode1, 3);
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
            const dest = xrctReg8(opCode1, 3);
            return {
                inst: LD_R_HL,
                dest,
                nInst: 1,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && ((opCode2 & 0xc7) === 0x46)) {
            // LD r, (IX+d)
            const dest = xrctReg8(opCode2, 3);
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
            // LD r, (IX+d)
            const dest = xrctReg8(opCode2, 3);
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
            const src = xrctReg8(opCode1, 0);
            return {
                inst: LD_HL_R,
                src,
                nInst: 1,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && ((opCode2 & 0xf8) === 0x70)) {
            // LD (IX+d), r
            const src = xrctReg8(opCode2, 0);
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
            const src = xrctReg8(opCode2, 0);
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
            const arg1 = this.memory[PC+1];
            return {
                inst: LD_HL_N,
                src: arg1,
                nInst: 2,
                cycles: 10
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x36)) {
            // LD (IX+d), n
            const arg1 = this.memory[PC+2];
            const arg2 = this.memory[PC+3];
            return {
                inst: LD_IX_N,
                d: arg1,
                src: arg2,
                nInst: 4,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x36)) {
            // LD (IY+d), n
            const arg1 = this.memory[PC+2];
            const arg2 = this.memory[PC+3];
            return {
                inst: LD_IY_N,
                d: arg1,
                src: arg2,
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
        // 8bit算術、論理演算グループ
        // -----------------------------------
        else if ((opCode1 & 0xf8) === 0x80) {
            // ADD A, r
            const src = xrctReg8(opCode1, 0);
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
            const src = xrctReg8(opCode1, 0);
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
            const src = xrctReg8(opCode1, 0);
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
            const src = xrctReg8(opCode1, 0);
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
            const src = xrctReg8(opCode1, 0);
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
            const src = xrctReg8(opCode1, 0);
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
            const src = xrctReg8(opCode1, 0);
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
            const src = xrctReg8(opCode1, 0);
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
            // INC A, r
            const src = xrctReg8(opCode1, 3);
            return {
                inst: INC_A_R,
                src,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0x34) {
            // INC A, (HL)
            return {
                inst: INC_A_HL,
                nInst: 2,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x34)) {
            // INC A, (IX+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: INC_A_IX,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x34)) {
            // INC A, (IY+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: INC_A_IY,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 & 0xc7) === 0x05) {
            // DEC A, r
            const src = xrctReg8(opCode1, 3);
            return {
                inst: DEC_A_R,
                src,
                nInst: 1,
                cycles: 4
            }
        }
        else if (opCode1 === 0x35) {
            // DEC A, (HL)
            return {
                inst: DEC_A_HL,
                nInst: 2,
                cycles: 7
            }
        }
        else if ((opCode1 === 0xdd) && (opCode2 === 0x35)) {
            // DEC A, (IX+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: DEC_A_IX,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }
        else if ((opCode1 === 0xfd) && (opCode2 === 0x35)) {
            // DEC A, (IY+d)
            const arg1 = this.memory[PC+2];
            return {
                inst: DEC_A_IY,
                d: arg1,
                nInst: 3,
                cycles: 19
            }
        }

        // -----------------------------------
        // その他
        // -----------------------------------
        else if (opCode1 === 0x00) {
            return {
                inst: NOP,
                nInst: 1,
                cycles: 1
            }    
        }
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
                this.do_LD_R_R();
            }
            case LD_R_N: {
                this.do_LD_R_N();
            }
            case NOP: {
                this.do_NOP();
                break;
            }
            case JP: {
                this.do_JP();
            }
        }
        waitCycles(decodedInst.cycles);
        return;
    }

    // 各命令の実行
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

    do_JP(inst) {

    }

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