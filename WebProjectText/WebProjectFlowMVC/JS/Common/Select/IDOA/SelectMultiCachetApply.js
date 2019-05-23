// JScript 文件
function renderLink(cellvalue, options, rowobject)
{
    var url = "'../../../IDOA/Cachet/VCachetApplyBrowse.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#ShowCachetApply" onclick="javascript:openWindow(' + url + ',800, 600)">' + cellvalue + '</a>';
}


function btnSearch_Click(jqgid)
{
    reloadData(jqgid);
}

function reloadData(jqgid)
{
    var corpID = getObj("hidCorpID").value;
    var vKey = $("#txtKey").val();

    $(jqgid, document).getGridParam('postData').CorpID = corpID;
    $(jqgid, document).getGridParam('postData').KeyValue = vKey;

    var reg = new RegExp("#", "g"); //创建正则RegExp对象    
    refreshJQGrid(jqgid.replace(reg, ""));
}

function selectCachetApply()
{
    var flag = 0;
    var repeat = 0;

    var vReqID = getJQGridSelectedRowsID('jqCachetApply', true);
    var vCCNo = getJQGridSelectedRowsData('jqCachetApply', true, 'CCNo');
    var vCCTitle = getJQGridSelectedRowsData('jqCachetApply', true, 'CCTitle');
    var dgRelate = window.dialogArguments.dgRelate;

    for (var i = 0; i < vReqID.length; i++)
    {
        var repeatCnt = 0;
        for (j = 1; j < dgRelate.rows.length; j++)
        {
            if (getObjTR(dgRelate, j, "input", 0).value == vReqID[i])
            {
                repeatCnt++;
                repeat++;
            }
        }
        if (repeatCnt > 0)
        {
            continue;
        }
        var row = dgRelate.insertRow();

        var cell = row.insertCell(0);  // 合同关联证章
        cell.align = "center";
        cell.innerHTML = '<input style="width:15px;height:15px;" type="checkbox" onclick="selectRow(this)"  gisttype="10" value="' + vReqID[i] + '" />';

        cell = row.insertCell(1);
        cell.align = "center";
        cell.innerText = "证章";

        cell = row.insertCell(2);
        cell.innerText = $.jgrid.stripHtml(vCCNo[i]);

        cell = row.insertCell(3);
//        cell.innerText = $.jgrid.stripHtml(vCCTitle[i]);
        cell.innerHTML = '<a href="#showRelateName" onclick="showRelateName(\'' + vReqID[i] + '\',\'10\')">' + $.jgrid.stripHtml(vCCTitle[i]) + '</a>';

        cell = row.insertCell(4);
        cell.align = "center";
        cell.innerHTML = getTextAreaHtml(null, '1000', '30', null);


        flag++;
    }
    if (flag == 0)
    {
        if (repeat > 0)
        {
            alert("你不能重复添加证章。");
        }
        else
        {
            alert("没有选择任何进证章。");
        }
        return false;
    }
    window.close();

}


