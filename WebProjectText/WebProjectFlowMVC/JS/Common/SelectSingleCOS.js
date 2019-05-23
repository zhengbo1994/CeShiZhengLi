// JScript 文件

//行业分类选择是否为设置
function refreshSupplier()
{
    var range = document.all.ddlBusinessSort.options[document.all.ddlBusinessSort.selectedIndex].value;
    if (range == "All" || range == "NotSet")
    {
        tdBusinessSort.style.display = "none";
        tdSupplier.colSpan = 2;


        $('#SupplierGrid', window.frames("Main").document).getGridParam('postData').Aim = range;

        window.frames("Main").window.reloadData();
    }
    else if (range == "HaveSet")
    {
        tdBusinessSort.style.display = "block";
        tdSupplier.colSpan = 1;
        try
        {
            $('#SupplierGrid', window.frames("Main").document).getGridParam('postData').Aim = "HaveSet";
            $('#SupplierGrid', window.frames("Main").document).getGridParam('postData').PSCID = "";
            window.frames("Main").window.reloadData();
        }
        catch (err) { }
    }
}

//根据条件过滤记录
function reloadSupplierData()
{
    $('#SupplierGrid', window.frames("Main").document).getGridParam('postData').property = getObj("ddlProperty").value;
    $('#SupplierGrid', window.frames("Main").document).getGridParam('postData').level = getObj("ddlLevel").value;
    $('#SupplierGrid', window.frames("Main").document).getGridParam('postData').State = getObj("ddlState").value;
    $('#SupplierGrid', window.frames("Main").document).getGridParam('postData').regSort = getObj("ddlRegSort").value;
    $('#SupplierGrid', window.frames("Main").document).getGridParam('postData').filter = getObj("txtFilter").value;

    window.parent.frames("Main").window.reloadData();
}

function reloadData()
{
    refreshJQGrid('SupplierGrid');
}

//选择
function btnChoose_Click()
{      
    var vBool = false;
    if (getObj('hidSelectType').value == "Multi")//多选
    {
        var flag = 0;
        var repeat = 0;
        var vCOSID = window.frames('Main').getJQGridSelectedRowsID('SupplierGrid', true);
        if (vCOSID.length == 0)
        {
            alert("没有选择任何供应商。");
            return false;
        }
        if (getObj('hidAction').value == 'GoodsAdd')
        {
            var vCOSName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSName');
            var vCOSNo = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSNo');
            var dgSupplier = window.dialogArguments.tbCOS;
            for (var i = 0, iLen = vCOSID.length; i < iLen; i++)
            {
                var repeatCnt = 0;
                for (var j = 1, jLen = dgSupplier.rows.length; j < jLen; j++)
                {
                    if (getObjTR(dgSupplier, j, "input", 0).value == vCOSID[i])
                    {
                        repeatCnt++;
                        repeat++;
                    }
                }
                if (repeatCnt > 0)
                {
                    continue;
                }
                var row = dgSupplier.insertRow();

                var cell = row.insertCell(0);
                cell.align = "center";
                cell.innerHTML = getCheckBoxHtml(null, vCOSID[i]);
                cell.innerHTML += getHiddenHtml(null, $.jgrid.stripHtml(vCOSNo[i]));

                cell = row.insertCell(1);
                cell.innerHTML = getHiddenHtml(null, $.jgrid.stripHtml(vCOSName[i])) + getHrefHtml("showCOSName", $.jgrid.stripHtml(vCOSName[i]), "showCOSName('" + vCOSID[i] + "');");

                cell = row.insertCell(2);
                cell.align = "center";
                //cell.innerHTML = getTextBoxHtml(null,100,null,null,null,false);
                cell.innerHTML = getRadioHtml(getUniqueKey('rdo'), '是', 'Y', 'IsMasterRdo_' + vCOSID[i], true);
                cell.innerHTML += '&nbsp;' + getRadioHtml(getUniqueKey('rdo'), '否', 'N', 'IsMasterRdo_' + vCOSID[i]);

                flag++;
            }
        }
        //付款申请(费用付款)
        else if (getObj('hidAction').value == "CostPay")
        {
            var vCOSName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSName');
            var vCOSNo = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSNo');
            var vCOSBankName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'BankName');
            var vCOSBankAmountNo = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'BankAmountNo');
            var vCOSBankAccount = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'BankAccount');

            var vTaxPayerID = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'TaxPayerID');
            var vTaxPayerTypeName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'TaxPayerTypeName');
            var vTaxRate = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'TaxRate');
    
            var dgSupplier = window.dialogArguments.dgCostSupplier;
            for (var i = 0; i < vCOSID.length; i++)
            {
                var repeatCnt = 0;
                for (var j = 1; j < dgSupplier.rows.length; j++)
                {
                    if (getObjTR(dgSupplier, j, "input", 0).value == vCOSID[i])
                    {
                        repeatCnt++;
                        repeat++;
                    }
                }
                if (repeatCnt > 0)
                {
                    continue;
                }
                var row = dgSupplier.insertRow();

                /*
                    费用付款供应商：0、checkbox 1、供应商名称 2、付款成本 3、可抵扣税率 4、进项税额  5、付款合价  6、纳税人类型 7、开户行 8、开户名称 9、银行账号  10、 备注
                */
                var cell = row.insertCell(0);  
                cell.align = "center";
                cell.innerHTML = ' <input id="chkIDV3" type="checkbox" style="width:15px; heght: 15px" data-taxpayer="'+vTaxPayerID[i]+'" onclick="selectRow(this)" value="' + vCOSID[i] + '" suptype="2" />';

                cell = row.insertCell(1);     
                cell.innerHTML = vCOSName[i];

                cell = row.insertCell(2);
                cell.align = "center";
                cell.innerHTML = getTextBoxHtml("txtPayPrimeAmount", 100, null, "setMoneyValue(2);calculatorPrimeAmountAndTaxAmount(this,'Prime');calculator();", null, false);


                cell = row.insertCell(3);
                cell.align = "center";
                var divTaxRate = window.dialogArguments.document.getElementById("divTaxRate");
                $("select[id*=ddlTaxRate]", $(divTaxRate)).val(parseFloat(vTaxRate[i]));
                cell.innerHTML = $("select[id*=ddlTaxRate]", $(divTaxRate)).get(0).outerHTML;
                

                cell = row.insertCell(4);
                cell.align = "center";
                cell.innerHTML = getTextBoxHtml("txtPayTaxAmount", null, null, null, null, true);

                cell = row.insertCell(5);
                cell.align = "center";
                cell.innerHTML = getTextBoxHtml("txtPayAmount", 100, null, "setMoneyValue(2);calculatorPrimeAmountAndTaxAmount(this,'Total');calculator();", null, false);

                //cell = row.insertCell(2);
                //cell.align = "center";
                //cell.innerHTML = getTextBoxHtml("txtPayAmount", 100, null, "setMoneyValue(2); calculator();", null, false);

                cell = row.insertCell(6);
                cell.align = "left";
                cell.innerText = vTaxPayerTypeName[i];

                cell = row.insertCell(7)
                cell.align = "center";
                cell.style.display = payRequest_BankInfo == "Y" ? "" : "none";
                cell.innerHTML = getTextBoxHtml("txtBankNameCost", null, null, null, vCOSBankName[i], false);

                cell = row.insertCell(8)
                cell.align = "center";
                cell.style.display = payRequest_BankName == "Y" ? "" : "none";
                cell.innerHTML = getTextBoxHtml("txtBankAccountCost", null, null, null, vCOSBankAccount[i], false);

                cell = row.insertCell(9)
                cell.align = "left";
                cell.style.display = payRequest_BankInfo == "Y" ? "" : "none";
                cell.innerHTML = getTextBoxHtml("txtBankNoCost", null, null, null, vCOSBankAmountNo[i], false, '80%')
                                    + '<button onclick="selectBankAccountFee(\'' + vCOSID[i] + '\')" class="btnsmall" ><img class="btnimg" onerror="this.style.display=\'none\'" src="../../App_Themes/' + getObj("hidTheme").value + '/img/button/lookup' + getButtonIconExtension()
                                    + '" style="border-width:0px;" /></button>';

                cell = row.insertCell(10);
                cell.innerHTML = getTextAreaHtml("txtRemark", 1000, null, null, false);

                flag++;
            }

        }

        //特殊处理工作任务质量多选供应商的情况（WeiSG）
        else if (getObj('hidAction').value == "TQMulti")
        {
            var vCOSName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSName');
            var dgSupplier = window.dialogArguments.tbBuildCOS;
            for (var i = 0; i < vCOSID.length; i++)
            {
                var repeatCnt = 0;
                for (var j = 1, jLen = dgSupplier.rows.length; j < jLen; j++)
                {
                    if (getObjTR(dgSupplier, j, "input", 0).value == vCOSID[i])
                    {
                        repeatCnt++;
                        repeat++;
                    }
                }
                if (repeatCnt > 0)
                {
                    continue;
                }
                var row = dgSupplier.insertRow();

                var cell = row.insertCell(0);
                cell.align = "center";
                cell.innerHTML = ' <input id="chkIDV3" type="checkbox" style="width: 15px; height: 15px" onclick="selectRow(this)" value="' + vCOSID[i] + '" />';

                cell = row.insertCell(1);
                cell.innerHTML = vCOSName[i];

                cell = row.insertCell(2)
                cell.innerHTML = getTextAreaHtml();

                flag++;
            }
        }
        //特殊处理工作任务安全多选供应商的情况（Yangxw）
        else if (getObj('hidAction').value == "TSMulti")
        {
            var vCOSName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSName');
            var dgSupplier = window.dialogArguments.tbBuildCOS;
            for (var i = 0; i < vCOSID.length; i++)
            {
                var repeatCnt = 0;
                for (var j = 1, jLen = dgSupplier.rows.length; j < jLen; j++)
                {
                    if (getObjTR(dgSupplier, j, "input", 0).value == vCOSID[i])
                    {
                        repeatCnt++;
                        repeat++;
                    }
                }
                if (repeatCnt > 0)
                {
                    continue;
                }
                var row = dgSupplier.insertRow();

                var cell = row.insertCell(0);
                cell.align = "center";
                cell.innerHTML = ' <input id="chkIDV3" type="checkbox" style="width: 15px; height: 15px" onclick="selectRow(this)" value="' + vCOSID[i] + '" />';

                cell = row.insertCell(1);
                cell.innerHTML = vCOSName[i];

                cell = row.insertCell(2)
                cell.innerHTML = getTextAreaHtml();

                flag++;
            }
        }
        //供应商新增
        else if (getObj('hidAction').value == "CustomerOrSupplier")
        {
            var vCOSID = window.frames('Main').getJQGridSelectedRowsID('SupplierGrid', true);
            if (vCOSID.length == 0)
            {
                alert("没有选择任何供应商。");
                return false;
            }
            getObj('hidCOSIDs').value = vCOSID.join(',');

            return true;
        }
        else if (getObj('hidAction').value == "EvaluationAdd")
        {
            var tbCOS = window.dialogArguments.tbCOS;
            var vCOSNo = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSNo');
            var vCOSName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSName');
            var vCOSLName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'TCOSLevel__COSLName');
            var vCOSRSName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSRSName');
            var vComprehensiveName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'ComprehensiveName');

            var dgSupplier = window.dialogArguments.tbCOS;
            for (var i = 0; i < vCOSID.length; i++)
            {
                var repeatCnt = 0;
                for (var j = 1; j < dgSupplier.rows.length; j++)
                {
                    if (getObjTR(dgSupplier, j, "input", 0).value == vCOSID[i])
                    {
                        repeatCnt++;
                        repeat++;
                    }
                }
                if (repeatCnt > 0)
                {
                    continue;
                }
                var row = dgSupplier.insertRow();
                var cell = row.insertCell(0);
                cell.align = "center";
                cell.innerHTML = getCheckBoxHtml('', vCOSID[i]);

                cell = row.insertCell(1);
                cell.innerHTML = stripHtml(vCOSNo[i]) + getHiddenHtml('', stripHtml(vCOSNo[i]));

                cell = row.insertCell(2);
                //                cell.innerHTML=stripHtml(vCOSName[i])+getHiddenHtml('',stripHtml(vCOSName[i]));
                cell.innerHTML = "<a href='javascript:void(0)' onclick=showCOS('" + vCOSID[i] + "')>" + stripHtml(vCOSName[i]) + "</a>" + getHiddenHtml('', stripHtml(vCOSName[i]));
                cell = row.insertCell(3);
                cell.innerHTML = stripHtml(vCOSLName[i] ? vCOSLName[i] : "");

                cell = row.insertCell(4);
                cell.innerHTML = stripHtml(vComprehensiveName[i] ? vComprehensiveName[i] : "");

                cell = row.insertCell(5);
                cell.innerHTML = stripHtml(vCOSRSName[i] ? vCOSRSName[i] : "");

                cell = row.insertCell(6);
                cell.innerHTML = getTextAreaHtml();

                setRowAttributes(row);

                flag++;
            }
        }
        else if (getObj('hidAction').value == "COSLevelAdjust")
        {
            var vCOSNo = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSNo');
            var vCOSName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSName');
            var vCOSLName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'TCOSLevel__COSLName');
            var vCOSRSName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSRSName');
            var vComprehensiveName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'ComprehensiveName');

            var dgSupplier = window.dialogArguments.tbCOS;
            for (var i = 0; i < vCOSID.length; i++)
            {
                var repeatCnt = 0;
                for (var j = 1; j < dgSupplier.rows.length; j++)
                {
                    if (getObjTR(dgSupplier, j, "input", 0).value == vCOSID[i])
                    {
                        repeatCnt++;
                        repeat++;
                    }
                }
                if (repeatCnt > 0)
                {
                    continue;
                }
                var row = dgSupplier.insertRow();
                var cell = row.insertCell(0);
                cell.align = "center";
                cell.innerHTML = getCheckBoxHtml('', vCOSID[i]);

                cell = row.insertCell(1);
                cell.innerHTML = stripHtml(vCOSNo[i]) + getHiddenHtml('', stripHtml(vCOSNo[i]));

                cell = row.insertCell(2);
                cell.innerHTML = "<a href='javascript:void(0)' onclick=showCOS('" + vCOSID[i] + "')>" + stripHtml(vCOSName[i]) + "</a>" + getHiddenHtml('', stripHtml(vCOSName[i]));
                cell = row.insertCell(3);
                cell.innerHTML = stripHtml(vCOSLName[i]);

                cell = row.insertCell(4);
                cell.innerHTML = stripHtml(vCOSRSName[i]);

                setRowAttributes(row);

                flag++;
            }
        }
        else if (getObj('hidAction').value == "Contract")
        {
            var vCOSName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSName');
            var vCOSCorporation = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'Corporation');
            //if(getObj('Action').value == "Contract") 默认是合同 getObj('Action').value 可以使用这个参数判断
            var dgSupplier = window.dialogArguments.dgSupplier;
            for (var i = 0; i < vCOSID.length; i++)
            {
                var repeatCnt = 0;
                for (j = 1; j < dgSupplier.rows.length; j++)
                {
                    if (getObjTR(dgSupplier, j, "input", 0).value == vCOSID[i])
                    {
                        repeatCnt++;
                        repeat++;
                    }
                }
                if (repeatCnt > 0)
                {
                    continue;
                }
                var row = dgSupplier.insertRow();

                var cell = row.insertCell(0);

                cell.align = "center";
                cell.innerHTML = getCheckBoxHtml(null, vCOSID[i]);

                cell = row.insertCell(1);
                cell.innerHTML = getHiddenHtml(null, $.jgrid.stripHtml(vCOSName[i])) + getHrefHtml("showCOSName", $.jgrid.stripHtml(vCOSName[i]), "showCOSName('" + vCOSID[i] + "');");

                cell = row.insertCell(2);
                cell.align = "center";
                cell.innerHTML = getTextBoxHtml(null, 100, null, null, $.jgrid.stripHtml(vCOSCorporation[i]), false);

                cell = row.insertCell(3);
                cell.align = "center";
                cell.innerHTML = getTextBoxHtml(null, 100, null, null, null, false);

                cell = row.insertCell(4);
                cell.align = "center";
                cell.innerHTML = getTextBoxHtml("txtAmount", null, null, 'setMoneyValue(2);calculator();', null, false);

                cell = row.insertCell(5);
                cell.align = "center";
                cell.innerHTML = getTextAreaHtml(null, '1000', '30', null);

                if (getObjD("hidCPContractPayPlanInfo") && getObjD("hidCPContractPayPlanInfo").value != "")
                {
                    var payPlanList = eval("(" + getObjD("hidCPContractPayPlanInfo").value + ")");
                    for (var j = 0; j < payPlanList.length; j++)
                    {
                        var payPlan = payPlanList[j];
                        window.dialogArguments.addPayNoteRow($.jgrid.stripHtml(vCOSName[i]), vCOSID[i], payPlan.PayPercent, 0, payPlan.PayPlanName, payPlan.Remark,
                                   payPlan.RefDateType, payPlan.PayPlanDate, payPlan.RelativeDay, payPlan.DevPlanID, payPlan.DevPlanName)
                    }
                }
                else if (getObjD("hidPID").value != "" && getObjD("hidPaymentInfo").value != "")
                {
                    var payment = eval("(" + getObjD("hidPaymentInfo").value + ")");
                    window.dialogArguments.addSupplierPayNote(payment, vCOSID[i], $.jgrid.stripHtml(vCOSName[i]), 0);
                    window.dialogArguments.changeEstimate();
                }
                flag++;
            }
        }
        else if (getObj('hidAction').value == "MultiString") //表示返回多个结果的字符串形式,以 , 号分割
        {
            var retDatas = [];
            var vCOSName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSName');
            var vContactMan = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'ContactMan');
            var vCorpTel = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'CorpTel');

            for (var i = 0; i < vCOSID.length; i++)
            {
                retDatas.push(vCOSID[i] + '|' + stripHtml(vCOSName[i]) + '|' + stripHtml(vContactMan[i]) + '|' + stripHtml(vCorpTel[i]));

                flag++;
            }

            window.returnValue = retDatas.join(',');
        }
        else
        {
            var vCOSName = window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', true, 'COSName');

            //if(getObj('Action').value == "Contract") 默认是合同 getObj('Action').value 可以使用这个参数判断
            var dgSupplier = window.dialogArguments.dgSupplier;
            for (var i = 0; i < vCOSID.length; i++)
            {
                var repeatCnt = 0;
                for (j = 1; j < dgSupplier.rows.length; j++)
                {
                    if (getObjTR(dgSupplier, j, "input", 0).value == vCOSID[i])
                    {
                        repeatCnt++;
                        repeat++;
                    }
                }
                if (repeatCnt > 0)
                {
                    continue;
                }
                var row = dgSupplier.insertRow();

                var cell = row.insertCell(0);

                cell.align = "center";
                cell.innerHTML = getCheckBoxHtml(null, vCOSID[i]);

                cell = row.insertCell(1);
                cell.innerHTML = getHiddenHtml(null, $.jgrid.stripHtml(vCOSName[i])) + getHrefHtml("showCOSName", $.jgrid.stripHtml(vCOSName[i]), "showCOSName('" + vCOSID[i] + "');");

                cell = row.insertCell(2);
                cell.align = "center";
                cell.innerHTML = getTextBoxHtml(null, 100, null, null, null, false);

                cell = row.insertCell(3);
                cell.align = "center";
                cell.innerHTML = getTextBoxHtml(null, 100, null, null, null, false);

                cell = row.insertCell(4);
                cell.align = "center";
                cell.innerHTML = getTextBoxHtml(null, null, null, 'setMoneyValue(2);calculator();', null, false);

                cell = row.insertCell(5);
                cell.align = "center";
                cell.innerHTML = getTextAreaHtml(null, '1000', '30', null);

                flag++;
            }
        }

        if (flag == 0)
        {
            if (repeat > 0)
            {
                alert("你不能重复添加供应商。");
            }
            else
            {
                alert("没有选择供应商。");
            }
            return false;
        }

    }
    else
    {
        var vCOSID = window.frames('Main').getJQGridSelectedRowsID('SupplierGrid', false);
        var vCOSName = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', false, 'COSName'));
        var vContactMan = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', false, 'ContactMan'));
        var vCorpTel = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', false, 'CorpTel'));
        var vCOSNo = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('SupplierGrid', false, 'COSNo'));
        if (vCOSID == null || vCOSID == "")
        {
            return alertMsg("请选择供应商。", getObj("btnChoose"));
        }
        window.returnValue = vCOSID + "|" + vCOSName + "|" + vContactMan + "|" + vCorpTel + "|" + vCOSNo;
    }


    window.close();

}
//清除
function btnClear_Click()
{
    window.returnValue = "|";
    window.close();
}

//选定当前行业的供应商
function showSupplier(pscID)
{

    if (window.parent.frames["Main"].document.readyState == "complete")
    {
        $('#SupplierGrid', window.parent.frames("Main").document).getGridParam('postData').PSCID = pscID;
        $('#SupplierGrid', window.parent.frames("Main").document).getGridParam('postData').Aim = 'HaveSet';
        window.parent.frames("Main").window.reloadData();
    }

}


//查看供应商明细
function renderLink(cellvalue, options, rowobject)
{
    var multiselect = $('#SupplierGrid', window.parent.frames("Main").document).getGridParam('multiselect');
    var url = "'" + vPath + "/Supplier/CustomerOrSupplier/VCustomerOrSupplierBrowse.aspx?COSID=" + rowobject[0] + "'";
    if (multiselect)
    {
        return '<div class="nowrap"><a  href="javascript:window.openWindow(' + url + ',screen.availWidth,screen.availHeight)" return false;>' + cellvalue + '</a></div>';
    }
    else
    {
        // edit by xiaodm  2012-9-7  ，在合同名称/供应商名称前增加一个图标，点击打开查看页，点名称直接返回关闭
        var imgUrl = "/" + rootUrl + "/Image/icon/props.png";
        return '<div class="nowrap"><img src="' + imgUrl + '" onclick="javascript:window.openWindow(' + url + ',screen.availWidth,screen.availHeight)"/><a  href="javascript:SetClickSelect(\'' + rowobject[0] + '\');parent.btnChoose_Click();" return false;>' + cellvalue + '</a></div>';
    }
}

function SetClickSelect(rowID)
{
    $('#SupplierGrid', window.parent.frames("Main").document).resetSelection();
    $('#SupplierGrid', window.parent.frames("Main").document).setSelection(rowID, false);
}

function addCustomerOrSupplier()
{
    //openAddWindow('/' + rootUrl + '/Supplier/CustomerOrSupplier/VCustomerOrSupplierAdd.aspx?Wdow=1', 0, 0, "SupplierGrid");
    var winobj = getOpenWinObj(1, 0, 0);

    window.showModalDialog('/' + rootUrl + '/Supplier/CustomerOrSupplier/VCustomerOrSupplierAdd.aspx?Wdow=1&iframe=Main', window,
        'dialogtop=' + winobj.top + 'px;dialogleft=' + winobj.left + 'px;dialogWidth=' + winobj.width + 'px;dialogHeight=' + winobj.height + 'px;'
        + 'status=1;resizable=1;scroll=0;scrollbars=0');
}
////马吉龙 2011-11-1 覆盖idsoft.js的openWindow方法
//function openWindow(url, width, height)
//{
//    var winobj = getOpenWinObj(0, width, height);

//    // 解决模式窗口打开新窗口Session丢失问题
//    var win = window;

//    win.open(url, '_blank', 'resizable=1,status=1,scrollbars=0,top=' + winobj.top + ',left=' + winobj.left + ',width=' + winobj.width + ',height=' + winobj.height);
//}