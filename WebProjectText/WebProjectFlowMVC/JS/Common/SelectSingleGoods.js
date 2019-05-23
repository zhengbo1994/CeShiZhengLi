// JScript 文件

//行业分类选择是否为设置
//function refreshSupplier()
//{    
//    var range = document.all.ddlBusinessSort.options[document.all.ddlBusinessSort.selectedIndex].value;
//    if(range == "All" || range == "NotSet")
//    {
//        tdBusinessSort.style.display = "none";
//        tdSupplier.colSpan = 2;
//        
//        
//        $('#SupplierGrid',window.frames("Main").document).getGridParam('postData').Aim=range;
//        
//        window.frames("Main").window.reloadData();
//        //window.frames("Main").location = "VSelectSingleCOSMain.aspx?Aim=" + range;
//    }
//    else if(range == "HaveSet")
//    {   
//        tdBusinessSort.style.display = "block";
//        tdSupplier.colSpan = 1;
//        ClearBackColor();
//        try
//        {
//            $('#SupplierGrid',window.frames("Main").document).getGridParam('postData').Aim="HaveSet";
//            $('#SupplierGrid',window.frames("Main").document).getGridParam('postData').COSBSID="";
//            window.frames("Main").window.reloadData();
//            //window.frames("Main").location = "VSelectSingleCOSMain.aspx?Aim=HaveSet&COSBSID=";
//        }
//        catch(err){}
//    }
//}

//根据条件过滤记录
function reloadData()
{

    var grade=$("#ddlGrade").val();
    var level=$("#ddlLevel").val();
    var key=$("#txtKW").val();

    $("#jqGoodsGrid").getGridParam("postData").GoodsGrade=grade;
    $("#jqGoodsGrid").getGridParam("postData").GoodsLevel=level;
    $("#jqGoodsGrid").getGridParam("postData").KeyWord=key;
    
    refreshJQGrid("jqGoodsGrid");
}

 //选择
function btnChoose_Click()
{
    var gid = "";
    var gName = "";
    var showPrice1="";
    var showPrice2="";
    var showPrice3="";
    var showPrice4="";
    var showPrice5="";
   
    var priceTitle1="";
    var priceTitle2="";
    var priceTitle3="";
    var priceTitle4="";
    var priceTitle5="";
    var price1="";
    var size1="";
        
    gid = window.frames('Main').getJQGridSelectedRowsID('jqGoodsGrid', false);
    gName = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGoodsGrid', false, 'GName'));
    
    price1= $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGoodsGrid', false, 'Price1'));
    
    showPrice1 = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGoodsGrid', false, 'ShowPrice1'));
    showPrice2 = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGoodsGrid', false, 'ShowPrice2'));
    showPrice3 = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGoodsGrid', false, 'ShowPrice3'));
    showPrice4 = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGoodsGrid', false, 'ShowPrice4'));
    showPrice5 = $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGoodsGrid', false, 'ShowPrice5'));
    
    priceTitle1= $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGoodsGrid', false, 'Price1Title'));
    priceTitle2= $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGoodsGrid', false, 'Price2Title'));
    priceTitle3= $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGoodsGrid', false, 'Price3Title'));
    priceTitle4= $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGoodsGrid', false, 'Price4Title'));
    priceTitle5= $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGoodsGrid', false, 'Price5Title'));
    
    size1= $.jgrid.stripHtml(window.frames('Main').getJQGridSelectedRowsData('jqGoodsGrid', false, 'Size1'));
    
    
    
       
    if (gid == null || gName == "")
    {
        return alertMsg("请选择材料设备。", getObj("btnChoose"));    
    }    

    window.returnValue = gid + "|" + gName+"|"+price1+"|"+showPrice1+"|"+showPrice2+"|"+showPrice3+"|"+showPrice4+"|"+showPrice5+"|"+priceTitle1+"|"+priceTitle2+"|"+priceTitle3+"|"+priceTitle4+"|"+priceTitle5+"|"+size1;
   
    window.close();
    
}


//清除
function btnClear_Click()
{
    window.returnValue = "|";
    window.close();
}

//选定当前行业的供应商
//function showSupplier(cosbsID)
//{
//    $('#SupplierGrid',window.parent.frames("Main").document).getGridParam('postData').COSBSID=cosbsID;
//    $('#SupplierGrid',window.parent.frames("Main").document).getGridParam('postData').Aim='HaveSet';
//    window.parent.frames("Main").window.reloadData();

//}    

function showGoodsList(giid)
{
   
    $('#jqGoodsGrid',window.parent.frames("Main").document).getGridParam('postData').GIID=giid;
    window.parent.frames("Main").window.reloadData();

}      

function ChangeBackColor(span)
{
    var obj = document.getElementsByName("GoodsIndexName");
    for (i = 0; i < obj.length; i++)
    {
        obj(i).style.borderStyle = "";
        obj(i).style.backgroundColor = "";
    }
    span.style.backgroundColor = '#66ccff';
    span.style.borderStyle = 'solid';
    span.style.borderWidth = '1px';
    span.style.borderColor = 'green';
}


function ClearBackColor()
{
    var obj = document.getElementsByName("GoodsIndexName");
    for (i = 0; i < obj.length; i++)
    {
        obj(i).style.borderStyle = "";
        obj(i).style.backgroundColor = "";
    }        
}


////查看供应商明细
//function renderLink(cellvalue,options,rowobject)
// {
//      var url = "'VCustomerOrSupplierBrowse.aspx?COSID="+rowobject[0]+"'";
//      return '<div class="nowrap"><a  href="javascript:window.openWindow('+url+',800,600)" return false;>'+cellvalue+'</a></div>' ;
// }