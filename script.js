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
  markupButton2: document.getElementById("markupButton2"),
  colorButton: document.getElementById("colorButton"),
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
    }
    
    if (game.data.markupUnlocked == false) {
      game.data.markupUnlocked = true;
    }
    
    game.save();
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
          game.header.innerHTML = `<span style="color:hsl(${color * 360}, 100%, 50%)">H<sub>${result}</sub>(10)</span>`;
        } else {
          game.header.innerHTML = `<span style="color:hsl(${color * 360}, 100%, 50%)">H<sub>${result}</sub>(10)=${game.hardy(ord, over)}`;
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
  render: function() {
    game.writeOrd();
    
    if (game.data.colors) {
      game.colorButton.innerHTML = "Colors: ON";
    } else {
      game.colorButton.innerHTML = "Colors: OFF";
    }
    
    if (game.data.ord >= 100) {
      game.markupButton.innerHTML = "Markup to gain " + game.data.ord + " Ordinal Points";
      game.markupButton2.innerHTML = "+" + game.data.ord;
    } else {
      game.markupButton.innerHTML = "Reach &omega;<sup>2</sup> to Markup";
      game.markupButton2.innerHTML = "Reach &omega;<sup>2</sup> to Markup";
    }
    
    if (game.data.markupUnlocked) {
      game.markupTab.style.display = "inline";
    } else {
      game.markupTab.style.display = "none";
    }
  },
  save: function() {
    localStorage.clear();
    
    localStorage.setItem("save", game.data);
    
    game.render();
  },
  load: function() {
    game.data = localStorage.getItem("save");
    
    game.render();
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
    
    game.save();
  },
  import: function() {
    var loadgame = "";
    reader.readAsText(document.getElementById("importButton").files[0]);
    window.setTimeout(function() {
      console.log(52)
      loadgame=JSON.parse(atob(reader.result));
      if (loadgame != "") {
      game.data = loadgame
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
  },
  resetConf: function() {
    var code = prompt(
      'Are you sure you want to delete all of your progress? Type in "reset game" to reset all of your progress.'
    );
    if (code.toLowerCase() == "reset game") {
      game.reset();
    }
  }
};

game.load();
