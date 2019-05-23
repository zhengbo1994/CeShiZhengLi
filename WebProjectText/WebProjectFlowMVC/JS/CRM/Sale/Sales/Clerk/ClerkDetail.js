// 加载业务员列表
function loadClerkDetailList()
{
	var url = getCurrentUrl(),
        strID = getParamValue('ClerkInfoContainer'),
        win = !!window.dialogArguments ? window.dialogArguments : window,
        ClerkDetailInfoContainer = $('#' + strID, win.document),
        ClerkDetailInfo = $.parseJSON(ClerkDetailInfoContainer.val());

	bindClerkDetailList(ClerkDetailInfo);
}

// 根据业务员信息绑定业务员列表
function bindClerkDetailList(listInfo)
{
	if (!listInfo || !listInfo.length)
	{
		return false;
	}

	var tb = $('#tbClerkList tbody'),
        tr, td,
        frag = document.createDocumentFragment();

	clearTable(tb[0], 1);

	for (var i = 0; i < listInfo.length; i++)
	{
		tr = buildClerklListItem(listInfo[i]);

		frag.appendChild(tr);
	}
	tb.append(frag);
}

// 根据单个业务员信息构造业务员列表的行对象
function buildClerklListItem(item)
{
	if (!item)
	{
		return false;
	}
	var tr, td;
	tr = document.createElement("tr");

	td = document.createElement("td");
	td.style.textAlign = "center";
	td.innerHTML = "<input type='checkbox' onclick='selectRow(this)' guid='" + item.AccountGUID + "' />";

	tr.appendChild(td);

	// 业务员
	td = document.createElement("td");
	td.innerHTML = item.EmployeeName;
	tr.appendChild(td);

	// 分摊比例
	td = document.createElement("td");
	td.style.textAlign = "right";
	td.innerHTML = createApportionmentRateTextBox(item.ApportionmentRate);
	tr.appendChild(td);

	// 说明
	td = document.createElement("td");
	td.style.textAlign = "right";
	td.innerHTML = createRemarkTextBox(item.Remark);
	tr.appendChild(td);

	return tr;
}

// 创建折扣率文本框，返回html
function createApportionmentRateTextBox(ApportionmentRate)
{
	// 折扣方法取值为：（ 1 打折 2 减点 3 总价优惠 4 单价优惠 ），当ClerkType（折扣方法)为1、2时，文本框可修改，否则只读。
	var strOnblurEvent = 'setRound(2);CheckCurrentApportionmentRateIsValid(this);';

	return getTextBoxHtml(null, null, null, strOnblurEvent, ApportionmentRate, false, null, 'right');
}

// 创建说明文本框，返回html
function createRemarkTextBox(remark)
{
	return getTextBoxHtml(null, null, null, null, remark, false);
}

// 增加业务员按钮事件
function btnAddClerk_Click()
{
	// 先缓存已选的业务员ID集合
	cacheExistClerkDetailGUIDs();

	var strProjectGUID = getParamValue('ProjectGUID'),
        ClerkInfo = openModalWindow('../../../../Common/Select/VSelectAccount.aspx?ProjectGUID=' + strProjectGUID
            + '&hidIDs=hidExistIDs', 800, 600);
	
	var tb = $('#tbClerkList tbody');

	addClerks(tb, ClerkInfo);
}

// 删除业务员按钮事件
function btnDeleteClerk_Click()
{
	deleteTableRow(getObj('tbClerkList'));
}

// 缓存已选的业务员ID集合
function cacheExistClerkDetailGUIDs()
{
	var tb = $('#tbClerkList tbody'),
     hidExistIDs = $('#hidExistIDs');

	var idArr = [],
        cbks = tb.find('tr td input[type=checkbox]');

	if (cbks.length)
	{
		cbks.each(function (i, o)
		{
			idArr.push(o.guid);
		});
	}

	hidExistIDs.val(idArr.join());
}

// 添加业务员（一或多名）信息至页面中
function addClerks(table, listInfo)
{
	var packedListInfo = packingClerkInfo(listInfo);
	if (!packedListInfo || !packedListInfo.length)
	{
		return false;
	}
	for (var i = 0; i < packedListInfo.length; i++)
	{
		if (!checkClerkExist(packedListInfo[i].AccountGUID))
		{
			insertClerkDetailItemIntoList(table, packedListInfo[i]);
		}
	}
}

// 将选择页返回的业务员信息打包成所需的格式并返回
function packingClerkInfo(originalClerkInfo)
{
	var IDs = originalClerkInfo.IDS,
		names = originalClerkInfo.Names,
		IDArr = IDs.split(','),			// ID使用半角逗号分隔
		nameArr = names.split('，'),	// Name使用全角逗号分隔
		defaultApportionmentRate = "0.00",
		defaultRemark = "",
		packedClerkInfo = [];
	
	for (var i = 0; i < IDArr.length; i++)
	{
		packedClerkInfo.push({
			AccountGUID: IDArr[i],
			EmployeeName: nameArr[i].substr(0,nameArr[i].indexOf('(')),
			ApportionmentRate: defaultApportionmentRate,
			Remark: defaultRemark
		});
	}
	return packedClerkInfo;
}

// 检测业务员ID时候已添加到列表中
function checkClerkExist(clerkGUID)
{
	var regGUID = new RegExp(clerkGUID, "i"),
		clerkInfoCbks = $('#tbClerkList>tbody>tr input[type=checkbox]').filter(function ()
		{
			return regGUID.test(this.guid);
		});

	return clerkInfoCbks.length > 0;
}

// 根据业务员的序号获取在列表中的插入位置
function findInsertionPositionByRankNo(table, rankNo)
{
	if (isNaN(rankNo) || parseInt(Number(rankNo)) !== parseFloat(Number(rankNo)))
	{
		throw new Error("业务员序号无效。");
	}

	var cbks = $(table).find('tr td input[type=checkbox]'),
        targetIndex = -1;

	if (cbks.length > 0)
	{
		cbks.each(function (i, o)
		{
			if (o.rankNo > rankNo)
			{
				targetIndex = i;
				return false;
			}
		});
	}

	return targetIndex;
}

// 将单个业务员插入到折扣明细列表中
function insertClerkDetailItemIntoList(table, item)
{
	if (!table || !item)
	{
		return false;
	}

	var insertionPosition = $(table).find('> tr').length,
		row = buildClerklListItem(item);

	insertRowIntoTable(table, row, insertionPosition);
}

// 将tr对象按传入的index插入table中。若index不在有效索引区域，如小于0或大于length，则将tr直接加在table的末尾
function insertRowIntoTable(table, row, index)
{
	var tb = $(table), r = $(row);

	if (!tb.length || !r.length
    || isNaN(index) || parseInt(Number(index)) !== parseFloat(Number(index)))
	{
		return false;
	}

	var rowCount = tb.find('tr').length,
        closestRow;

	if (index < 0 || index >= rowCount)
	{
		tb.append(r);
	}
	else
	{
		closestRow = tb.find('tr:eq(' + index + ')');
		r.insertBefore(closestRow);
	}
}

// 判断全部业务员的分摊比例之和是不是100%
function CheckCurrentApportionmentRateIsValid(txtObj)
{
	if (!txtObj)
	{
		return false;
	}
	if(txtObj>100 || txtObj<0)
	{
		return alertMsg("请输入0.00到100.00之间的数值");
	}
}

// 判断全部业务员的分摊比例之和是不是100%
function IsApportionmentRateValid()
{
	var trClerk =  $('#tbClerkList>tbody>tr:gt(0)'),
		txtAppointmentRate,
		sumOfAllAppointmentRate = 0;

	trClerk.each(function (i, tr)
	{
		txtAppointmentRate = $(tr).find('td:eq(2) input[type=text]');
		sumOfAllAppointmentRate = accAdd(sumOfAllAppointmentRate, txtAppointmentRate.val());
	});

	return Number(sumOfAllAppointmentRate) === 100;
}

// 获取业务员设置信息
function getClerkDetailItemRowInfo(tr)
{
	tr = $(tr);

	var cbk = tr.find('td:eq(0) input[type=checkbox]'),
        clerkAccountGUID = cbk.attr('guid'),
        clerkEmployeeName = tr.find('td:eq(1)').text(),
        apportionmentRate = tr.find('td:eq(2) input[type=text]').val(),
        remark = tr.find('td:eq(3) input[type=text]').val();

	return {
		AccountGUID: clerkAccountGUID,
		EmployeeName: clerkEmployeeName,
		ApportionmentRate: apportionmentRate,		 
		Remark: remark
	};
}

// 折扣明细页确认按钮事件，点击后将折扣信息返回到父页面
function btnSaveClose_Click()
{
	if (!IsApportionmentRateValid())
	{
		return alertMsg('各业务员分摊比例总和应该为100，请重新录入。');
	}

	var clerkDetailArr = [],
		clerkDetailItem = {},
        tb = $('#tbClerkList tbody'),
        trs = tb.find('tr:gt(0)'),
        spnClerkDescription = $('#spnClerkDescription');

	trs.each(function (i, tr)
	{
		clerkDetailItem = getClerkDetailItemRowInfo(tr);
		clerkDetailArr.push(clerkDetailItem);
	});

	window.returnValue = clerkDetailArr;
	window.close();
}