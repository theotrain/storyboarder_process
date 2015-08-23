<?php
// show potential errors / feedback (from login object)
if (isset($login)) {
    if ($login->errors) {
        foreach ($login->errors as $error) {
            echo $error;
        }
    }
    if ($login->messages) {
        foreach ($login->messages as $message) {
            echo $message;
        }
    }
}
?>

<link rel="stylesheet" type="text/css" href="css/login.css">

<!-- login form box -->
<form class="login-form" method="post" action="index.php" name="loginform">

    <!-- <label for="login_input_username">Username</label> -->
    <input id="login_input_username" class="login_input" type="text" placeholder="Username" name="user_name" required />

    <!-- <label for="login_input_password">Password</label> -->
    <input id="login_input_password" class="login_input" type="password" placeholder="Password" name="user_password" autocomplete="off" required />

    <input type="submit"  name="login" value="Log in" />
    <a href="register.php">Register new user</a>
</form>



<!-- 

<div class="stand">
  <div class="outer-screen">
    <div class="inner-screen">
      <div class="form">
        <input type="text" class="zocial-dribbble" placeholder="Enter your email" />
        <input type="text" placeholder="Password" />
         <input type="submit" value="Login" />
        <a href="">Lost your password?</a>
      </div> 
    </div> 
  </div> 
</div>
 -->