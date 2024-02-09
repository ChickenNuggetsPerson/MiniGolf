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
    heightAcc = -0.5;
    minHeight = 0;

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
        this.yPos += this.yVel;

        // More drag for being on top of platform
        if (this.height < this.minHeight + 1 && this.height > 3) {
            this.xVel *= 0.95;
            this.yVel *= 0.95;    
        }

        this.xVel *= this.drag;
        this.yVel *= this.drag;

        // Height Physics
        if (this.height > 0.05) {
            this.heightVel += this.heightAcc
        }

        this.height += this.heightVel
        
        if (this.height <= this.minHeight + 0.05 && Math.abs(this.heightVel) <= 0.05) { 
            this.height = this.minHeight; 
            this.heightVel = 0;
        }
        if (this.height <= this.minHeight + 0.05) {
            this.heightVel *= -0.5
        }

        if (this.height < this.minHeight) {
            this.height = this.minHeight;
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
    inBounds(xPos, yPos) {
        return xPos >= this.x1 && xPos <= this.x2 && yPos >= this.y1 && yPos <= this.y2;
    }
    getHeightEdges() {
        const centerX = Math.floor(this.x1 + this.width/2);
        const centerY = Math.floor(this.y1 + this.height/2);

        return {
            top: heightMap[centerX][Math.floor(this.y1)],
            bottom: heightMap[centerX][Math.floor(this.y2)],
            left: heightMap[Math.floor(this.x1)][centerY],
            right: heightMap[Math.floor(this.x2)][centerY]
        };
    }
    loopThrough(cb) {
        for (let x = this.x1; x < this.x2; x++) {
            for (let y = this.y1; y < this.y2; y++) {
                cb(x, y)
            }
        }
    }
}