var keystone = require('keystone'),
	Professional = keystone.list('Professional');

var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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
			locals.data.professionals = professionals;
			next(err);
		});
	});

	// Render the view
	view.render('lelieu');
};