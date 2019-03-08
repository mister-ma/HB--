// pages/component/index/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voteList: [],
    nextCursor: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.checkNetwork();
    var _this = this;
    app.loginLoad(() => {
      _this.loadVoteList();
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.util.checkNetwork();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.util.checkNetwork();
    this.loadVoteList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this;
    if (_this.data.nextCursor) {
      _this.loadVoteList(_this.data.nextCursor);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '街拍-发现穿衣搭配灵感'
    }
  },

  /**
   * 加载投票列表数据
   */
  loadVoteList: function (nextCursor = null) {
    var _this = this;
    var url = app.constant.API_VOTE_LIST;
    if (nextCursor) {
      url += '&nextCursor=' + nextCursor
    }
    app.util.request(url, {}, 'GET', result => {
      var data = result.result.list;
      if (result.errorCode == 10000) {
        var newVoteList = nextCursor != null ? this.data.voteList : [];
        data.forEach((item, index) => {
          item.VoteFlagName = _this._voteFlag(item.VoteFlag);
          newVoteList.push(item);
        });
        _this.setData({
          loading: false,
          voteList: newVoteList,
          nextCursor: result.result.hasOwnProperty('nextCursor') ? result.result.nextCursor : null
        });
      } else {
        app.util.showErrorModal(result.errorMsg, '接口错误');
      }
    }, result => {
      app.util.showErrorModal('接口错误', '接口错误');
    });
  },

  /**
   * 投票状态
   */
  _voteFlag: function (flag) {
    var flagObject = {
      1: '投票进行中',
      2: '投票海选中',
      3: '投票海选结束',
      4: '投票已结束'
    };
    return flagObject[flag];
  },

  /**
   * 投票列表点击事件
   */
  onVoteItemTap: function (e) {
    var voteId = e.currentTarget.dataset.voteid;
    var articleId = e.currentTarget.dataset.articleid;
    var voteFlag = e.currentTarget.dataset.voteflag;
    this.redirectPage(voteId, voteFlag, articleId);
  },

  redirectPage: function (voteId, voteFlag, articleId = null) {
    var url;
    // 投票进行中（决赛中）
    if (voteFlag == 1) {
      url = '/pages/component/vote/vote-progress?voteId=' + voteId
    }
    // 投票海选中、投票海选结束
    if (voteFlag == 2 || voteFlag == 3) {
      url = '/pages/component/vote/vote-participate?voteId=' + voteId + '&articleId=' + articleId
    }
    // 投票已结束
    if (voteFlag == 4) {
      url = '/pages/component/vote/vote-end?voteId=' + voteId
    }
    wx.navigateTo({
      url: url,
    });
  }

})