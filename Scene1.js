const LightBlue = 0x7EFFE0

class Scene1 extends Phaser.Scene {
    constructor() {
        super("startGame");
    }

    preload() {
        this.load.image("background", "assets/bg/start.png");
        this.load.image("startButton", "assets/startButton.png");
        this.load.audio("start-game", "assets/music/start-game.mp3");
    }

    create() {
        this.bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, "background");
        let scaleX = this.cameras.main.width / this.bg.width;
        let scaleY = this.cameras.main.height / this.bg.height;
        let scale = Math.max(scaleX, scaleY);
        this.bg.setScale(scale).setScrollFactor(0);
        // var button =  new Button(this, 150, 500, {txt: 'HI', txtcolor: '#ffffff', texture: 'gui_btns', txtsize: '4em', });
        const { width, height } = this.scale;
        const x = width * 0.5; 
        const y = height * 0.7;

        const left = this.add.rectangle (x - 50, y, 40, 75, LightBlue, 1);
        const right = this.add.rectangle (x + 50, y, 40, 75, LightBlue, 1);
        const middle = this.add.rectangle (x, y, 40, 75, LightBlue, 1);


            this.leftSpinner = this.add.tween({
                targets: left,
                scaleY: 2,
                duration: 100,
                repeat: 4,
                repeatDelay: 300,
                yoyo: true,
                ease: Phaser.Math.Easing.Bounce.InOut,
                onComplete: function() {
                    left.alpha = 0;
                },
                callbackScope: this
            });
    
            this.middleSpinner = this.add.tween({
                targets: middle,
                scaleY: 2,
                duration: 100,
                delay: 100,
                repeat: 4,
                repeatDelay: 300,
                yoyo: true,
                ease: Phaser.Math.Easing.Bounce.InOut,
                onComplete: function() {
                    middle.alpha = 0;
                },
                callbackScope: this
            });
    
            this.rightSpinner = this.add.tween({
                targets: right,
                scaleY: 2,
                duration: 100,
                delay: 200,
                repeat: 4,
                repeatDelay: 300,
                yoyo: true,
                ease: Phaser.Math.Easing.Bounce.InOut,
                onComplete: function() {
                    right.alpha = 0;
                    this.startButton = this.add.image(1020,750, "startButton");
                    this.startButton.setInteractive({useHandCursor: true})
                    .on('pointerdown', () => this.goToNextScene())
                    .on('pointerover', () => this.startButton.setPosition(1010, 740))
                    .on('pointerout', () => this.startButton.setPosition(1020,750));
                },
                callbackScope: this,
            });
            this.startMusic = this.sound.add("start-game");
            if (this.sound.locked) {
                var text = this.add.text(840, 840, 'Tap anywhere to unlock audio', { fontFamily: '"Poppins', fill: '#ffffff', fontSize: '25px' });
                this.sound.once('unlocked', function () {
                text.destroy();
                this.playSound();},this);
            } else {
                this.playSound();
            }
    }

    playSound() {
        var musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0,
        }
        this.startMusic.play(musicConfig);
    }

    goToNextScene() {
        this.scene.start("playGame");
        this.startMusic.stop();
    }
    
}