// JScript 文件

//选择基础岗位
function selectBSName(aim)
{
    openModalWindow('../../Common/Select/OperAllow/VSelectBasicStation.aspx',600,500);    
    getObj("txt"+aim).value = getObj('hidBSName').value;    
    getObj("hid"+aim+"ID").value=getObj('hidBSID').value;
    return false; 
}