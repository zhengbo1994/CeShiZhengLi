var ScrollTime = 10000;
function setTab(name, cursel) {
	cursel_0=cursel;
	for(var i=1; i<=links_len; i++){
		var menu = document.getElementById(name+i);
		var menudiv = document.getElementById("con_"+name+"_"+i);
		if(i==cursel){
			menu.className="off";
			menudiv.style.display="block";
		}
		else{
			menu.className="";
			menudiv.style.display="none";
		}
	}
}
function Next(){                                                        
	cursel_0++;
	if (cursel_0>links_len)cursel_0=1
	setTab(name_0,cursel_0);
} 
var name_0='one';
var cursel_0=1;
//循环周期，可任意更改（毫秒）
var links_len,iIntervalId;
onload=function(){
	var links = document.getElementById("tab1").getElementsByTagName('li')
	links_len=links.length;
	for(var i=0; i<links_len; i++){
		links[i].onmouseover=function(){
			clearInterval(iIntervalId);
			this.onmouseout=function(){
				iIntervalId = setInterval(Next,ScrollTime);;
			}
		}
	}
	document.getElementById("con_"+name_0+"_"+links_len).parentNode.onmouseover=function(){
		clearInterval(iIntervalId);
		this.onmouseout=function(){
			iIntervalId = setInterval(Next,ScrollTime);;
		}
	}
	setTab(name_0,cursel_0);
	iIntervalId = setInterval(Next,ScrollTime);
}




$(function(){
	$(".lanrenzhijia .tab a").click(function(){
		$(this).addClass('on').siblings().removeClass('on');
		var index = $(this).index();
		number = index;
		$('.lanrenzhijia .content li').hide();
		$('.lanrenzhijia .content li:eq('+index+')').show();
	});
	
	var auto = 1;  //等于1则自动切换，其他任意数字则不自动切换
	if(auto ==1){
		var number = 0;
		var maxNumber = $('.lanrenzhijia .tab a').length;
		function autotab(){
			number++;
			number == maxNumber? number = 0 : number;
			$('.lanrenzhijia .tab a:eq('+number+')').addClass('on').siblings().removeClass('on');
			$('.lanrenzhijia .content ul li:eq('+number+')').show().siblings().hide();
		}
		
		//鼠标悬停暂停切换
		$('.lanrenzhijia').mouseover(function(){
			//clearInterval(tabChange);
		});
		$('.lanrenzhijia').mouseout(function(){
			
		});
	  }
});










