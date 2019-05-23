// JScript 文件
function reloadData()
{
    var jqObj = $('#jqSelectRoomSet');
    jqObj.getGridParam('postData').ProjectGUID = $("#ddlProjectName").val();
    jqObj.getGridParam('postData').ProjectName = $("#txtSearch").val();
    refreshJQGrid("jqSelectRoomSet");
}

// 添加
function addSelectRoomSet()
{
    var projID = $("#ddlProjectName").val();
    var projName = $( "#ddlProjectName" ).find( "option:selected" ).text();
    projName = encodeURI(projName);   //url编码
    if (projID != null && projID.length == 36)
    {
        openAddWindow("VSelectRoomSetAdd.aspx?projID=" + projID + "&projName=" + projName, 800, 600);
    } else
    {
        alert('请选择公司下的项目！');
    }
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("SelectRoomSet", 7, "jqSelectRoomSet");
}

// SearchKeyDown事件
function SearchKeyDown()
{
    if (window.event.keyCode == 13)
    {
        reloadData();
    }
}

function renderLink(cellvalue, options, rowobject)
{
    var projID = $("#ddlProjectName").val();
    var projName = $("#ddlProjectName option:selected").text();
    projName = encodeURI( projName );   //url编码

    if (projID != null && projID.length == 36)
    {
        var url = '<a target="_blank" href=VSelectRoomSetAdd.aspx?ID=' + rowobject[0] + '&projID=' + projID + '&projName=' + projName + '>' + cellvalue + '</a>';
        return url;
    }
}

// 修改
function editSelectRoomSet()
{
    var projName = encodeURI( $( "#ddlProjectName option:selected" ).text() );   //url编码

    openModifyWindow( "VSelectRoomSetAdd.aspx?projID=" + $( '#ddlProjectName' ).val() + "&projName=" + projName, 800, 600, "jqSelectRoomSet" );
}