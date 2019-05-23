// 上传控件进度处理脚本

function filename_utf2gb(str)
{
    var oristr = str;
    try
    {
        var i, result = "";
        str = decodeURI(encodeURIComponent(str));
        for (i = 0; i < str.length; i++)
        {
            result += vbs_utf2gb(str.charAt(i));
        }
        str = result;

        result = "";
        for (i = 0; i < str.length; i += 2)
        {
            result = result + '%' + str.substr(i, 2);
        }
        str = decodeURI(result);
    }
    catch (err)
    {
        str = oristr;
    }

    return str;
}

function FileProgress(file, targetId, swfu)
{
    //获取当前容器对象
    this.fileProgressElement = document.getElementById(file.id);

    var mIco = swfu.settings.custom_settings.mode.substr(1, 1);

    if (!this.fileProgressElement)
    {
        var tbProgress = document.getElementById(targetId);

        var row = tbProgress.insertRow();
        row.className = "up_prgsrow";
        var colIndex = 0;

        var cell = row.insertCell(colIndex++);
        cell.className = "up_pstate";
        cell.innerHTML = "<input type='button' class='up_waiting'/>";

        if (mIco == "1")
        {
            var extend, filename = filename_utf2gb(file.name);
            if (filename.indexOf(".") != -1)
            {
                extend = filename.substr(filename.lastIndexOf(".") + 1);
            }
            cell = row.insertCell(colIndex++);
            cell.className = "up_pfico";
            cell.innerHTML = extend ? '<img class="img_16" src="/' + rootUrl + '/Image/file/' + extend + '.png" onerror="fileIcoError()" />' : '';
        }

        cell = row.insertCell(colIndex++);
        cell.className = "up_pfname";
        cell.innerHTML = '<table class="idtbfix"><tr><td><div class="nowrap font">' + filename + '</div></td></tr></table>';

        cell = row.insertCell(colIndex++);
        cell.className = "up_pspeed";
        cell.innerText = "";

        cell = row.insertCell(colIndex++);
        cell.className = "up_premain";
        cell.innerText = "";

        cell = row.insertCell(colIndex++);
        cell.className = "up_pbar";
        cell.innerHTML = "<div class='up_prgs'><div>&nbsp;</div></div>";

        cell = row.insertCell(colIndex++);
        cell.className = "up_pper";
        cell.innerText = "(等待...)";

        cell = row.insertCell(colIndex++);
        cell.className = "up_pcancel";
        cell.innerHTML = "<a href='#Cancel' onclick='alert(123)' onfocus='this.blur()'>取消</a>";
        getObjC(cell, "a", 0).onclick = function ()
        {
            swfu.cancelUpload(file.id, true);
        }

        this.fileProgressElement = row;
        this.fileProgressElement.id = file.id;
    }

    this.stateBtn = getObjC(this.fileProgressElement, "input", 0);
    this.stateDiv = getObjC(this.fileProgressElement, "div", 1);
    this.stateBar = getObjC(this.fileProgressElement, "div", 2);
    this.percentTd = this.fileProgressElement.cells[mIco == "1" ? 6 : 5];
    this.speedTd = this.fileProgressElement.cells[mIco == "1" ? 3 : 2];
    this.remainTimeTd = this.fileProgressElement.cells[mIco == "1" ? 4 : 3];
    this.cancelHref = getObjC(this.fileProgressElement, "a", 0);
}


// 设置状态按钮状态
FileProgress.prototype.setUploadState = function (state)
{
    switch (state)
    {
        // 初始化完成
        case 1:
            this.stateBtn.className = "up_finish";
            break;
            // 正在等待
        case 2:
            this.stateBtn.className = "up_waiting";
            break;
            // 正在上传
        case 3:
            this.stateBtn.className = "up_upload";
            break;
    }
}

// 设置上传进度信息(百分比、当前速度、剩余时间)
FileProgress.prototype.setProgress = function (file, percent)
{
    this.stateBar.style.width = percent + "%";
    this.percentTd.innerText = percent + "%";
    var currentSpeed = file.currentSpeed;
    this.speedTd.innerText = (currentSpeed < 1024 ? "<1 KB" : SWFUpload.speed.formatBytes(currentSpeed)) + "/s";
    var remainText = SWFUpload.speed.formatTime(file.timeRemaining);
    this.remainTimeTd.innerText = remainText ? "剩余" + remainText : "";

    if (percent == 100)
    {
        this.setFinishState();
    }
}

// 上传完成
FileProgress.prototype.setComplete = function (settings)
{
    this.setFinishState();

    this.fileProgressElement.parentNode.deleteRow(this.fileProgressElement.rowIndex);
}

// 设置上传完成状态(内部调用)
FileProgress.prototype.setFinishState = function ()
{
    this.cancelHref.style.display = "none";
    this.remainTimeTd.innerText = "";
    this.speedTd.innerText = "";
    this.percentTd.innerText = "";
    this.stateDiv.style.display = "none";
    this.stateBtn.className = "up_finish";
}

// 控制上传对象消隐
FileProgress.prototype.setShow = function (show)
{
    this.fileProgressElement.style.display = show ? "" : "none";
}
