<?php
	$file_path = root_dir() . "mycache.manifest";
	$out = fopen($file_path, "w");
	
	
	$manifest = "CACHE MANIFEST\n";
	$manifest .= "# " . date("Y.m.d.h.i") . "\n\n";
	
	$manifest .= "index.php\n";
	foreach ($combine_file_list as &$file_list) {
		$min_file = $file_list['path'] . $file_list['min'][0];
		$version = filemtime(root_dir() . $min_file);
		$manifest .= $min_file . "?v=" . $version . "\n";
	}
	$manifest .= "fonts/fontawesome-webfont.eot?v=4.2.0\n";
	$manifest .= "fonts/fontawesome-webfont.svg?v=4.2.0\n";
	$manifest .= "fonts/fontawesome-webfont.ttf?v=4.2.0\n";
	$manifest .= "fonts/fontawesome-webfont.woff?v=4.2.0\n";
	$manifest .= "fonts/FontAwesome.otf?v=4.2.0\n\n";
	
	$manifest .= "NETWORK:\n";
	$manifest .= "*\n\n";
	
	$manifest .= "FALLBACK:\n";
	$manifest .= "/ /offline.html";

	fwrite($out, $manifest);
	echo "Manifest: Created";
?>
