// JScript 文件   modify by dinghuan @2013-03-05  修改付款岗位设置页
//选择单选岗位
function selectStation(obj)
{
    var txt = obj.parentNode.previousSibling.getElementsByTagName("input").item(1);
    var hid = obj.parentNode.previousSibling.getElementsByTagName("input").item(0);
    var corpID = $("#ddlCorp option:selected").attr("value");
    var returnValue = openModalWindow('../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID=' + corpID, 1000, 700);
    if (returnValue != "" && returnValue != "undefined" && returnValue != null)
    {
        //设置控件值
        hid.value = returnValue.split('|')[0];
        txt.value = returnValue.split('|')[1];
        var tr = $(obj).parent().parent();
        tr.parent().parent().parent().parent().attr("status", "Modify");
    }
    return false;
}

//选择多岗位
//StationType: "PayPrepare",付款调配；"Pay",付款登记
function selectMultiStation(obj, stationType)
{
    var tr = $(obj).parent().parent();
    var txt = tr.find("input[id*=txt" + stationType + "]");
    var hid = tr.find("input[id*=hid" + stationType + "ID]");
    var corpID = $("#ddlCorp option:selected").attr("value");
    var params = {
        StationIDs: hid.val(),
        StationNames: txt.val()
    };
    var returnValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?From=ProjectStationConfig&Aim=' + stationType + '&CorpID=' + corpID, 1000, 700, params);
    if (returnValue != "undefined" && returnValue != null && returnValue != "")
    {
        //设置控件值
        hid.val(returnValue.split('|')[0]);
        txt.val(returnValue.split('|')[1]);
        var tr = $(obj).parent().parent();
        //若有返回数据，则标注行状态为修改状态
        tr.parent().parent().parent().parent().attr("status", "Modify");
    }
    return false;
}
//查看项目
function showProject(projectID)
{
    var url = "VProjectBrowse.aspx?ProjectID=" + projectID;
    openWindow(url, 1000, 800);
}

//修改备注
function remarkChange(sender)
{
    var txtRemark = $(sender);
    if (txtRemark.attr("oldvalue") != txtRemark.val())
    {
        //若备注被修改，则标注行为修改状态
        txtRemark.parent().parent().attr("status", "Modify");
    }
}

//保存方法
function saveData()
{
    setBtnEnabled(["btnSubmit"], false);
    var table = $("table[id*=dgData]");
    var rows = table.find("tr[status=Modify]");
    if (rows.length < 1)
    {
        alert("无数据修改。");
        setBtnEnabled(["btnSubmit"], true);
        return false;
    }
    if (confirm("是否确定保存当前内容？"))
    {
        var projectStation = [];
        rows.each(
            function ()
            {
                var tr = $(this);
                var projectID = tr.find("#hidProjectID").val();
                var payPrepareID = tr.find("#hidPayPrepareStationID").val();
                var payID = tr.find("#hidPayStationID").val();
                var feePayID = tr.find("#hidFeePayRequestStationID").val();
                if (payPrepareID != "")
                {
                    projectStation.push(
                        {
                            ProjectID: projectID,
                            StationID: payPrepareID,
                            StationType: 0,
                            LastEditBy: accountID,
                            Remark: tr.find("textarea[id*=txtRemark]").val()
                        }
                    );
                }
                if (payID != "")
                {
                    var ids = payID.split(',');
                    for (var i = 0; i < ids.length; i++)
                    {
                        projectStation.push(
                            {
                                ProjectID: projectID,
                                StationID: ids[i],
                                StationType: 1,
                                LastEditBy: accountID,
                                Remark: tr.find("textarea[id*=txtRemark]").val()
                            }
                        );
                    }
                }
                if (feePayID != "")
                {
                    var feeIDs = feePayID.split(',');
                    for (var i = 0; i < feeIDs.length; i++)
                    {
                        projectStation.push(
                            {
                                ProjectID: projectID,
                                StationID: feeIDs[i],
                                StationType: 3,
                                LastEditBy: accountID,
                                Remark: tr.find("textarea[id*=txtRemark]").val()
                            }
                        );
                    }
                }
            }
        );
        ajax(
            window.location.href,
            {
                IDAjax: true,
                ActionName: "Save",
                ActionData: $.jsonToString(projectStation)
            },
            "json",
            function (data)
            {
                var msg = data.Success == "Y" ? "保存成功。" : "保存失败。";
                if (data.Success == "Y")
                {
                    //保存成功后，清除行状态标识
                    $("#dgData").children().children().attr("status", "");
                }
                alert(msg);
            }, false, "POST");
    }
    setBtnEnabled(["btnSubmit"], true);
}
/****************  modify by dinghuan @2013-03-05
function selectStation(obj)
{ 
   var txt=obj.parentNode.previousSibling.getElementsByTagName("input").item(1);
   var hid=obj.parentNode.previousSibling.getElementsByTagName("input").item(0);
   var corpID = $("#ddlCorp option:selected").attr("value");
   var returnValue = openModalWindow('../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID=' + corpID, 1000, 700);
   if(returnValue != "" && returnValue != "undefined" && returnValue != null)
   {
        hid.value = returnValue.split('|')[0];
        txt.value = returnValue.split('|')[1];
   }
   return false;
}

function showProject(projectID)
{
    var url = "VProjectBrowse.aspx?ProjectID="+projectID;
    openWindow(url,1000,800);
}


// 重新加载DataGrid数据
function reloadData()
{
  var corpID = getObj("ddlCorp").value;
  
  ajaxRequest(window.location.href, {ActionName:'RELOAD', AjaxCorpID:corpID}, "text", setDgData);
}

//Ajax 获取数据后填充Dom节点内容
function setDgData(data)
{  
    $("#divMPList").html(data);
}

//保存客户端数据待提交(每次页面提交前执行)
function saveClientData()
{
    getObj('hidDataList').value="";
    
    var dgData=getObj(getObj("hidDgDataID").value);
    var corpID=getObj("ddlCorp").value;
    if(dgData!=null)
    {
       for (var i = 1; i < dgData.rows.length; i++)
       {
            var projectID=getObjTC(dgData, i,0, "input", 0).value;;
            var payPrepareStationID = getObjTC(dgData, i,1, "input", 0).value;
            var payStationID = getObjTC(dgData, i,2, "input",0).value;
            var remark=getObjTR(dgData, i, "textarea",0).value;
            getObj('hidDataList').value += "^" + corpID+ "|" + projectID + "|" + payPrepareStationID+"|"+payStationID+"|"+remark;
       }
    }    
    
    getObj('hidDataList').value = getObj('hidDataList').value ==""? "" : getObj('hidDataList').value.substr(1);
    
}
*******************/

