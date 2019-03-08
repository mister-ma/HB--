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

});