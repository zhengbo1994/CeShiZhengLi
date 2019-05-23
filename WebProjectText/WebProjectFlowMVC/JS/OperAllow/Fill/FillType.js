/* -----  FillType.aspx -------- */
function addFillModuleType(aim)
{
    var typeid = $("#hidSelectID").val();
    var parentid = $("#hidParentID").val();
    parentid = parentid == "" ? "00000" : parentid;
    typeid = typeid == "" ? "00000" : typeid;
    url = addUrlParam("VFillTypeAdd.aspx", "ParentTypeID", aim == 0 ? parentid : typeid);
    url = addUrlParam(url, "ModuleID", getParamValue("ModuleID"));
    openWindow(url, 400, 400);
}
    
function editFillModuleType()
{
    var typeid = $("#hidSelectID").val();
    if (typeid == "")
    {
        return alertMsg("没有选中的记录。");
    }
    url = addUrlParam("VFillTypeEdit.aspx", "TypeID", typeid);
    url = addUrlParam(url, "ModuleID", getParamValue("ModuleID"));
    openWindow(url, 400, 400);
}

function deleteFillModuleType()
{
    var typeid = $("#hidSelectID").val();
    if (typeid == "")
    {
        return alertMsg("没有选中记录。");
    }
    openDeleteWindow("FillType", 0, typeid);
}

function reloadData(id)
{
    window.frames("Left").location = "/" + rootUrl + "/OperAllow/Fill/VFillTypeLeft.aspx?ModuleID=" + getParamValue("ModuleID");
    execFrameFuns("Left", function () { window.frames("Left").refreshTree(id); }, window);
}

/* ----- FillTypeLeft.aspx ----- */
function showFillType(span, id, parentid)
{
    window.parent.$("#hidSelectID").val(id);
    window.parent.$("#hidParentID").val(parentid);
    changeBackgroundColor(span);

    window.parent.frames("Main").location = "VFillTypeRight.aspx?TypeID=" + id;
}

function changeBackgroundColor(span)
{
    $(".selNode").removeClass("selNode").addClass("normalNode");
    $(span).removeClass("normalNode").addClass("selNode");
}

function refreshTree(id)
{
    if (id)
    {
        $("span[id=" + id + "]").click();
    }
    else
    {
        $("span:first").click();
    }
}

/* ----- FillTypeRight.aspx ----- */
function showTypeImg(url, width, height)
{
    url = "/" + rootUrl + url;
    openWindow(url, width, height);
}

/* ----- FillTypeAdd.aspx ----- */
function validateSize()
{
    if (trim($("#txtTypeName").val()) == "")
    {
        return alertMsg("类别名称不能为空。", $("#txtTypeName"));
    }
    if ($("#chkFillModule").find(":checked").length == 0)
    {
        return alertMsg("至少选择一项文档类型。");
    }
    //if ($("#uploadImg").get(0).rows.length == 0)
    //{
    //    return alertMsg("必须上传一张类别图片。");
    //}
    return true;
}


