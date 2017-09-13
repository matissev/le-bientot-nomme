var keystone = require('keystone'),
	PageAccueil = keystone.list('PageAccueil'),
	Post = keystone.list('Post'),
	Event = keystone.list('Event'),
	PageArticle = keystone.list('PageArticle'),
	PageContact = keystone.list('PageContact');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'accueil';
	locals.data = {
		accueil: [],
		contact: [],
		posts: [],
		oneEvent: [],
		article: []
	};

	view.on('init', function(next) {
		PageAccueil.model.find().exec(function(err, content) {
			locals.data.accueil = content[0];
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

	view.on('init', function(next) {
		Event.model.find()
			.sort('-startDate')
			.limit(1)
			.exec(function(err, event) {
				locals.data.oneEvent = event[0];
				next(err);
			});
	});

	view.on('init', function(next) {
		Post.model.find()
			.where('state', 'publié')
			.sort('publishedAt')
			.limit(8)
			.exec(function(err, posts) {
				locals.data.posts = posts;
				next(err);
			});
	});

	// Render the view
	view.render('index');
};
