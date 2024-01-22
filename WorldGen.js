let worldBounds = new Bounds(0, 0, window.screen.availWidth, window.screen.availHeight) // Screen Space 

function setUpWorld() {
    
    scene.push(new GameObject("Objects/Ball.png", 400, 400, 0, 3, true, "ball"))
    scene.push(new GameObject("Objects/Ball_Shadow.png", 400, 400, 0, 3, false, "ball_shadow"))
    getObjByID("ball").drag = 0.95
    getObjByID("ball_shadow").zIndex = -101

    // Build Grass
    for (let x = 0; x < worldBounds.width; x += 20) {
        for (let y = 0; y < worldBounds.height; y += 10) {
            
            if (biome[x][y] > 0.6) { // Large Grass Patches
                let canPlace = true;

                try {
                    let lookOff = 40;
                    if (biome[x + lookOff][y] < 0.6) { canPlace = false; }
                    if (biome[x - lookOff][y] < 0.6) { canPlace = false; }
                    if (biome[x][y + lookOff] < 0.6) { canPlace = false; }
                    if (biome[x][y - lookOff] < 0.6) { canPlace = false; }
                } catch(err) {}

                let xoffset = (Math.random() * 5) - 10
                let yoffset = (Math.random() * 10)
                
                if (!canPlace) { continue;}
                scene.push(
                    new GameObject("Nature/Grass_Short.png",
                        x + xoffset,
                        y + yoffset,
                        Math.random() * 15 - 7.5,
                        1.5, 
                        false,
                        "",
                    )
                )
            }
        }
    }

    // Add Borders
    for (let x = 0; x < worldBounds.width; x += 32) {
        for (let y = 0; y < worldBounds.height; y += 32) {
            
            if (biome[x][y] > 0.55) { // Large Grass Patches
                
                let name = borderName(x, y, 32, 0.55)
                setBoundsHeight(name, 8, x, y, 2)

                scene.push(
                    new GameObject("Borders/LongGrass/" + name + ".png",
                        x,
                        y,
                        0,
                        2, 
                        false,
                        "", 
                        1
                    )
                )

            }
        }
    }


    scene.push(new GameObject("Objects/Flag.png", 500, 501, 0, 2))
    scene.push(new GameObject("Objects/Hole.png", 500, 500, 0, 2, false, "hole"))
    getObjByID("hole").zIndex = -100



    // Calculate heightmap

    for (let x = worldBounds.x1; x < worldBounds.x2; x++) {
        for (let y = worldBounds.y1; y < worldBounds.y2; y++) {
            let collides = false;
            heightBounds.forEach((bound) => {
                if (bound.inBounds(x, y)) {
                    collides = true;
                }
            })
            if (collides) {
                heightMap[x][y] = 8 // Height of the platforms
            }
        }
    }
}


// "Borders/LongGrass/BL.png",
// "Borders/LongGrass/BM.png",
// "Borders/LongGrass/BR.png",

// "Borders/LongGrass/ML.png",
// "Borders/LongGrass/MM.png",
// "Borders/LongGrass/MR.png",

// "Borders/LongGrass/TL.png",
// "Borders/LongGrass/TM.png",
// "Borders/LongGrass/TR.png",

function borderName(x, y, imgScale, lim) {
    
    let b = true
    let t = true
    let l = true
    let r = true

    let bl = false
    let br = false
    let tl = false
    let tr = false

    try { b = biome[x][y + imgScale] > lim } catch (err) {}
    try { t = biome[x][y - imgScale] > lim } catch (err) {} 
    try { l = biome[x - imgScale][y] > lim } catch (err) {}
    try { r = biome[x + imgScale][y] > lim } catch (err) {}

    try { bl = biome[x - imgScale][y + imgScale] > lim } catch (err) {}
    try { br = biome[x + imgScale][y + imgScale] > lim } catch (err) {} 
    try { tl = biome[x - imgScale][y - imgScale] > lim } catch (err) {}
    try { tr = biome[x + imgScale][y - imgScale] > lim } catch (err) {}



    if (!bl && br && tl && tr && t && b && l && r) { return "MBL" }
    if (bl && !br && tl && tr && t && b && l && r) { return "MBR" }
    if (bl && br && !tl && tr && t && b && l && r) { return "MTL" }
    if (bl && br && tl && !tr && t && b && l && r) { return "MTR" }

    // return "MBL"

    let firstLetter = "M";
    let secondLetter = "M";

    if (t && b) { firstLetter = "M" }
    if (t && !b) { firstLetter = "B" }
    if (!t && b) { firstLetter = "T" }

    if (l && r) { secondLetter = "M" }
    if (l && !r) { secondLetter = "R" }
    if (!l && r) { secondLetter = "L" }

    return firstLetter + secondLetter
}

function setBoundsHeight(name, height, xPos, yPos, renderScale) {

    /** @type {Bounds} */
    let bounds = new Bounds(0, 0, 0, 0);
    let secondBounds = new Bounds(0, 0, 0, 0)

    switch (name) {

        case "BL":
            bounds = new Bounds(xPos + 1 * renderScale, yPos - 16 * renderScale, 8 * renderScale, 11 * renderScale)
            break;
        case "BM":
            bounds = new Bounds(xPos - 8 * renderScale, yPos - 16 * renderScale, 16 * renderScale, 11 * renderScale)
            break;
        case "BR":
            bounds = new Bounds(xPos - 8 * renderScale, yPos - 16 * renderScale, 7 * renderScale, 8 * renderScale)
            break;



        case "ML":
            bounds = new Bounds(xPos + 1 * renderScale, yPos - 16 * renderScale, 7 * renderScale, 16 * renderScale)
            break;
        case "MM":
            bounds = new Bounds(xPos - 8 * renderScale, yPos - 16 * renderScale, 16 * renderScale, 16 * renderScale)
            break;
        case "MR":
            bounds = new Bounds(xPos - 8 * renderScale, yPos - 16  * renderScale, 6 * renderScale, 16 * renderScale)
            break;



        case "TL":
            bounds = new Bounds(xPos + 1 * renderScale, yPos - 7 * renderScale, 7 * renderScale, 7 * renderScale)
            break;
        case "TM":
            bounds = new Bounds(xPos - 8 * renderScale, yPos - 7 * renderScale, 16 * renderScale, 7 * renderScale)
            break;
        case "TR":
            bounds = new Bounds(xPos - 8 * renderScale, yPos - 7 * renderScale, 7 * renderScale, 8 * renderScale)
            break;



        case "MBR":
            bounds = new Bounds(xPos - 8 * renderScale, yPos - 16 * renderScale, 6 * renderScale, 16 * renderScale)
            secondBounds = new Bounds(xPos - 8 * renderScale, yPos - 16 * renderScale, 16 * renderScale, 10 * renderScale)
            break;
        case "MBL":
            bounds = new Bounds(xPos - 8 * renderScale, yPos - 16 * renderScale, 16 * renderScale, 11 * renderScale)
            secondBounds = new Bounds(xPos + 1 * renderScale, yPos - 16 * renderScale, 6 * renderScale, 16 * renderScale)
            break;
        case "MTR":
            bounds = new Bounds(xPos - 8 * renderScale, yPos - 16 * renderScale, 6 * renderScale, 16 * renderScale)
            secondBounds = new Bounds(xPos - 8 * renderScale, yPos - 7 * renderScale, 16 * renderScale, 7 * renderScale)
            break;
        case "MTL":
            bounds = new Bounds(xPos + 1 * renderScale, yPos - 16 * renderScale, 6 * renderScale, 16 * renderScale)
            secondBounds = new Bounds(xPos - 8 * renderScale, yPos - 7 * renderScale, 16 * renderScale, 7 * renderScale)
            break;
    }

    heightBounds.push(bounds)
    heightBounds.push(secondBounds)
}

/** @type {Bounds[]} */
let heightBounds = []