/* 帐号设置 */
function setAccount(cellvalue, options, rowobject) {
    return '<a href="#SetAccount" onclick="openWindow(\'VPersonalSSOSetDetail.aspx?SSOCID=' + rowobject[0] + '\',500,350)">设置</a>&nbsp;&nbsp;'
        + '<a href="#SetAccount" onclick="window.open(\'VSSOJump.aspx?SSOCID=' + rowobject[0] + '\', \'_blank\', \'resizable=1,status=1,scrollbars=1,width=800,height=600,location=1\')">登录</a>';
}

function initPage() {
    initParameter();
}

function initParameter() {
    vSSOCID = hidSSOCID.value;
    vSSOAID = hidSSOAID.value;
    vIsCreateByAdmin = hidIsCreateByAdmin.value;

    // 原来有SSOAID，获取设置的值
    if (vSSOAID != "") {
        $.ajax(
        {
            url: "FillData.ashx",
            async: false,
            data: { action: "SSOCompanyAndAccountParameter", SSOCID: vSSOCID, ID: vSSOAID },
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
            if (data.Nodes[i].SSOPType == "00" || data.Nodes[i].SSOPType == "03" || data.Nodes[i].SSOPType == "04") {
                var row = tbParameter.insertRow();
                var cell = row.insertCell(0);
                cell.align = "left";
                cell.innerHTML = getHiddenHtml('', data.Nodes[i].SSOCPID) + data.Nodes[i].SSOPName;

                var vType = "";
                if (data.Nodes[i].SSOPType == "00") {
                    vType = "手动录入";
                }
                else if (data.Nodes[i].SSOPType == "03") {
                    vType = "手动密码（原文）";
                }
                else if (data.Nodes[i].SSOPType == "04") {
                    vType = "手动密码（MD5）";
                }
                cell = row.insertCell(1);
                cell.align = "center";
                cell.innerHTML = getHiddenHtml('', data.Nodes[i].SSOPType) + vType;

                cell = row.insertCell(2);
                cell.align = "left";
                cell.innerHTML = getTextBoxHtml('', 200, '', '', data.Nodes[i].DefaultValue) + getHiddenHtml('', data.Nodes[i].SSOAPID);

                setRowAttributes(row);
            }
        }
    }
}

function loadSSOCompanyAndAccountParameterData(data, status) {
    clearTable(tbParameter);
    if (data.Count > 0) {
        var cnt = data.Count;
        for (var i = 0; i < cnt; i++) {
            if (data.Nodes[i].SSOPType == "00" || data.Nodes[i].SSOPType == "03" || data.Nodes[i].SSOPType == "04") {
                var row = tbParameter.insertRow();
                var cell = row.insertCell(0);
                cell.align = "left";
                cell.innerHTML = getHiddenHtml('', data.Nodes[i].SSOCPID) + data.Nodes[i].SSOPName;

                var vType = "";
                if (data.Nodes[i].SSOPType == "00") {
                    vType = "手动录入";
                }
                else if (data.Nodes[i].SSOPType == "03") {
                    vType = "手动密码（原文）";
                }
                else if (data.Nodes[i].SSOPType == "04") {
                    vType = "手动密码（MD5）";
                }
                cell = row.insertCell(1);
                cell.align = "left";
                cell.innerHTML = getHiddenHtml('', data.Nodes[i].SSOPType) + vType;

                cell = row.insertCell(2);
                cell.align = "left";
                cell.innerHTML = getTextBoxHtml('', 200, '', '', data.Nodes[i].Value) + getHiddenHtml('', data.Nodes[i].SSOAPID);

                setRowAttributes(row);
            }
        }
    }
}

//验证
function validateSize() {
    handleBtn(false);
    //参数
    hidParameter.value = "";
    for (var i = 1; i < tbParameter.rows.length; i++) {
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

    if (hidParameter.value.length > 0) {
        hidParameter.value = hidParameter.value.substr(1);
    } 

    return true;
}