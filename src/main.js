let windowManager = new WindowManager()
let isMaster = windowManager.init() == 0;
windowManager.addCallbacks(mouseMove, mouseDown, mouseUp)

/** @type {GameObject[]} */
let scene = [];

let biome = [];
let seed = Math.random() * 100;


// Setup popup windows
/** @type {Window[]} */
let windowStorage = []
let windowNames = [
    "BallWindow",
    "GoalWindow"
]

if (isMaster) {
    for (let i = 0; i < windowNames.length; i++) {
        let ballWindow = window.open(window.location.href, windowNames[i], "resizable");
        ballWindow.resizeTo(10, 10);
        ballWindow.moveTo(0, 0)
        windowStorage.push(ballWindow)
    }
}

function windowMoveCenter(index, x, y) {

    // if (distBetweenObjs({xPos: x, yPos: y}, {
    //     xPos: windowStorage[index].screenLeft,
    //     yPos: windowStorage[index].screenTop
    // }) < 30) { return; }

    windowStorage[index].moveTo(
        x - (windowStorage[index].innerWidth / 2),
        y - (windowStorage[index].innerHeight / 2)
    )
}



// Scene update code
setInterval(() => {
    try {
        if (isMaster) {
            scene.sort((a, b) => b.zIndex - a.zIndex); // Sort the scene by zIndex
            if (titleScreen) {
                windowManager.setSendData(JSON.stringify({
                    scene: [],
                    bounds: worldBounds,
                    par: 0,
                    hits: 0,
                }))
            } else {
                windowManager.setSendData(JSON.stringify({
                    scene: scene,
                    bounds: worldBounds,
                    par: holePar,
                    hits: ballHitCount,
                }))
            }
            
        } else {
            let data = JSON.parse(windowManager.getRecievedData())
            scene = data.scene
            worldBounds = data.bounds
            holePar = data.par
            ballHitCount = data.hits
        }

        document.title = `Par: ${holePar} - Hits: ${ballHitCount}`

    } catch(err) { console.warn(err) }
}, 20);


// Render code
window.requestAnimationFrame(render)


if (isMaster) {
    masterLogic()
}

async function masterLogic() {
    await titleMenu()

    start()
    startAmbiance()

    setInterval(() => {
        updateWorld()
    }, 20);
}

// Starts the scene
function start() {
    scene = []
    seed = Math.random() * 10;
    ballHitCount = 0;
    
    loading = true;
    wobbleGoal = false;

    genBiome()
    fillHeightMap();
    setUpWorld()

    // Generate Height maps and then choose ball and goal locations
    genHeightMaps();
    spawnBallAndGoal();

    lastHitTime = new Date()
    loading = false;


}



async function titleMenu() {
    return new Promise((resolve) => {
        loading = false;
        titleScreen = true;

        scene.push(new GameObject("Logo/Logo.png", 500, 500, 0, 0.5, false, "logo", -101))
        let logo = getObjByID("logo")
        logo.alwaysRender = true

        scene.push(new GameObject("Logo/LogoBack.png", 500, 500, 0, 1.75, false, "logoBack", -100))
        let logoBack = getObjByID("logoBack")
        logoBack.alwaysRender = true

        scene.push(new GameObject("Logo/ClickToPlay.png", 500, 500, 0, 0.2, false, "clickToPlay", -102))
        let clickToPlay = getObjByID("clickToPlay")
        clickToPlay.alwaysRender = true;

        let id = setInterval(() => {
            let centerX = xOff + window.innerWidth / 2
            let centerY = ( yOff + window.innerHeight / 2 )

            logo.xPos = centerX
            logo.yPos = centerY + 10

            logoBack.xPos = centerX
            logoBack.yPos = centerY + 200

            clickToPlay.xPos = centerX
            clickToPlay.yPos = centerY + 150
            clickToPlay.scale = 0.3 + (Math.cos(new Date().getTime() / 1000) * 0.05)

            windowMoveCenter(0,
                window.screenLeft - 70 + Math.cos(new Date().getTime()/1000) * 100, 
                window.screenTop - 70 + Math.sin(new Date().getTime()/1000) * 100
            )

            windowMoveCenter(1, 
                window.screenLeft + window.innerWidth + 70 + Math.sin(new Date().getTime()/1000) * 100, 
                window.screenTop + window.innerHeight + 70 + Math.cos(new Date().getTime()/1000) * 100
            )

        }, 20);

        addEventListener("click", (event) => {
            clearInterval(id)
            titleScreen = false;
            resolve()
        })
    })
}


// Biome Transpher
if (false) {
    if (!isMaster) {
        fillBiome()
        setInterval(() => {
            let newBiome = JSON.parse(localStorage.getItem("biome"))
            biome[newBiome.x] = newBiome.val
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
    
}



function genBiome() {
    biome = []

    let borderWidth = 80;
    let bottomAdd = 90

    for (let x = 0; x < worldBounds.width; x++) {
        let tmp = []
        for (let y = 0; y < worldBounds.height; y++) {

            let inBounds = false;
            if (x < borderWidth || x > worldBounds.width - borderWidth) { inBounds = true; }
            if (y < borderWidth || y > worldBounds.height - borderWidth - bottomAdd) { inBounds = true; }
            
            if (inBounds) {
                tmp.push(2) // Force the borders to be walls
            } else {
                tmp.push(
                    // Math.floor(PerlinNoise.noise(x / 700, y / 700, seed) * 10) / 10
                    PerlinNoise.noise(x / 500, y / 500, seed)
                    // PerlinNoise.noise(x / 250, y / 250, seed)
                )
            }

        }
        biome.push(tmp)
    }
}
