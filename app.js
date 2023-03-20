// app.js
App({
  onLaunch() {
    wx.cloud.init({
      //cloud1-9gbtp1302779ba5c
      env: 'cloud1-9gbtp1302779ba5c',
      traceUser: true,
    })

    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    const systemInfo = wx.getSystemInfoSync()
    const isLogin = wx.getStorageSync('token')

    // 定义功能菜单行与胶囊对齐
    this.globalData.menuButtonInfo = menuButtonInfo
    this.globalData.systemInfo = systemInfo

    this.globalData.top = menuButtonInfo.top
    this.globalData.height = menuButtonInfo.height

    this.globalData.isLogin = isLogin
  },
  globalData: {
    menuButtonInfo: null,
    systemInfo: null,
    top: null,
    height: null,
    isLogin: false
  }
})