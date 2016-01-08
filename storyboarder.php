<?php
  require("connection.php");
  $gtfo = false;
  session_start();
  if (($_GET['id'] == null) or (!isset($_SESSION['user_id']))){
    $gtfo = true;
  }
?>
<?php
  $query = "SELECT name, id FROM books WHERE id = '$_GET[id]' AND user_id = '$_SESSION[user_id]'";
  $user_owns_book = $mysqli->query($query);
  if(mysqli_num_rows($user_owns_book)==0){
    $gtfo = true;
  }
  while($row = $user_owns_book->fetch_array()) {
    $documentName = $row['name'];
  }
  if ($gtfo) {
    header('Location: index.php') ;
    exit;
  }
?>
<?php
  $query = "SELECT url FROM overlays ORDER BY display_order";
  $overlay_records = $mysqli->query($query);
  while($row = $overlay_records->fetch_array()) {
    $overlays[] = $row['url'];
  }
?>
<?php
  $query = "SELECT id, name FROM categories";
  $categories = $mysqli->query($query);
?>
<?php
  $query = "SELECT content, id FROM pages WHERE book_id = '$_GET[id]' ORDER BY order_index";
  $page = $mysqli->query($query);
  while($row = $page->fetch_array()) {
    $pageIDs[] = $row['id'];
  }
  mysqli_data_seek($page, 0);
  // var $pageData;
  while($row = $page->fetch_array()) {
    // echo " ->";
    $pageData = $row['content'];
    break;
  }
  //$pageData = urldecode($pageData);
  $pageID = $pageIDs[0];
  //$pageData = $thisPage[0]['content'];
  //$pageID = $thisPage[0]['id'];
  // echo "page data" . $pageData . "<br />";
  // echo "page id" . $pageID;
?>
<html>
  <head>
    <script>
      var bookID = <?php echo $_GET[id] . ";" ?>
      var pageData = <?php echo $pageData . ";" ?>
      var pageID = <?php echo $pageID . ";" ?>
      var pageIDArray = <?php echo "[" . join(',', $pageIDs) . "];" ?>
      var pageIDArrayIndex = 0;
      // alert "id array: " . $pageIDs;
    </script>

    <script src="js/jquery-1.11.2.min.js"></script>
    <script src="js/tools.js"></script>
    <script src="js/constants.js"></script>
    <script src="js/drag-drop-resize.js"></script>
    <script src="js/tabs.js"></script>
    <script src="js/work-area.js"></script>
    <script src="js/modal.js"></script>

    <!--<script src="js/jquery.getimagedata.min.js"></script>-->
    

    <script src="lib/easeljs-0.8.1.min.js"></script>
    <script src="lib/preloadjs-0.6.1.min.js"></script>
    <script src="lib/fabric.min.js"></script>

    <script src="js/jquery-ui-custom/external/jquery/jquery.js"></script>
    <script src="js/jquery-ui-custom/jquery-ui.js"></script>

    <link rel="stylesheet" type="text/css" href="css/load_fonts.css">
    <link href="js/jquery-ui-custom/jquery-ui.css" rel="stylesheet">
    
    <link rel="stylesheet" href="font-awesome-4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="css/resize.css">
    <link rel="stylesheet" type="text/css" href="css/reset.css">
    <link rel="stylesheet" href="css/spectrum.css" />
    <link rel="stylesheet" type="text/css" href="css/mystyle.css">
    <link rel="stylesheet" type="text/css" href="css/modal.css">
    <link rel="stylesheet" type="text/css" href="css/bootstrap-progress.css">
   <!--  <link rel="stylesheet" type="text/css" href="css/bootstrap-input-button.css"> -->

    <link rel="stylesheet" href="css/jquery.fileupload-ui.css">
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"> -->

    <script src="js/spectrum.js"></script>
    <!-- 
    <script type="text/javascript" src="http://bgrins.github.com/spectrum/spectrum.js"></script>
 -->
    <script>

    // $(function(){
    //   thumbToImageUrl("gotoMyplace_thumb.jpg");
    // });

    // $( document ).tooltip({
    //   position: { my: "left+15 center", at: "left bottom+15" }
    // });

    function printMe()
    {
      w=window.open();
      w.document.write($('#dropHere').html());
      // w.print();
      // w.close(); 
    } 

    </script>

  </head>
  <body>
    <!-- <div class="font_preload" style="opacity: 0">
      <span style="font-family: 'Anime Ace';"></span>
      <span style="font-family: 'Droid Sans Mono';"></span>
    </div> -->

    <div id="progress" class="progress">
        <div class="progress-bar progress-bar-success"></div>
    </div>

    <div id="nav-top-full-width">
    <!-- The global progress bar -->
    <!-- <div id="progress" class="progress">
        <div class="progress-bar progress-bar-success"></div>
    </div> -->


      <div class="nav-top">  
        <span id="title">STORYBOARDER</span>
        <nav>
          <ul>
            <li>
              <span><?php echo $_SESSION['user_name'] . ' ' ?><span class="caret"></span></span>
              <div>
                <ul>
                  <!-- <li><a href="index.php?logout">Logout</a></li> -->
                  <li><span onClick="openSaveDialog('index.php?logout');">Logout</span></li>
                </ul>
              </div>
            </li>
            <li>
              <span><?php echo $documentName . ' ' ?><span class="caret"></span></span>
              <div>
                <ul>
                  <li><a id='reorder' href='#'>Reorder pages</a></li>
                  <!-- <li><a href='index.php'>Switch / New Document</a></li> -->
                  <li><span onClick="openSaveDialog('index.php');">Switch Book</span></li>
                  <li><span onClick="openSaveDialog('index.php');">New Book</span></li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div id="nav-bottom-full-width">
      <div class="nav-bottom">
        <span id="button-group">
          <!-- <button id="save_btn" class="enableIfNoSelection square_btn nav_bottom_btn" title="Save Page" type="button"></button> -->
          <i id="save_btn" class="fa fa-download fa-2x"></i>
        </span>
        <span id="button-group">
          <!-- <button id="undo_btn" class="enableIfUndo square_btn nav_bottom_btn" title="Undo (affects current page only)" type="button"></button> -->
          <i id="undo_btn" class="fa fa-rotate-left fa-2x enableIfUndo square_btn nav_bottom_btn" title="Undo (affects current page only)"></i>
          <!-- <button id="redo_btn" class="enableIfRedo square_btn nav_bottom_btn" title="Redo (affects current page only)" type="button"></button> -->
          <i id="redo_btn" class="fa fa-rotate-right fa-2x enableIfRedo square_btn nav_bottom_btn" title="Redo (affects current page only)"></i>
        </span> 
        <span id="button-group">
          <button id="move_up_btn" class="enableIfSelection square_btn nav_bottom_btn" title="Move up display order" type="button"></button>
          <button id="move_down_btn" class="enableIfSelection square_btn nav_bottom_btn" title="Move down display order" type="button"></button>
        </span>  
        <span id="button-group">
          <button id="flip_horiz_btn" class="enableIfSelection square_btn nav_bottom_btn" title="Flip Horizontal" type="button"></button>
          <button id="flip_vert_btn" class="enableIfSelection square_btn nav_bottom_btn" title="Flip Vertical" type="button"></button>
        </span>  
        <span id="button-group">
          <button id="straighten_btn" class="enableIfSelection square_btn nav_bottom_btn" title="Straighten rotated object" type="button"></button>
        </span>  
        <!-- <span id="button-group">
          <button id="move_to_top_btn" class="enableIfSelection square_btn nav_bottom_btn" title="Move to top" type="button"></button>
          <button id="move_to_bottom_btn" class="enableIfSelection square_btn nav_bottom_btn" title="Move to bottom" type="button"></button>
        </span> -->
        <span id="button-group">
          <!-- <button id="delete_btn" class="enableIfGroupSelection square_btn nav_bottom_btn" title="Delete selection" type="button"></button> -->
          <i id="delete_btn" class="fa fa-close fa-2x enableIfGroupSelection square_btn nav_bottom_btn" title="Delete selection"></i>
        </span>
        <span id="button-group">
          <!-- <button id="add_text_btn" class="enableIfNoSelection long_btn nav_bottom_btn" title="Add text to page" type="button"></button> -->
          <i id="add_text_btn" class="fa fa-font fa-2x enableIfNoSelection square_btn nav_bottom_btn" title="Add text to page"></i>
          <!-- <button id="import_data_btn" class="enableIfNoSelection long_btn nav_bottom_btn" title="IMPORT DATA" type="button"></button> -->
        </span>

        <span id="button-group">
          <button id="page_delete_btn" class="square_btn nav_bottom_btn" title="Delete this page" type="button"></button>
       
          <button id="page_add_btn" class="square_btn nav_bottom_btn" title="Add new page" type="button"></button>
          <!-- <button id="save_btn" class="enableIfNoSelection long_btn nav_bottom_btn" title="EXPORT DATA" type="button"></button> -->
        </span>

        <span id="page-group">
          <button id="first_btn" class="page_control_back square_btn nav_bottom_btn" title="First page" type="button"></button>
          <button id="previous_btn" class="page_control_back square_btn nav_bottom_btn" title="Previous page" type="button"></button>
          <span id="styled_select">
            <select name="page_select" id="page_select" title="Go to page" onChange="pageSelect(this);">
            <!-- loop through $pageIDs for values, use 0... for text. -->
            <?php
              $count = 1;
              foreach ($pageIDs as $id) {
              $value = $value * 2;
              echo '<option value="'. $id .'">'. $count .'</option>';
              $count += 1;
            }
            ?>
              <!-- <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option> -->
            </select>
          </span>
          <button id="next_btn" class="page_control_forward square_btn nav_bottom_btn" title="Next page" type="button"></button>
          <button id="last_btn" class="page_control_forward square_btn nav_bottom_btn" title="Last page" type="button"></button>
        </span>

        


      </div>
    </div>
  
    <div id="wrap">

      <div id="sidebar">
        <!-- progress box appears only when upload in progress -->
       <!--  <div class="progressBox"> -->
          <!-- <div id="progress" class="progress">
              <div class="progress-bar progress-bar-success"></div>
          </div>
          <span id="progressText"></span>
        </div> -->
        <!-- these are the text editing options that are appear when text is selected -->
        <div class="textEdit">
          <div class="textEditRow">
            <button id="text_align_left_btn" class="square_btn text_edit_btn" title="Align text left" type="button"></button>
            <button id="text_align_center_btn" class="square_btn text_edit_btn" title="Align text center" type="button"></button>
            <button id="text_align_right_btn" class="square_btn text_edit_btn" title="Align text right" type="button"></button>       
          </div>
          <textarea rows="4" id="textArea">Hi There!</textarea>
          <div class="textEditRowColors">
            <!-- <input type="text" id="text_back" class="color_picker" /> -->
            <select name="fonts" id="fonts" onchange="changeFont()">
              <option value="Anime Ace">Anime Ace</option>
              <option value="Droid Sans Mono">Droid</option>
              <option value="Arial">Arial</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Courier New">Courier New</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
            <input type="text" id="text_fore" class="color_picker" />
          </div>
          <!-- <div class="textEditRowColors">
            <select name="fonts" id="fonts" onchange="changeFont()">
              <option value="Arial">Arial</option>
              <option value="Comic Sans MS">Comic Sans</option>
              <option value="Courier New">Courier New</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div> -->
        </div> <!-- end textEdit -->

        <!-- <input id="fileupload" type="file" name="files[]" data-url="my_assets" multiple> -->
        <input id="fileupload" type="file" value="what" name="files[]" style="margin: 0 0 10 0" data-url="server/php/" multiple>

        <div id="tabs">
          <ul>
            <?php
              while($row = $categories->fetch_assoc()) {
                echo '<li><a href="load-library.php?id=' . $row['id'] . '">' . $row['name'] . '</a></li>';
              }
            ?>
          </ul>
        </div>

        <div id="overlays">
          <?php foreach ($overlays as $overlay_url) { ?>
          <span id="overlay-item">
            <img src=<?php echo $overlay_url ?> onClick="loadOverlay('<?php echo $overlay_url ?>');" height="80">
          </span>
          <?php } ?>


          <!-- <span id="overlay-item">
            <img src="overlays/overlay1.png" onClick="loadOverlay('overlays/overlay1.png');" height="80">
          </span>
          <span id="overlay-item">
            <img src="overlays/overlay2.png" onClick="loadOverlay('overlays/overlay2.png');" height="80">
          </span>
          <span id="overlay-item">
            <img src="overlays/overlay0.png" onClick="loadOverlay('overlays/overlay0.png');" height="80">
          </span> -->
        </div>
        
      </div>
      <div id="canvasBox">

        <canvas id="c" width="750" height="950">
          fuck yo couch.
        </canvas>
        <div id="loader" title="7">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
            <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
              <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
            </rect>
            <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
              <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
            </rect>
            <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
              <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
            </rect>
          </svg>
        </div>
      </div>

    </div>

    <div id="dialog-confirm" title="Save changes?">
      <p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>Save changes before leaving page?</p>
    </div>
    <!-- <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script> -->
    <!-- <script src="js/vendor/jquery.ui.widget.js"></script> -->
    <script src="js/load-image.all.min.js"></script>
    <!-- The Canvas to Blob plugin is included for image resizing functionality -->
    <script src="js/canvas-to-blob.min.js"></script>
    <!-- The Iframe Transport is required for browsers without support for XHR file uploads -->

    <script src="js/vendor/jquery.ui.widget.js"></script>
    <script src="js/jquery.iframe-transport.js"></script>
    
    <script src="js/jquery.fileupload.js"></script>
    <script src="js/jquery.fileupload-process.js"></script>
    <script src="js/jquery.fileupload-image.js"></script>
    <script>

    $(document).bind('drop dragover', function (e) {
        // Prevent the default browser drop action:
        e.preventDefault();
    });

    $(function () {
        // $( "#tabs" ).tabs({ active: 0 });
        $('#fileupload').fileupload({
            dataType: 'json',
            // previewMinWidth: 105,
            // previewMinHeight: 105,
            disableExifThumbnail: true,
            previewThumbnail: false,
            // disableImageResize: /Android(?!.*Chrome)|Opera/
            //   .test(window.navigator.userAgent),
            // imageForceResize: true,
            // imageMaxWidth: 300,
            // imageMaxHeight: 300,
            // imageCrop: true, // Force cropped images
            // previewMinWidth: 105,
            // previewMinHeight: 105,
            // 'option',
            // {
            //     previewMaxWidth: 105,
            //     previewMaxHeight: 105
            // }
            //previewMaxWidth: 105,
            //previewMaxHeight: 105,
            done: function (e, data) {
                $('.progress').css(
                    'visibility',
                    'hidden'
                );
                // opens library tab at index 5, "My Assets"
                // $( "#tabs" ).tabs({ active: 5 });
                $.each(data.result.files, function (index, file) {
                  console.log("FINISHED UPLOAD");
                  console.log("index" + index);
                  console.log("file" + file);
                  writeUploadedFileToDB(urlToFilename(file.url), urlToFilename(file.thumbnailUrl));
                  // writeUploadedFileToDB("image,jpg", "thumbnail.jpg");
                  
                  // file properties
                  // name _RED7481_web.jpg
                  // size 175864
                  // type image/jpeg
                  // url http://localhost:8888/storyboarder/server/php/files/_RED7481_web.jpg
                  // thumbnailUrl http://localhost:8888/storyboarder/server/php/files/thumbnail/_RED7481_web.jpg
                    // $('<p/>').text(file.name).appendTo(document.body);
                    // $("#progressText").text("Uploaded" + file.name);
                    //$('<p/>').text(file.name).appendTo('#files');
                //     $('#progress .progress-bar').css(
                //     'width',
                //     '0'
                // );
                });
            },
            start: function () {
                // $(".progress").show();
                $('.progress').css(
                    'visibility',
                    'visible'
                );
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            }
        });
    });

    function urlToFilename(url) {
      console.log("URL: " + url)
      var toArray = url.split("/");
      return toArray[toArray.length-1];
    }
    </script>
    


  </body>
</html>