app['fieldsStudent'] = {
	'fname': {
		'type'			:'input',
		'inputType'		: 'text',
		'placeholder'	:'First Name',
		'mask'			: null,
		'dbId'			: 'fname',
		'validLength'	: 3,
		'icon'			:'user',
		'gtAct'			: 'fname'
	},
	'lname': {
		'type'			:'input',
		'inputType'		: 'text',
		'placeholder'	:'Last Name',
		'mask'			: null,
		'dbId'			: 'lname',
		'validLength'	: 3,
		'icon'			:'user',
		'gtAct'			: 'lname'
	},
	'cbo': {
		'type'			:'input',
		'inputType'		: 'text',
		'placeholder'	:'CBO',
		'mask'			: null,
		'dbId'			: 'cbo',
		'validLength'	: 3,
		'icon'			:'plug',
		'gtAct'			: 'cbo'
	},
	'email': {
		'type'			:'input',
		'inputType'		: 'email',
		'placeholder'	:'Email address',
		'mask'			: null,
		'dbId'			: 'email',
		'validLength'	: 5,
		'icon'			:'envelope-o',
		'gtAct'			: 'email'
	},
	'phone': {
		'type'			:'input',
		'inputType'		: 'tel',
		'placeholder'	:'Phone Number',
		'mask'			: '(999) 999-9999',
		'dbId'			: 'phone',
		'validLength'	: 14,
		'icon'			:'phone',
		'gtAct'			: 'phone'
	},
	'contact': {
		'type'			:'select',
		'dbId'			: 'contact',
		'icon'			:'comments-o',
		'gtAct'			: 'contact',
		'options'		: {
			0			: 'Preferred Contact',
			'phone'		: 'Prefer text',
			'email'		: 'Prefer email'
		}
	},
	'school': {
		'type'			:'input',
		'inputType'		: 'text',
		'placeholder'	:'High School',
		'mask'			: null,
		'dbId'			: 'school',
		'validLength'	: 0,
		'icon'			:'graduation-cap',
		'autocomplete'	: 'backend/forms/school_search.php',
		'gtAct'			: 'school'
	},
	'college': {
		'type'			:'input',
		'inputType'		: 'text',
		'placeholder'	:'College Attending',
		'mask'			: null,
		'dbId'			: 'college',
		'validLength'	: 0,
		'icon'			:'university',
		'autocomplete'	: 'backend/forms/college_search.php',
		'gtAct'			: 'college'
	},
	'notes': {
		'type'			:'textarea',
		'placeholder'	:'Notes',
		'mask'			: null,
		'dbId'			: 'notes',
		'validLength'	: 0,
		'icon'			:'file-o',
		'gtAct'			: 'notes'
	}
};