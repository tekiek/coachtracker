<?php

function env() {
	if ($_SERVER['HTTP_HOST'] == 'coachtracker.org' || $_SERVER['HTTP_HOST'] == 'www.coachtracker.org') {
		return 'prod';
	} 
	else if ($_SERVER['HTTP_HOST'] == 'stage.coachtracker.org' || $_SERVER['HTTP_HOST'] == 'www.stage.coachtracker.org') {
		return 'stage';
	}
	else {
		return 'dev';
	}
}

function root_dir() {
	return $_SERVER['DOCUMENT_ROOT'] . '/';
}

function file_root() {
	if (env() == 'prod') {
		return 'http://' . $_SERVER['HTTP_HOST'] . '/';
	} 
	else if (env() == 'stage') {
		return 'http://' . $_SERVER['HTTP_HOST'] . '/';
	}
	else {
		return 'http://localhost:8888/';
	}
}

function logs_dir() {
	return root_dir() . "backend/logs/";
}

function data_dir() {
	return root_dir() . "data/";
}

function students_image_dir() {
	return file_root() . "images/students/";
}

function icons_image_dir() {
	return file_root() . "images/icons/";
}

?>