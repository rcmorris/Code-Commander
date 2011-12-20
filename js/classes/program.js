Class.subclass('Program', {
  
  // List of valid commands
  COMMANDS: ['fire', 'left', 'move', 'right', 'wait'],
  
  // Parse a command into the command plus optional amount, ie "cmd(amt)"
  COMMAND_REGEX: /^\s*([a-z]+)(?:\(([0-9]+)\))?\s*$/
  
}, {
  
  init: function() {
    this.reset();
  },

  reset: function() {
    this.ok = true;
    this.errors = {};
    this.commands = [];
  },
  
  run: function() {
    this.reset();
    this.parse();
  },
  
  parse: function() {
    var self = this;
    var source = $('#program').val();
    var lines = source.split(/\r?\n/);
    $.each(lines, function(i, line) {
      self.parseLine(i, line);
    });
    if (!this.ok) {
      alert('Bugs: ' + this.errors.toSource());
    } else {
      alert('Program: '+ this.commands.toSource());
    }
  },
  
  parseLine: function(lineNum, line) {
    var match = Program.COMMAND_REGEX.exec(line);
    if (match) {
      var cmd = match[1];
      var amt = match[2];
      if (this.validCommand(cmd, amt)) {
        this.commands.push({cmd: cmd, amt: amt});
      } else {
        this.addBug(lineNum, 'unknown command');
      }

    } else {
      if (/^\s*$/.exec(line)) {
        // Skip, just a blank line...
      } else {
        // Got an error!
        this.addBug(lineNum, 'invalid');
      }
    }
  },    

  addBug: function(lineNum, msg) {
    this.ok = false;
    this.errors[lineNum] = msg;
  },

  validCommand: function(cmd, amt) {
    return $.inArray(cmd, Program.COMMANDS) >= 0;
  }
  
});