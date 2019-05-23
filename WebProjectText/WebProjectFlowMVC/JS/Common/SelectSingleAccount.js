// VSelectSingleEmployee.aspx等页面的JS文件
// 作者：徐海波
// 时间：2010-05-13
function RefreshCorpStructure(struID)
{
    $('#jqgEmployee',window.parent.frames("Main").document).getGridParam('postData').CorpID=struID;
    
    var mutiStation =getObjP('ddlMutiStation').value;
    $('#jqgEmployee',window.parent.frames("Main").document).getGridParam('postData').MutiStation=mutiStation;  
    
    window.parent.frames("Main").window.reloadData();
}

function ddlState_Change()
{
    var vState=$("#ddlState").val();
    var vKey=$("#txtKey").val();

    checkShow(vState, vKey,getObj("trLeft"));
    
    $('#jqgEmployee',window.parent.frames("Main").document).getGridParam('postData').State=vState;
    
    var mutiStation =  $('#ddlMutiStation').val();
    $('#jqgEmployee',window.frames("Main").document).getGridParam('postData').MutiStation=mutiStation;  
    
    window.frames('Main').window.reloadData();
}

function btnSearch_Click()
{
    var vKey=$("#txtKey").val();
    var vState=$("#ddlState").val();
    
    checkShow(vState, vKey,getObj("trLeft"));
   
    $('#jqgEmployee',window.frames("Main").document).getGridParam('postData').KeyValue=vKey;
    
    var mutiStation =  $('#ddlMutiStation').val();
    $('#jqgEmployee',window.frames("Main").document).getGridParam('postData').MutiStation=mutiStation;  
    
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
    var vName = "";
    if (vFrom == "Leave")
    {
        vID = window.frames('Main').getJQGridSelectedRowsID('jqgEmployee', false);
        vName = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqgEmployee', false, 'EmployeeName') + "(" + window.frames('Main').getJQGridSelectedRowsData('jqgEmployee', false, 'StationName') + ")");
    }
    
    if (vID == null || vID == "")
    {
        return alertMsg("请选择人员。", getObj("btnChoose"));    
    }
    
    window.returnValue = vID + "|" + vName;
    
    window.close();
}



function btnClear_Click()
{
    window.returnValue = "|";
    
    window.close();
}

function SetCookie(name,value)//两个参数，一个是cookie的名子，一个是值
{
    var Days = 30; //此 cookie 将被保存 30 天
    var exp  = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
    
function getCookie(name)//取cookies函数        
{
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
     if(arr != null) return unescape(arr[2]); return null;
}

function ddlMutiStation_Change()
{
    var value =  getObj('ddlMutiStation').value;
   SetCookie('MutiStation',value);
   btnSearch_Click();
} 