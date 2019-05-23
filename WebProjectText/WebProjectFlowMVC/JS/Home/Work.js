// 首页Index.aspx页使用的打开主动工作和待办工作页面的方法



// 打开Logo页下拉菜单的工作页面
function showLogoWork(index)
{
    var url = "";
    
    switch (index)
    {
        case 101:
            url = "/{0}/IDOA/IntraMail/VMailWrite.aspx";
            break;
        case 102:
            url = "/{0}/IDOA/EnCulture/Bulletin/VBulletin.aspx";
            break;
        case 103:
            url = "/{0}/IDOA/EnCulture/News/VNews.aspx";
            break;
        case 104:
            url = "/{0}/Common/VCommunicate.aspx";
            url = "/{0}/";////////////////////////// 即时通讯
            break;
        case 105:
            url = "/{0}/IDOA/EnCulture/bbs/VForumMyTopic.aspx";
            break;
        case 106:
            url = "/{0}/OperAllow/Other/Sms/VSmsSend.aspx";
            break;
        case 107:
            url = "/{0}/IDOA/QualityReport/VQualityDailyManageAdd.aspx?From=Default";
            url = "/{0}/";////////////////////////// 品质日报
            break;
        case 108:
            url = "/{0}/OperAllow/Other/VFileSharing.aspx";
            break;
            
        case 201:
            url = "/{0}/Knowledge/Archives/VMyArchives.aspx";
            break;
        case 202:
            url = "/{0}/IDOA/MyWork/MyDoc/VMyDoc.aspx";
            break;
        case 203:
            url = "/{0}/Knowledge/CorpFile/VCorpFile.aspx";
            break;
        case 204:
            url = "/{0}/Supplier/CustomerOrSupplier/VCustomerOrSupplier.aspx";
            break;
        case 205:
            url = "/{0}/ZBidding/MaterialServiceData/VMaterialType.aspx";
            break;
        case 206:
            url = "/{0}/Knowledge/CorpImage/VCorpImage.aspx";
            break;
        case 301:
            url = "/{0}/Common/Private/VSSOJump.aspx?SSOCID=C49C8F9C-882E-40B5-820E-86EF7A945D25";
            break;
    }
    
    if (url != "")
    {
        openWindow(stringFormat(url, rootUrl), 960, 650);
    }
}

// 打开待办工作页面
function showWaitWork(url, frameName, iModuleIndex, iWorkIndex)
{
   
    if (url.indexOf('/') == 0)
    {
        url = url.substring(1, url.length);
    }
    url = stringFormat("/{0}/" + url, rootUrl);
    //url = stringFormat("/{0}" + url, rootUrl);
    if (frameName)
    {
        url += (url.indexOf("?") != -1 ? "&" : "?") + document.location.search.substr(1);
        window.parent.frames[frameName].location = url;
    }
    else
    {
        if (arguments.length >= 4)
        {
            receiveRemind(iModuleIndex, iWorkIndex);
        }
        
        openWindow(url, 960, 650);
    }

}

//异步刷新待办列表树
function reloadTree(theme, isRefresh, treeNode)
{
    ajax
        (
        window.location.href, {}, "json", function (data)
        {
            $("#hidWaitWork").val(data.Data);
            loadWaitWork(theme, isRefresh, treeNode);
        });
}

// 个人工作区-待办工作，加载工作
//isRefresh 是否异步刷新  treeNode 刷新前选中的节点
function loadWaitWork(theme, isRefresh, treeNode)
{
    var html = "";

    setWaitWork(1, $("#hidWaitWork").val());

    if (remindWorks.Count > 0)
    {
        html += '<table border="0" cellpadding="0" cellspacing="0">';
        //全部待办
        html += stringFormat('<tr id="{0}"><td nowrap>'
                    + '<img id="img_{0}" class="img_tree" onclick="expColTG(this)" src="/{1}/App_Themes/{2}/img/tree/item.gif"/>'
                    + '<span class="normalNode" onclick="clickTreeNode(this);showWaitWork(\'{5}\',\'{6}\')">{7}</span>'
                            + '</td></tr>', 0, rootUrl, theme, "", "", "/Common/Personal/VWaitAllWork.aspx",
                            'IDWorkaroundTabFrame', "全部");

        for (var i = 0; i < remindWorks.RemindWork.length; i++)
        {
            var works = remindWorks.RemindWork[i];
            if (works.Count > 0)
            {
                var pid = (i + 1);
                var pLast = beLastWork(i, 0, 1);

                html += stringFormat('<tr id="{0}" class="level-0"><td nowrap>'
                    + '<img id="img_{0}" class="img_tree" onclick="expColTG(this)" src="/{1}/App_Themes/{2}/img/tree/expand{3}.gif"/>'
                    + '<span class="normalNode" onclick="$(\'#img_{0}\')[0].click()">{4}</span>'
                    + '<span class="normalNode number">{6}<span style="color:red">{5}</span>{7}</span>'
                    + '</td></tr>', pid, rootUrl, theme, (pLast ? "_last" : ""), works.Title, works.Count,
                        ((theme === "TenderBlue" || theme === "GreyBlack" || theme === "CloudsWhite" || theme === "JadeBlue" || theme === "VerdureGreen") ? "" : "["), ((theme === "TenderBlue" || theme === "GreyBlack" || theme === "CloudsWhite" || theme === "JadeBlue" || theme === "VerdureGreen") ? "" : "]"));

                for (var j = 0; j < works.Work.length; j++)
                {
                    var name = works.Work[j][2];
                    var iDoCnt = works.Work[j][3];
                    var iLookCnt = works.Work[j][4];
                    var beCheck = works.Work[j][6];
                    var waitUrl = works.Work[j][7];

                    if (iDoCnt + iLookCnt > 0)
                    {
                        var sid = pid + "." + (j + 1);
                        var sLast = beLastWork(i, j, 2);
                        if (beCheck && iDoCnt > 0)
                        {
                            name += remindDefine.DoName;
                        }

                        html += stringFormat('<tr id="{0}"><td nowrap>'
                            + '<img class="img_tree" src="/{1}/App_Themes/{2}/img/tree/{3}.gif"/>'
                            + '<img class="img_tree" src="/{1}/App_Themes/{2}/img/tree/item{4}.gif"/>'
                            + '<span id="span_{0}" class="normalNode" onclick="clickTreeNode(this);showWaitWork(\'{5}\',\'{6}\')">{7}</span>'
                            + '<span class="normalNode number">[<span class="number" style="color:red">{8}</span>]</span>'
                            + '</td></tr>', sid, rootUrl, theme, (pLast ? "blank" : "vline"), (sLast ? "_last" : ""), waitUrl,
                            'IDWorkaroundTabFrame', name, (iDoCnt + iLookCnt));
                    }
                }
            }
        }
    }
    else
    {
        html = '<span class="promptmsg">[&nbsp;注：无数据。]</span>';
    }

    $("#divMPList").html(html);

    if (remindWorks.Count > 0)
    {
        getObjP("spWorkCnt").innerHTML = stringFormat('[<span style="color:red">{0}</span>]', remindWorks.Count);
        if (isRefresh)
        {
            clickTreeNode($(".normalNode")[0]);
            if ($("tr[id='" + treeNode + "']").length > 0)
            {
                clickTreeNode($("tr[id='" + treeNode + "'] span")[0]);
            }
        }
        else
        {
            $(".normalNode")[0].click();
        }
        //        $(".normalNode")[2].click();
    }
}

// 个人工作区-待办工作，是否最后一项工作
function beLastWork(i, j, level)
{
    var result = true;
    if (level == 1)
    {
        for (i++; i < remindWorks.RemindWork.length; i++)
        {
            if (remindWorks.RemindWork[i].Count > 0)
            {
                result = false;
                break;
            }
        }
    }
    else if (level == 2)
    {
        for (j++; j < remindWorks.RemindWork[i].Work.length; j++)
        {
            var work = remindWorks.RemindWork[i].Work[j];
            if (work[3] + work[4] > 0)
            {
                result = false;
                break;
            }
        }
    }
    return result;
}

// 个人工作区-已办工作，点击选项卡
function showMineWork(index, state)
{
    selectTab(index, "MeDone");
    window.frames("Left").location = "VMineWork.aspx?MDState=" + state;
}

// 个人工作区-已办工作，加载我的列表
function loadMineWork()
{
    ajaxRequest("VMineWork.aspx", { AjaxRequest: true }, "html", refreshMineWork);
}

function refreshMineWork(data, textStatus)
{
   
    $(document.body).html(data);

    //Edit by xiaoyb 存在全部按钮,显示全部;不存在全部按钮,显示第一个
    var span = getObj("span_0");
    if ($(span).html() == "全部")
    {
        span.click();
    }
    else
    {
        $("#span_1").click();
    }
}

// 个人工作区-已办工作，打开我的页面
function showMeDoWork(span, url, isLeaf)
{
    if (isLeaf.toLowerCase() == "true")
    {
        clickTreeNode(span);
        var mdState = getParamValue("MDState");
        var msgType = -1;
        var schemeID = "";
        switch (mdState) {
            case "MeSend":
                msgType = 2;
                schemeID = "28617469-4d25-4e21-9873-fcf3723e1f0c";
                break;
            case "MeDone":
                msgType = 3;
                schemeID = "c406f83d-0c20-43d0-adc7-0a7143b23652";
                break;
            case "MeLook":
                msgType = 4;
                schemeID = "88c3134d-590a-4fee-9ee0-be01e9deb6a5";
                break;
        }
        if (span.id == "span_0") {
            url = "Common/CustomPage/VDoneMsgList.aspx?PageID=CA27C144-CB08-4753-94AA-86522E7BA573";
            url = addUrlParam(url, "MsgType", msgType);
            url = addUrlParam(url, "SchemeID", schemeID)
            window.parent.frames("IDWorkaroundTabFrame").location = "../../" + url;
        }
        else {
            window.parent.frames("IDWorkaroundTabFrame").location = "../../" + addUrlParam(url, "MDState", getParamValue("MDState"));
        }
    }
    else
    {
        var td = span.parentNode;
        var tr = td.parentNode;
        var img = getTGImg(tbMod, tr.rowIndex, td.cellIndex);
        if (img)
        {
            img.click();
        }
    }
}



// 首页的发起工作框方法

// 关闭发起工作框
function closeGuide()
{
    closeDialog(window["DialogID"]);
}