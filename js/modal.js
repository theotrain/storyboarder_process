var modal = (function(){
  var 
  method = {},
  $overlay,
  $modal,
  $content,
  $close;

  // Center the modal in the viewport
  method.center = function () {
    var top, left;

    top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
    left = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;

    $modal.css({
      top:top + $(window).scrollTop(), 
      left:left + $(window).scrollLeft()
    });
  };

  // Open the modal
  method.open = function (settings) {
    $content.empty().append(settings.content);

    $modal.css({
      width: settings.width || 'auto', 
      height: settings.height || 'auto'
    });

    method.center();
    $(window).bind('resize.modal', method.center);
    $modal.show();
    $overlay.show();
  };

  // Close the modal
  method.close = function () {
    $modal.hide();
    $overlay.hide();
    $content.empty();
    $(window).unbind('resize.modal');
  };

  // Generate the HTML and add it to the document
  $overlay = $('<div id="overlay"></div>');
  $modal = $('<div id="modal"></div>');
  $content = $('<div id="content"></div>');
  $close = $('<a id="close" href="#">close</a>');

  $modal.hide();
  $overlay.hide();
  $modal.append($content, $close);

  $(document).ready(function(){
    $('body').append($overlay, $modal);           
  });

  $close.click(function(e){
    e.preventDefault();
    method.close();
  });

  return method;
}());

$(function(){
  // $('a#reorder').click(function(e){
  //   modal.open({content: "Hows it <i>going?</i>"});
  //   e.preventDefault();
  // });

  $('a#reorder').click(function(e){
    $.get('reorder-pages.php', { bookID: bookID }, function(data){
      modal.open({content: data});
      $("#thumb-container-modal").sortable({ 
         opacity: 0.6, 
         cursor: 'move',
         //cursorAt: { top: 118, left: 93 },
         //axis: "x",
         update: function(){
            saveDisplayChanges();
            // $('#categorysavemessage').css("color","red");
          }
      });
    });
    e.preventDefault();
  });

  function saveDisplayChanges() {
    $('#thumb-modal-label').html('Saving...');
    var order = $("#thumb-container-modal").sortable("serialize");
    //$('#categorysavemessage').html('Saving changes..');
    //console.log('passing order:' + JSON.stringify(order));
    $.post("update-displayorder.php",order,function(theResponse){
      $("#thumb-modal-label").html(theResponse);
      if (theResponse == "Changes saved.") {
        console.log("the response is as expected!");
        // console.log('ORDER (stringify): ' + JSON.stringify(order));
        // console.log('ORDER (to array): ' + serializedToArray(order)); 
        updatePageIDArray(order);
        rewritePageSelectOptions();
        setPageButtons();
      } else {
        console.log("the news is not good!")
        console.log("the response: " + theResponse);
        console.log($("#thumb-modal-label").html);
      }
      //$('#categorysavemessage').css("color","green");
    });
  }
  function updatePageIDArray(order) {
    pageIDArray = serializedToArray(order);
    //console.log("old index: " + pageIDArrayIndex);
    //console.log("page ID: " + pageID);
    pageIDArrayIndex = pageIDArray.indexOf(pageID);
    //console.log("new pageIDArray: " + pageIDArray);
    //console.log("new index: " + pageIDArrayIndex);
    // use the order array to rewrite the pageIDArray.
    // find the pageID in pageIDArray and and change pageIDArrayIndex to that index number
    // call rewritePageSelectOptions()
    //var testArray = [1,2,3,4,5];
    //console.log("test: " + testArray.indexOf(5));
  }

  function serializedToArray(serial) {
    var response=[];
    var chunks = serial.split('&');
    for (var i = 0; i < chunks.length; i++) {
        var pair = chunks[i].split('=');
        response.push(+pair[1]);
    }
    return response;
  }

  // function updatePageSelectOptions() {
  //   //remove all
  //   $('#page_select').children("option").remove();
  //   //add all
  //   for (var i = 0; i < pageIDArray.length; i++) {
  //     addPageSelectOption(pageIDArray[i], i+1);
  //   }  
  // }
  // function addPageSelectOption(val, txt) {
  //   $('#page_select').append($('<option>', {
  //       value:val,
  //       text:txt
  //   })); 
  //   $('#page_select').val(pageIDArrayIndex);
  // }

});