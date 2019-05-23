// VSelectMultiExamPlanScope.aspx等页面的JS文件
// 作者：翁化青
// 时间：2012-04-17

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

//查看考核范围链接
function renderScopeLink(cellvalue, options, rowobject)
{
    var url = "'../../../IDOA/PerformanceManagement/PerformancePlan/VPerformancePlanScopeBrowse.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#ShowScope" onclick="javascript:openWindow(' + url + ',800, 600)">' + cellvalue + '</a>';
}

function btnSearch_Click()
{
    window.frames('Main').window.reloadData();
}

function btnChoose_Click()
{
    btnAdd_Click();
    var vEPSID = "";
    var vStruName = "";
    var vEOName = "";
    var vIsTeamLeader ="";
    var vExamScore = "";
    var vLevelName = "";
       
    var lstStations = getObj("lstStations");
    for (i = 0; i < lstStations.length; i++)
    {
        vEPSID += ',' + lstStations.options[i].value;
        vStruName += ',' + lstStations.options[i].text;
        vEOName += ',' + lstStations.options[i].eoname;
        vIsTeamLeader += ',' + lstStations.options[i].leader;
        vExamScore += ',' + lstStations.options[i].score;
        vLevelName += ',' + lstStations.options[i].level;
    }
    if (vEPSID == "")
    {
        vStruName = "";
        vEPSID = "";
        vEOName = "";
        vIsTeamLeader = "";
        vExamScore = "";
        vLevelName = "";
    }
    else
    {
        vEPSID = vEPSID.substr(1);
        vStruName = vStruName.substr(1);
        vEOName = vEOName.substr(1);
        vIsTeamLeader = vIsTeamLeader.substr(1);
        vExamScore = vExamScore.substr(1);
        vLevelName = vLevelName.substr(1);
    }

    var returnJson = {
        EPSIDs: vEPSID,
        EONames: vEOName,
        StruNames: vStruName,
        IsTeamLeaders: vIsTeamLeader,
        ExamScores: vExamScore,
        LevelNames:vLevelName       
    };

    window.returnValue = returnJson;
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

    var StruNames = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'StruName');
    var EONames = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'EOName');
    var EPSIDs = window.frames('Main').getJQGridSelectedRowsID('jqGrid1', true);
    var IsTeamLeaders = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'IsTeamLeader');
    var ExamScores = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'ExamScore');
    var LevelNames = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'LevelName');

    if (EPSIDs.length == 0 & chk == 'chk')
    {
        return alertMsg("请选择岗位。", getObj("btnAdd"));
    }

    for (var i = 0; i < EPSIDs.length; i++)
    {
        var repeat = false;
        for (j = 0; j < lstStations.length; j++)
        {
            if (lstStations.options[j].value == EPSIDs[i])
            {
                repeat = true;
                break;
            }
        }

        if (!repeat && EPSIDs[i] != "")
        {
            var opt = document.createElement("OPTION");
            opt.value = EPSIDs[i];
            opt.text = $.jgrid.stripHtml(StruNames[i]);
            opt.eoname = $.jgrid.stripHtml(EONames[i]);
            opt.leader = $.jgrid.stripHtml(IsTeamLeaders[i]);
            opt.score = $.jgrid.stripHtml(ExamScores[i]);
            opt.level = $.jgrid.stripHtml(LevelNames[i]);
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

    var vStruName = window.frames('Main').getJQGridAllRowsData('jqGrid1', 'StruName');
    var vEOName = window.frames('Main').getJQGridAllRowsData('jqGrid1', 'EOName');
    var vEPSID = window.frames('Main').getJQGridAllRowsID('jqGrid1', true);
    var vIsTeamLeader = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'IsTeamLeader');
    var vExamScore = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'ExamScore');
    var vLevelName = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'LevelName');

    if (vEPSID.length == 0)
    {
        return;
    }

    for (var i = 0; i < vEPSID.length; i++)
    {
        var repeat = false;
        for (j = 0; j < lstStations.length; j++)
        {
            if (lstStations.options[j].value == vEPSID[i])
            {
                repeat = true;
                break;
            }
        }

        if (!repeat && vEPSID[i] != "")
        {
            var opt = document.createElement("OPTION");
            opt.value = vEPSID[i];
            opt.text = $.jgrid.stripHtml(vStruName[i]);
            opt.eoname = $.jgrid.stripHtml(vEOName[i]);
            opt.leader = $.jgrid.stripHtml(vIsTeamLeader[i]);
            opt.score = $.jgrid.stripHtml(vExamScore[i]);
            opt.level = $.jgrid.stripHtml(vLevelName[i]);
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
    var vEPSID = rowid;
    var vStruName = $('#jqGrid1').getRowData(rowid)['StruName'];
    var vEOName = $('#jqGrid1').getRowData(rowid)['EOName'];
    var vIsTeamLeader = $('#jqGrid1').getRowData(rowid)['IsTeamLeader'];
    var vExamScore = $('#jqGrid1').getRowData(rowid)['ExamScore'];
    var vLevelName = $('#jqGrid1').getRowData(rowid)['LevelName'];

    if ($(window.parent.document).find('#lstStations option[value=\'' + vEPSID + '\']').length <= 0)
    {
        if (vIsTeamLeader =="是")
        {
            vIsTeamLeader = "Y";
        }
        else
        {
            vIsTeamLeader = "N";
        }
        var opt = document.createElement("OPTION");
        opt.value = vEPSID;
        opt.text = $.jgrid.stripHtml(vStruName);
        opt.eoname = $.jgrid.stripHtml(vEOName);
        opt.leader = $.jgrid.stripHtml(vIsTeamLeader);
        opt.score = $.jgrid.stripHtml(vExamScore);
        opt.level = $.jgrid.stripHtml(vLevelName);

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
    var eoname = list.options[index].eoname;
    var leader = list.options[index].leader;
    var score = list.options[index].score;
    var level = list.options[index].level;


    //将目标选项复制到当前选项           
    list.options[index].text = list.options[index + to].text
    list.options[index].value = list.options[index + to].value
    list.options[index].eoname = list.options[index + to].eoname
    list.options[index].leader = list.options[index + to].leader
    list.options[index].score = list.options[index + to].score
    list.options[index].level = list.options[index + to].level

    //转移到目标选项           
    list.options[index + to].text = text;
    list.options[index + to].value = value;
    list.options[index + to].eoname = eoname;
    list.options[index + to].leader = leader;
    list.options[index + to].score = score;
    list.options[index + to].level = level;

    //选中索引也跟着变
    list.selectedIndex = index + to;

}