/**
 * Created by user on 2017/11/17.
 */
import md5 from './md5.min';
import {
  APP_SECRET
} from './constant';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 移除逗号分割的字符串中的其中一个元素
 */
const removeElement = (a, b) => {
  if (a == b)
    return '';
  a = a + ',';
  var _b = b + ',', idx = a.indexOf(b), idx2 = a.indexOf(_b);
  if (idx == idx2)
    a = a.replace(_b, '');
  return a.substring(0, a.lastIndexOf(','));
}

/**
 * 数组去重
 */
const arrayUnique = (array) => {
  var n = [];
  for (var i = 0; i < array.length; i++) {
    if (n.indexOf(array[i]) == -1 && array[i] != '') n.push(array[i]);
  }
  return n;
}

const request = (url, params, method, success, fail, complete, showLoading = true) => {
  // wx.showNavigationBarLoading()
  showLoading && wx.showLoading({
    title: '加载中...',
  });
  if (method == 'POST' && url.indexOf('wxa.haibao.com') != -1) {
    url = url + '&signature=' + _getSignature(url.split('?')[0], params);
  }
  wx.request({
    url: url,
    data: params,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
      //'Content-Type': 'application/json'
    },
    method: method || 'POST',
    dataType: 'json',
    success: result => {
      if (result.statusCode == 200) {
        typeof success == 'function' && success(result.data)
      } else {
        typeof fail == 'function' && fail()
      }
    },
    fail: result => {
      typeof fail == 'function' && fail()
    },
    complete: result => {
      // wx.hideNavigationBarLoading()
      showLoading && wx.hideLoading()
      typeof complete == 'function' && complete()
    }
  })
}

/**
 * 是否授权
 * scope                  对应接口                                                描述
 * scope.userInfo         wx.getUserInfo                                        用户信息
 * scope.userLocation     wx.getLocation, wx.chooseLocation                     地理位置
 * scope.address          wx.chooseAddress                                      通讯地址
 * scope.invoiceTitle     wx.chooseInvoiceTitle                                 发票抬头
 * scope.werun            wx.getWeRunData                                       微信运动步数
 * scope.record           wx.startRecord                                        录音功能
 * scope.writePhotosAlbum wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum  保存到相册
 */
const isAuthorize = (scope, callback) => {
  wx.getSetting({
    complete(result) {
      if (!result.authSetting[scope]) {
        wx.openSetting({
          success: function () {
            typeof callback == 'function' && callback()
          }
        });
      }
      typeof callback == 'function' && callback()
    }
  })
}

/**
 * 生成接口请求签名
 */
const _getSignature = (url, data) => {
  var sign = [
    'POST', url, _getSignBody(data)
  ];
  return md5(sign.join('&') + APP_SECRET);
}

const _getSignBody = (data) => {
  var keys = [], content = [];
  for (var key in data) {
    keys.push(key);
  }
  keys = keys.sort();
  keys.forEach(key => content.push(key + '=' + data[key]))
  return content.join('&');
}

/**
 * 错误弹层
 */
const showErrorModal = (content, title, success) => {
  wx.showModal({
    title: title || '加载失败',
    content: content || '未知错误',
    showCancel: false,
    success: (result) => {
      if (result.confirm) {
        typeof success == 'function' && success(result);
      }
    }
  });
}

/**
 * 显示Toast状态
 */
const showLoadToast = (title, duration) => {
  wx.showToast({
    title: title || '加载中',
    icon: 'loading',
    mask: true,
    duration: duration || 10000
  });
}

/**
 * 检查网络情况，无网络跳转到错误页面
 */
const checkNetwork = () => {
  wx.getNetworkType({
    success: result => {
      if (result.networkType == 'none') {
        wx.navigateTo({
          url: '/pages/component/error/error'
        })
      }
    }
  })
}

/**
 * 计算图片比例 1->2:3,2->1:1,3->3:2
 */
const imageRatio = (width, height) => {
  var ratio = 2;
  if (width && height) {
    var value = width / height;
    if (value < 0.83) {
      ratio = 1;
    }
    if (value >= 0.83 && value <= 1.25) {
      ratio = 2;
    }
    if (value > 1.25) {
      ratio = 3;
    }
  }
  return ratio;
}

module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  request: request,
  showErrorModal: showErrorModal,
  showLoadToast: showLoadToast,
  checkNetwork: checkNetwork,
  isAuthorize: isAuthorize,
  removeElement: removeElement,
  arrayUnique: arrayUnique,
  imageRatio: imageRatio
}
