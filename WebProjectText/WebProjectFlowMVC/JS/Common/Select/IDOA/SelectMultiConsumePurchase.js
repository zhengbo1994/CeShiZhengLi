
// JScript 文件
function renderLink(cellvalue,options,rowobject)
{
    var url = "'../../../IDOA/Consume/Purchase/VConsumePurchaseBrowse.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#ShowCorpFile" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a>' ;
}


function btnSearch_Click(jqgid)
{
    reloadData(jqgid);
}

function reloadData(jqgid)
{
    var corpID = getObj("hidCorpID").value;
    var vKey=$("#txtKey").val();
    
    $(jqgid,document).getGridParam('postData').CorpID=corpID;
    $(jqgid,document).getGridParam('postData').KeyValue=vKey;
    
    var reg=new RegExp("#","g"); //创建正则RegExp对象    
    refreshJQGrid(jqgid.replace(reg,""));
}

function btnChoose_Click()
{
    var flag = 0;
    var repeat = 0;
    var vAction = $("#hidAction").val();

    var vCPRID = getJQGridSelectedRowsID('jqPurchase', true);
    var vCCNo = getJQGridSelectedRowsData('jqPurchase', true, 'CCNO');
    var vCCTitle = getJQGridSelectedRowsData('jqPurchase', true, 'CCTitle');

    if (vAction == "Reimbursement")
    {
        var tbDoc = window.dialogArguments.tbDoc;
        for (var i = 0; i < vCPRID.length; i++)
        {
            var repeatCnt = 0;
            for (var j = 1; j < tbDoc.rows.length; j++)
            {
                if (getObjTR(tbDoc, j, "input", 0).value == vCPRID[i])
                {
                    repeatCnt++;
                    repeat++;
                }
            }

            var row = tbDoc.insertRow();

            var cell = row.insertCell(0);
            cell.align = "center";
            cell.innerHTML = '<input id="chkIDV3" style="width:15px;height:15px;" type="checkbox" value="' + vCPRID[i] + '" modeltype="Purchase"  onclick="selectRow(this);" />';

            cell = row.insertCell(1);
            cell.align = "center";
            cell.innerText = "用品申购";

            cell = row.insertCell(2);
            cell.innerText = $.jgrid.stripHtml(vCCNo[i]);

            cell = row.insertCell(3);
            cell.innerHTML = '<a href="#showRelateName" onclick="showRelateName(\'../../IDOA/Consume/Purchase/VConsumePurchaseBrowse.aspx?ID=' + vCPRID[i] + '\',0,0)">' + $.jgrid.stripHtml(vCCTitle[i]) + '</a>';

            cell = row.insertCell(4);
            cell.align = "center";
            cell.innerHTML = '<textarea class="text" cols="20" rows="2" style="width: 98%;height: 30px" onkeyup="checkSize(this,1000)"></textarea>';

            flag++;

            if (repeatCnt > 0)
            {
                continue;
            }
        }
    }
    else
    {
        var dgRelate = window.dialogArguments.dgRelate;
        for (var i = 0; i < vCPRID.length; i++)
        {
            var repeatCnt = 0;
            for (j = 1; j < dgRelate.rows.length; j++)
            {
                if (getObjTR(dgRelate, j, "input", 0).value == vCPRID[i])
                {
                    repeatCnt++;
                    repeat++;
                }
            }
            if (repeatCnt > 0)
            {
                continue;
            }
            var row = dgRelate.insertRow();  // 合同关联用品申购

            var cell = row.insertCell(0);
            cell.align = "center";
            cell.innerHTML = '<input style="width:15px;height:15px;" type="checkbox" onclick="selectRow(this)" gisttype="5"  value="' + vCPRID[i] + '" />';

            cell = row.insertCell(1);
            cell.align = "center";
            cell.innerText = "用品申购";

            cell = row.insertCell(2);
            cell.innerText = $.jgrid.stripHtml(vCCNo[i]);

            cell = row.insertCell(3);
//            cell.innerText = $.jgrid.stripHtml(vCCTitle[i]);
            cell.innerHTML = '<a href="#showRelateName" onclick="showRelateName(\'' + vCPRID[i] + '\',\'5\')">' + $.jgrid.stripHtml(vCCTitle[i]) + '</a>';

            cell = row.insertCell(4);
            cell.align = "center";
            cell.innerHTML = getTextAreaHtml(null, '1000', '30', null);

            flag++;
        }
    }
    if (flag == 0)
    {
        if (repeat > 0)
        {
            alert("你不能重复添加用品申购。");
        }
        else
        {
            alert("没有选择任何进用品申购。");
        }
        return false;
    }   
    window.close();        

}

