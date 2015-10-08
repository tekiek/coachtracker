<?php
	
	function head_includes() {
		global $version;
		$apple_image = icons_image_dir() . 'apple-icon-152x152-precomposed.png';
		$fav_icon = icons_image_dir() . 'favicon.png';
		$css = file_get_contents(file_root() . 'css/min/critical.min.css?v=' . $version);

		echo '
			<title>Coach Tracker</title>
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<meta name="apple-mobile-web-app-capable" content="yes">
			<meta name="mobile-web-app-capable" content="yes">
			<meta name="apple-mobile-web-app-title" content="Coach Tracker">
			<link rel="apple-touch-icon" href="' . $apple_image . '?v=' . date ("dY", filemtime($apple_image)) .'">
			<link rel="icon shortcut" href="' . $fav_icon . '?v=' . date ("dY", filemtime($fav_icon)) .'">
			<script>loadStart = new Date().getTime();</script>
			<script>isMobile = "' . isMobile() . '";</script>
			<script>version = "' . $version . '";</script>
			<style>' . $css . '</style>
		';
	}
	
	function load_css() {
		global $version;
		$cssFile = file_root() . "css/min/app.min.css";
		
		if (true || env() == 'dev') {
			echo '
				<script>
					document.addEventListener("DOMContentLoaded", function() {
						var stylesheet = document.createElement("link");
						stylesheet.href = "' . $cssFile . '?v=' . $version . '";
						stylesheet.rel = "stylesheet";
						stylesheet.type = "text/css";
						document.getElementsByTagName("head")[0].appendChild(stylesheet);
					}, false);
				</script>';
		} else {
			echo '
				<script>
					document.addEventListener("DOMContentLoaded", function() {
						endStart = new Date().getTime();
						basket.require(
							{ url: "' . $cssFile . '", execute: false, unique: "' . $version . '" }
						)
						.then(function(responses) {
							var css = responses[0];
							_stylesheet.appendStyleSheet(css, function(err, style) {});
						});
					}, false);
				</script>
			';
		}
	}
	
	function load_basket_js() {
		// $basket_js = file_get_contents(file_root() . 'js/libs/basket.js');
		// echo '<script>' . $basket_js . '</script>';
	}
	
	function load_js() {
		global $version;
		$js = file_root() . "js/min/app.js";

		
		if (true) {
			echo '<script async src="' . $js . '?v=' . $version . '"></script>';
		}
		elseif (false || env() == 'dev') {
			echo '
				<script>
					
					document.addEventListener("DOMContentLoaded", function() {
							var d=document, 
							h=d.getElementsByTagName("head")[0], 
							s=d.createElement("script"); 
							s.type="text/javascript"; 
							s.async=true; 
							s.src="' . $js . '?v=' . $version . '"; 
							h.appendChild(s);
					}, false);
				</script>';
		} else {
			echo '
				<script>
					document.addEventListener("DOMContentLoaded", function() {
						basket.require(
							{ url: "' . $js . '", unique: "' . $version . '" }
						)
					}, false);
				</script>
			';
		}
		
	}
	
	function tools_header() {
		echo '
			<header data-category="header">
				<div id="header-fields">
					<a style="fill:white;color:white;text-decoration:none;" href="' . file_root() . '" class="pointer">
						<div class="back-btn-wrapper left pointer">
							<span class="fa-lg header__back-icon" style="margin:0px">
								<svg role="img" viewBox="0 0 1792 1792">
									<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#chevron-left"></use>
								</svg>
							</span>
							<span class="text-shadow">Back</span>
						</div>
					</a>
			</header>
		';
	}
?>