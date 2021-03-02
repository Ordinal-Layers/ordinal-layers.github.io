var fake = false;
var sPath = location.origin;

if (sPath !== "https://ordinal-layers.github.io") {
  fake = true;
}

if (fake) {
  document.getElementById("game").style.display = "none";
  document.getElementById("fake").style.display = "block";
}
