var pageArg = {};
$(function ()
{
    var treeTable = new TreeTable();
    var option = {
        "treeTableID": "tree-table",
        "itemFocusFun": function (item)
        {
            $("#ddlRange option", window.parent.document).each(function ()
            {
                if (item.type == "C")
                {
                    var patter = new RegExp("部门", "g");
                    this.text = this.text.replace(patter, "公司");
                }
                else if (item.type == "D")
                {
                    var patter = new RegExp("公司", "g");
                    this.text = this.text.replace(patter, "部门");
                }
            });

            var mainFrame = $("iframe[name='Main']", window.parent.document)[0];
            if (!mainFrame.src)
            {
                mainFrame.src = "VSwitchStationOperData.aspx";
            }
            else
            {
                window.parent.frames("Main").pageArg.reloadData();
            }
        },
        "itemClickValidate": function (item)
        {
            return confirmIsClick(item);
        }
    }
    treeTable.treeTable(option)

    pageArg.treeTable = treeTable;

    function confirmIsClick(item)
    {
        if (window.parent.frames("Main").pageArg)
        {
            var $tr = window.parent.frames("Main").pageArg.$jq.find("tr[isChange='Y']");

            if ($tr.length > 0)
            {
                if (!confirm("存在尚未保存的数据，是否继续？"))
                {
                    return false;
                }
            }
        }
        return true;
    }

    pageArg.confirmIsClick = confirmIsClick;
});