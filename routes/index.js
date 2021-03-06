/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var sitemap = require('keystone-express-sitemap');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);
keystone.pre('admin', middleware.setAuthUser);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.get('/agenda', routes.views.agenda);
	app.get('/agenda/:event', routes.views.event);
	app.get('/articles', routes.views.articles);
	app.get('/articles/:post', routes.views.post);
	app.get('/lesoin', routes.views.lesoin);
	app.get('/leprojet', routes.views.leprojet);
	app.all('/contact', routes.views.contact);
	app.post('/newsletter', routes.views.newsletter);

    app.get('/sitemap.xml', function(req, res) {
        sitemap.create(keystone, req, res, {
        	ignore: ['/newsletter']
        });
    });

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
};
