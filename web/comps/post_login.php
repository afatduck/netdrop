<?php

  if (isset($rest, $user) and $_SESSION['host']) {

    $ftp = ftp_connect($_SESSION['host']);
    $valid = @ftp_login($ftp, $user, $pword);

    if ($valid) {
      $toReturn = ftp_mlsd($ftp, '.');
      array_shift($toReturn);
      array_shift($toReturn);
      $_SESSION['user'] = $user;
      $_SESSION['pword'] = $pword;
    }
    else {
      $toReturn = 'Username or password incorrect.';
      $_SESSION['user'] = '';
      $_SESSION['pword'] = '';
    }

    echo json_encode($toReturn);
    die;
  }

?>
