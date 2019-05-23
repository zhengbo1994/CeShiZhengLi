/*
 * 
 * 
 */
function initialListPage()
{
    // 绑定行点击事件
    $('#tbRoleCategory tbody').on('mouseover', 'tr:gt(0)', function ()
    {
        $(this).addClass('ui-state-hover');
    }).on('mouseout', 'tr:gt(0)', function ()
    {
        $(this).removeClass('ui-state-hover');
    }).on('click', 'tr:gt(0)', function (ev)
    {
        var me = $(this),
            target = ev.target,
            rowID = me.attr('id'),
            cbk = me.find('input[type=checkbox]:eq(0)');

        if (me.attr('selected'))
        {
            me.removeAttr('selected');
        }
        else
        {
            me.attr('selected', 'selected');
        }
        me.toggleClass("ui-state-active");
        // 当允许多选时,若点击的不是复选框，则修改当前行复选框的选中状态
        if (cbk.length)
        {
            // 当点击事件的目标就是复选框时，不必再修改复选框的checked属性
            target.type != "checkbox" && cbk.prop('checked', !cbk.prop('checked'));
        }
    });
}

/*
 * 重新加载流程角色配置列表
 * 翁化青 2014-10-24
 */
function reloadData()
{
    __doPostBack('ReloadData', '');
}

/*
 * 新建角色类别
 * 翁化青 2014-10-21
 */
function addRoleCategory()
{
    var frType = $('#ddlRoleType').val();

    openAddWindow("VFlowRoleCategoryAdd.aspx?FRType=" + frType,
        450, 300, "jqSubscription");
}

/*
 * 新建角色
 * 翁化青 2014-10-22
 */
function addRole()
{
    var selectedCbk = $('#tbRoleCategory input[type=checkbox][data-main=category][checked]');
    var frcID = selectedCbk.data('frcid');
    var frcName = selectedCbk.data('frcname');

    if (selectedCbk.length == 0 || !frcID)
    {
        return alertMsg("请先选择一个角色类别。");
    }
    else if (selectedCbk.length > 1)
    {
        return alertMsg("您一次只能为一个角色类别增加角色。");
    }

    openAddWindow("VFlowRoleAdd.aspx?FRCID=" + frcID + "&FRCName=" + encodeURI(frcName), 450, 350);
}

/*
 * 编辑按钮点击事件
 * 翁化青 2014-10-21
 */
function btnEdit_Click()
{
    var selectedCbk = $('#tbRoleCategory input[type=checkbox][checked]');

    if (selectedCbk.length == 0)
    {
        return alertMsg("没有任何记录可供操作。");
    }
    else if (selectedCbk.length > 1)
    {
        return alertMsg("您一次只能操作一条记录。");
    }

    if (selectedCbk.data('main') === "category")
    {
        editRoleCategory(selectedCbk);
    }
    else if (selectedCbk.data('main') === "role")
    {
        editRole(selectedCbk);
    }
}

/*
 * 修改角色类别
 * 翁化青 2014-10-21
 * @selectedCbk object 选中的复选框
 */
function editRoleCategory(selectedCbk)
{
    var frcID = $(selectedCbk).data('frcid');
    openWindow("VFlowRoleCategoryEdit.aspx?FRCID=" + frcID, 450, 300);
}

/*
 * 修改角色
 * 翁化青 2014-10-22
 * @selectedCbk object 选中的复选框
 */
function editRole(selectedCbk)
{
    var selectedCbk = $(selectedCbk),
        frID = selectedCbk.data('frid'),
        frcID = selectedCbk.data('frcid'),
        table = selectedCbk.closest('table'),
        frcName = table.find('input[type=checkbox][data-main=category][data-frcid=' + frcID + ']').data('frcname');

    openWindow("VFlowRoleEdit.aspx?FRID=" + frID + "&FRCName=" + encodeURI(frcName), 400, 350);
}

/*
 * 删除按钮事件
 * 翁化青 2014-10-23
 */
function btnDelete_Click()
{
    var validToDelete = true;
    var errorMsg = "";

    var selectedCbks = $('#tbRoleCategory input[type=checkbox][checked]');
    if (selectedCbks.length == 0)
    {
        return alertMsg("没有任何记录可供操作。");
    }

    // 获取勾选的类别ID集合
    var categoryCbks = selectedCbks.filter('[data-main=category]');
    var frcIDs = [];
    validToDelete && categoryCbks.each(function (i, c)
    {
        var frcID = $(c).data('frcid'),
            frcName = $(c).data('frcname'),
            notDeleteSubRoleCbks = $('#tbRoleCategory input[type=checkbox][data-main=role][data-frcid=' + frcID + ']').not('[checked]');

        if (notDeleteSubRoleCbks.length > 0)
        {
            errorMsg = stringFormat('类别[{0}]还包含角色，不能被删除。', frcName);
            validToDelete = false;
            return false;
        }

        frcIDs.push($(c).data('frcid'));
    });

    // 获取勾选的角色ID集合
    var roleCbks = selectedCbks.filter('[data-main=role]');
    var frIDs = [];
    validToDelete && roleCbks.each(function (i, c)
    {
        frIDs.push($(c).data('frid'));
    });

    if (!validToDelete)
    {
        return alertMsg(errorMsg);
    }

    var allDeleteIds = frcIDs.concat(frIDs),
        url = getDeletePageUrl(0);
    if (url == "")
    {
        return alertMsg("参数错误。");
    }

    url = addUrlParams(url, {
        "Action": "FlowRoleAndCategory",
        "ID": allDeleteIds
    });

    var winobj = getOpenWinObj(2);
    window.showModalDialog(url, window, 'dialogtop=' + winobj.top + 'px;dialogleft=' + winobj.left + 'px;dialogWidth=' + winobj.width + 'px;dialogHeight='
        + winobj.height + 'px;status=1;resizable=0;scroll=0;scrollbars=0');
}

/*
 * 勾选或取消勾选全部角色类别
 * 翁化青 2014-10-23
 * @cbkObj obj 表头的全选复选框
 */
function selectAllCategories(cbkObj)
{
    var cbk = $(cbkObj),
        targetChecked = cbk.prop('checked'),
        cbksSelector = '#tbRoleCategory input[type=checkbox][data-main=category]';

    // 找出checked状态和目标checked状态不一致的复选框集合，并触发其点击事件，让其checked变为和目标一样
    cbksSelector += targetChecked ? ':not([checked])' : '[checked]';
    $(cbksSelector).click();
}

/*
 * 勾选或取消勾选全部角色类别
 * 翁化青 2014-10-23
 * @cbkObj obj 表头的全选复选框
 */
function selectAllRoles(cbkObj)
{
    var cbk = $(cbkObj),
        targetChecked = cbk.prop('checked'),
        cbksSelector = '#tbRoleCategory input[type=checkbox][data-main=role]';

    // 找出checked状态和目标checked状态不一致的复选框集合，并触发其点击事件，让其checked变为和目标一样
    cbksSelector += targetChecked ? ':not([checked])' : '[checked]';
    $(cbksSelector).click();
}

/*
 * 选择默认职位方法
 * 翁化青 2014-10-23
 */
function selectPosition(PositionName, Positionid)
{
    var rValue = openModalWindow('../../Common/Select/CheckFlow/VSelectSinglePosition.aspx', 800, 600);
    if (!rValue) { return; }
    getObj(PositionName).value = rValue.split("|")[1];
    getObj(Positionid).value = rValue.split("|")[0];
}

/*
 * 验证角色类别的新增、修改操作时的表单数据是否有效
 * 翁化青 2014-10-22
 */
function validateCategoryData()
{
    return validateData(function ()
    {
        if ($('#txtFRCName').val().length > 10)
        {
            return alertMsg("角色类别名称长度请不要超过10个字符。", $('#txtFRCName')[0]);
        }
        return true;
    });
}

/*
 * 验证角色的新增、修改操作时的表单数据是否有效
 * 翁化青 2014-10-22
 */
function validateRoleData()
{
    return validateData(function ()
    {
        if ($('#txtFRName').val().length > 10)
        {
            return alertMsg("角色名称长度请不要超过10个字符。", $('#txtFRName')[0]);
        }
        return true;
    });
}

/*
 * 验证新增、修改操作时的表单数据是否有效
 * 翁化青 2014-10-21
 * @subValidFn function 子级验证方法
 */
function validateData(subValidFn)
{
    var isValid = true;
    handleBtn(false);
    if ($.ideaValidate())
    {
        if (typeof subValidFn === "function")
        {
            isValid = isValid && subValidFn();
        }
    }
    else
    {
        isValid = false;
    }
    handleBtn(true);
    return isValid;
}

/*
 * 控制按钮是否可用
 * 翁化青 2014-10-21
 * @enabled bool 是否可用
 */
function handleBtn(enabled)
{
    setBtnEnabled(getObj("btnSaveOpen"), enabled);
    setBtnEnabled(getObj("btnSaveClose"), enabled);
}

/*
 * 设置角色的岗位
 * 翁化青 2014-10-24
 * @frID string 角色ID
 */
function setRoleConfigStation(settingObj) {
    var currentRow = $(settingObj).closest('tr'),
        frID = currentRow.data('frid'),
        roleType = $('#ddlRoleType').val(),
        ddlOwner = $('#ddlOwner'),
        ownerID = ddlOwner.val(),
        url = '../../Common/Select/VSelectMultiStation.aspx?Aim=Multi',
        urlParams = {};

    if (!ownerID) {
        return alertMsg("请先选择公司/项目", ddlOwner[0]);
    }

    if (roleType == "0")
    {
        urlParams = { "CorpID": ownerID };
    }
    else if (roleType == "1")
    {
        urlParams = {
            "From": "Project",
            "CorpID": ownerID
        };
    }
    url = addUrlParams(url, urlParams);

    // 必须缓存角色的岗位设置信息后， 岗位选择页才能获取到已选岗位信息。
    cacheRoleStationInfo(frID);
    
    url = addUrlParams(url, {
        "strStationID": 'hidStationIDs',
        "strStation": 'hidStationNames'
    });

    var vValue = openModalWindow(url, 0, 0);

    if (vValue != "undefined" && vValue != null)
    {
        stationIDs = vValue.split('|')[0];
        saveRoleConfig(ownerID, frID, stationIDs);
    }
}

/*
 * 获取已存在的岗位集合
 * 翁化青 2014-10-27
 * @frID string 角色ID，通过这个获取已设置的岗位集合。
 */
function cacheRoleStationInfo(frID)
{
    var roleRow = $('tr[data-main=role][data-frid=' + frID + ']'),
        stationObjs = roleRow.find('span[data-main=station]'),
        stationIDArr = [],
        stationNameArr = [],
        stationIDBuffer = $('#hidStationIDs'),
        stationNameBuffer = $('#hidStationNames');
    
    stationObjs.each(function (i, s)
    {
        stationIDArr.push($(s).data('stationid'));
        stationNameArr.push(trim(s.innerHTML));
    });
    stationIDBuffer.val(stationIDArr.join());
    stationNameBuffer.val(stationNameArr.join(''));
}

/*
 * 保存角色的岗位设置
 * 翁化青 2014-10-24
 * @ownerID string 公司或项目ID
 * @frID string 角色ID
 * @stationIDs array-type-string 逗号分隔的岗位ID集合字符串
 */
function saveRoleConfig(ownerID, frID, stationIDs)
{
    var url = getCurrentUrl(),
		 data = {
		     "Action": "SaveFlowRoleConfig",
		     "OwnerID": ownerID,
		     "FRID": frID,
		     "StationIDs": stationIDs
		 };
    
    ajax(url,
        data,
        'json',
        function (data, textStatus)
        {
            if (data.IsSuccess)
            {
                reloadData();
            }
            else
            {
                return alertMsg(data.Message);
            }
        }, false, "POST"
    );
}