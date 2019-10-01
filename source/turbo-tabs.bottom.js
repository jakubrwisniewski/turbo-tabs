(function(TurboTabs) {

    TurboTabs.Bottom = function(turboTabsInstance) {
		var CLOSED = 0,
			PREVIEW = 1,
			FULL = 2;

		var wrapper = $(turboTabsInstance.element),
			mode = CLOSED,
			dom = $('<div class="sheet bottom">');

		wrapper.append(dom);

		var close = function() {
			turboTabsInstance.drop.hide();
			dom.removeClass('preview').removeClass('full');
		}.bind(this);

		this.moveUp = function() {
			if(mode === CLOSED) {
				dom.addClass('preview');
				mode = PREVIEW;

				turboTabsInstance.drop.onclick(close);
			}
			else if(mode === PREVIEW) {
				dom.addClass('full').removeClass('preview');
				mode = FULL;
			}

			if(mode !== CLOSED) turboTabsInstance.drop.show();
		};

		this.moveDown = function() {
			if(mode === FULL) {
				dom.addClass('preview').removeClass('full');
				mode = PREVIEW;
			}
			else if(mode === PREVIEW) {
				dom.removeClass('preview');
				mode = CLOSED;
			}

			if(mode === CLOSED) turboTabsInstance.drop.hide();
		};

		dom.text('menu główne serwisu');

		this.isOpened = function() {
			return mode !== CLOSED;
		};
    };

})(window.TurboTabs);