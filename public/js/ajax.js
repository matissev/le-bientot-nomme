

function ajaxify(linkEl, callback) {
	document.querySelectorAll(linkEl).forEach(function(el) {
		var url = el.attributes.href.value;
		el.addEventListener('click', function(event) {
			event.preventDefault();

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

ajaxify('a.event', function(response){
	var container = document.querySelector('.event-popup-content');
	container.innerHTML = "";
	var doc = new DOMParser().parseFromString(response, 'text/html');
	var content = doc.documentElement.querySelector('section.event');
	container.appendChild(content);
	addClass(document.querySelector('body'), 'popup-active');
});

document.querySelector('.close-popup').addEventListener('click', function(event) {
	removeClass(document.querySelector('body'), 'popup-active');
});