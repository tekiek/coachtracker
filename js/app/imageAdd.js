app['imageAdd'] = new function() {
	_imageAdd = this;
	this.els = {};
	this.templates = {
		'imgFile'		: '<input name="myfile" data-field="${dbId}" type="file" accept="image" capture="camera">',
		'userImage'		: '<img class="user-image" src="' + app.config.studentImagePath + '${userImg}${cacheBuster}">',
		'cacheBuster'	: '?z=${rndNum}'
	};
	
	this.template_data = {
		'uploadBtn': {
			'color'			: 'btn-default',
			'btnSize'		: 'btn-lg',
			'icon'			: 'fa-camera',
			'iconSize'		: 'fa-lg',
			'text'			: 'Add Photo',
			
		},
		'defaultImg': {
			'icon'			: 'user',
			'classes'		: 'fa-3x user-image'
		}
	};
	
	this.cacheBuster = function(img) {
		if (img.match(/default/)) {
			return "";
		} else {
			return "?z=" + Math.floor((Math.random()*100));
		}
	}

	/*
	 * Add User Images
	 * Params:
	 * - user (obj)
	 * - appendTo (el)
	 */
	this.addUserImage = function(params) {
		var hasImg = (params.user.userImg.indexOf('default') > -1 ? false : true);
			defaultImg = $.tmpl(app.templates.svg, _imageAdd.template_data.defaultImg),
			curImage = $.tmpl(_imageAdd.templates.userImage, $.extend({}, params.user, { cacheBuster: _imageAdd.cacheBuster(params.user.userImg) }) ),
			uploadBtn = $.tmpl(app.templates.button, _imageAdd.template_data.uploadBtn),
			image = (hasImg ? curImage : defaultImg);

		// Add to DOM
		_imageAdd.els.image = image;
		params['appendTo']
			.append(image)
			.append(uploadBtn);

		app.imageAdd.createUploadBtn({
			btnEl: uploadBtn,
			imgEl: image,
			user: params.user
		});
	}

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
				var img = $.tmpl(_imageAdd.templates.userImage, {
					userImg: response.value,
					cacheBuster: _imageAdd.cacheBuster(response.value)
				})
				
				// Update dom
				$(_imageAdd.els.image).replaceWith(img);
				_imageAdd.els.image = img;
				
				// Update data
				params.user[response.field] = response.value;
				app.login.saveUserData();
				app.global.alert({
					msg	:'Saved', 
					icon: 'check-circle'
				});
			}
		});
	}
};