import DateInput from '../../components/DateInput';
import Field from '../Field';
import moment from 'moment';
import React from 'react';
import {
	Button,
	FormField,
	FormInput,
	FormNote,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../../../admin/client/App/elemental';

module.exports = Field.create({

	displayName: 'DatetimeFrField',
	statics: {
		type: 'DatetimeFr',
	},

	focusTargetRef: 'dateInput',

	// default input formats
	dateInputFormat: 'DD/MM/YYYY',
	timeInputFormat: 'HH[h]mm',
	tzOffsetInputFormat: 'Z',

	// parse formats (duplicated from lib/fieldTypes/datetime.js)
	parseFormats: ['DD/MM/YYYY HH[h]mm Z', 'D/MM/YYYY HH[h]mm Z', 'DD/M/YYYY HH[h]mm Z', 'D/M/YYYY HH[h]mm Z',
					'DD/MM/YYYY H[h]mm Z', 'D/MM/YYYY H[h]mm Z', 'DD/M/YYYY H[h]mm Z', 'D/M/YYYY H[h]mm Z',
					'DD/MM/YY HH[h]mm Z', 'D/MM/YY HH[h]mm Z', 'DD/M/YY HH[h]mm Z', 'D/M/YY HH[h]mm Z',
					'DD/MM/YY H[h]mm Z', 'D/MM/YY H[h]mm Z', 'DD/M/YY H[h]mm Z', 'D/M/YY H[h]mm Z',
					'DD/MM/YYYY HH[h] Z', 'D/MM/YYYY HH[h] Z', 'DD/M/YYYY HH[h] Z', 'D/M/YYYY HH[h] Z',
					'DD/MM/YYYY H[h] Z', 'D/MM/YYYY H[h] Z', 'DD/M/YYYY H[h] Z', 'D/M/YYYY H[h] Z',
					'DD/MM/YY HH[h] Z', 'D/MM/YY HH[h] Z', 'DD/M/YY HH[h] Z', 'D/M/YY HH[h] Z',
					'DD/MM/YY H[h] Z', 'D/MM/YY H[h] Z', 'DD/M/YY H[h] Z', 'D/M/YY H[h] Z'],

	getInitialState () {
		return {
			dateValue: this.props.value && this.moment(this.props.value).format(this.dateInputFormat),
			timeValue: this.props.value && this.moment(this.props.value).format(this.timeInputFormat),
			tzOffsetValue: this.props.value ? this.moment(this.props.value).format(this.tzOffsetInputFormat) : this.moment().format(this.tzOffsetInputFormat),
		};
	},

	getDefaultProps () {
		return {
			formatString: 'D/MM/YYYY, HH[h]mm',
		};
	},

	moment () {
		if (this.props.isUTC) return moment.utc.apply(moment, arguments);
		else return moment.apply(undefined, arguments);
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid (value) {
		return this.moment(value, this.parseFormats).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format (value, format) {
		format = format || this.dateInputFormat + ' ' + this.timeInputFormat;
		return value ? this.moment(value).format(format) : '';
	},

	handleChange (dateValue, timeValue, tzOffsetValue) {
		var value = dateValue + ' ' + timeValue;
		var datetimeFormat = this.dateInputFormat + ' ' + this.timeInputFormat;

		// if the change included a timezone offset, include that in the calculation (so NOW works correctly during DST changes)
		if (typeof tzOffsetValue !== 'undefined') {
			value += ' ' + tzOffsetValue;
			datetimeFormat += ' ' + this.tzOffsetInputFormat;
		}
		// if not, calculate the timezone offset based on the date (respect different DST values)
		else {
			this.setState({ tzOffsetValue: this.moment(value, datetimeFormat).format(this.tzOffsetInputFormat) });
		}

		this.props.onChange({
			path: this.props.path,
			value: this.isValid(value) ? this.moment(value, datetimeFormat).toISOString() : null,
		});
	},

	dateChanged ({ value }) {
		this.setState({ dateValue: value });
		this.handleChange(value, this.state.timeValue);
	},

	timeChanged (evt) {
		this.setState({ timeValue: evt.target.value });
		this.handleChange(this.state.dateValue, evt.target.value);
	},

	setNow () {
		var dateValue = this.moment().format(this.dateInputFormat);
		var timeValue = this.moment().format(this.timeInputFormat);
		var tzOffsetValue = this.moment().format(this.tzOffsetInputFormat);
		this.setState({
			dateValue: dateValue,
			timeValue: timeValue,
			tzOffsetValue: tzOffsetValue,
		});
		this.handleChange(dateValue, timeValue, tzOffsetValue);
	},

	renderNote () {
		if (!this.props.note) return null;
		return <FormNote note={this.props.note} />;
	},

	renderUI () {
		var input;
		if (this.shouldRenderField()) {
			input = (
				<div>
					<Group>
						<Section grow>
							<DateInput
								format={this.dateInputFormat}
								name={this.getInputName(this.props.paths.date)}
								onChange={this.dateChanged}
								ref="dateInput"
								value={this.state.dateValue}
							/>
						</Section>
						<Section grow>
							<FormInput
								autoComplete="off"
								name={this.getInputName(this.props.paths.time)}
								onChange={this.timeChanged}
								placeholder="HH:MM:SS am/pm"
								value={this.state.timeValue}
							/>
						</Section>
						<Section>
							<Button onClick={this.setNow}>Now</Button>
						</Section>
					</Group>
					<input
						name={this.getInputName(this.props.paths.tzOffset)}
						type="hidden"
						value={this.state.tzOffsetValue}
					/>
				</div>
			);
		} else {
			input = (
				<FormInput noedit>
					{this.format(this.props.value, this.props.formatString)}
				</FormInput>
			);
		}
		return (
			<FormField label={this.props.label} className="field-type-datetime" htmlFor={this.getInputName(this.props.path)}>
				{input}
				{this.renderNote()}
			</FormField>
		);
	},
});
