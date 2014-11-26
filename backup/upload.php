<?php require 'backend/common.php';  ?>
<?php require 'backend/includes/externals.php';  ?>
<?php require 'backend/includes/elements.php';  ?>
<?php adminLock(); ?>
<html>
	<head>
		<?php LoadCSS($CSSTools); ?> 
		<?php
			$tables = array('students', 'users');
			$error = false;
			$show_data = false;
			$params = get_params();
			$allowedExts = array("csv");

			// Get Table Data
			$table = ($params['table'] ? $params['table'] : $tables[0]);
			$table_details = getTableColsByName($table);
			$table_cols = uploadTableCols($table_details);

			function verify_file_to_table($file_header, $table_header) {
				if (count(array_diff($file_header, $table_header)) > 0) {
					return false;
				}
				elseif (count(array_diff($table_header, $file_header)) > 0) {
					return false;
				}
				else {
					return true;
				}
			}

			// // Upload file and show the data
			// if ($_FILES["file"]) {
			// 	$error = "Error: Unable to upload. Please contact support.";
			// 	$temp = explode(".", $_FILES["file"]["name"]);
			// 	$extension = end($temp);
			// 
			// 	if (in_array($extension, $allowedExts)) {
			// 		if ($_FILES["file"]["error"] > 0) {
			// 			$error = "Error: " . $_FILES["file"]["error"];
			// 		} 
			// 		else {
			// 			// Copy file to disk
			// 			$file_name = date("Y-m-d-h:i") . $_FILES["file"]["name"];
			// 			$path = data_dir() . $file_name;
			// 			copy_file($_FILES["file"], data_dir(), $file_name);
			// 
			// 			// Read file
			// 			$file_data = get_file_data($path);
			// 			if (!verify_file_to_table($file_data['header'], $table_cols)) {
			// 				$error = "Error: Invalid Column Names.";
			// 			} else {
			// 				$file_rows = $file_data['data'];
			// 				$show_data = true;
			// 				$error = false;
			// 			}
			// 		}
			// 	} else {
			// 		$error = "Error: Invalid File Type. Please use '." . implode(", ", $allowedExts) . "' files.";
			// 	}
			// }
			
			// Insert Data into Table
			if ($params['upload']) {
				$file_path = data_dir() . $params['upload'];
				$file_data = get_file_data($file_path);
				$file_rows = $file_data['data'];
				$success_upload = array(); $failed_upload = array();

				// Add data to table
				foreach($file_rows as $row) {
					$index = 0; $table_values = array();

					// Turn into array
					foreach($table_cols as $col) {
						if ($row[$index]) {
							$table_values[$col] = $row[$index];
						} else {
							$table_values[$col] = NULL;
						}
						$index++;
					}

					// Add to database
					if (TableInsert($table, $table_values)) {
						array_push($success_upload, $table_values);
					} else {
						array_push($failed_upload, $table_values);
					}
				}
			}
		?>

	</head>

	<body class="upload">
		<?php tools_header(); ?>

		<div id='content'>
			<div id="table_select_field" class="c field_wrapper">
				<div class="input-group input-group-lg ">    
					<span class="input-group-addon">
						<i class="fa fa-database fa-lg"></i>
					</span>   
					<select id="table_select" class="form-control">
						<?php foreach($tables as $t) {
							$default = ($t == $table ? 'selected="selected"' : '');
							echo '<option ' . $default . ' value="' . $t . '">' . $t . '</option>';
						} ?>
					</select>
				</div>
			</div>
		
			<?php if ($error) : ?>
			<div class="alert alert-danger" role="alert"><h3><?php echo $error; ?></h3></div>
			<?php endif; ?>

			<div id="upload-wrapper" class="c field_wrapper">
				<form id="file_upload_form" action="upload.php?table=<? echo $table; ?>" method="post" enctype="multipart/form-data">
					<input id="file" type="file" name="file" >
					<button id="file_select" class="btn btn-primary btn-lg shadow width_50 left">  
						<span class="button-text">Upload File</span>   
					</button>
						<button id="download_template" data-cols="<?php echo implode(",", $table_cols); ?>" class="btn btn-primary btn-lg shadow width_50 right">  
						<span class="button-text">Download Template</span>   
					</button>
				</form>
			</div>
			
			<div id="file-preview" class="c field_wrapper hidden"></div>

			<div id="database-insert-wrapper" class="field_wrapper">
				<button id="file_import" class="btn btn-primary btn-lg shadow">  
					<span class="button-text">Add To Database</span>   
				</button>
			</div>

			<?php if ($params['upload']) : ?>
				<?php if (count($failed_upload) > 0) : ?>
					<div class="jumbotron"><h1>FAILED DATA</h1></div>
					<?php build_table($table_cols, $failed_upload); ?>
				<?php endif; ?>
				<?php if (count($success_upload) > 0) : ?>
					<div class="jumbotron"><h1>SAVED DATA</h1></div>
					<?php build_table($table_cols, $success_upload); ?>
				<?php endif; ?>
			<?php endif; ?>
		</div>
		
		<iframe id="csv_iframe" src="" class="hidden"></iframe>
		
		<?php LoadJS($JSLibsA); ?>
		<?php LoadJS($JSTools); ?>
	</body>
</html>