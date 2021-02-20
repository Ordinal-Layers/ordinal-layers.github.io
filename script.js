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
  music: document.getElementById("music"),
  header: document.getElementById("header"),
  colorButton: document.getElementById("colorButton"),
  musicButton: document.getElementById("musicButton"),
  markupTab: document.getElementById("markupTabButton"),
  markupButton: document.getElementById("markupButton"),
  markupButton2: document.getElementById("markupButton2"),
  opText: document.getElementById("opText"),
  incrementSpeedText: document.getElementById("incrementSpeed"),
  maximizeSpeedText: document.getElementById("maximizeSpeed"),
  buyIncrementButton: document.getElementById("buyIncrementButton"),
  buyMaximizeButton: document.getElementById("buyMaximizeButton"),
  factorShiftText: document.getElementById("factorShift"),
  noFactors: document.getElementById("noFactors"),
  factorList: document.getElementById("factorList"),
  factorMultiplier: document.getElementById("factorMult"),
  factors: [
    document.getElementById("factor1"),
    document.getElementById("factor2"),
    document.getElementById("factor3"),
    document.getElementById("factor4"),
    document.getElementById("factor5"),
    document.getElementById("factor6"),
    document.getElementById("factor7")
  ],
  factorMults: [
    document.getElementById("factor1Mult"),
    document.getElementById("factor2Mult"),
    document.getElementById("factor3Mult"),
    document.getElementById("factor4Mult"),
    document.getElementById("factor5Mult"),
    document.getElementById("factor6Mult"),
    document.getElementById("factor7Mult")
  ],
  factorButtons: [
    document.getElementById("factor1Button"),
    document.getElementById("factor2Button"),
    document.getElementById("factor3Button"),
    document.getElementById("factor4Button"),
    document.getElementById("factor5Button"),
    document.getElementById("factor6Button"),
    document.getElementById("factor7Button")
  ],
  tabs: [
    document.getElementById("tab0"),
    document.getElementById("tab1"),
    document.getElementById("tab2")
  ],
  subtabs: [
    [],
    [],
    [
      document.getElementById("subtab20"),
      document.getElementById("subtab21")
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
        10 ** game.opGain(tempvar, 0, base) * tempvar3 +
          game.opGain(ord - tempvar2 * tempvar3, over, base)
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
    if (game.data.ord >= game.base() ** 2) {
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
  number: function(x) {
    if (x < 1e+10) {
      return x.toString();
    } else {
      return x.toPrecision(10);
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
          game.header.innerHTML = `<span style="color:hsl(${color * 360}, 100%, 50%)">H<sub>${result}</sub>(${base})=${game.number(game.hardy(ord, over, base))}`;
        }
      } else {
        if (game.hardy(ord, over) === Infinity) {
          game.header.innerHTML = `H<sub>${result}</sub>(${base})`;
        } else {
          game.header.innerHTML = `H<sub>${result}</sub>(${base})=${game.number(game.hardy(ord, over, base))}`;
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
    
    game.data.pendingIncrement += game.incrementSpeed() / 20;
    game.data.pendingMaximize += game.maximizeSpeed() / 20;
    
    if (game.data.music) {
      game.music.play();
    } else {
      game.music.pause();
    }
    
    if (game.data.pendingIncrement >= 1) {
      for (var i = 0; i < Math.floor(game.data.pendingIncrement); i++) {
        game.increment(0);
      }
      
      game.data.pendingIncrement = 0;
    }
    if ((game.data.ord % 10 === 9 && game.data.over >= 1) && game.data.pendingMaximize) {
      for (var i = 0; i < Math.floor(game.data.pendingMaximize); i++) {
        game.maximize(0);
      }
      
      game.data.pendingMaximize = 0;
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
      game.markupButton.innerHTML = `Markup to gain ${game.number(game.opGain())} Ordinal Points`;
      game.markupButton2.innerHTML = `+${game.number(game.opGain())}`;
    } else {
      game.markupButton.innerHTML = `Reach &omega;<sup>2</sup> to Markup`;
      game.markupButton2.innerHTML = `Reach &omega;<sup>2</sup> to Markup`;
    }
    
    if (game.data.markupUnlocked) {
      game.markupTab.style.display = "inline";
    } else {
      game.markupTab.style.display = "none";
    }
    
    game.opText.innerHTML = `You have ${game.number(game.data.op)} Ordinal Points`;
    
    game.incrementSpeedText.innerHTML = `You have ${game.number(game.data.incrementAuto)} increment autoclickers, clicking the increment button ${game.number(game.incrementSpeed())} times per second`;
    game.maximizeSpeedText.innerHTML = `You have ${game.number(game.data.maximizeAuto)} maximize autoclickers, clicking the maximize button ${game.number(game.maximizeSpeed())} times per second`;
    
    game.buyIncrementButton.innerHTML = `Buy Increment Autoclicker for ${game.number(100 * 2 ** game.data.incrementAuto)} OP`;
    game.buyMaximizeButton.innerHTML = `Buy Maximize Autoclicker for ${game.number(100 * 2 ** game.data.maximizeAuto)} OP`;
    
    if (game.data.factorShifts === 0) {
      game.noFactors.style.display = "block";
      game.factorList.style.display = "none";
      game.factorMultiplier.style.display = "none";
    } else {
      game.noFactors.style.display = "none";
      game.factorList.style.display = "block";
      game.factorMultiplier.style.display = "inline";
    }
    
    game.factorMultiplier.innerHTML = `Your factors are multiplying your autoclicker speed by ${game.number(game.factorMult())}`;
    
    game.factorShiftText.innerHTML = `Factor Shift: Requires ${game.number(game.factorShiftCosts[game.data.factorShifts])} OP`;
    
    for (var i = 0; i < 7; i++) {
      if (game.data.factorShifts > i) {
        game.factors[i].style.display = "list-item";
      } else {
        game.factors[i].style.display = "none";
      }
      
      game.factorMults[i].innerHTML = `x${game.data.factors[i]}`;
      
      game.factorButtons[i].innerHTML = `Increase Factor ${(i + 1)} for ${game.number(10 ** ((i + 1) * game.data.factors[i]))} OP`;
    }
  },
  save: function(action, manmade = 1) {
    localStorage.clear();
    
    localStorage.setItem("save", JSON.stringify(game.data));
    
    game.render(action, manmade);
  },
  load: function(loadgame) {
    game.data = loadgame;
    
    game.music.loop = true;
    game.music.volume = 0.5;
    
    game.save("load");
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
    
    if (loadgame !== "") {
      game.load(loadgame);
    }
    
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

var loop = setInterval(game.loop, 50);
