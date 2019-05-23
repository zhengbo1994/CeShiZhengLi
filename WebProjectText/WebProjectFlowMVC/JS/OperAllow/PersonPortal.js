// JScript 文件

//等所有的iframe都加载完后反填充母页的frame
function clickShow()
{
    var length=$('iframe').length;
    var k=0;
   
    parent.iFrameHeight(parent.document.getElementById("divframe"));
    parent.document.getElementById("divframe").width = parent.document.body.clientWidth;
    if (parent.document.getElementById("divframe").width<832)
    {
        parent.document.getElementById("divframe").width=832;
    }
    
    $.each($('iframe'),function(i,n){
       if(window.frames[n.id].document.readyState!= "complete")
       {
           setTimeout( "clickShow()",   100);
           return false; 
       }
       else
       {
       
          k++;
       }
   });
   if(k==length)
   {
        parent.iFrameHeight(parent.document.getElementById("divframe"));
       // $('#lia'+$('#hidDefaultIndex').val()).click();       
   }
}

function ChangeTabByType(vType)
{
   
    switch(vType)
    {
        case "1":
            $('#tddetail4').hide();
            $('#tddetail5').hide();
            $('#tr45').hide();
            break;
        case "2" :   
            $('#tddetail1').hide();
            $('#tddetail2').hide();
            $('#tddetail3').hide();
            $('#tr123').hide();
            break;
        case "3":   
            $('#tddetail6').hide(); 
            $('#tr6').hide();
            break;
        case "4":
            $('#tddetail4').hide();
            $('#tddetail5').hide();
            $('#tddetail6').hide();
            $('#tr456').hide();
            break;
        case "5":
            $('#tddetail1').hide();
            $('#tddetail2').hide();
            $('#tddetail3').hide();
            $('#tddetail6').hide();
            $('#tr45').hide();
            break;
        case "6":
            $('#tddetail1').hide();
            $('#tddetail2').hide();
            $('#tddetail3').hide();
            $('#tddetail4').hide();
            $('#tddetail5').hide();
            $('#tr123').hide();
            $('#tr45').hide();
            break;
    }
}

function pageUrlTo(strUrl,strSCNO,PPDID)
{
  
    var frameName="framShow"+PPDID
    var insertContent = "<iframe id=\""+frameName+"\" name=\""+frameName+"\"  width=\"100%\" height=\"100%\" frameborder=\"0\" src=\""+strUrl+"\" scrolling='No' onload=\"Javascript:iFrameHeight(this)\"></iframe>"
    $('#tdframe'+strSCNO).append(insertContent);
}

function showTab(index)
{
    // 调用这个方法，显示所选中的项
    selectTab(index, "TabInfo");
    $('#divframe').attr('src','VPersonPortalViewDetail.aspx?id='+$('#hidPPID').val().split(',')[index]);
    $('#divframe').attr('height','100%');
    $('#divframe').attr('width','100%');
}

function iFrameHeight(obj)
{
    var ifm=obj; 
    var subWeb = document.frames ? document.frames[obj.id].document : ifm.contentDocument; 
    if(ifm != null && subWeb != null)
    {
        if ($(subWeb.body).find('[content=content]').height() != null)
        {
            ifm.height =$(subWeb.body).find('[content=content]').height(); 
           // ifm.width=$(subWeb.body).find('[content=content]').width(); 
            
            if (ifm.id != "divframe")
            {
                ifm.width=$(subWeb.body).find('[content=content]').width(); 
            }
            else
            {
                 ifm.width=$(subWeb.body).find('[content=content]').width()-16;
                  $('#title').width($('#divMain').width());
    //            if (ifm.height>ifm.document.body.offsetHeight)
    //            {
    //                ifm.width=$(subWeb.body).find('[content=content]').width()-16;
    //            }
    //            else
    //            {
    //                ifm.width=$(subWeb.body).find('[content=content]').width();
    //            }
            }
        }
        else
        {
            $('#detail').attr('height',parent.document.body.clientHeight-30);
            $('#detail').attr('width',parent.document.body.clientWidth);
        }
    } 
}