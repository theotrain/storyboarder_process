<?php require_once("connection.php"); ?>

<?php

// $bookID = $_GET['bookID'];
// echo $bookID;

$query = "SELECT thumbnail, id FROM pages WHERE book_id = " . $_GET['bookID'] . " ORDER BY order_index;";

$result = $mysqli->query($query);

//$row = mysql_fetch_assoc($result);

// if ($result->num_rows > 0) {
//   echo "wiener!";
// } else {
//   echo "errrrr";
// }

// if ($result->num_rows > 0) {
//   // output data of each row
//   $order = array();
//   echo "<div id='thumb-modal-label'>";
//   echo "Drag and drop to reorder pages";
//   echo "</div>";
//   echo "<ul id='thumb-container-modal'>";
//   while($row = $result->fetch_assoc()) {
//     echo "<li id='ID_" . $row['id'] . "' class='thumb-modal'>";
//     echo "<img src='" . $row['thumbnail'] . "'>";
//     echo "</li>";
//     $order[] = $row['id'];
//   }
//   echo "</ul>";
// } else {
//     echo "No pages could be found!";
// }

//get timestamp in seconds, load like thumbnail.jpg?t=123123123
//to avoid cached page thumbnails
$date = new DateTime();
$timeInSeconds = $date->getTimestamp();

if ($result->num_rows > 0) {
  // output data of each row
  $order = array();
  echo "<div id='thumb-modal-label'>";
  echo "Drag and drop to reorder pages";
  echo "</div>";
  echo "<div id='thumb-container-modal'>";
  while($row = $result->fetch_assoc()) {
    echo "<span id='ID_" . $row['id'] . "' class='thumb-modal'>";
    echo "<img src='" . $row['thumbnail'] . "?t=" . $timeInSeconds . "'>";
    echo "</span>";
    $order[] = $row['id'];
  }
  echo "</div>";
} else {
    echo "No pages could be found!";
}

// <div id="thumb-container">
// <span id="thumb">

// </span>
// </div>



?>

<!-- 1) grab thumbnails for all pages in current book in display order
2) output single div container
3) with thumbnails in a column inside

4) size width? check overflow, make it scroll -->
