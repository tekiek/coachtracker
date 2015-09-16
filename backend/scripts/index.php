<?php
require '../common.php';
lock();

$dir_path = root_dir() . '/backend/scripts';
$files_all = scandir($dir_path);
$files_remove = array('..', '.', 'index.php');
$files_clean = array_diff($files_all, $files_remove);

// Sort times
$file_times = array();
foreach($files_clean as $file) {
	array_push($file_times, filemtime($file));
	// echo date ("F d Y", filemtime($file)) . ": ";

}

sort($file_times);
echo "<br><br>";
foreach($file_times as $time) {
//	foreach($files_clean as $file) {
		if (filemtime($file) == $time) {
			echo date ("m-d-Y", $time) . " : ";
			echo "<a href='" . $file . "'>" . $file . "</a>";
			echo "<br>";
		}
//	}
}
?>