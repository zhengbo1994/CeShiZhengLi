// JScript 文件
function selectDesignChange()
{
    var flag = 0;
    var repeat = 0;

    var dgDesignChange = window.dialogArguments.dgDesignChange;
    if (dgDesignChange == null) //主要用于合同
    {
        dgDesignChange = window.dialogArguments.dgDesign;
    }
    var cnt = dgDesignChange.rows.length;

    for (i = 1; i < dgData.rows.length; i++)
    {
        var chk = getObjTR(dgData, i, 'input', 0);
        if (chk.checked)
        {
            var repeatCnt = 0;
            for (j = 1; j < cnt; j++)
            {
                if (getObjTR(dgDesignChange, j, "input", 0).value == chk.value)
                {
                    repeatCnt++;
                    repeat++;
                }
            }
            if (repeatCnt > 0)
            {
                continue;
            }
            var row = dgDesignChange.insertRow();
            $(dgDesignChange).show();

            var cell = row.insertCell(0);

            cell.align = "center";
            cell.innerHTML = dgData.rows(i).cells(0).innerHTML;

            cell = row.insertCell(1);
            cell.innerText = dgData.rows(i).cells(1).innerText;

            cell = row.insertCell(2);
            cell.innerHTML = dgData.rows(i).cells(2).innerHTML; ;

            cell = row.insertCell(3);
            cell.align = "right";
            cell.innerText = dgData.rows(i).cells(3).innerText; ;

            cell = row.insertCell(4);
            cell.align = "right";
            cell.innerText = dgData.rows(i).cells(4).innerText;

            cell = row.insertCell(5);
            cell.align = "center";
            if (getObj("hidAction").value == "Settlement")
            {
                cell.innerHTML = getTextBoxHtml(null, 100, null, "setMoneyValue(2);", null, false);
            }
            if (getObj("hidAction").value == "Contract")
            {
                cell.innerHTML = getTextBoxHtml(null, 100, null, "setMoneyValue(2);", null, false);
            }

            cell = row.insertCell(6);
            cell.align = "center";
            cell.innerHTML = getTextAreaHtml(null, 200, 40, null);

            flag++;
        }
    }
    if (flag == 0)
    {
        if (repeat > 0)
        {
            alert("你不能重复添加其他变更。");
        }
        else
        {
            alert("没有选择任何其他变更。");
        }
        return false;
    }
    for (var i = cnt; i < dgDesignChange.rows.length; i++)
    {
        setRowAttributes(dgDesignChange.rows(i));
    }
    window.close();

}
