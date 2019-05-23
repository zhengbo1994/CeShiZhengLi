function setModule()
{
    var fcID = getObj("hidFCID").value;
    openWindow("../../Common/Select/OperAllow/VSelectWaitModule.aspx?FCID='" + fcID, 400, 300, 0, 0, 1);
}
function delModule()
{
    openDeleteWindow("FunctionClassModule", 0);
}
function reloadData()
{

}