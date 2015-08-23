var canvas;

$(function(){
  canvas = new fabric.Canvas('c');
  // canvas.centeredScaling = true;
  // canvas.centeredRotation = true;
  canvas.perPixelTargetFind = true;
  //canvas.preserveObjectStacking = true;
  initButtons();

  canvas.on({
    // 'object:moving': onChange,
    // 'object:scaling': onChange,
    // 'object:rotating': onChange,
    'selection:cleared': function() {
      console.log("cleared selection");
      outputObjects();
      for(var i = 0; i < canvas.getObjects().length; i++) {
        console.log("object" + i + "---------- ");
        console.log("object" + i + "is group: " + canvas.getObjects()[i].type);
        //console.log("object" + i + "src: " + canvas.getObjects()[i].getSrc());
        //var obj = canvas.getObjects()[i];
        //var isAGroup = (obj instanceOf Image);
        //console.log(isAGroup);

        if (canvas.getObjects()[i].type == "group") {
          console.log('removing group');
          canvas.getObjects().splice(i,1);
        }

      }
    }
  });

})

function isFunction(possibleFunction) {
  return typeof(possibleFunction) === typeof(Function);
}

function initButtons() {
  var enable_if_selected = $(".enableIfSelection");
  disable_btn(enable_if_selected, true);

  canvas.on('object:selected', function(options) {
    //enable below line to allow groups and single items to move up/down
    //disable_btn(enable_if_selected, false);

    //enable below code to allow only one item to move up/down
    if (canvas.getActiveGroup()) {
      disable_btn(enable_if_selected, true);
      console.log('object selected');
    } else {
      disable_btn(enable_if_selected, false);
      console.log('object selected');
    }
  });
  canvas.on('selection:cleared', function(options) {
    disable_btn(enable_if_selected, true);
    console.log('selection cleared');
  });

  $( "#move_to_top_btn" ).click(function() {
    if (canvas.getActiveGroup()) {
      canvas.getActiveGroup().bringToFront();
      //canvas.getObjects().pop();
      //console.log(canvas.getActiveGroup());
      console.log("move to top with group selected");
    } else {
      canvas.getActiveObject().bringToFront();
      console.log("move to top with 1 object selected");
    }
  });
  $( "#move_to_bottom_btn" ).click(function() {
    if (canvas.getActiveGroup()) {
      canvas.getActiveGroup().sendToBack();
    } else {
      canvas.getActiveObject().sendToBack();
    }
  });
  $( "#move_up_btn" ).click(function() {
    outputObjects();
    if (canvas.getActiveGroup()) {
      canvas.getActiveGroup().bringForward(true);
    } else {
      canvas.getActiveObject().bringForward(true);
    }
  });
  $( "#move_down_btn" ).click(function() {
    if (canvas.getActiveGroup()) {
      canvas.getActiveGroup().sendBackwards(true);
    } else {
      canvas.getActiveObject().sendBackwards(true);
    }
  });

}
function outputObjects() {
  console.log("number of objects: " + canvas.getObjects().length);
  console.log("objects: " + canvas.getObjects());
  //console.log("object[0]: " + canvas.getObjects()[0]);
}

function disable_btn(objectArray, bool) {
  for(var i = 0; i < objectArray.length; i++) {
    objectArray[i].disabled = bool;
  }
}

function addImageFromUrl(url, x, y) {
  fabric.Image.fromURL(url, function(img) {
    img.scale(0.5);
    imgX = img.getCenterPoint().x;
    imgY = img.getCenterPoint().y;
    offsetX = x - imgX;
    offsetY = y - imgY;
    // x -= img.width / 2;
    // y -= img.height / 2;
    img.set({
      left: offsetX,
      top: offsetY
    });
    canvas.add(img).setActiveObject(img);
  });
}



// function loadImage(img) {
//   var preload = new createjs.LoadQueue(true);
//   preload.addEventListener("fileload", handleFileComplete);
//   //preload.on("complete", handleFileComplete, this);
//   preload.loadFile(img);
// }

