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
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<meta name="apple-mobile-web-app-capable" content="yes">
			<meta name="mobile-web-app-capable" content="yes">
			<meta name="apple-mobile-web-app-title" content="Coach Tracker">
			<link rel="apple-touch-icon" href="' . icons_image_dir() . 'apple-icon-152x152-precomposed.png?v=' . $version .'">
			<link rel="icon" type="image/png" href="' . icons_image_dir() . 'favicon.png?v=' . $version .'">
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