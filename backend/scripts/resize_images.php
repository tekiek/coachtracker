<?php

require '../includes/simpleImage.php';
ini_set('display_errors',1);  
error_reporting(E_ALL);

$dir_path = '../../images/students/';
$files_all = scandir($dir_path);
$files_remove = array('..', '.', 'default.jpg');
$files_clean = array_diff($files_all, $files_remove);

foreach($files_clean as $file) {
	if (strpos($file, '.png') === false && strpos($file, '.jpg') === false) {
		
	} else {
		$image = new SimpleImage(); 
		$image->load($dir_path . $file); 
		$image->resizeToHeight(180);
		$image->save($dir_path . $file);
	}
}


echo "<br>SCRIPT END;"

?>