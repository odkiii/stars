<template>
    <div class="star-creator-wrapper">
    <div class="star-creator">

      <div class="creator-container">

        <!-- Блок превью -->
        <div class="preview-block">
          <div v-if="isLoading" class="loading-overlay">Загрузка...</div>
          <div ref="threeContainer" class="three-container" @mousedown="isDragging = true" @mouseup="isDragging = false"></div>
        </div>
        <notifications position="top right" />

        <div class="params-block desktop-only">
        <!-- Обертка для эффекта жидкого стекла -->
        <div class="liquidGlass-wrapper params-glass">
          <div class="liquidGlass-effect"></div>
          <div class="liquidGlass-tint"></div>
          <div class="liquidGlass-shine"></div>
          
          <div class="liquidGlass-content">
            <div class="params-section">
              <h3>ЦВЕТ</h3> 
              <color-picker 
                v-model="currentDesign.color" 
                :colors="colorConfigurations"
                :disabled="isLoading"
              />
            </div>

            <div class="params-section">
              <h3>РАЗМЕР</h3>
              <size-picker
                :sizes="sizes"
                :selected-size="currentDesign.size"
                @update:selectedSize="currentDesign.size = $event"
                :disabled="isLoading"
              />
            </div>

            <div class="params-section text-acs">
              <h3>ТЕКСТУРА</h3>
              <h3>ОФОРМЛЕНИЕ</h3>
              
              <texture-picker
                :textures="currentTextures"
                :selected-texture="currentDesign.texture"
                @update:selectedTexture="currentDesign.texture = $event"
                :disabled="isLoading"
              />
              <accessories-picker
                :accessories="currentAccessories"
                :selected-accessory="currentDesign.accessory"
                @update:selectedAccessory="currentDesign.accessory = $event"
                :disabled="isLoading"
              />
            </div>

            <div class="summary">
              <button class="add-to-cart" @click="addToCart">
                ДОБАВИТЬ В КОРЗИНУ
              </button>
            </div>
            
          </div>
        </div>
      </div>
      
      </div>
      <!-- Мобильная версия -->
        <div class="configurator-mobile mobile-only">
          <div class="config-tabs">
            <button :class="{active: activeTab==='color'}" @click="activeTab='color'">Цвет</button>
            <button :class="{active: activeTab==='size'}" @click="activeTab='size'">Размер</button>
            <button :class="{active: activeTab==='texture'}" @click="activeTab='texture'">Текстура</button>
          </div>

          <div class="config-content">
            <div v-if="activeTab==='color'" class="params-section">
              <color-picker 
                v-model="currentDesign.color" 
                :colors="colorConfigurations"
                :disabled="isLoading"
                />
            </div>
            <div v-if="activeTab==='size'" class="params-section">
              <size-picker 
                :sizes="sizes"
                :selected-size="currentDesign.size"
                @update:selectedSize="currentDesign.size = $event"
                :disabled="isLoading"
                />
            </div>
            <div v-if="activeTab==='texture'" class="params-section text-acs">
              <texture-picker 
                :textures="currentTextures"
                :selected-texture="currentDesign.texture"
                @update:selectedTexture="currentDesign.texture = $event"
                :disabled="isLoading"
              />
              <accessories-picker 
                :accessories="currentAccessories"
                :selected-accessory="currentDesign.accessory"
                @update:selectedAccessory="currentDesign.accessory = $event"
                :disabled="isLoading"
              />
            </div>
          </div>

          <button class="add-to-cart" @click="addToCart">Добавить в корзину</button>
        </div>

    </div>
  </div>
  <div class="mobile-overlay">
    <p>Поверните устройство или зайдите с компьютера</p>
  </div>
  </template>
  
  <script>
import ColorPicker from '@/components/ColorPicker.vue'
import TexturePicker from '@/components/TexturePicker.vue'
import AccessoriesPicker from '@/components/AccessoriesPicker.vue'
import SizePicker from '@/components/SizePicker.vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import debounce from 'lodash-es/debounce';
import { ref } from 'vue'
const activeTab = ref('color')


export default {
  components: { SizePicker, ColorPicker, TexturePicker, AccessoriesPicker },
  data() {
    return {
      activeTab: 'color',
      allLights: [],
      thumbPosition: 0,
      scrollHeight: 0,
      scrollTop: 0,
      containerHeight: 0,
      currentScale: 15, 
      intenseLights: [],
      softLights: [],
      isLoading: false,
      activeLoader: null,
      isAnimationActive: false,
      animationFrameId: null,
      colorConfigurations: {
        gold : { // Золотой
          hex: '#FFD700',
          id: 'gold',
          name: 'Золотая',
          preview: '/colors/gold.png',
          textures: [
            { id: 'glossy', name: 'Глянец', icon: '/textures/glossy_gold.jpg' },
            { id: 'antique', name: 'Античное золото', icon: '/textures/antique_gold.jpg' }
          ],
          accessories: [
            { id: 'pearls', name: 'Жемчужины на лучах', icon: '/acs/pearls_gold.jpg' }
          ],
          defaultTexture: 'glossy',
          defaultAccessory: 'pearls'
        },
        silver : { // Серебряный
          hex: '#C0C0C0',
          id: "silver",
          name: 'Серебряная',
          preview: '/colors/silver.png',
          textures: [
            { id: 'glossy', name: 'Глянец', icon: '/textures/glossy_silver.jpg' },
            { id: 'aged', name: 'Состаренное серебро', icon: '/textures/aged_silver.jpg' }
          ],
          accessories: [
            { id: 'pearls', name: 'Жемчужины на лучах', icon: '/acs/pearls_silver.png' }
          ],
          defaultTexture: 'glossy',
          defaultAccessory: 'pearls'
        },
        ruby : { // Рубиновый
          hex: '#FF6347',
          id: "ruby",
          name: 'Рубиновая',
          preview: '/colors/ruby.png',
          textures: [
            { id: 'glossy', name: 'Глянец', icon: '/textures/glossy_red.jpg' }
          ],
          accessories: [
            { id: 'ruby_beads', name: 'Рубиновые бусины', icon: '/acs/ruby_beads.jpg' } 
          ],
          defaultTexture: 'glossy',
          defaultAccessory: 'ruby_beads'
        },
        pearl : { // Жемчужный
          hex: '#FDF5E6',
          id: "pearl",
          name: 'Жемчужная',
          preview: '/colors/pearl.png',
          textures: [
            { id: 'glossy', name: 'Глянец', icon: '/textures/pearl_glossy.jpg' }
          ],
          accessories: [
            { id: 'pearls', name: 'Жемчужины на лучах', icon: '/acs/pearls.png' }, //
          ],
          defaultTexture: 'glossy',
          defaultAccessory: 'pearls'
        }
      },
      currentTextures: [],
      currentAccessories: [],
      currentDesign: {
        name: 'Золотая',
        id: 'gold',
        color: 'gold', // Начальный цвет
        texture: 'glossy',
        accessory: 'pearls',
        size: 'medium',
        models: {
          gold: '/models/big_star.glb',
          silver: '/models/silver_star.glb',
        },
        threeScene: null,
        threeCamera: null,
        threeRenderer: null,
        starMesh: null,
        controls: null,
        isAnimationActive: false,
        animationFrameId: null,
        targetRotation: { x: 0, y: 0 },        
      },
      sizes: [
      { id: 'small', label: 'Маленькая (18-22 см)', baseIcon: 'icons/logo_black.png'}, 
      { id: 'medium', label: 'Средняя (27-33 см)', baseIcon: 'icons/logo_black.png'}, 
      { id: 'large', label: 'Большая (49-40 см)', baseIcon: 'icons/logo_black.png'}
      ]
    }
  },
  async mounted() {
    this.$nextTick(() => {
      this.updateScrollBar();
      window.addEventListener('resize', this.updateScrollBar);
    });
    await this.$nextTick();
    this.isAnimationActive = true;
    await this.initThreeJS();
    this.animate();
    console.log('currentDesign:', this.currentDesign);
    console.log('currentDesign.color:', this.currentDesign.color);
    if (this.currentDesign.color) {
      this.applyColorConfiguration(this.currentDesign.color);  
    }
    
  },
  computed: {
    colorOptionsForPicker() {
      return Object.values(this.colorConfigurations).map(config => ({
        hex: config.hex,
        id: config.id,
        name: config.name,
        image: config.textures[0]?.icon // или другая иконка
      }));
    },
    getSizeMultiplier() {
      const sizes = { small: 1, medium: 2 };
      return sizes[this.currentDesign.size] || 2;
    },
    previewStyles() {
      return {
        transform: `scale(${this.getSizeMultiplier()})`,
        filter: this.currentDesign.texture ? `url(#${this.currentDesign.texture})` : 'none'
      };
    },
    
    filteredTextures() {
      if (!this.currentDesign.color) return [];
      const config = this.colorConfigurations[this.currentDesign.color];
      if (!config) return [];
      
      return this.allTextures.filter(texture => 
        config.availableTextures.includes(texture.id)
      );
    },
    
    // Фильтруем аксессуары для текущего цвета
    filteredAccessories() {
      if (!this.currentDesign.color) return [];
      const config = this.colorConfigurations[this.currentDesign.color];
      if (!config || !config.accessories) return [];
      
      return this.allAccessories.filter(accessory => 
        config.availableAccessories.includes(accessory.id)
      );
    }
},
  watch: {
    'currentDesign.color': {
      handler(color) {
        if (this.isLoading) return;
        this.applyColorConfiguration(color);
        if (this.threeScene) {
          this.setupLighting();
        }
      }
    },
    'currentDesign.texture': debounce(function(texture) {
      if (this.isLoading) return;
      this.loadModelForCurrentConfig();
    }, 300),
    'currentDesign.accessory': debounce(function(accessory) {
      if (this.isLoading) return;
      this.loadModelForCurrentConfig();
    }, 300),
    'currentDesign.size': {
      immediate: false,
      handler(size) {
        const scaleMap = {
          small: 15,
          medium: 15 * 1.25, // 18.75
        };
        this.currentScale = scaleMap[size];
        this.loadModelForCurrentConfig();
      }
    }
  },
  methods: {
    updateScrollBar() {
      const el = this.$refs.pageContainer;
      if (!el) return;

      this.scrollHeight = el.scrollHeight;
      this.containerHeight = el.clientHeight;
      this.thumbPosition = 0; // начальная позиция
    },
    handleScroll(e) {
      const el = e.target;
      const maxScrollTop = el.scrollHeight - el.clientHeight;
      this.thumbPosition = (el.scrollTop / maxScrollTop) * (this.containerHeight - 30); // 30 = высота thumb
    },
    startDragging(e) {
      const startY = e.clientY;
      const initialThumbPos = this.thumbPosition;

      const onMouseMove = (e) => {
        const deltaY = e.clientY - startY;
        const newThumbPos = Math.max(0, Math.min(this.containerHeight - 30, initialThumbPos + deltaY));
        this.thumbPosition = newThumbPos;

        const maxScrollTop = this.scrollHeight - this.containerHeight;
        const scrollRatio = newThumbPos / (this.containerHeight - 30);
        this.$refs.pageContainer.scrollTop = scrollRatio * maxScrollTop;
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    // StarCreatorView.vue
    generateStarId() {
      // Маппинг цветов
      const colorMap = {
        '#FFD700': 'C1', // gold
        '#C0C0C0': 'C2', // silver
        '#FF6347': 'C3', // ruby
        '#FDF5E6': 'C4'  // pearl
      };
      
      // Маппинг размеров
      const sizeMap = {
        small: 'S1',
        medium: 'S2',
        large: 'S3'
      };
      
      const textureMap = {
        'glossy': 'T1',
        'antique': 'T2',
        'aged': 'T3',
        'glitter': 'T4'
      };
      
      const accessoryMap = {
        '':'A0',
        'pearls': 'A1',
        'ruby_beads': 'A2',
        'half_pearls': 'A3'
      }; 
      
      const colorCode = colorMap[this.currentDesign.color] || 'C0';
      const sizeCode = sizeMap[this.currentDesign.size] || 'S0';
      const textureId = textureMap[this.currentDesign.texture] || 'T0'; 
      const accessoryId = accessoryMap[this.currentDesign.accessory] || 'A0';
      
      return `${colorCode}${sizeCode}${textureId}${accessoryId}`;
    },
    updateAvailableOptions(colorHex) {
      const config = this.colorConfigurations[colorHex];
      if (!config) return;
      
      this.currentTextures = config.textures;
      this.currentAccessories = config.accessories;
      
      this.currentDesign.texture = config.defaultTexture;
      this.currentDesign.accessory = config.defaultAccessory;
       
      this.loadModelForCurrentConfig();
    },
    getModelPathForCurrentConfig() {
      const color = this.currentDesign.color;
      const texture = this.currentDesign.texture;
      const accessory = this.currentDesign.accessory;
      const size = this.currentDesign.size; 

      const colorMap = {
        '#FFD700': 'gold',
        '#C0C0C0': 'silver',
        '#FF6347': 'red',
        '#FDF5E6': 'pearl' 
      };
       
      const colorName = colorMap[color] || 'default';
      
      let fileName = `${colorName}_${texture}`;
      if (accessory) { 
        const accessoryMap = { 
          'pearls': 'pearls',
          'ruby_beads': 'rubybeads',
        };
        fileName += `_${accessoryMap[accessory]}`;
      }
      let modelDir = '/models/small'; 
      switch(size) {
        case 'small':
          modelDir = '/models/small';
          break; 
        case 'medium':
          modelDir = '/models/medium';
          break;
        case 'large':
          modelDir = '/models/large';
          break;
        default:
          modelDir = '/models/'; 
      }

      return `${modelDir}/${fileName}.glb`;
      // return `/models/small_star1.glb`;

      
    },
    async loadModelForCurrentConfig() {
      const path = this.getModelPathForCurrentConfig();
      await this.loadModel(path);
    },
    // Применяем конфигурацию для выбранного цвета
    applyColorConfiguration(color) {
      const config = this.colorConfigurations[color];
      if (!config) return;

      this.currentDesign.color = config.hex;
      this.currentDesign.texture = config.defaultTexture || 'glossy';
      this.currentDesign.accessory = config.defaultAccessory || '';

      this.currentTextures = config.textures || [];
      this.currentAccessories = config.accessories || [];
      
      this.loadModelForCurrentConfig();
    },
    setupRotationControls() {
      if (!this.threeRenderer || !this.threeCamera) return;

      this.controls = new OrbitControls(
        this.threeCamera, 
        this.threeRenderer.domElement
      );

      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 1.0;
      this.controls.enablePan = false;
      this.controls.maxPolarAngle = Math.PI;

      // Обработчики событий для мыши
      this.controls.addEventListener('start', () => {
        this.controls.autoRotate = false;
        this.isDragging = true;
      });
      
      this.controls.addEventListener('end', () => {
        this.controls.autoRotate = true;
        this.isDragging = false;
      });
    },
    resetPosition() {
      this.controls.reset();
      this.isDragging = false;
    },
    async loadModelByColor(color) {
      let modelPath;
      switch(color) {
        // case '#FFD700': modelPath = this.currentDesign.models.gold; break;
        // case '#C0C0C0': modelPath = this.currentDesign.models.silver; break;
        // default: modelPath = this.currentDesign.models.default;
      }
      this.loadModel(modelPath);
    },

    async loadModelAsync(path) {
      if (this.activeLoader) this.activeLoader.abort();
      
      return new Promise((resolve, reject) => {
        this.activeLoader = new GLTFLoader().load(
          path,
          resolve,
          undefined,
          reject
        );
      });
    },
    
    replaceModel(newModel) {
      if (!this.threeScene) {
        console.error('threeScene не инициализирована — не могу заменить звезду');
        return;
      }

      if (this.starMesh) {
        this.threeScene.remove(this.starMesh);
        this.disposeModel(this.starMesh);
      }

      this.starMesh = newModel;
      this.starMesh.scale.set(15, 15, 15);
      this.starMesh.rotation.set(0, 0, 0);
      this.threeScene.add(this.starMesh);

      if (this.controls) {
        this.controls.target.set(0, 0, 0);
        this.controls.update();
      }
    },
    

    // updateLightingBasedOnColor() {
    //   console.group('updateLightingBasedOnColor');

    //   if (!this.threeScene || !this.currentDesign?.color) {
    //     console.warn('threeScene или color не инициализированы');
    //     console.groupEnd();
    //     return;
    //   }

    //   const currentColor = this.currentDesign.color;
    //   const isSoft = this.isSoftColor(currentColor);

    //   console.log(`Цвет: ${currentColor}, мягкий свет: ${isSoft}`);
      
    //   if (isSoft) {
    //     try {
    //       console.log(`Ставлю мягкое освещение`);

    //       this.setupSoftLighting();
    //     }
    //     catch (error) {
    //       console.error(`Не получилось:`, error)
    //     }
        
    //   } else {
    //     console.log(`Ставлю обычное освещение`);

    //     this.setupIntenseLighting();
    //   }

    //   console.groupEnd();
    // },

    

    // setupIntenseLighting() {
    //   if (!this.threeScene) {
    //     console.warn('threeScene ещё не создана — интенсивный свет не установлен');
    //     return;
    //   }

    //   if (this.threeScene) {
    //     this.clearCurrentLights();
    //   }


  
    //   const directionalLight = new THREE.DirectionalLight(0xffddaa, 10);
    //   const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);

    //   const directionalLight1 = new THREE.DirectionalLight(0xffddaa, 10);
    //   const directionalLightHelper1  = new THREE.DirectionalLightHelper(directionalLight1, 1);

    //   const directionalLight2 = new THREE.DirectionalLight(0xffddaa, 10);
    //   const directionalLightHelper2 = new THREE.DirectionalLightHelper(directionalLight2, 1);

    //   const directionalLight3 = new THREE.DirectionalLight(0xffddaa, 10);
    //   const directionalLightHelper3  = new THREE.DirectionalLightHelper(directionalLight3, 1);


    //   directionalLight.position.set(3, 1, -3);
    //   directionalLightHelper.position.set(directionalLight);

    //   directionalLight1.position.set(-3, 0, -3);
    //   directionalLightHelper1.position.set(directionalLight1);

    //   directionalLight2.position.set(-3, 1, 3);
    //   directionalLightHelper2.position.set(directionalLight2);

    //   directionalLight3.position.set(3, 0, 3);
    //   directionalLightHelper3.position.set(directionalLight3);
      
    //   this.threeScene.add(directionalLight);
    //   this.threeScene.add(directionalLight1);
    //   this.threeScene.add(directionalLight2);
    //   this.threeScene.add(directionalLight3);

    //   this.threeScene.add(directionalLightHelper);
    //   this.threeScene.add(directionalLightHelper1);
    //   this.threeScene.add(directionalLightHelper2);
    //   this.threeScene.add(directionalLightHelper3);

    //   this.intenseLights = [ directionalLight, directionalLight1, directionalLight2, directionalLight3, directionalLightHelper, directionalLightHelper1, directionalLightHelper2, directionalLightHelper3];


    // },

    

    // setupSoftLighting() {
    //   if (!this.threeScene) return;

    //   this.clearCurrentLights();

    //   // const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    //   const directional = new THREE.DirectionalLight(0xffffff, 2);
    //   const directionalLightHelper007 = new THREE.DirectionalLightHelper(directional, 1);

    //   directional.position.set(1, 0, 3);

    //   // this.threeScene.add(ambient);
    //   this.threeScene.add(directional);
    //   this.threeScene.add(directionalLightHelper007)

    //   this.softLights = [ directional, directionalLightHelper007];
    // },

    // Вспомогательный метод для проверки цвета
    isSoftColor(color) {
      const softColors = ['#FDF5E6', '#FF6347'];
      const result = softColors.includes(color);
      console.log(`Проверка цвета: ${color} — мягкий?`, result);
      return result;
    },

    clearAllLights() {
      if (!this.threeScene) return;
      
      // Удаляем все источники света и их хелперы
      const objectsToRemove = [];
      
      this.threeScene.traverse(child => {
        if (child.isLight || 
            child.isLightHelper || 
            child instanceof THREE.AmbientLight ||
            child.type.includes('Light')) {
          objectsToRemove.push(child);
        }
      });
      
      objectsToRemove.forEach(child => {
        this.threeScene.remove(child);
        if (child.dispose) child.dispose();
      });
      
      this.allLights = [];
    },

    setupLighting() {
      this.clearAllLights();
      
      const color = this.currentDesign.color;
      const isSoft = ['#FDF5E6', '#FF6347'].includes(color);
      
      if (isSoft) {
        this.setupSoftLighting();
      } else {
        this.setupIntenseLighting();
      }
      console.log(`Lights updated for ${color}: ${this.allLights.length} sources`);

    },

    setupIntenseLighting() {
      const positions = [
        [3, 1, -3],
        [-3, 0, -3],
        [-3, 1, 3],
        [3, 0, 3]
      ];

      positions.forEach(pos => {
        const light = new THREE.DirectionalLight(0xffddaa, 10);
        light.position.set(...pos);
        this.threeScene.add(light);
        this.allLights.push(light);
      });
    },

    setupSoftLighting() {
      const light = new THREE.DirectionalLight(0xF8F6F0, 2);
      light.position.set(2, 0, -1);
      this.threeScene.add(light);
      this.allLights.push(light);
      const light1 = new THREE.DirectionalLight(0xF8F6F0, 2);
      light1.position.set(-2, 0, 1);
      this.threeScene.add(light1);
      this.allLights.push(light1);

      const ambient = new THREE.AmbientLight(0xEAE6CA, 2);
      this.threeScene.add(ambient);
      this.allLights.push(ambient);
    },

    async initThreeJS() {
      this.isLoading = true;
      console.log("Пошла загрузка звезды!");

      if (!this.$refs.threeContainer) return;
      this.threeScene = new THREE.Scene();

      this.threeCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      this.threeCamera.position.set(0, 0, 3);
      this.threeCamera.lookAt(0, 0, 0);


      this.threeRenderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
      });
      this.threeRenderer.setSize(600, 600);
      this.$refs.threeContainer.appendChild(this.threeRenderer.domElement);


      this.setupRotationControls();
      this.setupLighting();


      try {
        await this.loadModel(this.currentDesign.models.default);
        this.isModelLoaded = true;
        this.animate();
      } catch (error) {
        console.error('Ошибка инициализации модели:', error);
      } finally {
        console.log("Загрузка окончена!")
        this.isLoading = false;
      }

    },
    async loadModel(path) {
      if (this.isLoading) return; // Запрет на изменение во время загрузки

      if (!this.threeScene) return;

      // Увеличиваем время показа индикатора загрузки
      console.log('Загрузка!');
      this.isLoading = true;
      
      try {
        // 1. Полностью удаляем текущую модель
        await this.removeCurrentModelWithFade();
        
        // 2. Искусственная задержка для гарантии очистки (300мс)
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 3. Загружаем новую модель
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(path);
        
        // 4. Проверяем что компонент еще смонтирован
        if (!this.$refs.threeContainer) return;
        
        // 5. Добавляем новую модель с анимацией появления
        this.starMesh = gltf.scene;
        const scaleMap = {
          small: 15 * 0.8,   // Маленькая - 80% от средней
          medium: 15,        // Средняя - базовая
          large: 15 * 0.6   // Большая - 67% от средней (1/1.5)
        };
        this.starMesh.scale.set(
          scaleMap[this.currentDesign.size] || 15,
          scaleMap[this.currentDesign.size] || 15,
          scaleMap[this.currentDesign.size] || 15
        );    
        this.threeScene.add(this.starMesh);
        await this.fadeInModel(); 
        
        // 6. Обновляем контролы
        // if (!this.controls) { this.setupRotationControls(); } 
        this.setupRotationControls();

        
        this.controls.target.set(0, 0, 0);
        this.controls.autoRotate = true;
        this.controls.update();
        
        
      } catch (error) {
        console.error('Ошибка загрузки модели:', error);
      } finally {
        console.log('Загрузка закончилась!')

        this.isLoading = false;
      }
    },

    // Гарантированное удаление модели с анимацией
    async removeCurrentModelWithFade() {
      if (!this.starMesh) return;
      
      // 1. Плавное исчезновение
      await this.fadeOutModel();
      
      // 2. Удаление из сцены
      this.threeScene.remove(this.starMesh);
      
      // 3. Полная очистка ресурсов
      this.disposeModel(this.starMesh);
      
      // 4. Обнуление ссылки
      this.starMesh = null;
      
      // 5. Принудительная очистка памяти
      if (this.threeRenderer) {
        this.threeRenderer.forceContextLoss();
        this.threeRenderer.dispose();
        // Пересоздаем рендерер
        this.threeRenderer = new THREE.WebGLRenderer({ 
          alpha: true, 
          antialias: true 
        });
        this.threeRenderer.setSize(600, 600);
        this.$refs.threeContainer.innerHTML = '';
        this.$refs.threeContainer.appendChild(this.threeRenderer.domElement);
      }
    },

    // Улучшенный метод очистки модели
    disposeModel(model) {
      if (!model) return;
      
      model.traverse(child => {
        if (child.isMesh) {
          // Освобождаем геометрию
          if (child.geometry) {
            child.geometry.dispose();
          }
          
          // Освобождаем материалы и текстуры
          if (child.material) {
            // Для массива материалов
            if (Array.isArray(child.material)) {
              child.material.forEach(m => this.disposeMaterial(m));
            } 
            // Для одиночного материала
            else {
              this.disposeMaterial(child.material);
            }
          }
        }
      });
    },

    // Отдельный метод для очистки материалов
    disposeMaterial(material) {
      Object.keys(material).forEach(key => {
        const value = material[key];
        if (value && typeof value.dispose === 'function') {
          value.dispose();
        }
      });
      material.dispose();
    },

    // Анимация исчезновения модели
    fadeOutModel() {
      return new Promise(resolve => {
        if (!this.starMesh) return resolve();
        
        let opacity = 1;
        const fade = () => {
          opacity -= 0.05;
          this.setModelOpacity(opacity);
          
          if (opacity > 0) {
            requestAnimationFrame(fade);
          } else {
            resolve();
          }
        };
        
        fade();
      });
    },

    // Анимация появления модели
    fadeInModel() {
      return new Promise(resolve => {
        if (!this.starMesh) return resolve();
        
        this.setModelOpacity(0);
        let opacity = 0;
        
        const fade = () => {
          opacity += 0.05;
          this.setModelOpacity(opacity);
          
          if (opacity < 1) {
            requestAnimationFrame(fade);
          } else {
            resolve();
          }
        };
        
        fade();
      });
    },
    // Установка прозрачности для всей модели
    setModelOpacity(opacity) {
      if (!this.starMesh) return;
      
      this.starMesh.traverse(child => {
        if (child.isMesh && child.material) {
          child.material.transparent = opacity < 1;
          child.material.opacity = opacity;
          
          // Для материалов с массивами
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.transparent = opacity < 1;
              mat.opacity = opacity;
            });
          }
        }
      });
    },
    animate() {
      if (!this.threeScene || !this.threeCamera || !this.threeRenderer) return;

      const animateFrame = () => {
        requestAnimationFrame(animateFrame);
        
        if (this.controls) {
          this.controls.update();
        }

        if (this.threeRenderer && this.threeScene && this.threeCamera) {
          this.threeRenderer.render(this.threeScene, this.threeCamera);
        }
      };

      animateFrame();
    },
    async changeModelByColor(color) {
      try {
        this.isLoading = true;
        let modelPath;
        switch(color) {
          case '#FFD700':
            modelPath = this.currentDesign.models.gold;
            break;
          case '#C0C0C0':
            modelPath = this.currentDesign.models.silver;
            break;
          default:
            modelPath = this.currentDesign.models.default;
        }
        
        const gltf = await this.loadModelAsync(modelPath);
        this.replaceModel(gltf.scene);
      } catch (error) {
        console.error('Ошибка загрузки модели:', error);
      } finally {
        this.isLoading = false;
      }
    },
    updateTexture(texture) {
      this.currentDesign.texture = texture
    },
    updateAccessory(accessory) {
      this.currentDesign.accessory = accessory
    },
    toggleAddon(addonId) {
      this.currentDesign.addons = {
        ...this.currentDesign.addons,
        [addonId]: !this.currentDesign.addons[addonId]
      }
    },
    async addToCart() {
      const starId = this.generateStarId();
      
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.id === starId);
      
      // Получаем конфигурацию цвета
      const colorConfig = Object.values(this.colorConfigurations).find(
        config => config.hex === this.currentDesign.color
      );
      
      // Получаем названия текстур и аксессуаров
      const textureConfig = this.currentTextures.find(t => t.id === this.currentDesign.texture);
      const accessoryConfig = this.currentAccessories.find(a => a.id === this.currentDesign.accessory);
      
      // Получаем название размера
      const sizeConfig = this.sizes.find(s => s.id === this.currentDesign.size);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: starId,
          name: `Кастомная звезда (${colorConfig.name})`,
          price: 5000,
          configuration: {
            color: this.currentDesign.color,
            color_name: colorConfig.name,
            size: this.currentDesign.size,
            size_label: sizeConfig?.label || this.currentDesign.size,
            texture: this.currentDesign.texture,
            texture_name: textureConfig?.name || this.currentDesign.texture,
            accessory: this.currentDesign.accessory,
            accessory_name: accessoryConfig?.name || this.currentDesign.accessory
          },
          quantity: 1,
          is_custom: true // Флаг кастомного товара
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      try {
        await fetch('http://localhost:3001/api/stars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: starId,
            color_hex: this.currentDesign.color,
            size: this.currentDesign.size,
            texture_id: this.currentDesign.texture,
            accessory_id: this.currentDesign.accessory,
            price: 5000
          })
        });
      } catch (error) {
        console.error('Ошибка сохранения звезды:', error);
      }
      
      this.$notify({
        title: 'Звезда добавлена в корзину!',
        type: 'success'
      });
    },

    selectTexture(texture) {
      this.currentConfiguration.texture = texture;
      this.updateStarAppearance();
    },

    toggleAccessory(accessory) {
      const index = this.currentConfiguration.accessories.indexOf(accessory);
      if (index > -1) {
        this.currentConfiguration.accessories.splice(index, 1);
      } else {
        this.currentConfiguration.accessories.push(accessory);
      }
      this.updateStarAppearance();
    },
    
    beforeUnmount() {
      cancelAnimationFrame(this.animationFrameId);
      this.controls?.dispose();
      if (this.threeRenderer) {
        this.threeRenderer.dispose();
        this.$refs.threeContainer.innerHTML = '';
      }
    },
    cleanupThreeJS() {
      if (this.starMesh) this.disposeModel(this.starMesh)
      if (this.controls) this.controls.dispose()
      if (this.threeRenderer) {
        this.threeRenderer.dispose()
        this.threeRenderer.forceContextLoss()
      }
      this.threeScene = null
    },
    
    disposeModel(model) {
      model.traverse(child => {
        if (child.isMesh) {
          child.geometry.dispose()
          if (child.material) {
            Object.values(child.material).forEach(val => {
              if (val && typeof val.dispose === 'function') val.dispose()
            })
          }
        }
      })
    }
  }
}
</script>
<style scoped>
html, body {
      background: #333;
      min-height: 100vh;
      margin: 0;
      top: 0;
      overflow-x: hidden;
    }

.mobile-overlay {
  display: none;
}

.configurator { flex: 1; }
.desktop-only { display: block; }
.mobile-only { display: none; }

.params-block {
  position: relative;
  padding: 20px;
  border-radius: 20px;
  overflow: hidden;
  height: 100%;
}

.params-glass {

  padding: 20px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 1s ease;
}

.params-glass:hover {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.liquidGlass-effect {
  position: absolute;
  inset: 0;
  z-index: 0;
  filter: url(#glass-distortion);
  border-radius: 50px;

}

.liquidGlass-tint {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;

}

.liquidGlass-shine {
  position: absolute;
  inset: 0;
  z-index: 2;
  box-shadow: inset 2px 2px 10px rgba(255, 255, 255, 0.3),
              inset -2px -2px 10px rgba(255, 255, 255, 0.2);
  border-radius: 50px;
}

.liquidGlass-content {
  position: relative;
  z-index: 3;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 50px;

}

.params-section {
  padding: 15px;
  border-radius: 40px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.params-section h3 {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  margin: 10px 0 10px 5px ;
  font-size: 1.3rem;
  }

.text-acs {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.add-to-cart {
  width: 100%;
  padding: 2vh;
  border: none;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.add-to-cart:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}


.text-acs{
  display: grid;
  grid-template-columns: 50% 50%;
  }

.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 100000;
  padding: 1rem;
  background: rgba(0,0,0,0.7);
  color: white;
  border-radius: 8px;
}

.star-creator-wrapper {
  background: url('/public/back.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100dvh;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  justify-content: center;}

.star-creator {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  
  padding-bottom: 200px;
}

.params-block {
  position: relative;
  padding: 0 30px 0px 30px;
  margin: 80px 0 0 0 ;
  overflow: hidden;
  position: relative;
  border-radius: 50px;
  overflow: hidden;
}

.creator-container {
  display: flex;
  flex-direction: row;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  min-height: 80vh;
  max-width: 1200px;
  width: 100%;
  position: relative;
  align-items: stretch;
}

.preview-block {
  top: 50px;
  left: 10px;
  position: relative;
  width: 600px;
  height: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 25px;
}

.radial-blur {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);
  filter: blur(40px);
  z-index: 1;
  pointer-events: none;
}

.three-container {
  position: relative;
  top: 250px;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  z-index: 2;
}

.star-preview {
  position: relative;
  z-index: 1;
  border-radius: 25px;
  max-width: 500px;
  max-height: 99%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.shape-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

  
  .preview-controls {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  
  .rotate-btn, .zoom-controls button {
    background: #f0f0f0;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .rotate-btn:hover, .zoom-controls button:hover {
    background: #e0e0e0;
  }
  
  .zoom-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }
    
  
  .shape-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
  
  .shape-options button {
    border: 2px solid #eee;
    background: none;
    padding: 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .shape-options button.active {
    border-color: #4CAF50;
    background: rgba(76, 175, 80, 0.1);
  }
  
  .shape-options img {
    width: 40px;
    height: 40px;
    display: block;
    margin: 0 auto 8px;
  }
  
  
  .checkmark {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
  }
  
  input[type="checkbox"]:checked + .checkmark {
    background-color: #4CAF50;
    border-color: #4CAF50;
  }
  
  .summary {
    /* margin-top: 20px;
    padding-top: 20px; */
    /* border-top: 1px solid #eee; */
    text-align: center;
  }
  
  .price {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
  }
  

  @media (max-width: 768px) {
    
    .star-creator-wrapper {
    background: url('/public/back.jpg') no-repeat center center fixed;
    min-height: 100vh;
    background-position: left center;
    background-attachment: fixed;
    background-size: cover;
    display: flex;
    width: 768px;
    overflow: hidden;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0;
  }

    .star-creator {
      display: flex;
      flex-direction: column;
      margin-top: 70px;
      min-height: 100vh;
    }
    .creator-container { display: flex; flex-direction: column; gap: 0.5rem;}

    .desktop-only { display: none !important; }
    .mobile-only {
      display: flex !important; /* показываем мобильный */
      flex-direction: column;
      padding: 1rem;
      gap: 1rem;
      width: 100%;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .configurator-mobile {
      display: flex;
      margin-top: -100px;
      flex-direction: column;
      padding: 1rem;
      gap: 0.5rem;
      width: 100%;
      border-radius: 20px;
      overflow: hidden;
      position: relative;

      /* liquid glass эффект */
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.18);
    }

    .configurator-mobile:hover {
      background: rgba(255, 255, 255, 0.25);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .preview-block {
      width: 100%;
      height: 60vh;
      margin-bottom: 0.5rem; 
      overflow: hidden;
    }

    .config-tabs {
      display: flex;
      justify-content: space-between;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.1);
    }
    .config-tabs button {
      flex: 1;
      padding: 0.8rem;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      background: transparent;
      color: #333;
      transition: all 0.3s;
    }
    .config-tabs button.active {
      background: rgba(255, 255, 255, 0.3);
      color: #6b0630;
    }


    .config-content {
      margin-top: 1rem;
    }

    .params-section {
      padding: 1rem;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .add-to-cart {
      display: block;
      width: 100%;
      margin-top: 1rem;
      padding: 1rem;
      font-size: 1.2rem;
    }
  }


  @media (max-width: 992px) {
  .mobile-overlay {
    display: flex;
    position: fixed;
    inset: 0;
    background: #000;
    color: #fff;
    z-index: 9999;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 1.2rem;
    font-weight: 500;
    padding: 20px;
  }

  /* Прячем остальное содержимое только внутри Creator */
  .star-creator-wrapper > *:not(.mobile-overlay) {
    visibility: hidden;
  }
}
  </style>