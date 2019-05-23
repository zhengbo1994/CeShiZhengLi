// JScript 文件

//  -工作组明细（VGroupDetail.aspx）JqGrid中GroupName链接
function renderLink(cellvalue,options,rowobject)
{
    if(cellvalue!=null)
    {
         var url = "'../Group/VGroupDetail.aspx?GroupID="+rowobject[0]+"'";
        return '<div class="nowrap"><a href="javascript:window.openWindow('+url+',0,0)">'+cellvalue+'</a></div>' ;
    }
    else
    {
        return "&nbsp;";
    }       
}

//删除包含项目
function delAllowProject()
{
    openDeleteWindow("AllowProject", 1, "jqGrid1");
}

//添加企业岗位包含项目 
function addProject(stationID)
{
   if($('#hidStationID').val().length<=0)
      return;
   openAddWindow("../Group/VSelectAllProject.aspx?StationID="+$('#hidStationID').val()+"&aim=Station", 800, 600, "jqGrid1");
   //http://localhost:38261/IDWebSoft/OperAllow/Group/VSelectAllProject.aspx?StationID=962C093F-8C59-466A-84E1-E34EE449640F&aim=S&jqGridID=jqGrid1&JQID=jqGrid1
}