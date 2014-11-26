<?php require '_config.php';  ?>
<html>
	<head>
		<?php LoadCSS($CSSTools); ?>
		<?php LoadJS($JSLibsA); ?>
	</head>

	<body class="export">

		<?php tools_header(); ?>

		<div id='content'>

			<div id="data-picker-wrapper" class="field_wrapper">
				<div class="input-group">
					<span class="input-group-addon">From</span>
					<input class="form-control" type="text" id="date-picker-from" name="from">
				</div>
				<div class="input-group">
					<span class="input-group-addon">To</span>
					<input class="form-control" type="text" id="date-picker-to" name="to">
				</div>
			</div>

			<div id="table-wrapper" class="field_wrapper"></div>
		</div>
	
		<input type="hidden" id="userId" value="<?php echo $params['user']; ?>">
		<?php LoadJS($JSTools); ?>
	</body>
</html>

