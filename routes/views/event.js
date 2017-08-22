var keystone = require('keystone'),
	Event = keystone.list('Event');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'agenda';
	locals.filters = {
		event: req.params.event
	};
	locals.data = {
		events: []
	};

	view.on('init', function(next) {
		Event.model.findOne({
			slug: locals.filters.event
		}).exec(function(err, event) {
			locals.data.event = event;
			next(err);
		});
	});

	// Render the view
	view.render('event');
};