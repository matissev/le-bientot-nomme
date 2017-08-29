var keystone = require('keystone'),
	request = require('request');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.responses = {
		success : false,
		invalidEmail : false,
		missingFields : false,
		invalidCaracters : false,
		failure : false
	};

	view.on('post', { action: 'newsletter' }, function (next) {
		var formErrors = validateForm(req.body);

		if (formErrors.length && req.body.ajax) {
			return res.send(formErrors);
		} else if (formErrors.length && !req.body.ajax) {
			formErrors.forEach(function(error){
				locals.responses[error] = true;
			});
		} else {
			mailchimpAdd(req.body, function(response) {
				if(response === 'success') {
					if(req.body.ajax) {
						return res.status(200).send(['success']); // AJAX	
					} else {
						locals.responses.success = true; // STANDARD QUERY
					}
				} else {
					if(req.body.ajax) {
						return res.send(['failure']); // AJAX
					} else {
						locals.responses.failure = true; // STANDARD QUERY
					}
				}
			});
		}

		if(!req.body.ajax) {
			next();
		}
	});

	// Render the view
	view.render('newsletter');
};

function validateForm(data) {
	var emailFilter  = /^[^@]+@[^@.]+\.[^@]*\w\w$/,
		illegalChars = /[\(\)\\<\>\,\;\:\\\"\[\]]/,
		empty = /^\s*$/,
		savedErrors = [];

	if (data.email.match(empty))
		savedErrors.push('missingFields');

	if (!data.email.match(empty) && !emailFilter.test(data.email.replace(/^\s+|\s+$/, '')))
		savedErrors.push('invalidEmail');

	if (!data.email.match(empty) && data.email.match(illegalChars))
		savedErrors.push('invalidCharacters');

	return savedErrors;
}

function mailchimpAdd(req, cb) {
	var subscriber = JSON.stringify({
		"email_address": req.email,
		"status": "subscribed",
		"merge_fields": {
			"FNAME": req.fname,
			"LNAME": req.lname
		}
	});

	request({
		method: 'POST',
		url: 'https://us16.api.mailchimp.com/3.0/lists/' + process.env.MAILCHIMP_LISTID + '/members',
		body: subscriber,
		headers: {
			Authorization: 'apikey ' + process.env.MAILCHIMP_APIKEY,
			'Content-Type': 'application/json'
		}
	}, function(error, response, body) {
		if (error) {
			cb('error');
		} else {
			cb('success');
		}
	});
}