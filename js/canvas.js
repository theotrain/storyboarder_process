var canvas;
var stage;

function init() {
  // alert("we made it");
  canvas = document.getElementById("canvas");
  stage = new createjs.Stage(canvas);
  // logo = new createjs.Bitmap("assets/user-f25-side-neutral.svg");
  // logo.onload = setLogoReg;
  
  //stage.addChild(logo);
  //loadImage("assets/cat-large.jpg");

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", tick);
}


function tick() {
  // logo.x += (stage.mouseX - logo.x) * 0.1;
  // logo.y += (stage.mouseY - logo.y) * 0.1;
  // if (stage.children[0]) {
  //   stage.children[0].x += .2;
  //   stage.children[0].y += .2;
  // }
  stage.update();
}

function loadImage(img) {
  var preload = new createjs.LoadQueue(true);
  preload.addEventListener("fileload", handleFileComplete);
  //preload.on("complete", handleFileComplete, this);
  preload.loadFile(img);
}

function handleFileComplete(event) {
  // alert('nhn');
  
  // event.item.src = path to file
  // event.result.src = path to cached file
  var bit = new createjs.Bitmap(event.result.src);
  // console.log("height before scale: " + bit.image.height);
  bit.scaleX = 0.5;
  bit.scaleY = 0.5;

  // bit.image.height = bit.image.height/2;
  // bit.image.width = bit.image.width/2;

  // console.log("height after scale: " + bit.image.height);
  //bit.rotation = 45;
  //console.log(bit.rotation);

  bit.regX = bit.image.width * 0.5;
  bit.regY = bit.image.height * 0.5;

  // console.log("reg x: " + bit.regX);

  
  bit.x = dropX;
  bit.y = dropY;
  // bit.x = 0;
  // bit.y = 0;

  stage.addChild(bit);
  console.log("stage.children:"+stage.children[0].image.src);
}