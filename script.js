var game = {
  ord: 0,
  over: 0,
  increment: function() {
    if (game.ord % 10 == 9) {
      game.over++;
    } else {
      game.ord++;
    }
    
    game.writeOrd();
  },
  maximize: function() {
    if (game.ord % 10 == 9 && game.over >= 1) {
      game.ord -= 9;
      game.over += 9;
      
      while (game.over + 10 >= 20 && game.ord % 100 != 0) {
        game.over -= Math.ceil((game.over + 10) / 2 - 0.1);
        game.ord += 10;
      }
      
      if (game.ord % 100 != 0) {
        game.ord += game.over;
      }
      
      game.over = 0;
    }
    
    game.writeOrd();
  },
  header: document.getElementById("header"),
  writeOrd: function() {
    if (game.ord == 0) {
      game.header.innerHTML = "H<sub>0</sub>(10)";
    } else {
      var notation = "";
      var ordinal = game.ord;

      while (ordinal > 0) {
        function log10(arg) {
          return Math.log(arg) / Math.LN10;
        }

        var power = Math.floor(log10(ordinal));

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
    }
    
    game.header.innerHTML = "H<sub>" + notation + "</sub>(10)";
  }
};
