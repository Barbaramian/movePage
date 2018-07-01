
// 封装获取元素显示样式
var getStyle = function (ele, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(ele, null)[attr];
    } else {
        return ele.currentStyle[attr];
    }
}

// 封装拖拽事件
function drag(ele) {
    ele.onmousedown = function (e) {
        var event = e || window.event;
        // 防止冒泡
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
        document.onmousemove = function (e) {
            var event = e || window.event;
            ele.style.left = event.pageX - 0.5 * parseInt(ele.offsetWidth) + 'px';
            ele.style.top = event.pageY - 0.5 * parseInt(ele.offsetHeight) + 'px';
        }
        ele.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }
}
// 封装元素缓冲运动（元素，css属性(字符串)，css目标值）
function move(ele, attr, target) {
    var time = null;
    clearInterval(ele.time);
    var speed,
        style;
    ele.time = setInterval(function () {
        if (attr == 'opacity') {
            style = parseFloat(getStyle(ele, attr)) * 100;
            speed = (target - style) / 3;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            ele.style[attr] = parseInt(style + speed) / 100;
        } else {
            style = parseInt(getStyle(ele, attr));
            speed = (target - style) / 3;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            ele.style[attr] = style + speed + 'px';
        }
        if (style == target) {
            clearInterval(ele.time);
        } else {
            ele.style[attr] = style + speed + 'px';
        }
        if (Math.abs(target - style) < 3) {
            ele.style[attr] = target + 'px';
        }
    }, 40);
}

// 多物体多值链式缓冲运动框架(元素，想要改变的属性集合成为的对象，接下来要执行的函数名或匿名函数)
// var objattr = {       
//     width : '400',       对象中设定为举例
//     height : '200'
// }
// div.onclick = function(){
//     manyMove(this,objattr,function(){      链式运动举例：div运动完成后，div1进行运动....
//         manyMove(div1,objattr);
//     });
// }
function manyMove(ele, objattr, fun) {
    var time = null;
    clearInterval(ele.time);
    var speed,
        style;
    ele.time = setInterval(function () {
        var bStop = true;
        for (var attr in objattr) {
            if (attr == 'opacity') {
                style = parseFloat(getStyle(ele, attr)) * 100;
            } else {
                style = parseInt(getStyle(ele, attr));
            }
            speed = (objattr[attr] - style) / 3;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (attr == 'opacity') {
                ele.style[attr] = (style + speed) / 100;
            } else {
                ele.style[attr] = style + speed + 'px';
                if (Math.abs(objattr[attr] - style) < 3) {
                    ele.style[attr] = objattr[attr] + 'px';
                }
            }
            if (style != objattr[attr]) {
                bStop = false;
            }
        }
        if (bStop) {
            clearInterval(ele.time);
            typeof fun == "function" ? fun() : "";
        }
    }, 40);
}

// 左右摇摆运动（元素，css属性，css属性目标值）
function swayMove(ele) {
    clearInterval(ele.time);
    var time = null;
    var speed, a;
    speed = 20;
    a = 3;
    ele.time = setInterval(function () {
        if (ele.offsetLeft < 100) {
            speed = speed + a;
        } else {
            speed = speed - a;
        }
        ele.style.left = ele.offsetLeft + speed + 'px';
    }, 30);
}

// 弹性有摩擦运动
function elasMove(ele) {
    clearInterval(ele.time);
    var time = null;
    // var style = getStyle(ele,attr);
    var speed, a, u;
    speed = 20;
    u = 0.8;
    ele.time = setInterval(function () {
        a = (300 - ele.offsetLeft) / 8;
        speed = speed + a;
        speed = speed * u;
        if (Math.abs(speed) < 1 && Math.abs(300 - ele.offsetLeft) < 1) {
            clearInterval(ele.time);
        } else {
            ele.style.left = ele.offsetLeft + speed + 'px';
        }
    }, 30);
}

// 模拟重力场
function fallMove(ele) {
    clearInterval(ele.time);
    var time = null;
    var speedX, speedY, g, u;
    speedX = 100;
    speedY = 45;
    g = 5;
    u = 0.7;
    ele.time = setInterval(function () {
        speedY += g;
        var newLeft = ele.offsetLeft + speedX;
        var newTop = ele.offsetTop + speedY;
        if (newTop >= document.documentElement.clientHeight - ele.offsetHeight) {
            speedY *= -1;
            speedY *= u;
            speedX *= u;
            newTop = document.documentElement.clientHeight - ele.offsetHeight;
        }
        if (newTop <= 0) {
            speedY *= -1;
            speedY *= u;
            speedX *= u;
            newTop = 0;
        }
        if (newLeft >= document.documentElement.clientWidth - ele.offsetWidth) {
            speedX *= -1;
            speedX *= u;
            speedY *= u;
            newLeft = document.documentElement.clientWidth - ele.offsetWidth;
        }
        if (newLeft <= 0) {
            speedX *= -1;
            speedX *= u;
            speedY *= u;
            newLeft = 0;
        }
        ele.style.left = newLeft + 'px';
        ele.style.top = newTop + 'px';
    }, 30);
}
