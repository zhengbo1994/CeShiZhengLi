// JScript 文件  



function ddlCorpChange()
{
    $("#jqGrid1").getGridParam("postData").CorpID=$("#ddlCorp").val();
    refreshJQGrid("jqGrid1");    
}


function jcol_projectName(cellvalue,options,rowobject)
{
    var url = "'VProjectBrowse.aspx?ProjectID="+rowobject[0]+"'";
    var html='<a href="javascript:window.openWindow('+url+',1100,850)">'+cellvalue+'</a></div>' ;
    
    return html;

}

function jcol_config(cellvalue,options,rowobject)
{
    return '<div class="nowrap"><a href="#SetProject" onclick="javascript:setProject('+"'" + options.rowId + "')"+'">设置</a>'; 
}

//function jcol_subjectOper(cellvalue,options,rowobject)
//{
//    var subjectOper=rowobject[3];
//    if(subjectOper=='Y')
//    {
//        return '<div class="nowrap"><a href="#SetOper" onclick="setSubjectOper('+"'" + options.rowId + "')"+'">设置</a>';
//    }
//    else
//    {
//        return '<span style="color:#666666">未形成</span>';
//    }
//}

function jcol_zbGroup(cellvalue,options,rowobject)
{
    var browseLink = '<a href="#ShowZBPersons" onclick="showZBPersons('+"'" + options.rowId+ "')"+'">查看</a>';
    var setLink = '<a href="#SetZBPersons" onclick="setZBPersons('+"'" + options.rowId + "')"+'">设置</a>';
    return browseLink+"&nbsp;&nbsp;"+setLink;
}

function showsystemset(projectID)
{
    var url = "VProjectSystemSet.aspx?ProjectID=" + projectID
    window.openWindow(url, 1000, 1500);
}
function showZBiddingPersonsBrowse(projectID)
{
    var url = "VProjectZBiddingPersons.aspx?Aim=Browse&ProjectID=" + projectID;
    window.openWindow(url, 1000, 1500);
}
function showZBiddingPersonsConfig(projectID)
{
    var url = "VProjectZBiddingPersons.aspx?Aim=Config&ProjectID=" + projectID;
    window.openWindow(url, 1000, 1500);
}

function jcol_feature(cellvalue,options,rowobject)
{
    var projectFeature=rowobject[6];  
    if(projectFeature=='Y')
    {
        var lookLink='<a href="#ShowProjectFeatures" onclick="showProjectFeatures('+"'" + options.rowId + "')"+'">查看</a>';
        var setLink='<a href="#SetProjectFeatures" onclick="setProjectFeatures('+"'" + options.rowId + "')"+'">设置</a>';
        return lookLink+"&nbsp;&nbsp;"+setLink;
    }
    return '<span style="color:#666666">未设置特征模板</span>';
}

function showProjectFeatures(projectID)
{
    var url='VProjectFeaturesBrowse.aspx?ProjectID='+projectID;
    window.openWindow(url,800,600);
}

function setProjectFeatures(projectID)
{
    var url='VProjectFeaturesSetting.aspx?ProjectID='+projectID;
    window.openWindow(url,800,600);
}
function setProjectFeaturesBrowse(projectID)
{
    var url = 'VProjectFeaturesBrowse.aspx?ProjectID=' + projectID;
    window.openWindow(url, 800, 600);
}
function setProjectFeaturesConfig(projectID)
{
    var url = 'VProjectFeaturesSetting.aspx?ProjectID=' + projectID;
    window.openWindow(url, 800, 600);
}

function showZBPersons(projectID)
{
    openWindow("VProjectZBiddingPersons.aspx?Aim=Browse&ProjectID=" + projectID, 900, 500);
}

function setZBPersons(projectID)
{
    openWindow("VProjectZBiddingPersons.aspx?Aim=Config&ProjectID=" + projectID, 900, 500);
}
function setProject(projectID)
{
    
   openWindow("VProjectSystemSet.aspx?ProjectID=" + projectID, 900, 600);
}

function setSubjectOper(projectID)
{
  // projectName = encodeURI(projectName);
  // OpenWindow("VProjectBrowseSubject.aspx?ProjectID=" + projectID + "&ProjectName=" + projectName, screen.availWidth, screen.availHeight, 0 ,1 ,1);
}
