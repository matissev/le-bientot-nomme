var keystone = require('keystone'),
	PageContact = keystone.list('PageContact'),
	PageLeprojet = keystone.list('PageLeprojet');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'leprojet';
	locals.data = {
		professionals: [],
		contact: [],
		leprojet: []
	};

	view.on('init', function (next) {
		PageLeprojet.model.find().exec(function(err, content) {
			locals.data.leprojet = content[0];
			next(err);
		});
	});

	view.on('init', function (next) {
		PageContact.model.find().exec(function(err, content) {
			locals.data.contact = content[0];
			next(err);
		});
	});

	// Render the view
	view.render('leprojet');
};