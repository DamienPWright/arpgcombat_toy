function Armor(X, Y, key){
    Phaser.Sprite.call(this, game, X, Y, key);
}

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;