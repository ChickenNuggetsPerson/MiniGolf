let windowManager = new WindowManager()
let isMaster = windowManager.init() == 0;
windowManager.addCallbacks(mouseMove, mouseDown, mouseUp)

/** @type {GameObject[]} */
let scene = [];

let biome = [];
let seed = Math.random() * 10;

// Scene update code
setInterval(() => {
    try {
        if (isMaster) {
            scene.sort((a, b) => b.zIndex - a.zIndex); // Sort the scene by zIndex
            windowManager.setSendData(JSON.stringify(scene))
        } else {
            scene = JSON.parse(windowManager.getRecievedData())
        }
    } catch(err) { console.warn(err) }
}, 20);


// Render code
setInterval(() => {
    // try {
        render();
    // } catch (error) {console.log(error)}
}, 20);


if (isMaster) {
    genBiome()
    fillHeightMap();
    setUpWorld()

    setInterval(() => {
        updateWorld()
    }, 20);
}

// Setup Biome Transpher
if (!isMaster) {
    fillBiome()
    setInterval(() => {
        let newBiome = JSON.parse(localStorage.getItem("biome"))
        biome[newBiome.x] = newBiome.val
        // console.log(newBiome)
    }, 2);
}

let biomeSendX = 0;
let biomeSendY = 0;
if (isMaster) { // Send Biome data
    setInterval(() => {
        if (biomeSendX >= worldBounds.width) {
            biomeSendX = 0;
        }
        localStorage.setItem("biome", JSON.stringify({
            x: biomeSendX,
            val: biome[biomeSendX]
        }))

        biomeSendX += 1;
    }, 5);
}



function genBiome() {

    let borderWidth = 150;

    for (let x = 0; x < worldBounds.width; x++) {
        let tmp = []
        for (let y = 0; y < worldBounds.height; y++) {

            let inBounds = false;
            if (x < borderWidth || x > worldBounds.width - borderWidth) { inBounds = true; }
            if (y < borderWidth || y > worldBounds.height - borderWidth) { inBounds = true; }
            
            if (inBounds) {
                tmp.push(2) // Force the borders to be walls
            } else {
                tmp.push(PerlinNoise.noise(x / 500, y / 500, seed))
            }

        }
        biome.push(tmp)
    }
}
function fillBiome() {
    for (let x = 0; x < worldBounds.width; x++) {
        let tmp = []
        for (let y = 0; y < worldBounds.height; y++) {
            tmp.push(0)
        }
        biome.push(tmp)
    }
}