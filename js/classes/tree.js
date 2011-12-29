
MapObject.subclass('Tree', {
  
  init: function(map) {
    this.passable = false;
    this.damageable = true;
    this._super(map);
  },
  
  instantiate: function() {
    this.entity = this.basicEntity('tree');
  },

  setMapPos: function(x, y) {
    this._super(x, y);
    this.setRotation(x * 100 + y * 12); 
  }
});