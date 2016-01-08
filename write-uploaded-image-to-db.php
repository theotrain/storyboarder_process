<?php require_once("connection.php"); ?>

<?php

//$_POST['imageUrl'];
//$_POST['thumbnailUrl'];

// $query = "SELECT content FROM pages WHERE id = " . $_POST['loadPageID'] . " LIMIT 1;";

// $sql = "INSERT INTO MyGuests (firstname, lastname, email)
// VALUES ('John', 'Doe', 'john@example.com')";

// if ($conn->query($sql) === TRUE) {
//     echo "New record created successfully";
// } else {
//     echo "Error: " . $sql . "<br>" . $conn->error;
// }


$query = "INSERT INTO images (filename, thumbnail, category_id)
VALUES ('{$_POST['imageUrl']}', '{$_POST['thumbnailUrl']}', 6)";

// id filename thumbnail description category_id

//$query = "SELECT content FROM pages WHERE id = 8 LIMIT 1;";

if ($mysqli->query($query) === TRUE) {
    echo "saved record successfully";
} else {
    echo "Error: " . $query . ": -----> " . $mysqli->error;
    //echo "Error: " . $query . ": -----> " . mysqli_error($mysqli);
}
// $mysqli->query($query);
//$result = $mysqli->query($query);

//$row = mysql_fetch_assoc($result);

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
//echo "do i get this shit back?";
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
