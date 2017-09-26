// pages/MsgList/MsgList.js
var Bmob = require('../../utils/bmob.js')

var startY=0;
var msg = Bmob.Object.extend("msg");
var query = new Bmob.Query(msg);
var iNow=1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    animationData: {},
    list:[],
    openid:'',
    length:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    wx.showLoading({
      title: '请求中',
    })
    // 查询所有数据
    let msg = Bmob.Object.extend("msg");
    let query = new Bmob.Query(msg);
    query.find({
      success(results) {
        _this.setData({
          length: results.length
        })
      },
    });

    let newOpenid = wx.getStorageSync('openid');
    let _this=this;
    this.setData({
      openid: newOpenid
    })


    this.getData(iNow);
    wx.hideLoading()
  },
  //下拉加载
  onReachBottom(){
    iNow++
    this.getData(iNow);
  },
  getData(iNow){
    let queryData = [];
    let _this = this;
    let newOpenid = this.data.openid
    query.limit(iNow * 3);
    query.find({
      success(results) {
        // 循环处理查询到的数据
        for (let i = 0; i < results.length; i++) {
          let object = results[i];
          let res = {};
          res['id'] = object.id;
          res['userPic'] = object.get('userPic');
          res['title'] = object.get('title');
          res['imgSrc'] = object.get('imgSrc');
          res['content'] = object.get('content');
          res['author'] = object.get('author');

          res['date'] = object.createdAt;
          if (object.get('like') == undefined || object.get('like').length == 0) {
            res['like'] = [];
            res['likeImg'] = "../../images/like2.png";
          } else {
            res['like'] = object.get('like');
            for (let i = 0; i < res['like'].length; i++) {
              if (newOpenid == object.get('like')[i]) {
                res['likeImg'] = "../../images/like1.png";
              } else {
                res['likeImg'] = "../../images/like2.png";
              }
            }
          }
          if (object.get('msg') == undefined || object.get('msg').length == 0) {
            res['msg'] = [];
          } else {
            res['msg'] = object.get('msg');
          }

          queryData.push(res);
        }
        _this.setData({
          list: queryData
        })
      },
      error(error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },
  //页面滑动效果
  pageMove(e){
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    })

    this.animation = animation

   let moveY=e.touches[0].clientY;
   let isY = moveY - startY
   if (isY>0){
     animation.bottom(20).step()
   }else{
     animation.bottom(-80).step()
   }
   this.setData({
     animationData: animation.export()
   })

  },
  //记录初始坐标
  pageStat(e){
    startY=e.touches[0].clientY
  },
  //点赞
  likeEvent(e){ 
    let index = e.currentTarget.dataset.index;
    let openid = this.data.openid;
    let likeArr = this.data.list[index].like;
    let list = this.data.list;

    let _this=this
    let subscript = likeArr.indexOf(openid)
    if (subscript >= 0 ){
      list[index].like.splice(subscript,1);
      likeArr.splice(subscript, 1)
      list[index].likeImg = "../../images/like2.png";
      wx.showToast({
        title: '点赞取消',
        icon: 'success',
        duration: 1000
      })
    }else{
      list[index].like.push(openid);
      list[index].likeImg = "../../images/like1.png";
      wx.showToast({
        title: '点赞成功',
        icon: 'success',
        duration: 1000
      })
    }
    query.get(this.data.list[index].id, {
      success: function (result) {
        // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
        result.set('like', likeArr);
        result.save();
        _this.setData({
          list: list
        })
      },
      error: function (object, error) {
        console.log("点赞失败")
      }
    });
  },
  articleEvent(e){
    let data = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../MsgArticle/MsgArticle?id=' + data
    })
  },
  replyEvent(e){
    let data = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../replyMsg/replyMsg?id=' + data
    })
  }
})