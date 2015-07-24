function Weapon(){
    Item.call(this);
    this.attack_anim_type = 0 //some const
}

Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.onAttack = function(){
    
}