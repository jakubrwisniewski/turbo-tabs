
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