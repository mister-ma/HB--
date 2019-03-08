// pages/component/vote/vote-participate-list.js
const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchOrderId: '',
    voteId: '',
    voteTitle: '',
    participateEnd: '',
    nextCursor: '',
    participate: [],
    left: [],
    right: [],
    leftH: 0,
    rightH: 0,
    isIponeX: app.globalData.isIponeX,
    boxHeight: 453
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.checkNetwork();
    var _this = this;
    _this.setData({
      voteId: options.voteId,
      voteTitle: options.title,
      participateEnd: (options.flag && options.flag == 3) ? true : false
    });
    wx.setNavigationBarTitle({
      title: '为你喜欢的图片投上一票',
    })
    app.getSid(app.user.hbUserId, function (sid) {
      _this.loadParticipateList();
    });
    var boxHeight = 0;
    wx.getSystemInfo({
      success: function (res) {
        boxHeight = res.windowHeight - 150;
        _this.setData({
          boxHeight: boxHeight
        });
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.util.checkNetwork();
  },

  loadParticipateList: function (nextCursor = null) {
    var _this = this;
    var url = app.constant.API_VOTE_PARTICIPATE_LIST_ALL.replace(':VoteID', _this.data.voteId);
    if (_this.data.searchOrderId) {
      url += '&VoteDetailID=' + _this.data.searchOrderId
    }
    if (nextCursor) {
      url += '&nextCursor=' + nextCursor
    }

    app.getSid(app.user.hbUserId, function (sid) {
      app.util.request(url + '&Sid=' + sid, {}, 'GET', result => {
        if (result.errorCode == 10000) {
          var newParticipate = _this.data.searchOrderId ? [] : _this.data.participate;
          var curLeft = _this.data.searchOrderId ? [] : _this.data.left;
          var curRight = _this.data.searchOrderId ? [] : _this.data.right;
          var curLeftH = _this.data.searchOrderId ? 0 : _this.data.leftH;
          var curRightH = _this.data.searchOrderId ? 0 : _this.data.rightH;
          var data = result.result;
          data.list.forEach((item, index) => {
            var curH = 300;
            // 计算图片高度
            let oImgW = item.FileWidth;         //图片原始宽度
            let oImgH = item.FileHeight;        //图片原始高度
            let imgWidth = 340;  //图片设置的宽度
            let scale = imgWidth / oImgW;        //比例计算
            let imgHeight = oImgH * scale;      //自适应高度
            if (curLeftH <= curRightH) {
              curLeftH += imgHeight;
              curLeft.push(item);
            } else {
              curRightH += imgHeight;
              curRight.push(item);
            }
            newParticipate.push(item);
          });
          newParticipate.map((item, key) => {
            newParticipate[key]['Index'] = key;
          })
          app.globalData.voteParticipateList[_this.data.voteId] = newParticipate;

          _this.setData({
            participate: newParticipate,
            nextCursor: data.nextCursor ? data.nextCursor : '',
            left: curLeft,
            right: curRight,
            leftH: curLeftH,
            rightH: curRightH
          });
        }
      });
    });
  },

  onSearchVotePicture: function (e) {
    var searchOrderId = this.data.searchOrderId;
    this.loadParticipateList();
  },

  orderIdInput: function (e) {
    this.setData({
      searchOrderId: e.detail.value
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this;
    if (_this.data.nextCursor) {
      _this.loadParticipateList(_this.data.nextCursor);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //  图片加载
  onImageLoad: function (e) {
    // let oImgW = e.detail.width;         //图片原始宽度
    // let oImgH = e.detail.height;        //图片原始高度
    // let imgWidth = 300;  //图片设置的宽度
    // let scale = imgWidth / oImgW;        //比例计算
    // let imgHeight = oImgH * scale;      //自适应高度
    // if (this.data.leftH <= this.data.rightH){
    //   this.data.leftH += imgHeight;
    //   this.data.left.push(e.currentTarget.dataset.item);
    // }else{
    //   this.data.rightH += imgHeight;
    //   this.data.right.push(e.currentTarget.dataset.item);
    // }
    // this.setData({
    //   left:this.data.left,
    //   right:this.data.right,
    //   leftH:this.data.leftH,
    //   rightH: this.data.rightH
    // });
  },

  /**
   * 点击海选的每个图片跳转
   */
  onParticipateItemImg: function (e) {
    wx.navigateTo({
      url: '/pages/component/vote/vote-image?voteid=' + this.data.voteId + '&index=' + e.currentTarget.dataset.index + '&fileid=' + e.currentTarget.dataset.fileid,
    })
  },

  /**
   * 我要参赛
   */
  onGotoActiveVote: function (e) {
    var _this = this;
    app.saveFormId(e.detail.formId);

    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 1,
      success: ((result) => {
        wx.showLoading({
          title: '图片加载中...',
        });
        wx.navigateTo({
          url: '/pages/component/vote/vote-upload-image?voteId=' + _this.data.voteId + '&imageUrl=' + encodeURIComponent(result.tempFilePaths[0]),
        });
      })
    })
  }

})