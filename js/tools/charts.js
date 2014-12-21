tools['charts'] = new function() {
	_charts = this;
	
	this.templates = {
		div		: '<div class="${classes}"></div>',
		canvas	: '<canvas id="poop" width="${width}" height="300"></canvas>',
		title	: '<h1>${title}</h1>'
	}
	
	this.colors = ['#F7464A', '#46BFBD', '#FDB45C', '#FF1A00', '#008C00', '#CC0000', '#4096EE', '#FF0084', '#B02B2C', '#3F4C6B', '#6BBA70', '#D01F3C', '#356AA0']
	
	/*
	 * @params:
	 *  - type (string)
	 *  - title (string)
	 *  - data (obj)
	 *  - appendTo (el)
	 */
	this.create = function(params) {
		var wrapper = $.tmpl(_charts.templates.div, { 
				classes: 'field_wrapper chartWrapper' 
			}),
			title = $.tmpl(_charts.templates.title, { 
				title: params.title 
			}),
			canvas = $.tmpl(_charts.templates.canvas, {
				width: ($('body').width()) - 40
			}),
			ctx = canvas.get(0).getContext("2d");
		
		// Add to DOM
		wrapper
			.append(title)
			.append(canvas);
		$(params.appendTo).append(wrapper);
		
		_charts[params.type]({
			'ctx': ctx,
			'data': params.data
		});
	}
	
	/*
	 * @params:
	 *  - ctx (obj)
	 *  - data (obj)
	 */
	this.pie = function(params) {
		$.each(params.data, function(x, d) {
			params.data[x]['color'] = _charts.colors[x];
			params.data[x]['labelFontSize'] = "16";
			params.data[x]['labelColor'] = "white";
		})
		new Chart(params.ctx).Pie(params.data);
	}
	
	/*
	 * @params:
	 *  - ctx (obj)
	 *  - data (obj)
	 */
	this.bar = function(params) {
		var labels = [],
			datasets = [{
				data: [],
				
			}],
			max = 0;

		$.each(params.data, function(x, d) {
			max = Math.max(max, d.value);
			
			labels.push(d.label);
			datasets[0]['data'].push(d.value);
		});
		
		datasets[0]['fillColor'] = "rgba(220,220,220,0.5)";
		datasets[0]['strokeColor'] = "rgba(220,220,220,0.8)";
		datasets[0]['highlightFill'] = "rgba(220,220,220,0.75)";
		datasets[0]['highlightStroke'] = "rgba(220,220,220,1)";
		
		new Chart(params.ctx).Bar({
			labels: labels,
			datasets: datasets
		}, {
			scaleOverride: true,
			scaleSteps: 10,
			scaleStepWidth: Math.ceil(max/9),
			scaleStartValue: 0,
			scaleGridLineColor : "rgba(0,0,0,.05)",
		 
		});
	}

}();