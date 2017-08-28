module.exports = {
	Field: require('../DatetimeFrField'),
	Filter: require('../DatetimeFrFilter'),
	readme: require('fs').readFileSync('./fields/types/datetimefr/Readme.md', 'utf8'),
	section: 'Date',
	spec: {
		label: 'DatetimeFr',
		path: 'datetimefr',
		paths: {
			date: 'datetimefr.date',
			time: 'datetimefr.time',
		},
		value: new Date(),
	},
};
