<?php
/**
 * A simple, clean and secure PHP Login Script / MINIMAL VERSION
 * For more versions (one-file, advanced, framework-like) visit http://www.php-login.net
 *
 * Uses PHP SESSIONS, modern password-hashing and salting and gives the basic functions a proper login system needs.
 *
 * @author Panique
 * @link https://github.com/panique/php-login-minimal/
 * @license http://opensource.org/licenses/MIT MIT License
 */
// checking for minimum PHP version
if (version_compare(PHP_VERSION, '5.3.7', '<')) {
    exit("Sorry, Simple PHP Login does not run on a PHP version smaller than 5.3.7 !");
} else if (version_compare(PHP_VERSION, '5.5.0', '<')) {
    // if you are using PHP 5.3 or PHP 5.4 you have to include the password_api_compatibility_library.php
    // (this library adds the PHP 5.5 password hashing functions to older versions of PHP)
    require_once("libraries/password_compatibility_library.php");
}
// include the configs / constants for the database connection
require_once("connection.php");
// load the login class
require_once("classes/Login.php");
// create a login object. when this object is created, it will do all login/logout stuff automatically
// so this single line handles the entire login process. in consequence, you can simply ...
$login = new Login();
// ... ask if we are logged in here:
if ($login->isUserLoggedIn() == true) {
    if (isset($_POST["book_name"])) {
        // echo $_POST["book_name"];
        if ((!empty($_POST["book_name"])) && preg_match('/^[A-Za-z][A-Za-z0-9 -]*$/', $_POST["book_name"])){
            //submit name
            $query = "INSERT INTO books (name, user_id) VALUES('$_POST[book_name]', '$_SESSION[user_id]')";
            $books = $mysqli->query($query);
            $insert_id = $mysqli->insert_id;

            $query2 = "INSERT INTO pages (book_id, content) VALUES('$insert_id', '{}')";
            $page = $mysqli->query($query2);
            // {"objects":[],"background":""}
            // echo $_POST["book_name"] . " is a legit name";
            header( 'Location: storyboarder.php?id=' . $insert_id ) ;
            // header( 'Location: storyboarder.php?id=' . $mysqli->insert_id ) ;
        } else {
            //create error
            $name_err = "Alphanumeric characters, spaces, and hyphens only";
        }
    }
    // get book info for this user
    $query = "SELECT id, name FROM books WHERE user_id = '$_SESSION[user_id]' ORDER BY date_created DESC";
    $books = $mysqli->query($query);

    include("views/choose_book.php");

} else {
    // the user is not logged in. you can do whatever you want here.
    // for demonstration purposes, we simply show the "you are not logged in" view.
    include("views/not_logged_in.php");
}

?>