// JScript 文件
//绩效管理－－分级标准--jacky 20120313

function renderLink(cellvalue,options,rowobject)
{
        var url = "'VPerformanceRankingBrowse.aspx?ID="+ rowobject[0] + "'" ;
         return '<a  href="#" onclick="javascript:openWindow(' + url + ',600, 370)">' + cellvalue + '</a>' ;
}
//CustomizeFormatter="renderLink"

/* 刷新jqGrid */
function reloadData()
{
    $('#jqGrid1').trigger('reloadGrid');
}

/* 重写refreshJQGrid */
function refreshJQGrid(id)
{
    reloadData();
}

//$(".title desc_pad").corner("10px top");

//新增分级标准
function addNewRanking()
{
openAddWindow("VPerformanceRankingAdd.aspx", 600, 370, "jqGrid1");
}

//修改分级标准
function editCurrentRanking()
{
    openModifyWindow("VPerformanceRankingEdit.aspx?", 600, 370, "jqGrid1")
}

//删除分级标准
function delCurrentRanking()
{
    openDeleteWindow("PerformanceRanking", 1, "jqGrid1");
}


//js动态添加行
function btnAddRequestList_onclick()
{
    // 插入数据，插入前要做数据和为1或者100的检测
  var cnt = dgRequestList.rows.length;

//      var sum = 0;  
//     var b = true;
//     var b1=true;
//    var b2 = true; 
//  if(cnt >=2)//有数据行
//  {
//    
//     for(i = 1; i < cnt; i++)
//    {
//        var qtyscale = dgRequestList.rows(i).getElementsByTagName("input").item(3).value;
//       
//       sum = sum + parseFloat(qtyscale); 
//     }

//    if(isNaN(sum))
//    {
//       b = false;
//        alert("分数或百分数和不是数字。");
//       return false; 
//    } 
//    
//    var pulldowncurrentvalue = getObj("ddlRankingType").options[getObj("ddlRankingType").selectedIndex].value;
//    
//    b1 = (pulldowncurrentvalue == 1 && sum >= 0 &&  sum <= 100); //分数比--2--百分比
//   b2 =  (pulldowncurrentvalue == 2 && sum >= 0 && sum <=100);//分数比--2--百分比
//   if(pulldowncurrentvalue  == 1)
//  { 
//    if(!b1)
//    {
//        alert("分数比之和已经是100了，不能再继续添加新级别。");
//       b = false; 
//       return false; 
//    }
//    }
//    
//    if(pulldowncurrentvalue  == 2)
//    {
//    if(!b2)
//    {
//        alert("百分比之和已经是100了，不能再继续添加新级别。");
//       b = false; 
//       return false; 
//    }
//    }
//      
//  }

//    if((b== true && b1 == true && sum < 100) || (b== true && b2 == true  && sum < 100) )
//    {
    var name = getUniqueKey();
    
    var row = dgRequestList.insertRow();  
    
    var cell = row.insertCell(0);
    cell.align = "center";
    cell.innerHTML = getCheckBoxHtml(name);   
           
    cell = row.insertCell(1);
    cell.innerHTML=getTextBoxHtml("txtLevel"+name,80,'',"");  
    
    cell = row.insertCell(2);
    cell.innerHTML=getTextBoxHtml("txtLevelName"+name,80,'',"");  
    
    cell = row.insertCell(3);
    cell.innerHTML=getTextBoxHtml("txtQtyScale"+name,80,'',"setRound();");  
//    }
//    else
//    {
//        if(b1== true && sum >=1)
//            alert("分数之和已经是100了，不能再继续添加新级别。");
//         else
//         if(b2== true && sum >=100)
//            alert("百分数之和已经是100了，不能再继续添加新级别。");
//    }

}


//动态删除行 
function btnDeleteDetail_onclick()
{
    var cnt = dgRequestList.rows.length - 1;
    for(j = cnt; j > 0; j--)
    {
	    if(dgRequestList.rows(j).getElementsByTagName("input").item(0).checked)
	    {
		    dgRequestList.deleteRow(j);
	    }
    }
    dgRequestList.rows(0).getElementsByTagName("input").item(0).checked = false;
}


//数据验证
function validateSize()
{
    if(trim(getObj("txtRankingName").value) == "")
    {
         return alertMsg("分级名称不能为空。", getObj("txtRankingName"));
    }
    
//     if(trim(getObj("txtRemark").value) == "")
//    {
//        return alertMsg("描述不能为空。", getObj("txtRemark"));
//    }

    var cnt = dgRequestList.rows.length;
    var pulldowncurrentvalue = getObj("ddlRankingType").options[getObj("ddlRankingType").selectedIndex].value;
    var pulldowntext = "";
     pulldowntext = pulldowncurrentvalue == 1 ? "分数":"百分数";
    var lastlevel = 0;
    var lastqtyscale = "";
    var currentlevel = 0;
    var currentqtyscale = "";
    for(i = 1; i < cnt; i++)
    {
        var level = dgRequestList.rows(i).getElementsByTagName("input").item(1);
        var levelname = dgRequestList.rows(i).getElementsByTagName("input").item(2);
        var qtyscale = dgRequestList.rows(i).getElementsByTagName("input").item(3);

        if(trim(level.value) == "")
        {
            return alertMsg('级别不能为空。', level);
        }
        
        if(!isPositiveIntAnd0(level.value)) 
        {
            return alertMsg('级别必须为整数。', level);
        }
        
       if(trim(levelname.value) == "")
        {
            return alertMsg('级名不能为空。', levelname);
        }
       
       if(trim(qtyscale.value) == "")
        {
            return alertMsg('分数线不能为空。', qtyscale);
        } 
       
       currentlevel=parseFloat(trim(level.value));
       currentqtyscale =  parseFloat(trim(qtyscale.value));
       if( i == 1)
       {
           lastlevel=parseFloat(trim(level.value));
           lastqtyscale =  parseFloat(trim(qtyscale.value));
       } 
       if(i >= 2)
       {
          if(currentlevel == lastlevel)
         {
                return alertMsg("不能有一样的级别。", level);
                return false;
         } 
           if(currentlevel > lastlevel && currentqtyscale >= lastqtyscale)
           {
                
                return alertMsg("级别越小"+pulldowntext+"越大，并且"+pulldowntext+"不能相等。", qtyscale); 
                return false;
           }  
           
           if(currentlevel < lastlevel && currentqtyscale <= lastqtyscale)
           {
                
                return alertMsg("级别越小"+pulldowntext+"越大，并且"+pulldowntext+"不能相等。", qtyscale); 
                return false;
           } 
       }     
       
       lastlevel = currentlevel;
       lastqtyscale = currentqtyscale;
    }
    
     for(i = 1; i < cnt; i++)
    {
             for(j=i+1;j<cnt;j++)
            {
                 if(dgRequestList.rows(i).getElementsByTagName("input").item(1).value == dgRequestList.rows(j).getElementsByTagName("input").item(1).value)
                {
                         return alertMsg("不能有一样的级别。", dgRequestList.rows(j).getElementsByTagName("input").item(1));
                        return false;
                } 
                 if(dgRequestList.rows(i).getElementsByTagName("input").item(3).value == dgRequestList.rows(j).getElementsByTagName("input").item(3).value)
                {
                         return alertMsg("不能有一样的"+pulldowntext + "。", dgRequestList.rows(j).getElementsByTagName("input").item(3));
                        return false;
                }
           }  
    }
    
    var GBID = "";
    var GID = "";
    var Level = "";
    var LevelName = "";
    var QtyScale = "";
    var sum = 0;
    
    for(i = 1; i < cnt; i++)
    {
       qtyscale = dgRequestList.rows(i).getElementsByTagName("input").item(3).value; 
       sum = sum + parseFloat(qtyscale); 
    } 
    
    if(isNaN(sum))
    {
        alert("分数或百分数和不是数字。");
       return false; 
    } 
    
//    if(pulldowncurrentvalue == 1)
//    {
//        if(sum < 0 ||  sum >100)
//       {
//        alert("分数之和只能在0和100之间。");
//        return false;
//        } 
//    }
    
     if(pulldowncurrentvalue == 2)
    {
        if(sum < 0 ||  sum >100)
       {
        alert("百分数之和只能在0和100之间。");
        return false;
        } 
    }
    
    var requestListObj={"GradeStandardList":[]}; // 序列化
    for(i = 1; i < cnt; i++)
    {
        GBID = dgRequestList.rows(i).getElementsByTagName("input").item(0).value;
        Level = dgRequestList.rows(i).getElementsByTagName("input").item(1).value;
       LevelName = dgRequestList.rows(i).getElementsByTagName("input").item(2).value;
       QtyScale = dgRequestList.rows(i).getElementsByTagName("input").item(3).value; 
       requestListObj.GradeStandardList.push({"GBID":GBID,"Level":Level,"LevelName":LevelName,"QtyScale":QtyScale});
    }        
    getObj("hidRequestList").value=$.jsonToString(requestListObj); 
    return true;
}

function ChangeTableTitle(obj)
{ 
var cnt = dgRequestList.rows.length;
var pulldowncurrentvalue = getObj("ddlRankingType").options[getObj("ddlRankingType").selectedIndex].value;
if(cnt != null && cnt>=1)
{ 
if( pulldowncurrentvalue == 1)
    dgRequestList.rows(0).getElementsByTagName("td").item(3).innerHTML="分数";
if( pulldowncurrentvalue == 2)
    dgRequestList.rows(0).getElementsByTagName("td").item(3).innerHTML="百分数";
 }
}