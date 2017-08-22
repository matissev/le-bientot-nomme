var keystone = require('keystone'),
	Professional = keystone.list('Professional'),
	_ = require('lodash');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'lelieu';
	locals.data = {
		professionals: []
	};

	view.on('init', function (next) {
		Professional.model.find().exec(function(err, professionals) {
			locals.data.professionals = professionals;
			next(err);
		});
	});

	// Render the view
	view.render('lelieu');
};
