app['acl'] = new function() {
	_acl = this;
	this.acls = ['loggedIn', 'loggedOut', 'admin', 'coach', 'counselor', 'connect', 'upload'];
	this.can = [];

	this.add = function(acl) {
		_acl.can.push(acl);
		app.global.els.body.addClass('acl-can-' + acl);
	}

	this.remove = function(acl) {
		_acl.can = $.grep(_acl.can, function(value) {
		  return value != acl;
		});
		app.global.els.body.removeClass('acl-can-' + acl);
	}
	
	this.has = function(acl) {
		return $.inArray(acl, _acl.can) >= 0 ? true : false;
	}
}