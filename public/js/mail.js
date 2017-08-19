var contactForm = document.querySelector('section.contact form');

var resultMessages = {
	success: 'Votre message a été envoyé, merci.',
	invalidEmail: 'Erreur&nbsp;: Veuillez entrer une adresse email valide.',
	invalidPhone: 'Erreur&nbsp;: Veuillez entrer un numéro de téléphone valide.',
	missingFields: 'Erreur&nbsp;: Des champs requis n\'ont pas été remplis.',
	invalidCharacters: 'Erreur&nbsp;: L’email contient des caractères invalides.',
	failure: 'Erreur&nbsp;: Votre message n’a pas pu être envoyé, veuillez réessayer plus tard.'
};

function submitEnquiry(form) {
	event.preventDefault();
	addClass(contactForm, 'loading');
	ajaxPostMail(form, function(responses){
		setTimeout(function() {
			notifyContactForm(responses); // response is an array of message
			removeClass(contactForm, 'loading');
		}, 1000);
	});
}

// This function sends the request to the server
function ajaxPostMail(form, callback) {
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
				callback(JSON.parse(xhr.responseText));
			} else {
				callback(['failure']);
			}
		}
	};

	// Opening the connection
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');

	//All preparations are clear, send the request!
	xhr.send(params);
}

// This function outputs the results in the DOM
function notifyContactForm(responses){
	var resultBox = document.querySelector('.result-box');
	var fields = contactForm.querySelectorAll('input, textarea');
	fields = [].slice.call(fields, 1);

	resultBox.innerHTML = '';

	responses.forEach(function(response){
		var newMessage = document.createElement('p');
		newMessage.innerHTML = resultMessages[response];
		addClass(newMessage, 'result-message');

		if(response === 'missingFields' || response === 'invalidEmail' || response === 'invalidPhone' || response === 'invalidCharacters')
			addClass(newMessage, 'error');
		else
			addClass(newMessage, response);

		resultBox.appendChild(newMessage);


		if (response === 'missingFields') {
			forEachNl(fields, function(field){
				if (field.value === '') {
					addClass(field, 'invalid');
				} else {
					removeClass(field, 'invalid');
				}
			});
		} else if (response === 'invalidEmail' && response === 'invalidCharacters') {
			addClass(contactForm.querySelector('#email'), 'invalid');
		} else if (response === 'invalidPhone') {
			addClass(contactForm.querySelector('#phone'), 'invalid');
		} else {
			forEachNl(fields, function(field){
				removeClass(field, 'invalid');
				if(response === 'success') {
					field.value = '';
					field.focus();
					field.blur();
				}
			});
		}
	});
}