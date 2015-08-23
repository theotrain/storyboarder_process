$(function(){ 
  $(".dragImage").draggable();
  $(".resizeImage").resizable({
    aspectRatio: true,
    handles: 'ne, se, sw, nw'
  });
});