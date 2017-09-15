"use strict"
var index = angular.module('app', []);

//封装$http访问后台数据请求
index.factory("dataFactory",function($q,$http){
    return{
        getlist: function(apiurl, method, params) {
            var defer = $q.defer();  
            if (method == 'GET') {  
                $http({  
                    url: apiurl,  
                    method: "GET",  
                    params: params,  
                }).success(function (data,status) {
                    console.log("success status"+status);
                    defer.resolve(data);
                }).  
                error(function (data, status, headers, config) {
                    console.log("err status"+status);
                    defer.reject(data);  
                });  
            } else {  
                $http({  
                    url: apiurl,  
                    method: method,   
                    data: params,  
                }).success(function (data) {  
                    defer.resolve(data);  
                }).  
                error(function (data, status, headers, config) {
                    defer.reject(data);  
                });  
            }   
            return defer.promise; 
        }
    };
});
//全局提示框
index.value("alerts",[]);
index.factory('commAlertService',['$rootScope','$timeout','alerts',function($rootscope,$timeout,alerts){
    return {
        "alertService":function(){
            var alertJson = {};
            $rootscope.alerts = alerts;
            alertJson.add = function(type,msg,time){
                $rootscope.alerts.splice(0,1,{'type': type, 'msg': msg,'close':function(){
                    alertJson.closeAlert(this);
                }});
                //如果设置定time的话就定时消失
                if(time){
                    $timeout(function(){
                        $rootscope.alerts = [];
                    },time);
                }
            };
            alertJson.closeAlert = function(alert){
                $rootscope.alerts.splice($rootscope.alerts.indexOf(alert),1);
            };
            return alertJson;
        }
    }
}])



//活动集监听数据渲染完成
index.directive('onFinishRenderFilters', function ($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function() {
          scope.$emit('ngRepeatFinished1');
        });
      }
    }
  };
});

//*****************************************************
//头部导航栏
index.controller('nav', function($scope,dataFactory,commAlertService) {
      //检测登录状态
      if($.cookie('userid') && $.cookie('groupid')){
        $('#login').css("display","none");
        $('#islogin').css("display","inline-block");
        // 3:普通用户  2：社团管理员  1：系统管理员
        if($.cookie('groupid') == "3"){
            $('#managecenter').css("display","none");
        }
        if($.cookie('groupid') == "2"){
            $('#managecenter').css("display","inline-block");
        }
        $scope.UserImg = $.cookie('user_img');
      }
    //改变css显示导航栏
    $('#rightnav').css("display","inline-block");
});

//首页最新活动
index.controller('indexlunbo', function($scope,dataFactory,commAlertService) {
    var params = {};
    dataFactory.getlist("/myapi/activity/newest", 'GET', params).then(function(data) { 
        if(data.result){
            $scope.lunbo = data.data;
        }else{
           commAlertService.alertService().add('danger', data.err);
        }
    },function(data){
        console.log("接口访问错误");
    })
});

//首页最新6篇日记
index.controller('indexDiary', function($scope,dataFactory,commAlertService) {
    var params = {};
    dataFactory.getlist("/myapi/diary/newest", 'GET', params).then(function(data) { 
        console.log(data)
        if(data.result){
            $scope.Diary = data.data;
        }else{
            commAlertService.alertService().add('danger', data.err);
        }
    },function(data){
        console.log("接口访问错误");
    })

});

//首页活跃3个社团
index.controller('indexhotOrganization', function($scope,dataFactory,commAlertService) {
    var params = {};
    dataFactory.getlist("/myapi/organization/hot", 'GET', params).then(function(data) {
        console.log(data)
        if(data.result){
            $scope.Organization = data.data;
        }else{
            commAlertService.alertService().add('danger', data.err);
        }
    },function(data){
        console.log("接口访问错误");
    })
});



//社团集页面   
index.controller('organizations', function($scope,dataFactory,commAlertService) {
    //排序
    $scope.desc = 0;
    var params = {};
    dataFactory.getlist("/myapi/organization/all", 'GET', params).then(function(data) {
        console.log(data);
        if(data.result){
            $scope.organizations = data.data;
             $("#o_tbody").css("display","table-footer-group");
        }else{
            commAlertService.alertService().add('danger', data.err);
        }
    },function(data){
        console.log("接口访问错误");
    })
});

//活动集页面   
index.controller('activitys', function($scope,dataFactory,commAlertService) {
    var params = {};
    dataFactory.getlist("/myapi/activity/all", 'GET', params).then(function(data) {
        console.log(data);
        if(data.result){
            $scope.activitys = data.data;
            $('#abox').css("display","block");
        }else{
            commAlertService.alertService().add('danger', data.err);
        }
    },function(data){
        console.log("接口访问错误");
    })
    //界面渲染完成通知
    $scope.$on('ngRepeatFinished1', function (ngRepeatFinishedEvent,$window) {
        var time = new Date();
        var nowtime = time.getFullYear()+"/"+(time.getMonth()+1)+"/"+time.getDate();
        $(".endtime").each(function(index){
            if(Date.parse($(this).html()) > Date.parse(nowtime)){
                $(".sign").eq(index).text("进行中..");
                $(".sign").eq(index).css({"background-color":"#50a852","color":"#fff"});
            }else{
                $(".sign").eq(index).text("已结束");
                $(".sign").eq(index).css({"background-color":"#e9493a","color":"#fff"});
            }
            
        });
     });
});

//日记集页面   
index.controller('diarys', function($scope,dataFactory,commAlertService) {
    //排序
    $scope.desc = 0;
    var params = {};
    dataFactory.getlist("/myapi/diary/all", 'GET', params).then(function(data) {
        console.log(data);
        if(data.result){
            $scope.diarys = data.data;
             $("#o_tbody").css("display","table-footer-group");
        }else{
            commAlertService.alertService().add('danger', data.err);
        }
    },function(data){
        console.log("接口访问错误");
    })
});

//登录
index.controller('login', function($scope,$location,dataFactory,commAlertService) {
    //登录操作
    $scope.isShow = false;
    $scope.isdisabled = true;
    $scope.user = {
        name : "",
        password : ""
    }
    $scope.reset = function(){
        $scope.user = {
            name : "",
            password : ""
        }
    }
    $scope.login = function(){
        if($scope.user.name.length >10 || $scope.user.name.length <3){
             $scope.isShow = true;
             $scope.danger = "用户名应在3-10位间";
              return;
        }else{$scope.isShow = false;}
        if($scope.user.password.length >16 || $scope.user.password.length <6){
             $scope.isShow = true;
             $scope.danger = "密码应在6-16位间";
              return;
        }else{$scope.isShow = false;}

        var params = {
            username :$scope.user.name,
            password :$scope.user.password
        };
        console.log(params);
        dataFactory.getlist("/myapi/user/login", 'POST', params).then(function(data) {
            console.log(data);
            if(data.result){
                window.location.href="/";
                commAlertService.alertService().add('success', "登录成功^_^",2000);
            }else{
                $scope.isShow = true;
                $scope.danger = data.err;
            }
        },function(data){
            console.log("接口访问错误");
        })
    }
});

//注册
index.controller('register', function($scope,$location,dataFactory,commAlertService) {
    //注册操作
    $scope.isShow = false;
    $scope.isdisabled = true;
    $scope.user = {
        name : "",
        password : "",
        rpassword : ""
    }
    $scope.login = function(){
        if($scope.user.name.length >10 || $scope.user.name.length <3){
             $scope.isShow = true;
             $scope.danger = "用户名应在3-10位间";
              return;
        }else{$scope.isShow = false;}
        if($scope.user.password.length >16 || $scope.user.password.length <6){
             $scope.isShow = true;
             $scope.danger = "密码应在6-16位间";
              return;
        }else{$scope.isShow = false;}
        if($scope.user.password != $scope.user.rpassword){
             $scope.isShow = true;
             $scope.danger = "密码和确认密码不一致";
              return;
        }else{$scope.isShow = false;}
        $scope.isShow = true;
        $scope.danger = "注册中.....";
        //登录
        var params = {
            username :$scope.user.name,
            password :$scope.user.password
        };
        dataFactory.getlist("/myapi/user/register", 'POST', params).then(function(data) {
            console.log(data);
            if(data.result){
                $scope.isShow = false;
                $scope.user.name ="";
                $scope.user.password ="";
                $scope.user.rpassword ="";
                commAlertService.alertService().add('success', "注册成功，赶快登录吧！",2000);
            }else{
                $scope.isShow = true;
                $scope.danger = data.err;
            }
        },function(data){
            console.log("接口访问错误");
        })
    }
});





//社团详情页面
index.controller('organization', function($scope,$location,dataFactory,commAlertService){
    //获取地址的社团id
    var param = ($location.absUrl()).split("/").pop();
    //社团信息
    var params5 = {
        id:param,
        make:"org"
    };
    dataFactory.getlist("/myapi/info", 'GET', params5).then(function(data) {
        console.log(data);
        if(data.result){
            $scope.info = data.data;
            $('#o_department').css('display','block');
        }else{
            if(data.err = "nothing"){window.location.href="/404";}
        }
    },function(data){
        console.log("接口访问错误");
    })
    var params1 = {
        org_id:param
    };
    dataFactory.getlist("/myapi/organization/activitys", 'GET', params1).then(function(data) {
        console.log(data);
        if(data.result){
            $scope.activity = data.data;
            $('#o_activity').css("display","block");
        }else{
            $scope.activity = {};
            $scope.a_err = data.err;
            console.log("错误："+data.err);
        }
    },function(data){
        console.log("接口访问错误");
    });
    //加入社团
    $scope.join = function(){
        var ft=confirm("确定要加入该社团吗？请确保个人信息完整哦");
        if (ft==false){
          return false;
        }
        commAlertService.alertService().add('warning', "正在检验信息...");
        var params4 = {
            user_id:$.cookie('userid'),
            org_id:param
        };
        dataFactory.getlist("/myapi/organization/join", 'POST', params4).then(function(data) {
        console.log(data);
        if(data.result){
            commAlertService.alertService().add('success', "社团加入提交成功，等待管理员审核通知！",2000);
        }else{
            commAlertService.alertService().add('danger',data.err);
        }
    },function(data){
        console.log("接口访问错误");
    });
    }
     //界面渲染完成通知
    $scope.$on('ngRepeatFinished1', function (ngRepeatFinishedEvent,$window) {
        var time = new Date();
        var nowtime = time.getFullYear()+"/"+(time.getMonth()+1)+"/"+time.getDate();
        $(".endtime").each(function(index){
            if(Date.parse($(this).html()) > Date.parse(nowtime)){
                $(".sign").eq(index).text("进行中..");
                $(".sign").eq(index).css({"background-color":"#50a852","color":"#fff"});
            }else{
                $(".sign").eq(index).text("已结束");
                $(".sign").eq(index).css({"background-color":"#e9493a","color":"#fff"});
            }
            
        });
        // .length
     });
})

//活动详情的评论
index.controller('activityComment', function($scope,$http,$location,dataFactory,commAlertService) {
    $scope.isShow = false;
    $scope.commentword = "";
    //获取地址的社团id
    var param = ($location.absUrl()).split("/").pop();
    //活动信息
    var params5 = {
        id:param,
        make:"act"
    };
    dataFactory.getlist("/myapi/info", 'GET', params5).then(function(data) {
        console.log(data);
        if(data.result){
            $scope.info = data.data;
            $('#o_department').css('display','block');

        }else{
            if(data.err = "nothing"){window.location.href="/404";}
        }
    },function(data){
        console.log("接口访问错误");
    })






    //获取评论
    var params = {
        par_id:param
    };
    var r = function(){
    dataFactory.getlist("/myapi/comment", 'GET', params).then(function(data) {
        console.log(data);
        if(data.result){
            $scope.Comments = data.data;
            if(!data.data){$scope.isShow = true;}
             $('#comment').css('display','block');
        }else{
            commAlertService.alertService().add('danger', data.err);
        }
    },function(data){
        console.log("接口访问错误");
    })} 
    r();
    //点击回复 将该用户名写入文本框并返回底部
    $scope.reply = function(author) {
        $scope.commentword = "@ "+author+"  ";
        $(document).scrollTop($(document).height()-$(window).height());
    }
    $scope.publish = function(){
        //发表评论
        var params = {
            com_user_id:$.cookie('userid'),
            com_content:$scope.commentword,
            par_id:param
        };
        dataFactory.getlist("/myapi/comment/post", 'POST', params).then(function(data) {
            console.log(data);
            if(data.result){
                r();
                $scope.commentword = "";
            }else{
                commAlertService.alertService().add('danger', data.err);
            }
        },function(data){
            console.log("接口访问错误");
        })
    }





    //报名参加
    $scope.join = function(){
        commAlertService.alertService().add('warning', "报名中...");
        var params1 = {
            user_id:$.cookie('userid'),
            act_id:param
        }
        dataFactory.getlist("/myapi/activity/join", 'GET', params1).then(function(data) {
            console.log(data);
            if(data.result){
                commAlertService.alertService().add('success',"报名参赛成功，请留意比赛通知",2000);
            }else{
                commAlertService.alertService().add('danger', data.err);
            }
        },function(data){
            console.log("接口访问错误");
        })
    }
});

//日记详情界面的评论
index.controller('diaryDetailsComment', function($scope,$location,dataFactory,commAlertService) {
    $scope.isShow = false;
    $scope.commentword = "";
    //获取地址的id
    var param = ($location.absUrl()).split("/").pop();

    //日记信息
    var params5 = {
        id:param,
        make:"diary"
    };
    dataFactory.getlist("/myapi/info", 'GET', params5).then(function(data) {
        console.log(data);
        if(data.result){
            $scope.info = data.data;
            $('#diarydetail').css('display','block');
        }else{
            if(data.err = "nothing"){window.location.href="/404";}
        }
    },function(data){
        console.log("接口访问错误");
    })





    var params = {
        par_id:param
    };
    var r = function(){
    dataFactory.getlist("/myapi/comment", 'GET', params).then(function(data) {
        console.log(data);
        if(data.result){
            $scope.Comments = data.data;
            if(!data.data){$scope.isShow = true;}
             $('#comment').css('display','block');
        }else{
            commAlertService.alertService().add('danger', data.err);
        }
    },function(data){
        console.log("接口访问错误");
    })} 
    r();
    //点击回复 将该用户名写入文本框并返回底部
    $scope.reply = function(author) {
        $scope.commentword = "@ "+author+"  ";
        $(document).scrollTop($(document).height()-$(window).height());
    }
    $scope.publish = function(){
        //发表评论
        var params = {
            com_user_id:$.cookie('userid'),
            com_content:$scope.commentword,
            par_id:param
        };
        dataFactory.getlist("/myapi/comment/post", 'POST', params).then(function(data) {
            console.log(data);
            if(data.result){
                r();
                $scope.commentword = "";
            }else{
                commAlertService.alertService().add('danger', data.err);
            }
        },function(data){
            console.log("接口访问错误");
        })
    }
});







/******个人中心***/
index.controller('mydetail', function($scope,$http,$location,dataFactory,commAlertService) {
    /*获取cookie的userid，不存在则跳转到首页*/
    var userid = $.cookie('userid');
    if(!userid){
        window.location="/";
        return;
    }
    //****************根据id获取个人信息
    var getinfo = function(){
        var params = {
            user_id:userid
        };
        dataFactory.getlist("/myapi/user/info", 'GET', params).then(function(data) {
            console.log(data);
            if(data.result){
                $scope.userinfo = data.data;
            }else{
                window.location.href="/404";
            }
        },function(data){
            console.log("接口访问错误");
        })
    }
    getinfo();
    //***************修改个人信息
    $scope.alterdata = function(){
        var r=confirm("确定要修改个人信息吗？");
        if (r==false){
          return false;
        }
        var params2 = {
            user_id:userid,
            user_number:$scope.userinfo.inform[0].user_number,
            user_truename:$scope.userinfo.inform[0].user_truename,
            user_sex:$scope.userinfo.inform[0].user_sex,
            user_grade:$scope.userinfo.inform[0].user_grade,
            user_major:$scope.userinfo.inform[0].user_major,
            user_phone:$scope.userinfo.inform[0].user_phone
        };
        dataFactory.getlist("/myapi/user/updatainfo", 'POST', params2).then(function(data) {
            if(data.result){
                commAlertService.alertService().add('success', "信息修改成功！",1000);
                getinfo();
            }else{
                commAlertService.alertService().add('danger', data.err);
            }
        },function(data){
            console.log("接口访问错误");
        })
    }
       
    //**************修改密码
    $scope.oldpassword ="";
    $scope.newpassword ="";
    $scope.alterpassword = function(){
        var oldpassword = $scope.oldpassword;
        var newpassword = $scope.newpassword;
        $scope.isShow = false;
        $scope.err = "";
        if(oldpassword.length <1){
            $scope.isShow = true;
            $scope.err = "请填写原始密码";
            return;
        }else{$scope.isShow = false;}
        if(newpassword.length < 1 ){
            $scope.isShow = true;
            $scope.err = "请填写新密码";
            return;
        }else{$scope.isShow = false;}
        if(newpassword.length < 6 || newpassword.length >16){
            $scope.isShow = true;
            $scope.err = "新密码长度应为6-16位";
            return;
        }else{$scope.isShow = false;}
        var r=confirm("确定要修改密码吗？");
        if (r==false){
          return false;
        }
        $scope.isShow = true;
        $scope.err = "修改中----";
        var params3 = {
            user_id:userid,
            oldpassword:oldpassword,
            newpassword:newpassword
        };
        console.log(params3);
        dataFactory.getlist("/myapi/user/updatapass", 'POST', params3).then(function(data) {
            console.log(data);
            if(data.result){
                    $scope.oldpassword ="";
                    $scope.newpassword ="";
                    $scope.isShow = false;
                    commAlertService.alertService().add('success', "密码修改成功！",1000);
                     window.location.href="/login";
            }else{
                $scope.isShow = true;
                $scope.err = data.err;
            }
        },function(data){
            console.log("接口访问错误");
        })
    }
})

/****个人主页*/
index.controller('userdetail',function($scope,$http,$location,dataFactory,commAlertService){
    //获取地址的个人id
    var param = ($location.absUrl()).split("/").pop();
    var params = {user_id:param};
        dataFactory.getlist("/myapi/user/info", 'GET', params).then(function(data) {
        console.log(data);
            if(data.result){
                $scope.userinfo = data.data;
                $('#userinfo').css('display','block');
            }else{
                if(data.err = "该用户不存在"){
                    window.location.href="/404";
                }
            }
        },function(data){
            console.log("接口访问错误");
        })
});
//发表日记
index.controller('postdetail', function($scope,$http,$location,dataFactory,commAlertService) {
    $scope.isShow = false;
    $scope.err = "";
    $scope.title = "";
    $scope.about = "";
    $scope.content = "";
    $scope.post = function(){
        var title = $scope.title;
        var about = $scope.about;
        var content = $scope.content;
        if(title.length < 1 || title.length >30){
            $scope.isShow = true;
            $scope.err = "日记标题应在1-30个字符";
            return;
        }else{$scope.isShow = false;}
        if(about.length < 1 || about.length >30){
            $scope.isShow = true;
            $scope.err = "日记关于应在1-30个字符";
            return;
        }else{$scope.isShow = false;}
        if(content.length < 1 || content.length >1000){
            $scope.isShow = true;
            $scope.err = "日记内容应在1-1000个字符";
            return;
        }else{$scope.isShow = false;}
        var params = {
            dia_title:title,
            dia_about:about,
            dia_content:content,
            par_user_id:$.cookie('userid')
        };
        console.log(params);
        dataFactory.getlist("/myapi/diary/add", 'POST', params).then(function(data) {
            console.log(data);
            if(data.result){
                $scope.title = "";
                $scope.content = "";
                $('#wantIn').modal('hide');
                commAlertService.alertService().add('success',"日记发表成功",2000);
            }else{
                commAlertService.alertService().add('danger', data.err);
            }
        },function(data){
            console.log("接口访问错误");
        })
    }
})

//社团管理中心
index.controller('manager',function($scope,$location,dataFactory,commAlertService){
    var groupid = $.cookie('groupid');
    var userid = $.cookie('userid');
    if(groupid!="2"||!userid){
        //返回主页
        window.location.href="/";
        return;
    }
        //获取管理信息
    var getorginfo = function(){
        var params = {
            userid: userid
        };
        dataFactory.getlist("/myapi/organization/manager", 'GET', params).then(function(data) {
                console.log(data);
                if(data.result){
                    $scope.organization = data.data;
                    $('#manage').css('display','block');
                }else{
                    commAlertService.alertService().add('danger', data.err);
                }
            },function(data){
                console.log("接口访问错误");
        })
    }
    getorginfo();
    //点击活动查看人数
    $scope.selectuser = function(aid) {
        commAlertService.alertService().add('warning', "获取活动报名用户列表中..");
        //获取活动报名人数
        var params1 = {
            a_id: aid
        };
        dataFactory.getlist("/myapi/activity/userlist", 'GET', params1).then(function(data) {
            console.log(data);
            if(data.result){
                $scope.userlist = data.data;
                commAlertService.alertService().add('success', "获取活动报名用户列表成功",1000);
                $('#userlist').css('display','block');
            }else{
                commAlertService.alertService().add('danger', data.err);
            }
        },function(data){
                console.log("接口访问错误");
        })
    }
    //审核通过
    $scope.pass = function(uid,oid,org_name){
        var mymessage=confirm("确定将TA审核设置为PASS(通过)吗？");  
        if(mymessage==false)  
        {  
            return false;
        }  
        var params1 = {
            user_id: uid,
            org_id: oid,
            org_name: org_name
        };
        dataFactory.getlist("/myapi/audit/pass", 'POST', params1).then(function(data) {
                console.log(data);
                if(data.result){
                    commAlertService.alertService().add('success',"审核结果执行成功");
                    getorginfo();
                }else{
                    commAlertService.alertService().add('danger', data.err);
                }
            },function(data){
                console.log("接口访问错误");
        })

    }
    //审核不通过
    $scope.nopass = function(uid,oid,org_name){
        var mymessage=confirm("确定将TA审核设置为NOPASS(不通过)吗？");  
        if(mymessage==false)  
        {  
            return false;
        }  
        var params1 = {
            user_id: uid,
            org_id: oid,
            org_name: org_name
        };
        dataFactory.getlist("/myapi/audit/nopass", 'POST', params1).then(function(data) {
                console.log(data);
                if(data.result){
                    commAlertService.alertService().add('success',"审核结果执行成功");
                    getorginfo();
                }else{
                    commAlertService.alertService().add('danger', data.err);
                }
            },function(data){
                console.log("接口访问错误");
        })
    }
});


//通知详情
index.controller('informCtrl',function($scope,$location,dataFactory,commAlertService){
       var param = ($location.absUrl()).split("/").pop();
        var params = {
            inf_id: param
        };
        dataFactory.getlist("/myapi/inform/getinfo", 'GET', params).then(function(data) {
            console.log(data);
            if(data.result){
                $scope.inform = data.data;
                $('#informCtrl').css('display',"block");
            }else{
                if(data.err = "nothing"){
                    window.location.href="/404";
                }else{
                    commAlertService.alertService().add('danger', data.err);
                }
            }
        },function(data){
                console.log("接口访问错误");
        })
})





/*系统管理员*/
index.controller('managelogin',function($scope,$location,dataFactory,commAlertService){
    $scope.username = "";
    $scope.password = "";
    $scope.login = function(){
        if($scope.username != "yixiang" && $scope.password != "123456"){
           commAlertService.alertService().add('danger', "你真的是系统管理员吗？登录失败啦！");
        }else{
            $.cookie('manage', '1', { expires: 7 }); 
           window.location.href="/manage";
        }
    }
})
//普通用户
index.controller('common',function($scope,$location,dataFactory,commAlertService){
    var nowpag = 1;
    //获取用户
    var getUserList = function(par_nowpag){
        var params = {
            nowpag: par_nowpag,
            groupid:'3'
        };
        dataFactory.getlist("/myapi/inform/getallinfo", 'GET', params).then(function(data) {
            console.log(data);
            if(data.result){
                $scope.userlist = data.data;
                if(par_nowpag=1){$('#common_old').addClass('disabled');}
                if(data.data.length<10){$('#common_next').addClass('disabled');}
            }else{
                commAlertService.alertService().add('danger', data.err);
            }
        },function(data){
                console.log("接口访问错误");
        })
    }
    getUserList(1);
    //上一页
    $scope.oldpag = function(){
        nowpag--;
        getUserList(nowpag);
    }
    //下一页
    $scope.nextpag = function(){
        nowpag++;
        getUserList(nowpag);
    }
    //删除用户
    $scope.deleteUser = function(uid){
        alert("删除id为："+uid+"的用户。")
        var params = {
            userid: uid
        };
        dataFactory.getlist("/myapi/user/delete", 'POST', params).then(function(data) {
            console.log(data);
            if(data.result){
                commAlertService.alertService().add('success', "删除用户成功",1000);
                getUserList(nowpag);
            }else{
                commAlertService.alertService().add('danger', data.err);
            }
        },function(data){
                console.log("接口访问错误");
        })
    }
});
//社团管理员用户
index.controller('o_manage',function($scope,$location,dataFactory,commAlertService){
    var nowpag = 1;
    //获取用户
    var getUserList = function(par_nowpag){
        console.log("参数："+par_nowpag);
        var params = {
        nowpag: par_nowpag,
        groupid:'2'
        };
        dataFactory.getlist("/myapi/inform/getallinfo", 'GET', params).then(function(data) {
            console.log(data);
            if(data.result){
                $scope.userlist = data.data;
                if(par_nowpag=1){$('#o_manage_old').addClass('disabled');}
                if(data.data.length<10){$('#o_manage_next').addClass('disabled');}
            }else{
                commAlertService.alertService().add('danger', data.err);
            }
        },function(data){
                console.log("接口访问错误");
        })
    }
    getUserList(1);
    //上一页
    $scope.oldpag = function(){
        nowpag--;
        getUserList(nowpag);
    }
    //下一页
    $scope.nextpag = function(){
        nowpag++;
        getUserList(nowpag);
    }
});
//发布通知
index.controller('inform',function($scope,$location,dataFactory,commAlertService){
     $scope.informContent = "";
    $scope.informTitle ="";
    $scope.postinform = function(){
        var params = {
        title: $scope.informTitle,
        content: $scope.informContent
        };
        alert(JSON.stringify(params));
        dataFactory.getlist("/myapi/inform/add", 'POST', params).then(function(data) {
            console.log(data);
            if(data.result){
                commAlertService.alertService().add('success', "通知发布成功",2000);
                $scope.informContent = "";
                $scope.informTitle ="";
            }else{
                commAlertService.alertService().add('danger', data.err);
            }
        },function(data){
                console.log("接口访问错误");
        })
    }
})
