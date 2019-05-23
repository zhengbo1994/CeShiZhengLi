function renderLink(cellvalue, options, rowobject)
{
    var vUrl = "'/" + rootUrl + "/Supplier/COSEvaluation/VEvaluationBrowse.aspx?ID=" + rowobject[7] + "'";
    return '<div class="nowrap"><a href="javascript:void(0)" onclick="openWindow(' + vUrl + ',0,0)">' + cellvalue + '</a></div>';

}

function btnSearch_Click(jqgid)
{
    reloadData(jqgid);
}

function reloadData(jqgid)
{

    var vKey = $("#txtKey").val();

    $(jqgid, document).getGridParam('postData').KeyValue = vKey;

    var reg = new RegExp("#", "g"); //创建正则RegExp对象    
    refreshJQGrid(jqgid.replace(reg, ""));
}

function btnChoose_Click()
{
    var vAction = getObj("hidAction").value;
    var flag = 0;
    var repeat = 0;

    var vKeyID = getJQGridSelectedRowsID('jqMyEvaluation', true);
    var vCCNo = getJQGridSelectedRowsData('jqMyEvaluation', true, 'CCNO');
    var vEName = getJQGridSelectedRowsData('jqMyEvaluation', true, 'EName');
    var vEID = getJQGridSelectedRowsData('jqMyEvaluation', true, 'EID');
    var vCosName = getJQGridSelectedRowsData('jqMyEvaluation', true, 'COSName');
    var vScore = getJQGridSelectedRowsData('jqMyEvaluation', 'true', 'Score');


    var tbEvaluation = window.dialogArguments.tbEvaluation;

    for (var i = 0; i < vKeyID.length; i++)
    {
        var repeatCnt = 0;
        for (var j = 1; j < tbEvaluation.rows.length; j++)
        {
            if (getObjTR(tbEvaluation, j, "input", 0).value == vKeyID[i])
            {
                repeatCnt++;
                repeat++;
            }
        }

        if (repeatCnt > 0)
        {
            continue;
        }

        var row = tbEvaluation.insertRow();

        var cell = row.insertCell(0);
        cell.align = "center";
        cell.innerHTML = '<input id="optionSelect" style="width:15px;height:15px;" type="checkbox" value="' + vKeyID[i] + '"  onclick="selectRow(this);" />';

        cell = row.insertCell(1);
        cell.innerText = $.jgrid.stripHtml(vCCNo[i]);

        cell = row.insertCell(2);
        cell.innerHTML = '<a href="#ShowDoc" onclick="showEvaluation(\'' + vEID[i] + '\')">' + $.jgrid.stripHtml(vEName[i]) + '</a>';

        cell = row.insertCell(3);
        cell.innerHTML = vCosName[i].replace(",", "</br>");

        cell = row.insertCell(4);
        cell.innerHTML = vScore[i].replace(",", "</br>");

        flag++;
    }

    if (flag == 0)
    {
        if (repeat > 0)
        {
            alert("你不能重复添加入库认证评估申请。");
        }
        else
        {
            alert("没有选择任何入库认证评估申请。");
        }

        return;
    }
    window.opener = null;
    window.close();
}