
var options = {
    init: function ()
    {
        var that = this,
            $pageTitle = $(".page-title");

        $(document).on("click", ".fun-popup", function ()
        {
            var dataUrl = $(this).attr("data-url"),
            width = $(this).attr("data-width"),
            height = $(this).attr("data-height");

            if (dataUrl)
            {
                openWindow(dataUrl, parseInt(width), parseInt(height));
            }
        });

        this.personalSetting = new SimpleTabs({
            container: document.getElementById("personalSetting")
        });

        // 是否显示欢迎页
        this.isShowWeclomePage = new SwtichButton({
            container: document.getElementById("isShowWeclomePage"),
            // 点击保存提交
            callBack: function ()
            {
                that.submit.call(that);
            }
        });

        // 是否启用声音提醒
        this.isUseMessageRemind = new SwtichButton({
            container: document.getElementById("isUseMessageRemind"),
            // 点击保存提交
            callBack: function ()
            {
                that.submit.call(that);
            }
        });

        // 窗口模式
        this.windowMode = new ChooseButtom({
            $container: $("#windowMode"),
            value: 1,
            // 点击保存提交
            callBack: function ()
            {
                that.submit.call(that);
            }
        });

        // 站点布局
        this.webLayout = new ChooseImgs({
            container: document.getElementById("webLayout"),
            callBack: function ()
            {
                that.submit.call(that);
            }
        });

        // 站点样式
        this.themeStyle = new ChooseImgs({
            container: document.getElementById("themeStyle"),
            callBack: function ()
            {
                that.submit.call(that);
            },
            // 值改变时立即更新标题样式
            change: function ()
            {
                var ThemeStyle = {
                    // 默认主题
                    "2AE7A1E5-7614-4896-9150-5ED480E378CF": "page-title-default",
                    // 寻云采蓝
                    "147D1999-F4E1-4791-9A00-08164F8CDC32": "page-title-blue",
                    //新竹翠绿
                    "AEB00E6F-EC61-4FAC-B444-97EE5B00D16C": "page-title-green",
                    //斜阳黄秋
                    "73B001D2-9875-428A-81D8-5249875B84C7": "page-title-yellow",
                    //天涯落红
                    "7853242B-F29D-42A3-AC0F-78A24A2815E8": "page-title-red",
                    //素静柔蓝
                    "99FA12EC-1DB6-4779-8A86-6B4B8F56E2D4": "page-title-tenderblue",
                    //蓝田出玉
                    "169AED1E-2DB7-4B7B-9F05-58AE2956CD79": "page-title-jadeblue",
                    //一抹灰黑
                    "58AC2E15-B66E-48B6-86FE-B0DE4976353F": "page-title-greyblack",
                    //白衣胜雪
                    "1AC8F93D-75D9-4C44-925C-AEAC47C98246": "page-title-cloudswhite",
                    //青枝绿叶
                    "F17269E1-E220-4B38-9E49-016431E02C20": "page-title-verduregreen"
                };

                if (ThemeStyle[this.value] == "page-title-tenderblue"
                    || ThemeStyle[this.value] == "page-title-jadeblue"
                    || ThemeStyle[this.value] == "page-title-greyblack"
                    || ThemeStyle[this.value] == "page-title-cloudswhite"
                    || ThemeStyle[this.value] == "page-title-verduregreen") {
                    $(".other-menuStyle").hide();
                    var n = $(".default-menuStyle").attr("class").indexOf("option-active");
                    if (n == -1) {
                        $(".default-menuStyle").click();
                    }
                } else {
                    $(".other-menuStyle").show();
                }

                if (ThemeStyle[this.value])
                {
                    $pageTitle.removeClass("page-title-default page-title-blue page-title-green page-title-yellow page-title-red page-title-tenderblue page-title-jadeblue page-title-greyblack page-title-cloudswhite page-title-verduregreen")
                        .addClass(ThemeStyle[this.value]);
                }
                
            }
        });

        this.txtOfficePhone = new InputBox({
            container: document.getElementById("txtOfficePhone"),
            blur: function ()
            {
                if (this.oldValue !== this.value)
                {
                    that.submit.call(that)
                    if (that.submitState)
                    {
                        this.oldValue = this.value;
                    }
                }
            }
        });

        this.txtMobileTelephoneGroup = new InputBoxGroup({
            container: document.getElementById("txtMobileTelephone"),
            enFormat: function ()
            {
                var result = this.value.substring(0, 3) + "-" + this.value.substring(3, 7) + "-" + this.value.substring(7);
                this.container.value = result;
            },
            deFormat: function ()
            {
                var result = this.container.value.replace(/-/g, "");
                this.container.value = result;
            },
            blur: function ()
            {
                if (this.oldValue !== this.value)
                {
                    that.submit.call(that)
                    if (that.submitState)
                    {
                        this.oldValue = this.value;
                    }
                }
            }
        });

        this.txtEmail = new InputBox({
            container: document.getElementById("txtEmail"),
            blur: function ()
            {
                if (this.oldValue !== this.value)
                {
                    that.submit.call(that)
                    if (that.submitState)
                    {
                        this.oldValue = this.value;
                    }
                }
            }
        });

        this.txtQQ = new InputBox({
            container: document.getElementById("txtQQ"),
            blur: function ()
            {
                if (this.oldValue !== this.value)
                {
                    that.submit.call(that)
                    if (that.submitState)
                    {
                        this.oldValue = this.value;
                    }
                }
            }
        });

        this.txtQQWeibo = new InputBox({
            container: document.getElementById("txtQQWeibo"),
            blur: function ()
            {
                if (this.oldValue !== this.value)
                {
                    that.submit.call(that)
                    if (that.submitState)
                    {
                        this.oldValue = this.value;
                    }
                }
            }
        });

        this.txtSinaWeibo = new InputBox({
            container: document.getElementById("txtSinaWeibo"),
            blur: function ()
            {
                if (this.oldValue !== this.value)
                {
                    that.submit.call(that)
                    if (that.submitState)
                    {
                        this.oldValue = this.value;
                    }
                }
            }
        });
    },
    // @param data {object} 返回数据对象
    load: function (data)
    {
        if (data.Success === "Y")
        {
            var el = $.parseJSON(data.Data)[0];
            $("#lbEmployeeName").text(el.EmployeeName);
            $("#lbAccountName").text(el.AccountName);
            $("#imgUserAvatar").attr("src", el.MiniPhotoFileName ? ("../.." + el.MiniPhotoFileName) : "../../Image/home/user.gif");
            $("#imgSignature").attr("src", el.SignPic ? ("../.." + el.SignPic) : "");
            el.SignPic ? $("#imgSignature").parent().show() : $("#imgSignature").parent().hide();
            this.txtOfficePhone.val(el.OfficeTel);
            this.txtEmail.val(el.Email);
            this.txtQQ.val(el.QQ);
            this.txtQQWeibo.val(el.Wechat);
            this.txtSinaWeibo.val(el.SinaWeb);
            this.isShowWeclomePage.val(el.IsShowWelcome === "Y");
            this.isUseMessageRemind.val(el.SoundRemind === "Y");
            this.windowMode.val(el.WindowMode);
            this.webLayout.val(el.LID);

            this.themeStyle.val(el.TSID);
            this.txtMobileTelephoneGroup.val(el.Mobile);
        }
        else
        {
            this.promptDialog = this.promptDialog || new PromptDialog();
            this.promptDialog.show({ showTime: 1800, message: data.Data, promptType: "danger" });
        }
    },
    loadUrl: "../../Modules/Platform/Handlers/PersonalSetting.ashx?Action=GetEmployeeSetInfo",
    submitUrl: "../../Modules/Platform/Handlers/PersonalSetting.ashx?Action=UpdateEmployeeInfo",
    submitData: function ()
    {
        var el = {};

        el.OfficeTel = this.txtOfficePhone.val();
        el.Mobile = this.txtMobileTelephoneGroup.val();
        el.Email = this.txtEmail.val();
        el.QQ = this.txtQQ.val();
        el.Wechat = this.txtQQWeibo.val();
        el.SinaWeb = this.txtSinaWeibo.val();
        el.IsShowWelcome = this.isShowWeclomePage.val() ? "Y" : "N";
        el.SoundRemind = this.isUseMessageRemind.val() ? "Y" : "N";
        el.WindowMode = this.windowMode.val();
        el.LID = this.webLayout.val();
        el.TSID = this.themeStyle.val();
        return { "EmployeeInfo": $.jsonToString(el) };
    },
    validate: function ()
    {
        return (this.txtOfficePhone.validate() && this.txtMobileTelephoneGroup.validate()
            && this.txtEmail.validate() && this.txtQQ.validate());
    },
    submit: function (data)
    {
        this.promptDialog = this.promptDialog || new PromptDialog();

        if (data.Success === "Y")
        {
            this.promptDialog.show({ showTime: 1800, message: data.Data, promptType: "success" });
            this.submitState = true;
            return true;
        }
        else
        {
            this.promptDialog.show({ showTime: 1800, message: data.Data, promptType: "danger" });
        }
        this.submitState = false;
        return false;
    }
}

var page = new WebPage(options);

// 刷新头像
function refreshUserAvatar(imgSrc)
{
    if (imgSrc)
    {
        $("#imgUserAvatar").attr("src", "../.." + imgSrc);
    }
    else
    {
        $("#imgUserAvatar").attr("src", "../../Image/home/user.gif");
    }
}

// 刷新签名
function refreshSignature(imgSrc)
{
    if (imgSrc)
    {
        $("#imgSignature").attr("src", "../.." + imgSrc)
            .parent().show();
    }
    else
    {
        $("#imgSignature").attr("src", "")
            .parent().hide();
    }
}

