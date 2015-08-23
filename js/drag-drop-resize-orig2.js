$(function(){ 
  setup_drag_drop();
});

function thumbToImageUrl(url) {
  imageUrl = url.replace("-thumb.",".");
  alert(imageUrl);
} 

function setup_drag_drop() {
  //alert('setup drag drop');
  //Make every clone image unique.  
  var counts = [0];
  var resizeOpts = { 
    handles: "all",
    // containment: "#dropHere",
    autoHide: true
  };    
  $(".dragImg").draggable({
    helper: "clone",
    //Create counter
    start: function() { counts[0]++; }
  });

  $("#main").droppable({
    drop: function(e, ui){
      if(ui.draggable.hasClass("dragImg")) {
        $(this).append($(ui.helper).clone());

        // $(this).append("<div class='innerDiv"+counts[0]+"'></div>")
        // $(".innerDiv"+counts[0]).append($(ui.helper).clone());

        //Pointing to the dragImg class in dropHere and add new class.
        $("#main .dragImg").addClass("item-"+counts[0]);
        $("#main .img").addClass("imgSize-"+counts[0]);

        on drop, remove item.
                
        //Remove the current class (ui-draggable and dragImg)
        $("#main .item-"+counts[0]).removeClass("dragImg ui-draggable ui-draggable-dragging");
        var droppedItem = $(".item-"+counts[0]);
        // var leftAdjust = droppedItem.position().left - $(this).position().left
        // var topAdjust = droppedItem.position().top - $(this).position().top
        // droppedItem.css({left: leftAdjust, top: topAdjust})

        var offset = droppedItem.offset();
        $("#nav-top").text("UI POS top: " + ui.position.top + "   left: " + ui.position.left); 
        $("#nav-bottom").text("OFFSET top: " + offset.top + "   left: " + offset.left); 


        // var mainOffset = $(this).offset();

        // var leftAdjust = offset.left + mainOffset.left;
        // var topAdjust = offset.top + mainOffset.top;
        // droppedItem.css({left: leftAdjust, top: topAdjust});

        //droppedItem.css({left: ui.position.left, top: ui.position.top});

        droppedItem.dblclick(function() {
          $(this).remove();
        }); 

        make_draggable($(".item-"+counts[0])); 
        $(".imgSize-"+counts[0]).resizable(resizeOpts);
      }
    }
  });


  var zIndex = 0;
  function make_draggable(elements)
  { 
    elements.draggable({
      containment:'parent',
      start:function(e,ui){ ui.helper.css('z-index',++zIndex); },
      stop:function(e,ui){ $("#nav-bottom").text("top: " + ui.position.top + "   left: " + ui.position.left);
      }
    });
  }   


};