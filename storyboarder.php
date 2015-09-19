<?php
  require("connection.php");
  $gtfo = false;
  session_start();
  if (($_GET['id'] == null) or (!isset($_SESSION['user_id']))){
    $gtfo = true;
  }
?>
<?php
  $query = "SELECT id FROM books WHERE id = '$_GET[id]' AND user_id = '$_SESSION[user_id]'";
  $user_owns_book = $mysqli->query($query);
  if(mysqli_num_rows($user_owns_book)==0){
    $gtfo = true;
  }
  if ($gtfo) {
    header('Location: index.php') ;
    exit;
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
    <script src="js/drag-drop-resize.js"></script>
    <script src="js/tabs.js"></script>
    <script src="js/work-area.js"></script>

    <script src="lib/easeljs-0.8.1.min.js"></script>
    <script src="lib/preloadjs-0.6.1.min.js"></script>
    <script src="lib/fabric.min.js"></script>

    <script src="js/jquery-ui-custom/external/jquery/jquery.js"></script>
    <script src="js/jquery-ui-custom/jquery-ui.js"></script>

    <link href="js/jquery-ui-custom/jquery-ui.css" rel="stylesheet">
    
    <link rel="stylesheet" type="text/css" href="css/resize.css">
    <link rel="stylesheet" type="text/css" href="css/reset.css">
    <link rel="stylesheet" href="css/spectrum.css" />
    <link rel="stylesheet" type="text/css" href="css/mystyle.css">

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

    
    <div id="nav-top-full-width">
      <div class="nav-top">
        <!-- title and nav -->
      </div>
    </div>
    <div id="nav-bottom-full-width">
      <div class="nav-bottom">
        <span id="button-group">
          <button id="save_btn" class="enableIfNoSelection square_btn nav_bottom_btn" title="Save page" type="button"></button>
        </span>
        <span id="button-group">
          <button id="undo_btn" class="enableIfUndo square_btn nav_bottom_btn" title="Undo" type="button"></button>
          <button id="redo_btn" class="enableIfRedo square_btn nav_bottom_btn" title="Redo" type="button"></button>
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
          <button id="delete_btn" class="enableIfGroupSelection square_btn nav_bottom_btn" title="Delete selection" type="button"></button>
        </span>
        <span id="button-group">
          <button id="add_text_btn" class="enableIfNoSelection long_btn nav_bottom_btn" title="Add text to page" type="button"></button>
          <!-- <button id="save_btn" class="enableIfNoSelection long_btn nav_bottom_btn" title="EXPORT DATA" type="button"></button> -->
          <button id="import_data_btn" class="enableIfNoSelection long_btn nav_bottom_btn" title="IMPORT DATA" type="button"></button>
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
        <!-- these are the text editing options that are hidden by default -->
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
        </div>

        <div id="tabs">
          <ul>
            <?php
              while($row = $categories->fetch_assoc()) {
                echo '<li><a href="load-library.php?id=' . $row['id'] . '">' . $row['name'] . '</a></li>';
              }
            ?>
          </ul>
        </div>
      </div>

      <canvas id="c" width="750" height="950">
        fuck yo couch.
      </canvas>

    </div>
    

  </body>
</html>