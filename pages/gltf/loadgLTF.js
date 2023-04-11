import gLTF from '../../jsm/loaders/GLTFLoader'
import {
  OrbitControls
} from '../../jsm/controls/OrbitControls'

let controls
export default function (canvas, THREE, gltfSrc) {
  wx.showLoading({
    title: '模型加载中...',
    mask: true
  })
  let GLTFLoader = gLTF(THREE);

  // 创建场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#aaa')
  // 创建相机
  const camera = new THREE.PerspectiveCamera(75, wx.getSystemInfoSync().windowWidth / wx.getSystemInfoSync().windowHeight, 0.1, 100)
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({
    // 抗锯齿
    antialias: true
  })
  renderer.setSize(wx.getSystemInfoSync().windowWidth, wx.getSystemInfoSync().windowHeight)

  const render = () => {
    renderer.render(scene, camera)
    controls && controls.update()
    canvas.requestAnimationFrame(render)
  }

  render()

  // 添加控制器
  controls = new OrbitControls(camera, canvas)
  controls.update()
  controls.target = new THREE.Vector3(0, 0, 0);
  // 设置阻尼因子
  controls.enableDamping = true

  // 添加gltf模型
  const gltfLoader = new GLTFLoader()
  gltfLoader.load(gltfSrc, (gltf) => {
    const model = gltf.scene

    // 计算模型的中心点和尺寸
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    // 将模型移动到坐标原点
    model.position.sub(center)

    // 计算相机距离模型的最佳距离
    const fov = camera.fov * (Math.PI / 180)
    const maxDim = Math.max(size.x, size.y, size.z)
    const distance = Math.abs(maxDim / (2 * Math.tan(fov / 2)))

    // 调整相机位置和朝向
    camera.position.set(0, 0, distance+0.2)
    camera.lookAt(0, 0, 0)

    scene.add(model)
    wx.hideLoading() 
    console.log('模型出现啦！');
  })

  // 添加灯光 四周灯光
  const light1 = new THREE.DirectionalLight(0xffffff, 1)
  light1.position.set(0, 0, 10)
  scene.add(light1)
  const light2 = new THREE.DirectionalLight(0xffffff, 1)
  light2.position.set(0, 0, -10)
  scene.add(light2)
  const light3 = new THREE.DirectionalLight(0xffffff, 1)
  light3.position.set(10, 0, 0)
  scene.add(light3)
  const light4 = new THREE.DirectionalLight(0xffffff, 1)
  light4.position.set(-10, 0, 0)
  scene.add(light4)
  const light5 = new THREE.DirectionalLight(0xffffff, 1)
  light5.position.set(0, 10, 0)
  scene.add(light5)
  const light6 = new THREE.DirectionalLight(0xffffff, 1)
  light6.position.set(0, -10, 0)
  scene.add(light6)
}