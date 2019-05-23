/*
Office印章类别使用到的JS
作者：程镇彪
日期：2012-07-03
*/
//条件搜索
function reloadData()
{
    
    if (getObj("ddlCorp"))
    {
        var corpID = getObj("ddlCorp").value;
        $('#dgData').getGridParam('postData').CorpID = corpID;
    }
    
    if (getObj("ddlOSTName"))
    {
        var type = getObj("ddlOSTName").value;
        $('#dgData').getGridParam('postData').OSTID = type;
    }
    var sKey = getObj("txtKey").value;
    
    $('#dgData').getGridParam('postData').Key = sKey;
    refreshJQGrid('dgData');
}
//添加
function addVOfficeSeal()
{
    if (getObj("ddlCorp") && getObj("ddlCorp").value == "")
    {
        return alertMsg("请选择公司。", getObj("ddlCorp"));
    }
    if (getObj("ddlOSTName") && getObj("ddlOSTName").value == "")
    {
        return alertMsg("请选择印章类别。", getObj("ddlOSTName"));
    }
    openAddWindow("VOfficeSealAdd.aspx?CorpID=" + $("#ddlCorp").val() + "&OSTID=" + $("#ddlOSTName").val(), 800, 600, "dgData");   
}

//编辑
function editVOfficeSeal()
{
    var CorpID = getJQGridSelectedRowsData('dgData', false, 'CorpID');
    //    openModifyWindow("VOfficeSealEdit.aspx?CorpID=" + $("#ddlCorp").val() + "&SealType=" + $("#hidSealType").val(), 800, 600, "dgData");
    openModifyWindow("VOfficeSealEdit.aspx?CorpID=" + CorpID + "&SealType=" + $("#hidSealType").val(), 800, 600, "dgData");
}

//删除

function deleteVOfficeSeal()
{
    openDeleteWindow("OfficeSeal", 0, "dgData");
}

//浏览
var renderName = function (value, pt, record)
{
    var vUrl = "'VOfficeSealBrowse.aspx?ID=" + pt.rowId + "&OSTName=" + record[2] +"'";
    return '<div ><a href="javascript:void(0)" onclick="javascript:openWindow(' + vUrl + ',0,0)">' + value + '</div>';
}

function validateSizeAdd()
{
    if (!validateSize())
    {
        return false;
    }
//    if (!CheckInput(true)) return false;
   
    var obj = getObj("signfile");
    obj.select();
    var signfile = document.selection.createRange().text;

    if ((signfile == '') || (undefined == typeof (signfile)))
    {
        handleBtn(true);
        return alertMsg('请选择用来创建印章的原始文件(bmp,gif,jpg)。', getObj('signfile'));
    }
    if ((-1 == signfile.toUpperCase().lastIndexOf("BMP")) &&
	    	    (-1 == signfile.toUpperCase().lastIndexOf("GIF")) &&
	    	    (-1 == signfile.toUpperCase().lastIndexOf("JPG")))
    {
        handleBtn(true);
        return alertMsg('请选择一个正确的印章原始文件(bmp,gif,jpg)。', getObj('signfile'));

    }
    //    var OSTName = getObj("ddlOSTName").options[getObj("ddlOSTName").selectedIndex].text;
//        alert(getObj("hidPath").value + OSTName + "\\" + getObj("txtOSName").value + ".doc");
    //保存印章文件  
    if (savetourl())
    {
        return true;
    }
    else
    {
        handleBtn(true);
        return false;
    }

}

function validateSizeEdit()
{
    if (!validateSize())
    {
        return false;
    }
    var obj = getObj("signfile");
    obj.select();
    var signfile = document.selection.createRange().text;

    if ((signfile == ''))
    {
//        alert(111);
        return true;
    }
    if ((-1 == signfile.toUpperCase().lastIndexOf("BMP")) &&
	    	    (-1 == signfile.toUpperCase().lastIndexOf("GIF")) &&
	    	    (-1 == signfile.toUpperCase().lastIndexOf("JPG")))
    {
        handleBtn(true);
        return alertMsg('请选择一个正确的印章原始文件(bmp,gif,jpg)。', getObj('signfile'));

    }
    //    var OSTName = getObj("ddlOSTName").options[getObj("ddlOSTName").selectedIndex].text;
    //    alert(getObj("hidPath").value + OSTName + "\\" + getObj("txtOSName").value + ".doc");
    //保存印章文件  
    if (savetourl())
    {
        return true;
    }
    else
    {
        handleBtn(true);
        return false;
    }

}


function validateSize() 
{
    handleBtn(false);
    if (getObj("ddlOSTName") && getObj("ddlOSTName").value == "")
    {
        handleBtn(true);
        return alertMsg("请选择印章类别。", getObj("ddlOSTName"));        
    }
   
    var signname = document.all("txtOSName").value;
    if ((signname == '') || (undefined == typeof (signname)))
    {
        handleBtn(true);
        return alertMsg('请输入印章名称。', getObj('txtOSName'));
    }
    var password = document.all("txtOSPWD").value;
    if ((password == '') || (undefined == typeof (password)))
    {
        handleBtn(true);
        return alertMsg('请输入印章口令。', getObj('txtOSPWD'));
    }
    if ((password.length < 6) || (password.length > 32))
    {
        handleBtn(true);
        return alertMsg('印章口令必须是6-32位。', getObj('txtOSPWD'));
    }
    if (!isPositiveInt(getObj("txtRowNo").value))
    {
        handleBtn(true);
        return alertMsg('行号必须为正整数。', getObj('txtRowNo'));
    }
   
    if (getObj("hidOSPWD").value != "" && getObj("txtOSPWD").value != "" && getObj("hidOSPWD").value != getObj("txtOSPWD").value)
    { 
        if (confirm("您修改了印章密码，需要重新生成印章。\n确认要这样吗？"))
        {            
            if (!CreateNew())
            {
                handleBtn(true);
                return false;              
            }
        }
        else
        {
//            alert(111);
            getObj("txtOSPWD").value = getObj("hidOSPWD").value;
        }
    }

    return true;
       
}




function handleBtn(enabled) {
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}


//检查用户输入。参数IsNewSign标志是新建还是修改印章。新建的时候需要
//检查用户是否选择了印章原始文件。
function CheckSeal()
{
//    var signname = document.all("txtOSName").value;
//    if ((signname == '') || (undefined == typeof (signname)))
//    {
////        document.selection.clear();
//        return alertMsg('请输入印章名称。', getObj('txtOSName'));
//    }


    var password = document.all("txtOSPWD").value;
    if ((password == '') || (undefined == typeof (password)))
    {
//        document.selection.clear();      
        return alertMsg('请输入印章口令。', getObj('txtOSPWD'));
    }
    if ((password.length < 6) || (password.length > 32))
    {
      //  document.selection.clear();
        return alertMsg('印章口令必须是6-32位。', getObj('txtOSPWD'));
    }
    return true;
}


function CheckInput(IsNewSign)
{
    var obj = getObj("signfile");
    obj.select();
//    var signname = document.all("txtOSName").value;
//    if(( signname=='') ||( undefined == typeof(signname)))
//    {
//       document.selection.clear();  
//        alert('请输入印章名称');
//        return false;
//    }    

//        
//    var password = document.all("txtOSPWD").value;
//    if(( password=='') ||( undefined == typeof(password)))
//    {
//        document.selection.clear();  
//        alert('请输入印章口令');
//        return false;
//    }
//    if( (password.length<6) || (password.length>32))
//    {
//        document.selection.clear();  
//        alert('印章口令必须是6-32位.');
//        return false;
//    } 
    if(IsNewSign == true) //如果是创建印章，需要用户选择原始印章文件
    {
//        alert("chuangjian");
//        var obj = getObj("signfile");
//        obj.select();
        var signfile = document.selection.createRange().text;

	    if(( signfile=='') ||( undefined == typeof(signfile)))
	    {
	     //   document.selection.clear();  
	        alert('请选择用来创建印章的原始文件(bmp,gif,jpg)。');
	        return false;
	    }
	    if( (-1 == signfile.toUpperCase().lastIndexOf("BMP")) &&
	    	(-1 == signfile.toUpperCase().lastIndexOf("GIF")) &&
	    	(-1 == signfile.toUpperCase().lastIndexOf("JPG")) )
	    {
	    //    document.selection.clear();  
	        alert('请选择一个正确的印章原始文件(bmp,gif,jpg)。');
	        return false;
	    }
	}
	
	var ntkosignctl = getObj("ntkosignctl");
    ntkosignctl.SignName = document.all("txtOSName").value;
    if(0 != ntkosignctl.StatusCode)
    {
      //  document.selection.clear();  
        alert("设置印章名称错误。");
    	return false;
 }

    ntkosignctl.Password = document.all("txtOSPWD").value;
    if(0 != ntkosignctl.StatusCode)
    {
    //    document.selection.clear();  
        alert("设置印章口令错误。");
    	return false;
    }
 
    return true;
}
//生成新印章文件
function CreateNew()
{
    var ntkosignctl = getObj("ntkosignctl");

    if (!CheckInput(true)) return false;

    var obj = getObj("signfile");
    obj.select();
    var signfile = document.selection.createRange().text;
//        alert(signfile);
    ntkosignctl.CreateNew(
    			"SAP",
    			"SAP",//document.all("SignUser").value,
    			document.all("txtOSPWD").value,
    			signfile
    );
    ntkosignctl.IsShowStatus = 0;
    ntkosignctl.IsShowRect = 0;
    if(0 != ntkosignctl.StatusCode)
    {
        document.selection.clear();
        alert("创建印章文件错误。");
	    return false;
	}
//	getObj("hidOSName").value = document.all("txtOSName").value;
	getObj("hidOSPWD").value = document.all("txtOSPWD").value;
	return true;
//    alert("创建印章成功.您现在可以插入EKEY,并点击'保存印章到EKEY'将创建的印章保存到EKEY.");
}

//function EditCreateSeal()
//{

//    var ntkosignctl = getObj("ntkosignctl");

//    alert(ntkosignctl.StatusCode);
//    if (getObj("hidOSName").value != "" && getObj("txtOSName").value != "" && getObj("hidOSName").value != getObj("txtOSName").value && 0 == ntkosignctl.StatusCode)
//    { 
//    if (confirm("您修改了印章名称，印章文件将被清空，需要重新生成印章。\n确认要这样吗？"))
//            {

//                ntkosignctl.Delete();
//               // getObj("hidOSName").value != ""//清空
//            }
//    }
//}

//function OpenFromLocal()
//{
//    ntkosignctl.OpenFromLocal('',true);
//    ShowSignInfo();
//}

function savetourl(signname, password)
{
    var signname = document.all("txtOSName").value;
    var password = document.all("txtOSPWD").value;
    //在后台，可以根据上传文件的inputname是否为"SIGNFILE"来判断
    var ntkosignctl = getObj("ntkosignctl");   
    
        ntkosignctl.SignName = signname;
        ntkosignctl.SignUser = "SAP";
        ntkosignctl.PassWord = password;
//            alert(signname);
//        SaveToURL方法保存印章文件
//        alert(getObj("hidsignname").value);
        var retStr = ntkosignctl.SaveToURL("../../Common/Doc/EspSave.aspx?signname=" + getObj("hidsignname").value, "EDITFILE", "", signname);
    
      
    return true;

}



/* 切换公司加载印章类别 */
function resetOfficeSealType()
{

    var corpID = getObj("ddlCorp").value;
    $.ajax(
        {
            url: "FillData.ashx",
            data: { action: "GetOfficeSealTypeByCorpID", CorpID: corpID },
            dataType: "json",
            success: loadOfficeSeal,
            error: ajaxError
        });
}

// 印章类别
function loadOfficeSeal(data, textStatus)
{

    var ddlOSTName = getObj("ddlOSTName");
    for (var i = ddlOSTName.length - 1; i > 0; i--)
    {
        ddlOSTName.remove(i);
    }

    if (data.Count > 0)
    {
        //        var iFirstCnt = data.Nodes[0].Outline.split(".").length;
        for (var i = 0; i < data.Count; i++)
        {
            var opt = document.createElement("OPTION");
            opt.value = data.Nodes[i].ID;
            opt.text = data.Nodes[i].Name;
            ddlOSTName.add(opt, ddlOSTName.length);
        }
    }

    reloadData();
}




function openSelectAllowDept()
{
    var corpID = $('#hidCorpID').val();
    var vValue;

    vValue = openModalWindow('../../Common/Select/VSelectMultiDept.aspx?Aim=AllowDept&CorpID=' + corpID, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        getObj("hidAllowDeptID").value = vValue.split('|')[0];
        getObj("txtAllowDept").value = vValue.split('|')[1];
    }
}

function openSelectAllowStation()
{
    var corpID = $('#hidCorpID').val();
    var vValue;
    vValue = openModalWindow('../../Common/Select/VSelectMultiStation.aspx?Aim=AllowStation&CorpID=' + corpID, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {                 
        getObj("hidAllowStationID").value = vValue.split('|')[0];
        getObj("txtAllowStation").value = vValue.split('|')[1];
          
    }
}