const {toHex2, toHex4, A, B, C, D, E, H, L, xrctReg8, toRegName} = require('./Utils');

const NOP = 0x00;
const LD_R_R = 0x40;
const LD_R_N = 0x60;

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

        if ((opCode1 & 0xc0) === 0x40) {
            // LD x, y
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
            case NOP: {
                do_NOP();
                break;
            }
            case JP: {
                do_JP();
            }
        }
        waitCycles(decodedInst.cycles);
        return;
    }

    // 各命令の実行
    do_LD_R_R(inst) {

    }

    do_LD_R_N(inst) {

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