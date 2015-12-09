(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], function ($) {
            return factory($);
        });
    } else {
        // RequireJS isn't being used.
        factory($);
    }
}(this, function ($) {
    $.fn.Tabs = function (options) {
        var defaults = {
            tabSelector: ".tabs li",
            conSelector: ".tabcontent",
            focusClass: "c",
            moreTrigger: ".tabTitle .more .link",
            events: "mouseover",
            selected: 0,
            delay: 0.2,
            callback: {}
        };
        var events = ["mouseover", "click"];
        var settings = $.extend({}, defaults, options);
        var that = this;
        var _tabs = $(settings.tabSelector, that);
        var _cons = $(settings.conSelector, that);
        var _more = $(settings.moreTrigger, that);
        var _isDelay = settings.events == events[0] ? !0 : !1;
        var _callback = typeof (options.callback) == "undefined" ? false : options.callback;
        (function () {
            var tab = _tabs.eq(settings.selected);
            if (tab && tab.length === 0) {
                tab = _tabs.eq(0);
            }
            tab.addClass(settings.focusClass);
            tab.siblings(settings.tabSelector).removeClass(settings.focusClass);

            var cons = _cons.eq(settings.selected);
            if (cons && cons.length === 0) {
                cons = _cons.eq(0);
            }
            cons.show();
            cons.siblings(settings.conSelector).hide();

            var more = _more.eq(settings.selected);
            if (more && more.length === 0) {
                more = _more.eq(0);
            }
            more.show();
            more.siblings().hide();
        }());

        _tabs.each(function (i, v) {
            $(v).on(settings.events, function () {
                var _this = this;
                delay.apply(this, [settings.delay, function () {
                    $(_this).addClass(settings.focusClass);
                    $(_this).siblings(settings.tabSelector).removeClass(settings.focusClass);
                    $(_cons[i]).fadeIn();
                    $(_cons[i]).siblings(settings.conSelector).hide();
                    $(_more[i]).show();
                    $(_more[i]).siblings().hide();
                    if (_callback) { _callback(i); }
                }, _isDelay]);
            });
        });
        //接收两个参数 t延迟时间秒为单位，fn要执行的函数,m是否执行延迟取决于事件的类型
        var delay = function (t, fn, m) {
            if (m) {
                var _this = this,
                    d = setTimeout(function () {
                        fn.apply(_this);
                    }, t * 1000);
                _this.onmouseout = function () {
                    clearTimeout(d);
                };
            }
            else { fn.apply(this); }
        };
    };
}))