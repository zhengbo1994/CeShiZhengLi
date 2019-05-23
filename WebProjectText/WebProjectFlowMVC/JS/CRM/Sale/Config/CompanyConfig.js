// VCompanyConfig.aspx用到的js

//修改加载时JS错误，  修改时间：2013-05-06   修改人：杨亮
$(document).ready(function () {
    setDisplay();
});


// 控件显隐
function setDisplay() {
    var rblTotalPriceGetMode = getObj("rblTotalPriceGetMode");

    if (!jQuery.isEmptyObject(rblTotalPriceGetMode)) {
        var TotalPriceGetMode = getObjC(rblTotalPriceGetMode, "input", 0).checked;
        getObj("trPrice3").style.display = TotalPriceGetMode ? "" : "none";
    }

    //    if (rblUseOffice)
    //    {
    //        var TotalPriceGetMode = getObjC(rblTotalPriceGetMode, "input", 0).checked;
    //        trPrice3.style.display = TotalPriceGetMode ? "" : "none";
    //    }
}

//显隐区块
function setVisible(areaName, tr) {
    tr.style.display = (getObj(areaName).value == "0" ? "none" : "");
}

function reloadData(KeyID, keyValue) {
    //    ajax(document.URL, { "Action":"GetConfig","CorpID": $("#ddlCompanyGUID").val() }, "json", loadInfo)
    var data = { "Action": "GetConfig" };
    data[KeyID] = $("#" + keyValue).val();
    ajax(document.URL, data, "json", loadInfo);
}

function SetSubscriptionDepositMethod() {

    var rdlSubscriptionDepositMethod = getObj("rdlSubscriptionDepositMethod");
    var SubscriptionDepositMethod = getObjC(rdlSubscriptionDepositMethod, "input", 0).checked;

    if (SubscriptionDepositMethod) {
        getObj("lblSubscriptionStandardDeposit").style.display = "";
        getObj("txtSubscriptionStandardDeposit").style.display = "";
        getObj("lblSubscriptionStandardDepositPercent").style.display = "none";
        getObj("txtSubscriptionStandardDepositPercent").style.display = "none";
        getObj("lblSubscriptionStandardDepositPercentUnit").style.display = "none";

        //            getObj("txtSubscriptionStandardDepositPercent").value = "0";
    }
    else {
        getObj("lblSubscriptionStandardDeposit").style.display = "none";
        getObj("txtSubscriptionStandardDeposit").style.display = "none";
        //            getObj("txtSubscriptionStandardDeposit").value = "0";
        getObj("lblSubscriptionStandardDepositPercent").style.display = "";
        getObj("txtSubscriptionStandardDepositPercent").style.display = "";
        getObj("lblSubscriptionStandardDepositPercentUnit").style.display = "";

    }
}

function SetReservationDepositMethod() {

    var rdlReservationDepositMethod = getObj("rdlReservationDepositMethod");
    var ReservationDepositMethod = getObjC(rdlReservationDepositMethod, "input", 0).checked;
    var ReservationDepositMethod2 = getObjC(rdlReservationDepositMethod, "input", 1).checked;


    if (ReservationDepositMethod) {
        getObj("lblReservationStandardDeposit").style.display = "";
        getObj("txtReservationStandardDeposit").style.display = "";
        getObj("lblReservationStandardDepositPercent").style.display = "none";
        getObj("txtReservationStandardDepositPercent").style.display = "none";
        getObj("lblReservationStandardDepositPercentUnit").style.display = "none";

        //        getObj("txtReservationStandardDepositPercent").value = "0";
    }
    else {
        getObj("lblReservationStandardDeposit").style.display = "none";
        getObj("txtReservationStandardDeposit").style.display = "none";
        //        getObj("txtReservationStandardDeposit").value = "0";
        getObj("lblReservationStandardDepositPercent").style.display = "";
        getObj("txtReservationStandardDepositPercent").style.display = "";
        getObj("lblReservationStandardDepositPercentUnit").style.display = "";

        //        getObjC(rdlReservationDepositMethod, "input", 1).selected = true;

    }
}

function loadInfo(data) {
    if (data.Success == "Y") {
        var config = $.stringToJSON(data.Data);

        window["Config"] = config;

        //        getObj("rdlSubscriptionDepositMethod").value = config["SubscriptionStandardDeposit"] != "0" ? "1" : "2";
        //        getObj("rdlReservationDepositMethod").value = config["ReservationStandardDeposit"] != "0" ? "1" : "2";

        //        alert(getObj("rdlReservationDepositMethod").value)
        for (k in config) {
            var txt = getObj("txt" + k);
            var rdl = getObj("rdl" + k);

            if (txt) {
                //                if (txt.id == 'txtPenaltyRatio' || txt.id == 'txtSubscriptionStandardDeposit' || txt.id == 'txtReservationStandardDeposit')
                //                {
                //                    txt.value = parseFloat(config[k].replace("%", "")) * 100 + "%";
                //                }
                //                else
                //                {
                txt.value = config[k];
                //                }
            }
            else if (rdl) {
                var rdos = rdl.getElementsByTagName("input");
                for (var i = 0; i < rdos.length; i++) {
                    rdos[i].checked = (rdos[i].value == config[k]);

                }

            }
        }
        if (getObj("hdProjectGUID")) {
            SetSubscriptionDepositMethod();
            SetReservationDepositMethod();
        }
    }
    else {
        var config = $.stringToJSON(data.Others);
        window["Config"] = config;
        alert(data.Data);
    }
}

function validate(KeyID, keyValue, keyName) {
    var ddlkey = getObj(keyValue);
    if (ddlkey.value == "") {
        return alertMsg("请选择" + keyName + "。", ddlkey);
    }


    var config = window["Config"];

    for (var k in config) {
        var txt = getObj("txt" + k);
        var rdl = getObj("rdl" + k);
        if (txt) {
            //            if (txt.id == 'txtPenaltyRatio' || txt.id == 'txtSubscriptionStandardDeposit' || txt.id == 'txtReservationStandardDeposit')
            //            {
            //                config[k] = parseFloat(txt.value.replace("%", "")) / 100;
            //            }
            //            else
            //            {
            config[k] = txt.value;
            //            }
        }
        else if (rdl) {
            var rdos = rdl.getElementsByTagName("input");
            for (var i = 0; i < rdos.length; i++) {
                if (rdos[i].checked) {
                    config[k] = rdos[i].value;
                    break;
                };
            }
        }
    }
    //根据认购单、预约单定金收取方式 讲不相干字段清零。
    if (config["SubscriptionDepositMethod"] != "1") {
        config["SubscriptionStandardDeposit"] = 0;
    }
    else {
        config["SubscriptionStandardDepositPercent"] = 0;
    }
    if (config["ReservationDepositMethod"] != "1") {
        config["ReservationStandardDeposit"] = 0;
    }
    else {
        config["ReservationStandardDepositPercent"] = 0;
    }

    var data = { "Action": "SaveConfig" };
    data[KeyID] = $("#" + keyValue).val();
    data["ConfigInfo"] = $.jsonToString(config);
    ajax(document.URL, data, "json", finishSave);
    //    ajax(document.URL, { "Action": "SaveConfig", "CorpID": ddlCorp.value, "ConfigInfo": $.jsonToString(config) }, "json", finishSave);
}

function finishSave(data) {
    if (data.Success == "Y") {
        alert("操作成功。");
    }
    else {
        alert(data.Data);
    }
}



//选择项目
function selectProjectName() {
    var data = openModalWindow('../../../Common/Select/CRM/VSelectProjectInfo.aspx?IsMulti=Y', 1000, 750);

    if (data) {
        getObj("txtProjectNameList").value = data.ProjectName;
        getObj("hdProjectNameList").value = data.ProjectID;
    }
    else {

        return;

    }
}