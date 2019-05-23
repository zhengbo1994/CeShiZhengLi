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
//    var url = "'../../../IDOA/PerformanceManagement/PerformancePlan/VPerformancePlanScopeBrowse.aspx?ID=" + rowobject[0] + "'";
    //    return '<a  href="#ShowScope" onclick="javascript:openWindow(' + url + ',800, 600)">' + cellvalue + '</a>';
    return cellvalue;
}

function btnSearch_Click()
{
    window.frames('Main').window.reloadData();
}

function btnChoose_Click()
{
    btnAdd_Click();
    var vObjectID = "";
    var vObjectName = "";
    var vEOName = "";
    var vObjectType = "";
    var vExamScore = "";
    var vLevelName = "";

    var lstStations = getObj("lstStations");
    for (i = 0; i < lstStations.length; i++)
    {
        vObjectID += ',' + lstStations.options[i].value;
        vObjectName += ',' + lstStations.options[i].text;
        vEOName += ',' + lstStations.options[i].eoname;
        vObjectType += ',' + lstStations.options[i].objectType;
        vExamScore += ',' + lstStations.options[i].score;
        vLevelName += ',' + lstStations.options[i].level;
    }
    if (vObjectID == "")
    {
        vObjectName = "";
        vObjectID = "";
        vEOName = "";
        vObjectType = "";
        vExamScore = "";
        vLevelName = "";
    }
    else
    {
        vObjectID = vObjectID.substr(1);
        vObjectName = vObjectName.substr(1);
        vEOName = vEOName.substr(1);
        vObjectType = vObjectType.substr(1);
        vExamScore = vExamScore.substr(1);
        vLevelName = vLevelName.substr(1);
    }
    
    var returnJson = {
        ObjectIDs: vObjectID,
        EONames: vEOName,
        ObjectNames: vObjectName,
        ObjectTypes: vObjectType,
        ExamScores: vExamScore,
        LevelNames: vLevelName
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

    var ObjectNames = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'ObjectName');
    var EONames = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'EOName');
    var ObjectIDs = window.frames('Main').getJQGridSelectedRowsID('jqGrid1', true);
    var ObjectTypes = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'ObjectType');
    var ExamScores = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'ExamScore');
    var LevelNames = window.frames('Main').getJQGridSelectedRowsData('jqGrid1', true, 'LevelName');

    if (ObjectIDs.length == 0 & chk == 'chk')
    {
        return alertMsg("请选择岗位。", getObj("btnAdd"));
    }
    
    for (var i = 0; i < ObjectIDs.length; i++)
    {
        var repeat = false;
        for (j = 0; j < lstStations.length; j++)
        {
            if (lstStations.options[j].value == ObjectIDs[i])
            {
                repeat = true;
                break;
            }
        }

        if (!repeat && ObjectIDs[i] != "")
        {
            var opt = document.createElement("OPTION");
            opt.value = ObjectIDs[i];
            opt.text = $.jgrid.stripHtml(ObjectNames[i]);
            opt.eoname = $.jgrid.stripHtml(EONames[i]);
            opt.objectType = $.jgrid.stripHtml(ObjectTypes[i]);
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

    var vObjectName = window.frames('Main').getJQGridAllRowsData('jqGrid1', 'ObjectName');
    var vEOName = window.frames('Main').getJQGridAllRowsData('jqGrid1', 'EOName');
    var vObjectID = window.frames('Main').getJQGridAllRowsID('jqGrid1', true);
    var vObjectType = window.frames('Main').getJQGridAllRowsData('jqGrid1',  'ObjectType');
    var vExamScore = window.frames('Main').getJQGridAllRowsData('jqGrid1',  'ExamScore');   
    var vLevelName = window.frames('Main').getJQGridAllRowsData('jqGrid1',  'LevelName');

    if (vObjectID.length == 0)
    {
        return;
    }

    for (var i = 0; i < vObjectID.length; i++)
    {
        var repeat = false;
        for (j = 0; j < lstStations.length; j++)
        {
            if (lstStations.options[j].value == vObjectID[i])
            {
                repeat = true;
                break;
            }
        }

        if (!repeat && vObjectID[i] != "")
        {
            var opt = document.createElement("OPTION");
            opt.value = vObjectID[i];
            opt.text = $.jgrid.stripHtml(vObjectName[i]);
            opt.eoname = $.jgrid.stripHtml(vEOName[i]);
            opt.objectType = $.jgrid.stripHtml(vObjectType[i]);
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
    var vObjectID = rowid;
    var vObjectName = $('#jqGrid1').getRowData(rowid)['ObjectName'];
    var vEOName = $('#jqGrid1').getRowData(rowid)['EOName'];
    var vObjectType = $('#jqGrid1').getRowData(rowid)['ObjectType'];
    var vExamScore = $('#jqGrid1').getRowData(rowid)['ExamScore'];
    var vLevelName = $('#jqGrid1').getRowData(rowid)['LevelName'];

    if ($(window.parent.document).find('#lstStations option[value=\'' + vObjectID + '\']').length <= 0)
    {
        if (vObjectType == "组织")
        {
            vObjectType = "O";
        }
        else
        {
            vObjectType = "S";
        }
        var opt = document.createElement("OPTION");
        opt.value = vObjectID;
        opt.text = $.jgrid.stripHtml(vObjectName);
        opt.eoname = $.jgrid.stripHtml(vEOName);
        opt.objectType = $.jgrid.stripHtml(vObjectType);
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
    var objectType = list.options[index].objectType;
    var score = list.options[index].score;
    var level = list.options[index].level;


    //将目标选项复制到当前选项           
    list.options[index].text = list.options[index + to].text
    list.options[index].value = list.options[index + to].value
    list.options[index].eoname = list.options[index + to].eoname
    list.options[index].objectType = list.options[index + to].objectType
    list.options[index].score = list.options[index + to].score
    list.options[index].level = list.options[index + to].level

    //转移到目标选项           
    list.options[index + to].text = text;
    list.options[index + to].value = value;
    list.options[index + to].eoname = eoname;
    list.options[index + to].objectType = objectType;
    list.options[index + to].score = score;
    list.options[index + to].level = level;

    //选中索引也跟着变
    list.selectedIndex = index + to;

}