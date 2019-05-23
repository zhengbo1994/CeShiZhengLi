;(function($){
	$.fn.mySlider = function( opt ) {
		var defaults = {
				speed: 500,
                switchTime:3,
				direction: 'left', //  运动方向 可选 left,top
				prevClass: 'slider-prev',
				nextClass: 'slider-next',
				wrapperClass: 'slider-wrapper',
				moveClass: 'slider-move',
                itemTitleClass: 'slider-title'
		};
		
		var options = $.extend( defaults, opt );
		var dir = options.direction;
		var $slider = $( this ),
			$wrapper = $( '.' + options.wrapperClass, $slider ),
			$sliderPrev = $( '.' + options.prevClass, $slider ),
			$sliderNext = $( '.' + options.nextClass, $slider ),
			$sliderMove = $( '.' + options.moveClass, $slider ),
            $sliderTitle=$('.'+options.titleClass, $slider),
			$item = $sliderMove.children(),
			timeid = null;

		//初始化样式
		if( dir == 'left' ) {
			var $iSteep = $item.outerWidth();
			$sliderMove.css('width',$item.length * $iSteep +'px' );
		} 
		else if( dir == 'top' ) {
			var $iSteep = $item.outerHeight();
			$sliderMove.css('height',$item.length * $iSteep +'px' );
		};

        $sliderTitle.html($sliderMove.children().first().find(":input").val());
		//添加点击事件
		$sliderNext.bind('click',movePrev);
		$sliderPrev.bind('click',moveNext);

        //自动滚动
        if($item.length > 1)
        {
            timeid = setInterval(function () { movePrev(); }, defaults.switchTime * 1000);
            $wrapper.hover(function () { clearInterval(timeid); }, function () { timeid = setInterval(function () { movePrev(); }, defaults.switchTime * 1000); });
		}

		//缓存运动样式
		var data1 = {}, data2 = {};
		data1[dir] = -$iSteep;
		data2[dir] = 0;

		//运动样式函数
		function moveNext(){
			var $curItem = $sliderMove.css( dir,-$iSteep+'px').children().last().prependTo( $sliderMove );
			$sliderMove.animate(data2,  options.speed);
            $sliderTitle.html($curItem.find(":input").val());
            var $img = $curItem.find("img");

            if($img.length == 1)
            {
                if(!$img[0].src && $curItem[0].img)
                {
                    $img[0].src = $curItem[0].img;
                }
            }
		};

		function movePrev(){
			$sliderMove.animate( data1,  options.speed, function(){
				$sliderMove.css( dir, 0 ).children().first().appendTo( $sliderMove );
                var $curItem = $sliderMove.children().first();
                $sliderTitle.html($curItem.find(":input").val());

                var $img = $curItem.find("img");
                if($img.length == 1)
                {
                    if(!$img[0].src && $curItem[0].img)
                    {
                        $img[0].src = $curItem[0].img;
                    }
                }
			});
		};

		return this; //返回当前对象,保证可链式操作
	}
})(jQuery);
