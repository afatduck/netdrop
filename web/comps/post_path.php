<?php

  if (isset($rest, $path) and $_SESSION['host'] and $_SESSION['user'] and $_SESSION['pword']) {

    $ftp = ftp_connect($_SESSION['host'], 21, 10);
    $valid = @ftp_login($ftp, $_SESSION['user'], $_SESSION['pword']);

    if ($valid) {
      $toReturn = ftp_mlsd($ftp, $path);
      array_shift($toReturn);
      array_shift($toReturn);
    }
    else {
      $toReturn = 'Something went wrong.';
    }

    echo json_encode($toReturn);
    die;
  }

?>
