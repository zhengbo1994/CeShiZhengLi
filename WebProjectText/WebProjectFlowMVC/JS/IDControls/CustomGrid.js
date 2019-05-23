//插入行
function AddRow(GridID)
{

    var TableID = GridID + "_table";
    var vTb = $("#" + TableID);
    //获取clone行
    var vTr = vTb.find("#CloneRow");
    //创建副本
    var vTrClone = vTr.clone(true);

    vTrClone.show();
    var rowID = arguments[1] === undefined ? getNewID() : arguments[1];
    vTrClone.attr('id', 'row_' + rowID);
    //变更所有的控件ID
    vTrClone.find('input,select,textarea').each(function (i)
    {
        //radio和checkbox类型需要特殊处理下对应的label
        var label = vTrClone.find("label[for='" + this.id + "']");
        if (label.length > 0)
        {
            label.attr('for', label.attr('for').replace('{0}', rowID));
        }
        this.id = this.id.replace('{0}', rowID);
        this.name = this.name.replace('{0}', rowID);
    });
    vTrClone.find("[name='" + GridID + "_SelectCheckBox']").each(function (i)
    {
        this.rowid = rowID;
        // $(this).attr('checked', false);
    });
    //插入
    vTrClone.appendTo(vTb);
    //记录RowID
    var Row = eval($('#' + GridID).val());
    Row.push(rowID);
    $('#' + GridID).val($.jsonToString(Row));

    //创建签约控制价总价
    var hidIsCountContractPrice = $("#hidIsCountContractPrice").val();
    if (hidIsCountContractPrice != null && hidIsCountContractPrice!=undefined)
    {
        CreateContractPriceCount(GridID);
    }
    return vTrClone;


}
//删除行
function DelRow(GridID, isCheck)
{
    if (isCheck != null && isCheck != undefined && isCheck==true)
    {
        if (!IsSelectCheckbox(GridID))
        {
            alertMsg("您没有选择任何记录");
            return;
        }
    }
    var TableID = GridID + "_table";
    var vTb = $("#" + TableID);
    //记录RowID
    var Row = eval($('#' + GridID).val());
    //检查选中的行是否可以被删除,针对采购策划以及采购计划
    var IsAllow = true;
    if (isCheck != null && isCheck != undefined && isCheck == "1")
    {
        if (TableID == "PlanGrid_table" || TableID == "StaticGrid_table")
        {
            vTb.find("[name='" + GridID + "_SelectCheckBox'][checked='true']").each(function (i)
            {
                var IsAllowDelete = $(this).parent('td').parent('tr').find("[type=hidden][id$=_ZBPID]");
                if (IsAllowDelete != null && IsAllowDelete != undefined && IsAllowDelete.val() != null && IsAllowDelete.val() != undefined && IsAllowDelete.val() != "")
                {
                    IsAllow = false;
                    return alertMsg("已经使用的计划明细不能删除");
                }
            });
        }
    }
    if (!IsAllow)
    {
        return;
    }
    //查找选中的行
    vTb.find("[name='" + GridID + "_SelectCheckBox'][checked='true']").each(function (i)
    {
        var RowID = this.rowid;
        //删除对应的RowID
        for (var i = Row.length - 1; i >= 0; i--)
        {
            if (RowID == Row[i])
            {
                Row.splice(i, 1);
            }
        }
        //删除行
        $(this).parent('td').parent('tr').remove();
    });
    $('#' + GridID).val($.jsonToString(Row));
}
//Grid全选方法
function SelectAllGridRow(GridID)
{
    var checked = $(event.srcElement).attr('checked');
    $("[name = '" + GridID + "_SelectCheckBox'][rowid!='']").attr('checked', checked);
}

//获取SelectButton里存值Hidden控件
function GetCustomHidden()
{
    var value;
    $(event.srcElement).parents().each(function ()
    {
        var find = $(this).find("input[type='hidden'][actiontype]");
        if (find.length > 0)
        {
            value = find.first();
            return false;
        }
    });
    return value;
}



//获取SelectButton里存Text值控件
function GetCustomText()
{

    var value;
    $(event.srcElement).parents().each(function ()
    {
        var find = $(this).find("input[type='text'][actiontype]");
        if (find.length > 0)
        {
            value = find.first();
            return false;
        }
    });
    return value;

}
//获取当前所在的Grid行[尽量少使用，以免影响批量修改功能]
function GetRow()
{
    return $(event.srcElement).closest("tr[gridRow='']");
}
//获取行ID
function GetRowID()
{
    return $(event.srcElement).closest("tr[gridRow='']").children("td:eq(0)").find("input[type='checkbox']").attr('rowid');
}
//通过字段名获取当前行的对应控件
function GetObjByDataField(DataField)
{
    var value;
    var ObjType = arguments[1] ? arguments[1] : "input";

    $(event.srcElement).parents().each(function ()
    {
        var find = $(this).find(ObjType + "[id$='_" + DataField + "']");
        if (find.length > 0)
        {
            value = find.first();
            return false;
        }
    });
    return value;
}
function GetObjByDataFieldAndRowID(DataField, RowID)
{
    //获取所在行
    var tr = $("input[RowID='" + RowID + "']").parent('td').parent('tr');
    var find = tr.find("[id$='_" + DataField + "']");
    return find;

}
//全选
function selectAll()
{
    var checked = $(event.srcElement).attr('checked');
    $("[name='Edit_SelectCheckBox']").attr('checked', checked);
}

//批量修改
function Edit(GridID)
{
    if (!IsSelectCheckbox(GridID))
    {
        alertMsg("您没有选择任何记录");
        return;
    }
    CreateTableHtml(GridID, '0');
    $.dialog({
        title: '批量修改',
        content: $('#EditContent')[0],
        ok: function ()
        {
            saveDate(GridID, '0');
            callBack(GridID);
            return true;
        },
        okVal: '修改',
        cancelVal: '关闭',
        cancel: true,
        drag: true



    });

}


//是否选中记录
function IsSelectCheckbox(GridID)
{
    var IsSelect = false;
    var table = document.getElementById(GridID + '_table');
    if (table != null && table != undefined)
    {
        for (var i = 1; i < table.rows.length; i++)
        {
            if ($(table.rows[i].cells[0]).find("input[type='checkbox']").attr("checked"))
            {
                IsSelect = true;
                break;
            }
        }
    }
    return IsSelect;
}


//构造批量修改的table的内容
function CreateTableHtml(GridID, StartIndex)
{
    var Grid = $('#' + GridID + '_table');
    var vTrClone = Grid.find("#CloneRow");
    var Heads = Grid.children().children('tr:eq(0)').children('td:gt(' + StartIndex + ')');
    var tds = vTrClone.children('td:gt(' + StartIndex + ')');
    var maxWidth = document.body.clientWidth - 150;
    var maxHeight = document.body.clientHeight - 150;
    var Width = maxWidth > 700 ? '700px' : maxWidth + "px";
    var TableHeight = 26 * (tds.length + 1) + 20;
    var Height = maxHeight > TableHeight ? TableHeight + "px" : maxHeight + "px";
    // var Height = maxHeight
    //var height=
    var tb = InitEditTable(Width, Height);
    $("[name='Edit_SelectAllCheckBox']").attr('checked', false);
    //清空数据
    var length = tb.rows.length
    for (var i = length - 1; i > 0; i--)
    {
        tb.deleteRow(i);
    }
    Heads.each(function (i)
    {
        var x = tb.insertRow();
        var y = x.insertCell(0);
        var z = x.insertCell(1);
        var w = x.insertCell(2);
        y.style.textAlign = "center";
        x.className = 'dg_row';
        y.innerHTML = '<input name="Edit_SelectCheckBox" style="width: 15px;height: 15px;" type="checkbox" rowid="' + i + '" />';
        z.innerHTML = this.innerHTML;
        w.innerHTML = tds[i].innerHTML;
        //如果为空，则隐藏
        if (this.innerText.replace(" ", "") == "")
        {
            y.style.display = 'none';
            z.style.display = 'none';
            w.style.display = 'none';
        }
        //隐藏第一行与第二行
        $("#EditTable tr:eq(1)").hide();
        $("#EditTable tr:eq(2)").hide();
    });
}
//初始化批量修改的table
function InitEditTable(width, height)
{
    var value = $('#EditTable');
    //未存在的话重新构造
    if (value.length == 0)
    {
        var tbHtml = '<table id="EditContent" border="0" cellpadding="2" cellspacing="0" style="width: ' + width + '; table-layout: fixed;display:none; "><tr><td style=" height:' + height + '" > <div  style="overflow-x: auto; overflow-y: auto; width: 100%; height: 100%;"> <table id="EditTable" style="border-bottom: #c7d9e7 1px solid; border-collapse: separate;border-top-width: 0px; border-left-width: 0px; border-right: #c7d9e7 1px solid;" class="dg_table2" border="0" rules="all" cellspacing="0">'
        + "<tr class='dg_headrow'>"
        + '<td style=" width:50px">修改<input name="Edit_SelectAllCheckBox" style="width: 15px;height: 15px;" type="checkbox" onclick="selectAll()" /></td>'
        + '<td  style=" width:170px">列名</td>'
        + '<td  style=" width:300px">值</td>'
        + '</tr>'
        + '</table></div></td></tr></table>';
        $(tbHtml).appendTo('form');
        value = $('#EditTable');
    }
    return value[0];

}
//保存批量修改的数据
function saveDate(GridID, StartIndex)
{
    //获取所有的修改行
    var TableID = GridID + "_table";
    var vTb = $("#" + TableID);
    var tb = $('#EditTable');
    //遍历需要修改的行
    vTb.find("[name='" + GridID + "_SelectCheckBox'][checked='true']").each(function (i)
    {
        var rowID = this.rowid;
        //获取每个单元格
        $(this).parent().parent().children('td:gt(' + StartIndex + ')').each(function (j)
        {

            //判断该单元格是否需要修改
            if (tb.find("[name='Edit_SelectCheckBox'][rowid='" + j + "'][checked='true']").length > 0 && this.EnableEdit == "")
            {
                //替换ID
                //                var cloneTD = $(tb[0].rows[j + 1].cells[2]).clone(true);
                //                cloneTD.find('input,select,textarea').each(function (i)
                //                {
                //                    //radio和checkbox类型需要特殊处理下对应的label
                //                    var label = cloneTD.find("label[for='" + this.id + "']");
                //                    if (label.length > 0)
                //                    {
                //                        label.attr('for', label.attr('for').replace('{0}', rowID));
                //                    }
                //                    this.id = this.id.replace('{0}', rowID);
                //                    this.name = this.name.replace('{0}', rowID);
                //                });
                this.innerHTML = $(tb[0].rows[j + 1].cells[2]).attr('innerHTML').replace(/\{0\}/g, rowID);
            }
        });

    });


}

//特殊处理方法,具体页面可以重写该方法
//刘本和
//2013-10-25
function SpecialHandleMeans(thisItem) { }
function callBack(GridID) { }



