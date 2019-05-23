$(function () {
    //总数据数量
    var tatolCount = 0;
    //当前页数
    var intThisPage = parseInt(1);

    //获取分页信息
    var getpage = function (tatolCount, intThisPage) {
        var intCount = tatolCount; //总记录数
        var intPageSize = 10; //每页显示
        var intPageCount = intCount % intPageSize == 0 ? parseInt(intCount / intPageSize) : parseInt(intCount / intPageSize) + 1; //总共页数
        var intPage = 7; //数字显示
        var intBeginPage = 0; //开始页数
        var intCrossPage = 0; //变换页数
        var intEndPage = 0; //结束页数
        var strPage = ""; //返回值

        intCrossPage = parseInt(intPage / 2);
        strPage = "共 <font color=\"#056dae\">" + intCount + "</font> 条记录 第 <font color=\"#056dae\">" + intThisPage + "/" + intPageCount + "</font> 页 每页 <font color=\"#056dae\">" + intPageSize + "</font> 条 &nbsp;&nbsp;&nbsp;&nbsp;";
        if (intThisPage > 1) {
            strPage = strPage + "<a href=\"#\" style=\"margin-left: 4px; margin-right: 4px;\" onClick=\"getpage(" + (tatolCount) + "," + (1) + ")\">首页</a> ";
            strPage = strPage + "<a href=\"#\" style=\"margin-left: 4px; margin-right: 4px;\" onClick=\"getpage(" + (tatolCount) + "," + (intThisPage - 1) + ")\">上一页</a> ";
        }
        if (intPageCount > intPage) {
            if (intThisPage > intPageCount - intCrossPage) {
                intBeginPage = intPageCount - intPage + 1;
                intEndPage = intPageCount;
            }
            else {
                if (intThisPage <= intPage - intCrossPage) {
                    intBeginPage = 1;
                    intEndPage = intPage;
                }
                else {
                    intBeginPage = intThisPage - intCrossPage;
                    intEndPage = intThisPage + intCrossPage;
                }
            }
        }
        else {
            intBeginPage = 1;
            intEndPage = intPageCount;
        }
        if (intCount > 0) {
            for (var i = intBeginPage; i <= intEndPage; i++) {
                if (i == intThisPage) {
                    strPage = strPage + "<a href=\"#\" onClick=\"getpage(" + (tatolCount) + "," + (i) + ")\"> <font color=\"#056dae\">" + i + "</font> </a>";
                }
                else {
                    strPage = strPage + "<a href=\"#\" onClick=\"getpage(" + (tatolCount) + "," + (i) + ")\"> <font>" + i + "</font> </a>";
                }
            }
        }
        if (intThisPage < intPageCount) {
            strPage = strPage + "<a href=\"#\" style=\"margin-left: 4px; margin-right: 4px;\" onClick=\"getpage(" + (tatolCount) + "," + (intThisPage + 1) + ")\">下一页</a>";
            strPage = strPage + "<a href=\"#\" style=\"margin-left: 4px; margin-right: 4px;\" onClick=\"getpage(" + (tatolCount) + "," + (intPageCount) + ")\">尾页</a>";
        }

        var itable = document.getElementById("tbody");
        var num = itable.rows.length;//表格所有行数(所有记录数)
        for (var i = 1; i < (num + 1) ; i++) {
            var irow = itable.rows[i - 1];
            if (i > (intThisPage - 1) * intPageSize && i < intThisPage * intPageSize + 1) {
                irow.style.display = "table-row";
            } else {
                irow.style.display = "none";
            }
        }

        $("#navStr").html(strPage);
    }
})