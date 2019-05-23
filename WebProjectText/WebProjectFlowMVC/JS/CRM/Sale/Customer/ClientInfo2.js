// JScript 文件

function reloadData()
{
    var jqObj = $('#jqData', document);

    var sProjectGUID = $("#ddlProjectGUID").val();
    var sIsBusinessClient = $("#ddlIsBusinessClient").val(); //$("#rdlIsBusinessClient input:checked").val(); //$("option:selected","#rdlIsBusinessClient").val();//
    var sKey = getObj("txtKey").value;
    var sDel = getObj("txtDel").value;
    var sClientName = getObj("txtClientName").value;
    var sCredentialsNumber = getObj("txtCredentialsNumber").value;

    jqObj.getGridParam('postData').ProjectGUID = sProjectGUID;
    jqObj.getGridParam('postData').IsBusinessClient = sIsBusinessClient;
    jqObj.getGridParam('postData').Key = sKey;
    jqObj.getGridParam('postData').Del = sDel;
    jqObj.getGridParam('postData').ClientName = sClientName;
    jqObj.getGridParam('postData').CredentialsNumber = sCredentialsNumber;

    refreshJQGrid('jqData');
}

function showBrowseTab( index )
{
    // 调用这个方法，显示所选中的项
    selectTab( index, "TabInfo" );

    for ( var i = 0; i <= 4; i++ )
    {
        getObj( "div" + i ).style.display = "none";
    }

    getObj( "div" + index ).style.display = "block";

    if ( index == 2 )
    {
        var sClientGUID = getObj( 'hdClientGUID' ).value;

        var query = { "ClientGUID": sClientGUID };

        if ( loadJQGrid( "jqData", query ) )
        {
            refreshJQGrid( "jqData" );
        }
    }
}

// 设置到访、来电相关
function setVistTimes( vtype )
{
    //var ts = parseInt( $( "#txtVisitCount" ).val() )
    var rdl = $( "#rdlCallsType" );

    if ( vtype == 1 )
    {
        $( "#ddlClientStatus" ).val( "2" );
        //$( "#rdlCallsType" ).val( "1" );
        rdl.find( "input[value=1]" ).attr( "checked", true );

        //$( "#txtVisitCount" ).val(( ts + 1 ).toString() );

    }
    else if ( vtype == 2 )
    {
        $( "#ddlClientStatus" ).val( "1" );
        //$( "#rdlCallsType" ).val( "2" );
       rdl.find( "input[value=2]" ).attr( "checked", true );

       // $( "#txtVisitCount" ).val(( ts - 1 ).toString() );
    }
}

function addCustomerInfo()
{
    var sProjectGUID = getObj("ddlProjectGUID").value;
    openAddWindow("VClientInfoAdd2.aspx?ProjectGUID=" + sProjectGUID, 1000, 800, 'jqData');
    //        openModifyWindow("VClientInfoAdd.aspx?ProjectGUID=" + $("#ddlProjectGUID").val(), 800, 600, "jqData");
}

function editCustomerInfo()
{
    var sProjectGUID = getObj("ddlProjectGUID").value;
    openModifyWindow("VClientInfoAdd2.aspx?ProjectGUID=" + sProjectGUID, 1000, 800, 'jqData');
    //        openModifyWindow("VClientInfoAdd.aspx?ProjectGUID=" + $("#ddlProjectGUID").val(), 800, 600, "jqData");
}

function showCustomerInfo(cellvalue, options, rowobject)
{
    var sProjectGUID = getObj("ddlProjectGUID").value;
    var sProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
    var url = "'VClientInfoAdd2.aspx?ID=" + rowobject[0] + "&ProjectGUID=" + sProjectGUID + "&JQID=" + "jqData'";
    return '<a href="javascript:openWindow(' + url + ',1000,800)">' + cellvalue + '</a>';
}

function validateSize()
{
    //0,需求业态取值
    getRowsValues();
    //1，防止重复提交
    //2,判断必填项
    //3，验证格式
    //3.1,基础信息验证
    //3.2,详细资料验证
    //3.3，机会信息验证
    //3.4，需求意向验证**
    //3.5，跟进信息登记验证
    handleBtn(false);

    //验证意向需求是否有全空的行
    var hdProduct = getObj("hdProduct").value.split(",");
    var hdRoom = getObj("hdRoom").value.split(",");
    var hdArea = getObj("hdArea").value.split(",");
    for (j = 0; j < hdProduct.length; j++)
    {
        if (j != 0 && hdProduct[j] == "00000000-0000-0000-0000-000000000000" && hdRoom[j] == "00000000-0000-0000-0000-000000000000" && hdArea[j] == "00000000-0000-0000-0000-000000000000")
        { handleBtn(true); return alertMsg('单行需求意向至少选择一项或者删除该行。'); }
    }

    if (getObj("txtClientName").value == "") //
    {
        handleBtn(true);
        return alertMsg('客户名称不能为空。', getObj("txtClientName"));
    }

    if (trim(getObj("txtMobileNumber").value) == "" && trim(getObj("txtHomeNumber").value) == "" && trim(getObj("txtOfficeNumber").value) == "") //
    {
        handleBtn(true);
        return alertMsg('至少填写一种电话联系方式。', getObj("txtMobileNumber"));
    }

    if (!isPositiveInt(getObj("txtSortNo").value))
    {
        handleBtn(true);
        return alertMsg('排序号必须为正整数。', getObj('txtSortNo'));
    }

    if (getObj("rdlCallsTypeConfigItemGUID") != null && getObj("rdlCallsTypeConfigItemGUID").value == "")// 
    {
        handleBtn(true);
        return alertMsg('跟进方式不能为空。', getObj("rdlCallsTypeConfigItemGUID"));
    }

    if (getObj("txtCallsContent").value == "") //
    {
        handleBtn(true);
        return alertMsg('跟进内容不能为空。', getObj("txtCallsContent"));
    }



    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

function loadClientCallsReturnData(allData)
{
    var tbList = getObj("tbClientCallsReturnList");
    tbList.style.display = "";
    var oriLength = tbList.rows.length;
    //        var prefixID = getUniqueKey('ClientGUID');
    if (allData.Count > 0)
    {
        var cnt = allData.Count;
        for (var i = 0; i < cnt; i++)
        {
            var row = tbList.insertRow();

            try
            {

                // 序号
                cell = row.insertCell(0);
                cell.align = "center";
                cell.innerText = allData.Nodes[i].CallsReturnNO;
                // 跟进内容
                cell = row.insertCell(1);
                cell.align = "left";
                cell.innerText = allData.Nodes[i].CallsContent;
                // 购房意向
                cell = row.insertCell(2);
                cell.align = "center";
                cell.innerText = allData.Nodes[i].BuyIntention;
                // 跟进方式
                cell = row.insertCell(3);
                cell.align = "center";
                cell.innerText = allData.Nodes[i].CallsType;
                // 备注说明
                cell = row.insertCell(4);
                cell.align = "left";
                cell.innerText = allData.Nodes[i].Remark;
                // 跟进人
                cell = row.insertCell(5);
                cell.align = "center";
                cell.innerText = allData.Nodes[i].CallsEmployeeName;


            }
            catch (err)
            {
                alert(err.message)
            }
        }

        //hiddenTab(tbList)
        setTableRowAttributes(tbList);

    }
}

//显隐区块
function setVisible(areaName, tr)
{
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
}


//选择机会客户
function selectClientInfo()
{
    var sProjectGUID = getObj("hdProjectGUID").value;
    var sProjectName = getObj("hdProjectName").value;
    openWindow('../../../Common/Select/CRM/VSelectCustomerBaseInfo.aspx?ProjectGUID=' + sProjectGUID + "&ProjectName=" + encodeURIComponent(sProjectName), 1000, 800);


}

// 选择基础客户
function selectBaseClient(callback)
{
    var sProjectGUID = getObj("hdProjectGUID").value;
    var sProjectName = getObj("hdProjectName").value;
    var data = openModalWindow('../../../Common/Select/CRM/VSelectCustomerBaseInfo.aspx?ProjectGUID=' + sProjectGUID + "&ProjectName=" + encodeURIComponent(sProjectName), 1000, 800);
    if (!data)
    {
        return false;
    }
    else
    {
        var clientBaseGUID = data.ClientBaseGUID;
        if (data.ClientName == getObj("txtClientName").value)
        {
            return alertMsg('推荐人不能选择客户本人。', getObj('txtRecommendClientName'));
        }
        getObj("hidRecommendClientGUID").value = data.ClientBaseGUID;
        getObj("txtRecommendClientName").value = data.ClientName;
        //  getClientBaseInfo(clientBaseGUID, typeof callback == 'function' ? callback : new Function());
    }
}


function SetClientValue(data)
{

    getObj("hidRecommendClientGUID").value = data.ClientBaseGUID;
    getObj("txtRecommendClientName").value = data.ClientName;
}




//选择经办人
function seleSaleAccountName()
{
    /// <reference path="../../../../Common/Select/VSelectSingleAccount.aspx" />

    var corpID = ''; //暂时不理 '<% = strCorpID %>';
    //        var rValue = openModalWindow('../../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID=' + corpID, 800, 600);     

    //        if (rValue != "undefined" && rValue != null)
    //        {
    //            getObj("hidSaleStationName").value = rValue.split('|')[0];
    //            getObj("txtSaleStationName").value = rValue.split('|')[1];
    //        }
    var rValue = openModalWindow('../../../Common/Select/VSelectSingleAccount.aspx', 800, 600);

    if (!!rValue)
    {

        getObj("hidSaleAccountName").value = rValue.ID;
        getObj("txtSaleAccountName").value = rValue.Name;

    }
    //        alert(rValue)
    //        if (typeof rValue != "undefined" && rValue != null)
    //        {
    //             alert(rValue.value)
    //             alert(rValue.split('|')[0])
    //             alert(rValue.split('|')[1])
    //             getObj("hidSaleAccountName").value = rValue.split('|')[0];
    //             getObj("txtSaleAccountName").value = rValue.split('|')[1];
    //         }
}

//选择需求业态\需求户型 \需求面积 
function SelectConfig(ConfigCode)
{

    var rValue = openModalWindow('../../../Common/Select/CRM/VSelectConfig.aspx?IsMulti=Y&ConfigCode=' + ConfigCode, 800, 600);


    if (rValue != "undefined" && rValue != null)
    {
        rValue = rValue.substr(0, rValue.length - 1);

        var IDs = "";
        var Names = "";
        var tmp = rValue.split('|');
        for (var i = 0; i < tmp.length; i++)
        {
            IDs += "," + tmp[i].split(',')[0];
            Names += "," + tmp[i].split(',')[1];
        }
        if (Names)
        {
            Names = Names.substr(1);
        }
        if (IDs)
        {
            IDs = IDs.substr(1);
        }

        switch (ConfigCode)
        {
            case "3018":
                getObj("hdRoomStructureConfigItemGUIDList").value = IDs;
                getObj("txtRoomStructureConfigItemGUIDList").value = Names;
                break;
            case "3019":
                getObj("hdRoomAreaConfigItemGUIDList").value = IDs;
                getObj("txtRoomAreaConfigItemGUIDList").value = Names;
                break;
            case "3030":

                getObj("hdProductConfigItemGUIDList").value = IDs;
                getObj("txtProductConfigItemGUIDList").value = Names;
                break;
            case "3026":
                getObj("hdDemandProjectGUIDList").value = IDs;
                getObj("txtDemandProjectGUIDList").value = Names;
                break;

        }

    }
}

//需求意向
var cGetRow = -99999;
function insertrow()
{
    var newrow = document.getElementById("ACE_HIDDEN_TABLE").rows[0].cloneNode(true); //克隆一行
    document.getElementById("newTB").appendChild(newrow); //添加刚才克隆的一行
    //alert(document.all("newTB").innerHTML);
}

function GetRow()
{
    //获得行索引
    //两个parentElement分别是TD和TR，rowIndex是TR的属性
    //this.parentElement.parentElement.rowIndex
    cGetRow = window.event.srcElement.parentElement.parentElement.rowIndex;

    DelRow(cGetRow); //点击checkbox时，直接删除行。
}
function DelRow(iIndex)
{
    //删除一行
    if (iIndex == -99999)
    {
        alert("系统提示：没有选中行号!");
    } else
    {
        newTB.deleteRow(iIndex);
        iIndex == -99999; //将rowIndex恢复默认值。
    }
}

function getRowsValues()
{
    //获取动态增加的选项：
    //var Productitem = $("#newTB :selected");
    var Productitem = $("select[name=ctl00$FormArea$ddldynmicselectProduct] option[selected]");
    var RoomItem = $("select[name=ctl00$FormArea$ddldynmicselectRoom] option[selected]");
    var AreaItem = $("select[name=ctl00$FormArea$ddldynmicselectArea] option[selected]");
    //获取默认的一行：
    var ProductitemDefault = $("select[name=ctl00$FormArea$selectProduct] option[selected]");
    var RoomItemDefault = $("select[name=ctl00$FormArea$selectRoom] option[selected]");
    var AreaItemDefault = $("select[name=ctl00$FormArea$selectArea] option[selected]");
    //构造业态项：
    var product = ProductitemDefault.val(), room = RoomItemDefault.val(), area = AreaItemDefault.val();
    //跳过模板行的值
    var cntP = 0, cntR = 0, cntA = 0;
    Productitem.each(function ()
    {
        cntP++;
        if (cntP != 1)
        {
            product += ",";
            product += $(this).val();
        }
    });
    //构造户型项：
    RoomItem.each(function ()
    {
        cntR++;
        if (cntR != 1)
        {
            room += ",";
            room += $(this).val();
        }
    });
    //构造面积项：
    AreaItem.each(function ()
    {
        cntA++;
        if (cntA != 1)
        {
            area += ",";
            area += $(this).val();
        }
    });

    //设置隐藏域的值

    $("#hdProduct").val(product);
    $("#hdRoom").val(room);
    $("#hdArea").val(area);


}

function myGetRow(htmlcontrol)
{
    $(htmlcontrol).remove();
}



    