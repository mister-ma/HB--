// pages/component/vote/vote-progress.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voteInfo: {},
    voteList: [],
    boxHeight: 1206,
    isOK: false,
    isIponeX: app.globalData.isIponeX
  },
  isFirst: true,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.checkNetwork();
    var _this = this;
    var voteId = options.voteId;

    app.getSid(app.user.hbUserId, function (sid) {
      // 读取投票信息
      var url = app.constant.API_VOTE_DETAIL_LIST.replace(':VoteID', voteId);
      app.util.request(url + '&Sid=' + sid, {}, 'GET', result => {
        if (result.errorCode == 10000) {
          var data = result.result;
          // 设置导航标题
          if (data.VoteInfo.Title) {
            wx.setNavigationBarTitle({
              title: data.VoteInfo.Title
            });
          }
          _this.setData({
            voteInfo: data.VoteInfo,
            voteList: data.list,
            isOK: true
          });
        }
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.util.checkNetwork();
  },

  /**
   *页面滚动函数
   */
  onPageScroll: function () {
    var _this = this;
    if (_this.isFirst) {
      let height = this.data.boxHeight;
      wx.createSelectorQuery().select(".page-body").boundingClientRect(function (rect) {
        height = (rect.height) * 2 + 1;
        _this.setData({
          boxHeight: height
        });
      }).exec();
      _this.isFirst = false;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '街拍-发现穿衣搭配灵感',
    }
  },

})