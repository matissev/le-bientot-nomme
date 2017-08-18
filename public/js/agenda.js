
// addClass(document.querySelector('.agenda'), 'interactive');

// agendaIndex = 0;
// months = document.querySelectorAll('.month');

// document.querySelector('.controls .left').addEventListener('click', function(event) {
// 	if(agendaIndex > 0) {
// 		agendaIndex --;
// 		updateAgenda();
// 		updateTimeSelector();
// 	}
// });

// document.querySelector('.controls .right').addEventListener('click', function(event) {
// 	if(agendaIndex < months.length - 1) {
// 		agendaIndex ++;
// 		updateAgenda();
// 		updateTimeSelector();
// 	}
// });

// forEachNl(document.querySelectorAll('.time-selector label'), function(el, index) {
// 	el.addEventListener('click', function(event) {
// 		agendaIndex = index;
// 		updateAgenda();
// 	});
// });

// forEachNl(document.querySelectorAll('.filter label'), function(el, index) {
// 	el.addEventListener('click', function(event) {
// 		var checked = document.querySelectorAll('.filter input')[index].checked;
// 		filterAgenda(el.getAttribute('for'), checked);
// 		toggleEmptyMonthMessage();
// 	});
// });

// function updateAgenda() {
// 	forEachNl(months, function(el, index) {
// 		removeClass(el, 'toLeft');
// 		removeClass(el, 'toRight');
// 		removeClass(el, 'currentMonth');

// 		if(index < agendaIndex) {
// 			addClass(el, 'toLeft');
// 		} else if (index > agendaIndex) {
// 			addClass(el, 'toRight');
// 		}
// 	});

// 	addClass(months[agendaIndex], 'currentMonth');
// }

// function updateTimeSelector() {
// 	forEachNl(document.querySelectorAll('.time-selector input'), function(el, index){
// 		if(index === agendaIndex) {
// 			el.checked = true;
// 		}
// 	});
// }

// function filterAgenda(filter, toFilter) {
// 	var events = document.querySelectorAll('.event');

// 	var matchedEvents = filterNl(events, function(event){
// 		return hasClass(event, filter);
// 	});

// 	forEachNl(matchedEvents, function(event){
// 		if (toFilter) addClass(event, 'filtered');
// 		else removeClass(event, 'filtered');
// 	});
// }

// function toggleEmptyMonthMessage() {
// 	forEachNl(months, function(month){
// 		var eventsInMonth = month.querySelectorAll('.event');
// 		var alert = month.querySelector('.no-events-in-filter');

// 		var hasEvents = someNl(eventsInMonth, function(event){
// 			return !hasClass(event, 'filtered');
// 		});

// 		if (!hasEvents && eventsInMonth.length) {
// 			alert.innerText = 'Aucun évènement ne correspond à votre recherche ce mois-ci.';
// 			addClass(alert, 'show');
// 		} else if (hasEvents && eventsInMonth.length) {
// 			removeClass(alert, 'show');
// 		}
// 	});
// }