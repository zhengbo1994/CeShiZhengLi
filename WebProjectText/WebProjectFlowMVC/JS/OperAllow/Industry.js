
//新增
function addIndustry(isSon)
{
    var objSelect = document.getElementsByName("chkIDV3");   
    if (objSelect && objSelect.length)
    {
        var chk = getSelectedBox("chkIDV3");
        if (chk != null)
        {
            var url = "VIndustryAdd.aspx";
            var vParentID = '00000';
            if (isSon == 'child') //增加子级
            {
                vParentID = chk.industryid;
                url = addUrlParam(url, "ParentID", vParentID);
            }
            if (isSon == 'sibling') //增加同级
            {
                vParentID = chk.parentindustryid;
                url = addUrlParam(url, "ParentID", vParentID);
            }
            openWindow(url, 450, 350);
        }
        return true;
    }
    openWindow(addUrlParam("VIndustryAdd.aspx", "ParentID", "00000"), 450, 350);
}
//修改
function editType()
{
    openModifyWindow("VIndustryEdit.aspx", 450, 350);
}
//刷新
function reloadData()
{
    ajax(
        "VIndustry.aspx",
        { },
        "html",
        function (data) { $("#divMPList").html(data); }
    );
}
//删除
function deleteType()
{
    //if (confirm("确定要删除该节点和该节点下所有子级节点？"))
    //{
    //    openDeleteWindow("Industry", 0);
    //}
    var industryIDs = [];
    var invaildFlag = false;
    $("#tbData>tbody>tr:gt(0)").each(function ()
    {
        var $selectChk = $("td:eq(0)", $(this)).find("input[id=chkIDV3]:checked");
        if ($selectChk.attr("isleaf") == "False")
        {
            invaildFlag = true;
            return;
        }
        //if ($selectChk.attr("isleaf") && $selectChk.attr("industryid"))
        //{
        //    industryIDs.push($selectChk.attr("industryid"));
        //}
    });
    if (invaildFlag)
    {
        return alertMsg("您不能删除父级节点，请重新选择。");        
    }
    //alert(industryIDs.length);
    openDeleteWindow("Industry", 0);
}

//校验
function validateSize()
{
    if ($("#txtTypeName").val() == "")
    {
        return alertMsg("请输入类别名称。", getObj("txtTypeName"));
    }
    if ($("#txtRate").val() == "")
    {
        return alertMsg("请输入可抵扣税率。", getObj("txtRate"));
    }
    return true;
}

//导入
function importIndustry()
{
    openWindow("VIndustryImport.aspx", 500, 200, 0, 1, 1);
}
//搜索
function btnSearch_Click()
{
    var table = $("table[id*='tbData']")[0];
    var start = 0;
    var keyValue = getObj("txtKey").value;
    if (window["OriKey"] == keyValue)
    {
        start = parseInt(window["LastIndex"]);
    }
    window["OriKey"] = keyValue;
    window["LastIndex"] = search(start + 1, keyValue, table, [1, 2], 1);
}
//搜索 按一条一条搜索(仅支持列表模板页即其上层是<div id="divMPList">)
//start:起始行;keyword 关键字;table 搜索的表格对象
//cellNums:搜索的表格列数组，如{0,1}代表搜索0列1列
//headRowNum:表头行数
//noHead:是否无表头
//tableType:jqgrid，null为普通表格
function search(start, keyWord, table, cellNums, headRowNum, noHead, tableType)
{
    var first = noHead == true ? 0 : 1;
    if (keyWord == "" || table == null || cellNums == null || cellNums.length == 0)
        return 0;
    for (var i = start; i < table.rows.length; i++)
    {
        for (var j = 0; j < cellNums.length; j++)
        {
            if (cellNums[j] < table.rows[i].cells.length)
            {
                if (stripHtml(table.rows[i].cells[cellNums[j]].innerHTML).indexOf(keyWord) != -1)
                {
                    setSearchSelect(table, tableType, i, start);
                    setScrollTop(table.rows[i], headRowNum);
                    return i;
                }
            }
        }
    }
    return start != first ? search(first, keyWord, table, cellNums, headRowNum, noHead, tableType) : first - 1;
}

function setSearchSelect(table, tableType, rowIndex, start)
{
    if (tableType != null) tableType = tableType.toLowerCase();
    if (tableType == "jqgrid")
{
        table.rows[rowIndex].click();
        return;
    }
    var selRow = $("tr[class='dg_rowselected']", $(table));
    selRow.removeClass("dg_rowselected");
    selRow.addClass((start - 1) % 2 == 1 ? 'dg_row' : 'dg_altrow');
    table.rows[rowIndex].className = 'dg_rowselected'
}

function setScrollTop(row, headRowNum)
{
    if (headRowNum == null)
        headRowNum = 1;
    getObj("divMPList").scrollTop = row.children(0).offsetTop - 26 * headRowNum;
}
