<?php require_once("connection.php"); ?>

<?php

//$pageData = $_POST['canvasString'];

// $query = "SELECT content FROM pages WHERE id = " . $_POST['bookID'] . " LIMIT 1;";

// SELECT * FROM `comments` ORDER BY `popularity` DESC LIMIT 1

$query = "SELECT order_index AS max_order_index FROM pages WHERE book_id = " . $_POST['bookID'] . " ORDER BY order_index DESC LIMIT 1";

//$query = "SELECT MAX(order_index) AS max_order_index FROM pages WHERE book_id = " . $_POST['bookID'];
$result = $mysqli->query($query);
$row = mysqli_fetch_assoc($result);
$max_id = $row['max_order_index'] + 100;
//echo $max_order;
//echo $_POST['bookID'];

// if ($row) {
//   //echo $max_order;
//   //echo "no errors";
//   echo "the query: " . $query;
//   echo "max index was: " . $row['max_order_index'];
  
// } else {
//   //echo "Error: " . $query . "--> " . $mysqli->error;
//   echo "<p>There was an error in query: $query</p>";
//   echo $mysqli->error;
//   //echo $row;
// }
// INSERT INTO pages (book_id, order_index, content)
// VALUES (value1, value2, value3,...)

$query = "INSERT INTO pages (book_id, order_index, content) VALUES (" . $_POST['bookID'] . "," . $max_id . " , '{}')";
$result = $mysqli->query($query);

//$row2 = mysql_fetch_assoc($result);

// if ($result->num_rows > 0) {
//   echo "wiener!";
// } else {
//   echo "errrrr";
// }

// if ($result->num_rows > 0) {
//   // output data of each row
//   while($row = $result->fetch_assoc()) {
//     echo $row["content"];
//   }
// } else {
//     echo "0 results";
// }

if ($result) {
  //echo $max_order;
  echo $mysqli->insert_id;
} else {
  echo "Error: " . $query . "--> " . $mysqli->error;
  //echo $query;
}


$mysqli->close();
//echo json_encode($array);
//echo $result;

?>
