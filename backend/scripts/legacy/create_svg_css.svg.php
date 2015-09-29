<?php
	$svgs = [
		'lock',
		'tablet',
		'desktop', 
		'comments-o',
		'mobile',
		'quote-left',
		'quote-right',
		'check',
		'chevron-left',
		'users',
		'plus-circle',
		'minus-circle',
		'pencil',
		'check-circle',
		'calendar',
		'fax',
		'clock-o', 
		'bullseye',
		'comment-o',
		'comments-o',
		'graduation',
		'university',
		'floppy-o',
		'search',
		'user',
		'question-circle',
		'camera',
		'envelope-o',
		'lock',
		'angle-left',
		'angle-right',
		'thumbs-up',
		'thumbs-down',
		'database',
		'floppy',
		'spinner',
		'search',
		'times',
		'floppy-o',
		'icon-sort',
		'times-circle'
	];
	
	$myfile = fopen("../../css/svg.css", "w") or die("Unable to open file!");
	foreach($svgs as $svg) {
		$class = "." . $svg . "{\n";
		$class .= "background: url('data:image/svg+xml;utf8,";
		$class .= file_get_contents('../../images/svg/' . $svg . '.svg');
		$class .= "');\n}\n";
		fwrite($myfile, $class);
	}
	fclose($myfile);
	
	echo "finish";
?>
	