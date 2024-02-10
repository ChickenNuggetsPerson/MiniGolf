let audioStorage = {}

let audioNames = [
    "HardHit1.wav",
    "HardHit2.wav",
    "HardHit3.wav"
]


function playAudioSpatial(name, soundLevel, x, y, z) {
    // audioStorage[name].volume = soundLevel
    // audioStorage[name].play()
    if (soundLevel < 0.1) { return; }

    let sound = new Howl({
        src: ["Audio/" + name],
        volume: soundLevel * 2,
        autoplay: true,
    });
    sound.pos(
        ((x - (worldBounds.width / 2)) / (worldBounds.width)) * 2, 
        z,
        ((y - (worldBounds.height / 2)) / (worldBounds.height)) * 2, 
        
    )
}
function playAudio(name, soundLevel) {
    // audioStorage[name].volume = soundLevel
    // audioStorage[name].play()
    if (soundLevel < 0.1) { return; }
    
    new Howl({
        src: ["Audio/" + name],
        volume: soundLevel,
        autoplay: true,
    });
}

function playHardHit(level, x, y) {
    playAudioSpatial(`HardHit${randomIntInRange(1, 3)}.wav`, Math.abs(level), x, y + 100, 10)
}
function playGrassHit(level, x, y) {
    playAudioSpatial(`GrassHit${randomIntInRange(1, 2)}.mp3`, Math.abs(level), x, y + 100, 10)
}


/** @type {Audio[]} */
let ambiance = []

let ambianceSystemID = 0;
function startAmbiance() {
    stopAmbiance()
    
    playAudio("Ambiance/nature1.wav", 0.3)

    ambianceSystemID = setInterval(() => {
        playAudio("Ambiance/nature1.wav", 0.3)
    }, 1000 * 60);
}
function stopAmbiance() {
    clearInterval(ambianceSystemID)
}




function randomIntInRange(start, stop) {
    return start + Math.round(Math.random() * (stop - start))
}