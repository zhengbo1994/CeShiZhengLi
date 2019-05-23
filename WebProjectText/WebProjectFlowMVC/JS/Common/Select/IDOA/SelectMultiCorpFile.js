// JScript 文件
function renderLink(cellvalue,options,rowobject)
{
    var url = "'../../../Knowledge/CorpFile/VCorpFileBrowse.aspx?CFID=" + rowobject[0] + "'";
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

function selectCorpFile()
{
    var flag = 0;
    var repeat = 0;
    
    var vCFID = getJQGridSelectedRowsID('jqCorpFile', true);
    var vCFNO = getJQGridSelectedRowsData('jqCorpFile',true,'CFNo');
    var vCFName = getJQGridSelectedRowsData('jqCorpFile',true,'CFName');
    var dgRelate = window.dialogArguments.dgRelate;
                
    for (var i=0;i<vCFID.length;i++)
    {
        var repeatCnt = 0;
        for (j = 1; j < dgRelate.rows.length; j++) // 合同关联公司文件
        {
            if (getObjTR(dgRelate, j, "input", 0).value == vCFID[i])
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
   
        var cell = row.insertCell(0);
        cell.align = "center";
        cell.innerHTML = '<input style="width:15px;height:15px;" type="checkbox" onclick="selectRow(this)"  gisttype="2" value="' + vCFID[i] + '" />';

        cell = row.insertCell(1);
        cell.align = "center";
        cell.innerText = "公司文件";
        
        cell = row.insertCell(2);
        cell.innerText = $.jgrid.stripHtml(vCFNO[i]);

        cell = row.insertCell(3);
//        cell.innerText = $.jgrid.stripHtml(vCFName[i]);
        cell.innerHTML = '<a href="#showRelateName" onclick="showRelateName(\'' + vCFID[i] + '\',\'2\')">' + $.jgrid.stripHtml(vCFName[i]) + '</a>';
        
        cell = row.insertCell(4);
        cell.align = "center";
        cell.innerHTML = getTextAreaHtml(null,'1000','30',null);
    
         flag++;
    }
    if (flag == 0)
    {
        if (repeat > 0)
        {
            alert("你不能重复添加公司文件。");
        }
        else
        {
            alert("没有选择任何进公司文件。");
        }
        return false;
    }   
    window.close();        

}


