// JScript 文件


//搜索
function btnSearch_Click()
{
    if ($("#ddlProjectName").val() != "C")
    {
        reloadData();
    } else
    {
        alert('请选择项目！');
    }
}


function selectchange()
{
    var projectID = $("#ddlProjectName").val();
    if (projectID == "C" || projectID == null)
    {
        alert('请选择公司下的项目！');
        return;
    }
    else
    {
        reloadData()
    }
}

function reloadData()
{
    var jqObj = $('#jqRoomStructure', document);

    var projectID = $("#ddlProjectName").val();
    var SearchKey = $("#txtKey").val();
    jqObj.getGridParam('postData').projectID = projectID;
    jqObj.getGridParam('postData').SearchKey = SearchKey;

    if (projectID != "C" && projectID != null)
    {
        refreshJQGrid("jqRoomStructure");
    }

//    // tr的双击事件
//    $("tr").live("dblclick", function ()
//    {
//        var ID = $(this).attr("id");
//        var projectID = $("#ddlProjectName").val();
//        openAddWindow("VRoomStructureAdd.aspx?projectID=" + projectID + "&ID=" + ID, 800, 600);
//    });
}

//新建
function btnAdd_Click()
{
    //    var projectName = trim($("#ddlProjectName").find("option:selected").text());
    //    var companyName = trim($("#ddlCompanyName").find("option:selected").text());
    // encodeURIComponent(projectName) + "&companyName=" + encodeURIComponent(companyName) + "&projectID=" + projectID
    var projectID = $("#ddlProjectName").val();
    if (projectID != null && projectID.length == 36)
    {
        openAddWindow("VRoomStructureAdd.aspx?projectID=" + projectID, 800, 600);
    } else
    {
        alert('请选择项目！');
    }
}

//修改
function btnEdit_Click()
{
    var projectID = getJQGridSelectedRowsData("jqRoomStructure", false, "ProjectID");
    openModifyWindow("VRoomStructureAdd.aspx?projectID=" + projectID, 800, 600, "jqRoomStructure");
}

//删除
function btnDelete_Click()
{
    openDeleteWindow("RoomStructure", 7, "jqRoomStructure");
}

//查看
function renderLink(cellvalue, options, rowobject)
{
    var url = "'VKPIIndexBrowser.aspx?ID=" + rowobject[0] + "'";
    return '<a  href="#" onclick="javascript:openWindow(' + url + ',400, 450)">' + cellvalue + '</a>';
}
//户型引入
function btnImport_Click() {
    var projID = $("#ddlProjectName").val();
    var rValue = openModalWindow("../../../Common/Select/CRM/VselectRoomStructureInfo.aspx?IsMulti=Y&projID=" + projID, 800, 600);
    if (rValue != null) 
    {
        $.post("FillData.ashx",
        { action: 'CRM_ImportRoomStructure', ProjectID: rValue.ProjectID, RoomIDList: rValue.RoomID, RoomCode: rValue.RoomCode },
        function (data, textstatus) {
            var roomCode = rValue.RoomCode.split(',');
            if (data == 0) {

                alert("户型引入成功！"); reloadData();
            }
            else if (data == 1) {
                if (roomCode.length == 1) {
                    alert("该户型已引入!");
                }
                else {
                    alert("成功引入，已忽略已引入的编码!"); reloadData();
                }
            }
            else if (data > 1) {
                alert("成功引入，已忽略已引入的编码!"); reloadData();
            }
            else {
                alert("户型引入失败，请重新操作！");
            }
        },
        "string");
       
    }
}

function validateSize()
{
    var rowNo = getObj("txtRowNo").value;
    if (getObj("ddlICID").value == "")
    {
        return alertMsg("类别名称不能为空。", getObj("ddlICID"));
    }
    if (getObj("txtIndexNo").value == "")
    {
        return alertMsg("指标编号不能为空。", getObj("txtIndexNo"));
    }
    if (getObj("txtIndexName").value == "")
    {
        return alertMsg("指标名称不能为空。", getObj("txtIndexName"));
    }
    if (getObj("ddlIndexType").value == "")
    {
        return alertMsg("指标类型不能为空。", getObj("ddlIndexType"));
    }
    if (getObj("ddlIndexCycle").value == "")
    {
        return alertMsg("指标周期不能为空。", getObj("ddlIndexCycle"));
    }
    //    if (getObj("ddlBSID").value == "")
    //    {
    //        return alertMsg("基础部门不能为空。", getObj("ddlBSID"));
    //    }

    if (rowNo == "")
    {
        return alertMsg("行号不能为空。", getObj("txtRowNo"));
    }

    if (!isPositiveInt(rowNo))
    {
        return alertMsg("行号必须为正整数。", getObj("txtRowNo"));
    }
    return true;
}

// 验证必填
function RequiredCheck()
{
    var code = $("#txtRoomStructureCode").val();
    alert(code == "");
    return false;
}

function renderLink(cellvalue, options, rowobject)
{
    var projectID = $("#ddlProjectName").val();
    var url = '<a target="_blank" href=VRoomStructureAdd.aspx?ID=' + rowobject[0] + '&projectID=' + projectID + '>' + cellvalue + '</a>';
    return url;
}

// 设置户型点评的最大长度
function SetMaxLength()
{
    $("#txtRemark").attr("onContextMenu", "return false").bind("keydown", function ()
    {
        if (window.event.keyCode == 8)
        {
            return true;
        } else if ($(this).val().length >= 500)
        {
            return false;
        }
    });

    $("#txtRemark").change(function ()
    {
        $(this).val($(this).val().replace(/'/g, ""));
        if ($(this).val().length >= 500)
        {
            $(this).val($(this).val().substr(0, 500));
            alert('字符串已经超过最大设计长度，现已做截取处理！');
        }
    });
}


// 上传(队列中单个文件)完成事件
// fileRow为放置文件所在的表格行，其有rowIndex、filetitle、filename、filesize、thumbnailname等属性
// uploadID为控件的id，也即放置文件所在表格的id
function fileUploaded(fileRow, uploadID)
{
    trSinPic.style.display = "";
    getObj("imgSinPic").src = "../../.." + fileRow.thumbnailname;
}

function fileDeleted(fileRow, uploadID)
{
    trSinPic.style.display = "none";
}
//户型一览
//作者：常春侠
//时间：2013-6-21 9:06:59
function btnView_Click() {
    window.location.href = "RoomStructureView.aspx";
}