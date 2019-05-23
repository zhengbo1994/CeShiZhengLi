/**
 * Created by jamie on 2015/11/25.
 */

$(function () {

    // 判断浏览器是否支持 placeholder
    function placeholderSupport() {    
        return 'placeholder' in document.createElement('input');
    }

    if (!placeholderSupport()) {
        $(document).on('focus', '[placeholder]', function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        });
        $(document).on('blur', '[placeholder]', function () {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        });
        $('[placeholder]').blur();
    };
    
    /*************根据数据生成table列表*******************/

    //根据获取的数据生成对应的职位标签
    function creatStationTab(sObj,mode) {
        if (sObj && sObj.length > 0) {
            for (var i = 0, $positionName = "", $tableContainer=""; i < sObj.length; i++) {
                $positionName += '<li title="' + sObj[i].StationName + '" name=' + sObj[i].StationID + '>' + sObj[i].StationName + '</li>';
                $tableContainer = '<table id="' + sObj[i].StationID + '" mode="'+mode+'"><tr></tr></table>';
                $(".detail-inner-container").append($tableContainer);
            }
            $(".position-name>ul").append($positionName);
        } else {
            return;
        }
    }

    // 生成发起工作对应的小模块的代码片段
    function childHtml(cObj) {
        if (cObj && cObj.length > 0) {
            var $childList = "";
            for (var i = 0; i < cObj.length; i++) {
                
                if (cObj[i].Flow.length > 0) {
                    for (var y = 0, $flowName = ""; y < cObj[i].Flow.length; y++) {
                        var $url = cObj[i].Flow[y].Url, $flowid = cObj[i].Flow[y].FlowID, $type = cObj[i].Flow[y].Type, $remark = cObj[i].Flow[y].Remark, $Name = cObj[i].Flow[y].FlowName;  /**************/
                        if (cObj[i].Children.length == 0) {
                            $flowName += '<li><a href="javascript:void(0)" title="' + $Name + ' \r\n\r\n' + $remark + '"  flowid="' + $flowid + '" url="' + $url + '"  type="' + $type + '">' + cObj[i].Flow[y].FlowName + '</a><b class="viewflow" style="display:none" title="流程预览"></b></li>';
                        } else {
                            $flowName += '<li><a href="javascript:void(0)" title="' + $Name + ' \r\n\r\n' + $remark + '" flowid="' + $flowid + '" url="' + $url + '"  type="' + $type + '">' + cObj[i].Flow[y].FlowName + '</a><b class="viewflow" style="display:none" title="流程预览"></b>' + childHtml(cObj[i].Children) + '</li>';
                        }                        
                    }
                } else if (cObj[i].Flow.length == 0 && cObj[i].Children.length>0) {
                    $flowName = '<li>' + childHtml(cObj[i].Children) + '</li>';
                }
                
                $childList += '<div><h2 title="' + cObj[i].FlowTypeName + '"><span class="little-dot">&bull;&nbsp;&nbsp;</span>' + cObj[i].FlowTypeName + '</h2><ul>' + $flowName + '</ul></div>';
            }
            return $childList;
        } else {
            return "";
        }
    }

    function parentHtml(pObj) {
        if (pObj && pObj.length > 0) {
            for (var i = 0, $positionListArr = []; i < pObj.length; i++) {
                //生成内容
                    if(pObj[i].Flow){
                        for (var n = 0, $flowList = ""; n < pObj[i].Flow.length; n++) {
                            var $url = pObj[i].Flow[n].Url || "", $flowid = pObj[i].Flow[n].FlowID || "", $type = pObj[i].Flow[n].Type || "", $fName = pObj[i].Flow[n].FlowName || "", $remark = pObj[i].Flow[n].Remark || "";      /******************/
                            $flowList += '<dd><div><a style="display:inline-block;max-width:85%;height:25px;overflow:hidden"  href="javascript:void(0)" title="' + $fName +' \r\n\r\n'+$remark + '" flowid="' + $flowid + '"  url="' + $url + '" type="' + $type + '">' + pObj[i].Flow[n].FlowName + '</a><b class="viewflow" style="display:none" title="流程预览"></b></div></dd>';
                        }
                      
                    }
               

                var $childList = childHtml(pObj[i].Children);
                $positionListArr.push('<dl><dt><span class="title">' + pObj[i].FlowTypeName + '</span><span class="up"></span></dt>' + $flowList + '<dd class="second-title-container">' + $childList + '</dd>' + '</dl>');
            }
            return $positionListArr;
        } else {
            return "";
        }        

    }


    ////把生成的dl加到对应id的table中(table的id，生成的html数组,第一个参数为要放入table的id，第二个参数为要放入的数组对象，第三个参数为生成多少列，取值为2或者3)
    function creatTable(tableId, arr,n) {
        if (n == 3) {
            var $td = '<td class="td0" style="width:33%"></td><td class="td1" style="width:33%"></td><td class="td2" style="width:33%"></td>';
            $("#" + tableId + "  tr").append($td);
            for (var i = 0, arr0 = "", arr1 = "", arr2 = ""; i < arr.length; i++) {
                var x = i % 3;
                switch (x) {
                    case 0:
                        arr0 += arr[i];
                        break;
                    case 1:
                        arr1 += arr[i];
                        break;
                    case 2:
                        arr2 += arr[i];
                        break;
                }
            }
            $("#" + tableId + " .td0").html(arr0);
            $("#" + tableId + " .td1").html(arr1);
            $("#" + tableId + " .td2").html(arr2);
        }
        if (n == 2) {
            var $td = '<td class="td0" style="width:46%"></td><td class="td1" style="width:46%"></td>';
            $("#" + tableId + "  tr").append($td);
            for (var i = 0, arr0 = "", arr1 = ""; i < arr.length; i++) {
                var x = i % 2;
                switch (x) {
                    case 0:
                        arr0 += arr[i];
                        break;
                    case 1:
                        arr1 += arr[i];
                        break;
                }
            }
            $("#" + tableId + " .td0").html(arr0);
            $("#" + tableId + " .td1").html(arr1);
        }
       
    }

    //creatTable("p1", parentHtml(SendWorkInfo));

    
    /*************模块展开收起*******************/
    var $allboxChangeBtn = $("#change-btn");

    //右上角大的按钮
    $allboxChangeBtn.on("click", function (event) {
        event.stopPropagation();

        var $boxList = $(".detail-inner-container dl");
        var $sboxChangeBtn = $(".detail-inner-container dt span:last-child");
        if ($(this).attr("class") == "all-up") {
            $boxList.children("dd").hide();
            $sboxChangeBtn.attr("class", "up down");
            $(this).attr("class", "all-down");
        } else {
            $boxList.children("dd").show();
            $sboxChangeBtn.attr("class", "up");
            $(this).attr("class", "all-up");
        }

    });

    //小模块的展开收起按钮
    $(".work-container").on("click", ".detail-inner-container  span:last-child", function (event) {
        event.stopPropagation();

        $(this).toggleClass("down");
        $(this).parent().parent().children("dd").toggle(200);
    })



    /************************************************************************************/
    /****页面加载时发送请求???获取职位相关信息并生成对应的标签***********/

    var tableCols = 3; //生成多少列，可取值2或3
   
    ajaxRequest("../Modules/Platform/Handlers/WorkGuide.ashx?Action=WorkGuid_GetStationInfo",
        "", "json", function (data) {

            var obj = new Function('return ' + data.Data)();
            var obj1 = new Function('return ' + data.Others)();

            //alert(obj.DefaultIndex)
            var defaultIndex = obj.DefaultIndex;

            creatStationTab(obj.StationInfo,obj.Mode);

            //职位tab切换
            var $positionTabBtn = $(".position-name li");
            //1.当页面加载时吧默认职位标签激活
            $positionTabBtn.eq(defaultIndex).addClass("active");
            //2.并显示对应的职位列表
            $(".detail-inner-container>table").hide();
            var firstPosition = $positionTabBtn.eq(defaultIndex).attr("name");
            creatTable(firstPosition, parentHtml(obj1), tableCols);
            $("#" + firstPosition).show();          
        
        });   
   
    /**********************点击标签时****************************************/
    $(".work-container").on("click", ".position-name li", function (event) {

        event.stopPropagation();
        var $positionTabBtn = $(".position-name li");

        $(".search-container").hide();
        $(".detail-inner-container").show();
        var positionName = $(this).attr("name");

        //标签样式变化
        $positionTabBtn.removeClass("active");
        $(this).addClass("active");


        //判断当前标签对应的table是否存在
        if ($("#" + positionName).length != 0) {
            //如果存在就显示
            $(".detail-inner-container>table").hide();
            $("#" + positionName).show();

        } else {
            //如果不存在 1.隐藏其他table列表
            $(".detail-inner-container>table").hide();

            //2.生成table列表
            var $tableContainer = '<table id="' + positionName + '"><tr><td class="td0"></td><td class="td1"></td><td class="td2"></td></tr></table>';
            $(".detail-inner-container").append($tableContainer);
        }

        /**发送异步请求获取SendWorkInfo*/
        $("#" + positionName + " tr").html("");  //先清空原有的数据
       
        ajaxRequest("../Modules/Platform/Handlers/WorkGuide.ashx?Action=WorkGuid_GetWorkInfo", "StationID="+positionName, "json", function (data) {
            creatTable(positionName, parentHtml(data), tableCols);  //创建新的数据
        });

        ////3.显示生成的新列表
        $("#" + positionName).show();
       

    }); //点击标签结束   

    


    /***********************搜索按钮的功能************************/
    $(".search-btn").click(function (event) {
        event.stopPropagation();

        var sValue = $(".search input").val();
        $(".search-results ul").html("");

        if (sValue == $(".search input").attr('placeholder')) {
            sValue = "";
        };

        if (sValue && sValue.length > 0) {
            $(".detail-inner-container").hide();
            $(".search-container").show();

            $(".search-title>span").html(sValue);
            var activePosition = $(".position-name .active").attr("name");
            var r = 0;
            $("#" + activePosition + " a").each(function () {
                var $seachText = $(this).text();

                if ($seachText.toLowerCase().indexOf(sValue.toLowerCase()) != -1) {                   
                    $(".search-results ul").append('<li></li>');
                    $(".search-results ul li:last-child").append($(this).clone()).append('<b class="viewflow" style="display:none" title="流程预览"></b>');
                    r = 1;
                }
            });
            if (r == 0) {
                $(".search-results ul").append("<li>没有搜索到相关内容。</li>");
            }
        } else {
            alert("请输入要搜索的名称！")
        }

    });
   
       $(".search input").keydown(function (event) {
            if (event.keyCode == "13") {
                $('.search-btn').click();
            }
        });
   
    
    $(".search input").on("mousedown", function (event) {
        event.stopPropagation();       
    })


    /***********************关闭按钮***************************/
    function closeWork() {
        $(".work-outer-container").css({
            "width": "70%",
            "height": "86%",
            "top": "0",
            "left":"230px"
        });
        $(".search-container").hide();
        $(".detail-inner-container").show();
        $(".search input").val("")
        $(".work-outer-container").hide(500);
        $(".mask").remove();
    }
    $(".close").on("click", closeWork);
    $("body").on("click", closeWork);
 
    /***********************点击列表项打开新窗口***************************/
    function requestWork(url, flowID, type,sId) {
        //var stationID = window["CreateStationID"] || getParamValue("StationID");
        sId && (url = addUrlParam(url, "StationID", sId));
        (type == 1) && (url = addUrlParam(url, "FlowID", flowID));
        (type == 2) && (url = addUrlParam(url, "FormID", flowID));
        url = addUrlParam(url, "JQID", "");

        //(parent && parent.closeGuide) && parent.closeGuide();
        openWindow("../" + url, 0, 0);
    }

    $(".work-outer-container").on("click", function (event) {
        event.stopPropagation();
    })

    $(".detail-container").on("click", "a", function () {
        //var stationId = $(this).parents("table").attr("id");
        //处理搜索后取不到岗位的问题
        var tables = $(this).parents(".detail-container").find("table");
        for (var i = 0; i < tables.length; i++) {
            if (tables.get(i).style.display !== "none") {
                var stationId = tables.eq(i).attr("id");
                break;
            }
        }
        var type = $(this).attr("type");
        var flowId = $(this).attr("flowid");
        var aurl = $(this).attr("url");

       
        closeWork();
        requestWork(aurl, flowId, type, stationId);              
        //window.open(url, '发起工作', 'height=715, width=980, top=50, left=300, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
    })

    /*************************显示流程图**********************************/   
    $(".detail-container").on("mouseover", "a", function () {
        $(".viewflow").hide();
        $(this).next(".viewflow").show();
        
    });
    $(".detail-container").on("click", ".viewflow", function () {
        //var stationId = $(this).parents("table").attr("id");
        var stationId = $(".position-name li.active").attr("name");
        //var type = $(this).parents("table").attr("mode");
        var type = $(this).parent().children("a").attr("type");
        var flowId = $(this).parent().children("a").attr("flowid");
        //var aurl = $(this).attr("url");

        var url = "../Common/Personal/VFlowPreview.aspx?FID=" + flowId + "&Type=" + type + "&StationID=" + stationId;
         openWindow(url, 800, 600);
    })

    
    /******************右下角缩小放大div*************************/  
    var onmove = false;
    $(".right-bottom").on("mousedown", function (event) {
        event.stopPropagation();
        onmove = true;
    });

    //#control
    $(document).on("mousemove", function (e) {
        var x = e.pageX;
        var y = e.pageY;
        if (onmove) {
            changeTo($(".work-outer-container"), x, y);
        }
    }).on("mouseup", function () {
        onmove = false;
    });

    function changeTo($obj, x, y) {
        var top = $obj.offset().top;
        var left = $obj.offset().left;
        var height = (y - top) < 290 ? 290 : (y - top);
        var width = (x - left)<450?450:(x-left);       
        $obj.css({ height: height + "px", width: width + "px" });        
    }

    /***********************拖拽移动事件***********************************/
    $(".header-title").on("mousedown", fnDown)

    function fnDown(event) {
        event = event || window.event;
        var oDrag = $(".work-outer-container")[0],
        // 光标按下时光标和面板之间的距离
            disX = event.clientX - oDrag.offsetLeft,
            disY = event.clientY - oDrag.offsetTop;
        // 移动
        document.onmousemove = function (event) {
            event = event || window.event;
            fnMove(event, disX, disY);
        }
        // 释放鼠标
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }

    function fnMove(e, posX, posY) {
        var oDrag = $(".work-outer-container")[0],
            l = e.clientX - posX,
            t = e.clientY - posY,
            winW = document.documentElement.clientWidth || document.body.clientWidth,
            winH = document.documentElement.clientHeight || document.body.clientHeight,
            maxW = winW - oDrag.offsetWidth - 10,
            maxH = winH - oDrag.offsetHeight+10;
        if (l < 0) {
            l = 0;
        }
        else if (l > maxW) {
            l = maxW;
        }
        if (t < 0) {
            t = 10;
        } else if (t > maxH) {
            t = maxH;
        }
        oDrag.style.left = l + 'px';
        oDrag.style.top = t + 'px';
    }


    $(".work-outer-container").css({
        "left": ($(document).width() - $(".work-outer-container").width()) / 2 + "px"
    })

});









