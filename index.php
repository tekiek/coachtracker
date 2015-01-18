<!DOCTYPE html>
<?php require 'backend/common.php';  ?>
<html>
	<head>
		<?php head_includes(); ?>
		<link rel="stylesheet" type="text/css" href="/min/g=css-app&v=<?php echo $version ?>">                          
	</head>                                   
	<body>
		
		<header data-category="header">
			<div id="header-offline-alert">OFFLINE!</div>
			<div id="header-fields"></div>
		</header>
	
		<div id="sub-content">
			<div data-category="event-signature" id="event-signature"></div>
		</div>
	
		<div id='content' class="acl-loggedin">
			<div data-category="schedule-list" id="schedule-list" class="c"></div>
			<div data-category="home-screen" id="home-screen" class="c"></div>
			<div data-category="user-edit" id='user-edit' class="c"></div>
			<div data-category="user-list" id="user-list" class="c"></div>
			<div data-category="user-search" id="user-search" class="c"></div>
			<div data-category="student-edit" id="user-screen" class="c"></div>
			<div data-category="event-add" id="event-add" class="c"></div>
			<div data-category="event-list" id="event-list" class="c"></div>
			<div data-category="schedule-add" id="schedule-add" class="c"></div>
			<div data-category="schedule-list" id="schedule-list" class="c"></div>
		</div>

		<div id="alert"></div>
		<div id="spinner"></div>
		<div id="dialog"></div>
		<script type="text/javascript" src="/min/g=js-app-libs&v=<?php echo $version ?>"></script>
		<script type="text/javascript" src="/min/g=js-app-core&v=<?php echo $version ?>"></script>
		<?php ga_lib(); ?>
	</body>                                                                 
</html>