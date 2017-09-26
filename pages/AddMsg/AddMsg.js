// pages/AddMsg/AddMsg.js
var Bmob = require('../../utils/bmob.js')

var Diary = Bmob.Object.extend("_User");
var query = new Bmob.Query(Diary);

var uploadImg = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    userPic: '',
    res: {},
    uploadImg: [],
    openid:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
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
          openid: newOpenid
        })
      },
      error(error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

  },
  addImg() {
    let _this = this
    if (uploadImg.length <= 3) {
      wx.chooseImage({
        count: 3, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

          for (let i = 0; i < res.tempFilePaths.length; i++) {
            uploadImg.push(res.tempFilePaths[i])
          }
          _this.setData({
            uploadImg: uploadImg,
            res: res,
          })
        }
      })
    } else {
      wx.showToast({
        title: '最多添加3张',
        icon: 'loading',
      })
    }
  },
  deleteImg(e) {
    let id = e.currentTarget.dataset.id;
    let index = uploadImg.indexOf(id)
    uploadImg.splice(index, 1)
    this.setData({
      uploadImg: uploadImg,
    })
  },
  formSubmit(e) {
    let title = e.detail.value.title;
    let content = e.detail.value.content;
    let _this=this;
    if (title == "") {
      wx.redirectTo({
        title: '标题不能为空',
        icon: 'loading',
        duration: 2000
      })
      return
    }
    if (content == "") {
      wx.redirectTo({
        title: '内容不能为空',
        icon: 'loading',
        duration: 2000
      })
      return
    }

  
    wx.showLoading({
      title: '正在拼命提交中',
    })
    
    var urlArr = new Array();
    var res = _this.data.res;
    var Diary = Bmob.Object.extend("msg");
    var diary = new Diary();

    console.log(uploadImg.length)
    console.log(uploadImg)

    if (uploadImg.length <= 0) {
      diary.set("title", title);
      diary.set("content", content);
      diary.set("author", _this.data.nickName);
      diary.set("userPic", _this.data.userPic);
      diary.set("openid", _this.data.openid);

      //添加数据，第一个入口参数是null
      diary.save(null, {
        success: function (result) {
          wx.hideLoading()
          _this.setData({
            nickName: '',
            userPic: '',
            res: {},
            uploadImg: [],
            openid: ''
          })
          uploadImg = [];
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000,
            success() {
              setTimeout(function () {
                wx.redirectTo({
                  url: '../MsgList/MsgList'
                })
              },1000)
            }
          })

          

        },
        error: function (result, error) {
          // 添加失败
          wx.hideLoading()
          wx.showToast({
            title: '发布失败',
            icon: 'success',
            duration: 2000,
            success() {
              setTimeout(function () {
                wx.redirectTo({
                  url: '../MsgList/MsgList'
                })
              }, 1000)
            }
          })

        }
      });

      return;
    }

    var tempFilePaths = res.tempFilePaths;
    var imgLength = tempFilePaths.length;
    if (imgLength > 0) {
      var newDate = new Date();
      var newDateStr = newDate.toLocaleDateString();

      var j = 0;
      //如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
      for (var i = 0; i < imgLength; i++) {
        var tempFilePath = [tempFilePaths[i]];
        var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
        if (extension) {
          extension = extension[1].toLowerCase();
        }
        var name = newDateStr + "." + extension;//上传的图片的别名      

        var file = new Bmob.File(name, tempFilePath);
        file.save().then(function (res) {
          wx.hideNavigationBarLoading()
          var url = res.url();
          console.log("第" + i + "张Url" + url);

          urlArr.push({ "url": url });
          j++;
          
          if (uploadImg.length == j){
            diary.set("title", title);
            diary.set("content", content);
            diary.set("author", _this.data.nickName);
            diary.set("userPic", _this.data.userPic);
            diary.set("imgSrc", urlArr);
            diary.set("openid", _this.data.openid);

            //添加数据，第一个入口参数是null
            diary.save(null, {
              success: function (result) {
                wx.hideLoading()

                _this.setData({
                  nickName: '',
                  userPic: '',
                  res: {},
                  uploadImg: [],
                  openid: ''
                })
                uploadImg = [];


                wx.showToast({
                  title: '发布成功',
                  icon: 'success',
                  duration: 2000,
                  success(){
                    setTimeout(function () {
                      wx.navigateBack({
                        url: '../MsgList/MsgList'
                      })
                    }, 1000)
                  }
                })

              },
              error: function (result, error) {
                // 添加失败
                wx.showToast({
                  title: '发布失败',
                  icon: 'success',
                  duration: 2000,
                  success() {
                    setTimeout(function () {
                      wx.navigateBack({
                        url: '../MsgList/MsgList'
                      })
                    })
                  }
                }, 1000)

              }
            });
          }


        }, function (error) {
          console.log(error)
        });

      }
    }

  },
})