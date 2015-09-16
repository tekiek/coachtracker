<?php require '_config.php';  ?>
<html>
	<head>
		<?php head_includes(); ?>
		<?php load_basket_js(); ?>
	</head>

	<body data-firstScreen="upload" class="upload">
		<?php echo svgDegs(); ?>
		<?php tools_header(); ?>

		<div id='content' style="display:none;">
			
			<div id="tableTabs" class="field_wrapper">
				<ul>
				<?php
					foreach($tables as $table) {
						echo "<li  data-table='" . $table . "'><a href='#tab-" . $table . "'>" . $table .  "</a></li>";
					}
				?>
				<? # Upload/Template ?>
				<div id="uploadWrapper" class="input-group">
					<button id="download_template" class="btn btn-default width_50 left round"> 
						<?php svg('download', 15, null, 'black'); ?> 
						<span class="button-text">Download Template</span>   
					</button>
					<button id="file_select" class="btn btn-default width_50 right round">
						<?php svg('upload', 15, null, '#777'); ?>
						<span class="button-text">Upload File</span>   
					</button>
				</div>
				</ul>
				<?php
					foreach($tables as $table) {
						echo "<div id='tab-" . $table . "'>";
				?>
						<? # Upload/Template ?>
						<div id="file-preview-<?php echo $table; ?>" class="c allow_empty_table" style="display:none"></div>
				<?php
						echo "</div>";
					}
				?>
			</div>
			
			<? # Add to database ?>
			<button id="file_import" class="btn btn-success btn-lg shadow">
				<?php svg('plus-circle', 20, null, '#fff'); ?>
				<span class="button-text">Add</span>   
			</button>

		</div>

		<input id="file" type="file" name="file" class="hidden">
		<iframe id="csv_iframe" src="" class="hidden"></iframe>
		<div id="dialog"></div>
	</body>
	<?php load_js(); ?>
	<?php load_css(); ?>
	<?php ga_lib(); ?>
</html>