var app = new function() {
	this.ls = new $.localStorage();
	this.ss = new $.sessionStorage();
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
		//app.online.init();
		app.gtrack.init();
		app.ajax.init();
		app.header.init();
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
	
	this.exit = function() {}

	/* --- Timers ---- */

	this.timers = {}

	this.startTimer = function(id) {
		console.log('START ID', id);
		app.timers[id] = {};
		app.timers[id]['start'] = new Date().getTime();
	}

	this.endTimer = function(id) {
		console.log('END ID', id);
		if (app.timers[id]) {
			app.timers[id]['end'] = new Date().getTime();
			app.timers[id]['time'] = app.timers[id]['end'] - app.timers[id]['start'];
			
			// Track timer
			timeTrack = Math.round(app.timers[id]['time'] / 10) * 10
			app.gtrack.track_event('timer', id, timeTrack);
		}
	}
}();
$(document).ready(app.init);