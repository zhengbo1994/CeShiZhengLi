/************************************* Javascript Library **************************
* Using jQuery 1.4.1
* Create by xiaodm on 2012-07-03
*******************************************************************************************/
(function ($)
{
    $.idc = new function ()
    {
        var _version = "1.0";
        var _file = "idcore.js";
        var _globalVars = {};

        this.addvar = function (key, value)
        {
            _globalVars[key] = value;
        };

        this.getvar = function (key)
        {
            if (key == "")
            {
                return null;
            }
            var _result = null;
            try
            {
                _result = _globalVars[key];
            }
            catch (e)
            {
                alert(e.Message);
            }
            return _result;
        };
        this.error = function (msg)
        {
            alert(msg);
            return false;
        };
        this.isNull = function (obj)
        {
            return (obj == undefined || obj == null);
        };
        this.isEmpty = function (str)
        {
            return $.trim(str).length == 0;
        };
        this.queryUrl = function (str, name)
        {
            var _result = str.match("[&|\\?]" + name + "[^&|\\s]*");
            if (result) return result[0].substr(name.length + 2);
            return "";
        };
        this.addUrlParam = function (url, key, value)
        {
            return url + (/\?/.test(url) ? "&" : "?") + key + "=" + value;
        };
        this.addUrlParamString = function (url, paramstr)
        {
            return url + (/\?/.test(url) ? "&" : "?") + paramstr;
        };
    }
})(jQuery)