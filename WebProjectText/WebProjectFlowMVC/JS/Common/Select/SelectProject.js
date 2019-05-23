/*
 * 页面全局变量容器
 * 翁化青 2014-09-25
 */
var pageMaster = {};

// 页面所有包含项目的表格的选择器
pageMaster.TABLES_SELECTOR = '#tbByCorp,#tbByArea,#tbRecentlyUsed';
// 当前选项卡正文部分显示的表格ID
pageMaster.currentDisplayTableID = "";
// 查询关键字
pageMaster.searchKeyWord = "";
// 根据关键字查找到的对象集合
pageMaster.currentSearchObjSet = null;
// 上一个根据关键字找到的对象
pageMaster.prevSearchedRow = null;
// 查找到的对象集合当前的遍历索引
pageMaster.currentSearchIndex = -1;

/*
 * 页面初始化方法
 * 翁化青 2014-09-25
 */
function initialPage()
{
    var isMulti = getParamValue("IsMulti"),
        allTables = $(pageMaster.TABLES_SELECTOR);
    
    // 根据是否允许多选初始化表格中的复选框列是否显示
    allTables.each(function (i, tb)
    {
        $(this).find("colgroup col:eq(0)").css('display', isMulti == "Y" ? "" : "none");
    });

    // 绑定行点击事件
    allTables.on('mouseover', 'tbody tr:not(:last-child)', function ()
    {
        $(this).addClass('ui-state-hover');
    }).on('mouseout', 'tbody tr:not(:last-child)', function ()
    {
        $(this).removeClass('ui-state-hover');
    }).on('click', 'tbody tr:not(:last-child)', function (ev)
    {
        var me = $(this),
            target = ev.target,
            rowID = me.attr('id'),
            subRows = me.closest('table').find('[id^="' + rowID + '."]'),
            cbk = me.find('input[type=checkbox]'),
            subCbks = subRows.find('input[type=checkbox]');
      
        me.attr('selected', 'selected');
        me.toggleClass("ui-state-active");
        // 当允许多选时， 选择父级对象（公司、区域、跨期项目等）自动绑定自己项目
        if (cbk.length && isMulti == "Y")
        {
            // 当点击事件的目标就是复选框时，不必再修改复选框的checked属性
            target.type != "checkbox" && cbk.prop('checked', !cbk.prop('checked'));

            // 如果存在子级项目， 则选中子级项目所在行
            subCbks.prop('checked', cbk.prop('checked'));
            subRows.toggleClass("ui-state-active", cbk.prop('checked'));
        }
        else
        {
            var otherSelectedRow = $('tr.ui-state-active').not(me);
            otherSelectedRow.removeAttr('selected');
            otherSelectedRow.removeClass('ui-state-active');
        }
    });

    if (isMulti == "N")
    {
        allTables.on('dblclick', 'tbody tr[CouldSelect=True]', function ()
        {
            returnSelectedProjects();
        });
    }

    // 为了修复页面掉落一截导致按钮显示不全的bug的hacking 翁化青 2014-09-25
    $('#btnSave').trigger('mouseover');

    // 加载最近选择过的项目
    loadCachedProjects();

    showBrowseTab(0);
}

/*
 * 加载缓存的最近选择过的项目
 * 翁化青 2014-09-26
 */
function loadCachedProjects()
{
    var tbRecentlyUsed = $('#tbRecentlyUsed'),
        tbRecentlyUsedBody = tbRecentlyUsed.find('tbody'),
        accountID = $('#hidAccountID').val(),
        isGetCorpProject = getParamValue('IsGetCorpProject') || "",
        onlyNormalProject = getParamValue('OnlyNormalProject') || "",

        cachedProjects = $.cookie('selectedProject-' + accountID) || "[]",
        jsonCachedProjects = $.stringToJSON(cachedProjects),
        project = null,
        html = [];

    if (jsonCachedProjects.length > 0)
    {
        for (var i in jsonCachedProjects)
        {
            project = jsonCachedProjects[i];
            projectID = project["ProjectID"];
            projectName = project["ProjectName"];
            isIntertemporal = project["IsIntertemporal"];
            customAttr = project["CustomAttr"];
            
            // 若当前不需要获取公司项目， 则不加载最近选择的公司项目
            if (isGetCorpProject.toLocaleUpperCase() != "Y" && isIntertemporal=="C")
            {
                continue;
            }
            
            // 若当前只允许选择普通项目， 则不加载最近选择的非普通项目
            if (onlyNormalProject.toLocaleUpperCase() == "Y" && isIntertemporal != "N")
            {
                continue;
            }


            if (projectID)
            {
                html.push(
                    "<tr id='", i,
                            "' couldselect='True' itemid='", projectID,
                            "' itemname='", projectName,
                            "' customattr='", encodeURI(customAttr), "'>",
                        "<td><input type='checkbox' /></td>",
                        "<td>" + projectName + "</td>",
                    "</tr>");
            }
        }
    }
    else
    {
        html.push("<tr><td></td><td></td></tr>");
    }
    tbRecentlyUsedBody.html(html.join(""));
}


/*
 * 搜索项目
 * 翁化青 2014-09-25
 */
function searchProject()
{
    var keyword = $('#txtKeyword').val();

    if (!keyword)
    {
        return false;
    }

    if (pageMaster.searchKeyWord != keyword
        || !pageMaster.currentSearchObjSet
        || !pageMaster.currentSearchObjSet.length)
    {
        pageMaster.searchKeyWord = keyword;
        pageMaster.currentSearchObjSet = $('#' + pageMaster.currentDisplayTableID).find('td:Contains("' + pageMaster.searchKeyWord + '")');
        pageMaster.currentSearchIndex = 0;
    }

    if (pageMaster.currentSearchObjSet.length)
    {
        pageMaster.currentSearchIndex = (pageMaster.currentSearchIndex + 1) % pageMaster.currentSearchObjSet.length;

        var searchTarget = pageMaster.currentSearchObjSet[pageMaster.currentSearchIndex],
            targetRow = $(searchTarget).closest('tr'),
            range = document.body.createTextRange();

        // 如果本次查找的文本和上一次查找的处于同一行，则继续向下查找
        while (targetRow[0] === pageMaster.prevSearchedRow)
        {
            pageMaster.currentSearchIndex++;
            searchTarget = pageMaster.currentSearchObjSet[pageMaster.currentSearchIndex];
            targetRow = $(searchTarget).closest('tr');
        }
        pageMaster.prevSearchedRow = targetRow[0];

        /* 如果目标行被收起了，则展开其父级。 */
        if (!targetRow.is(':visible'))
        {
            var tempParent = targetRow.parent();
            var expandImg = tempParent.find('img[imgtype=tree]');
            expColTG(expandImg[0]);

            while (!tempParent.is(':visible'))
            {
                tempParent = tempParent.parent();
                expandImg = tempParent.find('img[imgtype=tree]');
                expColTG(expandImg[0]);
            }
        }
        //expColTG

        /* 突出显示搜索到的文本所在行 */
        $('.ui-state-hover').removeClass('ui-state-hover');
        $(searchTarget).closest('tr').addClass('ui-state-hover');

        // 查找后定位到目标行
        range.moveToElementText(searchTarget);
        range.select();
    }

    /* 在搜索后让焦点回到搜索输入框，方便客户连点回车进行搜索 */
    $('#txtKeyword')[0].focus();
}

/**
 * 清空选择的项目
 * 翁化青 2014-09-25
 */
function clearSelected()
{
    var rows = $(pageMaster.TABLES_SELECTOR).find('tbody tr');
    rows.removeClass('ui-state-active');
    rows.find('input[type=checkbox]').prop('checked', false);
}

/**
 * 返回选中的项目
 * 翁化青 2014-09-25
 */
function returnSelectedProjects()
{
    var selectedProjectRows = $('#' + pageMaster.currentDisplayTableID + ',#tbRecentlyUsed').find("tr[CouldSelect=True][selected]");
    var projects = [],
        selectedProjectID = [];

    if (!selectedProjectRows.length)
    {
        return alertMsg("您还没有选中有效的项目。");
    }

    selectedProjectRows.each(function (i, row)
    {
        var me = $(row),
            projectID = me.attr('ItemID'),
            projectName = me.attr('ItemName'),
            isIntertemporal = me.attr("IsIntertemporal"),
            customAttr = me.attr('CustomAttr');

        if (!arrayContains(selectedProjectID, projectID))
        {
            selectedProjectID.push(projectID);
            project = {
                ProjectID: projectID,
                ProjectName: projectName,
                IsIntertemporal: isIntertemporal,
                CustomAttr: customAttr
            };
            projects.push(project);
        }
    });
    cacheSelectedProjects(projects);

    window.returnValue = projects;
    //alert('close window');
      window.close();
}

/*
 * 缓存选中的项目
 * 翁化青 2014-09-25
 * @projects object-array 选中的项目信息数组
 */
function cacheSelectedProjects(projects)
{
    var accountID = $('#hidAccountID').val();
    var projectNames = [];
    var cachedProjects = $.cookie('selectedProject-' + accountID) || "[]";
    var jsonCachedProjects = $.stringToJSON(cachedProjects);
    for (var i in projects)
    {
        var project = projects[i];
        var projectID = project.ProjectID;

        if (!projectID)
        {
            continue;
        }

        // 如果以缓存当前项目，则将当前项目从缓存出推出，并放到缓存顶部
        if (cachedProjects.indexOf('"ProjectID":"' + projectID + '"') >= 0)
        {
            jsonCachedProjects.splice(i, 1);
        }

        jsonCachedProjects.unshift(project);
    }
    $.cookie('selectedProject-' + accountID, $.jsonToString(jsonCachedProjects));
}

/*
 * 判断数组是否包含某对象
 * 翁化青  2014-09-25
 * @arr array 要查找的数组对象
 * @obj object 要检查是否被数组包含的对象
 */
function arrayContains(arr, obj)
{
    for (var ele in arr)
    {
        if (arr[ele] === obj)
        {
            return true;
        }
    }
    return false;
}

/**
 * 显示选择的选项卡
 * 翁化青 2014-09-25
 * @index int 选项卡索引
 */
function showBrowseTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");
    $('.idtabdiv>div').hide();
    getObj("div" + index).style.display = "block";

    pageMaster.currentDisplayTableID = index == 0 ? "tbByCorp" : "tbByArea";
    pageMaster.currentSearchObjSet = null;
}


/*
 * 覆盖jquery 的：Contains选择器， 让其大小写不敏感
 * 翁化青 2014-09-25
 * 摘取自：http://css-tricks.com/snippets/jquery/make-jquery-contains-case-insensitive/
 */
jQuery.expr[':'].Contains = function (a, i, m)
{
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};