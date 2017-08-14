
addClass(document.querySelector('.agenda'), 'interactive');

agendaIndex = 0;
months = document.querySelectorAll('.month');

document.querySelector('.controls .left').addEventListener('click', function(event) {
	if(agendaIndex > 0) {
		agendaIndex --;
		updateAgenda();
		updateTimeSelector();
	}
});

document.querySelector('.controls .right').addEventListener('click', function(event) {
	if(agendaIndex < months.length - 1) {
		agendaIndex ++;
		updateAgenda();
		updateTimeSelector();
	}
});

document.querySelectorAll('.time-selector label').forEach(function(el, index) {
	el.addEventListener('click', function(event) {
		agendaIndex = index;
		updateAgenda();
	});
});

document.querySelectorAll('.filter label').forEach(function(el, index) {
	el.addEventListener('click', function(event) {
		var checked = document.querySelectorAll('.filter input')[index].checked;
		filterAgenda(el.getAttribute('for'), checked);
	});
});

function updateAgenda() {
	months.forEach(function(el, index) {
		removeClass(el, 'toLeft');
		removeClass(el, 'toRight');
		removeClass(el, 'currentMonth');

		if(index < agendaIndex) {
			addClass(el, 'toLeft');
		} else if (index > agendaIndex) {
			addClass(el, 'toRight');
		}
	});

	addClass(months[agendaIndex], 'currentMonth');
}

function updateTimeSelector() {
	document.querySelectorAll('.time-selector input').forEach(function(el, index){
		if(index === agendaIndex) {
			el.checked = true;
		}
	});
}

function filterAgenda(filter, toFilter) {
	events = document.querySelectorAll('.event');
	events.forEach(function(el){
		if(hasClass(el, filter)) {
			if (toFilter) addClass(el, 'filtered'); else removeClass(el, 'filtered');
		}
	});
}