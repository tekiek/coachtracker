app['acl'] = new function() {
	_acl = this;
	this.acls = ['loggedin', 'admin', 'coach', 'counselor', 'connect'];
	this.can = [];
	this.els = {
		body	: $('body')
	};

	this.add = function(acl) {
		console.log('ADD ACL:', acl);
		_acl.can.push(acl);
		_acl.els.body.addClass('acl-can-' + acl);
	}

	this.remove = function(acl) {
		console.log('REMOVE ACL:', acl);
		_acl.can = $.grep(_acl.can, function(value) {
		  return value != acl;
		});
		_acl.els.body.removeClass('acl-can-' + acl);
	}
	
	this.has = function(acl) {
		return $.inArray(acl, _acl.can) >= 0 ? true : false;
	}
}