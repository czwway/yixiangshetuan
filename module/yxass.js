const mysql = require('mysql');

//数据库连接
function connectServer(){
  let client = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'nodelab'
  });
  return client;
}

/*获取评论信息
    @param int|type 评论位置（1活动 2日记）
    @param int|prid   活动或日记对应的ID

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日10:00:53
    @author  yekoy
*/
exports.getComment = function(type,prid,callback){
    let query = " SELECT"
              + " com_id as id,"
              + " com_content as content,"
              + " com_time as time, "
              + " user_name as username,"
              + " user_img as userimg"
              + " FROM comment "
              + " LEFT JOIN user ON com_userid = user_id"
              + " WHERE com_type = " + type
              + " AND com_prid = " + prid
              + " AND com_status = 1";
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

/*获取用户信息
    @param int|userid   用户ID

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日10:16:42
    @author  yekoy
*/
exports.getUser = function(userid,callback){
    let query = " SELECT"
              + " user_id as userid,"
              + " user_img as img,"
              + " user_name as username,"
              + " user_sex as sex,"
              + " user_grade as grade,"
              + " user_realname as realname,"
              + " user_number as number,"
              + " user_major as major,"
              + " user_phone as phone"
              + " FROM user"
              + " WHERE user_id = " + userid
              + " AND user_status = 1";
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

/*获取用户所有通知信息
    @param int|userid   用户ID

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日10:27:24
    @author  yekoy
*/
exports.getAllUserInform = function(userid,callback){
    let query = " SELECT"
              + " inf_id as infid,"
              + " inf_title as title,"
              + " inf_content as content,"
              + " inf_from , "
              + " inf_bound_time as time,"
              + " inf_bound_status as status"
              + " FROM"
              + " inform"
              + " LEFT JOIN inform_bound ON inf_id = inf_bound_infid"
              + " WHERE inf_bound_userid = " + userid
              + " AND inf_status = 1"
              + " AND inf_bound_status >= 1";
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

/*获取用户所有活动信息
    @param int|userid   用户ID

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日10:36:30
    @author  yekoy
*/
exports.getAllUserAct = function(userid,callback){
    let query = " SELECT"
              + " act_poster as poster,"
              + " act_name as actname,"
              + " act_id as actid"
              + " FROM"
              + " activity"
              + " LEFT JOIN activity_bound ON act_id = act_bound_actid"
              + " WHERE act_bound_userid = " + userid
              + " AND act_status = 1"
              + " AND act_bound_status = 1";
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

/*获取用户所有部门信息
    @param int|userid   用户ID

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日10:44:58
    @author  yekoy
*/
exports.getAllUserDep = function(userid,callback){
    let query = " SELECT"
              + " org_id as orgid,"
              + " dep_name as depname,"
              + " org_name as orgname,"
              + " org_icon as orgicon,"
              + " dep_bound_duty as duty,"
              + " dep_bound_time as time"
              + " FROM"
              + " department"
              + " LEFT JOIN organization ON org_id = dep_orgid"
              + " LEFT JOIN deparement_bound ON dep_id = dep_bound_depid"
              + " WHERE dep_bound_userid = "+ userid
              + " AND dep_status = 1"
              + " AND org_status = 1"
              + " AND dep_bound_status = 1";
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

/*获取用户所有日记信息
    @param int|userid   用户ID

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日10:58:37
    @author  yekoy
*/
exports.getAllUserDia = function(userid,callback){
    let query = " SELECT"
              + " dia_id as diaid,"
              + " user_name as author,"
              + " dia_title as title,"
              + " dia_content as content,"
              + " dia_about as about,"
              + " dia_time as time,"
              + " user_img as img"
              + " FROM"
              + " diary"
              + " LEFT JOIN `user` ON dia_author = user_id"
              + " WHERE dia_author = "+userid
              + " AND dia_status = 1";
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

/*更新个人信息
    @param int|userid 用户ID
    @param Array|info
        int|info['number'] 学号
        string|info['realname'] 真实姓名
        int|info['sex'] 性别 1男 2女
        int|info['grade'] 年级 (按年份)
        string|info['major'] 专业
        int|info['phone'] 电话号码

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日11:40:17
    @author  yekoy
*/
exports.UpdateUser = function(userid,info,callback){
    let query = "UPDATE `user` SET";
    if(info['number']){
        query += "user_number = "+info['number'];
    }
    if(info['realname']){
        query += "user_realname = "+info['realname'];
    }
    if(info['sex']){
        query += "user_sex = "+info['sex'];
    }
    if(info['grade']){
        query += "user_grade = "+info['grade'];
    }
    if(info['major']){
        query += "user_major = "+info['major'];
    }
    if(info['phone']){
        query += "user_phone = "+info['phone'];
    }
    query += "WHERE user_id = " + userid;

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

/*获取用户头像
    @param int | userid   用户id

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日20:51:06
    @author  yekoy
*/
exports.getUserImg = function(userid,callback){
    let query = "SELECT"
              + " user_img  "
              + " FROM"
              + " user"
              + " WHERE user_id = "+ id;
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

/*通过用户名获取用户密码
    @param string | username   用户名

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日20:46:41
    @author  yekoy
*/
exports.getUserPswByName = function(username,callback){
    let query = "SELECT"
              + " user_password as password,"
              + " user_groupid as groupid"
              + " FROM"
              + " user"
              + " WHERE user_name = "+ username;
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

/*通过用户ID获取用户密码
    @param int | userid   用户id

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月18日11:21:30
    @author  yekoy
*/
exports.getUserPswByid = function(userid,callback){
    let query = "SELECT"
              + " user_password as password"
              + " FROM"
              + " user"
              + " WHERE user_id = "+ userid;
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


/*新增用户
    @param string | username   用户名
    @param string | password   密码（加密后）

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日20:47:04
    @author  yekoy
*/
exports.addUser = function(username,password,callback){
    let query = "INSERT INTO user(user_name,user_password,user_status) VALUES("+username+","+password+",1)";
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

/*更改用户密码
    @param int | userid   用户id
    @param String|newpsw   新密码

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日11:44:07
    @author  yekoy
*/
exports.updateUserPsw = function(userid,newpsw,callback){
    let query = "UPDATE `user` SET user_password = " + newpsw +"WHERE user_id = "+ userid;
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

/*删除用户
    @param int | userid   用户id


    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日11:44:07
    @author  yekoy
*/
exports.delectUser = function(useridcallback){
    let query = "UPDATE `user` SET user_status = 0 WHERE user_id = " + userid;
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

/*获取日记信息byid
    @param int|diaryid   日记ID

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日10:58:37
    @author  yekoy
*/
exports.getDiaById = function(diaryid,callback){
    let query = "SELECT"
              + " dia_id as diaid,"
              + " user_name as author,"
              + " dia_title as title,"
              + " dia_content as content,"
              + " dia_about as about,"
              + " dia_time as time,"
              + " user_img as img"
              + " FROM"
              + " diary"
              + " LEFT JOIN `user` ON dia_author = user_id"
              + " WHERE dia_id = "+diaryid
              + " AND dia_status = 1";
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

/*获取最新日记（6个）

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日21:08:13
    @author  yekoy
*/
exports.getNewDia = function(callback){
    let query = "SELECT"
              + " user_name as author,"
              + " dia_title as title,"
              + " dia_content as content,"
              + " dia_about as about,"
              + " dia_time as time,"
              + " user_img as img"
              + " FROM"
              + " diary"
              + " LEFT JOIN `user` ON dia_author = user_id"
              + " AND dia_status = 1"
              + " ORDER BY dia_time DESC"
              + " LIMIT 0, 6";
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

/*获取所有日记

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日21:17:32
    @author  yekoy
*/
exports.getAllDia = function(callback){
    let query = "SELECT"
              + " user_name as author,"
              + " dia_title as title,"
              + " dia_content as content,"
              + " dia_about as about,"
              + " dia_time as time,"
              + " user_img as img"
              + " FROM"
              + " diary"
              + " LEFT JOIN `user` ON dia_author = user_id"
              + " AND dia_status = 1"
              + " ORDER BY dia_time DESC";
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

/*添加日记
    @param Array|diary   日记内容
        string|diary['title']   日记标题
        string|diary['content'] 日记内容
        string|diary['about']   日记简介
        int|diary['author']  日记作者
        datetime|diary['time'] 提交时间

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日12:05:42
    @author  yekoy
*/
exports.addDia = function(diary,callback){
    let query = "INSERT INTO diary(dia_title,dia_content,dia_author,dia_about,dia_time,dia_status) VALUES(?,?,?,?,?,1)";
    if(!diary['time']){
        diary['time']= new Date();
    }
    let client = connectServer();
    client.query(query,[diary['title'],diary['content'],diary['author'],diary['about'],diary['time']],function(err,rs){
        if(err){
            console.log("error"+err.message);
            client.end();
            return callback(err);
        }
        client.end();
        return callback(null,rs) ;
    });
}

/*活动报名
    @param int|actid   活动id
    @param int|userid  用户id


    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日12:05:42
    @author  yekoy
*/
exports.JoinAct = function(actid,userid,callback){
    let query = "INSERT INTO activity_bound(act_bound_actid,act_bound_userid,act_bound_status) VALUES(?,?,1)";

    let client = connectServer();
    client.query(query,[actid,userid],function(err,rs){
        if(err){
            console.log("error"+err.message);
            client.end();
            return callback(err);
        }
        client.end();
        return callback(null,rs) ;
    });
}

/*获取活动报名信息
    @param int|actid   活动id

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日20:15:57
    @author  yekoy
*/
exports.getActUser = function(actid,callback){
    let query = "SELECT"
              + " user_id,"
              + " user_name,"
              + " user_realname,"
              + " user_sex,"
              + " user_number,"
              + " user_grade,"
              + " user_major,"
              + " user_phone"
              + " FROM"
              + " activity_bound"
              + " LEFT JOIN `user` ON act_bound_userid = user_id"
              + " WHERE act_bound_actid = " + actid
              + " AND act_bound_status = 1"
              + " AND user_status = 1";

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

/*获取社团的活动信息
    @param int|orgid   社团id

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time：2017年6月17日20:30:52
    @author  yekoy
*/
exports.getActByOrg = function(orgid,callback){
    let query = " SELECT"
              + " act_start as start,"
              + " act_end as end,"
              + " act_poster as poster,"
              + " act_name as name,"
              + " act_abstract as abstract,"
              + " act_id as actid"
              + " FROM"
              + " activity"
              + " WHERE act_sponsor = " + orgid
              + " AND act_status = 1";
    console.log(query);
    let client = connectServer();
    client.query(query,function(err,rs){
        if(err){
            console.log("error"+err.message);
            client.end();
            return callback(err);
        }
        client.end();

        console.log(rs);
        return callback(null,rs) ;
    });
}

/*获取社团的活动信息（结束前）

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time：2017年6月17日20:30:52
    @author  yekoy
*/
exports.getActBeforeEnd = function(callback){
    let query = " SELECT"
              + " act_start as start,"
              + " act_end as end,"
              + " act_poster as poster,"
              + " act_name as name,"
              + " act_abstract as abstract,"
              + " act_id as actid"
              + " FROM"
              + " activity"
              + " WHERE TO_DAYS(NOW()) - TO_DAYS(act_end) < 0 "
              + " AND act_status = 1";
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

/*获取所有活动信息

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time：2017年6月17日21:14:56
    @author  yekoy
*/
exports.getAllAct = function(callback){
    let query = " SELECT"
              + " act_start as start,"
              + " act_end as end,"
              + " act_poster as poster,"
              + " act_name as name,"
              + " act_abstract as abstract,"
              + " act_id as actid"
              + " FROM"
              + " activity"
              + " WHERE act_status = 1"
              + " ORDER BY act_id DESC";
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

/*添加评论
    @param int|userid   用户id
    @param string|content 评论内容
    @param int|comtype 评论来源（1活动2日记）
    @param int|prid 活动获日记的ID

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日12:05:42
    @author  yekoy
*/
exports.addComment = function(userid,content,comtype,prid,callback){
    let query = "INSERT INTO comment(com_type,com_prid,com_userid,con_content,com_time,com_status) VALUES(?,?,?,?,?,1)";
    let time = new Date();
    let client = connectServer();
    client.query(query,[comtype,prid,userid,content,time],function(err,rs){
        if(err){
            console.log("error"+err.message);
            client.end();
            return callback(err);
        }
        client.end();
        return callback(null,rs) ;
    });
}

/*获取社团信息（热门3个）

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time：2017年6月17日21:04:07
    @author  yekoy
*/
exports.getHotOrg = function(callback){
    let query = " SELECT"
              + " org_id as orgid,"
              + " org_name as name,"
              + " org_icon as icon,"
              + " org_number as number,"
              + " org_time as time"
              + " FROM"
              + " organization"
              + " WHERE org_status = 1"
              + " ORDER BY org_number DESC"
              + " LIMIT 0, 3";
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

/*获取所有社团信息

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time：2017年6月17日21:12:37
    @author  yekoy
*/
exports.getAllOrg = function(callback){
    let query = " SELECT"
              + " org_id as id,"
              + " org_name as name,"
              + " org_icon as icon,"
              + " org_number as number,"
              + " org_time as time"
              + " FROM"
              + " organization"
              + " WHERE org_status = 1";
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

/*获取单个社团的活动数量
    @param int|orgid   社团id

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time：2017年6月17日21:06:33
    @author  yekoy
*/
exports.getOrgActNum = function(orgid,callback){
    let query = " SELECT count(*) as actnum"
              + " FROM activity"
              + " WHERE act_sponsor = " + orgid
              + " AND act_status = 1";
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

/*获取社团信息bymanagerid
    @param int|managerid   管理员ID

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日13:41:38
    @author  yekoy
*/
exports.getOrgByManagerId = function(managerid,callback){

    let query = "SELECT"
              + " org_id as orgid,"
              + " org_name as orgname,"
              + " user_name as managername,"
              + " user_realname as managerrealname,"
              + " org_icon as icon,"
              + " org_number as num,"
              + " org_time as time"
              + " FROM"
              + " organization"
              + " LEFT JOIN `user` ON org_managerid = user_id"
              + " WHERE org_managerid = " + managerid
              + " AND org_status = 1";
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

/*获取社团部门信息
    @param int|orgid   管理员ID

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日21:23:34
    @author  yekoy
*/
exports.getOrgDep = function (orgid,callback){
    let query = "SELECT"
              + " dep_id as depid,"
              + " dep_name as depname"
              + " FROM department"
              + " WHERE dep_orgid = "+ orgid
              + " AND dep_status = 1";
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

/*获取社团部门成员信息
    @param int|depid   管理员ID

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日21:27:54
    @author  yekoy
*/
exports.getDepUser = function (depid,callback){
    let query = " SELECT"
              + " dep_bound_duty as duty, "
              + " dep_bound_time,"
              + " user_name,"
              + " user_id "
              + " FROM"
              + " deparement_bound"
              + " LEFT JOIN `user` ON dep_bound_userid = user_id"
              + " WHERE dep_bound_depid = "+ depid
              + " AND dep_bound_status = 1 "
              + " AND user_status = 1 ";
              //console.log(query);
    let client = connectServer();
    client.query(query,function(err,rs){
        if(err){
            //console.log("error"+err.message);
            client.end();
            return callback(err);
        }
        client.end();
        return callback(null,rs) ;
    });
}

/*获取通知信息
    @param int|infid   通知ID

    @param Object|callback   回调函数
        {
            object|error,   错误信息（准确则为空）
            object|result   返回结果
        }
    @time： 2017年6月17日21:27:54
    @author  yekoy
*/
exports.getInfById = function(infid,callback){
    let query = " SELECT "
              + " inf_id as infid,"
              + " inf_title as title,"
              + " inf_content as content,"
              + " inf_from "
              + " FROM inform"
              + " WHERE inf_status = 1";
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
