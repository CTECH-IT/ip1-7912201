//config for phaser - canvas 600x600, arcade physics, gravity and set the scane
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//variables. cursors is for arrow keys, keys are for other key presses.
//level is to define what level it is, 0 is title screen.
let game = new Phaser.Game(config);
let platforms;
let movingplatforms;
let player;
let cursors;
let keys;
let stars;
let points;
let score = 0;
let scoreText = "";
let bombs;
let level = 0;
let dy = 2
let controlsup = false;



//preloads all the images in the /assets folder.
function preload() {
    this.load.image("sky", "assets/sky.png");

    this.load.image("title", "assets/title.png");
    this.load.image("gameover", "assets/gameover.png");
    this.load.image("tenpoints", "assets/tenpoints.png");
    this.load.image("controls", "assets/controls.png");
    this.load.image("badground", "assets/badground.png");
    this.load.image("controlbutton", "assets/controlbutton.png");
    this.load.image("backbutton", "assets/backbutton.png");

    this.load.image("ground", "assets/platform.png");
    this.load.image("movingground", "assets/movingplatform.png");
    this.load.image("movingground2", "assets/movingplatform2.png");
    this.load.image("badplatform", "assets/badplatform.png");

    this.load.image("star", "assets/star.png");
    this.load.image("point", "assets/point.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png", 
        { frameWidth: 32, frameHeight: 48 });
}

function create() {
    this.add.image(400, 300, "sky")
    
    platforms = this.physics.add.staticGroup();
    badplatforms = this.physics.add.staticGroup();
    movingplatforms = this.physics.add.group({allowGravity: false, immovable: false});
    
    //makes it so the game doesn't crash when there isn't a star or point
    stars = this.physics.add.group({
        key: "star",
        setXY: {x: -600, y: 500, stepX: 70}     
    })
    points = this.physics.add.group({
        key: "point",
        setXY: {x: -100, y: 500, stepX: 70},
    });

    //if level is 0, add the title, controls, and star.
    //else if the level is x, make level x
    platforms.create(400, 568, "ground").setScale(2).refreshBody();
    if (level == 0) {
        this.add.image(400, 150, "title")
        stars = this.physics.add.group({
            key: "star",
            setXY: {x: 600, y: 500, stepX: 70}     
        });

        const controlsButton = this.add.image(400, 570, "controlbutton");
        controlsButton.setInteractive();
        controlsButton.on("pointerdown", ()=> {if (controlsup == false) {
            this.add.image(400, 300, "controls"), 
            this.add.image(400, 570, "backbutton"), 
            controlsup = true
            } else { 
                   
                this.scene.stop();
                controlsup = false;
                this.scene.start();}});

    } else if (level == 1) {
        platforms.create(600, 400, "ground");
        platforms.create(60, 250, "ground");
        platforms.create(750, 250, "ground"); 
        this.add.image(210, 150, "tenpoints") 
        stars = this.physics.add.group({
            key: "star",
            setXY: {x: 700, y: 150, stepX: 70},
        });
        points = this.physics.add.group({
            key: "point",
            setXY: {x: 100, y: 100, stepX: 70},
        });

    } else if (level == 2) {
        this.add.image(450, 170, "badground")
        badplatforms.create(600, 250, "badplatform");
        platforms.create(100, 400, "ground");
        platforms.create(800, 250, "ground");
        platforms.create(250, 250, "ground"); 
        platforms.create(100, 100, "ground");
        stars = this.physics.add.group({
            key: "star",
            setXY: {x: 700, y: 150, stepX: 70},
        });
        points = this.physics.add.group({
            key: "point",
            setXY: {x: 100, y: 50, stepX: 70},
        });
    } else if (level == 3) {
        movingplatforms.create(600, 315, "movingground2")
        platforms.create(900, 450, "ground");
        platforms.create(700, 150, "ground");
        platforms.create(250, 300, "ground"); 
        platforms.create(100, 150, "ground");
        stars = this.physics.add.group({
            key: "star",
            setXY: {x: 700, y: 50, stepX: 70},
        });
        points = this.physics.add.group({
            key: "point",
            setXY: {x: 100, y: 50, stepX: 70},
        });
    } else if (level == 4) {
        movingplatforms.create(250, 450, "movingground2")
        movingplatforms.create(400, 350, "movingground2")
        movingplatforms.create(550, 250, "movingground2")
        movingplatforms.create(650, 150, "movingground2")
        platforms.create(900, 100, "ground")

        stars = this.physics.add.group({
            key: "star",
            setXY: {x: 750, y: 50, stepX: 70},
        });
        points = this.physics.add.group({
            key: "point",
            setXY: {x: 100, y: 50, stepX: 70},
        });
    }

    //make the guy
    player = this.physics.add.sprite(100, 450, "dude");

    //this is to make the stars bounce, and allow all of them to have the
    //same effect when touched.
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    })
    
    points.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });



    //bouncy guy!
    player.setBounce(0.2);
    
    //and now he's stuck in the game! >:)
    player.setCollideWorldBounds(true)

    //create the frames for the guy running and not running.
    this.anims.create({
        key: "left",
    
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3}),
    
        frameRate: 10,
    
        repeat: -1
    });
    
    this.anims.create({
        key: "turn",
    
        frames: [{key: "dude", frame: 4}],
    
        frameRate: 20,
    });
    
    this.anims.create({
        key: "right",
    
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8}),
    
        frameRate: 10,
    
        repeat: -1
    });

    //make the guy stand on platforms and the bad ones kill you!
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, badplatforms, touchBadPlatforms, null, this);
    this.physics.add.collider(player, movingplatforms, touchMovingPlatforms);

    //set up cursors and keys to actually register keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys( { 'lev1':49, 'lev2':50, 'lev3':51, 'lev4':52, 'reset':82 } );;


    //stars and points can now touch the platforms too!
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(points, platforms);
    this.physics.add.collider(stars, badplatforms);
    this.physics.add.collider(points, badplatforms);

    //make the player not have collision with stars and points
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.overlap(player, points, collectPoint, null, this);

    //pretty obvious. adds the score text.
    scoreText = this.add.text(16, 16, "score: " + score, {fontSize: "16px", fill: "#000" });

    //for bombs. makes them a group and then adds collision
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);    
    this.physics.add.collider(bombs, badplatforms);    
    this.physics.add.collider(bombs, movingplatforms);    
    this.physics.add.collider(player, bombs, hitBomb, null, this);    
};




function update() {
    //makes it so that when you press keys, stuff happens.
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play("left", true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play("right", true);
    } else if (cursors.down.isDown) {
        player.setVelocityY(500);

        player.anims.play("turn");
    } else {
        player.setVelocityX(0);

        player.anims.play("turn");
    }

    //only jump if you'' re on the ground
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-660);
    }


    //this is for skipping to levels. 
    if (keys.lev1.isDown) {
        level = 1;
        this.scene.stop();
        this.scene.start();
    }
    if (keys.lev2.isDown) {
        level = 2;
        this.scene.stop();
        this.scene.start();
    }
    if (keys.lev3.isDown) {
        level = 3;
        this.scene.stop();
        this.scene.start();
    }
    if (keys.lev4.isDown) {
        level = 4;
        this.scene.stop();
        this.scene.start();
    }
    if (keys.reset.isDown) {
        this.scene.stop();
        this.scene.start();
    }

    if (level == 3) {
    }

    


};


//if you collect a star, go to the next level
function collectStar(player, star) {
    star.disableBody(true, true)

    level++;
    this.scene.stop();
    this.scene.start();
}

//if you get points, make the points counter go up.
function collectPoint(player, point) {
    point.disableBody(true, true)

    score += 10;
    scoreText.setText("Points: " + score);
};

//if you're hit with a bomb, the game stops.
function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");

    this.add.image(400, 300, "gameover")
};

function touchBadPlatforms() {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");

    this.add.image(400, 300, "gameover")

};

function touchMovingPlatforms() {
    movingplatforms.immovable = true
}