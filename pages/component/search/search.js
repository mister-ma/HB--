const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyWord: null,
    hotSearch: [],
    nextCursor: null,
    onInput:true,
    isSearch:false,
    // searchOrderIdValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.checkNetwork();
    var _this = this;
    app.loginLoad(() => {
      _this.loadHotSearch();
    });
  },

  loadHotSearch: function () {
    var _this = this;
    var url = app.constant.API_WX_SEARCH_HOTWORDS;
    app.util.request(url, {}, 'GET', result => {
      if (result.errorCode == 10000) {
        var data = result.result;
        //历史搜索
        var searchHistoryArr = [];
        var searchHistory = wx.getStorageSync('searchHistory');
        if (searchHistory){
          searchHistoryArr = searchHistory.split(',');
        }
        //热门搜索
        console.log(data.searchHot)
        var newSearchHot = [];
        data.searchHot.forEach(value => {
          newSearchHot.push(value);
        });
        _this.setData({
          hotSearch: newSearchHot,
          historySearch: searchHistoryArr,
        });
      } else {
        app.util.showErrorModal(result.errorMsg, '接口错误');
      }
    }, result => {
      app.util.showErrorModal('接口错误，请重试。', '接口错误');
    });
  },

 //搜索
  onSearchGoodsDetail: function (e) {
    var searchKeyWord = this.data.searchKeyWord;
    var value = wx.getStorageSync('searchHistory'); 
    var historyArr = [];
    if (value){
      historyArr = value.split(',');
    }
    historyArr.push(searchKeyWord);
    historyArr = app.util.arrayUnique(historyArr);
    wx.setStorageSync('searchHistory', historyArr.join(','));
    wx.navigateTo({
      url: '/pages/component/search/search-result?keyword=' + searchKeyWord,
    });
  },

  //搜索框状态
  orderIdInput: function (e) {
    this.setData({
      searchKeyWord: e.detail.value,
      isSearch:true
    });
    if (e.detail.value == ''){
      this.setData({
        isSearch: false
      });
    }
  },

// 搜索框获取光标
  orderIdFocus: function (){
    this.setData({
      onInput:false
    });
  },
  
// 点击搜索出的列表
  onSearchResultListTap: function (e){
    wx.navigateTo({
      url: '/pages/component/search/search-result',
    })
  },

  // 点击搜索框的差号时
  onSearchChaTap: function (e){
    this.setData({
      searchKeyWord: '',
      isSearch: false,
      onInput:true
    });
  },

  // 点击取消
  onSearchCancel: function (){
    console.log(1231);
    wx.reLaunch({
      url: '/pages/component/index/index',
    });
  },

  //清楚本地搜索记录
  onClearSearch: function (e){
    this.setData({
      historySearch:[]
    })
    wx.removeStorageSync('searchHistory');
  },

  // 搜索输入框失去焦点
  orderIdBlur: function (e){
    var val = e.detail.value;
    if (!val){
      this.setData({
        onInput:true
      })
    }
  },

  // 点击热门搜索关键词
  onSearchHot: function(e){
      var val = e.currentTarget.dataset.val;
      var value = wx.getStorageSync('searchHistory');
      var historyArr = [];
      if (value) {
        historyArr = value.split(',');
      }
      historyArr.push(val);
      historyArr = app.util.arrayUnique(historyArr);
      wx.setStorageSync('searchHistory', historyArr.join(','));
      wx.navigateTo({
        url: '/pages/component/search/search-result?keyword=' + val+'&isTap=1',
      });
  },

})