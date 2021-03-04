"use strict";

var game = {
  data: {
    version: "0.2",
    lastTick: Date.now(),
    pendingIncrement: 0,
    pendingMaximize: 0,
    pendingMaxAll: 0,
    pendingMarkup: 0,
    clickCooldown: 1,
    achievements: [
      [false, false, false, false, false, false, false, false, false, false]
    ],
    highestLevel: 0,
    markupUnlocked: false,
    boosterUnlocked: false,
    colors: true,
    music: true,
    ord: 0,
    over: 0,
    op: 0,
    incrementAuto: 0,
    maximizeAuto: 0,
    factorShifts: 0,
    factors: [],
    factorBoosts: 0,
    dynamicFactor: 1,
    bups: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false]
    ]
  },
  music: document.getElementById("music"),
  header: document.getElementById("header"),
  colorButton: document.getElementById("colorButton"),
  musicButton: document.getElementById("musicButton"),
  currentLevelText: document.getElementById("currentLevel"),
  nextLevelText: document.getElementById("nextLevel"),
  highestLevelText: document.getElementById("highestLevel"),
  markupTab: document.getElementById("markupTabButton"),
  markupButton: document.getElementById("markupButton"),
  markupButton2: document.getElementById("markupButton2"),
  opText: document.getElementById("opText"),
  incrementAuto: document.getElementById("incrementAuto"),
  maximizeAuto: document.getElementById("maximizeAuto"),
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
  factorBoostText: document.getElementById("factorBoost"),
  factorBoostButton: document.getElementById("factorBoostButton"),
  dynamicMult: document.getElementById("dynamicMult"),
  bups: [
    [
      document.getElementById("bup00"),
      document.getElementById("bup01"),
      document.getElementById("bup02"),
      document.getElementById("bup03")
    ],
    [
      document.getElementById("bup10"),
      document.getElementById("bup11"),
      document.getElementById("bup12"),
      document.getElementById("bup13")
    ],
    [
      document.getElementById("bup20"),
      document.getElementById("bup21"),
      document.getElementById("bup22"),
      document.getElementById("bup23")
    ],
    [
      document.getElementById("bup30"),
      document.getElementById("bup31"),
      document.getElementById("bup32"),
      document.getElementById("bup33")
    ]
  ],
  maxAllAuto: document.getElementById("maxAllAuto"),
  markupAuto: document.getElementById("markupAuto"),
  tabs: [
    document.getElementById("tab0"),
    document.getElementById("tab1"),
    document.getElementById("tab2"),
    document.getElementById("tab3"),
    document.getElementById("tab4")
  ],
  subtabs: [
    [],
    [],
    [],
    [
      document.getElementById("subtab30"),
      document.getElementById("subtab31"),
      document.getElementById("subtab32")
    ],
    [
      document.getElementById("subtab40"),
      document.getElementById("subtab41")
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
  autoclickerCost: x => x < 2.000e230 ? 100 * 2 ** x: x,
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
  factorBoostCosts: [3, 3, 9, 3, 3, 9, 3, 3, 27, 3, 3, 9, 3, 3, 9, 3, 3, 27, 3, 3, 9, 3, 3, 9, 3, 3, 729],
  bupCosts: [
    [1, 1, 1, 15],
    [6, 6, 10, 45],
    [66, 66, 21, 120],
    [55, 78, 66, 378]
  ],
  boosters: () => {
    var boost = game.data.factorBoosts * (game.data.factorBoosts + 1) / 2;
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 3; x++) {
        if (game.data.bups[y][x]) {
          boost -= game.bupCosts[y][x];
        }
      }
    }
    return boost;
  },
  base: () => {
    var base = 10;
    base -= game.data.factorShifts;
    if (game.data.bups[2][0] && base > 7) {
      base -= 4;
    }
    if (game.data.bups[2][1] && game.data.ord < 1.000e230) {
      base = 5;
    }
    return base;
  },
  factorMult: () => {
    var mult = 1;
    
    for (var i = 0; i < game.data.factorShifts; i++) {
      mult *= (game.data.factors[i] + (game.data.bups[2][2] ? 5: 0)) * (game.data.bups[0][0] ? 2: 1);
    }
    
    return mult;
  },
  incrementSpeed: () => 
    game.data.incrementAuto *
    game.factorMult() *
    (game.data.boosterUnlocked ? game.data.dynamicFactor * 5: 1) *
    (game.data.bups[1][1] ? Math.sqrt(2 * game.boosters() + 1 / 4) + 1 / 2: 1),
  maximizeSpeed: () => 
    (game.data.maximizeAuto + (game.data.boosterUnlocked ? 1: 0)) *
    game.factorMult() *
    (game.data.boosterUnlocked ? game.data.dynamicFactor * 5: 1) *
    (game.data.bups[1][1] ? Math.sqrt(2 * game.boosters() + 1 / 4) + 1 / 2: 1),
  maxAllSpeed: () =>
    game.data.bups[0][1] ?
      game.data.bups[1][1] ?
        Math.sqrt(2 * game.boosters() + 1 / 4) + 1 / 2:
        1:
      0,
  markupSpeed: () =>
    game.data.bups[0][2] ?
      game.data.bups[1][1] ?
        Math.sqrt(2 * game.boosters() + 1 / 4) + 1 / 2:
        1:
      0,
  opGain: (ord = game.data.ord, over = game.data.over, base = game.base()) => {
    if (ord < base) {
      return ord + over;
    } else if (ord >= 1.000e230) {
      return ord + 1.000e230;
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
  V: x => x === 0 ? 1.000e230: (x >= 27 ? Infinity: game.V(x - 1) * game.factorBoostCosts[x - 1]),
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
        if (game.opGain() >= 2.000e230) {
          game.data.op = game.opGain();
        } else {
          game.data.op += Math.min(
            game.opGain() * 
            (game.data.op < 2.000e230 && game.data.bups[1][0] ? 5: 1) * 
            (game.data.op < 2.000e230 && game.data.bups[3][2] && game.base() < 6 ? 666666: 1),
            1.000e230
          );
          if (game.data.op > 1.000e230) {
            game.data.op = 1.000e230;
          }
        }
        
        game.resetOrd();
        
        game.data.dynamicFactor = 1;

        if (!game.data.markupUnlocked) {
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
      if (game.data.op >= game.autoclickerCost(game.data.incrementAuto)) {
        if (game.data.op < 2.000e230) {
          game.data.op -= game.autoclickerCost(game.data.incrementAuto);
        }
        game.data.incrementAuto++;

        if (manmade) {
          game.data.clickCooldown = 1;
        }
      }
    }
  },
  buyMaximizeAuto: (manmade = true) => {
    if (!manmade || game.data.clickCooldown === 0) {
      if (game.data.op >= game.autoclickerCost(game.data.maximizeAuto)) {
        if (game.data.op < 2.000e230) {
          game.data.op -= game.autoclickerCost(game.data.maximizeAuto);
        }
        game.data.maximizeAuto++;

        if (manmade) {
          game.data.clickCooldown = 1;
        }
      }
    }
  },
  maxAll: (manmade = true) => {
    if (!manmade || game.data.clickCooldown === 0) {
      if (game.data.op < 2.000e230) {
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
      } else {
        game.data.incrementAuto = game.data.op;
        game.data.maximizeAuto = game.data.op;
      }

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
        if (game.data.op < 2.000e230) {
          game.data.op -= 10 ** (x * game.data.factors[x - 1]);
        }
        game.data.factors[x - 1]++;
      }
      
      if (manmade) {
        game.data.clickCooldown = 1;
      }
    }
  },
  maxFactors: (manmade = true) => {
    if (!manmade || game.data.clickCooldown === 0) {
      if (game.data.op >= 2.000e230) {
        game.data.factors = [10, 10, 10, 10, 10, 10, 10];
      } else {
        for (var i = 1; i <= game.data.factorShifts; i++) {
          while (game.data.factors[i - 1] < 10 && game.data.op >= 10 ** (i * game.data.factors[i - 1])) {
            game.buyFactor(i, false);
          }
        }
      }
      
      if (manmade) {
        game.data.clickCooldown = 1;
      }
    }
  },
  maxMarkup: (manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
      game.maxAll(false);
      game.maxFactors(false);
      
      if (manmade) {
        game.data.clickCooldown = 1;
      }
    }
  },
  resetMarkup: () => {
    game.resetOrd();
    game.data.op = 0;
    game.data.incrementAuto = 0;
    game.data.maximizeAuto = 0;
    game.data.factorShifts = 0;
    game.data.factors = [];
    game.data.dynamicFactor = 1;
  },
  factorBoost: (manmade = true) => {
    if (!manmade || game.data.clickCooldown === 0) {
      if (game.data.op >= game.V(game.data.factorBoosts + 1) + 1.000e230) {
        var conf = true;
        if (manmade) {
          conf = confirm(
            "Are you sure you want to do a Factor Boost?"
          );
        }
        if (conf) {
          game.factorBoosts++;
          game.resetMarkup();
          
          if (!game.data.boosterUnlocked) {
            game.data.boosterUnlocked = true;
          }
        }
      }
      
      if (manmade) {
        game.data.clickCooldown = 1;
      }
    }
  },
  buyBup: (x, y, manmade = true) => {
    if (!manmade || game.data.clickCooldown === 0) {
      if (game.boosters() >= game.bupCosts[y][x] && game.data.bups[y - 1][x]) {
        game.data.bups[y][x] = true;
        if (y === 2 && (x === 0 || x === 1)) {
          game.resetOrd();
        }
      }
      
      if (manmade) {
        game.data.clickCooldown = 1;
      }
    }
  },
  refundBups: (manmade = true) => {
    if (!manmade || game.data.clickCooldown === 0) {
      if (game.data.bups !== [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false]
      ]) {
        var conf = true;
        if (manmade) {
          conf = confirm(
            "Are you sure you want to refund your boosters? You'll reset this Factor Boost!"
          );
        }
        if (conf) {
          var rightrow = [];
          for (var i = 0; i < 4; i++) {
            rightrow.push(game.data.bups[i][3]);
          }
          game.data.bups = [
            [false, false, false, rightrow[0]],
            [false, false, false, rightrow[1]],
            [false, false, false, rightrow[2]],
            [false, false, false, rightrow[3]]
          ];
        }
      }
      
      if (manmade) {
        game.data.clickCooldown = 1;
      }
    }
  },
  ordLevels: [
    () => 0,
    () => 1,
    () => game.base(),
    () => game.base() * 2,
    () => game.base() * 3,
    () => game.base() ** 2,
    () => game.base() ** 3,
    () => game.base() ** game.base(),
    () => game.base() ** (game.base() * 2),
    () => game.base() ** (game.base() ** 2),
    () => game.V(0),
    () => game.V(1),
    () => game.V(2),
    () => game.V(3),
    () => game.V(4),
    () => game.V(5),
    () => game.V(6),
    () => game.V(7),
    () => game.V(8),
    () => game.V(9),
    () => game.V(10),
    () => game.V(11),
    () => game.V(12),
    () => game.V(13),
    () => game.V(14),
    () => game.V(15),
    () => game.V(16),
    () => game.V(17),
    () => game.V(18),
    () => game.V(19),
    () => game.V(20),
    () => game.V(21),
    () => game.V(22),
    () => game.V(23),
    () => game.V(24),
    () => game.V(25),
    () => game.V(26),
    () => Infinity
  ],
  currentLevel: () => {
    var level = 0;
    while (game.ord >= game.ordLevels[level]) {
      level++;
    }
    return level - 1;
  },
  achieve: {
    rowReq: [
      () => true,
      () => game.data.op >= 100,
      () => game.data.factorShifts >= 1,
      () => game.data.factorBoosts >= 1,
      () => false
    ],
    rowName: [
      "Ordinals",
      "Markup",
      "Factors",
      "Boosters"
    ],
    rowTooltip: [
      "Perform a Markup to unlock the next row of achievements",
      "Perform a Factor Shift to unlock the next row of achievements",
      "Perform a Factor Boost to unlock the next row of achievements",
      "Next row of achievements is coming soon!"
    ],
    achieveReq: [
      [
        () => game.data.ord >= 1,
        () => game.data.ord >= game.base(),
        () => game.data.ord >= game.base() ** 2,
        () => game.data.ord >= game.base() ** 3,
        () => game.data.ord >= game.base() ** game.base(),
        () => game.data.ord >= 1.000e230,
        () => game.data.ord >= game.V(9),
        () => game.data.ord >= game.V(18),
        () => false,
        () => false
      ],
      [
        () => game.data.op >= 100,
        () => game.data.op >= 1000,
        () => game.data.op >= 1.000e6,
        () => game.data.op >= 1.000e10,
        () => game.data.op >= 1.000e100,
        () => game.data.op >= 1.000e230,
        () => game.data.op >= game.V(9),
        () => game.data.op >= game.V(18),
        () => false,
        () => false
      ],
      [
        () => game.data.factorShifts >= 1,
        () => game.data.factorShifts >= 2,
        () => game.data.factorShifts >= 3,
        () => game.data.factorShifts >= 4,
        () => game.data.factorShifts >= 5,
        () => game.data.factorShifts >= 6,
        () => game.data.factorShifts >= 7,
        () => game.factorMult() >= 1.000e7,
        () => game.factorMult() >= 1.000e9,
        () => false
      ],
      [
        () => game.data.factorBoosts >= 1,
        () => game.data.factorBoosts >= 5,
        () => game.data.factorBoosts >= 9,
        () => game.data.factorBoosts >= 15,
        () => false,
        () => false,
        () => false,
        () => false,
        () => false,
        () => false
      ]
    ],
    achieveName: [
      [
        "You gotta start somewhere",
        "Maximizable",
        "Markupable",
        "able",
        "Hyperdimensional",
        "Ordinal Collapsing Functions",
        "Ackermann Ordinal",
        "Double Ackermann Ordinal",
        "Way too much",
        "Way too much"
      ],
      [
        "Markup!",
        "Shiftable",
        "Quadruple Shiftable",
        "Quintuple Shiftable",
        "Septuple Shiftable",
        "Boostable",
        "Nonuple Boostable",
        "Octendecuple Boostable",
        "Way too much",
        "Way too much"
      ],
      [
        "I've been Multiplied!",
        "100 Ordinal Points is a Lot",
        "Illuminati Confirmed!",
        "Left and Right 3 Factors",
        "5 Factor Ordinal Punch",
        "We can't afford 8",
        "Luck Related Achievement",
        "Faster than a potato",
        "Faster than a hundred potatoes",
        "Way too much"
      ],
      [
        "Boost!",
        "Quintuple Boost",
        "Nonuple Boost",
        "Quindecuple Boost",
        "Way too much",
        "Way too much",
        "Way too much",
        "Way too much",
        "Way too much",
        "Way too much"
      ]
    ],
    achieveTooltip: [
      [
        "Click the successor button",
        "Reach the ordinal &omega;",
        "Reach the ordinal &omega;<sup>2</sup>",
        "Reach the ordinal &omega;<sup>3</sup>",
        "Reach the ordinal &omega;<sup>&omega;</sup>",
        "Reach the ordinal &psi;(1)",
        "Reach the ordinal &psi;(&Omega;<sup>&Omega;<sup>2</sup></sup>)",
        "Reach the ordinal &psi;(&Omega;<sup>&Omega;<sup>2</sup>2</sup>)",
        "Reach the ordinal &omega;<sub>1</sub><sup>CK</sup>",
        "Reach the ordinal &omega;<sub>1</sub><sup>CK</sup>"
      ]
    ]
  },
  checkAchieve: function() {
    for (var y = 0; y < game.data.achievements.length; y++) {
      if (game.achieve.rowReq[y]() && y > 0) {
        game.data.achievements.push(
          [false, false, false, false, false, false, false, false, false, false]
        );
        $.notify("New Achievement Row Unlocked: " + game.achieve.rowName[y], "achieve");
      }
      for (var x = 0; x < 10; x++) {
        if (game.achieve.achieveReq[y][x]()) {
          game.data.achievements[y][x] = true;
          $.notify("New Achievement Unlocked: " + game.achieve.achieveName[y][x], "achieve");
        }
      }
    }
    if (game.currentLevel() > game.data.highestLevel) {
      game.data.highestLevel = game.currentLevel();
      $.notify("Ordinal Level " + game.currentLevel() + " Reached!", "achieve");
    }
  },
  keybinds: {
    i: () => game.markup(),
    m: () => game.maxMarkup(),
    s: () => game.factorShift(),
    b: () => game.factorBoost(),
    r: () => game.refundBups(),
  },
  fghexp: (n, x) => (n === 0) ? x : game.fghexp(n - 1, x) * 2 ** game.fghexp(n - 1, x),
  hardy: function(ord = game.data.ord, over = game.data.over, base = game.base()) {
    var tempvar = Math.floor(ord / base);
    var tempvar2 = Math.floor(ord / base ** 2);
    return (ord >= base ** 3) ? Infinity: game.fghexp(tempvar2, 2 ** (tempvar % base) * (base + ord - base * (tempvar % base) - base ** 2 * tempvar2 + over));
  },
  ordMarks: [
    x => `&psi;(${x})`,
    x => `&psi;(&Omega;${x})`,
    x => `&psi;(&Omega;<sup>2</sup>${x})`,
    x => `&psi;(&Omega;<sup>${x}</sup>)`,
    x => `&psi;(&Omega;<sup>&Omega;</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;+1</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;+2</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;+${x}</sup>)`,
    x => `&psi;(&Omega;<sup>&Omega;2</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;2+1</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;2+2</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;2+${x}</sup>)`,
    x => `&psi;(&Omega;<sup>&Omega;${x}</sup>)`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup></sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>+1</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>+2</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>+${x}</sup>)`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;+1</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;+2</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;+${x}</sup>)`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;2</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;2+1</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;2+2</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;2+${x}</sup>)`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;${x}</sup>)`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>2</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+1</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+2</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+${x}</sup>)`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;+1</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;+2</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;+${x}</sup>)`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;2</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;2+1</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;2+2</sup>${x})`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;2+${x}</sup>)`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;${x}</sup>)`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>2<sup>${x}</sup>)`,
    x => `&psi;(&Omega;<sup>&Omega;<sup>${x}</sup></sup>)`,
    x => `&psi;(&Omega;&uarr;&uarr;${x})`
  ],
  ordPowers: [
    3,
    7,
    11,
    12,
    16,
    20,
    24,
    25,
    29,
    33,
    37,
    38,
    39,
    40,
    41
  ],
  writeOrd: (ord = game.data.ord, over = game.data.over, base = game.base()) => {
    if (ord === 0) {
      return `0`;
    } else if (ord === Infinity) {
      return `&omega;<sub>1</sub><sup>CK</sup>`;
    } else if (ord < 1.000e230 || base > 3) {
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
      
      return result;
    } else {
      var result = ``;
      var remainOrd = ord;
      
      while (remainOrd > 0) {
        var power = Math.min(41, Math.floor(Math.log(remainOrd / 1.000e230) / Math.log(3)));
                             
        if (result = ``) {
          if (power === 0) {
            result = `1`;
          }
          if (game.ordPowers.includes(power)) {
            result = `&omega;`;
          }
        }
        
        result = game.ordMarks[power](result);
        
        remainOrd -= 1.000e230 * 3 ** power;
      }
      
      return result;
    }
  },
  beautify: x => 
    (x === Infinity) ?
      `Infinity`:
      (x >= 2.000e230) ?
        `g<sub>${game.writeOrd(x - 1.000e230)}</sub>(10)`:
        (x < 1.000e6) ?
          (x < 1000 && x % 1 !== 0) ?
            (x * 10 % 1 === 0) ?
              x.toFixed(1):
              (x * 100 % 1 === 0) ?
                x.toFixed(2):
                x.toFixed(3):
          x.toFixed(0):
        `${(x / 10 ** Math.floor(Math.log10(x))).toFixed(3)}e${Math.floor(Math.log10(x))}`,
  ordColor: (ord = game.data.ord, over = game.data.over, base = game.data.base) => 
    ord === 0 || ord === Infinity ?
      0:
      ord < 1.000e230 ?
        Math.log(ord + over) / (Math.log(3) * 27):
        Math.log(ord / 1.000e230) / (Math.log(3) * 42),
  toggleColor: () => {
    if (game.data.clickCooldown === 0) {
      game.data.colors = !game.data.colors;
      
      game.data.clickCooldown = 1;
      
      game.save("toggleColor", false);
    }
  },
  toggleMusic: () => {
    if (game.data.clickCooldown === 0) {
      game.data.music = !game.data.music;
      
      if (game.data.music) {
        game.music.play();
      } else {
        game.music.pause();
      }
      
      game.data.clickCooldown = 1;

      game.save("toggleMusic", false);
    }
  },
  render: () => { 
    game.header.innerHTML = 
      `${game.data.colors ? `<span style="color:hsl(${game.ordColor()}, 100%, 50%)">`: ``}H<sub>${game.writeOrd()}</sub>(${game.base()})${game.hardy() === Infinity ? ``: `=${game.hardy()}`}${game.data.colors ? `</span>`: ``}`;
    
    game.colorButton.innerHTML = game.data.colors ? `Colors: ON`: `Colors: OFF`;
    
    game.musicButton.innerHTML = game.data.music ? `Music: ON`: `Music: OFF`;
    
    game.currentLevelText = `Your current Ordinal Level is ${game.currentLevel()}`;
    game.nextLevelText = `Next Ordinal Level is at ${game.writeOrd(game.ordLevels[game.currentLevel() + 1])}`;
    game.highestLevelText = `Your highest Ordinal Level was ${game.data.highestlevel}`;
    
    game.markupButton.innerHTML = 
      game.data.ord >= game.base() ** 2 ? `Markup to gain ${game.beautify(game.opGain())} Ordinal Points (I)`: `Reach &omega;<sup>2</sup> to Markup`;
    game.markupButton2.innerHTML = 
      game.data.ord >= game.base() ** 2 ? `+${game.beautify(game.opGain())} (I)`: `Reach &omega;<sup>2</sup> to Markup`;
    
    game.markupTab.style.display = game.data.markupUnlocked ? "inline": "none";
    
    game.opText.innerHTML = `You have ${game.beautify(game.data.op)} Ordinal Points`;
    
    game.incrementAuto.innerHTML = 
      `You have ${game.beautify(game.data.incrementAuto)} increment autoclickers, clicking the increment button ${game.beautify(game.incrementSpeed())} times per second`;
    game.maximizeAuto.innerHTML = 
      `You have ${game.beautify(game.data.maximizeAuto + (game.data.boosterUnlocked ? 1: 0))} maximize autoclickers, clicking the maximize button ${game.beautify(game.maximizeSpeed())} times per second`;
    
    game.buyIncrementButton.innerHTML = `Buy Increment Autoclicker for ${game.beautify(100 * 2 ** game.data.incrementAuto)} OP`;
    game.buyMaximizeButton.innerHTML = `Buy Maximize Autoclicker for ${game.beautify(100 * 2 ** game.data.maximizeAuto)} OP`;
    
    game.noFactors.style.display = game.data.factorShifts === 0 ? "block": "none";
    game.factorList.style.display = game.data.factorShifts === 0 ? "none": "block";
    game.factorMultiplier.style.display = game.data.factorShifts === 0 ? "none": "inline";
    
    game.factorMultiplier.innerHTML = `Your factors are multiplying your autoclicker speed by ${game.beautify(game.factorMult())}`;
    game.factorShiftText.innerHTML = `Factor Shift: Requires ${game.beautify(game.factorShiftCosts[game.data.factorShifts])} OP`;
    
    for (var i = 0; i < 7; i++) {
      game.factors[i].style.display = game.data.factorShifts > i ? "list-item": "none";
      game.factorMults[i].innerHTML = `x${game.data.factors[i]}`;
      game.factorButtons[i].innerHTML = 
        game.data.factors[i] === 10 ? 
          `Maxed!`:
          `Increase Factor ${(i + 1)} for ${game.beautify(10 ** ((i + 1) * game.data.factors[i]))} OP`;
    }
    
    game.factorBoostText.innerHTML = `Factor Boost: Requires ${game.beautify(game.V(game.data.factorBoosts + 1) + 1.000e230)} OP`;
    game.factorBoostButton.innerHTML = `Gain ${game.data.factorBoosts + 1} Boosters (B)`;
    
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 4; x++) {
        game.bups[y][x].classList.remove("locked");
        game.bups[y][x].classList.remove("canbuy");
        game.bups[y][x].classList.remove("bought");
        
        game.bups[y][x].classList.add(
          game.data.bups[y][x] ? 
            "bought":
            game.boosters() >= game.bupCosts[y][x] && game.data.bups[y - 1][x] ?
              "canbuy":
              "locked"
        );
      }
    }
  },
  loop: (unadjusted, off = false) => {
    var ms = Math.max(0, unadjusted);
    
    game.data.lastTick = Date.now();
    
    if (game.data.bups[1][2] && game.data.op < 1.000e230) {
      game.data.op += ms / (game.data.bups[1][0] ? 10: 50) * (game.data.bups[3][2] && game.base() < 6 ? 666666: 1);
    }
    
    if (game.data.op > 1.000e230 && game.data.op < 2.000e230) {
      game.data.op = 1.000e230;
    }
    
    game.dynamicFactor += ms / 100000;
    
    if ((game.data.incrementAuto < 1.000e230 || game.data.maximizeAuto < 1.000e230) && (game.data.ord < 3 ** 27 || game.base() > 3)) {
      if (game.incrementSpeed() > 0) {
        game.data.pendingIncrement += ms / 1000 * game.incrementSpeed();

        if (game.data.pendingIncrement >= 1) {
          game.data.pendingIncrement -= 1;
          game.increment(false);
        }
      }

      if (game.maximizeSpeed() > 0) {
        game.data.pendingMaximize += ms / 1000 * game.maximizeSpeed();

        if (game.data.pendingMaximize >= 1) {
          game.data.pendingMaximize -= 1;
          game.maximize(false);
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
    } else {
      game.over = 0;
      game.ord = Math.max(Math.min(game.data.incrementAuto, game.data.maximizeAuto), 1.000e230);
    }
    
    game.checkAchieve();
    
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
    if (loadgame.version === "0.1" || loadgame.version === "0.1.1") {
      game.data.factorBoosts = 0;
      game.data.dynamicFactor = 1;
      game.data.achievements = [
        [false, false, false, false, false, false, false, false, false, false],
      ];
      game.data.bups = [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false]
      ];
    }
  },
  save: (action, manmade = true) => {
    if (!manmade || game.data.clickCooldown === 0) {
      if (manmade) {
        game.data.clickCooldown = 1;
      }
      
      localStorage.clear()
      localStorage.setItem("save", JSON.stringify(game.data));
      
      if (manmade) {
        $.notify("Game Saved!", "success");
      }
    }
  },
  load: loadgame => {
    game.data = loadgame;
    
    game.data.version = "0.2";
    game.data.clickCooldown = 1;
    
    var diff = Date.now() - game.data.lastTick;
    
    game.handleOldVersions(loadgame);
    
    game.save("load", false);
    
    game.loop(diff, true);
    game.data.lastTick = Date.now();
    
    console.log(diff);
    
    if (game.data.music) {
      game.music.play();
    }
  },
  reset: () => {
    game.data = {
      version: "0.2",
      lastTick: Date.now(),
      pendingIncrement: 0,
      pendingMaximize: 0,
      clickCooldown: 1,
      achievements: [
        [false, false, false, false, false, false, false, false, false, false],
      ],
      highestLevel: 0,
      markupUnlocked: false,
      boosterUnlocked: false,
      colors: true,
      music: true,
      ord: 0,
      over: 0,
      op: 0,
      incrementAuto: 0,
      maximizeAuto: 0,
      factorShifts: 0,
      factors: [],
      factorBoosts: 0,
      dynamicFactor: 1,
      bups: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false]
      ]
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
          $.notify("Hard Reset Successful", "success");
        }
      }
      
      game.data.clickCooldown = 1;
    }
  }
};

game.load(JSON.parse(localStorage.getItem("save")));

onkeypress = _ => {
  var k = _.key.toLowerCase();
  if (typeof game.keybinds[k] !== "undefined") {
    game.keybinds[k]();
  };
};

var loop = setInterval(() => game.loop(Date.now() - game.data.lastTick), 50);

var autoSave = setInterval(() => game.save("autosave", false), 5000);
