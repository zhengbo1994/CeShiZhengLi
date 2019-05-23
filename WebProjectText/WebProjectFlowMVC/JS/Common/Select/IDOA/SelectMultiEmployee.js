// VSelectMultiEmployee.aspx等页面的JS文件
// 多选人员
// 作者：马吉龙
// 时间：2012-02-22
function btnAddListClick()
{
    var strAction = getParamValue("Action").toUpperCase();
    if (strAction == "EMPLOYEEWAVE")
    {
        var dgData = window.dialogArguments.dgData;
        var strTrs = "";
        $("#jqEmployee :checkbox:checked").each(function ()
        {
            var $tr = $(this).parent("div").parent("td").parent("tr");
            var $td = $tr.find("td");
            strTrs += "<tr><td><input type='checkbox' id='" + $tr[0].id + "' struID='" + $td[4].title + "' /></td>" + //employeeID、struID
                     "<td><input type='text' class='text' value='" + $td[3].title + "' /></td>" +
                     "<td><input type='text' class='text' value='" + $td[1].title + "'/></td>" +
                     "<td><input type='text' class='text' value='" + $td[2].title + "'/></td>" +
                     "<td><input type='text' class='text' maxlength='20'/></td>" +
                     "<td><input type='text' onblur='setValueToFiexed(this);setDailyWageValue(this);setRealWageValue(this)' value='0.00' class='text zmq-txt-money' /></td>" +  //薪资
                     "<td><input type='text' onblur='setIDText(this,1);setValueToDay(this)' value='0' class='text' /></td>" +
                     "<td><input type='text' onblur='setIDText(this,1);setValueToDay(this)' class='text' value='0'/></td>" +
                     "<td><input type='text' onblur='setIDText(this,1);setValueToDay(this)' class='text' value='0' /></td>" +
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this)' class='text zmq-txt-money' value='0.00'/></td>" + //日工资标准
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setRealWageValue(this)' class='text zmq-txt-money'  value='0.00'/></td>" + //考勤扣款
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setRealWageValue(this)' class='text zmq-txt-money'  value='0.00'/></td>" + //其它扣款
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setRealWageValue(this)' class='text zmq-txt-money'  value='0.00'/></td>" + //出差补贴
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setRealWageValue(this)' class='text zmq-txt-money'  value='0.00'/></td>" + //餐补
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this)' class='text zmq-txt-money'  value='0.00'/></td>" + //应发工资
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this)' class='text zmq-txt-money'  value='0.00'/></td>" + //基数
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setInAndRes(this)' class='text zmq-txt-money' value='0.00'/></td>" + //养老
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setInAndRes(this)' class='text zmq-txt-money' value='0.00' /></td>" + //失业
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setInAndRes(this)' class='text zmq-txt-money' value='0.00'/></td>" + //医疗
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setInAndRes(this)' class='text zmq-txt-money' value='0.00' /></td>" + //住房
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this)' class='text zmq-txt-money' value='0.00'/></td>" + //合计
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this)' class='text zmq-txt-money' value='0.00'/></td>" + //应纳税额
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this)' class='text zmq-txt-money' value='0.00'/></td>" + //税率
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this)' class='text zmq-txt-money' value='0.00'/></td>" + //个税
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this)' class='text zmq-txt-money' value='0.00' /></td>" + //实发金额
                     "<td><input type='textarea' maxlength='2000' class='text'></textarea></td>" +
                     "<td><input type='text' class='text' maxlength='10'/></td></tr>";
        });
        $(dgData).append(strTrs);
        setTableRowAttributes(dgData);
        closeMe();
    }
    else if (strAction == "EMPLOYEEWAVEFXHY")//福新惠誉新增员工工资选择人员信息 add by 陈毓孟 20140408 
    {
        
        var dgData = window.dialogArguments.dgData;
        var strTrs = "";
        $("#jqEmployee :checkbox:checked").each(function ()
        {
            var $tr = $(this).parent("div").parent("td").parent("tr");
            var $td = $tr.find("td");
            strTrs += "<tr><td><input type='checkbox' id='" + $tr[0].id + "' struID='" + $td[4].title + "' /></td>" + //employeeID、struID
                     "<td><input type='text' class='text' value='" + $td[3].title + "' /></td>" +  // 部门
//                     "<td><input type='text' class='text' value='" + $td[1].title + "'/></td>" + // 序号
                     "<td><input type='text' class='text' value='" + $td[2].title + "'/></td>" + //姓名
                     "<td><input type='text' class='text' maxlength='20'/></td>" +  //身份证号
                     "<td><input type='text' onblur='setIDText(this,1);setValueToDay(this)' value='0' class='text' /></td>" + // 出勤天数
                     "<td><input type='text' onblur='setValueToFiexed(this);setVirtualWageValue(this);setRealWageValue(this);' value='0.00' class='text zmq-txt-money' /></td>" +  //基本工资
                     "<td><input type='text' onblur='setValueToFiexed(this);setVirtualWageValue(this);setRealWageValue(this);' value='0.00' class='text zmq-txt-money' /></td>" +  //补助
                     "<td><input type='text' onblur='setValueToFiexed(this);setVirtualWageValue(this);setRealWageValue(this);' value='0.00' class='text zmq-txt-money' /></td>" +  //其他应发款
                     "<td><input type='text' onblur='setValueToFiexed(this);setRealWageValue(this);' value='0.00' class='text zmq-txt-money' /></td>" +  //应发合计
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setFiveInsuranceAndHousingFund(this);setRealWageValue(this)' class='text zmq-txt-money'  value='0.00'/></td>" + //公积金
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setSocialSecurity(this);setFiveInsuranceAndHousingFund(this);setRealWageValue(this);' class='text zmq-txt-money'  value='0.00'/></td>" + //养老保险
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setSocialSecurity(this);setFiveInsuranceAndHousingFund(this);setRealWageValue(this);' class='text zmq-txt-money'  value='0.00'/></td>" + //失业保险
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setSocialSecurity(this);setFiveInsuranceAndHousingFund(this);setRealWageValue(this);' class='text zmq-txt-money'  value='0.00'/></td>" + //医疗保险
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setSocialSecurity(this);setFiveInsuranceAndHousingFund(this);setRealWageValue(this);' class='text zmq-txt-money'  value='0.00'/></td>" + //大额医疗保险
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setFiveInsuranceAndHousingFund(this);setRealWageValue(this);' class='text zmq-txt-money'  value='0.00'/></td>" + //社保费用合计
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setRealWageValue(this);' class='text zmq-txt-money'  value='0.00'/></td>" + //五险一金扣款
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setRealWageValue(this);' class='text zmq-txt-money'  value='0.00'/></td>" + //个人所得税
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);setRealWageValue(this);' class='text zmq-txt-money'  value='0.00'/></td>" + //其他应扣款
                     "<td><input type='text' onblur='setIDText(this,1);setValueToFiexed(this);' class='text zmq-txt-money'  value='0.00'/></td>" + //实发工资
                     "<td><input type='textarea' maxlength='2000' class='text'></textarea></td></tr>"; //备注
        });
        $(dgData).append(strTrs);
        closeMe();
    }
    else
    {
        var dgData = getObjD("dgData")
        var id = getJQGridSelectedRowsID('jqEmployee', true);
        var name = getJQGridSelectedRowsData('jqEmployee', true, 'EmployeeName');
        var deptid = getJQGridSelectedRowsData('jqEmployee', true, 'StruID');
        for (var i = 0; i < id.length; i++)
        {
            var row = dgData.insertRow();
            var cell = row.insertCell(0);
            cell.align = "center"
            cell.innerHTML = getCheckBoxHtml();

            //所属区域
            var txtEWNo = getUniqueKey("txt");
            cell = row.insertCell(1);
            cell.innerHTML = getTextBoxHtml(txtEWNo);

            //员工名称
            var hidID1 = getUniqueKey("hid");
            var txtEmployeeName = getUniqueKey("txt");
            var btnID1 = getUniqueKey("btn");
            cell = row.insertCell(2);
            cell.innerHTML = getTextBoxHtml(txtEmployeeName, 20, '', '', stripHtml(name[i])) + getHiddenHtml(hidID1, id[i]);
            //cell.innerHTML=getSelectHtml(vTheme, txtEmployeeName, hidID1, btnID1,stringFormat("selectName('{0}','{1}','{2}',{3})",hidID1,txtEmployeeName,dgData.rows.length-1,0),stripHtml(name[i]),id[i]);

            getObjD("hidHaveSetEmployeeID").value = "," + id[i] + getObjD("hidHaveSetEmployeeID").value;
            //所属区域
            var txtArea = getUniqueKey("txt");
            cell = row.insertCell(3);
            cell.innerHTML = getTextBoxHtml(txtArea);

            //等级
            var txtLevel = getUniqueKey("txt");
            cell = row.insertCell(4);
            cell.innerHTML = getTextBoxHtml(txtLevel);

            //工资
            var txtArea = getUniqueKey("txt");
            cell = row.insertCell(5);
            cell.innerHTML = getTextBoxHtml(txtArea, 20, '', 'setMoneyValue(2)', 0);

            //季度奖金
            var txtQuarterBonus = getUniqueKey("txt");
            cell = row.insertCell(6);
            cell.innerHTML = getTextBoxHtml(txtQuarterBonus, 20, '', 'setMoneyValue(2)', 0);

            //税金合计
            var txtAfterTaxTotal = getUniqueKey("txt");
            cell = row.insertCell(7);
            cell.innerHTML = getTextBoxHtml(txtAfterTaxTotal, 20, '', 'setMoneyValue(2)', 0);

            //出差补助
            var txtTravelAllowance = getUniqueKey("txt");
            cell = row.insertCell(8);
            cell.innerHTML = getTextBoxHtml(txtTravelAllowance, 20, '', 'setMoneyValue(2)', 0);

            //项目提成
            var txtProjectCommission = getUniqueKey("txt");
            cell = row.insertCell(9);
            cell.innerHTML = getTextBoxHtml(txtProjectCommission, 20, '', 'setMoneyValue(2)', 0);

            //项目预扣税        
            var txtProjectWithholdingTax = getUniqueKey("txt");
            cell = row.insertCell(10);
            cell.innerHTML = getTextBoxHtml(txtProjectWithholdingTax, 20, '', 'setMoneyValue(2)', 0);

            //过节费
            var txtHolidayCosts = getUniqueKey("txt");
            cell = row.insertCell(11);
            cell.innerHTML = getTextBoxHtml(txtHolidayCosts, 20, '', 'setMoneyValue(2)', 0);

            //其他收入    
            var txtOtherIncome = getUniqueKey("txt");
            cell = row.insertCell(12);
            cell.innerHTML = getTextBoxHtml(txtOtherIncome, 20, '', 'setMoneyValue(2)', 0);

            //广州收入
            var txtGZIncome = getUniqueKey("txt");
            cell = row.insertCell(13);
            cell.innerHTML = getTextBoxHtml(txtGZIncome, 20, '', 'setMoneyValue(2)', 0);

            //社保
            var txtSocialSecurity = getUniqueKey("txt");
            cell = row.insertCell(14);
            cell.innerHTML = getTextBoxHtml(txtSocialSecurity, 20, '', 'setMoneyValue(2)', 0);

            //公积金
            var hidID2 = getUniqueKey("hid");
            var txtHousingFund = getUniqueKey("txt");
            cell = row.insertCell(15);
            cell.innerHTML = getTextBoxHtml(txtHousingFund, 20, '', 'setMoneyValue(2)', 0) + getHiddenHtml(hidID2, deptid[i]);
            setRowAttributes(row);
        }
        closeMe();
    }
}

var selectName= function(hidID, txtID, index, type)
{
    var vValue = openModalWindow('../../Common/Select/VSelectSingleEmployee.aspx?From=Leave&type=&CorpID=', 0, 0);
    if (vValue != "undefined" && vValue != null)
    {
        getObjD("hidEmployeeID").value = vValue.split('|')[0];
        getObjD("txtEmployee").value = vValue.split('|')[1];
    }
    var selectedIDs = "";
    var dgData=getObjD("dgData")
    var cnt = dgData.rows.length;
    for (var i = 1; i < cnt; i++)
    {
        selectedIDs += "," + getObjTC(dgData,i,2,"input",1).value;
    }

    if (getObjD("hidEmployeeID").value != "")
    {
        if (getObjD("hidHaveSetEmployeeID").value.indexOf(getObjD("hidEmployeeID").value) != -1)
        {
            alert('该人员的工资已经录入。');                    
            return false;
        }
       
        if (selectedIDs.indexOf(getObjD("hidEmployeeID").value) != -1)
        {
            alert('该人员已经选择。');                    
        }
        else
        {
            getObjD(txtID).value = getObjD("txtEmployee").value;
            getObjD(hidID).value = getObjD("hidEmployeeID").value;           
        } 
    }
}


function reloadData()
{
    var state = getObj("ddlState").value;
    var deptID = getObj("ddlDept").value;
    var vKey = $("#txtKey").val();
    var isAll = "N";
    if ($("#chkIsContainSon").is(":checked"))
    {
        isAll = "Y";
    }
    
    var ids = getObjD("hidHaveSetEmployeeID").value.substr(1);
    var query = { IDs: ids, Key: vKey, State: state, _DeptID: deptID, IsContainSon: isAll, CorpID: getParamValue("CorpID") };
    if (loadJQGrid("jqEmployee", query))
    {
        refreshJQGrid("jqEmployee");
    }
}