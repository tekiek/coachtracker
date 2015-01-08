<?php

function loginStatus() { 
	session_start();
	if ($_SESSION["loggedin-user"]) { 
		return true; 
	} else { 
		return false; 
	}
};

function loginUserid() {
	session_start();
	if (loginStatus()) { 
		return $_SESSION['loggedin-user']['id']; 
	} else { 
		return NULL; 
	}
};

function userLogout() {
	session_start();
	if (isset($_SESSION["loggedin-user"])) {
		unset($_SESSION["loggedin-user"]);
	}
}

function lock() {
	session_start();

	if (loginStatus()) { 
		return NULL; 
	} else {
		userLogout();
		header('Location: ' . file_root() . 'index.php');
	}
};

?>