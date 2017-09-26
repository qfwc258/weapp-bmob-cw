// pages/figure/figure.js

var Bmob = require('../../utils/bmob.js')

var Article = Bmob.Object.extend("article");
var u = new Bmob.Query(Article);
var cloudData = [];


Page({
  data: {},
  onLoad() {
    var _this=this

    u.find({
      success(results) {
        // 循环处理查询到的数据
        for (let i = 0; i < results.length; i++) {
          let object = results[i];
          let res = {}
          if (object.get('type') == "3") {
            res['id'] = object.id;

            if (object.get('title').length >=8 ){
              res['title'] = object.get('title').substring(0,8)+'...' 
            }else{
              res['title'] = object.get('title')
            }
            res['imgSrc'] = object.get('imgSrc');
            res['tag'] = object.get('tag');
            res['article'] = object.get('article');
            res['createdAt'] = object.createdAt;
            res['updatedAt'] = object.updatedAt;
            cloudData.push(res)
          }
        }
        _this.setData({
          data: cloudData,
        })
      },
      error(error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })

    console.log(this.data)
    
  },
  hrefLink(e) {
    let data = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../Varticle/Varticle?id=' + data
    })
  }
})