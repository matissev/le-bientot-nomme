var contactForm = document.querySelector('section.contact form');

var resultMessages = {
	success: 'Votre message a été envoyé, merci.',
	invalidEmail: 'Erreur&nbsp;: Votre message n’a pas pu être envoyé, veuillez réessayer plus tard.',
	missingFields: 'Erreur&nbsp;: Veuillez entrer une adresse email valide.',
	invalidCaracters: 'Erreur&nbsp;: L’email contient des caractères invalides.',
	failure: 'Erreur&nbsp;: Tous les champs sont requis.'
};

function submitEnquiry(form) {
	event.preventDefault();
	addClass(contactForm, 'loading');
	var responses = ajaxPostMail(form);
	notifyContactForm(responses); // response is an array of message
}

// This function sends the request to the server
function ajaxPostMail(form) {
	var url = form.querySelector('#action').value,
		xhr = new XMLHttpRequest(),
		params = [],
		response;

	// Building up the request...
	for (var i = 0, name, value; i < form.elements.length; i++) {
		name = encodeURIComponent(form.elements[i].name);
		value = encodeURIComponent(form.elements[i].value);
		params.push(name + '=' + value);
	}
	params.push(encodeURIComponent('ajax') + "=" + encodeURIComponent(true)); // This is sent with ajax
	params = params.join('&');

	// Recording the response
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				return xhr.responseText;
			} else {
				return false;
			}
		}
	};

	// Opening the connection
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');

	//All preparations are clear, send the request!
	xhr.send(params);
}


// This function checks the request from the server
function checkResponse(response, savedResults) {
	var knownResponses = ['success', 'invalidEmail', 'missingFields', 'invalidCaracters', 'failure'];
	if (knownResponses.indexOf(response) > -1) {
		savedResults.push(response);
	} else {
		savedResults.push('failure');
	}
}

// This function outputs the results in the DOM
function notifyContactForm(responses){
	var resultBox = document.querySelector('.result-box');
	var fields = contactForm.querySelectorAll('input, textarea');

	// Delete every message from DOM
	// Inject the new ones, corresponding to the messages
	// Show invalid fields

	forEachNl(resultMessages, function(el, index){
		resultBox.removeChild(resultBox.querySelectorAll('.result-message')[index]);
	});

	responses.forEach(function(response){
		var newMessage = document.createElement(p);
		newMessage.innerText = resultMessages[response];

		if(response === 'missingFields' || response === 'invalidEmail' || response === 'invalidCaracters')
			addClass(newMessage, 'error');
		else
			addClass(newMessage, response);

		resultBox.appendChild(newMessage);
	});


	// BE CAREFUL
	// for (i = 0; i < savedResults.length; i++) {
	// 	if (savedResults[i] === 'missing-fields' || savedResults[i] === 'invalid-email' || savedResults[i] === 'invalid-caracters') {
	// 		addClass(contactForm.querySelector('.result-message.' + savedResults[i]), 'show');
	// 	}

	// 	if (savedResults[i] === 'missing-fields') {
	// 		for (u = 0; u < fields.length; u++) {
	// 			if (fields[u].value === '') {
	// 				addClass(fields[u], 'invalid');
	// 			} else {
	// 				removeClass(fields[u], 'invalid');
	// 			}
	// 		}
	// 	}

	// 	if (savedResults[i] === 'invalid-email' || savedResults[i] === 'invalid-caracters') {
	// 		addClass(contactForm.querySelector('#email'), 'invalid');
	// 	}

	// 	if (savedResults[i] === 'success' || savedResults[i] === 'failure') {
	// 		for (u = 0; u < fields.length; u++) {
	// 			removeClass(fields[u], 'invalid');
	// 		}

	// 		killFormLoader(savedResults[i]);
	// 	}
	// }
}

// This function clears the form and kills the loading animation
function killFormLoader(result) {
	var fields = contactForm.querySelectorAll('input, textarea');

	setTimeout(function() {
		removeClass(contactForm, 'loading');
		addClass(contactForm.querySelector('.result-message.' + result), 'show');

		if (result === 'success') {
			for (i = 1; i < fields.length; i++) {
				fields[i].value = '';
				fields[i].focus();
				fields[i].blur();
			}
		}
	}, 1000);
}