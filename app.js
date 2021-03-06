// app.js
App({

  /**
   * 版本号
   */
  version: '1.0.0',

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var _this = this;
    // 读取缓存
    try {
      var data = wx.getStorageInfoSync();
      if (data && data.keys.length) {
        data.keys.forEach(key => {
          var value = wx.getStorageSync(key);
          if (value) {
            _this.cache[key] = value;
          }
        });
        if (_this.cache.version !== _this.version) {
          _this.cache = {};
          wx.clearStorage();
        } else {
          _this.user = _this.cache.userInfo || {};
        }
      }
      wx.getSystemInfo({
        success: function (res) {
          var model = res.model.toLowerCase();
          if (model.indexOf("iphone x") > -1) {
            _this.globalData.isIponeX = true;

          }
        },
      })
    } catch (e) {
      console.warn('获取缓存失败');
    }
  },

  /**
   * 保存缓存
   */
  saveCache: function (key, value) {
    if (!key || !value) {
      return;
    }
    var _this = this;
    _this.cache[key] = value;
    wx.setStorage({
      key: key,
      data: value
    });
  },

  /**
   * 清除缓存
   */
  removeCache: function (key) {
    if (!key) {
      return;
    }
    var _this = this;
    _this.cache[key] = '';
    wx.removeStorage({
      key: key
    });
  },

  /**
   * 判断是否已经登录
   */
  loginLoad: function (onLoad) {
    var _this = this;
    if (!_this.user.openId) {
      _this.getUser((e) => {
        typeof onLoad == 'function' && onLoad(e);
      });
    } else {
      typeof onLoad == 'function' && onLoad();
    }
  },

  /**
   * 获取海报用户信息
   */
  getUser: function (callback) {
    var _this = this;
    wx.login({
      success: result => {
        if (result.code) {
          _this.getUserInfo(info => {
            _this.util.request(_this.constant.API_WX_LOGIN, {
              code: result.code,
              key: info.encryptedData,
              iv: info.iv
            }, 'POST', result => {
              setTimeout(function () {    
                var title = (result.result && result.result.nickName != undefined) ? '欢迎你，' + result.result.nickName : '欢迎你';
                wx.showToast({
                  title: title,
                  icon: 'success'
                });
              }, 1000);
              if (result.result && result.errorCode == 10000) {
                var status = false, data = result.result;
                // 判断缓存是否有更新
                if (_this.cache.version !== _this.version || _this.cache.userdata !== data) {
                  data['time'] = Date.parse(new Date())
                  _this.saveCache('version', _this.version);
                  _this.saveCache('userInfo', data);
                  _this.user = data;
                  status = true;
                }
                if (status) {
                  typeof callback == 'function' && callback();
                }
              } else {
                if (_this.cache) {
                  _this.cache = {};
                  wx.clearStorage();
                }
                typeof callback == 'function' && callback(result.errorMsg || '加载失败');
              }
            }, result => {
              _this.util.showErrorModal('接口错误，请重试。', '接口错误');
              typeof response == 'function' && callback(status);
            });
          })
        }
      }
    });
  },

  /**
   * 获取微信用户信息
   */
  getUserInfo: function (callback) {
    var _this = this;
    wx.getUserInfo({
      withCredentials: true,
      success: result => {
        typeof callback == 'function' && callback(result);
      },
      fail: result => {
        wx.showModal({
          title: '用户未授权',
          content: '如需正常使用街拍小程序，请点击确定，允许微信授权',
          success: (result) => {
            wx.openSetting()
          }
        });
      }
    })
  },


  /**
   * 收集用户formid
   */
  saveFormId: function (formId) {
    var _this = this;
    if (!_this.user.hbUserId || !_this.user.openId || formId == 'the formId is a mock one') {
      return false;
    }
    _this.util.request(_this.constant.API_SAVE_FORMID, {
      UserID: _this.user.hbUserId,
      OpenID: _this.user.openId,
      FormID: formId
    }, 'POST', function () { }, function () { }, function () { }, false);
  },

  util: require('./utils/util'),
  constant: require('./utils/constant'),
  cache: {},
  user: {},
  globalData: {
    userIndexVotePictures: {},
    voteParticipateList: {},
    userIndexVoteFlag: {},
    recommendListArr:[],
    isIponeX: false
  },

})