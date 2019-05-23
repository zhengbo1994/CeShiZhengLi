/************************************* Javascript Library **************************
* Using jQuery 1.4.1
* Using Common/idcore.js 
* Create by dee on 2012-8-16

* Table规范：  type="DetailTable"  //必须
*               xdatasrc="......"         //获取数据源地址

* Column规范： 
*              <thead><tr>表头部分</tr></thead>
*              <tbody>
*                  <tr class='dg_row' isadd='true' style="display: none" fpropname="temptr">   //规范
*                    模板行部分
*                  </tr>
*              </tbody>

* 验证规范： 
控件内必填： xxrequired="true"  
正则： reg="\d+"


*Table初始化方式：
        var tbContractUnitObj;
        $(document).ready(function ()
        {
            tbContractUnitObj = $("#TBContractUnit").IDDetailTable();
            tbContractUnitObj.Initial();
        });


*保存前Table验证调用方式：
        if (!ValidateTable.ValidateAllTable()) {
        return false;
        }

*扩展函数(要重写)：
行事件添加前：$.fn.BeforeTRAdd
行事件添加后：$.fn.AfterTRAdd
（反序列化）添加行事件后，控件数据初始化前：$.fn.BeforeTRDataInit
（反序列化）添加行事件后，控件数据初始化前：$.fn.AfterTRDataInit
*******************************************************************************************/
(function ($)
{
    $.fn.IDDetailTable = function ()
    {
        var _rxc = $.idc;
        var options = {};
        var TableID = "";
        var RowId = 0;
        var thisTable = this;
        var currentTable = this; //add by wujj 2013-08-21 暂时解决方案，用于保留模板声明的全局变更（如tbOffsetReimburseBill等)
        var tableObj;    //获取当前全局变更 如  tbContractUnitObj = $("#TBContractUnit").IDDetailTable();

        _initial = function (tbObj, eventObj)
        {
            // debugger;
            var _settings = $.extend(true, { url: null, xmlns: null, checkbox: false, hiddenControlID: 'hidJson_' + tbObj.id }, _rxc.getvar($(tbObj).attr("initial")));
            options = _settings || {};
            TableID = "#" + tbObj.id;
            RowId = 1;
            currentTable = eventObj;//add by wujj 2013-08-21 暂时解决方案，用于保留模板声明的全局变更（如tbOffsetReimburseBill等)

            var addBtn = $(TableID + "BtnAdd");
            if (addBtn.length != 0)
            {
                addBtn.unbind("click");
                addBtn.bind("click", { tableid: tbObj.id }, AddRow);
            }

            var hidJsonValue = $("#" + options.hiddenControlID).val();
            if (hidJsonValue != "")
            {
                DeSerialize(eval(hidJsonValue), true);
                return;
            }

            var xdatasrc = $(tbObj).attr("xdatasrc");
            if (xdatasrc && xdatasrc != null && xdatasrc != "")
            {
                //ajax初始化数据源
                $.ajax({
                    url: $(tbObj).attr("xdatasrc"),
                    async: false,
                    contentType: "text/json; charset=\"utf-8\"",
                    data: null,
                    dataType: 'json',
                    type: "POST",
                    success: function (getJson, textStatus, jqXHR)
                    {
                        //debugger;
                        DeSerialize(getJson, true);
                    },
                    error: function (xml, jqXHR, textStatus, errorThrown)
                    {
                        //debugger;
                        $.idc.error(textStatus + ":\r\n\r\n  " + jqXHR.status + "-->" + jqXHR.statusText + "[错误编码：XD1100F012.请与管理员联系！]");
                    }

                });
            }
        };
        AddRow = function (obj)
        {
            var tableid = obj.data.tableid;
            ResetCurrentTableVar(tableid, this); //重置变量


            if (typeof $.fn.GetTableObj == "function")
            {
                tableObj = $.fn.GetTableObj(TableID.substring(1));
            }
            if (tableObj && typeof tableObj.BeforeTRAdd == "function")
            {
                var bfRlt = tableObj.BeforeTRAdd(TableID.substring(1));
                if (bfRlt == false)
                {
                    return;
                }
            }
                //添加前事件
            else if (typeof $.fn.BeforeTRAdd == "function")
            {
                var bfRlt = $.fn.BeforeTRAdd(TableID.substring(1));
                if (bfRlt == false)
                {
                    return;
                }
            }

            var tr = $("<tr class='dg_row'  isadd='true'>" + $(TableID + " [fpropname='temptr']tr:first").html() + "</tr>");
            var dnmcRowId = generateId();
            tr.attr("id", dnmcRowId);
            tr.attr("align", "center");
            tr.html(tr.html().replace(/_index_/g, RowId).replace(/%dnmcRowId%/g, dnmcRowId));

            //赋初始值
            $("[fpropname]", tr).each(function ()
            {
                var cell = $(this);

                if (cell.attr("type") == "checkbox")
                {
                    cell.attr("checked", cell.attr("dValue"));
                }
                else if (cell.attr("type") == "label" || cell.attr("tagname") == "LABEL" || cell.attr("tagname") == "A")
                {
                    cell.text(cell.attr("dValue"));
                    cell.attr("title", cell.attr("dValue"));
                }
                else
                { cell.val(cell.attr("dValue")); }

                if (cell.attr("fpropname") == "deleteBtn")
                {
                    cell.bind("click", DelRow);
                }
            });

            if (options.numColumn)
            {
                $("[fpropname='" + options.numColumn + "']", tr).text($(TableID + " tr[fpropname='dataRow']").length + 1);
            }
            tr.attr("fpropname", "dataRow");
            tr.show();
            $(TableID + ">tbody").append(tr);

            RowId++;

            if (options.onNewRow) { options.onNewRow(tr); }

            //add by dinghuan @2012-12-25
            //添加tr后事件，控件数据初始化后
            // edit by wujj  @2013-07-29
            if (tableObj && typeof tableObj.AfterTRAdd == "function")
            {
                tableObj.AfterTRAdd(TableID.substring(1), dnmcRowId);
            }
            else if (typeof $.fn.AfterTRAdd == "function")
            {
                $.fn.AfterTRAdd(TableID.substring(1), dnmcRowId);
            }
        };
        //根据一行的xml得到的json对象创建动态表格
        Add1Row = function (row)
        {
            if (typeof $.fn.GetTableObj == "function")
            {
                tableObj = $.fn.GetTableObj(TableID.substring(1));
            }
            //debugger;
            var tr = $("<tr class='MyRow'  isadd='false'>" + $(TableID + " [fpropname='temptr']tr:first").html() + "</tr>");
            var dnmcRowId = row.id;
            if (dnmcRowId == '' || dnmcRowId == undefined)
            {
                dnmcRowId = generateId();
            }
            tr.attr("id", dnmcRowId);
            tr.attr("align", "center");
            tr.html(tr.html().replace(/_index_/g, RowId).replace(/%dnmcRowId%/g, dnmcRowId));

            $("[fpropname]", tr).each(function ()
            {
                var cell = $(this);
                if (cell.attr("fpropname") == "deleteBtn")
                {
                    cell.bind("click", DelRow);
                }
            });

            //            $(TableID).append(tr);
            $(TableID + ">tbody").append(tr); //已添加Html

            RowId++;

            if (tableObj && typeof tableObj.BeforeTRDataInit == "function")
            {
                tableObj.BeforeTRDataInit(tr);
            }
                //添加tr后事件，控件数据初始化前
            else if (typeof $.fn.BeforeTRDataInit == "function")
            {
                $.fn.BeforeTRDataInit(tr);
            }

            for (key in row)
            {
                if (row[key] == null)//!row[key] ||  modify by dinghuan @2013-02-28 此判断条件导致当数据为0时，值变空
                {
                    row[key] = "";
                }
                var cellCtol = $("[fpropname=" + key + "]", tr);
                try
                {
                    if (cellCtol.attr("type") == "checkbox" || cellCtol.attr("type") == "radio")
                    {
                        if (row[key] == "true" || row[key] == "1" || row[key] == "Y") cellCtol.attr("checked", "true");
                        else cellCtol.removeAttr("checked");
                    }
                    else if (cellCtol.attr("type") == "select")
                    {
                        var option = new Array();
                        option = decodeURI(row[key]).split(";");
                        cellCtol.val(option[0]);

                        var initDataChange = cellCtol.attr("initDataChange");
                        if (initDataChange == undefined || initDataChange == null || initDataChange == "true")
                        {
                            cellCtol.change();
                        }
                    }
                    else if (cellCtol.attr("type") == "label" || cellCtol.attr("tagname") == "LABEL" || cellCtol.attr("tagname") == "A" || cellCtol.attr("tagname") == "span")
                    {
                        if (decodeURI(row[key]) == 'true')
                        {
                            cellCtol.html(decodeURI("是"))
                        }
                        else if (decodeURI(row[key]) == 'false')
                        {
                            cellCtol.html(decodeURI("否"))
                        }
                        else
                        {
                            //增加HTML转义功能,以满足有HTML的内容
                            cellCtol.html(DeHTMLCode(decodeURI(row[key])));
                            cellCtol.attr("title", DeHTMLCode(decodeURI(row[key])));
                        }
                        if (cellCtol.attr("tagname") == "A")
                        {
                            //增加HTML转义功能,以满足有HTML的内容
                            //cellCtol.html(decodeURI(row[key]));
                            //用A标签的TEXT绑定HREF属性，如有需要可以统一
                            //modify by dinghuan @2013-06-21 取消用Text绑定Herf，修改为JavaScript:void();
                            cellCtol.attr("href", "JavaScript:void();");//DeHTMLCode(decodeURI(row[key]))
                        }
                    }
                    else
                    {
                        if (decodeURI(row[key]) == 'true')
                        {
                            cellCtol.val(decodeURI("是"));
                        }
                        else if (decodeURI(row[key]) == 'false')
                        {
                            cellCtol.val(decodeURI("否"));
                        }
                        else
                        {
                            //增加HTML转义功能,以满足有HTML的内容
                            cellCtol.val(DeHTMLCode(decodeURI(row[key])));
                        }
                    }//if
                }catch(e)  //增加try catch 处理解码%错误的异常 肖勇彬 暂时如此处理 20160122
                {
                    cellCtol.val(row[key]);
                }
            } //for

            //add by dinghuan @2012-12-25
            //添加tr后事件，控件数据初始化后
            // edit by wujj  @2013-07-29
            if (tableObj && typeof tableObj.AfterTRDataInit == "function")
            {
                tableObj.AfterTRDataInit(tr);
            }
            else if (currentTable && typeof currentTable.AfterTRDataInit == "function")
            {
                currentTable.AfterTRDataInit(tr);
            }
                //兼容以前做的， 
            else if (typeof $.fn.AfterTRDataInit == "function")
            {
                $.fn.AfterTRDataInit(tr);
            }

            if (options.numColumn)
            {
                $("[fpropname='" + options.numColumn + "']", tr).text(
			$(TableID + " tr[fpropname='dataRow']").length + 1);
            }

            tr.attr("fpropname", "dataRow");
            if (options.onNewRow) { options.onNewRow(tr); }
            tr.show();
        };

        DelRow = function ()
        {
            //debugger;

            if (typeof $.fn.GetTableObj == "function")
            {
                tableObj = $.fn.GetTableObj(TableID.substring(1));
            }

            var $sender = $(this); //$(event.srcElement);
            $sender.attr("id", "deletingRow");
            var detailTable = $sender.closest('[type="DetailTable"]');
            //ResetCurrentTableVar(detailTable.attr("id"), this); //重置变量

            var method = options;
            if (method.beforeDeleteRow) { method.beforeDeleteRow(); }
            else if (tableObj && typeof tableObj.BeforeTRDel == "function")
            {
                tableObj.BeforeTRDel(detailTable.attr("id"), $sender.parent().parent());
            }
            else if (typeof $.fn.BeforeTRDel == "function")
            {
                //modify by dinghuan @2013-03-01 为删除前方法加上参数，指向被删除的行对象
                $.fn.BeforeTRDel(detailTable.attr("id"), $sender.parent().parent());
            }

            $("tr:has(#deletingRow):last").remove();
            if (method.afterDeleteRow) { method.afterDeleteRow(); }

                //添加tr后事件，控件数据初始化后
                // edit by wujj  @2013-07-29
            else if (tableObj && typeof tableObj.AfterTRDel == "function")
            {
                tableObj.AfterTRDel(detailTable.attr("id"), $sender.parent().parent());
            }
            else if (currentTable && typeof currentTable.AfterTRDel == "function")
            {
                currentTable.AfterTRDel(detailTable.attr("id"), $sender.parent().parent());
            }
            else if (typeof $.fn.AfterTRDel == "function")
            {
                //modify by dinghuan @2013-03-01 为删除后方法加上参数，指向被删除的行对象
                $.fn.AfterTRDel(detailTable.attr("id"), $sender.parent().parent());
            }
            if (options.numColumn)
            {
                ResetNumberColumn();
            }
            return false;
        };

        //生成一个随即ID
        generateId = function ()
        {
            var id = "detailTableRow" + Math.random().toString().replace(".", "");
            while ($("#" + id).length != 0)
            {
                id = "detailTableRow" + Math.random().toString().replace(".", "");
            }
            return id;
        };
        ResetNumberColumn = function ()
        {
            $("td[fpropname='" + options.numColumn + "']", $(TableID))
		        .each(function (i)
		        {
		            this.innerHTML = i;
		        })
        };

        ResetCurrentTableVar = function (tableId, currentObj)
        {
            var _settings = $.extend(true, { url: null, xmlns: null, checkbox: false }, _rxc.getvar($("#" + tableId).attr("initial")));
            options = _settings || {};
            TableID = "#" + tableId;
            currentTable = currentObj;//add by wujj 2013-08-21 暂时解决方案，用于保留模板声明的全局变更（如tbOffsetReimburseBill等)
        };

        //将动态表格中的控件序列化为一个JsonString值
        Serialize = function ()
        {
            //debugger;
            var rows = $("#" + TableID + " tr[fpropname='dataRow']");
            if (rows.length < 1)
            {
                //                $(this.HiddenId).val("");
                return "";
            }
            var s = [];
            rows.each(function ()
            {
                var tr = $(this);
                var jsonStr = {};
                $("[fpropname]", tr).each(function ()
                {
                    var cell = $(this);
                    if (cell.attr("fpropname") == "deleteBtn")
                    {
                        return;
                    }
                    if (cell.attr("datatype") = "date")
                    {
                        jsonStr[cell.attr("fpropname")] = cell.val() == "" ? "1900-01-01" : cell.val();
                    }
                    else if (cell.attr("type") == "checkbox" || cell.attr("type") == "radio")
                    {
                        var tmValue = cell.attr("checked") ? "Y" : "N";
                        jsonStr[cell.attr("fpropname")] = tmValue;
                    }
                    else if (cell.attr("type") == "select")
                    {
                        jsonStr[cell.attr("fpropname")] = $.trim(cell.val());
                        if (cell.attr("fpropnamename") && cell.attr("fpropnamename") != null)
                        {
                            jsonStr[cell.attr("fpropname")] = cell.find("option:selected").text();
                        }
                    }
                    else if (cell.attr("type") == "label" || cell.attr("tagname") == "LABEL" || cell.attr("tagname") == "A")
                    {
                        jsonStr[cell.attr("fpropname")] = EnHTMLCode(cell.html());
                    }
                    else
                    {
                        jsonStr[cell.attr("fpropname")] = EnHTMLCode(cell.val());
                    }
                });

                s.push(jsonStr);
            });
            return $.jsonToString(s);
            //            $(this.HiddenId).val(s);
        };

        //将JsonString字符串反序列化为动态表格中的控件并设置值
        DeSerialize = function (getJson, ClearBeforeAdd)
        {
            //debugger;
            var tr, kv, cellCtol, tagName;
            if (ClearBeforeAdd && ClearBeforeAdd == true)
            {
                $(TableID + " [fpropname='dataRow']tr").each(function () { $(this).remove(); });
            }
            //            var rows = $.xml2json($(this.HiddenId).val());


            if (getJson == undefined || getJson == null)
            {
                //                AddRow();
                return;
            }
            if (getJson.length == 0)
            {
                //                Add1Row(getJson);
                return;
            }
            //            this.RowsCount = rows.row.length;
            //            RowId = 0;
            //            for (var i = 0; i < this.RowsCount; i++) { Add1Row(rows.row[i]); }

            $(getJson).each(function ()
            {
                Add1Row(this);
            });
        };

        //对HTML字符进行转义
        EnHTMLCode = function (str)
        {
            //  &lt;            <        小于号  
            //  &gt;            >        大于号 
            //  &amp;           &        和  
            //  &apos;          '         单引号 
            //  &quot;          "         双引号 

            var ret = str;
            if (typeof ret == "string")
            {
                ret = ret.replace(/&/g, "&amp;");
                ret = ret.replace(/</g, "&lt;");
                ret = ret.replace(/>/g, "&gt;");
                ret = ret.replace(/'/g, "&apos;");
                ret = ret.replace(/\"/g, "&quot;");
                ret = ret.replace(/%/g, "%25");
            }
            return ret;
        };

        //对HTML字符进行反转义
        DeHTMLCode = function (str)
        {
            var ret = str;
            if (typeof ret == "string")
            {
                ret = ret.replace(/&lt;/g, "<");
                ret = ret.replace(/&gt;/g, ">");
                ret = ret.replace(/&apos;/g, "'");
                ret = ret.replace(/&quot;/g, "\"");
                ret = ret.replace(/&amp;/g, "&");
                ret = ret.replace(/%25/g, "%");
            }
            return ret;
        };

        //        arguments.callee.TestFN = function ()
        //        {
        //            alert(TableID);
        //        };

        this.TestFN = function ()
        {
            alert(TableID);
            AddRow({ data: { tableid: TableID.substring(1) } });
        };

        this.AddMoreItem = function (getJson)
        {
            if ($(this).attr("id"))
            {
                ResetCurrentTableVar($(this).attr("id"), this);
            }
            DeSerialize(getJson, false);
        };

        this.DelMoreItem = function ()
        {
            if ($(this).attr("id"))
            {
                ResetCurrentTableVar($(this).attr("id"), this);
            }
            DelRow();
        }

        this.Initial = function ()
        {
            var eventObj = this;
            thisTable.each(function (index)
            {
                _initial(this, eventObj);
            });
        };

        return this;
    };
})(jQuery);

ConvertTable = {
    CheckDisabledTable: function (TableID)
    {
        TableID = "#" + TableID;
        var tbCollpse = $(TableID).closest('[type=datalist]');
        if (tbCollpse.attr("disabled"))
        {
            $(TableID + "BtnAdd").hide();
            $(TableID + "BtnDlt").hide();
            //            $("td", $(TableID)).attr("disabled", "disabled");
            ConvertTable.DisabledChildren($(TableID)[0], true);
        }
    },
    CheckDisabledAllTable: function ()
    {
        $('table[type="DetailTable"]').each(function ()
        {
            ConvertTable.CheckDisabledTable(this.id);
        });
    },
    DisabledChildren: function (el, dis)
    {
        if (window.$)
        {
            var $el = $(el);
            $el.attr("disabled", dis);
            if (dis != undefined && dis != null && dis)
            {
                $el.attr("onclick", "");
                $el.unbind("onclick");
            }
            $el.children().each(function ()
            {
                $(this).attr("disabled", dis);
                ConvertTable.DisabledChildren(this, dis);
            });
        }
    },
    GetSerializeJson: function (TableID, hidJsonID)
    {
        if (!ValidateTable.Validate(TableID))
        {
            return false;
        }
        //debugger;
        var s = [];
        var rows = $("#" + TableID + " tr[fpropname='dataRow']");
        if (rows.length < 1)
        {
            //                $(this.HiddenId).val("");
            //当没有数据行时，应把隐藏域的值赋空
            //modify by wujj @2013-08-16
            if (hidJsonID && hidJsonID != null)
            {
                $("#" + hidJsonID).val($.jsonToString(s));
            }
            else
            {
                $('#hidJson_' + TableID).val($.jsonToString(s));
            }
            return "";
        }

        rows.each(function ()
        {
            var tr = $(this);
            var jsonStr = {};
            $("[fpropname]", tr).each(function ()
            {
                var cell = $(this);
                if (cell.attr("fpropname") == "deleteBtn")
                {
                    return;
                }
                if (cell.attr("type") == "checkbox" || cell.attr("type") == "radio")
                {
                    var tmValue = cell.attr("checked") ? "Y" : "N";
                    jsonStr[cell.attr("fpropname")] = tmValue;
                }
                else if (cell.attr("type") == "select")
                {
                    jsonStr[cell.attr("fpropname")] = cell.find("option:selected").val(); //modify by dinghuan @2013-05-14 此语句引起JS bug，且不清楚此语句意义，暂且注释。
                    if (cell.attr("fpropnamename") && cell.attr("fpropnamename") != null)
                    {
                        jsonStr[cell.attr("fpropname")] = cell.find("option:selected").text();
                    }
                }
                else if (cell.attr("type") == "label" || cell.attr("tagname") == "LABEL" || cell.attr("tagname") == "A")
                {
                    jsonStr[cell.attr("fpropname")] = (cell.html());
                }
                else
                {
                    if ((cell.attr("datatype") == "int" || cell.attr("datatype") == "double" || cell.attr("datatype") == "float") && cell.val() == "")
                    {
                        jsonStr[cell.attr("fpropname")] = "0";
                    }
                    else if (cell.attr("datatype") == "date")
                    {
                        jsonStr[cell.attr("fpropname")] = cell.val() == "" ? "1900-01-01" : cell.val();
                    }
                    else
                    {
                        jsonStr[cell.attr("fpropname")] = cell.val();
                    }
                }
            });
            s.push(jsonStr);
        });

        var jsonStr = $.jsonToString(s);
        if (hidJsonID && hidJsonID != null)
        {
            $("#" + hidJsonID).val(jsonStr);
        }
        else
        {
            $('#hidJson_' + TableID).val(jsonStr);
        }
        return jsonStr;
    }
}

ValidateTable = {
    ValidateAllTable: function ()
    {
        var vliRet = true;
        $('table[type="DetailTable"]').each(function ()
        {
            vliRet = ValidateTable.Validate($(this).attr("id"));
            if (!vliRet)
            {
                return false;
            }
        });
        return vliRet;
    },
    Validate: function (TableID)
    {
        var valiRlt = true;
        var pointFlagTitle = "";
        var pointFlagValue = "";
        var errorMessage = "";
        $("#" + TableID + " [fpropname='dataRow']tr").each(
            function ()
            {
                pointFlagObj = $(this).find("[ispointflag=true]").eq(0);
                pointFlagTitle = pointFlagObj.attr("pointflagtitle");
                if (pointFlagObj.attr("type") == "checkbox" || pointFlagObj.attr("type") == "radio")
                {
                    var tmValue = cell.attr("checked") ? "Y" : "N";
                    pointFlagValue = tmValue;
                }
                else if (pointFlagObj.attr("type") == "select")
                {
                    //jsonStr[pointFlagObj.attr("fpropname")] = $.trim(pointFlagObj.val()); modify by dinghuan @2013-05-14 此语句引起JS bug，且不清楚此语句意义，暂且注释。
                    if (pointFlagObj.attr("fpropnamename") && pointFlagObj.attr("fpropnamename") != null)
                    {
                        pointFlagValue = pointFlagObj.find("option:selected").text();
                    }
                }
                else if (pointFlagObj.attr("type") == "label" || pointFlagObj.attr("tagname") == "LABEL" || pointFlagObj.attr("tagname") == "A")
                {
                    pointFlagValue = pointFlagObj.html();
                }
                else
                {
                    if ((pointFlagObj.attr("datatype") == "int" || pointFlagObj.attr("datatype") == "double" || pointFlagObj.attr("datatype") == "float") && pointFlagObj.val() == "")
                    {
                        pointFlagValue = "0";
                    }
                    else
                    {
                        pointFlagValue = pointFlagObj.val();
                    }
                }
                $(this).find('input').each(function ()
                {
                    var ctlValidate = validObj(this);
                    if (!ctlValidate)
                    {
                        valiRlt = false;
                        //modify by dinghuan @2013-07-05 将return改为return false，验证失败马上跳出判断。
                        return false; //跳出input循环
                    }
                });
                if (!valiRlt)
                {
                    return false;   //跳出tr循环
                }

                $(this).find('textarea').each(function ()
                {
                    var ctlValidate = validObj(this);
                    if (!ctlValidate)
                    {
                        valiRlt = false;
                        //modify by dinghuan @2013-07-05 将return改为return false，验证失败马上跳出判断。
                        return false; //跳出textarea循环
                    }
                });
                if (!valiRlt)
                {
                    return false;   //跳出tr循环
                }

                $(this).find('select').each(function ()
                {
                    if ($(this).attr("type") == "select")
                    {
                        if ($(this).attr("xxrequired") == "true")
                        {
                            if (this.item(this.selectedIndex).value == "" || this.item(this.selectedIndex).value == null)
                            {
                                errorMessage += $(this).attr("title") + "不能为空！\n";
                                valiRlt = false;
                                //modify by dinghuan @2013-07-05 将return改为return false，验证失败马上跳出判断。
                                return false; //跳出 select 循环
                            }
                        }
                    }
                });
                if (!valiRlt)
                {
                    return false;   //跳出tr循环
                }
            }
        );
        if (!valiRlt)
        {
            if (errorMessage.length > 1)
            {
                if (typeof (pointFlagValue) != "undefined" && pointFlagValue != null && pointFlagValue.length > 0)
                {
                    errorMessage = "‘" + pointFlagValue + "’\n" + errorMessage;
                    if (typeof (pointFlagTitle) != "undefined" && pointFlagTitle != null && pointFlagTitle.length > 0)
                        errorMessage = pointFlagTitle + "：" + errorMessage;
                }
                alert(errorMessage.substr(0, errorMessage.length - 1));
            }
            return valiRlt;
        }
        return valiRlt;
        //  modify by dinghuan @2013-07-05 修改明细判断方式，出错一个直接跳出(原来是记录所有出错信息一起弹出)
        //        $("#" + TableID + " [fpropname='dataRow']tr").find('input').each(function ()
        //        {
        //            var ctlValidate = validObj(this);
        //            if (!ctlValidate)
        //            {
        //                valiRlt = false;
        //                return false; //modify by dinghuan @2013-07-05 将return改为return false，验证失败马上跳出判断。
        //            }
        //        });

        //        if (!valiRlt)
        //        {
        //            if (errorMessage.length > 3)
        //            {
        //                alert(errorMessage.substr(0, errorMessage.length - 1));
        //            }
        //            return valiRlt;
        //        }
        //        $("#" + TableID + " [fpropname='dataRow']tr").find('select').each(function ()
        //        {
        //            if ($(this).attr("type") == "select")
        //            {
        //                if ($(this).attr("xxrequired") == "true")
        //                {
        //                    if (this.item(this.selectedIndex).value == "" || this.item(this.selectedIndex).value == null)
        //                    {
        //                        //                        alert($(this).attr("title") + "是必选项！");
        //                        errorMessage += $(this).attr("title") + "不能为空！\n";
        //                        valiRlt = false;
        //                        return false; //modify by dinghuan @2013-07-05 将return改为return false，验证失败马上跳出判断。
        //                    }
        //                }
        //            }
        //        });

        //        if (errorMessage.length > 1)
        //        {
        //            alert(errorMessage.substr(0, errorMessage.length - 1));
        //        }
        //        return valiRlt;

        //验证正则表达式
        function validReg(obj)
        {
            var regStr = $(obj).attr("reg");
            if (regStr != null && regStr != "" && regStr != "undefined")
            {
                val = $(obj).attr("value").match(regStr);
                if (val == null)
                {
                    //                    alert($(obj).attr("title") + "值输入格式不正确！");
                    errorMessage += $(obj).attr("title") + "值输入格式不正确！\n";
                    return false;
                }
            }
            return true;
        };

        //验证控件
        function validObj(obj)
        {
            var result = true;
            if ($(obj).attr("type") == "text")
            {
                if ($(obj).attr("xxrequired") == "true")
                {
                    if ($(obj).attr("value") == "" || $(obj).attr("value") == null)
                    {
                        //                        alert($(obj).attr("title") + "是必填项！");
                        errorMessage += $(obj).attr("title") + "不能为空！\n";
                        result = false;
                    }
                }
                if (result)
                {
                    result = validReg(obj);
                }
            }
            if ($(obj).attr("type") == "checkbox")
            {
                if ($(obj).attr("xxrequired") == "true")
                {
                    if ($(obj).attr("checked") == "" || $(obj).attr("checked") == null)
                    {
                        //                        alert($(obj).attr("title") + "是必选项！");
                        errorMessage += $(obj).attr("title") + "不能为空！\n";
                        result = false;
                    }
                }
            }
            if ($(obj).attr("type") == "radio")
            {
                if ($(obj).attr("xxrequired") == "true")
                {
                    if ($(obj).attr("checked") == "" || $(obj).attr("checked") == null)
                    {
                        //                        alert($(obj).attr("title") + "是必选项！");
                        errorMessage += $(obj).attr("title") + "不能为空！\n";
                        result = false;
                    }
                }
            }
            if ($(obj).attr("type") == "hidden")
            {
                if ($(obj).attr("xxrequired") == "true")
                {
                    if ($(obj).attr("value") == "" || $(obj).attr("value") == null)
                    {
                        //                        alert($(obj).attr("title") + "是必填项！");
                        errorMessage += $(obj).attr("title") + "不能为空！\n";
                        result = false;
                    }
                }
            }
            return result;
        }

        return valiRlt;
    }
}
