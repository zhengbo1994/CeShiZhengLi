/*-workname.js的补展，用于动态更新js内容，升级覆盖需谨慎-*/

//经营监控待办，根据填报类别启用流程时在Work中自动添加一条记录
var bmmRemindWork = {
    RemindIndex: [21],
    Count: 0,
    Title: "经营监控",
    Work:
    [               
        [0, 0, "经营监控", 0, 0, false, false, "Common/Personal/VWaitAllWork.aspx?WaitModule=21_0"]
    ]
}

//将经营监控部分待办插进待办项中
if (remindWorks != null && remindWorks.RemindWork != null)
{
    remindWorks.RemindWork.splice(0, 0, bmmRemindWork);//remindWorks.RemindWork.length-2
}

