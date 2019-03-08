// pages/component/album/favorite.js
const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    albumList: [],
    nextCursor:null,
    albumLeft:[],
    albumRight:[],
    leftH:0,
    rightH:0,
    columnName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.checkNetwork();
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    app.util.checkNetwork();
    if (!app.user.openId) {
      app.getUser(() => {
        _this.loadAlbumList();
      });
    } else {
      _this.data.loading && _this.albumList == undefined ? _this.loadAlbumList() : null;
    }
   
  },

  /**
   * 加载相册列表数据
   */
  loadAlbumList: function (nextCursor = null) {
    var _this = this;
    var url = app.constant.API_FAVORITE_ALBUM_LIST;
    var leftH = _this.data.leftH;
    var rightH = _this.data.rightH;
    var left = _this.data.albumLeft;
    var right = _this.data.albumRight;
    //console.log(leftH, rightH, left, right);
    if (nextCursor) {
      url += '&nextCursor=' + nextCursor
    }
    app.util.request(url, {}, 'GET', result => {
      var data = result.result.list;
      if (result.errorCode == 10000) {
        var newFavoriteList = nextCursor != null ? this.data.albumList : [];
        data.forEach((item, index) => {
          newFavoriteList.push(item);
          //  计算高度
          var pics = item.Pictures;
          var curH = 0;
          if(item.layout == '1,1'){
            curH = (pics[0].FileHeight/pics[0].FileWidth)*336*2
          } else{
            curH = (pics[0].FileHeight / pics[0].FileWidth) * 336 + (pics[1].FileHeight / pics[1].FileWidth) * 166*2
          }

          if (leftH <= rightH){
            leftH += curH;
            left.push(item);
          }else{
            rightH += curH;
            right.push(item);
          }
        });
        _this.setData({
          loading: false,
          albumList: newFavoriteList,
          nextCursor: result.result.hasOwnProperty('nextCursor') ? result.result.nextCursor : null,
          albumLeft:left,
          albumRight:right,
          leftH: leftH,
          rightH:rightH
        });
        //console.log(newFavoriteList)
      } else {
        app.util.showErrorModal(result.errorMsg, '接口错误');
      }
    }, result => {
      app.util.showErrorModal('接口错误', '接口错误');
    });
  },

  /**
   * 相册列表点击事件
   */
  onAlbumItemTap: function (event) {
    var albumId = event.currentTarget.dataset.albumid;
    wx.navigateTo({
      url: '/pages/component/album/picture-list?albumId=' + albumId,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.util.checkNetwork();
    this.loadAlbumList();
    wx.stopPullDownRefresh();
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    if (this.data.nextCursor){
      this.loadAlbumList(this.data.nextCursor);
    }
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (e) {
    if (e.from === 'button') { }
    return {
      title: '街拍APP-发现穿衣搭配灵感'
    }
  },
});