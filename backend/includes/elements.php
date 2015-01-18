<?php
	function build_table($header, $data) {
		echo "<div class='data-window'><table class='table table-striped'><thead><tr><th>";
		echo implode('</th><th>', $header); 
		echo "</th></tr></thead><tbody>";
		foreach($data as $row) {
			echo "<tr><td>";
			echo implode('</td><td>', $row);
			echo "</td></tr>";
		}
		echo "</tbody></table></div>";
	}
	
	function head_includes() {
		global $version;
		echo '
			<title>Coach Tracker</title>
			<meta id="Viewport" name="viewport" width="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=yes, width=320">
			<meta name="apple-mobile-web-app-capable" content="yes">
			<meta name="mobile-web-app-capable" content="yes">
			<meta name="apple-mobile-web-app-title" content="Coach Tracker">
			<link rel="icon" type="image/png" href="' . icons_image_dir() . 'favicon.png?v=' . $version .'">
			<link rel="apple-touch-icon-precomposed" href="' . icons_image_dir() . 'apple-icon-152x152-precomposed.png?v=' . $version .'">
			<link rel="apple-touch-icon-precomposed" sizes="57x57" href="' . icons_image_dir() . 'apple-icon-57x57-precomposed.png?v=' . $version .'" />
			<link rel="apple-touch-icon-precomposed" sizes="144x144" href="' . icons_image_dir() . 'apple-icon-144x144-precomposed.png?v=' . $version .'" />
		';
	}
	
	function tools_header() {
		echo '
			<header class="shadow">
				<div id="header-fields">
					<a style="color:white;text-decoration:none;" href="' . file_root() . 'index.php" class="back-btn-wrapper pointer">
						<i class="fa fa-chevron-circle-left text-shadow  "></i>
						<span class="text-shadow">Back</span>
					</a>
				</div>
			</header>
		';
	}
	
	function ga_lib() {
		echo "
			<script>
			  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			  ga('create', 'UA-56217002-1', 'auto');
			  ga('send', 'pageview');
			</script>
		";
	}
?>