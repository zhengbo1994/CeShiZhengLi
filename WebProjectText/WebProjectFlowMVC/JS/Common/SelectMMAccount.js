/*
   单人员选择支持文件
   注意：调用窗口需要以打开模式窗口的形式打开人员选择。
*/     
 
    //重新加载jqGrid 
    function reloadData()
    {
       $('#jqgEmployee').trigger('reloadGrid');
    }  
    
    //人员在职状态发生改变后
    function ddlState_Change()
    {
            btnSearch_Click();
    }
    
    function ChangeChild()
    {
        btnSearch_Click();
    }
    
    //提交人员查询
    function btnSearch_Click()
    {
        if(trim($('#txtKey').val()).length>0)
        {
            $('#trLeft').hide();
        }
        else
        {
            $('#trLeft').show();
        }
        //step1: 获取CorpID
        var struID=$('#hidStruID',window.frames("frmLeft").document).val();
        $('#jqgEmployee',window.frames("frmMain").document).getGridParam('postData').CorpID=struID;    
        //step2: 获取在职状态
        var state=$('#ddlState').val();
        $('#jqgEmployee',window.frames("frmMain").document).getGridParam('postData').State=state;    
        //step2: 获取关键词
        var keyword=$('#txtKey').val();
        $('#jqgEmployee',window.frames("frmMain").document).getGridParam('postData').KeyValue=keyword;  
        var child = $('#ddlChild').val(); 
        $('#jqgEmployee',window.frames("frmMain").document).getGridParam('postData').Child=child;  
        window.frames("frmMain").window.reloadData();        
    }
    
   
    function btnAdd_Click()
    {
        var vEmployeeID = window.frames('frmMain').getJQGridSelectedRowsData('jqgEmployee',false,'AccountID').join();
        var vEmployeeName = window.frames('frmMain').getJQGridSelectedRowsData('jqgEmployee', false, 'TAccount__EmployeeName').join();
        var vAccountName = window.frames('frmMain').getJQGridSelectedRowsData('jqgEmployee', false, 'TAccount__AccountName').join();
        if (vEmployeeID==null)
        {
            return alertMsg("请选择人员。", getObj("btnAdd"));    
        }
        window.returnValue = { ID: vEmployeeID, Name: stripHtml(vEmployeeName), AccountName: stripHtml(vAccountName) };
        
        window.close();
       
    }
    
  
 
    
   

