<?php require 'backend/common.php';  ?>
<?php require 'backend/includes/externals.php';  ?>
<?php require 'backend/includes/elements.php';  ?>
<html>
	<head>
		<?php LoadCSS($CSSTools); ?> 
		<style>
			.panel-body {
				padding: 0px;
			}
			.blockUI h3 {
				margin: 10px auto;
			}
			.col_list {
				border: 1px solid #d3d3d3;
				min-height: 300px;
				width: 100%;
				box-shadow: inset 0 0px 5px #d3d3d3;
				margin: 0px;
			}
			#table_col_list .panel,
			#data_col_list .panel {
				padding: 0px;
				height: auto;
			}
			
			#table_col_list {
				width: 45%;
				float: left;
			}
			#data_col_list {
				width: 45%;
				float: right;
			}
		</style>

		<?php
			$tables = array(
				'students' => uploadTableCols(tableStudentsCols()),
				'events' => uploadTableCols(tableEventsCols()),
				'users' => uploadTableCols(tableUsersCols())
			)
		?>

	</head>
	<body class="data-export">
		
		<div style="max-width: 800px; margin: 10px auto">

			<div id="table_col_list">
			<? foreach ($tables as $table => $cols) { ?>
				<h3><? echo $table; ?></h3>
				<div class="panel panel-default">
					<div class="panel-body">
						<ul id="<? echo $table; ?>_cols" class="col_list list-group">
						<?
							foreach($cols as $key => $col) {
								echo '<li data-table="'. $table .'" data-col="'. $col .'" class="list-group-item">' . 
										$table . '  [ ' . $col . ' ]' . 
									'</li>';
							}
						?>
						</ul>
					</div>
				</div>
			<? } ?>
			</div>

			<div id="data_col_list">
				<h3>Selected Data</h3>
				<div class="panel panel-default">
					<div class="panel-body">
						<ul id="data_cols" class="col_list list-group"></ul>
					</div>
				</div>
				<h3>Filters</h3>
				<div class="panel panel-default">
					<div class="panel-body">
						<ul id="filter_cols" class="col_list list-group"></ul>
					</div>
				</div>
			</div>

			<div class="c"></div>
			
			<div class="data-window" style="padding: 10px; margin: 10px 0;">
				<div class="c">
					<button id="show_data" class="btn btn-primary btn-lg shadow">  
						<span class="button-text">Preview Data</span>   
					</button>
				</div>
			</div>

			<div id="data_table" class="data-window" style="display:none;"></div>

		</div>

		<?php LoadJS($JSLibsA); ?>
		<?php LoadJS($JSTools); ?>
	</body>
</html>