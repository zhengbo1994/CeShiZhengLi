// JScript 文件

//计算字符，一个中文算两个英文字符
function getLength(str) {
    var totallength = 0;
    for (var i = 0; i < str.length; i++) {
        var intCode = str.charCodeAt(i);
        if (intCode >= 0 && intCode <= 128) {
            totallength = totallength + 1; //非中文单个字符长度加 1
        }
        else {
            totallength = totallength + 2; //中文字符长度则加 2
        }
    }
    return totallength;
}
//检测字符
function checkLength(obj, maxLen) {
    if (getLength(obj.value) > maxLen) {
        alert("最大字符" + maxLen);
        obj.focus();
    }
}
function setMoneyFormat(length)
{
    var txt = getEventObj();
    setRound(length);
    txt.value = getMoneyValue(txt.value);
}
//重写IdeaSoft中"千分位符"方法. 因 value=0时，返回 '',则整个span 会没有样式
function getMoneyValue(value)
{
    if (value != '' && value != null)
    {
        if (value.toString().indexOf('.') == -1)
        {
            return getAccountingNum(value, 2) + ".00";
        }
        else
        {
            return getAccountingNum(value, 2);
        }
    }
    else
    {
        return '0.00';        //IdeaSoft中为  return ''
    }
}

function showTab(index) {
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");

    for (var i = 0; i < 6; i++) {
        getObj("div" + i).style.display = "none";
    }

    getObj("div" + index).style.display = "block";
}


function addProject()
{
    var ddlCorp=getObj("ddlCorp");
    var selectValue=ddlCorp.options[ddlCorp.selectedIndex].value;
    if(selectValue.length==0 || selectValue.split('_').length>1)
        return alertMsg("未选择项目", ddlCorp); 
    else
        openAddWindow("VProjectAdd.aspx?CorpID="+selectValue, 1000, 750, "jqGrid1");
}

function editProject()
{
    openModifyWindow("VProjectEdit.aspx", 1000, 750, "jqGrid1")
}

function delProject()
{
    openDeleteWindow("Project", 4, "jqGrid1");
}

function validateSize()
{  
   
    handleBtn(false);
    if(getObj("txtProjectName").value == "")
    {
        handleBtn(true);
        return alertMsg("项目名称不能为空。", getObj("txtProjectName"));
    } 
   
    if(getObj("ddlProductType").value == "")
    {
        handleBtn(true);
        return alertMsg("产品类型不能为空。", getObj("ddlProductType"));
    }  
    
    if(getObj("txtProjectNo").value=="")
    {
        handleBtn(true);
        return alertMsg("项目编号不能为空。",getObj("txtProjectNo"));
    }

    if(getObj("txtRowNo").value == "")
    {
        handleBtn(true);
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }    
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    //自定义字段可否输入
    if (!validateAuto())
    {
        return false;
    }
                           
    return true;
}

//可建占地面积=宗地面积-公共配套占用面积 
function calculatorAllowCoccupyArea()
{

   var landArea = getRound(getObj("txtLandArea").value == ""?"0":getObj("txtLandArea").value,2);
   var publiCoccupyArea = getRound(getObj("txtPubliCoccupyArea").value == ""?"0":getObj("txtPubliCoccupyArea").value,2);
   var allowCoccupyArea =  landArea - publiCoccupyArea;
   getObj("txtAllowCoccupyArea").value = getMoneyValue(allowCoccupyArea);
   calculatorAllowBuildArea();

}  
//可建筑面积=可建占地面积*容积率
function calculatorAllowBuildArea() 
{
    var bulkPercent = parseFloat(getObj("txtBulkPercent").value==""?"0":getObj("txtBulkPercent").value);
    var allowCoccupyArea = getRound(getObj("txtAllowCoccupyArea").value == ""?"0":getObj("txtAllowCoccupyArea").value,2);
    getObj("txtAllowBuildArea").value = getMoneyValue(getRound(allowCoccupyArea * bulkPercent,2));
}

//建筑面积=地上建筑面积+地下建筑面积
function calculatorBuildArea()
{
   var groundBuildArea =getRound(getObj("txtGroundBuildArea").value == ""?"0":getObj("txtGroundBuildArea").value,2);
   var underGroundBuildArea =getRound(getObj("txtUnderGroundBuildArea").value == ""?"0":getObj("txtUnderGroundBuildArea").value,2);
   getObj("txtBuildArea").value=getMoneyValue(groundBuildArea+underGroundBuildArea,2);
}
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

//function ValidateUpLoad()
//{
//    if(fileUploadSingPic.value =='')
//    {
//        return alertFocus('请选择要上传的图片', fileUploadSingPic);
//    }
//    else
//    {
//        var fileext = fileUploadSingPic.value.substring(fileUploadSingPic.value.lastIndexOf("."),fileUploadSingPic.value.length) 
//                fileext = fileext.toLowerCase() 
//        if ((fileext!='.jpg')&&(fileext!='.gif')&&(fileext!='.jpeg')&&(fileext!='.png')&&(fileext!='.bmp')) 
//        { 
//             return alertMsg('对不起，系统仅支持标准格式的照片，请您调整格式后重新上传，谢谢 !', fileUploadSingPic);
//        } 
//    }
//    return true;
//}
//          
//function DelPic()
//{
//    if(hidUpLoadPicPath.value != "")
//    {
//       imgSinPic.style.display = "none";
//       hidUpLoadPicPath.value = "";
//       alert("删除成功");
//   }
//   else
//   {
//         return alertMsg('没有上传签名图片', btnUpload);
//   }
//   return false;
//}

function ddlCorpChange()
{
   reloadData();
}


function jcol_projectName(cellvalue,options,rowobject)
{
    var url = "'VCorpProjectBrowse.aspx?ProjectID="+rowobject[0]+"'";
    return '<div class="nowrap"><a href="javascript:window.openWindow('+url+',1100,850)">'+cellvalue+'</a></div>' ;
}

function jcol_costObject(cellvalue,options,rowobject)
{
    var projectID=options.rowId;
    var projectName=rowobject[1];
    if(rowobject[7]=='Y')
        return '<div class="nowrap"><a href="#ShowObject" onclick="showObject('+"'"+projectID+"','"+projectName+"')"+'">查看</a>';
       
    return "&nbsp";
}

function jcol_costSubject(cellvalue,options,rowobject)
{
    var projectID=options.rowId;
    var projectName=rowobject[1];
    
    if(rowobject[8]=='Y')
        return '<div class="nowrap"><a href="#ShowSubject" onclick="showSubject('+"'"+projectID+"','"+projectName+"')"+'">查看</a>';
    return "&nbsp";
}

function showObject(projectID)
{
    //var url='VProjectCauseObject.aspx?ProjectID='+projectID;
    var url="../Allot/ObjectSubject/VCauseObjectBrowse.aspx?ProjectID="+projectID;
    window.openWindow(url,1000,800);
}

function showSubject(projectID, projectName)
{
     //var url='VProjectCauseSubject.aspx?ProjectID='+projectID;
    var url="../Allot/Subject/VCauseSubjectBrowse.aspx?ProjectID="+projectID;
     window.openWindow(url,1000,800);
}

function setObjectSubject(objectID)
{
   openWindow("VProjectCauseObjectSubject.aspx?ObjectID="+objectID,900,700);
}

// 上传(队列中单个文件)完成事件
// fileRow为放置文件所在的表格行，其有rowIndex、filetitle、filename、filesize、thumbnailname等属性
// uploadID为控件的id，也即放置文件所在表格的id
function fileUploaded(fileRow, uploadID)
{
    trSinPic.style.display = "";
    getObj("imgSinPic").src="../.."+fileRow.thumbnailname;
}
function fileDeleted(fileRow, uploadID)
{
    trSinPic.style.display = "none";
}
function setFilter()
{
    var fID = hidFilterID.value;
    openModalWindow("../../Knowledge/Library/LibraryTemplate/VSearchByPFCT.aspx", 1000, 800);
    if(fID != hidFilterID.value)
    {
        reloadData();
    }
}

function reloadData() {    
    $("#jqGrid1").getGridParam("postData").CorpID=$("#ddlCorp").val();
    $("#jqGrid1").getGridParam("postData").FilterID = hidFilterID.value;
    $("#jqGrid1").getGridParam("postData").KeyValue = $("#txtKeyValue").val();
    refreshJQGrid("jqGrid1");
}

//验证自定义字段是否可输入
function validateAuto()
{
    var fieldNameValue = $('#hidFieldName').val();
    var fieldTitleValue = $('#hidFieldTitle').val();
    if (fieldNameValue != "" && fieldTitleValue != "")
    {
        var nameList = fieldNameValue.split(",");
        var titleList = fieldTitleValue.split(",");
        for (var i = 0; i < nameList.length; i++)
        {
            if ($('#' + nameList[i]).val() == "")
            {
                handleBtn(true);
                return alertMsg(titleList[i] + "不能为空", $('#' + nameList[i]));
            }
        }
    }
    return true;
}
//目标值与输入值不一样，颜色区分
function setObjectiveValue()
{
    var objectiveValue = $('#hidObjective').val();
    if (objectiveValue != "")
    {
        var objectiveList = objectiveValue.split(",");
        for (var i = 0; i < objectiveList.length; i++)
        {
            if ($('#' + objectiveList[i]).val() != "" && $('#' + objectiveList[i]).val() != $('#CP' + objectiveList[i]).val())
            {
                $('#' + objectiveList[i]).css("backgroundColor", "#FFDDDD");
            }
            if ($('#' + objectiveList[i]).val() != "" && $('#' + objectiveList[i]).val() == $('#CP' + objectiveList[i]).val())
            {
                $('#' + objectiveList[i]).css("backgroundColor", "#FFFFFF");
            }
        }
    }
}