app['imageAdd'] = new function() {
	_imageAdd = this;
	
	this.els = {
		'parent': $('#user-header')
	}
	
	this.templates = {
		'imgFile'		: '<input name="myfile" data-field="${dbId}" type="file" accept="image/*" capture="camera">',
		'userImage'		: '<img class="user-image" src="' + app.config.studentImagePath + '${userImg}?z=${rndNum}">',
		'userHeadline'	: '<div class="user-headline"><div class="userBgImg"></div></div>',
		'backgroundImg'	: '',
		'userDetails'	: '<span class="user-details text-shadow">${fname} ${lname}<br>${email}</span>',
		'userWrapper'	: '<div class="user-wrapper"></div>'
	}
	
	this.template_data = {
		'uploadBtn': {
			'color'			: 'btn-default',
			'btnSize'		: 'btn-lg',
			'icon'			: 'fa-camera',
			'iconSize'		: 'fa-lg',
			'text'			: 'Add Photo',
			
		},
	}
	
	this.cacheBuster = function() {
		return Math.floor((Math.random()*100));
	}

	/*
	 * Add User Images
	 * Params:
	 * - user (obj)
	 * - appendTo (el)
	 */
	this.addUserImage = function(params) {
		var image = $.tmpl(_imageAdd.templates.userImage, $.extend({}, params.user, { rndNum: _imageAdd.cacheBuster() }) ),
			uploadBtn = $.tmpl(app.global.templates.button, _imageAdd.template_data.uploadBtn),
			userHeadline = $.tmpl(_imageAdd.templates.userHeadline),
			userWrapper = $.tmpl(_imageAdd.templates.userWrapper),
			userDetails = $.tmpl(_imageAdd.templates.userDetails, {
				fname: params.user.fname,
				lname: params.user.fname,
				email: params.user.email
			});

		$(window).scroll(function() {
			st = $(this).scrollTop();
			if (st > 200 ) {
				$('.userBgImg').removeAttr('class').addClass('userBgImg blur4')
			}
			else if (st > 150 ) {
				$('.userBgImg').removeAttr('class').addClass('userBgImg blur3')
			}
			else if (st > 100 ) {
				$('.userBgImg').removeAttr('class').addClass('userBgImg blur2')
			}
			else if (st > 50 ) {
				$('.userBgImg').removeAttr('class').addClass('userBgImg blur1')
			}
		})

		userWrapper
			.append(image)
			.append(userDetails);
		userHeadline
			.append(userWrapper);
			

		// Add to DOM
		var a = $('<div style="background-color: #f7f7f7 !important;"></div>');
		a
			.append(uploadBtn)
			.append(params['appendTo'].html());
			
		params['appendTo'].empty();
		
		
		params['appendTo']
			.append(userHeadline)
			.append(a);

		app.imageAdd.createUploadBtn({
			btnEl: uploadBtn,
			imgEl: image,
			user: params.user
		});
	}
	
	this.addScrollBlur

	/*
	 * Create upload button for new user image
	 * Params:
	 * - btnEl (el)
	 * - imgEl (el)
	 * - user (obj)
	 */
	this.createUploadBtn = function(params) {
		var uploadBtn = $(params.btnEl),
			imgFile = $.tmpl(_imageAdd.templates.imgFile, params);

		// Add UI
		imgFile.insertAfter(uploadBtn);

		// Add Events
		uploadBtn.click(function() {
			imgFile.trigger('click');
		});

		imgFile.on("change", {
			imgEl: params.imgEl,
			user: params.user
		}, _imageAdd.gotPic);
	}

	/*
	 * Save uploaded user image
	 * Params:
	 * - imgEl (el)
	 * - user (obj)
	 */
	this.gotPic = function(e) {
		var file = event.target.files[0],
			imgEl = e.data.imgEl,
			params = e.data;

		if (file.type.indexOf("image/") > -1) {
			_imageAdd.saveUserImage({
				file	: file,
				imgEl	: params.imgEl,
				user	: params.user
			});
		}
	}

	/*
	 * Save uploaded user image
	 * Params:
	 * - file (file)
	 * - imgEl (el)
	 * - user (obj)
	 */
	this.saveUserImage = function(params) {
		var data = new FormData(),
			imgEl = params.imgEl,
			file = params.file,
			prevSrc = imgEl.data('prevsrc'),
			user = params.user;

		// Image
		if (file) {
			data.append('myfile', file);
			data.append('extension', app.global.fileExtension(file.name));
			data.append('id', user.id);
		} else {
			return false;
		}
		
		$.ajax({
			type: "POST",
			url: "backend/forms/student_field_update.php",
			data: data,
			dataType: 'json',
			processData: false,
			contentType: false,
			offline: false
		})
		.done(function(response) {
			if (response.success == 'true') {
				var imgSrc = app.config.studentImagePath + response.value + "?z=" + _imageAdd.cacheBuster();

				imgEl.attr('src', imgSrc);
				params.user[response.field] = response.value;
				app.login.saveUserData();

				app.global.alert({
					msg	:'Saved', 
					icon: 'fa-check-circle'
				});
			}
		});
	}
};