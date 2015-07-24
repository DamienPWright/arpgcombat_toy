HOR_RES = 800;
VER_RES = 600;

//game consts
EQUIPTYPE_NOEQUIP = 0;
EQUIPTYPE_WEAPON = 1;
EQUIPTYPE_ARMOR = 2;
EQUIPTYPE_ARMORSLOT = 3;

ITEMTYPE_JUNK = 0;
ITEMTYPE_GEAR = 1;
ITEMTYPE_CONSUMABLE = 2;
ITEMTYPE_MATERIAL = 3;
ITEMTYPE_QUEST = 4;

WEAPONANIM_SWORD = 0;

//source: http://stackoverflow.com/questions/1726630/javascript-formatting-number-with-exactly-two-decimals
function round(value, exp){
    if (typeof exp === undefined || +exp === 0)
        return Math.round(value);
        
    value = +value;
    exp = +exp;
    
    if(isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
        return NaN;
        
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));
    
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}