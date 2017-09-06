
// =================================================================
// ============================== NAV ==============================
// =================================================================

function Nav(options) {
	this.options = options;
	this.element = document.querySelector(options.container);
	addClass(this.element, 'interactive');

	this.openButton = this.element.querySelector(options.toggleButton);
	this.navElWrapper = this.element.querySelector(options.navElWrapper);
	this.navEl = this.element.querySelector(options.navEl);

	this.closeButton = this.openButton.cloneNode(true);
	this.navEl.appendChild(this.closeButton);
	this.iconText = this.closeButton.querySelector('span');
	this.iconLine1 = this.closeButton.querySelector('.line1');
	this.iconLine2 = this.closeButton.querySelector('.line2');
	this.iconLine3 = this.closeButton.querySelector('.line3');
	Velocity.hook(this.iconLine1, 'transformOrigin', '50% 50%');
	Velocity.hook(this.iconLine2, 'transformOrigin', '50% 50%');
	Velocity.hook(this.iconLine3, 'transformOrigin', '50% 50%');

	this.isOpen = false;
}

Nav.prototype.init = function() {
	var self = this;

	self.openButton.addEventListener('click', function(event) {
		self.open();
	});

	self.closeButton.addEventListener('click', function(event) {
		self.close();
	});
};

Nav.prototype.open = function() {
	var self = this;

	Velocity.hook(self.navElWrapper, 'display', 'block');
	Velocity.hook(self.openButton, 'display', 'none');


	Velocity(self.closeButton, {
		translateX: [- lessVariables.margin - 50 - lessVariables.gutter, 0],
		fill: ['#ffffff', '#000000']
	}, {
		duration: 400,
		easing: 'easeOutSine'
	});

	Velocity(self.iconText, {
		opacity: [0, 1]
	}, {
		display: 'none',
		duration: 100,
		easing: 'easeOutSine'
	});

	Velocity(self.iconLine1, {
		translateY: ['-13px', '0px']
	}, {
		duration: 100,
		display: 'none',
		easing: 'easeInSine'
	});

	Velocity(self.iconLine2, {
		rotateZ: ['315deg', '0deg']
	}, {
		duration: 300,
		delay: 100,
		easing: 'easeOutSine'
	});

	Velocity(self.iconLine3, {
		translateY: ['13px', '0px']
	}, {
		duration: 100,
		easing: 'easeInSine'
	});

	Velocity(self.iconLine3, {
		rotateZ: ['45deg', '0deg']
	}, {
		duration: 300,
		delay: 100,
		easing: 'easeOutSine'
	});



	Velocity(self.navElWrapper, {
		backgroundColor: '#000000',
		backgroundColorAlpha: [0.5, 0]
	}, {
		duration: 400,
		easing: 'easeOutSine',
	});

	Velocity(self.navEl, {
		translateX: '100%'
	}, {
		duration: 400,
		easing: 'easeOutSine'
	});
};

Nav.prototype.close = function() {
	var self = this;

	Velocity(self.closeButton, 'reverse', {
		duration: 250,
		complete: function() {
			Velocity.hook(self.openButton, 'display', 'block');
		}
	});

	Velocity(self.iconText, 'reverse', {
		display: 'inline',
		delay: 300,
		duration: 100
	});

	Velocity(self.iconLine1, 'reverse', {
		duration: 300
	});

	Velocity(self.iconLine2, 'reverse', {
		duration: 300
	});

	Velocity(self.iconLine3, {
		rotateZ: ['0deg', '0deg']
	}, {
		duration: 100,
		easing: 'easeInSine'
	});

	Velocity(self.iconLine3, {
		translateY: ['0px', '13px']
	}, {
		duration: 100,
		delay: 300,
		easing: 'easeOutSine'
	});

	Velocity(self.navElWrapper, 'reverse', {
		display: 'none',
		duration: 250,
		delay: 150
	});

	Velocity(self.navEl, 'reverse', {
		duration: 250
	});
};


// RUNS THE NAV
if (document.querySelector('header.nav')) {
	var nav = new Nav({
		container: 'header.nav',
		toggleButton: 'button.toggle-nav',
		navElWrapper: '.nav-wrapper',
		navEl: 'nav'
	});
	nav.init();
}
