import * as THREE from '../../libs/three.weapp.js'
import loadObj from './loadObj'

Page({
  data: {},
  onLoad: function (option) {
    const digitaModelInfo = JSON.parse(decodeURIComponent(option.digitaModelInfo))
    wx.createSelectorQuery()
      .select('#c')
      .node()
      .exec((res) => {
        const canvas = new THREE.global.registerCanvas(res[0].node)
        loadObj(canvas, THREE, digitaModelInfo.digitalModel, digitaModelInfo.digitalModelMtl)
      })
  },
  onUnload: function () {
    THREE.global.clearCanvas()
  },
  touchStart(e) {
    console.log('canvas', e)
    THREE.global.touchEventHandlerFactory('canvas', 'touchstart')(e)
  },
  touchMove(e) {
    console.log('canvas', e)
    THREE.global.touchEventHandlerFactory('canvas', 'touchmove')(e)
  },
  touchEnd(e) {
    console.log('canvas', e)
    THREE.global.touchEventHandlerFactory('canvas', 'touchend')(e)
  },
  touchCancel(e) {
    // console.log('canvas', e)
  },
  longTap(e) {
    // console.log('canvas', e)
  },
  tap(e) {
    // console.log('canvas', e)
  },
})