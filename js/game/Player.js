function Player(X, Y){
    Actor.call(this, X, Y, 'playerchar');
    game.physics.arcade.enable(this);
    this.body.bounce.y = 0;
    this.body.linearDamping = 1;
    this.body.collideWorldBounds = true;
    //this.body.drag = new Phaser.Point(200,200);
    this.body.maxVelocity = new Phaser.Point(250, 250);
    this.body.mass = 100;
    this.gamestate = game.state.getCurrentState();
    
    this.dir = 0; // 0 for left, 1 for right.
    this.accel_rate = 50;
    this.decel_rate = 100;
    
    this.attackBox = {w: 16, h: 16};
    this.attackTimer;
    
    game.input.keyboard.addKey(32).onDown.add(function(){this.attack()}, this);
    
    //control setup - may migrate this to its own thing
    this.Wkey = game.input.keyboard.addKey(87);
    this.Akey = game.input.keyboard.addKey(65);
    this.Skey = game.input.keyboard.addKey(83);
    this.Dkey = game.input.keyboard.addKey(68);
    /*
    this.Wkey.onDown.add(this.keyPressed, this);
    this.Akey.onDown.add(this.keyPressed, this);
    this.Skey.onDown.add(this.keyPressed, this);
    this.Dkey.onDown.add(this.KeyPressed, this);
    */
    this.animations.add('idle_left', [3], 10, true);
    this.animations.add('idle_right', [0], 10, true);
    this.animations.add('run_left',[3, 4, 3, 5] , 10, true);
    this.animations.add('run_right', [0, 1, 0, 2], 10, true);
    this.animations.add('jump_left', [5], 10, true);
    this.animations.add('jump_right', [2], 10, true);
}

Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;

Player.prototype.create = function(){
    
}

Player.prototype.update = function(){
    this.updateActor();
    this.processControls();
    this.animations.play(this.updateAnimation());
};

Player.prototype.updateAnimation = function(){
    var anim = 'idle_right';
    var onground = this.body.blocked.down || this.body.touching.down;
    if(onground)
    //if (this.body.onFloor())
    {
        if(this.body.velocity.x != 0){
            if(this.dir == 0){
                anim = 'run_left';
            }else{
                anim = 'run_right';
            }
        }else{
            if(this.dir == 0){
                anim = 'idle_left';
            }else{
                anim = 'idle_right';
            }
        }
    }else{
        if(this.dir == 0){
            anim = 'jump_left';
        }else{
            anim = 'jump_right';
        }
    }
    return anim;
};

Player.prototype.processControls = function(){
    this.body.acceleration.x = 0;
    this.body.acceleration.y = 0;
    /*
    if (this.Akey.isDown)
    {
        this.body.acceleration.x = -200;
        this.dir = 0;
    }
    else if (this.Dkey.isDown)
    {
        this.body.acceleration.x = 200;
        this.dir = 1;
    }
    if (this.Wkey.isDown)
    {
        this.body.acceleration.y = -200;
        this.dir = 0;
    }
    else if (this.Skey.isDown)
    {
        this.body.acceleration.y = 200;
        this.dir = 1;
    }
    */
    if (this.Akey.isDown && this.Wkey.isDown) {
		this.dir = 1.25;
	}else if (this.Akey.isDown && this.Skey.isDown)  {
		this.dir = 0.75;
	}else if (this.Dkey.isDown && this.Wkey.isDown)  {
		this.dir = 1.75;
	}else if (this.Dkey.isDown && this.Skey.isDown)  {
		this.dir = 0.25;
	}else if (this.Akey.isDown) {
		this.dir = 1;
	}else if (this.Dkey.isDown) {
		this.dir = 0;
	}else if (this.Wkey.isDown) {
		this.dir = 1.5;
	}else if (this.Skey.isDown) {
		this.dir = 0.5;
	}
	
	if(this.Akey.isDown || this.Dkey.isDown || this.Skey.isDown || this.Wkey.isDown){
	    this.dir_angle = this.dir * Math.PI;
    	this.body.velocity.x += this.accel_rate * Math.cos(this.dir_angle);
    	this.body.velocity.y += this.accel_rate * Math.sin(this.dir_angle);
	}
	
	if(this.Akey.isDown || this.Dkey.isDown){
	    //this.body.drag.x = 0;
	}else{
	    //this.body.drag.x = 1600;
	    if(this.body.velocity.x > 0){
	        this.body.velocity.x -= this.accel_rate;
	    }
	    if(this.body.velocity.x < 0){
	        this.body.velocity.x += this.accel_rate;
	    }
	    
	    //make sure resting speed is 0
    	if(this.body.velocity.x > -this.decel_rate && this.body.velocity.x < this.decel_rate){
	        this.body.velocity.x = 0;
	    }
	}
	
	if(this.Skey.isDown || this.Wkey.isDown){
	    
	    //this.body.drag.y = 0;
	}else{
	    //this.body.drag.y = 1600;
	   
	    if(this.body.velocity.y > 0){
	        this.body.velocity.y -= this.accel_rate;;
	    }
	    if(this.body.velocity.y < 0){
	        this.body.velocity.y += this.accel_rate;
	    }
    	
        //make sure resting speed is 0
    	if(this.body.velocity.y > -this.decel_rate && this.body.velocity.y < this.decel_rate){
	        this.body.velocity.y = 0;
	    }
	}
	
	if(this.Akey.isDown && this.body.velocity.x > 0){
	    this.body.velocity.x += -this.accel_rate * 2;
	}
	if(this.Dkey.isDown && this.body.velocity.x < 0){
	    this.body.velocity.x += this.accel_rate * 2;
	}
	if(this.Wkey.isDown && this.body.velocity.y > 0){
	    this.body.velocity.y += -this.accel_rate * 2;
	}
	if(this.Skey.isDown && this.body.velocity.y < 0){
	    this.body.velocity.y += this.accel_rate * 2;
	}
    
    //limiter
    if(this.body.velocity.x > this.body.maxVelocity.x){
        this.body.velocity.x = this.body.maxVelocity.x;
        
    }else if(this.body.velocity.x < -this.body.maxVelocity.x){
        this.body.velocity.x = -this.body.maxVelocity.x;
    }
    
    if(this.body.velocity.y > this.body.maxVelocity.y){
        this.body.velocity.y = this.body.maxVelocity.y;
    }else if(this.body.velocity.y < -this.body.maxVelocity.y){
        this.body.velocity.y = -this.body.maxVelocity.y;
    }
    
    //console.log(this.body.maxVelocity.x);
    
}

Player.prototype.attack = function(evt){
     //create hitbox depending on facing.
     var hbx;
     var hby;
     var stabeffect;
     if(this.dir == 0){
         hbx = this.x - this.attackBox.w;
         stabeffect = new Stab(player.x - player.width, player.y + (player.height / 2), this.dir);
     }else{
         hbx = this.x + this.width;
         stabeffect = new Stab(player.x + player.width, player.y + (player.height / 2), this.dir);
     }
     if(stabeffect){
         game.add.existing(stabeffect);
     }
     hby = this.y + (this.height / 2) - this.attackBox.h / 2;
     this.gamestate.createHitBox(hbx, hby, this.attackBox.w, this.attackBox.h, true, 50);
}

Player.prototype.onDeath = function(){
    game.state.start('gameover');
}