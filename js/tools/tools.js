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

		$(window).overlay({ show: true });
		if (_tools.els['body'].hasClass('connection')) _tools.connection.init();
		if (_tools.els['body'].hasClass('export')) _tools.dataExport.init();
		if (_tools.els['body'].hasClass('upload')) _tools.upload.init();
	}
	
	this.ajaxInit = function() {
		$.ajaxSetup({
			beforeSend: function(x, s) {
				$(window).overlay({ show: true });
			},
			complete: function(e, x, s){
				$(window).overlay({show: false, delay: 250 });
			},
			success: function() {}
		});
	}

}();
$(document).ready(tools.init);