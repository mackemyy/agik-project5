class TimerScene extends Phaser.Scene {
    constructor() {
        super('displayTimer');
    }

    create() {
        this.initialTime = 150;
        this.text = this.add.text(1200, 450, 'Timer: ' + this.formatTime(this.initialTime), { fontFamily: '"Poppins"', fontSize: "50px"}),
        this.timedEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onEvent,
            callbackScope: this,
            loop: true
        });

        this.minutes;
        this.partInSeconds;
        console.log("for minutes");
        console.log(this.minutes);
        console.log("for secs");
        console.log(this.partInSeconds);
        if(this.minutes === '0' && this.partInSeconds === '0') {
            this.scene.pause("gameProper");
        }
        
    }

    formatTime(seconds) {
        this.minutes = Math.floor(seconds/60);
        this.partInSeconds = seconds%60;
        this.partInSeconds = this.partInSeconds.toString().padStart(2, '0');
        return `${this.minutes}:${this.partInSeconds}`;
    }

    onEvent() {
        this.initialTime -= 1;
        this.text.setText('Timer: ' + this.formatTime(this.initialTime), { fontFamily: '"Poppins"', fontSize: "50px"});
    }
}