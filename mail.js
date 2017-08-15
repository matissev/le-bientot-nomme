
var email = require('keystone-email');
require('dotenv').config();

new email('templates/layouts/email.pug', {
	transport: 'mailgun',
}).send({
	apiKey: process.env.APIKEY,
	domain: process.env.MAILGUN_URL,
	to: process.env.MAIL_RECEIVER,
	from: {
		name: 'Le Site du Bientôt Nommé',
		email: 'hezfahjzf@laposte.net',
	},
	subject: 'Your first KeystoneJS email',
}, function (err, result) {
	if (err) {
		console.error('🤕 Mailgun test failed with error:\n', err);
	} else {
		console.log('📬 Successfully sent Mailgun test with result:\n', result);
	}
});