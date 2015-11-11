var canvas;
var isLoadingImage = false;
var undoIndex = 0;
var undoArray = [];
// var undoVirgin = true;
// var changeCount = 0;
var textChanged = false;
var MAX_UNDO_LEVELS = 15;
var loaderTimer;

// storyboarder.php sets the below variables:
// var pageData ---current page graphics data
// var pageID ---id# of current page
// var pageIDArray  ----array of page IDs
// var pageIDArrayIndex
// var bookID


$(function(){
  canvas = new fabric.Canvas('c');
  canvas.setBackgroundColor('rgba(255, 255, 255, 1)', canvas.renderAll.bind(canvas));
  // canvas.centeredScaling = true;
  // canvas.centeredRotation = true;
  canvas.perPixelTargetFind = true;
  //canvas.preserveObjectStacking = true;
  initButtons();
  initTextControls();
  disableTextEditor();

  //changeMade(); //add default undo item so that we can undo back to blank

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
  //$(".loader").css("visibility", "visible");
  showPageLoaderOnDelay();
  loadPageDataToCanvas(pageData);
  setPageButtons();
})

function loadPageDataToCanvas(pgData) {
  //var canvasData = pageData;
  //var canvasData = decodeURIComponent(pageData);
  //clear undo stack
  clearUndoArray();
  canvas.loadFromDatalessJSON(pgData, pageLoadedFromJSON); 
}

// function firstPageLoadedFromJSON() {
//   changeMade();
//   console.log("FIRST PAGE LOADED");
// }

function pageLoadedFromJSON() {
  changeMade();
  //$(".loader").css("visibility", "hidden");
  hidePageLoader();
  //console.log("CANVAS.OVERLAYIMAGE: " + canvas.overlayImage);
  //if (! canvas.overlayImage) {
    //console.log("WE GoT TO WHERE IT SHOULD REMOVE OVERLAY");
  // canvas.setOverlayImage(canvas.overlayImage, canvas.renderAll.bind(canvas));
  //}
  //canvas.renderAll();
  console.log("loading animation stopped");
  console.log("PAGE LOADED");
}

function pageLoadedFromUndoStack() {
  //changeMade();
  canvas.renderAll();
  console.log("PAGE LOADED");
}



// function pageLoadedFromJSON() {
//   canvas.renderAll();
//   console.log("PAGE LOADED");
// }

function clearUndoArray() {
  undoIndex = 0;
  undoArray = [];
}

function changeMade(s) {
  console.log("------------------change made: " + s);
  // changeCount += 1;
  // if (changeCount > 1) { undoVirgin = false };
  // undoVirgin = false;
  //console.log("UNDO VIRGIN: " + undoVirgin);
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
  //console.log("PUSHING TO UNDO ARRAY: " + canvasStr);
  
  undoArray.push(canvasStr);

  for (var i=0; i<undoArray.length; i++) {
    console.log("UNDO ARRAY[" + i + "]: " + undoArray[i]);
  }

  undoIndex = undoArray.length - 1;

  console.log("UNDO INDEX:" + undoIndex);
  //console.log("ADDING TO UNDO ARRAY");
  //undoStats();
  setUndoButtons();
}

function setPageButtons() {  
  if (pageIDArrayIndex <= 0) {
    disable_btn($(".page_control_back"), true);
  } else {
    if (pageIDArray.length > 1) {
      disable_btn($(".page_control_back"), false);
    }
  }
  if (pageIDArrayIndex >= pageIDArray.length-1) {
    disable_btn($(".page_control_forward"), true);
  } else {
    if (pageIDArray.length > 1) {
      disable_btn($(".page_control_forward"), false);
    }
  }
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
  console.log("UNDO INDEX:" + undoIndex);
  //undoStats();
  setUndoButtons();
}

function redo() {
  if (undoIndex < undoArray.length-1) {
    undoIndex += 1;
    loadState();
    console.log("UNDO INDEX:" + undoIndex);
  }
  //undoStats();
  setUndoButtons();
}

function loadState() {
  var canvasData = JSON.parse(undoArray[undoIndex]);
  if (! canvasData.hasOwnProperty('overlayImage')) {
    canvas.setOverlayImage(null, canvas.renderAll.bind(canvas));
  }
  canvas.loadFromDatalessJSON(canvasData, pageLoadedFromUndoStack); 
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

  //jquery UI dialog box
  $( "#dialog-confirm" ).dialog({
      resizable: false,
      autoOpen: false,
      show: { effect: "slideDown", duration: 300 },
      height:140,
      modal: true,
      buttons: {
        "Save": function() {
          $( this ).dialog( "close" );
          save("link", $("#dialog-confirm").data("link"));
        },
        "Don't Save": function() {
          $( this ).dialog( "close" );
          window.location.href = $( "#dialog-confirm" ).data("link");
        }
      }
    });

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

  $( "#first_btn" ).click(function() {
    if (pageIDArrayIndex > 0) {
      goToPageIndex(0);
    }
  });

  $( "#previous_btn" ).click(function() {
    if (pageIDArrayIndex > 0) {
      goToPageIndex(pageIDArrayIndex-1);
    }
  });

  $( "#next_btn" ).click(function() {
    if (pageIDArrayIndex < pageIDArray.length-1) {
      goToPageIndex(pageIDArrayIndex+1);
    }
  });

  $( "#last_btn" ).click(function() {
    if (pageIDArrayIndex < pageIDArray.length-1) {
      goToPageIndex(pageIDArray.length-1);
    }
  });

  $( "#save_btn" ).click(function() {
    save();
  });//end save btn click

  $( "#page_add_btn" ).click(function() {
    $.ajax({
      url: 'new-page.php',
      data: { bookID: bookID },
      //data: "",
      type: 'POST',
      dataType: 'text',
      success: function(data) {
        //var canvasData = data[0];
        data = data.replace(/\s+/g, '');//remove spaces
        console.log("ID returned from new page ajax call: " + data);
        pageIDArray.push(data);

        // var pageID ---id# of current page
// var pageIDArray  ----array of page IDs
// var pageIDArrayIndex
        addPageSelectOption(data, pageIDArray.length)
        goToPageIndex(pageIDArray.length-1)

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

  $( "#page_delete_btn" ).click(function() {
    if (pageIDArray.length == 1) {
      alert("What is a book without at least one page?");
    } else {
      $.ajax({
        url: 'delete-page.php',
        data: { pageID: pageID },
        //data: "",
        type: 'POST',
        dataType: 'text',
        success: function(data) {
          //var canvasData = data[0];
          console.log("returned from page delete OK: " + data);
          pageIDArray.splice(pageIDArrayIndex, 1);

          //remove page # from select menu
          //$("#page_select option[value='" + pageID + "']").remove();
          rewritePageSelectOptions();

          if (pageIDArrayIndex > 0) {
            goToPageIndex(pageIDArrayIndex-1);
          } else {
            goToPageIndex(0);
          }
          // var pageID ---id# of current page
          // var pageIDArray  ----array of page IDs
          // var pageIDArrayIndex
          // addPageSelectOption(data, pageIDArray.length)
          // goToPageIndex(pageIDArray.length-1)

          //alert('form has been posted successfully');
        },
        error: function(xhr, status, error) {
          //alert('its broke!');
          //alert(xhr.responseText);
          alert(error);
          //alert(jQuery.parseJSON(xhr.responseText));
        }
      });
    }
  });

  // function addPageSelectOption(val, txt) {
  //   $('#page_select').append($('<option>', {
  //       value:val,
  //       text:txt
  //   }));  
  // }

  // function rewritePageSelectOptions() {
  //   //remove all
  //   $('#page_select').children("option").remove();
  //   //add all
  //   for (var i = 0; i < pageIDArray.length; i++) {
  //     addPageSelectOption(pageIDArray[i], i+1);
  //   }  
  // }

  // after reordering pages we need to rewrite page select options

  // use the order array to rewrite the pageIDArray.
  // find the pageID in pageIDArray and and change pageIDArrayIndex to that index number
  // call rewritePageSelectOptions()

  // pageID
  // pageIDArray
  // pageIDArrayIndex





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
    showPaletteOnly: true,
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
      ["rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(175, 255, 0)", "rgb(0, 255, 0)",
      "rgb(0, 255, 255)", "rgb(0, 150, 255)", "rgb(0, 0, 255)", "rgb(125, 0, 255)", "rgb(255, 0, 255)"]/*,
      ["rgb(182, 0, 0)", "rgb(182, 89, 0)", "rgb(181, 182, 0)", "rgb(124, 182, 0)", "rgb(0, 182, 0)",
      "rgb(0, 181, 182)", "rgb(0, 107, 182)", "rgb(0, 0, 182)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
      ["rgb(255, 145, 145)", "rgb(255, 199, 145)", "rgb(255, 255, 145)", "rgb(220, 255, 145)", "rgb(145, 255, 145)",
      "rgb(145, 255, 255)", "rgb(145, 210, 255)", "rgb(145, 145, 255)", "rgb(199, 145, 255)", "rgb(255, 145, 255)"]*/
    ]
  }

  $("#text_fore").spectrum(color_picker_foreground_object);
  // $("#text_back").spectrum(color_picker_background_object);

}

function addPageSelectOption(val, txt) {
  $('#page_select').append($('<option>', {
      value:val,
      text:txt
  })); 
}

function rewritePageSelectOptions() {
  //remove all
  $('#page_select').children("option").remove();
  //add all
  for (var i = 0; i < pageIDArray.length; i++) {
    addPageSelectOption(pageIDArray[i], i+1);
  }
  $('#page_select').val(pageID);
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

function pageSelect(dropdown) {
    //var value = dropdown.options[dropdown.selectedIndex].value;
    var index = dropdown.options[dropdown.selectedIndex].text-1;
    //alert(index);
    goToPageIndex(index);
}

function save(action, idx) {
  showPageLoaderOnDelay();
  var canvasData = canvas.toDatalessJSON();
  var canvasStr = JSON.stringify(canvasData);
  console.log("cavasData------------");
  console.log(canvasData);
  console.log("JSON.STRINGIFIED canvas data------------");
  console.log(JSON.stringify(canvasData));
  //cs = canvasStr.replace(/[\n\r]/g, '<br />');
  var dataURL = canvas.toDataURL({
    format: 'jpeg',
    quality: 0.9,
    multiplier: 0.25
  });
  $.ajax({
    url: 'save-page.php',
    //data: JSON.stringify(canvasData),
    //encodeURIComponent(canvasStr)
    data: { canvasString: canvasStr, pageID: pageID, imgBase64: dataURL },
    //dataType: 'text',
    method: 'POST',
    success: function() {
      //alert('return from save page and thumbnail');
      hidePageLoader();
      if (action == "page") {
        loadPageIndex(idx);
      }
      if (action == "link") {
        window.location.href = idx;
      }
    },
    error: function(xhr, status, error) {
      hidePageLoader();
      alert('Could not save.  Please check connection and try again.');
      //alert(xhr.responseText);
      //alert(error);
      console.log("XHR: " + xhr);
      console.log("status: " + status);
      console.log("error: " + error);
      //alert(jQuery.parseJSON(xhr.responseText));
    }
  });
}
function pageHasChanges() {
  return undoIndex != 0
}


function goToPageIndex(i) {
  //save id undoArray
  if (pageHasChanges()) {
    save("page", i);
  } else {
    loadPageIndex(i);
  }
}

function showPageLoaderOnDelay() {
  //$("#loader").css("visibility", "visible");
  loaderTimer = setTimeout( showPageLoader, 500 );
  // $( "#loader" ).fadeIn( "slow", function() {
  //   // Animation complete
  // });
}

function showPageLoader() {
  $("#loader").css("visibility", "visible");
}

function hidePageLoader() {
  clearTimeout(loaderTimer);
  $("#loader").css("visibility", "hidden");
}

function loadPageIndex(i) {
  //$(".loader").css("visibility", "visible");
  showPageLoaderOnDelay();
  pageIDArrayIndex = i;
  var loadPageID = pageIDArray[pageIDArrayIndex];
  //alert("load this page id: " + loadPageID);
  $.ajax({
    url: 'get-page.php',
    data: {"loadPageID": loadPageID},
    //data: "",
    type: 'POST',
    dataType: 'text',
    success: function(data) {
      //var canvasData = data[0];
      console.log("DATA LOADED: " + data);
      //console.log("DATA DECODED: " + decodeURIComponent(data));
      pageID = loadPageID;
      document.getElementById("page_select").selectedIndex = pageIDArrayIndex;
      setPageButtons();
      //var jsonMatch = data.match( /\/\*JSON\[\*\/([\s\S]*?)\/\*\]JSON\*\// );
      //data = JSON.parse( (jsonMatch ? jsonMatch[1] : data).replace(/\n/g,"") );
      //var canvasData = JSON.parse(decodeURIComponent(data));
      var canvasData = JSON.parse(data);
      //console.log("LOADING PAGE DATA OVERLAY: " + canvasData.overlayImage.src);
      if (! canvasData.hasOwnProperty('overlayImage')) {
        canvas.setOverlayImage(null, canvas.renderAll.bind(canvas));
      }
      loadPageDataToCanvas(canvasData);
      //var canvasData = data;
      //canvas.loadFromDatalessJSON(canvasData, pageLoadedFromJSON)
      //alert('form has been posted successfully');
    },
    error: function(xhr, status, error) {
      hidePageLoader();
      alert('Could not load page.  Please check connection and try again.');
      //alert('its broke!');
      //alert(xhr.responseText);
      console.log(error);
      //alert(jQuery.parseJSON(xhr.responseText));
    }
  });

}

function openSaveDialog(link) {
  if (pageHasChanges()) {
    $("#dialog-confirm").data("link", link);
    $("#dialog-confirm").dialog("open");
  } else {
    window.location.href = link;
  }
  
}

function loadOverlay(url) {
  //canvas.setOverlayImage(image url, optional callback method);
  canvas.setOverlayImage(url, overlayAddComplete);

}

function overlayAddComplete() {
  canvas.renderAll.bind(canvas);
  changeMade();
}









