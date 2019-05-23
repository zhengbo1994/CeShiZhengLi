/************************************* Achievo.Javascript Library **************************
* Using jQuery 1.4.1
* Create by xiaodm on 2012-6-9 14:05:51
*******************************************************************************************/
(function ($)
{
    $.fn.FITotalText = function (customSettings)
    {
        var _settings = $.extend(true, { childFilter: "gid='1'", totalCtlID: "lblTotal", isTotalNum: true }, customSettings);

        if (this.selector != "null")
        {
            if (_settings.isTotalNum)
            {
                if (!$.fn.FITotalText.Sync.ValidateNum(this))
                {
                    return;
                }
            }
        }
        var num = 0;
        var txtNum = "";
        $("body").find("input[" + _settings.childFilter + "]").each(function ()
        {
            //debugger;
            if ($(this).val())
            {
                if (_settings.isTotalNum)
                {
                    num += parseFloat($(this).val().replace(/,/g, ''));
                }
                else
                {
                    txtNum = txtNum.concat($(this).val() + ";");
                }
            }

        });
        $("body").find("span[" + _settings.childFilter + "]").each(function ()
        {
            if ($(this).html())
            {
                if (_settings.isTotalNum)
                {
                    num += parseFloat($(this).html().replace(/,/g, ''));
                }
                else
                {
                    txtNum = txtNum.concat($(this).val() + ";");
                }
            }
        });
        num = $.fn.FITotalText.Sync.RoundNumber(num, 2); //保留2位小数
        if (_settings.isTotalNum)
        {
            $("#" + _settings.totalCtlID).html(num);
        }
        else
        {
            $("#" + _settings.totalCtlID).val(txtNum);
        }
        if (_settings.formTotalCtlID)
        {
            var hid_FormTotal = document.getElementById(_settings.formTotalCtlID);
            if (!hid_FormTotal || hid_FormTotal == null)
            {
                hid_FormTotal = parent.document.getElementById(_settings.formTotalCtlID);
            }
            if (hid_FormTotal && hid_FormTotal != null)
            {
                if (_settings.isTotalNum)
                {
                    $(hid_FormTotal).val(num);
                }
                else
                {
                    $(hid_FormTotal).val(txtNum);
                }
            }
        }
    };

    $.fn.FITotalText.Sync = {
        ValidateNum: function (obj)
        {
            var txtval = obj.val();
            if (txtval != "")
            {
                //var pattern = /^\d+(\.\d+)?$/;
                var pattern = /^(-?\d+)(\.\d+)?$/;
                var testFlag = pattern.test(txtval);
                if (testFlag == false)
                {
                    //obj.select();
                    alert('只能输入数字！');
                }
                return testFlag;
            } return true;
        },
        RoundNumber: function (number, w)
        {
            var num = number;
            var w10 = 1;
            for (var i = 1; i <= w; i++)
            {
                w10 *= 10;
            }

            num = Math.round(num * w10) / w10;

            var wdot = num.toString().indexOf(".");
            var NUM = num.toString();

            if (wdot == -1)
            {
                NUM = NUM + ".";
                wdot = NUM.length - 1;
            }
            if (wdot + w + 1 > NUM.length)
            {
                //不足补0
                var addNum = wdot + w + 1 - NUM.length;
                for (i = 0; i < addNum; i++)
                {
                    NUM = NUM + "0";
                }
            }
            return NUM;
        }
    };

})(jQuery);
