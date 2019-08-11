var express = require('express');
var fs = require('fs');
var request = require('request');
var common = require('./common');
var compress = require('compression');
var app = express();
app.use(compress());
app.use('/public', express.static('public'));

app.all('/*', function(req, res, next) {
  if (req.url == '/favicon.ico' || !req.headers['host']) {
    res.end();
    return
  }
  if (req.url == '/robots.txt') {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    var content = fs.readFileSync('./public/robots.txt', "binary");
    res.write(content, "binary")
    res.end();
    return
  }
  var siteObj = common.site(req);
  if (!siteObj || !siteObj.formatHtml) {
    console.log(req.headers['host'])
  }
  var getHtml = require(siteObj.formatHtml);
  var reqUrl = common.getFile(siteObj.static + req.url.split('?')[0]);
  var resource = fs.existsSync(reqUrl);
  var pointSp = reqUrl.split('.');
  var houZ = pointSp[pointSp.length - 1];
  if (!resource) {
    if (common.getContType(houZ)) {
      if (common.getContType(houZ) === 'text/html') {
        getHtml(req, siteObj.targetUrl).then(function(data) {
          if (houZ !== 'php') {
            fs.writeFileSync(reqUrl, data);
          }
          res.writeHead(200, {'Content-Type': common.getContType(houZ)})
          res.end(data);
        }).catch(err => {
          res.writeHead(404, {'Content-Type': 'text/html'})
          var content = fs.readFileSync('./public/404.html', "binary");
          res.write(content, "binary")
          res.end();
        })
      } else {
        var stUrl = siteObj.targetUrl + req.url;
        if (siteObj.originStaticUrl && req.url.indexOf('/origin_static/') > -1) { // 第三方资源
          stUrl = siteObj.originStaticUrl + req.url.replace('/origin_static', '');
        }
        var getReq = request({
          url: stUrl,   // 请求的URL
          method: 'GET',                   // 请求方法
          headers: {                       // 指定请求头
            'Accept-Language': 'zh-CN,zh;q=0.8',         // 指定 Accept-Language
            'Cookie': '__utma=4454.11221.455353.21.143;' // 指定 Cookie
          }
        })
        var getPipe = getReq.pipe(fs.createWriteStream(reqUrl))
        getPipe.on('error', function() {
          res.writeHead(404, {'Content-Type': houZ});
          res.end();
        })
        getPipe.on('finish',function() {
          var content = fs.readFileSync(reqUrl, "binary");
          res.writeHead(200, {'Content-Type': common.getContType(houZ)});
          res.write(content, "binary");
          res.end();
        })
      }
    } else {
      res.writeHead(404, {'Content-Type': 'text/html'})
      var content = fs.readFileSync('./public/404.html', "binary");
      res.write(content, "binary")
      res.end();
    }
  } else {
    var expireTime = 0;
    if (common.getContType(houZ) === 'text/html' && req.url === '/') {
      var stat = fs.statSync(reqUrl);
      var exTime = stat.mtime.getTime();
      var nowTime = new Date().getTime();
      var expireTime = (nowTime - exTime) / 1000 / 60 / 60;
    }
    if (expireTime > 8) {
      getHtml(req, siteObj.targetUrl).then(function(data) {
        fs.writeFileSync(reqUrl, data);
        res.writeHead(200, {'Content-Type': common.getContType(houZ)})
        res.end(data);
      })
    } else {
      var content =  fs.readFileSync(reqUrl,"binary");
      res.writeHead(200, {'Content-Type': common.getContType(houZ)})
      res.write(content, "binary")
      res.end();
    }
  }
})
var server = app.listen(8184)