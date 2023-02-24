let gameOptions = {
    fieldSize: 10,
    seasonIcons: 6,
    seasonSize: 100,
    swapSpeed: 200,
    fallSpeed: 100,
    destroySpeed: 100,
}

let musicConfig = {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0,
}

var config = {
    type: Phaser.AUTO,
    backgroundColor: 0x540b0e,
    scene: [LoadingScene, LoadScenes, DisplayBgScene, GameProperScene, TimerScene, ],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        }
    },
    dom: {
        createContainer: true
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        max: {width:1920, height: 1080},
        width: 2048,
        height: 1080
    },
}

var game = new Phaser.Game(config);