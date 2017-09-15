"use strict"
//引入数据库模板
const mysql = require('mysql');

//数据库连接配置
function connectServer(){
  let client = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'node'
  });
  return client;
}
//------------------------------------------------分隔符-----------------
/*注册，添加用户
@param varchar|username 用户名
@param varchar|password 密码

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.adduser = function(username,password,callback){
  let query = "insert into user (user_name,groupid,user_password,user_img)values('"+username+"',3,'"+password+"','/image/portrait_default.jpg')";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}

/*注册，根据用户名寻找
@param varchar|username 用户名

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.getinfobyname = function(username,callback){
  let query = "select * from user where user_name = '"+username+"'";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    console.log("根据用户名查信息："+rs);
    return callback(null,rs) ;
  });
} 


/*登录
@param varchar|username 用户名
@param varchar|password 密码

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.getinfonp = function(username,password,callback){
  let query = "select * from user where user_name = '"+username+"' and user_password = '"+password+"'";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    console.log("用户名和："+rs);
    return callback(null,rs) ;
  });
}


/*首页最新活动
@param bool|all 是否查询所有
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.getactinfo = function(all,callback){
  let query ="";
  if(all){query = "select * from activity";}
  else{query = "select * from activity where to_days(act_endtime) > to_days(now())";}
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    console.log("活动："+rs);
    return callback(null,rs) ;
  });
}

/*社团下活动
@param int|org_id 社团id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.getorgact = function(org_id,callback){
  let query = "select * from activity where org_par_id = "+org_id+"";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    console.log("活动："+rs);
    return callback(null,rs) ;
  });
}





/*首页最新日记
@param bool|all 是否查询所有
@param int|id 日记id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.getdiaryinfo = function(id,all,callback){
  let query ="";
  if(id){query = "select * from diary where dia_id = "+id+"";}
  else if(all){query = "select * from diary";}
  else{query = "select * from diary ORDER BY dia_time DESC limit 6";}
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}


/*首页热门社团
@param bool|all 是否查询所有
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.getorginfo = function(all,callback){
  let query ="";
  //if(id){query = "select * from organization where org_id = "+id+"";}
  if(all){query = "select * from organization";}
  else{query = "select * from organization  ORDER BY org_numper DESC limit 3";}
  // else{query = "select * from organization o join activity a where a.org_par_id = o.org_id ORDER BY org_numper DESC limit 3";}
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}

/*社团、活动、日记
@param bool|all 是否查询所有
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.getinfo = function(make,id,callback){
  console.log("------0"+make);
  let query = "";
  if(make=="org"){query = "select * from organization where org_id = "+id+"";}
  if(make=="act"){query = "select * from activity where act_id = "+id+"";}
  if(make=="diary"){query = "select * from diary d join user u where dia_id = "+id+" and d.par_user_id = u.user_id ";}
  console.log("query:"+query);
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}

/*获取评论
@param int|par_id 外键
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.getcomment = function(par_id,callback){
let query = "select * from comment c join user u on c.part_id = "+par_id+" and c.com_user_id = u.user_id";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}


/*提交评论
@param int|com_user_id 用户id
@param int|com_content 评论内容
@param int|par_id 外键
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.postcomment = function(com_user_id,com_content,par_id,callback){
let query = "insert into comment values("+com_user_id+",NOW(),'"+com_content+"',"+par_id+")";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}




/*获取个人信息
@param int|user_id 用户名

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.getuserinfo = function(user_id,callback){
  console.log(user_id);
  let query = "select * from user where user_id = "+user_id+" ";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}
/*获取个人参加的社团
@param int|user_id 用户名

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.getuserorg = function(user_id,callback){
  let query = "select * from organization o join user_org u where u.user_id = "+user_id+" and u.org_id = o.org_id ";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}
/*获取个人参加的活动
@param int|user_id 用户名

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.getuseract = function(user_id,callback){
  let query = "select * from activity a join act_user u where u.par_user_id = "+user_id+" and u.act_par_id = a.act_id ";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}
/*获取个人发表的日记
@param int|user_id 用户名

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.getuserdiary = function(user_id,callback){
  let query = "select * from diary where par_user_id = "+user_id+" ";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}


/*获取个人通知
@param int|user_id 用户名

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.getuserinform = function(user_id,callback){
  let query = "select * from inform where par_id = "+user_id+" ";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}

/*修改个人信息

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.updatainfo = function(user_id,user_number,user_truename,user_sex,user_grade,user_major,user_phone,callback){
  let query = "update user set user_number = '"+user_number+"',user_truename = '"+user_truename+"',user_sex = '"+user_sex+"',user_grade = '"+user_grade+"',user_major = '"+user_major+"',user_phone = '"+user_phone+"' where user_id = "+user_id+"";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}

/*验证原始密码
@param int|user_id 用户id
@param string|oldpassword 原始密码

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.getpassword = function(user_id,oldpassword,callback){
  let query = "select * from user where user_id = "+user_id+" and user_password = '"+oldpassword+"'";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    console.log("用"+rs);
    return callback(null,rs) ;
  });
}


/*修改密码
@param int|user_id 用户名
@param string|newpassword 新密码

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.updatapass = function(user_id,newpassword,callback){
  let query = "update user set user_password = '"+newpassword+"' where user_id = "+user_id+" ";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}


/*发表日记
@param int|dia_title 日记标题
@param string|dia_about 日记关于
@param string|dia_content 日记内容
@param string|par_user_id 外键，用户id
@param string|user_name 日记作者

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.diaryadd = function(dia_title,dia_about,dia_content,par_user_id,user_name,callback){
  let query = "insert into diary (dia_title,dia_content,dia_about,dia_time,dia_author,par_user_id) values ('"+dia_title+"','"+dia_content+"','"+dia_about+"',NOW(),'"+user_name+"','"+par_user_id+"')";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}


/*社团管理员管理社团信息
@param int|userid 管理员id

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.orgidinfo = function(userid,callback){
  let query = "select * from organization where org_manage_id = '"+userid+"'";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}


/*社
@param int|userid 管理员id

@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|result   返回结果
  }
*/
exports.orgidinfo = function(userid,callback){
  let query = "select * from organization where org_manage_id = '"+userid+"'";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}


/*活动参赛人员
@param int|act_id 社团id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.getactuser = function(act_id,callback){
  let query = "select * from act_user a join user u where a.act_par_id = "+act_id+" and u.user_id = a.par_user_id ";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    console.log("参加人员："+rs);
    return callback(null,rs) ;
  });
}

/*判断是否已报名
*@param int|user_id  用户id
*@param int|act_id  活动id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.checkjoin = function(user_id,act_id,callback){
  let query = "select * from act_user where par_user_id = "+user_id+" and  act_par_id = "+act_id+"";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    console.log("检测用户是否已报名："+rs);
    return callback(null,rs) ;
  });
}
/*报名参加活动
*@param int|user_id  用户id
*@param int|act_id  活动id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.joinact = function(user_id,act_id,callback){
  let query = "insert into act_user values("+user_id+","+act_id+")";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    console.log("jia:"+rs);
    return callback(null,rs) ;
  });
}



/*查询通知详情
*@param int|inf_id  通知id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.getinform = function(inf_id,callback){
  let query = "select * from inform where inf_id = "+inf_id+"";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    console.log("jia:"+rs);
    return callback(null,rs) ;
  });
}


/*查询系统不同权限用户
*@param int|nowpag  通知id
*@param int|groupid  通知id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.getallinfo = function(nowpag,groupid,callback){
  console.log("权限吗："+groupid);
  let query = "";
  if(groupid == "3"){query = "select * from user where groupid = "+groupid+" limit "+(10*(nowpag-1))+",10 ";}if(groupid == "2"){query = "select * from user u join organization o where u.groupid = "+groupid+" and u.user_id=o.org_manage_id  limit "+(10*(nowpag-1))+",10 ";}
console.log("sql"+query);

  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    console.log("jia:"+rs);
    return callback(null,rs) ;
  });
}

/*删除用户
*@param int|userid  用户id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.deleteuser = function(userid,callback){
  let query = "delete from user where user_id = "+userid+"";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    console.log("jia:"+rs);
    return callback(null,rs) ;
  });
}

/*添加通知
*@param string|title  通知标题
*@param string|content  通知内容
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.addinform = function(title,content,callback){
  let query = "insert into inform (inf_title,inf_content,inf_time) values('"+title+"','"+content+"',NOW()) ";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });

/*通知发布所有用户
*@param string|inf_id  通知id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
// exports.addallinform = function(inf_id,callback){


//   let query = "select max(inf_id) from inform ";
//   let client = connectServer();
//   client.query(query,function(err,rs){
//     if(err){
//         console.log("error"+err.message);
//         client.end();
//         return callback(err);
//     }
//     console.log('last_insert_id'+JSON.stringify(rs[0]))
//     client.end();
//     // return callback(null,rs) ;
//   });







  // let query = "insert into user_inf value(select user_id from tableb,"+inf_id+" )";
  // let client = connectServer();
  // client.query(query,function(err,rs){
  //   if(err){
  //       console.log("error"+err.message);
  //       client.end();
  //       return callback(err);
  //   }
  //   console.log('插入所有：'+rs)
  //   client.end();
  //   return callback(null,rs) ;
  // });
}


/*获取社团成员
*@param int|org_id  社团id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.getorguser = function(org_id,callback){
  let query = "select * from user_org o join user u where o.org_id = "+org_id+" and o.user_id = u.user_id ";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}
/*获取社团审核名单
*@param int|org_id  社团id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.getauduser = function(org_id,callback){
  console.log("审核名单："+org_id);
  let query = "select * from audit a join user u where par_org_id = "+org_id+" and a.stauts=0 and a.par_user_id = u.user_id ";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}


/*审核通过与不通过名单改变状态码
*@param int|user_id  用户id
*@param int|org_id  社团id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.uploadaudit = function(stauts,user_id,org_id,callback){
  let query = "update audit set stauts="+stauts+" where par_user_id = "+user_id+" and par_org_id = "+org_id+"";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}

/*审核通过将用户id插入社团
*@param int|user_id  用户id
*@param int|org_id  社团id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.uidpullorg = function(user_id,org_id,callback){
  let query = "insert user_org values("+user_id+","+org_id+")";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}
/*审核结果通知
*@param int|user_id  用户id
*@param string|org_name  社团名称
*@param string|result  审核结果
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.aduitinform = function(user_id,org_name,result,callback){
  let query = "insert into inform (inf_title,inf_content,inf_from,par_id) values('关于申请加入"+org_name+"的结果通知','关于申请加入"+org_name+"的结果通知:经过该社团的管理员审核，你的报名加入社团结果是："+result+"，如有疑问，请联系社团管理员或系统管理员，将给你更全面的回复和详细的结果。感谢支持！','"+org_name+"社团管理员',"+user_id+")";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}

/*检测是否已报名
*@param int|user_id  用户id
*@param int|org_id  社团id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.checkaudit = function(user_id,org_id,callback){
  let query = "select * from audit  where  par_user_id="+user_id+" and par_org_id="+org_id+" and (stauts=0 or stauts=1) ";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs) ;
  });
}


/*社团报名加入审核
*@param int|user_id  用户id
*@param int|org_id  社团id
@param Object|callback   回调函数
  {
    object|error,   错误信息（准确则为空）
    object|rs   返回结果
  }
*/
exports.addaudit = function(user_id,org_id,callback){
  let query = "insert into audit (par_user_id,par_org_id,stauts) values("+user_id+","+org_id+",0)";
  let client = connectServer();
  client.query(query,function(err,rs){
    if(err){
        console.log("error"+err.message);
        client.end();
        return callback(err);
    }
    client.end();
    return callback(null,rs);
  })
}















