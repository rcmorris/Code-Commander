Class.subclass('Level', {
  
  load: function(difficulty, num) {
    var level = new Level(difficulty, num);
    return level;
  },
  
  getState: function(key) {
    var state = app.settings.get('level-'+key);
    if (!state) {
      state = {};
    }
    return state;
  },  

  setState: function(key, state) {
    app.settings.set('level-'+key, state);
  },
  
  isCompleted: function(key) {
    var state = this.getState(key);
    return state.completed;
  },
  
  complete: function(key) {
    var state = this.getState(key);
    state.completed = true;
    this.setState(key, state);
  },
  
  difficulties: function() {
    var res = [];
    for (var d in App.LEVELS) {
      res.push(d);
    }
    return res;
  },
  
  levelCount: function(difficulty) {
    return App.LEVELS[difficulty].length; 
  },
  
  key: function(difficulty, num) {
    var info = App.LEVELS[difficulty][num];
    if (info) {
      return info.key;
    } else {
      return null;
    } 
  }
  
}, {
  
  init: function(difficulty, num) {
    this.difficulty = difficulty;
    this.num = num;
    this.loadData();
  },
  
  loadData: function() {
    var data = App.LEVELS[this.difficulty][this.num];
    this.key = data.key;
    this.name = data.name;
    this.map = new Map(data.map);
    this.program = new Program(this);
    
    $('#title').html('Level: ' + this.name);
  },
  
  unload: function() {
    this.map.destroy();
  },
  
  win: function() {
    this.program.running = false;
    Level.complete(this.key);
    setTimeout(function() {
      app.overlay.displayPage('win'); 
    }, 1000);
  },
  
  lose: function() {
    this.program.running = false;
    setTimeout(function() {
      app.overlay.displayPage('lose'); 
    }, 1000);
  }
  
});

App.LEVELS = {
  
  intro: [
    {
      key: 'intro-0',
      name: 'Fire!',
      map: [
        '......T.',
        'T...B...',
        '........',
        '.....T..',
        '..T.....',
        '.T.....T',
        '....^...',
        '......T.'
      ]
    },

    {
      key: 'intro-1',
      name: 'Turn, Then Fire!',
      map: [
        '......T.',
        'T.......',
        '........',
        '.....T..',
        '..T.....',
        '.T.....T',
        '..^...B.',
        '......T.'
      ]
    },

    {
      key: 'intro-2',
      name: 'Moving Around',
      map: [
        '......T.',
        'R.......',
        '........',
        '.....T..',
        '..T.....',
        '.T....BT',
        '...R.T..',
        '..^T..T.'
      ]
    },
    
    {
      key: 'intro-3',
      name: 'Move A Lot',
      map: [
        '.....|..',
        '>....|R.',
        '...|.|..',
        '...|.|..',
        '...|...B',
        '.R.|R...',
        '...|.TT.',
        'T..|..T.'
      ]
    },
    
    {
      key: 'intro-4',
      name: 'Trees Go Boom',
      map: [
        '.R.TTTTT',
        '..TT.B.T',
        '...T...T',
        '.T.TTTTT',
        'R.......',
        '....T...',
        '..>.....',
        '.....R..'
      ]
    },
    
    {
      key: 'intro-5',
      name: 'Mines Go Boom, Too',
      map: [
        '........',
        '...|.*<*',
        '.B.|..*T',
        '...|....',
        '---+R...',
        '......T.',
        '.T......',
        '...RT...'
      ]
    }    
  
  ],
  
  beginner: [

    {
      key: 'beginner-0',
      name: 'Mines',
      map: [
        'R...T...',
        '.RTT....',
        'TB..*T..',
        '...|....',
        '.--+^...',
        '..T....T',
        '...T....',
        '.....R..'
      ]
    },

    {
      key: 'beginner-1',
      name: 'Secret Entrance',
      map: [
        '.RvR....',
        '......T.',
        '--*.....',
        '.T..*...',
        '..TR----',
        '......+.',
        '....+.B.',
        '......+.'
      ]
    },

    {
      key: 'beginner-2',
      name: 'Maze',
      map: [
        'R.......',
        '...T..<.',
        '........',
        '..R..T.R',
        'RT.R.RR.',
        '.RT.R...',
        'R.....T.',
        'TT..R.B.'
      ]
    },

    {
      key: 'beginner-3',
      name: 'Beam Towers Never Wait',
      map: [
        '....T...',
        '......T.',
        '.B....R.',
        '..TR..O.',
        '.T......',
        '..O...O.',
        'T.|...|.',
        '..|.^.|.'
      ]
    },

    {
      key: 'multi-tower',
      name: 'Tower Tangle',
      map: [
        '..OO.TRT',
        '>......R',
        'RROO..O.',
        '.TTO..O.',
        '.T......',
        '.....T..',
        'T...T.B.',
        '..R.....'
      ]
    }
    
  ]
  
}