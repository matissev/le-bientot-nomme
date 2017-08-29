var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry'),
	User = keystone.list('User'),
	pug = require('pug'),
	moment = require('moment'),
	nodemailer = require('nodemailer');
	require('dotenv').config();

var transporter = nodemailer.createTransport({
	service:"Gmail",
	auth:{
		type: 'OAuth2',
		user: process.env.MAIL_USER,
		clientId: process.env.MAIL_CLIENT_ID,
		clientSecret: process.env.MAIL_CLIENT_SECRET,
		refreshToken: process.env.MAIL_REFRESH_TOKEN
	}
});

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'contact';

	locals.responses = {
		success : false,
		invalidEmail : false,
		missingFields : false,
		invalidCaracters : false,
		failure : false,
		invalidPhone : false
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

		if(!formErrors.length) {
			var newEnquiry = new Enquiry.model();
			var updater = newEnquiry.getUpdateHandler(req);

			updater.process(req.body, {
				fields: 'name, email, phone, subject, message'
			}, function (err) {
				if (err) {
					// ======== If the query ERRORS

					if(req.body.ajax) {
						return res.send(['failure']); // AJAX
					} else {
						locals.responses.failure = true; // STANDARD QUERY
					}
				} else {
					// ======== If the query is a SUCCESS

					var recipients = [];

					User.model.find({
						getsMessages: true
					}).exec(function (err, users) {
						users.forEach(function(user){
							recipients.push(user.email);
						});

						if(recipients.length) {
							sendMail(req.body, recipients, function(result){
								if(result === 'error') {
									locals.responses.failure = true; // ONLY IF THE MAIL ERRORS
								}
							});
						}
					});

					if(req.body.ajax) {
						return res.status(200).send(['success']); // AJAX
					} else {
						locals.responses.success = true; // STANDARD QUERY
					}
				}
			});
		}

		if(!req.body.ajax) {
			next();
		}
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

function sendMail(enquiry, recipients, cb) {
	enquiry.date = moment().locale('fr').format('[Le ]D MMMM YYYY[ à ]HH[h]mm');

	transporter.sendMail({
		from: enquiry.name + '<' + enquiry.email + '>',
		to: recipients,
		subject: enquiry.subject,
		html: pug.renderFile('templates/layouts/email.pug', {
			enquiry: enquiry,
			env: process.env
		})
	}, function(error, response){
		if (error) {
			cb('error');
		}
		transporter.close();
	});
}
