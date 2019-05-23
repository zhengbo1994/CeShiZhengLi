$(function ()
{
    var down_url_andriod;
    var down_url_ios;
    var help_url_ios = "AppDownHelp.html";

    var browser =
        {
            versions: function ()
            {
                var u = navigator.userAgent, app = navigator.appVersion;
                return {         //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    wechat: u.indexOf("MicroMessenger") > -1,
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        };

    var down_tip = $(browser.versions.android ? ".img-andriod" : ".img-ios");

    if (browser.versions.iPhone || browser.versions.iPad)
    {
        var verinfo = navigator.userAgent.toLowerCase().match(/os [\d._]*/gi);
        var version = (verinfo + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, ".");
        if (version && parseInt(version.substr(0, 1)) > 8)
        {
            $(".img-help").show();
        }
    }

    if (browser.versions.iPhone || browser.versions.iPad || browser.versions.android)
    {
        $.ajax(
            {
                url: "AppData.ashx",
                data: { "action": "GetDataTableByText", "cmdtext": "SELECT AppPlistUrl,AppApkUrl FROM OperAllowDB.dbo.TMobileConfig" },
                dataType: "json",
                success: function (data)
                {
                    if (data.OperateResult)
                    {
                        data = eval("(" + data.ResultText + ")");
                        if (data.length && data[0].length)
                        {
                            down_url_andriod = data[0][0]["AppApkUrl"];
                            down_url_ios = 'itms-services://?action=download-manifest&url=' + data[0][0]["AppPlistUrl"];
                        }
                        else
                        {
                            alert("APP下载地址加载失败。");
                        }
                    }
                    else
                    {
                        alert("APP下载地址加载失败。");
                    }
                },
                error: function (xmlHttpRequest, textStatus, errorThrown)
                {
                    alert("APP下载地址加载失败。");
                    return;
                    // alert("数据失败：" + xmlHttpRequest.responseText);
                    // alert("数据获取或操作失败。\n\n代码：" + xmlHttpRequest.status + "\n信息：" + xmlHttpRequest.statusText);
                }
            });
    }

    $(".img-down").on("touchend", function (event)
    {
        softdown();
        event.stopPropagation();
    });

    $(".img-help").on("touchend", function (event)
    {
        window.location.href = help_url_ios;
    });

    $("body").on("touchend", function (event)
    {
        down_tip.hide();
    });

    function softdown()
    {
        // 微信
        if (browser.versions.wechat)
        {
            down_tip.show();
        }
        else
        {
            if (browser.versions.iPhone || browser.versions.iPad || browser.versions.android)
            {
                if (browser.versions.android && down_url_andriod)
                {
                    window.location.href = down_url_andriod;
                }
                else if (browser.versions.ios && down_url_ios)
                {
                    window.location.href = down_url_ios;
                }
            }
            else
            {
                alert("无此手机系统的软件下载，请试用Android或者iOS的手机下载！");
            }
        }
    }

    if (!browser.versions.wechat)
    {
        setTimeout(softdown, 300);
    }
});
