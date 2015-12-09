require(["config"], function (config) {
    require(["jquery", "tabs"], function ($, _Tabs_) {
        $(function () {
            $("#ywkx").Tabs({ tabSelector: ".tabs li", conSelector: ".tabList .linklist", focusClass: "current", moreTrigger: ".more a" });

        });
    });
});