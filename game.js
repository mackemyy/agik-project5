let gameOptions = {
    fieldSize: 10,
    seasonIcons: 6,
    seasonSize: 100,
    swapSpeed: 200,
    fallSpeed: 100,
    destroySpeed: 100,
}

var config = {
    type: Phaser.AUTO,
    backgroundColor: 0x540b0e,
    scene: [Scene1, Scene2, Scene3],
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