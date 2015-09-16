app['controller'] = new function() {
	_controller = this;
	this.firstScreen = null;
	this.screenListOrder = [];
	this.subScreen = null;
	this.animate = {
		'speed': 'default',
		'in': 'slideInLeft',
		'out': 'slideOutRight'
	}
	
	this.init = function() {
		_controller.firstScreen = $('body').attr('data-firstScreen')
	}
	
	this.loadFirstScreen = function() {
		
		var currSlide = app[_controller.firstScreen]; //_controller.currSlide();
		console.log(_controller.firstScreen);
		//console.log('currSlide', currSlide);
		//if (currSlide) currSlide.els['parent'].empty();
		
		_controller.screenListOrder = [];
		_controller.screenListOrder.push(currSlide);

		//_controller.showSlide();
		currSlide['init']()
		EventManager.fire('loadFirstScreen');
	}
	
	/*
	 * Move forward to a new slide
	 */
	this.nextSlide = function(nextSlide) {
		var currSlide = _controller.currSlide();

		_controller.screenListOrder.push(nextSlide);
		_controller.slideTransfer(currSlide, nextSlide);
	}
	
	this.prevSlide = function() {
		var currSlide = _controller.currSlide();
		_controller.screenListOrder.pop();
		var nextSlide = _controller.currSlide();

		_controller.slideTransfer(currSlide, nextSlide);
	}
	
	this.currSlide = function() {
		return _controller.screenListOrder[_controller.screenListOrder.length - 1];
	}
	
	this.slideTransfer = function(currSlide, nextSlide) {

		// Setup transfer
		app.header.destroy(_controller.animate.out, _controller.animate.speed);

		$(document).overlay({ show: true });
		app.global.animate(currSlide.els['parent'], _controller.animate.out, _controller.animate.speed, function() {

			if (currSlide.els['parent']) currSlide.els['parent'].empty();
			currSlide.els = {};
			
			// Show next slide
			_controller.showSlide();
			$(document).overlay({ show: false });
		});
	}

	
	this.showSlide = function() {
		var speed = 'default',
			animation = 'slideInLeft',
			currSlide = _controller.currSlide();

		// Make sure slide is empty
		if (currSlide.els['parent']) currSlide.els['parent'].empty();
		
		// Scroll back to top
		window.scrollTo(0, 0);

		$.when(currSlide['init']()).done(function() {
			app.header.show(_controller.animate.in, _controller.animate.speed);
			app.global.animate(currSlide.els['parent'], _controller.animate.in, _controller.animate.speed, function() {
			});
		});
	}
};