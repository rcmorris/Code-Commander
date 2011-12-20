// Our main application
Class.subclass('App', {
  
  SPRITES: {
    tank: [0,0]
  },
  
  start: function() {
    // Do any final class-level setup
    Class.classesLoaded();
    
    // Create our app instance
    var app = new App();
    
    // Load our resources
    Crafty.load([
      '/images/tank.png'
    ], function() {
      app.setup();
    });
    
    // All set, return a reference
    return app;
  }
  
}, {
  
  setup: function() {
    // Initialize Crafty
    Crafty.init(64*8, 64*8);
    Crafty.canvas.init();
    
    // Set up our libraries and resources
    this.setupSettings();
    this.setupAudio();
    this.setupSprites();
    this.setupControls();

    this.tank = Crafty.e('2D, Canvas, Tween, tank').attr({x: 4*64, y: 7*64, w: 64, h: 64, rotation: 90}).origin(32, 32);
    this.tank.tween({x: 4*64, y: 5*64}, 70);
    //this.tank.tween({rotation: 86}, 20);
  },

  setupSettings: function() {
    this.settings = Settings;
  },
  
  setupAudio: function() {
    this.audio = new Sound(this);
  },
  
  setupSprites: function() {
    Crafty.sprite(64, '/images/tank.png', App.SPRITES);
  },

  setupControls: function() {
    var self = this;
    
    $('#audio-toggle').click(function() {
      self.audio.muteAll(!self.audio.muted);
      $(this).trigger('update-ui');
    }).bind('update-ui', function() {
      var muted = self.audio.muted;
      $(this).removeClass('on').removeClass('off').addClass(muted ? 'off' : 'on');
    }).trigger('update-ui');
    
    $('#run-button').click(function() {
      self.runProgram();
    });
  },

  runProgram: function() {
    this.audio.play('program', {pan: 90});
    var program = new Program();
    program.run();
  },
  
  tileCenter: function(x, y) {
    return {x: x*64+32, y: y*64+32};
  }
  
});