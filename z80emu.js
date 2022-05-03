const NOP = 0x00;
const LD_R_R = 0x40;
const LD_R_N = 0x60;

class Z80 {
    constructor() {
        self.reg8 = new Uint8Array(7);
        self.PC = 0x0000;
        self.SP = 0x0000;
        self.FLG = 0x00;
        self.memory = new Uint8Array(0x10000);
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
        const opCode1 = self.memory[PC];

        if ((opCode1 & 0xc0) === 0x40) {
            return {
                inst: LD_R_R,
                src: 0,
                dest: 0,
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
        const decodedInst = decode(self.PC);
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
}

module.exports = {
    Z80
}