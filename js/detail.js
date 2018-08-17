function ajax() {  
    var ajaxData = {    
        type: arguments[0].type || "GET",
            url: arguments[0].url || "",
            async: arguments[0].async || "true",
            data: arguments[0].data || null,
            dataType: arguments[0].dataType || "text",
            contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
            beforeSend: arguments[0].beforeSend || function () {},
            success: arguments[0].success || function () {},
            error: arguments[0].error || function () {}  
    }; 
    ajaxData.beforeSend(); 
    var xhr = createxmlHttpRequest();   
    try{
        xhr.responseType = ajaxData.dataType;  
    }catch (err) {
        console.log(err)
    };
    xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);   
    xhr.setRequestHeader("Content-Type", ajaxData.contentType);   
    xhr.send(convertData(ajaxData.data));   
    xhr.onreadystatechange = function () {     
        if (xhr.readyState == 4) {       
            if (xhr.status == 200) {
                ajaxData.success(xhr.response);      
            } else {        
                ajaxData.error();      
            }     
        }  
    } 
};
function createxmlHttpRequest() {   
    if (window.ActiveXObject) {     
        return new ActiveXObject("Microsoft.XMLHTTP");   
    } else if (window.XMLHttpRequest) {     
        return new XMLHttpRequest();   
    } 
}; 
function convertData(data) {  
    if (typeof data === 'object') {    
        var convertResult = "";     
        for (var c in data) {       
            convertResult += c + "=" + data[c] + "&";     
        }     
        convertResult = convertResult.substring(0, convertResult.length - 1);   
        return convertResult;  
    } else {    
        return data;  
    }
};
// 判断是不是手机端
var ua = navigator.userAgent;
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
var isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
var isAndroid = ua.match(/(Android)\s+([\d.]+)/);
var isMobile = isIphone || isAndroid;
// detail
var params = window.location.search.split('myparams=');
var defaultUrl = '';
var bodyer = document.getElementById('bodyer');
var mySpare = document.getElementById('my-spare');
var downLoad = '';
if (params && params.length > 1) defaultUrl = params[1];
if (defaultUrl) {
    getHtml(defaultUrl);
}

function down(s){
    s=s.replace("https://d.220zx.com","https://d.221zx.com");
    return s;
}
function getHtml(url) {
    ajax({  
        type: "get",
          url: "/api" + url,
          beforeSend: function () {},
            //some js code 
        success: function (msg) {
            var reTag = /下载app播放|<link(?:.|\s)*?>|<body[^>]*>|<\/body>|<script(?:.|\s)*?<\/script>|<iframe(?:.|\s)*?<\/iframe>/ig;
            var cont = /<body(?:.|\s)*?<\/body>/g;
            var result = cont.exec(msg);
            var html = '';
            // 获取下载链接
            var downUrl = /var down_url(?:.|\s)*?\;/g;
            var urlResult = downUrl.exec(msg);
            if (urlResult && urlResult[0]) {
                downLoad = urlResult[0].replace(/\'/g, '\"').replace(/\s+|var|down_url|=|\"|\;/g, '');
            }
            if (result && result[0]) {
                html = result[0].replace(reTag,'');
            }
            mySpare.innerHTML = html;
            setTimeout(function() {
                reset();
            }, 30);
        },
        error: function () {    
            alert('获取资源失败，请切换其它资源');
            window.location.href = 'http://xjb520.com';
        }
    });
}
// 去除元素
function reset() {
    // 过滤元素下载链接
    var divEles = mySpare.children;
    var imgs = mySpare.querySelectorAll('img');
    var getA = mySpare.querySelectorAll('a');
    if (divEles && divEles.length) {
        // 去除a链接
        for (var i = 0; i < getA.length; i++) {
            var href = getA[i].getAttribute('href');
            getA[i].setAttribute('my-data', href);
            getA[i].removeAttribute('href');
        }
        // 添加完整的图片路径
        for (var i = 0; i < imgs.length; i++) {
            var src = imgs[i].getAttribute('src');
            imgs[i].removeAttribute('onerror');
            if (src.indexOf('http') === -1) {
                imgs[i].setAttribute('src', '//www.940hs.com/' + src);
            }
        }
        var obj = {};
        obj.position = mySpare.querySelector('.navv_box');
        obj.content = mySpare.querySelector('.box');
        bodyer.innerHTML = '';
        bodyer.appendChild(obj.position);
        bodyer.appendChild(obj.content);
        mySpare.parentNode.removeChild(mySpare);
        if (downLoad) {
            var tipP = document.createElement('p');
            tipP.className = 'tip-txt';
            obj.content.querySelector('.film_bar b font').innerHTML = down(downLoad);
            tipP.innerHTML = '提示：在线播放为标清版，若对画质有要求的朋友，请选择下载高清版到本地播放';
            obj.content.querySelector('.film_bar b').appendChild(tipP);
        }
        getClike(obj);
    } else {
        reset();
    }
}

// 注册事件
function getClike(obj) {
    obj.menu = document.querySelector('.my-menu');
    for(var key in obj) {
        var list = obj[key].querySelectorAll('a');
        if (key === 'content') {
            successContent(list, '1');
        } else {
            successContent(list);
        }
    }
    
    function successContent(list, wrp) {
        for (var i = 0; i < list.length; i++) {
            list[i].onclick = function (event) {
                var hrf = decodeURIComponent(this.getAttribute('my-data'));
                if (!wrp) {
                    if (hrf === '/') {
                        window.location.href = '/';
                    } else {
                        window.location.href = '/?myparams='+hrf;
                    }
                } else {
                    if (hrf.indexOf('http') > -1 && hrf.indexOf('www.940hs.com') <= -1) {
                        window.open(hrf);
                    } else {
                        if (isMobile) {
                            window.location.href = '/video.html?myparams=' + hrf;
                        } else {
                            window.open('/video.html?myparams=' + hrf);
                        }
                    }
                    
                }
                event.cancelBubble = true;
                event.stopPropagation();
                event.preventDefault();
            }
        }
    }
}