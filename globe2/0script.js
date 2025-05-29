import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer, CSS2DObject } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS2DRenderer.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 2000);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Iluminação
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(10, 10, 10);
scene.add(light);

// Textura do globo
const textureLoader = new THREE.TextureLoader();
const globeTexture = textureLoader.load("mundo.jpg");
const globeRadius = 5;
const globe = new THREE.Mesh(
  new THREE.SphereGeometry(globeRadius, 64, 64),
  new THREE.MeshStandardMaterial({ map: globeTexture })
);
scene.add(globe);

// Label renderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

// Dados dos festivais
const festivals = [
  { name: "Sónar Festival – 🇪🇸 Espanha", lat: 41.3545, lon: 2.1282, info: "Um dos maiores e mais respeitados festivais de música eletrônica e arte digital do mundo." },
  { name: "Green Man – 🇬🇧 Reino Unido", lat: 51.8590, lon: -3.1370, info: "Festival independente nas montanhas galesas com atmosfera mágica." },
  { name: "SXSW – 🇺🇸 Estados Unidos", lat: 30.2667, lon: -97.7333, info: "Mistura de festival e conferência em Austin, Texas, com foco em inovação cultural." },
  { name: "MUTEK – 🇨🇦 Canadá", lat: 45.5017, lon: -73.5673, info: "Plataforma internacional dedicada à música eletrônica de ponta e arte digital." }
];

// Criar marcadores
const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff3232 });
const markers = [];

festivals.forEach(festival => {
  const phi = THREE.MathUtils.degToRad(90 - festival.lat);
  const theta = THREE.MathUtils.degToRad(festival.lon + 180);
  const position = new THREE.Vector3().setFromSphericalCoords(globeRadius + 0.05, phi, theta);

  const marker = new THREE.Mesh(markerGeometry, markerMaterial.clone());
  marker.position.copy(position);
  marker.userData = festival;
  scene.add(marker);
  markers.push(marker);
});

// Painel de informação
const infoDiv = document.createElement("div");
infoDiv.style.padding = "8px 12px";
infoDiv.style.background = "rgba(0,0,0,0.75)";
infoDiv.style.color = "#fff";
infoDiv.style.borderRadius = "6px";
infoDiv.style.maxWidth = "220px";
infoDiv.style.fontFamily = "Arial";
infoDiv.style.fontSize = "14px";
const label = new CSS2DObject(infoDiv);
label.element.classList.add("hidden");
scene.add(label);

// Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
window.addEventListener("pointerdown", event => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(markers);
  if (hits.length > 0) {
    const m = hits[0].object;
    const d = m.userData;
    infoDiv.innerHTML = `<b>${d.name}</b><br>${d.info}`;
    label.position.copy(m.position);
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

// Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
animate();
