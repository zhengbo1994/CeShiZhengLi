/*
客户自定义配置使用到的JS
作者：程镇彪
日期：2012-09-18
*/
//条件搜索
function reloadData()
{
    var strProjectGUID = getObj("ddlProjectGUID").value;
    ajax(location.href, { "ProjectGUID": strProjectGUID }, "json", loadBuilding);
}

function loadBuilding(data, textStatus)
{
    if (data.Success == "Y")
    {
        $(divMPList).html(data.Data);
    }
    else
    {
        alert(data.Data);
    }
}


//建筑平面布局设置 作者：陈毓孟 2012-11-26
function setBuildingPlane()
{
    var projectID = $("#ddlProjectGUID").val();
    if (projectID == null || projectID == "")
        return alertMsg("请选择项目。", $("#ddlProjectGUID"));
    var chks = $("input:checkbox:checked", $("table[id*='dgData']"));
    if (chks.length > 1)
    {
        return alert("只能选择一条记录");
    }
    var id = chks.length == 0 ? "00000000-0000-0000-0000-000000000000" : $(chks).val();
    var url = "VBuildingPlaneSetting.aspx?Editable=true&&ProjectID=" + projectID + "&BuildingID=" + id;
    openWindow(url, 800, 600);
}


//建筑平面布局浏览 作者:陈毓孟 2012-11-26
function browseBuildingPlane(buildingID)
{
    var projectID = $("#ddlProjectGUID").val();
    if (projectID == null || projectID == "")
        return alertMsg("请选择项目。", $("#ddlProjectGUID"));
    var url = "VBuildingPlaneSetting.aspx?Editable=false&&ProjectID=" + projectID + "&BuildingID=" + buildingID;
    openWindow(url, 800, 600);
}

//添加楼栋
function addBuildingInfo()
{
    addBuilding("VBuildingInfoAdd.aspx", 800, 600);
}

// 添加区域
function addBuildingArea()
{
    addBuilding("VBuildingAdd.aspx", 800, 500);
}

function getDefaultAreaGUID()
{
    var tb = $('[id$=dgData]'),
        selectedCbks = tb.find('tr:gt(0) input[type=checkbox][checked]'),
        defaultAreaGuid = selectedCbks.length != 1 ? "" : selectedCbks.eq(0).val();

    return defaultAreaGuid;
}

function addBuilding(strURL, iWidth, iHight)
{
    var defaultAreaGUID = getDefaultAreaGUID();
    var strProjectGUID = getObj("ddlProjectGUID").value;
    var strProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    openAddWindow(strURL + "?DefaultAreaGUID=" + defaultAreaGUID + "&ProjectGUID=" + strProjectGUID +
     "&ProjectName=" + encodeURIComponent(strProjectName), iWidth, iHight, "dgData");
}
function editBuilding(strURL, iWidth, iHight)
{
    var strProjectGUID = getObj("ddlProjectGUID").value;
    var strProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    openModifyWindow(strURL + "?ProjectGUID=" + strProjectGUID + "&ProjectName=" + encodeURIComponent(strProjectName), iWidth, iHight);
}
function URlToEditBuilding(buildingGUID, isRegion)
{
    var strProjectGUID = getObj("ddlProjectGUID").value;
    var strProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    var strTargetPageUrl = isRegion == "Y" ? "VBuildingEdit.aspx" : "VBuildingInfoEdit.aspx";
    var strURL = strTargetPageUrl + "?ID=" + buildingGUID + "&ProjectGUID=" + strProjectGUID + "&ProjectName=" + encodeURIComponent(strProjectName);
    openWindow(strURL, 800, 600);
}

// 档案查看
function showFileManagement(cellvalue, options, rowobject)
{
    var DeptID = parent["DeptID"];
    var url = "'VFileManagementInfoBrowse.aspx?ID=" + rowobject[0] + "&DeptID=" + DeptID + "'";
    return '<a href="javascript:openWindow(' + url + ',800,600)">' + cellvalue + '</a>';
}

// 生成房源 单云飞 2012-11-5
// 修改： 翁化青 2013-01-18,
// 增加验证，当所选记录是区域时，不可执行房源生成操作；若选择的楼栋已生成房源，提示生成后会覆盖原房源，询问是否仍然继续操作。
function createRoom()
{
    var selectedRowCheckbox = $('table[id$=dgData] input[type=checkbox][checked][chkAll!=chkAll]');
    // 仅当选择的是一条记录时，进行验证记录是否能执行生成房源操作，否则将验证交给openModifyWindow方法。
    if (selectedRowCheckbox.length == 1 && !checkBuildingCouldCreateRoom(selectedRowCheckbox))
    {
        return false;
    }

    var strProjectGUID = getObj("ddlProjectGUID").value;
    var strProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    openModifyWindow("VRoomCreate.aspx?ProjectGUID=" + strProjectGUID + "&ProjectName=" + encodeURIComponent(strProjectName), 800, 600);
}

// 判断楼栋是否可以进行生成房源操作。当选择的是区域，给出提示，不执行操作；若选择的楼栋已生成房源，提示生成后会覆盖原房源，询问是否仍然继续执行操作。
// 翁化青
// 2013-01-18
function checkBuildingCouldCreateRoom( selectedRowCheckbox )
{
    var isRegion = $( selectedRowCheckbox ).attr( 'isRegion' ),
        isCreateRoom = $( selectedRowCheckbox ).attr( 'isCreateRoom' );
    sBuildingGUID = $( selectedRowCheckbox ).attr( 'value' );

    if ( isRegion != "N" )
    {
        alert( "请选择楼栋。" );
        return false;
    }

    if ( isCreateRoom != "N" )
    {
        // 在这里用 AJAX 判断 该楼栋房源是否全为 销控状态，只有 全销控状态的房源才 允许重新生成房源 单云飞 2013-6-21
        // post请求
        $.post( 'FillData.ashx', {
            action: 'CRM_IsBuildingCanReBuild',
            BuildingGUIDList: sBuildingGUID
        }, function ( data, textStatus )
        {
            if ( data.toUpperCase() == "TRUE" )
            {
                return confirm( "房源已生成，是否重新生成房源？将覆盖原有房源。" );
            }
            else
            {
                alert( "该楼栋下存在非销控状态的房源，不允许重新生成房源操作。" );
                return false;
            }
        }, 'string' );
    }
    else
    {
        return true;
    }
}


// 房源调整 单云飞 2012-11-6
// 修改： 翁化青 2013-01-18,增加验证，当所选记录是区域，或是未生成房源的楼栋时，弹出提示，不执行操作。
function AdjustRoom()
{
    var selectedRowCheckbox = $('table[id$=dgData] input[type=checkbox][checked][chkAll!=chkAll]');
    // 仅当选择的是一条记录时，进行验证记录是否能进行房源调整，否则将验证交给openModifyWindow方法。
    if (selectedRowCheckbox.length == 1 && !checkBuildingCouldAdjust(selectedRowCheckbox))
    {
        return false;
    }

    var strProjectGUID = getObj("ddlProjectGUID").value;
    var strProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    openModifyWindow("VRoomAdjust.aspx?ProjectGUID=" + strProjectGUID + "&ProjectName=" + encodeURIComponent(strProjectName), 800, 600);
}

// 判断楼栋是否可以进行房源调整，仅生成房源后的楼栋可进行调整。
// 翁化青
// 2013-01-18
function checkBuildingCouldAdjust(selectedRowCheckbox)
{
    var isRegion = $(selectedRowCheckbox).attr('isRegion'),
        isCreateRoom = $(selectedRowCheckbox).attr('isCreateRoom');

    if (isRegion != "N")
    {
        alert("请选择楼栋。");
        return false;
    }

    if (isCreateRoom != "Y")
    {
        alert("生成房源前无法进行房源调整。");
        return false;
    }

    return true;
}


//编辑
function editBuildArea()
{
    var chk = getSelectedBox("chkIDV3");

    if (chk != null)
    {
        if (chk.isregion != "Y")
        {
            editBuilding("VBuildingInfoEdit.aspx", 800, 600);
        }
        else
        {
            editBuilding("VBuildingEdit.aspx", 800, 500);
        }
    }

}

//删除
function deleteBuilding()
{
    var sBuildingGUID = getSelectedBuildingGUIDs();

    // 在这里用 AJAX 判断 该楼栋房源是否全为 销控状态，只有 全销控状态的房源才 允许删除 单云飞 2013-6-21
    // post请求
    $.post( 'FillData.ashx', {
        action: 'CRM_IsBuildingCanReBuild',
        BuildingGUIDList: sBuildingGUID
    }, function ( data, textStatus )
    {
        if ( data.toUpperCase() == "TRUE" )
        {
            openDeleteWindow( "Building", 13 );
        }
        else
        {
            alert( "所选的楼栋下存在非销控状态的房源，不允许进行删除操作。" );
            return false;
        }
    }, 'string' );

}

//获取选中的楼栋ID值   翁化青 2013-6-21
function getSelectedBuildingGUIDs()
{
    var selectedRowCheckbox = $( 'table[id$=dgData] input[type=checkbox][checked][chkAll!=chkAll]' ),
         buildingGUIDs = [];

    selectedRowCheckbox.each( function ( i, cbk )
    {
        buildingGUIDs.push( cbk.value );
    } );

    return buildingGUIDs.toString();
}


function validateSize()
{
    handleBtn(false);

    if (getObj("txtBuildingCode") != null && getObj("txtBuildingCode").value == "")
    {
        handleBtn(true);
        return alertMsg('楼栋编号不能为空。', getObj("txtBuildingCode"));
    }
    if (getObj("txtBuildingName") != null && getObj("txtBuildingName").value == "")
    {
        handleBtn(true);
        return alertMsg('楼栋名称不能为空。', getObj("txtBuildingName"));
    }

    if (getObj("ddlBuildingTypeConfigItemGUID") != null && getObj("ddlBuildingTypeConfigItemGUID").value == "")// 
    {
        handleBtn(true);
        return alertMsg('建筑类型不能为空。', getObj("ddlBuildingTypeConfigItemGUID"));
    }

    if (getObj("ddlBuildingStatusConfigItemGUID") != null && getObj("ddlBuildingStatusConfigItemGUID").value == "")// 
    {
        handleBtn(true);
        return alertMsg('楼栋状态不能为空。', getObj("ddlBuildingStatusConfigItemGUID"));
    }
    if (getObj("ddlBuildingStructureConfigItemGUID") != null && getObj("ddlBuildingStructureConfigItemGUID").value == "")// 
    {
        handleBtn(true);
        return alertMsg('楼栋结构不能为空。', getObj("ddlBuildingStructureConfigItemGUID"));
    }
    //    if (getObj("txtStartTime") != null && getObj("txtStartTime").value == "")
    //    {
    //        handleBtn(true);
    //        return alertMsg('开工日期不能为空。', getObj("txtStartTime"));
    //    }
    //    if (getObj("txtCompletionDatePlan") != null && getObj("txtCompletionDatePlan").value == "")
    //    {
    //        handleBtn(true);
    //        return alertMsg('预计竣工日期不能为空。', getObj("txtCompletionDatePlan"));
    //    }
    //    if (getObj("txtStartSaleDate") != null && getObj("txtStartSaleDate").value == "")
    //    {
    //        handleBtn(true);
    //        return alertMsg('开盘日期不能为空。', getObj("txtStartSaleDate"));
    //    }
    //    if (getObj("txtCompletionDateReal") != null && getObj("txtCompletionDateReal").value == "")
    //    {
    //        handleBtn(true);
    //        return alertMsg('实际竣工日期不能为空。', getObj("txtCompletionDateReal"));
    //    }

        if (getObj("txtConsignDate") != null && getObj("txtConsignDate").value == "")
        {
            handleBtn(true);
            return alertMsg('交房日期不能为空。', getObj("txtConsignDate"));
        }

    //    if (getObj("txtForSaleNO") != null && getObj("txtForSaleNO").value == "")
    //    {
    //        handleBtn(true);
    //        return alertMsg('预售证编号不能为空。', getObj("txtForSaleNO"));
    //    }

    if (!isPositiveInt(getObj("txtSortNo").value))
    {
        handleBtn(true);
        return alertMsg('排序号必须为正整数。', getObj('txtSortNo'));
    }
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}


// 上传(队列中单个文件)完成事件
// fileRow为放置文件所在的表格行，其有rowIndex、filetitle、filename、filesize、thumbnailname等属性
// uploadID为控件的id，也即放置文件所在表格的id
function fileUploaded(fileRow, uploadID)
{
    trSinPic.style.display = "";
    getObj("imgSinPic").src = "../../.." + fileRow.thumbnailname;
}

function fileDeleted(fileRow, uploadID)
{
    trSinPic.style.display = "none";
}
