function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$(function(){
    $("input").keydown(function(e){
        if(e.keyCode == 13){
            search();
        }
    });
    $('#top_box').append('<a href="http://www.0470yj.com/850/llh5.html" target="_blank"><img src="/public/img/guangao.gif" style="width:100%" alt=""></a>')
    $('#bottom_box').append('<a href="http://ashun520.com/app/andriod.apk"><img src="/public/img/pc3.png" style="width:100%" alt=""></a>')
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        var playerw='100%';//播放器宽度
        var playerh='360';//播放器高度
    } else {
        var playerw='900';//播放器宽度
        var playerh='550';//播放器高度
    }
    $("#cciframe").css({
        "width":playerw,
        "height":playerh
    });
    try{
        $('#cciframe').attr('src',player || '');
    }catch {

    }
    if($('img').length > 0){
        $('img').lazyload();
    }
    if (window.location.pathname == '/') {
        getFriendly();
    }
});

function getFriendly () {
    $.ajax({
        type: 'get',
        url: '/api/users.json',
        contentType: "application/json; charset=UTF-8",
        success: function (response) {
            var data = response.data;
            var alist = '<div class="friendly">';
            var style = '<style>.friendly{box-sizing: border-box;max-width:960px;width:100%;margin: 0 auto;padding: 5px;}.friendly a{display: inline-block;padding: 5px;}</style>'
            for(var i = 0; i < data.length; i++) {
                alist += '<a href="'+ data[i].url +'">'+ data[i].name +'</a>'
            }
            alist += '</div>';
            $('body').append(style);
            $('body').append(alist);
        },
        error: function (err) {
           
        }
    });
}
var cam_url = "http://www.baidu.com"; //视频CPS地址
function camLink(){
    window.open(cam_url);
}
function search(){
    var index = {form: "/vodtag/"}
    if(!$('#iserach').val()){
        alert('请输入搜索关键词');
    }else{
        location.href=index.form+$('#iserach').val()+'/';
    }
};