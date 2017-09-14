var keystone = require('keystone'),
	PageContact = keystone.list('PageContact'),
	PageLesoin = keystone.list('PageLesoin'),
	Professional = keystone.list('Professional');

var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'lesoin';
	locals.data = {
		professionals: [],
		contact: [],
		lesoin: []
	};

	view.on('init', function (next) {
		Professional.model.find().exec(function(err, professionals) {
			professionals.forEach(function(professional){
				professional.timetable = [];
				for(var i = 0; i < days.length; i++) {
					professional.timetable.push({
						value: professional.schedule[days[i]].value,
						label: Professional.fields['schedule.' + days[i] + '.value'].options.label,
						schema: professional.schedule[days[i]].microdata
					});
				}
			});

			// var professionalsTable = [];

			// while(professionals.length) {
			// 	var row = [];
			// 	for(var x = 0; x < 3 && professionals.length; x++) {
			// 		row.push(professionals.shift());
			// 	}
			// 	professionalsTable.push(row);
			// }

			locals.data.professionals = professionals;
			next(err);
		});
	});

	view.on('init', function (next) {
		PageLesoin.model.find().exec(function(err, content) {
			locals.data.lesoin = content[0];
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
	view.render('lesoin');
};