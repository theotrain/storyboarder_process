<html>
  <head>
    <style>
    body {
        background-color: blue;
    }

    h1 {
        color: maroon;
        margin-left: 40px;
    } 
    #mask {
      /*width: 240px; 
      height: 240px; */

      overflow: hidden; 
      background-color: yellow;
      display:inline-block;
    }
    #inner {
      margin-top: 100px;
      margin-left: 200px;
    }
    </style>
  </head>
  <body>
    <span id="mask">
      <div id="inner">
        <img src="images/blob.svg">
      </div>
    </span>
  </body>

</html>