let renderBiomeScale = 10

let loading = true;

// Load the sprites
let spriteNames = [
    "test.gif",
    "Objects/Flag.png",
    "Objects/Hole.png",
    "Objects/Ball.png",
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

] // Todo: make a system for auto detecting sprites and getting them
let images = {}
spriteNames.forEach((name) => {
    let img = new Image()
    img.src = "./Sprites/" + name
    images[name] = img
})
loading = false

var c = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
var ctx = c.getContext("2d");


let xOff = 0
let yOff = 0

let xPID = new Pid(0.3, 0, 0)
let yPID = new Pid(0.3, 0, 0)

function render() {

    if (loading) { return; }

    c.width = window.innerWidth
    c.height = window.innerHeight

    ctx.fillStyle = "#529c3b";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    

    xOff -= xPID.iterate(xOff, window.screenLeft)
    yOff -= yPID.iterate(yOff, window.screenTop)


    let count = 0;
    for (let x = 0; x < worldBounds.width; x += renderBiomeScale) {
        for (let y = 0; y < worldBounds.height; y += renderBiomeScale) {
            if ( count % 2 == 0 ) {
                ctx.fillStyle = "#55bd39"
            } else {
                ctx.fillStyle = "#4fad34"
            }
            ctx.beginPath();
            ctx.fillRect(x - xOff - renderBiomeScale/2, y - yOff - renderBiomeScale/2, renderBiomeScale, renderBiomeScale)
            count++
        }
        count++
    }


    let renderOverlap = 100

    scene.forEach((object) => {
        try {
            if (!object.alwaysRender) {
                if (object.xPos < window.screenLeft - renderOverlap) { return; }
                if (object.xPos > window.screenLeft + window.innerWidth + renderOverlap) { return; }
    
                if (object.yPos < window.screenTop - renderOverlap) { return; }
                if (object.yPos > window.screenTop + window.innerHeight + renderOverlap) { return; }
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
                    object.xPos - xOff - width / 2, 
                    object.yPos - yOff - height - object.minHeight, 
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
                    -height, 
                    width, 
                    height
                )
    
                ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset Canvas 
    
            }
        } catch(err) {}
    })


    // Render Height Maps
    // let scale = 2
    // for (let x = 0; x < worldBounds.width; x += scale) {
    //     for (let y = 0; y < worldBounds.height; y += scale) {
    //         ctx.fillStyle = lerpColor("#000000", "#ffffff", heightMap[x][y] / 8)
    //         ctx.globalAlpha = 0.4
    //         ctx.fillRect(x - xOff - scale/2, y - yOff - scale/2, scale, scale)
    //         count++
    //     }
    //     count++
    // }

    if (isMaster) {
        ctx.fillStyle = "#d9473d"
        ctx.fillRect(0, 0, 170, 20)
        ctx.fillStyle = "black"
        ctx.font = "20px Pixelify Sans"
        ctx.fillText("Master Screen", 10, 15)
    }
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
