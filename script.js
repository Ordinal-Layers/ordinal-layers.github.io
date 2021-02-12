var game = {
  data: {
    markupUnlocked: false,
    colors: false,
    ord: 0,
    over: 0,
    op: 0,
    incrementAuto: 0,
    maximizeAuto: 0,
  },
  header: document.getElementById("header"),
  markupTab: document.getElementById("markupTabButton"),
  markupButton: document.getElementById("markupButton"),
  tabs: [
    document.getElementById("tab0"),
    document.getElementById("tab1"),
    document.getElementById("tab2")
  ],
  numTabs: game.tabs.length,
  tab: function(x) {
    for (var i = 0; i < game.numTabs; i++) {
      game.tabs[i].style.display = "none";
    }
    
    game.tabs[x].style.display = "block";
  },
  increment: function() {
    if (game.data.ord % 10 == 9) {
      game.data.over++;
    } else {
      game.data.ord++;
    }
    
    game.save();
  },
  maximize: function() {
    if (game.data.ord % 10 == 9 && game.data.over >= 1) {
      game.data.ord -= 9;
      game.data.over += 9;
      
      do {
        game.data.over -= Math.ceil((game.data.over + 10) / 2);
        game.data.ord += 10;
      } while (game.data.over + 10 >= 20 && game.data.ord % 100 != 0);
      
      if (game.data.ord % 100 != 0) {
        game.data.ord += game.data.over;
      }
      
      game.data.over = 0;
    }
    
    game.save();
  },
  markup: function() {
    if (game.data.ord >= 100) {
      game.data.op += game.data.ord + game.data.over;
      
      game.data.ord = 0;
      game.data.over = 0;
      
      if (game.data.markupUnlocked == false) {
        game.data.markupUnlocked = true;
      }
    }
    
    game.save();
  },
  writeOrd: function() {
    if (game.data.ord == 0) {
      game.header.innerHTML = "H<sub>0</sub>(10)";
    } else {
      var notation = "";
      var ordinal = game.data.ord;

      while (ordinal > 0) {
        function log10(arg) {
          return Math.log(arg) / Math.LN10;
        }

        var power = Math.floor(log10(ordinal));

        if (notation == "") {
          if (power == 0) {
            notation = ordinal + game.data.over;
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
            notation = notation + "+" + (ordinal + game.data.over);
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
              } else {
                notation = notation + "+&omega;<sup>" + power + "</sup>" + Math.floor(ordinal / 10 ** power);
              }
            }
          }
        }

        ordinal -= 10 ** power * Math.floor(ordinal / 10 ** power);
      }
    }
    
    game.header.innerHTML = "H<sub>" + notation + "</sub>(10)";
    
    return notation;
  },
  save: function() {
    localstorage.setItem("save", game.data);
    
    notation = game.writeOrd();
    
    if (game.ord >= 100) {
      game.markupButton.innerHTML = "Markup to gain " + game.data.ord + " Ordinal Points";
      game.markupButton2.innerHTML = "+" + game.data.ord;
    } else {
      game.markupButton.innerHTML = "Reach &omega;<sup>2</sup> to Markup";
      game.markupButton2.innerHTML = "Reach &omega;<sup>2</sup> to Markup";
    }
    
    if (game.data.markupUnlocked) {
      game.markupTab.style.display = "inline";
    }
  },
  load: function() {
    game.data = localstorage.getItem(game.data);
    
    notation = game.writeOrd();
    
    if (game.ord >= 100) {
      game.markupButton.innerHTML = "Markup to gain " + game.data.ord + " Ordinal Points";
      game.markupButton2.innerHTML = "+" + game.data.ord;
    } else {
      game.markupButton.innerHTML = "Reach &omega;<sup>2</sup> to Markup";
      game.markupButton2.innerHTML = "Reach &omega;<sup>2</sup> to Markup";
    }
    
    if (game.data.markupUnlocked) {
      game.markupTab.style.display = "inline";
    }
  },
  reset: function() {
    game.data = {
      markupUnlocked: false,
      colors: false,
      ord: 0,
      over: 0,
      op: 0,
      incrementAuto: 0,
      maximizeAuto: 0,
    };
  },
  import: function() {
    var loadgame = "";
    reader.readAsText(document.getElementById("importButton").files[0]);
    window.setTimeout(function() {
      console.log(52)
      loadgame=JSON.parse(atob(reader.result));
      if (loadgame != "") {
      game.data = loadgame
      $.notify("Import Successful!","success");
      }
        window.setTimeout(() => {
        game.save()
       window.location.reload()
        }, 200)
      }, 100)
  },
  export: function() {
    game.save();
    var file = new Blob([btoa(JSON.stringify(data))], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    var importButton = document.createElement("importButton");
    importButton.href = window.URL.createObjectURL(file);
    importButton.download = "Ordinal Markup Save.txt";
    importButton.click();
    $.notify("File Export Successful!","success");
  },
  resetConf: function() {
    var code = prompt(
      'Are you sure you want to delete all of your progress? Type in "reset game" to reset all of your progress.'
    );
    if (code.toLowerCase() == "reset game") {
      game.reset();
      $.notify("Hard Reset Performed","error");
    }
  }
};

game.load();
