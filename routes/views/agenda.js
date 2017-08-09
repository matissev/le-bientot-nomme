var keystone = require('keystone');

exports = module.exports = function(req, res){
	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'agenda';

	view.query('agenda', keystone.list('Event').model.find());

	view.render('agenda');
};