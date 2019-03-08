const app = getApp();

Page({
  /**
  * 页面的初始数据
  */
  data: {
    loading: true,
    userInfo: app.user,
    shareBannerPic: [],
    praiseInfo: [{ Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' }],
    praiseCount: null,
    allPraiseCount: null,
    typeId: '',
    myCode: [],
    shareLtPicture: '',
    showShareDialog: false,
    saveImageToAlbumFinish: false,
    originalUserId: '',
    originalUserInfo: [],
    praiseOriginalInfo: [{ Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' },
    { Avatar: '../../../images/user-default-author.png' }],
    praiseOriginalCount: '',
    activityShow: true,
    isParised: false,
    isIphone: app.globalData.isIponeX,
    isFullPraise: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var padL = 0;
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        var winW = res.windowWidth;
        var rpx = 750 / winW;
        padL = winW - 690 / rpx;
        _this.setData({
          padL: padL / 2
        })
      },
    })
    app.util.checkNetwork();
    var _this = this;
    var typeId = (options.Type != undefined) ? options.Type : 1;
    var originalUserId = options.originalUserId;
    if (originalUserId && !app.user.openId || !app.user.openId) {
      app.getUser(() => {
        _this.loadUserCenter(typeId, originalUserId);
      });
    } else {
      _this.data.loading && _this.userInfo == undefined ? _this.loadUserCenter(typeId, originalUserId) : null;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.util.checkNetwork();
  },

  /**
   * 加载我的信息
   */
  loadUserCenter: function (typeId, originalUserId = null) {
    var _this = this;
    var url = app.constant.API_WX_USER_CENTER.replace(':Type', typeId);
    if (originalUserId) {
      url = url + '&originalUserId=' + originalUserId;
    }
    app.util.request(url + '&UserID=' + app.user.ltUserId, {}, 'GET', result => {
      if (result.errorCode == 10000) {
        var data = result.result;
        var bannerPic = [];
        data.ShareBannerPic.forEach((item, index) => {
            bannerPic.push(item);
          }
        );
        if (originalUserId) {
          //  替换头像
          data.PraiseOriginalInfo.forEach(function (item, index) {
            _this.data.praiseOriginalInfo[index] = item;
          });
          if (data.PraiseOriginalCount >= 10) {
            _this.setData({
              isFullParise: true,
            });
          }
          _this.setData({
            userInfo: app.user,
            shareBannerPic: bannerPic,
            allPraiseCount: data.AllPraiseCount + 1900,
            typeId: typeId,
            originalUserId: data.OriginalUserInfo.UserID,
            originalUserInfo: data.OriginalUserInfo,
            praiseOriginalInfo: _this.data.praiseOriginalInfo,
            praiseOriginalCount: data.PraiseOriginalCount,
            isParised: data.IsPriase,
          });
        }
      } else {
        app.util.showErrorModal(result.errorMsg, '接口错误');
      }
    }, result => {
      app.util.showErrorModal('接口错误，请重试。', '接口错误');
    });
  },

  /**
   * 点赞用户
   */
  onPraiseTap: function (event) {
    var _this = this;
    var typeId = event.currentTarget.dataset.userid;//被点赞者
    var url = app.constant.API_WX_PRAISE;
    app.util.request(url, {
      UserID: app.user.ltUserId,//当前授权用户
      TypeID: typeId,//被点赞者
      Type: 1
    }, 'POST', result => {
      if (result.errorCode == 10000) {
        wx.showToast({
          title: '点赞成功！',
          icon: 'success'
        });
        //  替换头像
        var praiseCount = _this.data.praiseOriginalCount;
        _this.data.praiseOriginalInfo[praiseCount] = { 'Avatar': app.user.avatarUrl };
        _this.setData({
          isParised: true,
          //替换头像
          praiseOriginalInfo: _this.data.praiseOriginalInfo,
          praiseOriginalCount: praiseCount + 1
        });
      }
    });
  },

  //  点击活动说明
  onaActivityShow: function () {
    var activityShow = this.data.activityShow;
    this.setData({
      activityShow: !activityShow
    });

  },

  //回首页
  onGoToHome: function(e){
    wx.reLaunch({
      url: '/pages/component/index/index',
    })
  },
  
  //回品牌介绍
  onGoToBrand: function (e) {
    wx.reLaunch({
      url: '/pages/component/introduce/purchase-channel',
    })
  },

  //回为你推荐
  onGoToRecommend: function (e) {
    wx.reLaunch({
      url: '/pages/component/recommend/recommend-index',
    })
  },

   /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    var _this = this;
    app.util.checkNetwork();
    this.loadUserCenter(_this.data.typeId, _this.data.originalUserId);
    wx.stopPullDownRefresh();
  },
})