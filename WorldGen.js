let worldBounds = new Bounds(-100, -100, window.screen.availWidth + 100, window.screen.availHeight + 100) // Screen Space 

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

                let xoffset = (Math.random() * 5) - 10
                let yoffset = (Math.random() * 10)
                
                if (!canPlace) { continue;}
                scene.push(
                    new GameObject("Nature/Grass_Short.png",
                        x + xoffset,
                        y + yoffset,
                        Math.random() * 15 - 7.5,
                        1.5, 
                        false
                    )
                )
            }
        }
    }


    for (let x = 0; x < worldBounds.width; x += 32) {
        for (let y = 0; y < worldBounds.height; y += 32) {
            
            if (biome[x][y] > 0.55) { // Large Grass Patches
                
                scene.push(
                    new GameObject("Borders/LongGrass/" + borderName(x, y, 32, 0.55) + ".png",
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