var keystone = require('keystone'),
	_ = require('lodash'),
	moment = require('moment'),
	Event = keystone.list('Event'),
	EventCategory = keystone.list('EventCategory'),
	PageAgenda = keystone.list('PageAgenda'),
	PageContact = keystone.list('PageContact');

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
	locals.section = 'agenda';
	locals.data = {
		agenda: [],
		eventCategories: [],
		contact: [],
		agendaMeta: []
	};

	view.on('init', function (next) {
		Event.model.find()
			.populate('category')
			.sort('startDate')
			.exec(function (err, events) {
				var agenda = [];

				if(events.length) {
					var now = new Date();
					var thisMonth = now.getMonth() + 1; // Date().getMonth() starts at 0
					var thisYear = now.getFullYear();
					var thisMonthId = thisYear * 12 + thisMonth;

					// ATTACH MONTH IDs ON EACH EVENT
					events.forEach(function(event) {
						var eventMonth = event._.startDate.moment().month() + 1; // moment().month starts at 0
						var eventYear = event._.startDate.moment().year();
						event.monthId = eventYear * 12 + eventMonth;
					});

					// FILTER 6 MONTHS
					var sixMonths = events.filter(function(event) {
						// 5 because it doesn't count the current month
						return event.monthId >= thisMonthId && event.monthId - thisMonthId <= 11;
					});

					// BUILD THE EVENT TABLE
					if (sixMonths.length) {
						var lastEvent = sixMonths[sixMonths.length - 1]; // Define size
						for(var i = 0; i <= lastEvent.monthId - thisMonthId; i++) { // Add month number
							agenda[i] = {
								monthName: monthsNames[(thisMonth - 1 + i) % 12], // Thug life (01:50 a.m)
								pseudoWeeks: [[],[],[],[]]
							};
						}

						sixMonths.forEach(function(event) {
							var daysInMonth = moment(event.startDate).daysInMonth();
							var weekIndex = Math.floor((moment(event.startDate).format('D') - 1) / (daysInMonth / 4));
							agenda[event.monthId - thisMonthId].pseudoWeeks[weekIndex].push(event); // push events in months
						});
					}
				}

				locals.data.agenda = agenda;
				next(err);
		});
	});


	view.on('init', function (next) {
		EventCategory.model.find().exec(function (err, categories) {
			locals.data.eventCategories = categories;
			next(err);
		});
	});

	view.on('init', function (next) {
		PageContact.model.find().exec(function(err, content) {
			locals.data.contact = content[0];
			next(err);
		});
	});

	view.on('init', function (next) {
		PageAgenda.model.find().exec(function(err, content) {
			locals.data.agendaMeta = content[0];
			next(err);
		});
	});


	// Render the view
	view.render('agenda');
};
