// 用于申请调整、审核、查看页，操纵流程的正文模板文档

var doc_timer = null;
function setDisplayDocModel()
{
    if (getObj(getObj("hidtbDocModelID").value) == null)
    {
        return false;
    }

    getObj("btnShowDocModel").value = getObj("hidDocModelDisplay").value == "none" ? "显示正文" : "隐藏正文";
    getObj("ifrDocModel").style.display = getObj("hidDocModelDisplay").value;

    if (getObj("btnSaveKnowledge_tb"))
    {
        getObj("btnSaveKnowledge_tb").style.display = "none";
    }
    if (getObj("hidDocModelDisplay").value == "block" && getObj("ifrDocModel").src == "" && getObj("hidDocModelUrl").value != "")
    {
        /* 当正文所在iframe隐藏时，无法正确加载正文内容，
         * 所以这里先找出正文所在选项卡，并让其显示，但将高度设置为1px，
         * 避免影响用户看到的界面，并设置100毫秒的间隔判断正文是否加载完毕， 
         * 在正文加载完成后，将隐藏的正文iframe状态还原。
         * wenghq 20140903
         * */
        var ifrDocModel = $('#ifrDocModel'),
            closestDivContainer = ifrDocModel.closest('div'),
            isFrameTabHide = closestDivContainer.css('display') === "none",
            originHeight = closestDivContainer.css('height'),
            originOverFlow = closestDivContainer.css('overflow');

        if (isFrameTabHide)
        {
            closestDivContainer.css('height', '1px');
            closestDivContainer.css('overflow', 'hidden');
            closestDivContainer.show();
        }

        getObj("ifrDocModel").src = getObj("hidDocModelUrl").value;

        if (isFrameTabHide)
        {
            doc_timer = setInterval(function ()
            {
                var pocDoc = window.frames["ifrDocModel"].document.getElementById("pocDoc");

                if (pocDoc != null && pocDoc.DocumentFileName)
                {
                    closestDivContainer.hide();
                    closestDivContainer.css('height', originHeight);
                    closestDivContainer.css('overflow', originOverFlow);
                    clearInterval(doc_timer);
                }
            }, 100);
        }

        if (getObj("btnSaveKnowledge_tb"))
        {
            getObj("btnSaveKnowledge_tb").style.display = "";
        }
    }
}

function showDocModel(btn)
{
    getObj("hidDocModelDisplay").value = getObj("hidDocModelDisplay").value == "none" ? "block" : "none";
    btn.value = getObj("hidDocModelDisplay").value == "none" ? "显示正文" : "隐藏正文";
  
    getObj("btnSaveKnowledge").disabled = getObj("hidDocModelDisplay").value == "none" ? true : false;
  
    getObj("btnAddIframeHeight").disabled = getObj("hidDocModelDisplay").value == "none" ? true : false;
    getObj("btnMinusIframeHeight").disabled = getObj("hidDocModelDisplay").value == "none" ? true : false;
    getObj("ifrDocModel").style.display = getObj("hidDocModelDisplay").value;
    if (getObj("hidDocModelDisplay").value == "block" && getObj("ifrDocModel").src == "" && getObj("hidDocModelUrl").value != "")
    {
        getObj("ifrDocModel").src = getObj("hidDocModelUrl").value;
    }
}

function changeIframeHeight(size)
{
    var iframeWin = window.frames("DocModel");
    var height = parseInt(getObj("ifrDocModel").offsetHeight);
    if (height + size >= 300)
    {
        getObj("ifrDocModel").style.height = height + size;
        if (typeof iframeWin.changeDocContainerHeight == 'function')
        {
            iframeWin.changeDocContainerHeight(size);
        }
    }
}
    
function saveDocModel()
{
    if(getObj(getObj("hidtbDocModelID").value) == null || getObj("ifrDocModel").src == "")
    {
        return true;
    }
    if (getObj("hidIsBunchOrParataxis") != null && getObj("hidIsBunchOrParataxis").value == "Parataxis")
    {
        return window.frames("DocModel").saveDocWhenParataxis();
    }
    else
    {
        return window.frames("DocModel").saveDoc();
    }
//    if (getObj("rdoExtendID") != null)
//    {
//        return window.frames("DocModel").saveDoc();
//    }
//    else
//    {
//        return window.frames("DocModel").saveDocWhenParataxis();
//    }
}