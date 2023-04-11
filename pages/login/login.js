import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    top: getApp().globalData.top,
    height: getApp().globalData.height,
    toLogin: true,
    userForm: {
      username: '',
      password: '',
      confirm: ''
    },
    browseName: 'browse-off',
    browseConfirmName: 'browse-off',
    inputType: 'password',
    inputConfirmType: 'password'
  },
  inputUserName(e) {
    this.setData({
      'userForm.username': e.detail.value
    })
  },
  inputPassword(e) {
    this.setData({
      'userForm.password': e.detail.value
    })
  },
  inputPasswordRequire(e) {
    this.setData({
      'userForm.confirm': e.detail.value
    })
  },
  // 密码可视切换
  passwordIconTap() {
    this.setData({
      browseName: this.data.browseName === 'browse-off' ? 'browse' : 'browse-off',
      inputType: this.data.browseName === 'browse-off' ? 'text' : 'password',
      'userForm.password': this.data.userForm.password
    })
  },
  // 确认密码可视切换
  passwordConfirmIconTap() {
    this.setData({
      browseConfirmName: this.data.browseConfirmName === 'browse-off' ? 'browse' : 'browse-off',
      inputConfirmType: this.data.browseConfirmName === 'browse-off' ? 'text' : 'password',
      'userForm.confirm': this.data.userForm.confirm
    })
  },
  // 去登录
  toLogin() {
    this.setData({
      toLogin: true,
      userForm: {
        username: '',
        password: '',
        confirm: ''
      }
    })
  },
  //  登录
  async login() {
    const {
      result: {
        token,
        id,
        res
      }
    } = await wx.cloud.callFunction({
      name: 'login',
      data: this.data.userForm
    })

    wx.setStorageSync('userInfo', res)

    if (token) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '登录成功',
        theme: 'success',
        direction: 'column',
      })
      wx.setStorageSync('token', token)
      wx.setStorageSync('userId', id)

      wx.navigateTo({
        url: '/pages/index/index',
      })
    } else {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '登录失败，请检查用户名或者密码',
        theme: 'error',
        direction: 'row',
      });
    }
  },
  // 去注册
  toRegister() {
    this.setData({
      toLogin: false,
      userForm: {
        userName: '',
        password: '',
        confirm: ''
      }
    })
  },
  // 注册
  async register() {
    if (this.data.userForm.password !== '' && this.data.userForm.confirm !== '' && this.data.userForm.password === this.data.userForm.confirm) {
      const {
        result: {
          isRegister
        }
      } = await wx.cloud.callFunction({
        name: 'register',
        data: {
          userForm: this.data.userForm
        }
      })
      if (isRegister) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '用户已注册',
          theme: 'error',
          direction: 'column',
        });
      } else {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '注册成功',
          theme: 'success',
          direction: 'column',
        });
        this.toLogin()
      }
    } else if (this.data.userForm.username === '' || this.data.userForm.password === '') {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '输入框不能为空',
        theme: 'error',
        direction: 'column',
      });
    } else {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '密码不一致',
        theme: 'error',
        direction: 'column',
      });
    }
  },
  // 返回
  back() {
    wx.navigateBack({
      delta: 1
    });
  }
})