<?php
require_once("constants.php");

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);


if($mysqli->connect_errno > 0){
    die('Unable to connect to database [' . $mysqli->connect_error . ']');
}

?>
