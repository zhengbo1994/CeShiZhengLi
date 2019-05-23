// 当前选中模块，Main框架页调用它
var currentNode = null;
$(function () {
    var $body = $("body"),
        openWindow = window.openWindow,
        openDeleteWindow = window.openDeleteWindow;

    if (getParamValue("ModuleID") && $("#" + getParamValue("ModuleID")).length === 1) {
        currentNode = $("#" + getParamValue("ModuleID"))[0];
    }
    // 监听节点点击事件
    $body.on("click", ".span-node", function () {
        if (currentNode) {
            $(currentNode).removeClass("selNode").addClass("normalNode");
        }
        currentNode = this;
        $(currentNode).removeClass("normalNode").addClass("selNode");

        execFrameFuns("Main", function () {
            window.frames("Main").reloadData();
        });
    });

    // 加载触发一个节点
    if (!currentNode) {
        $("span.node-first").trigger("click");
    }
    else {
        $(currentNode).trigger("click");
    }

    // 监听新增同级
    $body.on("click", "#btnSibling", function () {
        if (currentNode) {
            if (currentNode.parentid) {
                openAddModuleWindow("Sibling", currentNode.parentid);
            }
            else {
                openAddModuleWindow("Sibling", "00000");
            }
        }
        else
        {
            openAddModuleWindow("Sibling", "00000");
        }
    });

    // 监听新增
    $body.on("click", "#btnSon", function () {
        if (currentNode) {
            if (currentNode.id) {
                openAddModuleWindow("Son", currentNode.id);
            }
            else {
                alert("请选择一个父节点。");
            }
        }
        else {
            alert("请添加一个父节点。");
        }
    });

    // 监听修改
    $body.on("click", "#btnEdit", function () {
        if (currentNode) {
            if (currentNode.id) {
                openEditModuleWindow(currentNode.id);
            }
            else {
                alert("请选择一个节点。");
            }
        }
        else {
            alert("请选择一个节点。");
        }
        });

        // 监听删除
        $body.on("click", "#btnDelete", function () {
            if (currentNode) {
                if (currentNode.id) {
                    openDeleteModuleWindow(currentNode.id);
                }
                else {
                    alert("请选择一个节点。");
                }
            }
            else {
                alert("请选择一个节点。");
            }
        });

        // 打开新增窗口
        function openAddModuleWindow(action, moduleID) {
            openWindow("VMsgModuleAdd.aspx?action=" + action + "&ModuleID=" + moduleID, 800, 600);
        }

        // 打开修改
        function openEditModuleWindow(moduleID) {
            openWindow("VMsgModuleEdit.aspx?ModuleID=" + moduleID, 800, 600);
        }

        // 打开删除
        function openDeleteModuleWindow(moduleID) {
            openDeleteWindow("MsgModule", 0, moduleID);
        }
    })

    function refreshPage() {
        document.URL = "<%=Request.ApplicationPath%>/Common/MsgCenter/Configuration/VMsgModule.aspx?ModuleID=" + currentNode.id;
    }