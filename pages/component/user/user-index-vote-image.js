// pages/component/user/user-index-vote-image.js
const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voteId: '',
    pictureList: [],
    shareVotePicture: '',
    saveImageToAlbumFinish: false,
    boxHeight: 603,
    opacity: false,
    swiperCur: 0,
    PreFileID: true,
    NextFileID: true,
    isIponeX: app.globalData.isIponeX,
    isShare: true,
    shareTimeLine: false
  },
  /**
   * 定时器
   */
  timer: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.checkNetwork();
    var _this = this;
    var pictureList = app.globalData.userIndexVotePictures[options.voteid];
    var index = options.index;

    if (index == 0) {
      _this.data.PreFileID = false;
    }
    if (index == (pictureList.length - 1)) {
      _this.data.NextFileID = false;
    }
    _this.setData({
      voteId: options.voteid,
      pictureList: pictureList,
      voteFlag: app.globalData.userIndexVoteFlag[options.voteid],
      swiperCur: index,
      PreFileID: _this.data.PreFileID,
      NextFileID: _this.data.NextFileID
    });

    var newH = 0;
    wx.getSystemInfo({
      success: function (res) {
        newH = res.windowHeight - 50;
        if (_this.data.isIponeX) {
          newH = newH - 15;
        }
        _this.setData({
          boxHeight: newH
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.util.checkNetwork();
  },

  /**
   * 当swiper滑动时
   */
  onSwiperChange: function (e) {
    var index = e.detail.current;
    var length = this.data.pictureList.length;
    var _this = this;

    if (index == 0) {
      _this.data.PreFileID = false;
    } else {
      _this.data.PreFileID = true;
    }

    if (index == (length - 1)) {
      _this.data.NextFileID = false;
    } else {
      _this.data.NextFileID = true;
    }
    this.setData({
      PreFileID: _this.data.PreFileID,
      NextFileID: _this.data.NextFileID,
      swiperCur: index,
      opacity: false
    });
  },

  /**
   * 点击左箭头时
   */
  onChangePrevPicture: function () {
    var curIndex = Number(this.data.swiperCur);
    this.setData({
      swiperCur: curIndex - 1
    });
  },

  /**
   * 点击右箭头时
   */
  onChangeNextPicture: function () {
    var curIndex = Number(this.data.swiperCur);
    this.setData({
      swiperCur: curIndex + 1
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
   * 用户点击右上角分享
   */
  // onShareAppMessage: function (e) {
  //   var _this = this;
  //   if (e.from === 'button') { }
  //   return {
  //     title: '我参与了街拍发起的投票活动，快来帮我投一票！',
  //     path: 'pages/component/vote/vote-image?voteid=' + _this.data.voteId + '&fileid=' + _this.data.pictureList[_this.data.swiperCur].FileID,
  //     imageUrl: _this.data.pictureList[_this.data.swiperCur].Picture,
  //   }
  // },

  /**
   * 分享到朋友圈
   */
  onShareToTimeline: function (e) {
    var _this = this;
    app.saveFormId(e.detail.formId);
    var nickName = app.user.nickName;
    var voteId = _this.data.voteId;
    var fileId = _this.data.pictureList[_this.data.swiperCur].FileID;
    var url = app.constant.API_SHARE_VOTE_PICTURE.replace(':VoteID', voteId).replace(':FileID', fileId) + '&NickName=' + encodeURIComponent(nickName);
    wx.downloadFile({
      url: url,
      success: function (result) {
        if (result.statusCode == 200) {
          var filePath = result.tempFilePath;
          _this.setData({
            shareVotePicture: filePath,
            shareTimeLine: true
          });
          wx.saveImageToPhotosAlbum({
            filePath: filePath,
            success: () => {
              _this.setData({
                saveImageToAlbumFinish: true
              });
            }
          });
        }
      }
    });
  },

  // 点击图片描述的删除按钮时
  onSliderChaTap: function (e) {
    this.setData({
      opacity: true
    });
  },

  //  点击分享图片的cha
  onShareChaTap: function () {
    this.setData({
      shareTimeLine: false
    });
  }
})