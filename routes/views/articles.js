var keystone = require('keystone'),
	Post = keystone.list('Post'),
	PageArticle = keystone.list('PageArticle'),
	PageContact = keystone.list('PageContact');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'articles';
	locals.data = {
		contact: [],
		posts: [],
		article: []
	};

	view.on('init', function(next) {
		Post.model.find().exec(function(err, posts) {
			locals.data.posts = posts;
			next(err);
		});
	});

	view.on('init', function(next) {
		PageArticle.model.find().exec(function(err, content) {
			locals.data.article = content[0];
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
	view.render('articles');
};