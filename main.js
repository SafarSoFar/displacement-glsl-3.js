import * as THREE from 'three';
// import vertShader from './vertex.glsl'
// import fragShader from './fragment.glsl'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer(); renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.BoxGeometry(1, 1, 1);
const shaderMat = new THREE.ShaderMaterial({
  uniforms: {
    colorA: { type: 'vec3', value: new THREE.Color(0xff0000) },
    colorB: { type: 'vec3', value: new THREE.Color(0x0000FF) }
  },
  vertexShader: vertexShader(),
  fragmentShader: fragmentShader()
});
const cube = new THREE.Mesh(geometry, shaderMat);
scene.add(cube);
camera.position.z = 5;
renderer.setAnimationLoop(animate);

function animate() {
  // cube.rotation.x += 0.01; cube.rotation.y += 0.01;
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
      }
  `
}


