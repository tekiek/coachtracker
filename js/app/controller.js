app['controller'] = new function() {
	_controller = this;
	this.firstScreen = 'menu';
	this.screenListOrder = [];
	this.subScreen = null;
	
	this.loadFirstScreen = function() {
		var currSlide = _controller.currSlide();
		if (currSlide) currSlide.els['parent'].empty();
		
		_controller.screenListOrder = [];
		_controller.screenListOrder.push(app[_controller.firstScreen]);

		app.header.destroy();
		_controller.showSlide();

		// Lazy Load Files
		if (typeof lazyLoadJs != 'undefined') app.lazyLoadFiles(lazyLoadJs);
	}
	
	this.nextSlide = function(nextSlide) {
		var currSlide = _controller.currSlide();

		nextSlide.els['parent'].empty();
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
		var speed = 'default',
			animation = 'slideOutRight';

		window.scrollTo(0, 0);
		app.global.spinner({ show: true });
		app.header.destroy(animation, speed);

		app.global.animate(currSlide.els['parent'], animation, speed, function() {
			currSlide.els['parent'].empty();
			_controller.showSlide();
		});
	}

	
	this.showSlide = function() {
		var speed = 'default',
			animation = 'slideInLeft',
			currSlide = _controller.currSlide();

		$.when(currSlide['init']()).done(function() {
			app.header.show(animation, speed);
			app.global.animate(currSlide.els['parent'], animation, speed, function() {
				app.global.spinner(false);
			});
		});
	}
};