
// ====================================================================
// ============================== AGENDA ==============================
// ====================================================================

function Agenda(options) {
	this.options = options;
	this.element = document.querySelector(options.container);

	if(isMobile.any) {
		addClass(this.element, 'is-mobile');
	}

	this.index = 0;
	this.months = this.element.querySelectorAll(options.month);
	this.events = this.element.querySelectorAll(options.event);
	this.controls = this.element.querySelector(options.controls);

	this.timeSelectorEl = document.querySelector(options.container + ' ' + options.timeSelector);

	this.timeSelector = {
		element: this.element.querySelector(options.timeSelector),
		index: 0,
		months: this.element.querySelectorAll(options.timeSelector + ' label'),
	};

	this.timeSelector.pannelLength = groupsLength(this.timeSelector.months, 4);
}

Agenda.prototype.init = function() {
	var self = this;

	forEachNl(self.months, function(month, i) {
		return i === 0 ? addClass(month, 'currentMonth') : addClass(month, 'toRight');
	});

	// Create the alert messages wich display that the filtering returns nothing
	forEachNl(self.months, function(month){
		var eventsInMonth = month.querySelectorAll(self.options.event);
		if(eventsInMonth.length !== 0) {
			var noEventsMessage = document.createElement('div');
			noEventsMessage.innerText = 'Aucun évènement ne correspond à votre recherche ce mois-ci.';
			addClass(noEventsMessage, 'no-events-in-filter');
			month.appendChild(noEventsMessage);
		}
	});

	// ========================== PREV NEXT CONTROLS ==========================

	// Control PREV MONTH is clicked
	if(self.options.controls) {
		self.controls.querySelector('.prev').addEventListener('click', function(event) {
			if(self.index > 0) {
				self.index --;
				self.update();
				self.checkTimeSelector();
			}
		});
	}

	// Control NEXT MONTH is clicked
	if(self.options.controls) {
		self.controls.querySelector('.next').addEventListener('click', function(event) {
			if(self.index < self.months.length - 1) {
				self.index ++;
				self.update();
				self.checkTimeSelector();
			}
		});
	}


	// ========================== TIMESELECTOR ==========================

	// A MONTH in the TIME SELECTOR ist clicked
	forEachNl(self.timeSelector.element.querySelectorAll('label'), function(el, i) {
		el.addEventListener('click', function(event) {
			self.index = i;
			self.update();
		});
	});

	addClass(self.timeSelector.element.querySelector('button.prev'), 'disabled');
	if(self.timeSelector.pannelLength < 2) {
		addClass(self.timeSelector.element.querySelector('button.next'), 'disabled');
	}

	// The PREV button in the TIME SELECTOR is clicked
	self.timeSelector.element.querySelector('button.prev').addEventListener('click', function(event) {
		if(self.timeSelector.index > 0) {
			self.timeSelector.index--;
			var percentage = self.timeSelector.index * 100 * 4;
			forEachNl(self.timeSelector.months, function(el, index){
				Velocity(el, { translateX: '-' + percentage + '%' }, { queue: false, duration: 700, easing: 'easeOutSine' });
			});

			if (self.timeSelector.index === 0)
				addClass(self.timeSelector.element.querySelector('button.prev'), 'disabled');
			removeClass(self.timeSelector.element.querySelector('button.next'), 'disabled');
		}
	});

	// The NEXT button in the TIME SELECTOR is clicked
	self.timeSelector.element.querySelector('button.next').addEventListener('click', function(event) {
		if(self.timeSelector.index < self.timeSelector.pannelLength - 1) {
			self.timeSelector.index++;
			var percentage = self.timeSelector.index * 100 * 4;
			forEachNl(self.timeSelector.months, function(el, index){
				Velocity(el, { translateX: '-' + percentage + '%' }, { queue: false, duration: 700, easing: 'easeOutSine' });
			});

			if (self.timeSelector.index === self.timeSelector.pannelLength - 1)
				addClass(self.timeSelector.element.querySelector('button.next'), 'disabled');
			removeClass(self.timeSelector.element.querySelector('button.prev'), 'disabled');
		}
	});


	// ========================== FILTER ==========================

	forEachNl(document.querySelectorAll('.filter label'), function(el, index) {
		el.addEventListener('click', function(event) {
			var checked = document.querySelectorAll('.filter input')[index].checked;
			self.filter(el.getAttribute('for'), checked);
		});
	});
};


// ============================== METHODS ==============================
// =====================================================================

Agenda.prototype.update = function() {
	var self = this;

	forEachNl(self.months, function(el, i) {
		removeClass(el, 'toLeft');
		removeClass(el, 'toRight');
		removeClass(el, 'currentMonth');

		if(i < self.index) {
			addClass(el, 'toLeft');
		} else if (i > self.index) {
			addClass(el, 'toRight');
		}
	});

	addClass(self.months[self.index], 'currentMonth');
};

Agenda.prototype.filter = function(filter, toFilter) {
	var self = this;

	var matchedEvents = filterNl(self.events, function(event){
		return hasClass(event, filter);
	});

	forEachNl(matchedEvents, function(event){
		if (toFilter) addClass(event, 'filtered');
		else removeClass(event, 'filtered');
	});

	self.toggleFilterAlert();
};

Agenda.prototype.toggleFilterAlert = function() {
	var self = this;

	forEachNl(self.months, function(month){
		var eventsInMonth = month.querySelectorAll(self.options.event);
		var alert = month.querySelector('.no-events-in-filter');

		var hasEvents = someNl(eventsInMonth, function(event){
			return !hasClass(event, 'filtered');
		});

		if (!hasEvents && eventsInMonth.length) {
			addClass(alert, 'show');
		} else if (hasEvents && eventsInMonth.length) {
			removeClass(alert, 'show');
		}
	});
};

Agenda.prototype.checkTimeSelector = function() {
	var self = this;
	forEachNl(self.timeSelector.element.querySelectorAll('input'), function(el, i){
		if(i === self.index) {
			el.checked = true;
		}
	});
};


// RUNS THE AGENDA
if (document.querySelector('.agenda')) {
	var agenda = new Agenda({
		container: '.agenda',
		month: '.month',
		event: 'article.event-ticket',
		timeSelector: '.time-selector'
	});
	agenda.init();
}
