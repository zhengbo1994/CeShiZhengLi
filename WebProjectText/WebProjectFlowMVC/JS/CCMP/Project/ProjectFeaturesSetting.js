// JScript 文件

function showPFCT(index)
{
    selectTab(index,"PFCTName");
    
    for (var i = 0; i < getObjs("PFCTName").length; i++)
    {
        getObj("divPFCT" + i).style.display = "none";
    }
    
    getObj("divPFCT"+index).style.display="block";   
}  

function windowLoad()
{
    var obj = getObjs("PFCTName");
    if (obj.length > 0)
    {
        showPFCT(0);
    }
}

function validateSize()
{
   handleBtn(false);
    
    hidFeatureList.value = "";
    var obj = document.getElementsByTagName("input");
    for (var i = 0; i < obj.length; i++)
    {
        if (obj(i).type.toUpperCase() == "TEXT")
        {
            var cellMS = obj(i).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.cells(0);
            var cellPF = obj(i).parentNode.parentNode.cells(0);
            var divPFCT = cellMS.parentNode.parentNode.parentNode.parentNode;
            if (obj(i).pfType == "1" && obj(i).value != "" && isNaN(obj(i).value))
            {
                handleBtn(true);
                showPFCT(parseInt(divPFCT.id.replace("divPFCT", "")));
                return alertMsg("“" + cellPF.innerText.replace(/\ /g, '') + '”必须为数字。', obj(i));
            }
            else
            {
                var msID =getObjC(cellMS, "input", 0).value;
                var pfID = getObjC(cellPF, "input", 0).value;
                var pfctID = getObjC(divPFCT, "input", 0).value;
                
                hidFeatureList.value += "^" + obj(i).pfType + "|" + msID + "|" + pfID + "|" + pfctID + "|" + obj(i).value.replace(/\^/g, '').replace(/\|/g, '');
            }
        }
    }
    obj = document.getElementsByTagName("select");
    for (var i = 0; i < obj.length; i++)
    {
        var cellMS = obj(i).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.cells(0);
        var cellPF = obj(i).parentNode.parentNode.cells(0);
         var divPFCT = cellMS.parentNode.parentNode.parentNode.parentNode;
        
        var msID = getObjC(cellMS, "input", 0).value;
        var pfID = getObjC(cellPF, "input", 0).value;
        var pfctID = getObjC(divPFCT, "input", 0).value;
        
        hidFeatureList.value += "^" + obj(i).pfType + "|" + msID + "|" + pfID + "|" + pfctID + "|" + obj(i).options[obj(i).selectedIndex].value;
    }
    if (hidFeatureList.value != "")
    {
        hidFeatureList.value = hidFeatureList.value.substr(1);
    }
    
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}