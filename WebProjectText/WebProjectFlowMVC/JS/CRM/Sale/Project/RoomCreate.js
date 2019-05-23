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


// 第2步数据验证 最大层数和单元数
function validateSize2()
{
    iLayers = getObj("txtLayers").value
    iUnits = getObj("txtUnits").value

    if (iLayers == "")
    {
        return alertMsg("请输入最大层数。", getObj("txtLayers"));
    }
    else if (!isPositiveInt(iLayers))
    {
        return alertMsg("最大层数只能为正整数。", getObj("txtLayers"));
    }
    else if (parseInt(iLayers) > 200)
    {
        return alertMsg("最大层数不能超过200层。", getObj("txtLayers"));
    }

    if (iUnits == "")
    {
        return alertMsg("请输入单元数。", getObj("txtUnits"));
    }
    else if (!isPositiveInt(iUnits))
    {
        return alertMsg("单元数只能为正整数。", getObj("txtUnits"));
    }
    else if (parseInt(iUnits) > 30)
    {
        return alertMsg("最大单元数不能超过30。", getObj("txtUnits"));
    }

    return true;
}


// 第3步数据验证 楼层代码、单元名称、最大户数

function validateSize3()
{
    iLayers = getObj("hdLayers").value
    iUnits = getObj("hdUnits").value


    for (var i = 1; i <= parseInt(iLayers); i++)
    {
        // 验证楼层名称是否填写
        var strLayerNames = getObj("LayerName" + i.toString()).value;

        if (strLayerNames == "")
        {
            return alertMsg("请输入楼层名称。", getObj("LayerName" + i.toString()));
        }

        sLayerNames[i] = strLayerNames;
    }


    // 验证楼层名称不能重复
    var sLayerNamesList = sLayerNames.join("┃");
    for (var i = parseInt(iLayers); i >= 1 ; i--)
    {
        var listFormat = sLayerNamesList + "┃";
        if (listFormat.replace("┃" + sLayerNames[i] + "┃", "┃").indexOf("┃" + sLayerNames[i] + "┃") > -1)
        {
            return alertMsg("楼层名称不能重复。", getObj("LayerName" + i.toString()));
        }
    }


    for (var j = 1; j <= parseInt(iUnits); j++)
    {
        // 验证单元名称是否填写
        var strUnitNames = getObj("UnitName" + j.toString()).value;

        if (strUnitNames == "")
        {
            return alertMsg("请输入单元名称。", getObj("UnitName" + j.toString()));
        }

        sUnitNames[j] = strUnitNames;

        // 验证最大户数是否为正整数
        var iMaxRooms = getObj("MaxRooms" + j.toString()).value;

        if (iMaxRooms == "")
        {
            return alertMsg("请输入最大户数。", getObj("MaxRooms" + j.toString()));
        }
        else if (!isPositiveInt(iMaxRooms))
        {
            return alertMsg("最大户数只能为正整数。", getObj("MaxRooms" + j.toString()));
        }

        iUnitMaxRooms[j] = iMaxRooms;

    }


    // 验证单元名称不能重复
    var sUnitNamesList = sUnitNames.join("┃");
    for (var j = parseInt(iUnits); j >= 1; j--)
    {
        var slistFormat = sUnitNamesList + "┃";
        if (slistFormat.replace("┃" + sUnitNames[j] + "┃", "┃").indexOf("┃" + sUnitNames[j] + "┃") > -1)
        {
            return alertMsg("单元名称不能重复。", getObj("UnitName" + j.toString()));
        }
    }

    // 将 楼层代码、单元名称、最大户数 隐藏值
    $('#hdLayerNames').val(sLayerNamesList);
    $('#hdUnitNames').val(sUnitNamesList);
    $('#hdUnitMaxRooms').val(iUnitMaxRooms.join("┃"));

    return true;
}



// 第4步 生成房间号码

function validateSize4()
{
    iLayers = getObj("hdLayers").value  // 层数
    iUnits = getObj("hdUnits").value  // 单元数

    // 获取单元户数
    iUnitMaxRooms = $('#hdUnitMaxRooms').val().split('┃');

    // 各单元
    for (var i = 1; i <= parseInt(iUnits); i++)
    {
        // 初始化
        sUnitRoomNames[i] = "";

        // 单元内每户
        for (var j = 1; j <= iUnitMaxRooms[i]; j++)
        {
            var sRoomNO = getObj("RoomNO_" + i.toString() + "_" + j.toString()).value;
            if (sRoomNO == "")
            {
                return alertMsg("请填写该单元该户号码。", getObj("RoomNO_" + i.toString() + "_" + j.toString()));
            }
            sUnitRoomNames[i] = sUnitRoomNames[i] + "," + sRoomNO;
        }

        // 判断各单元每户名称不能重复
        for (var x = parseInt(iUnitMaxRooms[i]); x >= 1; x--)
        {
            var slistFormat = sUnitRoomNames[i] + ",";
            if (slistFormat.replace("," + sUnitRoomNames[i].split(',')[x] + ",", ",").indexOf("," + sUnitRoomNames[i].split(',')[x] + ",") > -1)
            {
                return alertMsg("单元下各户名称不能重复。", getObj("RoomNO_" + i.toString() + "_" + x.toString()));
            }
        }

        //alert(sUnitRoomNames[i]);
    }

    // 将各单元各户名称保存在后台隐藏控件
    $('#hdUnitRoomNames').val(sUnitRoomNames.join("┃"));


    // 获取户型信息

    // 每一层
    for (var m = 1; m <= iLayers; m++)
    {
        // 初始化
        sRoomStructures[m] = "┇";

        // 每个单元
        for (var i = 1; i <= iUnits; i++)
        {
            // 单元内每户
            for (var j = 1; j <= iUnitMaxRooms[i]; j++)
            {
                var sRoomID = "Room_" + m.toString() + "_" + i.toString() + "_" + j.toString();

                var myid = document.getElementById(sRoomID);
                // 获取户型
                var sRoomstruct = myid.options[myid.selectedIndex].value;

                if (sRoomstruct == "")
                {
                    return alertMsg("请先选择户型。", getObj(sRoomID));
                }

                sRoomStructures[m] = sRoomStructures[m] + "," + sRoomstruct;

            }

            if (i < iUnits)
            {
                sRoomStructures[m] = sRoomStructures[m] + "┇";
            }
        }

    }

    // 将各楼层各单元各户户型保存在后台隐藏控件
    $('#hdRoomStructures').val(sRoomStructures.join("┃"));

    return true;
}


// 第5步  提交数据、生成房源

function validateSize5()
{
    iLayers = getObj("hdLayers").value  // 层数
    iUnits = getObj("hdUnits").value  // 单元数

    // 获取各楼层名称
    sLayerNames = $('#hdLayerNames').val().split('┃');

    // 获取各单元名称
    sUnitNames = $('#hdUnitNames').val().split('┃');

    // 获取单元户数
    iUnitMaxRooms = $('#hdUnitMaxRooms').val().split('┃');

    // 获取各单元各户名称
    sUnitRoomNames = $('#hdUnitRoomNames').val().split('┃');

    // 获取房间号信息（与获取 户型信息类似）

    // 每一层
    for (var m = 1; m <= iLayers; m++)
    {
        // 初始化
        sRoomNOs[m] = "┇";

        // 每个单元
        for (var i = 1; i <= iUnits; i++)
        {
            // 单元内每户
            for (var j = 1; j <= iUnitMaxRooms[i]; j++)
            {
                var sRoomID = "Room_" + m.toString() + "_" + i.toString() + "_" + j.toString();

                // 判断号码是否填写
                if (getObj(sRoomID).value == "")
                {
                    return alertMsg("请填写该房间号码。", getObj(sRoomID));
                }

                sRoomNOs[m] = sRoomNOs[m] + "," + getObj(sRoomID).value;

            }

            if (i < iUnits)
            {
                sRoomNOs[m] = sRoomNOs[m] + "┇";
            }
        }
    }


    // 判断同一单元下房间号码不能重复
    // （单元）号码
    for (var i = 1; i <= iUnits; i++)
    {
        var sUnitRoomNOs = new Array();
        var sUnitRoomIDs = new Array();

        var Uindex = 0;

        // 户数
        for (var j = 1; j <= iUnitMaxRooms[i]; j++)
        {
            // 楼层名称
            for (var m = 1; m <= iLayers; m++)
            {
                Uindex = Uindex + 1;
                var txtID = "#Room_" + m.toString() + "_" + i.toString() + "_" + j.toString();

                // 获取号码
                sUnitRoomNOs[Uindex] = $(txtID).val();
                // 保存对应ID
                sUnitRoomIDs[Uindex] = txtID;
            }
        }

        // 判断同一单元下房间号码不能重复
        var slistFormat = sUnitRoomNOs.join(",") + ",";

        for (var h = 1; h <= Uindex; h++)
        {
            if (slistFormat.replace("," + sUnitRoomNOs[h] + ",", ",").indexOf("," + sUnitRoomNOs[h] + ",") > -1)
            {
                return alertMsg("同一单元下房间号码不能重复。", $(sUnitRoomIDs[h]));
            }
        } //end 判断同一单元下房间号码不能重复
    }

   

    // 将各楼层各单元各户户型保存在后台隐藏控件
    $('#hdRoomNOs').val(sRoomNOs.join("┃"));

    return confirm("确认要生成房源吗？");
}

// 选择户型
function RoomStructureChange(a)
{
    var myid = document.getElementById(a);
    // 获取户型
    var sRoomstruct = myid.options[myid.selectedIndex].value;

    iLayers = getObj("hdLayers").value  // 层数
    iUnits = getObj("hdUnits").value  // 单元数

    // 获取单元户数
    iUnitMaxRooms = $('#hdUnitMaxRooms').val().split('┃');

    // 获取选择的户型类型
    if (a == "RoomStructAll")
    {
        // 设置所有户型

        // 每一层
        for (var m = 1; m <= iLayers; m++)
        {
            // 每个单元
            for (var i = 1; i <= iUnits; i++)
            {
                // 单元内每户
                for (var j = 1; j <= iUnitMaxRooms[i]; j++)
                {
                    var sRoomID = "#Room_" + m.toString() + "_" + i.toString() + "_" + j.toString();
                    // 设置户型
                    $(sRoomID).val(sRoomstruct);
                }
            }
        }
    }
    else if (a.indexOf("RoomStructL_") != -1)
    {
        // 设置整层户型

        // 每个单元
        for (var i = 1; i <= iUnits; i++)
        {
            // 单元内每户
            for (var j = 1; j <= iUnitMaxRooms[i]; j++)
            {
                var sRoomID = "#Room_" + a.split('_')[1] + "_" + i.toString() + "_" + j.toString();
                // 设置户型
                $(sRoomID).val(sRoomstruct);
            }
        }

    }
    else if (a.indexOf("RoomStructU_") != -1)
    {
        // 设置同一单元同一序号户内所有层户型

        for (var i = 1; i <= iLayers; i++)
        {
            var sRoomID = "#Room_" + i.toString() + "_" + a.split('_')[1] + "_" + a.split('_')[2];
            // 设置户型
            $(sRoomID).val(sRoomstruct);
        }
    }
}


// 生成房间号码
function CreateRoomNO()
{
    iLayers = getObj("hdLayers").value  // 层数
    iUnits = getObj("hdUnits").value  // 单元数

    // 获取各楼层名称
    sLayerNames = $('#hdLayerNames').val().split('┃');

    // 获取各单元名称
    sUnitNames = $('#hdUnitNames').val().split('┃');

    // 获取单元户数
    iUnitMaxRooms = $('#hdUnitMaxRooms').val().split('┃');

    // 获取各单元各户名称
    sUnitRoomNames = $('#hdUnitRoomNames').val().split('┃');

    // 获取排序规则
    var sRuleNO = $('#ddlRoomNORule').val();

    // 楼层 + 号码
    if (sRuleNO == 0)
    {
        // 楼层名称
        for (var m = 1; m <= iLayers; m++)
        {
            // （单元）号码
            for (var i = 1; i <= iUnits; i++)
            {
                // 户数
                for (var j = 1; j <= iUnitMaxRooms[i]; j++)
                {
                    var txtID = "#Room_" + m.toString() + "_" + i.toString() + "_" + j.toString();

                    // 设置号码
                    $(txtID).attr("value", sLayerNames[m] + sUnitRoomNames[i].split(',')[j])
                }
            }
        }
    }
    else if (sRuleNO == 1)  // 楼层 + 顺序号
    {
        // （单元）号码
        for (var i = 1; i <= iUnits; i++)
        {
            var iNO = 0;

            // 楼层名称
            for (var m = 1; m <= iLayers; m++)
            {
                // 户数
                for (var j = 1; j <= iUnitMaxRooms[i]; j++)
                {
                    iNO = iNO + 1;

                    var txtID = "#Room_" + m.toString() + "_" + i.toString() + "_" + j.toString();

                    // 格式化号码，低于2位的补0
                    var sNO = iNO > 9 ? iNO.toString() : "0" + iNO.toString();

                    // 设置号码
                    $(txtID).attr("value", sLayerNames[m] + sNO);
                }
            }
        }
    }
    else if (sRuleNO == 2)  // 单元纵向
    {
        // （单元）号码
        for (var i = 1; i <= iUnits; i++)
        {
            var iNO = 0;

            // 户数
            for (var j = 1; j <= iUnitMaxRooms[i]; j++)
            {
                // 楼层名称
                for (var m = 1; m <= iLayers; m++)
                {

                    iNO = iNO + 1;

                    var txtID = "#Room_" + m.toString() + "_" + i.toString() + "_" + j.toString();

                    // 格式化号码，低于2位的补0
                    var sNO = iNO > 9 ? iNO.toString() : "0" + iNO.toString();

                    // 设置号码
                    $(txtID).attr("value", sLayerNames[m] + sNO);
                }
            }
        }
    }
    else if (sRuleNO == 3)  // 楼栋横向
    {
        // 楼层名称
        for (var m = 1; m <= iLayers; m++)
        {
            var iNO = 0;

            // （单元）号码
            for (var i = 1; i <= iUnits; i++)
            {
                // 户数
                for (var j = 1; j <= iUnitMaxRooms[i]; j++)
                {


                    iNO = iNO + 1;

                    var txtID = "#Room_" + m.toString() + "_" + i.toString() + "_" + j.toString();

                    // 格式化号码，低于2位的补0
                    var sNO = iNO > 9 ? iNO.toString() : "0" + iNO.toString();

                    // 设置号码
                    $(txtID).attr("value", sLayerNames[m] + sNO);
                }
            }
        }
    }
}