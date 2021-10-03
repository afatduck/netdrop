<?php
if (isset($rest, $host)) {

  if ($_SESSION['host'] != $host) {
    $_SESSION['user'] = '';
    $_SESSION['pword'] = '';
  }

  $ftp = ftp_connect($host, 21, 10);
  if ($ftp) {
    $_SESSION['host'] = $host;
  }
  else {
    $_SESSION['host'] = null;
  }

  echo $ftp ? '' : 'Can\'t connect.';
  die;

}
?>
