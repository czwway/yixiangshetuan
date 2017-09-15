const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const async = require('async');
const yxass = require('../module/yxass.js')

/*API:
    @mothod get
    @description 获取活动或日记的评论
    @url /api/comment
    @author yekoy
    @time 2017年6月18日10:01:08
*/
router.get('/comment',function(req,res){
    let comtype = req.query.comtype;
    let prid = req.query.prid;
    yxass.getComment(comtype,prid,function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null,data:rs}));
        }
    });
})

/*API:
    @mothod get
    @description 获取个人信息
    @url /api/user/userinfo
    @author yekoy
    @time 2017年6月18日10:19:41
*/
router.get('/user/userinfo',function(req,res){
    let userid = req.query.userid;
    async.auto({
        getUser:function(cb){
            yxass.getUser(userid,function(err,r){
                if(err)cb(err);
                else cb(null,r);
            });
        },

        getInform:function(cb){
            yxass.getAllUserInform(userid,function(err,r){
                if(err)cb(err);
                else cb(null,r);
            });
        },
        getAllUserAct:function(cb){
            yxass.getAllUserAct(userid,function(err,r){
                if(err)cb(err);
                else cb(null,r);
            });
        },
        getAllUserDep:function(cb){
            yxass.getAllUserDep(userid,function(err,r){
                if(err)cb(err);
                else cb(null,r);
            })
        },
        getAllUserDia:function(cb){
            yxass.getAllUserDia(userid,function(err,r){
                if(err)cb(err);
                cb(null,r);
            })
        }
    },function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        let u = new Object();
        u['basic'] = rs.getUser;
        u['inform'] = rs.getInform;
        u['activity'] = rs.getAllUserAct;
        u['organization'] = rs.getAllUserDep;
        u['diary']=rs.getAllUserDia;
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null,data:u}));
        }
    });
})

/*API:
    @mothod post
    @description 获取日记内容
    @url /api/diary/byid
    @author yekoy
    @time 2017年6月18日11:01:38
*/
router.post('/diary/byid',function(req,res){
    let diaid = req.body.diaid;
    yxass.getDiaById(diaid,function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null,data:rs}));
        }
    });
})

/*API:
    @mothod post
    @description 更新个人信息
    @url /api/user/updateinfo
    @author yekoy
    @time 2017年6月18日11:01:38
*/
router.post('/user/updateinfo',function(req,res){
    let info = new Object();
    info['number'] = req.body.number;
    info['realname'] = req.body.realname;
    info['sex'] = req.body.sex;
    info['grade'] = req.body.grade;
    info['major'] = req.body.major;
    info['phone'] = req.body.phone;
    userid = req.body.userid
    yxass.getDiaById(userid,info,function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null}));
        }
    });
})

/*API:
    @mothod post
    @description 修改密码
    @url /api/user/updatepassword
    @author yekoy
    @time 2017年6月18日11:17:44
*/
router.post('/user/updatepassword',function(req,res){
    let userid = req.body.userid;
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    async.auto({
        getPsw:function(cb){
            yxass.getUserPswByid(userid,function(err,rs){
                if(err)cb(err);
                else cb(null,rs);
            });
        },
        checkPsw:['getPsw',function(rs,cb){
            let md5 = crypto.createHash('md5');
            oldpassword = md5.update(oldpassword).digest('hex');
            let op = rs.getPsw
            if(oldpassword == op[0].password){
                cb(null,true);
            }else{
                let err = new Object();
                err['flag']=1
                err['message'] = '密码不一致'
                cb(null,false);
            }
        }],
        changePsw:['checkPsw',function(rs,cb){
            if(rs.checkPsw){
                let md51 = crypto.createHash('md5');
                newpassword = md5.update(oldpassword).digest('hex');
                yxass.updatepassword(userid,newpassword,function(err,rs){
                    if(err)cb(err);
                    else cb(null);
                });
            }else{
                let err = new Object();
                err['message']= "两次输入的密码不一致"
                cb(err);
            }
        }]
    },function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null}));
        }
    });

})

/*API:
    @mothod post
    @description 添加日记
    @url /api/diary/add
    @author yekoy
    @time 2017年6月18日11:42:03
*/
router.post('/diary/add',function(req,res){
    let diary = new Object();
    diary['title'] = req.body.title;
    diary['content'] = req.body.content;
    diary['author'] = req.body.author;
    diary['about'] = req.body.about;
    diary['time'] = new Date();
    yxass.addDia(diary,function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null}));
        }
    });
})

/*API:
    @mothod post
    @description 活动报名
    @url /api/activity/jion
    @author yekoy
    @time 2017年6月18日11:44:37
*/
router.post('/activity/jion',function(req,res){

    let actid = req.body.actid;
    let userid = req.body.userid;

    yxass.JoinAct(actid,userid,function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null}));
        }
    });
})

/*API:
    @mothod get
    @description 获取活动报名情况
    @url /api/activity/userlist
    @author yekoy
    @time 2017年6月18日10:01:08
*/
router.get('/activity/userlist',function(req,res){
    let actid = req.query.actid;
    yxass.getActUser(actid,function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null,data:rs}));
        }
    });
})

/*API:
    @mothod post
    @description 删除用户00
    @url /api/user/delete
    @author yekoy
    @time =2017年6月18日12:17:40
*/
router.post('/user/delete',function(req,res){

    let userid = req.body.userid;

    yxass.delectUser(userid,function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null}));
        }
    });
})

/*API:
    @mothod get
    @description 获取社团举办的活动信息
    @url /api/organization/activity
    @author yekoy
    @time 2017年6月18日12:26:12
*/
router.get('/organization/activity',function(req,res){

    let orgid = req.query.orgid;
    console.log(orgid);
    yxass.getActByOrg(orgid,function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null,data:rs}));
        }
    });
})

/*API:
    @mothod get
    @description 获取社团活动轮播
    @url /api/activity/lunbo
    @author yekoy
    @time 2017年6月18日12:38:12
*/
router.get('/activity/lunbo',function(req,res){

    yxass.getActBeforeEnd(function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null,data:rs}));
        }
    });
})

/*API:
    @mothod post
    @description 用户登陆
    @url /api/user/login
    @author yekoy
    @time 2017年6月18日12:41:37
*/
router.post('/user/login',function(req,res){

    let username = req.body.username;
    let password = req.body.password;
    let md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');
    yxass.getUserPswByName(username,function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            if(password == rs[0].password){
                res.send(JSON.stringify({result:1,err:null,data:{groupid:rs[0].groupid}}));
            }else{
                res.send(JSON.stringify({result:0,err:"用户名密码输入有误"}));
            }
        }
    });
})

/*API:
    @mothod post
    @description 用户注册
    @url /api/user/register
    @author yekoy
    @time 2017年6月18日12:55:28
*/
router.post('/user/register',function(req,res){

    let username = req.body.username;
    let password = req.body.password;
    let md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');
    yxass.addUser(username,password,function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null}));
        }
    });
})

/*API:
    @mothod post
    @description 获取用户头像
    @url /api/user/userimg
    @author yekoy
    @time 2017年6月18日12:58:27
*/
router.post('/user/userimg',function(req,res){

    let userid = req.body.userid;

    yxass.getUserImg(userid,function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null,data:rs}));
        }
    });
})

/*API:
    @mothod get
    @description 获取热门社团
    @url /api/organization/hot
    @author yekoy
    @time 2017年6月18日12:59:38
*/
router.get('/organization/hot',function(req,res){

    yxass.getHotOrg(function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null,data:rs}));
        }
    });
})


/*API:
    @mothod get
    @description 获取最新日记
    @url /api/diary/new
    @author yekoy
    @time 2017年6月18日13:22:49
*/
router.get('/diary/new',function(req,res){

    yxass.getNewDia(function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null,data:rs}));
        }
    });
})

/*API:
    @mothod get
    @description 获取所有社团
    @url /api/organization/all
    @author yekoy
    @time 2017年6月18日13:24:52
*/
router.get('/organization/all',function(req,res){

    yxass.getAllOrg(function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null,data:rs}));
        }
    });
})

/*API:
    @mothod get
    @description 获取所有活动
    @url /api/activity/all
    @author yekoy
    @time 2017年6月18日13:29:06
*/
router.get('/activity/all',function(req,res){

    yxass.getAllAct(function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null,data:rs}));
        }
    });
})

/*API:
    @mothod get
    @description 获取社团部门信息
    @url /organization/department
    @author yekoy
    @time 2017年6月18日13:29:30
*/
router.get('/organization/department',function(req,res){
    let orgid = req.query.orgid;
    async.auto({
        getOrgDep:function(cb){
            yxass.getOrgDep(orgid,function(err,rs){
                if(err)cb(err);
                else cb(null,rs);
            })
        },
        getDepUser:['getOrgDep',function(rs,cb){
            async.mapSeries(rs.getOrgDep,function(item,ccc){
                //console.log(item);
                yxass.getDepUser(item['depid'],function(err,r){
                    //console.log(r)
                    if(err) ccc(err);
                    else ccc(null,r);
                })
            },function(err,rr){
                if(err)cb(err);
                else cb(null,rr);
            })
        }]
    },function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        //console.log(rs);
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            let data = {};
            data = rs.getOrgDep;
            for(let i=0,len=data.length;i<len;i++){
                data[i].depuser = rs.getDepUser[i];
            }
            res.send(JSON.stringify({result:1,err:null,data:data}));
        }
    })
})

/*API:
    @mothod get
    @description 获取通知信息
    @url /api/inform/getinfo
    @author yekoy
    @time 2017年6月18日14:35:592
*/
router.get('/inform/getinfo',function(req,res){
    let infid = req.query.infid;
    yxass.getInfById(infid,function(err,rs){
        res.setHeader("Access-Control-Allow-Origin","*");
        if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
        }else{
            res.send(JSON.stringify({result:1,err:null,data:rs}));
        }
    });
})


module.exports = router;
