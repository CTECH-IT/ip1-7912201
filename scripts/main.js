//config for phaser - canvas 800x600, arcade physics, gravity and set the scane
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
let dy = -50;
let playerdy = 160;
let playerjump = 660;
let controlsup = false;
let clock = 0;
let clockText = "";



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
    this.load.image("smallground", "assets/smallplatform.png");
    this.load.image("verticalground", "assets/verticalplatform.png");
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

    alert("point counter, each orb adds 100 to it or something. Restarting brings back the orb.")

    this.add.image(400, 300, "sky")
    
    platforms = this.physics.add.staticGroup();
    badplatforms = this.physics.add.staticGroup();
    movingplatforms = this.physics.add.group({allowGravity: false, immovable: false});
    platformsmoving = this.physics.add.group({allowGravity: false, immovable: true});

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
    if (level != 10) {
        playerdy = 160;
        playerjump = 660;
        platforms.create(400, 568, "ground").setScale(2).refreshBody();
    } else {
        platforms.create(200, 584, "ground");
        platforms.create(600, 584, "ground");
    }
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
        if (score < 10) {
            points = this.physics.add.group({
                key: "point",
                setXY: {x: 100, y: 100, stepX: 70},
        })};

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
        if (score < 20) {
            points = this.physics.add.group({
                key: "point",
                setXY: {x: 100, y: 50, stepX: 70},
        })}
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
        if (score < 30) {
            points = this.physics.add.group({
                key: "point",
                setXY: {x: 100, y: 50, stepX: 70},
        })}
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
        if (score < 40) {
            points = this.physics.add.group({
                key: "point",
                setXY: {x: 100, y: 50, stepX: 70},
        })}
    } else if (level == 5) {
        platformsmoving.y = 300
        platformsmoving.create(800, 300, "ground")
        platforms.create(-100, 100, "ground")
        platforms.create(400, 100, "smallground");
        platforms.create(275, 100, "smallground");
        platforms.create(584, 216, "verticalground");
        platforms.create(584, 184, "verticalground");
        platforms.create(200, 300, "ground");
        platforms.create(368, 300, "ground");
        platforms.create(300, 0, "verticalground");
        stars = this.physics.add.group({
            key: "star",
            setXY: {x: 50, y: 50, stepX: 70},
        });
        if (score < 50) {
            points = this.physics.add.group({
                key: "point",
                setXY: {x: 775, y: 500, stepX: 70},
        })}
    } else if (level == 10) {
        playerdy = 80
        playerjump = 500
        player = this.physics.add.sprite(100, 450, "dude").setScale(0.5);


        stars = this.physics.add.group({
            key: "star",
            setXY: {x: 50, y: 50, stepX: 70},
        });
        if (score < 50) {
            points = this.physics.add.group({
                key: "point",
                setXY: {x: 775, y: 500, stepX: 70},
        })}
    }

    //make the guy
    if (level != 10) {
        player = this.physics.add.sprite(100, 450, "dude");
    }
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
    this.physics.add.collider(player, platformsmoving);

    //set up cursors and keys to actually register keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys( { "reset":82, "lev1":49, "lev2":50, "lev3":51, "lev4":52,"lev5":53, "lev6":54, "lev7":55, "lev8":56, "lev9":57, "lev10":48 } );;


    //stars and points can now touch the platforms too!
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(points, platforms);
    this.physics.add.collider(stars, badplatforms);
    this.physics.add.collider(points, badplatforms);

    //make the player not have collision with stars and points
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.overlap(player, points, collectPoint, null, this);

    //pretty obvious. adds the score text.
    scoreText = this.add.text(16, 16, "Points: " + score, {fontSize: "16px", fill: "#000" });

    //timer
    clockText = this.add.text(684, 16, "Time: " + clock, {fontSize: "16px", fill: "#000" });

    //for bombs. makes them a group and then adds collision
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);    
    this.physics.add.collider(bombs, badplatforms);    
    this.physics.add.collider(bombs, movingplatforms);    
    this.physics.add.collider(player, bombs, hitBomb, null, this);    
};














function update() {

    //timer is in ms or something, divide by 60 to get seconds
    clock++
    clockText.setText("Time: " + Math.floor(clock / 60));

    platformsmoving.y += dy;

    //moving platform in level 5
    if (platformsmoving.y <= -10000 || platformsmoving.y >= 10000) {
        dy = -dy
    }
    platformsmoving.setVelocityY(dy)





    //makes it so that when you press keys, stuff happens.
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        console.log(platformsmoving.y)


        player.anims.play("left", true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(playerdy);

        player.anims.play("right", true);
    } else if (cursors.down.isDown) {
        player.setVelocityY(-playerdy);

        player.anims.play("turn");
    } else {
        player.setVelocityX(0);

        player.anims.play("turn");
    }

    //only jump if you'' re on the ground
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-playerjump);
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
    if (keys.lev5.isDown) {
        level = 5;
        this.scene.stop();
        this.scene.start();
    }
    if (keys.lev6.isDown) {
        level = 6;
        this.scene.stop();
        this.scene.start();
    }
    if (keys.lev7.isDown) {
        level = 7;
        this.scene.stop();
        this.scene.start();
    }
    if (keys.lev8.isDown) {
        level = 8;
        this.scene.stop();
        this.scene.start();
    }
    if (keys.lev9.isDown) {
        level = 9;
        this.scene.stop();
        this.scene.start();
    }
    if (keys.lev10.isDown) {
        level = 10;
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