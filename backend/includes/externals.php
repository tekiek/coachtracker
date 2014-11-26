<?php
	// List of files to combine for prod
	$combine_file_list = array();

	// Load minify?
	$fulljs = 0;
	if ($_GET['fulljs'] == '1') { $fulljs = 1; }
	else if ($_GET['fulljs'] == '0') { $fulljs = 0; }
	else if (env() == 'prod') { $fulljs = 0; }
	else { $fulljs = 1; }
	
	addBasketJs();
	
	/**************** Javascript ******************/
	$JSLibsA = array(
		'path' => 'js/libs/a/',
		'list' => array(
			"jquery.js",
			"jquery.ui.js",
			"jquery.addons.js",
			"jquery.storage.js",
			"jquery.blockui.js",
			"jquery.template.js",
			"event.manager.js"
		),
		'min' => array("libsAMin.js")
	);
	array_push($combine_file_list, $JSLibsA);

	$JSLibsB = array(
		'path' => 'js/libs/b/',
		'list' => array(
			"addtohomescreen.js",
			"jquery.form.js",
			"jquery.upload.js",
			"jquery.inputmask.js",      
			"jquery.touch.js",
			"jquery.signature.js",
			"jquery.scrollintoview.js",
		),
		'min' => array("libsBMin.js")
	);
	array_push($combine_file_list, $JSLibsB);

	$JSApp = array(
		'path' => 'js/app/',
		'list' => array(
			"app.js",
			"acl.js",
			"menu.js",
			"common.js",
			"signature.js",
			"controller.js",
			"header.js",
			"studentSearch.js",
			"studentEdit.js",
			"eventAdd.js",
			"fieldController.js",
			"fieldsEvent.js",
			"fieldsSchedule.js",
			"fieldsStudent.js",
			"scheduleAdd.js",
			"scheduleList.js",
			"login.js",
			"email.js",
			"gtrack.js",
			"imageAdd.js",
		),
		'min' => array("appMin.js")
	);
	array_push($combine_file_list, $JSApp);
	
	$JSTools = array(
		'path' => 'js/tools/',
		'list' => array(
			'table_filter.js',
			'tools.js',
			'table.js',
			'upload.js',
			'export.js',
			'connection.js',
		),
		'min' => array("toolsMin.js")
	);
	array_push($combine_file_list, $JSTools);
	
	/**************** CSS ******************/
	$CSSApp = array(
		'path' => 'css/',
		'list' => array(
			"app.css",
			"fontawesome.css",
			"bootstrap.css",
			"jquery.ui.css",
			"jquery.signature.css",	
			"addtohomescreen.css",
			"animate.css",
		),
		'min' => array("appMin.css")
	);
	array_push($combine_file_list, $CSSApp);
	
	$CSSTools = array(
		'path' => 'css/',
		'list' => array(
			"app.css",
			"fontawesome.css",
			"bootstrap.css",
			"jquery.ui.css",
			"tools.css",
			"jquery.tabletools.css",	
		),
		'min' => array("toolsMin.css")
	);
	array_push($combine_file_list, $CSSTools);

	/**************** FUNCTIONS ******************/ 
	
	function addBasketJs() {
		if (0) {
			echo "<script type='text/javascript' src='" . file_root() . "js/libs/basket.js'></script>";  
		}
	}
	
	function getFileList($params) {
		return ($params[$GLOBALS['fulljs'] ? 'list' : 'min']);
	}
	
	function filePath($file, $params) {
		return file_root() . $params['path'] . $file . "?v=" . filemtime(root_dir() . $params['path'] . $file);
	}
		
	function LoadJS($params) {
		$files = getFileList($params);

		foreach ($files as &$file) {
			if (1) {
				echo "<script type='text/javascript' src='" . filePath($file, $params) . "'></script>\r\n";
			} else {
				echo "
					<script>
						basket.require({ 
							url: '" . $params['path'] . $file . "',
							unique:  '" . filemtime($params['path'] . $file) . "'
						});
					</script>";
			}
		}
	}
	
	function LoadCSS($params) {
		$files = getFileList($params);
		foreach ($files as &$file) {
			echo "<link rel='stylesheet' type='text/css' href='" . filePath($file, $params) . "'>";
		}
	}
	
	function LazyLoad($params, $storage) {
		$files = getFileList($params);
		echo "<script type='text/javascript'>\r\n";
		echo $storage . " = [";
		foreach ($files as &$file) {
		    echo "'" . filePath($file, $params) . "'";
			if (!lastInArray($params['files'], $file)) echo ",";
		}
		echo "];\r\n</script>";
	}
?>