var canvas;
var isLoadingImage = false;
var undoIndex = 0;
var undoArray = [];
var textChanged = false;
var MAX_UNDO_LEVELS = 15;

$(function(){
  canvas = new fabric.Canvas('c');
  // canvas.centeredScaling = true;
  // canvas.centeredRotation = true;
  canvas.perPixelTargetFind = true;
  //canvas.preserveObjectStacking = true;
  initButtons();
  initTextControls();
  disableTextEditor();

  changeMade(); //add default undo item so that we can undo back to blank

  canvas.on({
    // 'object:moving': onChange,
    // 'object:scaling': onChange,
    // 'object:rotating': onChange,
    'object:modified': changeMade,
    'selection:cleared': function() {
      console.log("cleared selection");
      outputObjects();
      disableTextEditor();
      if (textChanged) {
        textChanged = false;
        changeMade();
      }
      // for(var i = 0; i < canvas.getObjects().length; i++) {
        // console.log("object" + i + "---------- ");
        // console.log("object" + i + "is group: " + canvas.getObjects()[i].type);
        //console.log("object" + i + "src: " + canvas.getObjects()[i].getSrc());
        //var obj = canvas.getObjects()[i];
        //var isAGroup = (obj instanceOf Image);
        //console.log(isAGroup);

        // if (canvas.getObjects()[i].type == "group") {
        //   console.log('removing group');
        //   canvas.getObjects().splice(i,1);
        // }

      // }
    }
  });

})

function changeMade(s) {
  console.log("------------------change made: " + s);
  canvas.renderAll();

  //first we need to trim the array to undoIndex so theres nothing after.
  if (undoIndex < undoArray.length-1) {
    undoArray = undoArray.slice(0, undoIndex+1);
  }

  //check if undoArray.length > MAX_UNDO_LEVELS
  if (undoArray.length == MAX_UNDO_LEVELS) {
    //WE need to shrink the array before adding to it
    //by grabbibg everything but the first item
    //and substracting one from the index
    undoArray = undoArray.slice(1, undoArray.length);
    undoIndex -= 1;
  }

  var canvasData = canvas.toDatalessJSON();
  var canvasStr = JSON.stringify(canvasData);
  //console.log("contents before push: " + canvasStr);
  undoArray.push(canvasStr);
  undoIndex = undoArray.length - 1;
  console.log("ADDING TO UNDO ARRAY");
  //undoStats();
  setUndoButtons();
}

function setUndoButtons() {
  //make undo and redo buttons visible as needed
  //var undo_btn = $(".undo_btn");
  if (undoIndex == 0) {
    disable_btn($(".enableIfUndo"), true);
  } else {
    disable_btn($(".enableIfUndo"), false);
  }
  if (undoIndex == undoArray.length-1) {
    disable_btn($(".enableIfRedo"), true);
  } else {
    disable_btn($(".enableIfRedo"), false);
  }
}

function undo() {
  if (undoIndex > 0) {
    undoIndex -= 1;
    loadState();
  }
  console.log("UNDO===----->");
  //undoStats();
  setUndoButtons();
}

function redo() {
  if (undoIndex < undoArray.length-1) {
    undoIndex += 1;
    loadState();
  }
  //undoStats();
  setUndoButtons();
}

function loadState() {
  var canvasData = JSON.parse(undoArray[undoIndex]);
  canvas.loadFromDatalessJSON(canvasData, pageLoadedFromJSON); 
}

function undoStats() {
  console.log("undoArray items:" + undoArray.length);
  console.log("undoIndex: " + undoIndex);
  //output # of objects in each undo item, ie: [0,1,2,2,2];
  //
  console.log("UNDO ARRAY CONTENTS --------");
  for (var i = 0; i < undoArray.length; i++) {
    if (i == undoIndex) {
      console.log("CURRENT")
    }
    console.log(undoArray[i]);
    console.log("----------------->");
    //Do something
  }

}

function isFunction(possibleFunction) {
  return typeof(possibleFunction) === typeof(Function);
}

function initButtons() {
  var enable_if_selected = $(".enableIfSelection");
  disable_btn(enable_if_selected, true);

  var enable_if_group_selected = $(".enableIfGroupSelection");
  disable_btn(enable_if_group_selected, true);

  disable_btn($(".enableIfUndo"), true);
  disable_btn($(".enableIfRedo"), true);

  canvas.on('object:selected', function(options) {
    //console.log('objects selected:' + canvas.getActiveGroup().size());
    //console.log('first object selected:' + canvas.getActiveGroup().getObjects()[0]);
    //enable below line to allow groups and single items to move up/down
    //disable_btn(enable_if_selected, false);
    if (canvas.getActiveObject() && (canvas.getActiveObject().get('type') === "text")) {
        //display text edit window
        enableTextEditor();
    }

    //enable below code to allow only one item to move up/down
    if (canvas.getActiveGroup()) {
      disable_btn(enable_if_selected, true);
      disable_btn(enable_if_group_selected, false);
      console.log('group selected');
    } else {
      disable_btn(enable_if_selected, false);
      disable_btn(enable_if_group_selected, false);
      console.log('object selected');
    }
  });
  canvas.on('selection:cleared', function(options) {
    disable_btn(enable_if_selected, true);
    disable_btn(enable_if_group_selected, true);
    console.log('selection cleared');
  });

  // $( "#move_to_top_btn" ).click(function() {
  //   if (canvas.getActiveGroup()) {
  //     //canvas.getActiveGroup().bringToFront();
  //     for(var i = 0; i < canvas.getActiveGroup().size(); i++) {
  //       console.log("moving group item: " + i + ":   " + canvas.getActiveGroup().item(i));
  //       var obj = canvas.getActiveGroup().item(i);
  //       obj.bringToFront();
  //     }
  //     //canvas.getObjects().pop();
      
  //     console.log("move to top with group selected");
  //   } else {
  //     canvas.getActiveObject().bringToFront();
  //     console.log("move to top with 1 object selected");
  //   }
  // });

  // $( "#move_to_bottom_btn" ).click(function() {
  //   if (canvas.getActiveGroup()) {
  //     canvas.getActiveGroup().sendToBack();
  //   } else {
  //     canvas.getActiveObject().sendToBack();
  //   }
  // });
  $( "#undo_btn" ).click(function() {
    undo();
  });
  $( "#redo_btn" ).click(function() {
    redo();
  });

  $( "#move_up_btn" ).click(function() {
    canvas.getActiveObject().bringForward(true);
    changeMade();
  });

  $( "#move_down_btn" ).click(function() {
    canvas.getActiveObject().sendBackwards(true);
    changeMade();
  });

  $( "#flip_horiz_btn" ).click(function() {
    canvas.getActiveObject().setFlipX(!canvas.getActiveObject().getFlipX());
    changeMade();
    canvas.renderAll();
  });

  $( "#flip_vert_btn" ).click(function() {
    canvas.getActiveObject().setFlipY(!canvas.getActiveObject().getFlipY());
    changeMade();
    canvas.renderAll();
  });

  $( "#straighten_btn" ).click(function() {
    canvas.getActiveObject().straighten();
    changeMade();
    canvas.renderAll();
  });


  $( "#delete_btn" ).click(function() {
    if(canvas.getActiveGroup()){
      canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o) });
      canvas.discardActiveGroup().renderAll();
    } else {
      canvas.getActiveObject().remove();
    }
    changeMade();
  });

  $( "#add_text_btn" ).click(function() {
    addText();
  });

  $( "#export_data_btn" ).click(function() {
    var canvasData = canvas.toDatalessJSON();
    var canvasStr = JSON.stringify(canvasData);
    console.log("cavasData------------");
    console.log(canvasData);
    console.log(JSON.stringify(canvasData));

    $.ajax({
      url: 'save-page.php',
      //data: JSON.stringify(canvasData),
      data: { canvasString: canvasStr },
      dataType: 'text',
      method: 'POST',
      success: function() {
        alert('form has been posted successfully');
      },
      error: function(xhr, status, error) {
        //alert('its broke!');
        //alert(xhr.responseText);
        alert(error);
        //alert(jQuery.parseJSON(xhr.responseText));
      }
    });
  });

  $( "#import_data_btn" ).click(function() {
    $.ajax({
      url: 'get-page.php',
      //data: JSON.stringify(canvasData),
      //data: "",
      type: 'POST',
      dataType: 'text',
      success: function(data) {
        //var canvasData = data[0];
        console.log(data);
        var canvasData = JSON.parse(data);
        canvas.loadFromDatalessJSON(canvasData, pageLoadedFromJSON)
        //alert('form has been posted successfully');
      },
      error: function(xhr, status, error) {
        //alert('its broke!');
        //alert(xhr.responseText);
        alert(error);
        //alert(jQuery.parseJSON(xhr.responseText));
      }
    });
  });

  // $( "#data_btn" ).click(function() {
  //   var dataURL = canvas.toDataURL({
  //     format: 'jpeg',
  //     multiplier: 2,
  //     quality: 0.8
  //   });
  //   console.log(dataURL);
  //   window.location.href=dataURL;
  // });
    
} //end init buttons

function initTextControls() {

  var txts = $("#textArea")[0];
  var changeTextArea = function() { 
    console.log("value of text area" + this.value );
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().setText(this.value);
      textChanged = true;
      canvas.renderAll();
      //console.log("can i get a what what?");
    }
  }
  // var changeTextArea2 = function() { 
  //   changeTextArea;
  //   changeMade();
  // }
  // var onBlurTextArea = function() {
  //   changeMade("from text area blur");
  // }

  txts.onkeyup = changeTextArea;
  txts.onblur = changeTextArea;
  //txts.onblur = onBlurTextArea;

  $( "#text_align_left_btn" ).click(function() {
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().textAlign = "left";
      changeMade();
      canvas.renderAll();
      console.log("can i get a what what?");
    }
  });
  $( "#text_align_center_btn" ).click(function() {
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().textAlign = "center";
      changeMade();
      canvas.renderAll();
    }
  });
  $( "#text_align_right_btn" ).click(function() {
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().textAlign = "right";
      changeMade();
      canvas.renderAll();
    }
  });

  // color picker foregraound
  var color_picker_foreground_object = {
    color: "#000",
    allowEmpty:true,
    showInput: true,
    className: "full-spectrum",
    //cancelText: "cancel",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: true,
    maxSelectionSize: 10,
    preferredFormat: "hex",
    //localStorageKey: "spectrum.demo",
    move: function (color) {
      canvas.getActiveObject().setColor(color.toHexString());
      changeMade();
      canvas.renderAll();
      //setTextBackgroundColor(textBackgroundColor)
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function (color) {
      canvas.getActiveObject().setColor(color.toHexString());
      //changeMade();
      canvas.renderAll();
    },
    change: function(color) {
      // canvas.getActiveObject().setColor(color);
      // canvas.renderAll();
    },
    palette: [
      ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)","rgb(127, 127, 127)",
      "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(234, 234, 234)","rgb(255, 255, 255)"],
      ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
      "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"]
    ]
  }

  $("#text_fore").spectrum(color_picker_foreground_object);
  // $("#text_back").spectrum(color_picker_background_object);

}

function pageLoadedFromJSON() {
  canvas.renderAll();
  console.log("PAGE LOADED");
}

function changeFont() {
  console.log("value of fonts: " + $("#fonts")[0].value);
  canvas.getActiveObject().fontFamily = $("#fonts")[0].value;
  changeMade();
  canvas.renderAll();
}

function outputObjects() {
  console.log("number of objects: " + canvas.getObjects().length);
  console.log("objects: " + canvas.getObjects());
  //console.log("object1: " + canvas.getObjects()[0]);
  
  //console.log("object[0]: " + canvas.getObjects()[0]);
}

function disable_btn(objectArray, bool) {
  for(var i = 0; i < objectArray.length; i++) {
    objectArray[i].disabled = bool;
  }
}

function addImageFromUrl(url, x, y) {

  if (isLoadingImage) {
    return;
  } else {
    isLoadingImage = true;
  }

  fabric.Image.fromURL("images/loader.png", function(loader) {
    loader.set({
      left: x,
      top: y,
      originX: 'center',
      originY: 'center'
    });
    canvas.add(loader);
    var loaderAngle = 0;

    animateLoader = setInterval(function() {
      console.log("animating LOADER: loaderAngle: " + loaderAngle); 
      loaderAngle += 8;
      loader.setAngle(loaderAngle);
      // loader.set({
      //   angle: loaderAngle
      // });
      canvas.renderAll();
    }, 50);

    fabric.Image.fromURL(url, function(img) {
      img.scale(0.5);
      imgX = img.getCenterPoint().x;
      imgY = img.getCenterPoint().y;
      offsetX = x - imgX;
      offsetY = y - imgY;
      img.set({
        left: offsetX,
        top: offsetY
      });
      canvas.add(img).setActiveObject(img);
      clearInterval(animateLoader);
      animateLoader = 0;
      canvas.remove(loader);
      isLoadingImage = false;
      changeMade("add image from URL");
    });
  });
  
}

function addText() {
  var text = new fabric.Text('Hi There!', { left: 100, top: 100, fontSize: 30 });
  //var text = new fabric.IText('Hi There!', { left: 100, top: 100, fontSize: 30 });
  canvas.add(text).setActiveObject(text);
  changeMade();
  //enableTextEditing();
}

function enableTextEditor() {
  //set font pulldown
  $("#fonts")[0].value = canvas.getActiveObject().fontFamily;
  //set text area value
  $("#textArea")[0].value = canvas.getActiveObject().getText();
  //set color picker value
  //$("#text_fore").spectrum("set", "#00ff00");
  //console.log("text color?: " + canvas.getActiveObject().fill);
  $("#text_fore").spectrum("set", canvas.getActiveObject().fill);
  //$(".textEdit").show();
  $(".textEdit").effect('blind', { direction: 'up', mode: 'show' }, 300);
}


function disableTextEditor() {
  //$(".textEdit").hide();
  $(".textEdit").effect('blind', { direction: 'up', mode: 'hide' }, 300);
}








