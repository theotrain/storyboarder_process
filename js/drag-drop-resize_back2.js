var imageArray = [];
var asset_path = "assets/";
var resizeOpts = { 
    handles: "all",
    // containment: "#dropHere",
    autoHide: true
  }; 

$(function(){ 
  setup_drag_drop_thumbs();
});


// $(function(){ 
//   $(".dragImage").draggable();
//   $(".resizeImage").resizable({
//     aspectRatio: true,
//     handles: 'ne, se, sw, nw'
//   });
// });



function setup_drag_drop_thumbs() {
  //alert('setup drag drop');
  //Make every clone image unique.  
  var counts = [0];
     
  $(".dragImg").draggable({
    helper: "clone",
    appendTo: "#main",
    //Create counter
    start: function() { counts[0]++; }
  });

  $("#main").droppable({
    drop: function(e, ui){
      //alert("thumbnail dropped in main");
      //var imageUrl = e.dataTransfer.getData('text/html');
      //var url = $(imageUrl).attr('src');
      if (ui.draggable.hasClass("dragImg")) {
        console.log("thumbnail dropped in main");
        var imageSrc = asset_path + ui.draggable.attr('filename');
        //alert(ui.draggable.attr('filename'));
        //alert(ui.position.top);
        imageArray.push(createImage(ui.position.left,ui.position.top,400,400,imageSrc,imageArray.length));
        //setImageArrayClasses();
        draw();
        make_images_draggable();
      } else {
        //alert("image dragged in main");
        make_images_draggable();
      }
      //make all elements in main draggable
      

      // if(ui.draggable.hasClass("dragImg")) {
      //   $(this).append($(ui.helper).clone());

      //   //Pointing to the dragImg class in dropHere and add new class.
      //   $("#main .dragImg").addClass("item-"+counts[0]);
      //   $("#main .img").addClass("imgSize-"+counts[0]);
                
      //   //Remove the current class (ui-draggable and dragImg)
      //   $("#main .item-"+counts[0]).removeClass("dragImg ui-draggable ui-draggable-dragging");
      //   var droppedItem = $(".item-"+counts[0]);
      //   var offset = droppedItem.offset();
      //   $("#nav-top").text("UI POS top: " + ui.position.top + "   left: " + ui.position.left); 
      //   $("#nav-bottom").text("OFFSET top: " + offset.top + "   left: " + offset.left); 
        
      //   droppedItem.dblclick(function() {
      //     $(this).remove();
      //   }); 

      //   make_draggable($(".item-"+counts[0])); 
      //   $(".imgSize-"+counts[0]).resizable(resizeOpts);   
      // }
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

  function make_images_draggable()
  { 
    // $("#absPos").draggable({
    //   //containment:'parent'
    // }); 
    for (var i = 0; i < imageArray.length; i++) {
      //$(".image" + i).draggable({
      $(".dragImage.c"+i ).draggable({
        //containment:'parent'
      });
      // $(".draggable").draggable({
      //   containment:'parent'
      // });
      $(".resizeImage.c"+i).resizable(resizeOpts); 
    }
  }  

  // function make_images_draggable()
  // { 
  //   // $("#absPos").draggable({
  //   //   //containment:'parent'
  //   // }); 
  //   for (var i = 0; i < imageArray.length; i++) {
  //     //$(".image" + i).draggable({
  //     $(".innerImg" + i).draggable({
  //       containment:'parent'
  //     });
  //     // $(".draggable").draggable({
  //     //   containment:'parent'
  //     // });
  //     $(".resizeImage" + i).resizable(resizeOpts); 
  //   }
  // }  


};  //end setup drag drop

// $(function(){ 
//   testCreateImage();
// });

function testCreateImage() {
  //var imageArray = [];
  imageArray.push(createImage(0,0,200,200,"assets/cat-large.jpg",imageArray.length));
  imageArray.push(createImage(250,150,100,100,"assets/7caGMLzcA.jpeg",imageArray.length));
  imageArray.push(createImage(450,300,350,350,"assets/Lego-Batman-3.jpeg",imageArray.length));
  draw();
}

function addImage() {
  //create image
  //make image draggable
  //add to imageArray

}

function draw() {
  //alert("image0: " + imageArray[0].resource + " top: " + imageArray[0].topPos + "   image1: " + imageArray[1].resource + " top: " + imageArray[1].topPos);
  $("#main").empty();
  for (var i = 0; i < imageArray.length; i++) {
    imageArray[i].draw();
    //Do something
  }
}
// function setImageArrayClasses() {
//   for (var i = 0; i < imageArray.length; i++) {
//     imageArray[i].classNum();
//     //Do something
//   }

// }

function createImage(x, y, high, wide, imgURL, count) {
  var sprite = {
    leftPos:    x,
    topPos:     y,
    high:       high,
    wide:       wide,
    resource:   imgURL,
    indexNum:   count
  };
  sprite.draw = function() {
    // alert("this happens");
  //   <div class="dragImage">
  //   <div class="resizeImage">
  //     <img src="assets/Lego-Batman-3.jpeg" />
  //   </div>
  // </div>
    // $('#main').append('<div class="dragImage c'+ this.indexNum + '" style="top:' + this.topPos +'px; left:'+ this.leftPos +'px;"><div id="absPos" class="resizeImage c'+ this.indexNum + '" style="height:' + this.high +'px; width:'+ this.wide +'px;"><img class="innerImg c'+ this.indexNum +'" src="' + this.resource + '" /></div></div>');
    
    // $('#main').append('<div class="dragImage c'+ this.indexNum + '" style="top:' + this.topPos +'px; left:'+ this.leftPos +'px; position:absolute; clip: rect(0px 200px 200px 0px);"><div class="resizeImage c'+ this.indexNum + '" id="absPos" style="height:' + this.high +'px; width:'+ this.wide +'px;"><img class="innerImg c'+ this.indexNum +'" src="' + this.resource + '" /></div></div>');
    
    // try as background image
    $('#main').append('<div class="dragImage c'+ this.indexNum + '" style="top:' + this.topPos +'px; left:'+ this.leftPos +'px;"><div class="resizeImage c'+ this.indexNum + '" id="absPos" style="height:' + this.high +'px; width:'+ this.wide +'px; background-image: url(' + this.resource + '); background-position: 50px 50px;background-repeat:no-repeat; background-size: 100% 100%;"></div></div>');
    

    //$('#main').append('<div class="resizeImage'+ this.classNum +'"><div id="absPos" class="image'+ this.classNum +'" style="top:' + this.topPos +'px; left:'+ this.leftPos +'px;"><img class="innerImg'+ this.classNum +'" src=' + this.resource + ' style="height:'+ this.high +'px; width:'+ this.wide + 'px;" /></div></div>');
    //$('#main').append('<div id="absPos" class="image'+ this.classNum +'" style="top:' + this.topPos +'px; left:'+ this.leftPos +'px;"><img class="innerImg'+ this.classNum +'" src=' + this.resource + ' style="height:'+ this.high +'px; width:'+ this.wide + 'px;" /></div>');
    //$('#main').append('<div id="absPos" class="image'+ this.classNum +'"><img class="innerImg'+ this.classNum +'" src=' + this.resource + ' /></div>');
    //$('#main').append('<img class="innerImg'+ this.classNum +'" src=' + this.resource + ' style="position:relative; height:'+ this.high +'px; width:'+ this.wide + 'px;" />');
  }
  return sprite;
}