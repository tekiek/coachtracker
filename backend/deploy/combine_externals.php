<?php
	foreach ($combine_file_list as &$file_list) {
		$file_path = root_dir() . $file_list['path'];
		$min_file = $file_path . $file_list['min'][0];
		$isCss = strpos($min_file, ".css") >0 ? true: false;
		$out = fopen($min_file, "w");
		
		foreach($file_list['list'] as $file){
			$in = fopen($file_path . $file, "r");
			while ($line = fgets($in)) {
				if ($isCss) {
					$line = str_replace(': ', ':', $line);
					$line = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $line);
				}
				fwrite($out, $line);
			}
			if (!$isCss) fwrite($out, "\n");
			fclose($in);
		}
		fclose($out);
		echo "File Created: " . $min_file . "<br>";
	}	
?>