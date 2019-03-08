/**
 * Created by user on 2017/11/17.
 */
const API_ROOT = 'https://jiepaidev.haibao.com';
// const API_ROOT = 'https://wxa.haibao.com';
const APP_SECRET = 'Haibao2016';

// 使用街拍APP哪个版本的接口作为小程序的接口
const USE_APP_VERION = '4.6.5';
const PARAMS = '?from=wxa&version=' + USE_APP_VERION;

module.exports = {
  API_ROOT: API_ROOT,
  APP_SECRET: APP_SECRET,
  // 获取用户Sid
  API_GET_SID: API_ROOT + '/UserCenter/GetSid' + PARAMS,
  // 首页列表页
  API_WX_HOME_LIST: API_ROOT + '/LeTanneur/GoodsList/:Type' + PARAMS,
  // 商品详情页
  API_WX_GOODS_DETAIL: API_ROOT + '/LeTanneur/GoodsDetail/:GoodsDetailID' + PARAMS,
  // 搜索页
  API_WX_SEARCH_HOTWORDS: API_ROOT + '/LeTanneur/Search/HotWords' + PARAMS,
  // 搜索结果页
  API_WX_SEARCH_LIST : API_ROOT + '/LeTanneur/Search' + PARAMS,
  // 固定数据 1 购买渠道 2 品牌介绍 3 全景图
  API_WX_INVARIANTINFO: API_ROOT + '/LeTanneur/InvariantInfo/:Type' + PARAMS,
  // 解密微信登录信息
  API_WX_LOGIN: API_ROOT + '/LeTanneur/WxLogin' + PARAMS,
  // 我的
  API_WX_USER_CENTER: API_ROOT + '/LeTanneur/UserCenter/:Type' + PARAMS,
  // 收藏/取消收藏
  API_WX_COLLECT: API_ROOT + '/LeTanneur/Collection' + PARAMS,
  // 点赞
  API_WX_PRAISE: API_ROOT + '/LeTanneur/Praise' + PARAMS,
  // 生成分享二维码
  API_WX_SHARE_LT_PICTURE: API_ROOT + '/LeTanneur/ShareLtPicture' + PARAMS,
  // 为你推荐
  API_WX_RECOMMEND: API_ROOT + '/LeTanneur/Recommend' + PARAMS,
  // 记录为你推荐
  API_WX_RECOMMEND_LOG: API_ROOT + '/LeTanneur/AddRecommendLog' + PARAMS,
}