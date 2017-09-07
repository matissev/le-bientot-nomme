var keystone = require('keystone');
var middleware = require('../routes/middleware');
var Types = keystone.Field.Types;
var request = require('request');

/**
 * Enquiry Model
 * =============
 */

var Professional = new keystone.List('Professional', {
	map: {name: 'name'},
	label: 'Professionnels',
	singular: 'Professionnel'
});

Professional.add(
	'Infos',
	{ name: { type: Types.Name, label: 'Nom', required: true, initial: true } },
	{ job: { type: String, label: 'Activité' } },
	{ photo: { type: Types.CloudinaryImage, autoCleanup : true, label: 'Photo' } },
	{ description: {type: Types.Textarea, wysiwyg: true, height: 300, label: 'Description' } },
	'Coordonnées',
	{ contact: {
		email: { type: Types.Email, displayGravatar: true, label: 'Email' },
		phone: { type: String, label: 'Téléphone' },
		website: { type: Types.Url, default: '', label: 'Site internet', note: 'Doit comporter « http:// » (ex : https://le-site.com)' },
	} },
	{ socials: {
		facebook: { type: Types.Url, default: '', label: 'Facebook', note: 'Lien vers la page Facebook. Doit comporter « http:// » (ex : https://www.facebook.com/jean.dupont)' },
		twitter: { type: Types.Url, default: '', label: 'Twitter', note: 'Lien vers la page Twitter. Doit comporter « http:// » (ex : https://www.twitter.com/jeandupont)' },
		linkedin: { type: Types.Url, default: '', label: 'Linkedin', note: 'Lien vers la page Linkedin. Doit comporter « http:// » (ex : https://www.linkedin.com/in/jeandupont/)' },
	} },
	'Horaires',
	{ schedule: {
		monday: {
			value: { type: String, default: '', label: 'Lundi', note: 'Les horaires doivent être de la forme : XXhXX - XXhXX / XXhXX - XXhXX (avec autant de coupures que voulu). Si celles-ci ne sont pas spécifiées, la journée indiquera «&nbsp;Fermé&nbsp;».' },
			microdata: { type: String, hidden: true  }
		},
		tuesday: {
			value: { type: String, default: '', label: 'Mardi' },
			microdata: { type: String, hidden: true  }
		},
		wednesday: {
			value: { type: String, default: '', label: 'Mercredi' },
			microdata: { type: String, hidden: true  }
		},
		thursday: {
			value: { type: String, default: '', label: 'Jeudi' },
			microdata: { type: String, hidden: true  }
		},
		friday: {
			value: { type: String, default: '', label: 'Vendredi' },
			microdata: { type: String, hidden: true  }
		},
		saturday: {
			value: { type: String, default: '', label: 'Samedi' },
			microdata: { type: String, hidden: true  }
		},
		sunday: {
			value: { type: String, default: '', label: 'Dimanche' },
			microdata: { type: String, hidden: true  }
		}
	} }
);

Professional.schema.methods.getDayLabel = function(dayString) {
    return this.schema.tree.schedule[dayString].label;
};

Professional.schema.pre('remove', function(next) {
	if(!middleware.getAuthUser().canManageProfessionals) {
		next(new Error('Vous n\'avez pas les autorisations pour supprimer des professionnels.'));
	}
	next();
});

Professional.schema.pre('validate', function(next) {
	if(!middleware.getAuthUser().canManageProfessionals) {
		next(new Error('Vous n\'avez pas les autorisations pour modifier les professionnels.'));
	}
	next();
});

Professional.schema.pre('save', function(next) {
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
	}, {
		url: this.contact.website,
		errorMsg: 'SITE INTERNET'
	}];

	var erroredLinks = checkLinks(links);


	/* ----------- CHECK SCHEDULE */

	var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	var erroredDays = [];
	var timeRegex = /^[\s|/]*([0-9]|0[0-9]|1[0-9]|2[0-3])[h|H|:]([0-5][0-9]){0,1}\s*[-]\s*([0-9]|0[0-9]|1[0-9]|2[0-3])[h|H|:]([0-5][0-9]){0,1}[\s|/]*([/]+?[\s|/]*([0-9]|0[0-9]|1[0-9]|2[0-3])[h|H|:]([0-5][0-9]){0,1}\s*[-]\s*([0-9]|0[0-9]|1[0-9]|2[0-3])[h|H|:]([0-5][0-9]){0,1}[\s|/]*){0,2}$/;
	var hoursRegex = /([0-9]|0[0-9]|1[0-9]|2[0-3])[:|h|H]([0-5][0-9]){0,1}\s*[-]\s*([0-9]|0[0-9]|1[0-9]|2[0-3])[:|h|H]([0-5][0-9]){0,1}/g;
	var empty = /^\s*$/;

	for(var i = 0; i < days.length; i++) {
		var day = days[i].toLowerCase();
		if(timeRegex.test(this.schedule[day].value)) {
			this.schedule[day].value = this.schedule[day].value.match(hoursRegex).join(' / ').replace(/\s*-\s*/g, ' - ').replace(/(H|:)/g, 'h');
			this.schedule[day].microdata = buildSchema(days[i], this.schedule[day].value);
		} else if (empty.test(this.schedule[day].value)) {
			this.schedule[day].value = '';
		} else {
			erroredDays.push(Professional.fields['schedule.' + day + '.value'].options.label);
		}	
	}


	/* ----------- FORM PASSED */

	if(erroredLinks.length) {
		next(new Error(erroredLinks.join(', ') + ' : Lien(s) invalide(s)'));
	} else if(erroredDays.length) {
		next(new Error('Les horaires de ' + erroredDays.join(', ').toUpperCase() + ' sont invalides, vérifiez-les avant de sauvegarder à nouveau.'));
	} else {
		next();
	}
});

function buildSchema(dayName, tableString) {
	tableString = tableString.replace(/(h|H)/g, ':');
	tableString = tableString.replace(/\s/g, '');
	tableString = tableString.replace(/\//g, ' ');
	tableString = tableString.replace(/([0-9][0-9][:](?![0-9]))/g, '$&00');
	tableString = dayName.substring(0, 2) + ' ' + tableString;
	return tableString;
}

function checkLinks(links) {
	var empty = /^\s*$/;
	var errors = [];

	links.forEach(function(link) {
		if(link.regex) {
			if (!empty.test(link.url) && !link.regex.test(link.url)) {
				errors.push(link.errorMsg);
				return;
			}
		}

		if (!empty.test(link.url)) {
			request(link.url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					return;
				} else {
					errors.push(link.errorMsg);
					return;
				}
			});
		}
	});

	return errors;
}
	
Professional.register();
