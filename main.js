import * as THREE from 'three';
import GUI from 'lil-gui';
// import vertShader from './vertex.glsl'
// import fragShader from './fragment.glsl'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setClearColor(0x03b1fc);
// renderer.setClearColor(0x000000);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var clock = new THREE.Clock();
const waveObj = {
  amplitude: 0.15,
  freq: 2,
  colorMixOffset: 0.54,
  // waterDepthColor: 0x0000ff,
  waterDepthColor: { r: 0, g: 0, b: 1 },
  // waterSurfaceColor: 0x03b1fc,
  waterSurfaceColor: { r: 0.078, g: 0.667, b: 0.961 },

};
const gui = new GUI();
gui.add(waveObj, 'amplitude', 0.1, 1.0);
gui.add(waveObj, 'freq', 2, 10);
gui.add(waveObj, 'colorMixOffset', 0.2, 2);
gui.addColor(waveObj, 'waterDepthColor');
gui.addColor(waveObj, 'waterSurfaceColor');


const geometry = new THREE.PlaneGeometry(20, 20, 100, 100);
const mat = new THREE.Material();
const plane = new THREE.Mesh(geometry, mat);

plane.rotation.x = 5;
scene.add(plane);
camera.position.z = 5;
renderer.setAnimationLoop(animate);




function animate() {
  const shaderMat = new THREE.ShaderMaterial({
    uniforms: {
      amplitude: { type: 'float', value: waveObj.amplitude },
      freq: { type: 'float', value: waveObj.freq },
      time: { type: 'float', value: clock.getElapsedTime() },
      waterDepthColor: { type: 'vec3', value: waveObj.waterDepthColor },
      waterSurfaceColor: { type: 'vec3', value: waveObj.waterSurfaceColor },
      colorMixOffset: { type: 'float', value: waveObj.colorMixOffset },
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
  });
  shaderMat.transparent = true;
  plane.material = shaderMat;

  // plane.rotation.z += 0.005;

  renderer.render(scene, camera);
}



function vertexShader() {
  return `
    varying vec3 vUv; 
    uniform float amplitude;
    uniform float time;
    uniform float freq; 
    out vec3 pos;

    void main() {
      vUv = position; 
      pos = position;
      pos.z = sin(freq * pos.x + time) * amplitude;
      pos.z += cos(freq * pos.x + time) * amplitude;
      pos.z += sin(freq * pos.y  + time) * amplitude;
      pos.z += cos(freq * pos.y  + time) * amplitude;
      vec4 modelViewPosition = modelViewMatrix * vec4(pos,1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `
}

function fragmentShader() {
  return `
      in vec3 pos;
      varying vec3 vUv;
      uniform float colorMixOffset;
      uniform vec3 waterDepthColor; 
      uniform vec3 waterSurfaceColor; 

      void main() {
        gl_FragColor = vec4(mix(waterDepthColor,waterSurfaceColor, pos.z+colorMixOffset),1.0);
      }
  `
}


