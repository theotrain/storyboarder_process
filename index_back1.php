<html>
  <head>
    <script src="js/jquery-1.11.2.min.js"></script>
    <script src="js/tools.js"></script>
    <script src="js/drag-drop-resize.js"></script>
    <script src="js/tabs.js"></script>
    

    <link href="js/jquery-ui-custom/jquery-ui.css" rel="stylesheet">
    <script src="js/jquery-ui-custom/external/jquery/jquery.js"></script>
    <script src="js/jquery-ui-custom/jquery-ui.js"></script>

    <link rel="stylesheet" type="text/css" href="css/mystyle.css">
    <link rel="stylesheet" type="text/css" href="css/resize.css">
    <link rel="stylesheet" type="text/css" href="css/reset.css">

    <script>

    // $(function(){
    //   thumbToImageUrl("gotoMyplace_thumb.jpg");
    // });

    $( document ).tooltip({
      position: { my: "left+15 center", at: "right bottom" }
    });

    function printMe()
    {
      w=window.open();
      w.document.write($('#dropHere').html());
      // w.print();
      // w.close(); 
    } 
    </script>

    <?php require("connection.php"); ?>
    <?php
      $query = "SELECT id, name FROM categories";
      $categories = $mysqli->query($query);
    ?>
  </head>
  <body>

    
    <div id="nav-top-full-width">
      <div id="nav-top">
        title and nav
      </div>
    </div>
    <div id="nav-bottom-full-width">
      <div id="nav-bottom">
        tool area
      </div>
    </div>
  
    <div id="wrap">

      <div id="sidebar">
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

      <div id="main">
        <!-- <img src="layouts/layout1.gif"> -->
      </div>

    </div>
    

  </body>
</html>