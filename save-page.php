<?php require_once("connection.php"); ?>

<?php
// $pageData = $_POST["canvasData"];
$pageData = $_POST['canvasString'];
$pageID = $_POST['pageID'];

//$query = "INSERT INTO pages (content) VALUES ('" . $pageData . "')";
$query = "UPDATE pages SET content='" . $pageData . "' WHERE id='" . $pageID . "';";

// UPDATE Customers
// SET ContactName='Alfred Schmidt', City='Hamburg'
// WHERE CustomerName='Alfreds Futterkiste';


if ($mysqli->query($query) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $query . "<br>" . $mysqli->error;
}

$mysqli->close();

// $result = $mysqli->query($query);

// if($result) {
//       echo 'page data:' + $pageData;
//       $mysqli->close(); //close db connection
//     } else {
//       header('HTTP/1.1 500 Could not save record!');
//       exit();
//     }

?>
