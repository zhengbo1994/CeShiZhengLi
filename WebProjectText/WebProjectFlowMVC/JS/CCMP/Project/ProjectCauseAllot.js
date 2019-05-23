// JScript 文件

//核算对象
function addObject()
{
    
    var projectID=getObj('ddlProject').value;
    if(projectID == "")
    {
        return alertMsg("选择页参数不能为空!");
    }
    
    var url="../../Common/Select/CCMP/VSelectProjectObjectTree.aspx?Action=ProjectCause&ID=" + projectID+"&ProjectID="+projectID;

    var returnValue = openModalWindow(url,800,600,0,1,1);

}

function delObject()
{
    var projectID=getObj('ddlProject').value;
    openDeleteWindow("Object",4,null,null,{RealID:projectID,CostType:"ProjectCause"});
}


function selectObjectAll(chk)
{

    dgData=getObj(getObj("hidDgDataID").value);
    selectTableAll(dgData,chk);
}


function addSubject(objectID)
{
    var projectID=getObj("ddlProject").value;
    if(projectID == ""||objectID=="")
    {
        return alertMsg("选择页参数不能为空!");
    }
    
    var url="VProjectCauseObjectSubjectSettingAdd.aspx?ObjectID="+objectID+"&ProjectID="+projectID;;

    openWindow(url,1000,600,0,1,1);

}
function editSubject(objectID)
{
    var projectID=getObj("ddlProject").value;
    if(projectID == ""||objectID=="")
    {
        return alertMsg("选择页参数不能为空!");
    }
    
    var url="VProjectCauseObjectSubjectSettingBrowse.aspx?ObjectID="+objectID+"&ProjectID="+projectID;;

    openWindow(url,1000,600,0,1,1);

}

function checkSubject()
{
   if($("input[@type=checkbox]:checked").size()==0)
   {
        return alertMsg("没有选择任何成本科目。");
   }
   return true;
}


function editObjectSubject()
{
    var projectID=getObj("hidProjectID").value;
    var objectID=getObj("hidObjectID").value;
    openModifyWindow("VProjectCauseObjectSubjectSettingEdit.aspx?ProjectID="+projectID+"&ObjectID="+objectID, 400, 300);
}

function delObjectSubject()
{
    var projectID=getObj("hidProjectID").value;
    var objectID=getObj("hidObjectID").value;
    openDeleteWindow("ObjectSubject", 4, null,null,{RealID:projectID,ObjectID:objectID,CostType:"ProjectCause"}); 
}

function validateEdit()
{
    if(getObj("txtUnitQty").value == "" )
    {
        return alertMsg('工程量不合法(必须为非负数)。',getObj("txtUnitQty"));
    }
    if((getObj("txtCauseCost").value == ""))
    {
        return alertMsg("成本不合法(不超过2位小数)。",getObj("txtCauseCost"));
    }
    return true;

}

function allot()
{
  var projectID=getObj('ddlProject').value;
  ajaxRequest
  (
        "VProjectCauseObjectSubjectSetting.aspx",
        {
            AjaxRequest:true,
            AjaxActionName:"CollectProjectCauseSubject",
            ProjectID:projectID,
            Title:top.document.title
        },
        "html",
        afterSave,
        "POST"
   )
}

// 新增后弹出消息(成功或失败)
function afterSave(data, textStatus)
{
    alert(data); 
}

//function checkObjectSubject()
//{
//   if($("input[@type=checkbox]:checked").size()==0)
//   {
//        return alertMsg("没有选择任何成本科目。");
//   }
//   return true;

//}
//function validateSize()
//{
//    if(getObj("txtUnitQty").value == ""  || parseFloat(getObj("txtUnitQty").value) < 0)
//    {
//        return alertMsg('工程量不合法(必须为非负数)。',getObj("txtUnitQty"));
//    }
//    if((getObj("txtCauseCost").value == ""))
//    {
//        return alertMsg("预测成本不合法(不超过2位小数)。",getObj("txtBudgetCost"));
//    }
//    return true;
//}


//function setBudgetQty(cellIndex)
//{
//    var txtBudgetQty = getObjTR(dgData,cellIndex,'input',4);
//    var txtBudgetPrice = getObjTR(dgData,cellIndex,'input',5);
//    var txtBudgetCost = getObjTR(dgData,cellIndex,'input',6);
//    var costQuota = dgData.rows(cellIndex).cells(11).innerText;

//    var budgetQty = getRound(txtBudgetQty.value,2);
//    var budgetPrice = getRound(txtBudgetPrice.value,2);
//    var budgetCost = getRound(budgetQty * budgetPrice,2);
//    
//    txtBudgetCost.value = getMoneyValue(budgetCost);
//       
//    if (budgetCost > costQuota)
//    {
//        txtBudgetCost.style.color = "red";
//    }
//    else
//    {
//        txtBudgetCost.style.color = "black";
//    }
//}
//function setBudgetPrice(cellIndex)
//{
//    var txtBudgetQty = getObjTR(dgData,cellIndex,'input',4);
//    var txtBudgetPrice = getObjTR(dgData,cellIndex,'input',5);
//    var txtBudgetCost = getObjTR(dgData,cellIndex,'input',6);
//    var costQuota = dgData.rows(cellIndex).cells(11).innerText;

//    var budgetQty = getRound(txtBudgetQty.value,2);
//    var budgetPrice = getRound(txtBudgetPrice.value,2);
//    var budgetCost = getRound(budgetQty * budgetPrice,2);
//    
//    txtBudgetCost.value = getMoneyValue(budgetCost);
//       
//    if (budgetCost > costQuota)
//    {
//        txtBudgetCost.style.color = "red";
//    }
//    else
//    {
//        txtBudgetCost.style.color = "black";
//    }

//}
//function setBudgetCost(cellIndex)
//{
//    var txtBudgetQty = getObjTR(dgData,cellIndex,'input',4);
//    var txtBudgetPrice = getObjTR(dgData,cellIndex,'input',5);
//    var txtBudgetCost = getObjTR(dgData,cellIndex,'input',6);
//    var costQuota = dgData.rows(cellIndex).cells(11).innerText;

//    var budgetQty = getRound(txtBudgetQty.value,2);
//    var budgetCost = getRound(txtBudgetCost.value,2);
//    var budgetPrice = getRound((budgetQty == 0 ? 0 : budgetCost / budgetQty),2);
//    txtBudgetPrice.value = getMoneyValue(budgetPrice);

//    if (budgetCost > costQuota)
//    {
//        txtBudgetCost.style.color = "red";
//    }
//    else
//    {
//        txtBudgetCost.style.color = "black";
//    }
//}




//function setObjectSubject(objectID)
//{
//    var actionID = getObj('hidActionID').value;
//    var action = getObj('hidAction').value;
//    var operate = getObj('hidOperate').value;
//    var projectID=getObj('hidProjectID').value;
//    
//    var url = "VBudgeGatherObjectSubject.aspx?Action="+action+"&ActionID=" + actionID+"&ObjectID="+objectID+"&Operate="+operate+"&ProjectID="+projectID;
//    window.openWindow(url,900,700);

//    
//}



//function showStandard(standardVersionNo)
//{
//    alert("标准版本号:"+standardVersionNo);
//}



