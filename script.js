"use strict";

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
  tab: x => {
    if (game.data.clickCooldown === 0) {
      var numTabs = game.tabs.length;

      for (var i = 0; i < numTabs; i++) {
        game.tabs[i].style.display = "none";
      }

      game.tabs[x].style.display = "block";
      
      game.data.clickCooldown = 1;
    }
  },
  subtab: (x, y) => {
    if (game.data.clickCooldown === 0) {
      var numTabs = game.subtabs[x].length;

      for (var i = 0; i < numTabs; i++) {
        game.subtabs[x][i].style.display = "none";
      }

      game.subtabs[x][y].style.display = "block";
      
      game.data.clickCooldown = 1;
    }
  },
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
  base: () => 10 - game.data.factorShifts,
  factorMult: () => {
    var mult = 1;
    
    for (var i = 0; i < game.data.factorShifts; i++) {
      mult *= game.data.factors[i];
    }
    
    return mult;
  },
  incrementSpeed: () => game.data.incrementAuto * game.factorMult(),
  maximizeSpeed: () => game.data.maximizeAuto * game.factorMult(),
  opGain: (ord = game.data.ord, over = game.data.over, base = game.base()) => {
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
  increment: (manmade = true) => {
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
  maximize: (manmade = true) => {
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
  resetOrd: () => {
    game.data.ord = 0;
    game.data.over = 0;
  },
  markup: (manmade = true) => {
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
  buyIncrementAuto: (manmade = true) => {
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
  buyMaximizeAuto: (manmade = true) => {
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
  maxAll: (manmade = true) => {
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
  factorShift: (manmade = true) => {
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
        if (game.data.ord >= game.base() ** 2) {
          game.markup(false);
        }
        game.resetOrd();

        if (manmade) {
          game.data.clickCooldown = 1;
        }
      }
    }
  },
  buyFactor: (x, manmade = true) => {
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
  maxFactors: (manmade = true) => {
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
  fghexp: (n, x) => (n === 0) ? x : game.fghexp(n - 1, x) * 2 ** game.fghexp(n - 1, x),
  hardy: function(ord = game.data.ord, over = game.data.over, base = game.base()) {
    var tempvar = Math.floor(ord / base);
    var tempvar2 = Math.floor(ord / base ** 2);
    return (ord >= base ** 3) ? Infinity : game.fghexp(tempvar2, 2 ** (tempvar % base) * (base + ord - base * (tempvar % base) - base ** 2 * tempvar2 + over));
  },
  beautify: x => (x === Infinity) ? "Infinity" : (x < 1.000e6) ? (x < 1000 && x % 1 !== 0) ? (x * 10 % 1 === 0) ? x.toFixed(1) : (x * 100 % 1 === 0) ? x.toFixed(2) : x.toFixed(3) : x.toFixed(0) : `${(x / 10 ** Math.floor(Math.log10(x))).toFixed(3)}e${Math.floor(Math.log10(x))}`,
  writeOrd: (ord = game.data.ord, over = game.data.over, base = game.base(), header = true) => {
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
        if (game.hardy(ord, over, base) === Infinity) {
          game.header.innerHTML = `<span style="color:hsl(${color * 360}, 100%, 50%)">H<sub>${result}</sub>(${base})</span>`;
        } else {
          game.header.innerHTML = `<span style="color:hsl(${color * 360}, 100%, 50%)">H<sub>${result}</sub>(${base})=${game.beautify(game.hardy(ord, over, base))}`;
        }
      } else {
        if (game.hardy(ord, over, base) === Infinity) {
          game.header.innerHTML = `H<sub>${result}</sub>(${base})`;
        } else {
          game.header.innerHTML = `H<sub>${result}</sub>(${base})=${game.beautify(game.hardy(ord, over, base))}`;
        }
      }
    }
    
    return result;
  },
  toggleColor: () => {
    if (game.data.clickCooldown === 0) {
      if (game.data.colors) {
        game.data.colors = false;
      } else {
        game.data.colors = true;
      }
      
      game.data.clickCooldown++;
      
      game.save("toggleColor", false);
    }
  },
  toggleMusic: () => {
    if (game.data.clickCooldown === 0) {
      if (game.data.music) {
        game.data.music = false;
        game.music.pause();
      } else {
        game.data.music = true;
        game.music.play();
      }

      game.data.clickCooldown++;

      game.save("toggleMusic", false);
    }
  },
  render: () => { 
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
  loop: (unadjusted, off = false) => {
    var ms = Math.max(0, unadjusted);
    
    console.log(ms);
    
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

      if (game.data.pendingMaximize >= 1) {
        game.data.pendingMaximize -= 1;
        game.maximize(0);
      }
    }
    
    if (game.data.pendingIncrement >= 1) {
      if (game.data.pendingMaximize >= 1) {
        game.data.over = 0;
        
        game.data.ord += Math.min(
          Math.floor(game.data.pendingIncrement),
          game.base() * Math.floor(game.data.pendingMaximize),
        );
        
        game.data.pendingIncrement %= 1;
        game.data.pendingMaximize %= 1;
      } else if (Math.floor(game.data.pendingIncrement) >= game.base() - (game.data.ord % game.base())) {
        game.ord += game.base() - (game.data.ord % game.base()) - 1;
        game.over += Math.floor(game.data.pendingIncrement) - game.base() + (game.data.ord % game.base()) + 1;
        game.data.pendingIncrement %= 1;
      } else {
        game.ord += Math.floor(game.data.pendingIncrement);
        game.data.pendingIncrement %= 1;
      }
    }
    
    if (ms > 0) {
      game.render();
    }
    
    if (game.data.clickCooldown > 0) {
      game.data.clickCooldown--;
    }
  },
  handleOldVersions: loadgame => {
    if (loadgame.version === "0.1") {
      game.data.clickCooldown = 1;
      game.data.factorShifts = 0;
      game.data.factors = [];
    }
  },
  save: (action, manmade = true) => {
    if (!manmade || game.data.clickCooldown === 0) {
      if (manmade) {
        game.data.clickCooldown = 1;
      }
      
      localStorage.clear()
      localStorage.setItem("save", JSON.stringify(game.data));
    }
  },
  load: loadgame => {
    game.data = loadgame;
    
    game.data.version = "0.1.1";
    game.data.clickCooldown = 1;
    
    var diff = Date.now() - game.data.lastTick;
    
    game.handleOldVersions(loadgame);
    
    game.save("load", false);
    
    game.loop(diff, true);
    game.data.lastTick = Date.now();
    
    if (game.data.music) {
      game.music.play();
    }
  },
  reset: () => {
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
  importGame: () => {
    if (game.data.clickCooldown === 0) {
      var loadgame = "";

      reader.readAsText(document.getElementById("importButton").files[0]);

      loadgame = JSON.parse(atob(reader.result));

      if (loadgame !== "") {
        game.load(loadgame);
      }

      window.location.reload();
    }
  },
  exportGame: () => {
    if (game.data.clickCooldown === 0) {
      game.save("export", false);

      var file = new Blob([btoa(JSON.stringify(game.data))], {type: "text/plain"});

      window.URL = window.URL || window.webkitURL;

      var importButton = document.createElement("importButton");

      importButton.href = window.URL.createObjectURL(file);
      importButton.download = "Ordinal Markup Save.txt";
      importButton.click();
      
      game.data.clickCooldown = 1;
    }
  },
  resetConf: () => {
    if (game.data.clickCooldown === 0) {
      var code = prompt(
        'Are you sure you want to delete all of your progress? Type in "reset game" to reset all of your progress.'
      );

      if (code !== null) {
        if (code.toLowerCase() === "reset game") {
          game.reset();
        }
      }
      
      game.data.clickCooldown = 1;
    }
  }
};

game.load(JSON.parse(localStorage.getItem("save")));

var loop = setInterval(() => game.loop(Date.now() - game.data.lastTick), 50);

var autoSave = setInterval(() => game.save("autosave", false), 5000);
