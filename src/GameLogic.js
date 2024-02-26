let heightMap = []
function fillHeightMap() {
    heightMap = []
    for (let x = 0; x < worldBounds.width; x++) {
        let tmp = []
        for (let y = 0; y < worldBounds.height; y++) {
            tmp.push(0)
        }
        heightMap.push(tmp)
    }
}

let ballHitCount = 0;
let lastHitTime = new Date()

let ballClicked = false;
let arrowScale = 0;
let arrowRot = 0;
let arrowWobble = 0;
let wobbleRot = 0;

let wobbleGoal = false;
let wobbleGoalStart = new Date()
let wobbleGoalScaleDown = 1

let ballWindowPID = new Pid(0.1, 0, 0)
let ballWindowSize = 0

function updateWorld() {
    // console.log("update")

    scene = scene.filter(obj => obj.id !== "--DeleteMe--"); // Delete objects that need deleting 

    scene.forEach((object) => { 
        // Update Z-Index
        if (!object.physEnabled) { return; }
        object.iteratePhysics()
        object.zIndex = -object.yPos // Update Z Value
    })

    let ball = getObjByID("ball")
    let ball_shadow = getObjByID("ball_shadow")
    let hole = getObjByID("hole")
    
    try {

        // Ball Shadow follow
        ball_shadow.xPos = ball.xPos
        ball_shadow.yPos = ball.yPos
        
        if (ball.height < 1) {
            // Ball - Hole Physics
            let dist = distBetweenObjs(ball, {
                xPos: hole.xPos,
                yPos: hole.yPos - 5
            })
            if (dist < 20) {
                ball.applyVel(
                    (hole.xPos - ball.xPos) * 0.01,
                    (hole.yPos - ball.yPos) * 0.01
                )
            }
            if (dist < 5) {
                ball.deleteItem()
                ball_shadow.deleteItem()

                let flag = getObjByID("flag")
                playAudioSpatial("Goal.mp3", 0.6, flag.xPos, flag.yPos, 10)
                wobbleGoal = true;
                wobbleGoalStart = new Date()
                wobbleGoalScaleDown = 1

                setTimeout(() => {
                    start()
                }, 1000);
            }  
        }
    } catch(err) {}

    if (wobbleGoal) {
        let flag = getObjByID("flag")
        flag.rot = Math.sin((new Date().getTime() - wobbleGoalStart.getTime()) / 100) * 5 * wobbleGoalScaleDown
        wobbleGoalScaleDown -= 0.02
    }

    // Ball world collided
    if (ball.xPos < worldBounds.x1) { ball.xPos = worldBounds.x1 + 2; ball.xVel *= -1; playHardHit(ball.xVel / 10, ball.xPos, ball.yPos)}
    if (ball.xPos > worldBounds.x2) { ball.xPos = worldBounds.x2 - 2; ball.xVel *= -1; playHardHit(ball.xVel / 10, ball.xPos, ball.yPos)}

    if (ball.yPos < worldBounds.y1) { ball.yPos = worldBounds.y1 + 2; ball.yVel *= -1; playHardHit(ball.yVel / 10, ball.xPos, ball.yPos)}
    if (ball.yPos > worldBounds.y2) { ball.yPos = worldBounds.y2 - 2; ball.yVel *= -1; playHardHit(ball.yVel / 10, ball.xPos, ball.yPos)}


    // Ball Wall Colide
    try {
        let ballScale = 3
        let ballBounds = new Bounds(ball.xPos - (2 * ballScale), ball.yPos - (4 * ballScale), 4 * ballScale, 4 * ballScale)
        let edges = ballBounds.getHeightEdges()
        
        if (edges.left > ball.height) { ball.xVel = Math.abs(ball.xVel); ball.xPos += 2;        playHardHit(ball.xVel / 10, ball.xPos, ball.yPos)}
        if (edges.right > ball.height) { ball.xVel = Math.abs(ball.xVel) * -1; ball.xPos += -2; playHardHit(ball.xVel / 10, ball.xPos, ball.yPos)}
    
        if (edges.top > ball.height) { ball.yVel = Math.abs(ball.yVel); ball.yPos += 2;          playHardHit(ball.yVel / 10, ball.xPos, ball.yPos)}
        if (edges.bottom > ball.height) { ball.yVel = Math.abs(ball.yVel) * -1; ball.yPos += -2; playHardHit(ball.yVel / 10, ball.xPos, ball.yPos)}
    } catch(err) {}
    

    ball.minHeight = heightMap[Math.floor(ball.xPos)][Math.floor(ball.yPos)]
    ball_shadow.minHeight = heightMap[Math.floor(ball.xPos)][Math.floor(ball.yPos)]

    // Update Arrow
    let arrow = getObjByID("arrow")
    if (ballClicked) {
        arrow.xPos = ball.xPos
        arrow.yPos = ball.yPos - 6 - ball.height
        arrow.scale = arrowScale
        wobbleRot = Math.cos(new Date().getTime() / 200) * (arrowWobble / 50)
        arrow.rot = arrowRot + wobbleRot
    } else {
        // arrow.xPos = -100000000
        // arrow.yPos = -1
        arrow.scale = 0
    }


    // Move Ball Window
    try {
        let desiredWindowSize = 200

        if (ballClicked) {
            desiredWindowSize += arrowScale * 40
        }
        
        desiredWindowSize += (Math.abs(ball.xVel) + Math.abs(ball.yVel)) * 20
        if (desiredWindowSize > 400) { desiredWindowSize = 400}

        ballWindowSize -= ballWindowPID.iterate(ballWindowSize, desiredWindowSize)

        windowStorage[0].resizeTo(ballWindowSize, ballWindowSize)
        windowMoveCenter(0, ball.xPos, ball.yPos - ball.height)
    } catch(err) { console.log(err) }


    // Move Goal Window
    try {
        let goal = getObjByID("hole")
        let goalSize = 200
        windowStorage[1].resizeTo(goalSize, goalSize);
        windowMoveCenter(1, goal.xPos, goal.yPos)
    } catch(err) {}


}



function valPolarity(input) { return input > 0 ? 1 : -1 }
function getObjByID(id) { return scene.filter(obj => obj.id === id)[0] }
function distBetweenObjs(objectA, objectB) {
    let a = objectB.xPos - objectA.xPos
    let b = objectB.yPos - objectA.yPos
    return Math.sqrt(a * a + b * b)
}

function hitBall(xVel, yVel) {
    let ball = getObjByID("ball")
    if (Math.abs(ball.xVel) + Math.abs(ball.yVel) > 1) { return; }
    if (ball.height > ball.minHeight + 0.5) { return; }

    ball.applyVel(xVel, yVel)
    ball.heightVel = (Math.abs(xVel) + Math.abs(yVel)) / 7;
}


function mouseDown(x, y) {
    console.log("Down", x, y)   

    let ball = getObjByID("ball")
    let dist = distBetweenObjs(ball, {
        xPos: x,
        yPos: y
    })

    // Launch ball
    if (ballClicked) {
        ballClicked = false;

        let launchScale = 5;

        arrowRot = arrowRot + wobbleRot
        hitBall(
            Math.cos((arrowRot-90) * (Math.PI/180)) * arrowScale * launchScale,
            Math.sin((arrowRot-90) * (Math.PI/180)) * arrowScale * launchScale
        )
        ballHitCount++;
        lastHitTime = new Date()

        playSwing(arrowScale / 6.25, ball.xPos, ball.yPos)
    } else { 

        if (dist > 40) { return; } // Clicked on ball
        if (ball.xVel + ball.yVel > 10) { return; }

        ballClicked = true;
    }


}
function mouseUp(x, y) {
    // console.log("Up", x, y)   
}
function mouseMove(x, y) {

    // console.log(maxHeightInSurroundings({x, y}, 80))

    // console.log("Move", x, y)
    // console.log(heightMap[x][y])
    // if (!ballClicked) { return; }

    let ball = getObjByID("ball")
    let dist = distBetweenObjs(ball, {
        xPos: x,
        yPos: y
    })

    if (dist > 250) {
        arrowWobble = dist - 250
    } else {
        arrowWobble = 0
    }
    if (dist > 200) {
        dist = 200
    }

    arrowScale = dist / 32
    arrowRot = (((Math.atan2(x - ball.xPos, y - ball.yPos + 6 - ball.height) * 180) / Math.PI) + 180) * -1
}