<!DOCTYPE html>
<?php require 'backend/common.php';  ?>
<html>
	<head>
		<title>Coach Tracker</title>
		<meta id="Viewport" name="viewport" width="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=yes, width=320">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="mobile-web-app-capable" content="yes">
		<link rel="icon" type="image/png" href="images/icons/favicon.png">
		<link rel="apple-touch-icon-precomposed" sizes="57x57" href="images/icons/apple-icon-57x57-precomposed.png" />
		<link rel="apple-touch-icon-precomposed" sizes="144x144" href="images/icons/apple-icon-144x144-precomposed.png" />
		<link rel="stylesheet" type="text/css" href="/min/g=css-app">                          
	</head>                                   
	<body>
		<header data-category="header">
			<div id="header-offline-alert">OFFLINE!</div>
			<div id="header-fields"></div>
		</header>
	
		<style>
		.user-wrapper {
			position: absolute;
			top: 10%;
			z-index: 9;
			width: 100%;
			text-align: center;
		}
		.user-image {
			margin: 0 auto;
			width: 150px;
			height: 150px;
			border-radius: 100px !important;
		}
		.user-details {
			font-size: 24px;
			width: 100%;
		}
		.userBgImg {
			background-image: url('http://cdn.history.com/sites/2/2013/12/new-york-city-H.jpeg');
			position: fixed;
			width: 920px;
			height: 300px;
			overflow: hidden;
		}
		.userBgImg.blur0 {
			-webkit-filter: blur(0px);
			-moz-filter: blur(0px);
			-o-filter: blur(0px);
			-ms-filter: blur(0px);
			filter: blur(0px);
		}
		.userBgImg.blur1 {
			-webkit-filter: blur(1px);
			-moz-filter: blur(1px);
			-o-filter: blur(1px);
			-ms-filter: blur(1px);
			filter: blur(1px);
		}
		.userBgImg.blur2 {
			-webkit-filter: blur(2px);
			-moz-filter: blur(2px);
			-o-filter: blur(2px);
			-ms-filter: blur(2px);
			filter: blur(2px);
		}
		.userBgImg.blur3 {
			-webkit-filter: blur(3px);
			-moz-filter: blur(3px);
			-o-filter: blur(3px);
			-ms-filter: blur(3px);
			filter: blur(3px);
		}
		.userBgImg.blur4 {
			-webkit-filter: blur(4px);
			-moz-filter: blur(4px);
			-o-filter: blur(4px);
			-ms-filter: blur(4px);
			filter: blur(4px);
		}
		.user-headline {
			width: 100%;
			overflow: hidden;
			position: relative;
			height: 300px;
			z-index: -1;
		}
		#user-header {
			margin-top: 120px !important;
			width: 920px;
		    margin: 0 auto;
		    z-index: -1;
		}
		</style>
	
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
		<script type="text/javascript" src="/min/g=js-app-libs"></script>
		<script type="text/javascript" src="/min/g=js-app-core"></script>
		<?php ga_lib(); ?>
	</body>                                                                 
</html>