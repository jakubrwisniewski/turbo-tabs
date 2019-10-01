(function(TurboTabs) {

    TurboTabs.Drop = function(turboTabsInstance) {
		var element = $('<div class="drop">'),
			click = null;

		$(turboTabsInstance.element).append(element);
		element.hide();

		this.show = function() {
			element.show();
			setTimeout(function() {
				element.addClass('visible');
			}, 10);
			return this;
		};

		this.hide = function() {
			element.removeClass('visible');
			setTimeout(function() {
				element.hide();
			}, 300);
			return this;
		};

		this.onclick = function(callback) {
			if(callback) click = callback;
			return this;
		}

		element.click(function(event) {
			if(click) click(event);
		});
    };

})(window.TurboTabs);