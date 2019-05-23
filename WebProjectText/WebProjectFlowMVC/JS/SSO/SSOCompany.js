// JScript 文件

//***************************************************//
//
//文件名:SSOCompany.js
//作者:徐海波
//时间:2012-12-22
//功能描述:
//
//*************************************************//

//新增
var addSSOCompany = function () {
    openAddWindow("VSSOCompanyAdd.aspx", 600, 450, "jqSSOCompany");
}

//修改
var editSSOCompany = function () {
    openModifyWindow("VSSOCompanyEdit.aspx", 600, 450, "jqSSOCompany");
}

//删除
var deleteSSOCompany = function () {
    openDeleteWindow("SSOCompany", 0, "jqSSOCompany");
}

//验证
function validateSize() {
    handleBtn(false);
    if (trim(getObj("txtSSOName").value) == "") {
        handleBtn(true);
        return alertMsg("公司名称不能为空。", getObj("txtSSOName"));
    }
    if (trim(getObj("txtSSONo").value) == "") {
        handleBtn(true);
        return alertMsg("公司编号不能为空。", getObj("txtSSONo"));
    }
    if (trim(getObj("txtSSOURL").value) == "") {
        handleBtn(true);
        return alertMsg("认证地址不能为空。", getObj("txtSSOURL"));
    }
    if (!isPositiveInt(getObj("txtRowNo").value)) {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }

    //参数
    hidParameter.value = "";
    var arrParameter = [];
    for (var i = 1; i < tbParameter.rows.length; i++)
    {
        var parameterObj = {};
        if (getObjTR(tbParameter, i, "input", 1).value == "")
        {
            handleBtn(true);
            return alertMsg("参数名称必须输入", getObjTR(tbParameter, i, "input", 1));
        }
        if (getObjTR(tbParameter, i, "select", 0).value == "")
        {
            handleBtn(true);
            return alertMsg("请选择参数类型", getObjTR(tbParameter, i, "select", 0));
        }
        if (getObjTR(tbParameter, i, "select", 0).value == "05" && getObjTR(tbParameter, i, "input", 2).value == "")
        {
            handleBtn(true);
            return alertMsg("固定值类型是默认值不行输入", getObjTR(tbParameter, i, "input", 2));
        }
        // ^SSOPName|SSOPType|SSOCPID|DefaultValue
        //        hidParameter.value = hidParameter.value + "^" + getObjTR(tbParameter, i, "input", 1).value + "|"
        //                                                     + getObjTR(tbParameter, i, "select", 0).value + "|"
        //                                                     + getObjTR(tbParameter, i, "input", 0).value + "|"
        //                                                     + getObjTR(tbParameter, i, "input", 2).value;
        parameterObj.SSOPName = getObjTR(tbParameter, i, "input", 1).value;
        parameterObj.SSOPType = getObjTR(tbParameter, i, "select", 0).value;
        parameterObj.SSOCPID = getObjTR(tbParameter, i, "input", 0).value;
        parameterObj.DefaultValue = getObjTR(tbParameter, i, "input", 2).value;

        arrParameter.push(parameterObj);
    }
    hidParameter.value = $.jsonToString(arrParameter);

    //    if (hidParameter.value.length > 0) {
    //        hidParameter.value = hidParameter.value.substr(1);
    //    }

    return true;
}

function handleBtn(enabled) {
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

function AddParameter() {
    var row = tbParameter.insertRow();
    var cell = row.insertCell(0);
    cell.align = "center";
    cell.innerHTML = getCheckBoxHtml('','');

    cell = row.insertCell(1);
    cell.align = "left";
    cell.innerHTML = getTextBoxHtml('', 200, '', '', '');

    cell = row.insertCell(2);
    cell.align = "left";
    cell.innerHTML = getDropdownHtml('', [{ 'text': '请选择', 'value': '' }, { 'text': '手动录入', 'value': '00' }, { 'text': '系统账号', 'value': '01' }
    , { 'text': '系统密码（MD5）', 'value': '02' }, { 'text': '手动密码（原文）', 'value': '03' }, { 'text': '手动密码（MD5）', 'value': '04' }
    , { 'text': '固定值', 'value': '05' }, { 'text': 'SessionID', 'value': '06' }, { 'text': 'YYCHECKSUM', 'value': '07' }, { 'text': 'TimeStamp', 'value': '08' }]
    , '', 'SSOPTypeChange(this)');

    cell = row.insertCell(3);
    cell.align = "left";
    cell.innerHTML = getTextBoxHtml('', 200, '', '', '');
}

function SSOPTypeChange(obj) {
    if (obj.value == '01' || obj.value == '02' || obj.value == '06' || obj.value == '08')
    {
        obj.parentNode.parentNode.getElementsByTagName("input").item(2).style.display = "none";
        obj.parentNode.parentNode.getElementsByTagName("input").item(2).value = "";
    }
    else {
        obj.parentNode.parentNode.getElementsByTagName("input").item(2).style.display = "";
    }
}

function DeleteParameter() {
    // 删除表格中复选框选中的行
    deleteTableRow(tbParameter);

    // 重新设置各行的样式(区分奇偶行)和事件
    setTableRowAttributes(tbParameter);
}

function initSSOCompanyParameter(vID) {
    $.ajax(
        {
            url: "FillData.ashx",
            async: false,
            data: { action: "SSOCompanyParameter", ID: vID },
            dataType: "json",
            success: loadSSOCompanyParameterData,
            error: ajaxError,
            beforeSend: function () { },
            complete: function () { }
        });
}

function loadSSOCompanyParameterData(data,status)
{
    clearTable(tbParameter);
    if(data.Count>0)
    {
        var cnt=data.Count;
        for(var i=0;i<cnt;i++)
        {
            var row=tbParameter.insertRow();
            var cell=row.insertCell(0);
            cell.align = "center";
            cell.innerHTML = getCheckBoxHtml('',data.Nodes[i].SSOCPID);
            
            cell = row.insertCell(1);
            cell.align = "left";
            cell.innerHTML = getTextBoxHtml('', 200, '', '', data.Nodes[i].SSOPName);

            cell = row.insertCell(2);
            cell.align = "center";
            cell.innerHTML = getDropdownHtml('', [{ 'text': '请选择', 'value': '' }, { 'text': '手动录入', 'value': '00' }, { 'text': '系统账号', 'value': '01' }
            , { 'text': '系统密码（MD5）', 'value': '02' }, { 'text': '手动密码（原文）', 'value': '03' }, { 'text': '手动密码（MD5）', 'value': '04' }
            , { 'text': '固定值', 'value': '05' }, { 'text': 'SessionID', 'value': '06' }, { 'text': 'YYCHECKSUM', 'value': '07' }, { 'text': 'TimeStamp', 'value': '08' }]
            , data.Nodes[i].SSOPType, 'SSOPTypeChange(this)');

            cell = row.insertCell(3);
            cell.align = "left";
            if (data.Nodes[i].SSOPType == "01" || data.Nodes[i].SSOPType == "02" || data.Nodes[i].SSOPType == "06" || data.Nodes[i].SSOPType == "08")
            {
                cell.innerHTML = getTextBoxHtml('', 200, '', '', data.Nodes[i].DefaultValue, null, null, null, null, null, 'display:none;');
            }
            else {
                cell.innerHTML = getTextBoxHtml('', 200, '', '', data.Nodes[i].DefaultValue);
            }
            
            setRowAttributes(row);
        }
    }
}