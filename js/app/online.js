app['online'] = new function() {
	_online = this;
	this.delay = 3000; // 30seconds
	this.status = null;
	
	this.init = function() {
		setInterval(function() {
			var prevStatus = _online.status,
				currStatus = _online.checkStatus();

			if (currStatus != prevStatus) {
				_online.toggleStatus(currStatus);
			}
		}, _online.delay)
	}
	
	this.toggleStatus = function(online) {
		app.global.els.body[online ? 'removeClass' : 'addClass']('offline');
		_online.status = online;
		EventManager.fire(online ? 'online' : 'offline');
		console.log('Is Online:', online);
	}
	
	this.checkStatus = function() {
		// Handle IE and more capable browsers
		var xhr = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );
		var status;
		var server = window.location.hostname;
		if (window.location.port != '') server += ':'+window.location.port;

		// Open new request as a HEAD to the root hostname with a random param to bust the cache
		xhr.open( "HEAD", "//" + server + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false );

		// Issue request and handle response
		try {
			xhr.send();
			return ( xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 );
		} catch (error) {
			return false;
		}
	}

};