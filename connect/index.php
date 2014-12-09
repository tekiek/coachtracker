<?php require '_config.php';  ?>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="../min/g=csstools"> 
	</head>

	<body class="connection">

		<?php tools_header(); ?>

		<div id='content'>

			<div id="user_select_field" class="c field_wrapper">
				<div class="input-group input-group-lg ">    
					<span class="input-group-addon">
						<i class="fa fa-users fa-lg"></i>
					</span>   
					<select id="user_select" class="form-control">
						<?php foreach($users as $u) {
							$default = ($u['id'] == $user ? 'selected="selected"' : '');
							echo '<option ' . $default . ' value="' . $u['id'] . '">' . $u['name'] . '</option>';
						} ?>
					</select>
				</div>
			</div>

			<div class="filter-tabs">
				<ul>
					<?php
					foreach($tabs as $index => $tab) {
						echo '
						<li class="filter-' . $tab['filter'] . '" data-filter="' . $tab['filter'] .'" data-type="' . $tab['type'] .'">
							<a href="#' . $index . '-tab">
								' . $index . '
							</a>
						</li>';
					}
					?>
				</ul>
				<?php
				foreach($tabs as $index => $tab) {
					echo '
					<div id="' . $index . '-tab">
						<div class="connection-tabs">
							<ul>
								<li>
									<a href="#' . $index . '-tab-available" class="available-tab">
										Available
										<span class="badge available-total-count">0</span>
									</a>
								</li>
								<li >
									<a href="#' . $index . '-tab-selected" class="selected-tab">
										Selected
										<span class="badge selected-total-count">0</span>
									</a>
								</li>
							</ul>
							<div id="' . $index . '-tab-available" class="available-panel">
								<button class="btn btn-success btn-lg shadow btn-add">    
									<i class="fa fa-plus-circle fa-lg"></i>    
									<span class="button-text">Add ' . $index . '</span> 
									<span class="badge selected-add-count">0</span>
								</button>
							</div>
							<div id="' . $index . '-tab-selected"  class="selected-panel">
								<button class="btn btn-danger btn-lg shadow btn-remove">    
									<i class="fa fa-minus-circle fa-lg"></i>    
									<span class="button-text">Remove ' . $index . '</span> 
									<span class="badge selected-remove-count">0</span>  
								</button>
							</div>
						</div>
					</div>';
				}
				?>
			</div>
		</div>
		<script type="text/javascript" src="../min/g=jslibs"></script>
		<script type="text/javascript" src="../min/g=jstools"></script>
	</body>
</html>

