// VSelectMultiDoc.aspx等页面的JS文件
// 作者：徐海波
// 时间：2010-06-22
function renderLink(cellvalue,options,rowobject)
{
    var url = "'../../../IDOA/CheckDoc/VCheckDocBrowse.aspx?ID=" + rowobject[6] + "'";
    return '<a  href="#ShowCheckDoc" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a>' ;
}

function ddlCorp_Change(jqgid)
{
    reloadData(jqgid);
}

function btnSearch_Click(jqgid)
{
    reloadData(jqgid);
}

function reloadData(jqgid)
{
    
    var corpID = getObj("ddlCorp").value;

    var vKey=$("#txtKey").val();
    
    $(jqgid,document).getGridParam('postData').SelectCorpID=corpID;
    $(jqgid,document).getGridParam('postData').KeyValue=vKey;
    
    var reg=new RegExp("#","g"); //创建正则RegExp对象    
    refreshJQGrid(jqgid.replace(reg,""));
}

function btnChoose_Click()
{
    var vAction = getObj("hidAction").value;
    var flag = 0;
    var repeat = 0;   
    if(vAction=="NonTableWithSingle")
    {
            var vCCID = getJQGridSelectedRowsID('jqMyCheckDoc', false);
            var vCCNo = getJQGridSelectedRowsData('jqMyCheckDoc',false,'CCNO');
            var vCCTitle = getJQGridSelectedRowsData('jqMyCheckDoc',false,'CCTitle');
            var vCDID = getJQGridSelectedRowsData('jqMyCheckDoc',false,'CDID');
           window.returnValue={"CCID":vCCID,"CCNo":$.jgrid.stripHtml(vCCNo),"CCTitle":$.jgrid.stripHtml(vCCTitle),"CDID":$.jgrid.stripHtml(vCDID)}; 
    }
    else 
    {        
            var vCCID = getJQGridSelectedRowsID('jqMyCheckDoc', true);
            var vCCNo = getJQGridSelectedRowsData('jqMyCheckDoc',true,'CCNO');
            var vCCTitle = getJQGridSelectedRowsData('jqMyCheckDoc',true,'CCTitle');
            var vCDID = getJQGridSelectedRowsData('jqMyCheckDoc',true,'CDID');
            if (vAction == "NonTableWithMulti") //多数据，但不适用表格接收
            {
                var retValue = [];
                for (var i = 0; i < vCCID.length; i++)
                {
                    var repeatCnt = 0;
                    for (var j = 1; j < tbDoc.rows.length; j++)
                    {
                        if (getObjTR(tbDoc, j, "input", 0).value == vCCID[i])
                        {
                            repeatCnt++;
                            repeat++;
                        }
                    }

                    if (repeatCnt > 0)
                    {
                        continue;
                    }
                    retValue.push({ "CCID": vCCID[i], "CCNo": $.jgrid.stripHtml(vCCNo[i]), "CCTitle": $.jgrid.stripHtml(vCCTitle[i]), "CDID": $.jgrid.stripHtml(vCDID[i]) });
                    flag++;
                }
                window.returnValue = retValue;
            }
            else if (vAction == "RelationDoc")
            {
                var tbDoc = window.dialogArguments.tbDoc;

                for (var i = 0; i < vCCID.length; i++)
                {
                    var repeatCnt = 0;
                    for (var j = 1; j < tbDoc.rows.length; j++)
                    {
                        if (getObjTR(tbDoc, j, "input", 0).value == vCCID[i])
                        {
                            repeatCnt++;
                            repeat++;
                        }
                    }

                    if (repeatCnt > 0)
                    {
                        continue;
                    }

                    var row = tbDoc.insertRow();

                    var cell = row.insertCell(0);
                    cell.align = "center";
                    cell.innerHTML = '<input id="optionSelect" style="width:15px;height:15px;" type="checkbox" value="' + vCCID[i] + '"  onclick="selectRow(this);" />';

                    cell = row.insertCell(1);
                    cell.innerText = $.jgrid.stripHtml(vCCNo[i]);

                    cell = row.insertCell(2);
                    cell.innerHTML = '<a href="#ShowDoc" onclick="showDoc(\'' + vCDID[i] + '\')">' + $.jgrid.stripHtml(vCCTitle[i]) + '</a>';

                    flag++;
                }
            }
            else if (vAction == "Reimbursement")
            {
                var tbDoc = window.dialogArguments.tbDoc;

                for (var i = 0; i < vCDID.length; i++)
                {
                    //                    var repeatCnt = 0;
                    //                    for (var j = 1; j < tbDoc.rows.length; j++)
                    //                    {
                    //                        if (getObjTR(tbDoc, j, "input", 0).value == vCDID[i])
                    //                        {
                    //                            repeatCnt++;
                    //                            repeat++;
                    //                        }
                    //                    }
                    //                    
                    //                    if (repeatCnt > 0)
                    //                    {
                    //                        continue;
                    //                    }
                    //                    
                    //                    var row = tbDoc.insertRow();
                    //                                
                    //                    var cell = row.insertCell(0);
                    //                    cell.align = "center";
                    //                    cell.innerHTML = '<input id="optionSelect" style="width:15px;height:15px;" type="checkbox" value="' + vCDID[i] + '"  onclick="selectRow(this);" />';
                    //                    
                    //                    cell = row.insertCell(1);
                    //                    cell.innerText = $.jgrid.stripHtml(vCCNo[i]);
                    //                    
                    //                    cell = row.insertCell(2);
                    //                    cell.innerHTML = '<a href="#ShowDoc" onclick="showDoc(\'' + vCDID[i] + '\')">' + $.jgrid.stripHtml(vCCTitle[i]) + '</a>';

                    //                    flag++;
                    var repeatCnt = 0;
                    for (var j = 1; j < tbDoc.rows.length; j++)
                    {
                        if (getObjTR(tbDoc, j, "input", 0).value == vCDID[i])
                        {
                            repeatCnt++;
                            repeat++;
                        }
                    }

                    if (repeatCnt > 0)
                    {
                        continue;
                    }

                    var row = tbDoc.insertRow();

                    var cell = row.insertCell(0);
                    cell.align = "center";
                    cell.innerHTML = '<input id="chkIDV3" style="width:15px;height:15px;" type="checkbox" value="' + vCDID[i] + '" modeltype="Doc" onclick="selectRow(this);" />';

                    cell = row.insertCell(1);
                    cell.align = "center";
                    cell.innerText = "归档公文";

                    cell = row.insertCell(2);
                    cell.innerText = $.jgrid.stripHtml(vCCNo[i]);

                    cell = row.insertCell(3);
                    cell.innerHTML = '<a href="#showRelateName" onclick="openWindow(\'../../IDOA/CheckDoc/VCheckDocBrowse.aspx?ChekDocType=0&ID=' + vCDID[i] + '\',0,0)">' + $.jgrid.stripHtml(vCCTitle[i]) + '</a>';

                    cell = row.insertCell(4);
                    cell.align = "center";
                    cell.innerHTML = '<textarea class="text" cols="20" rows="2" style="width: 98%;height: 30px" onkeyup="checkSize(this,1000)"></textarea>';

                    flag++;
                }
            }
            else if (vAction == "CarSchedule")
            {
                var tbDoc = window.dialogArguments.tbDoc;

                for (var i = 0; i < vCDID.length; i++)
                {
                    var repeatCnt = 0;
                    for (var j = 1; j < tbDoc.rows.length; j++)
                    {
                        if (getObjTR(tbDoc, j, "input", 0).value == vCDID[i])
                        {
                            repeatCnt++;
                            repeat++;
                        }
                    }

                    if (repeatCnt > 0)
                    {
                        continue;
                    }

                    var row = tbDoc.insertRow();

                    var cell = row.insertCell(0);
                    cell.align = "center";
                    cell.innerHTML = '<input id="chkIDV3" style="width:15px;height:15px;" type="checkbox" value="' + vCDID[i] + '" modeltype="Doc" onclick="selectRow(this);" />';

                    cell = row.insertCell(1);
                    cell.innerText = $.jgrid.stripHtml(vCCNo[i]);

                    cell = row.insertCell(2);
                    cell.innerHTML = '<a href="#showRelateName" onclick="openWindow(\'../../IDOA/CheckDoc/VCheckDocBrowse.aspx?ChekDocType=0&ID=' + vCDID[i] + '\',0,0)">' + $.jgrid.stripHtml(vCCTitle[i]) + '</a>';

                    cell = row.insertCell(3);
                    cell.align = "center";
                    cell.innerHTML = '<textarea class="text" cols="20" rows="2" style="width: 98%;height: 30px" onkeyup="checkSize(this,1000)"></textarea>';

                    flag++;
                }
            }
            else if (vAction == "Contract")
            {
                var dgRelate = window.dialogArguments.dgRelate;

                for (var i = 0; i < vCDID.length; i++)
                {
                    var repeatCnt = 0;
                    for (var j = 1; j < dgRelate.rows.length; j++)
                    {
                        if (getObjTR(dgRelate, j, "input", 0).value == vCDID[i])
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
                    cell.innerHTML = '<input id="chkIDV3" style="width:15px;height:15px;" type="checkbox" gisttype="1" value="' + vCDID[i] + '"  onclick="selectRow(this);" />';

                    cell = row.insertCell(1);
                    cell.align = "center";
                    cell.innerText = "归档公文";

                    cell = row.insertCell(2);
                    cell.innerText = $.jgrid.stripHtml(vCCNo[i]);

                    cell = row.insertCell(3);
                    cell.innerHTML = '<a href="#showRelateName" onclick="showRelateName(\'' + vCDID[i] + '\',\'1\')">' + $.jgrid.stripHtml(vCCTitle[i]) + '</a>';

                    cell = row.insertCell(4);
                    cell.align = "center";
                    cell.innerHTML = '<textarea class="text" cols="20" rows="2" style="width: 98%;height: 30px" onkeyup="checkSize(this,2000)"></textarea>';

                    flag++;
                }
            }
            if (vAction == "DesignChange" || vAction == "LocalityChange" || vAction == "IncomeRequest" || vAction == "PayRequest")
            {
                var dgDoc = window.dialogArguments.dgDoc;
                var cnt = dgDoc.rows.length; 
                
                for (var i=0;i<vCDID.length;i++)
                {
                    var repeatCnt = 0;
                    for (var j = 1; j < dgDoc.rows.length; j++)
                    {
                        if (getObjTR(dgDoc, j, "input", 0).value == vCDID[i])
                        {
                            repeatCnt++;
                            repeat++;
                        }
                    }
                    
                    if (repeatCnt > 0)
                    {
                        continue;
                    }
                    var row = dgDoc.insertRow();
                    
                    var cell = row.insertCell(0);
                    cell.align = "center";
                    cell.innerHTML = getCheckBoxHtml(null,vCDID[i]);
                    
                    cell = row.insertCell(1);
                    cell.innerHTML = vCCNo[i];
                    
                    cell = row.insertCell(2);
                    cell.innerHTML = '<a href="#showDoc" onclick="showDoc(\'' + vCDID[i] + '\')">' + $.jgrid.stripHtml(vCCTitle[i]) + '</a>';

                    
                    cell = row.insertCell(3);
                    cell.align = "center";
                    cell.innerHTML = getTextAreaHtml(null,200,40,null);
                    
                    flag++;
                }
                for (var k = cnt; k < dgDoc.rows.length; k++)
                {
                    setRowAttributes(dgDoc.rows(i));
                }
            }   
            if (flag == 0)
            {
                if (repeat > 0)
                {
                    alert("你不能重复添加公文。");
                }
                else
                {
                    alert("没有选择任何公文。");
                }
                
                return;
            }
    }
    window.opener=null;
    window.close();
}
