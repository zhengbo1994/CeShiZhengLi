// VSelectMultiStation.aspx等页面的JS文件
// 作者：徐海波
// 时间：2010-05-13

function reloadData()
{
    var searchText = "";

    if (getObjP("txtKey"))
    {
        searchText = getObjP("txtKey").value;
    }
    var query = { EOID: parent["EOID"], SearchText: searchText };

    if (loadJQGrid("jqGrid1", query))
    {
        refreshJQGrid("jqGrid1");
    }
}


function renderLink(cellvalue, options, rowobject)
{
    var url = "'../../OperAllow/Station/VStationBrowse.aspx?StationID=" + rowobject[0] + "'";
    return '<div class="nowrap"><a  href="javascript:window.openModalWindow(' + url + ',600,450)">' + cellvalue + '</a></div>';
}

function showTip(cellvalue, options, rowobject)
{
    return '<span style="width:100%;" title="' + rowobject[2] + '\>' + rowobject[3] + '\>' + cellvalue + '(' + rowobject[4] + ')">' + cellvalue + '</span>';
}

function ChangeChild()
{
    btnSearch_Click();
}

function ddlMutiStation_Change()
{
    var value = getObj('ddlMutiStation').value;
    SetCookie('MutiStation', value);
    btnSearch_Click();
}

function btnSearch_Click()
{
    window.frames('Main').window.reloadData();
}

function btnChoose_Click()
{
    btnAdd_Click();
    var vStationID = "";
    var vStruName = "";

    if ($('#hidMode').val().toUpperCase() == 'SINGLE')
    {
        if (!window.frames('Main')["jqGrid1_Loaded"])
        {
            return alertMsg("请选择考核组织。");
        }

        vStationID = $('#jqGrid1', window.frames('Main').document).getGridParam('selrow');

        if (!vStationID)
        {
            return alertMsg("请选择岗位。");
        }

        vStruName = stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGrid1', false, 'StruName'));
    }
    else
    {
        var lstStations = getObj("lstStations");
        for (i = 0; i < lstStations.length; i++)
        {
            vStationID += ',' + lstStations.options[i].value;
            vStruName += '，' + lstStations.options[i].text;
        }

        if (vStationID == "")
        {
            vStationID = "";
            vStruName = "";
        }
        else
        {
            vStationID = vStationID.substr(1);
            vStruName = vStruName.substr(1);
        }
    }

    window.returnValue = vStationID + "|" + vStruName;
    window.opener = null;
    window.close();
}
//end--btnChoose_Click()

function btnAdd_Click(chk)
{
    var lstStations = getObj("lstStations");
    if (lstStations == null)
    {
        lstStations = getObjP("lstStations");
    }

    if (!window.frames('Main')["jqGrid1_Loaded"])
    {
        return;
    }

    var vStationID = window.frames('Main').getJQGridSelectedRowsID('jqGrid1', true);
    var vStruName = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'StruName');

    if (vStationID.length == 0 & chk == 'chk')
    {
        return alertMsg("请选择岗位。", getObj("btnAdd"));
    }

    for (var i = 0; i < vStationID.length; i++)
    {
        var repeat = false;
        for (j = 0; j < lstStations.length; j++)
        {
            if (lstStations.options[j].value == vStationID[i])
            {
                repeat = true;
                break;
            }
        }

        if (!repeat && vStationID[i] != "")
        {
            var opt = document.createElement("OPTION");
            opt.value = vStationID[i];
            opt.text = $.jgrid.stripHtml(vStruName[i]);
            lstStations.add(opt, lstStations.length);
        }
    }
}

function btnDel_Click()
{
    var lstStations = getObj("lstStations");
    if (lstStations == null)
    {
        lstStations = getObjP("lstStations");
    }
    for (i = lstStations.options.length - 1; i >= 0; i--)
    {
        if (lstStations.options[i].selected)
        {
            lstStations.remove(i);
        }
    }
}

function btnAddAll_Click()
{
    var lstStations = getObj("lstStations");
    if (lstStations == null)
    {
        lstStations = getObjP("lstStations");
    }

    var vStationID = window.frames('Main').getJQGridAllRowsID('jqGrid1');
    var vStruName = window.frames('Main').getJQGridAllRowsData('jqGrid1', 'StruName');

    if (vStationID.length == 0)
    {
        return;
    }

    for (var i = 0; i < vStationID.length; i++)
    {
        var repeat = false;
        for (j = 0; j < lstStations.length; j++)
        {
            if (lstStations.options[j].value == vStationID[i])
            {
                repeat = true;
                break;
            }
        }

        if (!repeat && vStationID[i] != "")
        {
            var opt = document.createElement("OPTION");
            opt.value = vStationID[i];
            opt.text = $.jgrid.stripHtml(vStruName[i]);

            lstStations.add(opt, lstStations.length);
        }
    }
}

function btnDelAll_Click()
{
    var lstStations = getObj("lstStations");
    if (lstStations == null)
    {
        lstStations = getObjP("lstStations");
    }
    for (i = lstStations.options.length - 1; i >= 0; i--)
    {
        lstStations.remove(i);
    }
}

function lstStationsDB_Clisk()
{
    var addOption = document.createElement("option ")
    var index

    if (getObj("lstStations").length == 0) return (false);
    index = getObj("lstStations").selectedIndex
    if (index < 0) return (false);
    getObj("lstStations").remove(index)
}

//双击添加人员
function jqGridDblClick(rowid, iRow, iCol, e)
{
    var lstStations = getObjP("lstStations");
    if (lstStations == null)
    {
        lstStations = window.parent.parent.document.getElementById("lstStations");
    }
    var vStationID = rowid;
    var vStruName = $('#jqGrid1').getRowData(rowid)['StruName'];

    if ($(window.parent.document).find('#lstStations option[value=\'' + vStationID + '\']').length <= 0)
    {
        var opt = document.createElement("OPTION");
        opt.value = vStationID;
        opt.text = $.jgrid.stripHtml(vStruName);
        lstStations.add(opt, lstStations.length);
    }
}

//上下移动选项 陈晓明
function move(to)
{
    var list = getObj("lstStations");
    var total = list.options.length - 1;
    var index = getObj("lstStations").selectedIndex;
    if (index == -1) return false;
    if (to == +1 && index == total) return false;
    if (to == -1 && index == 0) return false;

    //临时保存选项的值
    var text = list.options[index].text;
    var value = list.options[index].value;


    //将目标选项复制到当前选项           
    list.options[index].text = list.options[index + to].text
    list.options[index].value = list.options[index + to].value

    //转移到目标选项           
    list.options[index + to].text = text;
    list.options[index + to].value = value;

    //选中索引也跟着变
    list.selectedIndex = index + to;

}

function SetCookie(name, value)//两个参数，一个是cookie的名子，一个是值
{
    var Days = 30; //此 cookie 将被保存 30 天
    var exp = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name)//取cookies函数        
{
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]); return null;
}

//查看考核范围链接
function renderScopeLink(cellvalue, options, rowobject)
{
    var url = "'../PerformancePlan/VPerformancePlanScopeBrowse.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#ShowScope" onclick="javascript:openWindow(' + url + ',800, 600)">' + cellvalue + '</a>';
}