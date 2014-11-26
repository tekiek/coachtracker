app['fieldsSchedule'] = {
	'meetingTime': {
		'type'			:'input',
		'placeholder'	: 'Meeting time',
		'inputType'		: 'date',
		'dbId'			: 'meetingTime',
		'icon'			:'fa-calendar',
		'validLength'	: 3,
	},
	'meetingReason': {
		'type'			:'textarea',
		'placeholder'	:'Reason for the meeting...',
		'mask'			: null,
		'dbId'			: 'meetingReason',
		'validLength'	: 3,
		'icon'			:'fa-bullseye'
	},
	'reminderType': {
		'type'			:'select',
		'dbId'			: 'reminderType',
		'icon'			:'fa-comments-o',
		'options'		: {
			0			: 'No Reminder',
			'text'		: 'text',
			'email'		: 'email'
		}
	},
	'reminderTime': {
		'type'			:'select',
		'dbId'			: 'reminderTime',
		'icon'			:'fa-clock-o',
		'options'		: {
			'0'	: 'Schedule Reminder',
			'1'	: '1 hour before',
			'2'	: '2 hours before',
			'4'	: '4 hours before',
			'6'	: '6 hours before',
			'24': '1 day before',
			'72': '3 days before'
		}
	},
	'reminderMsg': {
		'type'			:'textarea',
		'placeholder'	:'This is a reminder...',
		'mask'			: null,
		'dbId'			: 'reminderMsg',
		'validLength'	: 3,
		'icon'			:'fa-pencil-square-o'
	},
};