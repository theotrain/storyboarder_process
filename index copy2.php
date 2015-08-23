<html>
  <head>
    <script src="js/jquery-1.11.2.min.js"></script>
    <script src="js/tools.js"></script>
    <script src="js/drag-drop-resize.js"></script>
    <script src="js/tabs.js"></script>
    <script src="lib/easeljs-0.8.1.min.js"></script>

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

    var stage;
    var logo;
    // var tix = 0;

    function init() {
      stage = new createjs.Stage(document.getElementById("canvas"));
      logo = new createjs.Bitmap("assets/Lego-Batman-3.jpeg");
      logo.onload = setLogoReg;
      
      stage.addChild(logo);

      createjs.Ticker.setFPS(60);
      createjs.Ticker.addEventListener("tick", tick);
    }
    function setLogoReg(event) {
      logo.regX = logo.image.width * 0.5;
      logo.regY = logo.image.height * 0.5;
    }

    function tick() {
      // tix = tix + 1;
      // if (tix%60 == 0) {
      //   console.log(logo.image.width);
      // }
      logo.x += (stage.mouseX - logo.x) * 0.1;
      logo.y += (stage.mouseY - logo.y) * 0.1;
      stage.update();
    }

    </script>

    <?php require("connection.php"); ?>
    <?php
      $query = "SELECT id, name FROM categories";
      $categories = $mysqli->query($query);
    ?>
  </head>
  <body onload="init()">

    
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

      <canvas id="canvas" width="750" height="950">
        fuck yo couch.
      </canvas>

    </div>
    

  </body>
</html>