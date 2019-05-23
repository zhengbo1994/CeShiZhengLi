/*
    实现在前端，通过js动态创建上传控件。
    作者：Jeremy
    日期：2012-11-21

    前置说明：
        1、虽然支持$('#id1,#id2')的形式，但本控件每一次只能在某个页面元素上创建。
        2、本控件需要jQuery框架、jquery-jtemplates.js，以及对应的上传控件模板支持。
        3、框架提供了默认的上传控件模板，
                上传模板位于：JS\IDControls\IDUploadTemplate.tpl，在不熟悉jquery-jtemplates.js的情况下，请勿更改。
                浏览模板位于：JS\IDControls\IDUploadBrowseTemplate.tpl，在不熟悉jquery-jtemplates.js的情况下，请勿更改。
        4、模板插件帮助地址：http://jtemplates.tpython.com/
        5、本控件不支持回发动作,但支持在后台通过Request[""]的方法接收。

    使用帮助：
        1、插件提供options和initFiles参数传递。
        2、options参数为上传控件的配置，基本上与服务端控件IDUpload的属性对应（不完全），各个参数意义请见defaults局部变量讲解。
           传入的options设置，在本次使用时会覆盖默认options，但不影响下一次使用。
           
           options中的UploadID为必选参数，需要手动传入。
           options中的UploadID为最终生成的上传控件ID，在JS端获取上传文件时，需要通过此ID进行。

           options中的ApplicationRoot虽然不是必选参数，但每一次使用时，都要输入，它指的是应用程序的相对路径。
           用于定位JS、图片等资源文件。

           options中的Mode支持Upload|Browse,分别对应上传及浏览两种模式。

        3、initFiles参数，会手动初始化文件列表使用，它是一个对象数组，每一个对象的格式与handler.js中的handleFiles参数基本一致格式，建议具有的属性如下：
            { 
                Name: 'abcabc.doc',         //文件名称(必选属性)
                CreationDate: '2012-11-21',     //上传日期
                Type: 'doc',    //文件类型
                Size: 1036,     //文件大小
                EntireName: 'Accessary/2011/abcabc.doc|Accessary/2011/abcabc.doc'   //文件全名，以|号分隔，依次为文件存放路径和文件缩略图路径（缩略图路径不是必选）。
            }        
        4、使用本插件前，需要引入JQuery和jTemplate文件，如：
            <script type="text/javascript" src="../JS/jquery-1.7.2.min.js"></script>            
            <script type="text/javascript" src="../JS/jquery-jtemplates.js"></script>
            <script type="text/javascript" src="../JS/jquery.dynamicIDUpload.js"></script>
        5、Mode='Upload'时，插件中的OfficeMode，请传入$.fn.dynamicIDUpload.UploadOfficeMode.UploadOfficeMode对象的某个属性值，不建议手动输入数字。        
        6、Mode='Upload'时，不需要初始文件列表的使用示例：
             <!--上传控件容器-->
             <div id="uploads" style="width:500px;overflow:auto"></div>   
             
             <!--上传控件生成-->
               $('#uploads').dynamicIDUpload({
                   'UploadID': 'testUpload',
                   'ShowDelete':true,
                   'FileTypes': '*.doc;*.docx;*.xls;*.xlsx;*.ppt,*.pptx',
                   'FileTypesDescription': 'Office文件',
                   'UserID': '403D3822-79FE-4680-9054-982CFFE15918',
                   'UserName':'刘一',
                   'OfficeMode': $.fn.dynamicIDUpload.UploadOfficeMode.Editable,
                   'MaxCount':3
               });
         7、Mode='Upload'时，需要初始文件列表的使用示例
            <!--上传控件容器-->
             <div id="uploads" style="width:500px;overflow:auto"></div>   
             
             <!--上传控件生成-->
               var fileInfo =
               [{ Name: 'abcabc.doc', CreationDate: '2012-11-21', Type: 'doc', Size: 1036, EntireName: 'Accessary/2011/abcabc.doc|Accessary/2011/abcabc.doc' },
               { Name: 'gag.xls', CreationDate: '2012-11-19', Type: 'xls', Size: 951168, EntireName: 'Accessary/2011/gag.xls|Accessary/2011/gag.xls' }
               ];
               $('#uploads').dynamicIDUpload({
                   'UploadID': 'testUpload',
                   'ShowDelete':true,
                   'FileTypes': '*.doc;*.docx;*.xls;*.xlsx;*.ppt,*.pptx',
                   'FileTypesDescription': 'Office文件',
                   'UserID': '403D3822-79FE-4680-9054-982CFFE15918',
                   'UserName':'刘一',
                   'OfficeMode': $.fn.dynamicIDUpload.UploadOfficeMode.Editable,
                   'MaxCount':3
               }, fileInfo);

          8、Mode='Browse'示例：
             <!--上传控件容器-->
               <div id="uploads2" style="width:500px;overflow:auto"></div> 
             
             <!--上传控件生成-->
                var fileInfo =
                   [{ Name: 'abcabc.doc', CreationDate: '2012-11-21', Type: 'doc', Size: 1036, EntireName: 'Accessary/2011/abcabc.doc|Accessary/2011/abcabc.doc' },
                   { Name: 'gag.xls', CreationDate: '2012-11-19', Type: 'xls', Size: 951168, EntireName: 'Accessary/2011/gag.xls|Accessary/2011/gag.xls' }
                   ];
               $('#uploads2').dynamicIDUpload({
                   'UploadID': 'testBrowseUpload',
                   'Mode': 'Browse',               
                   'UserID': '403D3822-79FE-4680-9054-982CFFE15918',
                   'UserName': '刘一'              
               }, fileInfo);

          9、示例地址：Demo\DynamicUpload.aspx
*/

(function ($)
{
    $.fn.dynamicIDUpload = function (options, initFiles, theme)
    {
        var defaults = {

            Version: '1.0.0.0',

            Author: 'JeremyXu',

            //上传控件使用模板：Upload|Browse
            Mode: 'Upload',

            //主题，用于获取按钮图标等
            Theme: theme ? theme:'Default',

            //应用程序相对地址，用于定位相关的js、flash、图片等资源文件
            //一般情况下，该路径在使用时，都需要手动传入           
            ApplicationRoot: '../',

            //上传控件对应的FLASH地址，该地址为除应用程序相对地址外的部分。
            //插件将在运行时将它和ApplicationRoot进行拼合
            FlashUrl: 'Common/Flash/swfupload.swf',

            //上传控件对应的服务端上传页面（程序）地址，该地址为除应用程序相对地址外的部分。
            //插件将在运行时将它和ApplicationRoot进行拼合
            UploadUrl: 'Common/Handler/Upload.aspx',

            //上传控件对应的模板地址，该地址为除应用程序相对地址外的部分。
            //插件将在运行时将它和ApplicationRoot进行拼合
            TemplateUrl: 'JS/IDControls/IDUploadTemplate.html',

            //上传控件浏览模式下的模板地址，该地址为除应用程序相对地址外的部分。
            //插件将在运行时将它和ApplicationRoot进行拼合
            BrowseTemplateUrl: 'JS/IDControls/IDUploadBrowseTemplate.html',
            
            //上传控件的按钮地址，该地址为除应用程序相对地址外的部分。
            //插件将在运行时将它和ApplicationRoot进行拼合
            ButtonImgUrl: 'img/control/upload.gif',

            //上传控件的名称
            UploadID: 'file1',

            //上传控件上传文件的存放地址
            PathType: 'Default',

            //上传控件支持的文件类型
            FileTypes: '*.*',

            //上传控件在选择文件时的提示类型
            FileTypesDescription: '所有',

            //上传控件最多允许的文件个数
            MaxCount: 100,

            //上传控件单个上传文件的上限大小
            MaxLength: 200,

            //上传控件的文件上传者ID
            UserID: '',

            //上传控件的文件上传者名称
            UserName: '',

            //参见IDUpload注释
            ShowFileIndex: true,

            //参见IDUpload注释
            ShowFileIco: true,

            //参见IDUpload注释
            ShowFileSize: true,

            //参见IDUpload注释
            ShowAuthor: true,

            //参见IDUpload注释
            ShowUploadTime: true,

            //参见IDUpload注释
            OfficeMode: $.fn.dynamicIDUpload.UploadOfficeMode.None,

            //参见IDUpload注释
            ShowFileNameLink: true,

            //参见IDUpload注释
            ShowDownload: true,

            //参见IDUpload注释
            ShowSaveKnowledge: false,

            //参见IDUpload注释
            ShowDelete: false

        };
        //SWFUpload需要的JS文件列表，所有地址为除应用程序相对地址外的部分。
        //插件将在运行时将它和ApplicationRoot进行拼合
        var referenceJS = [
            'JS/IDControls/swfupload.js',
            'JS/IDControls/swfupload.queue.js',
            'JS/IDControls/swfupload.speed.js',
            'JS/IDControls/fileprogress.js',                
            'JS/IDControls/handlers.js'
        ];

        if (this.length > 1)
        {
            throw '上传控件的容器元素只能有一个，请检查设置。';
            return;
        }

        return this.each(function ()
        {
            var _THIS_ = $(this);
            var settings = jQuery.extend(defaults, options);
                        
            if (settings.ApplicationRoot.lastIndexOf('/') != (settings.ApplicationRoot.length - 1))
            {
                settings.ApplicationRoot = settings.ApplicationRoot + '/';
            }            
            
            var TemplateUrl = settings.ApplicationRoot + (settings.Mode == 'Upload' ? settings.TemplateUrl : settings.BrowseTemplateUrl);
            if (TemplateUrl.length <= 0)
            {
                throw '请先设置控件的模板。';
                return false;
            }
            TemplateUrl = TemplateUrl + '?t=' + getUniqueKey('tpl');
            
            //name表示文件的显示名称，EntireName由|分隔，第一部分为路径，第二部分为缩略图路径
            //FileURL为第一部分值
            initFiles = initFiles || [];
            $.each(initFiles, function (i, file)
            {
                file.Name = typeof file.Name == 'undefined' ? '' : file.Name;
                file.CreationDate = typeof file.CreationDate == 'undefined' ? '' : file.CreationDate;
                file.ModificationDate = typeof file.ModificationDate == 'undefined' ? '' : file.ModificationDate;
                file.Type = typeof file.Type == 'undefined' ? 'txt' : file.Type;
                file.Size = typeof file.Size == 'undefined' ? 0 : file.Size;
                file.AuthorID = typeof file.AuthorID == 'undefined' ? settings.UserID : file.AuthorID;
                file.AuthorName = typeof file.AuthorName == 'undefined' ? settings.UserName : file.AuthorName;
                file.EntireName = typeof file.EntireName == 'undefined' ? '' : file.EntireName;                
                file.FileURL = file.EntireName.split('|')[0];
                file.FileExt = file.FileURL.replace(/.+\./, "");
                file.FileIcon = settings.ApplicationRoot + 'Image/file/' + (file.FileExt || 'none') + '.png';
            });
            settings.InitFiles = [].concat(initFiles);

            if (settings.Mode == 'Upload')
            {
                var uploadMode = (settings.ShowFileIndex ? '1' : '0');
                uploadMode += (settings.ShowFileIco ? '1' : '0');
                uploadMode += (settings.ShowFileSize ? '1' : '0');
                uploadMode += (settings.ShowAuthor ? '1' : '0');
                uploadMode += (settings.ShowUploadTime ? '1' : '0');
                uploadMode += settings.OfficeMode;
                uploadMode += (settings.ShowFileNameLink ? '1' : '0');
                uploadMode += (settings.ShowDownload ? '1' : '0');
                uploadMode += (settings.ShowSaveKnowledge ? '1' : '0');
                uploadMode += (settings.ShowDelete ? '1' : '0');
                settings.UploadMode = uploadMode;

                settings.ButtonImgUrl = settings.ApplicationRoot + 'App_Themes/' + settings.Theme + '/' + settings.ButtonImgUrl;
                settings.FlashUrl = settings.ApplicationRoot + settings.FlashUrl;
                settings.UploadUrl = settings.ApplicationRoot + settings.UploadUrl;

                var _referenceJS = [];
                //如果相关文件已经引用过，则不再引用
                if (typeof SWFUpload == 'undefined')
                {
                    $.each(referenceJS, function (i, js)
                    {
                        _referenceJS.push(settings.ApplicationRoot + js);
                    });
                }
                settings.ReferenceJS = _referenceJS;
            }

            _THIS_.setTemplateURL(TemplateUrl).processTemplate(settings);

        });
    }

    $.fn.dynamicIDUpload.UploadOfficeMode = {
        'None': '0',           // 上传
        'Browse': '1',         // 查看
        'Editable': '2',       // 编辑
        'BrowsePrint': '3'     // 查看(带打印)
    };
})(jQuery);