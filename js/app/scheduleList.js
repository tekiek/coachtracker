app['scheduleList'] = new function() {
	_scheduleList = this;

	this.els = {
		parent: $('div#schedule-list')
	}
	
	this.templates = {
		'boxWrapper'		: '<div class="panel panel-default"></div>',
		'boxTitle'			: '<div class="panel-heading">\
									<h3 class="panel-title">${title}</h3>\
								</div>',
		'boxContent'		: '<div class="panel-body"></div>',
		'scheduleTable'		: '<table class="table"></table>',
		'scheduleHeader'	: '<thead><tr><td>Time</td><td>Student</td></tr></thead>',
		'scheduleContent'	: '<tr><td>${date}</td><td>${student}</td></tr>'
	}
	this.template_data = {}

	this.init = function() {
		_scheduleList.setupHeader()
		_scheduleList.getScheduleData();
	}
	
	this.setupHeader = function() {
		app.header.addBackButton();
		app.header.addUserField();
	}

	this.getScheduleData = function() {
		$.ajax({
			type: "POST",
			url: "backend/forms/get_schedule.php",
			data: { 'userid': app.data.user.id },
			dataType: 'json'
		})
		.done(function(response) {
			_scheduleList.showSchedule(response);
			return;
		});
	}
	
	this.cleanTime = function(time) {
		var date = new Date(time),
			hours = date.getHours(),
			minutes = date.getMinutes(),
			ampm = hours >= 12 ? 'pm' : 'am';

			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0'+minutes : minutes;

		  return (date.getMonth() + 1) + '/' + date.getDate() + ' ' + hours + ':' + minutes + ampm;
	}
	
	this.sortByDate = function(obj1, obj2) {
	    var date1 = new Date(obj1['schedule']['meetingTime']);
	    var date2 = new Date(obj2['schedule']['meetingTime']);
	    return date2 < date1 ? 1 : -1;
	}
	
	this.showSchedule = function(schedules) {

		$.each([1], function(x, date) {
			var boxWrapper = $.tmpl(_scheduleList.templates.boxWrapper),
				boxTitle = $.tmpl(_scheduleList.templates.boxTitle, { 
					title: 'Schedule' 
				}),
				boxContent = $.tmpl(_scheduleList.templates.boxContent),
				scheduleTable = $.tmpl(_scheduleList.templates.scheduleTable),
				scheduleHeader = $.tmpl(_scheduleList.templates.scheduleHeader);

			// Build Table
			$(scheduleTable).append(scheduleHeader)
			$.each(schedules.sort(_scheduleList.sortByDate), function(x, entry) {
				var schedule = entry['schedule'],
					student = entry['student'],
					scheduleContent = $.tmpl(_scheduleList.templates.scheduleContent, { 
						date: _scheduleList.cleanTime(schedule['meetingTime']),
						student: student['fname'] + ' ' + student['lname']
					});

				// Add Row
				$(scheduleTable).append(scheduleContent);
			});
			
			// Add UI
			$(boxContent).append(scheduleTable);
			$(boxWrapper)
				.append(boxTitle)
				.append(boxContent);
			_scheduleList.els['parent']
				.append(boxWrapper);
		});
	}

};