var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry'),
	nodemailer = require('nodemailer');
	require('dotenv').config();

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'contact';
	locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {
		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);

		// send mail with defined transport object
		nodemailer.createTransport({
			sendmail: true
		}).sendMail({
			from: '"Keystone" <foo@blurdybloop.com>', // sender address
			to: process.env.MAIL_RECEIVER, // list of receivers
			subject: 'Hello ✔', // Subject line
			text: 'Hello world ?', // plain text body
			html: '<b>Hello world ?</b>' // html body
		}, (err, info) => {
    		console.log(info.envelope);
    		console.log(info.messageId);
		});

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, enquiryType, message',
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
	});

	view.render('contact');
};
