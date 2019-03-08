// pages/component/user/user-index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.user,
    voteList: [],
    nextCursor: null,
    votePictures: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.checkNetwork();
    var _this = this;
    _this.loadMyVoteList();
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
    this.loadMyVoteList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMyVoteList(this.data.nextCursor);
  },

  /**
   * 加载我参选的图片列表数据
   */
  loadMyVoteList: function (nextCursor = null) {
    var _this = this;
    if (app.user.hbUserId) {
      app.getSid(app.user.hbUserId, function (sid) {
        // var sid = '3649a1d4-82c7-3bdd-6c77-e260eb02e0b4';
        var url = app.constant.APP_LIST_OF_MINE + '&Sid=' + sid;
        app.util.request(url, {}, 'GET', result => {
          if (result.errorCode == 10000) {
            var data = result.result.list;
            // 投票列表数据
            var newVoteList = nextCursor != null ? this.data.voteList : [];
            // 投票内图片列表数据，用于点开浏览大图
            var votePictures = _this.data.votePictures;
            if (data) {
              data.forEach((item, index) => {
                item.VoteFlagName = _this._voteFlag(item.VoteFlag);
                item.ItemObject = JSON.stringify(item);
                app.globalData.userIndexVoteFlag[item.VoteID] = item.VoteFlag;
                newVoteList.push(item);
                var pictureList = [];
                item.PictureList.forEach((value, key) => {
                  item.PictureList[key].FlagName = _this._pictureFlag(value.Flag);
                  pictureList.push(value.Picture);
                })
                app.globalData.userIndexVotePictures[item.VoteID] = item.PictureList;
              });
            }
            _this.setData({
              userInfo: app.user,
              voteList: newVoteList
            });

          } else {
            app.util.showErrorModal(result.errorMsg, '接口错误');
          }
        }, result => {
          app.util.showErrorModal('接口错误，请重试。', '接口错误');
        });
      })
    }
  },

  /**
   * 预览大图事件
   */
  onVotePicture: function (e) {
    var _this = this;
    var voteId = e.currentTarget.dataset.voteid;
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/component/user/user-index-vote-image?from=share&voteid=' + voteId + '&index=' + index,
    })
  },

  /**
   * 点击当前活动跳转到vote-list页
   */
  onVoteList: function () {
    wx.switchTab({
      url: '/pages/component/vote/vote-list',
    });
  },

  onVoteTap: function (e) {
    var voteId = e.currentTarget.dataset.voteid;
    var voteFlag = e.currentTarget.dataset.voteflag;
    var articleId = e.currentTarget.dataset.articleid;
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
  },

  //  点击投票进行中的图片删除按钮
  onDeletePicture: function (e) {
    var _this = this;
    var findex = e.currentTarget.dataset.findex;
    var curIndex = e.currentTarget.dataset.index;
    var voteId = e.currentTarget.dataset.voteid;
    wx.showModal({
      title: '',
      content: '删除图片后，该图片将无法进行投票',
      confirmText: '删除',
      confirmColor: '#000',
      success: function (res) {
        if (res.confirm) { // 删除
          var contentId = _this.data.voteList[findex].PictureList[curIndex].ContentID;
          var albumId = _this.data.voteList[findex].PictureList[curIndex].AlbumID;
          app.getSid(app.user.hbUserId, function (sid) {
            // var sid = '3649a1d4-82c7-3bdd-6c77-e260eb02e0b4';
            var url = app.constant.APP_CANCEL_COLLECT_PICTURE + '&Sid=' + sid;
            app.util.request(url, {
              ContentIDList: contentId,
              AlbumID: albumId,
              Type: 0
            }, 'POST', result => {
              if (result.errorCode == 10000) {
                _this.data.voteList[findex].PictureList.splice(curIndex, 1);
                _this.data.votePictures[voteId].splice(curIndex, 1);
                _this.setData({
                  voteList: _this.data.voteList,
                  votePictures: _this.data.votePictures
                });
              }
            })
          })
        }
      }
    });

  },
  /**
   * 投票状态
   */
  _voteFlag: function (flag) {
    var flagObject = {
      1: '投票进行中',
      2: '投票海选中',
      3: '投票处理中',
      4: '投票已结束'
    };
    return flagObject[flag];
  },

  /**
   * 图片审核状态
   */
  _pictureFlag: function (flag) {
    var flagObject = {
      0: '审核通过',
      1: '待审核',
      2: '审核未通过'
    };
    return flagObject[flag];
  }

})