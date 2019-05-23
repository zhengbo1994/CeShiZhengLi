// JScript 文件

function selectBasicStation()
{
    if ($('#hidSelectType').val() != "" && $('#hidSelectType').val() == "MutliSelect") 
    {
        //多选
        var vStationID = getJQGridSelectedRowsID('jqBasicStation', true).join(",");
        var vStationName = stripHtml(getJQGridSelectedRowsData('jqBasicStation',true,'BSName').join("，"));
        
        if(vStationID.length < 1)
        {
            return alertMsg("选择基础岗位。", getObj("btnLookUp"))
        }
        
        window.returnValue = vStationID + "|" + vStationName;
    }
    else
    {   
        var  hidBSID = getObjD('hidBSID');
        var  hidBSName = getObjD('hidBSName'); 
        var  ids = getJQGridSelectedRowsID('jqBasicStation', false);
        if (ids == null || ids == "")
        {
            return alertMsg("选择基础岗位。", getObj("btnLookUp"));    
        }
      
        hidBSID.value = getJQGridSelectedRowsData('jqBasicStation',false,'BSID');
        if (hidBSName != null)
        {
            hidBSName.value = stripHtml(getJQGridSelectedRowsData('jqBasicStation',false,'BSName'));
        }
        window.returnValue = hidBSID.value + "|" + hidBSName.value;
    }
    window.close();
}
function clearBSName() {
    var hidBSID = getObjD('hidBSID');
    var hidBSName = getObjD('hidBSName');
    if (hidBSID != null) {
        hidBSID.value = "";
    }
    if (hidBSName != null) {
        hidBSName.value = "";
    }
    window.returnValue = "";
    window.close();
}


function reloadMultiBasicStation() {
    var ExistIDs = $('#hidExistBSIDs').val(); 
    var HasLoaded = $('#hidHasLoaded').val(); 

    var jqgObj = $('#jqBasicStation', document);

    jqgObj.getGridParam('postData').ExistIDs = ExistIDs;
    jqgObj.getGridParam('postData').HasLoaded = HasLoaded;

    setTimeout(function () {
        refreshJQGrid('jqBasicStation');
    }, 500);
}

function selectMultiBasicStation() {
    var BSIDs = getJQGridSelectedRowsID('jqBasicStation', true);
    var BSNames = stripHtml(getJQGridSelectedRowsData('jqBasicStation', true, 'BSName').join());

    if (!BSIDs || BSIDs.length == 0) {
        alert("请至少选择一个基础岗位");
        return false;
    }
    BSIDs = stripHtml(BSIDs.join());

    var returnJson = {
        BSIDs: BSIDs,
        BSNames: BSNames      
    };

    window.returnValue = returnJson;
    window.close();
}

function clearBS() {
    window.returnValue = "ClearBS";
    window.close();
}

