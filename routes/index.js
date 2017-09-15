
/*
 * 前台路由管理
 */

// var Essay = require('../routes/essay');

module.exports = function(app){

/*首页*/
    app.get('/',function(req,res){
    	res.render('index', {
    		title : "华软社团管理系统",
    	});
    });
/*注册登录*/
    app.get('/login',function(req,res){
        res.render('login', {
            title : "注册/登录",
        });
    });
/*社团集*/
    app.get('/organizations',function(req,res){
        res.render('organizations', {
            title : "华软社团集",
        });
    });
/*活动集*/
    app.get('/activitys',function(req,res){
        res.render('activitys', {
            title : "华软活动集",
        });
    });
/*社团详情*/
    app.get('/organization/:organizationname',function(req,res){
        res.render('organization', {
            title : "华软社团详情介绍"
        });
    });
/*活动详情*/
    app.get('/activity/:activityname',function(req,res){
        res.render('activity', {
            title : "华软活动详情介绍"
        });
    });
/*日记集*/
    app.get('/diarys',function(req,res){
        res.render('diarys', {
            title : "华软社团日记集",
        });
    });
/*日记详情*/
    app.get('/diary/:diaryid',function(req,res){
        res.render('diary', {
            title : "华软社团日记"
        });
    });

/*个人中心*/
    app.get('/mydetail',function(req,res){
        res.render('mydetail', {
            title : "华软社团个人中心",
        });
    });
/*通知详情页面*/
    app.get('/inform/:informid',function(req,res){
        res.render('inform', {
            title : "华软社团通知",
        });
    });
/*管理中心*/
    app.get('/managecenter',function(req,res){
        res.render('managecenter', {
            title : "华软社团管理中心",
        });
    });
/*他人主页*/
    app.get('/userdetail/:userid',function(req,res){
        res.render('userdetail', {
            title : "华软社团个人主页",
        });
    });
/*联系我们*/
    app.get('/contact',function(req,res){
        res.render('contact', {
            title : "华软社团联系我们",
        });
    });
/*系统管理员界面*/
    app.get('/404',function(req,res){
        res.render('404', {
            title : "华软社团管理系统错误页面",
        });
    });
/*系统管理员界面*/
    app.get('/manage',function(req,res){
        res.render('manage', {
            title : "华软社团管理系统",
        });
    });
/*系统管理员登录界面*/
    app.get('/managelogin',function(req,res){
        res.render('managelogin', {
            title : "华软社团管理系统后台登陆",
        });
    });

}//module.exports


