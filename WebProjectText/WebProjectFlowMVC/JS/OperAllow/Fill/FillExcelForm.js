//填报控制器
var FillController = (function ()
{
    function FillController(options) {
        this.FillExcelForm = null;
        this.Server="";
        this.UserName = "";
        this.Pwd = "";
        this.DomainFlag = false;
        this.LoginFlag = false;
        if (options){
            if (options.FillExcelForm){
                this.FillExcelForm = options.FillExcelForm;
            }
            if(options.UserName){
                this.UserName = options.UserName;
            }
            if(options.Pwd){
                this.Pwd = options.Pwd;
            }
            if(options.Server){
                this.Server = options.Server;
            }
        }
    };

    //填报新记录（可以将参数直接显示在采集工具中)
    //e.g OpenNewExcelCOM("计划任务书基础信息","基础信息='2'")
    FillController.prototype.OpenNewExcelCOM = function (templateName, conditions)
    {
        this.Logout();
        this.Login();
        if (this.LoginFlag)
        {
            this.FillExcelForm.InputRepDataAtNewExcelCOM(templateName, conditions);
        }
    }


    //填报新记录
    //e.g. OpenNewExcel("项目计划任务书");
    FillController.prototype.OpenNewExcel=function(templateName)
    {
        this.Logout();
        this.Login();
        if (this.LoginFlag) {
            this.FillExcelForm.InputRepDataAtNewExcel(templateName);
        }
    }
    //修改填报记录 
    //e.g OpenEditExcel("计划任务书基础信息", "基础信息='2'");
    FillController.prototype.OpenEditExcel=function(templateName, conditions)
    {
        this.Logout();
        this.Login();
        if (this.LoginFlag) {
            this.FillExcelForm.OpenRepWithDataAtNewExcel(templateName, conditions, 2);
        }
    }
    //查阅填报记录
    //e.g OpenBrowseExcel("计划任务书基础信息", "基础信息='2'");
    FillController.prototype.OpenBrowseExcel=function(templateName, conditions)
    {
        this.Logout();
        this.Login();
        if (this.LoginFlag) {
            this.FillExcelForm.OpenRepWithDataAtNewExcel(templateName, conditions, 1);
        }
    }
    //隐藏控件
    FillController.prototype.Hide=function(flag)
    {
        this.FillExcelForm.SetUnVisible(flag);
    }
    //登录
    FillController.prototype.Login=function()
    {
        if (!this.LoginFlag) {
            this.FillExcelForm.SetIPPort(this.Server); 
            if (this.FillExcelForm.AutoLogin(this.UserName, this.Pwd, this.DomainFlag)) {
                this.LoginFlag = true;
            }
        }
    }
    //登出
    FillController.prototype.Logout=function()
    {
        this.FillExcelForm.SetIPPort(this.Server);
        this.FillExcelForm.Logout();
        this.LoginFlag = false;
    }
    return FillController;
})();
