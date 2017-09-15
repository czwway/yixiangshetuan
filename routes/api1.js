"use strict"
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const async = require('async');
const yxass = require('../module/yxa.js');
module.exports = function(app){

/*API:注册
*@mothod get
*@parame{
	username:用户名
	password：密码	
	}
*@description 用户注册
*@url /myapi/user/register
*
*/
	app.post('/myapi/user/register',function(req,res){
		let username = req.body.username;
		let password = req.body.password;
		res.setHeader("Access-Control-Allow-Origin","*");
		if(username.length<3||username.length>10){
			res.send(JSON.stringify({result:0,err:"用户名长度应为3-10位"}));
		}else if(password.length<6||password.length>16){
			res.send(JSON.stringify({result:0,err:"密码长度应为3-10位"}));
		}else{
			//判断用户名是否存在
			yxass.getinfobyname(username,function(err,rs){
				if(err){
	            	res.send(JSON.stringify({result:0,err:err.message}));
		        }else if(rs.length>0){
		        	res.send(JSON.stringify({result:0,err:"用户名已存在"}));
		        }else{
		        	yxass.adduser(username,password,function(err,rs){
						if(err){
			            	res.send(JSON.stringify({result:0,err:err.message}));
				        }else{
				            res.send(JSON.stringify({result:1,err:null}));
				        }
					})
		        }
			})
		}
	})


/*API:登录
*@mothod get
*@parame{
	username:用户名
	password：密码	
	}
*@description 用户登录
*@url /myapi/user/login
*
*/
	app.post('/myapi/user/login',function(req,res){
		let username = req.body.username;
		let password = req.body.password;
		res.setHeader("Access-Control-Allow-Origin","*");
		if(username.length<3||username.length>10){
			res.send(JSON.stringify({result:0,err:"用户名长度应为3-10位"}));
		}else if(password.length<6||password.length>16){
			res.send(JSON.stringify({result:0,err:"密码长度应为3-10位"}));
		}else{
			yxass.getinfonp(username,password,function(err,rs){
				if(err){
	            	res.send(JSON.stringify({result:0,err:err.message}));
		        }else if(rs.length<1){
		        	res.send(JSON.stringify({result:0,err:"用户名和密码不匹配"}));
		        }else{
		        	//设置cookie
		        	res.cookie('groupid', rs[0].groupid);
		        	res.cookie('userid', rs[0].user_id);
		        	res.cookie('user_img', rs[0].user_img);
		        	res.send(JSON.stringify({result:1,err:null}));
		        }
			})
		}
	});

/*API:首页新活动
*@mothod get
*@description 首页新活动
*@url /myapi/activity/newest
*
*/
	app.get('/myapi/activity/newest',function(req,res){
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.getactinfo(null,function(err,rs){
				if(err){
	            	res.send(JSON.stringify({result:0,err:err.message}));
		        }else if(rs.length<1){
		        	res.send(JSON.stringify({result:0,err:"暂无新活动"}));
		        }else{
		        	res.send(JSON.stringify({result:1,err:null,data:rs}));
		        }
		})

	});

/*API:首页最新日记
*@mothod get
*@description 首页最新日记
*@url /myapi/diary/newest
*
*/
	app.get('/myapi/diary/newest',function(req,res){
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.getdiaryinfo(null,null,function(err,rs){
				if(err){
	            	res.send(JSON.stringify({result:0,err:err.message}));
		        }else if(rs.length<1){
		        	res.send(JSON.stringify({result:0,err:"暂无新日记"}));
		        }else{
		        	res.send(JSON.stringify({result:1,err:null,data:rs}));
		        }
		})

	});

/*API:首页热门社团
*@mothod get
*@description 首页热门社团
*@url /myapi/organization/hot
*
*/
	app.get('/myapi/organization/hot',function(req,res){
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.getorginfo(null,function(err,rs){
				if(err){
	            	res.send(JSON.stringify({result:0,err:err.message}));
		        }else if(rs.length<1){
		        	res.send(JSON.stringify({result:0,err:"暂无热门社团"}));
		        }else{
		        	res.send(JSON.stringify({result:1,err:null,data:rs}));
		        }
		})
	});

/*API:社团集
*@mothod get
*@description 社团集
*@url /myapi/organization/all
*
*/
	app.get('/myapi/organization/all',function(req,res){
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.getorginfo(true,function(err,rs){
				if(err){
	            	res.send(JSON.stringify({result:0,err:err.message}));
		        }else if(rs.length<1){
		        	res.send(JSON.stringify({result:0,err:"暂无社团"}));
		        }else{
		        	res.send(JSON.stringify({result:1,err:null,data:rs}));
		        }
		})
	});

/*API:活动集
*@mothod get
*@description 活动集
*@url /myapi/activity/all
*
*/
	app.get('/myapi/activity/all',function(req,res){
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.getactinfo(true,function(err,rs){
				if(err){
	            	res.send(JSON.stringify({result:0,err:err.message}));
		        }else if(rs.length<1){
		        	res.send(JSON.stringify({result:0,err:"暂无活动"}));
		        }else{
		        	res.send(JSON.stringify({result:1,err:null,data:rs}));
		        }
		})
	});

/*API:日记集
*@mothod get
*@description 日记集
*@url /myapi/activity/all
*
*/
	app.get('/myapi/diary/all',function(req,res){
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.getdiaryinfo(null,true,function(err,rs){
				if(err){
	            	res.send(JSON.stringify({result:0,err:err.message}));
		        }else if(rs.length<1){
		        	res.send(JSON.stringify({result:0,err:"暂无日记"}));
		        }else{
		        	res.send(JSON.stringify({result:1,err:null,data:rs}));
		        }
		})
	});


/*API:获取评论
@param int|par_id 日记id
*@mothod get
*@description 获取评论
*@url /myapi/comment
*
*/
	app.get('/myapi/comment',function(req,res){
		let par_id = req.query.par_id;
		console.log("huoqu评论："+par_id);
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.getcomment(par_id,function(err,rs){
					console.log("huoqu评论："+rs);
				if(err){
	            	res.send(JSON.stringify({result:0,err:err.message}));
		        }else if(rs.length<1){
		        	res.send(JSON.stringify({result:1,err:null}));
		        }else{
		        	res.send(JSON.stringify({result:1,err:null,data:rs}));
		        }
		})
	});


/*API:提交评论
@param int|com_user_id  用户id
@param string|com_content 评论内容
@param int|part_id 外键id
*@mothod get
*@description 提交评论
*@url /myapi/comment/post
*
*/
	app.post('/myapi/comment/post',function(req,res){
		let com_user_id = req.body.com_user_id;
		let com_content = req.body.com_content;
		let par_id = req.body.par_id;
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.postcomment(com_user_id,com_content,par_id,function(err,rs){
				if(err){
	            	res.send(JSON.stringify({result:0,err:err.message}));
		        }else if(rs.length<1){
		        	res.send(JSON.stringify({result:1,err:null}));
		        }else{
		        	res.send(JSON.stringify({result:1,err:null,data:rs}));
		        }
		})
	});

/*API:社团举办的活动
*@param int|org_id  用户id
*@mothod get
*@description 社团举办的活动
*@url /myapi/comment
*
*/
	app.get('/myapi/organization/activitys',function(req,res){
		let org_id = req.query.org_id;
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.getorgact(org_id,function(err,rs){
				if(err){
	            	res.send(JSON.stringify({result:0,err:err.message}));
		        }else if(rs.length<1){
		        	res.send(JSON.stringify({result:0,err:"该社团未有记录的活动"}));
		        }else{
		        	res.send(JSON.stringify({result:1,err:null,data:rs}));
		        }
		})
	});

/*API:社团部门情况
*@param int|org_id  用户id
*@mothod get
*@description 社团举办的活动
*@url /myapi/comment
*
*/
	// app.get('/myapi/organization/department',function(req,res){
	// 	let org_id = req.query.org_id;
	// 	res.setHeader("Access-Control-Allow-Origin","*");
	// 	yxass.(org_id,function(err,rs){
	// 			if(err){
	//             	res.send(JSON.stringify({result:0,err:err.message}));
	// 	        }else if(rs.length<1){
	// 	        	res.send(JSON.stringify({result:1,err:null}));
	// 	        }else{
	// 	        	res.send(JSON.stringify({result:1,err:null,data:rs}));
	// 	        }
	// 	})
	// });


/*API:社团、活动、日记详情
*@param int|id  用户id
*@mothod get
*@description 社团、活动、日记详情
*@url /myapi/comment
*
*/
	app.get('/myapi/info',function(req,res){
		let id = req.query.id;
		let make = req.query.make;
		console.log("api:"+id+make);
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.getinfo(make,id,function(err,rs){
				if(err){
	            	res.send(JSON.stringify({result:0,err:err.message}));
		        }else if(rs.length<1){
		        	res.send(JSON.stringify({result:0,err:"nothing"}));
		        }else{
		        	res.send(JSON.stringify({result:1,err:null,data:rs}));
		        }
		})
	});






/*API:个人中心
*@param int|user_id  用户id
*@mothod get
*@description 提交评论
*@url /myapi/comment
*/
	app.get('/myapi/user/info',function(req,res){
		let user_id = req.query.user_id;
		console.log(user_id+"**");
		res.setHeader("Access-Control-Allow-Origin","*");
		async.auto({
			getInform:function(cb){
	            yxass.getuserinfo(user_id,function(err,r){
	                if(err)cb(err);
	                else cb(null,r);
	            });
        	},
        	getuserorg:function(cb){
	            yxass.getuserorg(user_id,function(err,r){
	                if(err)cb(err);
	                else cb(null,r);
	            });
        	},
        	getuseract:function(cb){
	            yxass.getuseract(user_id,function(err,r){
	                if(err)cb(err);
	                else cb(null,r);
	            });
        	},
        	getuserdiary:function(cb){
	            yxass.getuserdiary(user_id,function(err,r){
	                if(err)cb(err);
	                else cb(null,r);
	            });
        	},
        	getuserinform:function(cb){
	            yxass.getuserinform(user_id,function(err,r){
	                if(err)cb(err);
	                else cb(null,r);
	            });
        	}
		},function(err,rs){
			if(rs.getInform.length<1){
				res.send(JSON.stringify({result:0,err:"该用户不存在"}));
				return;
			}
			let u = new Object();
			u['inform'] = rs.getInform;
			u['org'] = rs.getuserorg;
			u['act'] = rs.getuseract;
			u['diary'] = rs.getuserdiary;
			u['infor'] = rs.getuserinform;
			if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
	        }else{
	            res.send(JSON.stringify({result:1,err:null,data:u}));
	        }
		})
	});



/*API:修改个人信息
*@param int|org_id  用户id
*@mothod get
*@description 修改个人信息
*@url /myapi/user/updatainfo
*
*/
	app.post('/myapi/user/updatainfo',function(req,res){

		let user_id= req.body.user_id;
		let user_number= req.body.user_number;
        let user_truename= req.body.user_truename;
        let user_sex= req.body.user_sex;
        let user_grade= req.body.user_grade;
        let user_major= req.body.user_major;
        let user_phone= req.body.user_phone;
		res.setHeader("Access-Control-Allow-Origin","*");

		yxass.updatainfo(user_id,user_number,user_truename,user_sex,user_grade,user_major,user_phone,function(err,rs){
				if(err){
	            	res.send(JSON.stringify({result:0,err:err.message}));
		        }else if(rs.length<1){
		        	res.send(JSON.stringify({result:0,err:"个人信息数据修改失败"}));
		        }else{
		        	res.send(JSON.stringify({result:1,err:null}));
		        }
		})
	});


/*API:修改密码
*@param string|oldpassword  原始密码
*@param string|newpassword  新密码
*@mothod get
*@description 修改密码
*@url /myapi/user/updatapass
*
*/
	app.post('/myapi/user/updatapass',function(req,res){
		let user_id= req.body.user_id;
		let oldpassword= req.body.oldpassword;
		let newpassword= req.body.newpassword;
		console.log(user_id+oldpassword+newpassword);
		res.setHeader("Access-Control-Allow-Origin","*");
		//查询原始密码
		yxass.getpassword(user_id,oldpassword,function(err,rs){
			if(err){
            	res.send(JSON.stringify({result:0,err:err.message}));
	        }else if(rs.length<1){
	        	res.send(JSON.stringify({result:0,err:"原始密码不正确"}));
	        }else{
	        	yxass.updatapass(user_id,newpassword,function(err,rs){
					if(err){
		            	res.send(JSON.stringify({result:0,err:err.message}));
			        }else if(rs.length<1){
			        	res.send(JSON.stringify({result:0,err:"个人信息数据修改失败"}));
			        }else{
			        	res.send(JSON.stringify({result:1,err:null}));
			        }
				})
	        }
		})
	});


/*API:发表日记
*@param string|dia_title  日记标题
*@param string|dia_about  日记关于
*@param string|dia_content  日记内容
*@param string|par_user_id  外键，用户id
*@mothod get
*@description 修改密码
*@url /myapi/user/updatapass
*
*/
	app.post('/myapi/diary/add',function(req,res){
		let dia_title= req.body.dia_title;
		let dia_about= req.body.dia_about;
		let dia_content= req.body.dia_content;
		let par_user_id= req.body.par_user_id;
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.getuserinfo(par_user_id,function(err,rs){
			if(err){
            	res.send(JSON.stringify({result:0,err:err.message}));
	        }else if(rs.length<1){
	        	res.send(JSON.stringify({result:0,err:"该用户不存在"}));
	        }else{
	        	yxass.diaryadd(dia_title,dia_about,dia_content,par_user_id,rs[0].user_name,function(err,rss){
					if(err){
		            	res.send(JSON.stringify({result:0,err:err.message}));
			        }else if(rs.length<1){
			        	res.send(JSON.stringify({result:0,err:"日记发表失败"}));
			        }else{
			        	res.send(JSON.stringify({result:1,err:null}));
			        }
				})
	        }
		})
	});



/*API:管理中心
*@param int|userid  管理员id
*@mothod get
*@description 管理中心
*@url /myapi/organization/manager
*
*/
	app.get('/myapi/organization/manager',function(req,res){
		let userid= req.query.userid;
		res.setHeader("Access-Control-Allow-Origin","*");
		async.auto({
			//社团信息
			orgidinfo:function(cb){
	            yxass.orgidinfo(userid,function(err,r){
	                if(err)cb(err);
	                else cb(null,r);
	            });
        	}
		},function(err,rs){
			let u = new Object();
			u['orgidinfo'] = rs.orgidinfo;
			if(err){
            res.send(JSON.stringify({result:0,err:err.message}));
	        }else{
	        	//获取社团id后续
	        	async.auto({
	        		//根据社团id获取社团活动
					getorgact:function(cb){
			            yxass.getorgact(rs.orgidinfo[0].org_id,function(err,rss){
			                if(err)cb(err);
			                else cb(null,rss);
			            });
		        	},
		        	//根据社团id获取社团成员
		        	getorguser:function(cb){
		        		yxass.getorguser(rs.orgidinfo[0].org_id,function(err,rss){
			                if(err)cb(err);
			                else cb(null,rss);
			            });
		        	},
		        	//根据社团id获取审核名单
		        	getauduser:function(cb){
		        		yxass.getauduser(rs.orgidinfo[0].org_id,function(err,rss){
			                if(err)cb(err);
			                else cb(null,rss);
			            });
		        	}
	        	},function(err,rss){
	        		if(err){res.send(JSON.stringify({result:0,err:err.message}));}
	        		else{
						u['orgact'] = rss.getorgact;
						u['orguser'] = rss.getorguser;
						u['orgaudit'] = rss.getauduser;
						res.send(JSON.stringify({result:1,err:null,data:u}));
	        		}
	        	})
	        }
		})
	});


/*API:查看活动参加人数
*@param int|act_id  活动id
*@mothod get
*@description 查看活动参加人数
*@url /myapi/activity/userlist
*
*/
	app.get('/myapi/activity/userlist',function(req,res){
		let act_id= req.query.a_id;
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.getactuser(act_id,function(err,rs){
			if(err){res.send(JSON.stringify({result:0,err:err.message}));}
    		else{res.send(JSON.stringify({result:1,err:null,data:rs}));}
		})
	});

/*API:审核通过接口
*@param int|user_id  活动id
*@param int|org_id  活动id
*@mothod post
*@description 审核通过
*@url /myapi/activity/userlist
*
*/
	app.post('/myapi/audit/pass',function(req,res){
		let user_id= req.body.user_id;
		let org_id= req.body.org_id;
		let org_name= req.body.org_name;
		let result= "审核通过";
		res.setHeader("Access-Control-Allow-Origin","*");
		async.auto({
			//通过改变状态码为1
			uploadaudit:function(cb){
	            yxass.uploadaudit(1,user_id,org_id,function(err,rss){
	                if(err)cb(err);
	                else cb(null,rss);
	            });
        	},
        	//将用户id存入社团
			uidpullorg:function(cb){
	            yxass.uidpullorg(user_id,org_id,function(err,rss){
	                if(err)cb(err);
	                else cb(null,rss);
	            });
        	},
        	aduitinform:function(cb){
	            yxass.aduitinform(user_id,org_name,result,function(err,rss){
	                if(err)cb(err);
	                else cb(null,rss);
	            });
        	}

		},function(err,rs){
			if(err){res.send(JSON.stringify({result:0,err:err.message}));}
			else{res.send(JSON.stringify({result:1,err:null}));}
		})
	});
/*API:审核不通过接口
*@param int|user_id  活动id
*@param int|org_id  活动id
*@mothod post
*@description 审核不通过
*@url /myapi/activity/userlist
*
*/
	app.post('/myapi/audit/nopass',function(req,res){
		let user_id= req.body.user_id;
		let org_id= req.body.org_id;
		let org_name= req.body.org_name;
		let result= "审核不通过";
		res.setHeader("Access-Control-Allow-Origin","*");
		async.auto({
			//通过改变状态码为1
			uploadaudit:function(cb){
	            yxass.uploadaudit(2,user_id,org_id,function(err,rss){
	                if(err)cb(err);
	                else cb(null,rss);
	            });
        	},
        	aduitinform:function(cb){
	            yxass.aduitinform(user_id,org_name,result,function(err,rss){
	                if(err)cb(err);
	                else cb(null,rss);
	            });
        	}

		},function(err,rs){
			if(err){res.send(JSON.stringify({result:0,err:err.message}));}
			else{res.send(JSON.stringify({result:1,err:null}));}
		})
	});

/*API:社团加入接口
*@param int|user_id  用户id
*@param int|org_id  社团id
*@mothod get
*@description 社团加入接口
*@url /myapi/activity/userlist
*
*/
	app.post('/myapi/organization/join',function(req,res){
		let user_id= req.body.user_id;
		let org_id= req.body.org_id;
		console.log("社团加入："+user_id+org_id);
		res.setHeader("Access-Control-Allow-Origin","*");
		//判断是否已申请
		yxass.checkaudit(user_id,org_id,function(err,rs){
			if(err){res.send(JSON.stringify({result:0,err:err.message}));}
			console.log("社团加入判断："+rs);
			if(rs[0]){res.send(JSON.stringify({result:0,err:"你已提交申请，请勿重复报名"}));}
			else{
				yxass.addaudit(user_id,org_id,function(err,rss){
					console.log("社团加入结果："+rss);
					if(err){res.send(JSON.stringify({result:0,err:err.message}));}
					else{
		    			if(rss){
		    				res.send(JSON.stringify({result:1,err:"加入社团申请成功，请等待管理员审核"}));
		    			}else{
		    				res.send(JSON.stringify({result:0,err:"加入社团失败"}));
		    			}
		    		}
				})
			}
		})
	})




/*API:活动报名参加活动
*@param int|user_id  用户id
*@param int|act_id  活动id
*@mothod get
*@description 活动报名参加活动
*@url /myapi/activity/join
*
*/
	app.get('/myapi/activity/join',function(req,res){
		let user_id= req.query.user_id;
		let act_id= req.query.act_id;
		console.log("报名："+user_id +"*"+act_id);
		res.setHeader("Access-Control-Allow-Origin","*");
		//判断是否已报名
		yxass.checkjoin(user_id,act_id,function(err,rs){
			if(err){res.send(JSON.stringify({result:0,err:err.message}));}
    		else if(rs[0]){
    			res.send(JSON.stringify({result:0,err:"你已报名.请勿重复"}));
    		}else{
				yxass.joinact(user_id,act_id,function(err,rss){
					if(err){res.send(JSON.stringify({result:0,err:err.message}));}
					else{
						if(rss){
							res.send(JSON.stringify({result:1,err:null}));
						}else{
							res.send(JSON.stringify({result:0,err:"报名失败..."}));
						}
					}
				})
    		}
		})
	});


/*API:通知详情
*@param int|inf_id  通知id
*@mothod get
*@description 通知详情
*@url /myapi/activity/userlist
*
*/
	app.get('/myapi/inform/getinfo',function(req,res){
		let inf_id= req.query.inf_id;
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.getinform(inf_id,function(err,rs){
			if(err){res.send(JSON.stringify({result:0,err:err.message}));}
    		else{
    			if(rs[0]){
    				res.send(JSON.stringify({result:1,err:null,data:rs}));
    			}else{
    				res.send(JSON.stringify({result:0,err:"nothing"}));
    			}
    		}
		})
	});







/************************系统管理员*********************/
/*API:获取系统用户
*@param int|nowpag  当前页面
*@param int|groupid  用户权限代号
*@mothod get
*@description 通知详情
*@url /myapi/activity/userlist
*
*/
	app.get('/myapi/inform/getallinfo',function(req,res){
		let nowpag= req.query.nowpag;
		let groupid= req.query.groupid;
		res.setHeader("Access-Control-Allow-Origin","*");

		yxass.getallinfo(nowpag,groupid,function(err,rs){
			console.log("hou:"+rs)
			if(err){res.send(JSON.stringify({result:0,err:err.message}));}
    		else{
    			if(rs){
    				res.send(JSON.stringify({result:1,err:null,data:rs}));
    			}else{
    				res.send(JSON.stringify({result:0,err:"nothing"}));
    			}
    		}
		})

	});

/*API:删除系统用户
*@param int|userid  用户id
*@mothod get
*@description 删除系统用户
*@url /myapi/activity/userlist
*
*/
	app.post('/myapi/user/delete',function(req,res){
		let userid= req.body.userid;
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.deleteuser(userid,function(err,rs){
			if(err){res.send(JSON.stringify({result:0,err:err.message}));}
    		else{
    			if(rs){
    				res.send(JSON.stringify({result:1,err:null,data:rs}));
    			}else{
    				res.send(JSON.stringify({result:0,err:"nothing"}));
    			}
    		}
		})

	});

/*API:系统发布通知
*@param string|title  通知标题
*@param string|content  通知内容
*@mothod get
*@description 系统发布通知
*@url /myapi/activity/userlist
*
*/
	app.post('/myapi/inform/add',function(req,res){
		let title= req.body.title;
		let content= req.body.content;
		res.setHeader("Access-Control-Allow-Origin","*");
		yxass.addinform(title,content,function(err,rs){
			if(err){res.send(JSON.stringify({result:0,err:err.message}));}
    		else{
    			if(rs){
    				res.send(JSON.stringify({result:1,err:null}));
    			}else{
    				res.send(JSON.stringify({result:0,err:"nothing"}));
    			}
    		}
		})

	});















}