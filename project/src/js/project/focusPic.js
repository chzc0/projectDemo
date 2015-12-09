(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(function () {
            return factory();
        });
    } else {
        // RequireJS isn't being used.
        factory();
    }
}(this, function () {
    var FocusPic = function (BigPicID, SmallPicsID, TitleID, DescripID, width, height) {
        this.$ = function $(id) {
            return typeof (id) == 'string' ? document.getElementById(id) : id;
        };
        this.Data = [];
        this.ImgLoad = [];
        this.TimeOut = 5000;
        this.type = 1;
        var isIE = navigator.appVersion.indexOf("MSIE") != -1 ? true : false;
        this.width = width;
        this.height = height;
        this.adNum = 0;
        var TimeOutObj;
        if (!FocusPic.childs) {
            FocusPic.childs = [];
        }
        this.showTime = null;
        this.showSum = 10;
        this.ID = FocusPic.childs.push(this) - 1;
        this.Add = function (BigPic, SmallPic, Title, Url, Descrip) {
            var ls;
            this.Data.push([BigPic, SmallPic, Title, Url, Descrip]);
            ls = this.ImgLoad.length;
            this.ImgLoad.push(new Image());
            this.ImgLoad[ls].src = BigPic;
        }
        this.TimeOutBegin = function () {
            clearInterval(TimeOutObj);
            TimeOutObj = setInterval("FocusPic.childs[" + this.ID + "].next()", this.TimeOut)
        };
        this.TimeOutEnd = function () {
            clearInterval(TimeOutObj)
        };
        this.select = function (num) {
            if (num > this.Data.length - 1) {
                return
            };
            if (num == this.adNum) {
                return
            };
            this.TimeOutBegin();
            if (BigPicID) {
                if (this.$(BigPicID)) {
                    var aObj = this.$(BigPicID).getElementsByTagName("a")[0];
                    aObj.href = this.Data[num][2];
                    if (this.aImgY) {
                        this.aImgY.style.display = 'none';
                        this.aImg.style.position = "relative";
                        this.aImg.style.left = 0;
                        this.aImg.style.top = 0;
                        this.aImg.style.zIndex = 0
                    };
                    this.aImgY = this.$('F' + this.ID + 'BF' + this.adNum);
                    this.aImg = this.$('F' + this.ID + 'BF' + num);
                    clearTimeout(this.showTime);
                    this.showSum = 10;
                    this.showTime = setTimeout("FocusPic.childs[" + this.ID + "].show()", 10)
                }
            };
            if (TitleID) {
                if (this.$(TitleID)) {
                    this.$(TitleID).innerHTML = "<a onclick=\"recordBlogHotPv(this, '','" + this.Data[num][3] + "');\" href=\"" + this.Data[num][2] + "\" target=\"_blank\">" + this.Data[num][3] + "</a>"
                }
            };
            if (DescripID) {
                if (this.$(DescripID)) {
                    this.$(DescripID).innerHTML = this.Data[num][4]
                }
            };
            if (SmallPicsID) {
                if (this.$(SmallPicsID)) {
                    var sImg = this.$(SmallPicsID).getElementsByTagName("span"),
                        i;
                    for (i = 0; i < sImg.length; i++) {
                        if (i == num || num == (i - this.Data.length)) {
                            sImg[i].className = "selected"
                        } else {
                            sImg[i].className = ""
                        }
                    }
                }
            };
            if (this.onselect) {
                this.onselect()
            };
            this.adNum = num
        };
        var absPosition = function (obj, parentObj) {
            var left = obj.offsetLeft,
                top = obj.offsetTop,
                tempObj = obj;
            while (tempObj.id != "VBody" & tempObj.id != "VHtml" & tempObj != parentObj) {
                tempObj = tempObj.offsetParent;
                left += tempObj.offsetLeft;
                top += tempObj.offsetTop
            };
            return {
                left: left,
                top: top
            }
        };
        this.show = function () {
            this.showSum--;
            this.aImgY.style.display = 'block';
            this.aImg.style.position = "absolute";
            var XY = absPosition(this.aImgY, this.$(BigPicID));
            this.aImg.style.top = XY.top + "px";
            this.aImg.style.left = XY.left + "px";
            this.aImg.style.display = 'block';
            if (isIE) {
                this.aImg.style.filter = "alpha(opacity=0)";
                this.aImg.style.filter = "alpha(opacity=" + (10 - this.showSum) * 10 + ")"
            } else {
                this.aImg.style.opacity = 0;
                this.aImg.style.opacity = (10 - this.showSum) * 0.1
            };
            if (this.showSum <= 0) {
                this.aImgY.style.display = 'none';
                this.aImg.style.position = "relative";
                this.aImg.style.left = 0;
                this.aImg.style.top = 0;
                this.aImg.style.zIndex = 0;
                this.aImgY = null
            } else {
                this.aImg.style.zIndex = 2;
                this.showTime = setTimeout("FocusPic.childs[" + this.ID + "].show()", 10)
            }
        };
        this.next = function () {
            var temp = this.adNum;
            temp++;
            if (temp >= this.Data.length) {
                temp = 0
            };
            this.select(temp)
        };
        this.pre = function () {
            var temp = this.adNum;
            temp--;
            if (temp < 0) {
                temp = this.Data.length - 1
            };
            this.select(temp)
        };
        this.MInStopEvent = function (ObjID) {
            if (ObjID) {
                if (this.$(ObjID)) {
                    if (this.$(ObjID).attachEvent) {
                        this.$(ObjID).attachEvent("onmouseover", Function("FocusPic.childs[" + this.ID + "].TimeOutEnd()"));
                        this.$(ObjID).attachEvent("onmouseout", Function("FocusPic.childs[" + this.ID + "].TimeOutBegin()"))
                    } else {
                        this.$(ObjID).addEventListener("mouseover", Function("FocusPic.childs[" + this.ID + "].TimeOutEnd()"), false);
                        this.$(ObjID).addEventListener("mouseout", Function("FocusPic.childs[" + this.ID + "].TimeOutBegin()"), false)
                    }
                }
            }
        };
        this.begin = function () {
            this.MInStopEvent(TitleID);
            this.MInStopEvent(SmallPicsID);
            this.MInStopEvent(DescripID);
            this.MInStopEvent(BigPicID);
            this.adNum = 0;
            var i, temp = "";
            if (BigPicID) {
                if (this.$(BigPicID)) {
                    var aObj = this.$(BigPicID).getElementsByTagName("a")[0];
                    aObj.style.zoom = 1;
                    this.$(BigPicID).style.position = "relative";
                    for (i = 0; i < this.Data.length; i++) {
                        temp += '<img src="' + this.Data[i][0] + '" id="F' + this.ID + 'BF' + i + '" style="display:' + (i == this.adNum ? 'block' : 'none') + '" galleryimg="no"' + (this.width ? ' width="' + this.width + '"' : '') + (this.height ? ' height="' + this.height + '"' : '') + ' alt="' + this.Data[i][3] + '" />'
                    };
                    aObj.innerHTML = temp
                }
            };
            if (SmallPicsID) {
                if (this.$(SmallPicsID)) {
                    temp = "";
                    for (i = 0; i < this.Data.length; i++) {
                        if (!this.type) {
                            temp += "<span id=focus_small" + i + (this.adNum == i ? ' class="selected"' : "") + "><a onclick=\"recordBlogHotPv(this, '','" + this.Data[i][3] + "');\" href=\"" + this.Data[i][2] + "\" target=\"_blank\"  onmouseover=\"FocusPic.childs[" + this.ID + "].select(" + i + ")\"><img src='" + this.Data[i][1] + "' /></a></span>"
                        } else {
                            temp += "<span id=focus_small" + i + (this.adNum == i ? ' class="selected"' : "") + "><a onclick=\"recordBlogHotPv(this, '','" + this.Data[i][3] + "');\" href=\"" + this.Data[i][2] + "\" target=\"_blank\"  onmouseover=\"FocusPic.childs[" + this.ID + "].select(" + i + ")\">" + (i + 1) + "</a></span>"
                        }
                    };
                    this.$(SmallPicsID).innerHTML = temp
                }
            };
            this.TimeOutBegin();
            this.$(BigPicID).getElementsByTagName("a")[0].href = this.Data[0][2];
            this.$(TitleID).innerHTML = "<a href=\"" + this.Data[0][2] + "\" target=\"_blank\">" + this.Data[0][3] + "</a>";
            if (this.$(DescripID)) this.$(DescripID).innerHTML = this.Data[0][4];
            this.iPad()
        };
        this.$ = function (objName) {
            if (document.getElementById) {
                return eval('document.getElementById("' + objName + '")')
            } else {
                return eval('document.all.' + objName)
            }
        };
        this.iPad = function () {
            if (typeof (window.ontouchstart)) {
                var me = this;
                me.main = this.$(BigPicID);
                var addEvent = function (obj, eventType, func) {
                    if (obj.attachEvent) {
                        obj.attachEvent("on" + eventType, func)
                    } else {
                        obj.addEventListener(eventType, func, false)
                    }
                };
                var iPadX = 0,
                    iPadLastX = 0;
                iPadScrollX = iPadScrollY = 0;
                iPadStatus = 'ok';
                addEvent(me.main, 'touchstart', function (e) {
                    iPadX = e.touches[0].pageX;
                    iPadScrollX = window.pageXOffset;
                    iPadScrollY = window.pageYOffset
                });
                addEvent(me.main, 'touchmove', function (e) {
                    iPadLastX = e.touches[0].pageX;
                    var cX = iPadX - iPadLastX;
                    if (iPadStatus == 'ok') {
                        if (iPadScrollY == window.pageYOffset && iPadScrollX == window.pageXOffset && Math.abs(cX) > 20) {
                            iPadStatus = 'touch'
                        } else {
                            return
                        }
                    };
                    e.preventDefault()
                });
                addEvent(me.main, 'touchend', function (e) {
                    if (iPadStatus != 'touch') {
                        return
                    };
                    iPadStatus = 'ok';
                    var cX = iPadX - iPadLastX;
                    if (cX < 0) {
                        me.pre()
                    } else {
                        me.next()
                    }
                })
            }
        }
    };
}))



