//var imageArray = [];
//var asset_path = "assets/";
// var resizeOpts = { 
//     handles: "all",
//     // containment: "#dropHere",
//     autoHide: true
//   }; 
var dropX;
var dropY;

$(function(){ 
  setup_drag_drop_thumbs();
});


function setup_drag_drop_thumbs() {
  //alert('setup drag drop');
  //Make every clone image unique.  
  var counts = [0];
     
  $(".dragImg").draggable({
    helper: "clone",
    appendTo: "body"
  });

  $("#c").droppable({
    drop: function(e, ui){
      //alert("thumbnail dropped in main");
      //var imageUrl = e.dataTransfer.getData('text/html');
      //var url = $(imageUrl).attr('src');
      console.log("drop function");
      if (ui.draggable.hasClass("dragImg")) {
        console.log("thumbnail dropped in main");
        //var imageSrc = asset_path + ui.draggable.attr('filename');
        var imageSrc = ui.draggable.attr('filename');

        var offset = $("#c").offset();
        dropX = (e.pageX - offset.left);
        dropY = (e.pageY - offset.top);
        // console.log("offset left: " + offset.left);
        // console.log("offset top: " + offset.top);

        // console.log("e.pageX: " + e.pageX);
        // console.log("e.pageY: " + e.pageY);

        //dropX = ui.position.left;
        console.log("dropX: " + dropX);
        //dropY = ui.position.top;
        console.log("dropY: " + dropY);
        addImageFromUrl(imageSrc, dropX, dropY);
      }

    }
  });


};  //end setup drag drop

