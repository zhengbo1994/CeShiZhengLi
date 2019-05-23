
function setFlowType()
{
    var corpID = getObj("ddlCorp").value;
    var fcID = getObj("hidFCID").value;
    openWindow("VFunctionClassEdit.aspx?FCID='"+fcID+"'CorpID='" + corpID, 400, 300, 0, 0, 1);
}
function delFlowType()
{
    openDeleteWindow("FunctionClassFlowType", 0);
}
function reloadData()
{

}
function showFlowType()
{
 
}