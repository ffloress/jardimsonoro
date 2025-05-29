import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer, CSS2DObject } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS2DRenderer.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 2000);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(10, 10, 10);
scene.add(light);

// Globe texture
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

// Marker data
const countriesData = [
  {
    "name": "S\u00f3nar Festival \u2013 \ud83c\uddea\ud83c\uddf8 Espanha",
    "lat": 41.3545,
    "lon": 2.1282,
    "infoDivId": "info-sonar"
  },
  {
    "name": "Green Man \u2013 \ud83c\uddec\ud83c\udde7 Reino Unido",
    "lat": 51.859,
    "lon": -3.137,
    "infoDivId": "info-greenman"
  },
  {
    "name": "Les Vieilles Charrues \u2013 \ud83c\uddeb\ud83c\uddf7 Fran\u00e7a",
    "lat": 48.276,
    "lon": -3.572,
    "infoDivId": "info-vieillescharrues"
  },
  {
    "name": "A Porta \u2013 \ud83c\uddf5\ud83c\uddf9 Portugal",
    "lat": 39.7436,
    "lon": -8.8077,
    "infoDivId": "info-aporta"
  },
  {
    "name": "SXSW \u2013 \ud83c\uddfa\ud83c\uddf8 Estados Unidos",
    "lat": 30.2667,
    "lon": -97.7333,
    "infoDivId": "info-sxsw"
  },
  {
    "name": "Treefort Music Fest \u2013 \ud83c\uddfa\ud83c\uddf8 Boise, Idaho",
    "lat": 43.615,
    "lon": -116.2023,
    "infoDivId": "info-treefort"
  },
  {
    "name": "Le Guess Who? \u2013 \ud83c\uddf3\ud83c\uddf1 Holanda",
    "lat": 52.0907,
    "lon": 5.1214,
    "infoDivId": "info-leguesswho"
  },
  {
    "name": "MUTEK \u2013 \ud83c\udde8\ud83c\udde6 Canad\u00e1",
    "lat": 45.5017,
    "lon": -73.5673,
    "infoDivId": "info-mutekca"
  },
  {
    "name": "MUTEK \u2013 \ud83c\uddef\ud83c\uddf5 Jap\u00e3o",
    "lat": 35.6895,
    "lon": 139.6917,
    "infoDivId": "info-mutekjp"
  },
  {
    "name": "MUTEK \u2013 \ud83c\uddf2\ud83c\uddfd M\u00e9xico",
    "lat": 19.4326,
    "lon": -99.1332,
    "infoDivId": "info-mutekmx"
  },
  {
    "name": "BIGSOUND \u2013 \ud83c\udde6\ud83c\uddfa Austr\u00e1lia",
    "lat": -27.4701,
    "lon": 153.0211,
    "infoDivId": "info-bigsound"
  },
  {
    "name": "Festival BR-135 \u2013 \ud83c\udde7\ud83c\uddf7 Brasil",
    "lat": -2.5297,
    "lon": -44.3028,
    "infoDivId": "info-br135"
  },
  {
    "name": "Expo Rock Recife \u2013 \ud83c\udde7\ud83c\uddf7 Brasil",
    "lat": -8.0476,
    "lon": -34.877,
    "infoDivId": "info-exporockrecife"
  },
  {
    "name": "Dois Dias e Duas Noites de M\u00fasica Nova \u2013 \ud83c\uddfa\ud83c\udde6 Ucr\u00e2nia",
    "lat": 46.4825,
    "lon": 30.7233,
    "infoDivId": "info-2d2nmusicaua"
  },
  {
    "name": "KaZantip \u2013 \ud83c\uddfa\ud83c\udde6 Ucr\u00e2nia",
    "lat": 45.2958,
    "lon": 33.9608,
    "infoDivId": "info-kazantip"
  },
  {
    "name": "Leopolis Jazz Fest \u2013 \ud83c\uddfa\ud83c\udde6 Ucr\u00e2nia",
    "lat": 49.8397,
    "lon": 24.0297,
    "infoDivId": "info-leopolisjazz"
  },
  {
    "name": "Electric Castle \u2013 \ud83c\uddf7\ud83c\uddf4 Rom\u00eania",
    "lat": 46.9037,
    "lon": 23.7771,
    "infoDivId": "info-electriccastle"
  },
  {
    "name": "Exit Festival \u2013 \ud83c\uddf7\ud83c\uddf8 S\u00e9rvia",
    "lat": 45.252,
    "lon": 19.861,
    "infoDivId": "info-exitfest"
  },
  {
    "name": "Pohoda Festival \u2013 \ud83c\uddf8\ud83c\uddf0 Eslov\u00e1quia",
    "lat": 48.8945,
    "lon": 18.04,
    "infoDivId": "info-pohoda"
  },
  {
    "name": "Soundwave Festival \u2013 \ud83c\udded\ud83c\uddf7 Cro\u00e1cia",
    "lat": 43.8,
    "lon": 15.65,
    "infoDivId": "info-soundwavehr"
  },
  {
    "name": "Converg\u00eancia C\u00f3smica \u2013 \ud83c\uddec\ud83c\uddf9 Guatemala",
    "lat": 14.7,
    "lon": -91.2,
    "infoDivId": "info-cosmicconvergence"
  },
  {
    "name": "Envision Festival \u2013 \ud83c\udde8\ud83c\uddf7 Costa Rica",
    "lat": 9.152,
    "lon": -83.742,
    "infoDivId": "info-envisioncr"
  },
  {
    "name": "We The Fest \u2013 \ud83c\uddee\ud83c\udde9 Indon\u00e9sia",
    "lat": -6.2088,
    "lon": 106.8456,
    "infoDivId": "info-wethefestid"
  },
  {
    "name": "Fuji Rock Festival \u2013 \ud83c\uddef\ud83c\uddf5 Jap\u00e3o",
    "lat": 36.94,
    "lon": 138.8,
    "infoDivId": "info-fujirock"
  },
  {
    "name": "Good Vibes Festival \u2013 \ud83c\uddf2\ud83c\uddfe Mal\u00e1sia",
    "lat": 3.139,
    "lon": 101.6869,
    "infoDivId": "info-goodvibesmy"
  },
  {
    "name": "Rock al Parque \u2013 \ud83c\udde8\ud83c\uddf4 Col\u00f4mbia",
    "lat": 4.711,
    "lon": -74.0721,
    "infoDivId": "info-rockalparqueco"
  },
  {
    "name": "Noise Pop Festival \u2013 \ud83c\uddfa\ud83c\uddf8 Calif\u00f3rnia",
    "lat": 37.7749,
    "lon": -122.4194,
    "infoDivId": "info-noisepopca"
  },
  {
    "name": "Monterey Jazz Festival \u2013 \ud83c\uddfa\ud83c\uddf8 Calif\u00f3rnia",
    "lat": 36.6002,
    "lon": -121.8947,
    "infoDivId": "info-montereyjazzca"
  },
  {
    "name": "Sauti za Busara \u2013 \ud83c\uddf9\ud83c\uddff Tanz\u00e2nia",
    "lat": -6.1659,
    "lon": 39.2026,
    "infoDivId": "info-sautizabusaratz"
  },
  {
    "name": "Festival Gnaoua e de M\u00fasicas do Mundo \u2013 \ud83c\uddf2\ud83c\udde6 Marrocos",
    "lat": 31.5085,
    "lon": -9.7595,
    "infoDivId": "info-gnaouama"
  },
  {
    "name": "Bushfire Festival \u2013 \ud83c\uddf8\ud83c\uddff Essuat\u00edni",
    "lat": -26.4626,
    "lon": 31.2483,
    "infoDivId": "info-bushfiresz"
  },
  {
    "name": "Cape Town International Jazz Festival \u2013 \ud83c\uddff\ud83c\udde6 \u00c1frica do Sul",
    "lat": -33.9249,
    "lon": 18.4241,
    "infoDivId": "info-capetownjazzza"
  },
  {
    "name": "Festival AZGO \u2013 \ud83c\uddf2\ud83c\uddff Mo\u00e7ambique",
    "lat": -25.9692,
    "lon": 32.5732,
    "infoDivId": "info-azgomz"
  },
  {
    "name": "Kriol Jazz Festival \u2013 \ud83c\udde8\ud83c\uddfb Cabo Verde",
    "lat": 14.933,
    "lon": -23.5133,
    "infoDivId": "info-krioljazzcv"
  },
  {
    "name": "Festival Nacional de Artes \u2013 \ud83c\uddff\ud83c\udde6 \u00c1frica do Sul",
    "lat": -33.3,
    "lon": 26.53,
    "infoDivId": "info-nationalartsza"
  },
  {
    "name": "Festival Folcl\u00f3rico de Cosqu\u00edn \u2013 \ud83c\udde6\ud83c\uddf7 Argentina",
    "lat": -31.245,
    "lon": -64.465,
    "infoDivId": "info-cosquinfolk"
  },
  {
    "name": "Festival Internacional de M\u00fasica Contempor\u00e2nea \u2013 \ud83c\udde8\ud83c\uddf1 Chile",
    "lat": -33.4489,
    "lon": -70.6693,
    "infoDivId": "info-musicacontempcl"
  },
  {
    "name": "Festival de Jazz de Buenos Aires \u2013 \ud83c\udde6\ud83c\uddf7 Argentina",
    "lat": -34.6037,
    "lon": -58.3816,
    "infoDivId": "info-jazzbuenosaires"
  },
  {
    "name": "Rock The Mountain \u2013 \ud83c\udde7\ud83c\uddf7 Brasil",
    "lat": -22.4241,
    "lon": -43.0916,
    "infoDivId": "info-rockthemountainbr"
  },
  {
    "name": "Rock in Rio \u2013 \ud83c\udde7\ud83c\uddf7 Brasil",
    "lat": -22.9756,
    "lon": -43.3658,
    "infoDivId": "info-rockinriobr"
  },
  {
    "name": "Coachella Valley Music and Arts Festival \u2013 \ud83c\uddfa\ud83c\uddf8 Calif\u00f3rnia",
    "lat": 33.6784,
    "lon": -116.2377,
    "infoDivId": "info-coachella"
  },
  {
    "name": "Sunburn Festival \u2013 \ud83c\uddee\ud83c\uddf3 \u00cdndia",
    "lat": 15.601,
    "lon": 73.7396,
    "infoDivId": "info-sunburnin"
  },
  {
    "name": "Lollapalooza Argentina \u2013 \ud83c\udde6\ud83c\uddf7 Argentina",
    "lat": -34.489,
    "lon": -58.512,
    "infoDivId": "info-lollapaloozaar"
  },
  {
    "name": "Primavera Sound Buenos Aires \u2013 \ud83c\udde6\ud83c\uddf7 Argentina",
    "lat": -34.5679,
    "lon": -58.5125,
    "infoDivId": "info-primaverasoundar"
  },
  {
    "name": "Ultra Buenos Aires \u2013 \ud83c\udde6\ud83c\uddf7 Argentina",
    "lat": -34.657,
    "lon": -58.478,
    "infoDivId": "info-ultraar"
  },
  {
    "name": "Burning Man \u2013 \ud83c\uddfa\ud83c\uddf8 Estados Unidos",
    "lat": 40.7864,
    "lon": -119.2044,
    "infoDivId": "info-burningman"
  }
];

// Marker setup
const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const markers = [];

countriesData.forEach(data => {
  const phi = THREE.MathUtils.degToRad(90 - data.lat);
  const theta = THREE.MathUtils.degToRad(data.lon + 180);
  const position = new THREE.Vector3().setFromSphericalCoords(globeRadius + 0.05, phi, theta);

  const material = new THREE.MeshBasicMaterial({ color: 0xff3232 });
  const marker = new THREE.Mesh(markerGeometry, material);
  marker.position.copy(position);
  marker.userData = { ...data, clicked: false };
  scene.add(marker);
  markers.push(marker);
});

// Raycasting
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
window.addEventListener("pointerdown", event => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(markers);
  if (intersects.length > 0) {
    const marker = intersects[0].object;
    const infoId = marker.userData.infoDivId;
    const htmlInfo = document.getElementById(infoId);
    if (htmlInfo) {
      htmlInfo.classList.remove("hidden");
      htmlInfo.style.position = "absolute";
      htmlInfo.style.top = "10px";
      htmlInfo.style.right = "10px";
      htmlInfo.style.background = "rgba(0,0,0,0.8)";
      htmlInfo.style.color = "#fff";
      htmlInfo.style.padding = "12px";
      htmlInfo.style.borderRadius = "8px";
      htmlInfo.style.maxWidth = "300px";
    }
    if (!marker.userData.clicked) {
      marker.material.color.set(0x32CD32); // turn green
      marker.userData.clicked = true;
    }
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
