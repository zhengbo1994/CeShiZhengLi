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

//新建
function btnAdd_Click()
{
	openAddWindow("VReservationEdit.aspx?EditType=add", 0, 0, "jqReservation");
}

//修改
function btnEdit_Click()
{
	openModifyWindow("VReservationEdit.aspx?EditType=edit", 0, 0, "jqReservation");
}

// 转认购
function btnToSubscription_Click()
{
    var reservationGUID = getParamValue('ID'),
        projectGUID = $( '#hidProjectGUID' ).val(),
		status = $('#hidStatus').val();

	if (status === "0")
	{
	    location.href = "../SalesOrder/VSalesOrderEdit.aspx?EditType=add&OrderType=S&ProjectGUID=" + projectGUID
            + "&ReservationGUID=" + reservationGUID
            + "&JQID=jqReservation";
	}
	else
	{
		return alertMsg("仅能对排号状态的预约单进行转认购操作");
	}
}

// 转签约
function btnToContract_Click()
{
    var reservationGUID = getParamValue( 'ID' ),
        projectGUID = $( '#hidProjectGUID' ).val(),
	    status = $('#hidStatus').val();

    if ( status === "0" )
    {
        location.href = "../SalesOrder/VSalesOrderEdit.aspx?EditType=add&OrderType=C&ProjectGUID=" + projectGUID
            + "&ReservationGUID=" + reservationGUID
            + "&JQID=jqReservation";
    }
    else
    {
        return alertMsg( "仅能对排号状态的预约单进行转签约操作" );
    }
}

//查看修改页
function renderLink(cellvalue, options, rowobject)
{
	var url = "'VReservationEdit.aspx?EditType=edit&JQID=jqReservation&ID=" + rowobject[0] + "'";
	return '<a  href="#" onclick="javascript:openWindow(' + url + ',0, 0)">' + cellvalue + '</a>';
}

function btnInvalid_Click()
{
	var url = getCurrentUrl(),
        ReservationGUIDs = getJQGridSelectedRowsID('jqReservation', true);

	if (!ReservationGUIDs || !ReservationGUIDs.length)
	{
		alert("请先选择预约单。");
		return false;
	}

	if (!confirm("确认要作废您所选择的预约单吗？"))
	{
		return false;
	}

	ajax(url,
    {
    	action: 'InvalidReservation',
    	ReservationGUIDs: ReservationGUIDs.join()
    }, 'json', function (data, textStatus)
    {
    	saveErrorMsg = data;
    	if (!!saveErrorMsg)
    	{
    		alert(saveErrorMsg);
    	}
    	else
    	{
    		alert("预约单作废成功。");
    		reloadData();
    	}
    }, true, "POST");
}

function reloadData()
{
	var jqObj = $('#jqReservation', document);

	if (_PageMaster.isSearching)
	{
		return false;
	}
	else
	{
		_PageMaster.isSearching = true;

	}
	var ProjectGUID = $("#ddlProjectGUID").val();
	var vKey = $("#txtKey").val();
	var ReservationTimeStart = $("#txtReservationTimeStart").val();
	var ReservationTimeEnd = $("#txtReservationTimeEnd").val();
	var ReservationStatus = $("#ddlReservationStatus").val();
	var ClientName = $("#txtClientName").val();

	if (ReservationTimeStart != "" && ReservationTimeEnd != "" && compareDate(ReservationTimeStart, ReservationTimeEnd) == -1)
	{
		_PageMaster.isSearching = false;
		return alertMsg("结束时间必须大于开始时间。", getObj("txtReservationTimeEnd"));
	}

	var query = {
		ProjectGUID: ProjectGUID,
		SearchText: vKey,
		ReservationTimeStart: ReservationTimeStart,
		ReservationTimeEnd: ReservationTimeEnd,
		ReservationStatus: ReservationStatus,
		ClientName: ClientName
	};

	if (loadJQGrid('jqReservation', query))
	{
		refreshJQGrid('jqReservation');
	}
}

function customGridComplete()
{
	_PageMaster.isSearching = false;
}


//---------  修改页方法  -----------//
// 页面加载控制器
function pageLoadingController()
{
	var roomGUID = getParamValue('RoomGUID'),
		editType = getParamValue('EditType');

	if (editType.toLocaleLowerCase() == 'add')
	{
		if (!!roomGUID)
		{
			pageLoadByRoom(roomGUID);
		}
		else
		{
			normalPageLoad();
		}
	}
	else
	{
		normalPageLoad();
	}

	setCtrlsEnable();
}


function pageLoadByRoom(roomGUID)
{
	$('#btnSelectProject,#btnSelectRoom').attr('disabled', 'disabled');
	getRoomInfo(roomGUID, function (data)
	{
	    if ( data )
	    {
	        var roomInfo = {
	            RoomGUID: data.RoomGUID,
	            RoomName: data.RoomName
	        };
	        var projectInfo = {
	            ProjectID: data.ProjectGUID,
	            ProjectName: data.ProjectName
	        };

	        fillRoomInfo( roomInfo );
	        fillProjectInfo( projectInfo );

	        GetDefaulConfigData();
	    }
	});
}


function normalPageLoad()
{
	resetTxtRoomReservationNOAttr();
}


// 设置表单中控件是否可编辑
function setCtrlsEnable()
{
	var pageEditable = $('#hidPageEditable').val();

	if (pageEditable == "N")
	{
		disabledFormElements('divForm');
	}
}

// 选择项目方法
function selectProject()
{
	var rValue = openModalWindow('../../../../Common/Select/CRM/VSelectProjectInfo.aspx?IsMulti=N', 800, 600);

	if (!rValue)
	{
		return;
	}

	fillProjectInfo(rValue);
	GetDefaulConfigData();
}

// 填充项目信息方法
function fillProjectInfo(projectInfo)
{
    var projectID = !!projectInfo ? projectInfo.ProjectID : "",
		projectName = !!projectInfo ? projectInfo.ProjectName : "";
	
    $( '#hidProjectGUID' ).val( projectID );
    $( '#txtProjectName' ).val( projectName );
}

//选择客户
function selectClient()
{
	var txtProjectName = $('#txtProjectName'),
		projectGUID = $('#hidProjectGUID').val(),
		projectName = txtProjectName.val();

	if (!projectGUID)
	{
		return alertMsg("请先选择项目。", txtProjectName[0]);
	}

	openWindow('../../../../Common/Select/CRM/VSelectCustomerInfo.aspx?ClientType=Client&ProjectGUID=' + projectGUID +
	 '&ProjectName=' + encodeURI(projectName) +
	 '&clientInfoFn=getClientInfo', 800, 600);
}

// 填充客户信息
function fillClientInfo(clientData)
{
	var clientBaseGUID = !!clientData ? clientData.ClientBaseGUID : "",
		clientGUID = !!clientData ? clientData.ClientGUID : "",
        clientName = !!clientData ? clientData.ClientName : "";

	$('#hidClientBaseGUID').val(clientBaseGUID);
	$('#hidClientGUID').val(clientGUID);
	$('#txtClientName').val(clientName);
}

// 获取客户信息
function getClientInfo(clientData)
{
	var clientGUID = !!clientData ? clientData.ClientGUID : "";
	var clientBaseGUID = !!clientData ? clientData.ClientBaseGUID : "";

	ajaxRequest('FillData.ashx',
    {
    	action: "CRM_GetClientBaseInfo",
    	ClientBaseID: clientBaseGUID
    },
    'json', function (data, status)
    {
    	var clientBaseInfo = !!data ? data[0] : null;
    	if (clientBaseInfo != null)
    	{
    		mergeJsonData(clientBaseInfo, { ClientGUID: clientGUID }, true);
    	} 

    	fillClientInfo(clientBaseInfo);
    });
	return false;
}

// 验证当前房间是否可预约
function isValidReservationRoom( roomObj )
{
    var isValid = true;
    if ( roomObj )
    {
        var selectedRoomSalesStatus = roomObj[0].SaleStatus,
            isAttachRoom = roomObj[0].IsAttachedRoom;
        
        if ( !/[34]/.test( selectedRoomSalesStatus ) )
        {
            isValid = isValid && alertMsg( "只能预约待售状态的房源" );
        }

        if ( isAttachRoom == "Y" )
        {
            isValid = isValid && alertMsg( "不能预约附属房产" );
        }
    }
    else
    {
        isValid = false;
    }

    return isValid;
}

//选择房间
function selectRoom()
{
	var projectGUID = $('#hidProjectGUID').val();
	var data = openModalWindow('../../../../Common/Select/CRM/VSelectRoomInfo.aspx?ProjectGUID=' + projectGUID + '&validFn=isValidReservationRoom', 800, 600);

	if (!data)
	{
		return;
	}

	fillRoomInfo(data[0]);

	GetDefaulConfigData();
}


// 获取房间信息
function getRoomInfo(roomGUID, callback)
{
	ajaxRequest('FillData.ashx', { action: "CRM_GetRoomInfo", RoomGUID: roomGUID },
    'json', function (data, status)
    {
    	if (typeof callback == 'function')
    	{
    		callback(data[0]);
    	}
    });
}

function fillRoomInfo(roomInfo)
{
	var roomName = !!roomInfo ? roomInfo.RoomName : "",
		roomGUID = !!roomInfo ? roomInfo.RoomGUID : "";

	$('#txtRoomName').val(roomName);
	$('#hidRoomGUID').val(roomGUID);

	resetTxtRoomReservationNOAttr();
}

function resetTxtRoomReservationNOAttr()
{
	var RoomGUID = $('#hidRoomGUID').val(),
        txtRoomReservationNO = $('#txtRoomReservationNO');
	if (!RoomGUID)
	{
		txtRoomReservationNO.val('').removeClass().addClass('graytext').attr('readonly', 'readonly').unbind('blur');
	}
	else
	{
		txtRoomReservationNO.removeClass().addClass('text').removeAttr('readonly').bind('blur', function () { setRound(0, 0, 99999); });
	}
}

function GetDefaulConfigData()
{
	var url = getCurrentUrl(),
        ID = getParamValue("ID"),
        ClientGUID = $('#hidClientGUID').val(),
        OriginProjectGUID = $('#hidOriginProjectGUID').val(),
        OriginRoomGUID = $('#hidOriginRoomGUID').val(),
        ProjectGUID = $('#hidProjectGUID').val(),
        RoomGUID = $('#hidRoomGUID').val();

	ajax(url,
    {
    	action: 'GetDefaultData',
    	ID: ID,
    	OriginProjectGUID: OriginProjectGUID,
    	OriginRoomGUID: OriginRoomGUID,
    	ProjectGUID: ProjectGUID,
    	ClientGUID: ClientGUID,
    	RoomGUID: RoomGUID
    }, 'json', function (data, textStatus)
    {
    	if (!!data)
    	{
    		var txtProjectReservationNO = $('#txtProjectReservationNO'),
                txtRoomReservationNO = $('#txtRoomReservationNO'),
                txtReservationTime = $('#txtReservationTime'),
                txtReservationInvalidTime = $('#txtReservationInvalidTime'),
                txtForPayReservationMoney = $('#txtForPayReservationMoney'),

                strReservationTime,
                dtReservationTime,
                dtReservationInvalidTime,
                iReservationExpiredDays,
                dbReservationStandardDeposit;

    		// 项目或房间改变时，重新设置排号信息
    		if (OriginProjectGUID != ProjectGUID)
    		{
    			txtProjectReservationNO.val(data.ProjectReservationNO);
    		}
    		if (OriginRoomGUID != RoomGUID)
    		{
    			txtRoomReservationNO.val(data.RoomReservationNO == "0" ? "" : data.RoomReservationNO);
    		}

    		// 设置预约失效信息
    		if (!!txtReservationTime.val() && !isNaN(data.ReservationExpiredDays))
    		{
    			strReservationTime = txtReservationTime.val();
    			dtReservationTime = new Date(strReservationTime.split('-')[0], strReservationTime.split('-')[1] - 1, strReservationTime.split('-')[2]);
    			dtReservationInvalidTime = dtReservationTime;
    			dtReservationInvalidTime.addDays(data.ReservationExpiredDays);

    			txtReservationInvalidTime.val(dtReservationInvalidTime.Format('yyyy-MM-dd'));
    		}

    		// 设置预约金信息
    		if (!isNaN(data.ForPayReservationMoney) && data.ForPayReservationMoney > 0)
    		{
    			txtForPayReservationMoney.val(data.ForPayReservationMoney);
    		}
    	}

    }, true, 'POST');
}


function checkSaveIsEnable()
{
	var url = getCurrentUrl(),
        ID = getParamValue("ID"),
        ReservationNo = $('#txtReservationNO').val(),
        ClientGUID = $('#hidClientGUID').val(),
        ProjectGUID = $('#hidProjectGUID').val(),
        RoomGUID = $('#hidRoomGUID').val(),
        ProjectReservationNO = $('#txtProjectReservationNO').val(),
        RoomReservationNO = $('#txtRoomReservationNO').val(),
        blReservationNoDuplicate = false,
        saveErrorMsg = "未知错误。";

	ajax(url,
    {
    	action: 'checkSaveIsEnable',
    	ID: ID,
    	ReservationNo: ReservationNo,
    	ProjectGUID: ProjectGUID,
    	ClientGUID: ClientGUID,
    	RoomGUID: RoomGUID,
    	ProjectReservationNO: ProjectReservationNO,
    	RoomReservationNO: RoomReservationNO
    }, 'text', function (data, textStatus)
    {
    	saveErrorMsg = data;
    }, false, 'POST');
	return saveErrorMsg;
}

//选择置业顾问
function selectClerkStation()
{
	var vValue = openModalWindow('../../../../Common/Select/VSelectMultiStation.aspx?From=Project&SelectMode=Single&CorpID=' + getObj('hidProjectGUID').value,
        window.screen.width, window.screen.height);

	if (!!vValue)
	{
		getObj("hidClerkAccountGUID").value = vValue.split('|')[11];
		getObj("txtClerkEmployeeName").value = vValue.split('|')[8];
	}
}

//显隐区块
function setVisible(areaName, tr)
{
	tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
}

function validate()
{
	var isValid = true;
	setBtnEnabled(['btnSaveOpen', 'btnSaveClose'], false);
	if ($.ideaValidate())
	{
		var RoomGUID = $('#hidRoomGUID').val();
		var RoomReservationNO = $('#txtRoomReservationNO').val();
		var StartDate = $("#txtReservationTime").val();
		var EndDate = $("#txtReservationInvalidTime").val();
		var saveErrorMsg = "";

		if (RoomGUID != "")
		{
			if (RoomReservationNO == "")
			{
				isValid = alertMsg("选择房间后，房间排号不可为空。", getObj("txtRoomReservationNO"));
			}
		}

		if (isValid && compareDate(StartDate, EndDate) == -1)
		{
			isValid = alertMsg("失效日期必须大于预约日期。", getObj("txtReservationInvalidTime"));
		}

		saveErrorMsg = checkSaveIsEnable();
		if (isValid && !!saveErrorMsg)
		{
			isValid = alertMsg(saveErrorMsg, null);
		}

		setBtnEnabled(['btnSaveOpen', 'btnSaveClose'], true);
		return isValid;
	}
	else
	{
		setBtnEnabled(['btnSaveOpen', 'btnSaveClose'], true);
		return false;
	}
}




// 获取不包含参数的url字符串
function getCurrentUrl()
{
	return location.href.replace(location.search, "");
}