<?php require '_config.php';  ?>
<!doctype html>
<html>
	<head>
		<?php head_includes(); ?>
		<?php load_basket_js(); ?>
		<?php mobile_css(); ?>
	</head>

	<body data-firstScreen="dataExport" class="export">
		<?php echo svgDegs(); ?>
		<?php tools_header(); ?>

		<div id='content' style="display:none;">

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

			<div id="data-wrapper" class="xfield_wrapper">
				<div id="tableTabs" class="field_wrapper">
					<ul>
					<?php
						foreach($tables as $key => $table) {
							echo "<li  data-table='" . $key . "'><a href='#tab-" . $key . "'>" . $table .  "</a></li>";
						}
					?>
					</ul>
					<?php
						foreach($tables as $key => $table) {
							echo "<div id='tab-" . $key . "'>";
					?>
							<? # Upload/Template ?>
							<div id="table-wrapper-<?php echo $key; ?>"></div>
					<?php
							echo "</div>";
						}
					?>
				</div>
				

			</div>
		</div>
		
		<div id="dialog"></div>
		<?php load_js(); ?>
		<?php load_css(); ?>
	</body>
</html>

