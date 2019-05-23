// JScript 文件

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

function showTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");
                
    for (var i = 0; i < 2; i++)
    {                
        getObj("div" + i).style.display = "none";
    }
    
    getObj("div" + index).style.display = "block";
}
function windowLoad()
{
    // 第一次进入页面，一般默认选中第一项
    var oIAType = $("#hidIAType").val();    
    if (oIAType == "LandRegister") {
        showTab(4);
    } else {
        showTab(0);
    }
}
function showObject()
{
    var url='VProjectCauseObject.aspx?ProjectID='+getObj("hidProjectID").value;
    window.openWindow(url,1000,800);
}

function showSubject()
{
     var url='VProjectCauseSubject.aspx?ProjectID='+getObj("hidProjectID").value;
     window.openWindow(url,1000,800);
}

function showSubjectContract(pccscid)
{
    var realID=getObj("hidPCCSCID").value;

    var realOption="ProjectCauseChange";
    var url='../CauseCost/CauseCostShape/VSubjectContractLibraryBrowse.aspx?ProjectID='+getObj('hidProjectID').value
                    +'&PCCSCID='+realID
                    +'&RealID='+realID+"&RealOption="+realOption;
    window.openModalWindow(url,900,700);
}

function showPFCT(pfctID)
{
    openAddWindow("../../Knowledge/Library/LibraryTemplate/VProjectFeaturesConfigTemplateBrowse.aspx?PFCTID=" + pfctID, 800, 600,"");
}

function showTCT(tctID)
{
    openAddWindow("../../Knowledge/Library/LibraryTemplate/VTaskConfigTemplateBrowse.aspx?TCTID=" + tctID, 800, 600,"");
}

function showCFCT(cfctID)
{
    openAddWindow("../../Knowledge/Library/LibraryTemplate/VCostFactorConfigTemplateBrowse.aspx?CFCTID=" + cfctID, 800, 600,"");
}

function showProjectInfo(index)
{
    selectItem(index);

    for (var i = 0; i < 2; i++)
    {
        getObj("tbPInfo" + i).style.display = (i == index ? "block" : "none");
    }
}

function selectItem(index)
{
    var obj = document.getElementsByName("PInfo");
    for(i = 0; i < obj.length; i++)
    {
        obj(i).removeAttribute("style");
        obj(i).getElementsByTagName("span").item(0).removeAttribute("style");
    }
    obj(index).style.backgroundPosition = "0% -42px";
    obj(index).getElementsByTagName("span").item(0).style.fontWeight = "bold";
    obj(index).getElementsByTagName("span").item(0).style.color = "white";
    obj(index).getElementsByTagName("span").item(0).style.backgroundPosition = "100% -42px";
}