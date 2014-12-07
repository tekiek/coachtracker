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
		console.log(x, s);
		if (app.online.checkStatus()) {
			$(window).overlay({ show: true });
		} else {
			_ajax.addToQueue(s);
		}
	} 

	/*
	 * Called once received any response
	 */
	this.ajaxComplete = function(e, x, s) {
		if (app.online.status) {
			_ajax.ajaxResponseLog(e);
			_ajax.trackRequest(x, this.url);
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
	
	this.addToQueue = function(s) {
		// _ajax.queue.push(s);
		// app.ls.setItem(_ajax.queueStorageId, _ajax.queue);
		// $(window).overlay({
		// 	show: true,
		// 	delay: 2000,
		// 	msg: "You are offline. We will try to save once you are back online."
		// });
	}
	
	this.sendCallsInQueue = function() {
		// var queueLength = _ajax.queue.length;
		// if (queueLength == 0) return false;
		
		// app.global.dialogConfirm({
		// 	msg: "You have unsaved data. Would you like to save the data now?"
		// })
		// $.ajax(ajaxParams)
		// 	.done()
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