// JScript 文件

function reloadData()
{
//    if (window["TabIndex"] == "2")
//    {
//    var sClientGUID = <%=Request["ClientGUID"] %>;
//    alert(sClientGUID)
//        var query = { "ClientGUID": sClientGUID };
//        if (loadJQGrid("jqData", query))
//        {
//            refreshJQGrid("jqData");
//        }
//        window["TabIndex"] = "";
//    }
//    else
//    {
        var jqObj = $('#jqData', document);

        var sProjectGUID = $("#ddlProjectGUID").val();
        //    alert($("#rdlIsBusinessClient")[0].outerHTML)
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
//    }
}


    function addCustomerInfo() {
        var sProjectGUID = getObj("ddlProjectGUID").value;
        openAddWindow("VClientInfoAdd2.aspx?ProjectGUID=" + sProjectGUID, 1000, 800, 'jqData');
//        openModifyWindow("VClientInfoAdd.aspx?ProjectGUID=" + $("#ddlProjectGUID").val(), 800, 600, "jqData");
    }

    function editCustomerInfo()
    {
        var sProjectGUID = getObj("ddlProjectGUID").value;
        openModifyWindow("VClientInfoAdd.aspx?ProjectGUID=" + sProjectGUID, 1000, 800, 'jqData');
        //        openModifyWindow("VClientInfoAdd.aspx?ProjectGUID=" + $("#ddlProjectGUID").val(), 800, 600, "jqData");
    }
   
    function showCustomerInfo(cellvalue, options, rowobject)
    {
        var sProjectGUID = getObj("ddlProjectGUID").value;
        var sProjectName = trim($("#ddlProjectGUID").find("option:selected").text());
        var url = "'VClientInfoAdd.aspx?ID=" + rowobject[0] + "&ProjectGUID=" + sProjectGUID + "&JQID=" + "jqData'";
        return '<a href="javascript:openWindow(' + url + ',800,600)">' + cellvalue + '</a>';
    }

    function validateSize()
    {
        //1，防止重复提交
        //2,判断必填项
        //3，验证格式
        //3.1,基础信息验证
        //3.2,详细资料验证
        //3.3，机会信息验证
        //3.4，需求意向验证**
       //3.5，跟进信息登记验证
        handleBtn(false);      
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

        if (getObj("ddlCallsTypeConfigItemGUID") != null && getObj("ddlCallsTypeConfigItemGUID").value == "")// 
        {
            handleBtn(true);
            return alertMsg('跟进方式不能为空。', getObj("ddlCallsTypeConfigItemGUID"));
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
                    cell.align = "left";
                    cell.innerText = allData.Nodes[i].BuyIntention;
                    // 跟进方式
                    cell = row.insertCell(3);
                    cell.align = "left";
                    cell.innerText = allData.Nodes[i].CallsTypeConfigItemName;
                    // 备注说明
                    cell = row.insertCell(4);
                    cell.align = "left";
                    cell.innerText = allData.Nodes[i].Remark;
                    // 跟进人
                    cell = row.insertCell(5);
                    cell.align = "left";
                    cell.innerText = allData.Nodes[i].CallsStationName;
                  

                }
                catch (err)
                {
                    alert(err.message)
                }
            }

            //hiddenTab(tbList)
            setTableRowAttributes(tbList);

        }
        else
        {
            $("#divMenu").find("li:gt(0)").hide(); //新增页面隐藏页签
        }
       
    }

    //显隐区块
    function setVisible(areaName, tr)
    {
        tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
    }


//    //选择客户
//    function selectClientName()
//    {
//        var sProjectGUID = getObj("hdProjectGUID").value;
//        var sProjectName = getObj("hdProjectName").value;
//        var rValue = openWindow('../../../Common/Select/CRM/VSelectCustomerInfo.aspx?ClientType=RecommendClient&ProjectGUID=' + sProjectGUID + "&ProjectName=" + encodeURIComponent(sProjectName), 1000, 800);
//     
////        getObj("hidRecommendClientGUID").value = rValue.ClientBaseGUID;
////        getObj("txtRecommendClientName").value = rValue.ClientName;
////        if (!rValue)
////            return;
//    }
    //选择客户
    function selectClientInfo()
    {
        var sProjectGUID = getObj("hdProjectGUID").value;
        var sProjectName = getObj("hdProjectName").value;
        openWindow('../../../Common/Select/CRM/VSelectCustomerInfo.aspx?ProjectGUID=' + sProjectGUID + "&ProjectName=" + encodeURIComponent(sProjectName), 1000, 800);
       

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
          
            switch(ConfigCode)
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

    