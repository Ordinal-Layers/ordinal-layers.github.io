var real = false;
var sPath = location.origin;
var realSites = [
  "https://ordinal-layers.github.io",
  "https://ordinal-layers.github.io/index.html",
  "https://ordinal-layers.github.io/index"
];

if (realSites.includes(sPath)) {
  real = true;
}

if (real) {
  document.getElementById("game").style.display = "block";
  document.getElementById("fake").style.display = "none";
  
  var extend1 = document.createElement("script");
  extend1.src = "extend/jquery.js";
  document.body.appendChild(extend1);
  
  var extend2 = document.createElement("script");
  extend2.src = "extend/notify.js";
  document.body.appendChild(extend2);
  
  var script = document.createElement("script");
  script.src = "script.js";
  document.body.appendChild(script);
}
