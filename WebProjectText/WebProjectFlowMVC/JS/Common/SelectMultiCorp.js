// VSelectMultiDept.aspx等页面的JS文件
// 作者：徐海波
// 时间：2010-05-15
function RefreshCorpStructure(struID)
{
    // 页面层级不同，不能单独方法
   // var vDeptIDs = "";
   // var lstDepts = window.parent.getObj("lstDepts");
  //  for (var i=0; i<lstDepts.options.length; i++)
//    {
//        vDeptIDs += "," + lstDepts.options[i].value;
 //   }
    
 //   if (vDeptIDs != "")
 //   {
 //       vDeptIDs = vDeptIDs.substr(1)
  //  }
    
   // $('#jqgDept',window.parent.frames("Main").document).getGridParam('postData').StruID=struID;
   // $('#jqgDept',window.parent.frames("Main").document).getGridParam('postData').DeptID=vDeptIDs;
    window.parent.frames("Main").window.reloadData();
}

function ChangeBackColor(span)
{
    getObj(getObj("hidFirstSpan").value).className = "normalNode";
    span.className = "selNode";
    getObj("hidFirstSpan").value = span.id;
}

function reloadData()
{      
    refreshJQGrid('jqgDept');
}

function ChangeChild()
{
    btnSearch_Click();
}

function btnSearch_Click()
{
    var vKey=$("#txtKey").val();
    var child = $('#ddlChild').val(); 
    $('#jqgDept',window.frames("Main").document).getGridParam('postData').KeyValue=vKey;
    window.frames('Main').window.reloadData();
}



function btnChoose_Click()
{
    btnAdd_Click();
    var vDeptID = "";
    var vStruName = "";
    var lstDepts = getObj("lstDepts");
    for (i = 0; i < lstDepts.length; i++)
    {
        vDeptID += ',' + lstDepts.options[i].value;
        vStruName += '，' + lstDepts.options[i].text;
    }
    
    if (vDeptID == "")
    {
        vDeptID = "";
        vStruName = "";
    }
    else
    {
        vDeptID = vDeptID.substr(1);
        vStruName = vStruName.substr(1);
    }
 
    window.returnValue = vDeptID + "|" +vStruName;
    
    window.close();
  
}

function btnAdd_Click(chk)
{
    var lstDepts = getObj("lstDepts");
    
    var vDeptID = window.frames('Main').getJQGridSelectedRowsID('jqgDept', true);
    var vStruName = window.frames('Main').getJQGridSelectedRowsData('jqgDept',true,'CorpName');
   // var vParentCorpName = window.frames('Main').getJQGridSelectedRowsData('jqgDept',true,'ParentCorpName');

    if (vDeptID.length == 0&chk=='chk')
    {
        return alertMsg("请选择部门。", getObj("btnAdd"));    
    }

    for (var i=0;i<vDeptID.length;i++)
    {
        var repeat = false;
        for (j = 0; j < lstDepts.length; j++)
        {
            if (lstDepts.options[j].value == vDeptID[i])
            {
                repeat = true;
                break;
            }
        }
        
        if (!repeat && vDeptID[i] != "")
        {
            var opt = document.createElement("OPTION");
            opt.value = vDeptID[i];
            opt.text = $.jgrid.stripHtml(vStruName[i]);
        
            lstDepts.add(opt, lstDepts.length);
        }
    }
}

function btnDel_Click()
{
    var lstDepts = getObj("lstDepts");
    for(i = lstDepts.options.length - 1; i >= 0; i--) 
    {
        if (lstDepts.options[i].selected) 
        {
            lstDepts.remove(i);
        }
    }
}

function btnAddAll_Click()
{
    var lstDepts = getObj("lstDepts");
    
    var vDeptID = window.frames('Main').getJQGridAllRowsID('jqgDept');
    var vStruName = window.frames('Main').getJQGridAllRowsData('jqgDept','CorpName');
   // var vParentCorpName = window.frames('Main').getJQGridAllRowsData('jqgDept','ParentCorpName');
    if (vDeptID.length == 0)
    {
        return;    
    }

    for (var i=0;i<vDeptID.length;i++)
    {
        var repeat = false;
        for (j = 0; j < lstDepts.length; j++)
        {
            if (lstDepts.options[j].value == vDeptID[i])
            {
                repeat = true;
                break;
            }
        }
        
        if (!repeat && vDeptID[i] != "")
        {
            var opt = document.createElement("OPTION");
            opt.value = vDeptID[i];
            opt.text = $.jgrid.stripHtml(vStruName[i]);
            
            lstDepts.add(opt, lstDepts.length);
        }
    }
}

function btnDelAll_Click()
{
    var lstDepts = getObj("lstDepts");
    for(i = lstDepts.options.length - 1; i >= 0; i--) 
    {
        lstDepts.remove(i);
    }
}

function move(to) 
{
    var list = getObj("lstDepts");
    var total = list.options.length-1;
    var index = getObj("lstDepts").selectedIndex;
    if (index == -1) return false;
    if (to == +1 && index == total) return false;
    if (to == -1 && index == 0) return false;
        
    //临时保存选项的值
    var text = list.options[index].text;
    var value = list.options[index].value;

    //将目标选项复制到当前选项           
    list.options[index].text =list.options[index+to].text 
    list.options[index].value =list.options[index+to].value 

    //转移到目标选项           
    list.options[index+to].text = text;
    list.options[index+to].value =value;

    //选中索引也跟着变
    list.selectedIndex = index+to;   
    list.focus();
}

//双击删除 
function  lstDeptsDB_Clisk() 
{
    var   addOption=document.createElement( "option"); 
    var   index; 
            
    if(getObj("lstDepts").length==0)return(false); 
    index=getObj("lstDepts").selectedIndex;   
    if(index <0)return(false); 
    getObj("lstDepts").remove(index); 
}

 //双击添加
function jqGridDblClick(rowid, iRow, iCol, e)
{        
    var lstDepts = getObjP("lstDepts");
    var vDeptID = rowid;
    var vStruName = $('#jqgDept').getRowData(rowid)['CorpName'];

     if($(window.parent.document).find('#lstDepts option[value=\''+vDeptID+'\']').length<=0)
    {               
        var opt = document.createElement("OPTION");
        opt.value = vDeptID;
        opt.text = $.jgrid.stripHtml(vStruName);
        lstDepts.add(opt, lstDepts.length);
    }
}