

function ajaxify(linkEl, callback) {
	forEachNl(document.querySelectorAll(linkEl), function(el) {
		var url = el.attributes.href.value;
		el.addEventListener('click', function(event) {
			event.preventDefault();
			history.pushState({}, 'Article', url);

			var xmlhttp = new XMLHttpRequest();

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
					if (xmlhttp.status == 200) {
						callback(xmlhttp.responseText);
					} else if (xmlhttp.status == 400) {
						console.log('There was an error 400');
					} else {
						console.log('something else other than 200 was returned');
						console.log(xmlhttp.responseText);
					}
				}
			};

			xmlhttp.open("GET", url, true);
			xmlhttp.send();
		}, false);
	});
}

function injectPartial(partialEl, containerEl, response) {
	var container = document.querySelector(containerEl);
	container.innerHTML = "";
	currentPopup = new DOMParser().parseFromString(response, 'text/html');
	var content = currentPopup.documentElement.querySelector(partialEl);
	container.appendChild(content);
}

if(!isMobile.any) {
	ajaxify('article.event-ticket a', function(response){
		injectPartial('article.event', '.event-wrapper', response);
		zenscroll.setup(1000, -50);
		zenscroll.to(document.querySelector('.event-wrapper'));
	});

	ajaxify('a.post', function(response){
		injectPartial('article.post', '.popup-content', response);
		addClass(document.querySelector('body'), 'popup-active');
		objectFitPolyfill();
	});
}

forEachNl(document.querySelectorAll('.close-popup, .popup-overlay'), function(el) {
	el.addEventListener('click', function(event) {
		removeClass(document.querySelector('body'), 'popup-active');
		window.history.back();
	}, false);
});