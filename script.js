var game = {
  data: {
    lastTick: 0,
    diff: 0,
    lastIncrement: 0,
    incrementDiff: 0,
    lastMaximize: 0,
    maximizeDiff: 0,
    markupUnlocked: false,
    colors: false,
    ord: 0,
    over: 0,
    op: 0,
    incrementAuto: 0,
    maximizeAuto: 0,
  },
  header: document.getElementById("header"),
  colorButton: document.getElementById("colorButton"),
  markupTab: document.getElementById("markupTabButton"),
  markupButton: document.getElementById("markupButton"),
  markupButton2: document.getElementById("markupButton2"),
  opText: document.getElementById("opText"),
  incrementSpeed: document.getElementById("incrementSpeed"),
  maximizeSpeed: document.getElementById("maximizeSpeed"),
  buyIncrementButton: document.getElementById("buyIncrementButton"),
  buyMaximizeButton: document.getElementById("buyMaximizeButton"),
  tabs: [
    document.getElementById("tab0"),
    document.getElementById("tab1"),
    document.getElementById("tab2")
  ],
  tab: function(x) {
    var numTabs = game.tabs.length;
    
    for (var i = 0; i < numTabs; i++) {
      game.tabs[i].style.display = "none";
    }
    
    game.tabs[x].style.display = "block";
  },
  increment: function(manmade = 1) {
    if (game.data.ord % 10 == 9) {
      game.data.over++;
    } else {
      game.data.ord++;
    }
    
    game.save("increment", manmade);
  },
  maximize: function(manmade = 1) {
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
      
      game.save("maximize", manmade);
    }
  },
  markup: function() {
    if (game.data.ord >= 100) {
      game.data.op += game.data.ord + game.data.over;
      
      game.data.ord = 0;
      game.data.over = 0;
      
      if (game.data.markupUnlocked == false) {
        game.data.markupUnlocked = true;
      }
      
      game.save("markup");
    }
  },
  buyIncrementAuto: function() {
    if (game.data.op >= 100 * 2 ** game.data.incrementAuto) {
      game.data.op -= 100 * 2 ** game.data.incrementAuto;
      game.data.incrementAuto++;
    }
    
    game.save("buyIncrementAuto");
  },
  buyMaximizeAuto: function() {
    if (game.data.op >= 100 * 2 ** game.data.maximizeAuto) {
      game.data.op -= 100 * 2 ** game.data.maximizeAuto;
      game.data.maximizeAuto++;
    }
    
    game.save("buyMaximizeAuto");
  },
  maxAll: function() {
    while (game.data.op >= 100 * 2 ** game.data.incrementAuto || game.data.op >= 100 * 2 ** game.data.maximizeAuto) {
      game.buyIncrementAuto();
      game.buyMaximizeAuto();
    }
  },
  hardy: function(ord = game.data.ord, over = game.data.over) {
    if (ord >= 1000) {
      return Infinity;
    } else {
      if (ord >= 100) {
        return game.hardy(ord - 100, over) * 2 ** game.hardy(ord - 100, over);
      } else {
        if (ord >= 10) {
            return game.hardy(ord - 10, over) * 2;
        } else {
          if (ord >= 1) {
            if (over == 0) {
              return game.hardy(ord - 1, 0) + 1;
            } else {
              return game.hardy(ord, over - 1) + 1;
            }
          } else {
            return 10;
          }
        }
      }
    }
  },
  writeOrd: function(ord = game.data.ord, over = game.data.over, header = true) {
    if (ord == 0) {
      if (header) {
        if (game.data.colors) {
          game.header.innerHTML = '<span style="color:hsl(0, 100%, 50%)">H<sub>0</sub>(10)=10</span>';
        } else {
          game.header.innerHTML = "H<sub>0</sub>(10)=10";
        }
      }
      
      return "0";
    } else {
      var result = "";
      var remainOrd = ord;

      while (remainOrd > 0) {
        var power = Math.floor(Math.log(remainOrd) / Math.LN10);

        if (result == "") {
          if (power == 0) {
            result = remainOrd + over;
          } else {
            if (power == 1) {
              if (Math.floor(remainOrd / 10) == 1) {
                result = "&omega;";
              } else {
                result = "&omega;" + Math.floor(remainOrd / 10);
              }
            } else {
              if (Math.floor(remainOrd / 10 ** power) == 1) {
                result = "&omega;<sup>" + power + "</sup>";
              } else {
                result = "&omega;<sup>" + power + "</sup>" + Math.floor(remainOrd / 10 ** power);
              }
            }
          }
        } else {
          if (power == 0) {
            result = result + "+" + (remainOrd + over);
          } else {
            if (power == 1) {
              if (Math.floor(remainOrd / 10) == 1) {
                result = result + "+&omega;";
              } else {
                result = result + "+&omega;" + Math.floor(remainOrd / 10);
              }
            } else {
              if (Math.floor(remainOrd / 10 ** power) == 1) {
                result = result + "+&omega;<sup>" + power + "</sup>";
              } else {
                result = result + "+&omega;<sup>" + power + "</sup>" + Math.floor(remainOrd / 10 ** power);
              }
            }
          }
        }

        remainOrd -= 10 ** power * Math.floor(remainOrd / 10 ** power);
      }
    }
    
    if (header) {
      if (game.data.colors) {
        var color = Math.log(ord + over) / (Math.LN10 * 10);
        
        if (game.hardy(ord, over) == Infinity) {
          game.header.innerHTML = '<span style="color:hsl(' + color * 360 + ', 100%, 50%)">H<sub>' + result + '</sub>(10)</span>';
        } else {
          game.header.innerHTML = '<span style="color:hsl(' + color * 360 + ', 100%, 50%)">H<sub>' + result + '</sub>(10)=' + game.hardy(ord, over);
        }
      } else {
        if (game.hardy(ord, over) == Infinity) {
          game.header.innerHTML = "H<sub>" + result + "</sub>(10)";
        } else {
          game.header.innerHTML = "H<sub>" + result + "</sub>(10)=" + game.hardy(ord, over);
        }
      }
    }
    
    return result;
  },
  toggleColor: function() {
    if (game.data.colors) {
      game.data.colors = false;
    } else {
      game.data.colors = true;
    }
    
    game.save();
  },
  loop: function() {
    game.data.diff = Date.now() - game.data.lastTick;
    
    game.data.incrementDiff = Date.now() - game.data.lastIncrement;
    game.data.maximizeDiff = Date.now() - game.data.lastMaximize;
    
    if (game.data.incrementDiff >= 1000 / game.data.incrementAuto) {
      game.increment(0);
    }
    if ((game.data.ord % 10 == 9 && game.data.over >= 1) && game.data.maximizeDiff >= 1000 / game.data.maximizeAuto) {
      game.maximize(0);
    }
  },
  render: function(action, manmade = 1) {
    game.data.lastTick = Date.now();
    
    if (action == "increment" && manmade == 0) {
      game.data.lastIncrement = Date.now();
    }
    if (action == "maximize" && manmade == 0) {
      game.data.lastMaximize = Date.now();
    }
    
    game.writeOrd();
    
    if (game.data.colors) {
      game.colorButton.innerHTML = "Colors: ON";
    } else {
      game.colorButton.innerHTML = "Colors: OFF";
    }
    
    if (game.data.ord >= 100) {
      game.markupButton.innerHTML = "Markup to gain " + (game.data.ord + game.data.over) + " Ordinal Points";
      game.markupButton2.innerHTML = "+" + (game.data.ord + game.data.over);
    } else {
      game.markupButton.innerHTML = "Reach &omega;<sup>2</sup> to Markup";
      game.markupButton2.innerHTML = "Reach &omega;<sup>2</sup> to Markup";
    }
    
    if (game.data.markupUnlocked) {
      game.markupTab.style.display = "inline";
    } else {
      game.markupTab.style.display = "none";
    }
    
    game.opText.innerHTML = "You have " + game.data.op + " Ordinal Points";
    
    game.incrementSpeed.innerHTML = "You have " + game.data.incrementAuto + " increment autoclickers, clicking the increment button " + game.data.incrementAuto + " times per second";
    game.maximizeSpeed.innerHTML = "You have " + game.data.maximizeAuto + " maximize autoclickers, clicking the maximize button " + game.data.maximizeAuto + " times per second";
    
    game.buyIncrementButton.innerHTML = "Buy Increment Autoclicker for " + 100 * 2 ** game.data.incrementAuto + " OP";
    game.buyMaximizeButton.innerHTML = "Buy Maximize Autoclicker for " + 100 * 2 ** game.data.maximizeAuto + " OP";
  },
  save: function(action, manmade = 1) {
    localStorage.clear();
    
    localStorage.setItem("save", JSON.stringify(game.data));
    
    game.render(action, manmade);
  },
  load: function(loadgame) {
    game.reset();
    
    game.data = loadgame;
    
    game.render();
  },
  reset: function() {
    game.data = {
      lastTick: Date.now(),
      diff: 0,
      lastIncrement: Date.now(),
      incrementDiff: 0,
      lastMaximize: Date.now(),
      maximizeDiff: 0,
      markupUnlocked: false,
      colors: false,
      ord: 0,
      over: 0,
      op: 0,
      incrementAuto: 0,
      maximizeAuto: 0,
    };
    
    game.save();
  },
  import: function() {
    var loadgame = "";
    
    reader.readAsText(document.getElementById("importButton").files[0]);

    loadgame=JSON.parse(atob(reader.result));
    
    if (loadgame != "") {
      game.load(loadgame);
    }
    
    game.save();
    
    window.location.reload();
  },
  export: function() {
    game.save();
    
    var file = new Blob([btoa(JSON.stringify(game.data))], {type: "text/plain"});
    
    window.URL = window.URL || window.webkitURL;
    
    var importButton = document.createElement("importButton");
    
    importButton.href = window.URL.createObjectURL(file);
    importButton.download = "Ordinal Markup Save.txt";
    importButton.click();
  },
  resetConf: function() {
    var code = prompt(
      'Are you sure you want to delete all of your progress? Type in "reset game" to reset all of your progress.'
    );
    
    if (code != null) {
      if (code.toLowerCase() == 'reset game') {
        game.reset();
      }
    }
  }
};

game.load(JSON.parse(localStorage.getItem("save")));

setInterval(game.loop, 50);
