// pages/component/index/article-detail.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleType: '',
    articleId: '',
    author: {},
    articleTitle: '',
    picture: '',
    articleContent: {},
    createTime: '',
    currentUserId: app.user.hbUserId,
    comments: {},
    shareArticlePicture: '',
    commentPictures: {},
    articlePictures: [],
    dataReady: false,
    isIponeX: app.globalData.isIponeX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    app.util.checkNetwork();
    var articleId = options.articleId;
    var url = app.constant.API_WX_ARTICLE_DETAIL.replace(':ArticleID', articleId);
    wx.showLoading({
      title: '加载中...',
    });

    app.getSid(app.user.hbUserId, function (sid) {
      app.util.request(url + '&Sid=' + sid, {}, 'GET', result => {
        if (result.errorCode == 10000) {
          var data = result.result;
          var timeSplit = data.CreateTime.split('-');
          var content = data.Contents;

          // 设置导航标题
          if (data.Column.Name) {
            wx.setNavigationBarTitle({
              title: data.Column.Name,
            });
          }

          // 格式化评论时间、组织预览大图需要的数据结构
          var commentPictures = {};
          data.Comments.map((item, key) => {
            var timeArr = item.CreateTime.substr(0, 10).split('-');
            data.Comments[key].CreateTime = timeArr[0] + '年' + timeArr[1] + '月' + timeArr[2] + '日';

            var pictureList = [];
            item.Pictures.forEach(value => {
              pictureList.push(value.Picture);
            })
            if (pictureList.length) {
              commentPictures[item.CommentID] = pictureList;
            }
          });
          var pictureList = []; 
          data.Contents.forEach(value => {
            if ((value.Type == 4 || value.Type == 7 || value.Type == 18) && value.Picture) {
              pictureList.push(value.Picture);
            }
          });
          _this.setData({
            articleType: data.Type,
            author: data.Author,
            articleId: data.ArticleID,
            articleTitle: data.Title,
            picture: data.Picture,
            articleContent: data.Contents,
            createTime: timeSplit[0] + '年' + timeSplit[1] + '月',
            comments: data.Comments,
            articleInfo: data,
            commentPictures: commentPictures,
            dataReady: true,
            articlePictures: pictureList
          });
        } else {
          app.util.showErrorModal(result.errorMsg, '接口错误');
        }
      }, result => {
        app.util.showErrorModal('接口错误，请重试。', '接口错误');
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.util.checkNetwork();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.articleTitle,
      imageUrl: this.data.picture
    }
  },

  onPraiseComment: function (e) {
    var _this = this;
    var commentId = e.currentTarget.dataset.commentid.toString();
    var praiseCommentList = wx.getStorageSync('article_praise_comment_list').split(',');
    if (praiseCommentList.indexOf(commentId) != -1) {
      return false;
    }
    app.getSid(app.user.hbUserId, function (sid) {
      app.util.request(app.constant.API_WX_ARTICLE_COMMENT_PRAISE, {
        CommentIDList: commentId,
        Sid: sid,
        Type: 1,  // 0-取消点赞 1-点赞
        CommentType: 1, // 1-评论 2-回复
        ContentType: 1  // 1-文章 2-图片 3-相册 4-投票
      }, 'POST', result => {
        if (result.errorCode == 10000) {
          // 重置点赞数和点赞状态
          _this.data.comments.map((item, key) => {
            if (item.CommentID == commentId) {
              if (_this.data.comments[key].Statistic.PraiseNum != undefined) {
                _this.data.comments[key].Statistic.PraiseNum += 1;
              } else {
                _this.data.comments[key].Statistic.PraiseNum = 1;
              }
              _this.data.comments[key].IsPraise = 1;
            }
          });
          // 存储点赞记录到缓存中
          if (praiseCommentList.indexOf(commentId) == -1) {
            praiseCommentList.push(commentId);
          }
          praiseCommentList = app.util.arrayUnique(praiseCommentList);
          app.saveCache('article_praise_comment_list', praiseCommentList.join(','));
          _this.setData({
            comments: _this.data.comments
          });
        }
      });
    });
  },

  onPreviewPicture: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var commentId = e.currentTarget.dataset.commentid;
    var pictureList = _this.data.commentPictures[commentId];
    wx.previewImage({
      current: pictureList[index],
      urls: pictureList
    });
  },

  onPreviewImg: function (e) {
    var _this = this;
    var src = e.currentTarget.dataset.src;
    var commentId = e.currentTarget.dataset.commentid;
    var pictureList = _this.data.articlePictures;
    wx.previewImage({
      current: src,
      urls: pictureList
    });
  },

  onGotoAPP: function (e) {
    app.saveFormId(e.detail.formId);
  }
})