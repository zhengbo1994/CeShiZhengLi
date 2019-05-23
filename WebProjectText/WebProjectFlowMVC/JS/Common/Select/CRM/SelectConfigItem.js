/// <reference path="../../../IdeaSoft.js" />
/*
选择款项类型前台JS文件.
引用路径： Common/Select/CRM/VSelectConfigItem.aspx
作者：杨亮
日期：2013-06-26
*/


//重新加载数据
function reloadData() {

    var query = [{
    }];
    if (loadJQGrid("jqData", query)) {
        addParamsForJQGridQuery("jqData", query);
        refreshJQGrid("jqData");
    }
}

//JQGRID完成事件， 具体定义在IdeaSoft.js中的initJQGrid方法
function customGridComplete() {
    var selectedRowIDS =$("#hidConfigItemGUID").val();
    if (selectedRowIDS != "" && selectedRowIDS != null && selectedRowIDS != undefined) {
        var rowIDsArr = selectedRowIDS.split(",");
        for (var i = 0; i < rowIDsArr.length; i++) {
            try {
                $("#jqData").setSelection(rowIDsArr[i], false);
            }
            catch (err) { }
        }
    }
}

//点击选择，返回JSON格式数据
function selectConfigItem() {
    var vConfigItemGUID = getJQGridSelectedRowsID('jqData', true);
    var vConfigItemName = getJQGridSelectedRowsData('jqData', true, 'ConfigItemName');
    if (vConfigItemGUID.length == 0) {
        return alertMsg('请选择代收费用款项！');
    }
    var ids = [];
    var names = [];
    for (var i = 0; i < vConfigItemGUID.length; i++) {
        if (vConfigItemGUID[i] != "") {
            ids.push(vConfigItemGUID[i]);
            names.push(stripHtml( vConfigItemName[i]));
        }
    }
   
    window.returnValue = { "ConfigItemGUID": ids.join(","), "ConfigItemName": names.join(",") };
    window.close();
}