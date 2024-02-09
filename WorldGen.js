let worldBounds = new Bounds(0, 0, window.screen.availWidth, window.screen.availHeight) // Screen Space 

let holePar = 0;

/** @type {Bounds[]} */
let heightBounds = []

function setUpWorld() {
    heightBounds = []

    // Build Grass
    // let grassLimit = 0.55
    // for (let x = 0; x < worldBounds.width; x += 20) {
    //     for (let y = 0; y < worldBounds.height; y += 10) {
            
    //         if (biome[x][y] > grassLimit) { // Large Grass Patches
    //             let canPlace = true;

    //             try {
    //                 let lookOff = 50;
    //                 if (biome[x + lookOff][y] < grassLimit) { canPlace = false; }
    //                 if (biome[x - lookOff][y] < grassLimit) { canPlace = false; }
    //                 if (biome[x][y + lookOff] < grassLimit) { canPlace = false; }
    //                 if (biome[x][y - lookOff] < grassLimit) { canPlace = false; }
    //             } catch(err) {}

    //             let xoffset = (Math.random() * 5) - 10
    //             let yoffset = (Math.random() * 10)
                
    //             if (!canPlace) { continue;}
    //             scene.push(
    //                 new GameObject("Nature/Grass_Short.png",
    //                     x + xoffset,
    //                     y + yoffset,
    //                     Math.random() * 15 - 7.5,
    //                     1.5, 
    //                     false,
    //                     "",
    //                 )
    //             )
    //         }
    //     }
    // }

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
                        2.05, 
                        false,
                        "", 
                        1
                    )
                )

            }
        }
    }

    scene.push(
        new GameObject("Objects/Arrow.png", 50, 50, 0, 5, false, "arrow", -100000)
    )
    let arrow = getObjByID("arrow")
    arrow.alwaysRender = true;
}


function spawnBallAndGoal() {

    let flagPos = findRandomGrassLocation(100, 80)

    scene.push(new GameObject("Objects/Flag.png", flagPos.x, flagPos.y + 1, 0, 2))
    scene.push(new GameObject("Objects/Hole.png", flagPos.x, flagPos.y, 0, 2, false, "hole"))
    getObjByID("hole").zIndex = -100


    let ballLoc = findFarthestGrassLocation(flagPos, 100, 20)
    let ballScale = 1.5
    scene.push(new GameObject("Objects/Ball.png", ballLoc.loc.x, ballLoc.loc.y, 0, ballScale, true, "ball"))
    scene.push(new GameObject("Objects/Ball_Shadow.png", ballLoc.loc.x, ballLoc.loc.y, 0, ballScale, false, "ball_shadow"))
    getObjByID("ball").drag = 0.95
    getObjByID("ball_shadow").zIndex = -1

    console.log("Spawned Objects", flagPos, ballLoc.loc)

    holePar = Math.round(ballLoc.dist / 400)
    console.log(ballLoc.dist)

    console.log("Par: ", holePar)
}
function dstBetweenPoints(pos1, pos2) {
    let a = pos2.x - pos1.x
    let b = pos2.y - pos1.y
    return Math.sqrt(a * a + b * b)
}
function maxHeightInSurroundings(point, radius) {
    let maxVal = 0;
    for (let x = point.x - radius; x < point.x + radius; x++) {
        for (let y = point.y - radius; y < point.y + radius; y++) {
            if (heightMap[x][y] > maxVal) {
                maxVal = heightMap[x][y]
            }
        }
    }
    return maxVal
}
// Function to find a random location on grass with a minimum distance from the world borders
function findRandomGrassLocation(minDistanceFromBorder, minDistFromEdge) {
    let x, y;
    do {
      x = Math.floor(Math.random() * (heightMap.length - 2 * minDistanceFromBorder) + minDistanceFromBorder);
      y = Math.floor(Math.random() * (heightMap[0].length - 2 * minDistanceFromBorder) + minDistanceFromBorder);
    } while (
        heightMap[x][y] !== 0 && maxHeightInSurroundings({x: x, y: y}, minDistFromEdge) !== 0
    ); // Keep searching until a grass location is found

    return { x: x, y: y };
}

function findFarthestGrassLocation(startPoint, minDistanceFromBorder, minDistFromEdge) {
    console.log("Finding Ball Location")
    let maxDistance = -1;
    let farthestLocation = { x: 500, y: 500 };

    for (let x = minDistanceFromBorder; x < worldBounds.width - minDistanceFromBorder; x++) {
        for (let y = minDistanceFromBorder; y < worldBounds.height - minDistanceFromBorder; y++) {
            if (heightMap[x][y] != 0) { continue; }

            const distance = dstBetweenPoints({ x: x, y: y }, startPoint)
            
            if (distance > maxDistance && maxHeightInSurroundings({x: x, y: y}, minDistFromEdge) == 0) {
                maxDistance = distance;
                farthestLocation = { x: x, y: y };
            }
        }
    }

    return { loc: farthestLocation, dist: maxDistance};
}  





function genHeightMaps() {

    // Calculate heightmap
    heightBounds.forEach((bound) => {
        bound.loopThrough((x, y) => {
            if (bound.inBounds(x, y)) {
                try {
                    heightMap[x][y] = 8 // Height of the platforms
                } catch (err) {}
            }
        })
    })

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
            bounds = new Bounds(xPos - 8 * renderScale, yPos - 16 * renderScale, 7 * renderScale, 11 * renderScale)
            break;



        case "ML":
            bounds = new Bounds(xPos + 1 * renderScale, yPos - 16 * renderScale, 7 * renderScale, 16 * renderScale)
            break;
        case "MM":
            bounds = new Bounds(xPos - 8 * renderScale, yPos - 16 * renderScale, 16 * renderScale, 16 * renderScale)
            break;
        case "MR":
            bounds = new Bounds(xPos - 8 * renderScale, yPos - 16  * renderScale, 7 * renderScale, 16 * renderScale)
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
            bounds = new       Bounds(xPos - 8 * renderScale, yPos - 16 * renderScale, 7 * renderScale, 16 * renderScale)
            secondBounds = new Bounds(xPos - 8 * renderScale, yPos - 16 * renderScale, 16 * renderScale, 11 * renderScale)
            break;
        case "MBL":
            bounds = new       Bounds(xPos - 8 * renderScale, yPos - 16 * renderScale, 16 * renderScale, 11 * renderScale)
            secondBounds = new Bounds(xPos + 1 * renderScale, yPos - 16 * renderScale, 7 * renderScale, 16 * renderScale)
            break;
        case "MTR":
            bounds = new Bounds(xPos - 8 * renderScale, yPos - 16 * renderScale, 7 * renderScale, 16 * renderScale)
            secondBounds = new Bounds(xPos - 8 * renderScale, yPos - 7 * renderScale, 16 * renderScale, 7 * renderScale)
            break;
        case "MTL":
            bounds = new Bounds(xPos + 1 * renderScale, yPos - 16 * renderScale, 7 * renderScale, 16 * renderScale)
            secondBounds = new Bounds(xPos - 8 * renderScale, yPos - 7 * renderScale, 16 * renderScale, 7 * renderScale)
            break;
    }

    heightBounds.push(bounds)
    heightBounds.push(secondBounds)
}
