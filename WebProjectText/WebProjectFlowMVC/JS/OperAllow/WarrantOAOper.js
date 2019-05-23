// JScript 文件

// 项目授权设置页的onload
function loadOAOper()
{
    initOperClick(dgOA, 1, 2);

    if (dgOA.rows.length > 1)
    {
        checkSelectRowAll(dgOA, -1, 0);
        checkSelectCellAll(dgOA, -1, 0);
        checkSelectTableAll(dgOA);
    }
   
    if (getObj("hidFrom").value == "Browse")
    {
        var chks = tdOper.getElementsByTagName("input");
        for (var i = 0; i < chks.length; i++)
        {
            chks[i].onclick = function(){ return false; };
        }
    }
}

// 为权限CheckBox加onclick
function initOperClick(table, startRowIndex, startCellIndex)
{
    for (var i = startRowIndex; i < table.rows.length; i++)
    {
        for (var j = startCellIndex; j < table.rows[0].cells.length; j++)
        {
            var chks = table.rows[i].cells[j].getElementsByTagName("input");
            for (var k = 0; k < chks.length; k++)
            {
                chks[k].onclick = selectOper;
            }
        }
    }    
}

// 权限行的全选控制
function checkSelectRowAll(table, rowIndex, checkAll)
{
    var min = rowIndex;
    var max = rowIndex;
    if (rowIndex < 1)
    {
        min = 1
        max = table.rows.length - 1;
    }
    for (var i = min; i <= max; i++)
    {
        var flag = 0;
        var chks = table.rows[i].getElementsByTagName("input");
        for (var j = 1; j < chks.length; j++)
        {
            if (chks[j].type.toUpperCase() == "CHECKBOX" && !chks[j].checked)
            {
                flag = 1;
                break;
            }
        }
        getObjTC(table, i, 0, "input", 0).checked = (flag != 1);
    }
    
    if (checkAll != 0)
    {
        checkSelectTableAll(table);
    }
}

// 权限列的全选控制
function checkSelectCellAll(table, cellIndex, checkAll)
{
    var min = cellIndex;
    var max = cellIndex;
    if (cellIndex < 2)
    {
        min = 2
        max = table.rows[0].cells.length - 1;
    }
    
    for (var i = min; i <= max; i++)
    {
        var flag0 = 0;
        var flag1 = 0;
        var flag2 = 0;
        for (var j = 1; j < table.rows.length && (flag0 == 0 || flag1 == 0 || flag2 == 0); j++)
        {
            if (flag0 == 0 && !getObjTC(table, j, i, "input", 0).checked)
            {
                flag0 = 1;
            }
            if (flag1 == 0 && !getObjTC(table, j, i, "input", 1).checked)
            {
                flag1 = 1;
            }
            if (flag2 == 0 && !getObjTC(table, j, i, "input", 2).checked)
            {
                flag2 = 1;
            }
        }
        getObjTC(table, 0, i, "input", 0).checked = (flag0 != 1);
        getObjTC(table, 0, i, "input", 1).checked = (flag1 != 1);
        getObjTC(table, 0, i, "input", 2).checked = (flag2 != 1);
    }
    
    if (checkAll != 0)
    {
        checkSelectTableAll(table);
    }
}

// 权限表的全选控制
function checkSelectTableAll(table)
{
    var flag = 0;
    var chks = table.rows[0].getElementsByTagName("input");
    for (var i = 1; i < chks.length; i++)
    {
        if (!chks[i].checked)
        {
            flag = 1;
            break;
        }
    }
    getObjTC(table, 0, 0, "input", 0).checked = (flag != 1);
}