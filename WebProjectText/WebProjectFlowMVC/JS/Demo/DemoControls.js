
function showTab(obj) {
    var index = $(obj).parent("li").index();
    selectTab(index, "TabInfo");
    for (var i = 0; i < 2; i++) {
        $("#div" + i).css("display","none");
    }
    $("#div" + index).css("display", "block");

}

function switchVisible(tr) {
    $(tr).toggle();

}

//function CheckSubmit() {

//}

//格式化列
function CellFormatter(cellvalue, options, rowobject) {
    return "<a  href='#'>" + cellvalue + "</a>";
}

function LoadRpt() {
    ajax("DemoControls.aspx", {}, "json", function (data) {
        //$("#RptEmploy").data();

    });
}

