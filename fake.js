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
}
