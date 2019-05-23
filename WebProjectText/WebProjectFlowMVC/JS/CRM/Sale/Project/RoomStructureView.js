//功能：应用于户型设置中的户型一览页面
//作者：常春侠
//时间：2013-6-20 14:50:34

function reloadData() {
    var projID = $("#ddlProjectName").val();
    var key = $("#txtKey").val();

    var query = { ProjectID: projID, Key: key };
    reloadGridData("pager",query);
}

function btnBack_Click() {
    window.location.href = "VRoomStructureSet.aspx";
}
//点击户型编码 查看详细信息
function seeRoomStructureInfo(id) {
    var projID = $("#ddlProjectName").val();
    var url = 'VRoomStructureAdd.aspx?ID=' + id + '&projectID=' + projID + '';
    openAddWindow(url, 800, 600);
   // return url;
}
//给图片加载动画
//$(function () {
//    var x = 5, y = 10;
//    /* $("table tr td ").children("#imgRoomStructure").mouseover(function (e) {
//    $("#imgTip").attr("src", this.src)
//    .css({ "top": (e.pageY + y) + "px", "left": (e.pageX + x) + "px" })
//    .show(3000);

//    })
//    $("table tr td").children("#imgRoomStructure").mouseout(function (e) {
//    $("#imgTip").hide();
//    })*/
//    $("table tr td").children("#imgRoomStructure").attr("onclick", function () { alert(this.id) });

//})
function zoomIn(f) {
    var x = 15, y = 2;
    var objw = $(window);
    var objImage = $("#imgTip");
    objImage.attr("src", f.src);
   // alert(objImage.width);
    var left =objw.scrollLeft()+ objw.width()/5;
    var top = objw.scrollTop() + objw.height()/ 6;
    objImage.css({ "top": top + "px", "left":left+ "px" })
    objImage.show();
    //alert($("#imgTip").attr("src"));
    //alert(window.event.y);
}
function zoomDispear() {
    $("#imgTip").hide();
}