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


    // for (let x = 0; x < worldBounds.width; x += renderBiomeScale) {
    //     for (let y = 0; y < worldBounds.height; y += renderBiomeScale) {
            
    //         if (biome[x][y] > 0.65) {
    //             let diff = (biome[x][y] - 0.65) / 0.15

    //             ctx.fillStyle = lerpColor("#529c3b", "#234a18", diff);
    //             ctx.beginPath();
    //             ctx.fillRect(x - xOff - renderBiomeScale/2, y - yOff - renderBiomeScale/2, renderBiomeScale, renderBiomeScale)
    //         }

    //         if (biome[x][y] < 0.3) {
    //             let diff = (biome[x][y]) / 0.3

    //             ctx.fillStyle = lerpColor("#1a7572", "#2cc7c2", diff);
    //             ctx.beginPath();
    //             ctx.fillRect(x - xOff - renderBiomeScale/2, y - yOff - renderBiomeScale/2, renderBiomeScale, renderBiomeScale)
    //         }

    //         if (biome[x][y] > 0.3 && biome[x][y] < 0.50) {
    //             let diff = (biome[x][y] - 0.3) / 0.2

    //             ctx.fillStyle = lerpColor("#c7cf34", "#529c3b", diff);
    //             ctx.beginPath();
    //             ctx.fillRect(x - xOff - renderBiomeScale/2, y - yOff - renderBiomeScale/2, renderBiomeScale, renderBiomeScale)
    //         }
        
    //     }
    // }


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
    
            } else {
                // Normal Rendering
    
                const angleInRadians = (object.rot * Math.PI) / 180;
    
                ctx.translate(object.xPos - xOff, object.yPos - yOff);
    
                // Rotate the canvas
                ctx.rotate(angleInRadians);
    
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
