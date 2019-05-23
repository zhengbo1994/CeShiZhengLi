// JScript 文件

//***************************************************//
//
//文件名:SSOAccountMapping.js
//作者:徐海波
//时间:2012-12-25
//功能描述:
//
//*************************************************//

//新增
var addMapping = function () {
    //openAddWindow("VSSOAccountMappingAdd.aspx", 600, 450, "jqMapping");
    var rValue = openModalWindow('../Common/Select/VSelectAccount.aspx?Aim=SSOAccountMapping', 800, 600);
    if (!rValue) {
        return;
    }
    getObj("hidAccountIDs").value = rValue.IDS;

    if (getObj("hidAccountIDs").value != "") {
        getObj("btnSubmit").click();
    }
}

//删除
var deleteMapping = function () {
    openDeleteWindow("SSOAccountMapping", 0, "jqMapping");
}