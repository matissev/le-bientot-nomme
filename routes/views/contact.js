var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry'),
	email = require('keystone-email');
	require('dotenv').config();

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'contact';
	locals.formData = req.body || {};

	locals.responses = {
		success : false,
		invalidEmail : false,
		missingFields : false,
		invalidCaracters : false,
		failure : false
	};

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {
		var formErrors = validateForm(req.body);

		if (formErrors.length && req.body.ajax) {
			return res.send(formErrors);
		} else if (formErrors.length && !req.body.ajax) {
			formErrors.forEach(function(error){
				locals.responses[error] = true;
			});
		}

		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);

		// new email('mail.pug', {
		// 	transport: 'mailgun',
		// }).send({
		// 	apiKey: process.env.APIKEY,
		// 	domain: process.env.MAILGUN_URL,
		// 	to: process.env.MAIL_RECEIVER,
		// 	from: {
		// 		name: 'Website',
		// 		email: 'website@mail.com',
		// 	},
		// 	subject: 'Your first KeystoneJS email',
		// }, function (err, result) {
		// 	if (err) {
		// 		console.error('🤕 Mailgun test failed with error:\n', err);
		// 	} else {
		// 		console.log('📬 Successfully sent Mailgun test with result:\n', result);
		// 	}
		// });

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, subject, message',
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if(req.body.ajax) {
				if (err) {
					return res.send(['failure']);
				} else {
					return res.status(200).send(['success']);
				}	
			} else {
				if (err) { // every errors accessible with : err.errors
					locals.responses.failure = true;
				} else {
					locals.responses.success = true;
				}
			}
			next();
		});
	});

	view.render('contact');
};

function validateForm(data) {
	var emailFilter  = /^[^@]+@[^@.]+\.[^@]*\w\w$/,
		illegalChars = /[\(\)\\<\>\,\;\:\\\"\[\]]/,
		rgxPhonePal = /0[1-9]([-. ]?[0-9]){8}/,
		rgxPhoneUs = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
		empty = /^\s*$/,
		savedErrors = [];

	if (data.name.match(empty) || data.email.match(empty) || data.subject.match(empty) || data.message.match(empty))
		savedErrors.push('missingFields');

	if (!data.email.match(empty) && !emailFilter.test(data.email.replace(/^\s+|\s+$/, '')))
		savedErrors.push('invalidEmail');

	if (!data.phone.match(empty) && !data.phone.match(rgxPhonePal) && !data.phone.match(rgxPhoneUs))
		savedErrors.push('invalidPhone');

	if (!data.email.match(empty) && data.email.match(illegalChars))
		savedErrors.push('invalidCharacters');
	return savedErrors;
}
