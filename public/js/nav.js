
// =================================================================
// ============================== NAV ==============================
// =================================================================

function Nav(options) {
	this.options = options;
	this.element = document.querySelector(options.container);

	this.navEl = this.element.querySelector(options.navEl);
	this.navElWrapper = this.element.querySelector(options.navElWrapper);
	this.toggleButton = this.element.querySelector(options.toggleButton);

	var el = this.toggleButton.cloneNode(true);
	addClass(el, 'close-button');
	addClass(this.toggleButton, 'open-button');
	this.navEl.appendChild(el);

	this.openButton = this.element.querySelector('.open-button');
	this.closeButton = this.element.querySelector('.close-button');
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

	addClass(self.element, 'opening');

	function openNav() {
		removeClass(self.element, 'opening');
		addClass(self.element, 'open');
		self.navElWrapper.removeEventListener(animationEvent, openNav);
	}

	self.navElWrapper.addEventListener(animationEvent, openNav);
};

Nav.prototype.close = function() {
	var self = this;

	addClass(self.element, 'closing');
	removeClass(self.element, 'open');

	function closeNav() {
		removeClass(self.element, 'closing');
		self.navElWrapper.removeEventListener(animationEvent, closeNav);
	}

	self.navElWrapper.addEventListener(animationEvent, closeNav);
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
