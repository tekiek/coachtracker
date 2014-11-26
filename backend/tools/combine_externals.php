<?php
	require '../common.php';

	foreach ($combine_file_list as &$file_list) {
		$file_path = root_dir() . $file_list['path'];
		$min_file = $file_path . $file_list['min'][0];
		$out = fopen($min_file, "w");
		
		foreach($file_list['list'] as $file){
			$in = fopen($file_path . $file, "r");
			while ($line = fgets($in)) {
				fwrite($out, $line);
			}
			fwrite($out, "\n");
			fclose($in);
		}
		fclose($out);
		echo "File Created: " . $min_file . "<br>";
	}
?>