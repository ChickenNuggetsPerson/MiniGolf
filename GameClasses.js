class GameObject {

    alwaysRender = false;

    // constructor() {}
    constructor(spriteStr, xPos, yPos, rot, scale, phsEnabled = false, id = "", zIndex = -1) { 
        this.spriteStr = spriteStr; 
        this.xPos = xPos; 
        this.yPos = yPos;
        this.scale = scale;
        this.physEnabled = phsEnabled
        this.id = id
        this.rot = rot

        if (zIndex == -1) {
            this.zIndex = -this.yPos
        } else {
            this.zIndex = zIndex
        }
        
    }

    xPos = 0;
    yPos = 0;

    xVel = 0;
    yVel = 0;

    xAcc = 0;
    yAcc = 0;
    
    height = 0;
    heightVel = 0;
    heightAcc = -0.3;

    drag = 1;

    zIndex = -1;
    id = ""

    rot = 0;

    spriteStr = "";

    physEnabled = false;

    scale = 1;

    iteratePhysics() {
        if (!this.physEnabled) { return; }

        this.xVel += this.xAcc;
        this.yVel += this.yAcc;

        this.xPos += this.xVel;
        this.yPos += this.yVel

        this.xVel *= this.drag
        this.yVel *= this.drag


        // Height Physics
        if (this.height > 0.05) {
            this.heightVel += this.heightAcc
        }

        this.height += this.heightVel
        
        if (this.height <= 0.05 && Math.abs(this.heightVel) <= 0.05) { 
            this.height = 0; 
            this.heightVel = 0;
        }
        if (this.height <= 0.05 && Math.abs(this.height) >= 0.05) {
            this.heightVel *= -0.5
        }

        if (this.height < 0) {
            this.height = 0;
        }
    }

    applyVel(xVel, yVel) {
        this.xVel += xVel
        this.yVel += yVel
    }

    deleteItem() {
        this.id = "--DeleteMe--"
    }
}


class Bounds {
    constructor(x, y, width, height) {
        this.x1 = x
        this.y1 = y
        this.x2 = x + width
        this.y2 = y + height

        this.width = width
        this.height = height
    }    
}