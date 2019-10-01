(function(self) {

    self.TurboTabs = function(element) {

        (function() {
			element.classList.add('turbo-tabs');

			const buttons = document.createElement('header');
			buttons.classList.add('buttons');

			const pages = document.createElement('div');
			pages.classList.add('pages');

			element.appendChild(buttons);
			element.appendChild(pages);
		})();

		this.element = element;

		this.drop = new self.TurboTabs.Drop(this);
        this.pages = new self.TurboTabs.Pages(this);
		this.bottom = new self.TurboTabs.Bottom(this);

		$(element).on('swipeup', function() {
			if(this.bottom.isOpened()) {
				this.bottom.moveUp();
			}
		}.bind(this));

		$(element).on('swipedown', function() {
			if(this.bottom.isOpened()) {
				this.bottom.moveDown();
			}
		}.bind(this));

    };

})(window);