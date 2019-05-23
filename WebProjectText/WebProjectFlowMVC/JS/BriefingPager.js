// JScript 文件
function initPageList(iPageHeight,objListItem,objStartBox,objEndBox,objUpButton,objDownButton)
{
    objEndBox.value=objListItem.length;
    objStartBox.value=0;
    for (var i=0;i<objListItem.length;i++)
    {
        objListItem[i].parentNode.parentNode.style.display = "";
        if (parseInt(objListItem[i].parentNode.offsetTop)>parseInt(iPageHeight))
        {
            objEndBox.value=i-2;
            objListItem[i-1].parentNode.parentNode.style.display = "none";
            objListItem[i].parentNode.parentNode.style.display = "none";
            break;
        }
        else if (i==objListItem.length-1)
        {
            objEndBox.value=i;
        }
    }
    
    objUpButton.disabled = false;
    if (parseInt(objStartBox.value) == 0)
    {
        objUpButton.disabled = true;
    }
    
    objDownButton.disabled = false;
    if (parseInt(objEndBox.value) == parseInt(objListItem.length-1))
    {
        objDownButton.disabled = true;
    }
}

function showPageListUp(iPageHeight,objListItem,objStartBox,objEndBox,objUpButton,objDownButton)
{
    var vStartIndex = parseInt(objStartBox.value);
    var vEndIndex = parseInt(objEndBox.value);
    
    // 把原来显示的隐藏
    for (var i=vStartIndex;i<=vEndIndex;i++)
    {
        objListItem[i].parentNode.parentNode.style.display = "none";
    }
    
    // 现在的结束应该是原来的开始-1
    objEndBox.value=vStartIndex-1;
    
    // 从原来的结束开始，这个可以肯定倒数第二行是显示的，所以当最后一行超的话，新加入的不显示，并且最后一行不显示
    for (var i=vStartIndex;i>=0;i--)
    {
        objListItem[i].parentNode.parentNode.style.display = "";
        
        // 如果超了，因为我们能肯定倒数第二行是不超的，所以新加入不显示
        if (parseInt(objListItem[vStartIndex].parentNode.offsetTop)>parseInt(iPageHeight))
        {
            objListItem[i].parentNode.parentNode.style.display = "none";
            // 当前行不能要，所以要加上1
            objStartBox.value=i+1;
            break;
        }
        else if (i==0)
        {
            objStartBox.value=i;
        }
    }
    
    // 隐藏多加入的一行
    objListItem[vStartIndex].parentNode.parentNode.style.display = "none";
            
    objUpButton.disabled = false;
    if (parseInt(objStartBox.value) == 0)
    {
        objUpButton.disabled = true;
    }
    
    objDownButton.disabled = false;
    if (parseInt(objEndBox.value) == parseInt(objListItem.length-1))
    {
        objDownButton.disabled = true;
    }
}

function showPageListDown(iPageHeight,objListItem,objStartBox,objEndBox,objUpButton,objDownButton)
{
    var vStartIndex = parseInt(objStartBox.value);
    var vEndIndex = parseInt(objEndBox.value);    
    
    for (var i=vStartIndex;i<=vEndIndex;i++)
    {
        objListItem[i].parentNode.parentNode.style.display = "none";
    }
    
    objStartBox.value=vEndIndex+1;
    for (var i=vEndIndex+1;i<objListItem.length;i++)
    {
        objListItem[i].parentNode.parentNode.style.display = "";
        
        if (parseInt(objListItem[i].parentNode.offsetTop)>parseInt(iPageHeight))
        {
            // 当前行的Top超限的话，说明上一行的底部也超了，所以都不显示
            objEndBox.value=i-2;
            objListItem[i-1].parentNode.parentNode.style.display = "none";
            objListItem[i].parentNode.parentNode.style.display = "none";
            break;
        }
        else if (i==objListItem.length-1)
        {
            objEndBox.value=i;
        }
    }
    
    objUpButton.disabled = false;
    if (parseInt(objStartBox.value) == 0)
    {
        objUpButton.disabled = true;
    }
    
    objDownButton.disabled = false;
    if (parseInt(objEndBox.value) == parseInt(objListItem.length-1))
    {
        objDownButton.disabled = true;
    }
}