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