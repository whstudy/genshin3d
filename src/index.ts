import * as THREE from 'three'

import Stats from 'three/addons/libs/stats.module.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js'
import { MMDLoader } from 'three/addons/loaders/MMDLoader.js'
import { MMDAnimationHelper } from 'three/addons/animation/MMDAnimationHelper.js'

let stats: any

let mesh, camera: any, scene: any, renderer, effect: any
let helper: any, ikHelper: any, physicsHelper: any

// 时间轴
const clock = new THREE.Clock()

// 物理动画
// @ts-ignore
Ammo().then(function (AmmoLib) {
  // @ts-ignore
  Ammo = AmmoLib
  init()
})

async function init() {
  const container = document.getElementById('info')
  if (!container) {
    return alert('加载失败！！！')
  }
  document.body.appendChild(container)

  //定义镜头
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  )
  camera.position.z = 30

  // 舞台
  scene = new THREE.Scene()

  // 灯光
  // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1)
  // directionalLight.position.set(1, 1, 1).normalize()
  // scene.add(directionalLight)

  // 绘制
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)
  effect = new OutlineEffect(renderer)

  // STATS
  stats = new Stats()
  container.appendChild(stats.dom)

  // 加载进度条
  async function onProgress(xhr: any) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100
      console.log(Math.round(percentComplete) + '% downloaded')
    }
  }

  // 模型文件
  // const modelFile = '../../public/丽莎/丽莎.pmx'
  // const modelFile = './丽莎/丽莎.pmx'
  const modelFile = './夏洛蒂/夏洛蒂.pmx'
  // const modelFile = './神里绫华/神里绫华.pmx'
  // const modelFile = '../../model/kizunaai/kafka.pmx'

  // 动作文件
  // const modelFile = '../../src/mmd/miku/miku_v2.pmd'
  const vmdFiles = ['./Motion.vmd']

  // 镜头文件
  const cameraFiles = ['']
  // const vmdFiles = ['../../src/mmd/vmds/wavefile_v2.vmd']

  
  // 动画辅助器
  helper = new MMDAnimationHelper({
    afterglow: 2.0
  })

  const loader = new MMDLoader()
  // const loaderStore = new MMDLoader()

  // loaderStore.load(
  //   '../../model/gufengwutai/wt.pmx',
  //   async function (mesh) {
  //     mesh.position.y = 1
  //     let materials1 = mesh.material as THREE.Material[] | THREE.Material
  //     // 对每个材质进行处理
  //     for (let i = 0; i < (materials1 as THREE.Material[]).length; i++) {
  //       let material = materials1[i]
  //       material.lightMap = material.map // 清除光照贴图
  //       // material.emissive = new THREE.Color(0xffffff) // 设置自发光颜色
  //       material.lightMapIntensity = 5
  //       material.shininess = 1000 // 设置自发光强度
  //     }

  //     let materials2 = mesh.material
  //     for (let i = 0, il = materials2.length; i < il; i++) {
  //       materials2[i].emissive.emissiveIntensity = 2
  //     }

  //     scene.add(mesh);
  //   },
  //   function (xhr) {
  //     console.log((xhr.loaded / xhr.total * 100) + '% loadedstore');
  //   },
  //   function (error) {
  //     console.log('An error happened', error);
  //   }
  // )

  loader.loadWithAnimation(
    modelFile,
    vmdFiles,
    async function (mmd: any) {
      mesh = mmd.mesh
      mesh.position.y = 1
      // @ts-ignore
      let materials = mesh.material as THREE.Material[] | THREE.Material
      // 对每个材质进行处理
      // @ts-ignore
      for (let i = 0; i < (materials as THREE.Material[]).length; i++) {
        let material = materials[i]
        // 修改材质的光照属性
        material.lightMap = material.map // 清除光照贴图
        // material.emissive = new THREE.Color(0xffffff) // 设置自发光颜色
        material.lightMapIntensity = 3
        material.shininess = 100 // 设置自发光强度
      }

      await helper.add(mesh, {
        animation: mmd.animation,
        physics: true
      })

      loader.loadAnimation(cameraFiles, camera, function (cameraAnimation: any) {
        helper.add(camera, {
          animation: cameraAnimation
        });
      }, onProgress, null)

      ikHelper = await helper.objects.get(mesh).ikSolver.createHelper()
      ikHelper.visible = false
      scene.add(ikHelper)

      physicsHelper = await helper.objects.get(mesh).physics.createHelper()
      physicsHelper.visible = false
      scene.add(physicsHelper)

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        effect.setSize(window.innerWidth, window.innerHeight)
      }
      onWindowResize()

      function animate() {
        requestAnimationFrame(animate)
        stats.begin()
        render()
        stats.end()
      }
      animate()

      function render() {
        helper.update(clock.getDelta())
        effect.render(scene, camera)
      }
      scene.add(mesh)
    },

    onProgress,
    null
  )

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 10
  controls.maxDistance = 100
}
