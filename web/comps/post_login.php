<?php

  if (isset($rest, $user) and $_SESSION['host']) {
    $ftp = ftp_connect($_SESSION['host']);
    $valid = @ftp_login($ftp, $user, $pword);
    echo $valid ? 1 : 0;
    die;
  }

?>
