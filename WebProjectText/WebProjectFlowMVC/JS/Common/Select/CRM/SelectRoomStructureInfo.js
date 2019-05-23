//功能：用于户型引入模块
//作者：常春侠
//日期：2013年6月13日14:23:57

function renderLink(cellvalue, options, rowobject) 
{
    var url = "'VKPIIndexBrowser.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',400, 450)">' + cellvalue + '</a>';
}

function reloadData() 
{
    var projID = $("#ddlProject").val();
    var key = $("#txtKey").val();

    var query = { "ProjectID": projID, "SearchKey": key };
    if (loadJQGrid("jqRoomInfo", query)) 
    {
        //addParamsForJQGridQuery("jqRoomInfo", [query]);
        refreshJQGrid("jqRoomInfo");
    }
}
//更改项目
function project_change() 
{
    reloadData();
}
//点击搜索按钮
function search_click() 
{
    reloadData();
}
//选择按钮事件
function chooseRoom() 
{
    var isMultiSelect = checkJQGridEnableMultiSel("jqRoomInfo");
    var projectID = $("#hidProjectID").val() //getJQGridSelectedRowsID("jqRoomInfo", isMultiSelect, "ProjectID");
    var roomID = getJQGridSelectedRowsID("jqRoomInfo", isMultiSelect, "RoomStructureGUID");
    var roomCode = getJQGridSelectedRowsData("jqRoomInfo", isMultiSelect, "RoomStructureCode");
   // alert("roomCode:" + stripHtml(roomCode) + "roomid:" + roomID); //return false;
    if (""==roomID)
    {
        return alertMsg("请选择户型！");
    }
    var returnRoomData = {};
   // var pIds = [];
    var roomIDs = [];
    var roomCodes = [];

    if (isMultiSelect) 
    {
        for (var i = 0; i < roomID.length; i++) 
        {
            if (roomID[i] != "") 
            {
                //pIds.push(stripHtml(projectID[i]));
                roomIDs.push(stripHtml(roomID[i]));
                roomCodes.push(stripHtml(roomCode[i]));
            }
        }
        returnRoomData = {
            ProjectID: stripHtml(projectID), //pIds.join(","),
            RoomID: roomIDs.join(","),
            RoomCode: roomCodes.join(",")
            };
    }
    else 
    {
        returnRoomData = {
         ProjectID:stripHtml(projectID),
         RoomID:stripHtml(roomID),
         RoomCode: stripHtml(roomCode)
        };
     }
 window.returnValue = returnRoomData;
 window.close();
}