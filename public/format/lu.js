var request = require("request");
var cheerio = require('cheerio');
const iconv = require('iconv-lite');
// var resour = 'http://www.xcx32.com';
// var resour2 = 'http://m.xcx32.com';

var friendly = [];

var ip = [
    '14.192.76.22',
    '27.54.72.21',
    '27.224.0.14',
    '36.0.32.19',
    '36.37.40.21',
    '36.96.0.11',
    '39.0.0.24',
    '39.0.128.17',
    '40.0.255.24',
    '40.251.227.24',
    '42.0.8.21',
    '42.1.48.21',
    '42.1.56.22',
    '42.62.128.19',
    '42.80.0.15',
    '42.83.64.20',
    '42.96.96.21',
    '42.99.112.22',
    '42.99.120.21',
    '42.100.0.14',
    '42.157.128.20',
    '42.187.96.20',
    '42.194.64.18',
    '42.248.0.13',
    '43.224.212.22',
    '43.225.236.22',
    '43.226.32.19',
    '43.241.88.21',
    '43.242.64.22',
    '43.247.152.22',
    '45.116.208.24',
    '45.120.243.24'
];
function getAjax(url, req) {
    var usAgM = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1';
    var usAgP = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36';
    return new Promise((resolve, reject) => {
        var options = {
            method: 'GET',
            url: url,
            gzip: true,
            encoding: null,
            headers: {
                "X-Forwarded-For": ip[Math.floor(Math.random() * ip.length)] || '42.194.64.18',
                'User-Agent': req.headers['host'].indexOf('m.') > -1 ? usAgM : usAgP,
                'referer': 'http://ym.sm.cn',
                'Cookie': req.headers['cookie']
            }
        };
        request(options, function (error, response, body) {
            if (error) {
                reject(error+'未知异常=======');
                return;
            };
            //页面本身有404
            // if (response.statusCode === 404) {
            //     reject(response.statusMessage);
            //     return;
            // }
            try {
                var buf = iconv.decode(body, 'utf-8');//获取内容进行转码
                $ = cheerio.load(buf);
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    });
}

var styleOver = '<style>body{background: #ffe9e9!important;}.top-banner{background-color: #9c4e4e!important;}.search_key{height:20px;!important;}</style>'
var js = '<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script><script src="//cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js"></script>'
var com = '<script src="/public/common.js"></script>';
var rel = /https\:\/\/www\.xcx32\.com|\/\/www\.xcx32\.com|http\:\/\/www\.xcx32\.com|https\:\/\/\.xcx32\.com|http\:\/\/\.xcx32\.com|www\.xcx32\.com/ig;
var rel2 = /https\:\/\/m\.xcx32\.com|\/\/m\.xcx32\.com|http\:\/\/m\.xcx32\.com|m\.xcx32\.com/ig;
var rel3 = /http\:\/\/static\.xcx32\.com/ig;
function getHtml(req, resour) {
    var url = req.url;
    var rsr = resour;
    return new Promise((resolve, reject) => {
        getAjax(rsr+url, req).then(function () {
            var script = $('script');
            var alist = $('a');
            var head = $('head');
            var title = $('title');
            var body = $('body');
            var style = $('link');
            var imgs = $('img');
            var form = $('form');
            $('#urltips').remove();
            script.each(function () {
                var src = $(this).attr('src');
                if (src) {
                    if (src.indexOf('xcx32.com') > -1) {
                        $(this).attr('src', src.replace(rel, '').replace(rel2, ''));
                        // 必须保留jquery.index  js
                    } else if (src.indexOf('ckplayer') <= -1){
                        $(this).remove();
                    }
                }
            });
            style.each(function () {
                var src = $(this).attr('href');
                if (src && src.indexOf('xcx32.com') > -1) {
                    if (src.indexOf('http://static.xcx32.com') > -1) {
                      $(this).attr('href', src.replace(rel3, '/origin_static'));
                    } else {
                      $(this).attr('href', src.replace(rel, '').replace(rel2, ''));
                    }
                }
            });
            imgs.each(function () {
                var src = $(this).attr('src');
                var dataOriginal = $(this).attr('data-original');
                $(this).attr('onerror', '');
                if (src) {
                    if (src.indexOf('http') > -1) {
                      if (src.indexOf('m.xcx32.com') > -1) {
                        $(this).attr('src', src.replace(rel2, ''));
                      } else {
                        $(this).attr('src', src.replace(rel, ''));
                      }
                    }
                }
            });
            form.each(function () {
                var src = $(this).attr('action');
                if (src) {
                    $(this).attr('action', src.replace(rel, ''));
                }
            });
            for (var i = 0; i < alist.length; i++) {
                var hf = $(alist[i]).attr('href');
                var txt = $(alist[i]).text();
                var hfRe = '';
                if (txt == '投推荐票' || txt == '加入书架' || txt == '错误举报' || txt == '会员登陆' || txt == '用户注册' || txt == '加入书签' || txt == '我的书架' || hf == '/mybook.php') {
                    $(alist[i]).remove();
                } else {
                    if (hf) {
                        if (hf.indexOf('www.xcx32.com') > -1 || (hf.indexOf('xcx32.com') > -1 && hf.indexOf('m.xcx32.com') <= -1)) {
                            hfRe = hf.replace(rel, '');
                        } else if (hf.indexOf('m.xcx32.com') > -1) {
                            hfRe = hf.replace(rel2, '');
                        } else if (hf.indexOf('javascript:') > -1 || hf == '#top' || hf == '/') {
                            hfRe = hf;
                        } else if (hf.indexOf('http') > -1 && hf.indexOf('xcx32.com') <= -1) {
                            hfRe = '';
                        } else {
                            hfRe = hf;
                        }
                        $(alist[i]).attr('href', hfRe);
                    }
                }
            }
    
            head.prepend(js);
            body.append(com);
            body.append(styleOver);
            var html = $.html();
            html = html.replace(/欲海情阁/g, 'xjb520');
            html = html.replace(/\(&#x8BB0;&#x5F97;&#x662F;https:\/\/\)/g, '');
            html = html.replace(/https:/g, '');
            html = html.replace(/www.xcx32/g, 'xjb520.com');
            html = html.replace(/&#x6B32;&#x6D77;&#x60C5;&#x9601;/g, 'xjb520');
            html = html.replace(/ggss5521@163.com/g, 'sexlookashun@sina.com');
            html = html.replace(/gengxin25@163.com/g, 'sexlookashun@sina.com');
            html = html.replace(/www.yumc.tv/g, 'www.xjb520.com');
            html = html.replace(rel2, 'http://m.xjb520.com');
            html = html.replace(rel, 'http://www.xjb520.com');
            resolve(html)
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

module.exports = getHtml;