class Pid {


    pGain = 0;
    iGain = 0;
    dGain = 0;

    error = 0;
    prevError = 0;

    derivative = 0;
    totalError = 0;

    constructor(p, i, d) {
        this.pGain = p;
        this.iGain = i;
        this.dGain = d;
    }

    iterate(newVal, desiredVal) {
        this.error = newVal - desiredVal;

        this.derivative = this.error - this.prevError;
        this.totalError += this.error;

        let result = (this.error * this.pGain) + (this.derivative * this.dGain) + (this.totalError * this.iGain)

        this.prevError = this.error;

        return result
    }
};