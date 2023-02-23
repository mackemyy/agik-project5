const HORIZONTAL = 1;
const VERTICAL = 2;
var score = 0;
var scoreText;

class Scene2 extends Phaser.Scene{
    constructor() {
        super("playGame");
    }
    
    preload() {
    
        this.load.image("spring", "assets/bg/spring.png");
        this.load.image("fall", "assets/bg/fall.png");
        this.load.image("summer", "assets/bg/summer.png");
        this.load.image("winter", "assets/bg/winter.png");
        this.load.spritesheet("seasons", "assets/sprites/SEASONS_3.png", {
            frameWidth: gameOptions.seasonSize,
            frameHeight: gameOptions.seasonSize,
        });
        this.load.audio("winter", "assets/music/winter.mp3");
        this.load.audio("ocean-waves", "assets/music/ocean-waves.mp3");
        this.load.audio("autumn", "assets/music/autumn.mp3");
        this.load.audio("spring", "assets/music/spring.mp3");
    }
    
    create() {
        var randomNum = Phaser.Math.Between(0,3);
        var camWidth = this.cameras.main.width/2;
        var camHeight =  this.cameras.main.height/2;
        var musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0,
        }
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
            this.bg = this.add.image(camWidth, camHeight, "fall");
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

        this.canPick = true;
        this.dragging = false;
        this.drawField();
        this.selectedSeason = null;
        this.input.on("pointerdown", this.seasonSelect, this);
        this.input.on("pointermove", this.startSwipe, this);
        this.input.on("pointerup", this.stopSwipe, this);
        scoreText = this.add.text(1200, 500, 'Score: 0', {
            fontSize: '100px', fill: '#fff', fontFamily: '"Poppins"', 
        });
    }

    drawField() {
        this.gameArray = [];
        this.poolArray = [];
        this.seasonGroup = this.add.group();
        for(let i = 0; i < gameOptions.fieldSize; i++) {
            this.gameArray[i] = [];
            for(let j = 0; j < gameOptions.fieldSize; j++) {
                let season = this.add.sprite(gameOptions.seasonSize * j + gameOptions.seasonSize / 2, gameOptions.seasonSize * i + gameOptions.seasonSize / 2, "seasons");
                this.seasonGroup.add(season);
                do {
                    let randomSeasonIcon = Phaser.Math.Between(0, gameOptions.seasonIcons - 1);
                    season.setFrame(randomSeasonIcon);
                    this.gameArray[i][j] = {
                        seasonIcon: randomSeasonIcon,
                        seasonSprite: season,
                        isEmpty: false
                    }
                } while(this.isMatch(i,j));
            }
        }
    }

    isMatch(row, col) {
        return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
    }
    isHorizontalMatch(row, col) {
        return this.seasonAt(row, col).seasonIcon == this.seasonAt(row, col - 1).seasonIcon && this.seasonAt(row, col).seasonIcon == this.seasonAt(row, col - 2).seasonIcon;
    }
    isVerticalMatch(row, col) {
        return this.seasonAt(row, col).seasonIcon == this.seasonAt(row - 1, col).seasonIcon && this.seasonAt(row, col).seasonIcon == this.seasonAt(row - 2, col).seasonIcon;
    }
    seasonAt(row, col) {
        if(row < 0 || row >= gameOptions.fieldSize || col < 0 || col >= gameOptions.fieldSize) {
            return -1;
        }
        return this.gameArray[row][col];
    }
    seasonSelect(pointer) {
        if(this.canPick) {
            this.dragging = true;
            let row = Math.floor(pointer.y / gameOptions.seasonSize);
            let col = Math.floor(pointer.x / gameOptions.seasonSize);
            let pickedSeason = this.seasonAt(row, col);
            if(pickedSeason != -1){
                if(this.selectedSeason == null){
                    pickedSeason.seasonSprite.setScale(1.2);
                    pickedSeason.seasonSprite.setDepth(1);
                    this.selectedSeason = pickedSeason;
                }
                else{
                    if(this.areTheSame(pickedSeason, this.selectedSeason)){
                        this.selectedSeason.seasonSprite.setScale(1);
                        this.selectedSeason = null;
                    }
                    else{
                        if(this.areNext(pickedSeason, this.selectedSeason)){
                            this.selectedSeason.seasonSprite.setScale(1);
                            this.swapSeasons(this.selectedSeason, pickedSeason, true);
                        }
                        else{
                            this.selectedSeason.seasonSprite.setScale(1);
                            pickedSeason.seasonSprite.setScale(1.2);
                            this.selectedSeason = pickedSeason;
                        }
                    }
                }
            }
        }
    }
    startSwipe(pointer) {
        if(this.dragging && this.selectedSeason != null) {
            let deltaX = pointer.downX - pointer.x;
            let deltaY = pointer.downY - pointer.y;
            let deltaRow = 0;
            let deltaCol = 0;
            if(deltaX > gameOptions.seasonSize / 2 && Math.abs(deltaY) < gameOptions.seasonSize / 4){
                deltaCol = -1;
            }
            if(deltaX < -gameOptions.seasonSize / 2 && Math.abs(deltaY) < gameOptions.seasonSize / 4){
                deltaCol = 1;
            }
            if(deltaY > gameOptions.seasonSize / 2 && Math.abs(deltaX) < gameOptions.seasonSize / 4){
                deltaRow = -1;
            }
            if(deltaY < -gameOptions.seasonSize / 2 && Math.abs(deltaX) < gameOptions.seasonSize / 4){
                deltaRow = 1;
            }
            if(deltaRow + deltaCol != 0){
                let pickedSeason = this.seasonAt(this.getSeasonRow(this.selectedSeason) + deltaRow, this.getSeasonCol(this.selectedSeason) + deltaCol);
                if(pickedSeason != -1){
                    this.selectedSeason.seasonSprite.setScale(1);
                    this.swapSeasons(this.selectedSeason, pickedSeason, true);
                }
            }
        }
    }
    stopSwipe() {
        this.dragging = false;
    }
    areTheSame(season1, season2) {
        return this.getSeasonRow(season1) == this.getSeasonRow(season2) && this.getSeasonCol(season1) == this.getSeasonCol(season2);
    }
    getSeasonRow(season){
        return Math.floor(season.seasonSprite.y / gameOptions.seasonSize);
    }
    getSeasonCol(seaon) {
        return Math.floor(seaon.seasonSprite.x / gameOptions.seasonSize);
    }
    areNext(season1, season2) {
        return Math.abs(this.getSeasonRow(season1) - this.getSeasonRow(season2)) + Math.abs(this.getSeasonCol(season1) - this.getSeasonCol(season2)) == 1;
    }
    swapSeasons(season1, season2, swapBack){
        this.swappingSeasons = 2;
        this.canPick = false;
        this.dragging = false;
        let fromColor = season1.seasonIcon;
        let fromSprite = season1.seasonSprite;
        let toColor = season2.seasonIcon;
        let toSprite = season2.seasonSprite;
        let season1Row = this.getSeasonRow(season1);
        let season1Col = this.getSeasonCol(season1);
        let season2Row = this.getSeasonRow(season2);
        let season2Col = this.getSeasonCol(season2);
        this.gameArray[season1Row][season1Col].seasonIcon = toColor;
        this.gameArray[season1Row][season1Col].seasonSprite = toSprite;
        this.gameArray[season2Row][season2Col].seasonIcon = fromColor;
        this.gameArray[season2Row][season2Col].seasonSprite = fromSprite;
        this.tweenSeason(season1, season2, swapBack);
        this.tweenSeason(season2, season1, swapBack);
    }
    tweenSeason(season1, season2, swapBack) {
        let row = this.getSeasonRow(season1);
        let col = this.getSeasonCol(season1);
        this.tweens.add({
            targets: this.gameArray[row][col].seasonSprite,
            x: col * gameOptions.seasonSize + gameOptions.seasonSize / 2,
            y: row * gameOptions.seasonSize + gameOptions.seasonSize / 2,
            duration: gameOptions.swapSpeed,
            callbackScope: this,
            onComplete: function(){
                this.swappingSeasons--;
                if(this.swappingSeasons == 0){
                    if(!this.matchInBoard() && swapBack){
                        this.swapSeasons(season1, season2, false);
                    }
                    else{
                        if(this.matchInBoard()){
                            this.handleMatches();
                        }
                        else{
                            this.canPick = true;
                            this.selectedSeason = null;
                        }
                    }
                }
            }
        });
    }
    matchInBoard(){
        for(let i = 0; i < gameOptions.fieldSize; i ++){
            for(let j = 0; j < gameOptions.fieldSize; j ++){
                if(this.isMatch(i, j)){
                    return true;
                }
            }
        }
        return false;
    }
    handleMatches(){
        this.removeMap = [];
        for(let i = 0; i < gameOptions.fieldSize; i ++){
            this.removeMap[i] = [];
            for(let j = 0; j < gameOptions.fieldSize; j ++){
                this.removeMap[i].push(0);
            }
        }
        score += 10;
        scoreText.setText('Score: ' + score);
        this.markMatches(HORIZONTAL);
        this.markMatches(VERTICAL);
        this.destroySeasons();
    }
    markMatches(direction) {
        for(let i = 0; i < gameOptions.fieldSize; i++) {
            let seasonIconStreak = 1;
            let currentSeasonIcon = -1;
            let startStreak = 0;
            let seasonIconToWatch = 0;
            for(let j = 0; j < gameOptions.fieldSize; j ++){
                if(direction == HORIZONTAL){
                    seasonIconToWatch = this.seasonAt(i, j).seasonIcon;
                } else{
                    seasonIconToWatch = this.seasonAt(j, i).seasonIcon;
                }
                if(seasonIconToWatch == currentSeasonIcon){
                    seasonIconStreak++;
                }
                if(seasonIconToWatch != currentSeasonIcon || j == gameOptions.fieldSize - 1){
                    if(seasonIconStreak >= 3){
                        for(let k = 0; k < seasonIconStreak; k ++){
                            if(direction == HORIZONTAL){
                                this.removeMap[i][startStreak + k] ++;
                            }
                            else{
                                this.removeMap[startStreak + k][i] ++;
                            }
                        }
                    }
                    startStreak = j;
                    seasonIconStreak = 1;
                    currentSeasonIcon = seasonIconToWatch;
                }
            }
        }
    }
    destroySeasons() {
        let destroyed = 0;
        for(let i = 0; i < gameOptions.fieldSize; i ++){
            for(let j = 0; j < gameOptions.fieldSize; j ++){
                if(this.removeMap[i][j] > 0){
                    destroyed ++;
                    this.tweens.add({
                        targets: this.gameArray[i][j].seasonSprite,
                        alpha: 0.5,
                        duration: gameOptions.destroySpeed,
                        callbackScope: this,
                        onComplete: function(){
                            destroyed--;
                            this.gameArray[i][j].seasonSprite.visible = false;
                            this.poolArray.push(this.gameArray[i][j].seasonSprite);
                            if(destroyed == 0){
                                this.makeSeasonsFall();
                                this.replenishField();
                            }
                        }
                    });
                    this.gameArray[i][j].isEmpty = true;
                }
            }
        }
    }
    makeSeasonsFall(){
        for(let i = gameOptions.fieldSize - 2; i >= 0; i --){
            for(let j = 0; j < gameOptions.fieldSize; j ++){
                if(!this.gameArray[i][j].isEmpty){
                    let fallTiles = this.holesBelow(i, j);
                    if(fallTiles > 0){
                        this.tweens.add({
                            targets: this.gameArray[i][j].seasonSprite,
                            y: this.gameArray[i][j].seasonSprite.y + fallTiles * gameOptions.seasonSize,
                            duration: gameOptions.fallSpeed * fallTiles
                        });
                        this.gameArray[i + fallTiles][j] = {
                            seasonSprite: this.gameArray[i][j].seasonSprite,
                            seasonIcon: this.gameArray[i][j].seasonIcon,
                            isEmpty: false
                        }
                        this.gameArray[i][j].isEmpty = true;
                    }
                }
            }
        }
    }
    holesBelow(row, col){
        let result = 0;
        for(let i = row + 1; i < gameOptions.fieldSize; i ++){
            if(this.gameArray[i][col].isEmpty){
                result ++;
            }
        }
        return result;
    }
    replenishField(){
        let replenished = 0;
        for(let j = 0; j < gameOptions.fieldSize; j ++){
            let emptySpots = this.holesInCol(j);
            if(emptySpots > 0){
                for(let i = 0; i < emptySpots; i ++){
                    replenished ++;
                    let randomSeasonIcon = Phaser.Math.Between(0, gameOptions.seasonIcons - 1);
                    this.gameArray[i][j].seasonIcon = randomSeasonIcon;
                    this.gameArray[i][j].seasonSprite = this.poolArray.pop()
                    this.gameArray[i][j].seasonSprite.setFrame(randomSeasonIcon);
                    this.gameArray[i][j].seasonSprite.visible = true;
                    this.gameArray[i][j].seasonSprite.x = gameOptions.seasonSize * j + gameOptions.seasonSize / 2;
                    this.gameArray[i][j].seasonSprite.y = gameOptions.seasonSize / 2 - (emptySpots - i) * gameOptions.seasonSize;
                    this.gameArray[i][j].seasonSprite.alpha = 1;
                    this.gameArray[i][j].isEmpty = false;
                    this.tweens.add({
                        targets: this.gameArray[i][j].seasonSprite,
                        y: gameOptions.seasonSize * i + gameOptions.seasonSize / 2,
                        duration: gameOptions.fallSpeed * emptySpots,
                        callbackScope: this,
                        onComplete: function(){
                            replenished--;
                            if(replenished == 0){
                                if(this.matchInBoard()){
                                    this.time.addEvent({
                                        delay: 250,
                                        callback: this.handleMatches()
                                    });
                                }
                                else{
                                    this.canPick = true;
                                    this.selectedSeason = null;
                                }
                            }
                        }
                    });
                }
            }
        }
    }
    holesInCol(col) {
        var result = 0;
        for(let i = 0; i < gameOptions.fieldSize; i ++){
            if(this.gameArray[i][col].isEmpty){
                result ++;
            }
        }
        return result;
    }
}