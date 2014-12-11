<?php require '_config.php';  ?>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="../min/g=csstools">  
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
				<div id="table-type" style="display:none">
				    <input type="radio" value="events" id="events" name="table-type" checked="checked"><label for="events">Meeting Notes</label>
				    <input type="radio" value="signatures" id="signatures" name="table-type"><label for="signatures">Signatures</label>
				  </div>
			</div>

			<div id="table-wrapper" class="field_wrapper"></div>
		</div>
	
		<input type="hidden" id="userId" value="<?php echo $params['user']; ?>">
		<script type="text/javascript" src="../min/g=jslibs"></script>
		<script type="text/javascript" src="../min/g=jstools"></script>
	</body>
</html>

