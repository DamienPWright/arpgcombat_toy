function Player(X, Y){
    Actor.call(this, X, Y, 'playerchar');
    game.physics.arcade.enable(this);
    this.body.bounce.y = 0;
    this.body.linearDamping = 1;
    this.body.collideWorldBounds = true;
    //this.body.drag = new Phaser.Point(200,200);
    //this.body.maxVelocity = new Phaser.Point(250, 250);
    this.movespeed_mod = 1.0;
    this.body.mass = 100;
    
    this.dir = 0; // 0 for left, 1 for right, 1.5 is up, 0.5 is down.
    this.abs_velocity = 0;
    this.DEF_MAXVELOCITY = 250;
    this.abs_maxvelocity = this.DEF_MAXVELOCITY;
    this.accel_rate = 50;
    this.decel_rate = 100;
    
    //Times in frames
    this.dash_cooldown_count = 0;
    this.dash_cooldown = 30;
    this.dash_time_count = 0;
    this.dash_time = 15;
    this.dash_invuln_count = 0;
    this.dash_invuln_time = 10;
    this.dash_invuln_start = 5;
    this.dash_invuln = false;
    this.dash_velocity = 750;
    this.movedir_lock = false;
    
    this.gamestate = game.state.getCurrentState();
    
    this.attackBox = {w: 16, h: 16};
    this.attackTimer;
    
    game.input.keyboard.addKey(32).onDown.add(function(){this.attack()}, this);
    
    //control setup - may migrate this to its own thing
    this.Wkey = game.input.keyboard.addKey(87);
    this.Akey = game.input.keyboard.addKey(65);
    this.Skey = game.input.keyboard.addKey(83);
    this.Dkey = game.input.keyboard.addKey(68);
    this.DashKey = game.input.keyboard.addKey(16);

    this.animations.add('idle_left', [3], 10, true);
    this.animations.add('idle_right', [0], 10, true);
    this.animations.add('run_left',[3, 4, 3, 5] , 10, true);
    this.animations.add('run_right', [0, 1, 0, 2], 10, true);
    this.animations.add('jump_left', [5], 10, true);
    this.animations.add('jump_right', [2], 10, true);
    
    //=====
    //States
    //=====
    //Idle state
    this.state_Idle = new ActorState(this);
    this.state_Idle.name = "Idle";
    this.state_Idle.onEnter = function(){
        //
    };
    this.state_Idle.onExit = function(){
    };
    this.state_Idle.update = function(){
        //this.fsm.changeState(this.actor.state_Persue);
        if(this.actor.DashKey.isDown && this.actor.dash_cooldown_count <= 0){
            this.fsm.changeState(this.actor.state_Dash);
        }
        /* 
        if(this.GuardKey.isDown && this.guard_cooldown_count <= 0){
            this.fsm.changeState(this.actor.state_Guard);
        }
        if(this.AttackKey.isDown && this.attack_cooldown_count <= 0){
            this.fsm.changeState(this.actor.state_Attack);
        }
        */
    };
    
    //Dash state
    this.state_Dash = new ActorState(this);
    this.state_Dash.name = "Dash";
    this.state_Dash.onEnter = function(){
        this.actor.movedir_lock = true;
        this.actor.abs_maxvelocity = this.actor.dash_velocity;
        this.actor.dir_angle = this.actor.dir * Math.PI;
        this.actor.body.velocity.x = this.actor.dash_velocity * Math.cos(this.actor.dir_angle) * this.actor.movespeed_mod;
        this.actor.body.velocity.y = this.actor.dash_velocity * Math.sin(this.actor.dir_angle) * this.actor.movespeed_mod;
    };
    this.state_Dash.onExit = function(){
       this.actor.dash_time_count = 0;
       this.actor.movedir_lock = false;
       this.actor.abs_maxvelocity = this.actor.DEF_MAXVELOCITY;
       this.actor.dash_cooldown_count = this.actor.dash_cooldown;
       this.actor.abs_velocity = 0;
       this.actor.body.velocity.x = 0;
       this.actor.body.velocity.y = 0;
    };
    this.state_Dash.update = function(){
        //this.fsm.changeState(this.actor.state_Persue);
        this.actor.dash_time_count++;
        if(this.actor.dash_time_count == this.actor.dash_invuln_start){
            this.actor.dash_invuln = true;
        }
        if(this.actor.dash_time_count == this.actor.dash_invuln_time + this.actor.dash_invuln_start){
            this.actor.dash_invuln = false;
        }
        if(this.actor.dash_time_count >= this.actor.dash_time){
            this.fsm.changeState(this.actor.state_Idle);
        }
    };
    
    //Guard state
    this.state_Guard = new ActorState(this);
    this.state_Guard.name = "Guard";
    this.state_Guard.onEnter = function(){
        //
    };
    this.state_Guard.onExit = function(){
    };
    this.state_Guard.update = function(){
        //this.fsm.changeState(this.actor.state_Persue);
    };
    
    //Attack state
    this.state_Attack = new ActorState(this);
    this.state_Guard.name = "Attack";
    this.state_Attack.onEnter = function(){
        //Set the movement modifier. 
        actor.movespeed_mod = 0;
    };
    this.state_Guard.onExit = function(){
        actor.movespeed_mod = 1.0;
    };
    this.state_Guard.update = function(){
        //this.fsm.changeState(this.actor.state_Persue);
    };
    
    this.fsm.changeState(this.state_Idle);
}

Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;

Player.prototype.create = function(){
    
}

Player.prototype.update = function(){
    this.updateActor();
    
        this.processControls();
    this.fsm.update();
    this.manageCooldowns();
    this.animations.play(this.updateAnimation());
};

Player.prototype.manageCooldowns = function(){
    if(this.dash_cooldown_count > 0){
        this.dash_cooldown_count--;
    }
}

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
    
    
    if(!this.movedir_lock){
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
    }
	if(this.Akey.isDown || this.Dkey.isDown || this.Skey.isDown || this.Wkey.isDown){
	    this.abs_velocity += this.accel_rate;
	    if(this.abs_velocity > this.abs_maxvelocity){
	        this.abs_velocity = this.abs_maxvelocity;
	    }
	    this.dir_angle = this.dir * Math.PI;
    	this.body.velocity.x = this.abs_velocity * Math.cos(this.dir_angle) * this.movespeed_mod;
    	this.body.velocity.y = this.abs_velocity * Math.sin(this.dir_angle) * this.movespeed_mod;
	}else{
	    if(this.abs_velocity > 0){
	        this.abs_velocity -= this.decel_rate;
	        if(this.abs_velocity < this.decel_rate){
	            this.abs_velocity = 0;
	        }
	    }
	}
	
	if(this.Akey.isDown || this.Dkey.isDown){
	    //this.body.drag.x = 0;
	}else{
	    //this.body.drag.x = 1600;
	    if(this.body.velocity.x > 0){
	        this.body.velocity.x -= this.decel_rate;
	    }
	    if(this.body.velocity.x < 0){
	        this.body.velocity.x += this.decel_rate;
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
	        this.body.velocity.y -= this.decel_rate;
	    }
	    if(this.body.velocity.y < 0){
	        this.body.velocity.y += this.decel_rate;
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