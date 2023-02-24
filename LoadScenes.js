
class LoadScenes extends Phaser.Scene{
    constructor() {
        super("playGame");
    }
    
    create() {
        this.scene.start("displayBackground");
        this.scene.start("gameProper");
        this.scene.start("displayTimer");
    }
}