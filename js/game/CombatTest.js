function CombatTest(){
   this.map;
   this.tileset;
   this.layer;
   this.wall_layer;
   this.bkg_layer;
  
   this.cursors;
   this.spaceBar;
   
    //actors and groups
    this.p;
    this.enemies;
    this.bullets;
    this.hitboxes_friendly;
    this.hitboxes_unfriendly;
    this.hitboxes_seek;
    this.items;
    this.hazards;
    
    //hud
    this.hud;
}

CombatTest.prototype.preload = function() {
   //examples
   //game.load.spritesheet('goal', 'assets/img/sprites/goal.png', 32, 24);
   //game.load.image('spikes', 'assets/img/sprites/spikes.png', 32, 32);
};

CombatTest.prototype.create = function() {
    
   //scoreText = game.add.text(16, 16, 'Level 1', {fontSize: '32px', fill: '#FFF'});
  
   
   //Physics
   game.physics.startSystem(Phaser.Physics.ARCADE);
   //game.physics.arcade.gravity.y = 250; //Enable if gravity is required.
    
    
   game.stage.backgroundColor = "#000000";
   //init();
    //init sprite groups
    this.enemies = game.add.group();
    this.hitboxes_unfriendly = game.add.group();
    this.hitboxes_friendly = game.add.group();
    this.hitboxes_seek = game.add.group();
    
   //make player
   playerchar = new Player(0,0);
   player = game.add.existing(playerchar)
   this.p = player;
   game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
   
   //load objects from the map
   //this.createObjectsFromMap();
   
    //game.add.existing(this.goal);
   
   
   
    //controls
    this.cursors = game.input.keyboard.createCursorKeys();
    this.wKey = game.input.keyboard.addKey(32);
    this.aKey = game.input.keyboard.addKey(32);
    this.sKey = game.input.keyboard.addKey(32);
    this.dKey = game.input.keyboard.addKey(32);
    this.spaceBar =  game.input.keyboard.addKey(32);
    
    //this.hud = new HUD();
};

CombatTest.prototype.update = function() {
   // game.physics.arcade.collide(this.p, this.wall_layer);
    //game.physics.arcade.collide(this.p, this.enemies);
    //game.physics.arcade.collide(this.enemies, this.wall_layer);
    
    //game.physics.arcade.overlap(this.hitboxes_friendly, this.enemies, this.onFriendlyOverlapWithEnemy);
    //game.physics.arcade.overlap(this.hitboxes_unfriendly, this.p, this.onUnfriendlyOverlapWithPlayer);
    //this.hud.update();
};

CombatTest.prototype.render = function(){
     //debug - due to the scaling it has to be done before pixel.context.drawImage or else it will be drawn underneath!
    //this.hitboxes_friendly.forEachExists(this.renderGroup, this, 0);
    //this.hitboxes_unfriendly.forEachExists(this.renderGroup, this, 1);
    //this.hitboxes_seek.forEachExists(this.renderGroup, this, 2);
    //pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width, pixel.height);
    game.debug.text("Debug Info", 10, 10);
    game.debug.text("Player", 10, 25);
    game.debug.text('x: ' + Math.round(this.p.x) + ' y: ' + Math.round(this.p.y), 10,40);
    game.debug.text('xvel: ' + Math.round(this.p.body.velocity.x) + ' yvel: ' + Math.round(this.p.body.velocity.y) + " dir:" + this.p.dir, 10,55);
    game.debug.text("State: " + this.p.fsm.currentState.name, 10, 70);
    game.debug.text("Weapon: TBI", 10, 85);
};

CombatTest.prototype.debug = function(){
    
};

CombatTest.prototype.renderGroup = function(member, n){
    switch(n){
        case 0:
            game.debug.body(member, 'rgba(0,255,0,0.4)');
            break;
        case 1:
            game.debug.body(member, 'rgba(255,0,0,0.4)');
            break;
        case 2:
            game.debug.body(member, 'rgba(0,200,200,0.4)');
            break;
    }
   
};

CombatTest.prototype.createHitBox = function(X, Y, W, H, friendly, lifespan, seek){
    var spr = game.add.sprite(X, Y, 'blanksprite');
    game.physics.enable(spr, Phaser.Physics.ARCADE);
    spr.body.immovable = true;
    spr.body.allowGravity = false;
    spr.width = W;
    spr.height = H;
    spr.lifespan = lifespan;
    //spr.body.setSize(W, H, 0, 0);
    spr.renderable = false;
    //spr.visible = false;
    if(seek){
        this.hitboxes_seek.add(spr);
        return spr;
    }
    if(friendly){
        this.hitboxes_friendly.add(spr);
        console.log("added?")
    }else{
        this.hitboxes_unfriendly.add(spr);
    }
    return spr;
};

CombatTest.prototype.onHitboxOverlapSprite = function(hb, spr){
    if(hb.friendly){
       console.log("enemy was hit!"); 
    }else if(!hb.friendly){
       console.log("player was hit!");
    }
    hb.destroy();
}

CombatTest.prototype.onFriendlyOverlapWithEnemy = function(hb, ene){
    console.log("enemy was hit! " + ene);
    hb.destroy();
    ene.takeDamage();
    ene.blinking = true;
}

CombatTest.prototype.onUnfriendlyOverlapWithPlayer = function(plyr, hb){
    
    hb.destroy();
    if(!player.blinking){
        player.takeDamage();
        player.blinking = true;
        game.state.getCurrentState().hud.updateLifeBar();
    }
    
}

CombatTest.prototype.onPlayerReachGoal = function(){
    game.state.start("gameclear");
}

CombatTest.prototype.incrementScore = function(pts){
    if(pts){
        this.hud.updateScore(pts);
    }
}

