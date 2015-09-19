<?php require_once("connection.php"); ?>

<?php

//$pageData = $_POST['canvasString'];

// $query = "SELECT content FROM pages WHERE id = " . $_POST['bookID'] . " LIMIT 1;";

// SELECT * FROM `comments` ORDER BY `popularity` DESC LIMIT 1

//$query = "SELECT order_index AS max_order_index FROM pages WHERE book_id = " . $_POST['bookID'] . " ORDER BY order_index DESC LIMIT 1";

$query = "DELETE FROM pages WHERE id = " . $_POST['pageID'];

//$query = "SELECT MAX(order_index) AS max_order_index FROM pages WHERE book_id = " . $_POST['bookID'];
$result = $mysqli->query($query);


if (!$result) {
  echo "Error: " . $query . "--> " . $mysqli->error;
  //echo $query;
}

$mysqli->close();
//echo json_encode($array);
//echo $result;

?>
