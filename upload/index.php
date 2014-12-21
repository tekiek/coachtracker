<?php require '_config.php';  ?>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="../min/g=css-tools">  
		<script type="text/javascript" src="../min/g=js-tools-libs"></script>
	</head>

	<body class="upload">
		<?php tools_header(); ?>

		<div id='content'>

			<? # Alert ?>
			<div class="alert alert-danger hidden" role="alert"><h3></h3></div>

			<? # Table Select ?>
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

			<? # Upload/Template ?>
			<div id="upload-wrapper" class="c field_wrapper">
				<div class="input-group input-group-lg " style="width: 100%">  					
					<input id="file" type="file" name="file" >
					<button id="file_select" class="btn btn-success btn-lg shadow width_50 left">  
						<span class="button-text">Upload File</span>   
					</button>
						<button id="download_template" class="btn btn-lg btn-primary shadow width_50 right">  
						<span class="button-text">Download Template</span>   
					</button>
				</div>
			</div>

			<? # Upload/Template ?>
			<div id="file-preview" class="c field_wrapper" style="display:none"></div>

			<? # Add to database ?>
			<div id="database-insert-wrapper" class="c field_wrapper" style="display:none">
				<button id="file_import" class="btn btn-primary btn-lg shadow">  
					<span class="button-text">Add To Database</span>   
				</button>
			</div>
		</div>

		<iframe id="csv_iframe" src="" class="hidden"></iframe>
		<script type="text/javascript" src="../min/g=js-tools-core"></script>
	</body>
</html>