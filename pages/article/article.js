// pages/article/article.js

var app = getApp();
var Bmob = require('../../utils/bmob.js')

var Article = Bmob.Object.extend("article");
var u = new Bmob.Query(Article);

var cloudData={};


Page({
  /**
   * 页面的初始数据
   */
  data: {
    data:null,
    display:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(data) {
    var _this=this;
    u.get(data.id, {
      success: function (object) {
        // 查询成功，调用get方法获取对应属性的值
        let res = {};
        res['id'] = object.id;
        res['title'] = object.get('title');
        res['imgSrc'] = object.get('imgSrc');
        res['description'] = object.get('description');
        res['article'] = object.get('article');
        res['tips'] = object.get('tips');
        res['author'] = object.get('author');
        res['createdAt'] = object.createdAt;
        res['updatedAt'] = object.updatedAt;

        switch (object.get('type')) {
          case "2":
            _this.setData({
              data: res,
              display: false
            })
            break;
          default:
            _this.setData({
              data: res
            })
            break;
        }
      },
      error: function (object, error) {
        // 查询失败
        console.log("查询失败")
      }
    });

    console.log(this.data)

  }

})