<link rel="stylesheet" type="text/css" href="css/login.css">

<!-- login form box -->
<div class="book-page-box-outer">
  <div class="book-page-box-inner">

   <form class="new-book" method="post" name="new-book-form">
        <h1>Create a New Book</h1>
        <!-- <label for="login_input_username">Username</label> -->
        <input id="book_name" class="login_input" type="text" placeholder="Book name" name="book_name" maxlength="99" required />
        <?php if ($name_err != NULL) { 
          echo '<div id="error">' . $name_err . '</div>';
         } ?>
        <input type="submit"  name="create" value="Create Book" />
    </form>
    <?php if ($books->num_rows > 0) { ?> 
    <div class="choose-book">
        <h1>Select a Book</h1>
        <?php while($row = $books->fetch_assoc()) {
          echo '<div id="book-list"><a href="storyboarder.php?id=' . $row['id'] . '">' . $row['name'] . '</a></div>';
        } ?>
    </div>
    <?php } ?>
  </div>
</div>