// 输入验证：文本框只能输入数字 且 处理退格键与浏览器的冲突
function InputCheck(current)
{
    //设置为“已改动”
   
    $(current).parent().parent().find("[signal='y']").attr("isalter", '1')
    $("input[name$='ForecastConstructionArea'],input[name$='ForecastInternalArea'],input[name$='ActualConstructionArea'],input[name$='ActualInternalArea']").keydown(
    function ()
    {       
        var e = event || window.event;
        var code = parseInt(e.keyCode);
        if ($(this).attr("readonly") && code == 8) {
            return false;
        }
        if ((code > 95 && code < 106) ||                  //小键盘上的0到9  
            (code > 47 && code < 60) ||                  //大键盘上的0到9  
             code == 8 || code == 9 || code == 46 || code == 37 || code == 39 || code == 110 || code == 190) {
            return true;
        } else {
            return false;
        }

    });
}

function areaOnBlur(ctrl)
{
    var ctrl=$(ctrl);    
    ctrl.val(getAccountingNum(ctrl.val(), $("#hidAreaSaveBit").val()));
}

// 项目变更，加载楼栋
function project_change()
{

    var projID = $("#ddlProject").val();
    if (projID.length != 36) {
        alert('请选择公司下的项目！');
        $("#ddlBuilding").empty();
        return;
    }

    //获取价格精度
    ajax(
           "VAreaAlter.aspx",
          { "action": "getPrecision", "projID": projID },
            "text",
           function (data, status)
           {
               data = $.stringToJSON(data);
               $("#hidAreaSaveBit").val(data.AreaSaveBit);
           },
           true,
           "POST"
        );

    var vCTID = "";
    var vCID = "";

    // post请求
    $.post('FillData.ashx', { action: 'CRM_BindBuildingOnly', ProjectGUID: projID }, function (data, textStatus) { loadBuildingInfo(data, vCTID + '|' + vCID) }, 'json');

}


var loadBuildingInfo = function (data, vID)
{
    if (!!data) {
        bindDdl(data, 'ddlBuilding', "", "SELECT");
    }
    else {
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

// 重新加载数据
function reloadData()
{
    var sProjectID = $("#ddlProject").val();
    var sBuildingIDList = $("#ddlBuilding").val();
    var sKey = $("#txtSearch").val();

    // 无条件时，省略第二个参数
    if (sBuildingIDList == null || sBuildingIDList.toUpperCase() == "NULL") {
        sBuildingIDList = "";
    }
    var query = { ProjectID: sProjectID, BuildingIDList: sBuildingIDList, Key: sKey };
    reloadGridData("idPager", query);

}


function OnBtnApprovalClick()
{
    var table = $("[id$='dgData']");
    var selectedRows = table.find("input[type='checkbox'][checked]");
    var arrayObj = new Array();
    selectedRows.each(function (i)
    {
        var RoomID = $(this).val();
        arrayObj[i] = { vRoomID: RoomID };
    })
    var strData = $.jsonToString(arrayObj);
    if (confirm("保存将覆盖原有数据，确定要继续操作吗？")) {
        //调用ajax新增并刷新jqgird
        ajax(
           "VAreaAlter.aspx",
          { "action": "Approval", "data": strData },
            "text",
           function (data)
           {
               if (data == "True") {
                   alert("保存成功！");
                   reloadData();
               }
               else {
                   alert('保存失败！');
               }
           },
           true,
           "POST"
        );
    }
}

// 保存：批量修改
function SaveOnChange()
{

    var alertRows = $("input[isalter='1']");
    if (alertRows.length < 1) {
        alertMsg("没有要操作的数据！");
        return;
    }
    var arrayObj = new Array();
    alertRows.each(function (i)
    {
        //$("input[name$='ForecastConstructionArea'],input[name$='ForecastInternalArea'],
        //input[name$='ActualConstructionArea'],input[name$='ActualInternalArea']").keydown(
        var ctrl = $(this).parent().parent();
        var ForecastConstructionArea = ctrl.find("input[name$='ForecastConstructionArea']").val();
        var ForecastInternalArea = ctrl.find("input[name$='ForecastInternalArea']").val();
        var ActualConstructionArea = ctrl.find("input[name$='ActualConstructionArea']").val();
        var ActualInternalArea = ctrl.find("input[name$='ActualInternalArea']").val();
        var AreaStatus = ctrl.find("input[name$='HidAreaStatus']").val();
        var RoomID = $(this).val();
        arrayObj[i] = { vRoomID: RoomID, vForecastConstructionArea: ForecastConstructionArea,
            vForecastInternalArea: ForecastInternalArea, vActualConstructionArea: ActualConstructionArea,
            vActualInternalArea: ActualInternalArea, vAreaStatus: AreaStatus
        };

    })

    var strData = $.jsonToString(arrayObj);
   // var vaction = typeIndex == 1 ? "priceAdjust" : "priceCheck";
    if (confirm("保存将覆盖原有数据，确定要继续操作吗？")) {
        //调用ajax新增并刷新jqgird
        ajax(
           "VAreaAlter.aspx",
          { "action": "save", "data": strData },
            "text",
           function (data)
           {
               if (data == "True") {
                   alert("保存成功！");
                   reloadData();
               }
               else {
                   alert('保存失败！');
               }
           },
           true,
           "POST"
        );
    }

   }

   function OpenImportPrice(priceType)
   {
       var sProjectID = $("#ddlProject").val();
       var sProjectName = $("#ddlProject").find("option:selected").text();
       var url = "VImportArea.aspx?ProjectID=" + sProjectID + "&ProjectName=" + encodeURI(sProjectName);
       
       openAddWindow(url, 750, 350);
   }

   // 单击全选复选框
   function selectAll(chk)
   {
       var chkArray = getObjs("chkIDV3");
       if (chkArray.length < 1) {
           return false;
       }
       for (var i = 0; i < chkArray.length; i++) {
           //跳过灰掉的行
           var row = chkArray(i).parentNode.parentNode;
           if ($(row).attr("disabled").toString() == "true") {continue;}
           if (chkArray(i).checked != chk.checked) {
               chkArray(i).checked = chk.checked;
               selectRowFromSelectAll(chkArray(i));
           }
       }
   }