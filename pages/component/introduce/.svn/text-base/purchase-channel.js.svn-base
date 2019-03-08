const app = getApp();

Page({

 /**
 * 页面的初始数据
 */
  data: {
    infoType: null,
    BrandName: '',
    BrandIntroduction: '',
    Picture: '',
    PictureList:[],
    waterPic: ['../../../images/lt/2.jpg',
      '../../../images/lt/3.jpg',
      '../../../images/lt/6.jpg',
      '../../../images/lt/7.jpg',
      '../../../images/lt/8.jpg',
      '../../../images/lt/9.jpg'],
    hostUrl: app.constant.API_ROOT,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.checkNetwork();
    var _this = this;
    var infoType = (options.Type != undefined) ? options.Type : 2;
    app.loginLoad(() => {
      _this.loadPurchaseChannel(infoType);
    });
  },

  loadPurchaseChannel: function (infoType) {
    var _this = this;
    _this.setData({
      infoType: infoType,
      hostUrl: app.constant.API_ROOT,
    });
  },

  onBrandPic: function (event){
    var _this = this;
    var typeId = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/component/introduce/brand-pic?Type=' + typeId,
    });
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
});