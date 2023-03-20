import Toast from 'tdesign-miniprogram/toast/index';
import Dialog from 'tdesign-miniprogram/dialog/index';

Page({
  data: {
    top: getApp().globalData.top,
    height: getApp().globalData.height,
    current: 0,
    artifectId: '',
    artifectDetailInfo: {}, // 文物详情
    autoplay: true
  },
  onLoad(e) {
    this.setData({
      artifectId: e.artifectId
    })
    this.getArtifectById()
  },
  onChange(e) {
    const {
      current
    } = e.detail;

    this.setData({
      current
    })
  },
  // 获取文物信息(ById)
  async getArtifectById() {
    const {
      result: {
        artifect
      }
    } = await wx.cloud.callFunction({
      name: 'getArtifectById',
      data: {
        artifectId: this.data.artifectId
      }
    })


    const temp = [...artifect]
    temp.forEach((item, index) => {
      if (item.like.includes(wx.getStorageSync('userId'))) {
        item.isLike = true
      } else {
        item.isLike = false
      }

      if (item.collection.includes(wx.getStorageSync('userId'))) {
        item.isCollect = true
      } else {
        item.isCollect = false
      }
    })

    this.setData({
      artifectDetailInfo: temp[0]
    })
  },
  // 查看3D
  view3DTap(e) {
    const digitaModelInfo = {
      digitalModel: e.currentTarget.dataset.digitalModel,
      digitalModelMtl: e.currentTarget.dataset.digitalModelMtl
    }
    wx.navigateTo({
      url: `/pages/obj/index?digitaModelInfo=${encodeURIComponent(JSON.stringify(digitaModelInfo))}`,
    })
  },
  // 图片预览
  previewImage(e) {
    const {
      currentTarget: {
        dataset: {
          imgList
        }
      },
      detail: {
        index
      }
    } = e

    wx.previewImage({
      current: imgList[index],
      urls: imgList,

    })
  },
  // 轮播图长按保存
  longpress(e) {
    const {
      target: {
        dataset: {
          imgList,
          index
        }
      }
    } = e

    this.setData({
      autoplay: false
    })
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: (res) => {
        if (res.tapIndex == 0) {
          wx.downloadFile({
            url: imgList[index], // 需要下载的图片链接
            success: (res) => {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  this.setData({
                    autoplay: true
                  })
                },
                fail: () => {
                  this.setData({
                    autoplay: true
                  })
                }
              });
            },
            fail: () => {
              this.setData({
                autoplay: true
              })
            }
          });
        }
      }
    });
  },
  // 返回
  back() {
    wx.navigateBack({
      delta: 1
    });
  },
  // 分享成功
  showSuccessToast() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '分享成功',
      theme: 'success',
      direction: 'column',
    });
  },
  // 分享
  share() {
    this.showSuccessToast()
  },
  // 喜欢
  async like(e) {
    if (wx.getStorageSync('token')) {
      const artifectId = e.currentTarget.dataset.artifectid

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

      let userLike = userInfo.like

      let currLike = this.data.artifectDetailInfo.like

      const hasLiked = currLike.includes(wx.getStorageSync('userId'))

      if (hasLiked) {
        currLike.splice(currLike.findIndex(item => item === wx.getStorageSync('userId')), 1, 'testIndex')
      } else {
        currLike.push(wx.getStorageSync('userId'))
      }

      await wx.cloud.callFunction({
        name: 'updateArtifectInfo',
        data: {
          artifectId,
          like: currLike
        }
      })

      if (hasLiked) {
        userLike.splice(userLike.findIndex(item => item._id === artifectId), 1)
      } else {
        userLike.push(this.data.artifectDetailInfo)
      }

      await wx.cloud.callFunction({
        name: 'updateUserInfo',
        data: {
          userId: wx.getStorageSync('userId'),
          like: userLike
        }
      })

      await this.getArtifectById()
    } else {
      this.showDialog()
    }
  },
  // 收藏
  async collect(e) {
    if (wx.getStorageSync('token')) {
      const artifectId = e.currentTarget.dataset.artifectid

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

      let currCollection = this.data.artifectDetailInfo.collection

      const hasCollect = currCollection.includes(wx.getStorageSync('userId'))

      let userCollection = userInfo.collection

      if (hasCollect) {
        currCollection.splice(currCollection.findIndex(item => item === wx.getStorageSync('userId')), 1, 'testIndex')
      } else {
        currCollection.push(wx.getStorageSync('userId'))
      }

      await wx.cloud.callFunction({
        name: 'updateArtifectInfo',
        data: {
          artifectId,
          collection: currCollection
        }
      })

      if (hasCollect) {
        userCollection.splice(userCollection.findIndex(item => item._id === artifectId), 1)
      } else {
        userCollection.push(this.data.artifectDetailInfo)
      }

      await wx.cloud.callFunction({
        name: 'updateUserInfo',
        data: {
          userId: wx.getStorageSync('userId'),
          collection: userCollection
        }
      })

      await this.getArtifectById()
    } else {
      this.showDialog()
    }
  },
  // 对话框
  showDialog() {
    const dialogConfig = {
      context: this,
      title: '无法操作',
      content: '您尚未登录，无法点赞或收藏该商品。',
      confirmBtn: '去登录',
      cancelBtn: '取消',
    };

    Dialog.confirm(dialogConfig)
      .then(() => wx.navigateTo({
        url: '/pages/login/login',
      }))
      .catch(() => console.log('点击了取消'))
      .finally(() => Dialog.close());
  }
})