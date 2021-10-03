<?php

  if (isset($rest, $progress)) {

    echo filesize($script_path . $progress) * 100 / $_SESSION['dload_size'];
    clearstatcache();

    die;
  }

?>
