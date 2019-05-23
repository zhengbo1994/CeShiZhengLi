// 主页XQDefaultPortal.aspx页

//显示常用资料
function showUsefulInfo() {
    divUsefulInfo.style.display = "";
    divUsefulForm.style.display = "none";
    getObj("spUsefulInfo").className = "dft_tle2";
    getObj("spUsefulForm").className = "dft_tle3";
    tdUsefulInfo.className = "dft_h2";
    tdUsefulForm.className = "dft_h3";
}

//显示常用表单
function showUsefulForm() {
    divUsefulForm.style.display = "";
    divUsefulInfo.style.display = "none";
    getObj("spUsefulInfo").className = "dft_tle3";
    getObj("spUsefulForm").className = "dft_tle2";
    tdUsefulInfo.className = "dft_h3";
    tdUsefulForm.className = "dft_h2";
}

//显示祥祺新人榜
function showManNew() {
    divManNew.style.display = "";
    divManChange.style.display = "none";
    getObj("spManNew").className = "dft_tle2";
    getObj("spManChange").className = "dft_tle3";
    tdManNew.className = "dft_h2";
    tdManChange.className = "dft_h3";
}

//显示异动信息
function showManChange() {
    divManChange.style.display = "";
    divManNew.style.display = "none";
    getObj("spManNew").className = "dft_tle3";
    getObj("spManChange").className = "dft_tle2";
    tdManNew.className = "dft_h3";
    tdManChange.className = "dft_h2";
}

//查看 常用资料、常用表单、祥琪新人榜、异动信息
function openInformationIssue(iiid) {
    openWindow("../../IDOA/InformationIssue/VInformationIssueBrowse.aspx?ID=" + iiid, 800, 800);
}

//显示更多 常用资料
function showMoreUsefulInfo() {
    getWin().location = "../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=BDD144B0-D5E6-4B21-A54E-8AB433C1F393&IDM_CD=20&IDM_ID=B2E01F26-17D8-4EB0-88B0-9A48188022C6";
}

//显示更多 常用表单
function showMoreUsefulForm() {
    getWin().location = "../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=BEBCF2B3-04EB-490E-9DD9-7AF63CDC3DC9&IDM_CD=21&IDM_ID=257CA2DE-84A8-470F-85FF-D2BB3A48A212";
}

//显示更多 祥祺新人榜
function showMoreManNew() {
    getWin().location = "../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=8370BA87-A312-44A2-A1AD-DCB5AB4980B0&IDM_CD=22&IDM_ID=2961D034-F1E4-4472-B309-161F1AC777EB";
}

//显示更多 异动信息
function showMoreManChange() {
    getWin().location = "../../IDOA/InformationIssue/VInformationIssue.aspx?IICID=2A14B747-9A70-4108-9A64-8F184699EF0F&IDM_CD=23&IDM_ID=8669E920-6FB7-4E55-BB3B-AC3B5D8493D9";
}
