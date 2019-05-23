function SetSaleControl(stype, floorNo, unitNo, unitRoomNo)
{
    //var maxLayer = $("#hdMaxLayer").val(); // 最大楼层
    //var sUnitAllNO = $("#hdUnitAllNO").val(); // 单元、户数集合

    var objTable = $( 'div[map_type] table' );
   
    if (objTable.length)
    {
        var selector = "td" +
            ( floorNo ? "[floorNo=" + floorNo + "]" : "" ) +
            ( unitNo ? "[unitNo=" + unitNo + "]" : "" ) +
            ( unitRoomNo ? "[unitRoomNo=" + unitRoomNo + "]" : "" );
       
        var targetRoomTDs = objTable.find( selector );

        targetRoomTDs.each( function ( i, roomCell )
        {
            if ( stype == 'open' )
            {
                AddTohdSelectedIDList( roomCell.id );
            }
            else if ( stype == 'close' )
            {
                RemoveFromhdSelectedIDList( roomCell.id );
            }
        } );

    }
}


// 保存销控状态
function SaveSaleControl()
{
    if (confirm('确定要保存放盘（销控状态）吗？'))
    {
        var saleControlType = $('#hdSaleControlType').val();
        var saleControltdList = $('#hdSelectedIDList').val();
        var sBuildingID = $("#ddlBuilding").val();
        
        if (saleControltdList != "")
        {
            var slist = new Array();
            slist = saleControltdList.split(',');
            for (var i = 0; i < slist.length; i++)
            {
                slist[i] = "'" + slist[i] + "'"
            }

            saleControltdList = slist.join(',')
        }

        if (sBuildingID != "" && sBuildingID != "null" && sBuildingID != "00000000-0000-0000-0000-000000000000")
        {

            ajaxRequest( 'FillData.ashx',
            {
                action: "CRM_SetRoomSaleControl",
                SaleControlType: saleControlType,
                BuildingID: sBuildingID,
                SaleControltdList: saleControltdList
            },
            'string', function ( data, status )
            {
                if ( data.toUpperCase() == "TRUE" )
                {
                    alert( "保存成功。" );
                    building_change();
                }
                else
                {
                    alert( "存在未定价的房间，不允许放盘操作。" );
                }
            } );
        }
    }
}

// 切换标签
function showIndexTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");
    $('#hdSaleControlType').val(index);
    building_change();
}


function getColorNameBySaleStatus(saleStatusCode)
{
    var statusAndColorNameMapping = {
        "1": {
            StatusName: "companyControl",
            ColorName: "#8C8C8C"
        },
        "2": {
            StatusName: "projectControl",
            ColorName: "#ADD8E6"
        },
        "3": {
            StatusName: "onSale",
            ColorName: "#FFFFFF"
        },
        "4": {
            StatusName: "reservation",
            ColorName: "#006600"
        },
        "5": {
            StatusName: "subscription",
            ColorName: "#FF0000"
        },
        "6": {
            StatusName: "contract",
            ColorName: "#1E90FF"
        },
        "7": {
            StatusName: "lived",
            ColorName: "#8600FF"
        }
    };

    var statusInfo = statusAndColorNameMapping[saleStatusCode];

    return statusInfo ? statusInfo.ColorName : null;
}

// 初始化表格（显示颜色、获取销控状态信息）
function initTable()
{
    var hdSelectedIDList = $( '#hdSelectedIDList' ),
        saleControlType = $( '#hdSaleControlType' ).val(),
        releasedTDRoomIDs = [],
        objTable = $( 'div[map_type] table' ),

        // 当前收盘操作对应的房间状态，以下称为收盘状态
        controlStatus = saleControlType == "0" ? "1" : "2",
        // 当前放盘操作对应的状态，以下称为放盘状态
        releasedStatus = saleControlType == "0" ? "2" : "3",

        // 当前收盘状态对应的房间节点颜色名称
        releasedRoomCellColorName = getColorNameBySaleStatus( releasedStatus ),
        // 当前放盘状态对应的房间节点颜色名称
        controlRoomCellColorName = getColorNameBySaleStatus( controlStatus ),

        // 状态等于收盘状态的房间节点集合
        controlRoomCells,
        // 状态等于放盘状态的房间节点集合
        releasedRoomCells;    

    if ( objTable.length )
    {

        // 先获取到放盘状态的房间，并设置房间节点的背景色
        releasedRoomCells = objTable.find( 'td[saleStatus=' + releasedStatus + ']' ).not( 'td[isAttachedRoom=Y]' );
        releasedRoomCells.css( 'background-color', releasedRoomCellColorName );

        controlRoomCells = objTable.find( 'td[saleStatus=' + controlStatus + ']' ).not( 'td[isAttachedRoom=Y]' );
        controlRoomCells.css( 'background-color', controlRoomCellColorName );

        //缓存待售房间的ID
        releasedRoomCells.each( function ( i, cell )
        {
            var me = $( cell );
            releasedTDRoomIDs.push( me.attr( 'TDRoomID' ) );
        } );

        hdSelectedIDList.val( releasedTDRoomIDs.join() );
    }
    else
    {
        hdSelectedIDList.val( '' );
    }
}

// 初始化表格（显示颜色、获取销控状态信息）
//function initTable()
//{
//    $('#hdSelectedIDList').val("");
//    var saleControlType = $('#hdSaleControlType').val();
//    var arrData = new Array();
//    //var objTable = document.getElementById( "tb_room" );
//    var objTable = $( 'div[map_type] table' );
//    objTable = objTable.length ? objTable[0] : null;
     
//    if (objTable)
//    {
//        for (var i = 0; i < objTable.rows.length; i++)
//        {
//            for (var j = 0; j < objTable.rows[i].cells.length; j++)
//            {
//                var tdRoom = objTable.rows[i].cells[j];
//                arrData[i] = tdRoom.innerHTML.toUpperCase();

//                var lasttd = $('#hdSelectedIDList').val();

//                // 设置背景色
//                // 如果是附属房产，直接忽略
//                if (arrData[i].indexOf("FF0000") == "-1")
//                {
//                    // 非附属房产，显示销控状态
//                    if (arrData[i].indexOf("ADD8E6") != "-1")
//                    {
//                        tdRoom.style.backgroundColor = '#ADD8E6';
//                    }
//                    else if (saleControlType == "1" && arrData[i].indexOf("458B00") != "-1")
//                    {
//                        tdRoom.style.backgroundColor = '#FFFFFF';
//                    }
//                    else if (saleControlType == "0" && arrData[i].indexOf("8C8C8C") != "-1")
//                    {
//                        tdRoom.style.backgroundColor = '#8C8C8C';
//                    }

//                    if (saleControlType == "0" && arrData[i].indexOf("ADD8E6") != "-1")
//                    {
//                        // 将项目销控的房源加入隐藏控件
//                        if (lasttd != "")
//                        {
//                            $('#hdSelectedIDList').val(lasttd + "," + tdRoom.id);
//                        }
//                        else
//                        {
//                            $('#hdSelectedIDList').val(tdRoom.id);
//                        }
//                    }
//                    else if (saleControlType == "1" && arrData[i].indexOf("458B00") != "-1")
//                    {
//                        // 将待售房源加入隐藏控件
//                        if (lasttd != "")
//                        {
//                            $('#hdSelectedIDList').val(lasttd + "," + tdRoom.id);
//                        }
//                        else
//                        {
//                            $('#hdSelectedIDList').val(tdRoom.id);
//                        }
//                    }
//                }
//            }
//        }
//    }
//}

// 判断指定ID是否可供收放盘操作
function IsEnableOpenOrCloseSale(newtd)
{
    var saleControlType = $('#hdSaleControlType').val();
    var tdInnerHTML = getObj(newtd).innerHTML.toUpperCase();

    // 非附属房产
    if (tdInnerHTML.indexOf("FF0000") == "-1")
    {
        if (getObj(newtd).innerHTML.toUpperCase().indexOf("ADD8E6") != "-1")
        {
            return true;
        }
        else if (saleControlType == 0 && getObj(newtd).innerHTML.toUpperCase().indexOf("8C8C8C") != "-1")
        {
            return true;
        }
        else if (saleControlType == 1 && getObj(newtd).innerHTML.toUpperCase().indexOf("FFFFFF") != "-1")
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false; 
    }
}

//放盘： 将指定（选中）ID（如果hdSelectedIDList中不存在，则）加入隐藏控件
function AddTohdSelectedIDList(newtd)
{
    var saleControlType = $('#hdSaleControlType').val();
    var setBgColor = '#ADD8E6';

    if (saleControlType == "1")
    {
        // 项目销控
        setBgColor = '#FFFFFF'
    }

    // 如果找到ID、且为可收房盘的ID
    if (getObj(newtd) && IsEnableOpenOrCloseSale(newtd))
    {
        getObj(newtd).style.backgroundColor = setBgColor;

        var lasttdList = $('#hdSelectedIDList').val();
        if (lasttdList.indexOf(newtd) == -1)
        {
            if (lasttdList != "")
            {
                $('#hdSelectedIDList').val(lasttdList + "," + newtd);
            }
            else
            {
                $('#hdSelectedIDList').val(newtd);
            }
        }
    } 
}

// 收盘 ：将指定（选择）ID（如果hdSelectedIDList中存在）从隐藏控件移除
function RemoveFromhdSelectedIDList(newtd)
{
    var saleControlType = $('#hdSaleControlType').val();
    var setBgColor = '#8C8C8C';

    if (saleControlType == "1")
    {
        // 项目销控
        setBgColor = '#ADD8E6'
    }

    if (getObj(newtd) && IsEnableOpenOrCloseSale(newtd))
    {
        getObj(newtd).style.backgroundColor = setBgColor;

        var lasttdList = $('#hdSelectedIDList').val();
        if (lasttdList.indexOf(newtd) != -1)
        {
            // 将选中的ID移除LIST
            var nowlist = lasttdList.replace(newtd + ",", "").replace("," + newtd, "").replace(newtd, "");

            $('#hdSelectedIDList').val(nowlist);
        }
    }
}


// 设置选中的单元格背景色为绿色
var mainRoomID;
function SetbackgroundColor(roomCell)
{
    var td = roomCell; // 当前选中房间节点
    var roomNO = $( td ).html().toUpperCase();
    var saleControlType = $('#hdSaleControlType').val();
    var tdID = td.id;

    if (roomNO != "" && roomNO.indexOf("FF0000") == "-1")
    {
        if (
                (
                    saleControlType == "0" &&
                    ( roomNO.indexOf( "8C8C8C" ) != "-1" || roomNO.indexOf( "ADD8E6" ) != "-1" )
                ) ||
                (
                    saleControlType == "1" &&
                    ( roomNO.indexOf( "ADD8E6" ) != "-1" || roomNO.indexOf( "FFFFFF" ) != "-1" )
                )
           )
        {
            // 获取上次选中的单元格ID
            var lasttd = getObj("hdSelectedIDList").value;

            if ( lasttd.indexOf( tdID ) == "-1" )
            {
                if (saleControlType == "0")
                {
                    // 将选中的ID加入LIST
                    td.style.backgroundColor = '#ADD8E6';
                }
                else
                {
                    td.style.backgroundColor = '#FFFFFF';
                }
                if (lasttd != "")
                {
                    $( '#hdSelectedIDList' ).val( lasttd + "," + tdID );
                }
                else
                {
                    $( '#hdSelectedIDList' ).val( tdID );
                }

            }
            else
            {
                if (saleControlType == "0")
                {
                    td.style.backgroundColor = '#8C8C8C';
                }
                else
                {
                    td.style.backgroundColor = '#ADD8E6';
                }

                // 将选中的ID移除LIST
                var nowlist = lasttd.replace( tdID + ",", "" ).replace( "," + tdID, "" ).replace( tdID, "" );

                $('#hdSelectedIDList').val(nowlist);
            }
        }
    }
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
    $.post( 'FillData.ashx', { action: 'CRM_BindBuilding', ProjectGUID: projID },
        function ( data, textStatus ) { loadBuildingInfo( data, vCTID + '|' + vCID ) }, 'json' );

}


var loadBuildingInfo = function (data, vID)
{
    bindDdl(data, 'ddlBuilding', "", "SELECT");
    // 重新加载楼栋
    building_change();
}


// 楼栋变更，加载楼栋
function building_change()
{
    // 清空已选中的房源
    $( '#hdSelectedIDList' ).val( "" );

    var sBuildingID = $( "#ddlBuilding" ).val();

    if ( sBuildingID == "" || sBuildingID == "null" )
    {
        sBuildingID = "00000000-0000-0000-0000-000000000000";
    }


    var vCTID = "";
    var vCID = "";

    // post请求
    $.post( 'FillData.ashx',
        {
            action: 'CRM_GetBuildingRoomTableHTML',
            BuildingID: sBuildingID, MapType: 'SaleControl'
        },
        function ( data, textStatus )
        {
            loadBuildingHTML( data, vCTID + '|' + vCID )
        }, ''
    );
}


var loadBuildingHTML = function (data, vID)
{
    $("#BuildingTB").html(data);

    initTable();
}
