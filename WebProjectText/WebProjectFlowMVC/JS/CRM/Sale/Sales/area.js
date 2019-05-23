var _PageMaster = {};
_PageMaster.isSearching = false;

//搜索
function btnSearch_Click()
{
    reloadData();
}


// 重新加载数据
function reloadData()
{
    var sProjectID = $("#ddlProject").val();
    var sBuildingIDList = $("#ddlBuilding").val();
    var sKey = $( "#txtSearch" ).val();

    // 无条件时，省略第二个参数
    if ( sBuildingIDList == null || sBuildingIDList.toUpperCase() == "NULL" )
    {
        sBuildingIDList = "";
    }

    var query = { ProjectID: sProjectID, BuildingIDList: sBuildingIDList, Key: sKey };

    reloadGridData("idPager", query);

    $("input[name='1'],input[name='2']").live("keydown",
    function ()
    {
        var e = $(this).event || window.event;
        var code = parseInt(e.keyCode);

        if (code >= 96 && code <= 105 || code >= 48 && code <= 57 || code == 8 || code == 110 || code == 190)
        {
            return true;
        } else
        {
            return false;
        }
    });

}


function customGridComplete()
{
    _PageMaster.isSearching = false;
}


// 项目变更，加载楼栋
function project_change()
{
    var projID = $("#ddlProject").val();
    if (projID.length != 36)
    {
        alert('请选择公司下的项目！');
        $("#ddlBuilding").empty();
        return;
    }

    var vCTID = "";
    var vCID = "";

    // post请求
    $.post('FillData.ashx', { action: 'CRM_BindBuildingOnly', ProjectGUID: projID }, function (data, textStatus) { loadBuildingInfo(data, vCTID + '|' + vCID) }, 'json');

}


var loadBuildingInfo = function (data, vID)
{
    if (!!data)
    {
        bindDdl(data, 'ddlBuilding', "", "SELECT");
    }
    else
    {
        bindDdl([], "ddlBuilding", '', "SELECT");
    }

    // 重新加载楼栋
    building_change();
}

// 楼栋变更
function building_change()
{
    var buildText = $("#ddlBuilding option:selected").text();
    var buildValueList = "";

    reloadData();

}


// 数字处理成2位小数
function DigitProcess(source)
{
    if (source != null)
    {
        var tmp = source.toString();
        tmp = tmp.indexOf('.') == -1 ? tmp : tmp.split('.')[0];
        return tmp;
    }
    return source

}

// 输入验证：文本框只能输入数字 且 处理退格键与浏览器的冲突
function InputCheck()
{
    $("input[name='Construction'],input[name='Internal'],input[name='Total']").keydown(
    function ()
    {
        var e = $(this).event || window.event;
        var code = parseInt(e.keyCode);
        if ($(this).attr("readonly") && code == 8)
        {
            return false;
        }
        if (code >= 96 && code <= 105 || code >= 48 && code <= 57 || code == 8 || code == 110 || code == 190)
        {
            return true;
        } else
        {
            return false;
        }
    });
}



// 数据规范化
function Specifications()
{
    $("input[name='Construction'],input[name='Internal'],input[name='Total']").each(
    function ()
    {
        var value = $(this).val();
        alert(value);
        $(this).val(DigitProcess(value));
    }
    );

}

// 审核处理
function ApprovalProcess()
{
    var ids = "";
    $("input:checked").each(
    function ()
    {
        ids += $(this).val() + ",";
    }
    );
    ids = ids.replace("on,", "");


    if (ids == "")
    {
        alert('请先选择要审核的行！');
        return false;
    }

    if (!confirm('是否审核？'))
    {
        return false;
    }
    else
    {
        // db处理
        $.post("FillData.ashx", { action: "CRM_ApprovalProcess", ids: ids },
        function (data)
        {
            if (data.toString() == "True")
            {
                $("input:checked").each(function ()
                {
                    // 审核文字处理
                    var trCurr = $(this).parent().parent();
                    trCurr.find("td:last").text("是");

                    // 移除背景色class
                    trCurr.removeClass("dg_rowselected");
                });
                $("input:checked").removeAttr("checked");
                alert("操作成功！");

            } else
            {
                alert("操作失败！");
            }
        });
    }
}

// 获得焦点
function areaOnFocus(curr)
{
    setFocus();
    //    alert($("#hidPointNumber").val() + ":" + $("#hidPointNumberStr").val());
    var val = $(curr).val();
    $(curr).val(RemoveComma(val));
}

// 失去焦点
function areaOnBlur(current)
{
    var ID = $(current).parent().parent().find(".idbox").val();
    var type = $(current).attr("name");
    var value = $(current).val();

    // 判断建筑面积与套内面积大小
    var construct = "";
    var internal = "";
    if (type == "1")
    {
        internal = $(current).parent().parent().find("[name='2']").val();
        construct = value;
    } else
    {
        internal = value;
        construct = $(current).parent().parent().find("[name='1']").val();
    }
    if (!ValidateSize(construct, internal))
    {
        // 修改值
        if (type == "1")
        {
            $(current).val(internal);
            value = internal;
        } else
        {
            $(current).val(construct);
            value = construct;
        }
        //        return false;
    }
    // end

    if (value == null || value.length == 0)
    {
        $(current).val("0.00");
        return;
    }
    else
    {
        var index = 0;
        for (var i = 0; i < value.length; i++)
        {
            if (value.charAt(i) == '0')
            {
                index = i + 1;
            } else
            {
                break;
            }

        }
        if (index == value.length)
        {
            $(current).val("0.00");
            return;
        }
        value = value.substr(index);
        if (value.charAt(0) == '.')
        {
            value = "0" + value;
        }

    }
    var idx = value.indexOf(".");
    if (idx == -1)
    {
        value = value + ".00";
    } else if (value.length == idx + 1)
    {
        value = value + "00";
    } else if (value.length == idx + 2)
    {
        value = value + "0";
    } else
    {
        value = value.substring(0, idx + 3);
    }
    $(current).val(value);

    // data添加
    if (type == "1")
    {
        // 建筑面积
        var construVal = $("#hidConstruction").val();
        var index = construVal.indexOf(ID);

        if (index == -1)
        {
            $("#hidConstruction").val(construVal + ID + "," + value + "|");
        }
        else
        {
            var index2 = construVal.indexOf("|", index);
            var strSource = construVal.substring(index, index2);
            var strTarget = ID + "," + value;
            construVal = construVal.replace(strSource, strTarget);
            $("#hidConstruction").val(construVal);
        }
    }
    else if (type == "2")
    {
        // 套内面积
        var internVal = $("#hidInternal").val();
        var index = internVal.indexOf(ID);

        if (index == -1)
        {
            $("#hidInternal").val(internVal + ID + "," + value + "|");
        }
        else
        {
            var index2 = internVal.indexOf("|", index);
            var strSource = internVal.substring(index, index2);
            var strTarget = ID + "," + value;
            internVal = internVal.replace(strSource, strTarget);
            $("#hidInternal").val(internVal);
        }
    }
}

// 保存：批量修改
function SaveOnChange()
{
    var ConstructionValue = $("#hidConstruction").val();
    var InternalValue = $("#hidInternal").val();
    var accountID = $("#hidAccountID").val();

    var IsExec = confirm('是否保存修改？');
    if (IsExec)
    {
        $.post('FillData.ashx', { action: 'CRM_AreaChange', ConstructionValue: ConstructionValue, InternalValue: InternalValue, accountID: accountID },
        function (data)
        {
            alert("保存成功！");
            reloadData();
        });
    }
}

// 去除逗号和小数点
function RemoveComma(str)
{
    var tmp = str;
    if (tmp.indexOf('.'))
    {
        var tmp = str.split('.')[0];
    }
    return tmp.replace(/\,/g, "");
}


// 判断建筑面积与套内面积大小
function ValidateSize(big, small)
{
    big = parseFloat(RemoveComma(big));
    small = parseFloat(RemoveComma(small));
    if (big < small)
    {
        alert('建筑面积不能小于套内面积！');
        return false;
    } else
    {
        return true;
    }
}

// 设置光标位置在最后
function setFocus()
{
    var obj = event.srcElement;
    var txt = obj.createTextRange();
    txt.moveStart('character', obj.value.length);
    txt.collapse(true);
    txt.select();
} 
