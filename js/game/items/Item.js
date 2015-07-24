function Item(equiptype){
    if(equiptype){
        this.equiptype = equiptype
    }else{
        this.equiptype = EQUIPTYPE_NOEQUIP;
    }
}