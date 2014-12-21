var tools = new function() {
	_tools = this;
	this.els = {};
	
	this.config = {
		env: (document.domain == 'localhost' ? 'dev' : 'prod'),
		backendPath: window.location.origin + "/backend"
	}
	
	this.init = function() {
		_tools.els['body'] = $('body');
		_tools.ajaxInit();

		$(window).overlay({ 
			show: true,
			cb: _tools.loadTool
		});
	}
	
	this.loadTool = function() {
		if (_tools.els['body'].hasClass('connection')) _tools.connection.init();
		if (_tools.els['body'].hasClass('export')) _tools.dataExport.init();
		if (_tools.els['body'].hasClass('upload')) _tools.upload.init();
		if (_tools.els['body'].hasClass('reports')) _tools.reports.init();
	}
	
	this.ajaxInit = function() {
		$.ajaxSetup({
			beforeSend: function(x, s) {
				$(window).overlay({ show: true });
			},
			complete: function(e, x, s) {
				$(window).overlay({show: false, delay: 250 });
				_tools.ajaxResponseLog(e);
			},
			success: function() {}
		});
	}
	
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

}();
$(document).ready(tools.init);