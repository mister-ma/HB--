const app = getApp();

Page({
 /**
   * 页面的初始数据
   */
 data:{
    recommendList:[], //推荐数组
    recommendListArr:[],//结果集集合
    allRecommendList:[],
    subjectId:'',
    currentSubjectId:1,
    options:['A','B','C','D'], // 答案序号
    content:null, // 分页内容
    dataSouce:[], //所有数据
    questionLength:0, //问题总数
    curQuestion:1,
    currentOption:'',
    currentOptionGoods:[],
    lastShow:true,
    backtop:false,
    backShow:false,
 },

/**
 * 生命周期 页面加载
 */
onLoad: function (){
  app.util.checkNetwork();
  var _this = this;
  app.loginLoad(() => {
    _this.loadRecommendList();
  });
  var listNoneH = 0;
  wx.getSystemInfo({
    success: function(res) {
      var winH = res.windowHeight;
      wx.createSelectorQuery().select(".index-question").boundingClientRect(function(rect){
        listNoneH = winH-rect.height;
        _this.setData({
          listNoneH: listNoneH
        });
      }).exec();
    },
  })
},

loadRecommendList: function () {
  var _this = this;
  var url = app.constant.API_WX_RECOMMEND;
  app.util.request(url, {}, 'GET', result => {
      if (result.errorCode == 10000) {
        var data = result.result.list;
        _this.setData({
          recommendList: result.result.AllQuestionGoos,
          subjectId: _this.data.currentSubjectId,
          dataSouce: result.result,
          content: data[0],
          questionLength: data.length,
          allRecommendList: result.result.AllQuestionGoos
          //recommendList: data[0].Noption1
        });
      } else {
        app.util.showErrorModal(result.errorMsg, '接口错误');
      }
    }, result => {
      app.util.showErrorModal('接口错误，请重试。', '接口错误');
    });
},


//  选择答案
onAnswerListTap: function(e){
  var curId = e.currentTarget.dataset.sid;
  var index = e.target.dataset.cur+1;
  var length = this.data.questionLength;
  var _this = this;
  var content = this.data.content;
  
  curId +=1;
  if (length > 1 && curId >= 2){
    this.setData({
      backShow:true
    });
  }else{
    this.setData({
      backShow: false
    });
  }
  var nCurId = content.ID;
  var newContent = [];
  if (this.data.currentOption == '') {
    newContent = content['Noption' + index];
  } else {
    var aData = this.data.currentOptionGoods;
    var bData = content['Noption' + index];
    aData.forEach(aval => {
      bData.forEach(bval => {
        if (aval.DID == bval.DID) {
          newContent.push(bval);
        }
      });
    });
  }
  //记录用户选项
  if (!app.user.openId) {
    app.getUser();
  }
  app.util.request(app.constant.API_WX_RECOMMEND_LOG, {
    UserID: app.user.ltUserId,
    QID: nCurId,
    OID: index
  }, 'POST', result => { });
 
  var newRecommendListArr = app.globalData.recommendListArr;
  newRecommendListArr.push(newContent);
  this.setData({
    content: _this.data.dataSouce.list[curId-1],
    recommendList: newContent, 
    curQuestion: curId,
    currentOption: index,
    currentOptionGoods: newContent,
    recommendListArr: newRecommendListArr
  });
  if (curId - 1 >= length) {
    this.setData({
      lastShow: false,
      currentOption:''
    });
    return;
  }
},



/**
 * 生命周期  页面显示
 */
onShow: function (){

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
 * 测试完毕，重新开始按扭
 */
onTestReloadTap: function (){
      var data = this.data.dataSouce;
      this.setData({
        lastShow:true,
        recommendList: data.AllQuestionGoos,
        content:data.list[0],
        curQuestion:1,
        backShow:false,
      });
  },


/**
  * 监听页面滚动
  */
onPageScroll: function (e) {
  var scrollTop = e.scrollTop;
  var res = wx.getSystemInfoSync();
  var back = null;
  if (scrollTop > (res.windowHeight * 1.5)) {
    back = true;
  } else {
    back = false;
  }
  this.setData({
    backtop: back
  });
},

// 回到顶部
onBackToTop: function(){
  wx.pageScrollTo({
    scrollTop: 0,
  })
},

// 返回上一题
onBackPrev: function(e){
  var curId = e.currentTarget.dataset.sid;
  var index = e.target.dataset.cur + 1;
  var length = this.data.questionLength;
  var _this = this;
  var content = this.data.content;
  curId -= 1;
  if (curId < 1){
    curId = 1
  }
  if (length > 1 && curId >= 2) {
    this.setData({
      backShow: true
    });
  } else {
    this.setData({
      backShow: false
    });
  }
  var temp = [];
  if (curId == 1){
    temp = this.data.allRecommendList;
    index = '';
  }else{
    temp = app.globalData.recommendListArr[curId - 2];
  }
  this.setData({
    content: _this.data.dataSouce.list[curId - 1],
    curQuestion: curId,
    currentOption: index,
    recommendList: temp,
    currentOptionGoods: temp,
  });
  if (curId - 1 >= length) {
    this.setData({
      lastShow: false,
      currentOption: ''
    });
    return;
  }
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