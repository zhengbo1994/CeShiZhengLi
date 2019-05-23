// 消息中心的工作名称 

// 提醒定义
var remindDefine =
{
    RemindName: "待办：",
    Caption: "待办提醒",
    NewsToolTip: "有新到消息",
    Unit: "项",
    DoName: "审核",
    LookName: "送阅",
    NoRemind: "无",
    NoWork: "无待办工作。"
};

// Work数组中的数组各项依次为：显示顺序、获取顺序、工作名称、审核数、送阅数、是否有新到消息、是否为审批、待办页索引,待办页地址
var remindWorks =
{
    Count: 0,
    Html: "",
    Width: 480,
    Height: 0,
    News: [],           // 有新到消息的工作的数组(数组元素为ModuleIndex+'-'+WorkIndex)
    BeWillShow: false,  // 有最新到消息，则将显示提醒
    PressDoCount: 0,
    RemindWork:
    [
        {
            RemindIndex: [0],
            Count: 0,
            Title: "工作预警",
            Work:
            [
                [0, 0, "预警处理方案", 0, 0, false, true, "BI/JobEarlyWarning/VEWWaitDo.aspx"],
                [1, 1, "成本超标预警", 0, 0, false, false, "BI/JobEarlyWarning/VMyJobEarlyWarning.aspx?Aim=1"],
                [2, 2, "采购计划预警", 0, 0, false, false, "BI/JobEarlyWarning/VMyJobEarlyWarning.aspx?Aim=2"],
                [3, 3, "计划进度预警", 0, 0, false, false, "BI/JobEarlyWarning/VMyJobEarlyWarning.aspx?Aim=3"],
                [4, 4, "工程质量预警", 0, 0, false, false, "BI/JobEarlyWarning/VMyJobEarlyWarning.aspx?Aim=4"],
                [5, 5, "工程安全预警", 0, 0, false, false, "BI/JobEarlyWarning/VMyJobEarlyWarning.aspx?Aim=5"],
                [7, 7, "投资管理预警", 0, 0, false, false, "BI/JobEarlyWarning/VMyJobEarlyWarning.aspx?Aim=7"],
                [8, 8, "设计任务预警", 0, 0, false, false, "BI/JobEarlyWarning/VMyJobEarlyWarning.aspx?Aim=8"],
                [9, 9, "发票认证抵扣", 0, 0, false, false, "BI/JobEarlyWarning/VMyJobEarlyWarning.aspx?Aim=9"]
            ]
        },
        {
            RemindIndex: [1],
            Count: 0,
            Title: "协同办公平台",
            Work:
            [
            //                [0, 0, "公司公文", 0, 0, false, true, "IDOA/CheckDoc/VWaitDoc.aspx?CheckDocType=0"],
                [0, 0, "公司公文", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_0"],
                [1, 1, "公司收文", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_1"],
                [2, 2, "个人请假", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_2"],
                [3, 3, "个人出差", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_3"],
                [4, 4, "档案借阅", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_4"],
                [5, 5, "档案发放", 0, 0, false, false, "Knowledge/CorpFile/VLendCorpFile.aspx"],
                [6, 6, "档案归还", 0, 0, false, false, "Knowledge/CorpFile/VReturnCorpFile.aspx"],
                [7, 7, "证章借用", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_7"],
                [8, 8, "证章发放/盖章", 0, 0, false, false, "IDOA/Cachet/VLendCachet.aspx"],
                [9, 9, "证章归还", 0, 0, false, false, "IDOA/Cachet/VReturnCachet.aspx"],
                [10, 10, "用品申购", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_10"],
                [11, 11, "用品购买", 0, 0, false, false, "IDOA/Consume/Purchase/VBuyConsume.aspx"],
                [12, 12, "用品入库", 0, 0, false, false, "IDOA/Consume/VConsumeInStock.aspx?From=HomePage"],
                [13, 13, "用品申领", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_13"],
                [14, 14, "用品发放", 0, 0, false, false, "IDOA/Consume/Apply/VLendApply.aspx"],
                [15, 15, "用品归还", 0, 0, false, false, "IDOA/Consume/Apply/VReturnConsume.aspx"],
                [16, 16, "营销用品调度", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_16"],
                [17, 17, "用品维护", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_17"],
                [18, 18, "用品维修", 0, 0, false, false, "IDOA/Consume/Maintenance/VMaintenanceProcess.aspx"],
                [19, 19, "公司制度", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_19"],
                [20, 20, "制度发布", 0, 0, false, false, "IDOA/Bylaw/VRegimePublish.aspx"],
                [21, 21, "会议室预订审核", 0, 0, false, false, "IDOA/BoardRoom/VBoardroomBookCheck.aspx"],
                [22, 22, "参与会议", 0, 0, false, false, "IDOA/BoardRoom/VWaitAttendMeeting.aspx"],
                [23, 23, "个人借款", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_23"],
               //[24, 24, "个人报销", 0, 0, false, true, "Common/Personal/VWaitAllWork_Reimburse.aspx?WaitModule=1_24"],  //汉京需求的待办报销(添加了报销金额一列) add by chenzy on 2014-04-24
                [24, 24, "个人报销", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_24"],
                [25, 25, "我的日程", 0, 0, false, false, "IDOA/MyWork/MySchedule/VMyScheduleSetting.aspx"],
                [26, 26, "红头发文", 0, 0, false, true, "IDOA/RedHead/VWaitRedHeadIssuedDocRequest.aspx"],
                [27, 27, "红头收文", 0, 0, false, true, "IDOA/RedHead/Receipt/VWaitRedHeadReceipt.aspx"],
                [28, 28, "红头待分发", 0, 0, false, false, "IDOA/RedHead/VWaitSendList.aspx"],
                [29, 29, "红头待收文", 0, 0, false, false, "IDOA/RedHead/VWaitDrawList.aspx"],
                [30, 30, "会议室预定调整", 0, 0, false, false, "IDOA/BoardRoom/VBoardroomBook.aspx?sCheckState=1"],
                [31, 31, "论坛发帖", 0, 0, false, false, "IDOA/EnCulture/BBS/VTopicCheck.aspx?From=Wait"],
                [32, 32, "论坛回复", 0, 0, false, false, "IDOA/EnCulture/BBS/VTopicRestoreCheck.aspx?From=Wait"],
                [33, 33, "车辆管理", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_33"],
                [35, 35, "信息报送", 0, 0, false, true, "IDOA/InformationSubmit/InfoSubmitManage/VWaitInformationSubmit.aspx"],
                [34, 34, "会议室管理Demo", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_34"],
                [68, 68, "员工转正", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_68"],
                [36, 36, "个人加班", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=1_36"]
//                [1, 1, "公司收文", 0, 0, false, false, "IDOA/CheckDoc/VWaitReceDoc.aspx"],
//                [2, 2, "个人请假", 0, 0, false, true, "IDOA/Leave/VWaitLeave.aspx"],
//                [3, 3, "个人出差", 0, 0, false, true, "IDOA/OutWork/VWaitOutWork.aspx"],
//                [4, 4, "档案借阅", 0, 0, false, true, "Knowledge/CorpFile/VWaitCorpFile.aspx"],
//                [5, 5, "档案发放", 0, 0, false, false, "Knowledge/CorpFile/VLendCorpFile.aspx"],
//                [6, 6, "档案归还", 0, 0, false, false, "Knowledge/CorpFile/VReturnCorpFile.aspx"],
//                [7, 7, "证章借用", 0, 0, false, true, "IDOA/Cachet/VCLoanCheck.aspx"],
//                [8, 8, "证章发放/盖章", 0, 0, false, false, "IDOA/Cachet/VLendCachet.aspx"],
//                [9, 9, "证章归还", 0, 0, false, false, "IDOA/Cachet/VReturnCachet.aspx"],
//                [10, 10, "用品申购", 0, 0, false, true, "IDOA/Consume/Purchase/VWaitPurchase.aspx"],
//                [11, 11, "用品购买", 0, 0, false, false, "IDOA/Consume/Purchase/VBuyConsume.aspx"],
//                [12, 12, "用品入库", 0, 0, false, false, "IDOA/Consume/VConsumeInStock.aspx?From=HomePage"],
//                [13, 13, "用品申领", 0, 0, false, true, "IDOA/Consume/Apply/VWaitApply.aspx"],
//                [14, 14, "用品发放", 0, 0, false, false, "IDOA/Consume/Apply/VLendApply.aspx"],
//                [15, 15, "用品归还", 0, 0, false, false, "IDOA/Consume/Apply/VReturnConsume.aspx"],
//                [16, 16, "营销用品调度", 0, 0, false, true, "IDOA/VenditionConsume/VWaitVendition.aspx"],
//                [17, 17, "用品维护", 0, 0, false, true, "IDOA/Consume/Maintenance/VMaintenanceCheck.aspx"],
//                [18, 18, "用品维修", 0, 0, false, false, "IDOA/Consume/Maintenance/VMaintenanceProcess.aspx"],
//                [19, 19, "公司制度", 0, 0, false, true, "IDOA/Bylaw/VWaitRegime.aspx#ShowLeave"],
//                [20, 20, "制度发布", 0, 0, false, false, "IDOA/Bylaw/VRegimePublish.aspx"],
//                [21, 21, "会议室预订审核", 0, 0, false, false, "IDOA/BoardRoom/VBoardroomBookCheck.aspx"],
//                [22, 22, "参与会议", 0, 0, false, false, "IDOA/BoardRoom/VWaitAttendMeeting.aspx"],
//                [23, 23, "个人借款", 0, 0, false, true, "IDOA/Loan/VWaitLoanRequest.aspx"],
//                [24, 24, "个人报销", 0, 0, false, true, "IDOA/Reimbursement/VWaitReimbursementRequest.aspx"],
//                [25, 25, "我的日程", 0, 0, false, false, "IDOA/MyWork/MySchedule/VMyScheduleSetting.aspx"],
//                [26, 26, "红头发文", 0, 0, false, true, "IDOA/RedHead/VWaitRedHeadIssuedDocRequest.aspx"],
//                [27, 27, "红头收文", 0, 0, false, true, "IDOA/RedHead/Receipt/VWaitRedHeadReceipt.aspx"],
//                [28, 28, "红头待分发", 0, 0, false, false, "IDOA/RedHead/VWaitSendList.aspx"],
//                [29, 29, "红头待收文", 0, 0, false, false, "IDOA/RedHead/VWaitDrawList.aspx"],
//                [30, 30, "会议室预定调整", 0, 0, false, false, "IDOA/BoardRoom/VBoardroomBook.aspx?sCheckState=1"]
            ]
        },
        {
            RemindIndex: [2],
            Count: 0,
            Title: "知识管理平台",
            Work:
            [
                [0, 0, "知识审核", 0, 0, false, false, "Knowledge/Archives/VWaitArchives.aspx?CheckType=1"],
                [1, 1, "知识附件授权", 0, 0, false, false, "Knowledge/Archives/VWaitArchives.aspx?CheckType=2"],
                [2, 2, "知识考核", 0, 0, false, false, "Knowledge/Archives/VArchivesExamingList.aspx"],
                [3, 3, "知识送阅", 0, 0, false, false, "Knowledge/Archives/VWaitLookArchives.aspx"]
            ]
        },
        {
            RemindIndex: [3],
            Count: 0,
            Title: "供应商管理平台",
            Work:
            [
                [0, 0, "入库认证评分", 0, 0, false, false, "Supplier/COSEvaluation/VEvaluationScore.aspx?EType=0"],
                [1, 1, "过程评估评分", 0, 0, false, false, "Supplier/COSEvaluation/VEvaluationScore.aspx?EType=1"],
                [2, 2, "履约评估评分", 0, 0, false, false, "Supplier/COSEvaluation/VEvaluationScore.aspx?EType=2"],
                [3, 3, "年度评估评分", 0, 0, false, false, "Supplier/COSEvaluation/VEvaluationScore.aspx?EType=3"],
                [4, 4, "专题评估评分", 0, 0, false, false, "Supplier/COSEvaluation/VEvaluationScore.aspx?EType=4"],
                [5, 5, "后评估评分", 0, 0, false, false, "Supplier/COSEvaluation/VEvaluationScore.aspx?EType=5"],
                [6, 6, "入库认证", 0, 0, false, true, "Supplier/COSEvaluation/VWaitEvaluation.aspx?EType=0"],
                [7, 7, "过程评估", 0, 0, false, true, "Supplier/COSEvaluation/VWaitEvaluation.aspx?EType=1"],
                [8, 8, "履约评估", 0, 0, false, true, "Supplier/COSEvaluation/VWaitEvaluation.aspx?EType=2"],
                [9, 9, "年度评估", 0, 0, false, true, "Supplier/COSEvaluation/VWaitEvaluation.aspx?EType=3"],
                [10, 10, "专题评估", 0, 0, false, true, "Supplier/COSEvaluation/VWaitEvaluation.aspx?EType=4"],
                [11, 11, "后评估", 0, 0, false, true, "Supplier/COSEvaluation/VWaitEvaluation.aspx?EType=5"],
                [12, 12, "绩效改进", 0, 0, false, false, "Supplier/COSEvaluation/VWaitAmeliorate.aspx?AState=0"],
                //[13, 13, "注册审核", 0, 0, false, false, "ZBidding/WebBidding/VExNewUserCheck.aspx"],
                [13, 13, "注册审核", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=3_13"],
                [14, 14, "资料修改审核", 0, 0, false, false, "ZBidding/WebBidding/VExFormalUserCheck.aspx"],
                [15, 15, "级别调整", 0, 0, false, true, "Supplier/CustomerOrSupplier/VWaitCOSLevelAdjust.aspx"],
                [16, 16, "绩效改进答复", 0, 0, false, false, "Supplier/COSEvaluation/VWaitAmeliorate.aspx?AState=1"],
                [17, 17, "绩效改进审核", 0, 0, false, false, "Supplier/COSEvaluation/VWaitAmeliorate.aspx?AState=2"],
                [18, 18, "重新绩效改进", 0, 0, false, false, "Supplier/COSEvaluation/VWaitAmeliorate.aspx?AState=4"],
                [20, 20, "投标单位推荐审核", 0, 0, false, false, "ZBidding/WebBidding/VSupplierRecommendCheck.aspx?WaitDo=1"]
            ]
        },
        {
            RemindIndex: [4],
            Count: 0,
            Title: "成本管理平台",
            Work:
            [
                [0, 0, "合同采购策划", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_0"],
                [1, 1, "目标成本定稿", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_1"],
                [2, 2, "目标成本变更", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_2"],
                [3, 3, "合同/合约", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_3"],
                [4, 4, "合同奖惩", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_4"],
                [5, 5, "其他变更", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_5"],
                [6, 6, "现场签证", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_6"],
                [7, 7, "工程进度", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_7"],
                [8, 8, "进度款审核", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_8"],
                [9, 9, "合同结算", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_9"],
                [10, 10, "付款申请", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_10"],
                [11, 11, "付款调配", 0, 0, false, false, "CCMP/Pay/VWaitPayPrepare.aspx"],
                [12, 12, "付款登记", 0, 0, false, false, "CCMP/Pay/VWaitPay.aspx"],
                [13, 13, "成本优化方案", 0, 0, false, true, "CCMP/CostOptimize/VPTFRWaitDo.aspx"],
                [14, 14, "待收发票", 0, 0, false, false, "CCMP/Pay/VWaitReceiveInvoice.aspx"],
                [15, 15, "简报阅读", 0, 0, false, false, "Common/Handler/VWaitBriefingLookList.aspx?Mod=CCM"],
                [16, 16, "资金收入", 0, 0, false, false, "CCMP/IncomeRequest/VWaitIncomeRequest.aspx"],
                [17, 17, "责任成本", 0, 0, false, false, "CCMP/DutyCostRequest/VWaitProjectDutyCostRequest.aspx"],
                [18, 18, "设计变更", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_18"],
                [19, 19, "合约规划模板", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_19"],
                [20, 20, "项目合约规划", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_20"],
                [21, 21, "zhanwei", 0, 0, false, true, ""],
                [22, 22, "造价信息", 0, 0, false, true, "CCMP/FabricaSystem/FabricaSystemCheck/VWaitFabricaSystemCheck.aspx"],
                [23, 23, "成本回顾", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_23"],
		        [24, 24, "合同修订", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_24"],
                [25, 25, "余量调剂", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_25"],
                [26, 26, "材料设备认价", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_26"],
                [27, 27, "zhanwei", 0, 0, false, true, ""],
                [28, 28, "zhanwei", 0, 0, false, true, ""],
                [29, 29, "zhanwei", 0, 0, false, true, ""],
                [30, 30, "部门月度资金计划", 0, 0, false, true, "CCMP/MonthFundPlan/Dept/VWaitMonthDeptPlanRequest.aspx"],
                [31, 31, "公司月度资金计划", 0, 0, false, true, "CCMP/MonthFundPlan/Company/VWaitMonthCompanyPlanRequest.aspx"],
                [32, 32, "资金计划变更", 0, 0, false, true, "CCMP/MonthFundPlan/PlanAdjust/VWaitPlanAdjustRequest.aspx"],
                [33, 33, "成本数据库", 0, 0, false, true, "/CCMP/CostLibrary/CostLibraryRequest/VWaitCostLibraryRequest.aspx"],
                [34, 34, "合同范本库", 0, 0, false, true, "/CCMP/ContractTemplate/ContractTemplateRequestInfo/VWaitContractTemplateRequest.aspx"],
                [35, 35, "目标成本借调", 0, 0, false, true, "/CCMP/CauseCost/CauseCostLoan/VWaitCauseCostLoanRequest.aspx"],
                [36, 36, "登记复核", 0, 0, false, false, "CCMP/Pay/VWaitPayReview.aspx"],
                [37, 37, "发票登记", 0, 0, false, false, "CCMP/Pay/Invoice/VWaitInvoice.aspx"],
                [100, 100, "资金测算", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_100"],
                [56, 56, "请假Test", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=4_56"]
            ]
        },
        {
            RemindIndex: [5],
            Count: 0,
            Title: "采购管理平台",
            Work:
            [
                [0, 0, "部门采购计划", 0, 0, false, true, "ZBidding/ProjectZBiddingPlan/VWaitProjectZBiddingPlan.aspx"],
                [1, 1, "项目采购计划", 0, 0, false, true, "ZBidding/ProjectZBiddingPlan/VWaitProjectZBPlan.aspx?Type=0"],
                [2, 2, "公司战略采购", 0, 0, false, true, "ZBidding/ProjectZBiddingPlan/VWaitProjectZBPlan.aspx?Type=3"],
                [3, 3, "年度集中采购", 0, 0, false, true, "ZBidding/ProjectZBiddingPlan/VWaitProjectZBPlan.aspx?Type=4"],
                [4, 4, "年度采购计划", 0, 0, false, true, "ZBidding/ProjectZBiddingPlan/VWaitProjectZBPlan.aspx?Type=1"],
                [5, 5, "月度采购计划", 0, 0, false, true, "ZBidding/ProjectZBiddingPlan/VWaitProjectZBPlan.aspx?Type=2"],
                //[6, 6, "单项采购立项", 0, 0, false, true, "ZBidding/ZBiddingPlan/VWaitZBiddingPlan.aspx"],
                [45, 45, "单项计划", 0, 0, false, true, "ZBidding/NewZBiddingPlan/VWaitZBiddingPlan.aspx"],
                [31, 31, "设计选型", 0, 0, false, true, "ZBidding/ZBiddingDesign/VWaitZBiddingDesign.aspx"],
                [7, 7, "招投标相关文档", 0, 0, false, true, "ZBidding/ZBFCheck/VWaitZBFCheck.aspx"],
                [8, 8, "标底预算", 0, 0, false, true, "ZBidding/EBudget/VWaitEBudget.aspx"],
                [9, 9, "招标文件", 0, 0, false, true, "ZBidding/ZBFile/VWaitZBiddingFile.aspx"],
                [10, 10, "推荐单位", 0, 0, false, false, "ZBidding/BiddingCommon/VBiddingCommon.aspx?From=HomePage"],
                [11, 11, "资格预审", 0, 0, false, true, "ZBidding/BiddingCommon/VWaitBiddingSupplier.aspx?CType=0"],
                [12, 12, "入围名单", 0, 0, false, true, "ZBidding/BiddingCommon/VWaitBiddingSupplier.aspx?CType=1"],
                [13, 13, "采购发标", 0, 0, false, true, "ZBidding/ZBiddingRequest/VWaitZBiddingRequest.aspx"],
                [14, 14, "回标设置", 0, 0, false, false, "ZBidding/ZBFile/VZBReFileList.aspx?WaitDo=1"], //回标 3版回标 
                [50, 50, "开标人员设置", 0, 0, false, false, "ZBidding/ZBFile/VStartBiddingStationSet.aspx?Wait=1"], //开标人员设置
                [17, 17, "开标设置", 0, 0, false, false, "ZBidding/ZBFile/VStartBiddingList.aspx?WaitDo=1"], //回标 4版开标（回标设置）
                [32, 32, "清标", 0, 0, false, false, "ZBidding/ZBiddingClear/VZBiddingClear.aspx?From=HomePage"],
                [15, 15, "投标文件分发", 0, 0, false, false, "ZBidding/ZBFile/VZBReFileDistribute.aspx?IsWaitWork=1"],
                [16, 16, "答复投标文件", 0, 0, false, false, "ZBidding/ZBFile/VWaitZBReFileDistribute.aspx"],
                [52, 52, "评标标准设置", 0, 0, false, false, "ZBidding/Score/NewScore/VWaitZBRSScore.aspx"],
                [18, 18, "评标打分", 0, 0, false, false, "ZBidding/Score/VWaitZBRSScore.aspx"],
                [48, 48, "最终报价", 0, 0, false, false, "ZBidding/FinalPriceRequest/VWaitFinalPriceRequest.aspx"],
                [49, 49, "议标策略", 0, 0, false, false, "ZBidding/NegotiationStrategyRequest/VWaitNegotiationStrategyRequest.aspx"],
                [19, 19, "采购定标", 0, 0, false, true, "ZBidding/ZBAndy/VWaitZBAndy.aspx"],
                [51, 51, "合同谈判", 0, 0, false, true, "ZBidding/ZBiddingContractNegotiation/VWaitZBiddingContractNegotiation.aspx"],
                [20, 20, "中标通知书分发", 0, 0, false, false, "ZBidding/ZBAndy/VWaitZBFinishMail.aspx"],
                [21, 21, "简报阅读", 0, 0, false, true, "Common/Handler/VWaitBriefingLookList.aspx?Mod=PBM"],
                [46, 46, "公司材料部品标准", 0, 0, false, true, "ZBidding/ProjectMaterialRequest/VWaitProjectMaterialRequest.aspx?Type=0"],

                [22, 22, "项目材料部品标准", 0, 0, false, true, "ZBidding/ProjectMaterialRequest/VWaitProjectMaterialRequest.aspx?Type=1"],

                [23, 23, "采购策划模版", 0, 0, false, true, "ZBidding/ZBiddingPlotTemplate/VWaitBiddingPlotTemplate.aspx"],
                [24, 24, "战略年度采购策划", 0, 0, false, true, "ZBidding/ZBiddingStatic/VWaitZBiddingStatic.aspx"],
                [25, 25, "战略年度采购计划", 0, 0, false, true, "ZBidding/StrategyZBidding/VWaitStrategyZBidding.aspx?ztype=1"],
                [26, 26, "项目采购总策划", 0, 0, false, true, "ZBidding/ProjectZBiddingPlot/VWaitProjectZBiddingPlot.aspx"],
                [27, 27, "项目采购总计划", 0, 0, false, true, "ZBidding/ZBiddingProjectPlanRequest/VWaitZBiddingProjectPlanRequest.aspx?PType=0"],
                [28, 28, "项目采购年度总计划", 0, 0, false, true, "ZBidding/ZBiddingProjectPlanRequest/VWaitZBiddingProjectPlanRequest.aspx?PType=1"],
                [29, 29, "项目采购月度总计划", 0, 0, false, true, "ZBidding/ZBiddingProjectPlanRequest/VWaitZBiddingProjectPlanRequest.aspx?PType=2"],
                [30, 30, "战略月度采购计划", 0, 0, false, true, "ZBidding/StrategyZBidding/VWaitStrategyZBidding.aspx?ztype=2"],


            //PBM-甲供材料
                [40, 40, "需求计划申请", 0, 0, false, true, "ZBidding/MaterialManage/DemandPlanningRequest/VWaitMaterialDemandPlanningRequest.aspx?RType=0"],
                [41, 41, "进场计划申请", 0, 0, false, true, "ZBidding/MaterialManage/DemandPlanningRequest/VWaitMaterialDemandPlanningRequest.aspx?RType=1"],
                [42, 42, "供货计划申请", 0, 0, false, true, "ZBidding/MaterialManage/SupplyPlanningRequest/VWaitMaterialSupplyPlanningRequest.aspx"],
                [43, 43, "入库验收", 0, 0, false, true, "ZBidding/MaterialManage/StorageCheck/VWaitStorageCheck.aspx"],
                [44, 44, "使用申请", 0, 0, false, true, "ZBidding/MaterialManage/UsingRequest/VWaitMaterialUsingRequest.aspx"],
                [47, 47, "待出库", 0, 0, false, false, "ZBidding/MaterialManage/OutStorageRegister/VOutStorageRegister.aspx?StorageState=0"]
            ]
        },
        {
            RemindIndex: [6, 7],
            Count: 0,
            Title: "运营管理平台",
            Work:
            [
            /*[0, 0, "集团管理计划编制", 0, 0, false, true, "POM/GroupBusinessManagedPlan/VWaitGroupBMPlan.aspx"],
            [1, 1, "集团管理计划执行", 0, 0, false, true, "POM/GroupBusinessManagedPlan/GBMPlanExecute/VWaitGBMPlanExecute.aspx?ExecuteType=0"],
            [2, 2, "集团管理计划检查", 0, 0, false, true, "POM/GroupBusinessManagedPlan/GBMPlanExecute/VWaitGBMPlanExecute.aspx?ExecuteType=1"],
            [3, 3, "集团经营与管理评估", 0, 0, false, true, "IDOA/CheckDoc/VWaitDoc.aspx?CheckDocType=2"],
            [4, 4, "公司管理计划编制", 0, 0, false, true, "POM/CorpBusinessManagedPlan/VWaitCorpBMPlan.aspx"],
            [5, 5, "公司管理计划执行", 0, 0, false, true, "POM/CorpBusinessManagedPlan/VWaitCBMPlanExecute.aspx?ExecuteType=0"],
            [6, 6, "公司管理计划检查", 0, 0, false, true, "POM/CorpBusinessManagedPlan/VWaitCBMPlanExecute.aspx?ExecuteType=1"],
            [7, 7, "公司经营与管理评估", 0, 0, false, true, "IDOA/CheckDoc/VWaitDoc.aspx?CheckDocType=3"],
            [8, 8, "运营目标书创建", 0, 0, false, true, "POM/POTargetBook/VWaitPOTBList.aspx"],
            [9, 9, "运营目标书执行", 0, 0, false, true, "POM/POTargetBook/VWaitPOTBProgress.aspx"],
            [10, 10, "运营目标书检查", 0, 0, false, true, "POM/POTargetBook/VWaitPOTBCheck.aspx"],
            [11, 11, "项目后评估", 0, 0, false, true, "IDOA/CheckDoc/VWaitDoc.aspx?CheckDocType=4"],
            [12, 12, "项目主项计划", 0, 0, false, true, "POM/Plan/ProjectPlan/VProjectPlanWaitCheck.aspx"],
            [13, 13, "项目年度主项计划", 0, 0, false, true, "POM/Plan/ProjectYearPlan/VProjectYearPlanWaitCheck.aspx"],
            [14, 14, "项目专项计划", 0, 0, false, true, "POM/Plan/SpecialPlan/VSpecialPlanWaitCheck.aspx"],
            [15, 15, "部门年度职能计划", 0, 0, false, true, "POM/Plan/FuncPlan/VDeptYearFunctionalPlanWaitCheck.aspx"],
            [16, 16, "部门月度工作计划", 0, 0, false, true, "POM/Plan/MonthPlan/VDeptMonthPlanWaitCheck.aspx"],
            [17, 17, "个人计划分解", 0, 0, false, true, "POM/Plan/DecompoundPlan/VDecompoundPlanWaitCheck.aspx"],
            [18, 18, "质量安全检查验收", 0, 0, false, true, "POM/Plan/QualitySecurityPlan/VQualitySecurityPlanWaitCheck.aspx"],
            [19, 19, "公司部门工作报告", 0, 0, false, true, "POM/WorkReport/VWaitWorkReport.aspx?CreateType=0"],
            [20, 20, "个人工作报告", 0, 0, false, true, "POM/WorkReport/VWaitWorkReport.aspx?CreateType=1"],
            [21, 21, "公司部门工作检查报告", 0, 0, false, true, "POM/WorkReport/VWaitWorkReport.aspx?CreateType=2"],
            [22, 22, "个人工作检查报告", 0, 0, false, true, "POM/WorkReport/VWaitWorkReport.aspx?CreateType=3"],
            [23, 23, "任务执行报告", 0, 0, false, true, "POM/Plan/TaskExecution/VWaitTaskExecReprotList.aspx"],
            [24, 24, "工程质量检查验收", 0, 0, false, false, "POM/MyWBS/MyWaitWork/VWaitQualityCheckOrAccept.aspx"],
            [25, 25, "工程安全检查验收", 0, 0, false, false, "POM/MyWBS/MyWaitWork/VWaitSecurityCheckOrAccept.aspx"],
            [26, 26, "工程质量", 0, 0, false, true, "POM/Quality/VWaitTaskQuality.aspx"],
            [27, 27, "工程安全", 0, 0, false, true, "POM/Security/VWaitTaskSecurity.aspx"],
            [28, 28, "项目竣工报告", 0, 0, false, true, "POM/PlanExecute/ProjectCompleteExecute/VMyProjectCompleteExecuteWait.aspx"],
            [29, 29, "任务启动", 0, 0, false, false, "POM/MyWBS/MyWaitWork/VWaitStartupWBS.aspx"],
            [30, 30, "任务执行报告填写", 0, 0, false, false, "POM/MyWBS/MyWaitWork/VWaitWriteWorkReport.aspx"],
            [31, 31, "竣工验收项启动", 0, 0, false, false, "POM/MyWBS/MyWaitWork/VWaitStartupCompeleteItem.aspx"],
            [32, 32, "竣工报告填写", 0, 0, false, false, "POM/MyWBS/MyWaitWork/VWaitWriteCompleteReport.aspx"],
            [33, 33, "简报阅读", 0, 0, false, false, "Common/Handler/VWaitBriefingLookList.aspx?Mod=POM"],
            [34, 34, "项目阶段性成果", 0, 0, false, true, "POM/ProjectHarvest/VProjectHarvestRequestWaitCheck.aspx"],
            [35, 35, "会议决策", 0, 0, false, true, "POM/MeetingDecision/VMeetingDecisionRequestWaitCheck.aspx"],
            [36, 36, "会议申请", 0, 0, false, false, "POM/MeetingDecision/MeetingExecute/VMyMeetingApply.aspx"],
            [37, 37, "会议纪要阅读", 0, 0, false, false, "POM/MeetingDecision/MeetingExecute/VMeetingSummaryWaitLookList.aspx"],
            [38, 38, "资金计划", 0, 0, false, true, "POM/ProjectData/ZTSettings/ProjectFundPlan/VProjectFundPlanRequestWaitCheck.aspx"],
            [39, 39, "项目年度考核指标", 0, 0, false, true, "POM/ProjectData/ZTSettings/ProjectCheck/VProjectCheckTargetRequestWaitCheck.aspx"],
            [40, 40, "上会资料提交", 0, 0, false, false, "POM/MeetingDecision/MeetingExecute/VMyMeetingData.aspx?WaitDo=1"],
            [41, 41, "会议纪要填写", 0, 0, false, false, "POM/MeetingDecision/MeetingExecute/VMyMeetingSummary.aspx?WaitDo=1"],
            [42, 42, "议题成果跟踪验证", 0, 0, false, false, "POM/MeetingDecision/MeetingExecute/VMyMeetingTopicTrack.aspx?WaitDo=1"],
            [43, 43, "会前回复", 0, 0, false, false, "POM/MeetingDecision/MeetingExecute/VMyMeetingReply.aspx?WaitDo=1"],
            [44, 44, "任务监督", 0, 0, false, false, "POM/MyWBS/VWaitSuperviseWBS.aspx"],
            [45, 45, "形象进度分区登记", 0, 0, false, false, "POM/MyWBS/MyWaitWork/VWaitSubarea.aspx"],
            [46, 46, "项目后评估", 0, 0, true, false, "POM/POTargetBook/TProjectPostAssessment/VWaitProjectAssess.aspx"],
            [47, 47, "进度风险评估", 0, 0, false, false, "POM/MyWBS/MyWaitWork/VWaitAssessProgressRisk.aspx"],
            [48, 48, "阶段成果启动", 0, 0, false, false, "POM/MyWBS/MyWaitWork/VWaitStartupProjectHarvest.aspx"],
            [49, 49, "质量安全检查验收启动", 0, 0, false, false, "POM/MyWBS/MyWaitWork/VWaitStartupPQS.aspx"],
            [50, 50, "任务进度检查阅读", 0, 0, false, false, "POM/MyWBS/MyWaitWork/VWaitLookProgressCheck.aspx"]
            */
                [0, 0, "集团管理计划编制", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_0"],
                [1, 1, "集团管理计划执行", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_1"],
                [2, 2, "集团管理计划检查", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_2"],
                [3, 3, "集团经营与管理评估", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_3"],
                [4, 4, "公司管理计划编制", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_4"],
                [5, 5, "公司管理计划执行", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_5"],
                [6, 6, "公司管理计划检查", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_6"],
                [7, 7, "公司经营与管理评估", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_7"],
                [8, 8, "运营目标书", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_8"],
                [9, 9, "运营目标书执行", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_9"],
                [10, 10, "运营目标书检查", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_10"],
                [11, 11, "项目后评估", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_11"],
                [12, 12, "项目主项计划", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_12"],
                [13, 13, "项目年度主项计划", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_13"],
                [14, 14, "项目专项计划", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_14"],
                [15, 15, "部门年度职能计划", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_15"],
                [16, 16, "部门月度工作计划", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_16"],
                [17, 17, "个人计划分解", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_17"],
                [18, 18, "质量安全检查验收", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_18"],
                [19, 19, "公司部门工作报告", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_19"],
                [20, 20, "个人工作报告", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_20"],
                [21, 21, "公司部门工作检查报告", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_21"],
                [22, 22, "个人工作检查报告", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_22"],
                //[23, 23, "任务执行报告", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_23"],
                [24, 24, "工程质量检查验收", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_24"],
                [25, 25, "工程安全检查验收", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_25"],
                [26, 26, "工程质量", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_26"],
                [27, 27, "工程安全", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_27"],
                [28, 28, "项目竣工报告", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_28"],
                [29, 29, "任务启动", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_29"],
                [30, 30, "任务执行报告", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_30"],
                [31, 31, "竣工验收项启动", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_31"],
                [32, 32, "竣工报告填写", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_32"],
                [33, 33, "简报阅读", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_33"],
                [34, 34, "项目阶段性成果", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_34"],
                [35, 35, "会议决策", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_35"],
                [36, 36, "会议申请", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_36"],
                [37, 37, "会议纪要阅读", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_37"],
                [38, 38, "资金计划", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_38"],
                [39, 39, "项目年度考核指标", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_39"],
                [40, 40, "上会资料提交", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_40"],
                [41, 41, "会议纪要填写", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_41"],
                [42, 42, "议题成果跟踪验证", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_42"],
                [43, 43, "会前回复", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_43"],
                [44, 44, "任务监督", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_44"],
                [45, 45, "形象进度分区登记", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_45"],
                [46, 46, "项目后评估", 0, 0, true, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_46"],
                [47, 47, "进度风险评估", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_47"],
                [48, 48, "阶段成果启动", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_48"],
                [49, 49, "质量安全检查验收启动", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_49"],
                [50, 50, "任务进度检查阅读", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_50"],
                [51, 51, "计划考核评分", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_51"],
                [52, 52, "运营报告", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_52"],
                [53, 53, "公司重点工作", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_53"],
                [54, 54, "任务执行周报", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_54"],
                [56, 56, "部门工作周报", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_56"],
                [57, 57, "会议纪要", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_57"],// 宏发需求：会议纪要审批
                [58, 58, "任务还原", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=6_58"]

            ]
        },
        {
            RemindIndex: [8],
            Count: 0,
            Title: "预算管理",
            Work:
            [
                [0, 0, "预算及资金计划评估和考核评分", 0, 0, false, false, "BM/BudgetAssessment/VAssessmentScore.aspx"],
                [1, 1, "预算及资金计划评估和考核", 0, 0, false, true, "BM/BudgetAssessment/VWaitAssessment.aspx"],
                [2, 2, "公司来往帐", 0, 0, false, true, "BM/Budget/VWaitCurrentAccountRequest.aspx"],
                [3, 3, "放款", 0, 0, false, false, "BM/Budget/VWaitPay.aspx"],
                [4, 4, "收款", 0, 0, false, false, "BM/Budget/VWaitAccept.aspx"],
                [5, 5, "二级项目预算编制", 0, 0, false, true, "BM/BudgetProject/VWaitBudgetProjectRequest.aspx?BRType=0"],
                [6, 6, "二级项目预算汇总", 0, 0, false, true, "BM/BudgetProject/VWaitBudgetProjectRequest.aspx?BRType=1"],
                [7, 7, "预算目标编制", 0, 0, false, true, "BM/Budget/VWaitBudgetRequest.aspx?BRType=3"],
                [8, 8, "预算目标汇总", 0, 0, false, true, "BM/Budget/VWaitBudgetRequest.aspx?BRType=4"],
                [9, 9, "年度预算编制", 0, 0, false, true, "BM/Budget/VWaitBudgetRequest.aspx?BRType=0"],
                [10, 10, "年度预算汇总", 0, 0, false, true, "BM/Budget/VWaitBudgetRequest.aspx?BRType=1"],
                [11, 11, "年度执行报告", 0, 0, false, true, "BM/Budget/VWaitBudgetRequest.aspx?BRType=2"],
                [12, 12, "月度资金计划编制", 0, 0, false, true, "BM/FundingPlansRequest/VWaitFundingPlansRequest.aspx?BRType=0"],
                [13, 13, "月度资金计划汇总", 0, 0, false, true, "BM/FundingPlansRequest/VWaitFundingPlansRequest.aspx?BRType=1"],
                [14, 14, "经营计划编制", 0, 0, false, true, "BM/BussinessPlan/VWaitBusinessFormguidePlaitRequest.aspx?BRType=5"],
                [15, 15, "经营计划汇总", 0, 0, false, true, "BM/BussinessPlan/VWaitBusinessFormguidePlaitRequest.aspx?BRType=6"],
                [16, 16, "经营计划执行", 0, 0, false, true, "BM/BussinessPlan/VWaitBusinessFormguidePlaitRequest.aspx?BRType=7"],
                [17, 17, "年度执行报告汇总", 0, 0, false, true, "BM/Budget/VWaitBudgetRequest.aspx?BRType=8"],
                [18, 18, "二级项目执行报告", 0, 0, false, true, "BM/BudgetProject/VWaitBudgetProjectRequest.aspx?BRType=2"],
                [19, 19, "二级项目执行报告汇总", 0, 0, false, true, "BM/BudgetProject/VWaitBudgetProjectRequest.aspx?BRType=8"],
                [20, 20, "财务决算编制", 0, 0, false, true, "/BM/FinacialSettlement/VWaitFinacialSettlement.aspx?BRType=0"],
                [21, 21, "财务决算汇总", 0, 0, false, true, "/BM/FinacialSettlement/VWaitFinacialSettlement.aspx?BRType=1"],
                [22, 22, "一级项目预算编制", 0, 0, false, true, "BM/BudgetProject/VWaitBudgetProjectRequest.aspx?BRType=3"],
                [23, 23, "一级项目预算汇总", 0, 0, false, true, "BM/BudgetProject/VWaitBudgetProjectRequest.aspx?BRType=4"],
                [24, 24, "一级项目执行报告", 0, 0, false, true, "BM/BudgetProject/VWaitBudgetProjectRequest.aspx?BRType=5"],
                [25, 25, "一级项目执行报告汇总", 0, 0, false, true, "BM/BudgetProject/VWaitBudgetProjectRequest.aspx?BRType=6"],
                [26, 26, "年度预算执行", 0, 0, false, true, "BM/Budget/VWaitBudgetRequest.aspx?BRType=9"],
                [27, 27, "年度预算执行汇总", 0, 0, false, true, "BM/Budget/VWaitBudgetRequest.aspx?BRType=A"],
                [28, 28, "二级项目预算执行", 0, 0, false, true, "BM/BudgetProject/VWaitBudgetProjectRequest.aspx?BRType=9"],
                [29, 29, "二级项目预算执行汇总", 0, 0, false, true, "BM/BudgetProject/VWaitBudgetProjectRequest.aspx?BRType=A"],
                [30, 30, "一级项目预算执行", 0, 0, false, true, "BM/BudgetProject/VWaitBudgetProjectRequest.aspx?BRType=B"],
                [31, 31, "一级项目预算执行汇总", 0, 0, false, true, "BM/BudgetProject/VWaitBudgetProjectRequest.aspx?BRType=C"]
            ]
        },
        {
            RemindIndex: [9],
            Count: 0,
            Title: "设计管理",
            Work:
            [
                [0, 0, "项目基础数据", 0, 0, false, true, "CCMP/DesignStandard/ProjectBaseDB/VWaitProjectBaseDB.aspx"],
                [1, 1, "项目产品标准", 0, 0, false, true, "CCMP/DesignStandard/MaterialStandard/VWaitMaterialStandard.aspx?DBType=1"],
                [2, 2, "材料部品标准", 0, 0, false, true, "CCMP/DesignStandard/MaterialStandard/VWaitMaterialStandard.aspx?DBType=2"]
            ]
        },
    /******************************************************************************************************/
        {
            RemindIndex: [10],
            Count: 0,
            Title: "CRM销售管理",
            Work:
                    [
                        [],//暂时处理CRM滑窗问题，肖勇彬，20140721 
                        [1, 1, "退房变更审批", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=10_1"],
                        [2, 2, "换房变更审批", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=10_2"],
                        [3, 3, "价格变更审批", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=10_3"],
                        [4, 4, "特批折扣变更审批", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=10_4"],
                        [5, 5, "权益人变更审批", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=10_5"],
                        [],
                        [7, 7, "价格方案审批", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=10_7"],
                        [8, 8, "任务审批", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=10_8"],
                        [9, 9, "穿底预警", 0, 0, false, true, "CRM/Sale/Sales/PenetrateLowcostWarning/VPenetrateLowcostWarning.aspx"],
                        [10, 10, "房源生成审核", 0, 0, false, true, "CRM/Sale/Project/BuildingCheck/VBuildingCheck.aspx"]
                    ]
        },
    //    {
    //    RemindIndex: [11],
    //    Count: 0,
    //    Title: "投资分析",
    //    Work:
    //        [
    //            [0, 0, "土地信息台帐", 0, 0, false, false, "IA/ProjectInfo/VLandInfoRegister.aspx?Waitdo=1"],
    //            [1, 1, "项目分配", 0, 0, false, false, "IA/ProjectInfo/VProjectDistribution.aspx"],
    //            [2, 2, "项目筛选", 0, 0, false, true, "IA/ProjectInfo/VWaitProjectCheckInfo.aspx"],
    //            [3, 3, "流程确定", 0, 0, false, true, "IA/ProjectInitiate/VWaitProjectInitiate.aspx"],
    //            [4, 4, "预可研-成立工作组", 0, 0, false, true, "IA/InvestmentAnalysisTeam/VWaitInvestmentAnalysisTeam.aspx?IAType=0"],
    //            [5, 5, "预可研-实地调研", 0, 0, false, true, "IA/FieldResearch/VWaitFieldResearch.aspx?IAType=0"],
    //            [6, 6, "预可研-报告起草", 0, 0, false, true, "IA/FeasibilityAnalysisDraft/VWaitFeasibilityAnalysisDraft.aspx?IAType=0"],
    //            [7, 7, "预可研-提供支持", 0, 0, false, true, "IA/IAFASupport/VWaitIAFASupport.aspx?IAType=0"],
    //            [8, 8, "预可研-报告确定", 0, 0, false, true, "IA/IAFeasibilityAnalysisConfirmation/VWaitIAFeasibilityAnalysisConfirmation.aspx?IAType=0"],
    //            [9, 9, "项目立项", 0, 0, false, true, "IDOA/CheckDoc/VWaitDoc.aspx?CheckDocType=5"],
    //            [10, 10, "可研-成立工作组", 0, 0, false, true, "IA/InvestmentAnalysisTeam/VWaitInvestmentAnalysisTeam.aspx?IAType=1"],
    //            [11, 11, "可研-实地调研", 0, 0, false, true, "IA/FieldResearch/VWaitFieldResearch.aspx?IAType=1"],
    //            [12, 12, "可研-报告起草", 0, 0, false, true, "IA/FeasibilityAnalysisDraft/VWaitFeasibilityAnalysisDraft.aspx?IAType=1"],
    //            [13, 13, "综合评审", 0, 0, false, true, "IA/IAFASupport/VWaitIAFASupport.aspx?IAType=1"],
    //            [14, 14, "可研-报告确定", 0, 0, false, true, "IA/IAFeasibilityAnalysisConfirmation/VWaitIAFeasibilityAnalysisConfirmation.aspx?IAType=1"],
    //            [15, 15, "商务谈判", 0, 0, false, true, "IA/BusinessNegotiation/VWaitBusinessNegotiation.aspx"],
    //            [16, 16, "投资协议确定", 0, 0, false, true, "IA/InvestmentAgreement/VWaitInvestmentAgreementConfirm.aspx"],
    //            [17, 17, "评价决策", 0, 0, false, true, "IA/InvestmentAnalysisDecision/VWaitInvestmentAnalysisDecision.aspx"],
    //            [18, 18, "月报信息", 0, 0, false, false, "IA/ProgressMonthReport/VProgressMonthReport.aspx?Waitdo=1"],
    //            [19, 19, "会议记录", 0, 0, false, true, "IA/Meeting/VMeetingSummary.aspx"]
    //        ]
    //},
    /***************************************************

    // CREM（商业地产）使用[12]
    // 其他新加的大模块依次使用13、14、15，然后再接着使用20、21、23、......

    ***************************************************/
        {
            RemindIndex: [16],
            Count: 0,
            Title: "绩效管理(银泰)",
            Work:
                [
                    [0, 0, "绩效目标书", 0, 0, false, true, "IDOA/PerformanceManagement/PerformanceAssessBook/VWaitPerformanceAssessBook.aspx"],
                    [1, 1, "绩效报批", 0, 0, false, true, "IDOA/PerformanceManagement/PerformanceApproval/VWaitPerformanceApproval.aspx"],
                    [2, 2, "绩效申诉", 0, 0, false, true, "IDOA/PerformanceComplain/VWaitPerformanceComplain.aspx"],
                    [3, 3, "考核自评", 0, 0, false, false, "IDOA/PerformanceManagement/PerformanceScore/VSelfAssessScoreScope.aspx"],
                    [4, 4, "组织考核", 0, 0, false, false, "IDOA/PerformanceManagement/PerformanceScore/VPerformanceScoreScope.aspx?StruType=D"],
                    [5, 5, "岗位考核", 0, 0, false, false, "IDOA/PerformanceManagement/PerformanceScore/VPerformanceScoreScope.aspx?StruType=S"]
                ]
        },
         {
             RemindIndex: [17],
             Count: 0,
             Title: "绩效管理",
             Work:
            [
                [0, 0, "绩效目标书", 0, 0, false, true, "HR/PM/PerformanceAssessBook/VWaitPerformanceAssessBook.aspx"],
                [1, 1, "绩效报批", 0, 0, false, true, "HR/PM/PerformanceApproval/VWaitPerformanceApproval.aspx"],
                [2, 2, "绩效申诉", 0, 0, false, true, "HR/PM/PerformanceComplain/VWaitPerformanceComplain.aspx"],
                [3, 3, "数据采集", 0, 0, false, false, "HR/PM/PerformanceExam/VDataAcquisition.aspx?HasDone=N"],
                [4, 4, "考核自评", 0, 0, false, false, "HR/PM/PerformanceExam/VSelfAssessScore.aspx"],
                [5, 5, "考核评分", 0, 0, false, false, "HR/PM/PerformanceExam/VPerformanceScore.aspx"]
            ]
         },
         //{
         //    RemindIndex: [18],
         //    Count: 0,
         //    Title: "投资管理",
         //    Work:
         //   [
         //       [0, 0, "决策文件", 0, 0, false, true, "CTSIM/ProjectFileManage/VWaitProjectFile.aspx?PType=0"],
         //       [1, 1, "实施过程文件", 0, 0, false, true, "CTSIM/ProjectFileManage/VWaitProjectFile.aspx?PType=1"],
         //       [2, 2, "投资后评价备案申报", 0, 0, false, true, "CTSIM/ProjectFileManage/VWaitProjectFile.aspx?PType=2"],
         //       [3, 3, "其他重要文件申报", 0, 0, false, true, "CTSIM/OtherFile/VWaitOtherFile.aspx"],
         //       [4, 4, "年度预算申报", 0, 0, false, true, "CTSIM/CapitalPayPlan/VWaitCapitalPayPlan.aspx"],
         //       [5, 5, "月度执行申报", 0, 0, false, true, "CTSIM/CapitalPayExecute/VWaitCapitalPayExecute.aspx"],
         //       [6, 6, "项目合同策划申报", 0, 0, false, true, "CTSIM/ProjectContractPlan/VWaitProjectContractPlan.aspx"],
         //       [7, 7, "季度招标计划编制申报", 0, 0, false, true, "CTSIM/BiddingPlanFormation/VWaitBiddingPlanFormation.aspx"],
         //       [8, 8, "季度招标计划执行申报", 0, 0, false, true, "CTSIM/BiddingPlanExecute/VWaitBiddingPlanExecute.aspx"],
         //       [9, 9, "投资决策备案申报", 0, 0, false, true, "CTSIM/ProjectInvestPlan/VWaitProjectInvestPlan.aspx"],
         //       [10, 10, "投资计划执行申报", 0, 0, false, true, "CTSIM/ProjectInvestPlanExecute/VWaitProjectInvestPlanExecute.aspx"],
         //       [11, 11, "年度预算汇总", 0, 0, false, true, "CTSIM/CapitalPlanSummary/VWaitCapitalPlanSummary.aspx"],
         //       [12, 12, "月度执行汇总", 0, 0, false, true, "CTSIM/CapitalExecSummary/VWaitCapitalExecSummary.aspx"]
         //   ]
         //},
         //{
         //    RemindIndex: [20],
         //    Count: 0,
         //    Title: "设计管理平台",
         //    Work:
         //            [
         //                [0, 0, "产品线发布", 0, 0, false, true, "Product/ProductLinePublish/VWaitProductLinePublish.aspx"],
         //                [1, 1, "产品单体发布", 0, 0, false, true, "Product/ProductMainInfoPublish/VWaitPublishList.aspx"],
         //                [2, 2, "技术准则发布", 0, 0, false, true, "Product/ProductTechnicalPublish/VWaitPublishList.aspx"],
         //                [12, 12, "项目设计任务", 0, 0, false, true, "Common/Personal/VWaitAllWork.aspx?WaitModule=20_12"],
         //                [29, 29, "任务启动", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=20_29"],
         //                [30, 30, "任务执行报告", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=20_30"],
         //                [44, 44, "任务监督", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=20_44"],
         //                [47, 47, "进度风险评估", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=20_47"],
         //                [50, 50, "任务进度检查阅读", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=20_50"]
         //            ]
         //},
         {
             RemindIndex: [19],
             Count: 0,
             Title: "意见阅读",
             Work:
            [
                [0, 0, "征询意见", 0, 0, false, false, "CheckFlow/Consultation/VMyCheckConsultation.aspx?State=2"],
                [1, 1, "征询回复意见", 0, 0, false, false, "CheckFlow/Consultation/VMyCheckSuggestion.aspx?State=0"],
                [2, 2, "转发意见", 0, 0, false, false, "CheckFlow/Consultation/VMyReceiveCheckDescrition.aspx?State=N"],
                [3, 3, "流程监控", 0, 0, false, false, "CheckFlow/ControlLine/VControlOperatorList.aspx?IsReminded=N"],
                [4, 4, "计划监控", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=19_4"]
            ]
         },
         //{
         //    RemindIndex: [21],
         //    Count: 0,
         //    Title: "经营监控",
         //    Work:
         //   [                
         //       [0, 0, "经营监控", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=21_0"]
         //   ]
         //},
         {
             //邮件放到最后，新增的请插到他前面
             RemindIndex: [100],
             Count: 0,
             Title: "邮件管理",
             Work:
            [
                [0, 0, "新邮件", 0, 0, false, false, "IDOA/IntraMail/VMailReceive.aspx?From=HomePage"]

            ]
         }
    ]
};
