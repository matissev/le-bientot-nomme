document.addEventListener('DOMContentLoaded', function(event) {
	if (document.querySelector('.articles')) {
		var elem = document.querySelector('.grid');
		var pckry = new Packery( elem, {
			// options
			itemSelector: '.grid-item',
			gutter: 10
		});

		// element argument can be a selector string
		//   for an individual element
		pckry = new Packery( '.posts-grid', {
			itemSelector: '.post',
		});
	}
});