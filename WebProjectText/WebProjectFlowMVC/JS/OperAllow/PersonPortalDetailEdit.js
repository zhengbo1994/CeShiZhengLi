// JScript 文件
 jQuery(function($) {
        switch($('#hidType').val())
        {
           case "1":
              $('#tddetail4').hide();
              $('#tddetail5').hide();
              break;
          case "2" :   
              $('#tddetail1').hide();
              $('#tddetail2').hide();
              $('#tddetail3').hide();
               break;
          case "3":   
              $('#tddetail6').hide(); 
               break;
           case "4":
              $('#tddetail4').hide();
              $('#tddetail5').hide();
              $('#tddetail6').hide();
               break;
           case "5":
              $('#tddetail1').hide();
              $('#tddetail2').hide();
              $('#tddetail3').hide();
              $('#tddetail6').hide();
               break;
           case "6":
              $('#tddetail1').hide();
              $('#tddetail2').hide();
              $('#tddetail3').hide();
              $('#tddetail4').hide();
              $('#tddetail5').hide();
               break;
        }
        $.each($('#hidAddUrl').val().split('|'),function(i,n){
             var values=n.split(',');
             pageUrlTo(values[0],values[1],values[2]);
        });
       
     });
     function btnDelete_onclick(obj,PPDIDValue)
     {
         $(obj).parentsUntil('div').remove();
           $.post('FillData.ashx',{action:'DeletePPDID',PPDID:PPDIDValue},function (data, textStatus){},'json');
     }
      function pageUrlTo(strUrl,strSCNO,PPDID)
      {
     
        var insertContent = " <div style=\"width:100%;\"><table class=\"idtb\">"
        +"<tr><td>"
        + " <button id=\"btnEdit1\" Text=\"修改\" OnClick=\"EditDetail('"+PPDID+"')\" onmouseout=\"setIDBtn1(this,0)\" onmouseover=\"setIDBtn1(this,1)\" onfocus=\"this.blur()\" class=\"btnsmall\"><span class='btntext'>修改</span></button>"
        +" <button id=\"btnDelete1\" Text=\"删除\" OnClick=\"btnDelete_onclick(this,'"+PPDID+"')\" onmouseout=\"setIDBtn1(this,0)\" onmouseover=\"setIDBtn1(this,1)\" onfocus=\"this.blur()\" class=\"btnsmall\"><span class='btntext'>删除</span></button></td></tr>"
        +" <tr>"
        + "<td >"
        +"<iframe id=\"framShow"+PPDID+"\" marginwidth=\"0\" marginheight=\"0\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling='No' src=\""+strUrl+"\"></iframe>"
        + "</td>"
        + "</tr>"
        + "</table></div>";
        $("#tdframe"+strSCNO).append(insertContent);
      
      }
      function changeFrame(strUrl,PPDID)
      {
           $('#framShow'+PPDID).attr('src',strUrl);
      }
      function EditDetail(PPDID)
      {
         openWindow("VPersonPortalDetailChange.aspx?PPDID="+PPDID,500,200);
      }
     function ValidateSize()
     {
        if(getObj("txtTitle").value=="")
        {
            return alertMsg("门户模板名称不能为空。",getObj("txtTitle"));
        }
        return true;
     }
     function openCondition(SCNO)
     {
        var ppid=getObj("hidPPID").value;
        openWindow("VPersonPortalDetailAdd.aspx?PPId="+ppid+"&SCNO="+SCNO,500,200);
     }
