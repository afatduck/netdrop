<?php

  if (isset($rest, $filepath) and $_SESSION['host'] and $_SESSION['user'] and $_SESSION['pword']) {

    $ftp = ftp_connect($_SESSION['host'], 21, 10);
    $valid = @ftp_login($ftp, $_SESSION['user'], $_SESSION['pword']);

    if ($valid) {

      $fname = 'temp/' . gettimeofday()['sec'] . substr($filepath, strpos($filepath, '/') + 1);
      $local_filename = $script_path . $fname;

      fopen($local_filename, 'w');

      $dload = ftp_nb_get(
        $ftp,
        $local_filename,
        $filepath,
        FTP_BINARY
      );

      $_SESSION['dload_size'] = ftp_size($ftp, $filepath);

      $toReturn = $dload ?
      array('url' => $fname, 'mime' => mime_content_type($local_filename))
      :
      'Failed to get file.';

    }
    else {
      $toReturn = array('error' => 'Connection failed.');
    }

    echo json_encode($toReturn);
    if ($dload) {
      session_write_close();
      while ($dload == FTP_MOREDATA) {
        $dload = ftp_nb_continue($ftp);
      }
    }
    die;
  }

?>
