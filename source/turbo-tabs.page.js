(function(TurboTabs) {

    TurboTabs.Page = function(name, label, color) {
        this.name = name;

		this.dom = {
			button: $('<button class="page-btn">'),
			page: $('<div class="page">')
		};

		this.dom.button.text(label);
		this.dom.button.css('color', color);

		this.dom.page.text(label);

		this.activate = function() {
			this.dom.button.addClass('active');
			this.dom.button.css('background', color);
			return this;
		};

		this.deactivate = function() {
			this.dom.button.removeClass('active');
			this.dom.button.css('background', 'white');
			return this;
		};
    };

    TurboTabs.Pages = function(turboTabsInstance) {

		var map = [],
			pages = $(turboTabsInstance.element.querySelector('.pages')),
			buttons = $(turboTabsInstance.element.querySelector('.buttons')),
			current = null;

		this.scrollTo = function(index) {
			map.forEach(function(page) {
				page.deactivate();
			});

			var width = (100 / map.length) * index;
			pages.css('transform', 'translate3d(-' + width + '%, 0, 0)');

			var button = buttons.find('button').eq(index);
			width = document.body.clientWidth / 2 - (button.get(0).offsetLeft + button.get(0).offsetWidth / 2);
			buttons.css('transform', 'translate3d(' + width + 'px, 0, 0)');

			current = index;

			map[current].activate();
		};

		this.add = function(page) {
			if(page instanceof TurboTabs.Page) {
				map.push(page);
				pages.append(page.dom.page);
				buttons.append(page.dom.button);
				this.update();
			}

			return this;
		};

		this.update = function() {
			pages.css('width', (map.length * 100) + '%');
			map.forEach(function(page) {
				page.dom.page.css('width', (100 / map.length) + '%');
			});

			if(current !== null) this.scrollTo(current);
		};

		this.first = function() {
			this.scrollTo(0);
			map[0].activate();
		};

		var observe = function() {
			var buttonClick = function(event) {
				this.scrollTo($(event.currentTarget).index());
			}.bind(this);

			buttons.on('click', 'button', function(event) {
				if(!Browser.isMobile) buttonClick(event);
			}.bind(this));

			buttons.on('tap', 'button', function(event) {
				if(Browser.isMobile) buttonClick(event);
			}.bind(this));

			buttons.on('taphold', 'button', function(event) {
				if(Browser.isMobile) APP.bottom.up();
			}.bind(this));

			$(window).on('swipeleft', function() {
				this.scrollTo(Math.min(current + 1, map.length - 1));
			}.bind(this));

			$(window).on('swiperight', function() {
				this.scrollTo(Math.max(0, current - 1));
			}.bind(this));

			var timeout = null;
			$(window).resize(function() {
				if(timeout) {
					clearTimeout(timeout);
					timeout = null;
				}

				setTimeout(function() {
					this.update();
				}.bind(this), 300);
			}.bind(this));
		};

		observe.bind(this)();
    };


})(window.TurboTabs);