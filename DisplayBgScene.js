class DisplayBgScene extends Phaser.Scene {
    constructor() {
        super("displayBackground");
    }

    preload() {
        this.load.image("spring", "assets/bg/spring.png");
        this.load.image("autumn", "assets/bg/fall.png");
        this.load.image("summer", "assets/bg/summer.png");
        this.load.image("winter", "assets/bg/winter.png");

        this.load.audio("winter", "assets/music/winter.mp3");
        this.load.audio("ocean-waves", "assets/music/ocean-waves.mp3");
        this.load.audio("autumn", "assets/music/autumn.mp3");
        this.load.audio("spring", "assets/music/spring.mp3");
    }

    create() {
        var randomNum = Phaser.Math.Between(0,3);
        var camWidth = this.cameras.main.width/2;
        var camHeight =  this.cameras.main.height/2;
        if (randomNum === 0) {
            this.bg = this.add.image(camWidth, camHeight, "winter");
            this.music1 = this.sound.add("winter");
            this.music1.play(musicConfig);
        }
        else if(randomNum === 1) {
            this.bg = this.add.image(camWidth, camHeight, "spring");
            this.music2 = this.sound.add("spring");
            this.music2.play(musicConfig);
        }
        else if(randomNum === 2) {
            this.bg = this.add.image(camWidth, camHeight, "summer");
            this.music3 = this.sound.add("ocean-waves");
            this.music3.play(musicConfig);
        }
        else if(randomNum === 3) {
            this.bg = this.add.image(camWidth, camHeight, "autumn");
            this.music4 = this.sound.add("autumn");
            this.music4.play(musicConfig);
        } 
        let scaleX = this.cameras.main.width / this.bg.width;
        let scaleY = this.cameras.main.height / this.bg.height;
        let scale = Math.max(scaleX, scaleY);
        this.bg.setScale(scale).setScrollFactor(0);
        const { width, height } = this.scale;
        const x = width * 0.5; 
        const y = height * 0.7;
    }

    update() {
        
    }

    randomBg() {
        
    }

    
}