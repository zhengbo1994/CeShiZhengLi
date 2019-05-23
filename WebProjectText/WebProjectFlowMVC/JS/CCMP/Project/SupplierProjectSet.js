//模块名称 :设置中心-供应商管理设置
//模块编号 :
//文件名称 :项目设置JS文件
//作者: 马吉龙
//日期: 2010-5-14 9:39:06
function loadSet()
{
    setDisplay("COSThematicEvaluation");
    setDisplay("COSProcessEvaluation");
    setDisplay("COSAfterEvaluation");
    setDisplay("COSHEvaluation");
}

function validateSize()
{
    hidCOSThematicEvaluationList.value = "";
    for (var i=1; i<dgCOSThematicEvaluation.rows.length; i++)
    {
        var objInput = dgCOSThematicEvaluation.rows[i].getElementsByTagName("input");
        var objSelect = dgCOSThematicEvaluation.rows[i].getElementsByTagName("select");
        
        hidCOSThematicEvaluationList.value += "^" + objInput[4].value + "|" + hidCorpID.value + "|" + hidProjectID.value
            + "|4|" + objInput[3].value + "|" + (objInput[0].checked ? "Y" : "N")
            + "|" + (objInput[1].checked ? "Y" : "N") + "|" + objInput[2].value + "|0"
            + "|" + objSelect[0].value ;
    }            
    if (hidCOSThematicEvaluationList.value != "")
    {
        hidCOSThematicEvaluationList.value = hidCOSThematicEvaluationList.value.substr(1);
    }
    
    hidCOSProcessEvaluationList.value = "";
    for (var i=1; i<dgCOSProcessEvaluation.rows.length; i++)
    {
        var objInput = dgCOSProcessEvaluation.rows[i].getElementsByTagName("input");
        var objSelect = dgCOSProcessEvaluation.rows[i].getElementsByTagName("select");
        
        hidCOSProcessEvaluationList.value += "^" + objInput[4].value + "|" + hidCorpID.value + "|" + hidProjectID.value
            + "|1|" + objInput[3].value + "|" + (objInput[0].checked ? "Y" : "N")
            + "|" + (objInput[1].checked ? "Y" : "N") + "|" + objInput[2].value + "|0"
            + "|" + objSelect[0].value ;
    }            
    if (hidCOSProcessEvaluationList.value != "")
    {
        hidCOSProcessEvaluationList.value = hidCOSProcessEvaluationList.value.substr(1);
    }
    
    hidCOSAfterEvaluationList.value = "";
    for (var i=1; i<dgCOSAfterEvaluation.rows.length; i++)
    {
        var objInput = dgCOSAfterEvaluation.rows[i].getElementsByTagName("input");
        var objSelect = dgCOSAfterEvaluation.rows[i].getElementsByTagName("select");
        
        hidCOSAfterEvaluationList.value += "^" + objInput[5].value + "|" + hidCorpID.value + "|" + hidProjectID.value
            + "|2|" + objInput[4].value + "|" + (objInput[0].checked ? "Y" : "N")
            + "|" + (objInput[1].checked ? "Y" : "N") + "|" + objInput[2].value + "|" + objInput[3].value
            + "|" + objSelect[0].value;
    }            
    if (hidCOSAfterEvaluationList.value != "")
    {
        hidCOSAfterEvaluationList.value = hidCOSAfterEvaluationList.value.substr(1);
    }
      
    hidCOSHEvaluationList.value = "";
    for (var i=1; i<dgCOSHEvaluation.rows.length; i++)
    {
        var objInput = dgCOSHEvaluation.rows[i].getElementsByTagName("input");
        var objSelect = dgCOSHEvaluation.rows[i].getElementsByTagName("select");
        
        hidCOSHEvaluationList.value += "^" + objInput[4].value + "|" + hidCorpID.value + "|" + hidProjectID.value
            + "|5|" + objInput[3].value + "|" + (objInput[0].checked ? "Y" : "N")
            + "|" + (objInput[1].checked ? "Y" : "N") + "|" + objInput[2].value + "|0"
            + "|" + objSelect[0].value;
    }            
    if (hidCOSHEvaluationList.value != "")
    {
        hidCOSHEvaluationList.value = hidCOSHEvaluationList.value.substr(1);
    }
    return true;
}

function setDisplay(type)
{
    if (type == "COSThematicEvaluation"&&dgCOSThematicEvaluation!=null)
    {
        dgCOSThematicEvaluation.disabled = chkIsCOSThematicEvaluation.checked ? false : true;
        for (var i=1; i<dgCOSThematicEvaluation.rows.length; i++)
        {
            var objInput = dgCOSThematicEvaluation.rows[i].getElementsByTagName("input");
            objInput[0].disabled = chkIsCOSThematicEvaluation.checked ? false : true;
            objInput[1].disabled = (!objInput[0].disabled && objInput[0].checked) ? false : true;
            objInput[2].disabled = (!objInput[1].disabled && objInput[1].checked) ? false : true;
            
            var objSelect = dgCOSThematicEvaluation.rows[i].getElementsByTagName("select");
            objSelect[0].disabled = (!objInput[0].disabled && objInput[0].checked) ? false : true;
           // objSelect[1].disabled = (!objInput[0].disabled && objInput[0].checked) ? false : true;
        }
    }
    else if (type== "COSProcessEvaluation"&&dgCOSProcessEvaluation!=null)
    {
        dgCOSProcessEvaluation.disabled = chkIsCOSProcessEvaluation.checked ? false : true;
        for (var i=1; i<dgCOSProcessEvaluation.rows.length; i++)
        {
            var objInput = dgCOSProcessEvaluation.rows[i].getElementsByTagName("input");
            objInput[0].disabled = chkIsCOSProcessEvaluation.checked ? false : true;
            objInput[1].disabled = (!objInput[0].disabled && objInput[0].checked) ? false : true;
            objInput[2].disabled = (!objInput[1].disabled && objInput[1].checked) ? false : true;
            
            var objSelect = dgCOSProcessEvaluation.rows[i].getElementsByTagName("select");
            objSelect[0].disabled = (!objInput[0].disabled && objInput[0].checked) ? false : true;
            //objSelect[1].disabled = (!objInput[0].disabled && objInput[0].checked) ? false : true;                
        }
    }
    else if (type== "COSAfterEvaluation"&&dgCOSAfterEvaluation!=null)
    {
        dgCOSAfterEvaluation.disabled = chkIsCOSAfterEvaluation.checked ? false : true;
        for (var i=1; i<dgCOSAfterEvaluation.rows.length; i++)
        {
            var objInput = dgCOSAfterEvaluation.rows[i].getElementsByTagName("input");
            objInput[0].disabled = chkIsCOSAfterEvaluation.checked ? false : true;
            objInput[1].disabled = (!objInput[0].disabled && objInput[0].checked) ? false : true;
            objInput[2].disabled = (!objInput[1].disabled && objInput[1].checked) ? false : true;
            objInput[3].disabled = chkIsCOSAfterEvaluation.checked ? false : true;
            
            var objSelect = dgCOSAfterEvaluation.rows[i].getElementsByTagName("select");
            objSelect[0].disabled = (!objInput[0].disabled && objInput[0].checked) ? false : true;
            //objSelect[1].disabled = (!objInput[0].disabled && objInput[0].checked) ? false : true;
        }
    }
     else if (type== "COSHEvaluation"&&dgCOSHEvaluation!=null)
    {
        dgCOSHEvaluation.disabled = chkIsCOSHEvaluation.checked ? false : true;
        for (var i=1; i<dgCOSHEvaluation.rows.length; i++)
        {
            var objInput = dgCOSHEvaluation.rows[i].getElementsByTagName("input");
            objInput[0].disabled = chkIsCOSHEvaluation.checked ? false : true;
            objInput[1].disabled = (!objInput[0].disabled && objInput[0].checked) ? false : true;
            objInput[2].disabled = (!objInput[1].disabled && objInput[1].checked) ? false : true;
            objInput[3].disabled = chkIsCOSHEvaluation.checked ? false : true;
            
            var objSelect = dgCOSHEvaluation.rows[i].getElementsByTagName("select");
            objSelect[0].disabled = (!objInput[0].disabled && objInput[0].checked) ? false : true;
            //objSelect[1].disabled = (!objInput[0].disabled && objInput[0].checked) ? false : true;
        }
    }
}
