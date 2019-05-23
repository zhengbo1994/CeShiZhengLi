jsPlumb.importDefaults({
    DragOptions: { cursor: 'pointer', zIndex: 2000 },
    HoverClass: 'connector-hover',
    ConnectionsDetachable: false,
    ReattachConnections: false
});

var connectorStrokeColor = 'rgba(50, 50, 200, 1)',
    connectorHighlightStrokeColor = 'rgba(180, 180, 200, 1)',
    hoverPaintStyle = { strokeStyle: '#7ec3d9' };

//在两个元素之间创建连接
function buildConnection(sourceID, targetID)
{
    jsPlumb.connect({
        source: sourceID,
        target: targetID,
        paintStyle: {
            lineWidth: 0,
            strokeStyle: "gray",
            outlineColor: '#666',
            outlineWidth: 1
        },
        hoverPaintStyle: hoverPaintStyle,
        anchor: 'AutoDefault',
        endpoint: 'Blank'
    });
}

//组合形成进度图
function buildLineMap(bFromPortal,containerID)
{
    if (!containerID)
    {
        containerID = 'lineMapContainer';
    }

    var container = $('#' + containerID);

    jsPlumb.reset();

    //设置每个元素之间的默认间隔。
    var firstPX = 200;

    //获取页面所有元素中的最大TOP值（用于设置外层容器的高度)
    //                    最小TOP值（用于进行元素向上编移，以免出现大片空白）
    var maxTop = 0, minTop = 15;

    
    // $('#' + containerID + ' [taskpoint]').each(function (i, task)
    $('[taskpoint]', container).each(function (i, task)
    {
        //设置每一个元素的坐标
        var _this_ = $(this);
        
        var leftPx = parseFloat(_this_.css('left'));
        var topPx = parseFloat(_this_.css('top'));

        //最大TOP值
        if (maxTop == 0 || topPx > maxTop)
        {
            maxTop = topPx;
        }

        //最小TOP值
        if (minTop == 15 || minTop > topPx)
        {
            minTop = topPx;
        }

        if (leftPx == 0)
        {
            //第一个元素如果未设置，则默认靠左20像素处。
            //其它元素如果未设置，则未认从其左边元素右移200像素
            _this_.css('left', i == 0 ? '20px' : (firstPX + 'px'));
            firstPX = (i == 0 ? firstPX : (firstPX + 200));
        }
        
    }).hover(function ()
    {
        var _this_ = $(this);
        _this_.css({ 'width': '15px', 'height': '15px', 'background-position-x': '0px' });
        $('span', _this_).css({ 'font-size': '15px' });
        //buildTip(_this_);
    }, function ()
    {
        var _this_ = $(this);
        _this_.css({ 'width': '13px', 'height': '13px', 'background-position-x': '-15px' });
        $('span', _this_).css({ 'font-size': '12px' });
        //$('#tip').fadeOut("slow").remove();
    }).each(function (i, task)
    {
        var _this_ = $(this);
        var rowIndex = parseInt(_this_.attr('rowindex'));
        var selfID = 'WBS_' + rowIndex;
        var prevID = 'WBS_' + (rowIndex - 1);
        var nextID = 'WBS_' + (rowIndex + 1);
        var wbsState = _this_.attr('wbsstate');

        if (wbsState == '1')
        {
            _this_.css({ 'background-image': 'url(/' + rootUrl + '/image/station.gif)' });
        }
        else
        {
            _this_.css({ 'background-image': 'url(/' + rootUrl + '/image/station.png)' });
        }

        //只有最小TOP值大于15个像素时，才需要进行整体位移
        if (minTop > 15)
        {
            var topPx = parseFloat(_this_.css('top'));
            _this_.css('top', (topPx - (minTop - 15)));
        }
        
        //为前后元素创建连接
        if ($('#' + prevID).length == 1)
        {
            buildConnection(prevID, selfID);
        }

        if ($('#' + nextID).length == 1)
        {
            buildConnection(selfID, nextID);
        }
    });

    //设置外层容器的高度    
    //if ($('#' + containerID).length == 1)
    if (container.length==1)
    {
        if (minTop > 15)
        {
            maxTop = maxTop - (minTop - 15);
        }
        // $('#lineMapContainer').css({ 'height': maxTop + 100 });
        container.css({ 'height': maxTop + 100 });
    }

    //门户中的进度图不允许拖动
    if (!bFromPortal)
    {
        jsPlumb.draggable(jsPlumb.getSelector("[taskpoint]"));
    }
}
