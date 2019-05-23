// 选择我的公司的工作组VSelectAvailableGroup.aspx用到的js
// 作者：程爱民
// 日期：2010-08-06


// 选择列
function selectCols()
{
    var bSelect = false;
    var bAllRepeat = true;
    var hiddenId = getParamValue("HiddenID");
    var tableId = getParamValue("TableID");
    var hidCols = hiddenId ? getObjD(hiddenId) : getObjD("hidSysSubTableCols");
    var tbCols = tableId ? getObjD(tableId) : getObjD("tbSysSubTableCols");
    var cols = "";
    for (var i = 1; i < dgData.rows.length; i++)
    {
        var chk = getObjTR(dgData, i, "input", 0);
        var txtName = getObjTR(dgData, i, "input", 1);
        var ddlFmt = getObjTR(dgData, i, "select", 0);
        var ddlLen = getObjTR(dgData, i, "select", 1);
        
        if (chk.checked)
        {
            bSelect = true;
            var repeat = false;
            for (var j = 1; j < tbCols.rows.length; j++)
            {
                if (chk.value == getObjTR(tbCols, j, "input", 0).value)
                {
                    repeat = true;
                    break;
                }
            }
            if (!repeat)
            {
                if (txtName.value == "")
                {
                    return alertMsg("列名称不能为空。", txtName);
                }
                cols += stringFormat(',{"ColName":"{0}","ColTitle":"{1}","ColLen":"{2}","Format":"{3}"}',
                    chk.value, trim(txtName.value), ((!ddlLen || ddlLen.style.display == "none") ? "" : ddlLen.value), (ddlFmt ? ddlFmt.value : ""));
                    
                bAllRepeat = false;
            }
        }
    }
    
    if (!bSelect)
    {
        return alertMsg("没有选择任何列。");
    }
    else if (bAllRepeat)
    {
        return alertMsg("不能重复添加列。");
    }
    
    hidCols.value = "[" + cols.substr(1) + "]";
    
    window.close();
}

// 整数类型时切换数字格式
function showLen(sel)
{
    var selLen = getObjC(sel.parentNode.parentNode.cells[3], "select", 0);
    if (selLen)
    {
        selLen.style.display = inValues(sel.value, "N", "P", "E") ? "" : "none";
    }
}

