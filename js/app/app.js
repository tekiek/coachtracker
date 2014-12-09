var app = new function() {
	this.ls = $.localStorage();
	this.data = {};
	this.config = {
		env: (document.domain == 'localhost' ? 'dev' : 'prod'),
		isMobile: (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false,
		isChrome: (/Chrome/i.test(navigator.userAgent) ) ? true : false,
		isIOS: (/iPhone|iPad|iPod/i.test(navigator.userAgent) ) ? true : false,
		studentImagePath: 'images/students/'
	}

	this.init = function() {
		app.startTimer('load-time');
		app.online.init();
		app.gtrack.init();
		app.ajax.init();
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
	
	this.exit = function() {
		// $(window).bind('beforeunload', function() {
		//         alert('test');
		//     });
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
}();
$(document).ready(app.init);