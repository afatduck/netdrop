<?php
session_start();
extract($_POST);
if (isset($reset)) {

  session_unset();
  session_destroy();

}

$script_path = '/home/pgsrihr/public_html/2022/~patrikm/public_html/netdrop/';

require 'comps/post_host.php';
require 'comps/post_login.php';
require 'comps/post_path.php';
require 'comps/post_file.php';
require 'comps/download_progress.php';

?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Netdrop</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.10.2/umd/popper.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/redux/4.1.1/redux.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-redux/7.2.5/react-redux.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="static/netdrop.min.js" charset="utf-8"></script>
    <script>
    if ( window.history.replaceState ) {
        window.history.replaceState( null, null, window.location.href );
    }
    host = '<?php echo $_SESSION['host'] ?>';
    user = '<?php echo $_SESSION['user'] ?>';
    pword = '<?php echo $_SESSION['pword'] ?>';
    </script>
  </head>
  <body>
    <div class="container-fluid p-4" id="root">
    </div>
  </body>
</html>

<?php
  require('comps/delete_temp.php')
?>
