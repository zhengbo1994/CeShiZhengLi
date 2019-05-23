// Portal_New.aspx中用到的js

/*  显示门户总控制方法
门户页类型：
0： 个人门户
1： 项目门户
2： 企业门户

当类型是个人门户时，直接加载门户页，否则先加载相应门户类型的导航栏
*/
function windowLoad() {
    // 数据变量
    var hidPersonalPortalInfo = $("#hidPersonalPortalInfo"),
        hidProjectPortalsInfo = $("#hidProjectPortalsInfo"),
        hidCorpPortalsInfo = $("#hidCorpPortalsInfo"),
        hidProjectArea = $("#hidProjectArea"),

    jsonPersonal = $.stringToJSON(hidPersonalPortalInfo.val()),
    jsonProject = $.stringToJSON(hidProjectPortalsInfo.val()),
    jsonCorp = $.stringToJSON(hidCorpPortalsInfo.val()),
    jsonProjectArea = $.stringToJSON(hidProjectArea.val()),
    jsonTemp = null;

    // DOM元素变量
    var aLink = $("[name=IDPortalTab]");
    var subNavs = $(".nav-content>ul>li"); // 导航栏
    var subMenus = $(".sub-menu");

    // 生成页面
    subNavs.each(function (i) {
        $(this).css('left', i * 1200);
    });

    // 绑定事件
    aLink.each(function (i) {
        switch (i) {
            case 0:
                jsonTemp = jsonPersonal[0];
                break;
            case 1:
                jsonTemp = jsonProject;
                break;
            case 2:
                jsonTemp = jsonCorp;
                break;
            default:
                jsonTemp = null;
                break;
        }
        $(this).bind('click', (function (json) {
            return function () {
                showPortal(i, json, i, 'IDModTabFrame');
            }
        })(jsonTemp));
    });

    // 关闭导航栏
    aLink.eq(0).bind('click', hideNavBar);

    // 默认加载个人门户
    showPortal(0, jsonPersonal[0], 0, 'IDModTabFrame');


    // 测试
    //alert($("#hidCorpPortalsInfo").val());
}
function buildRegion(province, json) {
    var li = document.createElement("li"),
        dl = document.createElement("dl"),
        dt = document.createElement("dt"),
        dd = document.createElement("dd");

    dt.innerHTML = province;
    dd.innerHTML = '<a href="javascript: void(0)"><img src="../Show-How/content/images/jingyuetan.png" alt="净月潭" /></a>';

    dl.appendChild(dt);
    dl.appendChild(dd);
    li.appendChild(dl);

    dl.style.left = "0px";
    li.className = "region-projects";

    return li;
}
function changeMoveButtonStatus(target) {
    var moveLeft = $(".move-left");
    var moveRight = $(".move-right");
    if (!moveLeft.length || !moveRight.length) {
        return false;
    }
    var sl = target.scrollLeft();
    var sw = target.get()[0].scrollWidth;
    var w = target.width();

    if (sl > 0)
        moveLeft.show();
    else
        moveLeft.hide();

    if ((sw - sl) <= w)
        moveRight.hide();
    else
        moveRight.show();
}

function showPortal(index, json, type, controlFrame, ev) {
    var ev = ev || window.ev;
    selectTab(index, "IDPortalTab");

    switch (type.toString()) {
        case "0":
            showPersonalPortal(json, controlFrame);
            break;
        case "1":
            showProjectNavBar(json, type, controlFrame);
            break;
        case "2":
            showCorpNavBar(json, type, controlFrame);
            break;
        default:
            break;
    }
    return false;
}

// 显示个人门户
function showPersonalPortal(json, controlFrame) {
    var frame = getObj(controlFrame);
    //    alert(json.AccountID);
}

// 显示项目门户
function showProjectPortal(json, controlFrame) {
    var frame = getObj(controlFrame);
    alert(json.ProjectID);
}

// 显示企业门户
function showCoprPortal(json, controlFrame) {
    var frame = getObj(controlFrame);
    alert(json.CorpID);
}

//更新状态信息栏
function refreshInfoBar(jsonNextPortal) {

}

//切换门户（在状态信息栏中切换）
function switchPortal(currentOwnerID, actionType, controlFrame) {

}

// 显示导航栏
function showNav(type) {
    if (isNaN(type)) {
        return false;
    }

    var nav = $(".nav"),
        navList = $(".nav-content ul"),
        liIndex,
        currentTypeNav,
        targetLeft,
        regionProjects = $(".region-projects"); // 区域项目列表集合

    switch (type.toString()) {
        case "1":
            liIndex = 0;
            targetLeft = "0px";
            break;
        case "2":
            liIndex = 1;
            targetLeft = "-1200px";
            break;
        default:
            break;
    }
    currentTypeNav = nav.find("div ul li").eq(type - 1);
    nav.stop().slideDown('1000');
    navList.animate({ 'left': targetLeft }, '1000');

    if (type.toString() == "1") {
        changeMoveButtonStatus(regionProjects.eq(regionProjects.length - 1));
    }
}

// 隐藏导航栏
function hideNavBar() {
    var nav = $(".nav");
    //alert(nav.css('height'));
    slideUp(nav, 300);
}

// 实现slide up 方法
var __timer = null;
function slideUp(obj, duration) {
    if (!obj || isNaN(duration)) {
        return false;
    }
    var me = $(obj);
    var height = parseInt(me.css('height'));
    var interval = 30;
    var times = duration / interval;
    if (isNaN(height)) {
        height = obj.offsetHeight
    }
    var speed = parseInt(height / times) + 1;
    speed = speed <= 0 ? 1 : speed;

    __timer = setInterval((function (obj, speed, originalHeight) {
        return function () {
            var me = $(obj);
            var height = parseInt(me.css('height'));
            if (isNaN(height)) {
                height = obj.offsetHeight
            }
            if (height - speed <= 0) {
                clearInterval(__timer);
                me.hide();
                me.css('height', originalHeight);
                return false;
            }
            me.css('height', '-=' + speed);
        }
    })(obj, speed, height), interval);
}

// 显示项目门户导航栏
function showProjectNavBar(json, type, controlFrame) {
    var liProjectNav = $("#liProjectNav"),
        divProjectShow = liProjectNav.find(".project-show");

    if (divProjectShow.length == 0) {
        loadProjectNavBar(json, controlFrame);
    }

    showNav(type);
}

// 加载项目门户导航栏
function loadProjectNavBar(json, controlFrame) {
    var hidProjectArea = $("#hidProjectArea"),
        jsonProjectArea = $.stringToJSON(hidProjectArea.val()),
        liProjectNav = $("#liProjectNav");


    var ulProjectArea = buildProjectAreaMap(jsonProjectArea),
        divProjectList = buildProjectListContainer(json, controlFrame);

    liProjectNav.html("");
    liProjectNav.append(ulProjectArea);
    liProjectNav.append(divProjectList);

    var projectListBox = $(".project-list"); // 项目列表外框
    var regionProjects = $(".region-projects"); // 区域项目列表集合
    var regionMap = $(".region-map"); // 中国地图区域
    var mapLinks = regionMap.find("li a"); // 中国地图区域链接

    // 调整样式
    regionProjects.each(function (i) {
        var me = $(this);
        me.find("dl").each(function (i, e) {
            $(e).css('left', i * 120);
        });
    });

    // 绑定事件
    mapLinks.click(function () // 点击某个区域链接
    {
        var me = $(this);
        if (me.closest("li").hasClass("sel")) {
            return false;
        }
        me.closest("li").addClass("sel").siblings(".sel").removeClass("sel");

        // 切换城市项目
        var newRegion = buildRegion(me.html())
        projectListBox.append(newRegion);
        regionProjects = $(".region-projects");

        $.when(projectListBox.animate({ "top": "-=243" }, 700)).done(function () {
            changeMoveButtonStatus(regionProjects.eq(regionProjects.length - 1));
        });
    });
    var moveLeft = $(".move-left");
    var moveRight = $(".move-right");
    // 向左移动项目
    moveLeft.click(function () {
        var target = regionProjects.eq(regionProjects.length - 1);
        $.when(target.stop().animate({ "scrollLeft": "-=600" }, 700)).done(function () {
            changeMoveButtonStatus(target);
        });
    });

    // 向右移动项目
    moveRight.click(function () {
        var target = regionProjects.eq(regionProjects.length - 1);
        $.when(target.stop().animate({ "scrollLeft": "+=600" }, 700)).done(function () {
            changeMoveButtonStatus(target);
        });
    });
}

// 生成企业区域地图
function buildProjectAreaMap(json) {
    if (!json) {
        return false;
    }

    var ul = document.createElement("ul"),
        li, a;

    try {
        ul.className = "region-map";

        for (var i = 0; i < json.length; i++) {
            li = document.createElement("li");
            a = document.createElement("a");

            li.style.left = json[i].AxisX + "px";
            li.style.top = json[i].AxisY + "px";

            a.href = "javascript:void(0)";
            a.innerHTML = json[i].PAName;

            li.appendChild(a);
            ul.appendChild(li);
        }
    } catch (ex) {
    }
    return ul;
}

// 生成项目列表
function buildProjectListContainer(json, controlFrame) {
    if (!json) {
        return false;
    }

    var div = document.createElement("div"),
        aMoveLeft = document.createElement("a"),
        aMoveRight = document.createElement("a"),
        ulProjectList = document.createElement("ul"),
        liCurrentAreaProjectList = buildProjectList(json, controlFrame);

    div.className = "project-show";
    aMoveLeft.href = "javascript:void(0);";
    aMoveLeft.className = "move-left";
    aMoveRight.href = "javascript:void(0);";
    aMoveRight.className = "move-right";
    ulProjectList.className = "project-list";

    ulProjectList.appendChild(liCurrentAreaProjectList);
    div.appendChild(aMoveLeft);
    div.appendChild(aMoveRight);
    div.appendChild(ulProjectList);

    return div;
}

function buildProjectList(json, controlFrame) {
    var li = document.createElement("li"),
        dl, dt, dd, img, a,
        prevCityName = "",
        currentCityName = "",
        jsonCopy = json.slice(),
        item = null;

    li.className = "region-projects";
    // 让项目数组按城市名排序
    jsonCopy.sort(function (a, b) { return a.PCName > b.PCName; });

    try {
        for (var i = 0; i < jsonCopy.length; i++) {
            item = jsonCopy[i];
            currentCityName = item.PCName;
            if (prevCityName != currentCityName) {
                if (!!dl) {
                    li.appendChild(dl);
                }

                dl = document.createElement("dl");
                dt = document.createElement("dt");
                dd = document.createElement("dd");
                a = document.createElement("a");
                img = document.createElement("img");

                dt.innerHTML = currentCityName;
                a.href = "javascript: void(0)";
                img.alt = currentCityName;
                if (item.LogoImgUrl) {
                    img.src = ("../" + item.LogoImgUrl).replace(/\/+/g, "/");
                }

                a.appendChild(img);
                dd.appendChild(a);
                dl.appendChild(dt);
                dl.appendChild(dd);
            }
            dl = !dl ? document.createElement("dl") : dl;

            dd = document.createElement("dd");
            a = document.createElement("a");
            a.href = "javascript: void(0)";
            a.innerHTML = item.ProjectName;
            $(a).bind('click', (function (json, controlFrame) {
                return function () {
                    showProjectPortal(json, controlFrame);
                    hideNavBar();
                }
            })(item, controlFrame));
            dd.appendChild(a);

            dl.appendChild(dd);
        }
        li.appendChild(dl);
    }
    catch (ex) {

    }

    return li;
}

// 显示企业门户导航栏
function showCorpNavBar(json, type, controlFrame) {
    var liCorpNav = $("#liCorpNav");

    if (liCorpNav[0].childNodes.length == 0) {
        loadCorpNavBar(json, controlFrame);
    }
    showNav(type);
}

// 加载企业列表
function loadCorpList() {
}

// 加载企业门户导航栏
function loadCorpNavBar(json, controlFrame) {
    var liCorpNav = $("#liCorpNav"),
        frag = buildCorpNavBar(json, controlFrame);

    liCorpNav.append(frag);
}

// 生成企业列表
function buildCorpNavBar(json, controlFrame) {
    var frag, dl, dt, dd, img, a,
        item;

    frag = document.createDocumentFragment();

    for (var i = 0; i < json.length; i++) {
        item = json[i];
        dl = document.createElement("dl");
        dt = document.createElement("dt");
        dd = document.createElement("dd");
        a = document.createElement("a");
        img = document.createElement("img");

        dl.className = "main-pro-item";
        dt.className = "main-pro-item-title";
        a.href = "javascript: void(0)";
        a.innerHTML = item.CorpName;
        dt.appendChild(a);

        a = document.createElement("a");
        a.href = "javascript: void(0)";
        if (item.LogoImgUrl) {
            img.src = ("../" + item.LogoImgUrl).replace(/\/+/g, "/");
        }
        img.alt = item.CorpName;
        a.appendChild(img);
        dd.appendChild(a);

        dl.appendChild(dt);
        dl.appendChild(dd);
        $(dl).find("a").bind('click', (function (json, controlFrame) {
            return function () {
                showCoprPortal(json, controlFrame);
                hideNavBar();
            }
        })(item, controlFrame));
        frag.appendChild(dl);
    }
    return frag;
}