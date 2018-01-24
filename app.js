
/**
 * 大家都飞虎飞的话克劳福德计划开发计划客户个电话的时间的结果是
 * I输给I睡个帅哥is看过好看三个傻瓜开始看公司控股还是开个号上课
 * 而是吐舌头营业人员
 * 
 * 55
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var api = require('./routes/api1.js');
var app = express();
app.use("/api",api);
app.use(cookieParser());
app.use(session({
	secret: '12345',
	name: 'm_blog', 
	cookie: {maxAge: 60*60*1000 },  
	resave: false,
	saveUninitialized: true,
}))


// all environments
app.set('port', process.env.PORT || 3000);             //设置端口为3000
app.set('views', path.join(__dirname, 'views'));     //设置views为存放视图文件的目录
app.set('view engine', 'ejs');                      //设置视图引擎为ejs
app.use(express.favicon());							//图标
app.use(express.logger('dev'));						//打印日记
app.use(express.json());
app.use(express.urlencoded());						//url编码
app.use(express.methodOverride());					//协助处理post请求
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));		//设置公共目录


if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


//路由控制器改变
api(app);
routes(app);