class Pid {


    pGain = 0;
    iGain = 0;
    dGain = 0;

    error = 0;
    prevError = 0;

    derivative = 0;
    totalError = 0;

    resetTimer = 0

    lastTime = 0;

    constructor(p, i, d) {
        this.pGain = p;
        this.iGain = i;
        this.dGain = d;

        this.lastTime = new Date().getTime();
    }

    /*
    double now = brainPtr->timer(timerUnits);
    dt = now - lastTime;        

    derivative = (error - prevError) / dt;
    totalError += error * dt;

    lastTime = now;
    */

    iterate(newVal, desiredVal) {
        if (this.resetTimer > 0) {
            this.resetTimer--;
            return 0;
        }

        let now = new Date().getTime()
        let dt = now - this.lastTime

        this.error = newVal - desiredVal;

        this.derivative = (this.error - this.prevError) / dt;
        this.totalError += this.error * dt;

        let result = (this.error * this.pGain) + (this.derivative * this.dGain) + (this.totalError * this.iGain)

        this.prevError = this.error;
        this.lastTime = now

        return result
    }
    reset() {

        this.error = 0;
        this.prevError = 0;

        this.derivative = 0;
        this.totalError = 0;

        this.lastTime =  new Date().getTime() + 500
        this.resetTimer = 10
    }
};