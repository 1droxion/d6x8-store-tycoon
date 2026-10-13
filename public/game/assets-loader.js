import {RGBELoader} from './assets/vendor/loaders/RGBELoader.js';
const world=window.realisticWorld;
if(world){const {scene,renderer,THREE}=world;const pmrem=new THREE.PMREMGenerator(renderer);pmrem.compileEquirectangularShader();new RGBELoader().load('./assets/textures/sky.hdr',texture=>{scene.environment=pmrem.fromEquirectangular(texture).texture;texture.dispose();pmrem.dispose();},undefined,()=>pmrem.dispose());}
