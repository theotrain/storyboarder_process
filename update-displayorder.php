<?php
require_once("connection.php");
$newOrder = $_POST['ID'];
$counter = 1;

foreach ($newOrder as $recordIDValue) {
  $query = "UPDATE pages SET order_index = " . $counter;  
  $query .= " WHERE id = " . (int)$recordIDValue;
  $mysqli->query($query) or die('Error, insert query failed');
  $counter ++;
}

  //$result = $mysqli->query($query);

echo 'Changes saved.';
?>