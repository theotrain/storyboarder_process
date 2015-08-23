<div class='panel'>

<?php require_once("connection.php"); ?>

<?php

// function filename_to_thumbnail($filename) { 
//   $withoutExt = preg_replace('/\\.[^.\\s]{2,4}$/', '', $filename);
//   return $withoutExt . "-thumb.svg";
// }

// echo 'The id is: ' . htmlspecialchars($_GET["id"]) . '<br />';

$query = "SELECT thumbnail,filename,description FROM images ";
//$query .= "WHERE category_id = 1";
$query .= "WHERE category_id = " . $_GET["id"];

$result = $mysqli->query($query);
// $row = $result->fetch_assoc();

while($row = $result->fetch_assoc()) {

  // echo '<div id="thumb" class="dragImg">';
  // echo '<img class="img" src="'.ASSET_PATH.filename_to_thumbnail($row['filename']).'">';
  echo '<div id="thumb">';
  echo '<img class="dragImg" filename="'.$row['filename'].'" title="'.$row['description'].'" src="'.ASSET_PATH.$row['thumbnail'].'">';
  echo '</div>';
}

?>

</div>

<script>
  setup_drag_drop_thumbs();
</script>