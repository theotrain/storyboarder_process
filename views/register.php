<?php
// show potential errors / feedback (from registration object)
if (isset($registration)) {
    if ($registration->errors) {
        foreach ($registration->errors as $error) {
            echo $error;
        }
    }
    if ($registration->messages) {
        foreach ($registration->messages as $message) {
            echo $message;
        }
    }
}
?>

<link rel="stylesheet" type="text/css" href="css/login.css">

<!-- register form -->
<form method="post" class="register-form" action="register.php" name="registerform">

    <!-- the user name input field uses a HTML5 pattern check -->
    <!-- <label for="login_input_username">Username (only letters and numbers, 2 to 64 characters)</label> -->
    <input id="login_input_username" placeholder="Username" class="login_input" type="text" pattern="[a-zA-Z0-9]{2,64}" name="user_name" required />

    <!-- the email input field uses a HTML5 email type check -->
    <!-- <label for="login_input_email">User's email</label> -->
    <input id="login_input_email" placeholder="Email" class="login_input" type="email" name="user_email" required />

    <!-- <label for="login_input_password_new">Password (min. 6 characters)</label> -->
    <input id="login_input_password_new" placeholder="Password (min. 6 letters &amp; numbers)" class="login_input" type="password" name="user_password_new" pattern=".{6,}" required autocomplete="off" />

    <!-- <label for="login_input_password_repeat">Repeat password</label> -->
    <input id="login_input_password_repeat" placeholder="Repeat Password" class="login_input" type="password" name="user_password_repeat" pattern=".{6,}" required autocomplete="off" />
    <input type="submit"  name="register" value="Register" />

    <a href="index.php">Back to Login Page</a>
</form>

<!-- backlink -->


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
