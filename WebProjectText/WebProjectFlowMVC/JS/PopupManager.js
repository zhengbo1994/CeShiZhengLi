//createPopup 管理

/**构造一个窗口
*@param id 窗口ID,仅用于标识。
*@param width 弹出窗口的宽度
*@param height 弹出窗口的高度
*@param caption 窗口标题
*@param message 窗口显示内容(html)
*@param win 窗口依附于哪里，可为空，为空时，以windows为标准依附
*/
function Popup(id,width,height,caption,message,win)
{ 
    this.id      = id; 
    this.caption = caption; 
    this.message = message; 
    this.width   = width ? width  : 200; 
    this.height  = height? height : 120; 
    this.win     = win;
    this.speed   = 10;		//显示速度
    this.step    = 2;		//显示步长
    this.right   = screen.availWidth;	
    this.bottom  = screen.availHeight;	
    this.left    = this.right - this.width;
    this.top     = this.bottom - this.height;    
    this.showTime = 15000;  //显示时间（默认为15秒)
    this.pause   = false;
    this.close   = false;
    this.closeByBtn = false;  //是否是按钮触发的关闭
} 

Popup.prototype.createBody=function()
{
    var str  = [];
    str.push("<div style='width: " + this.width + "px;position:absolute;top:0px;height: " + this.height + "px;background-color:#c9d3f3'>" );
    str.push("<table class='idtbfix index_msg_border' style='height:100%'><tr><td class='index_msg_header'>" );
    str.push("<table class='idtbfix' style='height:100%'><tr>");
    str.push("<td>" + this.caption + "</td><td class='index_msg_close' id='btSysClose'></td>");
    str.push("</tr></table>") ;
    str.push("</td></tr><tr><td class='idtd index_msg_info'><div class='index_msg_info_div'>");
    str.push(this.message);
    str.push("</div>" );
    str.push("</td>" );
    str.push("</tr>" );
    str.push("</table>");
    str.push("</div>");
    
    return str.join('');    
}

/** 窗口关闭的回调方法 */
Popup.prototype.closeCallbacks=[];
Popup.prototype.toggleClose=function()
{
    for(var i=0;i<this.closeCallbacks.length;i++)
    {
        this.closeCallbacks[i] && this.closeCallbacks[i](this);
    }
    this.closeCallbacks=[];
}

/** 隐藏消息方法  */
Popup.prototype.hide = function()
{     
    var offset  = this.height>this.bottom-this.top?this.height:this.bottom-this.top;
    var me  = this;  
    if(this.timer>0)
    {  
        window.clearInterval(me.timer); 
        window.clearTimeout(me.timer); 
    } 

    var fun = function()
    { 
        if(me.pause==false||me.close)
        {
            var x  = me.left;
            var y  = 0;
            var width = me.width;
            var height = 0;
            if(me.offset>0)
            {
                height = me.offset;
            }

            y  = me.bottom - height;

            if(y>=me.bottom)
            {
                window.clearInterval(me.timer);                 
                window.clearTimeout(me.timer); 
                me.toggleClose();     //对外提供的回调接口
                me.Pop.hide(); 
            } 
            else 
            {
                me.offset = me.offset - me.step; 
            }   
            if(me.win)
            {
                me.Pop.show(x,y,width,height,me.win);    
            }
            else
            {
                me.Pop.show(x,y,width,height);    
            }
        }            
    }  
    
    this.timer = window.setInterval(fun,this.speed);
} 

/**  窗口显示方法 */
Popup.prototype.show = function(){ 

    var oPopup = window.createPopup();   
     
    for (var i = 0; i < document.styleSheets.length; i++)
    {
        if (document.styleSheets[i].href)
        {
            oPopup.document.createStyleSheet().addImport(document.styleSheets[i].href);
        }
    } 
    
    this.Pop = oPopup; 
   
    oPopup.document.body.innerHTML = this.createBody();   
 
    this.offset  = 0;
    var me  = this; 

    oPopup.document.oncontextmenu = function() { return false; };
    oPopup.document.body.onmouseover = function(){me.pause=true;}
    oPopup.document.body.onmouseout = function(){me.pause=false;}

		//渐显
    var fun = function()
    { 
        var x  = me.left;
        var y  = 0;
        var width    = me.width;
        var height    = me.height;
 
        if(me.offset>me.height)
        {
            height = me.height;
        } 
        else 
        {
            height = me.offset;
        }
 
        y  = me.bottom - me.offset;
        if(y<=me.top)  
        {
            window.clearInterval(me.timer); 
            me.timer = window.setTimeout(function(){
                me.hide(); 
            },parseFloat(me.showTime));
        } 
        else 
        {
            me.offset = me.offset + me.step;
        }
        if(me.win)
        {
            me.Pop.show(x,y,width,height,me.win);    
        }
        else
        {
            me.Pop.show(x,y,width,height);    
        }
    } 
 
    this.timer = window.setInterval(fun,this.speed);     
  
    var btClose = oPopup.document.getElementById("btSysClose");  
    btClose.onclick = function()
    { 
        me.close = true;     
        me.closeByBtn=true;   
        me.hide(); 
    }   
} 
/** 设置速度方法(数值越大，速度越慢) */
Popup.prototype.speed = function(s){
    var t = 20;
    try 
    {
        t = praseInt(s);
    } catch(e){}
    this.speed = t;
}

/** 设置显示或隐藏的步长 */
Popup.prototype.step = function(s){
    var t = 1;
    try
    {
        t = praseInt(s);
    } catch(e){}
    this.step = t;
}
 
/**  重新指定窗口相对于父元素的位置 */
Popup.prototype.rect = function(left,right,top,bottom)
{
    try 
    {
        this.left   = left  !=null ? left : (this.right-this.width);
        this.right  = right !=null ? right : (this.left +this.width);
        this.bottom = bottom!=null ? (bottom>screen.height ? screen.height : bottom) : screen.height;
        this.top    = top   !=null ? top : (this.bottom - this.height);
    } catch(e){}
}