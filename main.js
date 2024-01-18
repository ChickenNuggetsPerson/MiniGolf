let windowManager = new WindowManager()
let isMaster = windowManager.init() == 0;

let scene = [ new GameObject("test.gif") ];

scene[0].xPos = 300
scene[0].yPos = 300

// Scene update code
setInterval(() => {
    try {
        if (isMaster) {
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
    setInterval(() => {
        updateWorld()
    }, 20);
}

let spriteNames = ["test.gif"]
let images = {}
spriteNames.forEach((name) => {
    let img = document.createElement("img")
    img.src = "./Sprites/" + name
    images[name] = img
})


var c = document.getElementById("canvas");
var ctx = c.getContext("2d");


let xOff = 0
let yOff = 0

let xPID = new Pid(0.3, 0, 0)
let yPID = new Pid(0.3, 0, 0)

function render() {
    c.width = window.innerWidth
    c.height = window.innerHeight

    ctx.fillStyle = "#68ed40";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    xOff -= xPID.iterate(xOff, window.screenLeft)
    yOff -= yPID.iterate(yOff, window.screenTop)

    scene.forEach((object) => {
        ctx.drawImage(images[object.spriteStr], object.xPos - xOff, object.yPos - yOff, 200, 200)
    })

}


function updateWorld() {
    console.log("update")
    scene.forEach((object) => {
        object.xPos += Math.cos(new Date().getTime() / 500) * 5
        object.yPos += Math.sin(new Date().getTime() / 500) * 5
    })
}