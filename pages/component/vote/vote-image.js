// pages/component/vote/vote-image.js
const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pictureList: [],
    shareVotePicture: '',
    showShareDialog: false,
    saveImageToAlbumFinish: false,
    boxHeight: 1206,
    opacity: false,
    swiperCur: 0,
    PreFileID: false,
    NextFileID: false,
    isIponeX: app.globalData.isIponeX,
    isShare: true,
    shareTimeLine: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.checkNetwork();
    var _this = this;
    // 从海选列表中点击进入
    //if (JSON.stringify(app.globalData.voteParticipateList) != "{}") {
    if (options.from == undefined || (options.from && options.from != 'share')) {
      var pictureList = app.globalData.voteParticipateList[options.voteid];
      var voteId = app.globalData.voteParticipateList[options.voteid];
      var fileId = options.fileid;
      var index = options.index;
      if (index == 0) {
        _this.data.PreFileID = false;
      } else {
        _this.data.PreFileID = true;
      }
      if (index == (pictureList.length - 1)) {
        _this.data.NextFileID = false;
      } else {
        _this.data.NextFileID = true;
      }
      _this.setData({
        voteId: options.voteid,
        fileId: options.fileid,
        pictureList: pictureList,
        swiperCur: index,
        PreFileID: _this.data.PreFileID,
        NextFileID: _this.data.NextFileID
      });
    } else {
      // 分享给好友后直接点击进入投票图片页
      app.getSid(app.user.hbUserId, function (sid) {
        var url = app.constant.API_VOTE_PICTURE_DETAIL.replace(':VoteID', options.voteid).replace(':FileID', options.fileid);
        app.util.request(url + '&Sid=' + sid, {}, 'GET', result => {
          if (result.errorCode == 10000) {
            var data = result.result;
            var picList = [];
            picList.push({
              FileID: options.fileid,
              Picture: data.PictureInfo.Picture,
              VoteDetailID: data.PictureInfo.VoteDetailID,
              FileDescription: data.PictureInfo.FileDescription,
              Flag: data.PictureInfo.Flag,
              VoteRank: data.PictureInfo.VoteRank,
              VotePraiseCount: data.PictureInfo.VotePraiseCount,
              IsVotePraise: data.PictureInfo.IsPraise,
            });

            _this.data.PreFileID = false;
            _this.data.NextFileID = false;
            _this.setData({
              voteId: options.voteid,
              fileId: options.fileid,
              pictureList: picList,
              PreFileID: _this.data.PreFileID,
              NextFileID: _this.data.NextFileID
            });
          }
        });
      });
    }
    var newH = this.data.boxHeight;
    wx.getSystemInfo({
      success: function (result) {
        newH = result.windowHeight - 50;
        if (_this.data.isIponeX) {
          newH = newH - 15;
        }
        _this.setData({
          boxHeight: newH
        });
      },
    });
    
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
    //  if(this.timer){
    //    clearTimeout(this.timer);
    //  }
    //  this.timer = setTimeout(function(){
    //    _this.setData({
    //      opacity:false
    //    })
    //  },100);
  },

  /**
   * 点击左箭头时
   */
  onChangePrevPicture: function () {
    var _this = this;
    var curIndex = Number(this.data.swiperCur);
    this.setData({
      swiperCur: curIndex - 1,
      fileId: _this.data.pictureList[curIndex - 1].FileID
    });
  },

  /**
   * 点击右箭头时
   */
  onChangeNextPicture: function () {
    var _this = this;
    var curIndex = Number(this.data.swiperCur);
    this.setData({
      swiperCur: curIndex + 1,
      fileId: _this.data.pictureList[curIndex + 1].FileID
    });
  },

  /**
   * 重新上传图片
   */
  onReChooseImage: function (e) {
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 1,
      success: ((result) => {
        wx.showLoading({
          title: '图片加载中...',
        });
        wx.redirectTo({
          url: '/pages/component/vote/vote-upload-image?voteId=' + _this.data.voteInfo[VoteID] + 'imageUrl=' + encodeURIComponent(result.tempFilePaths[0]),
        });
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    if (e.from === 'button') { }
    return {
      title: '我参与了街拍发起的投票活动，快来帮我投一票！'
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareToTimeline: function (e) {
    var _this = this;
    app.saveFormId(e.detail.formId);
    var nickName = app.user.nickName;
    var fileId = _this.data.pictureList[_this.data.swiperCur].FileID;
    var url = app.constant.API_SHARE_VOTE_PICTURE.replace(':VoteID', _this.data.voteId).replace(':FileID', fileId) + '&NickName=' + encodeURIComponent(nickName);

    wx.downloadFile({
      url: url,
      success: function (result) {
        if (result.statusCode == 200) {
          var filePath = result.tempFilePath;
          _this.setData({
            shareVotePicture: filePath,
            showShareDialog: true
          });
          wx.saveImageToPhotosAlbum({
            filePath: filePath,
            success: () => {
              saveImageToAlbumFinish: true
            }
          });
        }
      }
    });
  },

  /**
   * 投票图片点赞
   */
  onPraisePicture: function (e) {
    var _this = this;

    app.getSid(app.user.hbUserId, (sid) => {
      app.util.request(app.constant.API_VOTE_PICTURE_PRAISE + '&Sid=' + sid, {
        VoteID: _this.data.voteId,
        FileID: _this.data.fileId,
        Type: _this.data.pictureList[_this.data.swiperCur].IsPraise ? 0 : 1,
      }, 'POST', result => {
        if (result.errorCode == 10000) {
          _this.data.pictureList[_this.data.swiperCur].IsVotePraise = 1;
          _this.data.pictureList[_this.data.swiperCur].VotePraiseCount += 1;
          _this.setData({
            pictureList: _this.data.pictureList
          });
          app.globalData.voteParticipateList[_this.data.voteId][_this.data.swiperCur].IsVotePraise = 1;
        }
      });
    });
  },

  /**
   * 关闭分享到朋友圈弹层
   */
  onCloseShareDialog: function () {
    this.setData({
      showShareDialog: false
    });
  },

  // 点击图片描述的删除按钮时
  onSliderChaTap: function (e) {
    this.setData({
      opacity: true
    });
  },

})