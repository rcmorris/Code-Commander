
MapObject.subclass('Beam', {
  
  init: function(map) {
    this.passable = true;
    this.damageable = false;
    this._super(map);
  },
  
  instantiate: function() {
    this.entity = this.basicEntity('beam');
  },

  setMapPos: function(x,y) {
    this._super(x,y);
    this.counter = 0;
  },
  
  onCycle: function() {
    this.counter = (this.counter + 1) % 3;
    
    var pos = this.getMapPos();
    var tank = this.map.getObject(pos.x, pos.y, 'Tank');
    if (tank) {
      tank.takeDamage(1000);
    }
  }
  
});