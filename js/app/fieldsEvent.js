app['fieldsEvent'] = {
	'timestamp': {
		'type'			:'input',
		'inputType'		:'pickadate',
		'classes'		:'pickadate',
		'dbId'			:'timestamp',
		'icon'			:'calendar',
		'gtAct'			:'date'
	},
	'location': {
		'type'			:'multi',
		'dbId'			: 'location',
		'icon'			:'fax',
		'gtAct'			:'location',
		'validLength'	: 1,
		'maxLength'		: 1,
		'options'		: {
			'call'			: 'Call',
			'cbo-office'	: 'CBO Office',
			'college-campus': 'College Campus',
			'email'			: 'Email',
			'facebook'		: 'Facebook',
			'high-school'	: 'High School',
			'text'			: 'Text',
			'Workshop/Event': 'Workshop/Event',
			'other'			: 'Other'
		}
	},
	'duration': {
		'type'			:'multi',
		'dbId'			: 'duration',
		'icon'			:'clock-o',
		'gtAct'			:'duration',
		'validLength'	: 1,
		'maxLength'		: 1,
		'options'		: {
			'00:00'	: '0M',
			'00:05'	: '5M',
			'00:10'	: '10M',
			'00:15'	: '15M',
			'00:20'	: '20M',
			'00:30'	: '30M',
			'00:45'	: '45M',
			'01:00'	: '60M',
			'01:15'	: '75M',
			'01:30'	: '90M',
			'02:00'	: '120M',
			'02:30'	: '150M',
			'03:00'	: '180M'
		}
	},
	'reason': {
		'type'			:'multi',
		'validLength'	: 1,
		'dbId'			:'reason',
		'icon'			:'bullseye',
		'gtAct'			:'reason',
		'options'	: {
			'Financial Aid'				: 'Financial Aid',
			'Money Issues'				: 'Money Issues',
			'Family/Personal'			: 'Family/Personal',
			'Academic Support'			: 'Academic Support',
			'Campus Life'				: 'Campus Life',
			'Job Hunt'					: 'Job Hunt',
			'Planning Coursework'		: 'Student Schedule',
			'Technical Difficulties' 	: 'Technical Difficulties'
		}
	},
	'notes': {
		'type'			:'textarea',
		'placeholder'	:'What did you talk about?',
		'mask'			: null,
		'dbId'			: 'notes',
		'validLength'	: 0,
		'icon'			:'comment-o',
		'gtAct'			:'notes'
	}
};