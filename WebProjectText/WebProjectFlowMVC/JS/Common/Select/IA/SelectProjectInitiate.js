//bClear,是否清空选择
function finishSelect(bClear) {
    var retValue = { "action": (bClear ? "clear" : "select") };
    if (!bClear) {
        var ids = [];
        if (checkJQGridEnableMultiSel('jqProjectInitiate')) {
            ids = ids.concat(getJQGridSelectedRowsID('jqProjectInitiate', true));
        }
        else {
            if (!getJQGridSelectedRowsID('jqProjectInitiate', false)) {
                return alertMsg('请选择项目立项。');
            }
            ids.push(getJQGridSelectedRowsID('jqProjectInitiate', false));
        }

        if (ids.length <= 0) {
            return alertMsg('请选择项目立项。');
        }

        retValue.Datas = [];
        $.each(ids, function (i, id) {
            retValue.Datas.push({
                PIID: id,
                PIName: stripHtml($('#jqProjectInitiate').getRowData(id)['PIName']),
                DeptID: stripHtml($('#jqProjectInitiate').getRowData(id)['DeptID']),
                DeptName: stripHtml($('#jqProjectInitiate').getRowData(id)['DeptName']),
                StationID: stripHtml($('#jqProjectInitiate').getRowData(id)['StationID']),
                StationName: stripHtml($('#jqProjectInitiate').getRowData(id)['StationName'])
            });
        });
    }

    window.returnValue = retValue;
    window.opener = null;
    window.close();
}
function reloadData(jqgid) {
    var vKey = $("#txtKey").val();
    $(jqgid, document).getGridParam('postData').KeyValue = vKey;
    var reg = new RegExp("#", "g"); //创建正则RegExp对象    
    refreshJQGrid(jqgid.replace(reg, ""));
}