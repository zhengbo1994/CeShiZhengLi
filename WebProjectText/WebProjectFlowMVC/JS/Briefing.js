//简报公共文件

//重新绑定公司或项目
//ddlCP 公司或项目下拉列表DOM控件（select类型)
//bcid 简报配置ID
//bResetAllCPIDS 获取完成后，是否重置全部公司项目的ID值到隐藏域
//hidIDS 存放全部有权限的公司或项目的ID（隐藏域)
function resetCP(ddlCP,accountID,bcid,year,month,bAsync,bResetAllCPIDS,hidIDS,projectId)
{
    var allNewIDS=[];
    ddlCP.options.length=0;
//    addOptionAt(ddlCP,'','全部',0);
    var opts=document.createElement("OPTION");
    opts.value="";
    opts.text="全部";
    ajaxRequest('FillData.ashx',{'action':'GetBriefingCorpOrProject','AccountID':accountID,'BCID':bcid,Year:year,Month:month},'json',function(data){
        if(data)
        {
            $.each(data,function(i,cp){                     
                allNewIDS.push(cp.ID);
//                var opt = addOptionAt(ddlCP,cp.ID,cp.Name,ddlCP.options.length);
                var opt = document.createElement("OPTION");
                opt.value = cp.ID;
                opt.text = cp.Name;
                ddlCP.add(opt, ddlCP.length);                           
            });           
        }
    },bAsync);
    
    if(bResetAllCPIDS)
    {
        resetAllCPIDS(ddlCP,hidIDS,allNewIDS);
    }
    
    //如果包括全部，只有两个选择项目的话，默认选中第二项。
    if(ddlCP.options.length==2)
    {
        ddlCP.selectedIndex = 1;
    } 
    if(projectId != null)
    {
        ddlCP.value = projectId;
    }    
}

//重新绑定被授权的项目所属于的公司
function resetCorpOfProjects(ddlCorp,accountID,bcid,year,month,bAsync)
{
    ddlCorp.options.length=0;  
    ajaxRequest('FillData.ashx',{'action':'GetBriefingCorpOfAllowedProject','AccountID':accountID,'BCID':bcid,Year:year,Month:month},'json',function(data){                
        if(data && data.length>0)
        {
            
            $.each(data,function(i,corp){                                     
                addOptionAt(ddlCorp,corp.ID,corp.Name,ddlCorp.options.length);             
            });
        }
        else
        {            
            addOptionAt(ddlCorp,'','没有被授权的公司',ddlCorp.options.length);  
        }
    },bAsync);  
}

//重新设置全部授权的公司或项目的ID（用于AJAX重新获取后）
//allNewIDS 数组，可选参数，如果没有，将循环下拉列表获取
function resetAllCPIDS(ddlCP,hidIDS,allNewIDS)
{
    hidIDS.value = '';
    if(allNewIDS)
    {
        hidIDS.value = allNewIDS;
    }
    else
    {
        var allNewIDS = [];
        $.each($(ddlCP).find('option'),function(i,opt){
            if(opt.value.length>0)
            {
                allNewIDS.push(opt.value);
            }
        });
        hidIDS.value = allNewIDS;
    }
}