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
    leftImg:[],
    rightImg:[],
    leftH:0,
    rightH:0,
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
    var url = app.constant.API_WX_INVARIANTINFO.replace(':Type', infoType);
    app.util.request(url, {}, 'GET', result => {
      if (result.errorCode == 10000) {
        var data = result.result;
        var newPictureList = [];

        var leftH = 0, rightH = 0, leftImg = [], rightImg = [];
        data.forEach((value,index)=>{
          value.cur = index;
          var curH = value.FileHeight*300/value.FileWidth;
          if (leftH <= rightH){
            leftImg.push(value);
            leftH += curH;
          }else{
            rightImg.push(value);
            rightH += curH;
          }
          newPictureList.push(value);
        });
        _this.setData({
          infoType: infoType,
          hostUrl: app.constant.API_ROOT,
          PictureList: newPictureList,
          leftImg:leftImg,
          rightImg:rightImg,
          leftH:leftH,
          rightH:rightH,
        });
      } else {
        app.util.showErrorModal(result.errorMsg, '接口错误');
      }
    }, result => {
      app.util.showErrorModal('接口错误，请重试。', '接口错误');
    });
    
  },

  // 预览大图
  onPreviewPicture: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var pictureList = [];
    this.data.PictureList.forEach(function(item,index){
      pictureList.push(item.Picture);
    });
    wx.previewImage({
      current: pictureList[index],
      urls: pictureList
    });
  },
  
});