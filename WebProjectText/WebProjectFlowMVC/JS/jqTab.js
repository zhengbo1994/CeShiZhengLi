/**
* @author 翁化青


简要说明：
jq tab插件是一款根据传入的json数组自动生成选项卡的组件，若选项卡过多无法在一行显示，可以点击“更多”按钮进行显示剩余的选项卡。
且在弹出“更多”选项卡的弹出层中，有“调整显示”按钮，点击后可以切换已显示的选项卡和“更多”中的选项卡的位置。自定义要显示的选项卡。
但目前还不能对这种调整结果进行保存。

其中jq tab在初始化时，需要指定以下参数：(以下内容的格式为【是否必须/参数名/接受类型/描述)
（必须）containerID，string,     容器ID，该组件会把选项卡集合生成到这个容器ID对应的对象中。
（必须）displayAttr，string,     显示属性，即选项卡上会显示数据对象的属性名，如Name，Text等等。
（必须）items，json,             数据集合，必须为一个数组，数组中每个元素是一个json对象，该json对象的属性可以完全自定义。
（非必须）size,int,              选项卡最大显示数量。
（非必须）callback，function,    每个选项卡的点击响应时间，点击每个选项卡后，会调用已定义的callback函数,
                                 参数为: 1. 被点击的选项卡在显示选项卡栏中的索引，若该选项卡在“更多”容器中，返回-1，
                                         2. 选项卡对应的json数据对象。



在使用页面中，需要定义并调用一个初始化代码，用以初始化选项卡。选项卡对应的数据集合用json的格式传入。
可自定义选项卡要显示json对象中的那个属性。
页面加载示例代码：（不包含json对象的声明部分。）
/-----------------------------------------------------------------/
// 参数：
//  json:   要绑定的选项卡的数据集合，json是一个数组，其中每一个元素为一个json对象，其中包含的属性可以完全自定义。     
function initialTabs(json) 
{
    var jqTab = new jqTabMaster();

    jqTab.initial({
        containerID: "divMyContainer",
        displayAttr: "Name",
        size: 10,
        items: json,
        callback: myFunction
    });
}

//点击事件调用函数
// 参数：  index:  在默认容器中显示的tab的索引号。若被点击的tab在more容器中（不在默认容器中），则返回-1；
           data:   被点击的tab对应的json对象，其中包含的属性可完全自定义
function myFunction(index, data) {
     // do something.
}
/-----------------------------------------------------------------/
    
jq tab容器内生成的html结构如下：
<ul>
    <li>
        <a>
            <span><span>text</span></span>
        </a>
    </li>
</ul>

由于选项卡的样式需要和网站统一，所以组件内不对选项卡的样式进行定制。请自行定制选项卡样式。可以通过容器的样式继承来实现选项卡的样式定制。

使用说明：
首先要引用以下文件：
css：
\css\common\jqTabjqTab.css
js：
\JSjquery-1.7.2.min.js
\JSjqTab.js


其他说明：
jqTab的more容器中的tab分为2个状态，
一个是默认状态，即点击more容器中的tab可以直接调用callback方法。页面执行被点击tab相应的方法。
另一个是调整显示状态，即点击more容器或默认显示容器中的tab，可以跳转位置，将tab从more容器移动到默认容器，或反之。
而为了不互相冲突，第一种状态，是将事件绑定在tab外部的ul标签上（参考上面的html结构）， 而第二种状态是将事件绑定在tab的li上。

*/

/*-------------- Common Functions ------------------*/
function stopPropagation(e)
{
    e = e || window.event;
    if (e.stopPropagation)
    { //W3C阻止冒泡方法
        e.stopPropagation();
    } else
    {
        e.cancelBubble = true; //IE阻止冒泡方法
    }
}
function removeEleFromArr(arr, obj)
{
    if (!arr)
    {
        return false;
    }
    var removeIndexArr = [];
    for (var i = 0; i < arr.length; i++)
    {
        if (arr[i] == obj)
        {
            removeIndexArr.push(i);
        }
    }
    for (var i = removeIndexArr.length - 1; i >= 0; i--)
    {
        arr.splice(removeIndexArr[i], 1);
    }
}

function removeArrFromArr(arr1, arr2)
{
    if (!arr1 || !arr2)
    {
        return false;
    }
    var copyArr1 = arrayCopy(arr1);
    for (var i = 0; i < arr2.length; i++)
    {
        removeEleFromArr(copyArr1, arr2[i]);
    }
    return copyArr1;
}

function arrayCopy(arr)
{
    if (!!arr && typeof arr.slice == "function")
    {
        return arr.slice();
    }
    else
    {
        return null;
    }
}
//window.onresize = function () {
//    var me = jqTabMaster.prototype,
//        config = me.config;
//    config.isResize = true;
//    alert("resize");
//}

/*--------------------------------------------------*/
var jqTabMaster = function ()
{
};
jqTabMaster.prototype.config = {
    settingFontColor: "#f00",
    isNowSetting: false,
    containerID: "",
    displayAttr: "",
    size: 0,
    items: [],
    allItemsIndex: [],
    showItemsIndex: [],
    callback: null
};


jqTabMaster.prototype.packingItems = function (items)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i]["__jqTabIndex"] = i;
    }
    return items;
}
jqTabMaster.prototype.getTabShowInfo = function (index)
{
    if (isNaN(index) || index < 0)
    {
        return { li: null, showIndex: -1 };
    }

    var me = jqTabMaster.prototype,
        config = me.config,
        container = $('#' + config.containerID),
        lis = container.find('ul li'),
        showLi = container.find('ul li[index=' + index + ']');

    return {
        li: showLi,
        showIndex: showLi.length > 0 ? lis.index(showLi) : -1
    };
}
// 根据索引号获取数组中连续的元素，以数组形式返回
jqTabMaster.prototype.getContinueousIndexArr = function (startIndex, endIndex)
{
    var me = jqTabMaster.prototype,
        config = me.config,
        items = config.items,
        max = items.length - 1,
        startIndex = (typeof startIndex == 'undefined' || isNaN(startIndex)) ? 0 : startIndex,
        endIndex = (typeof endIndex == 'undefined' || isNaN(endIndex)) ? max : endIndex,
        indexArr = [];

    for (var i = startIndex; i <= endIndex; i++)
    {
        indexArr.push(i);
    }

    return indexArr;
}

jqTabMaster.prototype.buildLi = function (index, text, className)
{
    var me = jqTabMaster.prototype,
        config = me.config,
        displayAttr = config.displayAttr,
        li,
        a;

    li = document.createElement("li");
    a = document.createElement("<a name='TabInfo'>");
    a.style.display = "block";
    a.onfocus = function () { this.blur(); }
    a.href = "javascript:void(0);";
    a.innerHTML = "<span><span>" + text + "</span></span>";
    li.index = index;
    li.appendChild(a);

    if (!!className)
    {
        li.className = className;
    }

    return li;
}
// 传入需要显示的items的索引数组，根据该数组来显示
jqTabMaster.prototype.buildUl = function (indexArr, className)
{
    if (!indexArr)
    {
        return false;
    }

    var me = jqTabMaster.prototype,
        config = me.config,
        displayAttr = config.displayAttr,
        items = config.items,
        currentIndex,
        callback = config.callback,
        ul = document.createElement("ul"),
        li,
        a;

    for (var i = 0; i < indexArr.length; i++)
    {
        currentIndex = indexArr[i];
        li = me.buildLi(items[currentIndex].__jqTabIndex, items[currentIndex][displayAttr]);
        ul.appendChild(li);
    }
    if (!!className)
    {
        ul.className = className;
    }

    me.bindTabsClickEvent(ul, callback);
    return ul;
}

jqTabMaster.prototype.bindTabsClickEvent = function (ul, callback)
{
    if (!!ul && ul.tagName == "UL" && typeof callback == "function")
    {
        ul.onclick = function (ev)
        {
            var ev = ev || window.event,
                target = ev.target || ev.srcElement,
                me = jqTabMaster.prototype,
                caller = this,
                config = me.config,
                isBelong2TabsContainer = $(ul).parents("#" + config.containerID).length > 0,
                tabShowInfo,
                lis,
                li,
                currentIndex,
                showLi,
                showIndex;

            if (target.tagName == "SPAN")
            {
                // Get the li tag
                li = target.parentNode.parentNode.parentNode;

                tabShowInfo = me.getTabShowInfo(li.index);
                showIndex = tabShowInfo.showIndex;

                // 如果li属于more容器，且在默认容器中不存在该项目，需要将其移动到默认容器的“全部”tab后
                if (showIndex < 0)
                {
                    me.addTab(li, 1, true);

                    tabShowInfo = me.getTabShowInfo(li.index);
                    showIndex = tabShowInfo.showIndex;
                    stopPropagation(ev);
                }
                currentIndex = li.index;

                if (me.isMoreTabsVisible())
                {
                    me.hideMoreTabs(function ()
                    {
                        callback.call(caller, showIndex, config.items[currentIndex]);
                    });
                }
                else
                {
                    callback.call(caller, showIndex, config.items[currentIndex]);
                }

            }
            else
            {
                return false;
            }
        }
    }
}
jqTabMaster.prototype.unbindTabsClickEvent = function (ul)
{
    if (!!ul && ul.tagName == "UL" && typeof callback == "function")
    {
        ul.onclick = null;
    }
}

jqTabMaster.prototype.removeOverFlowLi = function (ul, realSize)
{
    var lis = $(ul).find("li");

    for (var i = realSize; i < lis.length; i++)
    {
        lis.eq(i).remove();
    }
}

jqTabMaster.prototype.clearTabs = function ()
{
    var me = jqTabMaster.prototype,
        config = me.config,
        container = $("#" + me.config.containerID),
        moreBtn = $("#divMoreBtn"),
        divMore = $("#divMore"),
        parentContainer = container.parent();

    me.config.containerID = "";
    me.config.displayAttr = "";
    me.config.size = 0;
    me.config.items = [];
    me.config.allItemsIndex = [];
    me.config.callback = null;

    parentContainer.hide();
    container.html("");
    moreBtn.remove();
    divMore.remove();
    parentContainer.show();
}

jqTabMaster.prototype.initial = function (option)
{
    var me = jqTabMaster.prototype,
        config = me.config,
        allItemsIndex = me.getContinueousIndexArr(1, option.items.length - 1);

    me.clearTabs();

    config.containerID = option.containerID;
    config.displayAttr = option.displayAttr;
    config.size = option.size || option.items.length;
    config.items = me.packingItems(option.items);
    config.allItemsIndex = allItemsIndex;
    config.callback = option.callback;

    var container = $("#" + config.containerID),
         iLen,
         ul,
         needShowIndexArr = [],
         showItemsIndex = [],
         moreItemsCount = 0;

    container.hide();
    container.addClass('container');
    container.css('float', 'left');
    container.css('width', container.parent().width()-50);
    container.css('overflow', 'hidden');
    /*增加”更多“按钮，默认为disabled*/
    var moreBtn = $("<div id='divMoreBtn' class='no-more font'><span>+更多</span></div>");
    moreBtn.hover(function ()
    {
        $(this).find('span').css('background-image', 'url(/IDWebSoft/Image/gradual1.gif)');
    },
    function ()
    {
        $(this).find('span').css('background-image', 'url(/IDWebSoft/Image/gradual.gif)');
    });
    moreBtn.insertAfter(container);

    /* 添加可显示的tabs */
    iLen = Math.min(config.items.length, config.size);
    needShowIndexArr = me.getContinueousIndexArr(0, iLen - 1);
    ul = me.buildUl(needShowIndexArr);
    container.append(ul);
    container.show();

    /* Get Real Size 
    由于这里要调用offsetTop来判断是否超出边界，调用offset的参数会比较耗性能，
    现在是用从头开始便利数组获取的，之后可以使用二分法来进行快速查找，以提高性能。
    */
    var displayInfo = me.getRealDisplayInfo();
    config.showItemsIndex = displayInfo.showItemsIndex;

    /* 移除掉超出容器到li */
    me.removeOverFlowLi(ul, displayInfo.showItemsIndex.length);

    /* 当tab没有完全显示时 */
    if (config.showItemsIndex.length < config.allItemsIndex.length)
    {
        $("#divMoreBtn").toggleClass('no-more');
        /*绑定显示更多tab事件*/
        $("#divMoreBtn").bind('click', function (ev)
        {
            me.showMoreTabs(ev);
        });
    }
}

jqTabMaster.prototype.getRealDisplayInfo = function ()
{
    var me = jqTabMaster.prototype,
        config = me.config,
        items = config.items,
        lis = $("#" + config.containerID + " ul li"),
        showItemsIndex = [],
        allItemsIndex = me.config.allItemsIndex,
        originOffsetTop = null;

    lis.each(function (i)
    {
        if (originOffsetTop == null || originOffsetTop == this.offsetTop)
        {
            originOffsetTop = this.offsetTop;
            showItemsIndex.push(this.index);
        }
        else if (this.offsetTop != originOffsetTop)
        {
            return false;
        }
    });

    return { showItemsIndex: showItemsIndex };
}

jqTabMaster.prototype.isMoreTabsVisible = function ()
{
    return $('#divMore').length > 0;
}

/*
* params:
* ev: window.event
*/
jqTabMaster.prototype.showMoreTabs = function (ev)
{
    var me = jqTabMaster.prototype,
         config = me.config,
         ev = ev || window.event,
         target = $(ev.target || ev.srcElement),
         moreDivAlreadyAppended = false,
        /* 父级元素的offset信息 */
         parentNode = $("#divMenu").parent(),
        /* more tabs*/
        ul;

    moreDivAlreadyAppended = $("#divMore").length;
    var moreDiv = moreDivAlreadyAppended ? $("#divMore") : $("<div>");

    if (!moreDivAlreadyAppended)
    {
        var moreTabsContainer = me.buildMoreTabsContainer(),
            hideMoreBtn = me.buildHideMoreButton();

        moreDiv.attr('id', 'divMore');
        moreDiv.addClass("more-div");
        moreDiv.append(moreTabsContainer);
        moreDiv.append(hideMoreBtn);
        moreDiv.hide();
        $.when(moreDiv.insertAfter($('#divMoreBtn'))).done(function ()
        {
            moreDiv.stop().slideDown(500, function ()
            {
                /* more tabs显示后，重新绑定事件*/
                me.bindEventsWhenMoreTabsShow();
            });

            /*阻止选中文本*/
            me.bankSelect();
        });
    }
    else
    {
        moreDiv.stop().slideDown(600);

        /* more tabs显示后，重新绑定事件*/
        me.bindEventsWhenMoreTabsShow();

        /*阻止选中文本*/
        me.bankSelect();
    }

    stopPropagation(ev);
}

jqTabMaster.prototype.buildMoreTabsContainer = function ()
{
    var moreTabsContainer = $("<div>"),
        me = jqTabMaster.prototype,
        /* 需要显示的items索引数组 */
        needShowIndexArr = this.config.allItemsIndex;
    moreTabsContainer.addClass('more-tabs-container');

    ul = me.buildUl(needShowIndexArr);
    moreTabsContainer.append(ul);
    return moreTabsContainer;
}

jqTabMaster.prototype.buildHideMoreButton = function ()
{
    var hideMoreBtnContainer = $("<div>"),
        hideMoreBtn = $('<div>');

    hideMoreBtnContainer.addClass("hide-more-btn-container");
    hideMoreBtn.addClass("hide-more-btn");
    hideMoreBtnContainer.append(hideMoreBtn);
    hideMoreBtnContainer.bind('click', function ()
    {
        jqTabMaster.prototype.hideMoreTabs();
    });

    return hideMoreBtnContainer;
}


jqTabMaster.prototype.hideMoreTabs = function (callback)
{
    var divMore = $("#divMore"),
        divMoreBtn = $("#divMoreBtn");

    divMore.stop().animate({ 'height': '1px' }, 400,
    function ()
    {
        $(this).remove();

        /* more tabs隐藏后重新绑定事件*/
        jqTabMaster.prototype.bindEventsWhenMoreTabsHide();

        if (typeof callback == 'function')
        {
            callback();
        }
    });
}

jqTabMaster.prototype.bindEventsWhenMoreTabsHide = function ()
{
    $(document).unbind('click');
}

jqTabMaster.prototype.bindEventsWhenMoreTabsShow = function ()
{
    /* 点击more tabs容器外地地方时，隐藏more tabs*/
    $(document).unbind('click').bind('click', function (ev)
    {
        var me = jqTabMaster.prototype,
             ev = ev || window.event,
             target = ev.target || ev.srcElement,
             isDivMore = target.id == "divMore",
             isBelong2DivMore = $(target).parents("#divMore").length > 0,
             isShowTab = $(target).parents("#divMenu").length > 0;

        if (!isBelong2DivMore && !isShowTab)
        {
            me.hideMoreTabs();
        }
        else
        {
            stopPropagation(ev);
            return false;
        }
    });
}

/*
summary： 将more容器中的tab插入到默认容器中。
params:
li:  要插入到默认容器中的tab对应的li标签
targetIndex: 整数。要插入到默认容器中的索引号。
该方法用于两种情况：
1. 调整显示时；
2. 平时点击more容器中的tab时。
当点击more容器的tab，会将该tab移动到默认容器的第2个位置（“全部”tab之后）。这是会把最后多出的tab挤到more容器中。
当targetIndex大于默认容器中tab数量且（默认容器已经装满或实际显示tab数量等于最大允许数量）时。因为若targetIndex大于等于默认容器中的tab数量，
当前li会被插入到默认容器的队尾，插入后自己又会被挤走。
*/
jqTabMaster.prototype.addTab = function (li, targetIndex)
{
    var me = jqTabMaster.prototype,
        config = me.config,
        displayAttr = config.displayAttr,
        maxSize = config.size,
        realSize = config.showItemsIndex.length,
        targetIndex = typeof targetIndex == "undeinfed" || isNaN(targetIndex) || targetIndex > realSize ?
        realSize : targetIndex;

    if (isNaN(targetIndex))
    {
        return false;
    }

    var showItemsIndex = config.showItemsIndex,
        notShowItemsIndex = config.notShowItemsIndex,
        items = config.items,
        showedTabsContainer = $("#" + config.containerID + " ul"),
        showLis = showedTabsContainer.find("li"),
        firstShowTab = realSize > 0 ? showLis.eq(0) : null,
        targetShowTab,
        lastShowTab,
        firstTabOffsetTop = firstShowTab.offset().top,
        moreTabsUl = $("#divMore ul"),
        moreTabsLi = moreTabsUl.find("li"),
        currentLiIndex = li.index,
        currentItem = items[currentLiIndex],
        newLi = me.buildLi(currentLiIndex, currentItem[displayAttr]),
        addSuccessful = false;

    /* Build New Li need to insert */
    newLi = $(newLi);

    /* insert li into target index */
    if (targetIndex < realSize)
    {
        targetShowTab = showLis.eq(targetIndex);
        newLi.insertBefore(targetShowTab);
    }
    else
    {
        showedTabsContainer.append(newLi);
    }

    addSuccessful = !firstShowTab || (firstTabOffsetTop == newLi.offset().top);
    if (!addSuccessful)
    {
        newLi.remove();
    }
    else
    {
        realSize++;
        removeEleFromArr(notShowItemsIndex, currentLiIndex);
        showItemsIndex.push(currentLiIndex);

        // 插入tab后，要将被挤出显示区的tab移除，避免之后的步骤出错
        var displayInfo = me.getRealDisplayInfo();
        config.showItemsIndex = displayInfo.showItemsIndex;

        /* 移除掉超出容器到li */
        me.removeOverFlowLi(showedTabsContainer, displayInfo.showItemsIndex.length);
    }

    return addSuccessful ? newLi : null;
}

/*
summary： 将默认容器中的tab插入到more容器中,并将li的index插入到未显示索引数组中。
params:
li:  要插入到more容器中的tab对应的li标签
targetIndex: 整数。要插入到more容器中的索引号。
*/
jqTabMaster.prototype.removeTab = function (li, targetIndex)
{
    var me = jqTabMaster.prototype,
        config = me.config,
        displayAttr = config.displayAttr,
        items = config.items,
        showItemsIndex = config.showItemsIndex,
        notShowItemsIndex = config.notShowItemsIndex,
        realSize = config.showItemsIndex.length,

        moreTabsContainer = $("#divMore ul"),
        currentLiIndex = li.index,
        currentItem = items[currentLiIndex],
        newLi = me.buildLi(currentLiIndex, currentItem[displayAttr]),
        targetIndex = typeof targetIndex == "undeinfed" || isNaN(targetIndex) || targetIndex > realSize ?
        realSize : targetIndex,
        targetTab = moreTabsContainer.find("li").eq(targetIndex);

    newLi = $(newLi);

    $(li).remove();
    removeEleFromArr(showItemsIndex, currentLiIndex);

    if (targetIndex < realSize)
    {
        newLi.insertBefore(targetTab);
    }
    else
    {
        moreTabsContainer.append(newLi);
    }

    notShowItemsIndex.splice(targetIndex, 0, currentLiIndex);
}

/* 禁止文本被选中 */
jqTabMaster.prototype.bankSelect = function ()
{
    $("#divMore,#divMoreBtn,#" + jqTabMaster.prototype.config.containerID).bind('selectstart', function ()
    {
        return false;
    })
     .css({
         '-moz-user-select': 'none',
         '-webkit-user-select': 'none',
         'user-select': 'none'
     });
}