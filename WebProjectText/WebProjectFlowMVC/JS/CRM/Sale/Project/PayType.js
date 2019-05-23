// JScript 文件

function saveJQGridFilters()
{ }

//条件搜索
function reloadData()
{
    var sKey = getObj("txtKey").value;
    var sCompanyGUID = $('#ddlCompanyGUID').val();
    var sProjectGUID = $('#ddlProjectGUID').val();

    var query = { "Key": sKey, "CompanyGUID": sCompanyGUID, "ProjectGUID": sProjectGUID };
    switch (window["TabIndex"])
    {
        case 0:
        case "0":
            query.action = "A";
            if (loadJQGrid("jqGridpt", query))
            {
                refreshJQGrid("jqGridpt");
            }
            break;
        case 1:
        case "1":
            query.action = "B";
            if (loadJQGrid("jqGridpet", query))
            {
                refreshJQGrid("jqGridpet");
            }
            break;
    }
}
//新建付款方式
function addPayType()
{
    var sProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    //sProjectName = Server.UrlEncode(sProjectName);
    if (getObj("div0").style.display != "none")//第一个页签显示时,新增付款方式；否则新增付款事件传递
    {
        openAddWindow("VPayTypeAdd.aspx?ProjectGUID=" + $("#ddlProjectGUID").val() + "&ProjectName=" + encodeURIComponent(sProjectName), 800, 600, "jqGridpt");
    }
    else
    {
        openAddWindow("VPayEventTimeAdd.aspx?ProjectGUID=" + $("#ddlProjectGUID").val() + "&ProjectName=" + encodeURIComponent(sProjectName), 800, 600, "jqGridpet");
    }
}
//修改付款方式
function editPayType(jqGridID, bEnableMultiselect, keyName)
{
    var sProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    openModifyWindow("VPayTypeBrowse.aspx?PayTypeGUID=" + getJQGridSelectedRowsData(jqGridID, bEnableMultiselect, keyName) + "&ProjectGUID=" + $("#ddlProjectGUID").val() + "&ProjectName=" + encodeURIComponent(sProjectName), 800, 600, "jqGridpt");
}

//删除
function delPayType()
{
    if (getObj("div0").style.display != "none")//第一个页签显示时,删除付款方式；否则删除付款事件传递
    {
        openDeleteWindow("PayType", 13, "jqGridpt");
    }
    else
    {
        openDeleteWindow("PayEventTime", 13, "jqGridpet");
    }
}

//设置授权
function setAllow(bDisplay)
{
    trBuildName.style.display = bDisplay ? "block" : "none";

}
//设置贷款
function setNeedLoan(bDisplay)
{
    trLendingBankConfigItemGUID.style.display = bDisplay ? "block" : "none";
    trProvidentFundConfigItemGUID.style.display = bDisplay ? "block" : "none";
}

function validateSizeMain()
{

    handleBtn(false);
    //楼栋名称不能为空

    if ($("#rdlUseRange input:checked").val() == "1" && getObj("txtBuildingNameList").value == "")
    {
        handleBtn(true);
        return alertMsg('楼栋名称不能为空。', getObj("txtBuildingNameList"));
    }

    if (getObj("txtPayTypeName").value == "")
    {
        handleBtn(true);
        return alertMsg('付款方式名称不能为空。', getObj("txtPayTypeName"));
    }

    if (getObj("txtDiscontRate").value == "") {
        handleBtn(true);
        return alertMsg('折扣率不能为空。', getObj("txtDiscontRate"));
    }

    if (getObj("txtDiscontRate").value.indexOf("-") != "-1") {
        handleBtn(true);
        return alertMsg('折扣率不能为负数。', getObj("txtDiscontRate"));
    }

    if (!isPositiveInt(getObj("txtSortNo").value))
    {
        handleBtn(true);
        return alertMsg('排序号必须为正整数。', getObj('txtSortNo'));
    }

    if ($("#rdlIsNeedLoan input:checked").val() == "1" && getObj("ddlLendingBankConfigItemGUID").value == "" && getObj("ddlProvidentFundConfigItemGUID").value == "")
    {
        handleBtn(true);
        return alertMsg('按揭银行和公积金银行至少选择一项。', getObj('ddlLendingBankConfigItemGUID'));
    }

    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

// 付款方式明细查看
function showPayType(cellvalue, options, rowobject)
{
    var sProjectGUID = $("#ddlProjectGUID").val();
    var sProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    //    var sProjectGUID = getObj("hdProjectGUID").value;
    //    var sProjectName = getObj("txtProjectName").value;

    //mlgb  var url = "'VPayTypeBrowse.aspx?ID=" + rowobject[0] + "&PayTypeGUID=" + sProjectGUID + "&ProjectGUID=" + sProjectGUID + "&ProjectName=" + escape(sProjectName) + "'";
    var url = "'VPayTypeBrowse.aspx?ID=" + rowobject[0] + "&PayTypeGUID=" + rowobject[0] + "&ProjectGUID=" + sProjectGUID + "&ProjectName=" + escape(sProjectName) + "'";

    //    var url = "'VPayTypeBrowse.aspx?ID=" + rowobject[0] + "&ProjectName=" + encodeURIComponent(sProjectName) + "'";
    return '<a href="javascript:openWindow(' + url + ',800,600)">' + cellvalue + '</a>';
}

//事件传递时间设置
function setTransmit()
{
    var hidPayEventTimes = getObj('hidPayEventTimes');

    var ids = getJQGridSelectedRowsID('jqGridpet', true);

    if (ids == "" || ids.length == 0)
    {
        return alertMsg("没有选择任何记录操作。");
    }

    hidPayEventTimes.value = ids.join(",");

    return confirm('确定要传递吗？传递后将不可修改删除。');
}

//选择楼栋
function selectBuildingName()
{
    var ProjectGUID = getObj("hidProjectGUID").value
    var data = openModalWindow('../../../Common/Select/CRM/VSelectBuildingInfo.aspx?IsMulti=Y&ProjectGUID=' + ProjectGUID, 800, 600);

    if (data)
    {
        data = data.substr(0, data.length - 1);
        var names = "";
        var ids = "";
        var tmp = data.split('|');

        for (var i = 0; i < tmp.length; i++)
        {
            names += "," + tmp[i].split(',')[1]; //楼栋名称
            ids += "," + tmp[i].split(',')[0]; //楼栋ID  
        }
        if (names)
        {
            names = names.substr(1);
        }
        if (ids)
        {
            ids = ids.substr(1);
        }

        getObj("txtBuildingNameList").value = names;
        getObj("hidBuildingNameList").value = ids;

    }
    else
    {
        return;

    }
}

//判断结束日期是否大于开始日期,start开始日期，end是结束日期
function checktimediff(start, end)
{

    if (getObj(end).value != "" && getObj(start).value != "")
    {
        a = getObj(start).value;
        b = getObj(end).value;
        var arr = a.split("-");
        var starttime = new Date(arr[0], arr[1], arr[2]);
        var starttimes = starttime.getTime();

        var arrs = b.split("-");
        var lktime = new Date(arrs[0], arrs[1], arrs[2]);
        var lktimes = lktime.getTime();

        if (starttimes >= lktimes)
        {
            $("#" + end).val("");
            alert('生效时间大于失效时间，请检查！');
        }
    }

}
//付款方式引入
//作者：常春侠 
//时间：2013-6-18 10:21:30
function payTypeImport() {   
    var projID = $("#ddlProjectGUID").val();//alert(projID);
    var url = "../../../Common/Select/CRM/VselectPayTypeInfo.aspx?IsMulti=Y&projID=" + projID;

    var rValue = openModalWindow(url, 800, 600);
   // alert("pname:"+rValue.PayTypeName);return false;
    if (null != rValue) {
        $.post("FillData.ashx",{action:'CRM_ImportPayType',  ProjectID: rValue.ProjectID,PayTypeName:rValue.PayTypeName,PayTypeID:rValue.PayTypeID }, function (data, textstatus) {
            if (data.toUpperCase() == "TRUE") {
                alert('引入成功！'); reloadData();
            }
            else {
                alert('付款方式引入失败，请重新操作！');
            }
        }, "string");
    }
}


//function setVisible( areaName, tr )
//{
//    tr.style.display = ( getObj( areaName ).value == "0" ? "none" : "" );
//}
