//核心
var Report =
 {
     IsInitialized: false,
     DesignerID: '',
     SchemeID: '',
     ClickMenuEventHandlers: {},
     //页面初始化
     Init: function (designerID, schemeID)
     {
         this.DesignerID = designerID;
         this.SchemeID = schemeID || '';
         this.IsInitialized = true;
     },
     /*
      * 验证过滤条件是否有效
      * 翁化青 2014-10-16
      * @param query json object 过滤条件对象
      */
     customCheckFilterIsValid: function(query)
     {
         return true;
     },
     //数据加载前
     OnBeforeLoadingData: function (filterParams)
     {
         return filterParams;
     },
     //数据加载
     LoadData: function ()
     {
         if (!this.IsInitialized)
         {
             return alert("未初始化");
         }

         //获取其他筛选条件
         var query = this.getDataQuery();
         // 验证过滤条件是否有效
         if (!this.customCheckFilterIsValid(query))
         {
             return false;
         }
         //加载数据
         this.OnLoadingData(query);
         return false;
     },
     //加载数据事件
     OnLoadingData: function (query)
     {           

         $("div[id=divTable]").each(
             function (i)
             {
                 var container = this;
                 var type = $(container).attr("type");
                 query.TargetID = $(container).attr("tableid");
                 switch (type)
                 {
                     case "JQGrid":                                     
                         jqGridLoadData(query, container);
                         break;
                     case "Repeater":
                         repeaterLoadData(query, container);
                         break;
                     case "TreeRepeater":
                         query.TreeFlag = true;
                         repeaterLoadData(query, container);
                         break;
                     case "TreeJQGrid":
                         query.TreeFlag = true;
                         jqGridLoadData(query, container);
                         break;
                     case "ScrollPageRepeater":
                         query.TreeFlag = true;
                         repeaterLoadDataNew(query, container);

                 }
             }
         );

         var obj = document.getElementById('framerptTest');
         if (obj!=null)
         {
             $(obj).attr('src', 'rdlreport.aspx?data=' + $.jsonToString(query));
         }
     },
     //加载数据成功后事件
     OnLoadedData: function (container, result)
     {

     },
     //加载数据失败后事件
     OnLoadDataError: function (container, result)
     {
         alertMsg(result.Message);
     },
     Export: function (obj, type)
     {
         if (type == "excel")
         {
             var query = this.getDataQuery();
             // 验证过滤条件是否有效
             if (!this.customCheckFilterIsValid(query))
             {
                 return false;
             }
             window["ExportQuery"] = query;
             var jqGridID = $("div[type='JQGrid']").attr("containerid");
             if (jqGridID)
             {
                 window["ExportQuery"].OrderBy = $.jsonToString([{ key: "SortName", value: $("#" + jqGridID).getGridParam("sortname") }, { key: "SortOrder", value: $("#" + jqGridID).getGridParam("sortorder") }]);
             }
             openWindow('Exports/VExcelExport.aspx', 350, 600); //通过模态窗口打开，edit by linshuling 20150615
         }
     },
     getDataQuery: function (enabledSchemePassFilter)
     {
         var query = { PageID: this.DesignerID, SchemeID: this.SchemeID, TargetID: null, FilterParams: null };
         var urlParams = getParams(null, null, true);
         query = mergeJsonData(query, urlParams, true);

         var params = this.OnBeforeLoadingData(getFilterParams());
         if (params.length > 0)
         {
             query.FilterParams = $.jsonToString(params);
         }
         return query;
     }
 };

function jqGridLoadData(query, container)
{
    
    if (loadJQGrid($(container).attr("containerid"), query))
    {
        $('#' + $(container).attr("containerid")).trigger('reloadGrid');
    }
}

function repeaterLoadData(query, container) {
    ajax("../CustomPage/DataHandlers/VRepeaterDataHandler.aspx",
        query,
        "json",
        function (result) {
            if (result.IsSuccess) {
                //加载数据
                container.innerHTML = result.Data.DataHTML;
                if ($(container).attr("type").indexOf("Repeater") > -1) {
                    var opts = result.Data.Columns;
                    var rowObjects = result.Data.RowValues;
                    var headRowCnt = 1;
                    $("#tbGrid>tbody>tr").each(function () {
                        $(this).find("td[formatter]").each(function () {
                            if (this.formatter && checkfunctionExists(this.formatter)) {
                                var cellValue = $(this).html();
                                var rowObject = rowObjects[this.parentNode.rowIndex - headRowCnt];
                                $(this).html(eval(this.formatter + '(cellValue,opts,rowObject)'));
                            }
                        });
                    });
                }

                // 给列表绑定事件
                try {
                    var tbGrid = $(container).find('>table')[0];
                    setTableRowAttributes(tbGrid);
                }
                catch (ex) { }

                //加载成功后
                Report.OnLoadedData(container, result);
            }
            else {
                Report.OnLoadDataError(container, result);
            }
        }
    );
}

var isScroll = true;
var _iPageIndex = 1;
function repeaterLoadDataNew(query, container)
{
    _iPageIndex = 1;
    query.PageSize = 20;
    container.scrollTop = 0;//重新请求是滚动条置顶
    ajax("../CustomPage/DataHandlers/VRepeaterDataHandlerNew.aspx",
        query,
        "json",
        function (result)
        {
            if (result.IsSuccess)
            {
                //加载数据
                container.align = "center";                
                container.innerHTML = result.Data.DataHTML;//+ '<div title="更多" id="divMorePage" style="position:fixed;bottom:0px;" class="trmfdiv_active"></div>';
                if (!getObj('divMorePage'))
                {
                    var divMorePage = document.createElement("div");
                    divMorePage.id = "divMorePage";
                    $(divMorePage).css({ "position": "fixed", "bottom": "0px" });
                    divMorePage.className = "trmfdiv";
                    $(divMorePage).mouseover(function () {
                        if (isScroll) {
                            scrollEvent(query, container);
                        }
                    }).appendTo($(container));
                }
                if ($(container).attr("type").indexOf("Repeater") > -1)
                {
                    var opts = result.Data.Columns;
                    window["opts"] = opts;
                    var rowObjects = result.Data.RowValues;                   
                    var headRowCnt = 1;
                    $("#tbGrid>tbody>tr").each(function ()
                    {
                        $(this).find("td[formatter]").each(function ()
                        {                            
                            if (this.formatter && checkfunctionExists(this.formatter))
                            {
                                var cellValue = $(this).html();
                                var rowObject = rowObjects[this.parentNode.rowIndex - headRowCnt];
                                $(this).html(eval(this.formatter + '(cellValue,opts,rowObject)'));
                            }
                        });
                    });
                }

                // 给列表绑定事件
                try
                {
                    var tbGrid = $(container).find('>table')[0];
                    setTableRowAttributes(tbGrid);
                }
                catch (ex) { }

                //加载成功后
                Report.OnLoadedData(container, result);
            }
            else
            {
                Report.OnLoadDataError(container, result);
            }
        }
    );
    //给容器绑定滚动事件
    $(container).scroll(function () {
        if (isScroll) {
            setTimeout(function () { scrollEvent(query, container); }, 1000);
            isScroll = false;
        }
    });
}

//滚动事件
function scrollEvent(query, container) {
    isScroll = true;
    var contentHeight = container.scrollHeight;//内容高度
    var viewHeight = $(container).height();//可见高度
    var scrollTop = $(container).scrollTop();//滚动高度  
    var bot = 0; //bot是底部距离的高度
    if ((bot + scrollTop) >= (contentHeight - viewHeight)) {
        //当底部基本距离+滚动的高度〉=文档的高度-窗体的高度时；
        //我们需要去异步加载数据了
        _iPageIndex = _iPageIndex + 1;
        query.PageIndex = _iPageIndex;
        query.PageSize = 20;//分页大小
        query.action = 'GetPageData';
        ajaxLoadData(query, container);
    }
}

//滚动一部加载的数据
function ajaxLoadData(query, container) {
    var iPageSize = query.PageSize;
    var iPageIndex = query.PageIndex;
    ajax("../CustomPage/DataHandlers/VRepeaterDataHandlerNew.aspx",
        query,
        "json",
        function (result) {
            if (result.IsSuccess) {
                //加载数据
                var tb = $('#tbGrid');
                var rowIndex = tb.get(0).rows.length;
                $(result.Data.DataHTML).appendTo(tb);
                //container.innerHTML = result.Data.DataHTML;
                if ($(container).attr("type").indexOf("Repeater") > -1) {
                    //var opts = result.Data.Columns;
                    var opts = window["opts"] || null;
                    var rowObjects = result.Data.RowValues;
                    var headRowCnt = 1;
                    $("#tbGrid>tbody>tr:gt(" + (rowIndex - headRowCnt) + ")").each(function () {
                        $(this).find("td[formatter]").each(function () {
                            if (this.formatter && checkfunctionExists(this.formatter)) {
                                var cellValue = $(this).html();
                                var rowObject = rowObjects[this.parentNode.rowIndex - headRowCnt - ((iPageIndex - 1) * iPageSize)];
                                $(this).html(eval(this.formatter + '(cellValue,opts,rowObject)'));
                            }
                        });
                    });
                }

                // 给列表绑定事件
                try {
                    var tbGrid = $(container).find('>table')[0];
                    setTableRowAttributes(tbGrid);
                }
                catch (ex) { }
            }
        }
    );
}

function checkfunctionExists(funcName)
{
    var checkStr = "window" + funcName.replace(/([a-zA-Z]+)/g, '["$1"]').replace('.', ''),
        typeofInput = new Function("return typeof " + checkStr)();
    return typeofInput === 'function';
}

//
function getFilterParams(enabledSchemePassFilter)
{
    var params = [];
    var jqueryFilter = "[custom_page_filter_flag=true]";
    if (enabledSchemePassFilter)
    {
        jqueryFilter += "[custom_page_filter_scheme_pass_flag=true]";
    }
    $("body").find(jqueryFilter).each(function ()
    {
        var filterControl = $(this);
        var filterKey = filterControl.attr("custom_page_filter_key").replace(/[\ \　\ ]/g, "");
        if (filterKey != "")
        {
            params.push({ key: filterKey, value: encodeURIComponent(filterControl.val().toString()) });
        }
    });
    return params;
}

function setFilter(filterValues)
{
    if (filterValues)
    {
        var jqueryFilter = "[custom_page_filter_flag=true][custom_page_filter_scheme_pass_flag=true]";
        $("body").find(jqueryFilter).each(function ()
        {
            var filterControl = $(this);
            var filterKey = filterControl.attr("custom_page_filter_key").replace(/[\ \　\ ]/g, "");
            if (filterKey != "")
            {
                for (var i = 0; i < filterValues.length; i++)
                {
                    if (filterKey == filterValues[i].key)
                    {
                        filterControl.val(decodeURIComponent(filterValues[i].value));
                    }
                }
            }
        });
    }
}
//
function queryDatas()
{       
    if (Report)
    {
        Report.LoadData();
    }
}

function getTGImg(table, rowIndex, cellIndex) {
    var row = table.rows[rowIndex];
    var img = null;
    var imgs = $("img[imgtype=tree]", $(row));
    if (imgs.length > 0) {
        img = imgs.get(imgs.length - 1);
        if (imgs.length > 1 && table.haveIco) {
            img = imgs[imgs.length - 2];
        }
    }
    return img;
}

//mergeJsonData(Report.ClickMenuEventHandlers, {
//    "SchemeID": function (key)
//    {
//        viewScheme(key);       
//    }
//}, true);

function viewScheme(key)
{
    var url = location.href,
          searchSchemeIDReg = /[?&]SchemeID=/,
          replaceSchemeIDReg = /([?&])SchemeID=.*(?=[&$])/,
          schemeIDParamIndex = url.search(searchSchemeIDReg),
          searchFilterParamsReg = /[?&]FilterParams=/,
          replaceFilterParamsReg = /([?&])FilterParams=[^&$]*/,
          filterParamIndex = url.search(searchFilterParamsReg),
          filterParams = $.jsonToString(getFilterParams(true));
    
    if (schemeIDParamIndex == -1)
    {
        url = addUrlParam(url, 'SchemeID', key);
    }
    else
    {
        url = url.replace(replaceSchemeIDReg, '$1SchemeID=' + key);
    }

    if (filterParamIndex == -1)
    {
        url = addUrlParam(url, 'FilterParams', filterParams);
    }
    else
    {
        url = url.replace(replaceFilterParamsReg, '$1FilterParams=' + filterParams);
    }

    document.location.href = url;
}



function clickMenu()
{
    var args = arguments;
    var key = args[0];

    var clickEvent = Report.ClickMenuEventHandlers ? Report.ClickMenuEventHandlers[key] : null;

    if (typeof clickEvent === 'function')
    {
        clickEvent(key);
    }

    return false;
}
