class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 2;
        this.firingSpeed = 4;
        this.sfxRocket = scene.sound.add('sfx_rocket');
        console.log("new rocket");
    }

    update() {
        // Movement
        if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
        }

        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.firingSpeed;
        }
        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.scene.comboReset();
            this.reset();
        }
    }

    reset() {
        this.scene.spawnNewRocket();
        this.destroy();
    }

    fire() {
        // fire button
            if (!this.isFiring) this.sfxRocket.play();
            this.isFiring = true;
    }
}