const app = getApp();

Page({
  /**
  * 页面的初始数据
  */
  data: {
    loading: true,
    userInfo: app.user,
    shareBannerPic : [],
    praiseInfo: [{Avatar:'../../../images/user-default-author.png'},
      { Avatar: '../../../images/user-default-author.png' },
      { Avatar: '../../../images/user-default-author.png' },
      { Avatar: '../../../images/user-default-author.png' },
      { Avatar: '../../../images/user-default-author.png' },
      { Avatar: '../../../images/user-default-author.png' },
      { Avatar: '../../../images/user-default-author.png' },
      { Avatar: '../../../images/user-default-author.png' },
      { Avatar: '../../../images/user-default-author.png' },
      { Avatar: '../../../images/user-default-author.png' }],
    praiseCount : null,
    allPraiseCount: null,
    typeId:'',
    myCode:[],
    goodsDetailList:[],
    shareLtPicture: '',
    showShareDialog: false,
    saveImageToAlbumFinish: false,
    originalUserId:'',
    originalUserInfo:[],
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
    praiseOriginalCount:'',
    clicked1: true,
    clicked2: false,
    clicked3: false,
    activityShow:true,
    isParised:false,
    isScroll:false,
    isIphone: app.globalData.isIponeX,
    isFullPraise:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var padL = 0;
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        var winW = res.windowWidth;
        var rpx = 750/winW;
         padL = winW-690/rpx;
        _this.setData({
          padL: padL/2
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
    };
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.util.checkNetwork();
    // 计算高度
    var forwordH = 0;
    var _this = this;
    var topH = 0;
    var midH = 0;
    var lineH = 0;
    // wx.createSelectorQuery().select(".user-info").boundingClientRect(function(rect){
    //     topH = rect.height;
    //     console.log(topH);
    //     wx.createSelectorQuery().select(".index-product-nav").boundingClientRect(function (rect) {
    //       midH = topH + parseInt(rect.height);
    //       console.log(topH, rect.height);
    //       wx.createSelectorQuery().select(".index-list-swiper-line").boundingClientRect(function (rect) {
    //         lineH = midH + parseInt(rect.height);
    //         wx.getSystemInfo({
    //           success: function (res) {
    //             forwordH = res.windowHeight - lineH;
    //             _this.setData({
    //               forwordH: forwordH
    //             });
    //           },
    //         });
    //       }).exec();
    //     }).exec();
    // }).exec();
  },

  /**
   * 加载我的信息
   */
  loadUserCenter: function (typeId, originalUserId = null) {
    var _this = this;
    var url = app.constant.API_WX_USER_CENTER.replace(':Type', typeId);
    if (originalUserId){
      url = url + '&originalUserId=' + originalUserId;
    }
    app.util.request(url + '&UserID=' + app.user.ltUserId, {}, 'GET', result => {
      if (result.errorCode == 10000) {
        var data = result.result;
        if (originalUserId){
          //  替换头像
          data.PraiseOriginalInfo.forEach(function (item, index) {
            _this.data.praiseOriginalInfo[index] = item;
          });
          if (data.PraiseOriginalCount >= 10){
            _this.setData({
              isFullParise: true,
            });
          }
          _this.setData({
            originalUserId: data.OriginalUserInfo.UserID,
            originalUserInfo: data.OriginalUserInfo,
            praiseOriginalInfo: _this.data.praiseOriginalInfo,
            praiseOriginalCount: data.PraiseOriginalCount,
            isParised: data.IsPriase,
          });
        }
        if(typeId == 1){
          var bannerPic = [];
          data.ShareBannerPic.forEach((item, index) => {
              bannerPic.push(item);
            }
          );
          //  替换头像
          data.PraiseInfo.forEach(function(item,index){
            _this.data.praiseInfo[index] = item;
          });
          _this.setData({
            userInfo: app.user,
            shareBannerPic: bannerPic,
            praiseInfo: _this.data.praiseInfo,
            praiseCount: data.PraiseCount,
            allPraiseCount: data.AllPraiseCount + 1900,
            typeId: typeId,
            originalUserId: originalUserId
          });
        }else if(typeId == 2){
          var newMyCode = [];
          data.MyCode.forEach((item,index)=>{
            newMyCode.push(item);
          });
          _this.setData({
            myCode: newMyCode,
            typeId: typeId,
            originalUserId: originalUserId
          });
        } else if (typeId == 3){
          var newGoodsDetail = [];
          data.list.forEach((item, index) => {
            item.left = 0;
            item.isShow = true;
            newGoodsDetail.push(item);
          });
          _this.setData({
            goodsDetailList: newGoodsDetail,
            typeId: typeId,
            originalUserId: originalUserId
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
   * 删除收藏
   */
  onDelGoods: function (event){
    var goodsDetailId = event.currentTarget.dataset.goods;
    var url = app.constant.API_WX_COLLECT;
    app.util.request(url, {
      UserID: app.user.ltUserId,
      GoodsDetailID: goodsDetailId,
      Type:0
    }, 'POST', result => {
      if (result.errorCode == 10000) {
        wx.showToast({
          title: '删除成功！',
          icon: 'success'
        });
        this.loadUserCenter(3)
      }
    });
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (e) {
    if (e.from === 'button') { }
    if (e.currentTarget != undefined){
      var index = e.currentTarget.dataset.index;
      this.data.goodsDetailList[index].left = 0;
      this.setData({
       goodsDetailList:this.data.goodsDetailList
      })
      //分享收藏中的商品
      return {
        title:'Le Tanneur',
        imageUrl:'/images/img_1886.jpg',
        path: '/pages/component/index/goods-detail?goodsDetailId=' + e.currentTarget.dataset.goods
      }
    }else{
      //小程序转发
      return {
        title: 'Le Tanneur',
        imageUrl: '/images/img_1886.jpg',
        path: '/pages/component/user/user-share?Type=1&originalUserId=' + app.user.ltUserId
      }
    }
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

  /**
   * 分享到朋友圈
   */
  onShareToTimeline: function (e) { 
    var _this = this;
    var url = app.constant.API_WX_SHARE_LT_PICTURE + '&UserID=' + app.user.ltUserId ;
    wx.downloadFile({
      url: url,
      success: function (result) {
        if (result.statusCode == 200) {
          var filePath = result.tempFilePath;
          _this.setData({
            shareLtPicture: filePath,
            showShareDialog: true
          });
          wx.saveImageToPhotosAlbum({
            filePath: filePath,
            success: () => {
              saveImageToAlbumFinish: true
            }
          });
          _this.setData({
            saveImageToAlbumFinish: true,
          });
        }
      }
    });
  },


  //  列表切换
  onProductNavTap: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    for (var i = 1; i <= 3; i++) {
      if (index == i) {
        this.setData({
          ['clicked' + i]: true
        })
      } else {
        this.setData({
          ['clicked' + i]: false
        })
      }
    }
    this.loadUserCenter(index, this.data.originalUserId);
  },
 
//  点击活动说明
  onaActivityShow: function(){
    var activityShow = this.data.activityShow;
    this.setData({
      activityShow: !activityShow
    });

  },

  // 点击分享图片的差
  onShareCha: function (){
    this.setData({
      showShareDialog:false
    })
  },

  //  页面滚动触发事件的处理函数
  onScrollViewScroll: function(e){
    var _this = this;
    // this.data.goodsDetailList.forEach(function (item, index) {
    //   if (item.left < 0 && _this.data.isTouchView){
    //     item.left = 0;
    //   }
    // });
    // this.setData({
    //   goodsDetailList: this.data.goodsDetailList
    // });
    var scrollTop = 0;
    var _this = this;
    var viewH = this.data.forwordH+162;
    var query = wx.createSelectorQuery();
    query.selectViewport().scrollOffset(function (res) {
      scrollTop = res.scrollTop;
      if (scrollTop > (viewH * 1.5)) {
        _this.setData({
          scrollTop: 1
        });
      } else {
        _this.setData({
          scrollTop: 0
        });
      }
    }).exec();
    
  }, 

  // 点击回到顶部
  onBackToTop: function(){
    wx.pageScrollTo({
      scrollTop:0,
      duration:500
    })
  },


  // 点击收藏的三个点出现收藏按钮
  onCollectionIoBtnTap : function(e){
      var cur = e.currentTarget.dataset.index;
      var goodsDetailList = this.data.goodsDetailList;
      goodsDetailList.forEach(function(item,index){
        item.isShow = true;
        item.left = 0;
        if (index == cur){
          item.isShow = false;
          item.left = -180;
        }
      });
      this.setData({
        goodsDetailList: goodsDetailList
      });
  },

  // 收藏位置的滑动操作start
  leftHandleStart: function (e){
      var touches = e.touches[0];
      this.setData({
        startX: touches.pageX,
        startY: touches.pageY
      });
  },

  /**
     * 商品列表点击事件
     */
  onGoodsItemTap: function (event) {
    var goodsDetailId = event.currentTarget.dataset.goodsdetailid;
    wx.navigateTo({
      url: '/pages/component/index/goods-detail?goodsDetailId=' + goodsDetailId,
    });
  },

  // 收藏位置的滑动操作move
  leftHandleMove: function (e) {
    var touches = e.touches[0];
    var lastX = touches.pageX;
    var lastY = touches.pageY;
    var startX = this.data.startX;
    var startY = this.data.startY;
    var distanceX = lastX - startY;
    var distanceY = lastY - startY;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (Math.abs(distanceY) < 40) {
        // 向左滑动
        if ((lastX - startX) > 60) {
          var cur = e.currentTarget.dataset.index;
          this.data.goodsDetailList[cur].left = 0;
          this.setData({
            goodsDetailList: this.data.goodsDetailList,
            isTouchView:false
          });
        }
        // 向右滑动
        if ((lastX - startX) < -10) {
          var cur = e.currentTarget.dataset.index;
          this.data.goodsDetailList.forEach(function (item, index) {
            item.left = 0;
            if (cur == index) {
              item.left = -180;
            }
          });
        }
      }
    } else {
      this.setData({
        isTouchView: true
      });
    }
    this.setData({
      goodsDetailList: this.data.goodsDetailList
    });
    return false;
  },

})