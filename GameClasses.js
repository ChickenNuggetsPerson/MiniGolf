class GameObject {

    // constructor() {}
    constructor(spriteStr) { this.spriteStr = spriteStr }

    xPos = 0;
    yPos = 0;

    xVel = 0;
    yVel = 0;

    xAcc = 0;
    yAcc = 0;

    drag = 1;

    spriteStr = "";

    physEnabled = false;

    iteratePhysics() {
        if (!this.physEnabled) { return; }

        this.xVel += this.xAcc;
        this.yVel += this.yAcc;

        this.xPos += this.xVel;
        this.yPos += this.yVel

        this.xVel *= this.drag
        this.yVel *= this.drag

    }
}