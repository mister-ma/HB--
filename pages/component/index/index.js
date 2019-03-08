// pages/component/index/index.js
const app = getApp();

Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    goodsList: [],
    bannerPic: [],
    videoList: [],
    goodsType: null,
    nextCursor: null,
    wHeight: 0,
    clicked1:true,
    clicked2:false,
    clicked3:false,
    userInfo: app.user,
    swiperCur:[],
    backtop:false,
    fixed:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var wHeight = 0;
    var _this = this;
    app.util.checkNetwork();
    var goodsType = options.typeId;
    if (!app.user.openId) {
      app.getUser(() => {
        _this.loadHomeList(goodsType);
      });
    } else {
      _this.data.loading && (_this.goodsList == undefined || _this.videoList == undefined) ? _this.loadHomeList() : null;
    }

    var navTop = 0;
    var _this = this;
    wx.createSelectorQuery().select('.index-product-nav').boundingClientRect(function (rect) {
      navTop = rect.top;
      _this.setData({
        navTop: navTop
      });
    }).exec();
  },

  loadHomeList: function (goodsType,nextCursor = null) {
    var _this = this;
    var goodsType = goodsType ? goodsType : 1;
    // 读取首页信息
    var url = app.constant.API_WX_HOME_LIST.replace(':Type', goodsType);
    if (nextCursor) {
      url += '&nextCursor=' + nextCursor
    }
    app.util.request(url, {}, 'GET', result => {
      var data = result.result;
      if (result.errorCode == 10000) {
        //轮播图
        var newBannerPic = [];
        data.BannerPicture.forEach((item, index) => {
          newBannerPic.push(item);
        });
        //分类列表
        if (goodsType != 9) {//包
          var newGoodsList = nextCursor != null ? this.data.goodsList : [];
          data.list.forEach((item, index) => {
            newGoodsList.push(item);
            _this.data.swiperCur.push({swiperCurIndex:0});
          });
          _this.setData({
            loading: false,
            bannerPic: newBannerPic,
            goodsList: newGoodsList,
            goodsType: goodsType,
            nextCursor: result.result.hasOwnProperty('nextCursor') ? result.result.nextCursor : null,
            swiperCur: _this.data.swiperCur
          });
      
        } else if (goodsType == 9) {//视频
          var newVideoList = nextCursor != null ? this.data.videoList : [];
          data.list.forEach((item, index) => {
            item.poster = true;
            item.VideoNull = item.VideoUrl;
            newVideoList.push(item);
        
          });
          _this.setData({
            loading: false,
            bannerPic: newBannerPic,
            videoList: newVideoList,
            goodsType: goodsType,
            nextCursor: result.result.hasOwnProperty('nextCursor') ? result.result.nextCursor : null
          });
        }
        //console.log(_this.data.goodsType)
      } else {
        app.util.showErrorModal(result.errorMsg, '接口错误');
      }
    }, result => {
      app.util.showErrorModal('接口错误', '接口错误');
    });
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.util.checkNetwork(); 
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

  orderIdInput: function (e) {
    wx.navigateTo({
      url: '/pages/component/search/search',
    });
  },

//  商品导航切换
  onProductNavTap: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var goodsType = e.currentTarget.dataset.goodstype;
    for (var i = 1; i <= 4; i++) {
      if (index == i) {
        this.setData({
          ['clicked' + i]: true
        });
        
      } else {
        this.setData({
          ['clicked' + i]: false
        })
      }
    }
    _this.data.swiperCur = [];
    this.loadHomeList(goodsType);
  },

  // 点击商品列表swipr change事件
  onProductSwiperChange: function(e){
    var index = e.currentTarget.dataset.index;
    var cur = e.detail.current;
    var _this = this;
    this.data.swiperCur[index].swiperCurIndex = cur
    this.setData({
      swiperCur: this.data.swiperCur
    })
  },

  // 点击商品列表swipr Left箭头
  onSwiperLeftBtn: function(e){
    var index = e.currentTarget.dataset.index;
    var goodsList = this.data.goodsList;
    this.data.swiperCur[index].swiperCurIndex -= 1
    
    if (this.data.swiperCur[index].swiperCurIndex <= 0) {
      this.data.swiperCur[index].swiperCurIndex = 0;
    }
    this.setData({
      swiperCur: this.data.swiperCur
    });
  },

  // 点击商品列表swiper Right箭头
  onSwiperRightBtn: function(e){
    var _this = this;
    var index = e.currentTarget.dataset.index;
    this.data.swiperCur[index].swiperCurIndex += 1
    var goodsList = this.data.goodsList;
    if (this.data.swiperCur[index].swiperCurIndex >= goodsList[index].length) {
      this.data.swiperCur[index].swiperCurIndex = goodsList[index].length-1;
    }
    this.setData({
      swiperCur: this.data.swiperCur
    });
  },

//  点击视频的播放按钮
  onVideoPlayerTap: function (e){
      // var cur = e.currentTarget.dataset.cur;
      // var src = e.currentTarget.dataset.src;
      // var _this = this;
      // this.data.videoList.forEach(function(item,index){
      //   if (item.poster == false){
      //       item.VideoNull = '';
      //       item.poster = true;
      //       console.log(item);
      //       setTimeout(function(){
      //         item.VideoNull = item.VideoUrl;
      //         console.log(item);
      //         _this.setData({
      //           videoList: _this.data.videoList
      //         });
      //       },100);
      //   }
      //   if (index == cur){
      //     item.poster = false;
      //   }
      // });
      // _this.setData({
      //   videoList: _this.data.videoList
      // });

      

      var cur = e.currentTarget.dataset.cur;
      var _this = this;
      this.data.videoList.forEach(function (item, index) {
        item.poster = true;
        if (index == cur){
          item.poster = false;
        }
      });
      _this.setData({
        videoList: _this.data.videoList
      });
  },

  // 点击视频的暂停播放按钮/视频结束时
  onVideoEndTap: function (e){
    var index = e.currentTarget.dataset.cur;
    var _this = this;
    this.data.videoList[index].poster = true;
    this.setData({
      videoList: _this.data.videoList
    });
  },

  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    app.util.checkNetwork();
    this.loadHomeList();
    wx.stopPullDownRefresh();
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    if (this.data.nextCursor) {
      this.loadHomeList(this.data.goodsType,this.data.nextCursor);
    }
  },



  /**
   * 监听页面滚动
   */
  onPageScroll: function(e){
    var scrollTop = e.scrollTop;
    var fixed = this.data.fixed;
    // console.log(scrollTop, this.data.navTop);
    if (scrollTop >= this.data.navTop) {
      fixed = true;
    } else {
      fixed = false;
    }

    var res = wx.getSystemInfoSync();
    var back = null;
    if (scrollTop > (res.windowHeight*1.5)){
        back = true;
    }else{
        back = false;
    }
    this.setData({
      backtop: back,
      fixed:fixed
    });

    
  },

  // 回到顶部
  onBackToTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (e) {
    if (e.from === 'button') { }
    //小程序转发
    return {
      title: 'Le Tanneur',
      imageUrl: '/images/img_1886.jpg'
    }
  },
})