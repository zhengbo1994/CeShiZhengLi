(function () {
    //判断是否为空 
    var isNull = function (obj) {
        var result = false

        if (typeof (obj) == "undefined") {
            result = true;
        }

        if (obj == null) {
            result = true;
        }

        if (typeof (obj) == "string" && obj == "") {
            result = true;
        }

        return result;
    }

    //ajax统一请求接口
    var ajaxRequest = function (opts) {
        if (false == opts.async) {
            $("body").append('<div class="widget-box-overlay"><i class=" ace-icon loading-icon fa fa-spinner fa-spin fa-2x white"></i></div>');
        };
        var options;
        options = {
            type: "post",
            async: true,
            success: function (data, status, response) {
                $("body > div.widget-box-overlay").remove();
                if (!isNull(opts.success)) {
                    return opts.success(data);
                }
            },
            error: function (data, status, response) {
                $("body > div.widget-box-overlay").remove();
                if (!isNull(opts.error)) {
                    return opts.error(data, status, response);
                }
            }
        };
        if (!isNull(opts.url)) {
            options.url = opts.url;
        }
        if (!isNull(opts.type)) {
            options.type = opts.type;
        }
        if (!isNull(opts.async)) {
            options.async = opts.async;
        }
        if (!isNull(opts.data)) {
            options.data = opts.data;
        }
        if (!isNull(opts.dataType)) {
            options.dataType = opts.dataType;
        }
        if (!isNull(opts.contentType)) {
            options.contentType = opts.contentType;
        }
        if (!isNull(opts.processData)) {
            options.processData = opts.processData;
        }
        if (!isNull(opts.crossDomain)) {
            options.crossDomain = opts.crossDomain;
        }
        return $.ajax(options);
    };

    //创建GUID
    var newGuid = function () {
        var i, n;
        return ((function () {
            var j, results;
            results = [];
            for (i = j = 1; j <= 32; i = ++j) {
                n = Math.floor(Math.random() * 16.0).toString(16);
                if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
                    results.push(n += "-");
                } else {
                    results.push(n);
                }
            }
            return results;
        })()).join("");
    };

    ///页面跳转
    var locationHref = function (url) {
        window.location.href = url;;
    }

    var arrContext = function (arr, key, value) {
        var result = -1;
        for (var i = 0, len = arr.length; i < len; i++) {
            var obj = arr[i]
            for (var objKey in obj) {
                if (objKey == key && obj[objKey] == value) {
                    result = i;
                    break;
                }
            }
        }
        return result;
    }

    //把字符串按分隔符拆分成数组
    var split = function (str, separator) {
        var arr = str.split(separator);
        return arr;
    }

    var formatDateString = function (strDate) {
        var date = new Date(strDate);
        var year = date.getFullYear().toString();
        var month = date.getMonth().toString().length == 1 ? "0" + (date.getMonth() + 1).toString() : date.getMonth().toString();
        var day = date.getDate().toString().length == 1 ? "0" + date.getDate().toString() : date.getDate().toString();
        return year + "-" + month + "-" + day
    }

    var abortThread = function (message) {
        alert(message);
        throw (message);
    }

    Array.prototype.remove = function (rowid) {
        if (isNull(rowid) || rowid > this.length) {
            return false;
        }
        for (var i = 0, n = 0, len = this.length; i < len; i++) {
            if (this[i] != this[rowid]) {
                this[n++] = this[i]
            }
        }
        this.length -= 1

    }

    //格式化日期字符串
    Date.prototype.toFormatString = function (format) {
        var date0 = this;
        if (!format) {
            return date0.toString();
        }
        var regYear = /y{4}/g;
        var regMonth = /M{2}/g;
        var regDay = /d{2}/g;
        var regHour = /H{2}/g;
        var regMinute = /m{2}/g;
        var regSecond = /s{2}/g;

        var strYear = date0.getFullYear().toString();
        var strMonth = (date0.getMonth() + 1).toString();
        var strDay = date0.getDate().toString();
        var strHour = date0.getHours().toString();
        var strMinute = date0.getMinutes().toString();
        var strSecond = date0.getSeconds().toString();

        strMonth = "00" + strMonth;
        strMonth = strMonth.substr(-2, 2);
        strDay = "00" + strDay;
        strDay = strDay.substr(-2, 2);
        strHour = "00" + strHour;
        strHour = strHour.substr(-2, 2);
        strMinute = "00" + strMinute;
        strMinute = strMinute.substr(-2, 2);
        strSecond = "00" + strSecond;
        strSecond = strSecond.substr(-2, 2);

        format = format.replace(regYear, strYear)
            .replace(regMonth, strMonth)
            .replace(regDay, strDay)
            .replace(regHour, strHour)
            .replace(regMinute, strMinute)
            .replace(regSecond, strSecond);
        return format;
    };


    Date.prototype.addSeconds = function (seconds) {
        var date0 = this;
        //date0.setDate(date0.getSeconds() + seconds);
        date0.setSeconds(date0.getSeconds() + seconds);
        return date0;
    };

    Date.prototype.addMinutes = function (minutes) {
        var date0 = this;
        date0.setDate(date0.getMinutes() + minutes);
        return date0;
    };

    Date.prototype.addHours = function (hours) {
        var date0 = this;
        date0.setDate(date0.getHours() + hours);
        return date0;
    };

    Date.prototype.addDays = function (days) {
        var date0 = this;
        date0.setDate(date0.getDate() + days);
        return date0;
    };

    Date.prototype.addMonths = function (months) {
        var date0 = this;
        date0.setMonth(date0.getMonth() + months);
        return date0;
    };

    Date.prototype.addYears = function (years) {
        var date0 = this;
        date0.setFullYear(date0.getFullYear() + years);
        return date0;
    };

    var isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    //获取当前容器内有name属性的控件值，返回一个对象。spliter:同名控件值的分隔符
    var getJson = function ($container, spliter) {
        spliter = spliter || "||";
        var jsonNameValue = {};
        var appendJsonData = function (jdata, name, value) {
            if ("" == name || undefined == name) {
                return jdata;
            }
            if (undefined != jdata[$.trim(name)]) {
                jdata[name] += spliter + $.trim(value);
            } else {
                jdata[$.trim(name)] = $.trim(value);
            }
            return jdata;
        };

        var simpleControls = $container.find("input[type='text'],input[type='hidden'],input[type='password'],textarea,select");
        for (var i = 0; i < simpleControls.length; i++) {
            var c = $(simpleControls[i]);
            var controlName = c.attr("name");
            appendJsonData(jsonNameValue, controlName, c.val());
        }

        //var checkboxControls = $container.find("input[type='checkbox']");
        //for (var i = 0; i < checkboxControls.length; i++) {
        //    var c = $(checkboxControls[i]);
        //    var controlName = c.attr("name");
        //    appendJsonData(jsonNameValue, controlName, c.prop("checked"));
        //}

        var radioControls = $container.find("input[type='radio'],input[type='checkbox']");
        for (var i = 0; i < radioControls.length; i++) {
            var c = $(radioControls[i]);
            var controlName = c.attr("name");
            if (c.is(":checked")) {
                appendJsonData(jsonNameValue, controlName, c.val());
            }
        }

        var fileControls = $container.find("input[type='file']");
        for (var i = 0; i < fileControls.length; i++) {
            var c = $(fileControls[i]);
            var controlName = c.attr("name");
            if (c[0].files.length > 0) {
                //appendJsonData(jsonNameValue, controlName, c[0].files[0]);
                //jsonNameValue[controlName] = c[0].files[0];
                if (jsonNameValue.hasOwnProperty(controlName) && !isArray(jsonNameValue[controlName])) {
                    var oldvalue = jsonNameValue[controlName];
                    jsonNameValue[controlName] = [];
                    jsonNameValue[controlName].push(oldvalue);
                }
                if (isArray(jsonNameValue[controlName])) {
                    jsonNameValue[controlName].push(c[0].files[0]);
                }
                else {
                    jsonNameValue[controlName] = c[0].files[0];
                }
            }
        }
        return jsonNameValue;
    }
    //获取当前容器内有name属性的控件值，返回一个对象。同名对象用List接收 只能在支持HTML5的浏览器使用
    var getForm = function ($container) {
        var jsondata = getJson($container);
        var formData = new FormData();
        for (var p in jsondata) {
            var pItem = jsondata[p];
            if (isArray(pItem)) {
                for (var i = 0; i < pItem.length; i++) {
                    formData.append(p, pItem[i]);
                }
            }
            else {
                formData.append(p, pItem || "");
            }
        }
        return formData;
    }
    //将json数据赋给某容器内对应name属性的控件。spliter:同名控件值的分隔符
    var setJson = function ($container, jdata, spliter) {
        spliter = spliter || "||";
        for (var p in jdata) {
            jdata[p] = $.trim(jdata[p]);
            var $c = $container.find("[name='" + p + "']");
            if ($c.length > 0) {
                if (false === jdata[p] || "false" == jdata[p].toLowerCase()) {
                    jdata[p] = "False";
                } else if (true === jdata[p] || "true" == jdata[p].toLowerCase()) {
                    jdata[p] = "True";
                }
                var cName = $c[0].tagName.toLowerCase() || $c[0].nodeName.toLowerCase() || $c[0].localName;
                var cType;
                if (!isNull($c[0].type)) {
                    cType = $c[0].type.toLowerCase();
                }
                if (("input" == cName && ("text" == cType || "hidden" == cType || "password" == cType))
                    || "textarea" == cName || "select" == cName) {
                    $c.val(jdata[p]);
                } else if ("input" == cName && "checkbox" == cType) {
                    //$c.prop("checked", jdata[p]);
                    var chkValue = jdata[p];
                    $c.prop("checked", false);
                    if (!chkValue) {
                        return false;
                    }
                    var arrChkValue = chkValue.split(spliter);
                    for (var i = 0; i < arrChkValue.length; i++) {
                        for (var k = 0; k < $c.length; k++) {
                            if ($c[k].value == arrChkValue[i]) {
                                $($c[k]).prop("checked", true);
                                break;
                            }
                        }
                        //$container.find("input[type='checkbox'][name='" + p + "'][value='" + arrChkValue[i] + "']").prop("checked", true);
                    }
                } else if ("input" == cName && "radio" == cType) {
                    for (var i = 0; i < $c.length; i++) {
                        if ($c[i].value == jdata[p]) {
                            $($c[i]).prop("checked", true);
                            break;
                        }
                            //update by xxb 2017-03-17 json 没有此项值的时候 将此项值改为未选中
                        else {
                            $($c[i]).prop("checked", false);
                        }
                    }
                } else if ("div" == cName) {
                    setJson($c, jdata);
                }
                else {
                    $c.text(jdata[p]);
                }

                var onchangeFlag = $c.data("event-change")
                if (onchangeFlag) {
                    $c.change();
                }

            }
        }
    }
    //获取地址栏参数
    var getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    this.getQueryString = getQueryString;
    this.isNull = isNull;

    this.ajaxRequest = ajaxRequest;

    this.newGuid = newGuid;

    this.arrContext = arrContext;

    this.split = split;

    this.locationHref = locationHref;

    this.formatDateString = formatDateString;

    this.getJson = getJson;
    // this.getForm = getForm;

    this.setJson = setJson;
    this.isArray = isArray;
    //终止进程
    this.abortThread = abortThread;

}).call(this)