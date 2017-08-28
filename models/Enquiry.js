var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true,
	label: 'Messages',
	singular: 'Message'
});

Enquiry.add({
	name: { type: Types.Name, required: true, label: 'Nom' },
	email: { type: Types.Email, required: true, label: 'Email' },
	phone: { type: String, label: 'Téléphone' },
	subject: { type: String, label: 'Sujet' },
	message: { type: Types.Textarea, required: true, label: 'Message' },
	createdAt: { type: Date, default: Date.now, label: 'Envoyé le' },
});

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name|15%, subject, email, phone|15%, createdAt';
Enquiry.register();
