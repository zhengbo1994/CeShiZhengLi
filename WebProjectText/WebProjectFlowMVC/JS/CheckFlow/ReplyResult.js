// JScript 文件
/*
 * 版本信息：爱德软件版权所有
 * 模块名称：开发设定-批复结果设置
 * 模块编号：
 * 文件名称：ReplyResult.js
 * 文件说明：批复结果设置需要的JS代码
 * 作    者：王勇
 * 时    间：2010-5-6
  * 修    改：程镇彪
 * 修改时间：2012-06-25
 */
 
 //修改
var editReplyResult=function()
{
    openModifyWindow("VReplyResultEdit.aspx", 500, 250, "jqGrdReplayResult")
}
//新增
var addReplyResult=function()
{
    openAddWindow("VReplyResultAdd.aspx", 500, 250, "jqGrdReplayResult");
}
//删除
var delReplyResult=function()
{
    openDeleteWindow("VReplyResult",0,"jqGrdReplayResult");
}

//验证
function validateSize()
{
    if (getObj("txtReplayDescription").value == "")
    {
        return alertMsg("批复结果名称必须填写。", getObj("txtReplayDescription"));
    }
    if (!isPositiveIntAnd0(getObj("txtReplyType").value))
    {
        return alertMsg("批复结果代码必须为数字并且不能小于零。", getObj("txtReplyType"));
    }   
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        return alertMsg("行号必须为整数。", getObj("txtRowNo"));
    }   
    return true;
}
