Page({
  data: {
    top: getApp().globalData.top,
    height: getApp().globalData.height,
    isEdit: false,
    isShowlikeCard: true,
    isLogin: wx.getStorageSync('token'),
    userInfo: {},
    newInputValue: '',
    artifects: []
  },
  onShow() {
    this.getUserInfo()
  },
  onLoad(e) {
    this.setData({
      isLogin: wx.getStorageSync('token'),
      artifects: JSON.parse(decodeURIComponent(e.artifects))
    })
  },
  // 获取用户信息
  async getUserInfo() {
    const {
      result: {
        userInfo
      }
    } = await wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        userId: wx.getStorageSync('userId')
      }
    })

    this.setData({
      userInfo,
      newInputValue: this.data.userInfo?.username
    })
  },
  // 输入监听
  inputTap({
    detail: {
      value
    }
  }) {

    this.setData({
      newInputValue: value
    })
  },
  // 修改
  edit() {
    this.setData({
      isEdit: !this.data.isEdit,
      newInputValue: this.data.userInfo?.username
    })
  },
  // 取消修改
  cancel() {
    this.setData({
      isEdit: false,
      'userInfo.username': this.data.userInfo?.username
    })
  },
  // 确认修改
  async confirm() {
    await wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        userId: wx.getStorageSync('userId'),
        username: this.data.newInputValue
      }
    })
    wx.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 2000
    })
    this.setData({
      isEdit: false
    })
    this.getUserInfo()
  },

  likeTap() {
    this.setData({
      isShowlikeCard: true
    })
  },
  // 跳转详情页面
  toDetail(e) {
    const index = e.currentTarget.dataset.index

    wx.navigateTo({
      url: `/pages/detail/detail?artifectId=${this.data.artifects[index]._id}`,
    })
  },
  // 我的收藏
  collectTap() {
    this.setData({
      isShowlikeCard: false
    })
  },
  // 返回
  back() {
    wx.navigateBack({
      delta: 1
    });
  },
  // 跳转登录页
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  // 退出
  loginout() {
    wx.removeStorageSync('token')
    wx.removeStorageSync('userId')

    this.setData({
      isLogin: wx.getStorageSync('token')
    })
  }
})