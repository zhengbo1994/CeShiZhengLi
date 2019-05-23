// VSelectSingleEmployee.aspx等页面的JS文件
// 作者：徐海波
// 时间：2010-05-13
function RefreshCorpStructure(struID)
{
    //$('#jqgEmployee',window.parent.frames("Main").document).getGridParam('postData').CorpID=struID;
    
    //window.parent.frames("Main").window.reloadData();
    execFrameFuns("Main", function ()
    {
        $('#jqgEmployee', window.parent.frames("Main").document).getGridParam('postData').CorpID = struID;
        window.parent.frames("Main").reloadData();
    }, window.parent);
}

function ddlState_Change()
{
    var vState=$("#ddlState").val();
    var vKey=$("#txtKey").val();

    checkShow(vState, vKey,getObj("trLeft"));
    
    $('#jqgEmployee',window.parent.frames("Main").document).getGridParam('postData').State=vState;
    
    window.frames('Main').window.reloadData();
}

function btnSearch_Click()
{
    var vKey=$("#txtKey").val();
    var vState=$("#ddlState").val();                                 
    
    checkShow(vState, vKey,getObj("trLeft"));
   
    $('#jqgEmployee',window.frames("Main").document).getGridParam('postData').KeyValue=vKey;
    
    window.frames('Main').window.reloadData();
}

function checkShow(vState, vKey, vTr)
{
    if (vState != "Y" || vKey!= "")
    {
        vTr.style.display = "none";
    }
    else
    {
        vTr.style.display = "";
    }
}

function ChangeBackColor(span)
{
    getObj(getObj("hidFirstSpan").value).className = "normalNode";
    span.className = "selNode";
    getObj("hidFirstSpan").value = span.id;
}

function reloadData()
{
    refreshJQGrid('jqgEmployee');
}

function renderLink(cellvalue,options,rowobject)
{
    var url = "'../../OperAllow/Station/VStationBrowse.aspx?StationID="+rowobject[6]+"'";
    return '<div class="nowrap"><a  href="javascript:window.openModalWindow('+url+',600,450)">'+cellvalue+'</a></div>' ;
}

function btnChoose_Click()
{
    var vFrom=$("#hidFrom").val();
    var vID = "";
    var accountID="";
    var vName = "";
    var vStruName="";
    var vStruID="";
    var defaultStationID = "";
    var vCorpName = "";
   
    accountID = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgEmployee', false, 'AccountID'));
    vID = window.frames('Main').getJQGridSelectedRowsID('jqgEmployee', false);
    vEmployeeName = stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgEmployee', false, 'EmployeeName'));
    vStationName = stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgEmployee', false, 'StationName'));
    vName = vEmployeeName + "(" + vStationName + ")";
//    vName = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgEmployee', false, 'EmployeeName') + "(" + window.frames('Main').getJQGridSelectedRowsData('jqgEmployee', false, 'StationName') + ")");
    vStruName=$.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgEmployee', false, 'StruName'));
    defaultStationID=stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgEmployee', false, 'DefaultStationID'));
    vStruID=stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgEmployee', false, 'StruID'));
    vCorpName = stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgEmployee', false, 'ParentCorpName'));
    
    if (vID == null || vID == "")
    {
        return alertMsg("请选择人员。", getObj("btnChoose"));    
    }
    if ($("#hidType").val() == "account")
    {
        //add by chenzy on2013-09-26: + defaultStationID
        window.returnValue = accountID + "|" + vName + "|" + vStruName +"|"+ defaultStationID ;
    }
    // 为岗位选择账号
    else if ($("#hidType").val() == "StationAccount")
    {
        window.returnValue = accountID + "|" + vEmployeeName + "|" + defaultStationID + "|" + vStationName + "|" + vStruName + "|" + vStruID;
    }
    //固定资产选择使用人员
    else if ($("#hidType").val() == "FixedAsset")
    {
        window.returnValue = accountID + "|" + vEmployeeName + "|" + vStruID + "|" + vStruName + "|" + vCorpName;
    }
    else
    {
        window.returnValue = vID + "|" + vName + "|" + vStruName + "|" + defaultStationID;
    }
    
    window.close();
}



function btnClear_Click()
{
    //by dingdj
    //window.returnValue = "||";
    window.returnValue = "||||||";

    window.close();
}

//设置全局变量，在账号新增页面调用 --Add by 张敏强
var accountInfo=null;
function btnAdd_Click()
{
    accountInfo = [];
    openModalWindow('../../OperAllow/Account/VAccountAdd.aspx?type=StationAccount',850,600);
    if(accountInfo.length > 1)
     {                
        window.returnValue = accountInfo[0] + "|" + accountInfo[1] + "|" + accountInfo[2] + "|" + "Y";
        window.close();              
     }
}