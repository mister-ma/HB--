/**
 * Created by user on 2017/11/17.
 */
const API_ROOT = 'https://wxa.haibao.com';
const APP_SECRET = 'Haibao2016';

// 使用街拍APP哪个版本的接口作为小程序的接口
const USE_APP_VERION = '4.6.5';
const PARAMS = '?from=wxa&version=' + USE_APP_VERION;

module.exports = {
  API_ROOT: API_ROOT,
  APP_SECRET: APP_SECRET,
  // 解密并在海报自动保存微信登录信息
  API_WX_LOGIN: API_ROOT + '/UserCenter/WxLogin' + PARAMS,
  // 获取用户Sid
  API_GET_SID: API_ROOT + '/UserCenter/GetSid' + PARAMS,
  // 首页列表页
  API_WX_ARTICLE_LIST: API_ROOT + '/Articles/Home/All' + PARAMS,
  // 文章详情页
  API_WX_ARTICLE_DETAIL: API_ROOT + '/Articles/:ArticleID' + PARAMS,
  // 文章评论点赞
  API_WX_ARTICLE_COMMENT_PRAISE: API_ROOT + '/Articles/Comments/Praise' + PARAMS,
  // 投票列表页
  API_VOTE_LIST: API_ROOT + '/Vote/VoteList' + PARAMS,
  // 投票海选页（整体分享）
  API_VOTE_PARTICIPATE_LIST: API_ROOT + '/Vote/ParticipateList/:VoteID' + PARAMS,
  // 投票进行中/已结束
  API_VOTE_DETAIL_LIST: API_ROOT + '/Vote/DetailList/:VoteID' + PARAMS,
  // 图片详情页（单张分享）
  API_VOTE_PICTURE_DETAIL: API_ROOT + '/Vote/Picture/:FileID/:VoteID' + PARAMS,
  // 投票图片点赞
  API_VOTE_PICTURE_PRAISE: API_ROOT + '/Vote/Praise' + PARAMS,
  // 投票海选列表页
  API_VOTE_PARTICIPATE_LIST_ALL: API_ROOT + '/Vote/ParticipateList/All/:VoteID' + PARAMS,
  // 我参加的投票图片
  APP_LIST_OF_MINE: API_ROOT + '/Vote/ListOfMine' + PARAMS,
  // 删除上传图片取消收藏图片
  APP_CANCEL_COLLECT_PICTURE: API_ROOT + '/Users/Me/CollectPicture' + PARAMS,
  // 投票图片上传 
  API_VOTE_UPLOAD: API_ROOT + '/Pictures/UploadToVote' + PARAMS,
  // 记录FormID
  API_SAVE_FORMID: API_ROOT + '/UserCenter/SaveFormID' + PARAMS,
  // 获取分享投票的图片
  API_SHARE_VOTE_PICTURE: API_ROOT + '/Wxa/ShareVotePicture/:VoteID/:FileID' + PARAMS,
  //最爱相册列表
  API_FAVORITE_ALBUM_LIST: API_ROOT + '/Albums/Hot' + PARAMS,
  //相册图片列表页
  API_ALBUM_PICTURE_LIST: API_ROOT + '/Albums/PictureList/:AlbumID' + PARAMS,
}