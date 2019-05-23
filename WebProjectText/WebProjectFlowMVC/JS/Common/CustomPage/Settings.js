//更改页面类型改变页面地址和解析地址
var pageID = '';
var tableCaches = [{
    TableID: "默认表格", TableType: "1", TableName: "默认表格",
    RowNo: "1", ClientID: "", AreaID: "", ColumnSchemes: [],
    Pageable: true, TreeFlag: false, EnabledShowRowNumber: true,
    EnabledMultiSelect: true
}];
// 当前选中的列表中的数据方案集合
var dataSchemes = [{
    SchemeID: "默认方案", SchemeName: "默认方案",
    RowNo: "1", TableID: "默认表格", IsDefault: true, Remark: "",
    Columns: []
}];
tableCaches[0].ColumnSchemes = dataSchemes;

var filterSchemes = [{
    SchemeID: "默认方案", SchemeName: "默认方案",
    RowNo: 1, AreaID: "", IsDefault: true, Remark: "",
    Filters: []
}];

var $divContentScheme = null;
var $tdContentSchemeContainer = null;
var currentContentSchemeDialogID = '';
var dataSchemesUpdated = false;
var needRebindDataSchemeDDL = false;
var filterSchemesUpdated = false;
var needRebindFilterSchemeDDL = false;


/*-------------- 基础信息方法 ---------------*/
// 获取描述区内容
function getDescription()
{
    return $('#txtDescription').val();
}

function loadSchemesList(schemes)
{
    var tbScheme = $('#tbScheme>tbody'),
        frag = document.createDocumentFragment(),
        templateRowHtml = $("#tbTemplate").find("#trTemplateScheme").get(0).outerHTML,
        tempRowHtml, dataSchemeHTML, filterSchemeHTML, tempRow,
        tempScheme, tempSchemeGroup, tempDataScheme, tempFilterScheme;

    if (schemes && schemes.length)
    {
        for (var i = 0; i < schemes.length; i++)
        {
            tempScheme = schemes[i];
            schemeGroup = tempScheme.PageSchemeGroups;
            for (var j = 0; j < schemeGroup.length; j++)
            {
                tempSchemeGroup = schemeGroup[j];
                if (tempSchemeGroup.SubType == "1")
                {
                    tempFilterScheme = tempSchemeGroup;
                }
                else if (tempSchemeGroup.SubType == "2")
                {
                    tempDataScheme = tempSchemeGroup;
                }
            }

            tempRowHtml = templateRowHtml;
            tempRowHtml = tempRowHtml.replace("{$Class}", i % 2 == 0 ? "dg_altrow" : "dg_row");
            tempRowHtml = tempRowHtml.replace("{$RowNo}", tempScheme.RowNo);

            if (i == 0)
            {
                dataSchemeHTML = '<span field="dataScheme" value="默认方案">默认方案</span>';
                filterSchemeHTML = '<span field="filterScheme" value="默认方案">默认方案</span>';
            }
            else
            {
                var dataSchemeHTML = "<select style='width:100%' field='dataScheme'>" + buildDataSchemeDDLOptionsHtml() + "</select>";
                var filterSchemeHTML = "<select style='width:100%' field='filterScheme'>" + buildFilterSchemeDDLOptionsHtml() + "</select>";
            }

            tempRowHtml = tempRowHtml.replace("{$TableColumnSchemeHTML}", dataSchemeHTML);
            tempRowHtml = tempRowHtml.replace("{$FilterSchemeHTML}", filterSchemeHTML);
            tempRow = $(tempRowHtml);
            tempRow.attr('schemeID', tempScheme.SchemeID);
            tempRow.find('[field=viewSchemeName]').val(tempScheme.SchemeName);
            tempRow.find('select[field=dataScheme]').val(tempDataScheme.SubSchemeID);
            tempRow.find('select[field=filterScheme]').val(tempFilterScheme.SubSchemeID);
            tempScheme.IsDefault && tempRow.find('[field=isDefault]').attr('checked', 'checked');
            tempRow.find('[field=viewSchemeRemark]').val(tempScheme.Remark);
            tempRow.find('[field=viewSchemeRowNo]').val(tempScheme.RowNo);

            frag.appendChild(tempRow[0]);
        }
    }
    tbScheme.append(frag);
}

//获取方案数据
function getSchemes()
{
    var schemes = [];
    var schemegroup = [];
    var tbValues = $('#tbScheme tr:gt(0)');

    for (i = 0; i < tbValues.length; i++)
    {
        var currentRow = tbValues.eq(i);
        var schemeName = currentRow.find('[field=viewSchemeName]');
        var datascheme = currentRow.find('[field=dataScheme]');
        var filterscheme = currentRow.find('[field=filterScheme]');
        var isDefault = currentRow.find('[field=isDefault]');
        var rowNo = currentRow.find('[field=viewSchemeRowNo]');
        var remark = currentRow.find('[field=viewSchemeRemark]');
        schemegroup = [];
        schemegroup.push
        (
            {
                "SubSchemeID": datascheme.val(),
                "SubSchemeName": datascheme[0].tagName == "SELECT" ? datascheme.find('option[selected]').text() : datascheme.text(),
                "SubType": "2"
            },
            {
                "SubSchemeID": filterscheme.val(),
                "SubSchemeName": filterscheme[0].tagName == "SELECT" ? filterscheme.find('option[selected]').text() : filterscheme.text(),
                "SubType": "1"
            }
        );
         
        schemes.push
        ({
            "SchemeID": currentRow.attr('schemeID'),
            "PageID": "",
            "SchemeName": schemeName.val(),
            "IsDefault": isDefault.attr('checked') == 'checked',
            "RowNo": rowNo.val(),
            "Remark": remark.val(),
            "PageSchemeGroups": schemegroup
        });
    }
    return schemes;
}

function previewPage(obj)
{
    var currentRow = $(obj).closest('tr'),
        schemeID = currentRow.attr("schemeID"),
        currentUrl = location.href,
        rootPath = currentUrl.substring(0, currentUrl.indexOf("Common/CustomPage/") + "Common/CustomPage/".length),
        targetUrl = $('#txtPageUrl').val(),
        targetFullUrl = rootPath + "VPreview.aspx" + targetUrl.substring(targetUrl.indexOf('?')) + "&SchemeID=" + schemeID;
    openWindow(targetFullUrl, -1, -1);
}
/*-------------- 数据源方法   ---------------*/
function getDataAdapterParams(querySql)
{
    var queryParameters = [];
    if (querySql.indexOf("[$") > querySql.indexOf("]"))
    {
        alertMsg("查询语句中存在错误，请调整", $("#txtQueryClip"));
        return false;
    }

    var tbSqlParameterValue = $("#tbSqlParameterValue>tbody");

    //while (querySql.indexOf("[$") != -1)
    //{
    //    if (querySql.indexOf("[$") > querySql.indexOf("]"))
    //    {
    //        alertMsg("查询语句中存在错误，请调整", $("#txtQueryClip"));
    //        return false;
    //    }
    //    var paramName = querySql.substring(querySql.indexOf("[$") + 2, querySql.indexOf("]"));
    //    var originalParamValue = tbSqlParameterValue.find('[key=' + paramName + '] [field=paramDefaultValue] input').val() || "";
        
    //    querySql = querySql.substring(querySql.indexOf("]") + 1, querySql.length);

    //    if (existsDataAdapterParam(queryParameters, paramName))
    //    {            
    //        continue;
    //    }
    //    queryParameters.push({ "Key": paramName, "Value": originalParamValue });
    //}
    return queryParameters;
}

function existsDataAdapterParam(existsParams, paramName)
{
    if (!existsParams || !existsParams.length || !paramName)
    {
        return false;
    }

    for (var i = 0; i < existsParams.length; i++)
    {
        if (existsParams[i].Key == paramName)
        {
            return true;
        }
    }
    return false;
}

function getDataAdapterDefaultValue(paramsInfo)
{
    var defaultValueInfo = {};
    if (paramsInfo && paramsInfo.length)
    {
        for (var i = 0; i < paramsInfo.length; i++)
        {
            tempParam = paramsInfo[i];
            if (tempParam.Key == PARAMETER_DEFAULT_VALUE)
            {
                defaultValueInfo = $.stringToJSON(tempParam.Value);
                break;
            }
        }
    }
    return defaultValueInfo;
}

function loadDataAdapterParamsList(paramsInfo)
{
    var table = $("#tbSqlParameterValue>tbody"),
        rowCount = table.get(0).rows.length - 1,
        templateRowHtml = $("#tbTemplate").find("#trTemplateSqlParameter").get(0).outerHTML,
        tempParam, tempRowHtml, paramRow;
    clearTable(table.get(0), 1);
    if (paramsInfo && paramsInfo.length)
    {
        for (var i = 0; i < paramsInfo.length; i++)
        {
            tempParam = paramsInfo[i];
            tempRowHtml = templateRowHtml;
            paramRow = $(tempRowHtml);
            paramRow.attr({
                "class": rowCount % 2 == 0 ? "dg_altrow" : "dg_row"
            }).removeAttr('id');
            paramRow.find('[field=aliasName] input').val(tempParam.AliasName);
            paramRow.find('[field=dbParamName] input').val(tempParam.DbParamName);
            paramRow.find('[field=dbType] [id=ddlDbType]').val(tempParam.DbType);
            paramRow.find('[field=isOutput] [id=ddlIsOutput]').val(tempParam.IsOutput ? "Y" : "N");
            paramRow.find('[field=paramDefaultValue] input').val(tempParam.DefaultValue);
            paramRow.find('[field=paramValue] input').val(tempParam.Value);
            table.append(paramRow);
            rowCount++;
        }
    }
}

function testQuerySql()
{
    var sqlText = getObj("txtQueryClip").value;
    var connectionName = getObj("ddlConnectionName").value;
    var orderByClip = getObj("txtOrderByClip").value;
    var paramInfos = getParamCompleteInfos();
    var url = getCurrentUrl();
    var isSuccess = false;
    ajax(url,
        { ActionName: "TestSqlQuery", SqlText: sqlText, ConnectionName: connectionName, OrderByClip: orderByClip, ParamInfos: paramInfos },
        "json",
        function (data)
        {
            if (data.IsSuccess)
            {
                //更新数据库字段选择项
                $("select[id*=ddlField]").each(function (i)
                {
                    var me = $(this),
                        originalValue = me.val(),
                        newSelect = $(data.Data);
                    
                    me.html(newSelect[0].innerHTML);
                    me.val(originalValue);
                });
                isSuccess = true;
            }
            alert(data.Message);
        });
    return isSuccess;
}

function runSqlQuery(callback,asyn)
{
    var sqlText = getObj("txtQueryClip").value;
    var connectionName = getObj("ddlConnectionName").value;
    var orderByClip = getObj("txtOrderByClip").value;
    var paramInfos = getParamCompleteInfos();
    var url = getCurrentUrl();
    ajax(url,
        { ActionName: "RunSqlQuery", SqlText: sqlText, ConnectionName: connectionName, OrderByClip: orderByClip, ParamInfos: paramInfos },
        "json",
        function (data)
        {
            if (typeof callback == 'function')
            {
                callback(data);
            }
        }, typeof asyn == 'boolean' ? asyn : true);
}

function getDefaultValue()
{
    var defaultvalues = [];
    $("#tbSqlParameterValue>tbody>tr:gt(0)").each(function ()
    {
        var paramName = trim($(this).find("[field=paramName]").html());
        var paramValue = trim($(this).find("[field=paramDefaultValue] input").val());
        //用数组形式拼接值,可转为JArray
        defaultvalues.push({ "Key": paramName, "Value": paramValue });
    });

    return $.jsonToString(defaultvalues);
}

function getParamCompleteInfos()
{
    var infos = [];
    $("#tbSqlParameterValue>tbody>tr:gt(0)").each(function ()
    {
        var aliasName = trim($(this).find("[field=aliasName] input").val());
        var dbParamName = trim($(this).find("[field=dbParamName] input").val());
        var dbType = $(this).find("#ddlDbType").val();
        var isOutput = $(this).find("#ddlIsOutput").val() == "Y";
        var paramDefaultValue = trim($(this).find("[field=paramDefaultValue] input").val());
        var paramValue = trim($(this).find("[field=paramValue] input").val());
        infos.push({ "AliasName": aliasName, "DbParamName": dbParamName, "DbType": dbType, "IsOutput": isOutput, "DefaultValue": paramDefaultValue, "Value": paramValue });
    });

    return $.jsonToString(infos);
}

//获取数据适配数据,编辑页修改需传参数adapterid，新增或另存不需要传参
function getDataAdapter(adapterid)
{
    var parameters = [];
    parameters.push    (
        {
            ParameterID: "",
            Key: PARAMETER_CONNECTION_NAME,
            Value: getObj("ddlConnectionName").value,
            AdapterID: adapterid
        }    );
    parameters.push    (
       {
           ParameterID: "",
           Key: PARAMETER_NAME_QUERY_CLIP,
           Value: getObj("txtQueryClip").value,
           AdapterID: adapterid
       }    );
    parameters.push    (
      {
          ParameterID: "",
          Key: PARAMETER_ORDERBY_CLIP,
          Value: getObj("txtOrderByClip").value,
          AdapterID: adapterid
      }    );
    parameters.push(
      {
          ParameterID: "",
          Key: PARAMETER_SQL_CLIP_TYPE,
          Value: $("input:radio[id*=rblQueryType]:checked").val(),
          AdapterID: adapterid
      });
    parameters.push({
        ParameterID: "",
        Key: PARAMETER_DEFAULT_VALUE,
        Value: getParamCompleteInfos(),
        AdapterID: adapterid
    });

    if (parameters && parameters.length > 0)
    {
        return {
            AdapterType: defaultAdapterType,
            AdapterName: $('#txtDefaultDataSourceName').val(),
            Remark: $('#txtDefaultDataSourceRemark').val(),
            Parameters: parameters
        };
    }
    return null;
}
/*-------------- 脚本区方法   ---------------*/
//新增文件
function addFile()
{
    var table = $("#tbFile>tbody");
    var templateRowHtml = $("#tbTemplate").find("#trTemplateFile").get(0).outerHTML;
    templateRowHtml = templateRowHtml.replace('id="trTemplateFile"', "");
    templateRowHtml = templateRowHtml.replace("{$Class}", table.get(0).rows.length % 2 == 0 ? "dg_altrow" : "dg_row");
    templateRowHtml = templateRowHtml.replace("{$RowNo}", table.get(0).rows.length);
    table.append(templateRowHtml);
}

//选择脚本文件
function selectPage(obj)
{
    var txtFilePathControl = $(obj.parentNode.parentNode).find("input[id*=txtFilePath]"),
        oriPath = txtFilePathControl.text(),
        path = openModalWindow('../../Admin/Maintenance/VSelectPage.aspx', 500, 500),
        baseDirectoryPath = $('#hidBaseDirectoryPath').val();

    if (path != undefined)
    {
        path = path.replace(baseDirectoryPath, '\\');
        path = path.replace(/\\/g, "/");
    }
    if (path != oriPath)
    {
        txtFilePathControl.val(path);
    }
}

//获取关联文件数据
function getRelateFiles()
{
    var files = [],
        fileType = defaultFileType;
    $("#tbFile>tbody>tr:gt(0)").each(function (i)
    {
        var row = $(this);
        files.push(
        {
            FileID: row.attr("fileid"),
            AreaID: row.attr("areaID"),
            Type: fileType,
            Path: row.find("[field=FilePath]").val(),
            RowNo: row.find("[field=RowNo]").val()
        });
    });
    return files;
}

/*-------------- 数据区方法   ---------------*/
// 通过tableID获取Table缓存信息
function getTableInfoByID(tableID)
{
    if (tableCaches && tableCaches.length)
    {
        for (var i = 0; i < tableCaches.length; i++)
        {
            if (tableCaches[i].TableID == tableID)
            {
                return tableCaches[i];
            }
        }
    }
    return null;
}

// 通过tableID和schemeID从缓存中获取数据方案的缓存信息
function getDataSchemeInfoByID(tableID, schemeID)
{
    var tableInfo = getTableInfoByID(tableID);

    if (tableInfo && tableInfo.ColumnSchemes && tableInfo.ColumnSchemes.length)
    {
        schemes = tableInfo.ColumnSchemes;
        for (var i = 0; i < schemes.length; i++)
        {
            if (schemes[i].SchemeID == schemeID)
            {
                return schemes[i];
            }
        }
    }
    return null;
}

// 加载数据源的数据列DDL
function bindDataAdapterFieldDDL()
{
    runSqlQuery(function (data)
    {
        if (data.IsSuccess)
        {
            //更新数据库字段选择项
            $("select[id*=ddlField]").each(function (i)
            {
                var me = $(this),
                            originalValue = me.val(),
                            newSelect = $(data.Data);

                me.html(newSelect[0].innerHTML);
                me.val(originalValue);
            });
        }
    }, false);
}

// 加载数据表格信息
function loadDataTableInfo(tableInfo)
{
    if (tableInfo && tableInfo.length)
    {
        var currentTable = tableInfo[0];
        $('#spnDataTableName').text(currentTable.TableName);
    }
}

// 加载数据字段列表
function loadDataColumnList(tableInfo)
{
    var tbColumn = $('#tbColumn>tbody'),
        frag = document.createDocumentFragment();
    if (tableInfo && tableInfo.length)
    {
        for (var tableIndex = 0; tableIndex < tableInfo.length; tableIndex++)
        {
            var tempTable = tableInfo[tableIndex];
            for (var schemeIndex = 0; schemeIndex < tempTable.ColumnSchemes.length; schemeIndex++)
            {
                var tempScheme = tempTable.ColumnSchemes[schemeIndex];
                for (var columnIndex = 0; columnIndex < tempScheme.Columns.length; columnIndex++)
                {
                    var tempColumn = tempScheme.Columns[columnIndex];
                    var columnRow = buildDataColumnRow(tempColumn);
                    frag.appendChild(columnRow[0]);
                }
            }
        }
    }
    tbColumn.append(frag);
}

function initialDataAreaInfo()
{
    var scheme = dataSchemes && dataSchemes.length ? dataSchemes[0] : {};
    $('#spnColumnSchemeName').text(scheme.SchemeName || "");
    showDataSchemeColumns(scheme);
}

//重置数据区
function resetDataSchemeColumns()
{
    if (confirm("是否确认重置数据区?确认将清空数据区"))
    {
        var schemeInfo = getCurrentDataSchemeInfo(),
            columnsRow = getRowsFromTableByAttrs($('#tbColumn'), { "TableID": schemeInfo.TableID, "SchemeID": schemeInfo.SchemeID });
        columnsRow.remove();
    }
}

function rebindDataSchemeDDL()
{
    var ddls = $('#tbScheme select[field=dataScheme]'),
        newDDLHtml = buildDataSchemeDDLOptionsHtml();

    ddls.each(function (i)
    {
        var me = $(this),
            originalVal = me.val();
        me.html(newDDLHtml);
        me.val(originalVal);
    });
}

function buildDataSchemeDDLOptionsHtml()
{
    var dataSchemeHTML = "";
    for (i = 0; i < dataSchemes.length; i++)
    {
        dataSchemeHTML += "<option value='" + dataSchemes[i].SchemeID + "'>" + dataSchemes[i].SchemeName + "</option>";
    }
    return dataSchemeHTML;
}

function getCurrentDataSchemeInfo()
{
    var tbColumn = $('#tbColumn'),
        info = {
            TableID: tbColumn.attr('currentTableID'),
            SchemeID: tbColumn.attr('currentSchemeID')
        };
    return info;
}

function buildNewDataSchemeDialog()
{
    currentContentSchemeDialogID = currentContentSchemeDialogID || getNewID();    
    bindCopyFromDataSchemesDDL();
    currentContentSchemeDialogID = showDialog({
        id: currentContentSchemeDialogID,
        title: "新增方案",
        html: $("#divDataScheme").html(),
        width: 400, height: 250
    });
}

function bindCopyFromDataSchemesDDL()
{
    var ddlCopyFromDataScheme = $('#ddlCopyFromDataScheme');
    // 先获取全部数据方案信息
    cacheAllDataSchemeColumns();

    var schemeInfo = getCurrentDataSchemeInfo();
    var tableID = schemeInfo.TableID;
    var schemeID = schemeInfo.SchemeID;
    var tableInfo = getTableInfoByID(tableID),
        schemes = tableInfo.ColumnSchemes;

    bindSchemesToDDL(ddlCopyFromDataScheme[0], schemes);
}

//新增数据栏位
function addDataColumn()
{
    var tbColumn = $('#tbColumn>tbody'),
        schemeInfo = getCurrentDataSchemeInfo(),
        currentTableID = schemeInfo.TableID,
        currentSchemeID = schemeInfo.SchemeID,
        schemeRowsCount = getRowsFromTableByAttrs(tbColumn,
        {
            "TableID": currentTableID, "SchemeID": currentSchemeID
        }).length,
        newRowNo = schemeRowsCount + 1,
        newColumnObj = createNewDataColumnJsonObj(currentTableID, currentSchemeID, newRowNo),
        columnRow = buildDataColumnRow(newColumnObj);
    tbColumn.append(columnRow);
}

function buildDataColumnRow(columnInfo)
{
    var rowHtml = $("#tbTemplate").find("#trTemplateCol").get(0).outerHTML,
        rowObj = $(rowHtml);
    rowObj.attr({
        "class": (columnInfo.RowNo - 1) % 2 == 0 ? "dg_altrow" : "dg_row",
        "tableID": columnInfo.TableID,
        "schemeID": columnInfo.SchemeID,
        "columnID": columnInfo.ColumnID
    }).removeAttr('id');;
    rowObj.find('[field=Text]').val(columnInfo.Text);
    rowObj.find('[field=Field]').val(columnInfo.Field);
    rowObj.find('[field=DbType]').val(columnInfo.DbType);
    rowObj.find('[field=Format]').val(columnInfo.Format);
    rowObj.find('[field=Width]').val(columnInfo.Width);
    rowObj.find('[field=Align]').val(columnInfo.Align);
    columnInfo.IsSystem && rowObj.find('[field=IsSystem]').attr('checked', 'checked');
    columnInfo.TreeFlag && rowObj.find('[field=TreeFlag]').attr('checked', 'checked');
    columnInfo.Fixed && rowObj.find('[field=Fixed]').attr('checked', 'checked');
    columnInfo.Sortable && rowObj.find('[field=Sortable]').attr('checked', 'checked');
    columnInfo.Visible && rowObj.find('[field=Visible]').attr('checked', 'checked');
    rowObj.find('[field=RenderFunc]').val(columnInfo.RenderFunc);
    rowObj.find('[field=RenderHTML]').val(columnInfo.RenderHTML);
    rowObj.find('[field=RowNo]').val(columnInfo.RowNo);
    rowObj.find('[field=ColumnType]').val(columnInfo.ColumnType);
    rowObj.find('[field=ColumnMode]').val(columnInfo.ColumnMode);

    rowObj.find('[field=FieldType]').val(columnInfo.FieldType);

    if (/[13]/.test(columnInfo.DbType))
    {
        rowObj.find('[field=Align]').attr('disabled','disabled');
    }
    return rowObj
}

function deleteDataScheme(obj)
{
    var btn = $(obj),
        row = obj.parentNode.parentNode,
        schemeEle = $(row).find('[field=schemeName]'),
        schemeID = schemeEle.attr('schemeID'),
        scheme =getFirstJsonFromArrByAttrs(dataSchemes, { "SchemeID": schemeID }),
        table = row.parentNode.parentNode,
        columnsRow = getRowsFromTableByAttrs($('#tbColumn'), { "TableID": scheme.TableID, "SchemeID": schemeID });

    if (columnsRow.length > 0)
    {
        if (!confirm('该方案下已设置了数据字段，删除方案将同时删除这些信息，确定要删除？'))
        {
            return false;
        }
    }
    // 删除数据方案所在tr标签
    deleteCurrentRow(obj);
    // 从缓存中移除该该方案
    removeDataSchemeCache(scheme.TableID, schemeID);
    // 移除方案包含的列信息
    columnsRow.remove();
    // 如果之前选中的是当前方案，则删除方案后，自动选中默认方案
    if (!$(table).find('.selNode').length)
    {
        $(table).find('[field=schemeName]:eq(0)').click();
    }
}

//获取表格数据
function getTables()
{
    cacheAllDataSchemeColumns();
    return tableCaches;
}

function cacheAllDataSchemeColumns()
{
    var container = $('#tbColumn'),
        tables = tableCaches,

        tempTable = null,
        tempScheme = null,
        tempSchemeCount = 0,
        tempSchemeColumns = null,
        tempColumnRows = null;

    if (tables)
    {
        for (var tableIndex = 0; tableIndex < tables.length; tableIndex++)
        {
            tempTable = tables[tableIndex];

            if (tempTable && tempTable.ColumnSchemes)
            {
                tempSchemeCount = tempTable.ColumnSchemes.length;
                for (var schemeIndex = 0; schemeIndex < tempSchemeCount; schemeIndex++)
                {
                    tempSchemeColumns = [];
                    tempScheme = tempTable.ColumnSchemes[schemeIndex];

                    tempColumnRows = getRowsFromTableByAttrs(container, { "TableID": tempScheme.TableID, "SchemeID": tempScheme.SchemeID });
                    
                    $(tempColumnRows).each(function (i, r)
                    {
                        tempSchemeColumns.push(getDataSchemeColumnInfoFromRow(r));
                    });
                    tempScheme.Columns = tempSchemeColumns;
                }
            }
        }
    }
}

function createNewDataColumnJsonObj(tableID, schemeID, rowNo)
{
    return  {
            ColumnID: "",
            SchemeID: schemeID,
            TableID: tableID,
            Text: "",
            Format: "",
            RowNo: rowNo,
            Field: "",
            DbType: "",
            Align: "",
            Type: "",
            Mode: "",
            ParentID: "",
            Width: "100",
            Height: "",
            IsSystem: false,
            TreeFlag: false,
            Fixed: false,
            Visible: true,
            Sortable: true,
            RenderFunc: "",
            RenderHTML: "",
            Remark: ""
        };
}

function getDataSchemeColumnInfoFromRow(row)
{
    var row = $(row),
        column =
        {
            ColumnID: row.attr("columnID"),
            SchemeID: row.attr("schemeID"),
            TableID: row.attr("tableID"),
            Text: row.find("[field=Text]").val().Trim(),
            Format: row.find("[field=Format]").val().Trim(),
            RowNo: row.find("[field=RowNo]").val(),
            Field: row.find("[field=Field]").val(),
            DbType: row.find("[field=DbType]").val(),
            Align: row.find("[field=Align]").val(),
            Type: row.find("[field=ColumnType]").val(),
            Mode: row.find("[field=ColumnMode]").val(),
            ParentID: row.find("[field=BtnID]").val(),
            Width: row.find("[field=Width]").val(),
            Height: row.find("[field=BtnID]").val(),
            IsSystem: row.find("[field=IsSystem]").attr("checked") == 'checked',
            TreeFlag: row.find("[field=TreeFlag]").attr("checked") == 'checked',
            Fixed: row.find("[field=Fixed]").attr("checked") == 'checked',
            Visible: row.find("[field=Visible]").attr("checked") == 'checked',
            Sortable: row.find("[field=Sortable]").attr("checked") == 'checked',
            RenderFunc: row.find("[field=RenderFunc]").val(),
            RenderHTML: row.find("[field=RenderHTML]").val(),
            Remark: "",
            FieldType: row.find("[field=FieldType]").val()
        };
    return column;
}

//获取数据库字段
function getDataFields()
{
    testQuerySql();
}

function toggleEditDataTableField()
{
    showDataTableDetail('edit');
}

function showDataTableDetail(showType)
{
    currentContentSchemeDialogID = currentContentSchemeDialogID || getNewID();
    currentContentSchemeDialogID = showDialog({
        id: currentContentSchemeDialogID,
        title: "编辑表格",
        html: $("#divDataTableDetail").html(),
        width: 600, height: 300
    });

    var tableInfo = tableCaches[0],
        dialogContainer = $('#' + currentContentSchemeDialogID);
    if (showType.toLocaleLowerCase() === 'edit')
    {
        dialogContainer.find('#txtContentName').val(tableInfo.TableName);
        dialogContainer.find('#rdlPagable input[type=radio][value=' + Number(tableInfo.Pageable) + ']').attr('checked', 'checked');
        dialogContainer.find('#rblEnabledMultiSelect input[type=radio][value=' + Number(tableInfo.EnabledMultiSelect) + ']').attr('checked', 'checked');
        dialogContainer.find('#rblEnabledShowRowNumber input[type=radio][value=' + Number(tableInfo.EnabledShowRowNumber) + ']').attr('checked', 'checked');
        dialogContainer.find('#rdlTableType input[type=radio][value=' + Number(tableInfo.TableType) + ']').attr('checked', 'checked');
        dialogContainer.find('#ddlDataSource option[value=' + tableInfo.DataAdapterID + ']').attr('selected', 'selected');
        dialogContainer.find('#txtContentRowNo').val(tableInfo.RowNo);
        dialogContainer.find('#btnDataTableSubmit').bind('click', function ()
        {
            saveDataTableDetail(showType, tableInfo);
        });
    }

    $(document).bind('mousedown', hideDataTableDetailField);
}


function hideDataTableDetailField()
{
    var dataTableDetailDialog = getObj(currentContentSchemeDialogID),
        eventObj = getEventObj("div");

    if (!dataTableDetailDialog || !dataTableDetailDialog.contains(eventObj))
    {
        //隐藏表格详细信息层
        cancelDialog();
        $(document).unbind('mousedown', hideDataTableDetailField);
    }
}

function saveDataTableDetail(type, tableInfo)
{
    var dialogContainer = $('#' + currentContentSchemeDialogID); 
    if (type.toLocaleLowerCase() === 'edit')
    {
        tableInfo.TableName = dialogContainer.find('#txtContentName').val();
        tableInfo.Pageable = dialogContainer.find('#rdlPagable input[type=radio][checked]').val() == "1";
        tableInfo.EnabledMultiSelect = dialogContainer.find('#rblEnabledMultiSelect input[type=radio][checked]').val() == "1";
        tableInfo.EnabledShowRowNumber = dialogContainer.find('#rblEnabledShowRowNumber input[type=radio][checked]').val() == "1";
        tableInfo.TableType = dialogContainer.find('#rdlTableType input[type=radio][checked]').val();
        tableInfo.DataAdapterID = dialogContainer.find('#ddlDataSource').val();
        tableInfo.RowNo = dialogContainer.find('#txtContentRowNo').val();

        $('#spnDataTableName').text(tableInfo.TableName);
    }
    $('#btnDataTableSubmit').unbind('click');
    cancelDialog();
    dataSchemesUpdated = true;
}


function toggleSelectDataSchemeField()
{
    var divSelectDataScheme = $('#divSelectDataScheme');

    if (divSelectDataScheme.css('display') == 'none')
    {
        showSelectDataSchemeField();
    }
    else
    {
        divSelectDataScheme.hide();
    }
}

function showSelectDataSchemeField()
{
    var divSelectDataScheme = $('#divSelectDataScheme');
    if (dataSchemesUpdated)
    {
        buildDataSchemesContent();
        dataSchemesUpdated = false;
    }
    divSelectDataScheme.show();
    $(document).bind('mousedown', hideSelectDataSchemeField);
}

function hideSelectDataSchemeField()
{
    var divSelectDataScheme = getObj('divSelectDataScheme'),
        addSchemeDialog = getObj(currentContentSchemeDialogID),
        eventObj = getEventObj("div");

    if (!divSelectDataScheme.contains(eventObj) && (!addSchemeDialog || !addSchemeDialog.contains(eventObj)))
    {
        //隐藏数据方案弹出层和新增数据方案层
        $(divSelectDataScheme).hide();
        cancelDialog();
        $(document).unbind('mousedown', hideSelectDataSchemeField);
    }
}

// 绑定选择数据方案对话框的内容
function buildDataSchemesContent()
{
    var divDataSchemeSelector = $('#divDataSchemeSelector'),
        tableTemplte = $('[name=TableBlockTemplate]'),
        schemesHtml = "",
        tableCount = tableCaches.length,
        tempTable, tempDataSchemes, tempDataSchemeCount, tempScheme,
            tempTableHtml,
        tblSchemsContainer = document.createElement('table'),
        tbody = document.createElement('tbody'),
        tr, td,
        currentDataSchemeInfo = getCurrentDataSchemeInfo();

    for (var tableIndex = 0; tableIndex < tableCount; tableIndex++)
    {
        tempTable = tableCaches[tableIndex];
        tempDataSchemes = tempTable.ColumnSchemes;
        tempDataSchemeCount = tempDataSchemes.length;
        schemesHtml = "";

        tr = document.createElement('tr');
        td = document.createElement('td');
        td.style.cssText = 'background-color: #FFFFFF; vertical-align: top;';
        tempTableHtml = tableTemplte[0].outerHTML;
        tempTableHtml = tempTableHtml.replace('name="TableBlockTemplate"', '');
        tempTableHtml = tempTableHtml.replace(/display: *none/gi, "");
        tempTableHtml = tempTableHtml.replace('{$TableID}', tempTable.TableID);
        tempTableHtml = tempTableHtml.replace('{$TableRowNo}', tempTable.RowNo);
        tempTableHtml = tempTableHtml.replace('{$TableName}', tempTable.TableName);

        for (var schemeIndex = 0; schemeIndex < tempDataSchemeCount; schemeIndex++)
        {
            tempScheme = tempDataSchemes[schemeIndex];
            tempSchemeHtml = buildDataSchemeCell(tempScheme);
            schemesHtml += tempSchemeHtml;
        }
        tempTableHtml = tempTableHtml.replace("{$SchemesHTML}", schemesHtml);
        td.innerHTML = tempTableHtml;
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
    tblSchemsContainer.appendChild(tbody);
    divDataSchemeSelector.html('');
    divDataSchemeSelector.append(tblSchemsContainer);

    selectDataSchemeNode(currentDataSchemeInfo);
}

// 根据当前数据方案ID，在选择方案对话框中选中数据方案节点
function selectDataSchemeNode(dataSchemeInfo)
{
    $('#divDataSchemeSelector span.normalNode[field=schemeName][tableID=' + dataSchemeInfo.TableID + '][schemeID=' + dataSchemeInfo.SchemeID + ']')
        .click();
}

function buildDataSchemeCell(scheme)
{
    var schemeTemplate = $('[name=DataSchemeBlockTemplate]'),
        tempSchemeHtml = "";

    tempSchemeHtml = schemeTemplate[0].outerHTML;
    tempSchemeHtml = tempSchemeHtml.replace('name="DataSchemeBlockTemplate"', '');
    tempSchemeHtml = tempSchemeHtml.replace('{$TableID}', scheme.TableID);
    tempSchemeHtml = tempSchemeHtml.replace('{$SchemeID}', scheme.SchemeID);
    tempSchemeHtml = tempSchemeHtml.replace('{$RowNo}', scheme.RowNo);
    tempSchemeHtml = tempSchemeHtml.replace('{$IsDefault}', scheme.IsDefault);
    tempSchemeHtml = tempSchemeHtml.replace('{$SchemeName}', scheme.SchemeName);
    tempSchemeHtml = tempSchemeHtml.replace('style="', scheme.IsDefault ? 'style="display:none;' : 'style="');
    return tempSchemeHtml;
}

function isColumnSchemeValid(editType, tableID, originalSchemeName, newSchemeNameTextbox, newSchemeRowNoTextBox)
{
    var txtColumnSchemeName = $(newSchemeNameTextbox),
        txtRowNo = $(newSchemeRowNoTextBox),
        newSchemeName = txtColumnSchemeName.val(),
        newRowNo = txtRowNo.val();
    if (!newSchemeName)
    {
        return alertMsg('请输入有效方案名称', txtColumnSchemeName[0]);
    }
    if (newSchemeName !== originalSchemeName && existDataScheme(tableID, newSchemeName))
    {
        return alertMsg('该方案名称已存在，请重新输入', txtColumnSchemeName[0]);
    }
    if (editType.toLocaleLowerCase() === 'add' && !isPositiveInt(newRowNo))
    {
        return alertMsg('请输入有效正整数', txtRowNo[0]);
    }
    return true;
}

function updateColumnSchemeName()
{
    var spnColumnSchemeName = $('#spnColumnSchemeName'),
        txtColumnSchemeName = $('#txtColumnSchemeName'),
        originalColumnSchemeName = spnColumnSchemeName.text(),
        newColumnSchemeName = txtColumnSchemeName.val(),
        currentDataSchemeInfo = getCurrentDataSchemeInfo();

    if (originalColumnSchemeName === newColumnSchemeName)
    {
        return true;
    }
    if (!isColumnSchemeValid('edit', currentDataSchemeInfo.TableID, originalColumnSchemeName, txtColumnSchemeName))
    {
        return false;
    }
    spnColumnSchemeName.text(newColumnSchemeName);
    updateDataSchemeCache(currentDataSchemeInfo.TableID, currentDataSchemeInfo.SchemeID, newColumnSchemeName);
    return true;
}

function updateDataSchemeCache(tableID, schemeID, newSchemeName)
{
    var scheme = getFirstJsonFromArrByAttrs(dataSchemes, { "SchemeID": schemeID }),
        originalSchemeName = scheme.SchemeName,
        tbColumn = $('#tbColumn');

    scheme.SchemeName = newSchemeName;
    scheme.SchemeID = scheme.SchemeID == originalSchemeName ? newSchemeName : scheme.SchemeID;
    tbColumn.attr('currentSchemeID', scheme.SchemeID);
    dataSchemesUpdated = true;
    needRebindDataSchemeDDL = true;
}

function removeDataSchemeCache(tableID, schemeID)
{
    for (var i = 0; i < dataSchemes.length; i++)
    {
        if (dataSchemes[i] && dataSchemes[i].SchemeID === schemeID)
        {
            dataSchemes.splice(i, 1);
            dataSchemesUpdated = true;
            needRebindDataSchemeDDL = true;
            break;
        }
    }
}

function existDataScheme(tableID, schemeName)
{
    // TODO 暂时只实现了单列表功能，当实现多列表时，需要同时判断TableID和SchemeID相同
    for (var i = 0; i < dataSchemes.length; i++)
    {
        if (dataSchemes[i] && dataSchemes[i].SchemeName === schemeName)
        {
            return true;
        }
    }
    return false;
}

function addDataSchemeCache(tableID, schemeName, rowNo, columns)
{
    if (!existDataScheme(tableID, schemeName))
    {
        columns = isArray(columns) ? columns : [];
        dataSchemes.push({
            SchemeID: schemeName, SchemeName: schemeName,
            RowNo: rowNo, TableID: tableID, IsDefault: false, Remark: "",
            Columns: columns
        });
        dataSchemesUpdated = true;
        needRebindDataSchemeDDL = true;
    }
}

function selectDataScheme(obj)
{
    //显示该节点对应方案内容
    var divSelectDataScheme = $('#divSelectDataScheme'),
        ele = $(obj),
        schemeID = ele.attr('schemeID'),
        targetScheme = getFirstJsonFromArrByAttrs(dataSchemes, { "SchemeID": schemeID });

    // HTML里的改变
    divSelectDataScheme.find('.selNode').removeClass('selNode').addClass('normalNode');
    ele.addClass('selNode');
    $('#spnColumnSchemeName').text(ele.text());

    // 方案加载字段信息
    showDataSchemeColumns(targetScheme);
}

/* 显示数据方案字段信息
 *  通过隐藏其他方案的字段行，显示当前方案的字段行实现
 */
function showDataSchemeColumns(scheme)
{
    if (!scheme || !scheme.Columns)
    {
        return false;
    }
    
    var tbColumn = $('#tbColumn'),
        columnObjs = tbColumn.find('[tableID=' + scheme.TableID + '][schemeID=' + scheme.SchemeID + ']');

    tbColumn.attr({ 'currentTableID': scheme.TableID, 'currentSchemeID': scheme.SchemeID });
    tbColumn.find('tr:gt(0)').not(columnObjs).hide();
    columnObjs.show();
}

function submitDataScheme()
{
    var contentSchemeDialog = $('#' + currentContentSchemeDialogID),
        ddlCopyFromDataScheme = contentSchemeDialog.find('#ddlCopyFromDataScheme'),
        txtContentSchemeName = contentSchemeDialog.find("#txtContentSchemeName"),
        txtContentSchemeRowNo = contentSchemeDialog.find("#txtContentSchemeRowNo"),
        copyFromSchemeID = ddlCopyFromDataScheme.val(),
        newColumnSchemeName = txtContentSchemeName.val(),
        newColumnSchemeRowNo = txtContentSchemeRowNo.val(),
        table = $("#divDataSchemeSelector table[name=DataSchemeContent]>tbody"),
        currentDataSchemeInfo = getCurrentDataSchemeInfo(),
        columns = [];

    // 验证数据有效性
    if (!isColumnSchemeValid('add', currentDataSchemeInfo.TableID, '', txtContentSchemeName, txtContentSchemeRowNo))
    {
        return false;
    }

    columns = !!copyFromSchemeID ? [] : copyColumnsFromDataScheme(currentDataSchemeInfo.TableID, copyFromSchemeID, newColumnSchemeName);

    // 保存数据至缓存
    addDataSchemeCache(currentDataSchemeInfo.TableID, newColumnSchemeName, newColumnSchemeRowNo, columns);
    // 页面中显示增加的方案
    addOneDataSchemeIntoView(table, currentDataSchemeInfo.TableID, newColumnSchemeName, newColumnSchemeRowNo, copyFromSchemeID);
    // 关闭对话框
    cancelDialog();
    txtContentSchemeName.val('');
    txtContentSchemeRowNo.val('');
}

function copyColumnsFromDataScheme(fromTableID, fromSchemeID, toSchemeID)
{
    var schemeInfo = getDataSchemeInfoByID(fromTableID, fromSchemeID),
        fromColumns = schemeInfo && schemeInfo.Columns ? schemeInfo.Columns : [],
        columns = fromColumns.slice(0);

    for (var i = 0; i < columns.length; i++)
    {
        columns[i].ColumnID = "";
        columns[i].SchemeID = toSchemeID;
    }
    return columns;
}

function addOneDataSchemeIntoView(tableObj, tableID, newColumnSchemeName, newColumnSchemeRowNo, fromSchemeID)
{
    var templateRowHtml = buildDataSchemeRowHtml(tableID, newColumnSchemeName, newColumnSchemeRowNo);
    $(tableObj).append(templateRowHtml);
    
    if (!!fromSchemeID)
    {
        copyDataSchemeColumnsIntoView(tableID, fromSchemeID, newColumnSchemeName);
    }
}

function buildDataSchemeRowHtml(tableID, newColumnSchemeName, newColumnSchemeRowNo)
{
    var templateRowHtml = $("#tbTemplate").find("[name=DataSchemeBlockTemplate]").get(0).outerHTML;
    templateRowHtml = templateRowHtml.replace('name="DataSchemeBlockTemplate"', '');
    templateRowHtml = templateRowHtml.replace("{$TableID}", tableID);
    templateRowHtml = templateRowHtml.replace("{$SchemeID}", newColumnSchemeName);
    templateRowHtml = templateRowHtml.replace("{$SchemeName}", newColumnSchemeName);
    templateRowHtml = templateRowHtml.replace("{$RowNo}", newColumnSchemeRowNo);
    templateRowHtml = templateRowHtml.replace("{$IsDefault}", "false");
    return templateRowHtml;
}

function copyDataSchemeColumnsIntoView(tableID, fromSchemeID,toSchemeID)
{
    var tbColumn = $('#tbColumn>tbody'),
        fromRows = getRowsFromTableByAttrs(tbColumn, { "TableID": tableID, "SchemeID": fromSchemeID }),
        copyRows = fromRows.clone();
    
    copyRows.each(function (i)
    {
        var row = $(this);
        row.attr('columnid', '');
        row.attr('schemeid', toSchemeID);
        row.find('select').each(function ()
        {
            var ddl = $(this),
                fieldText = ddl.attr('field'),
                fromDDL = fromRows.eq(i).find('[field=' + fieldText + ']'),
                fromDDLValue = fromDDL.val();
            ddl.val(fromDDLValue);
        });
        row.hide();
    });
    tbColumn.append(copyRows);
}


/*-------------- 按钮区方法   ---------------*/

function buttonTypeChangeEvent()
{
    var me = $(this),
           buttonType = me.val(),
           buttonTypeText = me.find('option[selected=selected]').text(),
           currentRow = me.closest('tr'),
           txtBtnText = currentRow.find('[field=Text]'),
           txtBtnID = currentRow.find('[field=ClientID]'),
           ddlPermission = currentRow.find('[field=Permission]'),
           targetOption = ddlPermission.find('option').filter(function (i)
           {
               return this.innerHTML == buttonTypeText;
           }),
           parentButtonID = currentRow.find('[field=ParentButtonID]').val();
    txtBtnText.val(buttonTypeText);

    ddlPermission.find('option').removeAttr('selected');
    if (targetOption.length)
    {
        targetOption.first().attr('selected', 'selected');
    }
    else
    {
        ddlPermission.find('option:first').attr('selected', 'selected');
    }

    setButtonOptImgDisplay(currentRow);

    switch (buttonTypeText)
    {
        case "新增":
            txtBtnID.val("btnAdd");
            break;
        case "修改":
            txtBtnID.val("btnEdit");
            break;
        case "导出":
            txtBtnID.val("btnExport");
            break;
        case "下拉":
            txtBtnID.val("btnMenu");
            break;
        case "保存":
            txtBtnID.val("btnSave");
            break;
        case "删除":
            txtBtnID.val("btnDelete");
            break;
        case "提交并关闭":
            txtBtnID.val("btnSaveAndClose");
            break;
        case "提交并新建":
            txtBtnID.val("btnSaveAndNew");
            break;
        case "导入":
            txtBtnID.val("btnImport");
            break;
        case "关闭":
            txtBtnID.val("btnClose");
            break;
        case "还原":
            txtBtnID.val("btnResume");
            break;
        case "撤销":
            txtBtnID.val("btnRevoke");
            break;
        case "打印":
            txtBtnID.val("btnPrint");
            break;
        case "刷新":
            txtBtnID.val("btnRefresh");
            break;
        case "环节调整":
            txtBtnID.val("btnRevision");
            break;
        default:
            txtBtnID.val('');
            break;
    }
}

function setButtonOptImgDisplay(currentRow)
{
    var $currentRow = $(currentRow),
        buttonType = $currentRow.find('[field=ButtonType]'),
        buttonTypeText = buttonType.find('option[selected]').text(),
        parentButtonID = $currentRow.find('[field=ParentButtonID]').val();

    if (buttonTypeText == "下拉")
    {
        if (!!parentButtonID)
        {
            $currentRow.find('[field=AddSubButton]').hide();
        }
        else
        {
            $currentRow.find('[field=AddSubButton]').show();
        }
    }

    if (!!parentButtonID)
    {
        buttonType.attr('disabled', 'disabled');
    }
}

function setDefaultButtons()
{
    assignButton('导出', '导出', 'btnExport', '99');
    assignButton('下拉', '视图方案', 'btnViewScheme', '100');
}

// 添加指定的按钮
function assignButton(buttonType, text, clientID, rowNo, clickEvent)
{
    addButton();
    var currentButtonRow = $('#tbButton>tbody>tr:last'),
        ddlButtonType = currentButtonRow.find('select[field=ButtonType]');

    ddlButtonType.find('option:contains(' + buttonType + ')').attr('selected', 'selected');
    ddlButtonType.trigger('change');

    currentButtonRow.find('[field=Text]').val(text);
    currentButtonRow.find('[field=ClientID]').val(clientID);
    currentButtonRow.find('[field=RowNo]').val(rowNo);
    currentButtonRow.find('[field=LinkUrl]').val(clickEvent);
}


function loadButtonList(buttons)
{
    var tbButton = $('#tbButton>tbody'),
        frag = document.createDocumentFragment(),
        tempButton,
        buttonRow,
        subButtons = [],
        tempSubButton,
        subButtonRow;

    if (buttons && buttons.length)
    {
        for (var buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++)
        {
            tempButton = buttons[buttonIndex];

            if (!!tempButton["ParentButtonID"])
            {
                subButtons.push(tempButton);
                continue;
            }

            buttonRow = buildButtonRow(tempButton);
            setButtonOptImgDisplay(buttonRow);
            frag.appendChild(buttonRow[0]);
        }
    }
    tbButton.append(frag);

    for (var subButtonIndex = 0; subButtonIndex < subButtons.length; subButtonIndex++)
    {
        tempSubButton = subButtons[subButtonIndex];
        subButtonRow = buildButtonRow(tempSubButton);
        insertSubButtonIntoList(tbButton, tempSubButton["ParentButtonID"], subButtonRow);
    }
}

function buildButtonRow(buttonInfo)
{
    var rowHtml = $("#tbTemplate").find("#trTemplateButton").get(0).outerHTML,
        rowObj = $(rowHtml);
    rowObj.attr({
        "class": (buttonInfo.RowNo - 1) % 2 == 0 ? "dg_altrow" : "dg_row",
        "areaID": buttonInfo.AreaID,
        "clientID": buttonInfo.ClientID,
        "buttonID": buttonInfo.ButtonID
    }).removeAttr('id');
    rowObj.find('[field=ButtonID]').val(buttonInfo.ButtonID);
    rowObj.find('[field=ParentButtonID]').val(buttonInfo.ParentButtonID);
    rowObj.find('[field=Text]').val(buttonInfo.Text);
    rowObj.find('[field=ClientID]').val(buttonInfo.ClientID);
    rowObj.find('[field=ButtonType]').val(buttonInfo.ButtonType);
    rowObj.find('[field=ModName]').val(buttonInfo.ModName);
    rowObj.find('[field=ModID]').val(buttonInfo.ModID);
    rowObj.find('[field=ModName]').val(buttonInfo.ModName);
    rowObj.find('[field=Permission]').val(buttonInfo.Permission);
    rowObj.find('[field=LinkUrl]').val(buttonInfo.LinkUrl);
    buttonInfo.Visible && rowObj.find('[field=Visible]').attr('checked', 'checked');
    rowObj.find('[field=RowNo]').val(buttonInfo.RowNo);

    if (!!buttonInfo.ParentButtonID)
    {
        rowObj.find('[field=AddSubButton]').hide();
    }

    setButtonOptImgDisplay(rowObj);
    //rowObj.find('[field=ButtonType]').trigger('change');

    return rowObj;
}

function deleteButton(clickObj)
{
    var tbButton = $("#tbButton>tbody"),
        clickedRow = $(clickObj).closest('tr'),
        currentButtonID = clickedRow.find('[field=ButtonID]').val(),
        currentParentButtonID = clickedRow.find('[field=ParentButtonID]').val(),
        subButtonRows = tbButton.find('>tr input[field=ParentButtonID][value=' + currentButtonID + ']').closest('tr');

    if (subButtonRows.length)
    {
        if (confirm('删除该按钮将同时删除其子按钮，是否删除？'))
        {
            subButtonRows.remove();
        }
        else
        {
            return false;
        }
    }

    deleteCurrentRow(clickObj);

    if (!!currentParentButtonID)
    {
        var brotherButtonRows = tbButton.find('>tr input[field=ParentButtonID][value=' + currentParentButtonID + ']').closest('tr'),
            lastBrotherButtonRow = brotherButtonRows.last();
   
        lastBrotherButtonRow.find('[field=TreeItemLastImg]').show();
        lastBrotherButtonRow.find('[field=TreeItemImg]').hide();
    }
}

//新增按钮
function addButton()
{
    var tbButton = $("#tbButton>tbody"),
        rowCount = tbButton.get(0).rows.length - 1,
        newRowNo = rowCount + 1,
        newButtonObj = createNewButtonJsonObj(newRowNo),
        buttonRow = buildButtonRow(newButtonObj);
    tbButton.append(buttonRow);
}

function addSubButton(btnObj)
{
    var clickedRow = $(btnObj).closest('tr'),   
        currentButtonID = clickedRow.find('[field=ButtonID]').val(),
        tbButton = $("#tbButton>tbody"),
        rowCount = tbButton.find('>tr input[field=ParentButtonID][value=' + currentButtonID + ']').length,
        newRowNo = rowCount + 1,   
        newButtonObj = createNewButtonJsonObj(newRowNo);

    newButtonObj["ParentButtonID"] = currentButtonID; 
    var buttonRow = buildButtonRow(newButtonObj);
    $(buttonRow).find('[field=ButtonType]').attr('disabled', 'disabled');
    

    insertSubButtonIntoList(tbButton,currentButtonID,buttonRow);
}

function insertSubButtonIntoList(list, parentButtonID,subButtonRow)
{
    var tbButton = $(list),
        $subButtonRow = $(subButtonRow),
        parentButtonRow = tbButton.find('>tr input[field=ButtonID][value=' + parentButtonID + ']').closest('tr'),
        subButtonRows = tbButton.find('>tr input[field=ParentButtonID][value=' + parentButtonID + ']').closest('tr'),
        lastSubButtonRow = subButtonRows.last();
  
    lastSubButtonRow.find('[field=TreeItemImg]').show();
    lastSubButtonRow.find('[field=TreeItemLastImg]').hide();
    $subButtonRow.find('[field=TreeItemLastImg]').show();

    // 若父按钮存在其他子按钮，则在最后一个子按钮后插入新的子按钮，否则在父按钮后插入子按钮
    lastSubButtonRow.length ? lastSubButtonRow.after($subButtonRow) : parentButtonRow.after($subButtonRow);
}

function createNewButtonJsonObj(rowNo)
{
    return {
        ButtonID: getNewID(),
        AreaID: "",
        ParentButtonID: "",
        ClientID: "",
        Text: "",
        ButtonType: "",
        Permission: "",
        Visible: true,
        LinkUrl: "",
        RowNo: rowNo
    };
}

function getButtons()
{
    var buttons = [];
    $("#tbButton>tbody>tr:gt(0)").each(function (i)
    {
        var row = $(this);
        buttons.push(
        {
            ButtonID: row.attr("buttonID"),
            AreaID: row.attr("areaID"),
            ParentButtonID: row.find("[field=ParentButtonID]").val(),
            ClientID: row.find("[field=ClientID]").val(),
            Text: row.find("[field=Text]").val().Trim(),
            ButtonType: row.find("[field=ButtonType]").val(),
            ModID: row.find("[field=ModID]").val(),
            ModName: row.find("[field=ModName]").val(),
            Permission: row.find("[field=Permission]").val(),
            Visible: row.find("[field=Visible]").attr("checked") == 'checked',
            LinkUrl: row.find("[field=LinkUrl]").val(),
            RowNo: row.find("[field=RowNo]").val()
        });
    });
    return buttons;
}

function showSelectPageModDialog(obj)
{
    showSelectModDialog(obj, '', function ()
    {
        resetButtonsSelectedMod();
    });
}

function showSelectSubModDialog(obj)
{
    showSelectModDialog(obj, '', function (selectBtnObj, modNode, options)
    {
        selectModForButton(selectBtnObj, modNode, options);
    });
}

function showSelectModDialog(obj,parentID,callback)
{
    var clickedObj = $(obj),
        offset = clickedObj.offset(),
        offsetLeft = offset.left,
        offsetTop = offset.top;

    currentContentSchemeDialogID = currentContentSchemeDialogID || getNewID();
    currentContentSchemeDialogID = showDialog({
        id: currentContentSchemeDialogID,
        title: "选择关联目录",
        left: +offsetLeft + 25, top: offsetTop,
        width: 250, height: 400
    });

    var option = {
        //点击项回发函数:obj点击的当前项的文档对象，options为配置对象
        linkFun: function (obj, options)
        {
            if (typeof callback == 'function')
            {
                callback(clickedObj, obj, options);
            }
        },
        $container: $("#" + currentContentSchemeDialogID + "_f"),
        IsAllRefresh: false,
        IsAutoClick: false,
        parentID:parentID,
        dataHref: "../../Admin/Config/APModel/VAPModelLeft.aspx",
        dataAction: "GetSon",
        dataInitAction: "InitTable"
    };
    dataTree.dataTree(option);

    $(document).bind('mousedown', hideSelectFilterSchemeField);
}

function selectModForButton(selectBtnObj, modNode, options)
{
    var $modNode = $(modNode),
       currentRow = $(selectBtnObj).closest('tr[buttonid]'),
       txtModName = currentRow.find('[field=ModName]'),
       hidModID = currentRow.find('[field=ModID]'),
       txtLinkUrl = currentRow.find('[field=LinkUrl]');

    txtModName.val($modNode.text());
    hidModID.val($modNode.attr('sonid'));
    txtLinkUrl.val('openWindow("[$ModUrl]",960,650);');

    hideSelectModDialog();
}

function hideSelectModDialog()
{
    cancelDialog();
    $(document).unbind('mousedown', hideSelectModDialog);
}

function resetButtonsSelectedMod()
{
    var buttonsRow = $('#tbButton>tbody>tr:gt(0)');
    buttonsRow.each(function (i, row)
    {
        cancelSelectedMod($(row).find('[field=CancelSelectedMod]'));
    });
}

function cancelSelectedMod(selectBtnObj)
{
    var currentRow = $(selectBtnObj).closest('tr[buttonid]'),
       txtModName = currentRow.find('[field=ModName]'),
       hidModID = currentRow.find('[field=ModID]'),
       txtLinkUrl = currentRow.find('[field=LinkUrl]');

    txtModName.val('');
    hidModID.val('');
    txtLinkUrl.val('');
}


/*-------------- 过滤区方法   ---------------*/
function getFilterSchemeInfoByID(filterID)
{
    if (filterSchemes && filterSchemes.length)
    {
        for (var i = 0; i < filterSchemes.length; i++)
        {
            if (filterSchemes[i].FilterID == filterID)
            {
                return filterSchemes[i];
            }
        }
    }
    return null;
}


function buildNewFilterSchemeDialog()
{
    currentContentSchemeDialogID = currentContentSchemeDialogID || getNewID();
    bindCopyFromFilterSchemesDDL();
    currentContentSchemeDialogID = showDialog({
        id: currentContentSchemeDialogID,
        title: "新增方案",
        html: $("#divFilterScheme").html(),
        width: 400, height: 250
    });
}
function bindCopyFromFilterSchemesDDL()
{
    var ddlCopyFromFilterScheme = $('#ddlCopyFromFilterScheme');
    // 先获取全部过滤方案信息
    cacheAllFilterSchemeColumns();

    var schemes = filterSchemes;
    bindSchemesToDDL(ddlCopyFromFilterScheme[0], schemes);
}

// 加载过滤区条件列表
function loadFilterColumnList(filterInfo)
{
    var tbFilter = $('#tbFilter>tbody'),
        frag = document.createDocumentFragment(),
        tempScheme, tempFilter;

    if (filterInfo && filterInfo.length)
    {
        for (var schemeIndex = 0; schemeIndex < filterInfo.length; schemeIndex++)
        {
            tempScheme = filterInfo[schemeIndex];
            for (var filterIndex = 0; filterIndex < tempScheme.Filters.length; filterIndex++)
            {
                tempFilter = tempScheme.Filters[filterIndex];
                filterRow = buildFilterRow(tempFilter);
                frag.appendChild(filterRow[0]);
            }
        }
    }
    tbFilter.append(frag);
}

function initialFilterAreaInfo()
{
    var scheme = filterSchemes && filterSchemes.length ? filterSchemes[0] : {};
    $('#spnFilterSchemeName').text(scheme.SchemeName || "");
    showFilterSchemeFilters(scheme);
}

//新增过滤条件
function addFilterColumn()
{
    var tbFilter = $("#tbFilter>tbody"),
        scheme = getCurrentFilterSchemeInfo(),
        schemeRowsCount = getRowsFromTableByAttrs(tbFilter,
        {
            "SchemeID": scheme.SchemeID
        }).length,
        newRowNo = schemeRowsCount + 1,
        newColumnObj = createNewFilterJsonObj(scheme.SchemeID, newRowNo),
        filterRow = buildFilterRow(newColumnObj);   
    tbFilter.append(filterRow);
}

function createNewFilterJsonObj( schemeID, rowNo)
{
    return {
        FilterID: "",
        SchemeID: schemeID,
        AreaID: "",
        ClientID: "",
        Title: "",
        ControlPath: "",
        FilterClip: "",
        IsFilterEmpty: false,
        Visible: true,
        RowNo: rowNo,
        FilterParamName: "",
        DefaultValue: ""
    };
}

function buildFilterRow(filterInfo)
{
    var rowHtml = $("#tbTemplate").find("#trTemplateFilter").get(0).outerHTML,
        rowObj = $(rowHtml);
    rowObj.attr({
        "class": (filterInfo.RowNo - 1) % 2 == 0 ? "dg_altrow" : "dg_row",
        "areaID": filterInfo.AreaID,
        "clientID": filterInfo.ClientID,
        "schemeID": filterInfo.SchemeID,
        "filterID": filterInfo.FilterID
    }).removeAttr('id');;
    rowObj.find('[field=Title]').val(filterInfo.Title);
    rowObj.find('[field=ControlPath]').val(filterInfo.ControlPath);
    rowObj.find('[field=FilterParamName]').val(filterInfo.FilterParamName);
    rowObj.find('[field=DefaultValue]').val(filterInfo.DefaultValue);
    rowObj.find('[field=FilterClip]').val(filterInfo.FilterClip);
    filterInfo.IsFilterEmpty && rowObj.find('[field=IsFilterEmpty]').attr('checked', 'checked');
    filterInfo.EnabledSchemePassValue && rowObj.find('[field=EnabledSchemePassValue]').attr('checked', 'checked');
    filterInfo.Visible && rowObj.find('[field=Visible]').attr('checked', 'checked');
    rowObj.find('[field=RowNo]').val(filterInfo.RowNo);
    return rowObj
}

function selectControlPath(obj)
{
    var txtControlPath = $(obj).closest('tr').find("[field=ControlPath]"),
        oriPath = txtControlPath.text(),
        url = '../../Admin/Maintenance/VSelectPage.aspx?StartPath=' + encodeURI('\\Common\\CustomPage\\FilterControls'),
        controlPath = openModalWindow(url, 500, 500),
        baseDirectoryPath = $('#hidBaseDirectoryPath').val();

    if (controlPath != undefined)
    {
        controlPath = controlPath.replace(baseDirectoryPath, '\\');
        controlPath = controlPath.replace(/\\/g, "/");
        controlPath = "~" + controlPath;

        if (controlPath != oriPath)
        {
            txtControlPath.val(controlPath);
        }
    }   
}

//获取过滤数据
function getFilterSchemes()
{
    cacheAllFilterSchemeColumns();
    return filterSchemes;
}

function cacheAllFilterSchemeColumns()
{
    var container = $('#tbFilter'),
        schemeCount = filterSchemes.length,
        tempScheme, tempSchemeColumns, tempColumnRows;
    
    if (filterSchemes && filterSchemes.length)
    {
        for (var schemeIndex = 0; schemeIndex < schemeCount; schemeIndex++)
        {
            tempSchemeColumns = [];
            tempScheme = filterSchemes[schemeIndex];

            tempColumnRows = getRowsFromTableByAttrs(container, { "SchemeID": tempScheme.SchemeID });
            $(tempColumnRows).each(function (i, r)
            {
                tempSchemeColumns.push(getFilterSchemeColumnInfoFromRow(r));
            });
            tempScheme.Filters = tempSchemeColumns;
        }
    }
}

function getFilterSchemeColumnInfoFromRow(row)
{
    var row = $(row),
        column =
        {
            FilterID: row.attr("filterID"),
            SchemeID: row.attr("schemeID"),
            AreaID: row.attr("areaID"),
            ClientID: row.attr("clientid"),
            Title: row.find("[field=Title]").val().Trim(),
            ControlPath: row.find("[field=ControlPath]").val(),
            FilterClip: row.find("[field=FilterClip]").val().Trim(),
            IsFilterEmpty: row.find("[field=IsFilterEmpty]").attr("checked") == 'checked',
            EnabledSchemePassValue: row.find("[field=EnabledSchemePassValue]").attr("checked") == 'checked',
            Visible: row.find("[field=Visible]").attr("checked") == 'checked',
            RowNo: row.find("[field=RowNo]").val(),
            FilterParamName: row.find("[field=FilterParamName]").val(),
            DefaultValue: row.find("[field=DefaultValue]").val()
        };
    return column;
}

function submitFilterScheme()
{
    var contentSchemeDialog = $('#' + currentContentSchemeDialogID),
        ddlCopyFromFilterScheme = contentSchemeDialog.find('#ddlCopyFromFilterScheme'),
        txtNewFilterSchemeName = contentSchemeDialog.find("#txtNewFilterSchemeName"),
        txtNewFilterSchemeRowNo = contentSchemeDialog.find("#txtNewFilterSchemeRowNo"),
        copyFromSchemeID = ddlCopyFromFilterScheme.val(),
        newSchemeName = txtNewFilterSchemeName.val(),
        newSchemeRowNo = txtNewFilterSchemeRowNo.val(),
        table = $("#divFilterSchemeSelector table[name=FilterSchemeContent]>tbody"),
        filters = [];

    // 验证数据有效性
    if (!isFilterSchemeValid('add', '', txtNewFilterSchemeName, txtNewFilterSchemeRowNo))
    {
        return false;
    }

    filters = !!copyFromSchemeID ? [] : copyFiltersFromFilterScheme(copyFromSchemeID, newSchemeName);

    // 保存数据至缓存
    addFilterSchemeCache(newSchemeName, newSchemeRowNo, filters);
    // 页面中显示增加的方案
    addOneFilterSchemeIntoView(table, newSchemeName, newSchemeRowNo, copyFromSchemeID);
    // 关闭对话框
    cancelDialog();
    txtNewFilterSchemeName.val('');
    txtNewFilterSchemeRowNo.val('');
}

function copyFiltersFromFilterScheme(fromSchemeID, toSchemeID)
{
    var schemeInfo = getFilterSchemeInfoByID(fromSchemeID),
        fromFilters = schemeInfo && schemeInfo.Filters ? schemeInfo.Filters : [],
        filters = fromFilters.slice(0);

    for (var i = 0; i < filters.length; i++)
    {
        filters[i].FilterID = "";
        filters[i].SchemeID = toSchemeID;
    }
    return filters;
}

function addOneFilterSchemeIntoView(tableObj, newSchemeName, newSchemeRowNo, fromSchemeID)
{
    var templateRowHtml = buildFilterSchemeRowHtml(newSchemeName, newSchemeRowNo);
    $(tableObj).append(templateRowHtml);

    if (!!fromSchemeID)
    {
        copyFilterSchemeColumnsIntoView(fromSchemeID, newSchemeName);
    }
}

function buildFilterSchemeRowHtml(newColumnSchemeName, newColumnSchemeRowNo)
{
    var templateRowHtml = $("#tbTemplate").find("[name=FilterSchemeBlockTemplate]").get(0).outerHTML;
    templateRowHtml = templateRowHtml.replace('name="FilterSchemeBlockTemplate"', '');
    templateRowHtml = templateRowHtml.replace("{$SchemeID}", newColumnSchemeName);
    templateRowHtml = templateRowHtml.replace("{$SchemeName}", newColumnSchemeName);
    templateRowHtml = templateRowHtml.replace("{$RowNo}", newColumnSchemeRowNo);
    templateRowHtml = templateRowHtml.replace("{$IsDefault}", newColumnSchemeRowNo);
    return templateRowHtml;
}

function copyFilterSchemeColumnsIntoView(fromSchemeID, toSchemeID)
{
    var tbFilter = $('#tbFilter>tbody'),
        fromRows = getRowsFromTableByAttrs(tbFilter, { "SchemeID": fromSchemeID }),
        copyRows = fromRows.clone();

    copyRows.each(function (i)
    {
        var row = $(this);
        row.attr('filterid', '');
        row.attr('schemeid', toSchemeID);
        row.find('select').each(function ()
        {
            var ddl = $(this),
                fieldText = ddl.attr('field'),
                fromDDL = fromRows.eq(i).find('[field=' + fieldText + ']'),
                fromDDLValue = fromDDL.val();
            ddl.val(fromDDLValue);
        });
        row.hide();
    });
    tbFilter.append(copyRows);
}

function rebindFilterSchemeDDL()
{
    var ddls = $('#tbScheme select[field=filterScheme]'),
        newDDLHtml = buildFilterSchemeDDLOptionsHtml();
    ddls.each(function (i)
    {
        var me = $(this),
             originalVal = me.val();
        me.html(newDDLHtml);
        me.val(originalVal);
    });
}

function buildFilterSchemeDDLOptionsHtml()
{
    var filterSchemeHTML = "";
    for (i = 0; i < filterSchemes.length; i++)
    {
        filterSchemeHTML += "<option value='" + filterSchemes[i].SchemeID + "'>" + filterSchemes[i].SchemeName + "</option>";
    }
    return filterSchemeHTML;
}

function toggleSelectFilterSchemeField()
{
    var divSelectFilterScheme = $('#divSelectFilterScheme');

    if (divSelectFilterScheme.css('display') == 'none')
    {
        showSelectFilterSchemeField();
    }
    else
    {
        divSelectFilterScheme.hide();
    }
}

function showSelectFilterSchemeField()
{
    var divSelectFilterScheme = $('#divSelectFilterScheme');
    if (filterSchemesUpdated)
    {
        buildFilterSchemesContent();
        filterSchemesUpdated = false;
    } 
    divSelectFilterScheme.show();
    $(document).bind('mousedown', hideSelectFilterSchemeField);
}

function hideSelectFilterSchemeField()
{
    var divSelectFilterScheme = getObj('divSelectFilterScheme'),
        addSchemeDialog = getObj(currentContentSchemeDialogID),
        eventObj = getEventObj("div");

    if (!divSelectFilterScheme.contains(eventObj) && (!addSchemeDialog || !addSchemeDialog.contains(eventObj)))
    {
        //隐藏数据方案弹出层和新增数据方案层
        $(divSelectFilterScheme).hide();
        cancelDialog();
        $(document).unbind('mousedown', hideSelectFilterSchemeField);
    }
}

function buildFilterSchemesContent()
{
    var divFilterSchemeSelector = $('#divFilterSchemeSelector'),
        filterContentTemplte = $('[name=FilterBlockTemplate]'),
        contentHtml = "",
        schemesHtml = "",
        filterSchemeCount, tempScheme,
        tblSchemsContainer = document.createElement('table'),
        tbody = document.createElement('tbody'),
        tr, td,
        currentFilterSchemeInfo = getCurrentFilterSchemeInfo();

    tr = document.createElement('tr');
    td = document.createElement('td');
    td.style.cssText = 'background-color: #FFFFFF; vertical-align: top;';
    contentHtml = filterContentTemplte[0].outerHTML;
    contentHtml = contentHtml.replace('name="FilterBlockTemplate"', '');
    contentHtml = contentHtml.replace(/display: *none/gi, "");

    filterSchemeCount = filterSchemes.length;
    for (var schemeIndex = 0; schemeIndex < filterSchemeCount; schemeIndex++)
    {
        tempScheme = filterSchemes[schemeIndex];
        tempSchemeHtml = buildFilterSchemeCell(tempScheme);
        schemesHtml += tempSchemeHtml;
    }
    contentHtml = contentHtml.replace("{$SchemesHTML}", schemesHtml);
    td.innerHTML = contentHtml;
    tr.appendChild(td);
    tbody.appendChild(tr);
    tblSchemsContainer.appendChild(tbody);
    divFilterSchemeSelector.html('');
    divFilterSchemeSelector.append(tblSchemsContainer);

    selectFilterSchemeNode(currentFilterSchemeInfo);
}

function buildFilterSchemeCell(scheme)
{
    var schemeTemplate = $('[name=FilterSchemeBlockTemplate]'),
        tempSchemeHtml = "";

    tempSchemeHtml = schemeTemplate[0].outerHTML;
    tempSchemeHtml = tempSchemeHtml.replace('name="DataSchemeBlockTemplate"', '');
    tempSchemeHtml = tempSchemeHtml.replace('{$AreaID}', scheme.AreaID);
    tempSchemeHtml = tempSchemeHtml.replace('{$SchemeID}', scheme.SchemeID);
    tempSchemeHtml = tempSchemeHtml.replace('{$RowNo}', scheme.RowNo);
    tempSchemeHtml = tempSchemeHtml.replace('{$IsDefault}', scheme.IsDefault);
    tempSchemeHtml = tempSchemeHtml.replace('{$SchemeName}', scheme.SchemeName);
    tempSchemeHtml = tempSchemeHtml.replace('style="', scheme.IsDefault ? 'style="display:none;' : 'style="');
    return tempSchemeHtml;
}

function selectFilterSchemeNode(filterSchemeInfo)
{
    $('#divFilterSchemeSelector span.normalNode[field=schemeName][schemeID=' + filterSchemeInfo.SchemeID + ']')
        .click();
}

//重置过滤区
function resetFilterSchemeColumns()
{
    if (confirm("是否确认重置过滤区?确认将清空过滤区"))
    {
        var schemeInfo = getCurrentFilterSchemeInfo(),
            columnsRow = getRowsFromTableByAttrs($('#tbFilter'), { "SchemeID": schemeInfo.SchemeID });
        columnsRow.remove();
    }
}

function updateFilterSchemeName()
{
    var spnFilterSchemeName = $('#spnFilterSchemeName'),
        txtFilterSchemeName = $('#txtFilterSchemeName'),
        originalFilterSchemeName = spnFilterSchemeName.text(),
        newFilterSchemeName = txtFilterSchemeName.val(),
        currentFilterSchemeInfo = getCurrentFilterSchemeInfo();

    if (originalFilterSchemeName === newFilterSchemeName)
    {
        return true;
    }
    if (!isFilterSchemeValid('edit', originalFilterSchemeName, txtFilterSchemeName))
    {
        return false;
    }
    spnFilterSchemeName.text(newFilterSchemeName);
    updateFilterSchemeCache(currentFilterSchemeInfo.SchemeID, newFilterSchemeName);
    return true;
}

function updateFilterSchemeCache(schemeID, newSchemeName)
{
    var scheme = getFirstJsonFromArrByAttrs(filterSchemes, { "SchemeID": schemeID }),
        originalSchemeName = scheme.SchemeName,
        tbFilter = $('#tbFilter');
    scheme.SchemeName = newSchemeName;
    scheme.SchemeID = scheme.SchemeID == originalSchemeName ? newSchemeName : scheme.SchemeID;
    tbFilter.attr('currentSchemeID', scheme.SchemeID);
    filterSchemesUpdated = true;
    needRebindFilterSchemeDDL = true;
}

function removeFilterSchemeCache(schemeID)
{
    for (var i = 0; i < filterSchemes.length; i++)
    {
        if (filterSchemes[i] && filterSchemes[i].SchemeID === schemeID)
        {
            filterSchemes.splice(i, 1);
            filterSchemesUpdated = true;
            needRebindFilterSchemeDDL = true;
            break;
        }
    }
}

function addFilterSchemeCache(schemeName, rowNo, filters)
{
    if (!existFilterScheme(schemeName))
    {
        filters = isArray(filters) ? filters : [];
        filterSchemes.push({
            SchemeID: schemeName, SchemeName: schemeName,
            RowNo: rowNo, AreaID: "", IsDefault: false, Remark: "",
            Filters: filters
        });
        filterSchemesUpdated = true;
        needRebindFilterSchemeDDL = true;
    }
}

function getCurrentFilterSchemeInfo()
{
    var tbFilter = $('#tbFilter'),
        info = {
            SchemeID: tbFilter.attr('currentSchemeID')
        };
    return info;
}

function isFilterSchemeValid(editType, originalSchemeName, newSchemeNameTextbox, newSchemeRowNoTextBox)
{
    var txtFilterSchemeName = $(newSchemeNameTextbox),
        txtRowNo = $(newSchemeRowNoTextBox),
        newSchemeName = txtFilterSchemeName.val(),
        newRowNo = txtRowNo.val();

    if (!newSchemeName)
    {
        return alertMsg('请输入有效方案名称', txtFilterSchemeName[0]);
    }
    if (newSchemeName !== originalSchemeName && existFilterScheme(newSchemeName))
    {
        return alertMsg('该方案名称已存在，请重新输入', txtFilterSchemeName[0]);
    }
    if (editType.toLocaleLowerCase() === 'add' && !isPositiveInt(newRowNo))
    {
        return alertMsg('请输入有效正整数', txtRowNo[0]);
    }
    return true;
}

function existFilterScheme(schemeName)
{
    for (var i = 0; i < filterSchemes.length; i++)
    {
        if (filterSchemes[i] && filterSchemes[i].SchemeName === schemeName)
        {
            return true;
        }
    }
    return false;
}

function selectFilterScheme(obj)
{
    //显示该节点对应方案内容
    var divSelectFilterScheme = $('#divSelectFilterScheme'),
        ele = $(obj),
        schemeID = ele.attr('schemeID'),
        targetScheme = getFirstJsonFromArrByAttrs(filterSchemes, { "SchemeID": schemeID });


    // HTML里的改变
    divSelectFilterScheme.find('.selNode').removeClass('selNode').addClass('normalNode');
    ele.addClass('selNode');
    $('#spnFilterSchemeName').text(ele.text());

    // 方案加载字段信息
    showFilterSchemeFilters(targetScheme);
}

/* 加载方案字段信息
 *  通过隐藏其他方案的字段行，显示当前方案的字段行实现
 */
function showFilterSchemeFilters(scheme)
{
    if (!scheme || !scheme.Filters)
    {
        return false;
    }

    var tbFilter = $('#tbFilter'),
        filterObjs = tbFilter.find('>tbody>tr[schemeID=' + scheme.SchemeID + ']');

    tbFilter.attr({ 'currentSchemeID': scheme.SchemeID });
    tbFilter.find('>tbody>tr:gt(0)').hide();
    filterObjs.show();
}

function deleteFilterScheme(obj)
{
    var btn = $(obj),
        row = obj.parentNode.parentNode,
        schemeEle = $(row).find('[field=schemeName]'),
        schemeID = schemeEle.attr('schemeID'),
        scheme = getFirstJsonFromArrByAttrs(filterSchemes, { "SchemeID": schemeID }),
        table = row.parentNode.parentNode,
        columnsRow = getRowsFromTableByAttrs($('#tbFilter'), { "SchemeID": schemeID });

    if (columnsRow.length > 0)
    {
        if (!confirm('该方案下已设置了数据字段，删除方案将同时删除这些信息，确定要删除？'))
        {
            return false;
        }
    }
    // 删除数据方案所在tr标签
    deleteCurrentRow(obj);
    // 从缓存中移除该该方案
    removeFilterSchemeCache(schemeID);
    // 移除方案包含的列信息
    columnsRow.remove();
    // 如果之前选中的是当前方案，则删除方案后，自动选中默认方案
    if (!$(table).find('.selNode').length)
    {
        $(table).find('[field=schemeName]:eq(0)').click();
    }
}

/*-------------- 公用方法     ---------------*/
function initialAddAndEditPage()
{
    registerAddAndEditPageDomEvents();
    initialPage();
}

function initialBrowsePage()
{
    registerBrowsePageDomEvents();
    initialPage();
}


function registerAddAndEditPageDomEvents()
{
    //标签点击事件
    $("#trTab a").click(
         function ()
         {
             var index = $(this).attr("tabindex");
             selectTab(index, "TabInfo");
             $(".idtabdiv").find("table[name=tbtab]").hide();
             $(".idtabdiv").find("table[tabindex='" + index + "']").show();
             if (this.id == "hlDataConfig")
             {
                 $divContentScheme.show();
             }
             else
             {
                 $divContentScheme.hide();
             }
         }
    );
    //布局类型点击事件
    $("#rblPageType input[type=radio]").bind("click", function ()
    {
        var resolveUrl = "";

        resolveUrl = getReportUrl(this.value);

        //switch (this.value)
        //{
        //    case "1":
        //        resolveUrl = "Common/CustomPage/VReport.aspx";
        //        break;
        //    case "2":
        //        resolveUrl = "Common/CustomPage/VCustomerReport.aspx";
        //        break;
        //    case "3":
        //        resolveUrl = "Common/CustomPage/VWaitMsgList.aspx";
        //        break;
        //    case "4":
        //        resolveUrl = "Common/CustomPage/VDoneMsgList.aspx";
        //        break;
        //}
        $("#txtResolveUrl").val(resolveUrl);
        var txtPageUrl = $("#txtPageUrl");
        var pageUrl = txtPageUrl.val();
        var prePageUrl = pageUrl.split('?')[0];
        txtPageUrl.val(pageUrl.replace(prePageUrl, resolveUrl));
    });
    //移开菜单地址文本框事件
    $("#txtPageUrl").blur(function ()
    {
        $("#txtResolveUrl").val($("#txtPageUrl").val().split('?')[0]);
    });

    //新增方案事件
    $("#btnAddScheme").click(
        function ()
        {
            //组合数据区方案下拉列表
            var dataSchemeHTML = "<select style='width:100%' field='dataScheme'>" + buildDataSchemeDDLOptionsHtml() + "</select>";
            //组合过滤区方案下拉列表
            var filterSchemeHTML = "<select style='width:100%' field='filterScheme'>" + buildFilterSchemeDDLOptionsHtml() + "</select>";

            var table = $("#tbScheme>tbody");
            var templateRowHtml = $("#tbTemplate").find("#trTemplateScheme").get(0).outerHTML;
            templateRowHtml = templateRowHtml.replace("{$Class}", table.get(0).rows.length % 2 == 0 ? "dg_altrow" : "dg_row");
            templateRowHtml = templateRowHtml.replace("{$RowNo}", table.get(0).rows.length);
            templateRowHtml = templateRowHtml.replace("{$TableColumnSchemeHTML}", dataSchemeHTML);
            templateRowHtml = templateRowHtml.replace("{$FilterSchemeHTML}", filterSchemeHTML);
            table.append(templateRowHtml);
        }
    );
    //sql移开事件
    //$("#txtQueryClip").bind("blur", function ()
    //{
    //    var querySql = $("#txtQueryClip").val();
    //    queryParameters = getDataAdapterParams(querySql);
    //    loadDataAdapterParamsList(queryParameters);
    //});

    $('#spnColumnSchemeName').bind('click',
        function ()
        {
            var currentSchemeInfo = getCurrentDataSchemeInfo(),
                currentScheme = getFirstJsonFromArrByAttrs(dataSchemes, { "SchemeID": currentSchemeInfo.SchemeID }),
                me = $(this),
                txtColumnSchemeName = $('#txtColumnSchemeName');

            if (currentScheme.IsDefault == true)
            {
                return false;
            }

            me.hide();
            txtColumnSchemeName.show()
                .val(me.text())
                .bind('blur', function ()
                {
                    updateColumnSchemeName();
                    $(this).hide();
                    me.show();
                });
            txtColumnSchemeName[0].focus();
        });

    $('#spnFilterSchemeName').bind('click',
        function ()
        {
            var currentSchemeInfo = getCurrentFilterSchemeInfo(),
                currentScheme = getFirstJsonFromArrByAttrs(filterSchemes, { "SchemeID": currentSchemeInfo.SchemeID }),
                me = $(this),
                txtFilterSchemeName = $('#txtFilterSchemeName');

            if (currentScheme.IsDefault == true)
            {
                return false;
            }

            me.hide();
            txtFilterSchemeName.show()
                .val(me.text())
                .bind('blur', function ()
                {
                    updateFilterSchemeName();
                    $(this).hide();
                    me.show();
                });
            txtFilterSchemeName[0].focus();
        });

    //新增数据列表事件
    $('#spanAddDataTable').click(
        function ()
        {
            showDialog({ id: "dialogContent_f", title: "新增内容", htmlid: "divDataTableDetail", width: 400, height: 300 });
        }
    );
    //新增数据方案事件
    $('#divDataSchemeSelector').on('click', 'span[name=addDataScheme]',
       function ()
       {
           buildNewDataSchemeDialog();
       }
   );
    //新增数据方案事件
    $('#divFilterSchemeSelector').on('click', 'span[name=addFilterScheme]',
       function ()
       {
           buildNewFilterSchemeDialog();
       }
   );

    // 数据区-字段列表中
    $('#tbColumn')
        //固定列复选框事件
        .on('click', '[field=Fixed]', function ()
        {
            var me = $(this),
                isChecked = me.attr('checked') == 'checked',
                currentRow = me.closest('tr'),
                tableId = currentRow.attr('tableID'),
                schemeID = currentRow.attr('schemeID'),
                prevRows = currentRow.prevAll().filter('[tableid=' + tableId + '][schemeid=' + schemeID + ']'),
                followingRows = currentRow.nextAll().filter('[tableid=' + tableId + '][schemeid=' + schemeID + ']');

            prevRows.find('[field=Fixed]').attr('checked', 'checked');
            followingRows.find('[field=Fixed]').removeAttr('checked');
        })
        //字段类型下拉框事件
        .on('change', '[field=DbType]', function ()
        {
            var me = $(this),
                dataType = me.val(),
                currentRow = me.closest('tr'),
                txtFormat = currentRow.find('[field=Format]'),
                ddlAlign = currentRow.find('[field=Align]');

            txtFormat.removeAttr('title');

            switch (dataType)
            {
                // DateTime，
                case "1":
                    //居中
                    ddlAlign.val('1');
                    ddlAlign.attr('disabled', 'disabled');
                    //默认格式为yyyy-MM-dd
                    txtFormat.val('yyyy-MM-dd');
                    break;
                    // Number
                case "2":
                    //居右
                    ddlAlign.val('2');
                    break;
                    // Enum
                case "3":
                    //居中
                    ddlAlign.val('1');
                    ddlAlign.attr('disabled', 'disabled');
                    txtFormat.attr('title', '格式如：A:A1;B:B1;C:C1')
                    break;

                default:
                    ddlAlign.removeAttr('disabled');
                    break;
            }
        });

    $('#tbButton').on('change', '[field=ButtonType]', function ()
    {
        buttonTypeChangeEvent.call(this);
    });
}

function registerBrowsePageDomEvents()
{

}

function getUrlParam(name)
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function getReportUrl(pageType)
{
    var resolveUrl = "";
    switch (pageType)
    {
        case "1":
            resolveUrl = "Common/CustomPage/VReport.aspx";
            break;
        case "2":
            resolveUrl = "Common/CustomPage/VCustomerReport.aspx";
            break;
        case "3":
            resolveUrl = "Common/CustomPage/VWaitMsgList.aspx";
            break;
        case "4":
            resolveUrl = "Common/CustomPage/VDoneMsgList.aspx";
            break;
    }
    return resolveUrl;
}

function initialPage()
{
    $divContentScheme = $("#divContentScheme");
    $tdContentSchemeContainer = $('#tdContentSchemeContainer');
    pageID = $("#hidPageID").val();

    var pageType = getUrlParam("PageType");
    
    var rptUrl = getReportUrl(pageType);
   
    if (rptUrl != "")
    {
        //初始化默认信息
        $("#txtResolveUrl").val(rptUrl);
        if ($("#txtPageUrl").val() == "")
        {

            $("#txtPageUrl").val(rptUrl + "?PageID=" + pageID);

        }
    }
    //默认选中第一个标签
    $("#trTab a").get(0).click();
    //默认选中第一个数据方案
    $('#divDataSchemeSelector span.normalNode[field=schemeName]').get(0).click();
    //默认选中第一个过滤方案
    $('#divFilterSchemeSelector span.normalNode[field=schemeName]').get(0).click();
}

function loadPageInfo()
{
    var hidPageSettingInfo = $('#hidPageSettingInfo'),
        pageSettingInfo = $.stringToJSON(hidPageSettingInfo.val()),
        dataAdapterParamsInfo = pageSettingInfo.DataAdapter.Parameters,
        dataAdapterDefaultValueInfo,
        schemes = pageSettingInfo.Schemes,
        buttonInfo = pageSettingInfo.ButtonArea.Contents;
    
    tableCaches = pageSettingInfo.DataArea.Contents[0].Contents;
    dataSchemes = tableCaches[0].ColumnSchemes;
    filterSchemes = pageSettingInfo.FilterArea.Contents[0].Contents;
    
    dataSchemesUpdated = true;
    needRebindDataSchemeDDL = true;
    filterSchemesUpdated = true;
    needRebindFilterSchemeDDL = true;

    // 加载视图方案列表
    loadSchemesList(schemes);

    // 加载数据源的默认参数列表
    dataAdapterDefaultValueInfo = getDataAdapterDefaultValue(dataAdapterParamsInfo),
    loadDataAdapterParamsList(dataAdapterDefaultValueInfo);
    
    // 加载数据源的数据列DDL
    bindDataAdapterFieldDDL();

    // 加载数据列表
    loadDataTableInfo(tableCaches);
    loadDataColumnList(tableCaches);
    initialDataAreaInfo();

    // 加载按钮列表
    loadButtonList(buttonInfo);

    // 加载过滤列表
    loadFilterColumnList(filterSchemes);
    initialFilterAreaInfo();
}

// 新增数据方法
function insertData()
{
    var settingInfo = getData();

    if (!valid(settingInfo))
    {
        return false;
    }
    var url = getCurrentUrl();

    if (confirm("确认提交本次配置信息?"))
    {
        setBtnEnabled($("#btnSave,#btnSaveAs"), false);
        ajax(
            url,
            { ActionName: "SavePageSettings", Settings: $.jsonToString(settingInfo) },
            "json",
            function (data)
            {
                alert(data.Message);
                window.close();
            }, false);
        setBtnEnabled($("#btnSave,#btnSaveAs"), true);
    }
}


// 将方案信息绑定到下拉框
function bindSchemesToDDL(ddl, schemes)
{
    ddl.length = 0;
    addOptionAt(ddl, "", "不复制", 0);
    if (ddl && schemes && schemes.length)
    {
        for (var i = 0; i < schemes.length; i++)
        {
            tempScheme = schemes[i];
            addOptionAt(ddl, tempScheme.SchemeID, tempScheme.SchemeName, +i + 1);
        }
    }
}

// 保存数据方法
function saveData()
{
    var settingInfo = getData();
    if (!valid(settingInfo))
    {
        return false;
    }
    var url = getCurrentUrl();
    
    if (confirm("确认提交本次配置信息?"))
    {
        setBtnEnabled($("#btnSave,#btnSaveAs"), false);
        ajax(
            url,
            { ActionName: "SavePageSettings", Settings: $.jsonToString(settingInfo) },
            "json",
            function (data)
            {
                alert(data.Message);
                setBtnEnabled($("#btnSave,#btnSaveAs"), true);
            });
    }
}

// 另存为方法
function saveAsData()
{
    var settingInfo = getData('add');
    if (!valid(settingInfo))
    {
        return false;
    }
    if (confirm("确认提交本次配置信息?"))
    {
        var url = getCurrentUrl();
        ajax(
        url,
        { ActionName: "SaveAsPageSettings", Settings: $.jsonToString(settingInfo) },
        "json",
        function (data)
        {
            var responseMessage = data.Message,
                alertMessage = responseMessage.split("|")[0];
            
            if (data.IsSuccess)
            {
                var currentHref = location.href,
                    currentPageID = getParamValue("ID"),
                    newPageID = responseMessage.split("|")[1],
                    targetHref = currentHref.replace(currentPageID, newPageID);
               
                location.href = targetHref;
            }
            else
            {
                alert(alertMessage);
            }
        });
    }
}

//提交验证
function valid(settingInfo)
{
    setBtnEnabled($("#btnSave,#btnSaveAs"), false);
    //检查数据源设置是否正确 
    var flag = true;
    
    // 基本信息区非空验证
    flag = flag && isValid(getObj("tbBaseInfo"), 0,
        [
            { "field": "PageTitle", "description": "页面标题不能为空" },
            { "field": "PageUrl", "description": "页面地址不能为空" },
            { "field": "viewSchemeName", "description": "方案名称不能为空" }
    ]);
    // 数据源区非空验证
    flag = flag && isValid(getObj("tbDataAdapter"), 1,
        [
            { "field": "AdapterName", "description": "数据源名称不能为空" },
            { "field": "QueryClip", "description": "查询语句不能为空" }  //,
            //{ "field": "OrderByClip", "description": "默认排序不能为空" }
        ]);
    /*-----------   验证查询语句是否能取到数据    -------------*/
    flag && runSqlQuery(function (data)
    {
        if (!data.IsSuccess)
        {
            flag = alertMsg("查询语句错误,请调整", $("#txtQueryClip"));
        }
    }, false);

    // 脚本区非空验证
    flag = flag && isValid(getObj("tbFile"), 2,
        [
            { "field": "FilePath", "description": "关联文件路径不能为空" },
            { "field": "RowNo", "description": "行号不能为空" }
        ]);
    //数据区非空验证
    flag = flag && isValid(getObj("tbColumn"), 3,
        [
            { "field": "Text", "description": "列名不能为空" },
            { "field": "Field", "description": "数据库字段不能为空" },
            { "field": "Width", "description": "宽度不能为空" },
            { "field": "RowNo", "description": "行号不能为空" }
        ]);

    // 数据区设置验证
    flag = flag && checkDataAreaSettingValid();

    //按钮区非空验证
    flag = flag && isValid(getObj("tbButton"), 4,
        [
            { "field": "Text", "description": "按钮名称不能为空" },
            { "field": "ClientID", "description": "按钮ID不能为空" },
            { "field": "RowNo", "description": "行号不能为空" }
        ]);
    // 按钮区设置验证
    /**
     * 1. 按钮ID不能相等
     * 2. 同一个父按钮的子按钮的key不能相等
     */
    flag = flag && checkButtonAreaSettingValid();

    //过滤区非空验证
    flag = flag && isValid(getObj("tbFilter"), 5,
        [{ "field": "Title", "description": "标题不能为空" },
            { "field": "ControlPath", "description": "控件地址不能为空" },
            { "field": "FilterParamName", "description": "参数名称不能为空" },
            { "field": "RowNo", "description": "行号不能为空" },
            { "field": "FilterClip", "description": "过滤语句不能为空" }
        ]);
    
    setBtnEnabled($("#btnSave,#btnSaveAs"), true);
    return flag;
}

// 检验数据区设置是否有效
function checkDataAreaSettingValid()
{
    var valid = true; 
    //valid = valid && checkDataSchemesNotEmpty(); 
    valid = valid && checkTreeTableColumns();
    return valid;
}

function checkDataSchemesNotEmpty()
{
    var notEmpty = true;
    if (!tableCaches || !tableCaches.length)
    {
        notEmpty = alertMsg('无法找到表格信息');
    }
    for (var tableIndex = 0; tableIndex < tableCaches.length; tableIndex++)
    {
        var tempTable = tableCaches[tableIndex];

        if(tempTable && tempTable.ColumnSchemes && tempTable.ColumnSchemes.length)
        {
            for (var schemeIndex = 0; schemeIndex < tempTable.ColumnSchemes.length; schemeIndex++)
            {
                if (!tempTable.ColumnSchemes[schemeIndex] || !tempTable.ColumnSchemes[schemeIndex].Columns
                    || !tempTable.ColumnSchemes[schemeIndex].Columns.length)
                {
                    notEmpty = alertMsg(stringFormat("数据表格[{0}]的方案[{1}]中未设置任何数据列，请先设置后再保存。",
                        tempTable.TableName,
                        tempTable.ColumnSchemes[schemeIndex].SchemeName));
                    break;
                }
            }
        }
    }
    return notEmpty;
}

// 当表格类型是树时，字段中应包含ID和ParentID字段
function checkTreeTableColumns()
{
    var tableInfo = tableCaches;
    for (var tableIndex = 0; tableIndex < tableInfo.length; tableIndex++)
    {
        var currentTable = tableInfo[tableIndex];
        if (/[34]/.test(currentTable.TableType))
        {
            var schemes = currentTable.ColumnSchemes;
            for (var schemeIndex = 0; schemeIndex < schemes.length; schemeIndex++)
            {
                var currentScheme = schemes[schemeIndex];
                var schemeName = currentScheme.SchemeName;
                var existIDColumn = true;
                var existParentIDColumn = true;
                var columns = currentScheme.Columns;
                var columnsStr = $.jsonToString(columns);
                var errorMsg = '';

                existIDColumn = columnsStr.indexOf('"Field":"ID",') >= 0;
                existParentIDColumn = columnsStr.indexOf('"Field":"ParentID",') >= 0;

                if (!existIDColumn || !existParentIDColumn)
                {
                    errorMsg = stringFormat("树形列表必须包含ID和ParentID列，请添加后再提交。");
                    return alertMsg(errorMsg);
                }
            }
        }
    }
    return true;
}

// 检验按钮区设置是否有效
/**
    * 1. 按钮ID不能相等,用正则实现，用\1
    * 2. 同一个父按钮的子按钮的key不能相等
    */
function checkButtonAreaSettingValid()
{
    var tbButton = $('#tbButton>tbody>tr:gt(0)'),
        parentButtonRows = tbButton.find('[field=ParentButtonID][value=]').closest('tr'),
        parentButtonClientIDs = [],
        duplicateClientID = "",
        duplicateSubButtonKey = "",
        subButtonsObj = {},
        errorMsg = "",
        regReplaceUniqueToEmpty = /(?:([^,]*,)(?!.*\1))/g;

    parentButtonRows.each(function (i,row)
    {
        var me = $(row),
            currentButtonID = me.find('[field=ButtonID]').val(),
            currentButtonClientID = me.find('[field=ClientID]').val(),
            currentSubButtonRows = tbButton.find('[field=ParentButtonID][value=' + currentButtonID + ']').closest('tr');
        parentButtonClientIDs.push(currentButtonClientID);
        subButtonsObj[currentButtonID] = [];

        currentSubButtonRows.each(function (j,subRow)
        {
            var subMe = $(subRow),
                subButtonKey = subMe.find('[field=ClientID]').val();
            subButtonsObj[currentButtonID].push(subButtonKey);
        });
    });

    duplicateClientID = (parentButtonClientIDs.join() + ",").replace(regReplaceUniqueToEmpty, '');
    if (duplicateClientID.length > 0)
    {
        showTab(4);
        errorMsg = stringFormat("非子按钮的ID不可重复");
        return alertMsg(errorMsg);
    }

    for (var parentButtonID in subButtonsObj)
    {
        var subButtonKey = subButtonsObj[parentButtonID];
        duplicateSubButtonKey = (subButtonKey.join() + ",").replace(regReplaceUniqueToEmpty, '');
        if (duplicateSubButtonKey.length > 0)
        {
            showTab(4);
            return alertMsg("兄弟按钮间的Key不可重复");
        }
    }
    return true;
}

//parent为选项卡的内容容器的DOM对象,num为选项卡的tabindex,params为对象数组,field代表所检查对象是否为空的field,description代表对象为空时的提示信息
function isValid(parent, num, params)
{
    var parent = $(parent),
        flag = true,
        ctrls = null;

    for (j = 0; j < params.length; j++)
    {
        ctrls = parent.find("[field=" + params[j].field + "]");
        
        ctrls.each(function ()
        {
            var ctrl = $(this);
            // 当ctrl为select且没有option时，ctrl.val()为null，所以要增加容错判断
            if (!ctrl.val() || ctrl.val().Trim() == "")
            {
                flag = false;
                showTab(num);
                return alertMsg(params[j].description, ctrl[0]);
            }
        });
        if (!flag)
        {
            break;
        }
    }
    return flag;
}

function showTab(index)
{
    showData($("a[name='TabInfo']").get(index));
}

function showData(tap)
{
    var index = $(tap).attr("tabindex");

    if (index == 0)
    {
        if (needRebindDataSchemeDDL)
        {
            rebindDataSchemeDDL();
            needRebindDataSchemeDDL = false;
        }
        if (needRebindFilterSchemeDDL)
        {
            rebindFilterSchemeDDL();
            needRebindFilterSchemeDDL = false;
        }
    }
    
    selectTab(index, "TabInfo");
    $(".idtabdiv").find("table[name=tbtab]").hide();
    $(".idtabdiv").find("table[tabindex='" + index + "']").show();   
}

//删除行操作
function deleteCurrentRow(obj)
{
    var row = obj.parentNode.parentNode;
    var table = row.parentNode.parentNode;
    table.deleteRow(row.rowIndex);
}

//获取数据
function getData(editType)
{
    var settings = {},
        adapterID = $("table[adapter=Adapter]").attr("adapterid"),
        headerAreaID = $("table[areatype=Header]").attr("areaid"),
        headerClientID = $("table[areatype=Header]").attr("clientid"),
        buttonAreaID = $("table[areatype=ButtonArea]").attr("areaid"),
        buttonClientID = $("table[areatype=ButtonArea]").attr("clientid"),
        filterAreaID = $("table[areatype=FilterArea]").attr("areaid"),
        filterClientID = $("table[areatype=FilterArea]").attr("clientid"),
        bodyAreaID = $("table[areatype=DataArea]").attr("bodyareaid"),
        bodyClientID = $("table[areatype=DataArea]").attr("bodyclientid"),
        dataAreaID = $("table[areatype=DataArea]").attr("dataareaid"),
        dataClientID = $("table[areatype=DataArea]").attr("dataclientid"),
        descriptionAreaID = $('#txtDescription').attr('areaid'),
        descriptionClientID = $('#txtDescription').attr('clientid');

    settings.PageID = getObj("hidPageID").value;
    settings.Title = getObj("txtTitle").value;
    settings.PageType = $("input:radio[id*=rblPageType]:checked").val();
    settings.Remark = getObj("txtRemark").value;
    settings.ModelID = getObj("ddlModel").value;;
    settings.ResolveUrl = getObj("txtResolveUrl").value;
    settings.PageUrl = getObj("txtPageUrl").value;

    settings.ReportTemplatePath = getObj("txtReportTemplatePath").value;

    settings.IsNeedPager = $("input:radio[id*=rblIsNeedPager]:checked").val() == "Y";
    settings.ShowTree = $("input:radio[id*=rblIsTree]:checked").val() == "Y";
    settings.AdapterID = adapterID; 
    try
    {
        settings.Header =
        {
            Area: { AreaID: headerAreaID, ClientID: headerClientID, JavascriptContent: getObj("txtJsContent").value },
            Contents: getRelateFiles()
        };
    }
    catch (ex)
    {
        alert('获取header内容时出错');
        throw ex;
    }

    try
    {
        settings.ButtonArea =
        {
            Area: { AreaID: buttonAreaID, ClientID: buttonClientID },
            Contents: getButtons()
        };
    }
    catch (ex)
    {
        alert('获取button内容时出错');
        throw ex;
    }

    try
    {
        settings.FilterArea =
        {
            Area: { AreaID: filterAreaID, ClientID: filterClientID },
            Contents:
            [
                {
                    Area: {},
                    Contents: getFilterSchemes()
                }
            ]
        };
    }
    catch (ex)
    {
        alert('获取Filter内容时出错');
        throw ex;
    }
    try
    {
        settings.DescriptionArea = {
            AreaID: descriptionAreaID, ClientID: descriptionClientID,
            HtmlContent: getDescription()
        };
    }
    catch (ex)
    {
        alert('获取描述区内容时出错');
        throw ex;
    }


    try
    {
        settings.DataArea =
        {
            Area: { AreaID: bodyAreaID, ClientID: bodyClientID },
            Contents:
            [
                {
                    Area: { AreaID: dataAreaID, ClientID: dataClientID },
                    Contents: getTables()
                }
            ]
        };
    }
    catch (ex)
    {
        alert('获取data内容时出错');
        throw ex;
    }

    try
    {
        settings.DataAdapter = getDataAdapter(adapterID);
    }
    catch (ex)
    {
        alert('获取数据源内容时出错');
        throw ex;
    }
    try
    {
        settings.Schemes = getSchemes();
    }
    catch (ex)
    {
        alert('获取视图方案内容时出错');
        throw ex;
    }

    return settings;
}

function getRowsFromTableByAttrs(table, attrs)
{
    var table = $(table),        
        selectorStr = [];

    selectorStr.push('tr')
    if (attrs)
    {
        for (var i in attrs)
        {
            selectorStr.push('[' + i + '=' + attrs[i] + ']');
        }
    }
    return table.find(selectorStr.join(""));
}

function getJsonFromArrByAttrs(inputArr, attrs)
{
    var outputArr = [],
        tempCell = {};
    if (inputArr && inputArr.length && attrs)
    {
        for (var i = 0; i < inputArr.length; i++)
        {
            tempCell = inputArr[i];
            for (var key in attrs)
            {
                if (tempCell[key] == attrs[key])
                {
                    outputArr.push(tempCell);
                }
            }
        }
    }
    return outputArr;
}

function getFirstJsonFromArrByAttrs(inputArr, attrs)
{
    var outputArr = getJsonFromArrByAttrs(inputArr, attrs);
    return outputArr && outputArr.length ? outputArr[0] : {};
}


function cancelDialog()
{
    closeDialog(currentContentSchemeDialogID);
    $('#' + currentContentSchemeDialogID).remove();
    currentContentSchemeDialogID = '';
}



function disabledFormElements(containerID, customSelector, notDisabledSelector)
{
    var defaultSelector = 'input,select,button,textarea';
    var selector = !customSelector ? defaultSelector : customSelector;
    var container = null;

    if (typeof containerID === 'string')
    {
        container = $('#' + containerID);
    }
    else if (typeof containerID === 'object')
    {
        container = $(containerID);
    }
    else
    {
        container = document;
    }

    var jqDom = $(selector, container);

    // 获取要设置为disable的目标对象集合
    jqDom = !notDisabledSelector ? jqDom : jqDom.not(notDisabledSelector);
    // 清空目标对象集合的事件
    jqDom.unbind();
    jqDom.attr('readonly', 'readonly');
    // 将目标对象集合设置成disabled
    jqDom.filter('select,button,input[type=checkbox],input[type=radio],input[type=button]').attr('disabled', 'disabled');
    // 将文本框的样式改成只读的样式
    jqDom.filter('input[type=text]').removeClass().addClass('graytext');
}

/* -------------- 参数处理 --------------*/

//新增参数行
function addParam()
{
    var tbParam = $("#tbSqlParameterValue>tbody"),
        rowCount = tbParam.get(0).rows.length - 1,
        templateRowHtml = $("#tbTemplate").find("#trTemplateSqlParameter").get(0).outerHTML,
        tempRowHtml;

    tempRowHtml = $(templateRowHtml).attr({ "class": rowCount % 2 == 0 ? "dg_altrow" : "dg_row" }).remove("id");
    tbParam.append(tempRowHtml);
}

var paramData =
[
    { "AliasName": "Table", "DbParamName": "Table", "DbType": "String", "IsOutput": false, "DefaultValue": "", "Value": "" },
    { "AliasName": "Cols", "DbParamName": "Cols", "DbType": "String", "IsOutput": false, "DefaultValue": "", "Value": "" },
    { "AliasName": "Where", "DbParamName": "Where", "DbType": "String", "IsOutput": false, "DefaultValue": "", "Value": "" },
    { "AliasName": "OrderBy", "DbParamName": "OrderBy", "DbType": "String", "IsOutput": false, "DefaultValue": "", "Value": "" },
    { "AliasName": "PageIndex", "DbParamName": "PageIndex", "DbType": "Int32", "IsOutput": false, "DefaultValue": "", "Value": "" },
    { "AliasName": "PageSize", "DbParamName": "PageSize", "DbType": "Int32", "IsOutput": false, "DefaultValue": "", "Value": "" },
    { "AliasName": "StatCol", "DbParamName": "StatCol", "DbType": "String", "IsOutput": false, "DefaultValue": "", "Value": "" },
    { "AliasName": "RowCount", "DbParamName": "RowCount", "DbType": "Int32", "IsOutput": true, "DefaultValue": "", "Value": "" },
    { "AliasName": "FinalPageIndex", "DbParamName": "FinalPageIndex", "DbType": "Int32", "IsOutput": true, "DefaultValue": "", "Value": "" },
    { "AliasName": "StatValue", "DbParamName": "StatValue", "DbType": "Double", "IsOutput": true, "DefaultValue": "", "Value": "" }
]

//初始化GetPagerData的参数
function initPagerDataParams()
{
    loadDataAdapterParamsList(paramData);
}