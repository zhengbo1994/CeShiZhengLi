/*
   多人员选择支持文件
   注意：调用窗口需要以打开模式窗口的形式打开人员选择。
*/     
 
    //重新加载jqGrid 
    function reloadData()
    {
       $('#jqgEmployee').trigger('reloadGrid');
    }  
    
    //人员在职状态发生改变后
    function ddlState_Change()
    {
        btnSearch_Click();
    }
    
    function ChangeChild()
    {
        btnSearch_Click();
    }
    
    //提交人员查询
    function btnSearch_Click()
    {  
        if(trim($('#txtKey').val()).length>0)
        {
            $('#trLeft').hide();
        }
        else
        {
            $('#trLeft').show();
        }
        //step1: 获取CorpID
        var struID=$('#hidStruID',window.frames("frmLeft").document).val();
        $('#jqgEmployee',window.frames("frmMain").document).getGridParam('postData').CorpID=struID;    
        //step2: 获取在职状态
        var state=$('#ddlState').val();
        $('#jqgEmployee',window.frames("frmMain").document).getGridParam('postData').State=state;    
        var child = $('#ddlChild').val(); 
        $('#jqgEmployee',window.frames("frmMain").document).getGridParam('postData').Child=child;   
        //step2: 获取关键词
        var keyword=$('#txtKey').val();
        $('#jqgEmployee',window.frames("frmMain").document).getGridParam('postData').KeyValue=keyword;    
        //获取是否显示多岗位 
        var mutiStation =  $('#ddlMutiStation').val();
        $('#jqgEmployee', window.frames("frmMain").document).getGridParam('postData').MutiStation = mutiStation;
        // edit by baijunli   20141202
        if ($('#hidAim').val() == "ReceiverAccount" && $('#hidCompany').val() == "BAONENGJT")
        {
            if (struID == "TotalCompany")
            {
                $("#btnAddStru").attr("disabled", true);
            }
            else
            {
                $("#btnAddStru").attr("disabled", false);
            }
        }
        window.frames("frmMain").window.reloadData();        
    }
    
    function SetCookie(name,value)//两个参数，一个是cookie的名子，一个是值
    {
        var Days = 30; //此 cookie 将被保存 30 天
        var exp  = new Date();    //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
        
    function getCookie(name)//取cookies函数        
    {
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
         if(arr != null) return unescape(arr[2]); return null;
    }

    function ddlMutiStation_Change()
    {
        var value = getObj('ddlMutiStation').value;
        SetCookie('MutiStation', value);
        btnSearch_Click();
    }
    
    //双击添加人员
    function jqGridDblClick(rowid, iRow, iCol, e)
    {
        var lstEmployees = getObjP("lstEmployees");
        var vEmployeeID = $('#jqgEmployee').getRowData(rowid)['AccountID'];
        var vEmployeeName = $('#jqgEmployee').getRowData(rowid)['TAccount__EmployeeName'];
        var vEmployeeStation = $('#jqgEmployee').getRowData(rowid)['StationName'];
        var vEmployeeMobile = $('#jqgEmployee').getRowData(rowid)['TAccount__Mobile'];

        if ($(window.parent.document).find('#lstEmployees option[value=\'' + vEmployeeID + '\']').length <= 0)
        {
            var opt = document.createElement("option");
            opt.value = vEmployeeID;
            opt.type = 'E';
            //手机短信 - 选择手机号码(YXW)
            if (getObjP("hidAim").value == "SmSend")
            {
                if (vEmployeeMobile == "" || vEmployeeMobile == null || vEmployeeMobile == "undefined" || vEmployeeMobile == "&nbsp;")
                {
                    opt.text = $.jgrid.stripHtml("(" + vEmployeeName + ")");
                }
                else
                {
                    opt.text = $.jgrid.stripHtml(vEmployeeMobile.split(',') + "(" + vEmployeeName + ")");
                }
                lstEmployees.add(opt, lstEmployees.length);
            }
            else
            {
                opt.text = $.jgrid.stripHtml(vEmployeeName + "(" + vEmployeeStation + ")");
                lstEmployees.add(opt, lstEmployees.length);
            }
        }
    }
    
    //双击添加公司或者部门
    function DBAdd_Clisk(value, text)
    {
        var lstEmployees = getObjP("lstEmployees");
        var vStruID = value;
        var vStruIDName = text;

        if ($(window.parent.document).find('#lstEmployees option[value=\'' + vStruID + '\']').length <= 0)
        {
            var opt = document.createElement("option");
            opt.value = vStruID;
            opt.type = 'C';
            opt.text = $.jgrid.stripHtml(vStruIDName);
            lstEmployees.add(opt, lstEmployees.length);
        }
    }
    
    function AddStru_Click()
    {
        var hidFirstSpan = getObjF("frmLeft","hidFirstSpan");
        var span = getObjF("frmLeft",hidFirstSpan.value);
        var lstEmployees = getObj("lstEmployees");     
        var vStruID = span.value; 
        var vStruIDName = span.innerText; 

        if($('#lstEmployees option[value=\''+vStruID+'\']').length<=0)
        {               
            var opt = document.createElement("option");
            opt.value =vStruID;
            opt.type = 'C';            
            opt.text = $.jgrid.stripHtml(vStruIDName);                
            lstEmployees.add(opt, lstEmployees.length);           
        } 
    }

    function lstEmployeesDB_Clisk()
    {
        var index

        if (getObj("lstEmployees").length == 0) return (false);
        index = getObj("lstEmployees").selectedIndex
        if (index < 0) return (false);
        getObj("lstEmployees").remove(index)
    }
    
    function lstMailAccountGroupDB_Clisk(lst)
    {
        var   addOption=document.createElement( "option ") 
        var   index 
                
        if(lst.length==0)return(false); 
        index=lst.selectedIndex   
        if(index <0)return(false); 

       var lstEmployees = getObj("lstEmployees");    
        if($('#lstEmployees option[value=\''+lst.options[index].value+'\']').length<=0)
        {               
            var opt = document.createElement("option");
            opt.value =lst.options[index].value;
            opt.type = 'G';            
            opt.text = lst.options[index].text;                
            lstEmployees.add(opt, lstEmployees.length);           
        } 
    }
    
    function btnAddGroup_Click()
    {
        var lstMailAccountGroup = getObj("lstMailAccountGroup");
        var lstEmployees = getObj("lstEmployees");    
        var index  =lstMailAccountGroup.selectedIndex;
        if(index>-1)   
        {
            if($('#lstEmployees option[value=\''+lstMailAccountGroup.options[index].value+'\']').length<=0)
            {               
                var opt = document.createElement("option");
                opt.value =lstMailAccountGroup.options[index].value;
                opt.type = 'G';            
                opt.text = lstMailAccountGroup.options[index].text;                
                lstEmployees.add(opt, lstEmployees.length);           
            } 
       }          
    }
    
    //添加选中人员到被选择人员列表
    function btnAdd_Click(chk)
    {
        var lstEmployees = $("#lstEmployees")[0];

        var vEmployeeID = window.frames('frmMain').getJQGridSelectedRowsData('jqgEmployee', true, 'AccountID');
        var vEmployeeName = window.frames('frmMain').getJQGridSelectedRowsData('jqgEmployee', true, 'TAccount__EmployeeName');
        var vEmployeeStation = window.frames('frmMain').getJQGridSelectedRowsData('jqgEmployee', true, 'StationName');
        var vEmployeeMobile = stripHtml(window.frames('frmMain').getJQGridSelectedRowsData('jqgEmployee', true, 'TAccount__Mobile'));

        if (vEmployeeID.length <= 0 & chk == 'chk')
        {
            return alertMsg("请选择人员。", getObj("btnAdd"));
        }

        $.each(vEmployeeID, function (i, id)
        {
            if (id.length <= 0)
            {
                return;
            }

            if (getObj("hidAim").value == "PlanTranckAccount" && lstEmployees.length > 9)
            {
                if (chk == 'chk')
                {
                    return alertMsg('最多选择10个账号');
                }
                return;
            }

            if ($('#lstEmployees option[value=\'' + id + '\']').length <= 0)
            {
                var opt = document.createElement("option");
                opt.value = id;
                opt.type = 'E';
                //手机短信 - 选择手机号码(YXW)
                if (getObj("hidAim").value == "SmSend")
                {
                    if (vEmployeeMobile == "" || vEmployeeMobile == null || vEmployeeMobile.split(',')[i] == "undefined" || vEmployeeMobile.split(',')[i] == "&nbsp;")
                    {
                        opt.text = $.jgrid.stripHtml("(" + vEmployeeName[i] + ")");
                    }
                    else
                    {
                        opt.text = $.jgrid.stripHtml(vEmployeeMobile.split(',')[i] + "(" + vEmployeeName[i] + ")");
                    }
                    lstEmployees.add(opt, lstEmployees.length);
                }
                else
                {
                    opt.text = $.jgrid.stripHtml(vEmployeeName[i] + "(" + vEmployeeStation[i] + ")");
                    lstEmployees.add(opt, lstEmployees.length);
                }
            }
        });
    }
    
    //从被选人员中移除选中项
    function btnDel_Click()
    {
        var lstEmployees = $("#lstEmployees");
        $('option:selected', lstEmployees).each(function (i)
        {
            lstEmployees.get(0).removeChild(this);
        });
    }
    
    //添加所有人员
    function btnAddAll_Click()
    {
        var lstEmployees = $("#lstEmployees")[0];

        var vEmployeeID = window.frames('frmMain').getJQGridAllRowsData('jqgEmployee', 'AccountID');
        var vEmployeeName = window.frames('frmMain').getJQGridAllRowsData('jqgEmployee', 'TAccount__EmployeeName');
        var vEmployeeStation = window.frames('frmMain').getJQGridAllRowsData('jqgEmployee', 'StationName');

        if (vEmployeeID.length <= 0)
        {
            return;
        }
        $.each(vEmployeeID, function (i, id)
        {
            if (id.length <= 0)
            {
                return;
            }

            if (getObj("hidAim").value == "PlanTranckAccount" && lstEmployees.length > 9)
            {
                return alertMsg('最多选择10个账号');
            }

            if ($('#lstEmployees option[value=\'' + id + '\']').length <= 0)
            {
                var opt = document.createElement("option");
                opt.value = id;
                opt.type = 'E';
                opt.text = $.jgrid.stripHtml(vEmployeeName[i] + "(" + vEmployeeStation[i] + ")");
                lstEmployees.add(opt, lstEmployees.length);
            }
        });
    }
    
    function move(to) 
    {
        var list = getObj("lstEmployees");
        var total = list.options.length-1;
        var index = getObj("lstEmployees").selectedIndex;
        if (index == -1) return false;
        if (to == +1 && index == total) return false;
        if (to == -1 && index == 0) return false;

        //临时保存选项的值
        var text = list.options[index].text;
        var type = list.options[index].type; 
        var value = list.options[index].value;

        //将目标选项复制到当前选项           
        list.options[index].text =list.options[index+to].text 
        list.options[index].type =list.options[index+to].type  
        list.options[index].value =list.options[index+to].value 

        //转移到目标选项           
        list.options[index+to].text = text;
        list.options[index+to].type = type; 
        list.options[index+to].value =value;

        //选中索引也跟着变
        list.selectedIndex = index+to;   
        list.focus();
    }
    
    //删除所有被选中人员
    function btnDelAll_Click()
    {
       $("#lstEmployees").empty();
    }
    
    function clearItems()
    {
        btnDelAll_Click();
        window.returnValue = { IDS: "", Names: "", Types: "" };
        window.close();
    }
    
    //点击选择按钮后的操作，目前是返回选择值给调用窗口
    //@返回值： json格式的数据，包含2个属性：
    //               IDS（被选中人员的ID，以,号分隔)
    //               Names(被选中人员的姓名和职位，以,号分隔)
    function btnChoose_Click()
    {
        btnAdd_Click();
        var vAim = getObj("hidAim").value;
        var flag = 0;
        var repeat = 0;

        var vEmployeeID = "";
        var vEmployeeName = "";
        var vType = "";
        var lstEmployees = $("#lstEmployees");

        //未选择人员时给出提示
        //作者：肖勇彬
        //日期：2015-04-24
        if ($('option', lstEmployees).length == 0)
        {
            alertMsg("请选择人员。");
            return;
        }

        if (vAim == "MailAccount")
        {
            var vAccountIDs = new Array();
            var vEmployeeNames = new Array();

            $('option', lstEmployees).each(function (i)
            {
                vAccountIDs[i] = this.value;
                vEmployeeNames[i] = this.text;
            });

            var tbAccount = window.dialogArguments.tbAccount;
            for (var i = 0; i < vAccountIDs.length; i++)
            {
                var repeatCnt = 0;
                for (var j = 1; j < tbAccount.rows.length; j++)
                {
                    if (getObjTR(tbAccount, j, "input", 0).value == vAccountIDs[i])
                    {
                        repeatCnt++;
                        repeat++;
                    }
                }

                if (repeatCnt > 0)
                {
                    continue;
                }

                var row = tbAccount.insertRow();

                var cell = row.insertCell(0);
                cell.align = "center";
                cell.innerHTML = '<input id="optionSelect" style="width:15px;height:15px;" type="checkbox" value="' + vAccountIDs[i] + '"  onclick="selectRow(this);" />';

                cell = row.insertCell(1);
                cell.innerHTML = '<a href="#ShowDoc" onclick="showAccount(\'' + vAccountIDs[i] + '\')">' + $.jgrid.stripHtml(vEmployeeNames[i]) + '</a>';

                cell = row.insertCell(2);
                cell.innerHTML = '<div style="text-align:center;"><input type="button" name="moveup" class="btnsmall" onclick="moveUp();" value="↑" /><input type="button" name="movedown" class="btnsmall" onclick="moveDown();" value="↓" /></div>';

                flag++;
            }

            setTableRowAttributes(tbAccount);

            window.opener = null;
            window.close();
        }
        else if (vAim == "PayRequestAccount")
        {
            
            var vAccountIDs = new Array();
            var vEmployeeNames = new Array();

            $('option', lstEmployees).each(function (i)
            {
                vAccountIDs[i] = this.value;
                vEmployeeNames[i] = this.text;
            });

            var tbCostSupplier = window.dialogArguments.dgCostSupplier;
            for (var i = 0; i < vAccountIDs.length; i++)
            {
                var repeatCnt = 0;
                for (var j = 1; j < tbCostSupplier.rows.length; j++)
                {
                    if (getObjTR(tbCostSupplier, j, "input", 0).value == vAccountIDs[i])
                    {
                        repeatCnt++;
                        repeat++;
                    }
                }

                if (repeatCnt > 0)
                {
                    continue;
                }
                /*  add by  lisj 2016-5-31
                   费用付款供应商(员工)：0、checkbox 1、供应商名称 2、付款成本 3、可抵扣税率 4、进项税额  5、付款合价  6、纳税人类型 7、开户行 8、开户名称 9、银行账号  10、 备注
                 */

                var row = tbCostSupplier.insertRow();
                var cell = row.insertCell(0);
                cell.align = "center";
                cell.innerHTML = '<input id="chkIDV3" type="checkbox" style="width:15px; heght: 15px"  value="' + vAccountIDs[i] + '"  suptype="4" />';

                cell = row.insertCell(1);
                cell.innerHTML = "<a href='javascript:void(0)' onclick=showAccount('" + vAccountIDs[i] + "')>" + stripHtml(vEmployeeNames[i]) + "</a>";


                cell = row.insertCell(2);
                cell.align = "center";
                cell.innerHTML = getTextBoxHtml("txtPayPrimeAmount", 100, null, "setMoneyValue(2);calculatorPrimeAmountAndTaxAmount(this,'Prime');calculator();", null, false);


                cell = row.insertCell(3);
                cell.align = "center";
                var divTaxRate = window.dialogArguments.document.getElementById("divTaxRate");
                //$("select[id*=ddlTaxRate]", $(divTaxRate)).val(parseFloat(vTaxRate[i]));
                cell.innerHTML = $("select[id*=ddlTaxRate]", $(divTaxRate)).get(0).outerHTML;


                cell = row.insertCell(4);
                cell.align = "center";
                cell.innerHTML = getTextBoxHtml("txtPayTaxAmount", null, null, null, null, true);


                cell = row.insertCell(5);
                cell.align = "center";
                cell.innerHTML = getTextBoxHtml("txtPayAmount", 100, null, "setMoneyValue(2);calculatorPrimeAmountAndTaxAmount(this,'Total');calculator();", null, false);


                //cell = row.insertCell(6);
                //cell.align = "left";
                //cell.innerText = "";
                cell = row.insertCell(6);
                cell.align = "left";
                var divTaxPayerType = window.dialogArguments.document.getElementById("divTaxPayerType");
                cell.innerHTML = $("select[id*=ddlTaxPayerType]", $(divTaxPayerType)).get(0).outerHTML;

                //cell = row.insertCell(2);
                //cell.align = "center";
                //cell.innerHTML = getTextBoxHtml("txtPayAmount", 100, null, "setMoneyValue(2); calculator();", null, false);


                cell = row.insertCell(7)
                cell.align = "center";
                cell.style.display = payRequest_BankInfo == "Y" ? "" : "none";
                cell.innerHTML = getTextBoxHtml("txtBankNameCost", null, null, null, null, false);

                cell = row.insertCell(8)
                cell.align = "center";
                cell.style.display = payRequest_BankName == "Y" ? "" : "none";
                cell.innerHTML = getTextBoxHtml("txtBankAccountCost", null, null, null, null, false);

                cell = row.insertCell(9)
                cell.align = "left";
                cell.style.display = payRequest_BankInfo == "Y" ? "" : "none";
                cell.innerHTML = getTextBoxHtml("txtBankNoCost", null, null, null, null, false, '98%');
                //+'<button onclick="selectBankAccountFee(\'\')" class="btnsmall" ><img class="btnimg" onerror="this.style.display=\'none\'" src="../../App_Themes/'+getObj('hidTheme').value +'/img/button/lookup.gif" style="border-width:0px;" /></button>';

                cell = row.insertCell(10);
                cell.innerHTML = getTextAreaHtml("txtRemark", 1000, null, null, false);
             

                flag++;
            }

            window.opener = null;
            window.close();
        }
        else
        {
            $('option', lstEmployees).each(function (i)
            {
                vEmployeeID += ',' + this.value;
                vEmployeeName += '，' + this.text;
                vType += ',' + this.type;
            });

            if (vEmployeeID == "")
            {
                vEmployeeName = "";
            }
            else
            {
                vEmployeeID = vEmployeeID.substr(1);
                vEmployeeName = vEmployeeName.substr(1);
                vType = vType.substr(1);
            }

            // window.returnValue = vEmployeeID + "|" +vEmployeeName;
            //alert(vEmployeeID + "|" +vEmployeeName+"|"+vType);
            window.returnValue = { IDS: vEmployeeID, Names: vEmployeeName, Types: vType };

            //手机短信 - 选择手机号码(YXW)
            if (getObj("hidAim").value == "SmSend")
            {
                var strText = "";
                var strValue = "";
                $('option', lstEmployees).each(function (i)
                {
                    strText += this.text + ",";
                    strValue += this.value + ",";
                });
                window.dialogArguments.getObj("txtMobile").value = strText.substring(0, strText.length - 1);
                window.dialogArguments.getObj("hidAccountID").value = strValue.substring(0, strValue.length - 1);
            }
            window.close();
        }
    }

