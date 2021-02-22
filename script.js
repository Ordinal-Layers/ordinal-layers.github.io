var game = {
  data: {
    version: "0.1.1",
    lastTick: Date.now(),
    pendingIncrement: 0,
    pendingMaximize: 0,
    clickCooldown: 1,
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
    1.000e6,
    1.000e10,
    1.000e20,
    1.000e100,
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
    } else if (ord >= base ** (base ** base)) {
      return 1.000e230;
    } else {
      var tempvar = Math.floor(Math.log(ord) / Math.log(base));
      var tempvar2 = base ** tempvar;
      var tempvar3 = Math.floor(ord / tempvar2);
      
      return Math.min(
        1.000e230,
        10 ** game.opGain(tempvar, 0, base) * tempvar3 +
          game.opGain(ord - tempvar2 * tempvar3, over, base)
      );
    }
  },
  increment: function(manmade = true) {
    if (!manmade || game.data.clickCooldown === 0) {
      if (game.data.ord % game.base() === game.base() - 1) {
        game.data.over++;
      } else {
        game.data.ord++;
      }

      if (manmade) {
        game.data.clickCooldown = 1;
      }
    }
  },
  maximize: function(manmade = true) {
    if (!manmade || game.data.clickCooldown === 0) {
      if (game.data.ord % game.base() === game.base() - 1 && game.data.over >= 1) {
        game.data.ord -= game.base() - 1;
        game.data.over += game.base() - 1;
        
        do {
          game.data.over -= Math.ceil((game.data.over + game.base()) / 2);
          game.data.ord += game.base();
        }
        while (game.data.over + game.base() >= game.base() * 2 && game.data.ord % game.base() ** 2 !== 0);
        
        if (game.data.ord % game.base() ** 2 !== 0) {
          game.data.ord += game.data.over;
        }

        game.data.over = 0;
        
        if (manmade) {
          game.data.clickCooldown = 1;
        }
      }
    }
  },
  resetOrd: function() {
    game.data.ord = 0;
    game.data.over = 0;
  },
  markup: function(manmade = true) {
    if (!manmade || game.data.clickCooldown === 0) {
      if (game.data.ord >= game.base() ** 2) {
        game.data.op += game.opGain();
        game.resetOrd();

        if (game.data.markupUnlocked === false) {
          game.data.markupUnlocked = true;
        }

        if (manmade) {
          game.data.clickCooldown = 1;
        }
      }
    }
  },
  buyIncrementAuto: function(manmade = true) {
    if (!manmade || game.data.clickCooldown === 0) {
      if (game.data.op >= 100 * 2 ** game.data.incrementAuto) {
        game.data.op -= 100 * 2 ** game.data.incrementAuto;
        game.data.incrementAuto++;

        if (manmade) {
          game.data.clickCooldown = 1;
        }
      }
    }
  },
  buyMaximizeAuto: function(manmade = true) {
    if (!manmade || game.data.clickCooldown === 0) {
      if (game.data.op >= 100 * 2 ** game.data.maximizeAuto) {
        game.data.op -= 100 * 2 ** game.data.maximizeAuto;
        game.data.maximizeAuto++;

        if (manmade) {
          game.data.clickCooldown = 1;
        }
      }
    }
  },
  maxAll: function(manmade = true) {
    if (!manmade || game.data.clickCooldown === 0) {
      var bulk = 0;

      game.buyIncrementAuto(false);
      game.buyMaximizeAuto(false);
      bulk = Math.floor(
        Math.log(1 + game.data.op / (100 * 2 ** game.data.incrementAuto)) / Math.log(2)
      );
      game.data.op -= (2 ** bulk - 1) * (100 * 2 ** game.data.incrementAuto);
      game.data.incrementAuto += bulk;
      bulk = Math.floor(
        Math.log(1 + game.data.op / (100 * 2 ** game.data.maximizeAuto)) / Math.log(2)
      );
      game.data.op -= (2 ** bulk - 1) * (100 * 2 ** game.data.maximizeAuto);
      game.data.maximizeAuto += bulk;

      if (manmade) {
        game.data.clickCooldown = 1;
      }
    }
  },
  factorShift: function(manmade = true) {
    if (!manmade || game.data.clickCooldown === 0) {
      if (game.data.op >= game.factorShiftCosts[game.data.factorShifts]) {
        game.data.op = 0;
        game.data.incrementAuto = 0;
        game.data.maximizeAuto = 0;
        for (var i = 0; i < game.data.factorShifts; i++) {
          game.data.factors[i] = 1;
        }
        game.data.factorShifts++;
        game.data.factors.push(1);
        game.resetOrd();

        if (manmade) {
          game.data.clickCooldown = 1;
        }
      }
    }
  },
  buyFactor: function(x, manmade = true) {
    if (!manmade || game.data.clickCooldown === 0) {
      if (game.data.op >= 10 ** (x * game.data.factors[x - 1]) && game.data.factors[x - 1] < 10) {
        game.data.op -= 10 ** (x * game.data.factors[x - 1]);
        game.data.factors[x - 1]++;
      }
      
      if (manmade) {
        game.data.clickCooldown = 1;
      }
    }
  },
  maxFactors: function(manmade = true) {
    if (!manmade || game.data.clickCooldown === 0) {
      for (var i = 1; i <= game.data.factorShifts; i++) {
        while (game.data.factors[i - 1] < 10 && game.data.op >= 10 ** (i * game.data.factors[i - 1])) {
          game.buyFactor(i, false);
        }
      }
      
      if (manmade) {
        game.data.clickCooldown = 1;
      }
    }
  },
  hardy: function(ord = game.data.ord, over = game.data.over, base = game.base()) {
    if (ord >= base ** 3) {
      return Infinity;
    } else if (ord >= base ** 2) {
      return game.hardy(ord - base ** 2, over, base) * 2 ** game.hardy(ord - base ** 2, over, base);
    } else {
      var tempvar = Math.floor(ord / base);
      return 2 ** tempvar * (base + ord - base * tempvar + over);
    }
  },
  beautify: function(x) {
    if (x === Infinity) {
      return "Infinity";
    } else if (x < 1.000e6) {
      if (x < 1000) {
        if (x % 1 === 0) {
          return x.toFixed(0);
        } else if (x * 10 % 1 === 0) {
          return x.toFixed(1);
        } else if (x * 100 % 1 === 0) {
          return x.toFixed(2);
        } else {
          return x.toFixed(3);
        }
      } else {
        return Math.round(x).toString();
      }
    } else {
      var exponent = Math.floor(Math.log10(x));
      var mantissa = x / 10 ** exponent;
      return `${mantissa.toFixed(3)}e${exponent}`;
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
                result = `&omega;${Math.floor(remainOrd / base)}`;
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
                result = `${result}+&omega;${Math.floor(remainOrd / base)}`;
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
          game.header.innerHTML = `<span style="color:hsl(${color * 360}, 100%, 50%)">H<sub>${result}</sub>(${base})=${game.beautify(game.hardy(ord, over, base))}`;
        }
      } else {
        if (game.hardy(ord, over) === Infinity) {
          game.header.innerHTML = `H<sub>${result}</sub>(${base})`;
        } else {
          game.header.innerHTML = `H<sub>${result}</sub>(${base})=${game.beautify(game.hardy(ord, over, base))}`;
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
      game.music.pause();
    } else {
      game.data.music = true;
      game.music.play();
    }
    game.save();
  },
  render: function(action, manmade = 1) { 
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
    
    if (game.data.ord >= game.base() ** 2) {
      game.markupButton.innerHTML = `Markup to gain ${game.beautify(game.opGain())} Ordinal Points`;
      game.markupButton2.innerHTML = `+${game.beautify(game.opGain())}`;
    } else {
      game.markupButton.innerHTML = `Reach &omega;<sup>2</sup> to Markup`;
      game.markupButton2.innerHTML = `Reach &omega;<sup>2</sup> to Markup`;
    }
    
    if (game.data.markupUnlocked) {
      game.markupTab.style.display = "inline";
    } else {
      game.markupTab.style.display = "none";
    }
    
    game.opText.innerHTML = `You have ${game.beautify(game.data.op)} Ordinal Points`;
    
    game.incrementSpeedText.innerHTML = `You have ${game.beautify(game.data.incrementAuto)} increment autoclickers, clicking the increment button ${game.beautify(game.incrementSpeed())} times per second`;
    game.maximizeSpeedText.innerHTML = `You have ${game.beautify(game.data.maximizeAuto)} maximize autoclickers, clicking the maximize button ${game.beautify(game.maximizeSpeed())} times per second`;
    
    game.buyIncrementButton.innerHTML = `Buy Increment Autoclicker for ${game.beautify(100 * 2 ** game.data.incrementAuto)} OP`;
    game.buyMaximizeButton.innerHTML = `Buy Maximize Autoclicker for ${game.beautify(100 * 2 ** game.data.maximizeAuto)} OP`;
    
    if (game.data.factorShifts === 0) {
      game.noFactors.style.display = "block";
      game.factorList.style.display = "none";
      game.factorMultiplier.style.display = "none";
    } else {
      game.noFactors.style.display = "none";
      game.factorList.style.display = "block";
      game.factorMultiplier.style.display = "inline";
    }
    
    game.factorMultiplier.innerHTML = `Your factors are multiplying your autoclicker speed by ${game.beautify(game.factorMult())}`;
    game.factorShiftText.innerHTML = `Factor Shift: Requires ${game.beautify(game.factorShiftCosts[game.data.factorShifts])} OP`;
    
    for (var i = 0; i < 7; i++) {
      if (game.data.factorShifts > i) {
        game.factors[i].style.display = "list-item";
      } else {
        game.factors[i].style.display = "none";
      }
      
      game.factorMults[i].innerHTML = `x${game.data.factors[i]}`;
      
      if (game.data.factors[i] === 10) {
        game.factorButtons[i].innerHTML = `Maxed!`;
      } else {
        game.factorButtons[i].innerHTML = `Increase Factor ${(i + 1)} for ${game.beautify(10 ** ((i + 1) * game.data.factors[i]))} OP`;
      }
    }
  },
  loop: function(unadjusted, off = false) {
    var ms = Math.max(0, unadjusted);
    
    game.data.lastTick = Date.now();
    
    if (game.data.op > 1.000e230) {
      game.data.op = 1.000e230;
    }
    
    if (game.incrementSpeed() > 0) {
      game.data.pendingIncrement += ms / 1000 * game.incrementSpeed();

      if (game.data.pendingIncrement >= 1) {
        game.data.pendingIncrement -= 1;
        game.increment(0);
      }
    }
    
    if (game.maximizeSpeed() > 0) {
      game.data.pendingMaximize += ms / 1000 * game.maximizeSpeed();

      if ((game.data.ord % game.base() === game.base() - 1 && game.data.over >= 1) && game.data.pendingMaximize >= 1) {
        game.data.pendingMaximize -= 1;
        game.maximize(0);
      }
    }
    
    if (game.data.pendingIncrement >= 1) {
      if (game.data.pendingMaximize >= 1) {
        game.over = 0;
        
        game.ord += Math.min(
          Math.floor(game.data.pendingIncrement),
          game.base * Math.floor(game.data.pendingMaximize),
        );
        
        game.data.pendingIncrement %= 1;
        game.data.pendingMaximize %= 1;
      } else if (Math.floor(game.data.pendingIncrement) >= game.base() - (game.data.ord % game.base())) {
        game.ord += game.base - (game.ord % game.base) - 1;
        game.over += Math.floor(game.data.pendingIncrement) - game.base + (game.ord % game.base) + 1;
        game.data.pendingIncrement %= 1;
      } else {
        game.ord += Math.floor(game.data.pendingIncrement);
        game.data.pendingIncrement %= 1;
      }
    }
    
    if (game.data.clickCooldown > 0) {
      game.data.clickCooldown--;
    }
    
    game.render();
  },
  handleOldVersions: function(loadgame) {
    game.data.version = "0.1.1";
    if (loadgame.version = "0.1") {
      game.data.clickCooldown = 1;
      game.data.factorShifts = 0;
      game.data.factors = [];
    }
  },
  save: function(action, manmade = true) {
    localStorage.clear()
    localStorage.setItem("save", JSON.stringify(game.data));
    
    game.render(action, manmade);
  },
  load: function(loadgame) {
    game.data = loadgame;
    
    var diff = Date.now() - game.data.lastTick;
    
    game.handleOldVersions(loadgame);
    
    game.save("load", false);
    
    game.loop(diff, true);
    
    game.data.lastTick = Date.now();
    
    if (game.data.music) {
      game.music.play();
    }
  },
  reset: function() {
    game.data = {
      version: "0.1.1",
      lastTick: Date.now(),
      pendingIncrement: 0,
      pendingMaximize: 0,
      clickCooldown: 1,
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
    
    game.save("reset", false);
  },
  importGame: function() {
    var loadgame = "";
    
    reader.readAsText(document.getElementById("importButton").files[0]);
    
    loadgame = JSON.parse(atob(reader.result));
    
    if (loadgame !== "") {
      game.load(loadgame);
    }
    
    window.location.reload();
  },
  exportGame: function() {
    game.save("export", false);
    
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

var loop = setInterval(function(){game.loop(Date.now() - game.data.lastTick)}, 50);

var autoSave = setInterval(function(){game.save("autosave", false)}, 5000);
