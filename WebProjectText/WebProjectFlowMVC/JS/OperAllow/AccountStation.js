// JScript 文件

//***********************************//
//作者：王勇
//时间：2010-05-01
//描述：与帐号管理中的设置岗位相关的JS操作
//***********************************//

//查看岗位信息
var ViewStation=function(stationID)
{
    openWindow("../Station/VStationBrowse.aspx?StationID="+stationID,600,450);
}

//新增岗位
var addStation=function()
{
    var accountID=$("#hdAccountID").val();
    var accountName=$("#hdAccountName").val();
    var width = screen.availWidth - 10;
    var height = screen.availHeight - 50;
    openModalWindow("VAccountStation.aspx?AccountID="+accountID+"&AccountName="+accountName,width,height);
}

//删除该帐号的岗位
var deleteStation=function()
{
    openDeleteWindow("AccountStation",0,"jqGrid1");
}

//设置指定岗位为默认岗位
var setDefaultStation=function(stationID)
{
    $.ajax({
        type:"POST",
        url:"VAccountStationSet.aspx?action=1&&stationID="+stationID,
        data:"{'strStationID':'"+stationID+"'}",
        contentType: "application/json; charset=utf-8",
        dataType:"josn",
        success:function(msg) 
        {
            refreshJQGrid('jqGrid1');
        }
    });
}

//呈现列的修改------Start

//给岗位名称加上连接，方便查看详细信息
var SetStation=function(value,opt,record)
{
    return "<div class='nowrap'><a href=javascript:ViewStation(\'"+record[0]+"\')>"+value+"</a></div>";
}

//设为默认列
var SetDefault=function(value,opt,record)
{
    if(value=="True")
    {
        return "<span style='color:#cccc'>[默认]</span>";
    }
    else
    {
        return "<div class='nowrap'><a href=javascript:setDefaultStation('"+record[0]+"')>设为默认</a>";
    }
}
//--------------------End

