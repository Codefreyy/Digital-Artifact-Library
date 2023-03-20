import Dialog from 'tdesign-miniprogram/dialog/index';
import {
  debounce
} from '../../utils/debounce'

Page({
  data: {
    top: getApp().globalData.top,
    height: getApp().globalData.height,
    isShowFilterDownMenu: false, // 是否显示filter下拉菜单
    isShownameOrNoDownMenu: false, // 是否显示nameOrNo下拉菜单
    // 筛选列表
    filterListObj: {
      category: [{
          text: '绘画',
          value: 'paitings',
          checkd: false,
        },
        {
          text: '法书',
          value: 'calligraphy',
          checkd: false,
        }, {
          text: '碑帖',
          value: 'inscription',
          checkd: false,
        },
        {
          text: '铜器',
          value: 'bronze',
          checkd: false,
        },
        {
          text: '金银器',
          value: 'gold_and_silver',
          checkd: false,
        },
        {
          text: '玉石器',
          value: 'jade_and_stone',
          checkd: false,
        },
        {
          text: '漆器',
          value: 'Lacquerware',
          checkd: false,
        },
        {
          text: '珐琅器',
          value: 'Enamelware',
          checkd: false,
        },
        {
          text: '雕刻',
          value: 'carving',
          checkd: false,
        },
        {
          text: '织绣',
          value: 'weaving',
          checkd: false,
        },
        {
          text: '文具',
          value: 'literary_tools',
          checkd: false,
        },
        {
          text: '生活用具',
          value: 'household_tools',
          checkd: false,
        },
        {
          text: '钟表仪器',
          value: 'watch_instruments',
          checkd: false,
        },
        {
          text: '钱币',
          value: 'money',
          checkd: false,
        },
        {
          text: '外国文物',
          value: 'foreign_artifects',
          checkd: false,
        },
        {
          text: '帝后玺册',
          value: 'emperor_seal',
          checkd: false,
        },
        {
          text: '古籍文献',
          value: 'antiquarian',
          checkd: false,
        },
        {
          text: '武备仪仗',
          value: 'ceremonies',
          checkd: false,
        },
        {
          text: '宗教文物',
          value: 'religious_relics',
          checkd: false,
        },
        {
          text: '古建藏品',
          value: 'ancient_building',
          checkd: false,
        }
      ], // 分类
      dynasty: [{
          text: '新石器时代',
          value: 'neolithic',
          checkd: false,
        },
        {
          text: '夏',
          value: 'xia',
          checkd: false,
        },
        {
          text: '商',
          value: 'shang',
          checkd: false,
        },
        {
          text: '周',
          value: 'zhou',
          checkd: false,
        },
        {
          text: '春秋',
          value: 'spring_and_autumn',
          checkd: false,
        },
        {
          text: '战国',
          value: 'warring_states',
          checkd: false,
        },
        {
          text: '秦',
          value: 'qin',
          checkd: false,
        },
        {
          text: '汉',
          value: 'han',
          checkd: false,
        },
        {
          text: '三国',
          value: 'three_kingdoms',
          checkd: false,
        },
        {
          text: '魏晋',
          value: 'wei_and_jin',
          checkd: false,
        },
        {
          text: '南北朝',
          value: 'nothern_and_southern_dynasties',
          checkd: false,
        },
        {
          text: '隋',
          value: 'sui',
          checkd: false,
        },
        {
          text: '唐',
          value: 'tang',
          checkd: false,
        },
        {
          text: '五代十国',
          value: 'five_dynasties_ten_kingdoms',
          checkd: false,
        },
        {
          text: '辽',
          value: 'liao',
          checkd: false,
        },
        {
          text: '宋',
          value: 'song',
          checkd: false,
        },
        {
          text: '金',
          value: 'jin',
          checkd: false,
        },
        {
          text: '元',
          value: 'yuan',
          checkd: false,
        },
        {
          text: '明',
          value: 'ming',
          checkd: false,
        },
        {
          text: '清',
          value: 'qing',
          checkd: false,
        },
        {
          text: '近现代',
          value: 'modern_times',
          checkd: false,
        }
      ] // 朝代
    },
    // 筛选结果列表
    filterResultObj: {
      category: [],
      dynasty: []
    },
    filterTypeObj: {
      categoryType: '全部类别',
      categoryList: [],
      dynastyType: '全部朝代',
      dynastyList: []
    },
    nameList: [{
      text: '名称',
      value: 'name',
      checkd: true,
    }, {
      text: '编号',
      value: 'No',
      checkd: false,
    }],
    artifectList: [], // 文物列表
    artifectTotal: 0, // 文物数量
    nameName: '名称',
    isImg: true, // 是否切换到图文模式
    scrollTop: 0,
    backTopVisible: false,
    filterIconName: 'chevron-down',
    nameIconName: 'chevron-down',
    keyword: '', // 搜索关键词
  },
  onShow() {
    this.searchGroup()
  },
  onScroll(e) {
    this.setData({
      scrollTop: e.detail.scrollTop,
      backTopVisible: e.detail.scrollTop > 500
    })
  },
  // 获取所有文物信息
  async getArtifect(filterTypeObj, type, keyword) {
    const {
      result: {
        total,
        artifects
      }
    } = await wx.cloud.callFunction({
      name: 'getArtifect',
      data: {
        filterTypeObj,
        type,
        keyword
      }
    })

    const temp = [...artifects]
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
      artifectList: temp,
      artifectTotal: total
    })
  },
  // 回到顶部
  onToTop() {
    this.setData({
      scrollTop: 0
    })
  },
  // 输入框聚焦
  focus() {
    this.setData({
      isShowFilterDownMenu: false,
      isShownameOrNoDownMenu: false,
      filterIconName: 'chevron-down',
      nameIconName: 'chevron-down'
    })
  },
  // 输入框监听
  input: debounce(function (e) {
    this.setData({
      keyword: e[0].detail.value
    })
    this.searchGroup()
  }, 500),
  //筛选方法
  async searchGroup() {
    let filterTypeObj = this.data.filterTypeObj

    let type = this.data.nameName

    let keyword = this.data.keyword
    await this.getArtifect(filterTypeObj, type, keyword)
  },
  // 筛选下拉框点击
  filterTap() {
    this.setData({
      isShowFilterDownMenu: !this.data.isShowFilterDownMenu,
      isShownameOrNoDownMenu: false,
      filterIconName: this.data.isShowFilterDownMenu ? 'chevron-down' : 'chevron-up',
      nameIconName: 'chevron-down'
    })
  },
  // 类别筛选点击
  async categoryTagTap(e) {
    const {
      currentTarget: {
        dataset: {
          item
        }
      }
    } = e

    const tempArr = this.data.filterListObj.category
    tempArr.forEach(temp => {
      if (temp.value === item.value) {
        temp.checkd = !item.checkd
      }
    })

    const tempResArr = this.data.filterResultObj.category
    const index = tempResArr.findIndex(temp => temp.value === item.value)
    if (item.checkd) {
      tempResArr.splice(index, 1)
    } else {
      tempResArr.push({
        ...item,
        checkd: !item.checkd
      })
    }

    let filterTypeObj = {}

    if (tempResArr.length === 0) {
      filterTypeObj.categoryType = '全部类别'
      filterTypeObj.categoryList = []
    } else {
      filterTypeObj.categoryType = '类别'
      filterTypeObj.categoryList = this.data.filterListObj.category.filter(item => item.checkd).map(item => item.value)
    }

    this.setData({
      'filterListObj.category': tempArr,
      'filterResultObj.category': tempResArr,
      'filterTypeObj.categoryType': filterTypeObj.categoryType,
      'filterTypeObj.categoryList': filterTypeObj.categoryList
    })

    await this.searchGroup()
  },
  // 朝代筛选点击
  async dynastyTagTap(e) {
    const {
      currentTarget: {
        dataset: {
          item
        }
      }
    } = e

    const tempArr = this.data.filterListObj.dynasty
    tempArr.forEach(temp => {
      if (temp.value === item.value) {
        temp.checkd = !item.checkd
      }
    })

    const tempResArr = this.data.filterResultObj.dynasty
    const index = tempResArr.findIndex(temp => temp.value === item.value)

    if (item.checkd) {
      tempResArr.splice(index, 1)
    } else {
      tempResArr.push({
        ...item,
        checkd: !item.checkd
      })
    }

    let filterTypeObj = {}

    if (tempResArr.length === 0) {
      filterTypeObj.dynastyType = '全部朝代'
      filterTypeObj.dynastyList = []
    } else {
      filterTypeObj.dynastyType = '朝代'
      filterTypeObj.dynastyList = this.data.filterListObj.dynasty.filter(item => item.checkd).map(item => item.value)
    }

    this.setData({
      'filterListObj.dynasty': tempArr,
      'filterResultObj.dynasty': tempResArr,
      'filterTypeObj.dynastyType': filterTypeObj.dynastyType,
      'filterTypeObj.dynastyList': filterTypeObj.dynastyList
    })

    await this.searchGroup()
  },
  // 名称编号下拉框点击
  nameOrNoTap() {
    this.setData({
      isShownameOrNoDownMenu: !this.data.isShownameOrNoDownMenu,
      isShowFilterDownMenu: false,
      nameIconName: this.data.isShownameOrNoDownMenu ? 'chevron-down' : 'chevron-up',
      filterIconName: 'chevron-down'
    })
  },
  // 名称编号下拉框选项点击
  nameOrNoSelectItemTap(e) {
    const {
      target: {
        dataset: {
          item: {
            text,
            value
          }
        }
      }
    } = e

    const arr = [...this.data.nameList]

    arr.forEach(item => {
      if (item.value === value) {
        item.checkd = true
      } else {
        item.checkd = false
      }
    })

    this.setData({
      nameName: text,
      nameList: arr
    })

    this.searchGroup()
  },
  // 跳转我的
  toMine() {
    const obj = JSON.stringify(this.data.artifectList)

    wx.navigateTo({
      url: `/pages/mine/mine?artifects=${encodeURIComponent(obj)}`,
    })
  },
  // 跳转详情页面
  toDetail(e) {
    const index = e.currentTarget.dataset.index

    wx.navigateTo({
      url: `/pages/detail/detail?artifectId=${this.data.artifectList[index]._id}`,
    })
  },
  // 图文切换
  toggleImg({
    detail: {
      value
    }
  }) {
    this.setData({
      isImg: value
    })
  },
  // 喜欢
  async like(e) {
    if (wx.getStorageSync('token')) {
      const artifectId = e.currentTarget.dataset.artifectid
      const index = e.currentTarget.dataset.index

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

      let currLike = this.data.artifectList.find(item => item._id === artifectId).like

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

      await this.searchGroup()

      if (hasLiked) {
        userLike.splice(userLike.findIndex(item => item._id === artifectId), 1)
      } else {
        userLike.push(this.data.artifectList[index])
      }

      await wx.cloud.callFunction({
        name: 'updateUserInfo',
        data: {
          userId: wx.getStorageSync('userId'),
          like: userLike
        }
      })

    } else {
      this.showDialog()
    }
  },
  // 收藏
  async collect(e) {
    if (wx.getStorageSync('token')) {
      const artifectId = e.currentTarget.dataset.artifectid
      const index = e.currentTarget.dataset.index
      console.log(index)

      let currCollection = this.data.artifectList.find(item => item._id === artifectId).collection

      const hasCollect = currCollection.includes(wx.getStorageSync('userId'))

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
      console.log(hasCollect)
      await this.searchGroup()

      if (hasCollect) {
        userCollection.splice(userCollection.findIndex(item => item._id === artifectId), 1)
      } else {
        userCollection.push(this.data.artifectList[index])
      }
      console.log(this.data.artifectList)
      console.log(userCollection)
      await wx.cloud.callFunction({
        name: 'updateUserInfo',
        data: {
          userId: wx.getStorageSync('userId'),
          collection: userCollection
        }
      })
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