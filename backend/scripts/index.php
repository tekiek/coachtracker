<?php
require '../common.php';
lock();

$dir_path = root_dir() . '/backend/scripts';
$files_all = scandir($dir_path);
$files_remove = array('..', '.', 'index.php');
$files_clean = array_diff($files_all, $files_remove);

foreach($files_clean as $file) {
	echo date ("F d Y", filemtime($file)) . ": ";
	echo "<a href='" . $file . "'>" . $file . "</a>";
	echo "<br>";
}
?>