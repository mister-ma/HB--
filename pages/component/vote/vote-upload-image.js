// pages/component/vote/vote-upload-image.js
const app = new getApp();

// 手机的宽度
var windowWRPX = 750
// 拖动时候的 pageX
var pageX = 0
// 拖动时候的 pageY
var pageY = 0
var pixelRatio = wx.getSystemInfoSync().pixelRatio
pixelRatio = 1

// 移动时 手势位移与 实际元素位移的比
var dragScaleP = 2

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIponeX: app.globalData.isIponeX,
    isFocus: false,
    voteId: '',
    imageSrc: '',
    showType: 0,
    // 初始化的宽高
    cropperInitW: windowWRPX,
    cropperInitH: windowWRPX,
    // 动态的宽高
    cropperW: windowWRPX,
    cropperH: windowWRPX,
    // 动态的left top值
    cropperL: 0,
    cropperT: 0,

    // 图片缩放值
    scaleP: 0,
    imageW: 0,
    imageH: 0,

    // 裁剪框 宽高
    cutW: 0,
    cutH: 0,
    cutL: 0,
    cutT: 0,
    innerAspectRadio: 1,
    description: '',

    //手机设备宽高
    winW: 0,
    winH: 0,
    winRadio: 1,
    // 图片缩放值
    imgNewW: 0,
    imgNewH: 0,

    // 裁剪完的图片宽高
    imgClipW: 0,
    imgClipH: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.checkNetwork();
    var _this = this;
    _this.setData({
      voteId: options.voteId,
      imageSrc: decodeURIComponent(options.imageUrl),
      showType: 1
    });
    wx.getSystemInfo({
      success: function (res) {
        _this.data.winW = res.windowWidth;
        _this.data.winH = res.windowHeight;
        _this.setData({
          winW: _this.data.winW,
          winH: _this.data.winH,
          winRadio: _this.data.winW / (_this.data.winH - 50)
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.util.checkNetwork();
  },

  /**
   * 生命周期函数--监听页面初次渲染
   */
  onShow: function () {
    var _this = this;
    wx.getImageInfo({
      src: _this.data.imageSrc,
      success: function (result) {
        // 裁剪展示图片
        var winRadio = _this.data.winRadio;
        var imgRadio = result.width / result.height;
        var winW = _this.data.winW;
        var winH = _this.data.winH;
        if (imgRadio >= winRadio) {
          if (result.width > winW) {
            _this.data.imgNewW = winW;
            _this.data.imgNewH = winW / imgRadio;
          } else {
            _this.data.imgNewW = result.width;
            _this.data.imgNewH = result.height;
          }
        } else {
          if (result.height > (winH - 50)) {
            _this.data.imgNewW = (winH - 50) * imgRadio;
            _this.data.imgNewH = winH - 50;
          } else {
            _this.data.imgNewW = result.width;
            _this.data.imgNewH = result.height;
          }
        }
        _this.setData({
          imgNewW: _this.data.imgNewW,
          imgNewH: _this.data.imgNewH
        })
      }
    });
  },
  /**
   * 选择尺寸
   */
  chooseCropperSize: function () {
    var _this = this;
    _this.setData({
      imageSrc: _this.data.imageSrc,
      showType: 2
    });
  },

  /**
   * 确认选择尺寸
   */
  onChangeCropper: function (e) {
    var _this = this;
    var ratio = parseInt(e.currentTarget.dataset.sizetype);
    wx.getImageInfo({
      src: _this.data.imageSrc,
      success: function (result) {
        _this._convasImage(result.width, result.height);
        _this._confirmCropperSize(ratio);
        _this.setData({
          showType: 3,
        })
      }
    });
  },

  /**
   * 重新上传图片
   */
  onReChooseImage: function () {
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 1,
      success: ((result) => {
        wx.showLoading({
          title: '图片加载中...',
        });
        wx.redirectTo({
          url: '/pages/component/vote/vote-upload-image?voteId=' + this.data.voteId + '&imageUrl=' + encodeURIComponent(result.tempFilePaths[0]),
        });
      })
    })
  },

  /**
   * 拖动时候触发的touchStart事件
   */
  contentStartMove(e) {
    pageX = e.touches[0].pageX
    pageY = e.touches[0].pageY
  },

  /**
   * 拖动时候触发的touchMove事件
   */
  contentMoveing(e) {
    var _this = this
    var dragLengthX = (pageX - e.touches[0].pageX) * dragScaleP
    var dragLengthY = (pageY - e.touches[0].pageY) * dragScaleP
    var minX = Math.max(_this.data.cutL - (dragLengthX), 0)
    var minY = Math.max(_this.data.cutT - (dragLengthY), 0)
    var maxX = _this.data.cropperW - _this.data.cutW
    var maxY = _this.data.cropperH - _this.data.cutH
    this.setData({
      cutL: Math.min(maxX, minX),
      cutT: Math.min(maxY, minY),
    })
    pageX = e.touches[0].pageX
    pageY = e.touches[0].pageY
  },

  /**
   * 不需要剪裁直接确认上传图片
   */
  confirmImage: function () {
    var _this = this;
    _this.setData({
      imageSrc: _this.data.imageSrc,
      showType: 4
    });
  },

  /**
   * 确认图片
   */
  confirmCropperImage: function () {
    var _this = this
    wx.showLoading({
      title: '图片生成中...',
    });
    wx.getImageInfo({
      src: _this.data.imageSrc, //仅为示例，并非真实的资源
      success: function (result) {
        // 将图片写入画布
        const ctx = wx.createCanvasContext('myCanvas')
        ctx.drawImage(result.path)
        ctx.draw()
        // 获取画布要裁剪的位置和宽度   均为百分比 * 画布中图片的宽度    保证了在微信小程序中裁剪的图片模糊  位置不对的问题
        var canvasW = _this.data.cutW / _this.data.cropperW * _this.data.imageW / pixelRatio
        var canvasH = _this.data.cutH / _this.data.cropperH * _this.data.imageH / pixelRatio
        var canvasL = _this.data.cutL / _this.data.cropperW * _this.data.imageW / pixelRatio
        var canvasT = _this.data.cutT / _this.data.cropperH * _this.data.imageH / pixelRatio
        wx.canvasToTempFilePath({
          x: canvasL,
          y: canvasT,
          width: canvasW,
          height: canvasH,
          destWidth: canvasW,
          destHeight: canvasH,
          canvasId: 'myCanvas',
          fileType: 'jpg',
          success: function (res) {
            wx.hideLoading()
            _this.setData({
              imageSrc: res.tempFilePath,
              showType: 4
            });
          }
        })
      }
    })
  },

  bindDescriptionInput: function (e) {
    this.setData({
      description: e.detail.value
    });

  },

  _convasImage: function (width, height) {
    var _this = this
    var innerAspectRadio = width / height;

    // 根据图片的宽高显示不同的效果   保证图片可以正常显示
    if (innerAspectRadio >= 1) {
      _this.setData({
        cropperW: windowWRPX,
        cropperH: windowWRPX / innerAspectRadio,
        // 初始化left right
        cropperL: Math.ceil((windowWRPX - windowWRPX) / 2),
        cropperT: Math.ceil((windowWRPX - windowWRPX / innerAspectRadio) / 2),
        // 裁剪框  宽高
        cutW: windowWRPX / innerAspectRadio,
        cutH: windowWRPX / innerAspectRadio,
        cutL: 0,
        cutT: 0,
        // 图片缩放值
        scaleP: width * pixelRatio / windowWRPX,
        // 图片原始宽度 rpx
        imageW: width * pixelRatio,
        imageH: height * pixelRatio,
        innerAspectRadio: innerAspectRadio
      })
    } else {
      _this.setData({
        cropperW: windowWRPX * innerAspectRadio,
        cropperH: windowWRPX,
        // 初始化left right
        cropperL: Math.ceil((windowWRPX - windowWRPX * innerAspectRadio) / 2),
        cropperT: Math.ceil((windowWRPX - windowWRPX) / 2),
        // 裁剪框的宽高
        cutW: windowWRPX * innerAspectRadio,
        cutH: windowWRPX * innerAspectRadio,
        cutL: 0,
        cutT: 0,
        // 图片缩放值
        scaleP: width * pixelRatio / windowWRPX,
        // 图片原始宽度 rpx
        imageW: width * pixelRatio,
        imageH: height * pixelRatio,
        innerAspectRadio: innerAspectRadio
      })
    }
    wx.hideLoading()
  },

  _confirmCropperSize: function (ratio) {
    var _this = this;
    switch (parseInt(ratio)) {
      case 1:
        if (_this.data.innerAspectRadio >= 1) {
          _this.setData({
            cutW: windowWRPX / _this.data.innerAspectRadio * 2 / 3,
            cutH: windowWRPX / _this.data.innerAspectRadio,
            cutL: 0,
            cutT: 0,
          })
        } else {
          _this.setData({
            cutW: windowWRPX * _this.data.innerAspectRadio,
            cutH: windowWRPX * _this.data.innerAspectRadio * 3 / 2,
            cutL: 0,
            cutT: 0,
          })
        }
        break;
      case 2:
        if (_this.data.innerAspectRadio >= 1) {
          _this.setData({
            cutW: windowWRPX / _this.data.innerAspectRadio,
            cutH: windowWRPX / _this.data.innerAspectRadio,
            cutL: 0,
            cutT: 0,
          })
        } else {
          _this.setData({
            cutW: windowWRPX * _this.data.innerAspectRadio,
            cutH: windowWRPX * _this.data.innerAspectRadio,
            cutL: 0,
            cutT: 0,
          })
        }
        break;
      case 3:
        if (_this.data.innerAspectRadio >= 1) {
          _this.setData({
            cutW: windowWRPX / _this.data.innerAspectRadio * 3 / 2,
            cutH: windowWRPX / _this.data.innerAspectRadio,
            cutL: 0,
            cutT: 0,
          })
        } else {
          _this.setData({
            cutW: windowWRPX * _this.data.innerAspectRadio,
            cutH: windowWRPX * _this.data.innerAspectRadio * 2 / 3,
            cutL: 0,
            cutT: 0,
          })
        }
        break;
    }
  },

  /**
   * 上传图片
   */
  onUploadImage: function (e) {
    var _this = this
    app.saveFormId(e.detail.formId);
    var description = e.detail.value.description
    if (!description) {
      app.util.showErrorModal('填写描述', '提示');
      return
    }
    app.getSid(app.user.hbUserId, function (sid) {
      wx.uploadFile({
        url: app.constant.API_VOTE_UPLOAD,
        filePath: _this.data.imageSrc,
        name: 'Files[]',
        header: {
          'content-type': 'multipart/form-data',
          'sign': '00dba76dde6d2b3006e9b51139dddbe5'
        },
        formData: {
          'AlbumID': app.user.defaultAlbumId,
          'VoteID': _this.data.voteId,
          'Description': description,
          'Sid': sid
        },
        success: function (result) {
          var data = JSON.parse(result.data);
          if (data.errorCode == 10000) {
            wx.showToast({
              title: '图片上传成功！',
              icon: 'success'
            });
            _this.setData({
              showType: 5
            });
          } else {
            app.util.showErrorModal(data.errorMsg, '错误提示');
          }
        },
        fail: function (result) {
          app.util.showErrorModal('接口错误，请重试。', '接口错误');
        }
      })
    });
  },
  //  第四步textarea 获取焦点时
  onTextareaFocus: function (e) {
    var _this = this;
    _this.setData({
      isFocus: true
    });
  },
  //  第四步textarea 失去焦点时
  onTextareaBlur: function (e) {
    var _this = this;
    _this.setData({
      isFocus: false
    });
  },
  onGoIndex: function (e) {
    wx.switchTab({
      url: '/pages/component/index/index',
    })
  }
})