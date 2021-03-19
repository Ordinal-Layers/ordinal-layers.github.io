"use strict";

var loop;

var game = {
  data: {
    version: "0.2",
    publicTesting: false,
    betaTesting: false,
    lastTick: Date.now(),
    autosaveInterval: 0,
    pendingIncrement: 0,
    pendingMaximize: 0,
    pendingMaxAll: 0,
    pendingMarkup: 0,
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
  achievementCount: document.getElementById("achievementCount"),
  achieveRows: [
    document.getElementById("achieveRow0"),
    document.getElementById("achieveRow1"),
    document.getElementById("achieveRow2"),
    document.getElementById("achieveRow3")
  ],
  achievementTd: [
    [
      document.getElementById("achievement00"),
      document.getElementById("achievement01"),
      document.getElementById("achievement02"),
      document.getElementById("achievement03"),
      document.getElementById("achievement04"),
      document.getElementById("achievement05"),
      document.getElementById("achievement06"),
      document.getElementById("achievement07"),
      document.getElementById("achievement08"),
      document.getElementById("achievement09")
    ],
    [
      document.getElementById("achievement10"),
      document.getElementById("achievement11"),
      document.getElementById("achievement12"),
      document.getElementById("achievement13"),
      document.getElementById("achievement14"),
      document.getElementById("achievement15"),
      document.getElementById("achievement16"),
      document.getElementById("achievement17"),
      document.getElementById("achievement18"),
      document.getElementById("achievement19")
    ],
    [
      document.getElementById("achievement20"),
      document.getElementById("achievement21"),
      document.getElementById("achievement22"),
      document.getElementById("achievement23"),
      document.getElementById("achievement24"),
      document.getElementById("achievement25"),
      document.getElementById("achievement26"),
      document.getElementById("achievement27"),
      document.getElementById("achievement28"),
      document.getElementById("achievement29")
    ],
    [
      document.getElementById("achievement30"),
      document.getElementById("achievement31"),
      document.getElementById("achievement32"),
      document.getElementById("achievement33"),
      document.getElementById("achievement34"),
      document.getElementById("achievement35"),
      document.getElementById("achievement36"),
      document.getElementById("achievement37"),
      document.getElementById("achievement38"),
      document.getElementById("achievement39")
    ]
  ],
  nextRowUnlock: document.getElementById("nextRowUnlock"),
  markupTab: document.getElementById("markupTabButton"),
  extraFactorSubtabButton: document.getElementById("extraFactorSubtabButton"),
  boosterTab: document.getElementById("boosterTabButton"),
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
  factorBoostContainer: document.getElementById("factorBoostContainer"),
  factorBoostText: document.getElementById("factorBoost"),
  factorBoostButton: document.getElementById("factorBoostButton"),
  bulkText: document.getElementById("bulking"),
  nextBulk: document.getElementById("nextBulk"),
  factorBoostProg: document.getElementById("factorBoostProg"),
  dynamicMult: document.getElementById("dynamicMult"),
  boosterText: document.getElementById("boosterText"),
  refundButton: document.getElementById("refundButton"),
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
  boosterMult: document.getElementById("boosterMult"),
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
  clickCooldown: 1,
  tab: x => {
    if (game.clickCooldown === 0) {
      var numTabs = game.tabs.length;

      for (var i = 0; i < numTabs; i++) {
        game.tabs[i].style.display = "none";
      }

      game.tabs[x].style.display = "block";
      
      game.clickCooldown = 1;
    }
  },
  subtab: (x, y) => {
    if (game.clickCooldown === 0) {
      var numTabs = game.subtabs[x].length;

      for (var i = 0; i < numTabs; i++) {
        game.subtabs[x][i].style.display = "none";
      }

      game.subtabs[x][y].style.display = "block";
      
      game.clickCooldown = 1;
    }
  },
  autoclickerCost: x => x < 2.000e230 ? 100 * 2 ** x: x,
  factorShiftCosts: [
    1000,
    10000,
    100000,
    1.000e6,
    1.000e12,
    1.000e20,
    1.000e100,
    Infinity
  ],
  factorBoostCosts: [3, 3, 9, 3, 3, 9, 3, 3, 27, 3, 3, 9, 3, 3, 9, 3, 3, 27, 3, 3, 9, 3, 3, 9, 3, 3, 729],
  bupCosts: [
    [1, 1, 1, Infinity],
    [6, 6, 10, Infinity],
    [66, Infinity, 21, Infinity],
    [Infinity, Infinity, 66, Infinity]
  ],
  achievementsEarned: () => {
    var achieveCount = 0;
    for (var y = 0; y < game.data.achievements.length; y++) {
      for (var x = 0; x < 10; x++) {
        achieveCount += Number(game.data.achievements[y][x]);
      }
    }
    return achieveCount;
  },
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
    game.data.incrementAuto >= 2.000e230 ?
      game.data.incrementAuto:
      game.data.incrementAuto *
      game.factorMult() *
      (game.data.boosterUnlocked ? game.data.dynamicFactor * 5: 1) *
      (game.data.bups[1][1] ? Math.sqrt(2 * game.boosters() + 1 / 4) + 1 / 2: 1),
  maximizeSpeed: () =>
    game.data.maximizeAuto >= 2.000e230 ?
      game.data.maximizeAuto:
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
      var tempvar = Math.floor(Math.log(ord) / Math.log(base) + 1e-13);
      var tempvar2 = base ** tempvar;
      var tempvar3 = Math.floor(ord / tempvar2);
      
      return Math.min(
        1.000e230,
        10 ** game.opGain(tempvar, 0, base) * tempvar3 + 
        game.opGain(ord - tempvar2 * tempvar3, over, base)
      );
    }
  },
  totalOpGain: () => 
    game.opGain() >= 2.000e230 ?
      game.opGain():
      Math.min(
        game.opGain() * 
        (game.data.bups[1][0] ? 5: 1) * 
        (game.data.bups[3][2] && game.base() < 6 ? 666666: 1),
        1.000e230
      ),
  V: x => x === 0 ? 1.000e230: (x >= 27 ? Infinity: game.V(x - 1) * game.factorBoostCosts[x - 1]),
  calcBulk: (op = game.data.op, boost = game.data.factorBoosts) => {
    var bulk = 0;
    while (op >= game.V(bulk + boost + 1) + 1.000e230) {
      bulk++;
    }
    return bulk;
  },
  calcBoosters: (op = game.data.op, boost = game.data.factorBoosts) => {
    var booster = 0;
    for (var i = 0; i < game.calcBulk(op, boost); i++) {
      booster += boost + i + 1;
    }
    return booster;
  },
  calcBulkTime: (maxAll = game.maxAllSpeed(), markup = game.markupSpeed(), op = game.data.op, boost = game.data.factorBoosts + game.calcBulk()) => {
    return (game.V(boost + 1) - Math.max(0, op - 1.000e230)) / (1.000e230 * Math.min(maxAll, markup)); 
  },
  increment: (manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
      if (game.data.ord % game.base() === game.base() - 1) {
        game.data.over++;
      } else {
        game.data.ord++;
      }

      if (manmade) {
        game.clickCooldown = 1;
      }
    }
  },
  maximize: (manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
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
          game.clickCooldown = 1;
        }
      }
    }
  },
  resetEverythingMarkupDoes: () => {
    game.data.ord = 0;
    game.data.over = 0;
    game.data.dynamicFactor = 1;
    game.data.pendingIncrement = 0;
    game.data.pendingMaximize = 0;
  },
  markup: (manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
      if (game.data.ord >= game.base() ** 2) {
        if (game.opGain() >= 2.000e230) {
          game.data.op = game.opGain();
        } else {
          game.data.op += game.totalOpGain();
          if (game.data.op > 1.000e230) {
            game.data.op = 1.000e230;
          }
          game.resetEverythingMarkupDoes();
        }

        if (!game.data.markupUnlocked) {
          game.data.markupUnlocked = true;
        }

        if (manmade) {
          game.clickCooldown = 1;
        }
      }
    }
  },
  buyIncrementAuto: (manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
      if (game.data.op >= game.autoclickerCost(game.data.incrementAuto)) {
        if (game.data.op < 2.000e230) {
          game.data.op -= game.autoclickerCost(game.data.incrementAuto);
        }
        game.data.incrementAuto++;

        if (manmade) {
          game.clickCooldown = 1;
        }
      }
    }
  },
  buyMaximizeAuto: (manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
      if (game.data.op >= game.autoclickerCost(game.data.maximizeAuto)) {
        if (game.data.op < 2.000e230) {
          game.data.op -= game.autoclickerCost(game.data.maximizeAuto);
        }
        game.data.maximizeAuto++;

        if (manmade) {
          game.clickCooldown = 1;
        }
      }
    }
  },
  maxAll: (manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
      if (game.data.op < 2.000e230) {
        var bulk = 0;

        game.buyIncrementAuto(false);
        game.buyMaximizeAuto(false);
        
        bulk = Math.floor(
          Math.log(1 + game.data.op / (100 * 2 ** game.data.incrementAuto)) / Math.log(2) + 1e-13
        );
        
        game.data.op -= (2 ** bulk - 1) * (100 * 2 ** game.data.incrementAuto);
        game.data.incrementAuto += bulk;
        
        bulk = Math.floor(
          Math.log(1 + game.data.op / (100 * 2 ** game.data.maximizeAuto)) / Math.log(2) + 1e-13
        );
        
        game.data.op -= (2 ** bulk - 1) * (100 * 2 ** game.data.maximizeAuto);
        game.data.maximizeAuto += bulk;
      } else {
        game.data.incrementAuto = game.data.op;
        game.data.maximizeAuto = game.data.op;
      }

      if (manmade) {
        game.clickCooldown = 1;
      }
    }
  },
  resetEverythingShiftDoes: () => {
    game.resetEverythingMarkupDoes();
    game.data.op = 0;
    game.data.incrementAuto = 0;
    game.data.maximizeAuto = 0;
    for (var i = 0; i < game.data.factorShifts; i++) {
      game.data.factors[i] = 1;
    }
  },
  factorShift: (manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
      if (game.data.op >= game.factorShiftCosts[game.data.factorShifts]) {
        game.resetEverythingShiftDoes();
        game.data.factorShifts++;
        game.data.factors.push(1); 

        if (manmade) {
          game.clickCooldown = 1;
        }
      }
    }
  },
  buyFactor: (x, manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
      if (game.data.op >= 10 ** (x * game.data.factors[x - 1]) && game.data.factors[x - 1] < 10) {
        if (game.data.op < 2.000e230) {
          game.data.op -= 10 ** (x * game.data.factors[x - 1]);
        }
        game.data.factors[x - 1]++;
      }
      
      if (manmade) {
        game.clickCooldown = 1;
      }
    }
  },
  maxFactors: (manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
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
        game.clickCooldown = 1;
      }
    }
  },
  maxMarkup: (manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
      game.maxAll(false);
      game.maxFactors(false);
      
      if (manmade) {
        game.clickCooldown = 1;
      }
    }
  },
  resetEverythingBoostDoes: () => {
    game.resetEverythingShiftDoes();
    game.data.factorShifts = 0;
    game.data.factors = [];
    game.data.pendingMaxAll = 0;
    game.data.pendingMarkup = 0;
  },
  factorBoost: (manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
      if (game.calcBulk() > 0) {
        var conf = true;
        if (manmade) {
          conf = confirm(
            "Are you sure you want to do a Factor Boost?"
          );
        }
        if (conf) {
          game.resetEverythingBoostDoes();
          game.data.factorBoosts += game.calcBulk();
          
          if (!game.data.boosterUnlocked) {
            game.data.boosterUnlocked = true;
          }
        }
      }
      
      if (manmade) {
        game.clickCooldown = 1;
      }
    }
  },
  buyBup: (x, y, manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
      if (!game.data.bups[y][x] && game.boosters() >= game.bupCosts[y][x] && (y === 0 || game.data.bups[Math.max(0, y - 1)][x])) {
        if (y === 2 && x === 0) {
          game.resetEverythingMarkupDoes();
        }
        game.data.bups[y][x] = true;
      }
      
      if (manmade) {
        game.clickCooldown = 1;
      }
    }
  },
  refundBups: (manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
      if (game.data.bups[0][0] || game.data.bups[0][1] || game.data.bups[0][2]) {
        var conf = true;
        if (manmade) {
          conf = confirm(
            "Are you sure you want to refund your boosters? You'll reset this Factor Boost!"
          );
        }
        if (conf) {
          game.resetEverythingBoostDoes();
          
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
        game.clickCooldown = 1;
      }
    }
  },
  debug: () => {
    if (inPublicTesting() || inBetaTesting()) {
      game.resetEverythingMarkupDoes();
      game.data.markupUnlocked = true;

      game.resetEverythingBoostDoes();
      game.data.factorShifts = 7;
      game.data.factors = [1, 1, 1, 1, 1, 1, 1];
      game.data.boosterUnlocked = true;

      game.data.factorBoosts = 27;
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
    () => 1.000e230 * 3 ** 42,
    () => Infinity
  ],
  currentLevel: () => {
    var level = 0;
    if (game.data.ord === Infinity) {
      level = 38;
    } else {
      while (game.data.ord >= game.ordLevels[level]()) {
        level++;
      }
    }
    return level - 1;
  },
  achieve: {
    rowReq: [
      () => game.data.markupUnlocked,
      () => game.data.factorShifts >= 1,
      () => game.data.boosterUnlocked,
      () => false
    ],
    rowName: [
      "Markup",
      "Factors",
      "Boosters",
      "???"
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
        () => game.data.op >= 1.000e12,
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
        "Unnamed achievement",
        "Hyper-dimensional",
        "Ordinal Collapsing Functions",
        "Ackermann Ordinal",
        "Double Ackermann Ordinal",
        "Way too much",
        "Way too much"
      ],
      [
        "Markup!",
        "Shiftable",
        "Unnamed achievement",
        "Unnamed achievement",
        "Unnamed achievement",
        "Boostable",
        "Unnamed achievement",
        "Unnamed achievement",
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
        "Booster Pack",
        "Unnamed achievement",
        "Super Boost",
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
        "Reach the ordinal ω",
        "Reach the ordinal ω^2",
        "Reach the ordinal ω^3",
        "Reach the ordinal ω^ω",
        "Reach the ordinal ψ(1)",
        "Reach the ordinal ψ(Ω^Ω^2)",
        "Reach the ordinal ψ(Ω^(Ω^2*2))",
        "Reach the ordinal ψ(way too large)",
        "Reach the ordinal ψ(way too large)"
      ],
      [
        "Markup for the first time",
        "Reach 1000 Ordinal Points",
        "Reach 1.000e6 Ordinal Points",
        "Reach 1.000e10 Ordinal Points",
        "Reach 1.000e100 Ordinal Points",
        "Reach g(ψ(1))(10) OP",
        "Reach g(ψ(Ω^Ω^2))(10) OP",
        "Reach g(ψ(Ω^(Ω^2*2))(10) OP",
        "Reach Too Many Ordinal Points",
        "Reach Too Many Ordinal Points"
      ],
      [
        "Perform a Factor Shift",
        "Perform 2 Factor Shifts",
        "Perform 3 Factor Shifts",
        "Perform 4 Factor Shifts",
        "Perform 5 Factor Shifts",
        "Perform 6 Factor Shifts",
        "Perform 7 Factor Shifts",
        "Get a 1.000e7x multiplier from Factors",
        "Get a 1.000e9x multiplier from Factors",
        "Get a Too Large multiplier from Factors"
      ],
      [
        "Perform a Factor Boost",
        "Perform 5 Factor Boosts",
        "Perform 9 Factor Boosts",
        "Perform 15 Factor Boosts",
        "Perform Too Many Factor Boosts",
        "Perform Too Many Factor Boosts",
        "Perform Too Many Factor Boosts",
        "Perform Too Many Factor Boosts",
        "Perform Too Many Factor Boosts",
        "Perform Too Many Factor Boosts"
      ]
    ]
  },
  checkAchieve: function() {
    for (var y = 0; y < game.data.achievements.length; y++) {
      if (game.achieve.rowReq[y]() && game.data.achievements.length <= y + 1) { 
        game.data.achievements.push(
          [false, false, false, false, false, false, false, false, false, false]
        );
        $.notify("New Achievement Row Unlocked: " + game.achieve.rowName[y], "achieve");
      }
      for (var x = 0; x < 10; x++) {
        if (game.achieve.achieveReq[y][x]() && !game.data.achievements[y][x]) {
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
  hardy: (ord = game.data.ord, over = game.data.over, base = game.base()) => {
    var tempvar = Math.floor(ord / base);
    var tempvar2 = Math.floor(ord / base ** 2);
    return (ord >= base ** 3) ? Infinity: game.fghexp(tempvar2, 2 ** (tempvar % base) * (base + ord - base * (tempvar % base) - base ** 2 * tempvar2 + over));
  },
  ordColor: (ord = game.data.ord, over = game.data.over, base = game.base()) => 
    ord === 0 || ord === Infinity ?
      0:
      ord < 1.000e230 ?
        Math.log(ord + over) / (Math.log(3) * 27):
        ord >= 1.000e230 * 3 ** 42 ?
          0:
          Math.log(ord / 1.000e230) / (Math.log(3) * 42),
  ordMarks: [
    [
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
      x => `&psi;(&Omega;<sup>&Omega;<sup>2</sup>${x}</sup>)`,
      x => `&psi;(&Omega;<sup>&Omega;<sup>${x}</sup></sup>)`,
      x => `&psi;(&Omega;&uarr;&uarr;${x})`
    ],
    [
      x => `<span style="color:hsl(0, 100%, 50%)">&psi;(${x})</span>`,
      x => `<span style="color:hsl(${60 / 7}, 100%, 50%)">&psi;(&Omega;${x})</span>`,
      x => `<span style="color:hsl(${120 / 7}, 100%, 50%)">&psi;(&Omega;<sup>2</sup>${x})</span>`,
      x => `<span style="color:hsl(${180 / 7}, 100%, 50%)">&psi;(&Omega;<sup>${x}</sup>)</span>`,
      x => `<span style="color:hsl(${240 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;</sup>${x})</span>`,
      x => `<span style="color:hsl(${300 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;+1</sup>${x})</span>`,
      x => `<span style="color:hsl(${360 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;+2</sup>${x})</span>`,
      x => `<span style="color:hsl(60, 100%, 50%)">&psi;(&Omega;<sup>&Omega;+${x}</sup>)</span>`,
      x => `<span style="color:hsl(${480 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;2</sup>${x})</span>`,
      x => `<span style="color:hsl(${540 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;2+1</sup>${x})</span>`,
      x => `<span style="color:hsl(${600 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;2+2</sup>${x})</span>`,
      x => `<span style="color:hsl(${660 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;2+${x}</sup>)</span>`,
      x => `<span style="color:hsl(${720 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;${x}</sup>)</span>`,
      x => `<span style="color:hsl(${780 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup></sup>${x})</span>`,
      x => `<span style="color:hsl(120, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>+1</sup>${x})</span>`,
      x => `<span style="color:hsl(${900 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>+2</sup>${x})</span>`,
      x => `<span style="color:hsl(${960 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>+${x}</sup>)</span>`,
      x => `<span style="color:hsl(${1020 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;</sup>${x})</span>`,
      x => `<span style="color:hsl(${1080 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;+1</sup>${x})</span>`,
      x => `<span style="color:hsl(${1140 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;+2</sup>${x})</span>`,
      x => `<span style="color:hsl(${1200 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;+${x}</sup>)</span>`,
      x => `<span style="color:hsl(180, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;2</sup>${x})</span>`,
      x => `<span style="color:hsl(${1320 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;2+1</sup>${x})</span>`,
      x => `<span style="color:hsl(${1380 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;2+2</sup>${x})</span>`,
      x => `<span style="color:hsl(${1440 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;2+${x}</sup>)</span>`,
      x => `<span style="color:hsl(${1500 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>+&Omega;${x}</sup>)</span>`,
      x => `<span style="color:hsl(${1560 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>2</sup>${x})</span>`,
      x => `<span style="color:hsl(${1620 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+1</sup>${x})</span>`,
      x => `<span style="color:hsl(240, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+2</sup>${x})</span>`,
      x => `<span style="color:hsl(${1740 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+${x}</sup>)</span>`,
      x => `<span style="color:hsl(${1800 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;</sup>${x})</span>`,
      x => `<span style="color:hsl(${1860 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;+1</sup>${x})</span>`,
      x => `<span style="color:hsl(${1920 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;+2</sup>${x})</span>`,
      x => `<span style="color:hsl(${1980 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;+${x}</sup>)</span>`,
      x => `<span style="color:hsl(${2040 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;2</sup>${x})</span>`,
      x => `<span style="color:hsl(300, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;2+1</sup>${x})</span>`,
      x => `<span style="color:hsl(${2160 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;2+2</sup>${x})</span>`,
      x => `<span style="color:hsl(${2220 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;2+${x}</sup>)</span>`,
      x => `<span style="color:hsl(${2280 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>2+&Omega;${x}</sup>)</span>`,
      x => `<span style="color:hsl(${2340 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>2</sup>${x}</sup>)</span>`,
      x => `<span style="color:hsl(${2400 / 7}, 100%, 50%)">&psi;(&Omega;<sup>&Omega;<sup>${x}</sup></sup>)</span>`,
      x => `<span style="color:hsl(${2460 / 7}, 100%, 50%)">&psi;(&Omega;&uarr;&uarr;${x})</span>`
    ]
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
  writeOrd: (color, ord = game.data.ord, over = game.data.over, base = game.base()) => {
    if (ord === 0) {
      return `${color ? `<span style="color:hsl(0, 100%, 50%)">`: ``}0${color ? `</span>`: ``}`;
    } else if (ord === Infinity) {
      return `${color ? `<span style="color:hsl(0, 100%, 50%)">`: ``}&Omega;${color ? `</span>`: ``}`;
    } else if (ord < 1.000e230) {
      var result = ``;
      var remainOrd = ord;
      var terms = 0;
      
      while (remainOrd > 0 && terms < 5) {
        var power = Math.floor(Math.log(remainOrd) / Math.log(base) + 1e-13);
        if (result === ``) {
          if (power === 0) {
            result = `${color ? `<span style="color:hsl(0, 100%, 50%)">`: ``}${remainOrd + over}${color ? `</span>`: ``}`;
          } else {
            if (power === 1) {
              if (Math.floor(remainOrd / base) === 1) {
                result = `${color ? `<span style="color:hsl(${game.ordColor(base, 0) * 360}, 100%, 50%)">`: ``}&omega;${color ? `</span>`: ``}`;
              } else {
                result = `${color ? `<span style="color:hsl(${game.ordColor(base, 0) * 360}, 100%, 50%)">`: ``}&omega;${Math.floor(remainOrd / base)}${color ? `</span>`: ``}`;
              }
            } else {
              if (Math.floor(remainOrd / base ** power) === 1) {
                result = `${color ? `<span style="color:hsl(${game.ordColor(base ** power, 0) * 360}, 100%, 50%)">`: ``}&omega;<sup>${game.writeOrd(false, power, 0)}</sup>${color ? `</span>`: ``}`;
              } else {
                result = `${color ? `<span style="color:hsl(${game.ordColor(base ** power, 0) * 360}, 100%, 50%)">`: ``}&omega;<sup>${game.writeOrd(false, power, 0)}</sup>${Math.floor(remainOrd / base ** power)}${color ? `</span>`: ``}`;
              }
            }
          }
        } else {
          if (power === 0) {
            result += `${color ? `<span style="color:hsl(0, 100%, 50%)">`: ``}+${remainOrd + over}${color ? `</span>`: ``}`;
          } else {
            if (power === 1) {
              if (Math.floor(remainOrd / base) === 1) {
                result += `${color ? `<span style="color:hsl(${game.ordColor(base, 0) * 360}, 100%, 50%)">`: ``}+&omega;${color ? `</span>`: ``}`;
              } else {
                result += `${color ? `<span style="color:hsl(${game.ordColor(base, 0) * 360}, 100%, 50%)">`: ``}+&omega;${Math.floor(remainOrd / base)}${color ? `</span>`: ``}`;
              }
            } else {
              if (Math.floor(remainOrd / base ** power) === 1) {
                result += `${color ? `<span style="color:hsl(${game.ordColor(base ** power, 0) * 360}, 100%, 50%)">`: ``}+&omega;<sup>${game.writeOrd(false, power, 0)}</sup>${color ? `</span>`: ``}`;
              } else {
                result += `${color ? `<span style="color:hsl(${game.ordColor(base ** power, 0) * 360}, 100%, 50%)">`: ``}+&omega;<sup>${game.writeOrd(false, power, 0)}</sup>${Math.floor(remainOrd / base ** power)}${color ? `</span>`: ``}`;
              }
            }
          }
        }
        
        remainOrd -= base ** power * Math.floor(remainOrd / base ** power);
        terms++;
      }
      
      if (remainOrd > 0) {
        result += `${color ? `<span style="color:hsl(${game.ordColor(remainOrd, over) * 360}, 100%, 50%)">`: ``}+...${color ? `</span>`: ``}`;
      }
      
      return result;
    } else if (ord >= 1.000e230 * 3 ** 42) {
      return `${color ? `<span style="color:hsl(0, 100%, 50%)">`: ``}&psi;(way too large)${color ? `</span>`: ``}`;
    } else {
      var result = ``;
      var remainOrd = ord;
      
      var powerList = [];
      
      while (remainOrd >= 1.000e230) {
        var power = Math.min(41, Math.floor(Math.log(remainOrd / 1.000e230) / Math.log(3)));
        
        powerList.push(power);
        
        remainOrd -= 1.000e230 * 3 ** power;
      }
      
      var length = powerList.length;
      
      if (powerList[length - 1] === 0) {
        result = `1`;
      }
      
      if (game.ordPowers.includes(powerList[length - 1])) {
        result = `&omega;`;
      }
      
      if (length > 7) {
        result = `...`;
        for (var i = 0; i < length - 7; i++) {
          powerList.pop();
        }
        length = 7;
      }
      
      for (var i = 0; i < length; i++) {
        result = game.ordMarks[Number(color)][powerList[length - 1 - i]](result);
      }
      
      return result;
    }
  },
  beautify: x => 
    (x === Infinity) ?
      `Infinity`:
      (x >= 2.000e230) ?
        `g<sub>${game.writeOrd(false, x - 1.000e230, 0)}</sub>(10)`:
        (x < 1.000e6) ?
          (x < 1000 && x % 1 !== 0) ?
            (x * 10 % 1 === 0) ?
              x.toFixed(1):
              (x * 100 % 1 === 0) ?
                x.toFixed(2):
                x.toFixed(3):
          x.toFixed(0):
        `${(x / 10 ** Math.floor(Math.log10(x))).toFixed(3)}e${Math.floor(Math.log10(x))}`,
  time: x =>
    (x === Infinity) ?
      `forever`:
      (x < 1.000e230) ?
        (x < 86400) ?
          (x < 3600) ?
            (x < 60) ?
              (x < 1) ?
                `<1 seconds`:
                `${game.beautify(Math.floor(x + 1e-13))} seconds`:
              `${game.beautify(Math.floor(x / 60 + 1e-13))}m ${game.beautify(Math.floor(x + 1e-13) % 60)}s`:
            `${game.beautify(Math.floor(x / 3600 + 1e-13))}h ${game.beautify(Math.floor(x / 60 + 1e-13) % 60)}m ${game.beautify(Math.floor(x + 1e-13) % 60)}s`:
          `${game.beautify(Math.floor(x / 86400 + 1e-13))}d ${game.beautify(Math.floor(x / 3600 + 1e-13) % 24)}h ${game.beautify(Math.floor(x / 60 + 1e-13) % 60)}m ${game.beautify(Math.floor(x + 1e-13) % 60)}s`:
        `a very long time`,
  toggleColor: () => {
    if (game.clickCooldown === 0) {
      game.data.colors = !game.data.colors;
      
      game.save("toggleColor", false);
      
      game.clickCooldown = 1;
    }
  },
  toggleMusic: () => {
    if (game.clickCooldown === 0) {
      game.data.music = !game.data.music;
      
      if (game.data.music) {
        game.music.play();
      } else {
        game.music.pause();
      }
      
      game.save("toggleMusic", false);
      
      game.clickCooldown = 1;
    }
  },
  render: () => { 
    game.header.innerHTML = 
      `${game.data.colors ? `<span style="color:hsl(${game.ordColor() * 360}, 100%, 50%)">`: ``}H<sub>${game.writeOrd(game.data.colors)}</sub>(${game.base()})${game.hardy() >= 1.000e230 ? ``: `=${game.beautify(game.hardy())}`}${game.data.colors ? `</span>`: ``}`;
    
    if (game.data.music) {
      game.music.play();
    } else {
      game.music.pause();
    }
    
    game.colorButton.innerHTML = game.data.colors ? `Colors: ON`: `Colors: OFF`;
    
    game.musicButton.innerHTML = game.data.music ? `Music: ON`: `Music: OFF`;
    
    game.currentLevelText.innerHTML = `Your current Ordinal Level is ${game.currentLevel()}`;
    game.nextLevelText.innerHTML = `Next Ordinal Level is at ${game.writeOrd(false, game.ordLevels[game.currentLevel() + 1](), 0)}`;
    game.highestLevelText.innerHTML = `Your highest Ordinal Level was ${game.data.highestLevel}`;
    
    game.checkAchieve();
    
    game.achievementCount.innerHTML = `Achievements (${game.achievementsEarned()}/${game.achieve.rowReq.length * 10})`;
    
    for (var y = 0; y < game.achieve.rowReq.length; y++) {
      game.achieveRows[y].style.display = game.data.achievements.length <= y ? "none" : "table-row";
    }
    
    for (var y = 0; y < game.data.achievements.length; y++) {
      for (var x = 0; x < 10; x++) {
        game.achievementTd[y][x].innerHTML = game.achieve.achieveName[y][x];
        game.achievementTd[y][x].attributes.tooltip.value = game.achieve.achieveTooltip[y][x];
        
        game.achievementTd[y][x].classList.remove("achievement");
        game.achievementTd[y][x].classList.remove("earned");
        
        game.achievementTd[y][x].classList.add(game.data.achievements[y][x] ? "earned": "achievement");
      }
    }
    
    game.nextRowUnlock.innerHTML = game.achieve.rowTooltip[game.data.achievements.length - 1];
    
    game.markupButton.innerHTML = 
      game.data.ord >= game.base() ** 2 ? `Markup to gain ${game.beautify(game.totalOpGain())} Ordinal Points (I)`: `Reach &omega;<sup>2</sup> to Markup`;
    game.markupButton2.innerHTML = 
      game.data.ord >= game.base() ** 2 ? `+${game.beautify(game.totalOpGain())} (I)`: `Reach &omega;<sup>2</sup> to Markup`;
    
    game.markupTab.style.display = game.data.markupUnlocked ? "inline": "none";
    game.extraFactorSubtabButton.style.display = game.data.boosterUnlocked ? "inline": "none";
    game.boosterTab.style.display = game.data.boosterUnlocked ? "inline": "none";
    
    game.opText.innerHTML = `You have ${game.beautify(game.data.op)} Ordinal Points`;
    
    game.incrementAuto.innerHTML = 
      `You have ${game.beautify(game.data.incrementAuto)} increment autoclickers, clicking the increment button ${game.beautify(game.incrementSpeed())} times per second`;
    game.maximizeAuto.innerHTML = 
      `You have ${game.beautify(game.data.maximizeAuto + (game.data.boosterUnlocked ? 1: 0))} maximize autoclickers, clicking the maximize button ${game.beautify(game.maximizeSpeed())} times per second`;
    
    game.buyIncrementButton.innerHTML = `Buy Increment Autoclicker for ${game.beautify(game.autoclickerCost(game.data.incrementAuto))} OP`;
    game.buyMaximizeButton.innerHTML = `Buy Maximize Autoclicker for ${game.beautify(game.autoclickerCost(game.data.maximizeAuto))} OP`;
    
    game.noFactors.style.display = game.data.factorShifts === 0 ? "block": "none";
    game.factorList.style.display = game.data.factorShifts === 0 ? "none": "block";
    game.factorMultiplier.style.display = game.data.factorShifts === 0 ? "none": "inline";
    
    game.factorMultiplier.innerHTML = `Your factors are multiplying Tier 1 automation by x${game.beautify(game.factorMult())}`;
    game.factorShiftText.innerHTML = `Factor Shift: Requires ${game.beautify(game.factorShiftCosts[game.data.factorShifts])} OP`;
    
    for (var i = 0; i < 7; i++) {
      game.factors[i].style.display = game.data.factorShifts > i ? "list-item": "none";
      game.factorMults[i].innerHTML = `x${(game.data.factors[i] + (game.data.bups[2][2] ? 5: 0)) * (game.data.bups[0][0] ? 2: 1)}`;
      game.factorButtons[i].innerHTML = game.data.factors[i] === 10 ? `Maxed!`: `Increase Factor ${(i + 1)} for ${game.beautify(10 ** ((i + 1) * game.data.factors[i]))} OP`;
    }
    
    game.factorBoostContainer.style.display = game.data.boosterUnlocked || game.data.ord >= 1.000e230 ? "inline": "none";
    
    game.factorBoostText.innerHTML = `Factor Boost: Requires ${game.beautify(game.V(game.data.factorBoosts + 1) + 1.000e230)} OP`;
    game.factorBoostButton.innerHTML = `Gain ${game.calcBoosters()} Boosters (B)`;
    
    game.bulkText.innerHTML = `You are currently bulking in a set of ${game.calcBulk()}`;
    game.nextBulk.innerHTML = 
      game.data.ord >= 1.000e230 ?
        `Next boost in bulk will take ${game.data.bups[0][1] && game.data.bups[0][2] ? game.time(game.calcBulkTime()): `${game.beautify(Math.ceil((game.V(game.data.factorBoosts + game.calcBulk() + 1) - Math.max(0, game.data.op - 1.000e230)) / 1.000e230 - 1e-13))} click cycles`}`:
        `Reach &psi;(1) to see when you can boost!`;
    
    game.factorBoostProg.innerHTML = `${game.beautify(Math.max(0, game.data.op - 1.000e230) / game.V(game.data.factorBoosts + game.calcBulk() + 1) * 100)}%`;
    game.factorBoostProg.style.width = `${Math.max(0, game.data.op - 1.000e230) / game.V(game.data.factorBoosts + game.calcBulk() + 1) * 100}%`;
    
    game.dynamicMult.innerHTML = `Your Dynamic Factor is x${game.beautify(game.data.dynamicFactor)}`;
    
    game.boosterText.innerHTML = `You have ${game.boosters()} boosters`;
    game.refundButton.innerHTML = `Refund back ${game.data.factorBoosts * (game.data.factorBoosts + 1) / 2 - game.boosters()} boosters, but reset this Factor Boost (R)`;
    
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 4; x++) {
        game.bups[y][x].classList.remove("locked");
        game.bups[y][x].classList.remove("canbuy");
        game.bups[y][x].classList.remove("bought");
        
        game.bups[y][x].classList.add(
          game.data.bups[y][x] ? "bought": game.boosters() >= game.bupCosts[y][x] && (y === 0 || game.data.bups[Math.max(0, y - 1)][x]) ? "canbuy": "locked"
        );
      }
    }
    
    game.boosterMult.innerHTML = `x${game.beautify(Math.sqrt(2 * game.boosters() + 1 / 4) + 1 / 2)}`;
    
    game.maxAllAuto.innerHTML =
      `Your Max All Autobuyer is ${game.data.bups[0][1] ? `clicking the Max All button ${game.beautify(game.maxAllSpeed())} times per second, but only if you can't Factor Shift`: `locked. Purchase the relevant Booster Upgrade to unlock it!`}`;
    game.markupAuto.innerHTML =
      `Your Markup Autobuyer is ${game.data.bups[0][2] ? `clicking the Markup button ${game.beautify(game.markupSpeed())} times per second, but only if you're past &psi;(1)`: `locked. Purchase the relevant Booster Upgrade to unlock it!`}`;
  },
  loop: (unadjusted, off = false) => {
    var ms = unadjusted;
    
    game.data.lastTick = Date.now();
    
    if (game.data.bups[1][2] && game.data.op < 1.000e230) {
      game.data.op += ms / (game.data.bups[1][0] ? 10: 50) * (game.data.bups[3][2] && game.base() < 6 ? 666666: 1);
    }
    
    if (game.data.op > 1.000e230 && game.data.op < 2.000e230) {
      game.data.op = 1.000e230;
    }
    
    game.data.dynamicFactor += ms / 100000;
    
    if (game.data.dynamicFactor > 10) {
      game.data.dynamicFactor = 10;
    }
    
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

          game.data.ord += Math.min(Math.floor(game.data.pendingIncrement), game.base() * Math.floor(game.data.pendingMaximize));

          game.data.pendingIncrement %= 1;
          game.data.pendingMaximize %= 1;
        } else if (Math.floor(game.data.pendingIncrement) >= game.base() - (game.data.ord % game.base())) {
          game.data.ord += game.base() - (game.data.ord % game.base()) - 1;
          game.data.over += Math.floor(game.data.pendingIncrement) - game.base() + (game.data.ord % game.base()) + 1;
          game.data.pendingIncrement %= 1;
        } else {
          game.data.ord += Math.floor(game.data.pendingIncrement);
          game.data.pendingIncrement %= 1;
        }
      }
    } else {
      game.data.over = 0;
      game.data.ord = Math.max(Math.min(game.data.incrementAuto, game.data.maximizeAuto), game.data.ord, 1.000e230);
    }
    
    if (game.data.bups[0][1]) {
      game.data.pendingMaxAll += ms / 1000 * game.maxAllSpeed();
      
      if (game.data.pendingMaxAll >= 1) {
        game.data.pendingMaxAll -= 1;
        if (game.data.op < game.factorShiftCosts[game.data.factorShifts]) {
          game.maxMarkup(false);
        }
      }
    }
    if (game.data.bups[0][2]) {
      game.data.pendingMarkup += ms / 1000 * game.markupSpeed();
      
      if (game.data.pendingMarkup >= 1) {
        game.data.pendingMarkup -= 1;
        if (game.data.ord >= 1.000e230) {
          game.markup(false);
        }
      }
    }
    if (game.data.pendingMaxAll >= 1 && game.data.pendingMarkup >= 1) {
      var bupCom = Math.min(game.data.pendingMaxAll, game.data.pendingMarkup);
      
      game.data.pendingMaxAll %= 1;
      game.data.pendingMarkup %= 1;
      
      if (game.data.ord >= 1.000e230) {
        game.data.ord += Math.floor(bupCom) * 1.000e230;
        game.data.op += Math.floor(bupCom) * 1.000e230;
      }
    }
    
    game.render();
    
    if (game.clickCooldown > 0) {
      game.clickCooldown--;
    }
    
    game.data.autosaveInterval += ms;
    
    if (game.data.autosaveInterval >= 5000) {
      game.data.autosaveInterval %= 5000;
      game.save("autosave", false);
    }
  },
  handleOldVersions: loadgame => {
    var newGame = loadgame;
    
    if (newGame.version === "0.1") {
      newGame.clickCooldown = 1;
      newGame.factorShifts = 0;
      newGame.factors = [];
      newGame.version = "0.1.1";
    }
    
    if (newGame.version === "0.1.1") {
      localStorage.setItem("ordinalLayersSave", JSON.stringify(newGame));
      localStorage.setItem("ordinalLayersSave", btoa(localStorage.getItem("ordinalLayersSave")));
      delete newGame.clickCooldown;
      newGame.publicTesting = false;
      newGame.betaTesting = false;
      newGame.autosaveInterval = 0;
      newGame.boosterUnlocked = false;
      newGame.factorBoosts = 0;
      newGame.dynamicFactor = 1;
      newGame.highestLevel = 0;
      newGame.achievements = [
        [false, false, false, false, false, false, false, false, false, false]
      ];
      newGame.bups = [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false]
      ];
      newGame.version = "0.2";
    }
    
    return newGame;
  },
  save: (action, manmade = true) => {
    if (!manmade || game.clickCooldown === 0) {
      localStorage.setItem(inBetaTesting() ? "ordinalLayersBetaTestingSave": (inPublicTesting() ? "ordinalLayersPublicTestingSave": "ordinalLayersSave"), btoa(JSON.stringify(game.data)));
      
      if (manmade) {
        $.notify("Game Saved!", "success");
        game.clickCooldown = 1;
      }
    }
  },
  load: loadgame => {
    var tempgame = btoa(JSON.stringify(game.data));
    var newLoadgame = loadgame === null ? game.data: loadgame;
    var error = false;
    
    if (loadgame !== null) {
      game.data = newLoadgame;
    }
    
    if (inPublicTesting()) {
      game.data.publicTesting = true;
    }
    
    if (inBetaTesting()) {
      game.data.betaTesting = true;
    }
    
    if ((game.data.publicTesting && !inPublicTesting()) || (game.data.betaTesting && !inBetaTesting())) {
      game.data = JSON.parse(atob(tempgame));
      error = true;
      $.notify("Import Failed: Attempted to import " + (game.data.betaTesting ? "beta": "public") + " testing version into the main game", "error");
    }
    
    var diff = Date.now() - game.data.lastTick;
    
    console.log(diff);
    
    game.data = game.handleOldVersions(newLoadgame);
    
    game.loop(diff, true);
    
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("game").style.display = "block";
    
    onkeypress = _ => {
      var k = _.key.toLowerCase();
      if (typeof game.keybinds[k] !== "undefined") {
        game.keybinds[k]();
      };
    };
    
    loop = setInterval(() => game.loop(Date.now() - game.data.lastTick), 50);
    
    if (game.data.music) {
      game.music.play();
    }
    
    return error;
  },
  reset: () => {
    game.data = {
      version: "0.2",
      publicTesting: false,
      lastTick: Date.now(),
      autosaveInterval: 0,
      pendingIncrement: 0,
      pendingMaximize: 0,
      pendingMaxAll: 0,
      pendingMarkup: 0,
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
    };
    
    game.save("reset", false);
  },
  importGame: () => {
    if (game.clickCooldown === 0) {
      var loadgame = "";
      
      var reader = new FileReader();
      
      reader.readAsText(document.getElementById("importButton").files[0]);
      
      setTimeout(
        () => {
          loadgame = JSON.parse(atob(reader.result));
          if (loadgame !== "") {
            var error = game.load(loadgame);
            if (!error) {
              $.notify("Import Successful!", "success");
            }
          }
        },
        100
      );
      
      game.clickCooldown = 0;
    }
  },
  exportGame: () => {
    if (game.clickCooldown === 0) {
      game.save("export", false);
      
      var file = new Blob([btoa(JSON.stringify(game.data))], {type: "text/plain"});
      
      URL = URL || webkitURL;
      
      var a = document.createElement("a");
      
      a.href = URL.createObjectURL(file);
      a.download = inBetaTesting() ? "Ordinal Layers Beta Testing Save.txt": (inPublicTesting() ? "Ordinal Layers Public Testing Save.txt": "Ordinal Layers Save.txt");
      a.click();
      
      $.notify("File Export Successful!", "success");
      
      if (inPublicTesting() || inBetaTesting()) {
        $.notify("Warning! This is a " + (inBetaTesting ? "Beta": "Public") + " Testing save. You will not be able to import this save into the base game", "warn");
      }
      
      game.clickCooldown = 1;
    }
  },
  resetConf: () => {
    if (game.clickCooldown === 0) {
      var code = prompt(
        'Are you sure you want to delete all of your progress? Type in "reset game" to reset all of your progress.'
      );

      if (code !== null) {
        if (code.toLowerCase() === "reset game") {
          game.reset();
          $.notify("Hard Reset Successful", "success");
        }
      }
      
      game.clickCooldown = 1;
    }
  }
};

if (localStorage.getItem(inBetaTesting() ? "ordinalLayersBetaTestingSave": (inPublicTesting() ? "ordinalLayersPublicTestingSave": "ordinalLayersSave")) === null) {
  game.reset();
}

document.getElementById("loadingScreen").style.display = "none";
document.getElementById("mainMenu").style.display = "block";
