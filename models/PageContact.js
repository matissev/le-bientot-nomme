var keystone = require('keystone');
var middleware = require('../routes/middleware');
var Types = keystone.Field.Types;

/**
 * PageContact Model
 * =============
 */

var PageContact = new keystone.List('PageContact', {
	nocreate: true,
	nodelete: true,
	label: 'Contact',
	singular: 'Contact',
	plural: 'Contact'
});

PageContact.add({
	name: { type: String, hidden: true, default: 'Contact', label: 'Nom' },
	address: { type: Types.Location, label: 'Adresse' },
	phone: { type: String, label: 'Téléphone fixe' },
	mobilePhone: { type: String, label: 'Téléphone mobile' },
	email: { type: Types.Email, label: 'Email' },
	socials: {
		facebook: { type: Types.Url, default: '', label: 'Facebook', note: 'Lien vers la page Facebook. Doit comporter « http:// » (ex : https://www.facebook.com/jean.dupont)' },
		twitter: { type: Types.Url, default: '', label: 'Twitter', note: 'Lien vers la page Twitter. Doit comporter « http:// » (ex : https://www.twitter.com/jeandupont)' },
		linkedin: { type: Types.Url, default: '', label: 'Linkedin', note: 'Lien vers la page Linkedin. Doit comporter « http:// » (ex : https://www.linkedin.com/in/jeandupont/)' },
	}
});

PageContact.schema.pre('validate', function(next) {
	var user = middleware.getAuthUser().name.first + ' ' + middleware.getAuthUser().name.last;

	// This allows the initialization of the database
	if (user === ' ') {
		next();
	}
	
	if(!middleware.getAuthUser().canManagePages) {
		next(new Error('Vous n\'avez pas les autorisations pour modifier les pages du site.'));
	}
	next();
});

PageContact.schema.pre('save', function(next) {
	/* ----------- CHECK LINKS */

	var links =  [{
		url: this.socials.facebook,
		errorMsg: 'FACEBOOK',
		regex: /[.|\/]facebook.com/
	}, {
		url: this.socials.twitter,
		errorMsg: 'TWITTER',
		regex: /[.|\/]twitter.com/
	}, {
		url: this.socials.linkedin,
		errorMsg: 'LINKEDIN',
		regex: /[.|\/]linkedin.com/
	}];

	var erroredLinks = checkLinks(links);

	/* ----------- FORM PASSED */

	if(erroredLinks.length) {
		next(new Error(erroredLinks.join(', ') + ' : Lien(s) invalide(s)'));
	} else {
		next();
	}
});

function checkLinks(links) {
	var empty = /^\s*$/;
	var errors = [];

	links.forEach(function(link) {
		if (!empty.test(link.url) && !link.regex.test(link.url)) {
			errors.push(link.errorMsg);
			return;
		}
	});

	return errors;
}

PageContact.defaultColumns = 'name';
PageContact.register();
