app['gtrack'] = new function() {
	_gtrack = this;
	this.trackable_tags = ["a", "input", "button", "i", "textarea", "select"];
	
	this.init = function() {
		$.each(_gtrack.trackable_tags, function(x, selector) {
			$(document.body).on('click', selector, function(event) {
				var el = $(event.currentTarget).closest(selector)[0];
				_gtrack.click(el);
			});
		})
		
	}

	this.click = function(el) {
		var gt_cat = 'app',
			gt_act = $(el).attr('data-action'),
			gt_label = $(el).attr('data-label');

		// Category
		if (_gtrack.cat(el)) gt_cat += ":" + _gtrack.cat(el);

		// Action
		if (!gt_act) gt_act = $(el).prop('tagName').toLowerCase();
		gt_act = 'click:' + gt_act;

		_gtrack.track_event(gt_cat, gt_act, gt_label);
	}
	
	this.cat = function(element) {
		try {
			var count = 0, max = 99;
			while (element != document && count < max) {
				var parent = $(element).parents();
				if (parent.attr('data-category')) {
					return parent.attr('data-category'); 
				} else {
					element = parent; 
					count++; 
				}
			}
			return null;
		} catch(e) {return null;}
	}

	this.track_event = function(category, action, label) {
		if ( typeof category == 'undefined' || !category ) category = '';
		if ( typeof action == 'undefined' || !action ) action = '';
		if ( typeof label == 'undefined' || !label ) label = '';

		if (typeof ga != 'undefined' && app.config.env != 'dev') {
			ga('send', 'event', category, action, label);
		} else {
			console.log('GA Event:', category, action, label);
		}
	}


}