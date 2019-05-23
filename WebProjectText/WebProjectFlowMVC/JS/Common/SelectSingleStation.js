// SelectSingleStation.aspx等页面的JS文件
// 作者：guobin
// 时间：2010-05-14
function RefreshCorpStructure(struID)
{
    window.parent.frames("Main").window.reloadData(struID);
}

function ChangeBackColor(span)
{
    getObj(getObj("hidFirstSpan").value).className = "normalNode";
    span.className = "selNode";
    getObj("hidFirstSpan").value = span.id;
}

function reloadData(struID)
{
    var query = {
        StruID: struID
    };
    if (loadJQGrid('jqgStation', query))
    {
        refreshJQGrid('jqgStation');
    }
}

function renderLink(cellvalue,options,rowobject)
{
    var url = "'../../../OperAllow/Station/VStationBrowse.aspx?StationID=" + rowobject[0] + "'";
    return '<div class="nowrap"><a  href="javascript:openWindow(' + url + ',600,450)">' + cellvalue + '</a></div>' ;
}

function showTip(cellvalue,options,rowobject)
{
    return '<span style="width:100%;" title="' + rowobject[2] + '\>' + rowobject[3] +'\>' + cellvalue + '(' + rowobject[4] + ')">' + cellvalue + '</span>';
}

function btnSearch_Click()
{
    var vKey=$("#txtKey").val();
    if($('#trLeft').length>0)
    {
        if (vKey == "")
        {
            getObj("trLeft").style.display = "";
        }
        else
        {
            getObj("trLeft").style.display = "none";
        }
    }
    
    var child = $('#ddlChild').val(); 
    $('#jqgStation',window.frames("Main").document).getGridParam('postData').Child=child;     
    $('#jqgStation',window.frames("Main").document).getGridParam('postData').KeyValue=vKey;
    window.frames('Main').window.reloadData();
}

function ChangeChild()
{
    btnSearch_Click();
}

//选择
function btnChoose_Click()
{
    var vFrom=$("#hidFrom").val();
    var vStationID = "";
    var vStationName = "";
    var vEmployeeName = "";
   var vStruName = "";
   var vPositionName = "";
   var vParentCorpID = "";

    if (vFrom == ""|| vFrom == "Project"||vFrom == "plan" || vFrom=="Delegate")
    {
        vStationID = window.frames('Main').getJQGridSelectedRowsID('jqgStation', false);     
        vStationName = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgStation', false, 'StationName'));
        vEmployeeName = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgStation', false, 'TAccount__EmployeeName'));
        vStruName = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgStation', false, 'TCorpStructure__StruName'));
        vPositionName = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgStation', false, 'TPosition__PositionName'));
        vAccountID = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgStation', false, 'AccountID'));
        vStruID = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgStation', false, 'StruID'));
        vParentCorpID = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgStation', false, 'ParentCorpID'));
    }
    
    if (vStationID == null || vStationID == "")
    {
        return alertMsg("请选择岗位。", getObj("btnChoose"));
    }

    //判断url有没有回调函数标示validFn
    var data  = vStationID + "|" + vStationName + "(" + vEmployeeName + ")" + "|" + vPositionName + "|" + vStruName + "|" + vEmployeeName + "|" + vAccountID + "|" + vStruID + "|" + vParentCorpID;
    var validFnName = getParamValue("validFn");    
    if (typeof parent.dialogArguments[validFnName] == 'function') {
        if (!parent.dialogArguments[validFnName](data)) {
            alert("该岗位不能选择！");
            return false;
        }
    }
    window.returnValue = vStationID + "|" + vStationName + "(" + vEmployeeName + ")" + "|" + vPositionName + "|" + vStruName + "|" + vEmployeeName + "|" + vAccountID + "|" + vStruID + "|" + vParentCorpID;
   
    window.close();
    
}
//清除
function btnClear_Click()
{
    window.returnValue = "|||||||";
    window.close();
}

