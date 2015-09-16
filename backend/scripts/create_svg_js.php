<?php
	require '../common.php';
	lock();
	
	global $lazy_svgs;
	$defs = Svgs2Defs($lazy_svgs);
	$myfile = fopen("../../js/core/svg.js", "w") or die("Unable to open file!");
	
	$write = "var defs = '" . $defs . "';\n\n";
	$write .= "var defEl = document.getElementById('svg-defs');\n";
	$write .= "defEl.insertAdjacentHTML('beforeend', defs);";

	fwrite($myfile, $write);
	fclose($myfile);
	
	echo "finish";
?>
	