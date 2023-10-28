class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile scripts
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('spaceshipPro', './assets/spaceshipPro.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 720, 'starfield').setOrigin(0, 0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height-borderUISize-borderPadding, 'rocket').setOrigin(0.5, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Add 4 spaceships
        this.shipPro = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceshipPro', 0, 30, game.settings.spaceshipSpeed*1.3).setOrigin(0, 0);
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*6, 'spaceship', 0, 10, game.settings.spaceshipSpeed).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*7+borderPadding*2, 'spaceship', 0, 10, game.settings.spaceshipSpeed).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*8+borderPadding*4, 'spaceship', 0, 10, game.settings.spaceshipSpeed).setOrigin(0, 0);

        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //initialize score
        this.p1Score = 0;
        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        };
        this.scoreLeft = this.add.text(game.config.width/2-borderPadding*3, borderUISize + borderPadding*2, this.p1Score, this.scoreConfig);

        this.scoreConfig.fixedWidth = 200;
        this.scoreConfig.align = "center";
        this.comboMultText = this.add.text(game.config.width/2+borderUISize*1.5, borderUISize + borderPadding*2, 1 +"x COMBO", this.scoreConfig);
        this.comboMultIndex = 0;
        this.comboArray = [1, 2, 3, 5, 10, 20];

        this.gameOver = false;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2+64, 'Press (R) to Restart or <- for Menu', this.scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        
        this.scoreConfig.fixedWidth = 40;
        this.timeLeft = this.add.text(borderUISize*2, borderUISize + borderPadding*2, this.clock.getRemainingSeconds(), this.scoreConfig).setOrigin(0.5, 0);

        this.scoreConfig.fixedWidth = 0;


    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;
        if (!this.gameOver) {
            if (this.p1Rocket != null) this.p1Rocket.update();
            if (this.newP1Rocket != null) this.newP1Rocket.update();
            this.shipPro.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            if(!this.p1Rocket.isFiring) this.newP1Rocket = new Rocket(this, this.p1Rocket.x, this.p1Rocket.y, 'rocket').setOrigin(0.5, 0);
            this.p1Rocket.fire();
        }

        if (this.p1Rocket != null) {
            if(this.checkCollision(this.p1Rocket, this.ship03)) {
                this.p1Rocket.reset();
                this.shipExplode(this.ship03);
            }
            else if(this.checkCollision(this.p1Rocket, this.ship02)) {
                this.p1Rocket.reset();
                this.shipExplode(this.ship02);
            }
            else if(this.checkCollision(this.p1Rocket, this.ship01)) {
                this.p1Rocket.reset();
                this.shipExplode(this.ship01);
            }
            else if(this.checkCollision(this.p1Rocket, this.shipPro)) {
                this.p1Rocket.reset();
                this.shipExplode(this.shipPro);
            }
        }


        //Update timer
        this.timeLeft.text = Math.ceil(this.clock.getRemainingSeconds());
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    spawnNewRocket() {
        this.p1Rocket = this.newP1Rocket;
        this.newP1Rocket = null;
    }

    changeScore(points) {
        this.p1Score += points * this.comboArray[this.comboMultIndex];
        if (this.comboMultIndex != this.comboArray.length-1) this.comboMultIndex++;
        this.comboMultText.text = this.comboArray[this.comboMultIndex]+"x COMBO";
        this.scoreLeft.text = this.p1Score;
        let currentTime = this.clock.getRemaining();
        this.clock.remove(false);
        this.clock = this.time.delayedCall(currentTime+500, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2+64, 'Press (R) to Restart or <- for Menu', this.scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    comboReset() {
        this.comboMultIndex = 0;
        this.comboMultText.text = this.comboArray[this.comboMultIndex]+"x COMBO";
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        this.changeScore(ship.points);
        this.sound.play('sfx_explosion');
    }
}