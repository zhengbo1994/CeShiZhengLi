//***************************************
// FileName:    BriefingManage.js
// Autor:       王勇
// DateTime:    2011-4-27 14:22:59
// Description: 简报配置中相关js的操作
//***************************************


function reloadData()
{
    var query = {ModID:ddlMod.value, IsEnable:getObj("ddlIsEnable").value, KW:getObj("txtKW").value};

    addParamsForJQGridQuery("jqgBriefing", [query]);
    refreshJQGrid("jqgBriefing");
}

//查看简报
function viewBriefing(value,rpt,record)
{
    var vUrl="'VBriefingManageBrowse.aspx?BCID="+rpt.rowId+"'";
    return stringFormat('<div><a href="javascript:void(0)" onclick="openWindow({0},800, 600)">{1}</div>',vUrl,value);
}


//新增
function addBriefingConfig()
{
    openAddWindow("VBriefingManageAdd.aspx", 800, 600, "jqgBriefing");
}
//修改
function editBriefingConfig()
{
    openModifyWindow("VBriefingManageEdit.aspx", 800, 600, "jqgBriefing");
}
//删除
function delBriefingConfig()
{
    openDeleteWindow("BriefingManage", 1, "jqgBriefing");
}
//设置查看方式
function readMethod()
{
    var bcId = getJQGridSelectedRowsData('jqgBriefing',true,'BCID');
    if(bcId == "")
    {
         alert("没有任何数据可供操作。");
         return;
    }
    if(bcId.length != 1)
    {
        alert("一次只能操作一条记录。");
         return;
    }
    openWindow("VBriefingReadMethod.aspx?BCID=" + bcId,800,400);
}

//增加查看方式
function addMethod()
{
    var row = tblReadMethod.insertRow();
    var cell = row.insertCell(0);
    cell.align = "center";
    cell.innerHTML = getCheckBoxHtml();
    
    //getTextBoxHtml(txtID, length, onfocus, onblur, value, readonly,width)    
    cell = row.insertCell(1);
    cell.innerHTML = getTextBoxHtml();
    
    cell = row.insertCell(2);
    cell.innerHTML = getTextBoxHtml();
    
    cell = row.insertCell(3);
    cell.innerHTML = getTextBoxHtml(null, 0, "", "setPlusIntNum()", (row.rowIndex-1) * 10 + 10);

    cell = row.insertCell(4);
    cell.innerHTML = getTextAreaHtml();
}

function initReadMethod()
{
    if(getObj("hidOriRMList").value.length>0)
    {
        var data = $.stringToJSON($('#hidOriRMList').val());
        
        $.each(data,function(i,list){
            var row = tblReadMethod.insertRow();             
            var cell = row.insertCell(0);
            cell.align = "center";
            //行ID 0同时也是范围ID
            cell.innerHTML = getCheckBoxHtml();  
            
            /*查看方式名称*/
            cell = row.insertCell(1);
            cell.innerHTML =getTextBoxHtml(null, 0, "", "", list.BRMName);
            
            /*Url*/
            cell = row.insertCell(2);
            cell.innerHTML = getTextBoxHtml(null, 0, "", "", list.Url);
            
            /*行号*/
            cell = row.insertCell(3);
            cell.innerHTML = getTextBoxHtml(null, 0, "", "", list.RowNo); 
               
            /*备注*/
            cell = row.insertCell(4);
            cell.innerHTML = getTextAreaHtml(null, 0, 0, list.Remark);        
        });
    
        setTableRowAttributes(tblReadMethod);
        
    }
}


function validateSize()
{
    getObj("hidRMList").value="";
    
    handleBtn(false);
    
    if (getObj("txtModName").value == "")
    {
        handleBtn(true);
        return alertMsg("请选择一个模块。", getObj("txtModName"));
    }
    
    if (getObj("txtBName").value == "")
    {
        handleBtn(true);
        return alertMsg("简报名称不能为空。", getObj("txtBName"));
    }
    var reg = /^[1-9][0-9]{0,8}$/;
    if (!reg.test(getObj("txtRowNo").value)) 
    {
        handleBtn(true);
        return alertMsg('行号应该为正整数。', getObj("txtRowNo"));
    }
    if(getObj("rblReadMethod").getElementsByTagName("input")[0].checked)
    {
        if (getObj("txtUrl").value == "")
        {
            handleBtn(true);
            return alertMsg("无查看方式时简报路径必须填写。", getObj("txtUrl"));
        }
    }
    else
    {
        if(tblReadMethod.rows.length>1)
        {
            for(var i=1;i<tblReadMethod.rows.length;i++)
            {
                if(getObjTR(tblReadMethod,i,"input",1).value=="")
                {
                    handleBtn(true);
                    return alertMsg(stringFormat("第{0}行的查看方式名称不能为空",i),getObjTR(tblReadMethod,i,"input",1));
                }
                if(getObjTR(tblReadMethod,i,"input",2).value=="")
                {
                    handleBtn(true);
                    return alertMsg(stringFormat("第{0}行的简报路径不能为空",i),getObjTR(tblReadMethod,i,"input",2));
                }
                if(!reg.test(getObjTR(tblReadMethod,i,"input",3).value))
                {
                    handleBtn(true);
                    return alertMsg(stringFormat("第{0}行的行号必须为正整数",i),getObjTR(tblReadMethod,i,"input",3));
                }
            }
            var rmList="";
            for(var i=1;i<tblReadMethod.rows.length;i++)
            {
                // RBMName*Url*RowNo*Remark
                rmList = rmList + '$' + getObjTR(tblReadMethod,i,"input",1).value + '*' +
                                        getObjTR(tblReadMethod,i,"input",2).value + '*' +
                                        getObjTR(tblReadMethod,i,"input",3).value + '*' +
                                        getObjTR(tblReadMethod,i,"textarea",0).value;
            }
            if(rmList.length>0)
            {
                rmList = rmList.substr(1);
            }
            
            getObj("hidRMList").value = rmList;
        }
    }   
    return true;
}
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

//选择查看方式
function rblReadMethodChange()
{
    if(getObj("rblReadMethod").getElementsByTagName("input")[0].checked)
    {
        $('.lblastk').get(6).style.display="block";
        trUrl.style.display="block";
        trReadMethod.style.display="none";
        trRMDetail.style.display="none";
    }
    else
    {
        $('.lblastk').get(6).style.display="none";
        trUrl.style.display="none";
        trReadMethod.style.display="block";
        trRMDetail.style.display="block";
    }
}

//选择模块
function selectMod()
{
    openWindow('../ReportConfig/VSelectSingleMod.aspx?Aim=QuickRoad', 450, 600);
}
