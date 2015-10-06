var app = new function() {
	_app = this;
	this.ls = new $.localStorage();
	this.ss = new $.sessionStorage();
	this.data = {};
	this.config = {
		loaded: false,
		env: (document.domain == 'localhost' ? 'dev' : document.domain == 'stage.coachtracker.org' ? 'stage' : 'prod'),
		isMobile: (window.isMobile ? true : false),
		isChrome: (/Chrome/i.test(navigator.userAgent) ) ? true : false,
		isIOS: (/iPhone|iPad|iPod/i.test(navigator.userAgent) ) ? true : false,
		studentImagePath: 'images/students/'
	}
	this.requiredComponents = ['global', 'gtrack', 'timer', 'ajax', 'header', 'controller', 'libs'];

	this.init = function() {
		
		// Get Version
		_app.data.version = (window.version ? window.version : Math.floor((Math.random() * 10) + 1));
		
		// Load Components
		$.each(_app.requiredComponents, function(x, c) {
			var component = app[c];
			if (component) component.init();
		});
		
		// Listen for first paint
		//_app.lazyLoad();

		// Load
		_app.controller.init();
		_app.controller.loadFirstScreen();
		
	}
	
	/*
	 * Lazy Load JS files
	 */
	this.lazyLoad = function() {
		$.ajax({
			url: "/min/g=js-b&v=" + _app.data.version,
			dataType: "script",
			cache: true
		});
	}
}();

$(document).ready(app.init);