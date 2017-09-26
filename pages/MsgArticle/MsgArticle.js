// pages/MsgArticle/MsgArticle.js
var Bmob = require('../../utils/bmob.js')

var Diary = Bmob.Object.extend("msg");
var query = new Bmob.Query(Diary);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    openid:'',
    objectID:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options){
    let objectID = options.id;
    let newOpenid = wx.getStorageSync('openid');

    this.setData({
      openid: newOpenid,
      objectID: objectID
    })
  },
  onShow(){
    let res = {};
    let _this = this;
    let objectID = this.data.objectID;
    let newOpenid = this.data.openid;

    query.get(objectID, {
      success(results) {
        res['userPic'] = results.get('userPic');
        res['content'] = results.get('content');
        res['author'] = results.get('author');
        res['title'] = results.get('title');
        if ( results.get('imgSrc') == undefined || results.get('imgSrc') == 0){
          res['imgSrc'] = [];
        }else{
          res['imgSrc'] = results.get('imgSrc');
        }
        res['date'] = results.createdAt;
        if (results.get('msg') == undefined || results.get('msg').length <=0 ){
          res['msg'] = []
        }else{
          res['msg'] = results.get('msg');
          if (res['msg'].length == 0) {
            res['msg'][0]['likeImg'] = "../../images/like2.png";
          } else {
            for (var i = 0; i < res['msg'].length; i++) {
              if (res['msg'][i].like.indexOf(newOpenid) >= 0 ){
                res['msg'][i]['likeImg'] = "../../images/like1.png";
              }else{
                res['msg'][i]['likeImg'] = "../../images/like2.png";
              }
            }
          }
        }
        if (results.get('like') == undefined || results.get('like').length <= 0 ) {
          res['like'] = [];
          res['likeImg'] = "../../images/like2.png";
          _this.setData({
            data: res
          })
        }else{
          res['like'] = results.get('like');
          if (res['like'].indexOf(newOpenid) >= 0) {
            res['likeImg'] = "../../images/like1.png";
          } else {
            res['likeImg'] = "../../images/like2.png";
          }
          _this.likeUserPic(res)
        }
      },
      error: function (object, error) {
        // 查询失败
      }
    });

  },
  likeUserPic(res) {
    let _this=this
    let userPic = [];
    let openidArr = [];
    let Diary = Bmob.Object.extend("_User");
    let query = new Bmob.Query(Diary);
    for (let i = 0; i < res.like.length; i++) {
      query.equalTo("openid", res.like[i]);
      query.find({
        success: function (results) {
          for (let i = 0; i < results.length; i++) {
            let object = results[i];
            userPic.push(object.get('userPic'));
            openidArr.push(object.get('openid'));
          }
          res['likeUser'] = userPic;
          res['like'] = openidArr;
          _this.setData({
            data: res
          })
        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });
    }
  },
  //点赞单条
  likeEvent(e){
    let index = e.currentTarget.dataset.index;
    let openid = this.data.openid;
    let likeArr = this.data.data.msg[index].like;
    let list = this.data.data;

    let _this = this
    let subscript = likeArr.indexOf(openid)
    if (subscript >= 0) {
      list['msg'][index].like.splice(subscript, 1);
      likeArr.splice(subscript, 1)
      list['msg'][index].likeImg = "../../images/like2.png";
      wx.showToast({
        title: '点赞取消',
        icon: 'success',
        duration: 1000
      })
    } else {
      list['msg'][index].like.push(openid);
      list['msg'][index].likeImg = "../../images/like1.png";
      wx.showToast({
        title: '点赞成功',
        icon: 'success',
        duration: 1000
      })
    }

    query.get(this.data.objectID, {
      success: function (result) {
        // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
        result.set('msg', list.msg);
        result.save();
        _this.setData({
          data: list
        })
      },
      error: function (object, error) {
        console.log("点赞失败")
      }
    });
  },
  //回复
  replyEvent(e) {
    let data = this.data.objectID;
    let replayName;
    if (e.currentTarget.dataset.index == undefined){
      replayName = "";
    }else{
      let index = e.currentTarget.dataset.index;
      replayName = this.data.data.msg[index].nickName;
    }

    wx.navigateTo({
      url: '../replyMsg/replyMsg?id=' + data + '&replayName=' + replayName
    })
  },
  //点赞本文
  AlikeEvent() {
    let openid = this.data.openid;
    let likeArr = this.data.data.like;
    let list = this.data.data;
    let _this = this
    let subscript = likeArr.indexOf(openid)
    if (subscript >= 0) {
      list.like.splice(subscript, 1);
      likeArr.splice(subscript, 1)
      list.likeUser.splice(subscript, 1)
      console.log(list.likeUser)
      list.likeImg = "../../images/like2.png";
      wx.showToast({
        title: '点赞取消',
        icon: 'success',
        duration: 1000
      })
    } else {
      list.like.push(openid);
      list.likeImg = "../../images/like1.png";
      _this.likeUserPic(list)
      wx.showToast({
        title: '点赞成功',
        icon: 'success',
        duration: 1000
      })
    }
    query.get(this.data.objectID, {
      success: function (result) {
        // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
        result.set('like', likeArr);
        result.save();
        _this.setData({
          data: list
        })
      },
      error: function (object, error) {
        console.log("点赞失败")
      }
    });
  },
})