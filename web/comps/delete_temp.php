<?php

$dir = $script_path . "temp/";


foreach (glob($dir."*") as $file) {

if(time() - filectime($file) > 86400){
    unlink($file);
    }

}

?>
