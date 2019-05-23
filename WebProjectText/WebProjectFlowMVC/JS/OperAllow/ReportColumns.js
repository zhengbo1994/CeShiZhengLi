// JScript 文件

    function btnAdd_onclick()
    {
        openAddWindow("VReportColumnsAdd.aspx?ReportID=" + getObj("hidReportID").value, 400, 200, "jqReportColumns");
    }
    
    function btnEdit_onclick()
    {
        openModifyWindow("VReportColumnsEdit.aspx", 400, 200, "jqReportColumns")
    }
    
    function btnDelete_onclick(jqGridID)
    {
        openDeleteWindow("ReportColumns", 1, "jqReportColumns");
    }
    
        function validateSize()
    {
        handleBtn(false);
        if (getObj("txtColName").value == "")
        {
            handleBtn(true);
            return alertMsg("字段名不能为空。", getObj("txtColName"));
        }
        if (getObj("txtRowNo").value == "")
        {
            handleBtn(true);
            return alertMsg("编号不能为空。", getObj("txtRowNo"));
        }
        var reg = /^[1-9][0-9]{0,8}$/;
        if (!reg.test(getObj("txtRowNo").value)) 
        {
            handleBtn(true);
            return alertMsg('行号应为正整数。', getObj("txtRowNo"));
        }
        return true;
    }
    
    function handleBtn(enabled)
    {
        setBtnEnabled(getObj("btnSaveOpen"), enabled);
        setBtnEnabled(getObj("btnSaveClose"), enabled);
    }