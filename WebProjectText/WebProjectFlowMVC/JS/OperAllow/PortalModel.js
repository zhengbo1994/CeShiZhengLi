// JScript 文件

    
function AddPortalModel()
{
    openAddWindow("VPortalModelAdd.aspx", 500, 440, "jqGrid1");
}

function EditPortalModel()
{
    openModifyWindow("VPortalModelEdit.aspx", 500, 440, "jqGrid1")
}

function DelPortalModel()
{
    openDeleteWindow("PortalModel", 0, "jqGrid1");
}

function validateSize()
{
    handleBtn(false);
    if (getObj("txtPMName").value == "")
    {
        handleBtn(true);
        return alertMsg("功能模块标题不能为空。", getObj("txtPMName"));
    }
    if (getObj("txtPageURL").value == "")
    {
        handleBtn(true);
        return alertMsg("模块页面地址不能为空。",getObj("txtPageURL"));   
    }
    return true;
}

function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

       // 下拉菜单方法
function clickMenu(key)
{
    switch (key)
    {
        case "Setting":
            openModifyWindow('VPortalModelCondition.aspx', 0, 0, 'jqGrid1');
            break;
       
        case "Export":
        $('#btnExport').click();
        //aaexportClick();
           break;
         
    }
}

  function reloadData()
{

    $('#jqGrid1').getGridParam('postData').KeyWord = getObj("txtKW").value;
    $('#jqGrid1').trigger('reloadGrid');
}

function setIsUse(obj)
{
    getObj('hidOpen').value=obj.value;
}

//授权岗位
function btnSelectLookStation_Click(action,StationID,Station)
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim='+action, 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        getObj(StationID).value = vValue.split('|')[0];
        getObj(Station).value = vValue.split('|')[1];
    }
}

//授权部门
function btnSelectLookDept_Click(action,DeptID,Dept)
{
    var vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim='+action, 0, 0);
    if (vValue != "undefined" && vValue != null)
    {
        getObj(DeptID).value = vValue.split('|')[0];
        getObj(Dept).value = vValue.split('|')[1];
    }
}


// 岗位工作组
function addStationGroup(action,GroupID,Group)
{
    var vValue = openModalWindow('../../Common/Select/OperAllow/VSelectAvailableGroup.aspx?Aim='+action, 700, 600);
    if (vValue != "undefined" && vValue != null)
    {
        getObj(GroupID).value = vValue.split('|')[0];
        getObj(Group).value = vValue.split('|')[1];
    } 
    
}

function setIsUse(obj)
{
    switch(obj.value)
    {
        case "Y":
        $('#hidOpen').val(obj.value);
        $('#trStation').hide();
        $('#trDept').hide();
        $('#trGroup').hide();
        break;
        case "N":
        $('#hidOpen').val(obj.value);
        $('#trStation').show();
        $('#trDept').show();
        $('#trGroup').show();
        break;
    }
 }