// pages/userList/userList.js
var Bmob = require('../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let newOpenid = wx.getStorageSync('openid');
    let queryData = [];
    let _this = this;

    var Diary = Bmob.Object.extend("msg");
    var query = new Bmob.Query(Diary);
    query.equalTo("openid", newOpenid);
    // 查询所有数据
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
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
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  }
})