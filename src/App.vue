<script setup lang="ts">
  import * as THREE from 'three'
  import Stats from 'three/addons/libs/stats.module.js'
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
  import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js'
  import { MMDLoader } from 'three/addons/loaders/MMDLoader.js'
  import { MMDAnimationHelper } from 'three/addons/animation/MMDAnimationHelper.js'
  import { ref, nextTick } from 'vue'
  // import { useLocalStorage } from './hook/useLocalStorage';
  import { useURLSearchParams } from './hook/useURLSearchParams';
  

  const vmdList = [
    {
      name: '7rings',
      music: '7rings.mp3',
      vmd: '7rings.vmd',
    },
    {
      name: 'Señorita',
      music: 'Señorita.mp3',
      vmd: 'Señorita.vmd',
    },
    {
      name: 'Phut_hon_motion_1',
      music: 'Phut hon_motion_v1.1.mp3',
      vmd: 'Phut_hon_motion_1.vmd',
      // noIk: true,
    },
    {
      name: 'Phut_hon_motion_2',
      music: 'Phut hon_motion_v1.1.mp3',
      vmd: 'Phut_hon_motion_2.vmd',
      // noIk: true,
    },
    {
      name: 'Phut hon_motion_v1.1',
      music: 'Phut hon_motion_v1.1.mp3',
      vmd: 'Phut Phut_hon_motion_3.1.vmd',
      // noIk: true,
    },
    {
      name: 'Phut hon_motion_v1.1',
      music: 'Phut hon_motion_v1.1.mp3',
      vmd: 'Phut Phut_hon_motion_0.1.vmd',
      // noIk: true,
    },
    {
      name: '笑容',
      music: '还是你的笑容最可爱.mp3',
      vmd: '还是你的笑容最可爱.vmd',
      noIk: true,
    },
    {
      name: '兔子舞',
      music: '兔子舞.mp3',
      vmd: '兔子舞.vmd',
    },
    {
      name: '热爱105℃的你',
      music: '热爱105℃的你音频.mp3',
      vmd: '热爱105℃的你.vmd',
      noIk: true
    },
    {
      name: 'stay tonight',
      music: 'stay-tonight.mp3',
      vmd: 'stay-tonight.vmd',
      offset: -0.9
    },
    {
      name: 'APT',
      music: './apt/apt.mp3',
      vmd: './apt/apt.vmd',
    },
    {
      name: '爱你（长）',
      music: '爱你（长）.mp3',
      vmd: '爱你（长）.vmd',
      noIk: true,
    },
    {
      name: '爱你（短）',
      music: '爱你（短）.mp3',
      vmd: '爱你（短）.vmd',
      noIk: false,
    }
  ]

  const pmxList = [
    'TDA式改变洛天依-TID Blue Lolita.Ver',
    `星穹铁道—男主`,
    `星穹铁道—女主`,
    `【深空之眼】幽月·塞勒涅-海滩漫步`,
    `【深空之眼】曦光·阿尔忒弥斯-炫色夏虹`,
    `刻晴`,
    `哈迪斯泳装`,
    `夏洛蒂`,
    `英招泳装`,
    `布莱泽奥特曼`,
    `幽兰黛尔—完美假日`,
    `深空之眼—伊邪那美泳装3.0`,
    `深空之眼—国常立泳装`,
    `深空之眼—大国主泳装`,
    `深空之眼—波塞冬泳装2.0`,
    `爱莉希雅泳装`,
    `琳妮特`,
    `甘雨泳装`,
    `胡桃-海灯节`,
    `胡桃泳装`,
    `英招泳装清凉版`,
    `薇蒂雅-龙舌兰 舞夜与焰`,
    `辰星-琼弦 慵倚花阴`,
    `钟离`,
    `雷电将军泳装`,
    '奶牛女仆装',
  ]
  const pmxListFirstName = pmxList[0]
  let stats: any

  let mesh: any, camera: any, scene: any, renderer, effect: any
  let helper: any, physicsHelper: any
  //  ikHelper: any,
  let mixer: any, AnimationAction: any, autoRotateRef: any
  // oceanAmbientSound: any,
  let modelFile: any, controls: any
  const progressTxt = ref(0)
  const progressTxtShow =ref(true)
  // 时间轴
  const clock = new THREE.Clock()

  // 物理动画
  // @ts-ignore
  Ammo().then(function (AmmoLib) {
    // @ts-ignore
    Ammo = AmmoLib
    init()
  })

  // 模型文件
  // const modelFile = '../../public/丽莎/丽莎.pmx'
  // const modelFile = './丽莎/丽莎.pmx'
  // const modelFile = './夏洛蒂/夏洛蒂.pmx'
  // modelFile = localStorage.getItem(`name`) || './布莱泽奥特曼/布莱泽有骨.pmx'
  // const modelFile = './幽兰黛尔—完美假日/幽兰黛尔1.0.pmx'
  // const modelFile = './巡天·英招-听风消夏/英招泳装.pmx'
  // const modelFile = './薇蒂雅-龙舌兰 舞夜与焰/薇蒂雅-龙舌兰 舞夜与焰a1.0.pmx'
  modelFile = localStorage.getItem(`name`) || `./${pmxListFirstName}/${pmxListFirstName}.pmx`
  // const modelFile = './深空之眼—伊邪那美泳装3.0/伊邪那美泳装2.0.pmx'
  // const modelFile = './深空之眼—大国主泳装/大国主泳装.pmx'
  // const modelFile = './爱莉希雅泳装/爱莉希雅泳装 1.0.pmx'
  // const modelFile = './辰星-琼弦 慵倚花阴/辰星-琼弦 慵倚花阴a1.0.pmx'
  // const modelFile = './胡桃-海灯节/胡桃-海灯节.pmx'
  // const modelFile = './神里绫华/神里绫华.pmx'
  // const modelFile = '../../model/kizunaai/kafka.pmx'
  // const vmdFileRef = useLocalStorage('vmdObj', vmdFileRef.value || vmdList[0])
  // const vmdFileRef = ref(JSON.parse(localStorage.getItem('vmdObj') || JSON.stringify(vmdList[0])))

  const vmdFileRef =  useURLSearchParams('vmdObj', vmdList[0])

  const physicsOpenFlag = useURLSearchParams('physicsOpenFlag', false, true)

  // const physicsOpenFlag = JSON.parse(localStorage.getItem('physicsOpenFlag') || `false`)
  // const ikOpenFlag = useLocalStorage('ikOpenFlag', true)
  // const showFlag = JSON.parse(localStorage.getItem('showFlag') || `false`)
  const showFlag = useURLSearchParams('showFlag', false)

  async function init() {
    const container = document.getElementById('info') as HTMLElement
    container.innerHTML = ''
    if (!container) {
      console.log('加载失败！！！')
      return
    }
    // document.body.appendChild(container)

    //定义镜头
    camera = new THREE.PerspectiveCamera(
      45,  
      // 85,
      window.innerWidth / window.innerHeight,
      3,
      2000
    )

    camera.position.z = 60

    // 舞台
    scene = new THREE.Scene()
    scene.children = []

    // 灯光
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1)
    // directionalLight.position.set(1, 1, 1).normalize()
    // scene.add(directionalLight)

    // 聚光灯
    const spotLight = new THREE.SpotLight(0xffffff, 0.1)
    spotLight.position.set(-40, 50, 30)
    spotLight.castShadow = true;
    scene.add(spotLight)

    // 创建地面
    // const planeGeometry = new THREE.PlaneGeometry(100, 100);
    // plane.rotation.x = -90 * Math.PI / 180 // 地面 x轴 旋转-90度
    const planeGeometry = new THREE.CylinderGeometry( 36, 36, 1, 100 );
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -10.6
    plane.receiveShadow = true;
    // scene.add(plane);

    // 绘制
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement)
    effect = new OutlineEffect(renderer)

    // STATS
    stats = new Stats()
    container.appendChild(stats.dom)

    // 加载进度条
    async function onProgress(xhr: any) {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100
        // console.log(Math.round(percentComplete))
        progressTxt.value = Math.round(percentComplete)
        if (progressTxt.value >= 100) {
          setTimeout(()=> {
            progressTxtShow.value = false
          }, 1000)
        }
      }
    }

    // const axesHelper = new THREE.AxesHelper(5)
    // scene.add(axesHelper)

    // 动作文件
    // const modelFile = '../../src/mmd/miku/miku_v2.pmd'
    // const vmdFiles = ['./Motion.vmd']
    const vmdFiles = [`./${vmdFileRef.value.vmd}`]

    // 镜头文件
    // const cameraFiles = ['']
    // const vmdFiles = ['../../src/mmd/vmds/wavefile_v2.vmd']
    
    // 动画辅助器
    helper = new MMDAnimationHelper({
      afterglow: 0,
      pmxAnimation: true
    })

    // helper.enable('ik', ikOpenFlag.value)
    if (vmdFileRef.value.noIk) {
      helper.enable('ik', false)
    }
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

    // autoRotateRef = useLocalStorage('autoRotateRef', true)
    autoRotateRef = useURLSearchParams('autoRotateRef', true)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = autoRotateRef.value; // 是否自动旋转
    controls.autoRotateSpeed = 10
    controls.enableDamping = true; // 启用阻尼效果（惯性效果）
    controls.dampingFactor = 0.05; // 阻尼系数
    controls.rotateSpeed = 2;      // 桌面端默认1.0，移动端建议0.3~0.7
    controls.touchAction = 'pan-y';   // 避免页面滚动冲突

    controls.keys = {
        LEFT: 'ArrowLeft', //left arrow
        UP: 'ArrowUp', // up arrow
        RIGHT: 'ArrowRight', // right arrow
        BOTTOM: 'ArrowDown' // down arrow
    }

    // controls.minDistance = 10
    controls.maxDistance = 1000

    loader.loadWithAnimation(
      modelFile,
      vmdFiles,
      async function (mmd: any) {
        mesh = mmd.mesh
        mesh.position.y = -10
        mesh.castShadow = true
        // mesh.emissive = 0
        // @ts-ignore
        let materials = mesh.material as THREE.Material[] | THREE.Material
        // 对每个材质进行处理
        // @ts-ignore
        for (let i = 0; i < (materials as THREE.Material[]).length; i++) {
          let material = materials[i]

          if (showFlag.value) {
            if (modelFile.indexOf('星穹铁道') === -1) {
              if ([
                `背饰`, 
                '衣饰铁',
                '吊饰',
                '外套',
                '外套2',
                'metal',
                `skirt`, 
                `bag`, 
                `bag_metal`, 
                `cloth_aplha`, 
                `cloth_alpha`, 
                'waitao',
                '兔子',
                '花'
              ].includes(material.name) || material.name.indexOf('充气') > -1) {
                material.visible = false
              }
            }
            if (modelFile.indexOf(`国常立`) === -1 && modelFile.indexOf(`爱莉希雅`) === -1 && modelFile.indexOf(`辰星-琼弦 慵倚花阴`) === -1) {
              if ([
                `背饰鱼`, 
                `裙子`, 
                `裙子1`, 
                `衣边`, 
                `裙饰`, 
                `裙带`, 
                `裙带1`,
              ].includes(material.name)) {
                material.visible = false
              }
            }
            if (modelFile.indexOf(`龙舌兰`) > -1) {
              if ([`前裙`, `腿部带`, `手环布`, '后裙的', '后裙', '腿带', '腿带+', '手环', '袖带', '衣饰1', '衣服'].includes(material.name)) {
                material.visible = false
              } 
            }
          }

          if (i<6&&i>2) {
            // material.visible = false
          }
          material.shininess = 100
          material.matcapCombine = 100
          // 修改材质的光照属性
          material.lightMap = material.map // 清除光照贴图
          material.lightMapIntensity = 3
          if (modelFile.indexOf('完美假日') > -1 && material.name === '皮肤') {
            material.lightMapIntensity = 5
          }
          material.shininess = 100 // 设置自发光强度
          // material.emissive = new THREE.Color(0xffffff) // 设置自发光颜色

          material.transmission = 0.0, // 折射度，表示光线经过材料时的衰减程度
          // clearcoat: 1,
          // clearcoatRoughness: 0,
          material.refractionRatio = 1.5 // 折射率，控制光的折射程度
        }

        await helper.add(mesh, {
          animation: mmd.animation,
          physics: physicsOpenFlag.value,
        })

        // loader.loadAnimation(cameraFiles, camera, function (cameraAnimation: any) {
        //   helper.add(camera, {
        //     animation: cameraAnimation
        //   });
        // }, onProgress, null)


        /**
         * 播放编辑好的关键帧数据
         */
        mixer = helper.objects.get( mesh ).mixer; //创建混合器
        AnimationAction = mixer.clipAction(mmd.animation); //返回动画操作对象
        // mixer.timeScale = 0;
        AnimationAction.clampWhenFinished = true;
        // AnimationAction.time = 10; //操作对象设置开始播放时间
        // mmd.animation.duration = AnimationAction.time;//剪辑对象设置播放结束时间
        AnimationAction.play()
        AnimationAction.paused = true;

        // ikHelper = await helper.objects.get(mesh).ikSolver.createHelper()
        // ikHelper.visible = true
        // scene.add(ikHelper)

        if (physicsOpenFlag.value) {
          physicsHelper = await helper.objects.get(mesh).physics.createHelper()
          physicsHelper.visible = false
          scene.add(physicsHelper)
        }

        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          effect.setSize(window.innerWidth, window.innerHeight)
        }
        onWindowResize()

        function animate() {
          requestAnimationFrame(animate)
          controls.update(10);
          stats.begin()
          render()
          stats.end()
        }
        function render() {
          helper.update(clock.getDelta())
          effect.render(scene, camera)
        }
        animate()
        scene.add(mesh)

        // // 初始化一个监听
        // const audioListener = new THREE.AudioListener();

        // // 把监听添加到camera
        // camera.add( audioListener );

        // // 初始化音频对象
        // oceanAmbientSound = new THREE.Audio( audioListener );

        // // 添加一个音频对象到场景中
        // scene.add( oceanAmbientSound );

        // // 加载资源
        // new THREE.AudioLoader().load(
        //   // 资源URL
        //   './Music.mp3',
        //   // onLoad回调
        //   function ( audioBuffer: any ) {
        //     // 给一个加载器对象设置音频对象的缓存
        //     oceanAmbientSound.setBuffer( audioBuffer );
        //     oceanAmbientSound.setLoop(true); //是否循环
        //     oceanAmbientSound.setVolume(1); //音量
        //   },
        //   // onProgress回调
        //   // function ( xhr: any ) {
        //   //   console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        //   // },

        //   // onError回调
        //   function ( err: any ) {
        //     console.log( 'An error happened', err );
        //   }
        // );
      },

      onProgress,
      null
    )

  }

  let showPlay = ref(true)



// <audio id="myAudio" controls style="display: none">
//   <source src="/i/audio/song.mp3" type="audio/mpeg">
//   <source src="/i/audio/song.ogg" type="audio/ogg">
//   您的浏览器不支持 audio 元素。
// </audio><br><br>

// <button onclick="getCurTime()" type="button">获取当前时间位置</button>
// <button onclick="setCurTime()" type="button">将时间位置设置为 1 秒</button>

// <script>
// var x = document.getElementById("myAudio");
// function getCurTime() { 
//   alert(x.currentTime);
// } 

// function setCurTime() { 
//   x.play()
//   x.currentTime = 1;
// } 

  const currentTimeInput = ref(0)

  const ratechange = async (e: any) => {
    mixer.timeScale = e.target?.defaultPlaybackRate
  }

  const updateTime = async (e: any) => {
    if (AnimationAction.paused || e.target?.currentTime < 1) {
      AnimationAction.time = e.target?.currentTime - (vmdFileRef.value.offset || 0)
    }
  }

  const toDuration = async () => {
    const time = currentTimeInput.value
    // @ts-ignore
    document.getElementById("myAudio").currentTime = time
    AnimationAction.time = time - vmdFileRef.value.offset || 0
  }

  const play = async () => {
    // physicsHelper = await helper.objects.get(mesh).physics.createHelper()
    // physicsHelper.visible = false
    // scene.add(physicsHelper)
    controls.autoRotate = false
    autoRotateRef.value = false
    // mixer.timeScale = 1; //开始播放
    AnimationAction.paused = false
    AnimationAction.play()
    // 播放音频
    // oceanAmbientSound.play();
    // document.getElementById("myAudio").play()
    showPlay.value = false
  }

  const pause = () => {
    // mixer.timeScale = 0; //开始播放
    AnimationAction.paused = true
    // 播放音频
    // oceanAmbientSound.pause();
    // document.getElementById("myAudio").pause()
    showPlay.value = true
  }
  
  const modelFileRef = ref(modelFile)
  const changeMode = () => {
    // oceanAmbientSound.stop();
    // showPlay.value = true
    // modelFile = modelFileRef.value
    localStorage.setItem(`name`, modelFileRef.value)
    location.reload()
    // init()
  }

  const cameraScale = () => {
    autoRotateRef.value = !autoRotateRef.value
    controls.autoRotate = !controls.autoRotate; // 是否自动旋转
  }

  const physicsSwitch = () => {
    physicsOpenFlag.value = !physicsOpenFlag.value
    // localStorage.setItem(`physicsOpenFlag`, JSON.stringify(!physicsOpenFlag))
    nextTick(() => {
      location.reload()
    })
  }

  // const ikSwitch = () => {
  //   ikOpenFlag.value = !ikOpenFlag.value
  //   helper.enable('ik', ikOpenFlag.value)
  //   // localStorage.setItem(`physicsOpenFlag`, JSON.stringify(!physicsOpenFlag))
  //   // location.reload()
  // }

  const changeShow = () => {
    showFlag.value = !showFlag.value
    // localStorage.setItem(`showFlag`, JSON.stringify(!showFlag))
    nextTick(() => location.reload())
  }

  const changeVmd = () => {
    // localStorage.setItem(`vmdObj`, JSON.stringify(vmdFileRef.value))
    location.reload()
  }

  const add = () => {
    AnimationAction.time = AnimationAction.time + 0.1
  }

  const del = () => {
    AnimationAction.time = AnimationAction.time - 0.1
  }
</script>

<template>
  <!-- <bgsound src="./Music.mp3" autostart="true" loop="true" /> -->
  <!-- <embed id="music" src="./Music.mp3" type="audio/mp3" loop="true" /> -->
  <!-- <audio id="music" controls loop="true" >
    <source src="../Music.mp3" type="audio/mpeg">
  </audio> -->
  <div class="select-div">
    <select @change="changeMode" v-model="modelFileRef">
      <template v-for="o in pmxList" v-key="o.name">
        <option :value="`./${o}/${o}.pmx`">{{o}}</option>
      </template>
      <!-- <option value="./布莱泽奥特曼/布莱泽有骨.pmx">杰杰的布莱泽</option>
      <option value="./琳妮特/琳妮特.pmx">琳妮特</option>
      <option value="./深空之眼—波塞冬泳装2.0/波塞冬2.0.pmx">波塞冬2.0</option> -->
    </select>
    <select @change="changeVmd" v-model="vmdFileRef">
      <template v-for="o in vmdList" v-key="o">
        <option :value="o">{{o.name}}</option>
      </template>
    </select>
  </div>

  <div class="ctrl">
    <audio :loop="true" @ratechange="ratechange" @play="play" @pause="pause" @timeupdate="updateTime" :src="`./${vmdFileRef.music}`" id="myAudio" controls></audio>
    <form @submit.prevent ="toDuration">
      <input step="0.000000000000000001" type="number" v-model="currentTimeInput" placeholder="跳转时间"/>
      <button @click="toDuration">跳转时间</button>
    </form>
    <button @click="add">加</button>
    <button @click="del">减</button>
    <button @click="physicsSwitch">{{!physicsOpenFlag ? `开启物理引擎` : `关闭物理引擎`}}</button>
    <!-- <button @click="ikSwitch">{{!ikOpenFlag ? `开启IK` : `关闭IK`}}</button> -->
    <button @click="changeShow">{{showFlag ? `换装开` : `换装关`}}</button>
    <!-- <button @click="toDuration">跳转</button> -->
    <!-- <button v-if="showPlay" @click="play">播放</button>
    <button v-else @click="pause">暂停</button> -->
    <button @click="cameraScale">{{autoRotateRef ? `停转`: `旋转`}}</button>
  </div>
  <div v-if="progressTxtShow" class="progress">{{ progressTxt }}%</div>
  <div id="info" class="sss"></div>
</template>

<style scoped>
.sss {
  width: 100vw;
  height: 100vh;
  background-color: black;
}
#myAudio {
  width: 100vw
  /* position: absolute; */
  /* visibility: hidden; */
}
.ctrl {
  display: flex;
  align-items: end;
  justify-content: end;
  flex-wrap: wrap-reverse;
  position: absolute;
  right: 0;
  bottom: 0;
  form {
    display: flex;
  }
}
.select-div {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
}
select {
  width: 130px;
  align-items: center;
  margin-right: 6px;
  height: 30px;
  border-radius: 3px;
  font-size: 16px;
}
input, button {
  border: none;
  display: flex;
  align-items: center;
  font-size: 16px;
  height: 30px;
  border-radius: 3px;
  margin: 3px;
}
.progress {
  background: rgba(0, 0, 0, 0.582);
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>
