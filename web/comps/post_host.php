<?php
if (isset($rest, $host)) {

  $ftp = ftp_connect($host);
  if ($ftp) {
    $_SESSION['host'] = $host;
  }
  else {
    $_SESSION['host'] = null;
  }

  echo $_SESSION['host'] ? '' : 'Can\'t connect.';
  die;

}
?>
