// 单云飞 2013-2-25
var clientName;

// 刷新数据
function reloadData()
{
    alert($('#jqData').length);

    //var query = { ProjectGUID: getObj("hdProjectGUID").value, ClientName: clientName };

    //var query = { ProjectGUID: getObj("hdProjectGUID").value, ClientName: "张三" };
    var query = {
        //a: "123"
    };

//    if (loadJQGrid("jqData", query))
//    {
        refreshJQGrid("jqData");
//    }
}


// 第1步数据验证  填写客户姓名 和 电话
function validateSize1()
{
    clientName = getObj("txtClientName").value

    if (clientName == "")
    {
        return alertMsg("请输入客户姓名。", getObj("txtClientName"));
    }

    reloadData();

    return true;
}

// 第2步数据验证 选择客户
function validateSize2()
{
    return true;
}


// 第3步数据验证 确认客户信息

function validateSize3()
{
    return true;
}

