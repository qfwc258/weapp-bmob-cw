// pages/replyMsg/replyMsg.js
var util = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    userPic: '',
    openid: '',
    objectId :'',
    replayName:'',
    delta:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
    console.log(getCurrentPages())
    
    let _this = this
    let Diary = Bmob.Object.extend("_User");
    let query = new Bmob.Query(Diary);

    let objectId = options.id;
    let replayName;
    if (options.replayName == undefined || options.replayName == "" ){
      replayName = "";
    }else{
      replayName ='@'+options.replayName;
    }

    let newOpenid = wx.getStorageSync('openid')
    query.equalTo("openid", newOpenid);
    // 查询所有数据
    query.find({
      success(results) {
        let nickName, userPic;
        for (let i = 0; i < results.length; i++) {
          let object = results[i];
          nickName = object.get('nickName');
          userPic = object.get('userPic');
        }
        _this.setData({
          nickName: nickName,
          userPic: userPic,
          openid: newOpenid,
          objectId: objectId,
          replayName: replayName
        })
      },
      error(error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },
  formSubmit(e) {
    let content = e.detail.value.content;
    let submitData = {}
    if (content == "") {
      wx.showToast({
        title: '内容不能为空',
        icon: 'loading',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '正在拼命提交中',
    })

    submitData['nickName'] = this.data.nickName;
    submitData['userPic'] = this.data.userPic;
    submitData['openid'] = this.data.openid;
    submitData['content'] = { 'content': content, 'name': this.data.replayName};
    submitData['like'] = [];
    submitData['createAt'] = util.formatTime(new Date)

    let Diary = Bmob.Object.extend("msg");
    var query = new Bmob.Query(Diary);
    

    query.get(this.data.objectId, {
      success: function (result) {
        // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
        result.add("msg", submitData);
        result.save();
        wx.hideLoading()
        wx.showToast({
          title: '回复成功',
          icon: 'success',
          duration: 2000,
          success() {
            setTimeout(function () {
              wx.navigateBack({
                delta: 0
              })
            },1000)
          }
        })
        // The object was retrieved successfully.
      },
      error: function (object, error) {

      }
    });

  }
})