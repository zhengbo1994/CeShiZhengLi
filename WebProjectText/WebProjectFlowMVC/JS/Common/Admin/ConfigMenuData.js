var ConfigMenuList =
[
    { ID: "01", Name: "系统配置", ParentID: "00000", Url: "", Outline: "01",Level:1,IsLeaf:false,ShowTab:false},

    { ID: "01.01", Name: "基础设置", ParentID: "01", Url: "", Outline: "01.01", Level: 2, IsLeaf: false, ShowTab: false },
    { ID: "01.01.01", Name: "系统注册", ParentID: "01.01", Url: "VSystemInfo.aspx", Outline: "01.01.01", Level: 3, IsLeaf: true, ShowTab: false },

    { ID: "01.01.02", Name: "菜单功能", ParentID: "01.01", Url: "", Outline: "01.01.02", Level: 3, IsLeaf: false,ShowTab:true },
    { ID: "01.01.02.01", Name: "程序模块", ParentID: "01.01.02", Url: "Config/APModel/VAPModel.aspx", Outline: "01.01.02.01", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.01.02.02", Name: "模块权限", ParentID: "01.01.02", Url: "Config/ModOper/VAPModelIncOper.aspx", Outline: "01.01.02.02", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.01.02.03", Name: "模块文件", ParentID: "01.01.02", Url: "Config/ModFile/VModFile.aspx", Outline: "01.01.02.03", Level: 4, IsLeaf: true, ShowTab: false },

    { ID: "01.01.03", Name: "样式主题", ParentID: "01.01", Url: "", Outline: "01.01.03", Level: 3, IsLeaf: false, ShowTab: true },
    { ID: "01.01.03.01", Name: "主题配置", ParentID: "01.01.03", Url: "Config/ThemeConfig/VThemeStyle.aspx", Outline: "01.01.03.01", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.01.03.02", Name: "布局配置", ParentID: "01.01.03", Url: "Config/LayoutConfig/VWebLayout.aspx", Outline: "01.01.03.02", Level: 4, IsLeaf: true, ShowTab: false },
    //{ ID: "01.01.03.03", Name: "图标库", ParentID: "01.01.03", Url: "Config/IconLibrary/VWebIconLibrary.aspx", Outline: "01.01.03.03", Level: 4, IsLeaf: true, ShowTab: false },
    

    { ID: "01.02", Name: "应用设置", ParentID: "01", Url: "", Outline: "01.02", Level: 2, IsLeaf: false, ShowTab: false },
    { ID: "01.02.01", Name: "平台配置", ParentID: "01.02", Url: "", Outline: "01.02.01", Level: 3, IsLeaf: false, ShowTab: true },
    { ID: "01.02.01.01", Name: "系统配置", ParentID: "01.02.01", Url: "Config/SysConfig/VSysConfig.aspx", Outline: "01.02.01.01", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.02.01.02", Name: "信息模板", ParentID: "01.02.01", Url: "../Resources/Templates/MessageTemplatesEdit.aspx?SystemCode=SYS", Outline: "01.02.01.02", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.02.01.03", Name: "资源词条", ParentID: "01.02.01", Url: "../../Common/Resources/VResourceConfigurationSet.aspx?SystemCode=SYS", Outline: "01.02.01.03", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.02.01.04", Name: "填报系统", ParentID: "01.02.01", Url: "Config/FillConfig/VFillModuleList.aspx", Outline: "01.02.01.04", Level: 4, IsLeaf: true, ShowTab: false },
    //张韩  20150610 添加office控件注册
    { ID: "01.02.01.05", Name: "office控件注册", ParentID: "01.02.01", Url: "../../Common/Admin/Maintenance/VOfficeRegister.aspx", Outline: "01.02.01.05", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.02.01.06", Name: "批复结果设置", ParentID: "01.02.01", Url: "../../Common/Admin/Config/ReplyResult/VReplyResult.aspx?SystemCode=IDOA", Outline: "01.02.01.06", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.02.01.07", Name: "货币管理", ParentID: "01.02.01", Url: "../../Common/Admin/Config/Currency/VCurrency.aspx", Outline: "01.02.01.07", Level: 4, IsLeaf: true, ShowTab: false },
    
    //Loper 2018-01-02 添加系统水印配置  //目前水印配置只支持图片 修改菜单名称   duxue  2018-03-22
    { ID: "01.02.01.08", Name: "图片水印配置", ParentID: "01.02.01", Url: "../../Common/Admin/Config/WaterMark/VWaterMarkConfig.aspx", Outline: "01.02.01.08", Level: 4, IsLeaf: true, ShowTab: false },
    

    { ID: "01.02.02", Name: "安装配置", ParentID: "01.02", Url: "", Outline: "01.02.02", Level: 3, IsLeaf: false, ShowTab: true },
    //laix 20170831 添加数据库配置
    { ID: "01.02.02.01", Name: "系统安装配置", ParentID: "01.02.02", Url: "../../Common/Admin/Config/SysInstallConfig/VSysInstallConfig.aspx", Outline: "01.02.02.01", Level: 4, IsLeaf: true, ShowTab: false },
    //Loper 2018-01-23 添加系统水印配置
    { ID: "01.02.02.02", Name: "系统集成配置", ParentID: "01.02.02", Url: "../../Common/Admin/Config/IntegrateConfig/VIntegrateConfig.aspx", Outline: "01.02.02.02", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.02.02.03", Name: "移动程序配置", ParentID: "01.02.02", Url: "Config/APPConfig/VAPPConfigurationSet.aspx", Outline: "01.02.02.03", level: 4, IsLeaf: true, ShowTab: false },

    { ID: "01.02.03", Name: "移动应用", ParentID: "01.02", Url: "", Outline: "01.02.03", Level: 3, IsLeaf: false, ShowTab: true },
    { ID: "01.02.03.01", Name: "移动程序模块", ParentID: "01.02.03", Url: "Config/APModelForApp/VAPModel.aspx", Outline: "01.02.03.01", level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.02.03.02", Name: "移动程序权限", ParentID: "01.02.03", Url: "Config/ModOperForApp/VAPModelIncOper.aspx", Outline: "01.02.03.02", level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.02.03.03", Name: "微信程序模块", ParentID: "01.02.03", Url: "Config/APModelForWeChat/VAPModel.aspx", Outline: "01.02.03.03", level: 4, IsLeaf: true, ShowTab: false },
    
    //用户App版本信息统计 2017-07-04 dux
    { ID: "01.02.03.04", Name: "移动用户信息列表", ParentID: "01.02.03", Url: "Config/APPConfig/VUserAPPVersionList.aspx", Outline: "01.02.03.04", level: 4, IsLeaf: true, ShowTab: false },
    //APP授权关闭此配置选项卡  20150807 张韩
    //{ ID: "01.02.02.03", Name: "移动程序文件", ParentID: "01.02.02", Url: "Config/ModFileForApp/VModFile.aspx", Outline: "01.02.02.03", level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.02.04", Name: "协同办公", ParentID: "01.02", Url: "../../IDOA/Config/VOAConfigurationMain.aspx", Outline: "01.02.04", Level: 3, IsLeaf: true, ShowTab: false },
    { ID: "01.02.05", Name: "成本系统", ParentID: "01.02", Url: "../../CCMP/Configuration/VConfigurationMain.aspx", Outline: "01.02.05", Level: 3, IsLeaf: true, ShowTab: false },
    { ID: "01.02.06", Name: "采购系统", ParentID: "01.02", Url: "", Outline: "01.02.06", Level: 3, IsLeaf: false, ShowTab: true },
    { ID: "01.02.06.01", Name: "采购流程总模板(旧的)", ParentID: "01.02.06", Url: "../../ZBidding/ZBWorkFlow/VZBWorkFlow.aspx", Outline: "01.02.06.01", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.02.06.02", Name: "招标采购流程", ParentID: "01.02.06", Url: "../../ZBidding/ZBWorkFlow/VNewZBWorkFlow.aspx?ZBWFlowType=0", Outline: "01.02.06.02", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.02.06.03", Name: "战采协议流程", ParentID: "01.02.06", Url: "../../ZBidding/ZBWorkFlow/VNewZBWorkFlow.aspx?ZBWFlowType=1", Outline: "01.02.06.03", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.02.06.04", Name: "信息模板", ParentID: "01.02.06", Url: "../Resources/Templates/MessageTemplatesEdit.aspx?SystemCode=ZBidding", Outline: "01.02.06.04", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.02.07", Name: "运营系统", ParentID: "01.02", Url: "../../POM/Common/Config/VPOMConfig.aspx", Outline: "01.02.07", Level: 3, IsLeaf: true, ShowTab: false },
    //{ ID: "01.02.07", Name: "销售系统", ParentID: "01.02", Url: "", Outline: "01.02.07", Level: 3, IsLeaf: true, ShowTab: false },
    //{ ID: "01.02.08", Name: "预算系统", ParentID: "01.02", Url: "", Outline: "01.02.08", Level: 3, IsLeaf: true, ShowTab: false },
    //{ ID: "01.02.09", Name: "设计管理", ParentID: "01.02", Url: "../../Product/BaseSetting/Setting/VSysConfig.aspx", Outline: "01.02.09", Level: 3, IsLeaf: true, ShowTab: false },
    //谭伟铭--经营监控同步数据
    //{ ID: "01.02.10", Name: "经营监控", ParentID: "01.02", Url: "", Outline: "01.02.10", Level: 3, IsLeaf: false, ShowTab: true },
    //{ ID: "01.02.10.01", Name: "数据同步", ParentID: "01.02.10", Url: "../../BMM/Fill/VSynFillData.aspx?IDM_ID=616AABE1-CDB4-43D3-9C35-83CDD56C087E", Outline: "01.02.10.01", level: 4, IsLeaf: true, ShowTab: false },

    { ID: "01.03", Name: "流程配置", ParentID: "01", Url: "", Outline: "01.03", Level: 2, IsLeaf: false, ShowTab: false },
    { ID: "01.03.01", Name: "模块注册", ParentID: "01.03", Url: "", Outline: "01.03.01", Level: 3, IsLeaf: true, ShowTab: true },
    { ID: "01.03.01.01", Name: "审核模块", ParentID: "01.03.01", Url: "../../Common/Admin/Config/FlowModel/VFlowModel.aspx", Outline: "01.03.01.01", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.03.01.02", Name: "审核模块文件", ParentID: "01.03.01", Url: "../../Common/Admin/Config/FlowModel/VFlowModelFile.aspx", Outline: "01.03.01.02", Level: 4, IsLeaf: true, ShowTab: false },
    //{ ID: "01.03.02", Name: "表单设置", ParentID: "01.03", Url: "", Outline: "01.03.02", Level: 3, IsLeaf: true, ShowTab: false },
    { ID: "01.03.03", Name: "流程条件", ParentID: "01.03", Url: "../../CheckFlow/FlowForm/VFlowModelFilter.aspx", Outline: "01.03.03", Level: 3, IsLeaf: true, ShowTab: false },
    { ID: "01.03.04", Name: "流程编号", ParentID: "01.03", Url: "Config/NoColumn/VNoColumn.aspx", Outline: "01.03.04", Level: 3, IsLeaf: true, ShowTab: false },
    //{ ID: "01.03.05", Name: "转阅配置", ParentID: "01.03", Url: "../../Common/Admin/Config/SendLookConfig/VSendLookConfig.aspx", Outline: "01.03.05", Level: 3, IsLeaf: true, ShowTab: false },

    //{ ID: "01.04", Name: "消息中心", ParentID: "01", Url: "", Outline: "01.04", Level: 2, IsLeaf: false, ShowTab: false },
    //{ ID: "01.04.01", Name: "模块注册", ParentID: "01.04", Url: "", Outline: "01.04.01", Level: 3, IsLeaf: false, ShowTab: true },
    //{ ID: "01.04.01.01", Name: "消息模块", ParentID: "01.04.01", Url: "../../Common/MsgCenter/Configuration/VMsgModule.aspx", Outline: "01.04.01.01", Level: 4, IsLeaf: true, ShowTab: false },
    //{ ID: "01.04.01.02", Name: "消息类型", ParentID: "01.04.01", Url: "../../Common/MsgCenter/Configuration/VMsgType.aspx", Outline: "01.04.01.02", Level: 4, IsLeaf: true, ShowTab: false },
    

    { ID: "01.05", Name: "报表配置", ParentID: "01", Url: "", Outline: "01.05", Level: 2, IsLeaf: false, ShowTab: false },
    { ID: "01.05.01", Name: "门户配置", ParentID: "01.05", Url: "", Outline: "01.05.01", Level: 3, IsLeaf: false, ShowTab: true },
    { ID: "01.05.01.01", Name: "门户分类", ParentID: "01.05.01", Url: "Config/PortalBlock/VPortalBlockType.aspx", Outline: "01.05.01.01", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.05.01.02", Name: "门户注册", ParentID: "01.05.01", Url: "Config/PortalBlock/VPortalBlock.aspx", Outline: "01.05.01.02", Level: 4, IsLeaf: true, ShowTab: false },

    { ID: "01.05.02", Name: "报表配置", ParentID: "01.05", Url: "", Outline: "01.05.02", Level: 3, IsLeaf: false, ShowTab: true },
    { ID: "01.05.02.01", Name: "简报配置", ParentID: "01.05.02", Url: "Config/BriefingConfig/VBriefingConfig.aspx", Outline: "01.05.02.01", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.05.02.02", Name: "报表注册", ParentID: "01.05.02", Url: "Config/ReportConfig/VReportManage.aspx", Outline: "01.05.02.02", Level: 4, IsLeaf: true, ShowTab: false },

    { ID: "01.05.03", Name: "动态列表", ParentID: "01.05", Url: "", Outline: "01.05.03", Level: 3, IsLeaf: false, ShowTab: true },
    { ID: "01.05.03.01", Name: "普通列表", ParentID: "01.05.03", Url: "../../Common/CustomPage/Configuration/VCustomPageList.aspx?PageType=1", Outline: "01.05.03.01", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.05.03.04", Name: "报表列表", ParentID: "01.05.03", Url: "../../Common/CustomPage/Configuration/VCustomPageList.aspx?PageType=2", Outline: "01.05.03.04", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.05.03.02", Name: "待办列表", ParentID: "01.05.03", Url: "../../Common/CustomPage/Configuration/VCustomPageList.aspx?PageType=3", Outline: "01.05.03.02", Level: 4, IsLeaf: true, ShowTab: false },
    { ID: "01.05.03.03", Name: "已办列表", ParentID: "01.05.03", Url: "../../Common/CustomPage/Configuration/VCustomPageList.aspx?PageType=4", Outline: "01.05.03.03", Level: 4, IsLeaf: true, ShowTab: false },

    //{ ID: "01.06", Name: "集成配置", ParentID: "01", Url: "", Outline: "01.06", Level: 2, IsLeaf: false, ShowTab: false },
    //{ ID: "01.06.01", Name: "接口注册", ParentID: "01.06", Url: "", Outline: "01.06.01", Level: 3, IsLeaf: true, ShowTab: false },


    { ID: "02", Name: "维护管理", ParentID: "00000", Url: "", Outline: "02", Level: 1, IsLeaf: false, ShowTab: false },

    { ID: "02.01", Name: "日志查询", ParentID: "02", Url: "", Outline: "02.01", Level: 2, IsLeaf: false, ShowTab: false },
    { ID: "02.01.01", Name: "登录日志", ParentID: "02.01", Url: "Maintenance/VUserLoginLog.aspx", Outline: "02.01.01", Level: 3, IsLeaf: true, ShowTab: false },
    { ID: "02.01.02", Name: "操作日志", ParentID: "02.01", Url: "Maintenance/VSysOperationLog.aspx", Outline: "02.01.02", Level: 3, IsLeaf: true, ShowTab: false },
    { ID: "02.01.03", Name: "模块访问", ParentID: "02.01", Url: "Maintenance/VModAccessLog.aspx", Outline: "02.01.03", Level: 3, IsLeaf: true, ShowTab: false },
    { ID: "02.01.04", Name: "系统异常", ParentID: "02.01", Url: "Maintenance/VSysExceptionLog.aspx", Outline: "02.01.04", Level: 3, IsLeaf: true, ShowTab: false },
    { ID: "02.01.05", Name: "SQL异常", ParentID: "02.01", Url: "Maintenance/VSqlExceptionLog.aspx", Outline: "02.01.05", Level: 3, IsLeaf: true, ShowTab: false },
    
    { ID: "02.02", Name: "维护操作", ParentID: "02", Url: "", Outline: "02.02", Level: 2, IsLeaf: false, ShowTab: false },
    { ID: "02.02.01", Name: "用户切换", ParentID: "02.02", Url: "Maintenance/VChangeLoginUser.aspx", Outline: "02.02.01", Level: 3, IsLeaf: true, ShowTab: false },
    { ID: "02.02.02", Name: "SQL执行", ParentID: "02.02", Url: "Maintenance/VExecuteSQL.aspx", Outline: "02.02.02", Level: 3, IsLeaf: true, ShowTab: false },
    { ID: "02.02.03", Name: "页面修改", ParentID: "02.02", Url: "Maintenance/VPageEdit.aspx", Outline: "02.02.03", Level: 3, IsLeaf: true, ShowTab: false }
];