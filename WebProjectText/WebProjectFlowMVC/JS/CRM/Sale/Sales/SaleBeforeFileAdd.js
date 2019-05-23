//changcx
//JS 文件

//验证
function validateSize() 
{
    var Title = $("#txtSaleTitle").val();
    if (Title == "")
     {
        alert('请确保标题不为空！');
        return false;
    }
    return true;
}