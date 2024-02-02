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
    render();
}, 20);


if (isMaster) {
    masterLogic()
}

async function masterLogic() {
    await titleMenu()

    start()
    setInterval(() => {
        updateWorld()
    }, 20);
}

// Starts the scene
function start() {
    scene = []
    seed = Math.random() * 10;
    
    loading = true;

    setTimeout(() => {

        genBiome()
        fillHeightMap();
        setUpWorld()

        // Generate Height maps and then choose ball and goal locations
        setTimeout(() => {
            genHeightMaps();
            spawnBallAndGoal();

            loading = false;
        }, 20);

    }, 500);
}

async function titleMenu() {
    return new Promise((resolve) => {
        loading = false;

        scene.push(new GameObject("Logo/Logo.png", 500, 500, 0, 0.5, false, "logo", -101))
        let logo = getObjByID("logo")
        logo.alwaysRender = true

        scene.push(new GameObject("Logo/LogoBack.png", 500, 500, 0, 1.5, false, "logoBack", -100))
        let logoBack = getObjByID("logoBack")
        logoBack.alwaysRender = true


        let id = setInterval(() => {
            logo.xPos = xOff + window.innerWidth / 2
            logo.yPos = ( yOff + window.innerHeight / 2 ) + 65

            logoBack.xPos = xOff + window.innerWidth / 2
            logoBack.yPos = ( yOff + window.innerHeight / 2 ) + 200
        }, 20);

        addEventListener("click", (event) => {
            clearInterval(id)
            resolve()
        })
    })
}


// Setup Biome Transpher
// if (!isMaster) {
//     fillBiome()
//     setInterval(() => {
//         let newBiome = JSON.parse(localStorage.getItem("biome"))
//         biome[newBiome.x] = newBiome.val
//     }, 2);
// }

// let biomeSendX = 0;
// let biomeSendY = 0;
// if (isMaster) { // Send Biome data
//     setInterval(() => {
//         if (biomeSendX >= worldBounds.width) {
//             biomeSendX = 0;
//         }
//         localStorage.setItem("biome", JSON.stringify({
//             x: biomeSendX,
//             val: biome[biomeSendX]
//         }))

//         biomeSendX += 1;
//     }, 5);
// }



function genBiome() {
    biome = []

    let borderWidth = 80;

    for (let x = 0; x < worldBounds.width; x++) {
        let tmp = []
        for (let y = 0; y < worldBounds.height; y++) {

            let inBounds = false;
            if (x < borderWidth || x > worldBounds.width - borderWidth) { inBounds = true; }
            if (y < borderWidth || y > worldBounds.height - borderWidth) { inBounds = true; }
            
            if (inBounds) {
                tmp.push(2) // Force the borders to be walls
            } else {
                tmp.push(
                    // Math.floor(PerlinNoise.noise(x / 700, y / 700, seed) * 10) / 10
                    PerlinNoise.noise(x / 500, y / 500, seed)
                )
            }

        }
        biome.push(tmp)
    }
}