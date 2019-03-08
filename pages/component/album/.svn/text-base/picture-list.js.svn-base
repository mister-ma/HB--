// pages/component/album/picture-list.js
const app = new getApp();

Page({

   /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    pictureList: [],
    picUrlList:[],
    nextCursor: null,
    listLeft:[],
    listRight:[],
    leftH:0,
    rightH:0,
    columnName:'',
    albumName:null,
    nickName:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.checkNetwork();
    var _this = this;
    var albumId = options.albumId;
    _this.url = app.constant.API_ALBUM_PICTURE_LIST.replace(':AlbumID', albumId);
    wx.showLoading({
      title: '加载中...',
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    app.util.checkNetwork();
    if (!app.user.openId) {
      app.getUser(() => {
        _this.loadPictureList();
      });
    } else {
      _this.data.loading && _this.pictureList == undefined ? _this.loadPictureList() : null;
    }
   
  },

  /**
   * 加载相册列表数据
   */
  loadPictureList: function (nextCursor = null) {
    var _this = this;
    var columnName = '';
    if (nextCursor) {
      _this.url += '&nextCursor=' + nextCursor
    }
    var leftH = _this.data.leftH;
    var rightH = _this.data.rightH;
    var left = _this.data.listLeft;
    var right = _this.data.listRight;
    app.util.request(_this.url, {}, 'GET', result => {
      var data = result.result;
      if (result.errorCode == 10000) {
        var newPictureList = nextCursor != null ? this.data.pictureList : [];
        var newPicUrlList = nextCursor != null ? this.data.picUrlList : [];
        data.list.forEach((item, index) => {
          newPictureList.push(item);
          newPicUrlList.push(item.Picture);
          var curH = 0;
          curH = (item.FileHeight / item.FileWidth)*340
          if (leftH <= rightH){
            leftH += curH;
            left.push(item);
          }else{
            rightH += curH;
            right.push(item);
          }
        });
        columnName = data.AlbumInfo.AlbumName;
        // 设置导航标题
        if (columnName) {
          wx.setNavigationBarTitle({
            title: columnName
          });
        }
        _this.setData({
          loading: false,
          albumInfo: data.AlbumInfo,
          pictureList: newPictureList,
          picUrlList: newPicUrlList,
          nextCursor: result.result.hasOwnProperty('nextCursor') ? result.result.nextCursor : null,
          albumName: data.AlbumInfo.AlbumName,
          nickName: data.AlbumInfo.NickName,
          listLeft:left,
          listRight:right,
          leftH: leftH,
          rightH: rightH
        });
        // console.log(data.AlbumInfo)
        // console.log(newPictureList)
        // console.log(result.result.nextCursor)
      } else {
        app.util.showErrorModal(result.errorMsg, '接口错误');
      }
    }, result => {
      app.util.showErrorModal('接口错误', '接口错误');
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.util.checkNetwork();
    this.loadPictureList();
    wx.stopPullDownRefresh();
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    if (this.data.nextCursor){
      this.loadPictureList(this.data.nextCursor);
    }
  },

  onPreviewImg: function (e) {
    var _this = this;
    var src = e.currentTarget.dataset.src;
    var picUrlList = _this.data.picUrlList;
    wx.previewImage({
      current: src,
      urls: picUrlList
    });
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (e) {
    var _this = this;
    if (e.from === 'button') { }
    return {
      title: '《' + _this.data.albumName + '》 by ' + _this.data.nickName
    }
  },
});