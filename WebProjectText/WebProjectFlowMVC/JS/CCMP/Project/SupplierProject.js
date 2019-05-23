//模块名称 :设置中心-供应商管理设置
//模块编号 :
//文件名称 :项目认证评估S文件
//作者: 马吉龙
//日期: 2010-5-14 9:39:06

//生成项目配置信息链接的方法
 function renderLinkSet(cellvalue,options,rowobject)
 {
      var url = "'VSupplierProjectSet.aspx?ID="+rowobject[0]+"'";
      return '<a  href="javascript:window.openWindow('+url+',1024,768)">'+'设置'+'</a>' ;
 }
 //生成项目名称链接的方法
function renderLinkName(cellvalue,options,rowobject)
 {
    var url = "'VProjectBrowse.aspx?ProjectID="+rowobject[0]+"'";
      return '<a href="javascript:window.openWindow('+url+',600,700)">'+cellvalue+'</a>' ;
 }
 

var ddlProject_Change=function()
{
    var ProjectID=getObj("ddlProject").value;
    addParamsForJQGridQuery("jqGrid1",[{ProjectID:ProjectID}]);
    refreshJQGrid("jqGrid1");    
}