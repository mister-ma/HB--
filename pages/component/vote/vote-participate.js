// pages/component/vote/vote-participate.js
const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voteInfo: {},
    articleContents: [],
    isIponeX: app.globalData.isIponeX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.checkNetwork();
    var _this = this;
    app.getSid(app.user.hbUserId, function (sid) {
      var voteId = options.voteId;
      var articleId = options.articleId;
      // 读取投票信息
      var url = app.constant.API_VOTE_DETAIL_LIST.replace(':VoteID', voteId);
      app.util.request(url, {}, 'GET', result => {
        if (result.errorCode == 10000) {
          var data = result.result;
          // 设置导航标题
          if (data.VoteInfo.Title) {
            wx.setNavigationBarTitle({
              title: data.VoteInfo.Title
            });
          }
          _this.setData({
            voteInfo: data.VoteInfo
          });
        }
      });
      // 读取海选中对应的文章的内容
      if (articleId) {
        var url = app.constant.API_WX_ARTICLE_DETAIL.replace(':ArticleID', articleId);
        app.util.request(url, {}, 'GET', result => {
          if (result.errorCode == 10000) {
            var data = result.result;
            _this.setData({
              articleContents: data.Contents
            });
          }
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.util.checkNetwork();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.voteInfo.Title,
      imageUrl: this.data.voteInfo.Picture,
    }
  },

  /**
   * 我要参与
   */
  onGotoUploadPicture: function (e) {
    app.saveFormId(e.detail.formId);
    var url = '/pages/component/vote/vote-participate-list?voteId=' + this.data.voteInfo.VoteID + '&title=' + encodeURIComponent(this.data.voteInfo.Title) + '&flag=' +this.data.voteInfo.VoteFlag;
    wx.redirectTo({
      url: url,
    })
  }
})