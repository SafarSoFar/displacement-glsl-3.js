import * as THREE from 'three';
import GUI from 'lil-gui';
// import vertShader from './vertex.glsl'
// import fragShader from './fragment.glsl'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

// renderer.setClearColor(0x03b1fc);
renderer.setClearColor(0x000000);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var clock = new THREE.Clock();
const waveObj = {
  amplitude: 0.07,
  freq: 2,
  heightOffset: 1,
  waterColor: { r: 0.109, g: 0.443, b: 0.847 },
  speed: 1

};
const gui = new GUI();
gui.add(waveObj, 'amplitude', 0.05, 0.1);
gui.add(waveObj, 'freq', 2, 5);
gui.add(waveObj, 'heightOffset', 0.2, 1.0);
gui.add(waveObj, 'speed', 1.0, 3.0);
gui.addColor(waveObj, 'waterColor');


const geometry = new THREE.PlaneGeometry(50, 50, 100, 100);
const mat = new THREE.Material();
const plane = new THREE.Mesh(geometry, mat);
const lightPos = new THREE.Vector3(0, 5, 2);

plane.rotation.x = 30;
plane.rotation.z = 60;
scene.add(plane);
camera.position.z = 5.0;
renderer.setAnimationLoop(animate);




function animate() {
  geometry.computeVertexNormals();
  const shaderMat = new THREE.ShaderMaterial({
    uniforms: {
      amplitude: { type: 'float', value: waveObj.amplitude },
      freq: { type: 'float', value: waveObj.freq },
      time: { type: 'float', value: clock.getElapsedTime() },
      speed: { type: 'float', value: waveObj.speed },
      waterColor: { type: 'vec3', value: waveObj.waterColor },
      heightOffset: { type: 'float', value: waveObj.heightOffset },
      lightPos: { type: 'vec3', value: lightPos },
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
  });
  shaderMat.transparent = true;
  plane.material = shaderMat;
  plane.rotation.z += 0.001;


  renderer.render(scene, camera);
}



function vertexShader() {
  return `
    varying vec3 vUv; 
    varying vec3 vNormal;
    uniform float amplitude;
    uniform float time;
    uniform float freq; 
    uniform float speed; 
    out vec3 pos;

    void main() {

      vNormal = normalize(normal);
      vUv = position; 

      pos = position;
      pos.z = sin(freq * pos.x + time * speed) * amplitude;
      pos.z += cos(freq * pos.x + time * speed) * amplitude;
      pos.z += sin(freq * pos.y  + time * speed) * amplitude;
      pos.z += cos(freq * pos.y  + time * speed) * amplitude;
      pos.x += sin(freq * pos.z  + time * speed) * amplitude;
      pos.y -= cos(freq * pos.x  + time * speed) * amplitude;
      vec4 modelViewPosition = modelViewMatrix * vec4(pos,1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `
}

function fragmentShader() {
  return `
      in vec3 pos;
      varying vec3 vUv;
      varying vec3 vNormal;
      uniform float heightOffset;
      uniform vec3 waterColor; 
      uniform vec3 lightPos;

      void main() {
        // vec3 color = mix(waterDepthColor,waterSurfaceColor, pos.z+colorMixOffset);
        vec3 color = waterColor;

        // calculating diffuse lighting
        vec3 dirToLight = normalize(lightPos - pos);
        float cosAngle = dot(vNormal, dirToLight);
        cosAngle = clamp(cosAngle, 0.0, 1.0);
        color = color  * cosAngle * (pos.z + heightOffset);

        gl_FragColor = vec4(color,1.0);
      }
  `
}


