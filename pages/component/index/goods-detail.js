// pages/component/index/goods-detail.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    goodsDetailId: '',
    goodsName: '',
    goodsPrice: '',
    goodsContent: {},
    pictures: [],
    goodsPictures: [],
    isIponeX: app.globalData.isIponeX,
    picturesLength:0,
    picturesCur:0,
    goodsCollection:true,
    isIphone: app.globalData.isIponeX,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    app.util.checkNetwork();
    var goodsDetailId = options.goodsDetailId;
    if (!app.user.openId) {
      app.getUser(() => {
        _this.loadGoodsDetail(goodsDetailId);
      });
    } else {
      _this.data.loading && (_this.goodsName == undefined || _this.goodsPictures == undefined) ? _this.loadGoodsDetail(goodsDetailId) : null;
    }
  },

  loadGoodsDetail: function (goodsDetailId){
    var _this = this;
    var url = app.constant.API_WX_GOODS_DETAIL.replace(':GoodsDetailID', goodsDetailId);
    app.util.request(url + '&UserID=' + app.user.ltUserId, {}, 'GET', result => {
      if (result.errorCode == 10000) {
        var data = result.result;
        var content = data.Contents;
        if (data.GoodsName) {
          var goodsName = data.GoodsName.slice(0, 20);
          wx.setNavigationBarTitle({
            title: goodsName,
          });
        }
        var pictureList = [];
        data.Contents.forEach(value => {
          if ((value.Type == 4 || value.Type == 7) && value.Picture) {
            pictureList.push(value.Picture);
          }
        });
        if (data.IsCollect == 1) {
          data.IsCollect = false
        } else {
          data.IsCollect = true
        }
        _this.setData({
          goodsContent: data.Contents,
          goodsDetailId: data.GoodsDetailID,
          goodsName: data.GoodsName,
          goodsPrice: data.Price,
          goodsPictures: pictureList,
          pictures: data.Pictures,
          picturesLength: data.Pictures.length,
          goodsCollection: data.IsCollect
        });

      } else {
        app.util.showErrorModal(result.errorMsg, '接口错误');
      }
    }, result => {
      app.util.showErrorModal('接口错误，请重试。', '接口错误');
    });
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
      title: this.data.articleTitle,
      imageUrl: this.data.picture
    }
  },

 
  /**
   * 预览图片
   */
  onPreviewImg: function (e) {
    var _this = this;
    var src = e.currentTarget.dataset.src;
    var commentId = e.currentTarget.dataset.commentid;
    var pictureList = _this.data.goodsPictures;
    wx.previewImage({
      current: src,
      urls: pictureList
    });
  },

  onGotoBuyWay: function (e) {
    wx.navigateTo({
      url: '/pages/component/introduce/buy-way?Type=1',
    })
  },

// 点击首页按钮
  onNavToIndexTap: function (){
    wx.reLaunch({
      url: '/pages/component/index/index',
    })
  },

//  点击收藏
  onCollectionTap: function (event){
    var collection = this.data.goodsCollection;
    var collType = 1;
    collection = !collection;
    if (collection == false){//点收藏
      collType = 1;
    }else{//取消收藏
      collType = 0;
    }
    var url = app.constant.API_WX_COLLECT;
    app.util.request(url, {
      UserID: app.user.ltUserId,
      GoodsDetailID: event.currentTarget.dataset.gid,
      Type: collType
    }, 'POST', result => {
      if (result.errorCode == 10000) {

      } else {
        app.util.showErrorModal(result.errorMsg, '接口错误');
      }
    }, result => {
      app.util.showErrorModal('接口错误，请重试。', '接口错误');
    });
    this.setData({
      goodsCollection: collection
    })
  },


  // 商品详情轮播图change
  onGoodsSwiperChange: function(e){
    var cur = e.detail.current;
    this.setData({
      picturesCur: cur
    });
  }
})