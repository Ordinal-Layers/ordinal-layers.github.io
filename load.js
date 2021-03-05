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
  document.getElementById("fake").style.display = "none";
  
  var loadingScreen = document.createElement("div");
  loadingScreen.id = "loadingScreen";
  loadingScreen.innerHTML = '<h1>Loading...</h1>';
  document.body.appendChild(loadingScreen);
  
  function script1() {
    var extend1 = document.createElement("script");
    extend1.src = "extend/jquery.js";
    document.body.appendChild(extend1);
  }
  
  function script2() {
    var extend2 = document.createElement("script");
    extend2.src = "extend/notify.js";
    document.body.appendChild(extend2);
  }
  
  function script3() {
    var script = document.createElement("script");
    script.src = "script.js";
    document.body.appendChild(script);
  }
  
  function script4() {
    script2();
    setTimeout(script3, 100);
  }
  
  function script() {
    script1();
    setTimeout(script4, 100);
  }
  
  setTimeout(script, 100);
}