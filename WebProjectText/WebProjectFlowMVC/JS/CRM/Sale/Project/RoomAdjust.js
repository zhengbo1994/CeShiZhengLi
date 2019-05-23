// 单云飞 2012-11-5

// 最高楼层数
var iLayers;
// 单元数
var iUnits;
// 楼层名称
var sLayerNames = new Array();
// 单元名称
var sUnitNames = new Array();
// 单元最大户数 
var iUnitMaxRooms = new Array();
// 各单元各户名称集合，各户分隔符（,）
var sUnitRoomNames = new Array();
// 各楼层各单元各户（房间）户型集合，各单元分隔符（┇）, 各户分隔符（,）
var sRoomStructures = new Array();
// 各楼层各单元各户（房间）号码集合，各单元分隔符（┇）, 各户分隔符（,）
var sRoomNOs = new Array();


// 获取单元格绝对列
function GetAbsoluteColumnIndex(td)
{
    iUnits = getObj("hdUnits").value

    // 获取单元户数
    iUnitMaxRooms = $('#hdUnitMaxRooms').val().split(',');

    var tdUnit = td.split('_')[2]  // 当前单元
    var tdUnitRoom = td.split('_')[3] // 当前单元下的房间序号

    var ColumnIndex = 0;
    for (var i = 1; i <= iUnits; i++)
    {
        for (var j = 1; j <= iUnitMaxRooms[i - 1]; j++)
        {
            ColumnIndex = ColumnIndex + 1;
            if (tdUnit == i && tdUnitRoom == j)
            {
                return ColumnIndex;
            }
        }
    }

    return 0;
}


// 根据列绝对索引号获取单元序号、单元房间序号
function GetRoomUnitByAbsoluteColumnIndex(cIndex)
{
    iUnits = getObj("hdUnits").value

    // 获取单元户数
    iUnitMaxRooms = $('#hdUnitMaxRooms').val().split(',');

    var ColumnIndex = 0;
    for (var i = 1; i <= iUnits; i++)
    {
        for (var j = 1; j <= iUnitMaxRooms[i - 1]; j++)
        {
            ColumnIndex = ColumnIndex + 1;
            if (ColumnIndex == cIndex)
            {
                return i.toString() + "_" + j.toString();
            }
        }
    }

    return "";
}

// 设置选中的单元格背景色为绿色
function SetbackgroundColor(roomCell)
{
    var td = $( roomCell );

    // 取消之前选中的单元格的选中状态
    $( 'td[selected=selected]' ).removeAttr( 'selected' ).css( 'background-color', '' );

    td.css( 'background-color', 'green' ).attr('selected','selected');
    
    $('#hdSelectedID').val(td.attr('id'));
}


function MergeRoom(a)
{
    if ($("#ctl00_DataArea_tb_RoomsNO").html() != "")
    {
        //alert($("#ctl00_DataArea_tb_RoomsNO").html());

        // 获取上次选中的单元格ID
        var lasttd = getObj("hdSelectedID").value;

        if (lasttd != "")
        {
            if (a == "right")
            {
                if (confirm('确定要向右合并房间吗？'))
                {
                    return MergerTableTd("right");
                }
            }
            else if (a == "down")
            {
                if (confirm('确定要向下合并房间吗？'))
                {
                    return MergerTableTd("down");
                }
            }
            else if (a == "split")
            {
                if (confirm('确定要拆分房间吗？'))
                {
                    return MergerTableTd("split");
                }
            }
            else if (a == "create")
            {
                if (confirm('确定要建立房间吗？'))
                {
                    return MergerTableTd("create");
                }
            }
            else if (a == "delete")
            {
                if (confirm('确定要删除房间吗？'))
                {
                    return MergerTableTd("delete");
                }
            }
        }
        else
        {
            alert("请选择操作的主房间。");
            return false;
        }
    }
    else
    {
        alert("没有可供操作的房源。");
        return false;
    }

    return false;
}

// 合并单元格
function MergerTableTd(dir)
{
    // 清空隐藏控件信息
    $('#hdRoomOperate').val("");

    // 获取当前操作主td
    var nowtd = getObj("hdSelectedID").value;

    // 获取当前房间号码
    var roomNO =  $( "#" + nowtd ).html().toUpperCase();

    if (nowtd != "")
    {
        if (dir != "create" && roomNO == "")
        {
            alert("当前房间不存在。");
            return false;
        }

        if (dir != "create" && roomNO.indexOf("8C8C8C") == -1 && roomNO.indexOf("ADD8E6") == -1)
        {
            alert("只有销控状态的房间才允许当前操作。");
            return false;        
        }

        // 获取列序数
        var tdColumnIndex = GetAbsoluteColumnIndex(nowtd);

        var td = document.getElementById(nowtd);

        iLayers = getObj("hdLayers").value  // 层数
        iUnits = getObj("hdUnits").value  // 单元数

        var nowLayer = nowtd.split('_')[1]; // 当前楼层
        var nowUnit = nowtd.split('_')[2]; // 当前单元
        var nowUnitRoom = nowtd.split('_')[3]; //当前单元房间序号

        var topLayer =  parseInt(nowLayer) + parseInt(td.rowSpan) - 1;

        // 顶层房间ID
        var topTd = "Room_" + topLayer.toString() + "_" + nowUnit.toString() + "_" + nowUnitRoom.toString();

        //alert(topTd);

        if (dir == "right") //向右合并
        {
            //alert(oo);

            var tdRightUnit = GetRoomUnitByAbsoluteColumnIndex(tdColumnIndex + td.colSpan);

            if (roomNO != "" && tdRightUnit != "")
            {
                var tdRightID = "Room_" + nowLayer.toString() + "_" + tdRightUnit;
                var tdRight = document.getElementById(tdRightID);

                if (tdRight && tdRight.rowSpan == td.rowSpan)
                {
                    // 右侧房间号码（含销售状态）
                    var tdRightroomNO = $("#" + tdRightID).html().toUpperCase();
                    if (tdRightroomNO != "" && tdRightroomNO.indexOf("8C8C8C") == -1 && tdRightroomNO.indexOf("ADD8E6") == -1)
                    {
                        alert("只有销控状态的房间才允许被合并。");
                        return false;
                    }

                    // 合并后的总列数
                    var colSpanAll = td.colSpan + tdRight.colSpan;

                    // 将操作信息写入 隐藏控件
                    $('#hdRoomOperate').val("Merger|" + td.rowSpan.toString() + "," + colSpanAll + "|" + nowtd + "," + tdRightID + "|" + topTd);

                    return true;
                }
                else
                {
                    alert("当前无法向右合并房间。");
                    return false;
                }
            }
            else
            {
                alert("当前无法向右合并房间。");
                return false;
            }
        }
        else if (dir == "down") //向下合并
        {

            if (nowLayer > 1 && roomNO !="")
            {
                var tdDown;
                var tdDownId;

                for (var m = nowLayer - 1; m >= 1; m--)
                {
                    tdDownId = "Room_" + m.toString() + "_" + nowUnit.toString() + "_" + nowUnitRoom.toString();
                    tdDown = document.getElementById(tdDownId);
                    // 如果存在
                    if (tdDown)
                    {
                        break;
                    }
                }

                if (tdDown && tdDown.colSpan == td.colSpan)
                {

                    // 下侧房间号码（含销售状态）
                    var tdDownroomNO = $("#" + tdDownId).html().toUpperCase();
                    if (tdDownroomNO != "" && tdDownroomNO.indexOf("8C8C8C") == -1 && tdDownroomNO.indexOf("ADD8E6") == -1)
                    {
                        alert("只有销控状态的房间才允许被合并。");
                        return false;
                    }

                    // 合并后的总行数
                    var rowSpanAll = td.rowSpan + tdDown.rowSpan

                    // 将操作信息写入 隐藏控件
                    $('#hdRoomOperate').val("Merger|" + rowSpanAll.toString() + "," + td.colSpan.toString() + "|" + tdDownId + "," + nowtd + "|" + topTd);

                    return true;
                }
                else
                {
                    alert("当前无法向下合并房间。");
                    return false;
                }
            }
            else
            {
                alert("当前无法向下合并房间。");
                return false;
            }
        }
        else if (dir == "split") // 拆分房间 
        {
            if (td.colSpan > 1 || td.rowSpan > 1)
            {
                // 将操作信息写入 隐藏控件
                $('#hdRoomOperate').val("split|" + nowtd);

                return true;
            }
            else
            {
                alert("当前房间已是最小单位，无需拆分。");
                return false;
            }
        }
        else if (dir == "create") // 创建房间 
        {
            if (roomNO == "")
            {
                // 将操作信息写入 隐藏控件
                $('#hdRoomOperate').val("create|" + nowtd);

                return true;
            }
            else
            {
                alert("当前房间已存在。");
                return false;
            }
        }
        else if (dir == "delete") // 删除房间 
        {
            if (roomNO == "")
            {
                alert("当前房间不存在,无需删除。");
                return false;
            }
            else
            {
                var buildingGUID = getParamValue('ID'),
                    alterMsg = checkRoomCouldDelete(buildingGUID, nowtd);

                if (alterMsg != "")
                {
                    alert(alterMsg);
                    return false;
                }

                // 将操作信息写入 隐藏控件
                $('#hdRoomOperate').val("delete|" + nowtd);

                return true;
            }
        }
    }
    return false;
}

// 检测当前选择的房间是否可以删除
function checkRoomCouldDelete(buildingGUID, roomTDId)
{
    var url = getCurrentUrl(),
        alterMsg = "";

    ajax(url, {
        action: "CheckRoomCouldDelete",
        ID: buildingGUID,
        RoomTDId: roomTDId
    }, 'text', function (data, status)
    {
        alterMsg = data;
    }, false, 'POST');
    return alterMsg;
}
