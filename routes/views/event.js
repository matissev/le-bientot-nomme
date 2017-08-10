var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'event';
	locals.filters = {
		event: req.params.event
	};
	locals.data = {
		events: []
	};

	view.on('init', function(next) {
		var q = keystone.list('Event').model.findOne({
			slug: locals.filters.event
		});

		q.exec(function(err, result) {
			locals.data.event = result;
			next(err);
		});
	});

	// Render the view
	view.render('event');
};