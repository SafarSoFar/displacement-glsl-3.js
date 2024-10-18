import * as THREE from 'three';
import GUI from 'lil-gui';
// import vertShader from './vertex.glsl'
// import fragShader from './fragment.glsl'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var clock = new THREE.Clock();
const waves = {
  amplitude: 0.1,
  freq: 0.01
};
const gui = new GUI();
gui.add(waves, 'amplitude', 0.1, 1.0);
gui.add(waves, 'freq', 0.01, 0.2);


const geometry = new THREE.PlaneGeometry(5, 5, 100, 10);
const mat = new THREE.Material();
const plane = new THREE.LineSegments(geometry, mat);

plane.rotation.x = 5;
scene.add(plane);
camera.position.z = 5;
renderer.setAnimationLoop(animate);



var colorA = new THREE.Color(0x000000);
var colorB = new THREE.Color(0x0000ff);
var angle = 0;

function animate() {
  angle++;
  const shaderMat = new THREE.ShaderMaterial({
    uniforms: {
      angle: { type: 'float', value: angle },
      amplitude: { type: 'float', value: waves.amplitude },
      freq: { type: 'float', value: waves.freq },
      time: { type: 'float', value: clock.getElapsedTime() },
      colorA: { type: 'vec3', value: colorA },
      colorB: { type: 'vec3', value: colorB },
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader()
  });
  plane.material = shaderMat;

  plane.rotation.z += 0.005;

  renderer.render(scene, camera);
}



function vertexShader() {
  return `
    varying vec3 vUv; 
    uniform float angle;
    uniform float amplitude;
    uniform float time;
    uniform float freq; 

    void main() {
      vUv = position; 
      vec3 pos = position;
      pos.z = sin(pos.x + pos.y + angle * freq) * amplitude;
      vec4 modelViewPosition = modelViewMatrix * vec4(pos,1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `
}

function fragmentShader() {
  return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;

      void main() {
        gl_FragColor = vec4(mix(colorA, colorB, 0.7), 1.0);
        // gl_FragColor = vec4(colorA, 1.0);
      }
  `
}


