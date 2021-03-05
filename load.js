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
    setTimeout(script3, 50);
  }
  
  function script() {
    script1();
    setTimeout(script4, 50);
  }
  
  setTimeout(script, 50);
}
