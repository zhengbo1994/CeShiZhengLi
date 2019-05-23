$(document).ready(function ()
{
    //初始化价税类型（当为政府规费时隐藏）
    initValoremType();
});

//保存票据数据
function savaNoteType()
{
    if (confirm("您确定保存修改的数据？"))
    {
        //保存修改数据
        var updateNoteTypes = [];
        //保存删除数据
        var deleteNoteTypes = [];
        //保存新增数据
        var insertNotyTypes = [];
        var noteTypeNames = [];
        var invalidFlag = false;     
        $("#tbData tbody tr:gt(0)").each(function (i)
        {
            var noteTypeID = $("td #hidNoteTypeID", $(this)).val();
            var noteTypeName = $("td #txtNoteTypeName", $(this)).val();
            var noteTypeNo = $("td #txtNoteTypeNo", $(this)).val();
            //var taxType = $("td #ddlTax", $(this)).val();
            //var valoremTaxType = $("td #ddlValoremTax", $(this)).val();
            var isDeduct = $("td #ckbIsDeduct", $(this)).attr("checked") ? 1 : 0;
            var isCertificate = $("td #ckbIsCertificate", $(this)).attr("checked") ? 1 : 0;
            var certificateTime = $("td #txtCertificateTime", $(this)).val();
            var rowNo = $("td #txtRowNo", $(this)).val();
            var remark = $("td #txtRemark", $(this)).val();

            var noteType =
                  {
                      NoteTypeID: noteTypeID,
                      NoteTypeName: noteTypeName,
                      NoteTypeNo: noteTypeNo,
                      //TaxType: taxType,
                      //ValoremTaxType: valoremTaxType,
                      IsDeduct:isDeduct,
                      IsCertificate:isCertificate,
                      CertificateTime:certificateTime,
                      RowNo: rowNo,
                      Remark: remark
                  };
            noteTypeNames.push(noteType);           
            //该数据(noteType)是否有效
            if (noteType.NoteTypeName != "")
            {
                //if (noteType.TaxType == "")
                //{
                //    invalidFlag = true;
                //    return alertMsg("类型名称为：" + noteType.NoteTypeName + " 的纳税类型为空，请选择。");
                //}
                ////政府规费
                //if (noteType.TaxType != governmentFee)
                //{
                //    if (noteType.ValoremTaxType == "")
                //    {
                //        invalidFlag = true;
                //        return alertMsg("类型名称为：" + noteType.NoteTypeName + " 的价税类型为空，请选择。");
                //    }
                //}
                //else
                //{
                //    noteType.ValoremTaxType == "0";
                //}
                if (noteType.RowNo == "")
                {
                    invalidFlag = true;
                    return alertMsg("类型名称为：" + noteType.NoteTypeName + " 的行号为空，请填写。");
                }
                //判断重复
                if (noteTypeNames.length > 1)
                {
                    for (var j = 0; j < noteTypeNames.length - 1; j++)
                    {
                        if (noteTypeNames[j].NoteTypeName == noteType.NoteTypeName)
                        {
                            invalidFlag = true;
                            return alertMsg("类型名称不能重复。");
                        }
                    }
                }
            }
            //判断noteType属于新增、修改、删除的集合              
            //修改(ID和名称都不为空)
            if (noteType.NoteTypeName != "" && noteType.NoteTypeID != "")
            {
                updateNoteTypes.push({
                    NoteTypeID: noteType.NoteTypeID,
                    NoteTypeName:noteType.NoteTypeName,
                    NoteTypeNo:noteType.NoteTypeNo,
                    //TaxType: noteType.TaxType,
                    ////ValoremTaxType: noteType.ValoremTaxType == "" ? "0" : noteType.ValoremTaxType,
                    //ValoremTaxType: noteType.TaxType == governmentFee ? "0" : noteType.ValoremTaxType,
                    IsDeduct: isDeduct,
                    IsCertificate: isCertificate,
                    CertificateTime: certificateTime,
                    RowNo:noteType.RowNo,
                    Remark:noteType.Remark
                });
            }
            
            //删除(ID不为空，名称为空)
            if (noteType.NoteTypeName == "" && noteType.NoteTypeID != "")
            {
                deleteNoteTypes.push({
                    NoteTypeID: noteType.NoteTypeID
                });
            }
            //新增(名称不为空，ID为空)
            if (noteType.NoteTypeName != "" && noteType.NoteTypeID == "")
            {
                insertNotyTypes.push({
                    NoteTypeID: noteType.NoteTypeID,
                    NoteTypeName: noteType.NoteTypeName,
                    NoteTypeNo: noteType.NoteTypeNo,
                    //TaxType: noteType.TaxType,
                    //ValoremTaxType: noteType.ValoremTaxType == "" ? "0" : noteType.ValoremTaxType,
                    IsDeduct: isDeduct,
                    IsCertificate: isCertificate,
                    CertificateTime: certificateTime,
                    RowNo: noteType.RowNo,
                    Remark: noteType.Remark
                });
            }
        });
        if (invalidFlag)
        {
            return;
        }
        var query =
            {
                "InsertNote": $.jsonToString(insertNotyTypes),
                "UpdateNote": $.jsonToString(updateNoteTypes),
                "DeleteNote": $.jsonToString(deleteNoteTypes)
            };      
        ajax(location.href, query, "json", function (data, status)
        {
            if (data != null)
            {
                if (data.Success == "Y")
                {
                    alertMsg(data.Data);
                    reload();
                }
                else
                {
                    alertMsg(data.Data);
                }
            }
        });
    }
}

//清空数据
function emptyNoteType(obj)
{
    if (confirm("您确定要清除此条数据？"))
    {
        $(":checkbox", $(obj).parent().parent()).removeAttr("checked");
        $(":input:visible", $(obj).parent().parent()).val("");
    }
}
//刷新
function reload()
{
    window.location.href = window.location.href;
}
function changeTax(obj)
{
    //政府规费
    if ($(obj).val() == governmentFee)
    {
        $("#ddlValoremTax", $(obj).parent().parent()).hide();
    }
    else
    {
        $("#ddlValoremTax", $(obj).parent().parent()).show();
    }
}
//初始化
function initValoremType()
{
    $("#tbData tbody tr:gt(0)").each(function (i)
    {
        //var taxType = $("td #ddlTax", $(this)).val();
        //if (taxType == governmentFee)
        //{
        //    $("#ddlValoremTax", $(this)).hide();
        //}

        //加载时，假如是否认证为否，那么认证时间为不可操作
        var isCertificate = $("td #ckbIsDeduct", $(this));
        if (!isCertificate.attr("checked")) {
            $("td #ckbIsCertificate", $(this)).attr("disabled", true);
            $("td #txtCertificateTime", $(this)).attr("readonly", "readonly");
        }
    });
}

//切换是否认证和是否抵扣的值
function CheckChange(obj) {
    var certificateTime = $(obj).closest("tr").find("#txtCertificateTime");
    if ($(obj).attr("checked")) {
        certificateTime.removeAttr("readonly");
    }
    else {
        certificateTime.attr("readonly", "readonly");
        certificateTime.val(0);
    }
    if ($(obj).attr("id") == "ckbIsCertificate")
    {
        if (!$(obj).attr("checked")) {
            var ckbIsDeduct = $(obj).closest("tr").find("#ckbIsDeduct");
            ckbIsDeduct.removeAttr("checked");
            $(obj).attr("disabled", true);
        }
    }
    else if ($(obj).attr("id") == "ckbIsDeduct") {
        var ckbIsCertificate = $(obj).closest("tr").find("#ckbIsCertificate");
        if ($(obj).attr("checked")) {
            ckbIsCertificate.attr("checked", true);
            ckbIsCertificate.attr("disabled", false);
        }
        else {
            ckbIsCertificate.attr("disabled", true);
            ckbIsCertificate.removeAttr("checked");
        }
    }
}