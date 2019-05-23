// JScript 文件

function reloadData()
{
    $('#jqWelcome').getGridParam('postData').CorpID = getObj("ddlCorp").value;
    $('#jqWelcome').trigger('reloadGrid');
}

// --添加
function Add()
{ 
    if(getObj("ddlCorp").value =="")
    {
        alert("请选择公司。");
        return;
    }
    else
    {  
        openAddWindow("VWelcomeAdd.aspx?CorpID=" + getObj("ddlCorp").value, 700, 620, "jqWelcome"); 
    }
}

// --修改
function Edit()
{
    openModifyWindow("VWelcomeEdit.aspx", 700, 620, "jqWelcome");
}

// --删除
function Del()
{   
    openDeleteWindow("Welcome", 1, "jqWelcome");
}

// --检测输入文本
function validateSize()
{   
    handleBtn(false);
    if (getObj("txtTitle").value == "")
    {
        handleBtn(true);
        return alertMsg("标题不能为空。", getObj("txtTitle"));
    }
    if (getObj("txtStartDate").value == "")
    {
        handleBtn(true);
        return alertMsg("开始时间不能为空。", getObj("txtStartDate"));
    }
    if (getObj("txtEndDate").value == "")
    {
        handleBtn(true);
        return alertMsg("结束时间不能为空。", getObj("txtEndDate"));
    }
    var vStartTime = $("#txtStartDate").val();
    var vEndTime = $("#txtEndDate").val();    
    if (vStartTime != "" && vEndTime != "")
    {
        startDate1 = vStartTime.split("-");
        endDate1 = vEndTime.split("-");
        var date1 = new Date(startDate1[0], startDate1[1] - 1, startDate1[2]);
        var date2 = new Date(endDate1[0], endDate1[1] - 1, endDate1[2]);
    
        if (date1 > date2)
        {
            handleBtn(true);
            return alertMsg("结束时间必须大于开始时间。", getObj("txtEndDate"));
        }
    }
    
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}