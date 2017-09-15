/*
*业务逻辑
*/
//导入数据库配置文件
var mongodb = require('../db_setting');
//导出对象
function Essay(){}

//暴露文章接口essay
module.exports = Essay;


Essay.openDatabase = function(callback){
	mongodb.open(function (err, db) {
        if (err) {
            console.log('打开数据库失败');
             mongodb.close();
            return -1;
        }
        else {
            console.log('打开数据库成功');
			callback(db);
        }
    });
}
Essay.readCollection = function(db,db_collection,callback){
	db.collection(db_collection,function(err,collection){
        if(err){
            mongodb.close();
            return 0;
        }
        callback(collection);
	})
}



/*获取集合里所有内容   参数需带集合名称*/
Essay.getAll = function(db_collection,callback){
	Essay.openDatabase(function(db){
        Essay.readCollection(db,db_collection,function(collection){
            collection.find({}).sort({time:-1}).toArray(function(err, doc){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                if(doc){
                	callback(null, doc);
            	}else{
            		callback("noresults", doc);
            	}
            })

        })
	});
};

/*获取5篇最新文章*/
Essay.get5Essay = function(callback){
	Essay.openDatabase(function(db){
	        Essay.readCollection(db,"Essay",function(collection){
	            collection.find({}).sort({time:-1}).limit(5).toArray(function(err, doc){
	                mongodb.close();
	                if(err){
	                    return callback(err);
	                }
	                if(doc){
	                	callback(null, doc);
	            	}else{
	            		callback("noresults", doc);
	            	}
	            })
	        })
	});
};

/*获取5篇阅读量最多的文章*/
Essay.get5HotEssay = function(callback){
	Essay.openDatabase(function(db){
	        Essay.readCollection(db,"Essay",function(collection){
	            collection.find({}).sort({read:-1}).limit(5).toArray(function(err, doc){
	                mongodb.close();
	                if(err){
	                    return callback(err);
	                }
	                if(doc){
	                	callback(null, doc);
	            	}else{
	            		callback("noresults", doc);
	            	}
	            })
	        })
	});
};

/*获取文章详情并阅读加1*/
Essay.getOneEssayadd1 = function(e_title,callback){
	Essay.openDatabase(function(db){
	       Essay.readCollection(db,"Essay",function(collection){
	            collection.findOne({
	            	"title": e_title
	            },function(err, doc){
	                if(err){
	                	mongodb.close();
	                    return callback(err);
	                }
	                if(doc){
	                	collection.update({
	                		"title": e_title
	                    },{
	                        $inc : {"read" : 1}
	                    },function(err){
	                        if(err){
	                            return callback(err,null);
	                        }
	                    })
	                    mongodb.close();
		                callback(null, doc);
	            	}else{
	            		mongodb.close();
	            		callback("noresults",null);
	            	}
	            })
	        })
	});
};

/*获取一篇文章详情*/
Essay.getOneEssay = function(e_title,callback){
	Essay.openDatabase(function(db){
	        Essay.readCollection(db,"Essay",function(collection){
	            collection.findOne({
	            	"title": e_title
	            },function(err, doc){
	            	mongodb.close();
	                if(err){
	                    return callback(err);
	                }
	                if(doc){   
		                callback(null, doc);
		            }else{
		            	callback("noresults",null);
		            }
	            })
	        })
	});
};

//获取该Tag标签的所有文章
Essay.getTagEssay= function(e_tag,callback){
	Essay.openDatabase(function(db){
        Essay.readCollection(db,"Essay",function(collection){
            collection.find({
            	"tag" : e_tag
            }).sort({time:-1}).toArray(function(err, doc){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                if(doc){   
	                callback(null, doc);
	            }else{
	            	callback("noresults",null);
	            }
	        })
        })
	});
};

//获取该Tag标签的信息
Essay.getTagInfo= function(t_name,callback){
	Essay.openDatabase(function(db){
        Essay.readCollection(db,"Tags",function(collection){
            collection.findOne({
            	"tags_name" : t_name
            },function(err, doc){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                if(doc){   
	                callback(null, doc);
	            }else{
	            	callback("noresults",null);
	            }
	        })
        })
	});
};

//修改该标签信息
Essay.postTagInfo= function(t_name,t_synopsis,callback){
    Essay.openDatabase(function(db){
        Essay.readCollection(db,"Tags",function(collection){
            collection.update({
                "tags_name" : t_name 
            },{
                $set : { tags_synopsis: t_synopsis }
            },function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

//修改文章信息
Essay.postEssayInfo= function(e_title,e_content,callback){
    Essay.openDatabase(function(db){
        Essay.readCollection(db,"Essay",function(collection){
            collection.update({
                "title" : e_title 
            },{
                $set : {  content : e_content }
            },function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};


//删除标签
Essay.removeTag= function(t_name,callback){
	Essay.openDatabase(function(db){
        Essay.readCollection(db,"Tags",function(collection){
            collection.remove(
            	{"tags_name" : t_name },
            	function(err){
                mongodb.close();
                if(err){return callback(err);}
                callback(null);
            });
        });
    });

}

//删除文章
Essay.removeEssay= function(e_title,callback){
	Essay.openDatabase(function(db){
        Essay.readCollection(db,"Essay",function(collection){
            collection.remove(
            	{"title" : e_title },
            	function(err){
                mongodb.close();
                if(err){return callback(err);}
                callback(null);
            });
        });
    });

}


/*提交文章评论*/
Essay.postComment = function(e_title,name,email,content,callback){
	var date = new Date();
	var time = date.getFullYear()+"-"+((date.getMonth()+1) <10 ? '0'+(date.getMonth()+1) : (date.getMonth()+1))+"-"+date.getDate()+" "+(date.getHours() <10 ? '0'+date.getHours() : date.getHours())+":"+(date.getMinutes() <10 ? '0'+date.getMinutes() : date.getMinutes())+":"+(date.getSeconds() <10 ? '0'+date.getSeconds() : date.getSeconds())
	var comment = {
		"c_name" : name,
		"c_email" : email,
		"c_time" : time,
		"c_content" : content,
	};
	Essay.openDatabase(function(db){
        Essay.readCollection(db,"Essay",function(collection){
            collection.update({
                "title" : e_title
	            },{
	                $push : {"comment" : comment}
	            },function(err, doc){
	                mongodb.close();
	                if(err){
	                    return callback(err);
	                }
	                callback(null, doc);
	        })
        })
	});
}//提交文章评论

/*验证登录*/
Essay.login = function(m_name,m_password,callback){
	Essay.openDatabase(function(db){
        Essay.readCollection(db,"Manage",function(collection){
            collection.findOne({
                "m_name" : m_name,
                "m_password" : m_password
	            },function(err, doc){
	                mongodb.close();
	                if(err){
	                    return callback(err);
	                }
	                if(doc){
	                	callback(null, "success");
	                }else{
	                	callback(null, "failed");
	                }
	        })
        })
	});
}//验证登录

/*后台添加标签*/
Essay.addTag = function(t_name,t_synopsis,callback){
	var tag = {
        tags_name : t_name,
        tags_synopsis : t_synopsis,
        tags_number : 0
    }
	Essay.openDatabase(function(db){
        Essay.readCollection(db,"Tags",function(collection){
            collection.insert(tag,{
                safe:true
            },function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}
/*后台添加文章*/
Essay.addEssay = function(e_title,e_tag,e_content,callback){
	var date = new Date();
    var time = {
        year : date.getFullYear(),
        month : date.getFullYear()+"-"+((date.getMonth()+1) <10 ? '0'+(date.getMonth()+1) : (date.getMonth()+1)),
        day : date.getFullYear()+"-"+((date.getMonth()+1) <10 ? '0'+(date.getMonth()+1) : (date.getMonth()+1))+"-"+date.getDate(),
        minute : date.getFullYear()+"-"+((date.getMonth()+1) <10 ? '0'+(date.getMonth()+1) : (date.getMonth()+1))+"-"+date.getDate()+" "+(date.getHours() <10 ? '0'+date.getHours() : date.getHours())+":"+(date.getMinutes() <10 ? '0'+date.getMinutes() : date.getMinutes())+":"+(date.getSeconds() <10 ? '0'+date.getSeconds() : date.getSeconds())
    }
	var essay = {
        title : e_title,
        tag : e_tag,
        time : time,
        content : e_content,
        read : 0,
        comment : []
    }
	Essay.openDatabase(function(db){
        Essay.readCollection(db,"Essay",function(collection){
            collection.insert(essay,{
                safe:true
            },function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}
//后台添加文章时该标签加1
Essay.addTagNumber = function(t_name,callback){
	Essay.openDatabase(function(db){
	        Essay.readCollection(db,"Tags",function(collection){
	            collection.findOne({
	            	"tags_name": t_name
	            },function(err, doc){
	                if(err){
	                	mongodb.close();
	                    return callback(err);
	                }
	                if(doc){
	                	collection.update({
	                		"tags_name": t_name
	                    },{
	                        $inc : {"tags_number" : 1}
	                    },function(err){
	                        if(err){
	                            return callback(err);
	                        }
	                    })
	                    mongodb.close();
		                callback(null, doc);
	            	}else{
	            		mongodb.close();
	            		callback(err);
	            	}
	            })
	        })
	});
}
//后台删除文章时该标签减1
Essay.minusTagNumber = function(t_name,callback){
	Essay.openDatabase(function(db){
	        Essay.readCollection(db,"Tags",function(collection){
	            collection.findOne({
	            	"tags_name": t_name
	            },function(err, doc){
	                if(err){
	                	mongodb.close();
	                    return callback(err);
	                }
	                if(doc){
	                	collection.update({
	                		"tags_name": t_name
	                    },{
	                        $inc : {"tags_number" : -1}
	                    },function(err){
	                        if(err){
	                            return callback(err);
	                        }
	                    })
	                    mongodb.close();
		                callback(null);
	            	}else{
	            		mongodb.close();
	            		callback(err);
	            	}
	            })
	        })
	});
}




























/*右边*/
Essay.right = function(callback){
	Essay.getAll('Tags',function(err, tags){
		if(err){
			console.log(err);
			return;
		}
		Essay.getAll('Essay',function(err, allessays){
			if(err){
    			console.log(err);
    			return;
    		}
    		Essay.get5HotEssay(function(err, hot5){
				if(err){
	    			console.log(err);
	    			return;
	    		}
	    		callback(tags,allessays,hot5);
			})
	    })
	})
}//right

    	
	