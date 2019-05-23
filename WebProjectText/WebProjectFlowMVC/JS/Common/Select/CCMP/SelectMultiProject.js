
 //选择
function selectProject()
{

    if(getObj('hidSelectType').value == "Multi")//多选
    {
        var flag = 0;
        var repeat = 0;
        var projectTaxSetFlag = true;
        var projectID = getJQGridSelectedRowsID('jqProject', true);
        if (projectID.length == 0)
        {
            alert("没有选择任何项目。");
            return false;
        }
        var projectNo=getJQGridSelectedRowsData('jqProject',true,'ProjectNo');
        var projectName = getJQGridSelectedRowsData('jqProject',true,'ProjectName');
        var projectClass = getJQGridSelectedRowsData('jqProject',true,'ProjectClass');
        var corpName = getJQGridSelectedRowsData('jqProject',true,'CorpName');
        var region = getJQGridSelectedRowsData('jqProject',true,'Region');
        var buildArea = getJQGridSelectedRowsData('jqProject',true,'BuildArea');
        var saleArea = getJQGridSelectedRowsData('jqProject', true, 'SaleArea');
        var isAllowTaxSettings = getJQGridSelectedRowsData('jqProject', true, 'IsAllowTaxSetting');

        var action = $("#hidAction").val();
        if (action == "APContractIncProject")
        {
            //add by dinghuan @2013-06-20 当是选择应用项目时，返回项目对象，而不直接添加行数据
            //项目信息中的 NewItemFlag 标识新增的项目，用于判断是否可进行修改。
            var projectInfo = [];
            for (var i = 0; i < projectID.length; i++)
            {
                var isAllowTaxSetting = stripHtml(isAllowTaxSettings[i]);
                var taxProjectName = stripHtml(projectName[i]);
                if ($("#hidIsAllowTaxSetting").val() != isAllowTaxSetting)
                {
                 
                    projectTaxSetFlag = false;
                    break;
                }
                projectInfo.push(
                    {
                        ProjectID: stripHtml(projectID[i]),
                        ProjectName: taxProjectName,
                        ProjectClass: stripHtml(projectClass[i]),
                        CorpName: stripHtml(corpName[i]),
                        Region: stripHtml(region[i]),
                        BuildArea: getRound(stripHtml(buildArea[i])),
                        SaleArea: getRound(stripHtml(saleArea[i])),
                        NewItemFlag: true          //新增项标识，
                        
                    }
                );
            }
            if (!projectTaxSetFlag)
            {
                return alertMsg(taxProjectName + "项目与主项目的计税方法不相同，请重新选择。");
            }
            window.returnValue = projectInfo;
        }
        else
        {
            var dgProject = window.dialogArguments.dgProject;
            //用于校验项目计税方式
            for (var i = 0; i < projectID.length; i++)
            {
                var isAllowTaxSetting = stripHtml(isAllowTaxSettings[i]);
                var taxProjectName = stripHtml(projectName[i]);
                if ($("#hidIsAllowTaxSetting").val() != isAllowTaxSetting)
                {

                    projectTaxSetFlag = false;
                    break;
                }
            }
            if (!projectTaxSetFlag)
            {
                return alertMsg(taxProjectName + "项目与主项目的计税方法不相同，请重新选择。");
                 
            }

            for (var i = 0; i < projectID.length; i++)
            {
                var repeatCnt = 0;
                for (j = 1; j < dgProject.rows.length; j++)
                {
                    if (getObjTR(dgProject, j, "input", 0).value == stripHtml(projectID[i]))
                    {
                        repeatCnt++;
                        repeat++;
                    }              
                }                   
                if (repeatCnt > 0)
                {
                    continue;
                }               
                var row = dgProject.insertRow();

                var cell = row.insertCell(0);

                cell.align = "center";
                cell.innerHTML = getCheckBoxHtml(null, projectID[i]);

                cell = row.insertCell(1);
                cell.innerHTML = getHrefHtml("showProject", $.jgrid.stripHtml(projectName[i]), "showProject('" + projectID[i] + "');");

                cell = row.insertCell(2);
                cell.innerHTML = projectClass[i];

                cell = row.insertCell(3);
                cell.innerHTML = corpName[i];

                cell = row.insertCell(4);
                cell.innerHTML = region[i];
            
                cell = row.insertCell(5);
                cell.align = "right";
                cell.innerHTML = getTextBoxHtml("txtAPProjectPrimeAmount", null, "saveContractOldPrimeAmount(this);", "setMoneyValue(2);calculatorAPProjectAmount(this,'Prime')", "0.00", false, null, null, "Text", null, null, null);

                cell = row.insertCell(6);
                cell.align = "right";
                cell.innerHTML = getTextBoxHtml("txtAPProjectTaxAmount", null, "saveContractOldTaxAmount(this)", "setMoneyValue(2);calculatorAPProjectAmount(this,'Tax');", "0.00", $("#hidIsAllowTaxSetting").val() == "Y" ? false : true, null, null, "Text", null, null, null);

                cell = row.insertCell(7);
                cell.innerHTML = getTextBoxHtml("txtAPProjectAmount", null, "saveContractOldAmount(this);", "setMoneyValue(2);calculatorAPProjectAmount(this,'Total')","0.00", false, null, null, "Text", null, null, null);


                cell = row.insertCell(8);
                cell.align = "right";
                cell.innerHTML = buildArea[i];

                cell = row.insertCell(9);
                cell.align = "right";
                cell.innerHTML = saleArea[i];


                flag++;
            }
           
            if (flag == 0)
            {
                if (repeat > 0)
                {
                    alert("你不能重复添加项目。");
                }
                else
                {
                    alert("没有选择项目。");
                }
                return false;
            }
           
        }
    
    }
    else
    {
        var projectID = getJQGridSelectedRowsID('jqProject', false);     
        var projectName = $.jgrid.stripHtml(getJQGridSelectedRowsData('jqProject', false, 'ProjectName'));
        var projectNo = $.jgrid.stripHtml(getJQGridSelectedRowsData('jqProject', false, 'ProjectNo'));
        if (projectID == null || projectID == "")
        {
            return alertMsg("请选择项目。", getObj("btnChoose"));    
        }
        window.returnValue = projectID + "|" + projectName + "|" + projectNo;
    }
    window.close();
    
}
//清除
function btnClear_Click()
{
    window.returnValue = "|";
    window.close();
}

// 刷新数据
function reloadData()
{
    //add by dinghuan @2013-06-20 过滤掉已选择的项目
    var selectedIDs = "";
    if (typeof (window.dialogArguments) != "undefined" && typeof (window.dialogArguments.postData) != "undefined")
    {
        var selectedObj = window.dialogArguments.postData;
        selectedIDs = selectedObj == null ? "" : selectedObj.join(",");
    }
    var query = { KW: getObj("txtKW").value, SelectedIDs: selectedIDs };
    
    if (loadJQGrid("jqProject", query))
    {
        refreshJQGrid("jqProject");
    }
}

// 项目查看
function showProject(cellvalue, options, rowobject)
{
    var url = "'../../../CCMP/Project/VProjectBrowse.aspx?ProjectID=" + rowobject[0] + "'";
    return '<a href="javascript:openWindow(' + url + ', 600,600)">' + cellvalue + '</a>';
}

