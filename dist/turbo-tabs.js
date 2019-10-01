$.mobile.loading().remove(); // remove stupid loading
$.event.special.tap.emitTapOnTaphold = false; // prevents tap after taphold

(function() {
    var supportTouch = $.support.touch,
        touchStartEvent = supportTouch ? "touchstart" : "mousedown",
        touchStopEvent = supportTouch ? "touchend" : "mouseup",
        touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
    $.event.special.swipeUpDown = {
        setup: function() {
            var thisObject = this;
            var $this = $(thisObject);
            $this.bind(touchStartEvent, function(event) {
                var data = event.originalEvent.touches ?
                    event.originalEvent.touches[0] :
                    event,
                    start = {
                        time: (new Date).getTime(),
                        coords: [data.pageX, data.pageY],
                        origin: $(event.target)
                    },
                    stop;

                function moveHandler(event) {
                    if(!start) {
                        return;
                    }
                    var data = event.originalEvent.touches ?
                        event.originalEvent.touches[0] :
                        event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [data.pageX, data.pageY]
                    };

                    // prevent scrolling
                    if(Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
                $this
                    .bind(touchMoveEvent, moveHandler)
                    .one(touchStopEvent, function() {
                        $this.unbind(touchMoveEvent, moveHandler);
                        if(start && stop) {
                            if(stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                                start.origin
                                    .trigger("swipeUpDown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                            }
                        }
                        start = stop = undefined;
                    });
            });
        }
    };
    $.each({
        swipedown: "swipeUpDown",
        swipeup: "swipeUpDown"
    }, function(event, sourceEvent) {
        $.event.special[event] = {
            setup: function() {
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });

})();
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
(function(self) {
    var Browser = {};

    var isMobile = (function() {
        try {
            document.createEvent("TouchEvent");
            return true;
        }
        catch(e) { }

        return false;
    })();

    Object.defineProperty(Browser, 'isMobile', {
        configurable: false,
        enumerable: false,
        get: function() {
            return isMobile;
        }
    });

    self.Browser = Browser;
})(window);