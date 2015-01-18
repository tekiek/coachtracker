tools['reports'] = new function() {
	_reports = this;
	this.data = {};

	this.els = {
		'content': $('#content')
	};
	
	this.charts = [
		{
			'api': '_eventCount.php',
			'title': 'Total Meetings',
			'type': 'bar'
		},
		{
			'api': '_eventReasons.php',
			'title': 'Meeting Reasons',
			'type': 'bar'
		},
		{
			'api': '_eventLocations.php',
			'title': 'Meeting Locations',
			'type': 'bar'
		},
		{
			'api': '_eventDurations.php',
			'title': 'Meeting Length',
			'type': 'bar'
		}
	]

	this.init = function() {
		_reports.getChartData();
	}
	
	this.getChartData = function() {
		if (_reports.charts.length <= 0) return false;
		var chartDetails = _reports.charts.shift();

		$.ajax({
			url: chartDetails.api
		})
		.done(function(response) {
			response = $.parseJSON(response);
			console.log(response);
		
			tools.charts.create({
				title: chartDetails.title,
				appendTo: _reports.els.content,
				type: chartDetails.type,
				data: response
			});
			_reports.getChartData();
		});
	}
}();