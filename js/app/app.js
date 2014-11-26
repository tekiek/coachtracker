var app = new function() {
	this.ls = $.sessionStorage();
	//this.ls = $.localStorage();
	this.isOnline = null;
	
	this.data = {};
	this.config = {
		env: (document.domain == 'localhost' ? 'dev' : 'prod'),
		isMobile: (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false,
		isChrome: (/Chrome/i.test(navigator.userAgent) ) ? true : false,
		isIOS: (/iPhone|iPad|iPod/i.test(navigator.userAgent) ) ? true : false,
		studentImagePath: 'images/students/'
	}

	this.init = function() {
		//app.Pinger_ping()
		app.startTimer('load-time');
		app.gtrack.init();
		app.ajaxInit();
		if (app.config.isIOS) addToHomescreen();

		// Must be logged in
		if (!app.login.getLoggedInStatus()) {
			app.login.init();
		} else {
			app.login.setAcls();
			app.controller.loadFirstScreen();
		}
		app.endTimer('load-time');
	}
	
	this.Pinger_ping = function(ip, callback) {
	    this.img = new Image();

	    this.img.onload = function() {
			//app.isOnline = true;
			alert('is online');
		};
	    this.img.onerror = function() {
			//app.isOnline = true;
			alert('is online');
		};

	    this.start = new Date().getTime();
	    this.img.src = "http://coachtracker.org";
		setTimeout(function() {
			if (!app.isOnline) {
				alert('not online');
				app.isOnline = false;
			}
		}, 2000)
	}

	/* --- Timers ---- */

	this.timers = {}

	this.startTimer = function(id) {
		app.timers[id] = {};
		app.timers[id]['start'] = new Date().getTime();
	}

	this.endTimer = function(id) {
		if (app.timers[id]) {
			app.timers[id]['end'] = new Date().getTime();
			app.timers[id]['time'] = app.timers[id]['end'] - app.timers[id]['start'];
			app.gtrack.track_event('app', id, app.timers[id]['time']);
		}
	}
	
	/* --- AJAX ---- */
	
	this.ajaxInit = function() {
		$.ajaxSetup({
			beforeSend: function(x, s) {
				app.global.spinner({ show: true });
			},
			complete: function(e, x, s){
				setTimeout(function() {
					app.global.spinner(false);
				}, 250)
			},
			success: function() {}
		});
		$(document).ajaxError(app.ajaxError);
		$(document).ajaxComplete(app.ajaxComplete);
	}
	
	this.ajaxComplete = function(e, x, s) {
		var gtAct = (x && x.statusText ? x.statusText : ''),
			gtLabel = (s && s.url ? s.url : '');

		app.global.spinner(false);
		app.gtrack.track_event('app:ajax', gtAct, gtLabel);
	}
	
	this.ajaxError = function(msg) {
		var alertIcon = $.tmpl(app.global.templates.icon, { icon : 'fa-info-circle fa-lg' });
		if (!msg || typeof msg != 'string') msg = 'Sorry, there was an issue.';

		app.global.spinner(false);
		app['global']['els']['dialog']
			.empty()
			.append(alertIcon)
			.append(' ' + msg)
			.dialog({
				resizable: false,
				modal: true,
				title: 'Error!',
				buttons: {
					Cancel:{
						text: 'Ok',
						click: function() {
							$(this).dialog('close');
						}
					} 
				}
			});
	}
}();
$(document).ready(app.init);