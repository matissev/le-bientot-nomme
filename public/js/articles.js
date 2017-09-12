document.addEventListener('DOMContentLoaded', function(event) {
	if (document.querySelector('.posts-grid')) {
		var elem = document.querySelector('.grid');

		// element argument can be a selector string
		//   for an individual element
		pckry = new Packery( '.posts-grid', {
			itemSelector: '.post',
		});
	}
});