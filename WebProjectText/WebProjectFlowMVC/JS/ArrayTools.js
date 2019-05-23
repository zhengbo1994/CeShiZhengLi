if(!Array.prototype.indexOf){
    Array.prototype.indexOf = function(element, index){
        var length = this.length;
        if(index == null){
            index = 0;
        }else{
            index = +index || 0;
            if(index < 0) index+= length;
            if(index < 0) index = 0;
        }
        for(var current;index<length;index++){
            current = this[index];
            if(current === element) return index;
        } 
        return -1;
    }
}
if(!Array.prototype.lastIndexOf){
    Array.prototype.lastIndexOf = function(element, index){
        var length = this.length;
        if(index == null){
            index = length - 1;
        }else{
            index = +index || 0;
            if(index < 0) index+= length;
            if(index < 0) index = -1;
            else if(index >= length) index = length - 1;
        }
        for(var current;index>=0;index--){
            current = this[index];
            if(current === element) return index;
        }
        return -1;
    }
}

/*
    去除数组中的重复项
    注意与jquery.unique方法的区别：jquery的方法只对对象数组有效，而对字符串、数字等数组无效。
*/
Array.prototype.unique = function()
{
    var length = this.length;
    //edit by 杨俊 2017-06-13 添加对数组长度为0的判断，避免出现死循环
    if (length == 0) {
        return;
    }
    while(--length){
        //如果在前面已经出现，则将该位置的元素删除
        if(this.lastIndexOf(this[length],length-1) > -1) {
            this.splice(length,1);
        }
    }   
}