// JScript 文件

//***************************************************//
//
//文件名:SSOAccount.js
//作者:徐海波
//时间:2012-12-24
//功能描述:
//
//*************************************************//

//新增
var addSSOAccount = function () {
    openAddWindow("VSSOAccountAdd.aspx?ID=" + getObj("ddlSSOCompany").value, 600, 450, "jqSSOAccount");
}

//修改
var editSSOAccount = function () {
    openModifyWindow("VSSOAccountEdit.aspx", 600, 450, "jqSSOAccount");
}

//删除
var deleteSSOAccount = function () {
    openDeleteWindow("SSOAccount", 0, "jqSSOAccount");
}

//验证
function validateSize() {
    handleBtn(false);
    if (trim(getObj("ddlSSOCompany").value) == "") {
        handleBtn(true);
        return alertMsg("请选择单点登录公司。", getObj("ddlSSOCompany"));
    }
    if (trim(getObj("txtSSOAccountName").value) == "") {
        handleBtn(true);
        return alertMsg("名称不能为空。", getObj("txtSSOAccountName"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value)) {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }

    //参数
    hidParameter.value = "";
    for (var i = 1; i < tbParameter.rows.length; i++) {
        if (getObjTR(tbParameter, i, "input", 1).value == "00" || getObjTR(tbParameter, i, "input", 1).value == "03" || getObjTR(tbParameter, i, "input", 1).value == "04") {
            if (getObjTR(tbParameter, i, "input", 2).value == "") {
                handleBtn(true);
                return alertMsg("参数值必须输入", getObjTR(tbParameter, i, "input", 2));
            }
            // ^SSOCPID|SSOPType|Value|SSOAPID
            hidParameter.value = hidParameter.value + "^" + getObjTR(tbParameter, i, "input", 0).value + "|"
                                                     + getObjTR(tbParameter, i, "input", 1).value + "|"
                                                     + getObjTR(tbParameter, i, "input", 2).value + "|"
                                                     + getObjTR(tbParameter, i, "input", 3).value;
        }
    }

    if (hidParameter.value.length > 0) {
        hidParameter.value = hidParameter.value.substr(1);
    }

    return true;
}

function handleBtn(enabled) {
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

function initSSOCompanyParameter() {
    vSSOCID = getObj("ddlSSOCompany").value;
    if (hidID != null) {
        $.ajax(
        {
            url: "FillData.ashx",
            async: false,
            data: { action: "SSOCompanyAndAccountParameter", SSOCID: vSSOCID, ID: hidID.value },
            dataType: "json",
            success: loadSSOCompanyAndAccountParameterData,
            error: ajaxError,
            beforeSend: function () { },
            complete: function () { }
        });
    }
    else {
        $.ajax(
        {
            url: "FillData.ashx",
            async: false,
            data: { action: "SSOCompanyParameter", ID: vSSOCID },
            dataType: "json",
            success: loadSSOCompanyParameterData,
            error: ajaxError,
            beforeSend: function () { },
            complete: function () { }
        });
    }
}

function loadSSOCompanyParameterData(data, status) {
    clearTable(tbParameter);
    if (data.Count > 0) {
        var cnt = data.Count;
        for (var i = 0; i < cnt; i++) {
            var row = tbParameter.insertRow();
            var cell = row.insertCell(0);
            cell.align = "left";
            cell.innerHTML = getHiddenHtml('', data.Nodes[i].SSOCPID) + data.Nodes[i].SSOPName;

            var vType = "手动录入";
            if (data.Nodes[i].SSOPType == "01") {
                vType = "系统账号";
            }
            else if (data.Nodes[i].SSOPType == "02") {
                vType = "系统密码（MD5）";
            }
            else if (data.Nodes[i].SSOPType == "03") {
                vType = "手动密码（原文）";
            }
            else if (data.Nodes[i].SSOPType == "04") {
                vType = "手动密码（MD5）";
            }
            else if (data.Nodes[i].SSOPType == "05") {
                vType = "固定值";
            }
            else if (data.Nodes[i].SSOPType == "06")
            {
                vType = "SessionID";
            }
            else if (data.Nodes[i].SSOPType == "07")
            {
                vType = "YYCHECKSUM";
            }
            else if (data.Nodes[i].SSOPType == "08")
            {
                vType = "TimeStamp";
            }
            cell = row.insertCell(1);
            cell.align = "center";
            cell.innerHTML = getHiddenHtml('', data.Nodes[i].SSOPType) + vType;
            
            cell = row.insertCell(2);
            cell.align = "left";
            if (data.Nodes[i].SSOPType == "00" || data.Nodes[i].SSOPType == "03" || data.Nodes[i].SSOPType == "04" || data.Nodes[i].SSOPType == "07")
            {
                cell.innerHTML = getTextBoxHtml('', 200, '', '', data.Nodes[i].DefaultValue) + getHiddenHtml('', data.Nodes[i].SSOAPID);
            }
            else if (data.Nodes[i].SSOPType == "05") {
                cell.innerHTML = getTextBoxHtml('', 200, '', '', data.Nodes[i].DefaultValue, 'true') + getHiddenHtml('', data.Nodes[i].SSOAPID);
            }
            else {
                cell.innerHTML = getHiddenHtml('', '') + getHiddenHtml('', data.Nodes[i].SSOAPID);
            }

            setRowAttributes(row);
        }
    }
}

function loadSSOCompanyAndAccountParameterData(data, status) {
    clearTable(tbParameter);
    if (data.Count > 0) {
        var cnt = data.Count;
        for (var i = 0; i < cnt; i++) {
            var row = tbParameter.insertRow();
            var cell = row.insertCell(0);
            cell.align = "left";
            cell.innerHTML = getHiddenHtml('', data.Nodes[i].SSOCPID) + data.Nodes[i].SSOPName;

            var vType = "手动录入";
            if (data.Nodes[i].SSOPType == "01") {
                vType = "系统账号";
            }
            else if (data.Nodes[i].SSOPType == "02") {
                vType = "系统密码（MD5）";
            }
            else if (data.Nodes[i].SSOPType == "03") {
                vType = "手动密码（原文）";
            }
            else if (data.Nodes[i].SSOPType == "04") {
                vType = "手动密码（MD5）";
            }
            else if (data.Nodes[i].SSOPType == "05") {
                vType = "固定值";
            }
            else if (data.Nodes[i].SSOPType == "06")
            {
                vType = "SessionID";
            }
            else if (data.Nodes[i].SSOPType == "07")
            {
                vType = "YYCHECKSUM";
            }
            else if (data.Nodes[i].SSOPType == "08")
            {
                vType = "TimeStamp";
            }
            cell = row.insertCell(1);
            cell.align = "left";
            cell.innerHTML = getHiddenHtml('', data.Nodes[i].SSOPType) + vType;

            cell = row.insertCell(2);
            cell.align = "left";
            if (data.Nodes[i].SSOPType == "00" || data.Nodes[i].SSOPType == "03" || data.Nodes[i].SSOPType == "04" || data.Nodes[i].SSOPType == "07")
            {
                cell.innerHTML = getTextBoxHtml('', 200, '', '', data.Nodes[i].Value) + getHiddenHtml('', data.Nodes[i].SSOAPID);
            }
            else if (data.Nodes[i].SSOPType == "05"){
                cell.innerHTML = getTextBoxHtml('', 200, '', '', data.Nodes[i].DefaultValue, 'true') + getHiddenHtml('', data.Nodes[i].SSOAPID);
            }
            else {
                cell.innerHTML = getHiddenHtml('', '') + getHiddenHtml('', data.Nodes[i].SSOAPID);
            }

            setRowAttributes(row);
        }
    }
}

function filterData() {
    var SSOCID = getObj("ddlSSOCompany").value;
    var vKey = $("#txtKey").val();
    addParamsForJQGridQuery('jqSSOAccount', [{ SSOCID: SSOCID, Key: vKey}]);
    refreshJQGrid("jqSSOAccount");
}

function ddlSSOCompany_Change(vType) {
    if (getObj("ddlSSOCompany").value != "") {
        initSSOCompanyParameter();
        if (vType != "Edit") {
            ajaxRequest('FillData.ashx', { action: 'GetMaxRowNo', tableName: 'OperAllowDb.dbo.TSSOAccount', strFilter: 'WHERE SSOCID=\'' + getObj("ddlSSOCompany").value + '\' AND IsDelete=\'N\'' }, 'html', function (data) {
                $('#txtRowNo').val(data);
            });
        }
    }
    else {
        clearTable(tbParameter);
    }
}

/* 帐号设置 */
function setAccount(cellvalue, options, rowobject) {
    return '<a href="#SetAccount" onclick="openWindow(\'VSSOAccountMapping.aspx?SSOAID=' + rowobject[0] + '\',500,350)">包含账号</a>';
}

function btnImport_Click()
{
    openAddWindow("VSSOAccountImport.aspx", 450, 150, "jqSSOAccount");
}