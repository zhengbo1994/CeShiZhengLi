/**
 * Created by Administrator on 2016/3/31.
 */
'use strict'
$(function () {

    var data1 = {
        shortcuts: {},
        menus: [
            {
                title: '企业管理',
                icon: 'fa-building',
                subMenus: [
                    { title: '企业基本信息', url: '/Enterprise', subMenus: [] },
                    { title: '企业信息明细', url: '/EnterpriseDetails', subMenus: [] }

                ]
            },
            {
                title: '考核点管理',
                icon: 'fa-globe',
                subMenus: [
                    { title: '考核点基本信息', url: '/TrainingInstitution', subMenus: [] },
                    { title: '考核点信息明细', url: '/TrainingInstitutionDetails', subMenus: [] },
                    { title: '考场维护', url: '/ExaminationRoomMaintenance', subMenus: [] }
                ]
            },
            {
                title: '考核流程',
                icon: 'fa-desktop',
                subMenus: [
                    { title: '网上报名', url: '/EmployeeRegistration', subMenus: [] },
                    { title: '取证人员网上分配', url: '/EmployeeAssignForCheck', subMenus: [] },
                    { title: '资料审核', url: '/DataAudit', subMenus: [] },
                    { title: '制定考试计划', url: '/MakeExaminationPlan', subMenus: [] },
                    { title: '打印准考证', url: '/PrintAdmissionticket', subMenus: [] },
                    { title: '管理考试结果', url: '/ManageExamresult', subMenus: [] },
                    { title: '考试结果审核', url: '/ExaminationResultsAudit', subMenus: [] },
                    { title: '打印证书', url: '/PrintCertificate', subMenus: [] },
                    { title: '证书发放登记', url: '/CertificateIssuanceRegistration', subMenus: [] }
                ]
            },
            {
                title: '证书管理',
                icon: 'fa-book',
                subMenus: [
                    { title: '证书管理', url: '/CertificateManagement', subMenus: [] },
                    { title: '证书企业变更', url: '/CertificateEnterpriseChange', subMenus: [] },
                    { title: '证书企业变更审核', url: '/CertificateEnterpriseChangeAudit', subMenus: [] },
                    { title: '证书个人信息变更', url: '/CertificateEmployeeInfoChange', subMenus: [] },
                    { title: '证书个人信息变更审核', url: '/CertificateEmployeeInfoChangeAudit', subMenus: [] }
                ]
            },

        ]

    }

    //加载用户姓名
    //{
    //    var userName = "";
    //    var opt = {
    //        type: "POST",
    //        url: "/Admin/Home/GetUserName",
    //        dataType: "text",
    //        async: false,
    //        success: function (obj) {
    //            userName = obj
    //        }
    //    };
    //    ajaxRequest(opt);
    //    $("#spUserName").text(userName);
    //}
    //$("#Logout").click(function () {
    //    var opt = {
    //        type: "POST",
    //        url: "/Home/logout",
    //        dataType: "json",
    //        async: false,
    //        success: function (obj) {
    //            if (obj.isSuccess) {
    //                locationHref("/login");
    //            }
    //        }
    //    };
    //    ajaxRequest(opt);
    //})

    //加载菜单数据
    // var data = {}
    // var initMenuData = function () {
    //     var opt = {
    //         type: "POST",
    //         url: "/Admin/Home/GetMenuList",
    //         dataType: "json",
    //         async: false,
    //         success: function (obj) {
    //             data = obj
    //         }
    //     };
    //     ajaxRequest(opt);
    // }
    // initMenuData();

    //初始化Siderbar
    var initSidebar = function () {

        var $divSiderBar = $("#sidebar").addClass("sidebar responsive");
        //加载Sidebar数据
        //var allPageList = [];
        //var pageList = [];
        //var sessionList = [];
        var initMenuData = function () {
            var menus = [];
            var opt = {
                type: "POST",
                url: "/home/getMenuList",
                dataType: "json",
                async: false,
                success: function (pageList) {
                    getMenuDate(0, menus, pageList)
                }
            };
            ajaxRequest(opt);
            return menus;
        }
        var getMenuDate = function (id, menuArr, pageList) {
            for (var i = 0; i < pageList.length; i++) {
                if (pageList[i].ParentId == id) {
                    var page = pageList[i];
                    var menu = {}
                    menu.title = page.Title;
                    menu.url = page.Url;
                    menu.icon = page.Icon;
                    menu.subMenus = []
                    getMenuDate(page.Id, menu.subMenus, pageList)
                    menuArr.push(menu);
                }

            }
        }
        var getParentPageIds = function (page) {
            if (page.parentId == 0) {
                if (arrContext(allPageList, "_id", page._id) == -1)
                    allPageList.push(page);
                return;
            }
            else {
                if (arrContext(allPageList, "_id", page._id) == -1)
                    allPageList.push(page);
                var parentIndex = arrContext(pageList, "_id", page.parentId);
                getParentPageIds(pageList[parentIndex], pageList);
            }
        }
        //初始化Sidebar菜单
        var initMenu = function (menus) {

            var $ulMenu = $("<ul>").addClass("nav nav-list")

            //初始化每级菜单项,isSubMenuFlag表示是否为子级菜单
            var initMenuItem = function ($ul, data, isSubMenuFlag) {

                //判断是否有子级菜单
                var haveSubMenuFlag = (data.subMenus.length > 0) ? true : false;

                var $li = $("<li>")
                var $a = $("<a>")

                if (haveSubMenuFlag) {
                    $a.attr("href", "#").addClass("dropdown-toggle")
                }
                else {
                    $a.attr("href", "#").data("turnto", data).click(function () {
                        var menu = $(this).data("turnto");
                        initNavTab(menu);
                    })
                }

                if (!isNull(data.icon)) {
                    var $i = $("<i>").addClass("menu-icon fa " + data.icon)
                    $a.append($i);
                }

                var $span = $("<span>").addClass(isSubMenuFlag ? "" : "menu-text").append(data.title)
                $a.append($span);

                if (haveSubMenuFlag) {
                    var $iconDown = $("<b>").addClass("arrow ace-icon fa fa-angle-down");
                    $a.append($iconDown);
                }

                $li.append($a)

                var $b = $("<b>").addClass("arrow");
                $li.append($b)

                if (haveSubMenuFlag) {
                    var $ulSubMenu = $("<ul>").addClass("submenu")
                    for (var i = 0, len = data.subMenus.length; i < len; i++) {
                        var menu = data.subMenus[i];
                        initMenuItem($ulSubMenu, menu, true)
                    }

                    $li.append($ulSubMenu)
                }
                $ul.append($li)

            }

            for (var i = 0, len = menus.length; i < len; i++) {
                var menu = menus[i];
                initMenuItem($ulMenu, menu, false)
            }

            $divSiderBar.append($ulMenu)

        }
        //初始化折叠按钮
        var initCollapse = function () {
            var $divCollapse = $("<div>").addClass("sidebar-toggle sidebar-collapse")
            var $iCollapse = $("<i>").addClass("ace-icon fa fa-angle-double-left").attr("data-icon1", "fa-angle-double-left").attr("data-icon2", "fa-angle-double-right");
            $divCollapse.append($iCollapse);
            $divSiderBar.append($divCollapse)
        }

        // var menus = initMenuData();
        var menus = [];
        var pageList = [
            { Id: 1, Title: "继续教育", Icon: "fa-laptop", Url: "", ParentId: 0 },
            { Id: 2, Title: "查看培训学习记录", Icon: "", Url: "/ViewStudyRecord", ParentId: 1 }
        ];
        getMenuDate(0, menus, pageList)
        //var data = data1;
        //var menuData = menus;
        initMenu(menus);
        initCollapse();

    }
    //初始化NavTab
    var initNavTab = function (menu) {

        var $navTabs = $("#navTabs");

        var $diivWindows = $("#divWindows");

        //初始化面包屑区域的tab按钮
        var initTab = function () {

            var $tab = $("<li>");
            var $aTab = $("<a>").attr("href", "#").data("menu", menu).append(menu.title).append("&nbsp;").click(function () {
                $navTabs.children("li").removeClass("active");
                $(this).parent().addClass("active")
                initWindow(menu)
            })

            //删除tab及对应的页面,如果删除当前页面，则自动跳转到最后一个tab页
            var $iRemove = $("<i>").addClass("ace-icon fa fa-remove").click(function () {
                var $thisTab = $(this).parent().parent()
                var active = $thisTab.hasClass("active");
                var $windows = $diivWindows.children();
                for (var i = 0, len = $windows.length; i < len; i++) {
                    var $window = $($windows[i]);
                    var $aTab = $(this).parent()
                    if ($window.data("menu") == $aTab.data("menu")) {
                        $window.remove();
                        break;
                    }
                }
                $thisTab.remove()

                if (active) {
                    $navTabs.children("li:last").children().click()
                }

            })

            $aTab.append($iRemove);
            $tab.append($aTab);
            $navTabs.append($tab);
            $aTab.click();

        }

        //初始化每个tab对应的页面，如果存在则显示，不存在则跳转
        var initWindow = function (menu) {
            var $windows = $diivWindows.children();
            for (var i = 0, len = $windows.length; i < len; i++) {
                var $window = $($windows[i]);
                if ($window.data("menu") == menu) {
                    $diivWindows.children().hide();
                    $window.show();
                    return;
                }
            }

            var mainheight = function () {
                return $(document).height() - 200;
            }

            // var $window = $("<iframe>").attr("src", menu.url).attr("frameborder", "0").attr("scrolling", "no")
            //     .attr("marginheight", "0").attr("marginwidth", "0").data("menu", menu).css("width", "100%").css("height", mainheight() + "px")
            var $window = $("<div>").data("menu", menu).load(menu.url)
            $diivWindows.append($window)
            $diivWindows.children().hide();
            $window.show();

        }

        var $tabs = $navTabs.children("li")

        //点击左边sidebar菜单时，如果该菜单对应的tab已经存在，则调用该tab点击事件，否则初始化菜单对应的tab
        for (var i = 0, len = $tabs.length; i < len; i++) {
            var $tab = $($tabs[i]);
            var txtTab = $tab.children("a").data("menu").title;
            if (txtTab == menu.title) {
                $tab.children("a").click();
                return;
            }
        }

        initTab();
    }

    $("#changePwd").click(function () {
        $("#mdlChangePwd").modal("show");
    })

    var initEditModal = function () {
        var $oldPwd = $("#oldPwd");
        var $newPwd = $("#newPwd");
        var $confirmPwd = $("#confirmPwd");
        $("#mdlChangePwd").find("#btnConfirm").on("click", function () {
            if (isNull($oldPwd.val()) || isNull($newPwd.val()) || isNull($confirmPwd.val())) {
                alert("密码不能为空");
                return;
            }
            if ($newPwd.val() != $confirmPwd.val()) {
                alert("新密码和确认密码必须保持一致");
                return;
            }

            if (!regVerify("password", $newPwd.val())) {
                alert("新密码强度不够\r\n密码必须包含字母和数字且长度为6位字符及以上");
                return;
            }
            var oldpwd = $oldPwd.val();
            var newpwd = $newPwd.val();
            var opts = {
                type: "POST",
                url: "Home/ChangePwd",
                data: { oldPwd: hex_md5(oldpwd), newPwd: hex_md5(newpwd) },
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.IsSuccess) {
                        $("#mdlChangePwd").modal("toggle");
                        alert("修改成功！");
                        locationHref("/login");
                    }
                    else {
                        alert(data.ErrorMessage);
                    }
                }
            }
            ajaxRequest(opts);
        });

    }

    var initGetUserName = function () {
        var opt = {
            type: "POST",
            url: "Home/GetUserName",
            dataType: "json",
            async: false,
            success: function (userName) {
                $("#spUserName").text(userName);
            }
        };
        ajaxRequest(opt);
    }
    var initLogoutButton = function () {
        $("#logout").on("click", function () {

            var opt = {
                type: "POST",
                url: "/home/LogOut",
                dataType: "json",
                async: false,
                success: function (resultMessage) {
                    if (resultMessage.IsSuccess) {
                        locationHref("/login2");
                    }
                    else {
                        alert(resultMessage.ErrorMessage);
                    }
                }
            };
            ajaxRequest(opt);
        });
    }
    //方法加载完成后立即执行
    initSidebar();
    //initEditModal();

    //页面加载时运行
    $(document).ready(function () {
        initGetUserName();
        initEditModal();
        initLogoutButton();
    })

})
