let collisionWorld = []
function fillCollisionWorld() {
    for (let x = 0; x < worldBounds.width; x++) {
        let tmp = []
        for (let y = 0; y < worldBounds.height; y++) {
            tmp.push(0)
        }
        collisionWorld.push(tmp)
    }
}

function updateWorld() {
    console.log("update")

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
        }
    }
}




function getObjByID(id) { return scene.filter(obj => obj.id === id)[0] }
function distBetweenObjs(objectA, objectB) {
    let a = objectB.xPos - objectA.xPos
    let b = objectB.yPos - objectA.yPos
    return Math.sqrt(a * a + b * b)
}

function hitBall(xVel, yVel) {
    let ball = getObjByID("ball")
    if (Math.abs(ball.xVel) + Math.abs(ball.yVel) > 1) { return; }
    ball.applyVel(xVel, yVel)
    ball.heightVel = (Math.abs(xVel) + Math.abs(yVel)) / 7;
}


function mouseDown(x, y) {
    console.log("Down", x, y)   

    let ball = getObjByID("ball")
    hitBall(
        (x - ball.xPos) * 0.1,
        (y - ball.yPos) * 0.1
    )
    // ball.deleteItem()
}
function mouseUp(x, y) {
    // console.log("Up", x, y)   
}
function mouseMove(x, y) {
    // console.log("Move", x, y)
    console.log(biome[x][y])

}