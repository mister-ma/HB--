// pages/component/index/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    articleList: [],
    nextCursor: null,
    wHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var wHeight = 0;
    var _this = this;
    app.util.checkNetwork();
    wx.getSystemInfo({
      success: function (res) {
        wHeight = res.windowHeight;
        _this.setData({
          wHeight: wHeight
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    app.util.checkNetwork();
    if (!app.user.openId) {
      app.getUser(() => {
        _this.loadArticleList();
      });
    } else {
      _this.data.loading && _this.articleList == undefined ? _this.loadArticleList() : null;
    }
  },

  /**
   * 加载文章列表
   */
  loadArticleList: function (nextCursor = null) {
    var _this = this;
    var url = app.constant.API_WX_ARTICLE_LIST;
    if (nextCursor != null) {
      url += '&cursor=' + nextCursor
    }
    app.util.request(url, {}, 'GET', result => {
      var data = result.result.list;
      if (result.errorCode == 10000) {
        var newArticleList = nextCursor != null ? this.data.articleList : [];

        // 不能在小程序文章详情中显示的内容
        var notList = [3, 4, 5, 6, 7, 8, 9, 10, 109, 110];
        data.forEach((item, index) => {
          if (item.ArticleID == undefined || notList.indexOf(item.Type) != -1) {
            return true;
          }
          if (item.Comments && item.Comments.length == 0) {
            item.Comments = null;
          }
          newArticleList.push(item);
        });

        _this.setData({
          loading: false,
          articleList: newArticleList,
          nextCursor: result.result.hasOwnProperty('nextCursor') ? result.result.nextCursor : null
        });
      } else {
        app.util.showErrorModal(result.errorMsg, '接口错误');
      }
    });
  },

  /**
   * 街拍文章列表点击事件
   */
  onArticleItemTap: function (event) {
    var articleId = event.currentTarget.dataset.articleid;
    wx.navigateTo({
      url: '/pages/component/index/article-detail?articleId=' + articleId,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.util.checkNetwork();
    this.loadArticleList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadArticleList(this.data.nextCursor);
  },

  /**
   * 用户点击右上角分享 
   * */
  onShareAppMessage: function () {
    return {
      title: '这些街拍还不错，一起来看看',
      path: '/pages/component/index/index'
    }
  }
})