// 上传控件事件处理脚本

function flashReady()
{
    try
    {
        var tbFile = this.customSettings.filesTable;
        if (this.getStats().successful_uploads == 0)
        {
            var stat = this.getStats();
            stat.successful_uploads = tbFile.rows.length;
            this.setStats(stat);
        }
    }
    catch (e)
    {
        this.debug(e);
    }
}

function fileQueued(file)
{
    try
    {
        var progress = new FileProgress(file, this.settings.custom_settings.progressTarget, this);
        progress.setShow(true);

        setProgressRowShow.call(this, true);
    }
    catch (e)
    {
        this.debug(e);
    }
}

function fileDialogComplete(numselected, numqueued)
{
    this.startUpload();

    if (this.settings.custom_settings.submits)
    {
        setBtnEnabled(this.settings.custom_settings.submits, false);
    }
}

function fileQueueError(file, errorCode, message)
{
    try
    {
        if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED)
        {
            alert("文件个数超过限制。\n" + (message == 0 ? "已经到达文件上限。" : "你最多可以选择 " + message + "个文件。"));
            return;
        }

        var progress = new FileProgress(file, this.settings.custom_settings.progressTarget, this);
        progress.setShow(false);

        switch (errorCode)
        {
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                //progress.setStatus("File is too big.");
                alert("文件大小超过限制。");
                this.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                //progress.setStatus("Cannot upload Zero Byte files.");
                alert("不能上传空文件。");
                this.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                //progress.setStatus("Invalid File Type.");
                alert("文件类型超出限制。");
                this.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            default:
                if (file !== null)
                {
                    progress.setStatus("Unhandled Error");
                }
                alert("未知错误。");
                this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
        }
    }
    catch (ex)
    {
        this.debug(ex);
    }
}

function uploadStart(file)
{
    try
    {
        var postParams = this.settings.post_params;
        if (postParams.IsAddWaterMark === 1) {
            //需要添加水印
            if (postParams.ContentType === 'P' || postParams.ContentType === 'C') {
                if (!postParams.ExternID) {
                    alert("需要添加水印且文本内容不为自定义时，需要指定页面获取值的控件ID。");
                    this.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size);
                    return false;
                }
                else {
                    var itemId = $('#' + postParams.ExternID).length > 0 ? $('#' + postParams.ExternID).val() : '';
                    if (!itemId) {
                        alert("需要添加水印且文本内容不为自定义时，必须设置所取名称的ID。");
                        this.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size);
                        return false;
                    }
                    this.addPostParam("File_Extern_ItemID", itemId);
                }
            }
            this.addPostParam("File_Extern_CreateTime", file.creationdate.Format("yyyy-MM-dd"));
            this.addPostParam("File_Extern_ModifyTime", file.modificationdate.Format("yyyy-MM-dd"));
        }
        var progress = new FileProgress(file, this.settings.custom_settings.progressTarget, this);
        progress.setUploadState(3);
    }
    catch (ex)
    {
    }

    return true;
}

function uploadProgress(file, bytesLoaded, bytesTotal)
{
    try
    {
        var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);

        var progress = new FileProgress(file, this.settings.custom_settings.progressTarget, this);
        progress.setProgress(file, percent);

    }
    catch (ex)
    {
        this.debug(ex);
    }
}

function uploadSuccess(file, serverData)
{
    try
    {
        var progress = new FileProgress(file, this.settings.custom_settings.progressTarget, this);
        var filedata = eval("(" + decodeURIComponent(serverData) + ")");
        if (filedata.error)
        {
            var stat = this.getStats();
            stat.successful_uploads--;
            stat.upload_errors++;
            stat.queue_errors++;
            this.setStats(stat);

            progress.setShow(false);

            alert(filedata.error);
        }
        else
        {
            progress.setComplete(this.settings);
            handleFiles.call(this, file, filedata);
        }
    }
    catch (ex)
    {
        this.debug(ex);
    }
}

function uploadComplete(file)
{
    try
    {
        if (this.getStats().files_queued == 0)
        {
            setProgressRowShow.call(this, false);

            // 上传队列完成事件
            if (this.settings.custom_settings.fileQueueUploaded)
            {
                this.settings.custom_settings.fileQueueUploaded(this.customSettings.filesTable.id);
            }
            if (this.settings.custom_settings.submits)
            {
                setBtnEnabled(this.settings.custom_settings.submits, true);
            }
            if (this.settings.custom_settings.fileServerQueueUploaded)
            {
                (this.settings.custom_settings.fileServerQueueUploaded)();
            }
        }
    }
    catch (ex)
    {
        this.debug(ex);
    }
}

function uploadError(file, errorCode, message)
{
    try
    {
        var progress = new FileProgress(file, this.settings.custom_settings.progressTarget, this);
        progress.setShow(false);

        switch (errorCode)
        {
            case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                //progress.setStatus("Upload Error: " + message);
                alert("上传失败：" + message);
                this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                //progress.setStatus("Upload Failed.");
                alert("上传失败。");
                this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                //progress.setStatus("Server (IO) Error");
                alert("服务器IO错误。");
                this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                //progress.setStatus("Security Error");
                alert("服务器安装错误。");
                this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                //progress.setStatus("Upload limit exceeded.");
                alert("文件大小超过限制。");
                this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                //progress.setStatus("Failed Validation.  Upload skipped.");
                alert("文件无效,跳过该文件。");
                this.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                //progress.setStatus("Cancelled");
                //alert("上传被终止!");
                //progress.setCancelled();
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                //progress.setStatus("Stopped");
                //alert("上传被停止!");
                break;
            default:
                //progress.setStatus("Unhandled Error: " + errorCode);
                alert("未知异常,ErrorCode:" + errorCode);
                this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
        }
    }
    catch (ex)
    {
        this.debug(ex);
    }
}

// 设置进度框的消隐
function setProgressRowShow(show)
{
    this.customSettings.progressRow.style.display = show ? "" : "none";
}

// 将上传的文件加入文件列表，并进行其他处理
function handleFiles(file, filedata)
{
    var authorID = this.settings.custom_settings.userID;
    var authorName = this.settings.custom_settings.userName.replace(/|/g, "");
    var time = new Date().Format("yy-MM-dd hh:mm");

    // 是否自动生成缩略图
    var autoGenerateThumbnail = (this.settings.post_params.Thumbnail == "1");

    var name = decodeURI(filedata.name || file.name);
    var path = filedata.path;
    var thumbnailname = autoGenerateThumbnail ? (filedata.thumbnail || "") : "";

    var theme = this.settings.custom_settings.theme;
    var tbFile = this.customSettings.filesTable;

    var swfu = this;

    var mode = this.settings.custom_settings.mode;
    var mIndex = mode.substr(0, 1);
    var mIco = mode.substr(1, 1);
    var mSize = mode.substr(2, 1);
    var mAuthor = mode.substr(3, 1);
    var mTime = mode.substr(4, 1);
    var mOffice = mode.substr(5, 1);
    var mShow = mode.substr(6, 1);
    var mDown = mode.substr(7, 1);
    var mSave = mode.substr(8, 1);
    var mDel = mode.substr(9, 1);
    var mDecrypt = mode.substr(10, 1);

    var row = tbFile.insertRow();
    row.className = "up_filerow";
    row.filename = path;
    row.filetitle = name.replace(/,/g, "，");
    row.filesize = file.size;
    row.authorid = authorID;
    row.authorname = authorName;
    row.uploadtime = time;
    if (autoGenerateThumbnail)
    {
        row.thumbnailname = thumbnailname;
    }

    var colIndex = 0;
    var cell;

    if (mIndex == "1")
    {
        cell = row.insertCell(colIndex++);
        cell.className = "up_fno";
        cell.innerText = row.rowIndex + 1;
    }

    if (mIco == "1")
    {
        var extend;
        if (path.indexOf(".") != -1)
        {
            extend = path.substr(path.lastIndexOf(".") + 1);
        }

        cell = row.insertCell(colIndex++);
        cell.className = "up_fico";
        cell.innerHTML = extend ? '<img class="img_16" src="/' + rootUrl + '/Image/file/' + extend + '.png" onerror="fileIcoError()" />' : '';
    }

    cell = row.insertCell(colIndex++);
    cell.className = "up_fname";
    cell.innerHTML = '<table class="idtbfix"><tr><td><div class="nowrap font">'
        + (mShow ? '<a href="javascript:void(0)" onclick="showIDUpFile()" onfocus="this.blur()">' : '')
        + (mAuthor == "1" && authorName ? "(" + authorName + ")" : "") + row.filetitle
        + (mShow ? '</a>' : '')
        + '</div></td></tr></table>';

    if (mSize == "1")
    {
        cell = row.insertCell(colIndex++);
        cell.className = "up_fsize";
        var filesize = file.size;
        if (filesize > 0 && filesize < 1024)
        {
            filesize = 1024;
        }
        cell.innerText = SWFUpload.speed.formatBytes(filesize);
    }
    if (mTime == "1")
    {
        cell = row.insertCell(colIndex++);
        cell.className = "up_ftime";
        cell.innerText = time;
    }

    if (mOffice != "0")
    {
        cell = row.insertCell(colIndex++);
        cell.className = "up_fopt";
        if (isOfficeDocFile(path))
        {
            cell.innerHTML = "<a href='javascript:void(0)' onclick=\"showIDUpOfficeFile('" + mOffice + "')\" onfocus='this.blur()'>"
                + (mOffice == "2" ? "编辑" : "查看") + "</a>";
        }
        else if (isPDF(path))
        {
            cell.innerHTML = "<a href='javascript:void(0)' onclick=\"showIDUpPDFFile()\" onfocus='this.blur()'>查看</a>";
        }
        else if (couldBrowseOnlineFile(path))
        {
            cell.innerHTML = "<a href='javascript:void(0)' onclick=\"showIDUpCouldBrowseFile()\" onfocus='this.blur()'>查看</a>";
        }
    }

    if (mDown == "1")
    {
        cell = row.insertCell(colIndex++);
        cell.className = "up_fopt";
        cell.innerHTML = "<a href='javascript:void(0)' onclick=\"downloadIDUpFile(" + mDecrypt + ")\" onfocus='this.blur()'>下载</a>";
    }

    if (mSave == "1")
    {
        cell = row.insertCell(colIndex++);
        cell.className = "up_fopt";
        cell.innerHTML = "<a href='javascript:void(0)' onclick='saveIDUpFile()' onfocus='this.blur()'>存档</a>";
    }

    if (mDel == "1")
    {
        cell = row.insertCell(colIndex);
        cell.className = "up_fdel";
        cell.innerHTML = '<a href="javascript:void(0)" onclick="deleteIDUpFile()" onfocus="this.blur()">删除</a>';
    }

    var tdData = getObj(this.movieName).parentNode;
    var txtName = getObjC(tdData, "input", 0);
    var txtTitle = getObjC(tdData, "input", 1);
    var txtSize = getObjC(tdData, "input", 2);
    var txtAuthorID = getObjC(tdData, "input", 3);
    var txtAuthorName = getObjC(tdData, "input", 4);
    var txtTime = getObjC(tdData, "input", 5);

    var symbol = (txtName.value != "" ? "|" : "");
    txtName.value += symbol + row.filename;
    txtTitle.value += symbol + row.filetitle;
    txtSize.value += symbol + file.size;
    txtAuthorID.value += symbol + authorID;
    txtAuthorName.value += symbol + authorName;
    txtTime.value += symbol + time;
    if (autoGenerateThumbnail)
    {
        var txtThumbnail = getObjC(tdData, "input", 6);
        txtThumbnail.value += symbol + thumbnailname;
    }

    // 上传完执行
    if (this.settings.custom_settings.fileUploaded)
    {
        this.settings.custom_settings.fileUploaded(row, tbFile.id);
    }
}

// 删除文件
function deleteUploadedFile(aHref, fileName, fileTitle, delReally)
{
    setAjaxContainer(aHref);
    var data = { action: "DeleteAccessaryFile", FileName: fileName, FileTitle: fileTitle, DelReally: (delReally ? "1" : "0"), Title: document.title };
    ajaxRequest("FillData.ashx", data, "text", finishDeleteUploadedFile);
}

// 删除文件成功
function finishDeleteUploadedFile(data, textStatus)
{
    if (data != "Y")
    {
        //        alert(data);
        window.status = data;
        window.setTimeout("window.status=''", 5000);
    }
}

/*
    手动插入文件列表
    fileID:上传控件的ID,字符串
    file： 同handleFiles一样的格式，基本如下：
    {"id":"SWFUpload_2_0","filestatus":-4,"type":".txt","creationdate":"2011-05-18T01:50:32Z","name":"datastructure.txt","size":49,"index":0,"post":{},"modificationdate":"2011-05-18T01:50:32Z","currentSpeed":0,"averageSpeed":0,"movingAverageSpeed":0,"timeRemaining":0,"timeElapsed":0,"percentUploaded":0,"sizeUploaded":0}
    fileName: 字符串，以|分隔，依次表示文件名（下载地址）和缩略图地址
    
    注意file中的name，最好能加上后缀
*/
function appendFileByManual(fileID, file, fileName)
{
    var swfUploadObj = window['UploadSetting_' + fileID];
    if (!swfUploadObj || typeof fileName !== "string")
    {
        return;
    }

    var filedata = {};
    var fileinfo = fileName.split("|");
    filedata["name"] = file.name;
    if (fileinfo.length > 1)
    {
        filedata["path"] = fileinfo[0];
        filedata["thumbnail"] = fileinfo[1];
    }
    else
    {
        filedata["path"] = fileinfo[0];
    }

    handleFiles.call(swfUploadObj, file, filedata);

    uploadComplete.call(swfUploadObj, file);

    //    var stat = swfUploadObj.getStats();    
    //    if (stat.successful_uploads < swfUploadObj.customSettings.filesTable.rows.length)
    //    {
    //        stat.successful_uploads++;
    //        swfUploadObj.setStats(stat);
    //    }
}

function CheckSubmit()
{
    try
    {
        if (window[swfuObject].getStats().in_progress == 1)
        {
            alert("有文件上传中,请等文件上传完毕后再提交");
            return false;
        }
    }
    catch (e) { }
    return true;
}

CheckSubmit.prototype.functionName = "CheckSubmit";

