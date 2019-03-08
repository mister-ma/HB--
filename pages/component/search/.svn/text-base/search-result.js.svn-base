const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyWord: null,
    searchList: [],
    nextCursor: null,
    onInput:true,
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    app.util.checkNetwork();
    var _this = this;
    var keyWord = options.keyword;
    var isTap = options.isTap;
    var nextCursor = options.nextCursor;
    if (keyWord) {
      this.setData({
        onInput: false
      })
    }
    app.loginLoad(() => {
      _this.loadSearchList(keyWord, nextCursor);
    });
    
  },

  loadSearchList: function (keyWord, nextCursor = null) {
    var _this = this;
    var url = app.constant.API_WX_SEARCH_LIST;
    if (nextCursor){
      url = url + '&nextCursor=' + nextCursor;
    }
    app.util.request(url, {
      KeyWord: keyWord,
      UserID: app.user.ltUserId
    }, 'POST', result => {
      if (result.errorCode == 10000) {
        
        var data = result.result.list;
        var newSearchList = nextCursor != null ? this.data.searchList : [];
        data.forEach(value => {
          newSearchList.push(value);
        });
        // if (newSearchList.length > 0){
        //   _this.setData({
        //     onInput:false
        //   })
        // }else{
        //   if (_this.data.isTap && (newSearchList.length == 0)){
        //     _this.setData({
        //       onInput: false
        //     });
        //   }else{
        //     _this.setData({
        //       onInput: true
        //     });
        //   }
        // }
        
        _this.setData({
          searchList: newSearchList,
          searchKeyWord: keyWord,
          nextCursor: result.result.hasOwnProperty('nextCursor') ? result.result.nextCursor : null,
        });
      } else {
        app.util.showErrorModal(result.errorMsg, '接口错误');
      }
    }, result => {
      app.util.showErrorModal('接口错误，请重试。', '接口错误');
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

  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    app.util.checkNetwork();
    this.loadSearchList();
    wx.stopPullDownRefresh();
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    if (this.data.nextCursor) {
      this.loadSearchList(this.data.searchKeyWord, this.data.nextCursor);
    }
  },

  // 搜索
  onSearchGoodsDetail: function (e) {
    var _this = this;
    var searchKeyWord = this.data.searchKeyWord;
    var value = wx.getStorageSync('searchHistory');
    var historyArr = [];
    historyArr = value.split(',');
    historyArr.push(searchKeyWord);
    historyArr = app.util.arrayUnique(historyArr);
    wx.setStorageSync('searchHistory', historyArr.join(','));
    _this.loadSearchList(searchKeyWord);
  },

 //搜索框状态
  orderIdInput: function (e) {
    this.setData({
      searchKeyWord: e.detail.value,
      isSearch: true
    });
    if (e.detail.value == '') {
      this.setData({
        isSearch: false
      });
    }
  },

  // 搜索输入框失去焦点
  orderIdBlur: function (e) {
    var val = e.detail.value;
    if (!val) {
      this.setData({
        onInput: true
      })
    }
  },

  // 搜索框获取光标
  orderIdFocus: function () {
    this.setData({
      onInput: false
    });
  },

  // 点击搜索框的差号时
  onSearchChaTap: function (e) {
    this.setData({
      searchKeyWord: '',
      isSearch: false,
      onInput: true
    });
  },
})