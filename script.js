var game = {
  data: {
    lastTick: Date.now(),
    diff: 0,
    pendingIncrement: 0,
    pendingMaximize: 0,
    markupUnlocked: false,
    colors: true,
    music: true,
    ord: 0,
    over: 0,
    op: 0,
    incrementAuto: 0,
    maximizeAuto: 0,
    factorShifts: 0,
    factors: []
  },
  get: function(x) {
    return document.getElementById(x);
  },
  music: game.get("music"),
  header: game.get("header"),
  colorButton: game.get("colorButton"),
  musicButton: game.get("musicButton"),
  markupTab: game.get("markupTabButton"),
  markupButton: game.get("markupButton"),
  markupButton2: game.get("markupButton2"),
  opText: game.get("opText"),
  incrementSpeed: game.get("incrementSpeed"),
  maximizeSpeed: game.get("maximizeSpeed"),
  buyIncrementButton: game.get("buyIncrementButton"),
  buyMaximizeButton: game.get("buyMaximizeButton"),
  factorShiftText: game.get("factorShift"),
  noFactors: game.get("noFactors"),
  factorList: game.get("factorList"),
  factorMultiplier: game.get("factorMult"),
  factors: [
    game.get("factor1"),
    game.get("factor2"),
    game.get("factor3"),
    game.get("factor4"),
    game.get("factor5"),
    game.get("factor6"),
    game.get("factor7")
  ],
  factorMults: [
    game.get("factor1Mult"),
    game.get("factor2Mult"),
    game.get("factor3Mult"),
    game.get("factor4Mult"),
    game.get("factor5Mult"),
    game.get("factor6Mult"),
    game.get("factor7Mult")
  ],
  factorButtons: [
    game.get("factor1Button"),
    game.get("factor2Button"),
    game.get("factor3Button"),
    game.get("factor4Button"),
    game.get("factor5Button"),
    game.get("factor6Button"),
    game.get("factor7Button")
  ],
  tabs: [
    game.get("tab0"),
    game.get("tab1"),
    game.get("tab2")
  ],
  subtabs: [
    [],
    [],
    [
      game.get("subtab20"),
      game.get("subtab21")
    ]
  ],
  factorShiftCosts: [
    1000,
    10000,
    100000,
    1000000,
    1e+10,
    1e+20,
    1e+100,
    Infinity
  ],
  tab: function(x) {
    var numTabs = game.tabs.length;
    
    for (var i = 0; i < numTabs; i++) {
      game.tabs[i].style.display = "none";
    }
    
    game.tabs[x].style.display = "block";
  },
  subtab: function(x, y) {
    game.tab(x);
    
    var numTabs = game.subtabs[x].length;
    
    for (var i = 0; i < numTabs; i++) {
      game.subtabs[x][i].style.display = "none";
    }
    
    game.subtabs[x][y].style.display = "block";
  },
  base: function() {
    return 10 - game.data.factorShifts;
  },
  factorMult: function() {
    var mult = 1;
    
    for (var i = 0; i < game.data.factorShifts; i++) {
      mult = mult * game.data.factors[i];
    }
    
    return mult;
  },
  incrementSpeed: function() {
    return game.data.incrementAuto * game.factorMult();
  },
  maximizeSpeed: function() {
    return game.data.maximizeAuto * game.factorMult();
  },
  opGain: function(ord = game.data.ord, over = game.data.over, base = game.base()) {
    if (ord < base) {
      return ord + over;
    } else {
      var tempvar = Math.floor(Math.log(ord) / Math.log(base));
      var tempvar2 = Math.pow(base, tempvar);
      var tempvar3 = Math.floor(ord / tempvar2);
      return Math.min(
        1e223,
        10 ** calcOrdPoints(tempvar, 0, base) * tempvar3 +
          calcOrdPoints(ord - tempvar2 * tempvar3, over, base)
      );
    }
  },
  increment: function(manmade = 1) {
    if (game.data.ord % game.base() === game.base() - 1) {
      game.data.over++;
    } else {
      game.data.ord++;
    }
    
    game.save("increment", manmade);
  },
  maximize: function(manmade = 1) {
    if (game.data.ord % game.base() === game.base() - 1 && game.data.over >= 1) {
      game.data.ord -= game.base() - 1;
      game.data.over += game.base() - 1;
      
      do {
        game.data.over -= Math.ceil((game.data.over + game.base()) / 2);
        game.data.ord += game.base();
      } while (game.data.over + game.base() >= game.base() * 2 && game.data.ord % game.base() ** 2 !== 0);
      
      if (game.data.ord % game.base() ** 2 !== 0) {
        game.data.ord += game.data.over;
      }
      
      game.data.over = 0;
      
      game.save("maximize", manmade);
    }
  },
  resetOrd: function() {
    game.data.ord = 0;
    game.data.over = 0;
  },
  markup: function() {
    if (game.data.ord >= 100) {
      game.data.op += game.opGain();
      
      game.resetOrd();
      
      if (game.data.markupUnlocked === false) {
        game.data.markupUnlocked = true;
      }
      
      game.save("markup");
    }
  },
  buyIncrementAuto: function() {
    if (game.data.op >= 100 * 2 ** game.data.incrementAuto) {
      game.data.op -= 100 * 2 ** game.data.incrementAuto;
      
      game.data.incrementAuto++;
      
      game.resetOrd();
      
      game.save("buyIncrementAuto");
    }  
  },
  buyMaximizeAuto: function() {
    if (game.data.op >= 100 * 2 ** game.data.maximizeAuto) {
      game.data.op -= 100 * 2 ** game.data.maximizeAuto;
      
      game.data.maximizeAuto++;
      
      game.resetOrd();
      
      game.save("buyMaximizeAuto");
    }
  },
  maxAll: function() {
    while (game.data.op >= 100 * 2 ** game.data.incrementAuto || game.data.op >= 100 * 2 ** game.data.maximizeAuto) {
      game.buyIncrementAuto();
      game.buyMaximizeAuto();
    }
  },
  factorShift: function() {
    if (game.data.op >= game.factorShiftCosts[game.data.factorShifts]) {
      game.data.op = 0;
      
      game.data.incrementAuto = 0;
      game.data.maximizeAuto = 0;
      
      game.data.factorShifts++;
      game.data.factors.push(1);
      
      game.resetOrd();
      
      game.save("factorShift");
    }
  },
  buyFactor: function(x) {
    if (game.data.op >= 10 ** (x * game.data.factors[x - 1]) && game.data.factors[x - 1] < 10) {
      game.data.op -= 10 ** (x * game.data.factors[x - 1]);
      
      game.data.factors[x - 1]++;
      
      game.resetOrd();
      
      game.save("buyFactor" + x);
    }
  },
  maxFactors: function() {
    var costs = [];
    
    for (var i = 1; i < 8; i++) {
      costs.push(10 ** (i * game.data.factors[i - 1]));
    }
    
    var factorSort = game.data.factors.sort(function(a, b){return a - b});
    var costSort = costs.sort(function(a, b){return a - b});
    
    while (factorSort[0] < 10 && game.data.op >= costSort[0]) {
      for (var i = 1; i < 8; i++) {
        game.buyFactor(i);
      }
    }
  },
  hardy: function(ord = game.data.ord, over = game.data.over, base = game.base()) {
    if (ord >= base ** 3) {
      return Infinity;
    } else {
      if (ord >= base ** 2) {
        return game.hardy(ord - base ** 2, over, base) * 2 ** game.hardy(ord - base ** 2, over, base);
      } else {
        if (ord >= base) {
            return game.hardy(ord - base, over) * 2;
        } else {
          if (ord >= 1) {
            if (over === 0) {
              return game.hardy(ord - 1, 0) + 1;
            } else {
              return game.hardy(ord, over - 1) + 1;
            }
          } else {
            return base;
          }
        }
      }
    }
  },
  writeOrd: function(ord = game.data.ord, over = game.data.over, base = game.base(), header = true) {
    if (ord === 0) {
      if (header) {
        if (game.data.colors) {
          game.header.innerHTML = `<span style="color:hsl(0, 100%, 50%)">H<sub>0</sub>(${base})=${base}</span>`;
        } else {
          game.header.innerHTML = `H<sub>0</sub>(${base})=${base}`;
        }
      }
      
      return `0`;
    } else {
      var result = ``;
      var remainOrd = ord;
      while (remainOrd > 0) {
        var power = Math.floor(Math.log(remainOrd) / Math.log(base));
        if (result === ``) {
          if (power === 0) {
            result = remainOrd + over;
          } else {
            if (power === 1) {
              if (Math.floor(remainOrd / base) === 1) {
                result = `&omega;`;
              } else {
                result = `&omega;` + Math.floor(remainOrd / base);
              }
            } else {
              if (Math.floor(remainOrd / base ** power) === 1) {
                result = `&omega;<sup>${game.writeOrd(power, 0)}</sup>`;
              } else {
                result = `&omega;<sup>${game.writeOrd(power, 0)}</sup>${Math.floor(remainOrd / base ** power)}`;
              }
            }
          }
        } else {
          if (power === 0) {
            result = `${result}+${remainOrd + over}`;
          } else {
            if (power === 1) {
              if (Math.floor(remainOrd / base) === 1) {
                result = `${result}+&omega;`;
              } else {
                result = `${result}+&omega;+${Math.floor(remainOrd / base)}`;
                result = `${result}+&omega;+${Math.floor(remainOrd / base)}`;
              }
            } else {
              if (Math.floor(remainOrd / base ** power) === 1) {
                result = `${result}+&omega;<sup>${game.writeOrd(power, 0)}</sup>`;
              } else {
                result = `${result}+&omega;<sup>${game.writeOrd(power, 0)}</sup>${Math.floor(remainOrd / base ** power)}`;
              }
            }
          }
        }
        remainOrd -= base ** power * Math.floor(remainOrd / base ** power);
      }
    }
    
    if (header) {
      if (game.data.colors) {
        var color = Math.log(ord + over) / (Math.log(3) * 27);
        
        if (game.hardy(ord, over) === Infinity) {
          game.header.innerHTML = `<span style="color:hsl(${color * 360}, 100%, 50%)">H<sub>${result}</sub>(${base})</span>`;
        } else {
          game.header.innerHTML = `<span style="color:hsl(${color * 360}, 100%, 50%)">H<sub>${result}</sub>(${base})=${game.hardy(ord, over, base).toPrecision(10)}`;
        }
      } else {
        if (game.hardy(ord, over) === Infinity) {
          game.header.innerHTML = `H<sub>${result}</sub>(${base})`;
        } else {
          game.header.innerHTML = `H<sub>${result}</sub>(${base})=${game.hardy(ord, over, base).toPrecision(10)}`;
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
  toggleMusic: function() {
    if (game.data.music) {
      game.data.music = false;
    } else {
      game.data.music = true;
    }
    
    game.save();
  },
  loop: function() {
    game.data.diff = Date.now() - game.data.lastTick;
    
    game.data.pendingIncrement += game.incrementSpeed() / 1000;
    game.data.pendingMaximize += game.maximizeSpeed() / 1000;
    
    if (game.data.music) {
      game.music.play();
    } else {
      game.music.pause();
    }
    
    if (game.data.pendingIncrement >= 1) {
      for (var i = 0; i < Math.floor(game.data.pendingIncrement); i++) {
        game.increment(0);
      }
    }
    if ((game.data.ord % 10 === 9 && game.data.over >= 1) && game.data.pendingMaximize) {
      for (var i = 0; i < Math.floor(game.data.pendingMaximize); i++) {
        game.maximize(0);
      }
    }
  },
  render: function(action, manmade = 1) {
    game.data.pendingIncrement += (Date.now() - game.data.lastTick) * game.incrementSpeed() / 1000;
    game.data.pendingMaximize += (Date.now() - game.data.lastTick) * game.maximizeSpeed() / 1000;
    
    game.data.lastTick = Date.now();
    
    game.writeOrd();
    
    if (game.data.colors) {
      game.colorButton.innerHTML = `Colors: ON`;
    } else {
      game.colorButton.innerHTML = `Colors: OFF`;
    }
    
    if (game.data.music) {
      game.musicButton.innerHTML = `Music: ON`;
    } else {
      game.musicButton.innerHTML = `Music: OFF`;
    }
    
    if (game.data.ord >= 100) {
      game.markupButton.innerHTML = `Markup to gain ${game.opGain().toPrecision(10)} Ordinal Points`;
      game.markupButton2.innerHTML = `+${game.opGain().toPrecision(10)}`;
    } else {
      game.markupButton.innerHTML = `Reach &omega;<sup>2</sup> to Markup`;
      game.markupButton2.innerHTML = `Reach &omega;<sup>2</sup> to Markup`;
    }
    
    if (game.data.markupUnlocked) {
      game.markupTab.style.display = "inline";
    } else {
      game.markupTab.style.display = "none";
    }
    
    game.opText.innerHTML = `You have ${game.data.op.toPrecision(10)} Ordinal Points`;
    
    game.incrementSpeed.innerHTML = `You have ${game.data.incrementAuto.toPrecision(10)} increment autoclickers, clicking the increment button ${game.incrementSpeed().toPrecision(10)} times per second`;
    game.maximizeSpeed.innerHTML = `You have ${game.data.maximizeAuto.toPrecision(10)} maximize autoclickers, clicking the maximize button ${game.maximizeSpeed().toPrecision(10)} times per second`;
    
    game.buyIncrementButton.innerHTML = `Buy Increment Autoclicker for ${(100 * 2 ** game.data.incrementAuto).toPrecision(10)} OP`;
    game.buyMaximizeButton.innerHTML = `Buy Maximize Autoclicker for ${(100 * 2 ** game.data.maximizeAuto).toPrecision(10)} OP`;
    
    if (game.data.factorShifts === 0) {
      game.noFactors.style.display = "block";
      game.factorList.style.display = "none";
      game.factorMultiplier.style.display = "none";
    } else {
      game.noFactors.style.display = "none";
      game.factorList.style.display = "block";
      game.factorMultiplier.style.display = "inline";
    }
    
    game.factorMultiplier.innerHTML = `Your factors are multiplying your autoclicker speed by ${game.factorMult().toPrecision(10)}`;
    
    game.factorShift.innerHTML = `Factor Shift: Requires ${game.factorShiftCosts[game.data.factorShifts].toPrecision(10)} OP`;
    
    for (var i = 0; i < 7; i++) {
      if (game.data.factorShifts >= i) {
        game.factors[i].style.display = "none";
      } else {
        game.factors[i].style.display = "list-item";
      }
      
      game.factorMults[i].innerHTML = `x${game.data.factors[i]}`;
      
      game.factorButtons[i].innerHTML = `Increase Factor ${(i + 1)} for ${(10 ** ((i + 1) * game.data.factors[i])).toPrecision(10)} OP`;
    }
  },
  save: function(action, manmade = 1) {
    localStorage.clear();
    
    localStorage.setItem("save", JSON.stringify(game.data));
    
    game.render(action, manmade);
  },
  load: function(loadgame) {
    game.reset();
    
    game.data = loadgame;
    
    game.music.loop = true;
    game.music.volume = 0.5;
    
    game.render("load");
  },
  reset: function() {
    game.data = {
      lastTick: Date.now(),
      diff: 0,
      pendingIncrement: 0,
      pendingMaximize: 0,
      markupUnlocked: false,
      colors: true,
      music: true,
      ord: 0,
      over: 0,
      op: 0,
      incrementAuto: 0,
      maximizeAuto: 0,
      factorShifts: 0,
      factors: []
    };
    
    game.save();
  },
  import: function() {
    var loadgame = "";
    
    reader.readAsText(document.getElementById("importButton").files[0]);
    loadgame = JSON.parse(atob(reader.result));
    
    if (loadgame !== null) {
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
    
    if (code !== null) {
      if (code.toLowerCase() === "reset game") {
        game.reset();
      }
    }
  }
};

game.load(JSON.parse(localStorage.getItem("save")));

var loop = setInterval(game.loop, 1);
