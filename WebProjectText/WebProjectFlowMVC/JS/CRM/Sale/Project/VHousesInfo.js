/// <reference path="../../../../CRM/CommonInfoBlocks/Sale/Project/RoomBriefInfo.aspx" />
/// <reference path="../../../../CRM/CommonInfoBlocks/Sale/Project/RoomBriefInfo.aspx" />
/// <reference path="../../../../CRM/CommonInfoBlocks/Sale/Project/RoomBriefInfo.aspx" />
// JScript 文件

/* 页面全局对象，用于保存一些控制变量，
isSearching属性用于列表页，当搜索操作执行时，被置为true，则连点按钮时，不会重复提交搜索请求，当搜索结束时，该属性被重置为false
*/
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
    var sProjectID = $( "#ddlProject" ).val();
    var sBuildingIDList = $( "#ddlBuilding" ).val();
    var sKey = $( "#txtKey" ).val();
    
    // 无条件时，省略第二个参数
    if ( sBuildingIDList == null || sBuildingIDList.toUpperCase() == "NULL" )
    {
        sBuildingIDList = "";
    }

    // 刷新房源信息选项卡
    var query = { ProjectID: sProjectID, BuildingIDList: sBuildingIDList, SearchText: sKey };
    reloadGridData( "idPager", query );

    // 刷新房源绑定选项卡
    ajaxRequest( 'FillData.ashx',
    {
        action: 'CRM_GetBuildingRoomTableHTML', BuildingID: sBuildingIDList
    }, 'text', function ( data, textStatus )
    {
        loadBuildingHTML( data)
    } );
}


function customGridComplete()
{
    _PageMaster.isSearching = false;
}


function setBtnAreaVisiblility(isVisible)
{
    var btns = $('#btnEdit,#btnExport');
    setElementsVisiblility(isVisible, btns);
}

function setElementsVisiblility(isVisible, jqObj)
{
    if (typeof isVisible != "boolean")
    {
        return false;
    }

    var elements = jqObj;
    try
    {
        isVisible ? elements.show() : elements.hide();
    }
    catch (ex)
    { }
}

// 设置选中的单元格背景色为绿色
var mainTDRoomID;
function SetbackgroundColor( roomCell )
{
    var sBuildingID = getObj( "ddlBuilding" ).value,
      td = $( roomCell ), // 当前选中房间节点
      roomGUID = td.attr( 'RoomGUID' ),
        saleStatus = td.attr( 'SaleStatus' ),
        isAttachedRoom = td.attr( 'IsAttachedRoom' ),
        TDRoomID = td.attr( 'TDRoomID' );
    
    mainTDRoomID = TDRoomID;
    if ( td .html() != "" )
    {
        // 取消之前选中的单元格的选中状态
        $( 'td[selected=selected]' ).removeAttr( 'selected' ).css( 'background-color', '' );
        $( td ).css( 'background-color', 'green' ).attr( 'selected', 'selected' );

        $( '#hdSelectedID' ).val( mainTDRoomID );

        //var vCTID = "";
        //var vCID = "";
       
        //ajaxRequest( 'FillData.ashx',
        //{
        //    action: 'CRM_GetRoomInfoByTDRoomID', TDRoomID: mainTDRoomID, BuildingID: sBuildingID
        //}, 'json', function ( data, textStatus )
        //{            
        loadRoomInfo( roomGUID );
        BindAttachRoomList(mainTDRoomID);
        setAttachRoomBtnsDisplay( saleStatus, isAttachedRoom );
        showMoreInfo();
        //}, true, 'POST' );
    }
}

// 获取被选中的房间节点集合。
// 正常情况下只能有一个房间节点被选中。当有例外情况时，也只获取被选中的房间集合中的第一个房间节点。
function getSelectedRoomCell()
{
    return selectedRoomCell = $( '#BuildingTB td[selected=selected]:eq(0)' );
}

//// 加载room信息
//var loadRoomInfo = function (data, vID)
//{
//    if (data != null)
//    {
//        getObj("txtRoomName").value = data[0].RoomCode;
//        getObj("txtRoomStructureCode").value = data[0].RoomStructureCode;
//        getObj("txtRoomStructureName").value = data[0].RoomStructureName;
//        getObj("txtSaleStatus").value = data[0].SaleStatusName;
//        getObj("hidSalesStatus").value = data[0].SaleStatus;
//        getObj("txtRentalTypeConfigItemGUID").value = data[0].RentalTypeName;
//        getObj("txtForSaleTotalPrice").value = data[0].ForSaleTotalPrice;
//        getObj("txtForSaleInternalUnitPrice").value = data[0].ForSaleInternalUnitPrice;
//        getObj("txtForSaleConstructionUnitPrice").value = data[0].ForSaleConstructionUnitPrice;

//        getObj("txtNowConstructionArea").value = data[0].NowConstructionArea;
//        getObj("txtNowInternalArea").value = data[0].NowInternalArea;
//        getObj("txtAreaStatus").value = data[0].AreaStatusName;
//        getObj("txtSalePriceType").value = data[0].SalePriceTypeName;

//        // 获取绑定信息
//        BindAttachRoomList(mainTDRoomID);

//        // 若房间是其他房间的附属房产，隐藏相关操作按钮
//        setAttachRoomBtnsDisplay(data[0]);
//    }
//}

function loadRoomInfo(roomGUID)
{
    var _infoContainer = $( '#divRoomStructureInfo' ),
        url = "../../CommonInfoBlocks/Sale/Project/RoomBriefInfo.aspx",
        strHtml;

    if ( !_infoContainer.length )
    {
        return false;
    }

    ajax( url,
    {
        RoomGUID: roomGUID
    }, 'json', function ( data, textStatus )
    {
        strHtml = data.Data;
        _infoContainer.html( strHtml );
    } );
}


function isValidAttachRoom(roomObj)
{
	if (typeof roomObj != "object")
	{
		return false;
	}
	try
	{
	    if ( !isRoomSalesStatusValid( roomObj ) || !isNotAttachedRoom( roomObj ) || !isAnotherRoom( roomObj ) || isMainRoom( roomObj ) || !isSameProjectRoom( roomObj ) )
		{
			return false;
		}
	}
	catch (ex)
	{
		return alertMsg("未知错误。");		
	}
	return true;
}

function isRoomSalesStatusValid(roomObj)
{
    var selectedRoomCell = getSelectedRoomCell();

    if ( !selectedRoomCell )
    {
        return alertMsg( "请先选择房间" );
    }   

    var selectedRoomSalesStatus = roomObj[0].SaleStatus,
        currentRoomSalesStatus =  selectedRoomCell.attr('SaleStatus'),
        currentRoomSalesStatusName = getObj("txtSaleStatus").value,
        checkReg =  /[123]/;

    if (!checkReg.test(selectedRoomSalesStatus))
    {
        return alertMsg("仅销控、待售的房源可以添加为附属房产，请选择其他房产。");
    }
    // 预约状态的房间可以添加状态为待售的房源为附属房产，其他的只能添加销控、待售的房源且状态和当前房间相同的房源为附属房产。
    else if (!(currentRoomSalesStatus == "4" && selectedRoomSalesStatus == "3")
        && selectedRoomSalesStatus != currentRoomSalesStatus)
    {
        return alertMsg( "当前房源只能绑定销售状态为" + currentRoomSalesStatusName + "的房源作为附属房产。" );
    }

    return true;
}

// 判断选择的房源是不是已经是某房间的附属房产
function isNotAttachedRoom(roomObj)
{
	var selectedRoomIsAttachedRoom = roomObj[0].IsAttachedRoom;
	if (selectedRoomIsAttachedRoom == "Y")
	{
	    return alertMsg( "所选的房产已经是附属房产，请选择其他房产。" );
	}
	else
	{
		return true;
	}
}

// 判断选择的房源是不是其他房间的主房产，即选择的房间已绑定有附属房产。
function isMainRoom(roomObj)
{
	var selectRoomIsMainRoom = roomObj[0].AttachedRoomGUIDList.length > 0;

	if (selectRoomIsMainRoom)
	{
		alertMsg("所选的房产已经是主房产，不能再被绑定为附属房产，请选择其他房产");
	}

	return selectRoomIsMainRoom;
}


// 判断是否将同一房源添加为附属房产
function isAnotherRoom(roomObj)
{
    var attachedTDRoomID = roomObj[0].TDRoomID,
        attachedBuildingGUID = roomObj[0].BuildingGUID,
        currentTDRoomID = mainTDRoomID,
        currentBuildingID = getObj("ddlBuilding").value;

    if (attachedBuildingGUID == currentBuildingID && attachedTDRoomID == currentTDRoomID)
    {
        return alertMsg("不能添加同一房间为附属房产。");
    }
    else
    {
        return true;
    }
}

// 判断要添加为附属房产的房源是否与当前房源处于同一项目下
function isSameProjectRoom(roomObj)
{
    var attachedTDRoomID = roomObj[0].TDRoomID,
        attachedRoomProjectGUID = roomObj[0].ProjectGUID,
        currentProjectID = getObj("ddlProject").value;

    if (attachedRoomProjectGUID.toLocaleLowerCase() != currentProjectID.toLocaleLowerCase())
    {
        return alertMsg("不能添加其他项目下的房产作为附属房产。");
    }
    return true;
}


// 设置附属房产操作按钮显示或隐藏。 已经是附属房产的房间不能添加删除附属房产。
function setAttachRoomBtnsDisplay( salesStatus, isAttachedRoom )
{
    var attachRoomOptBtns = $('#btnAddattachedRoom,#btnDeleteMainRoom,#btnMore');

    isAttachedRoom == "Y" ? attachRoomOptBtns.hide() : attachRoomOptBtns.show();
    
    if ( isAttachedRoom == "N" )
    {
        if ( /[567]/.test( salesStatus ) )
        {
            attachRoomOptBtns.hide();
        }
        else
        {
            attachRoomOptBtns.show();
        }
    }
    else
    {
        attachRoomOptBtns.hide();
    }
}

/*  监测当前对附属房产的操作是否合法。
仅销控、待售、预约状态的可以进行添加和删除附属房产操作。
@optName: add或delete，表示增加或删除附属房产操作。
*/
function checkCouldOptAttachRoom(opt)
{
    var selectedRoomCell = getSelectedRoomCell();

    if ( !selectedRoomCell )
    {
        return alertMsg( "请先选择房间" );
    }   

    var roomSalesStatus = selectedRoomCell.attr('SaleStatus'),
        roomSalesStatusName = getObj( "txtSaleStatus" ).value,
        optName = opt == "add" ? "增加" : "删除";

    if ( !roomSalesStatus )
    {
        return alertMsg("请先选择房间");
    }

    if (!/[1234]/.test(roomSalesStatus))
    {
        return alertMsg('销售状态为' + roomSalesStatusName + '的房源不能' + optName + '附属房产。');
    }
    return true;
}

// 添加附属房产
function AddAttachedRoom()
{
    if (!checkCouldOptAttachRoom('add'))
    {
        return false;
    }

    var projectGUID = $('#ddlProject').val();
    var rValue = openModalWindow( '../../../Common/Select/CRM/VSelectRoomInfo.aspx?validFn=isValidAttachRoom&ProjectGUID=' + projectGUID,
        800, 600);

    if (!rValue)
    {
        return;
    }
    else
    {
        var sMainBuildingID = getObj("ddlBuilding").value;
        var sAttachedBuildingID = rValue[0].BuildingGUID;

        ajaxRequest( 'FillData.ashx',
        {
            action: 'CRM_AddAttachedRoom',
            mainBuildingID: sMainBuildingID,
            attachedBuildingID: sAttachedBuildingID,
            mainTDRoomID: mainTDRoomID,
            attachedTDRoomID: rValue[0].TDRoomID
        }, 'text', function ( data, textStatus )
        {
            BindAttachRoomList( mainTDRoomID );
        });
    }
}

// 删除附属房产
function DeleteAttachedRoom()
{
    if (!checkCouldOptAttachRoom('delete'))
    {
        return false;
    }

    // 获取需删除的房产ID集合
    var roomIds = [];
    var mainRoomCell = $( '#BuildingTB td[selected=selected]' ),
        mainRoomSaleStatus = mainRoomCell.attr( 'saleStatus' );
        
    $( "input:checked" ).each( function ()
    {
        var val = $( this ).attr( "name" );
        if ( val == "dgMainID" )
        {
            roomIds.push( $( this ).val() );
        }
    } );

    // 数据处理
    if (roomIds != "")
    {
        ajaxRequest( 'FillData.ashx',
        {
            action: 'CRM_DelAttachedRoom',
            roomIds: roomIds.join(),
            mainRoomSaleStatus: mainRoomSaleStatus
        }, 'text', function ( data, textStatus )
        {
            BindAttachRoomList( mainTDRoomID );
        } );
    }

}

// 绑定附属房产列表
function BindAttachRoomList( TDRoomID )
{
    var sBuildingID = getObj( "ddlBuilding" ).value;

    ajaxRequest( 'FillData.ashx',
    {
        action: 'CRM_BindAttachedRoom',
        buildingID: sBuildingID,
        roomID: TDRoomID
    }, 'json', function ( data, textStatus )
    {
        // 清空datagrid
        var dg = $( "table[id*='tbAttachedRoomList']" );
        dg.empty();

        if ( data.length > 0 )
        {
            // 显示数据到界面
            for ( var i = 0; i < data.length; i++ )
            {
                var strHtml = "<TR class='dg_row'>" +
                "<TD align='middle'><INPUT value='" + data[i].id + "' type='checkbox' name='dgMainID'> </TD>" +
                "<TD align='left'><a target='_blank' href='VHousesAdd.aspx?RoomGUID=" + data[i].id + "'>" + data[i].text + " </a></TD></TR>";
                dg.append( strHtml );
            }
        }
    } );
}

//修改
function editHouses()
{
    var tmp = "";
    var val = "";
    var count = 0;
    $("input:checked").each(
    function (i)
    {
        tmp = $(this).val();
        if (tmp.length == 36)
        {
            val = tmp;
            count += 1;
            if (count > 1)
            {
                count = 2;
                return;
            }
        }

    }
    )
    if (count == 1 && val.toString().length == 36)
    {
        openAddWindow("VHousesAdd.aspx?RoomGUID=" + val, 800, 600);
    } else
    {
        alert('必须选择且只能选择一个！');
    }
}

//新增
function addHouses()
{
    openAddWindow("VHousesAdd.aspx", 800, 600);
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("DeleteProject", 1, "jqProjectInfo");
}

//查看
function renderLink(cellvalue, options, rowobject)
{
    var url = "'VKPIIndexBrowser.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',400, 450)">' + cellvalue + '</a>';
}

// 删除附属房间
function DeleteMainRoomID()
{
    var t = "";
    $("input:checked").each(function ()
    {
        var val = $(this).attr("name");
        if (val == "dgMainID")
        {
            t += $(this).val() + ",";
        }
    })
    $("#hiddAttachIDs").val(t);
}

// 主房产信息链接
function ShowMainRoom()
{
    var id = $("#hidMainRoomID").val();
    if (id != null && id.toString().length == 36)
    {
        openAddWindow("VHousesAdd.aspx?RoomGUID=" + id, 800, 600);
    }
}

// 附属房产信息链接
function ShowAttache()
{
    var id = $("#ddlRoomIDList").val();
    if (id != null && id.toString().length == 36)
    {
        openAddWindow("VHousesAdd.aspx?RoomGUID=" + id, 800, 600);
    }
}

// 项目变更，加载楼栋
function project_change()
{
    var projID = $( "#ddlProject" ).val();
    if ( projID.length != 36 )
    {
        alert( '请选择公司下的项目！' );
        $( "#ddlBuilding" ).empty();
        return;
    }

    var vCTID = "";
    var vCID = "";

    ajaxRequest( 'FillData.ashx',
    {
        action: 'CRM_BindBuildingOnly',
        ProjectGUID: projID
    }, 'json', function ( data, textStatus )
    {
        loadBuildingInfo( data, vCTID + '|' + vCID )
    } );
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


// 楼栋变更，加载楼栋
function building_change()
{
    reloadData();
}


var loadBuildingHTML = function (data, vID)
{
    $("#BuildingTB").html(data);
}



// 户型编码改变事件
function structureCode_OnChange()
{
    var roomStructureGUID = $("#ddlRoomStructureCode").val();
    $.post('FillData.ashx', { action: 'CRM_GetRoomStructure', roomStructureGUID: roomStructureGUID, companyID: $("#hidCompanyID").val() },
    function (data)
    {
        if (data.length > 0)
        {
            $("#ddlRoomStructureConfigItemGUID option[value='" + data[0].RoomStructureConfigItemGUID + "']").attr("selected", true);
            $("#ddlProductTypeConfigItemGUID option[value='" + data[0].RoomStructureConfigItemGUID + "']").attr("selected", true);
            $("#ddlDecorationConfigItemGUID option[value='" + data[0].DecorationConfigItemGUID + "']").attr("selected", true);
            $("#ddlProductTypeConfigItemGUID option[value='" + data[0].ProductGUID + "']").attr("selected", true);

            $("#txtNowConstructionArea").val(data[0].ConstructionArea);
            $("#txtNowInternalArea").val(data[0].InternalArea);
            $("#txtRemark").val(data[0].Remark);
            if (data[0].RoomStructurePic == "")
            {
                $("#imgRoomStructurePic").hide();
            } else
            {
                $("#imgRoomStructurePic").show();
                $("#imgRoomStructurePic").attr("src", "../../.." + data[0].RoomStructurePic);
            }

            $("#hiddStructureGUID").val(data[0].RoomStructureGUID);
            $("#hiddProductGUID").val(data[0].ProductGUID);
        }
    },
    "json");
}


// 收缩展开按钮鼠标事件注册器
function expandBtnEventRegister()
{
    $( '#btnExpand' ).hover( function ()
    {
        this.className = this.className
					.replace( /index_col/g, "index_col_on" )
					.replace( /index_exp/g, "index_exp_on" );
    }, function ()
    {
        this.className = this.className
					.replace( /index_col_on/g, "index_col" )
					.replace( /index_exp_on/g, "index_exp" );
    } )
	.click( function ()
	{
	    var currentClassName = this.className;
	    if ( /index_col/g.test( currentClassName ) )
	    {
	        hideMoreInfo();
	    }
	    else
	    {
	        showMoreInfo();
	    }
	} );
}


// 显示更多信息
function showMoreInfo()
{
    var btnExpand = $( '#btnExpand' )[0],
        currentClassName = btnExpand.className,
        colgroup = $( '#tbRoomsBinding > colgroup' );

    if ( /index_exp/g.test( currentClassName ) )
    {
        btnExpand.className = currentClassName.replace( /index_exp/g, "index_col" );

        colgroup.find( 'col:eq(0)' ).css( 'width', '59%' );
        colgroup.find( 'col:eq(2)' ).css( 'width', '40%' );
        $( '#tdInfoField' ).show();
    }
}

// 隐藏更多信息
function hideMoreInfo()
{
    var btnExpand = $( '#btnExpand' )[0],
        currentClassName = btnExpand.className,
        colgroup = $( '#tbRoomsBinding > colgroup' );

    if ( /index_col/g.test( currentClassName ) )
    {
        btnExpand.className = currentClassName.replace( /index_col/g, "index_exp" );

        colgroup.find( 'col:eq(0)' ).css( 'width', '99%' );
        colgroup.find( 'col:eq(2)' ).css( 'width', '0%' );
        $( '#tdInfoField' ).hide();
    }
}