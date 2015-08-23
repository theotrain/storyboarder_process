<?php require_once("connection.php"); ?>

<?php

//$pageData = $_POST['canvasString'];

$query = "SELECT content FROM pages WHERE id = 8 LIMIT 1;";

// if ($mysqli->query($query) === TRUE) {
//     echo "New record created successfully";
// } else {
//     echo "Error: " . $query . ": -----> " . $mysqli->error;
//     //echo "Error: " . $query . ": -----> " . mysqli_error($mysqli);
// }

$result = $mysqli->query($query);

//$row = mysql_fetch_assoc($result);

// if ($result->num_rows > 0) {
//   echo "wiener!";
// } else {
//   echo "errrrr";
// }

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo $row["content"];
  }
} else {
    echo "0 results";
}

// if ($result === TRUE) {
//   echo "record retrieved successfully";
// } else {
//   //echo "Error: " . $query . "--> " . $mysqli->error;
//   echo $result;
// }


$mysqli->close();
//echo json_encode($array);
//echo $result;

?>
