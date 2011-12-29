
MapObject.subclass('BeamTower', {
  
  init: function(map) {
    this.passable = false;
    this.damageable = false;
    this._super(map);
  },
  
  instantiate: function() {
    this.entity = this.basicEntity('tower-on1');
  },
  
  setMapPos: function(x,y) {
    // Set up
    this._super(x,y);
    this.counter = 0;
    
    // Add in beams between us and all nearby towers
    var map = this.map;
    var dirs = [Dir.UP, Dir.RIGHT, Dir.DOWN, Dir.LEFT];
    for (var i = 0; i < 4; i ++) {
      var dir = dirs[i];
      var pos = this.getMapPos();
      map.addDir(pos,dir,1);
      var done = false;
      while (!done && map.onMap(pos)) {
        var hasTower = map.getObject(pos.x, pos.y, 'BeamTower');
        var hasBeam = map.getObject(pos.x, pos.y, 'BeamTower');
        if (hasTower) {
          done = true
        }
        map.addDir(pos,dir,1);
      }
    }
  },
  
  onCycle: function() {
    this.counter = (this.counter + 1) % 3;
    var sprites = ['tower-off', 'tower-on1', 'tower-on2', 'tower-on3'];
    for (var i = 0; i < sprites.length; i++) {
      this.entity.removeComponent(sprites[i], false);
    }
    this.entity.addComponent('tower-on' + (this.counter + 1));
  }
  
});