<!DOCTYPE html>
<?php require 'backend/common.php';  ?>
<html>
	<head>
		<?php head_includes(); ?>
		<?php load_basket_js(); ?>
	</head>                                   
	<body data-firstScreen="login" class="<?php echo (loginStatus() ? 'acl-can-loggedin' : 'acl-can-loggedOut'); ?>">
		<?php echo svgDegs(); ?>

		<header data-category="header" class="<?php #echo (isMobile() ? 'acl-loggedIn' : ''); ?>">
			<div id="header-fields">
				<?php include 'backend/includes/header_default.php';?>
			</div>
		</header>
	
		<div id="sub-content">
			<div data-category="event-signature" id="event-signature"></div>
		</div>
		
		<div id='content'>
			<div class="lock"></div>
			<div data-category="site-info" id="site-info" class="c acl-loggedOut">
				<?php include 'backend/includes/site_info.php'; ?>
			</div>
			<div data-category="home-screen" id="home-screen" class="c"></div>
			<div data-category="user-edit" id='user-edit' class="c"></div>
			<div data-category="user-list" id="user-list" class="c"></div>
			<div data-category="user-search" id="user-search" class="c"></div>
			<div data-category="student-edit" id="user-screen" class="c"></div>
			<div data-category="event-add" id="event-add" class="c"></div>
			<div data-category="email-blast" id="email-blast" class="c"></div>
			<div data-category="event-list" id="event-list" class="c"></div>
			<div data-category="user-login" id="user-login" class="c"></div>
			<div data-category="student-search" id="student-search" class="c"></div>
		</div>

		<div id="alert"></div>
		<div id="spinner"></div>
		<div id="dialog"></div>
	</body>
	<?php load_js(); ?>
	<?php load_css(); ?>
	<?php ga_lib(); ?>                                                               
</html>