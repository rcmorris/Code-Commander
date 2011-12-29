Class.subclass('Overlay', {
  
  init: function() {
    this.bgNode = $('#overlay');
    this.contentNode = $('#overlay-contents'); 
  },
  
  display: function(html) {
    this.contentNode.html(html);
    this.show();
  },
  
  show: function() {
    this.bgNode.show();
    this.contentNode.show();
  },
  
  hide: function() {
    this.bgNode.hide();
    this.contentNode.hide();
  },
  
  displayPage: function(name) {
    var builder = new OverlayBuilder();
    Overlay.PAGES[name].call(this, builder);
    var html = builder.render();
    this.display(html);
  }
  
});

Class.subclass('OverlayBuilder', {
  
  init: function() {
    this.buffer = '';
  },
  
  render: function() {
    return this.buffer;
  },
  
  h1: function(txt) {
    return this.html("<h1>" + txt + "</h1>\n");
  },
  
  p: function(txt) {
    return this.html("<p>" + txt + "</p>\n");
  },

  text: function(name, value) {
    var html = '<input type="text" id="'+name+'" name="'+name+'"';
    if (value) { html += ' value="' + value + '"'; }
    html += '></input>';
    return this.html(html);
  },
  
  button: function(name, onclick, icon) {
    return this.html('<button onclick="'+onclick+'">'+name+'</button>');
  },
  
  html: function(txt) {
    this.buffer += txt;
    return this; 
  }
  
});

Overlay.PAGES = {
  'enter-name': function(p) {
    var saveCmd = "app.settings.set('name', $('#name').val());app.overlay.displayPage('welcome');";
    
    p.h1('Welcome Commander')
      .p('Enter your name to begin your tests:')
      .text('name')
      .p('Click "Save" when you are done.')
      .button('Save', saveCmd);
  },
  
  'welcome': function(p) {
    p.h1('Welcome ' + app.settings.get('name') + '!')
      .p('In this game, you command a robot tank that must destroy the enemy base.')
      .button('Select Level', "app.overlay.displayPage('select-level');");
  },
  
  'select-level': function(p) {
    var diffs = Level.difficulties();
    var levels = '<table class="indent">';
    for (var d = 0; d < diffs.length; d++) {
      var diff = diffs[d];
      var count = Level.levelCount(diff);
      levels += '<tr>';
      levels += '<td style="vertical-align: middle;width: 100px;">' + diff.toUpperCase() + '</td>';
      levels += '<td>';
      for (var num = 0; num < count; num++) {
        var klass = 'level';
        if (Level.isCompleted(Level.key(diff, num))) {
          klass += ' completed'; 
        }
        levels += '<div class="'+klass+'" onclick="app.loadLevel(\''+diff+'\', '+num+')">' + (num + 1) + '</div>'; 
      }
      levels += '</td>';
      levels += '</tr>'; 
    }
    levels += '</table>';
    
    p.h1('Select a Level')
      .p('Click on a level number to begin.')
      .html(levels)
      .p('<i>Higher numbers are harder</i>');
  },
  
  'win': function(p) {
    p.h1('You Win!!!')
      .p('Congratulations!  See if you can beat the next level!')
      .button('Next Level');
  },
  
  'lose': function(p) {
    p.h1('Try Again')
      .p('You did not destroy the base - keep working on your program and try again!')
      .button('Retry', 'app.resetLevel()')
      .button('Select Level', "app.overlay.displayPage('select-level');");
  }
}