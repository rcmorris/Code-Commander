
Class.subclass('MapObject', {
  
  init: function(map, attrs) {
    this.map = map;
    
    this.entity = null;
    
    // Default State
    if (this.dir === undefined) { this.dir = Dir.UP; }
    this.x = null;
    this.y = null;
    this.hitpoints = 1;
    if (this.passable === undefined) { this.passable = false; }
    if (this.damageable === undefined) { this.damageable = true; }
    
    this.instantiate();
  },
  
  // Override this function in your derived classes to build
  // a Crafty entity to represent this object on the map...
  instantiate: function() {
    return null;
  },
  
  destroy: function() {
    this.map.removeObject(this);
    if (this.entity) {
      this.entity.destroy();
    }
  },
  
  basicEntity: function(sprite) {
    var e = Crafty.e('2D, Canvas, ' + sprite)
    e.attr({w: 64, h: 64, rotation: 0});
    e.origin(32, 32);
    return e;
  },
  
  animate: function(defs) {
    this.entity.requires('SpriteAnimation');
    for (var id in defs) {
      var def = defs[id];
      var anim = this.entity.animate(id, def.spriteColRange[0], def.spriteRow, def.spriteColRange[1]);
      anim.loop = def.loop;
      anim.duration = def.duration;
      if (def.autoplay) {
        var autoStartFn = function() {
  				if (!this.isPlaying()) {
  					this.animate(id, anim.duration, (anim.loop === true) ? -1 : anim.loop);
  					this.unbind('EnterFrame', autoStartFn);
					}
  			};
  			anim.bind("EnterFrame", autoStartFn);
  		} 
    }    
  },
  
  onCycle: function() {
    // Overridden in derived classes to do per-cycle upkeep, tests, etc.
  },
  
  onDestroy: function() {
    // Called when blown up, etc.  Override to do cool things
  },
  
  isPassable: function() {
    return this.passable;
  },
  
  isDamageable: function() {
    return this.damageable;
  },
  
  takeDamage: function(amt) {
    if (this.isDamageable()) {
      this.hitpoints -= amt;
      if (this.hitpoints <= 0) {
        this.explode();
      }
    }
  },
  
  explode: function() {
    app.program.lock();
    app.audio.play('explosion');
    var self = this;
    var explosion = new Explosion(this.map);
    explosion.setMapPos(this.getMapPos());
    this.tween({alpha: 0}, 30, function() {
      self.onDestroy();
      self.destroy();
      app.program.unlock();
    });
  },
  
  getMap: function() {
    return this.map;
  },
  
  setMap: function(map) {
    this.map = map;
  },
  
  getDir: function() {
    return this.dir;
  },
  
  setDir: function(dir) {
    this.dir = dir;
    this.setRotation(dir.toDegrees());
  },
  
  getMapPos: function() {
    return {x: this.x, y: this.y};
  },

  setMapPos: function(x, y) {
    if (y === undefined) {
      y = x.y;
      x = x.x;
    }

    // Move on map (will remove from old location)
    this.map.addObject(this, x, y);

    // Set new map pos, display pos
    this.x = x;
    this.y = y;
    this.setPos(x*64, y*64);
  },
  
  getPos: function() {
    return {x: this.entity.x, y: this.entity.y};
  },
  
  setPos: function(x, y) {
    if (y === undefined) {
      y = x.y;
      x = x.x;
    }
    this.entity.attr({x: x, y: y});
  },
  
  setRotation: function(degrees) {
    this.entity.attr({rotation: degrees}); 
  },
  
  tween: function(attrs, duration, callback) {
    // Start the tween
    this.entity.requires('Tween');
    this.entity.tween(attrs,duration);
    // Set up callback to run once at end of tweening...
    if (callback) {
      var self = this;
      var onceFn = function() {
        self.entity.unbind('TweenEnd', onceFn);
        setTimeout(function() {callback.call(self);}, 50);
      };
      this.entity.bind('TweenEnd', onceFn);
    }
  }
  
});