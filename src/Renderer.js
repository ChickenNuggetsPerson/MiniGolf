let renderBiomeScale = 15

let loading = true;
let titleScreen = false;

// let screenMaxX = 590
// let screenMaxY = 400

let screenMaxX = 800
let screenMaxY = 800

// let screenMaxX = 2000
// let screenMaxY = 2000

// Load the sprites
let spriteNames = [
    "test.gif",

    "Logo/Logo.png",
    "Logo/LogoBack.png",
    "Logo/ClickToPlay.png",

    "Objects/Flag.png",
    "Objects/Hole.png",
    "Objects/Ball.png",
    "Objects/Arrow.png",
    "Objects/Ball_Shadow.png",
    "Nature/Grass_Short.png",
    "Nature/Grass_Long.png",

    "Borders/LongGrass/BL.png",
    "Borders/LongGrass/BM.png",
    "Borders/LongGrass/BR.png",

    "Borders/LongGrass/ML.png",
    "Borders/LongGrass/MM.png",
    "Borders/LongGrass/MR.png",

    "Borders/LongGrass/TL.png",
    "Borders/LongGrass/TM.png",
    "Borders/LongGrass/TR.png",

    "Borders/LongGrass/MBR.png",
    "Borders/LongGrass/MBL.png",
    "Borders/LongGrass/MTR.png",
    "Borders/LongGrass/MTL.png",



    "Nature/Water/BL.png",
    "Nature/Water/BM.png",
    "Nature/Water/BR.png",

    "Nature/Water/ML.png",
    "Nature/Water/MM.png",
    "Nature/Water/MR.png",

    "Nature/Water/TL.png",
    "Nature/Water/TM.png",
    "Nature/Water/TR.png",

    "Nature/Water/MBR.png",
    "Nature/Water/MBL.png",
    "Nature/Water/MTR.png",
    "Nature/Water/MTL.png",

] // Todo: make a system for auto detecting sprites and getting them
let images = {}
spriteNames.forEach((name) => {
    let img = new Image()
    img.src = "./Sprites/" + name
    images[name] = img
})

var c = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
var ctx = c.getContext("2d");


let xOff = 0
let yOff = 0
let yActual = 0;
let yShift = -24

let xPID = new Pid(0.15, 0, 0)
let yPID = new Pid(0.15, 0, 0)

function render() {

    c.width = window.innerWidth
    c.height = window.innerHeight

    ctx.fillStyle = "#3f3e3d";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);


    if (!isMaster && titleScreen) {
        window.requestAnimationFrame(render)
        return;
    }


    xOff -= xPID.iterate(xOff, window.screenLeft)
    yActual -= yPID.iterate(yActual, window.screenTop)
    
    if (window.opener) {
        yOff = yActual + yShift
    } else {
        yOff = yActual
    }
    

    // If the master screen is not alive
    // blank the screen
    if (!windowManager.isAliveAdd(0, 100)) {

        ctx.globalAlpha = 1
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

        let centerX = window.innerWidth / 2
        let centerY = window.innerHeight / 2

        ctx.fillStyle = "white"
        ctx.fillRect(centerX - 100, centerY - 20, 200, 40)    
        
        ctx.fillStyle = "black"
        ctx.font = "20px Pixelify Sans"
        ctx.fillText("No Master Screen", centerX - 88, centerY + 7)

        window.requestAnimationFrame(render)
        return
    }


    // Create checkerboard pattern
    let yCounter = 0;
    for (let x = 0; x < worldBounds.width; x += renderBiomeScale) {
        for (let y = 0; y < worldBounds.height; y += renderBiomeScale) {
            if ( yCounter % 2 == 0 ) {
                ctx.fillStyle = "#55bd39"
                ctx.fillRect(x - xOff - renderBiomeScale/2, y - yOff - renderBiomeScale/2, renderBiomeScale, renderBiomeScale)
            } else {
                ctx.fillStyle = "#4fad34"
                
            }

            ctx.fillRect(x - xOff - renderBiomeScale/2, y - yOff - renderBiomeScale/2, renderBiomeScale + 1, renderBiomeScale + 1)

            yCounter++;
        }
        if (x % 2 == 0) {
            yCounter = 0
        } else {
            yCounter = 1
        }
    }


    let renderOverlap = 150

    scene.forEach((object) => {
        try {

            // Check for the object out of screen
            if (!object.alwaysRender) {
                if (object.xPos < xOff - renderOverlap) { return; }
                if (object.xPos > xOff + window.innerWidth + renderOverlap) { return; }
    
                if (object.yPos < yOff - renderOverlap) { return; }
                if (object.yPos > yOff + window.innerHeight + renderOverlap) { return; }
            }
            
            let width = images[object.spriteStr].naturalWidth * object.scale
            let height = images[object.spriteStr].naturalHeight * object.scale
            
            if (object.id.endsWith("ball")) {
                // Ball rendering
    
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(
                    images[object.spriteStr], 
                    object.xPos - xOff - width / 2, 
                    object.yPos - yOff - height - object.height, 
                    width, 
                    height
                )
            } else if (object.id.endsWith("ball_shadow")) {
                // Ball rendering
    
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(
                    images[object.spriteStr], 
                    object.xPos - xOff - width / 2 , 
                    object.yPos - yOff - height - object.minHeight + 2, 
                    width, 
                    height
                )
    
            } else {
                // Normal Rendering
    
                const angleInRadians = (object.rot * Math.PI) / 180;
    
                ctx.translate(object.xPos - xOff, object.yPos - yOff);
    
                // Rotate the canvas
                ctx.rotate(angleInRadians);

                ctx.globalAlpha = 1;
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(
                    images[object.spriteStr], 
                    -width / 2, 
                    -height + object.height, 
                    width, 
                    height
                )
    
                ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset Canvas 
    
            }
        } catch(err) {}
    })

    // Render Height Maps
    // let scale = 2
    // for (let x = window.screenLeft; x < window.screenLeft + window.innerWidth; x += scale) {
    //     for (let y = window.screenTop; y < window.screenTop + window.innerHeight; y += scale) {

    //         ctx.fillStyle = lerpColor("#000000", "#ffffff", heightMap[x][y] / 8)
    //         ctx.globalAlpha = 0.4
    //         ctx.fillRect(x - xOff - scale/2, y - yOff - scale/2, scale, scale)
    //     }
    // }


    // Render Ball Arrow

    ctx.globalAlpha = 1
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Render "Reduce Window Size"
    if (window.innerWidth > screenMaxX || window.innerHeight > screenMaxY) {

        let xAmt = window.innerWidth - screenMaxX
        let yAmt = window.innerHeight - screenMaxY

        if (xAmt < 0) { xAmt = 0 }
        if (yAmt < 0) { yAmt = 0 }

        ctx.globalAlpha = (xAmt + yAmt) / 100
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

        let centerX = window.innerWidth / 2
        let centerY = window.innerHeight / 2

        ctx.fillStyle = "white"
        ctx.fillRect(centerX - 100, centerY - 20, 200, 40)    
        
        ctx.fillStyle = "black"
        ctx.font = "20px Pixelify Sans"
        ctx.fillText("Reduce Window Size", centerX - 92, centerY + 7)
    }

    ctx.globalAlpha = 1

    // Render master screen text
    if (isMaster) {
        ctx.fillStyle = "#d9473d"
        ctx.fillRect(0, 0, 170, 20)
        ctx.fillStyle = "black"
        ctx.font = "20px Pixelify Sans"
        ctx.fillText("Master Screen", 10, 15)
    }

    // Render loading text
    if (isMaster && loading) {
        ctx.fillStyle = "#d9a53d"
        ctx.fillRect(0, 20, 170, 20)
        ctx.fillStyle = "black"
        ctx.font = "20px Pixelify Sans"
        ctx.fillText("Building World", 15, 35)
    }

    window.requestAnimationFrame(render)
}



/**
 * A linear interpolator for hexadecimal colors
 * @param {String} a
 * @param {String} b
 * @param {Number} amount
 * @example
 * // returns #7F7F7F
 * lerpColor('#000000', '#ffffff', 0.5)
 * @returns {String}
 */
function lerpColor(a, b, amount) { 
    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}


function lerpValue(start, stop, val) {
    return start + ((stop - start) * val)
}

function getHitScale(input) {
    if (input < 10) {
        return 0
    }
    if (input < 100) {
        return 1;
    }
    return 2
}