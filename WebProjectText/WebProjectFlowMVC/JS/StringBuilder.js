/*
模拟 C#中的StringBuilder,提升JS中字符串拼接的效率及性能。
Author : Jeremy 
Date   : 2010-10-25
*/

//对象定义（构造函数)
//参数：所有参数须为字符串形式.
//当参数长度大于0时，参数将是字符串值
//当不指定参数时，分隔符默认为空白
//在toString方法中可显式指定分隔符
// 注： 以下各方法的示例中，均使用str作为StringBuilder类的实例作为演示
//如：
// var str = new StringBuilder('a','b','c'); 
// 则在toString()时，将输出 'abc'
// toString(",")时，将输出'a,b,c'
function StringBuilder() {
    this._buffers = [];
    this._length = 0;
    this._splitChar = '';

    if (arguments.length > 0) { 
        this.append.apply(this,arguments); 
    }
}

//向对象中添加字符串
//参数：字符串集合,可传入一个或多个字符串
/* 调用方法实例： 
    1. str.append("someString");
    2. str.append("str1","str2","str3","str4");
*/
StringBuilder.prototype.append = function () {
    if (arguments.length > 0) {
        for (var i = 0, iLen = arguments.length; i < iLen; i++) {
            this._length += arguments[i].length;
            this._buffers.push(arguments[i]);
        }
    }
}
StringBuilder.prototype.add = StringBuilder.prototype.append;

//向对象附加格式化的字符串
//参数：参数一是预格式化的字符串，如：'{0} {1} {2}'
//格式参数可以是数组，或对应长度的arguments,
//参见示例
StringBuilder.prototype.appendFormat = function () {
    if (arguments.length > 1) {
        var TString = arguments[0];
        if (arguments[1] instanceof Array) {
            for (var i = 0, iLen = arguments[1].length; i < iLen; i++) {
                var jIndex = i;
                var re = eval("/\\{" + jIndex + "\\}/g;");
                TString = TString.replace(re, arguments[1][i]);
            }
        }
        else {
            for (var i = 1, iLen = arguments.length; i < iLen; i++) {
                var jIndex = i - 1;
                var re = eval("/\\{" + jIndex + "\\}/g;");
                TString = TString.replace(re, arguments[i]);
            }
        }
        this.append(TString);
    }
    else if (arguments.length == 1) {
        this.append(arguments[0]);
    }
}

//字符串长度（相当于toString()后输出的字符串长度
StringBuilder.prototype.length = function () {
    if (this._splitChar.length > 0 && (!this.isEmpty())) {
        return this._length + (this._splitChar.length * (this._buffers.length - 1));
    }
    else {
        return this._length;
    }
}
//字符串是否为空
StringBuilder.prototype.isEmpty = function () {
    return this._buffers.length <= 0;
}
//清空
StringBuilder.prototype.clear = function () {
    this._buffers = [];
    this._length = 0;
}
//输出
//参数：可以指定一个字符串（或单个字符），作为字符串拼接的分隔符
StringBuilder.prototype.toString = function () {
    if (arguments.length == 1) {
        return this._buffers.join(arguments[1]);
    }
    else {
        return this._buffers.join(this._splitChar);
    }
}

//示例：
/*
var sb = new StringBuilder(); 
alert(sb.length());
sb.append('hEllo');
sb.append('wORLD');
alert(sb.toString('&&')); //将输出 hEllo&&wORLD
sb.clear();   
sb.appendFormat("Hello! {0} {1} {2}",['a','b','c']);
sb.appendFormat("Today is {0}",['周一']);
alert(sb.toString());  //将输出 Hello! a b c&&Today is 周一
sb.clear();
sb.appendFormat("Hello! {0} {1} {2}",'a','b','c');
sb.append('World');
alert(sb.toString('__')); //将输出 Hello! a b c__World
*/

/* -------------------------辅助函数 ------------------------------*/
// 判断对象是否数组
function checkIsArray(obj) {
    return Object.prototype.toString.call(obj).toLocaleLowerCase().indexOf("array") > -1;
}