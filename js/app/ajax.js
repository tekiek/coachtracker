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
		
		// Listen when user is back online
		EventManager.observe('online', _ajax.sendCallsInQueue);
	}
	
	/*
	 * Called before request sent
	 */
	this.ajaxBeforeSend = function(x, s) {
		if (app.online.checkStatus()) {
			$(window).overlay({ show: true });
			if (s && s.url) app.startTimer(s.url);
		} else {
			if (s['offline']) {
				_ajax.addToQueue(s);
			} else {
				$(window).overlay({ 
					show: true,
					delay: 2000,
					msg: 'Feature is disabled when offline!'
				});
			}
		}
	} 

	/*
	 * Called once received any response
	 */
	this.ajaxComplete = function(e, x, s) {
		if (app.online.status) {
			_ajax.ajaxResponseLog(e);
			_ajax.trackRequest(x, this.url);
			app.endTimer(this.url);
			$(window).overlay({
				show: false, 
				delay: 0 
			});
		}
	}

	/*
	 * Called if error response
	 */
	this.ajaxError = function() {
		if (app.online.status) {
			$(window).overlay({
				show: true,
				delay: 2000,
				msg: "Sorry, there was an error!"
			});
		}
	}
	
	/*
	 * If user is offline store ajax request
	 */
	this.addToQueue = function(s) {
		_ajax.queue.push(s);
		app.ls.setItem(_ajax.queueStorageId, _ajax.queue);
	}

	/*
	 * If user is back online send stored ajax request
	 */
	this.sendCallsInQueue = function() {
		var queueLength = _ajax.queue.length;
		if (queueLength == 0) {
			$(window).overlay({ show: false });
			return false;
		}
		var ajaxParams = _ajax.queue[0];
		
		$(window).overlay({
			show: true,
			delay: 999999999,
			msg: "You are now back online.<br><br>Saving Data!"
		});
		
		$.ajax(ajaxParams)
		.always(function() {
			// Remove call
			_ajax.queue.shift();
			
			// Save new list of calls
			app.ls.setItem(_ajax.queueStorageId, _ajax.queue);
			_ajax.sendCallsInQueue();
		});
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
				if (typeof e.responseText == 'string') { 
					console.log('Response:', $.parseJSON(e.responseText)); 
				} else {
					console.log('Response:', e.responseText)
				}
			}
		} catch (e) { console.log('Response: ERROR'); }
	}
}