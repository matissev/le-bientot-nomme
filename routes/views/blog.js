var keystone = require('keystone'),
	_ = require('lodash');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'blog';
	locals.data = {
	};

	view.query('blog', keystone.list('Post').model.find());

	// Render the view
	view.render('blog');
};