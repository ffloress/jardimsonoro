import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer, CSS2DObject } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS2DRenderer.js";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 2000);
camera.position.set(0, 0, 10);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit controls
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Iluminação
let ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(ambientLight, directionalLight);

// Texture
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("mundo.jpg");

// Globe
const sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
const sphereMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(earthMesh);

// CSS2DRenderer for labels
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

// Markers
const markerCount = 10;
const markerInfo = [];
const markerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const markers = [];

for (let i = 0; i < markerCount; i++) {
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  const position = new THREE.Vector3().randomDirection().multiplyScalar(5.01);
  marker.position.copy(position);
  marker.userData = {
    id: i + 1,
    description: "Marcador #" + (i + 1),
    coordinates: position.clone()
  };
  scene.add(marker);
  markers.push(marker);
  markerInfo.push(marker.userData);
}

// Label
const infoDiv = document.createElement("div");
infoDiv.style.padding = "4px 10px";
infoDiv.style.background = "rgba(0,0,0,0.7)";
infoDiv.style.color = "#fff";
infoDiv.style.borderRadius = "4px";
infoDiv.style.fontFamily = "Arial";
infoDiv.style.fontSize = "14px";
infoDiv.classList.add("hidden");
const label = new CSS2DObject(infoDiv);
scene.add(label);

// Raycaster interaction
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

window.addEventListener("pointerdown", event => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(markers);
  if (intersects.length > 0) {
    const data = intersects[0].object.userData;
    infoDiv.innerHTML = `<b>${data.description}</b><br>X: ${data.coordinates.x.toFixed(2)}<br>Y: ${data.coordinates.y.toFixed(2)}<br>Z: ${data.coordinates.z.toFixed(2)}`;
    label.position.copy(data.coordinates);
    label.element.classList.remove("hidden");
  }
});

// Resize
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  labelRenderer.setSize(innerWidth, innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
animate();
