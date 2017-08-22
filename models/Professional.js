var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Professional = new keystone.List('Professional', {
	map: {name: 'name'},
	label: 'Professionnels'
});

Professional.add(
	'Infos',
	{ name: { type: Types.Name, label: 'Nom', required: true, initial: true } },
	{ job: { type: String, label: 'Activité' } },
	{ photo: { type: Types.CloudinaryImage, autoCleanup : true, label: 'Photo' } },
	{ description: {type: Types.Textarea, wysiwyg: true, height: 200, label: 'Description' } },
	'Coordonnées',
	{ contact: {
		email: { type: Types.Email, displayGravatar: true, label: 'Email' },
		phone: { type: String, label: 'Téléphone' },
		link: { type: Types.Url, label: 'Site internet' },
	} },
	{ socials: {
		facebook: { type: Types.Url, label: 'Facebook', note: 'Lien vers la page Facebook (ex : https://www.facebook.com/jean.dupont)' },
		twitter: { type: Types.Url, label: 'Twitter', note: 'Lien vers la page Twitter (ex : https://twitter.com/jeandupont)' },
		linkedin: { type: Types.Url, label: 'Linkedin', note: 'Lien vers la page Linkedin (ex : https://www.linkedin.com/in/jeandupont/)' },
	} },
	'Horaires',
	{ schedule: {
		monday: { type: String, label: 'Lundi', note: 'Les horaires doivent être de la forme : XXhXX - XXhXX / XXhXX - XXhXX (avec autant de coupures que voulu)' },
		tuesday: { type: String, label: 'Mardi' },
		wednesday: { type: String, label: 'Mercredi' },
		thursday: { type: String, label: 'Jeudi' },
		friday: { type: String, label: 'Vendredi' },
		saturday: { type: String, label: 'Samedi' },
		sunday: { type: String, label: 'Dimanche' },
	} }
);

// VALIDATION TEST
// monday: { type: String, label: 'Lundi', note: 'Les horaires doivent être de la forme : XXhXX - XXhXX / XXhXX - XXhXX (avec autant de coupures que voulu)', watch: true, value: function() {
// 	return validateSchedule(this.schedule.monday) ? this.schedule.monday : ''; // This doesn't throw an error
// } }

// function validateSchedule(day) {
// 	var timeRegex = /^[\s|/]*([0-9]|0[0-9]|1[0-9]|2[0-3])[h|H|:]([0-5][0-9]){0,1}\s*[-]\s*([0-9]|0[0-9]|1[0-9]|2[0-3])[h|H|:]([0-5][0-9]){0,1}[\s|/]*([/]+?[\s|/]*([0-9]|0[0-9]|1[0-9]|2[0-3])[h|H|:]([0-5][0-9]){0,1}\s*[-]\s*([0-9]|0[0-9]|1[0-9]|2[0-3])[h|H|:]([0-5][0-9]){0,1}[\s|/]*){0,2}$/;
// 	var res = day.match(timeRegex);
// 	if(res)
// 		res = res[0];
// 	else
// 		res = null;
// 	return res === day ? true : false;
// }

// Professional.schema.methods.timetable = function() {
// 	var hoursRegex = /([0-9]|0[0-9]|1[0-9]|2[0-3])[h|H|:]([0-5][0-9]){0,1}\s*[-]\s*([0-9]|0[0-9]|1[0-9]|2[0-3])[h|H|:]([0-5][0-9]){0,1}/;

//     return this.state == 'published';
// };

Professional.register();
