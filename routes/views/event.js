var keystone = require('keystone');

var monthsNames = [
	'janvier',
	'février',
	'mars',
	'avril',
	'mai',
	'juin',
	'juillet',
	'août',
	'septembre',
	'octobre',
	'novembre',
	'décembre'
];

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
		}).exec(function(err, event) {
			event.monthName = monthsNames[event._.startDate.moment().month()];
			locals.data.event = event;
			next(err);
		});
	});

	// Render the view
	view.render('event');
};