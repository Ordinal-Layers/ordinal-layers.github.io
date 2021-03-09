var real = false;
var sPath = location.origin;
var inPublicTesting;

if (sPath === "https://ordinal-layers.github.io") {
  real = true;
}

if (real) {
  document.getElementById("fake").style.display = "none";
  document.getElementById("loadingScreen").style.display = "block";
  
  inPublicTesting = () => {
    return location.href.split("/")[3] === "public.html" || location.href.split("/")[3] === "public";
  };
  
  var script1 = () => {
    var extend1 = document.createElement("script");
    extend1.src = "extend/jquery.js";
    document.body.appendChild(extend1);
  };
  
  var script2 = () => {
    var extend2 = document.createElement("script");
    extend2.src = "extend/notify.js";
    document.body.appendChild(extend2);
  }
  
  var script3 = () => {
    var script = document.createElement("script");
    script.src = "script.js";
    document.body.appendChild(script);
  }
  
  var script4 = () => {
    script2();
    setTimeout(script3, 200);
  }
  
  var script = () => {
    script1();
    setTimeout(script4, 200);
  }
  
  setTimeout(script, 200);
}
