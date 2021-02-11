var game = {
  ord: 0,
  over: 0,
  hardy: function(arg, ord, over = 0) {
    if (ord == 0) {
      return arg;
    } else {
      if (ord % 10 == 0) {
        var i = 1;
        
        while (ord / 10 ** i % 1 == 0) {
          i++;
        }
        var power = 10 ** (i - 1);
        
        return game.hardy(arg, ord - power + Math.min(power - 1, arg), Math.max(0, arg - power + 1));
      } else {
        if (over == 0) {
          return game.hardy(arg + 1, ord - 1);
        } else {
          return game.hardy(arg + 1, ord, over - 1);
        }
      }
    }
  },
  increment: function() {
    if (game.ord % 10 == 9) {
      game.over++;
    } else {
      game.ord++;
    }
    
    game.writeOrd();
  },
  maximize: function() {
    
    game.ord += game.over;
    game.over = 0;
    
    game.writeOrd();
  },
  header: document.getElementById("hardy"),
  writeOrd: function() {
    var notation = "";
    var ordinal = game.ord;
    
    while (ordinal > 0) {
      var i = 0;
      
      while (ordinal / 10 ** i % 1 == 0) {
        i++;
      }
      var power = i - 1;
      
      if (notation == "") {
        if (power == 0) {
          notation = ordinal + game.over;
        } else {
          if (power == 1) {
            if (Math.floor(ordinal / 10) == 1) {
              notation = "&omega;";
            } else {
              notation = "&omega;" + Math.floor(ordinal / 10);
            }
          } else {
            if (Math.floor(ordinal / 10 ** power) == 1) {
              notation = "&omega;<sup>" + power + "</sup>";
            } else {
              notation = "&omega;<sup>" + power + "</sup>" + Math.floor(ordinal / 10 ** power);
            }
          }
        }
      } else {
        if (power == 0) {
          notation = notation + "+" + (ordinal + game.over);
        } else {
          if (power == 1) {
            if (Math.floor(ordinal / 10) == 1) {
              notation = notation + "+&omega;";
            } else {
              notation = notation + "+&omega;" + Math.floor(ordinal / 10);
            }
          } else {
            if (Math.floor(ordinal / 10 ** power) == 1) {
              notation = notation + "+&omega;<sup>" + power + "</sup>";
            }
            notation = notation + "+&omega;<sup>" + power + "</sup>" + Math.floor(ordinal / 10 ** power);
          }
        }
      }
      
      ordinal -= 10 ** power * Math.floor(ordinal / 10 ** power);
    }
    
    if (game.hardy(10, game.ord, game.over) == Infinity) {
      game.header.innerHTML = "H<sub>" + notation + "</sub>(10)";
    } else {
      game.header.innerHTML = "H<sub>" + notation + "</sub>(10)=" + game.hardy(10, game.ord, game.over);
    }
  }
};
