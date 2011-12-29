
MapObject.subclass('Rock', {
  
  init: function(map) {
    this.passable = false;
    this.damageable = false;
    this._super(map);
  },
  
  instantiate: function() {
    this.entity = this.basicEntity('rock1');
  },

  setMapPos: function(x, y) {
    this._super(x, y);
    this.setRotation(x * 40 + y * 13); 
  }
  
});