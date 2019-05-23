// JScript 文件
function renderLink(cellvalue,options,rowobject)
{
    var url = "'../../../IDOA/OutWork/VOutWorkApplyBrowse.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#ShowOutWork" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a>' ;
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

    var vCPRID = getJQGridSelectedRowsID('jqOutWork', true);
    var vCCNo = getJQGridSelectedRowsData('jqOutWork', true, 'CCNO');
    var vCCTitle = getJQGridSelectedRowsData('jqOutWork', true, 'CCTitle');
    var vAction = $("#hidAction").val();

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
            cell.innerHTML = '<input id="chkIDV3" style="width:15px;height:15px;" type="checkbox" value="' + vCPRID[i] + '" modeltype="OutWork"  onclick="selectRow(this);" />';

            cell = row.insertCell(1);
            cell.align = "center";
            cell.innerText = "出差申请";

            cell = row.insertCell(2);
            cell.innerText = $.jgrid.stripHtml(vCCNo[i]);

            cell = row.insertCell(3);
            cell.innerHTML = '<a href="#showRelateName" onclick="openWindow(\'../../IDOA/OutWork/VOutWorkApplyBrowse.aspx?ID=' + vCPRID[i] + '\',0,0)">' + $.jgrid.stripHtml(vCCTitle[i]) + '</a>';

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
    
    if (flag == 0)
    {
        if (repeat > 0)
        {
            alert("你不能重复添加出差申请。");
        }
        else
        {
            alert("没有选择任何进出差申请。");
        }
        return false;
    }   
    window.close();        

}

