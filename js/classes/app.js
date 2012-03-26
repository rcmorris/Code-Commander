// Our main application
Class.subclass('App', {
  
  SPRITES: {
    tank: [0,3],
    turret: [7,3],
    tree: [1,0],
    base: [2,0],
    mine: [7,0],
    rock1: [0,1],
    rock2: [1,1],
    'wall-horizontal': [2,1],
    'wall-vertical': [3,1],
    'wall-corner': [4,1],
    bullet: [7,1],
    'tower-off': [0,2],
    'tower-on1': [1,2],
    'tower-on2': [2,2],
    'tower-on3': [3,2],
    'tower-beam-h': [4,2],
    'tower-beam-v': [5,2]
  },
  
  start: function() {
    // Do any final class-level setup
    Class.classesLoaded();
    
    // Create our app instance
    var app = new App();
    
    // Load our resources
    Crafty.load([
      '/images/sprites.png'
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
    this.setupOverlay();
    this.setupSettings();
    this.setupAudio();
    this.setupSprites();
    this.setupControls();

    // Start us up
    if (!this.settings.get('name')) {
      this.overlay.displayPage('enter-name');
    } else {
      this.overlay.displayPage('welcome');
    }
  },

  setupOverlay: function() {
    this.overlay = new Overlay();
  },

  setupSettings: function() {
    this.settings = Settings;
  },
  
  setupAudio: function() {
    this.audio = new Sound(this);
  },
  
  setupSprites: function() {
    Crafty.sprite(64, '/images/sprites.png', App.SPRITES);
    Crafty.sprite(90, '/images/explosion-sprites.png', {explosion: [0,0]});
  },

  setupControls: function() {
    var self = this;
    
    $('#program').val('');
    
    $('#audio-toggle').click(function() {
      self.audio.muteAll(!self.audio.muted);
      $(this).trigger('update-ui');
    }).bind('update-ui', function() {
      var muted = self.audio.muted;
      $(this).removeClass('on').removeClass('off').addClass(muted ? 'off' : 'on');
    }).trigger('update-ui');
    
    $('#help-button').click(function() {
      self.overlay.displayPage('help-programming');
    });
    $('#run-button').click(function() {
      self.runProgram();
    });
    $('#select-button').click(function() {
      self.selectLevel();
    });

    $('#reset-button').click(function() {
      if (confirm('Reset all progress?')) {
        self.settings.deleteAll();
        self.overlay.displayPage('enter-name');
      }
    });
    $('#about-button').click(function() {
      self.overlay.displayPage('about');
    });
  },
  
  selectLevel: function() {
    this.overlay.displayPage('select-level');
  },

  loadLevel: function(difficulty, num) {
    this.overlay.hide();
    if (this.level) {
      this.level.unload();
    }
    this.level = Level.load(difficulty, num);
    this.map = this.level.map;
    this.program = this.level.program;
  },
  
  resetLevel: function() {
    if (this.level) {
      this.loadLevel(this.level.difficulty, this.level.num); 
    }
  },
  
  runProgram: function() {
    if (!this.level) { return; }
    //this.audio.play('program', {pan: 90});
    this.program.run();
  }
    
});