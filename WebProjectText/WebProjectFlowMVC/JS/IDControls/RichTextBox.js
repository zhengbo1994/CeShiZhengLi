/**
 * 加载富文本框
 * 翁化青 2014-10-14
 * @param id        {string}    富文本框控件ID
 */
function loadRichTextBox(id, options)
{
    var rtbObj = $('#' + id);
    if (rtbObj.length && rtbObj.attr('tagName').toLocaleLowerCase() == 'script')
    {
        rtbObj = UE.getEditor(id, options);
        window["ue_" + id] = rtbObj;

        rtbObj.ready(function ()
        {
            var ueContent = $('#' + id + "_hid_value").val();
            setRichTextBoxContent(id, ueContent);
        });
    }
}

/*
    private function
    过滤字符串中的script标签。
    翁化青 2015-03-07
*/
function stripscript(s)
{
    return s.replace(/<script.*?>.*?<\/script>/ig, '');
}

/**
 * 缓存富文本框的属性， 目前主要用于在回发之前（一般是点击保存按钮后），记录富文本框的value和innerText
 * 翁化青 2014-10-14
 * @param id                    {string}    富文本框控件ID
 * @param valueFieldID          {string}    富文本框value容器
 * @param innerTextFieldID      {string}    富文本框innerText容器
 */
function cacheRichTextBoxAttr(id, valueFieldID, innerTextFieldID)
{
    var valueField = $('#' + valueFieldID),
        innerTextField = $('#' + innerTextFieldID);
    if (valueField.length &&
        innerTextField.length)
    {
        var contentHtml = getRichTextBoxHtml(id);
        //因为EAP扩展改动，会在富文本框的内容中增加script标签，但是script标签不应在getContent时被返回
        contentHtml = stripscript(contentHtml);
        valueField.val(contentHtml);
        innerTextField.val(getRichTextBoxInnerText(id));
    }
}

/**
 * 获取富文本框的内容，包含HTML结构和标签
 * 翁化青 2014-09-12
 * @param id        {string}    富文本框控件ID
 */
function getRichTextBoxHtml(id)
{
    var rtbObj = window["ue_" + id];
    if (typeof rtbObj != "undefined" &&
        typeof rtbObj.getContent == "function")
    {
        return rtbObj.getContent();
    }
    return "";
}

/**
 * 获取富文本框中的纯文本
 * 翁化青 2014-09-12
 * @param id        {string}    富文本框控件ID
 */
function getRichTextBoxInnerText(id)
{
    var rtbObj = window["ue_" + id];
    if (typeof rtbObj != "undefined" &&
        typeof rtbObj.getContentTxt == "function")
    {
        return rtbObj.getContentTxt();
    }
    return "";
}

/**
 * 设置并覆盖富文本框的内容
 * 翁化青 2014-09-12
 * @param id        {string}    富文本框控件ID
 * @param content   {string}    要设置给富文本框的内容
 */
function setRichTextBoxContent(id, content)
{
    var rtbObj = window["ue_" + id];
    if (typeof rtbObj != "undefined" &&
        typeof rtbObj.setContent == "function")
    {
        rtbObj.setContent(content, false);
    }

}

/**
 * 给富文本框添加内容，添加到末尾
 * 翁化青 2014-09-12
 * @param id        {string}    富文本框控件ID
 * @param content   {string}    要添加的内容
 */
function appendRichTextBoxContent(id, content)
{
    var rtbObj = window["ue_" + id];
    if (typeof rtbObj != "undefined" &&
        typeof rtbObj.setContent == "function")
    {
        return rtbObj.setContent(content, true);
    }
}
/**
 * 设置富文本框高度
 * 翁化青 2014-09-12
 * @param id        {string}    富文本框控件ID
 * @param height    {int}       要设置给富文本框的高度
 */
function setRichTextBoxHeight(id, height)
{
    var rtbObj = window["ue_" + id];
    if (typeof rtbObj != "undefined" &&
        typeof rtbObj.setHeight == "function" &&
        !isNaN(height) && parseInt(height) == parseFloat(height))
    {
        return rtbObj.setHeight(height);
    }
}

/**
 * 隐藏富文本框
 * 翁化青 2014-10-14
 * @param id        {string}    富文本框控件ID
 */
function hideRichTextBox(id)
{
    var rtbObj = window["ue_" + id];

    if (typeof rtbObj != "undefined" &&
        typeof rtbObj.setHide == "function")
    {
        rtbObj.ready(function ()
        {
            rtbObj.setHide();
        });
    }
}

/**
 * 显示富文本框
 * 翁化青 2014-10-14
 * @param id        {string}    富文本框控件ID
 */
function showRichTextBox(id)
{
    var rtbObj = window["ue_" + id];
    if (typeof rtbObj != "undefined" &&
        typeof rtbObj.setShow == "function")
    {
        rtbObj.ready(function ()
        {
            rtbObj.setShow();
        });
    }
}