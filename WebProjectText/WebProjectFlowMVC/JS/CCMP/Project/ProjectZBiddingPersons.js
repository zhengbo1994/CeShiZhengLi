//*******************************//
//文件名：ProjectZBiddingPersons.js
//描述：招标小组成员设置相关js操作
//作者：王勇//
//时间：2010-9-28 11:53:33
//*******************************//

//新增
function addZBiddingPersons()
{
    var vStationIDs = stripHtml(getJQGridAllRowsData('jqgZBPersion','StationID').join(','));
    openAddWindow("VProjectZBiddingPersonsAdd.aspx?ProjectID="+getObj("hidProjectID").value+"&StationIDs="+vStationIDs, 600, 350, "jqgZBPersion");
}

//修改
function editZBiddingPersons()
{
    var vStationIDs = stripHtml(getJQGridAllRowsData('jqgZBPersion','StationID').join(','));
    openModifyWindow("VProjectZBiddingPersonsEdit.aspx?StationIDs="+vStationIDs, 600, 350, "jqgZBPersion")
}

//删除
function deleteZBiddingPersons()
{
     openDeleteWindow("ZBiddingPersons", 5, "jqgZBPersion");
}

//选择人员
function btnSelectStation_Click()
{
    var vValue = openModalWindow('../../Common/Select/OperAllow/VSelectSingleStation.aspx?CorpID='+getObj("hidCorpID").value+"&From=", 0, 0);
    
    if (vValue != "undefined" && vValue != null)
    {
        var vStations=vValue.split('|');
        if(vStations[0].length>0)
        {
            if(getObj("hidStationIDs").value!=""&&getObj("hidStationID").value!=getObj("hidOriStationID").value&&getObj("hidStationIDs").value.indexOf(vStations[0])!=-1)
            {
                 return alertMsg("该岗位已经添加",getObj("btnSelectStation"));
            }
            //else if(getObj("hidStationID").value!=""&&getObj("hidStationID").value==getObj("hidOriStationID").value) 2013-12-09 yanyl注释
            //{
            //    return;
            //}
            getObj("hidStationID").value=vStations[0];
            getObj("txtStationName").value=vStations[1].substr(0,vStations[1].indexOf("("));
            getObj("txtEmployeeName").value=vStations[4];
            getObj("hidAccountID").value=vStations[5];
            getObj("txtDeptName").value=vStations[3];
            getObj("hidDeptID").value=vStations[6];
            getObj("txtPositionName").value=vStations[2];
        }       
    }
}

//验证
function validate()
{
    if(getObj("hidStationID").value==""||getObj("txtEmployeeName").value=="")
    {
        return alertMsg("招标小组成员必须填写",getObj("btnSelectStation"));
    }
    if(getObj("txtRowNo").value=="")
    {
        return alertMsg("行号必选填写",getObj("txtRowNo"));
    }
    
    return true;
} 
