<?php require_once("connection.php"); ?>

<?php
//save file
$thumbnail = $_POST['imgBase64'];
//for png
//$thumbnail = str_replace('data:image/png;base64,', '', $thumbnail);

//for jpeg
$thumbnail = str_replace('data:image/jpeg;base64,', '', $thumbnail);
$thumbnail = str_replace(' ', '+', $thumbnail);

$thumbnail = base64_decode($thumbnail);
//$thumbnail = $_POST['imgBase64'];

//$thumbnail = imagecreatefromstring($thumbnail);
file_put_contents('thumbnails/thumb-'. $_POST['pageID'] .'.jpg', $thumbnail);
//file_put_contents('../thumbnails/testes.jpg', $thumbnail);
//file_put_contents('testes.jpeg', $thumbnail);


// $pageData = mysql_escape_string($_POST['canvasString']);
// $pageID = $_POST['pageID'];
// $query = "UPDATE pages SET content='" . $pageData . "' WHERE id='" . $pageID . "';";


// if ($mysqli->query($query) === TRUE) {
//     echo "New record created successfully";
// } else {
//     echo "Error: " . $query . "<br>" . $mysqli->error;
// }

// $mysqli->close();



?>
