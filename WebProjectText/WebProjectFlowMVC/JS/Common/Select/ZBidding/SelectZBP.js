// JScript 文件


//项目类别更改
//var changeProductType=function()
//{
//    var pType=getObj("ddlProductType").value;
//    $.ajax(
//    {
//        url: "FillData.ashx",
//        data: { action:"GetZBETypeByPTID",pType: pType },
//        dataType:"json",
//        success:setDgData,
//        error: ajaxError,
//        beforeSend:function(){},
//        complete:function(){}
//    });    
//}
var changeProductType=function()
{
    var vProjectID=getObj("hidProjectID").value;
    ajaxRequest("FillData.ashx", {action:"GetZBETypeByProjectID",ProjectID:vProjectID}, "json", setDgData,false);
}
//function setDgData(data,status)
//{ 
//    var ddlZBEType=getObj("ddlZBEType");
//    for (var i = ddlZBEType.length - 1; i >= 0; i--)
//    {
//        ddlZBEType.remove(i);
//    }
//    var opts=document.createElement("OPTION");
//    opts.value="";
//    opts.text="请选择";
//    ddlZBEType.add(opts,ddlZBEType.length);    
//    if (data.Count > 0)
//    {
//        for (var i = 0; i < data.Count; i++)
//        {
//            var opt = document.createElement("OPTION");
//            opt.value = data.Nodes[i].ID;
//            opt.text = data.Nodes[i].Name;
//            ddlZBEType.add(opt, ddlZBEType.length);
//        }
//    }
//    }

function setDgData(data,status)
{
    var ddlZBEType = getObj("ddlZBEType");
    for (var i = ddlZBEType.length - 1; i >= 0; i--)
    {
        ddlZBEType.remove(i);
    }     
    var opts=document.createElement("OPTION");
    opts.value="";
    opts.text = "全部";
    ddlZBEType.add(opts, ddlZBEType.length);
    if (data != null && data.Count > 0)
    {
        for (var i = 0; i < data.Count; i++)
        {
            var opt = document.createElement("OPTION");
            opt.value = data.Nodes[i].ID;
            opt.text = data.Nodes[i].Name;
            ddlZBEType.add(opt, ddlZBEType.length);
        }

        if (getObj("jqMyZBiddingPlan") == null || getObj("jqZBiddingPlan") == null)
        {
            if (data.Count == 1)
            {
                ddlZBEType.selectedIndex = 1;
            }
        }
    }
    if (getObj("jqMyZBiddingPlan") != null)
    {
        refreshData('jqMyZBiddingPlan');
    }
    if (getObj("jqZBiddingPlan") != null)
    {
        refreshData('jqZBiddingPlan');
    }
}

//刷新数据
var refreshData=function(jqgid)
{
    if(jqgid=='jqMyZBiddingPlan')
    {
        var ProjectID=getObj("ddlProject").value;
        var CCState=getObj("ddlCCState").value;
        var PTID=getObj("ddlProductType").value;
        var ZBEType=getObj("ddlZBEType").value;
        var PSCID=getObj("ddlPSCType").value;
        var ZBWFMID=getObj("ddlZBWFMType").value;
        var Start=getObj("txtStartTime").value;
        var End=getObj("txtEndTime").value;
        var Status=getObj("ddlstatus").value;
        var Key=getObj("txtKW").value;        
        addParamsForJQGridQuery("jqMyZBiddingPlan",[{ProjectID:ProjectID,CCState:CCState,PTID:PTID,ZBEType:ZBEType,PSCID:PSCID,ZBWFMID:ZBWFMID,Start:Start,End:End,Status:Status,Key:Key}]);
    }
    if(jqgid=='jqZBiddingPlan')
    {
        //var PTID=getObj("ddlProductType").value;
        var ZBMBID=getObj("ddlZBMB").value;
        var ZBEType=getObj("ddlZBEType").value;
        var ZBPProperty=getObj("ddlZBPProperty").value;
        var ZBWFMID=getObj("ddlZBWFMType").value;
        var Key=getObj("txtKW").value;  
        var vStartTime=$("#txtStartTime").val();
        var vEndTime=$("#txtEndTime").val();
        if (vStartTime != "" && vEndTime != "")
        {
            startDate1 = vStartTime.split("-");
            endDate1 = vEndTime.split("-");
            var date1 = new Date(startDate1[0], startDate1[1] - 1, startDate1[2]);
            var date2 = new Date(endDate1[0], endDate1[1] - 1, endDate1[2]);
        
            if (date1 > date2)
            {
                return alertMsg("结束时间必须大于开始时间。", $("#txtEndTime"));
            }
        }      
        addParamsForJQGridQuery("jqZBiddingPlan",[{ZBMBID:ZBMBID,StartTime:vStartTime,EndTime:vEndTime,ZBPProperty:ZBPProperty,ZBEType:ZBEType,ZBWFMID:ZBWFMID,Key:Key}]);
    }
    refreshJQGrid(jqgid);
}

//浏览
var viewZBiddingPlan=function(value,pt,record)
{
    var vUrl="'../../../ZBidding/ZBiddingPlan/VZBiddingPlanBrowse.aspx?ZBPID=" + record[0] + "'";
    return '<div class="nowrap"><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',0,0)">' + value + '</a></div>';
}

//搜索数据
var btnSerach_Click=function(jqgid)
{
    refreshData(jqgid);
}

var btnChoose_Click=function()
{
    var ZBPID = getJQGridSelectedRowsID('jqZBiddingPlan', false); 
    
    if (ZBPID == null || ZBPID == "")
    {
        return alertMsg("请选择项目招标计划。", getObj("btnChoose"));    
    }
    var objZBP=new Object();
    
    objZBP.ZBPID=ZBPID;
    objZBP.ZBPName=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'ZBPName'));
    objZBP.StartDate=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'StartDate'));
    objZBP.EndDate=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'EndDate'));
    objZBP.ZBETID=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'ZBETID'));
    objZBP.PTID=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'PTID'));
    objZBP.PSCID=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'PSCID'));
    objZBP.ZBWFMID=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'ZBWFMID'));
    objZBP.CorpID=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'CorpID'));
    objZBP.TCorpStructure__StruName=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'TCorpStructure__StruName'));
    objZBP.EstimateAmount=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'EstimateAmount'));    
    objZBP.IsAllowWeb=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'IsAllowWeb'));
    objZBP.ZBPCTID=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'ZBPCTID'));
    objZBP.IsCancel=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'IsCancel'));
    objZBP.IsRelation=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'IsRelation'));
    objZBP.RelationZBPID=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'RelationZBPID'));
    objZBP.RelationZBPName=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'RelationZBPName'));
    objZBP.AMID=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'AMID'));
    objZBP.CWMID=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'CWMID'));
    objZBP.CMID=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'CMID'));
    objZBP.ZBDescription=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'ZBDescription'));
    objZBP.PZBPLID=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan',false,'PZBPLID'));
    objZBP.ZBPState=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan',false,'ZBPState'));
    objZBP.ZBPProperty=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan',false,'ZBPProperty'));
    objZBP.SignAmount=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan', false, 'SignAmount'));
    objZBP.ComponentStandard=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan',false,'ComponentStandard'));
    objZBP.ApplicationSite=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan',false,'ApplicationSite'));
    objZBP.SelectSupplier=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan',false,'SelectSupplier'));
    objZBP.MainContractID=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan',false,'MainContractID'));
    objZBP.ZBMBID=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan',false,'ZBMBID'));
    objZBP.ZBMBName=stripHtml(getJQGridSelectedRowsData('jqZBiddingPlan',false,'ZBMBName'));
    
    window.returnValue=objZBP;
    window.close();
}

//清除
function btnClear_Click()
{
    var zbp = new Object();
    zbp.ZBPID = "";
    zbp.ZBPName = "";
    zbp.StartDate = "";
    zbp.EndDate = "";
    zbp.ZBETID = "";
    zbp.PTID = "";
    zbp.PSCID = "";
    zbp.ZBWFMID = "";
    zbp.CorpID = "";
    zbp.TCorpStructure__StruName = "";
    zbp.EstimateAmount = "";
    zbp.IsAllowWeb = "";
    zbp.ZBPCTID = "";
    zbp.IsCancel = "";
    zbp.IsRelation = "";
    zbp.RelationZBPID = "";
    zbp.RelationZBPName = "";
    zbp.AMID = "";
    zbp.CWMID = "";
    zbp.CMID = "";
    zbp.ZBDescription = "";
    zbp.PZBPLID = "";
    zbp.ZBPState = "";
    zbp.ZBPProperty = "";
    zbp.SignAmount = "";
    zbp.ComponentStandard = "";
    zbp.ApplicationSite = "";
    zbp.SelectSupplier = "";
    zbp.MainContractID ="";
    zbp.ZBMBID = "";
    zbp.ZBMBName = "";
    window.returnValue = zbp;
    window.close();
}
