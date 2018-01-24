var http = require('http');
var querystring = require('querystring');
var url = require('url');
var express = require('express');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
app.use(cookieParser());
app.use(session({
  secret: '12345',
  name:'name',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

// 基于express路由
app.get('/', function(req, res) {
   res.setHeader('content-type','text/html; charset=utf-8');
   var get=url.parse(req.url,true).query;
   var nSelf=0,nComputer=0,msg="VS",sResult;
   if(get.action!="" && get.action!=undefined){
       nSelf=parseInt(get.nSelf);
       nComputer=parseInt(get.nComputer);
       var n = Math.round(Math.random()*2)+1;
       selfAction=handleSJB(get.action);
       computerAction=handleSJB(n);
       if((selfAction=="石头"&&computerAction=="剪刀")||(selfAction=="剪刀"&&computerAction=="布")||(selfAction=="布"&&computerAction=="石头")){
           nSelf++;
           sResult="<font color=green>你赢了</font>";
       }else if((selfAction=="剪刀"&&computerAction=="石头")||(selfAction=="布"&&computerAction=="剪刀")||(selfAction=="石头"&&computerAction=="布")){
           nComputer++;
           sResult="<font color=red>你输了</font>";
       }else{
           sResult="<font color=grey>平局</font>";
       }
       msg=computerAction+"vs"+selfAction+"<br>"+sResult;
       req.session.recordList=req.session.recordList+computerAction+"vs"+selfAction+"="+sResult+"("+nSelf+")<br>";
    }else{
      msg="VS";
      req.session.recordList='';
    }
    res.write('<style>#computer{float:left;}');
    res.write('#vs{float:left;width:100px;margin-left:20px;font-weight:bold;text-aligh:right;}');
    res.write('#self{float:left;}');
    res.write('#action a{line-height:30px;padding:8px}</style>');
    res.write('<div id="computer">电脑得分<br>'+nComputer+'</div>');
    res.write('<div id="vs">'+msg+'</div>');
    res.write('<div id="self">玩家得分<br>'+nSelf+'</div>');
    res.write('<div style="clear:both"></div>');
    res.write('<div id="action"><a href="?&action=1&nComputer='+nComputer+'&nSelf='+nSelf+'">👊🏻</a>');
    res.write('<a href="?&action=2&nComputer='+nComputer+'&nSelf='+nSelf+'">✌🏻</a>');
    res.write('<a href="?&action=3&nComputer='+nComputer+'&nSelf='+nSelf+'">🖐🏻</a>');
    res.write('<a href="?">重置</a></div><div><div id="record">'+req.session.recordList+'</div>');
    res.end();
});

function handleSJB(n){
  if(n==1){
    return'石头';
  }else if(n==2){
    return'剪刀';
  }else if(n==3){
    return'布';
  }
  return "";
}

// 打开3000监听窗口
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on localhost:'+ port);