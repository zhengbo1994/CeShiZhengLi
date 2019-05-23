
//设置审批要点的位置为右侧中部
function setCheckPointPosition()
{
    var divCheckPoint = document.getElementById("divCheckPoint");
    var divCheckPointInfoContainer = document.getElementById("divCheckPointInfoContainer");
    var divCheckPointInfo = document.getElementById("divCheckPointInfo");
    var tbCheckPoint = document.getElementById("tbCheckPoint");

    var heightBody = document.body.clientHeight;
    var heightCheckPoint = tbCheckPoint.offsetHeight + 2;
    if ((heightBody - 180) < heightCheckPoint)
    {
        heightCheckPoint = heightBody - 180;
        divCheckPointInfo.style.overflow = "auto";
    }
    divCheckPointInfo.style.height = heightCheckPoint + 'px';
    divCheckPoint.style.height = divCheckPointInfoContainer.offsetHeight + 'px';
    divCheckPoint.style.width = divCheckPointInfoContainer.offsetWidth + 'px';
    divCheckPoint.style.top = parseInt((heightBody - heightCheckPoint) / 2) + 'px'; //parseInt取整
}

//审批要点的显示和隐藏
function showCheckPoint(div, opt)
{
    var right = parseInt(document.getElementById("divCheckPoint").style.right);
    if (opt == 0)
    {
        document.getElementById("divCheckPoint").style.right = (right != 0 ? "0px" : "-407px");
        div.className = (right != 0 ? "index_col" : "index_exp");
    }
    else if (opt == 1)
    {
        div.className = (right != 0 ? "index_exp_on" : "index_col_on");
    }
    else if (opt == 2)
    {
        div.className = (right != 0 ? "index_exp" : "index_col");
    }
}

//检查强管控的审批要点是否被确认，并把审批要点保存
function CheckPoint()
{
    var tbCP = $("#tbCheckPoint");
    if (tbCP.length == 1)
    {
        // 批复结果为：不同意、打回调整、重新起草、打回重审、打回拆分时不需验证审核要点
        var $rblCheckState = $("#rblCheckState");
        if ($rblCheckState.length == 1)
        {
            var txtReplyResult = $rblCheckState.find(":checked").parent().text()
            if (txtReplyResult === "不同意" || txtReplyResult === "打回调整" || txtReplyResult === "打回重审" ||
                    txtReplyResult === "打回拆分" || txtReplyResult === "重新起草")
            {
                return true;
            }
        }

        //检查强管控的审批要点是否被确认
        if (tbCP.find("#trMustCheck").find(":checkbox").length != tbCP.find("#trMustCheck").find(":checkbox:checked").length)
        {
            alert("请确认审批要点。");
            //审批要点如果隐藏，则显示出来
            var right = parseInt(document.getElementById("divCheckPoint").style.right);
            if (right != 0)
            {
                showCheckPoint(document.getElementById("divec"), 0);
            }
            //解除按钮禁用
            event.srcElement.disabled = false;
            return false;
        }
        //保存审批要点
        var MyCheckPoint = {};
        MyCheckPoint.CPTID = $("#hidCPTID").val();
        MyCheckPoint.CheckPoints = [];
        var num = tbCP.find("tr").length - 1;
        for (var i = 0; i < num; i++)
        {
            MyCheckPoint.CheckPoints[i] = {};
            //直接新增的审批要点 CPID为空
            MyCheckPoint.CheckPoints[i].CPID = tbCP.find("tr:gt(0):eq(" + i + ")").find(":checkbox").attr("id");
            //直接新增的 或 由要点库选择新增的 没有RowNo
            if (tbCP.find("tr:gt(0):eq(" + i + ")").find("#hidRowNo").length > 0)
            {
                MyCheckPoint.CheckPoints[i].RowNo = tbCP.find("tr:gt(0):eq(" + i + ")").find("#hidRowNo").val();
            }
            else
            {
                MyCheckPoint.CheckPoints[i].RowNo = "";
            }
            //是否被选中
            if (tbCP.find("tr:gt(0):eq(" + i + ")").find(":checkbox")[0].checked)
            {
                MyCheckPoint.CheckPoints[i].isCheck = "Y";
            }
            else
            {
                MyCheckPoint.CheckPoints[i].isCheck = "N";
            }

            //直接新增的审批要点 CPID为空                
            if (MyCheckPoint.CheckPoints[i].CPID != "")
            {
                MyCheckPoint.CheckPoints[i].IsMustCheck = tbCP.find("tr:gt(0):eq(" + i + ")").attr("id") == "trMustCheck" ? "Y" : "N";
                MyCheckPoint.CheckPoints[i].CheckPointDesc = tbCP.find("tr:gt(0):eq(" + i + ")").find("#CheckPointDesc").attr("title");
            }
            else
            {
                var textareaDesc = tbCP.find("tr:gt(0):eq(" + i + ")").find("textarea#CheckPointDesc");
                textareaDesc.html(textareaDesc.html().replace(/[']/g, '’').replace(/["]/g, '”'));
                if (textareaDesc.html() == "要点描述" || textareaDesc.html() == "")
                {
                    textareaDesc.html("");
                    return alertMsg("请填写要点描述。", textareaDesc);
                }
                MyCheckPoint.CheckPoints[i].IsMustCheck = "N";
                MyCheckPoint.CheckPoints[i].CheckPointDesc = htmlDecode(textareaDesc.html());
                if (MyCheckPoint.CheckPoints[i].CheckPointDesc.replace(/[^\x00-\xff]/g, '**').length > 1000)
                {
                    return alertMsg("要点描述不能超过一千个字符。", textareaDesc);
                }
                if (!/^[^\|&<>]*$/.test(MyCheckPoint.CheckPoints[i].CheckPointDesc))
                {
                    return alertMsg("要点描述存在特殊字符。", textareaDesc);
                }
            }

        }
        var json = IDJsonParser.stringify(MyCheckPoint);
        $("#hidCheckPointJSON").val(json);
        $("#hidCheckPointHTML").val($("#divCheckPoint")[0].outerHTML);
    }
    return true;
}

//增加审批要点
function addCheckPoint()
{
    var table = $("#tbCheckPoint")[0];
    var row = table.insertRow();
    row.id = "trAddNew";
    var cell = row.insertCell(0);
    cell.style.verticalAlign = "middle";
    cell.innerHTML = "<input id='' type='checkbox' class='cbox'/>";
    cell = row.insertCell(1);
    cell.innerHTML = "";
    cell = row.insertCell(2);
    cell.innerHTML = "<textarea id='CheckPointDesc' class='fm_textarea2 font' onfocus='inputClear(this)' onmouseover='txtCP_over(this)' onmouseout='txtCP_out(this)' onkeyup='checkLen(1000)' style='color:#888888;line-height:15px'>要点描述</textarea>";
    cell = row.insertCell(3);
    cell.style.verticalAlign = "middle";
    cell.innerHTML = "<span id='spanDeleteCheckPoint' onclick='deleteCheckPoint(this)' class='font' style='color:red;'>×</span>";
}

// 表单，鼠标悬停（边框变色）
function txtCP_over(obj)
{
    if (obj)
    {
        obj.style.borderColor = "orange";
    }
}

// 表单，鼠标离开（边框颜色恢复）
function txtCP_out(obj)
{
    if (obj)
    {
        obj.style.borderColor = "white";
    }
}

//选择已有的审批要点
function selectCheckPoint()
{
    var url = "/" + rootUrl + "/Common/Select/CheckFlow/VSelectCheckPoint.aspx?CLSID=" + $("#hidCLSID").val();
    openModalWindow(url, "600px", "500px");
}

//删除审批要点
function deleteCheckPoint(obj)
{
    $(obj).parent("td").parent("tr").remove();
}

//清空初始提醒
function inputClear(obj)
{
    if (obj.value)
    {
        obj.value = "";
    }
    if (obj.innerHTML)
    {
        obj.innerHTML = "";
    }
    obj.style.color = "#000000";
    obj.onfocus = null;
}