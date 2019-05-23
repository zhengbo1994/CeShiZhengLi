// JScript 文件

    function reloadData()
    {
        var query = {ModID:ddlMod.value, IsEnable:getObj("ddlIsEnable").value, KW:getObj("txtKW").value};
    
        addParamsForJQGridQuery("jqReport", [query]);
        refreshJQGrid("jqReport");
    }
    
    function showColumns()
    {
        var reportID = getJQGridSelectedRowsData('jqReport',true,'SelfID');
        if(reportID == "")
        {
             alert("没有任何数据可供操作。");
             return;
        }
        if(reportID.length != 1)
        {
            alert("一次只能操作一条记录。");
             return;
        }
        openWindow("VReportColumns.aspx?ReportID=" + reportID,500,400);
    }
    
    function Add()
    {
        openAddWindow("VReportManageAdd.aspx", 560, 300, "jqReport");
    }

    function Edit()
    {
        openModifyWindow("VReportManageEdit.aspx", 560, 300, "jqReport")
    }

    function Del()
    {
        openDeleteWindow("ReportManage", 1, "jqReport");
    }
    
    function validateSize()
    {
        handleBtn(false);
        
        if (getObj("txtModName").value == "")
        {
            handleBtn(true);
            return alertMsg("请选择一个模块。", getObj("txtModName"));
        }
        
        if (getObj("txtReportName").value == "")
        {
            handleBtn(true);
            return alertMsg("报表名称不能为空。", getObj("txtReportName"));
        }
        
        if (getObj("txtUrl").value == "")
        {
            handleBtn(true);
            return alertMsg("报表路径不能为空。", getObj("txtUrl"));
        }
        
        var reg = /^[1-9][0-9]{0,8}$/;
        if (!reg.test(getObj("txtRowNo").value)) 
        {
            handleBtn(true);
            return alertMsg('行号应该为正整数。', getObj("txtRowNo"));
        }
        return true;
    }
    
    function handleBtn(enabled)
    {
        setBtnEnabled(getObj("btnSaveOpen"), enabled);
        setBtnEnabled(getObj("btnSaveClose"), enabled);
    }
    
    function selectMod()
    {
        openWindow('VSelectSingleMod.aspx?Aim=QuickRoad', 450, 600);
    }
    
    