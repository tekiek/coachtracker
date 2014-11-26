app['acl'] = new function() {
	_acl = this;
	this.acls = ['loggedin', 'admin', 'coach', 'counselor'];
	this.can = [];

	this.add = function(acl) {
		console.log('ADD ACL:', acl);
		_acl.can.push(acl);
		$('body').addClass('acl-can-' + acl);
	}

	this.remove = function(acl) {
		console.log('REMOVE ACL:', acl);
		_acl.can = $.grep(_acl.can, function(value) {
		  return value != acl;
		});
		$('body').removeClass('acl-can-' + acl);
	}
	
	this.has = function(acl) {
		return $.inArray(acl, _acl.can) >= 0 ? true : false;
	}
}