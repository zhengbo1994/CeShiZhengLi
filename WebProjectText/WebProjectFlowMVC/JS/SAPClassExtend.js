//该文件只用于存放需要扩展的类，不接受任何函数，只接受扩展方法
//作者:舒先 2015年1月22日


//数组类
var SAPArray = function (arg) {
    var saparray;
    var sapArray = function sapArray() {
        this.constructor = Array.constructor;
        this.value = arg;
    }
    
    saparray = new sapArray();
    var fn = sapArray.prototype;

    fn.removeAtIndex = function (index) {
        ///	<summary>
        /// 扩展Array方法，按索引删除元素,不修改原数组 shux 2015年1月13日
        ///	</summary>
        ///	<param name="index" type="Int">
        ///	数字
        ///	</param>
        ///	<returns type="Array" />

        if (Object.prototype.toString.call(this).indexOf('Array') < 0)
            return;

        //不是数字返回异常
        if (/D/g.test(index))
            throw new TypeError();

        var ret = [];

        for (var i = 0; i < this.length; i++) {
            if (i != index)
                ret.push(this[i]);
        }

        return ret;
    };

    fn.indexOf = function (arg) {
        ///	<summary>
        /// 扩展Array方法，返回元素所在第一个索引,为-1时代表无匹配 shux 2015年1月13日
        ///	</summary>
        ///	<param name="arg" type="anyType">
        ///	直接量
        ///	</param>
        ///	<returns type="index" />

        if (![].indexOf) {
            return Array.prototype.indexOf.call(this, arg);
        }

        if (this === window)
            return;

        for (var i = 0; i < this.length; i++) {
            if (this[i] == arg)
                return i;
        }

        return -1;
    }

    fn.removeRepeated = function (val) {
        ///	<summary>
        /// 扩展Array方法，按值删除元素,不修改原数组 shux 2014年12月10日
        ///	</summary>
        ///	<param name="val" type="任意">
        ///	任意类型值，或不指定则只保留一个重复的
        ///	</param>
        ///	<returns type="Array" />

        if (this === window)
            return;

        var ret = [];
        if (val)
            for (var i = 0, j = this.length; i < j; i++) {
                if (this[i] != val)
                    ret.push(this[i])
            }
        else {
            var retTemp = [];
            for (var pro in this) {
                var now = this[pro];
                if (now === [][pro]) continue; //过滤当前原型函数
                if (retTemp[now] != true) {
                    ret.push(now);
                    retTemp[now] = true;
                }
            }
        }
        return ret;
    }

    return saparray;
}

//字符串类
var SAPString = function (arg) {
    var sapstring;

    var sapString = function sapString() {
        this.value = arg;
        this.prototype = String.prototype;
    }

    sapstring = new sapString();
    var fn = sapString.prototype;

    /*转换为Int，有非数字字符则不作操作*/
    fn.toInt = function () {
        if (/D/.test(this))
            return;
        else
            return parseInt(this);
    }

    /*转换为Float*/
    fn.toFloat = function () {
        if (/D/.test(this))
            return;
        else
            parseFloat(this)
    }

    return sapstring;
}




Array.prototype.removeAtIndex = function (index) {
    ///	<summary>
    /// 扩展Array方法，按索引删除元素,不修改原数组 shux 2015年1月13日
    ///	</summary>
    ///	<param name="index" type="Int">
    ///	数字
    ///	</param>
    ///	<returns type="Array" />

    if (Object.prototype.toString.call(this).indexOf('Array') < 0)
        return;

    //不是数字返回异常
    if (/D/g.test(index))
        throw new TypeError();

    var ret = [];

    for (var i = 0; i < this.length; i++) {
        if (i != index)
            ret.push(this[i]);
    }

    return ret;
};

(![].indexOf) && (Array.prototype.indexOf = function (arg) {
    ///	<summary>
    /// 扩展Array方法，返回元素所在第一个索引,为-1时代表无匹配 shux 2015年1月13日
    ///	</summary>
    ///	<param name="arg" type="anyType">
    ///	直接量
    ///	</param>
    ///	<returns type="index" />

    if (this === window)
        return;

    for (var i = 0; i < this.length; i++) {
        if (this[i] == arg)
            return i;
    }

    return -1;
});

Array.prototype.removeRepeated = function (val) {
    ///	<summary>
    /// 扩展Array方法，按值删除元素,不修改原数组 shux 2014年12月10日
    ///	</summary>
    ///	<param name="val" type="任意">
    ///	任意类型值，或不指定则只保留一个重复的
    ///	</param>
    ///	<returns type="Array" />

    if (this === window)
        return;

    var ret = [];
    if (val)
        for (var i = 0, j = this.length; i < j; i++) {
            if (this[i] != val)
                ret.push(this[i])
        }
    else {
        var retTemp = [];
        for (var pro in this) {
            var now = this[pro];
            if (now === [][pro]) continue; //过滤当前原型函数
            if (retTemp[now] != true) {
                ret.push(now);
                retTemp[now] = true;
            }
        }
    }
    return ret;
}

String.prototype.toInt = function () {
    ///	<summary>
    /// 扩展string方法,将字符转成数字,不修改原对象 shux 2015年1月12日
    ///	</summary>
    if (this === window)
        return;

    return parseInt(this);
}