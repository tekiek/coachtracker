<?php

function env() {
	if ($_SERVER['HTTP_HOST'] == 'coachtracker.org' || $_SERVER['HTTP_HOST'] == 'www.coachtracker.org') {
		return 'prod';
	} else {
		return 'dev';
	}
}

function root_dir() {
	return $_SERVER['DOCUMENT_ROOT'] . '/';
}

function file_root() {
	if (env() == 'prod') {
		return 'http://' . $_SERVER['HTTP_HOST'] . '/';
	} else {
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
	return root_dir() . "images/students/";
}

?>