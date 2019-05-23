// JScript 文件
function selectCMName()
{
    var chk = getSelectedBox("chkIDV3");
    if (chk != null)
    {
        window.returnValue = chk.value + "|" + chk.cmname ;
        window.close();  
    }
    else
    {
        return;
    }
}
function selectCWMName()
{
    var chk = getSelectedBox("chkIDV3");
    if (chk != null)
    {
        window.returnValue = chk.value + "|" + chk.cwmname;
        window.close();  
    }
    else
    {
        return;
    }
}


