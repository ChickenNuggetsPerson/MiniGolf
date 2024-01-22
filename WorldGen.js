let worldBounds = new Bounds(0, 0, window.screen.availWidth, window.screen.availHeight) // Screen Space 



/** @type {Bounds[]} */
let heightBounds = []

function setUpWorld() {
    heightBounds = []

    // Build Grass
    let grassLimit = 0.65
    for (let x = 0; x < worldBounds.width; x += 20) {
        for (let y = 0; y < worldBounds.height; y += 10) {
            
            if (biome[x][y] > grassLimit) { // Large Grass Patches
                let canPlace = true;

                try {
                    let lookOff = 40;
                    if (biome[x + lookOff][y] < grassLimit) { canPlace = false; }
                    if (biome[x - lookOff][y] < grassLimit) { canPlace = false; }
                    if (biome[x][y + lookOff] < grassLimit) { canPlace = false; }
                    if (biome[x][y - lookOff] < grassLimit) { canPlace = false; }
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
    let borderLimt = 0.5

    for (let x = 0; x < worldBounds.width; x += 32) {
        for (let y = 0; y < worldBounds.height; y += 32) {
            
            if (biome[x][y] > borderLimt) { // Large Grass Patches
                
                let name = borderName(x, y, 32, borderLimt)
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
}


function spawnBallAndGoal() {
    let possibilities = findLowestVal(0.2)
    let lowestVal = possibilities[Math.floor(Math.random() * possibilities.length)]

    scene.push(new GameObject("Objects/Flag.png", lowestVal.x, lowestVal.y + 1, 0, 2))
    scene.push(new GameObject("Objects/Hole.png", lowestVal.x, lowestVal.y, 0, 2, false, "hole"))
    getObjByID("hole").zIndex = -100


    let ballLoc = chooseBalLoc(lowestVal)
    scene.push(new GameObject("Objects/Ball.png", ballLoc.x, ballLoc.y, 0, 3, true, "ball"))
    scene.push(new GameObject("Objects/Ball_Shadow.png", ballLoc.x, ballLoc.y, 0, 3, false, "ball_shadow"))
    getObjByID("ball").drag = 0.95
    getObjByID("ball_shadow").zIndex = -1

    console.log("Spawned Objects", lowestVal, ballLoc)
}

function findLowestVal(limit) {
    let possibilities = []

    let borderDist = 200;

    for (let x = borderDist; x < biome.length - borderDist; x++) {
        for (let y = borderDist; y < biome[x].length - borderDist; y++) {
            if (biome[x][y] < limit) {
                possibilities.push({
                    x: x,
                    y: y
                })
            }
        }
    }

    if (possibilities.length == 0) {
        return findLowestVal(limit + 0.1)
    }

    return possibilities;
}
function dstBetweenPoints(pos1, pos2) {
    let a = pos2.x - pos1.x
    let b = pos2.y - pos1.y
    return Math.sqrt(a * a + b * b)
}
function chooseBalLoc(goal) {

    let possibilities = []
    let borderDist = 200;


    for (let x = borderDist; x < heightMap.length - borderDist; x++) {
        for (let y = borderDist; y < heightMap[0].length - borderDist; y++) {

            if (heightMap[x][y] != 0) { continue; }

            if (dstBetweenPoints({ x: x, y: y }, goal) > 700) {
                possibilities.push({
                    x: x,
                    y: y
                })
            }
        }
    }

    if (possibilities.length == 0) {
        return {
            x: 500,
            y: 500
        }
    }

    return possibilities[Math.floor(Math.random() * possibilities.length)]
}




function genHeightMaps() {

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

    console.log("Done Generating Height Maps")
}


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
