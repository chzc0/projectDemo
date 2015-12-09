define(['jquery'], function ($) {
    //舌签构造函数

    function SubShowClass(ID, eventType, defaultID, openClassName, closeClassName) {
        var t = this;
        this.$ = function $(id) {
            return typeof (id) == 'string' ? document.getElementById(id) : id;
        }
        this.parentObj = this.$(ID);
        if (this.parentObj == null && ID != "none") {
            throw new Error("SubShowClass(ID)参数错误:ID 对像不存在!(value:" + ID + ")")
        };
        this.lock = false;
        this.label = [];
        this.defaultID = defaultID == null ? 0 : defaultID;
        this.selectedIndex = this.defaultID;
        this.openClassName = openClassName == null ? "selected" : openClassName;
        this.closeClassName = closeClassName == null ? "" : closeClassName;
        this.mouseIn = false;
        var mouseInFunc = function () {
            t.mouseIn = true
        };
        var mouseOutFunc = function () {
            t.mouseIn = false
        };
        if (ID != "none" && ID != "") {
            if (this.parentObj.attachEvent) {
                this.parentObj.attachEvent("onmouseover", mouseInFunc)
            } else {
                this.parentObj.addEventListener("mouseover", mouseInFunc, false)
            }
        };
        if (ID != "none" && ID != "") {
            if (this.parentObj.attachEvent) {
                this.parentObj.attachEvent("onmouseout", mouseOutFunc)
            } else {
                this.parentObj.addEventListener("mouseout", mouseOutFunc, false)
            }
        };
        if (typeof (eventType) != "string") {
            eventType = "onmousedown"
        };
        eventType = eventType.toLowerCase();
        switch (eventType) {
            case "onmouseover":
                this.eventType = "mouseover";
                break;
            case "onclick":
                this.eventType = "click";
                break;
            case "onmouseup":
                this.eventType = "mouseup";
                break;
            default:
                this.eventType = "mousedown"
        };
        this.autoPlay = false;
        this.autoPlayTimeObj = null;
        this.spaceTime = 5000
    };
    SubShowClass.prototype = {
        version: "1.32",
        author: "mengjia",
        _delay: 200,
        _setClassName: function (obj, type) {
            var temp;
            temp = obj.className;
            if (temp) {
                temp = temp.replace(this.openClassName, "");
                temp = temp.replace(this.closeClassName, "");
                temp += " " + (type == "open" ? this.openClassName : this.closeClassName)
            } else {
                temp = (type == "open" ? this.openClassName : this.closeClassName)
            };
            obj.className = temp
        },
        addLabel: function (labelID, contID, parentBg, springEvent, blurEvent) {
            var t = this;
            var labelObj = this.$(labelID);
            var contObj = this.$(contID);
            if (labelObj == null && labelID != "none") {
                throw new Error("addLabel(labelID)参数错误:labelID 对像不存在!(value:" + labelID + ")")
            };
            var TempID = this.label.length;
            if (parentBg == "") {
                parentBg = null
            };
            this.label.push([labelID, contID, parentBg, springEvent, blurEvent]);
            var tempFunc = function () {
                if (t.eventType == 'mouseover') {
                    clearTimeout(labelObj._timeout);
                    labelObj._timeout = setTimeout(function () {
                        t.select(TempID)
                    }, t._delay)
                } else {
                    t.select(TempID)
                }
            };
            if (labelID != "none") {
                if (labelObj.attachEvent) {
                    labelObj.attachEvent("on" + this.eventType, tempFunc)
                } else {
                    labelObj.addEventListener(this.eventType, tempFunc, false)
                };
                if (t.eventType == 'mouseover') {
                    if (labelObj.attachEvent) {
                        labelObj.attachEvent("onmouseout", function () {
                            clearTimeout(labelObj._timeout)
                        })
                    } else {
                        labelObj.addEventListener("mouseout", function () {
                            clearTimeout(labelObj._timeout)
                        }, false)
                    }
                }
            };
            if (TempID == this.defaultID) {
                if (labelID != "none") {
                    this._setClassName(labelObj, "open")
                };
                if (this.$(contID)) {
                    contObj.style.display = ""
                };
                if (this.ID != "none") {
                    if (parentBg != null) {
                        this.parentObj.style.background = parentBg
                    }
                };
                if (springEvent != null) {
                    eval(springEvent)
                }
            } else {
                if (labelID != "none") {
                    this._setClassName(labelObj, "close")
                };
                if (contObj) {
                    contObj.style.display = "none"
                }
            };
            var mouseInFunc = function () {
                t.mouseIn = true
            };
            var mouseOutFunc = function () {
                t.mouseIn = false
            };
            if (contObj) {
                if (contObj.attachEvent) {
                    contObj.attachEvent("onmouseover", mouseInFunc)
                } else {
                    contObj.addEventListener("mouseover", mouseInFunc, false)
                };
                if (contObj.attachEvent) {
                    contObj.attachEvent("onmouseout", mouseOutFunc)
                } else {
                    contObj.addEventListener("mouseout", mouseOutFunc, false)
                }
            }
        },
        select: function (num, force) {
            if (typeof (num) != "number") {
                throw new Error("select(num)参数错误:num 不是 number 类型!(value:" + num + ")")
            };
            if (force != true && this.selectedIndex == num) {
                return
            };
            var i;
            for (i = 0; i < this.label.length; i++) {
                if (i == num) {
                    if (this.label[i][0] != "none") {
                        this._setClassName(this.$(this.label[i][0]), "open")
                    };
                    if (this.$(this.label[i][1])) {
                        this.$(this.label[i][1]).style.display = ""
                    };
                    if (this.ID != "none") {
                        if (this.label[i][2] != null) {
                            this.parentObj.style.background = this.label[i][2]
                        }
                    };
                    if (this.label[i][3] != null) {
                        eval(this.label[i][3])
                    }
                } else if (this.selectedIndex == i || force == true) {
                    if (this.label[i][0] != "none") {
                        this._setClassName(this.$(this.label[i][0]), "close")
                    };
                    if (this.$(this.label[i][1])) {
                        this.$(this.label[i][1]).style.display = "none"
                    };
                    if (this.label[i][4] != null) {
                        eval(this.label[i][4])
                    }
                }
            };
            this.selectedIndex = num
        },
        random: function () {
            if (arguments.length != this.label.length) {
                throw new Error("random()参数错误:参数数量与标签数量不符!(length:" + arguments.length + ")")
            };
            var sum = 0,
                i;
            for (i = 0; i < arguments.length; i++) {
                sum += arguments[i]
            };
            var randomNum = Math.random(),
                percent = 0;
            for (i = 0; i < arguments.length; i++) {
                percent += arguments[i] / sum;
                if (randomNum < percent) {
                    this.select(i);
                    break
                }
            }
        },
        order: function () {
            if (arguments.length != this.label.length) {
                throw new Error("order()参数错误:参数数量与标签数量不符!(length:" + arguments.length + ")")
            };
            if (!(/^\d+$/).test(SubShowClass.sum)) {
                return
            };
            var count = 0,
                i;
            for (i = 0; i < arguments.length; i++) {
                count += arguments[i]
            };
            var num = SubShowClass.sum % count;
            if (num == 0) {
                num = count
            };
            var sum = 0;
            for (i = 0; i < arguments.length; i++) {
                sum += arguments[i];
                if (sum >= num) {
                    this.select(i);
                    break
                }
            }
        },
        play: function (spTime) {
            var t = this;
            if (typeof (spTime) == "number") {
                this.spaceTime = spTime
            };
            clearInterval(this.autoPlayTimeObj);
            this.autoPlayTimeObj = setInterval(function () {
                t.autoPlayFunc()
            }, this.spaceTime);
            this.autoPlay = true
        },
        autoPlayFunc: function () {
            if (this.autoPlay == false || this.mouseIn == true) {
                return
            };
            this.nextLabel()
        },
        nextLabel: function () {
            var t = this;
            var index = this.selectedIndex;
            index++;
            if (index >= this.label.length) {
                index = 0
            };
            this.select(index);
            if (this.autoPlay == true) {
                clearInterval(this.autoPlayTimeObj);
                this.autoPlayTimeObj = setInterval(function () {
                    t.autoPlayFunc()
                }, this.spaceTime)
            }
        },
        previousLabel: function () {
            var t = this;
            var index = this.selectedIndex;
            index--;
            if (index < 0) {
                index = this.label.length - 1
            };
            this.select(index);
            if (this.autoPlay == true) {
                clearInterval(this.autoPlayTimeObj);
                this.autoPlayTimeObj = setInterval(function () {
                    t.autoPlayFunc()
                }, this.spaceTime)
            }
        },
        stop: function () {
            clearInterval(this.autoPlayTimeObj);
            this.autoPlay = false
        },
        $: function (objName) {
            if (document.getElementById) {
                return eval('document.getElementById("' + objName + '")')
            } else {
                return eval('document.all.' + objName)
            }
        }
    };
    SubShowClass.readCookie = function (l) {
        var i = "",
            I = l + "=";
        if (document.cookie.length > 0) {
            var offset = document.cookie.indexOf(I);
            if (offset != -1) {
                offset += I.length;
                var end = document.cookie.indexOf(";", offset);
                if (end == -1) end = document.cookie.length;
                i = unescape(document.cookie.substring(offset, end))
            }
        };
        return i
    };
    SubShowClass.writeCookie = function (O, o, l, I) {
        var i = "",
            c = "";
        if (l != null) {
            i = new Date((new Date).getTime() + l * 3600000);
            i = "; expires=" + i.toGMTString()
        };
        if (I != null) {
            c = ";domain=" + I
        };
        document.cookie = O + "=" + escape(o) + i + c
    };
    SubShowClass.sum = SubShowClass.readCookie("SSCSum");
    if ((/^\d+$/).test(SubShowClass.sum)) {
        SubShowClass.sum++
    } else {
        SubShowClass.sum = 1
    };
    SubShowClass.writeCookie("SSCSum", SubShowClass.sum, 12);
    return SubShowClass;
});

