/**/

//导航栏根据用户id获取头像
Mock.mock('http://xx.com/api/user/userimg', {
     "result": 1,
     "err": null,
     "data" : {
        "user_img": '/image/1.jpg'
     }
});

// 最新活动
Mock.mock('http://xx.com/api/activity/lunbo', {
    "result": 1,
     "err": null,
    "data|1-6": [{
        "act_id": '@id',
        "act_poster": "/image/2.jpg",
        'act_name': '@word'
    }]
});


// 最新6篇日记
Mock.mock('http://xx.com/api/diary/new6', {
    "result": 1,
     "err": null,
    "data|6": [{
        "dia_id": '@id',
        "dia_title|1-3": "日记标题",
        'dia_about|1-2': '日记关于',
        "dia_content|20": "文章内容",
        "dia_author|1-4": "cx",
        "dia_time": '@date'
    }]
});

// 热门3个社团
Mock.mock('http://xx.com/api/organization/hot3', {
    "result": 1,
     "err": null,
    "data|3": [{
        "org_id": '4564564564',
        "org_icon": '/image/2.jpg',
        "org_name|4-7": "名",
        'org_numper|1': '100',
        "org_numact|1": "54"
    }]
});

//社团集
Mock.mock('http://xx.com/api/organization/all', {
    "result": 1,
     "err": null,
    "data|0-10": [{
        "org_id": "@natural",
        "org_icon": "/image/1.jpg",
        "org_name": "@csentence(3, 5)",
        "org_numper": "@natural(1, 100)",
        "org_numatc": "@natural(1, 10)",
        "org_time": "@date('yyyy-MM-dd')"
    }]
});

//活动集
Mock.mock('http://xx.com/api/activity/all', {
    "result": 1,
     "err": null,
    "data|0-10": [{
        "act_id" : "@natural",
        "act_poster" : "/image/1.jpg",
        "act_name" : "@csentence(3, 5)",
        "act_starttime" : "@date('yyyy/MM/dd')",
        "act_endtime" : "2017/07/12",
        "act_sponsor" : "计算机协会",
    }]
});

//日记集
Mock.mock('http://xx.com/api/diary/all', {
    "result": 1,
     "err": null,
    "data|0-30": [{
        "dia_id": "@natural",
        "dia_title": "@csentence(5, 15)",
        "dia_about": "@csentence(3, 8)",
        "dia_time": "@datetime",
        "dia_author": "@csentence(3, 10)"
    }]
});


//登录
Mock.mock('http://www.xxx.cn/api/user/login', {
    "result": 1,
    "err" : null,
    "data": {
      "groupid": 2
    }
});

//注册
Mock.mock('http://www.xxx.cn/api/user/register', {
    "result": 1,
    "err" : null
});

//社团详情界面  社团部门
Mock.mock('http://xx.com/api/organization/department', {
    "result": 1,
    "err" : null,
    "data|4-6" :[{
        "dep_name" : "@csentence(3, 4)",
        "dep_user|4-10" : [{
            "user_id" : "@natural",
            "user_name" : "@csentence(3, 10)"
        }],
    }]
});

//社团详情界面  举办活动
Mock.mock('http://xx.com/api/organization/activity', {
    "result": 1,
    "err" : null,
    "data|4-6" :[{
        "act_id" : "@natural",
        "act_poster" : "/image/1.jpg",
        "act_name" : "@csentence(3, 4)",
        "act_starttime" : "@date('yyyy/MM/dd')",
        "act_endtime" : "@date('yyyy/MM/dd')",
        }]
});

// 日记以及活动的评论
Mock.mock('http://xx.com/api/comment', {
    "result": 1,
    "err" : null,
    "data|4-6" :[{
        "com_user_id" : "@natural",
        "com_user_name" : "@csentence(3, 10)",
        "com_time" : "@date('yyyy/MM/dd HH:mm:ss')",
        "com_user_img" : "/image/1.jpg",
        "com_content" : "@csentence(10, 30)",
        }]
});

//活动详情界面 的评论  提交
Mock.mock('http://xx.com/api/comment/post', {
    "result": 1,
    "err" : null
});

//个人信息
Mock.mock('http://xx.com/api/user/userinfo', {
    "result": 1,
    "err" : null,
    "data": {
        "user_id": '@natural',
        "user_img": '/image/1.jpg',
        "user_name": "czw",
        "user_sex": "男",
        "user_number": "1440112268",
        "user_grade": "14级",
        "user_truename": "陈志伟",
        "user_major": "软件工程",
        "user_phone": "13690265895",
        "inform|6-10" : [{
            "inf_id" : "@natural",
            "inf_tile" : "@title",
            "inf_content" : "@cparagraph",
            "inf_time" : "@datetime",
            "inf_from" : "系统",
            "inf_state" : "@natural(0, 1)",
        }],
        "activity|0-5" : [{
            "act_id" : "@natural",
            "act_poster" : "/image/1.jpg",
            "act_name" : "@word(7)"
        }],
        "organization|0-5" : [{
            "org_id" : "@natural",
            "org_name" : "@word(7)",
            "org_icon" : "/image/1.jpg",
            "org_jointime" : "@date",
            "org_duty" : "@word(7)",
            "org_section" : "@word(5)",
        }],
        "diary|0-6" : [{
            "dia_id " : "@natural"
        }]
    }
});


// 由日记id数组找日记
Mock.mock('http://xx.com/api/diary/byid', {
    "result": 1,
    "err" : null,
     "data|0-10" : [{
        "dia_id": "@natural",
        "dia_title": "@word(7)",
        "dia_time": "@datetime"
     }]
});


//更新个人信息
Mock.mock('http://xx.com/api/user/updateinfo', {
    "result": 1,
    "err" : null
});


//修改密码
Mock.mock('http://xx.com/api/user/updatepassword', {
     "result": 1,
    "err" : null
});


//报名参加活动
Mock.mock('http://xx.com/api/activity/jion', {
     "result": 1,
    "err" : null
});
//发表日记
Mock.mock('http://xx.com/api/diary/add', {
     "result": 1,
    "err" : null
});


////社团管理中心
Mock.mock('http://xx.com/api/organization/manager', {
     "result": 1,
    "err" : null,
    "data":{
        "org_name":"计算机协会",
        "user_name":"czw",
        "user_truename":"陈志伟",
        "org_icon":"/image/1.jpg",
        "org_id":"",
        "org_numper":"98",
        "org_major":"计算机系",
        "org_time":"2008/05/01",
        "org_atc|0-3":[{
            "act_id" : "@natural",
            "act_name" : "@word(7)",
        }]
    }
});
////活动人员列表
Mock.mock('http://xx.com/api/activity/userlist', {
     "result": 1,
    "err" : null,
    "data|0-12":[{
        "user_id":"@natural",
        "user_name":"@word(3,10)",
        "user_truename":"@word(3)",
        "user_sex":"男",
        "user_number":"1440112268",
        "user_phone":"136902968235",
        "user_grade":"14级",
        "user_major":"@word(5)"
    }]
});
/*管理界面*/
//人员列表
Mock.mock('http://xx.com/api/user/userlist', {
     "result": 1,
    "err" : null,
    "data|10":[{
        "user_id":"@natural",
        "user_name":"@word(3,10)",
        "user_truename":"@word(3)",
        "user_sex":"男",
        "user_number":"1440112268",
        "user_phone":"136902968235",
        "user_grade":"14级",
        "user_major":"@word(5)",
        "activity|0-2":[{
            "act_name":"@word(3)"
        }],
        "organization|0-1":[{
            "org_name":"@word(3)"
        }]
    }]
});
//删除指定用户
Mock.mock('http://xx.com/api/user/delete', {
     "result": 1,
    "err" : null
});
//发布通知
Mock.mock('http://xx.com/api/inform/add', {
     "result": 1,
    "err" : null
});
//通知详情

Mock.mock('http://xx.com/api/inform/getinfo', {
     "result": 1,
    "err" : null,
    "data":{
        "inf_title":"通知标题",
        "inf_content" : "通知内容",
        "inf_time" : "2017/12/12 12:12:22"
    }
});