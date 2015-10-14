<?php require_once("connection.php"); ?>

<?php
// $canvasString arrives URI encoded to keep text characters escaped.
//$pageData = urldecode($_POST['canvasString']);

$thumbnail = $_POST['imgBase64'];
//for png
//$thumbnail = str_replace('data:image/png;base64,', '', $thumbnail);

//for jpeg
$thumbnail = str_replace('data:image/jpeg;base64,', '', $thumbnail);
$thumbnail = str_replace(' ', '+', $thumbnail);

$thumbnail = base64_decode($thumbnail);
//$thumbnail = $_POST['imgBase64'];

$thumbURL = 'thumbnails/thumb-'. $_POST['pageID'] .'.jpg';
//$thumbnail = imagecreatefromstring($thumbnail);
file_put_contents($thumbURL, $thumbnail);

//------------------

$pageData = mysql_escape_string($_POST['canvasString']);
$pageID = $_POST['pageID'];

//$query = "INSERT INTO pages (content) VALUES ('" . $pageData . "')";
$query = "UPDATE pages SET content='" . $pageData . "', thumbnail='" . $thumbURL . "' WHERE id='" . $pageID . "';";

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
