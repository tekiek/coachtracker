<?php require '_config.php';  ?>
<html>
	<head>
		<?php head_includes(); ?>
		<?php load_css(); ?>
		<?php load_basket_js(); ?>
	</head>

	<body data-firstScreen="connection" class="connection <?php echo $selectedUserAcl; ?>">
		<?php echo svgDegs(); ?>
		<?php tools_header(); ?>

		<div id='content' style="display:none;">

			<div class="filter-tabs" style="xdisplay:none;">
				<div id="user_select_field">
					<div class="input-group">    
						<span class="input-group-addon">
							<?php svg('users', 15, null); ?>
						</span>   
						<select id="user_select" class="form-control">
							<?php 
								foreach(array('coach', 'counselor', 'captain') as $aclSelect) {
									echo '<option disabled></option>';
									echo '<option disabled>' . strtoupper($aclSelect) . '</option>';
									foreach($users as $u) {
										if ($u[$aclSelect] != 1) continue;
										$default = ($u['id'] == $selectedUserId ? 'selected="selected"' : '');
										echo '<option ' . $default . ' value="' . $u['id'] . '">' . $u['name'] . '</option>';
									}
								}
							?>
						</select>
					</div>
				</div>
				
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
								<button class="btn-selected-action btn btn-success btn-lg shadow btn-add round"> 
									<span class="button-text">Add</span> 
									<span class="badge selected-add-count">0</span>
								</button>
							</div>
							<div id="' . $index . '-tab-selected"  class="selected-panel">
								<button class="btn-selected-action btn btn-danger btn-lg shadow btn-remove round">    
									<i class="fa fa-minus-circle fa-lg"></i>    
									<span class="button-text">Remove</span> 
									<span class="badge selected-remove-count">0</span>  
								</button>
							</div>
						</div>
					</div>';
				}
				?>
			</div>
		</div>
		<div id="dialog"></div>
	</body>
	<?php load_js(); ?>
</html>

