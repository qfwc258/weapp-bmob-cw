//index.js
//获取应用实例
var app = getApp();
var Bmob = require('../../utils/bmob.js')

var Article = Bmob.Object.extend("article");
var u = new Bmob.Query(Article);
// 查询所有数据

Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    list1: [],
    list2: []
  },
  onLoad(){
    var _this=this
    var cloudData = {
      list1: [],
      list2: []
    };

    u.find({
      success(results) {
        // 循环处理查询到的数据
        for (let i = 0; i < results.length; i++) {
          let object = results[i];
          let res = {}
          res['id'] = object.id;
          res['title'] = object.get('title');
          res['imgSrc'] = object.get('imgSrc');
          res['description'] = object.get('description');
          res['article'] = object.get('article');
          res['tips'] = object.get('tips');
          res['createdAt'] = object.createdAt;
          res['updatedAt'] = object.updatedAt;
          switch (object.get('type')) {
            case "1":
              cloudData.list1.push(res)
              break;
            case "2":
              cloudData.list2.push(res)

              break;
            default:
              break;
          }
        }

        _this.setData({
          list1: cloudData.list1,
          list2: cloudData.list2,
        })

      },
      error(error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })
  },
  hrefLink(e) {
    let data = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../article/article?id='+data
    })
  }
})
