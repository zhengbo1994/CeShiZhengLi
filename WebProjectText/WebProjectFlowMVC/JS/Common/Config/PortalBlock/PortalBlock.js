// JScript 文件
//***************************************************//
//
//文件名:PortalBlock .js
//作者:马吉龙
//时间:2012-03-17
//功能描述:门户内容块JS操作
//
//*************************************************//
var filterData=function()
{
    var protalType = getObj("ddlPortalType").value;
    var protalBlockType = getObj("ddlProtalBlockType").value;
    var key=getObj("txtKW").value;
    addParamsForJQGridQuery("jqPortalBlock", [{ ProtalType: protalType, ProtalBlockType: protalBlockType, Key: key}]);
    refreshJQGrid("jqPortalBlock");
    
}

//新增
var addPortalBlock =function()
{
    if (trim(getObj("ddlPortalType").value) == "")
    {
        return alertMsg("内容块类型不能为空。", getObj("ddlPortalType"));
    }
    openAddWindow("VPortalBlockAdd.aspx?ProtalType=" + getObj("ddlPortalType").value + "&ProtalBlockType=" + getObj("ddlProtalBlockType").value,0,0, "jqPortalBlock");
}

//修改
var editPortalBlock =function()
{
    openModifyWindow("VPortalBlockEdit.aspx",0,0, "jqPortalBlock");
}

//删除
var deletePortalBlock=function()
{
    openDeleteWindow("PortalBlock",0,"jqPortalBlock");
}

//验证
function validateSize()
{
    handleBtn(false);

    var rblIsList = $("input[name$=rblIsList][checked]");
    var isList = rblIsList.val();

    var rblIsHaveHeader = $("input[name$=rblIsHaveHeader][checked]");
    var isHaveHeader = rblIsHaveHeader.val();

    if (trim(getObj("ddlProtalBlockType").value) == "")
    {
        handleBtn(true);
        return alertMsg("内容块类别不能为空。", getObj("ddlProtalBlockType"));
    }

    $("#hidProtalBlockType").val($("#ddlProtalBlockType").val());
    if (trim(getObj("ddlPortalType").value) == "")
    {
        handleBtn(true);
        return alertMsg("内容块类型不能为空。", getObj("ddlPortalType"));
    }
    if (trim(getObj("txtPBName").value) == "")
    {
        handleBtn(true);
        return alertMsg("门户块名称不能为空。", getObj("txtPBName"));
    }
    if (getObj("txtPageUrl").value == "")
    {
        handleBtn(true);
        return alertMsg("内容块页面路径 不能为空。", getObj("txtPageUrl"));
    }   
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }  
//    var bflag=0;
//    var vchkBlockMods=getObj("chkBlockMod").getElementsByTagName("input");
//    for(var i=0;i<vchkBlockMods.length;i++)
//    {
//        if(vchkBlockMods[i].checked==false)
//        {
//            bflag++;
//        }
//    }
//    if(bflag==vchkBlockMods.length)
//    {
//        handleBtn(true);
//        return alertMsg("请选择所属模块",getObj("chkBlockMod"));
//    }
    var jsonDatas = [];
    for (var i = 1; i < tbItems.rows.length; i++) {
        var chk = getObjTC(tbItems, i, 0, "input", 0);
        var aOptName = getObjTC(tbItems, i, 1, "a", 0);
        var spnOptIco = getObjTC(tbItems, i, 2, "span", 0);
        var spnOpenUrl = getObjTC(tbItems, i, 3, "span", 0);
        var spnOpenWidth = getObjTC(tbItems, i, 4, "span", 0);
        var spnOpenHeight = getObjTC(tbItems, i, 5, "span", 0);
        var spnRowNo = getObjTC(tbItems, i, 6, "span", 0);
        if (aOptName.innerHTML == "") {
            handleBtn(true);
            return alertMsg("第" + i + "行的操作名称不能为空。", txtOptName);
        }
        jsonDatas.push({
            "PBOID": chk.value,
            "OptName": aOptName.innerHTML,
            "OptIco": spnOptIco.innerHTML,
            "OpenUrl": spnOpenUrl.innerHTML,
            "OpenWidth": spnOpenWidth.innerHTML,
            "OpenHeight": spnOpenHeight.innerHTML,
            "RowNo": spnRowNo.innerHTML
        });
    }
    if (jsonDatas.length > 0)
    {
        getObj("hidItems").value = $.jsonToString(jsonDatas);
    }
    return true;    
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}
// 新增明细(opt：0:新增/1:修改)
function addItem(tbItems, opt, PBOID,OptIco) {
    var arrDatas = [];

    var hidPBID = $("#hidPBID");
    var strPBID = hidPBID.length > 0 ? hidPBID.val() : "";
    var sbUrl = new StringBuilder();
    sbUrl.append("VPortalBlockOperationSet.aspx?tbID=tbItems&PBID=", strPBID, 
        "&PBOID=", typeof PBOID == "undefined" ? "" : PBOID,
        "&OptIco=", typeof OptIco == "undefined" ? "" : OptIco);
    var url = sbUrl.toString();
    var optJson = openModalWindow(url, 500, 400);

    if (typeof optJson != "undefined" && typeof optJson.PBOID != "undefined") {
        arrDatas.push(optJson);
    }
    else {
        return false;
    }

    if (opt) {
        modifyTableRowsByJson(tbItems, arrDatas);
    }
    else {
        
        addTableRowsByJson(tbItems, arrDatas);
    }
}
function initialOptTable() {
    arrDatas = $.stringToJSON($("#hidItems").val());
    addTableRowsByJson(tbItems, arrDatas);
}

function addTableRowsByJson(table, json) {
    if (table.tagName != "TABLE" || !json) {
        return false;
    }

    for (var i = 0; i < json.length; i++) {
        var row = table.insertRow();
        var cell = row.insertCell(0);
        cell.innerHTML = getCheckBoxHtml(null, json[i].PBOID);
        cell.align = "center";

        cell = row.insertCell(1);
        cell.innerHTML = getHrefHtml("", json[i].OptName, "addItem(tbItems,1,'" + json[i].PBOID + "','" + json[i].OptIco + "')");

        cell = row.insertCell(2);
        cell.innerHTML = getNormalTxtHtml(json[i].OptIco);

        cell = row.insertCell(3);
        cell.innerHTML = getNormalTxtHtml(json[i].OpenUrl);

        cell = row.insertCell(4);
        cell.innerHTML = getNormalTxtHtml(json[i].OpenWidth);
        cell.align = "right";

        cell = row.insertCell(5);
        cell.innerHTML = getNormalTxtHtml(json[i].OpenHeight);
        cell.align = "right";

        cell = row.insertCell(6);
        cell.innerHTML = getNormalTxtHtml(json[i].RowNo);
        cell.align = "center";

        setRowAttributes(row);
    }
}

function modifyTableRowsByJson(table, json) {
    if (table.tagName != "TABLE" || !json) {
        return false;
    }

    var currentRow = null;
    for (var i = 0, iJsonLength = json.length; i < iJsonLength; i++) {
        for (var j = 0, iTableLength = table.rows.length; j < iTableLength; j++) {
            currentRow = table.rows[j];
            if ($(currentRow).find("input[type=checkbox][value=" + json[i].PBOID + "]").length == 1) {
                currentRow.cells[0].innerHTML = getCheckBoxHtml(null, json[i].PBOID);
                currentRow.cells[1].innerHTML = getHrefHtml("", json[i].OptName, "addItem(tbItems,1,'" + json[i].PBOID + "','" + json[i].OptIco + "')");
                currentRow.cells[2].innerHTML = getNormalTxtHtml(json[i].OptIco);
                currentRow.cells[3].innerHTML = getNormalTxtHtml(json[i].OpenUrl);
                currentRow.cells[4].innerHTML = getNormalTxtHtml(json[i].OpenWidth);
                currentRow.cells[5].innerHTML = getNormalTxtHtml(json[i].OpenHeight);
                currentRow.cells[6].innerHTML = getNormalTxtHtml(json[i].RowNo);

                setRowAttributes(currentRow);
            }
        }
    }
}

// 删除明细
function delItem(table)
{
    deleteTableRow(table);
    setTableRowAttributes(table);
}


// 改变“是否列表页”
function changeIsList() {
    var rblIsListSelected = $("#rblIsList input[checked]");
    var rblIsHaveHeader = $("#rblIsHaveHeader");
    var tdObj = rblIsHaveHeader.parent().parent();
    
    if (rblIsListSelected.val() == "1") {
        tdObj.css("visibility","");
    }
    else {
        tdObj.css("visibility", "hidden");
    }
}

function loadProtalBlockType(type)
{
    var portalType = $('#ddlPortalType').val();
    var ddlProtalBlockType = getObj("ddlProtalBlockType");
    if (portalType)
    {
        ajax("FillData.ashx", { "action": "GetPBTIDByProtalType", "ProtalType": portalType }, "json",
            function (data, status)
            {
                for (var i = ddlProtalBlockType.length - 1; i >= 0; i--)
                {
                    ddlProtalBlockType.remove(i);
                }
                var opts = document.createElement("OPTION");
                opts.value = "";
                opts.text = type == 0 ? "全部" : "请选择";
                ddlProtalBlockType.add(opts, ddlProtalBlockType.length);
                if (data != null && data.length > 0)
                {
                    for (var i = 0; i < data.length; i++)
                    {
                        opts = document.createElement("OPTION");
                        opts.value = data[i].PBTID;
                        opts.text = data[i].PBTName;
                        ddlProtalBlockType.add(opts, ddlProtalBlockType.length);
                    }
                }
            }, false
        )
    } else
        {
            ddlProtalBlockType.length=0
        var opts = document.createElement("OPTION");
        opts.value = "";
        opts.text = type == 0 ? "全部" : "请选择";
        ddlProtalBlockType.add(opts, ddlProtalBlockType.length);
    }
}      