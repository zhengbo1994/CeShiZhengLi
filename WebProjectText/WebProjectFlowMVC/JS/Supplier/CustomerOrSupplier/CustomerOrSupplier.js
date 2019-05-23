
//验证
function validateSize()
{
    handleBtn(false);    
    if(trim(getObj("txtCOSName").value) == "")
    {
        handleBtn(true); 
        showTab(0);       
        return alertMsg(" 供应商名称不能为空。", getObj("txtCOSName"));
    }
    if ($("#hidIsCOSNo").val()=="Y"&&getObj("txtCOSNo").value== "")
    {
        handleBtn(true);
        showTab(0);
        return alertMsg(" 供应商编号不能为空。", getObj("txtCOSNo"));
    } 
    if(getObj("ddlArea").value == "")
    {
        handleBtn(true);
        showTab(0);
        return alertMsg(" 请选择所属区域。", getObj("ddlArea"));            
    } 
    if(getObj("ddlCOSRegSort").value == "")
    {
        handleBtn(true);
        showTab(0);
        return alertMsg(" 请选择注册类别。", getObj("ddlCOSRegSort"));
    } 
    var rbs= rblIsAppertain.getElementsByTagName("input");
    if (rbs[0].checked && getObj("txtAppertainMan").value == "")
    {
         handleBtn(true);
         showTab(0);
         return alertMsg("挂靠人不能为空。",getObj("txtAppertainMan"));
    }
    
    if($("#hidIsZT").val() == "Y")
    {
        //中铁需要是否选择服务与产品类型
        if(!ckCOSProductServiceClassIsSelect())
        {
            handleBtn(true);
            showTab(4);
            return alertMsg("请选择服务与产品类型");
        }
    }

    SetAllGridValue();
    checkCOSProductServiceClass();
    checkTCOSQualification();
    return true;

} 
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSave"), enabled);
    setBtnEnabled(getObj("btnClose"), enabled);
}

//选择母公司
function btnSelectParentCOS()
{
    var vReturn= openModalWindow('../../Common/Select/VSelectSingleCOS.aspx?Action=AddCOS&COSID='+$('#hidcosid').val(),900,600);
    if(vReturn != null)
    {
        $('#hidParentCOSID').val(vReturn.split('|')[0]);
        $('#hidParentCOSName').val(vReturn.split('|')[1]);
        $('#txtParentCOSName').val(vReturn.split('|')[1]);
    }
}

//浏览供应商
function viewCustomerOrSupplier(id)
{
    openWindow('VCustomerOrSupplierBrowse.aspx?COSID='+id,screen.availWidth,screen.availHeight);
}

//新增
function addCustomerOrSupplier()
{
    openAddWindow("VCustomerOrSupplierAdd.aspx", screen.availWidth, screen.availHeight, "jqCustomerOrSupplier");
}
//修改
function editCustomerOrSupplier()
{
    openModifyWindow("VCustomerOrSupplierEdit.aspx", screen.availWidth, screen.availHeight, "jqCustomerOrSupplier")
}
//删除
function delCustomerOrSupplier()
{
    openDeleteWindow("CustomerOrSupplier", 2, "jqCustomerOrSupplier");
}
//导入
function importCustomerOrSupplier()
{
   openAddWindow("VCustomerOrSupplierImport.aspx", 450, 150, "jqCustomerOrSupplier")
}

/* 刷新jqGrid */
function reloadData()
{   
    $('#jqCustomerOrSupplier').getGridParam('postData').COSRSID = getObj("ddlCOSRegSort").value;
    $('#jqCustomerOrSupplier').getGridParam('postData').ComprehensiveCOSLID = getObj("ddlCompCOSLevel").value; 
    $('#jqCustomerOrSupplier').getGridParam('postData').COSDBType = getObj("ddlEvaluationState").value;
    $('#jqCustomerOrSupplier').getGridParam('postData').COSID = getObj("ddlBusinessSort").value;
    $('#jqCustomerOrSupplier').getGridParam('postData').KeyWord = getObj("txtKey").value;
    $('#jqCustomerOrSupplier').getGridParam('postData').COSQName = getObj("txtCOSQName").value;
    $('#jqCustomerOrSupplier').trigger('reloadGrid');
    
}

/* 重写refreshJQGrid */
function refreshJQGrid(id)
{
    reloadData();
}
//查看供应商信息
function renderCustomerOrSupplier(cellvalue,options,rowobject)
{
    var url = "'VCustomerOrSupplierBrowse.aspx?COSID="+rowobject[0]+"'";
    return '<div class="nowrap"><a  href="javascript:window.openWindow('+url+',800,600)">'+cellvalue+'</a></div>' ;
}
//“是否合作过”列，查看供应商信息
function renderIsConsociation(cellvalue,options,rowobject)
{
    if (cellvalue == "是")
    {
        var url = "'VCustomerOrSupplierBrowse.aspx?COSID=" + rowobject[0] + "&vShowContractTab=yes'";
        return '<div class="nowrap"><a  href="javascript:window.openWindow(' + url + ',800,600)">' + cellvalue + '</a></div>';
    }
    else
    {
        return '<div class="nowrap">'+cellvalue+'</div>'; 
    }
}
//是否挂靠判断
function rblIsAppertain_Click()
{
    var rbs= rblIsAppertain.getElementsByTagName("input");
    
    if (rbs[0].checked)
    {
       getObj("tdAppertainMan").style.display = "block";
    }
    else
    {
        getObj("tdAppertainMan").style.display = "none";
    }
}

function showTab(index)
{
     // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");
    
    for (var i = 0; i < 9; i++)
    {                
        getObj("div" + i).style.display = "none";        
    }
    
    getObj("div" + index).style.display = "block";
}

//选项卡
function showBrowseTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");
    
    for (var i = 0; i < 10; i++)
    {                
        getObj("div" + i).style.display = "none";        
    }
    
    if(index > 9)
    {
        getObj("div9").style.display = "block";
    }
    else
    {
        getObj("div" + index).style.display = "block";
    }    
    
    if(index >= 9)
    {     
        var frm = window.frames("COSFrame");
        
        if(index == 9)
        {
            frm.location = "SupplierInfo/VCustomerOrSupplierHistoryList.aspx?COSID="+getObj("hidCOSID").value;
        }
        else if(index == 10)
        {        
            frm.location = "SupplierInfo/VCOSContractInfo.aspx?ID="+getObj("hidCOSID").value;
        }
        else if(index == 11)
        {        
            frm.location = "SupplierInfo/MyZBiddingBrowse.aspx?COSID="+getObj("hidCOSID").value;
        }
        else if(index == 12)
        {        
            frm.location = "SupplierInfo/VCOSSupplierAccessListInfo.aspx?ID="+getObj("hidCOSID").value;
        }
        else if(index == 13)
        {
             frm.location = "../../Knowledge/COSBusiness/VCOSGoods.aspx?COSID="+getObj("hidCOSID").value;
        }
        else if(index == 14)
        {
            frm.location = "VCOSEvaluationList.aspx?COSID="+getObj("hidCOSID").value;
        } 
        else if(index == 15)
        {
            frm.location = "VCOSAmeliorateList.aspx?COSID="+getObj("hidCOSID").value;
        } 
    }       
}
//伸缩面板
function setVisible(areaName, tr)
{
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
}

//新增公司
function addCorp()
{
    var vReturn = openModalWindow('../../Common/Select/VSelectMultiCorp.aspx',800,600);
    if(typeof vReturn != "undefined" && vReturn.length >0)
    {
        var corpIds = vReturn.split('|')[0].split(',');
        var corpNames = vReturn.split('|')[1].split('，');
        for(var i = 0; i < corpIds.length; i++)
        {
            var isRepeat = false;
            for(var j = 1; j < dgCorps.rows.length; j++)
            {
                if(getObjTR(dgCorps, j, "input", 0).value == corpIds[i])
                {
                    isRepeat = true;
                    break;
                }
            }
            if(isRepeat)
            {
                continue;
            }
            
            var row = dgCorps.insertRow();
            var cell = row.insertCell(0);
            cell.innerHTML = getCheckBoxHtml(null, corpIds[i]);
            cell.align = "center";
            
            cell = row.insertCell(1);
            cell.innerHTML = corpNames[i] + getHiddenHtml(null, corpNames[i]);
            
            setRowAttributes(row);
        }        
    }
}

// 删除表格行
function delDetail(table)
{
    // 删除表格中复选框选中的行
    deleteTableRow(table);
    
    // 重新设置各行的样式(区分奇偶行)和事件
    setTableRowAttributes(table);
}

//选择营业范围
function addCCOSBusiness()
{
    openModalWindow('/' + rootUrl + '/Supplier/CustomerOrSupplier/VSelectMultiCOSBusinessSet.aspx', 800, 600);
   setTableRowAttributes(tbCCOSBusiness);
}

//新增异地代表处
function addCOSBranchOffice()
{
    openModalWindow('/' + rootUrl + '/Supplier/CustomerOrSupplier/COSBranchOfficeAdd.aspx', 700, 300);
    setTableRowAttributes(dgCOSBranchOffice);
}


//新增资产负债表
function addCOSBalance()
{
    openModalWindow('/' + rootUrl + '/Supplier/CustomerOrSupplier/VCOSBalanceAdd.aspx', 650, 250);
    setTableRowAttributes(dgCOSBalance);
}


//新增工程量营业额
function addCOSProjectTurnover()
{
    openModalWindow('/' + rootUrl + '/Supplier/CustomerOrSupplier/VCOSProjectTurnoverAdd.aspx', 600, 300);
    setTableRowAttributes(dgCOSProjectTurnover);
}


//新增与其他企业合作情况
function addCOSPartner()
{
    openModalWindow('/' + rootUrl + '/Supplier/CustomerOrSupplier/VCOSPartnerAdd.aspx', 650, 250);
    setTableRowAttributes(dgCOSPartner);
}


//新增银行信息
function addCOSBankInfo()
{
    openModalWindow('/' + rootUrl + '/Supplier/CustomerOrSupplier/VCOSBankInfoAdd.aspx', 650, 300);
    setTableRowAttributes(dgCOSBankInfo);
}

function SetAllGridValue()
{
   //SetValue(tbCCOSBusiness ,$('#hidCCOSBusiness')[0]);
   SetValue(dgCOSBranchOffice ,$('#hidCOSBranchOffice')[0]);
   SetValue(dgCOSPartner, $('#hidCOSPartner')[0]);
   SetValue(dgCOSBankInfo ,$('#hidCOSBankInfo')[0]);
   SetValue(dgCOSBalance, $('#hidCOSBalance')[0]);
   SetValue(dgCOSProjectTurnover, $('#hidCOSProjectTurnover')[0]);
   SetValue(dgCorps, $("#hidCOSCorp")[0]);
}
function SetValue(table,hid)
{
    hid.value="";
    for(var i=1;i<table.rows.length;i++)
    {
        var str="";
        var j = 1;
        if(table.id.indexOf("dgCorps") != -1)
        {
            j = 0;
        }
        for(;j<table.rows[i].cells.length;j++)
        {
            str=str+","+table.rows[i].cells[j].getElementsByTagName('input')[0].value;
        }
        if(str.length>0)
        {
            str=str.substr(1);
        }
        hid.value=hid.value+"~"+str;
    }
    if(hid.value.length>0)
    {
        hid.value=hid.value.substr(1);
    }
} 

function ckCOSProductServiceClassIsSelect()
{
    if (getObj("hidProductServiceClass").value=="")
    {
        return  false;
    }
    return true;
}
//新增获取服务与产品类型
function checkCOSProductServiceClass()
{
    $("#hidProductServiceClass").val("");
    var chks = getObjs("chkIDV3");
    if (chks.length > 0)
    {
        for (var i = 0; i < chks.length; i++)
        {
            if (chks[i].checked)
            {
                getObj("hidProductServiceClass").value+= ","+chks[i].value;
            }
        }
    }
    if (getObj("hidProductServiceClass").value != "")
    {
        getObj("hidProductServiceClass").value = getObj("hidProductServiceClass").value.substr(1);
    }
}
//新增获取企业资质
//鄢亚龙 2013-05-24
function checkTCOSQualification()
{
    $("#hidTCOSQualification").val("");
    $("input[idchkPSCID]").each(function () {
        if (this.checked) {
            getObj("hidTCOSQualification").value += "," + this.value;
            getObj("hidTCOSQualification").value += "." + $(this).attr('idchkPSCID');
        }
    });
    if (getObj("hidTCOSQualification").value != "") {
        getObj("hidTCOSQualification").value = getObj("hidTCOSQualification").value.substr(1);
    }

    //$("#hidTCOSQualification").val("");
    //$('input[type=checkbox]', $('table[idchkPSCID]')).each(function () {
    //    if (this.checked = true) {
    //        getObj("hidTCOSQualification").value += "," + this.value;
    //    }
    //});
    //if (getObj("hidTCOSQualification").value != "") {
    //    getObj("hidTCOSQualification").value = getObj("hidTCOSQualification").value.substr(1);
    //}
}
//取消企业资质复选框禁用
//鄢亚龙 2013-05-24
function isEnabledtrue(vall)
{
    if (vall.id != "chkIDV4") {
        var idchkPSCID = $("[idchkPSCID='" + vall.value + "']");
        if (vall.checked) {
            idchkPSCID.removeAttr('disabled');
            $('input[idchkPSCID="' + vall.value + '"]').next('span').each(function () {
                $(this).removeAttr('disabled');
            });
        }
        else {
            $('[idchkPSCID="' + vall.value + '"]').each(function () {
                this.checked = false;
            });
            $('input[idchkPSCID="' + vall.value + '"]').next('span').each(function () {
                $(this).attr('disabled', true);
            });
            idchkPSCID.attr('disabled', true);
        }
    } else {
        if (vall.checked) {
            $("[idchkPSCID]").removeAttr('disabled');
            $('input[idchkPSCID]').next('span').each(function () {
                $(this).removeAttr('disabled');
            });
        } else {
            $('[idchkPSCID]').each(function () {
                this.checked = false;
            });
            $('input[idchkPSCID]').next('span').each(function () {
                $(this).attr('disabled', true);
            });
            $("[idchkPSCID]").attr('disabled', true);
        }
    }

    //var idchkPSCID = $("table[idchkPSCID='" + vall.value + "']");
    //if (vall.checked) {
    //    idchkPSCID.removeAttr('disabled');
    //}
    //else {
    //    $('input[type=checkbox]', $('table[idchkPSCID="' + vall.value + '"]')).each(function () {
    //        this.checked = false;
    //    });
    //    idchkPSCID.attr('disabled', true);
    //}

    //$('input[type=checkbox]', $('table[idchkPSCID="' + vall.value + '"]')).each(function () {
    //    if (vall.checked) {
    //       this.removeAttribute('disabled');
    //    }
    //    else {
    //        this.checked = false;
    //        $(this).attr('disabled', true);
    //    }
       
    //});
}
//企业资质 鄢亚龙 2013-05-30
function btnSelectCOSQName_Click() {
    openModalWindow('../../Common/Select/ZBidding/VSelectTCOSQualification.aspx', 500, 500);
}


//选择客商编码 add by zhangmq 2013-06-17
var objFP = {}
function selectFP()
{
    objFP.$FPNo = $("#txtFPNo");
    objFP.$FPName = $("#txtFPName");

    openModalWindow("../../Common/Select/CCMP/VSelectFinancialPartner.aspx", 800, 600);
}