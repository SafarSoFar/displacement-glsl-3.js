import * as THREE from 'three';
// import vertShader from './vertex.glsl'
// import fragShader from './fragment.glsl'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer(); renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.OctahedronGeometry(1, 1);
const mat = new THREE.Material();
const cube = new THREE.Mesh(geometry, mat);
scene.add(cube);
camera.position.z = 5;
renderer.setAnimationLoop(animate);



var colorA = new THREE.Color(0x000000);
var colorB = new THREE.Color(0x000000);
var r = 0.0;
var g = 0.0;
var b = 0.0;
var glowIn = true;
function animate() {

  r = glowIn ? r + 0.01 : r - 0.01;
  g = glowIn ? g + 0.01 : g - 0.01;
  if ((glowIn && r > 1) || (!glowIn && r < 0)) {
    glowIn = !glowIn;
  }
  colorA.r = r;
  colorB.g = g;
  const shaderMat = new THREE.ShaderMaterial({
    uniforms: {
      colorA: { type: 'vec3', value: colorA },
      colorB: { type: 'vec3', value: colorB },
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader()
  });
  cube.material = shaderMat;
  cube.rotation.x += 0.01; cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

function vertexShader() {
  return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
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
        gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
        // gl_FragColor = vec4(colorA, 1.0);
      }
  `
}


