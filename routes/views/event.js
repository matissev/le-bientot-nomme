var keystone = require('keystone'),
	PageContact = keystone.list('PageContact'),
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
		events: [],
		contact: []
	};

	view.on('init', function(next) {
		Event.model.findOne({
			slug: locals.filters.event
		}).populate('category')
		  .exec(function(err, event) {
			locals.data.event = event;
			next(err);
		});
	});

	view.on('init', function(next) {
		PageContact.model.find().exec(function(err, content) {
			locals.data.contact = content[0];
			next(err);
		});
	});

	// Render the view
	view.render('event');
};