app['ajax'] = new function() {
	_ajax = this;
	this.queue = [];
	this.queueStorageId = 'ajaxQueue';
	
	this.init = function() {
		
		// Add global ajax events
		$.ajaxSetup({
			beforeSend: _ajax.ajaxBeforeSend,
			complete: _ajax.ajaxComplete,
			error: _ajax.ajaxError
		});
		
		// Get stored items in queue
		if (app.ls.getItem(_ajax.queueStorageId)) _ajax.queue = app.ls.getItem(_ajax.queueStorageId);
	}
	
	this.cleanUrl = function(url) {
		if (url.indexOf('?') != -1) {
			url = url.slice(0, url.indexOf('?'));
		}
		return url;
	}
	
	/*
	 * Called before request sent
	 */
	this.ajaxBeforeSend = function(x, s) {
		$(document).overlay({ show: true, id: 'ajax' });
		if (s && s.url) {
			var url = _ajax.cleanUrl(s.url);
			app.timer.startTimer(url);
		}
	} 

	/*
	 * Called once received any response
	 */
	this.ajaxComplete = function(e, x, s) {
		var url = _ajax.cleanUrl(this.url);
		
		_ajax.ajaxResponseLog(e);
		_ajax.trackRequest(x, url);
		$(document).overlay({ show: false, id: 'ajax' });
		app.timer.endTimer(url);
	}

	/*
	 * Called if error response
	 */
	this.ajaxError = function() {
		$(document).overlay({
			show: true,
			delay: 2000,
			msg: "Sorry, there was an error!"
		});
	}
	
	/*
	 * If user is offline store ajax request
	 */
	this.addToQueue = function(s) {
		_ajax.queue.push(s);
		app.ls.setItem(_ajax.queueStorageId, _ajax.queue);
	}

	/*
	 * Send ajax details to GA
	 */
	this.trackRequest = function(gtAct, gtLabel) {
		app.gtrack.track_event('app:ajax', gtAct, gtLabel);
	}

	/*
	 * Console log the ajax response
	 */
	this.ajaxResponseLog = function(e) {
		try {
			if (e && e.responseText) {
				var response = $.parseJSON(e.responseText)
				console.log('Response:', response); 
			}
		} catch (e) { console.log('Response: ERROR'); }
	}
}