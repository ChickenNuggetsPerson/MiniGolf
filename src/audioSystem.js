
let soundMult = 2

function playAudioSpatial(name, soundLevel, x, y, z) {
    // audioStorage[name].volume = soundLevel
    // audioStorage[name].play()
    if (soundLevel < 0.1) { return; }

    let sound = new Howl({
        src: ["Audio/" + name],
        volume: soundLevel * 2 * soundMult,
        autoplay: true,
    });
    sound.pos(
        ((x - (worldBounds.width / 2)) / (worldBounds.width)) * 0.4, 
        z,
        ((y - (worldBounds.height / 2)) / (worldBounds.height)) * 0.4, 
    )
    
}
function playAudio(name, soundLevel) {

    if (soundLevel < 0.1) { return; }
    
    new Howl({
        src: ["Audio/" + name],
        volume: soundLevel * soundMult,
        autoplay: true,
    });
}
function playAudioStream(name, soundLevel) {

    if (soundLevel < 0.1) { return; }
    
    new Howl({
        src: ["Audio/" + name],
        volume: soundLevel * soundMult,
        autoplay: true,
        html5: true
    });
}

function playHardHit(level, x, y) {
    playAudioSpatial(`BallSounds/HardHit${randomIntInRange(1, 3)}.wav`, Math.abs(level), x, y + 100, 10)
}
function playGrassHit(level, x, y) {
    playAudioSpatial(`BallSounds/GrassHit${randomIntInRange(1, 2)}.mp3`, Math.abs(level), x, y + 100, 10)
}
function playSwing(level, x, y) {
    console.log(level)
    if (level < 0.4) {
        playAudioSpatial("Swings/SoftHit.wav", 0.3, x, y)
    } else {
        playAudioSpatial("Swings/HardHit.wav", 0.3, x, y)
    }
}



let ambianceSystemID = 0;
function startAmbiance() {
    stopAmbiance()
    
    playAudioStream("Ambiance/nature1.wav", 0.3)

    ambianceSystemID = setInterval(() => {
        playAudioStream("Ambiance/nature1.wav", 0.3)
    }, 1000 * 60);
}
function stopAmbiance() {
    clearInterval(ambianceSystemID)
}




function randomIntInRange(start, stop) {
    return start + Math.round(Math.random() * (stop - start))
}