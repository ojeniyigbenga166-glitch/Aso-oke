import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/addons/controls/OrbitControls.js';
import { gsap } from 'https://esm.sh/gsap@3.12.5';
import { ScrollTrigger } from 'https://esm.sh/gsap@3.12.5/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --- Audio Player ---
const clickSound = document.getElementById('click-sound');
function playClickSound() {
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.volume = 0.15;
    clickSound.play().catch(() => { });
  }
}

// --- Custom Cursor ---
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.custom-cursor-follower');

document.addEventListener('mousemove', (e) => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.05 });
  gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.15 });
});

document.addEventListener('mousedown', () => {
  cursor.classList.add('hover');
  follower.classList.add('hover');
});

document.addEventListener('mouseup', () => {
  cursor.classList.remove('hover');
  follower.classList.remove('hover');
});

// Add hover class to cursor when hovering interactive elements
const hoverables = 'a, button, .gallery-card, .swatch, .timeline-step, input, select, textarea, .angle-btn';
document.addEventListener('mouseover', (e) => {
  if (e.target.closest(hoverables)) {
    cursor.classList.add('hover');
    follower.classList.add('hover');
  }
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest(hoverables)) {
    cursor.classList.remove('hover');
    follower.classList.remove('hover');
  }
});

// --- Scroll & Active Nav ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const nav = document.querySelector('.luxury-nav');

window.addEventListener('scroll', () => {
  // Nav shrink on scroll
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Active link highlighter
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// --- Procedural Canvas Fabric Textures ---
// Generates textures programmatically to resemble woven Aso-Oke structures
const textures = {
  sanyan: createSanyanTexture(),
  alaari: createAlaariTexture(),
  etu: createEtuTexture(),
  'royal-gold': createRoyalGoldTexture(),
};

function createWovenCanvasBase(width, height, color1, color2, weaveScale = 2) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color1;
  ctx.fillRect(0, 0, width, height);

  // Draw warp and weft fibers
  ctx.fillStyle = color2;
  for (let x = 0; x < width; x += weaveScale * 2) {
    for (let y = 0; y < height; y += weaveScale * 2) {
      if ((x + y) % (weaveScale * 4) === 0) {
        ctx.fillRect(x, y, weaveScale, weaveScale);
      }
    }
  }

  // Add micro-noise for organic feel
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  for (let i = 0; i < 20000; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.fillRect(rx, ry, 1, 1);
  }

  return { canvas, ctx };
}

function createSanyanTexture() {
  // Sanyan is brown-grey silk with off-white vertical/horizontal stripes
  const { canvas, ctx } = createWovenCanvasBase(512, 512, '#837466', '#695c51', 2);

  // Draw signature ivory stripes
  ctx.fillStyle = 'rgba(245, 242, 235, 0.85)';

  // Double vertical stripe
  ctx.fillRect(100, 0, 8, 512);
  ctx.fillRect(116, 0, 8, 512);

  ctx.fillRect(380, 0, 8, 512);
  ctx.fillRect(396, 0, 8, 512);

  // Soft metallic weave thread highlights
  ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
  for (let y = 0; y < 512; y += 4) {
    if (Math.random() > 0.6) {
      ctx.fillRect(0, y, 512, 1.5);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createAlaariTexture() {
  // Alaari is a vibrant crimson/magenta colorway
  const { canvas, ctx } = createWovenCanvasBase(512, 512, '#a51c30', '#831221', 2);

  // Draw gold/bronze trim borders
  ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
  ctx.fillRect(80, 0, 12, 512);
  ctx.fillRect(420, 0, 12, 512);

  // Openwork / Eleya holes simulation (using dark dotted rows)
  ctx.fillStyle = 'rgba(15, 12, 10, 0.9)';
  for (let x = 150; x < 360; x += 30) {
    for (let y = 10; y < 512; y += 20) {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Soft light green accent stripe (traditional Alaari often has accents)
  ctx.fillStyle = 'rgba(74, 117, 89, 0.7)';
  ctx.fillRect(250, 0, 4, 512);
  ctx.fillRect(258, 0, 4, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createEtuTexture() {
  // Etu (Guinea fowl) is dark indigo with white specks
  const { canvas, ctx } = createWovenCanvasBase(512, 512, '#182030', '#0f141f', 2);

  // White pinstripes
  ctx.fillStyle = 'rgba(240, 240, 245, 0.8)';
  for (let x = 40; x < 512; x += 60) {
    ctx.fillRect(x, 0, 3, 512);
  }

  // Guinea fowl white specs
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  for (let x = 10; x < 512; x += 30) {
    for (let y = 10; y < 512; y += 30) {
      // Offset grid
      const offset = (Math.floor(x / 30) % 2) * 15;
      ctx.fillRect(x, y + offset, 2, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createRoyalGoldTexture() {
  // Royal Gold is a bright champagne gold with deep bronze patterns
  const { canvas, ctx } = createWovenCanvasBase(512, 512, '#d4af37', '#bd9626', 1);

  // Draw complex geometric Yoruba embroidery/patterns
  ctx.fillStyle = 'rgba(80, 50, 20, 0.4)';
  ctx.lineWidth = 3;

  // Draw diamonds & chevrons
  for (let y = 0; y < 512; y += 128) {
    ctx.beginPath();
    ctx.moveTo(256, y);
    ctx.lineTo(256 + 100, y + 64);
    ctx.lineTo(256, y + 128);
    ctx.lineTo(256 - 100, y + 64);
    ctx.closePath();
    ctx.stroke();

    // Secondary lines
    ctx.beginPath();
    ctx.moveTo(256, y + 20);
    ctx.lineTo(256 + 70, y + 64);
    ctx.lineTo(256, y + 108);
    ctx.lineTo(256 - 70, y + 64);
    ctx.closePath();
    ctx.stroke();
  }

  // Golden shimmer highlights
  ctx.fillStyle = 'rgba(255, 245, 210, 0.9)';
  for (let x = 0; x < 512; x += 16) {
    for (let y = 0; y < 512; y += 16) {
      if (Math.random() > 0.8) {
        ctx.fillRect(x, y, 3, 3);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Custom bump map to simulate coarse woven surface
function createWeaveBumpMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 128, 128);

  // Warp fibers
  ctx.fillStyle = '#ffffff';
  for (let x = 0; x < 128; x += 4) {
    ctx.fillRect(x, 0, 2, 128);
  }
  // Weft fibers
  ctx.fillStyle = '#000000';
  for (let y = 0; y < 128; y += 4) {
    ctx.fillRect(0, y, 128, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(15, 15);
  return texture;
}
const weaveBumpMap = createWeaveBumpMap();

// --- 3D Modeling Helpers ---
// Create a procedural 3D Fila (cap)
function createFilaMesh(material) {
  const group = new THREE.Group();

  // Fila cap body (cylinder slouched and folded)
  const geom = new THREE.CylinderGeometry(1.2, 1.4, 2.2, 32, 10, true);

  // Displace vertices to create folds and natural cloth shape
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const vz = pos.getZ(i);

    // Slouch bend to the left
    if (vy > 0) {
      const bendFactor = (vy + 1.1) / 2.2;
      pos.setX(i, vx + Math.pow(bendFactor, 2) * 0.7);
      pos.setZ(i, vz - Math.pow(bendFactor, 2) * 0.2);
    }

    // Horizontal folding displacement
    const foldAngle = Math.atan2(vz, vx);
    const fold = Math.sin(foldAngle * 4) * 0.08 * (1.1 - Math.abs(vy / 1.1));
    pos.setX(i, pos.getX(i) + Math.cos(foldAngle) * fold);
    pos.setZ(i, pos.getZ(i) + Math.sin(foldAngle) * fold);
  }
  geom.computeVertexNormals();

  const bodyMesh = new THREE.Mesh(geom, material);
  group.add(bodyMesh);

  // Closed top cap
  const capGeom = new THREE.CylinderGeometry(0.1, 1.2, 0.3, 32, 2);
  const capPos = capGeom.attributes.position;
  for (let i = 0; i < capPos.count; i++) {
    const cx = capPos.getX(i);
    const cy = capPos.getY(i);
    const cz = capPos.getZ(i);
    capPos.setX(i, cx + 0.7); // align with slouched bend
    capPos.setZ(i, cz - 0.2);
  }
  capGeom.computeVertexNormals();
  const capMesh = new THREE.Mesh(capGeom, material);
  capMesh.position.y = 1.1;
  group.add(capMesh);

  // Thick brim trim
  const brimGeom = new THREE.TorusGeometry(1.4, 0.12, 16, 100);
  const brimMesh = new THREE.Mesh(brimGeom, material);
  brimMesh.rotation.x = Math.PI / 2;
  brimMesh.position.y = -1.1;
  group.add(brimMesh);

  return group;
}

// Create a Buba (traditional boxy shirt)
function createBubaMesh(material) {
  const group = new THREE.Group();

  // Torso panel (boxy structure)
  const torsoGeom = new THREE.BoxGeometry(2.2, 2.8, 1.2, 10, 10, 10);
  // Slightly bell out the bottom
  const pos = torsoGeom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < 0) {
      const scale = 1.0 - (y / 1.4) * 0.15;
      pos.setX(i, pos.getX(i) * scale);
      pos.setZ(i, pos.getZ(i) * scale);
    }
  }
  torsoGeom.computeVertexNormals();
  const torso = new THREE.Mesh(torsoGeom, material);
  group.add(torso);

  // Sleeves (left and right boxy extensions)
  const sleeveGeom = new THREE.BoxGeometry(1.6, 0.9, 0.9, 5, 5, 5);

  const leftSleeve = new THREE.Mesh(sleeveGeom, material);
  leftSleeve.position.set(-1.7, 0.7, 0);
  leftSleeve.rotation.z = -0.15;
  group.add(leftSleeve);

  const rightSleeve = new THREE.Mesh(sleeveGeom, material);
  rightSleeve.position.set(1.7, 0.7, 0);
  rightSleeve.rotation.z = 0.15;
  group.add(rightSleeve);

  // Neck collar trim (Agbada style split neck)
  const neckGeom = new THREE.TorusGeometry(0.45, 0.05, 8, 32);
  const neck = new THREE.Mesh(neckGeom, material);
  neck.rotation.x = Math.PI / 2;
  neck.position.set(0, 1.4, 0);
  group.add(neck);

  return group;
}

// Create Soro (pants)
function createSoroMesh(material) {
  const group = new THREE.Group();

  const legGeom = new THREE.CylinderGeometry(0.45, 0.35, 2.6, 16, 5);

  const leftLeg = new THREE.Mesh(legGeom, material);
  leftLeg.position.set(-0.45, -1.3, 0);
  leftLeg.rotation.z = -0.05;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeom, material);
  rightLeg.position.set(0.45, -1.3, 0);
  rightLeg.rotation.z = 0.05;
  group.add(rightLeg);

  // Waistband
  const waistGeom = new THREE.CylinderGeometry(0.9, 0.88, 0.4, 24, 2);
  const waist = new THREE.Mesh(waistGeom, material);
  waist.position.y = 0.1;
  group.add(waist);

  return group;
}

// Create a combined mannequin outfit
function createFullOutfit(material) {
  const group = new THREE.Group();

  const buba = createBubaMesh(material);
  buba.position.y = 1.2;
  group.add(buba);

  const soro = createSoroMesh(material);
  soro.position.y = -0.2;
  group.add(soro);

  const fila = createFilaMesh(material);
  fila.position.y = 3.2;
  fila.scale.set(0.75, 0.75, 0.75);
  group.add(fila);

  return group;
}


// --- 1. HERO SECTION 3D SCENE ---
const heroContainer = document.getElementById('hero-3d-container');
if (heroContainer) {
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(45, heroContainer.clientWidth / heroContainer.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  heroContainer.appendChild(renderer.domElement);

  // Load Agbada image texture
  const textureLoader = new THREE.TextureLoader();
  const agbadaTexture = textureLoader.load('/buba_soro_nobg.png');

  // Optimize texture scaling and filtering for maximum sharpness (remove blurriness)
  agbadaTexture.colorSpace = THREE.SRGBColorSpace;
  agbadaTexture.minFilter = THREE.LinearFilter;
  agbadaTexture.generateMipmaps = false;
  agbadaTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  // Create double-sided rendering materials (Front only for front, Front only for back to avoid see-through overlay artifacts)
  const frontMaterial = new THREE.MeshStandardMaterial({
    map: agbadaTexture,
    bumpMap: weaveBumpMap,
    bumpScale: 0.04, // Coarse fabric texture
    roughness: 0.5,
    metalness: 0.6,
    transparent: true,
    side: THREE.FrontSide,
  });

  const backMaterial = frontMaterial.clone();
  backMaterial.side = THREE.FrontSide;
  backMaterial.color.setHex(0x5c4228); // Dark bronze tone for the back side to match the theme

  // Create flat interactive 3D panel for the Agbada
  // Aspect ratio is square (1:1), so 4.2 x 4.2 fits beautifully
  const agbadaGeom = new THREE.PlaneGeometry(4.2, 4.2);
  const agbadaGroup = new THREE.Group();

  const frontMesh = new THREE.Mesh(agbadaGeom, frontMaterial);
  frontMesh.position.set(0, 0, 0.01);
  agbadaGroup.add(frontMesh);

  const backMesh = new THREE.Mesh(agbadaGeom, backMaterial);
  backMesh.rotation.y = Math.PI;
  backMesh.position.set(0, 0, -0.01);
  agbadaGroup.add(backMesh);

  // Positioned lower (-0.7 Y offset) so the cap head is fully visible and not cut off
  agbadaGroup.position.set(0, -0.7, 0);
  scene.add(agbadaGroup);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.5); // Champagne glow
  keyLight.position.set(5, 5, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8c6239, 1.2); // Bronze fill
  fillLight.position.set(-5, -2, 2);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xffffff, 1.8, 10); // Cool rim outline
  rimLight.position.set(0, 2, -3);
  scene.add(rimLight);

  // Floating gold particle dust
  const particleGeom = new THREE.BufferGeometry();
  const particleCount = 180;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 12;
    positions[i + 1] = (Math.random() - 0.5) * 8;
    positions[i + 2] = (Math.random() - 0.5) * 6;
  }
  particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xe5c158,
    size: 0.05,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });

  const particlePoints = new THREE.Points(particleGeom, particleMaterial);
  scene.add(particlePoints);

  // Interactive mouse movement interaction
  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Central Agbada floating (offset lower to show cap head properly)
    agbadaGroup.position.y = -0.7 + Math.sin(elapsedTime * 1.2) * 0.12;

    // Smooth continuous 360-degree Y rotation combined with interactive mouse tilt
    const targetYRotation = (elapsedTime * 0.35) + (mouseX * 0.45);
    agbadaGroup.rotation.y = THREE.MathUtils.lerp(agbadaGroup.rotation.y, targetYRotation, 0.05);
    agbadaGroup.rotation.x = THREE.MathUtils.lerp(agbadaGroup.rotation.x, mouseY * 0.3, 0.05);

    // Animate particles
    const particlePositions = particleGeom.attributes.position.array;
    for (let i = 1; i < particleCount * 3; i += 3) {
      particlePositions[i] -= 0.003; // fall slowly
      if (particlePositions[i] < -4) {
        particlePositions[i] = 4; // reset at top
      }
    }
    particleGeom.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = heroContainer.clientWidth / heroContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
  });
}


// --- 2. INTERACTIVE COLLECTION SHOWCASE (MODAL 3D VIEWER) ---
const modal = document.getElementById('viewer-modal');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const cards = document.querySelectorAll('.gallery-card');
const modalContainer = document.getElementById('modal-3d-container');

// Modal UI element fields
const mCategory = document.getElementById('modal-category');
const mTitle = document.getElementById('modal-title');
const mDesc = document.getElementById('modal-desc');

let modalScene, modalCamera, modalRenderer, modalControls, currentOutfitGroup;
let modalLoopRunning = false;

// Initialize Modal 3D Viewport once
function initModalThree() {
  modalScene = new THREE.Scene();
  modalCamera = new THREE.PerspectiveCamera(40, modalContainer.clientWidth / modalContainer.clientHeight, 0.1, 100);
  modalCamera.position.set(0, 0.5, 7);

  modalRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  modalRenderer.setSize(modalContainer.clientWidth, modalContainer.clientHeight);
  modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  modalRenderer.shadowMap.enabled = true;
  modalContainer.appendChild(modalRenderer.domElement);

  // Controls
  modalControls = new OrbitControls(modalCamera, modalRenderer.domElement);
  modalControls.enableDamping = true;
  modalControls.dampingFactor = 0.05;
  modalControls.maxDistance = 14;
  modalControls.minDistance = 3;

  // Lights — enhanced for mannequin display
  const ambient = new THREE.AmbientLight(0xffffff, 0.45);
  modalScene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xfffaed, 2.5);
  keyLight.position.set(3, 6, 5);
  keyLight.castShadow = true;
  modalScene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xd4af37, 1.4);
  fillLight.position.set(-4, 0, -3);
  modalScene.add(fillLight);

  const topLight = new THREE.SpotLight(0xfff5e6, 2.0, 20, Math.PI / 6, 0.3);
  topLight.position.set(0, 8, 2);
  topLight.target.position.set(0, 0, 0);
  modalScene.add(topLight);
  modalScene.add(topLight.target);
}

// Separate restart-safe render loop — called each time the modal opens
function startModalLoop() {
  if (modalLoopRunning) return;
  modalLoopRunning = true;

  function loop() {
    if (!modal.classList.contains('open')) {
      modalLoopRunning = false;
      return;
    }
    requestAnimationFrame(loop);
    modalControls.update();
    if (currentOutfitGroup) {
      // Gentle idle rotation
      currentOutfitGroup.rotation.y += 0.004;
    }
    modalRenderer.render(modalScene, modalCamera);
  }
  loop();
}

// Load the card's image onto a 3D mannequin/dress form in the modal viewer
// imageUrl: the exact image URL from the card's data-image attribute
function loadOutfitInModal(imageUrl, outfitType, initialTextureKey) {
  if (!modalScene) initModalThree();

  // Remove previous model
  if (currentOutfitGroup) {
    modalScene.remove(currentOutfitGroup);
    currentOutfitGroup = null;
  }

  currentOutfitGroup = new THREE.Group();
  currentOutfitGroup.userData.isImageCard = true;

  // Load the exact same image shown on the card
  const textureLoader = new THREE.TextureLoader();
  const outfitTexture = textureLoader.load(imageUrl, () => {
    // Force a render frame once the texture arrives so it appears immediately
    if (modalRenderer && modalScene && modalCamera) {
      modalRenderer.render(modalScene, modalCamera);
    }
  });
  outfitTexture.colorSpace = THREE.SRGBColorSpace;
  outfitTexture.minFilter = THREE.LinearFilter;
  outfitTexture.generateMipmaps = false;

  const isFila = outfitType === 'fila-designs';

  // ── 1. Dress Form Body (LatheGeometry silhouette) ──────────────────────
  const bodyPoints = isFila
    ? [
      // Hat display pedestal column
      new THREE.Vector2(0.06, -2.4),
      new THREE.Vector2(0.06, 0.6),
      new THREE.Vector2(0.30, 0.6),
      new THREE.Vector2(0.30, 0.72),
    ]
    : [
      // Female/neutral dress form — hem → hip → waist → bust → neck
      new THREE.Vector2(0.55, -2.2),
      new THREE.Vector2(0.65, -1.6),
      new THREE.Vector2(0.62, -0.9),
      new THREE.Vector2(0.38, 0.0),
      new THREE.Vector2(0.54, 0.85),
      new THREE.Vector2(0.50, 1.25),
      new THREE.Vector2(0.14, 1.65),
      new THREE.Vector2(0.11, 1.80),
    ];

  const formGeom = new THREE.LatheGeometry(bodyPoints, 48);
  const formMat = new THREE.MeshStandardMaterial({
    color: 0x1a120c,
    roughness: 0.85,
    metalness: 0.2,
    transparent: true,
    opacity: 0.80,
    side: THREE.DoubleSide,
  });
  currentOutfitGroup.add(new THREE.Mesh(formGeom, formMat));

  // Gold wireframe accent over the form
  const wireGeom = new THREE.LatheGeometry(bodyPoints, 14);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xd4af37,
    wireframe: true,
    transparent: true,
    opacity: 0.14,
  });
  currentOutfitGroup.add(new THREE.Mesh(wireGeom, wireMat));

  // ── 2. Card Image Panel — positioned on the FRONT of the form ───────────
  // Each outfit type has a carefully sized panel that fits over its dress form
  const panelCfg = {
    'buba-soro': { w: 1.10, h: 4.00, z: 0.68, y: -0.20 },
    'fila-designs': { w: 1.55, h: 1.55, z: 0.35, y: 0.55 },
    'wedding-aso-oke': { w: 1.10, h: 4.00, z: 0.68, y: -0.20 },
    'royal-traditional': { w: 1.30, h: 4.20, z: 0.68, y: -0.10 },
    'contemporary-streetwear': { w: 1.15, h: 3.80, z: 0.68, y: -0.15 },
  };
  const pc = panelCfg[outfitType] || panelCfg['buba-soro'];

  const imgGeom = new THREE.PlaneGeometry(pc.w, pc.h);

  // Front face — shows the card's image
  const frontMat = new THREE.MeshStandardMaterial({
    map: outfitTexture,
    transparent: true,
    roughness: 0.55,
    metalness: 0.08,
    side: THREE.FrontSide,
  });
  const frontMesh = new THREE.Mesh(imgGeom, frontMat);
  frontMesh.position.set(0, pc.y, pc.z);
  currentOutfitGroup.add(frontMesh);

  // Back face — same image, slightly dimmed
  const backMat = frontMat.clone();
  backMat.color.setScalar(0.55);
  const backMesh = new THREE.Mesh(imgGeom, backMat);
  backMesh.rotation.y = Math.PI;
  backMesh.position.set(0, pc.y, -pc.z);
  currentOutfitGroup.add(backMesh);

  // ── 3. Head (wireframe gold sphere for full outfits) ────────────────────
  if (!isFila) {
    const headMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xd4af37, wireframe: true, transparent: true, opacity: 0.55 })
    );
    headMesh.position.y = 2.15;
    currentOutfitGroup.add(headMesh);

    // Neck connector
    const neckMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.10, 0.38, 12),
      new THREE.MeshStandardMaterial({ color: 0x2a1e16, roughness: 0.9, metalness: 0.1 })
    );
    neckMesh.position.y = 1.93;
    currentOutfitGroup.add(neckMesh);
  }

  // ── 4. Display Pedestal ─────────────────────────────────────────────────
  // Golden circular base
  const baseMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.88, 0.10, 48),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.12, metalness: 0.95 })
  );
  baseMesh.position.y = -2.42;
  currentOutfitGroup.add(baseMesh);

  // Thin lower plinth
  const plinthMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.88, 0.95, 0.06, 48),
    new THREE.MeshStandardMaterial({ color: 0x8c6239, roughness: 0.2, metalness: 0.85 })
  );
  plinthMesh.position.y = -2.52;
  currentOutfitGroup.add(plinthMesh);

  // Glowing ring around base
  const ringMesh = new THREE.Mesh(
    new THREE.TorusGeometry(0.82, 0.025, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0xebd087, transparent: true, opacity: 0.75 })
  );
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = -2.37;
  currentOutfitGroup.add(ringMesh);

  modalScene.add(currentOutfitGroup);

  // Frame the mannequin nicely in the camera
  modalCamera.position.set(0, 0.2, 7.0);
  modalControls.target.set(0, -0.2, 0);
  modalControls.update();
}

// Swatch Switching click trigger
const swatches = document.querySelectorAll('.swatch');
const swatchColors = {
  sanyan: '#b3a495',
  alaari: '#c2465d',
  etu: '#5c7099',
  'royal-gold': '#ebd087',
};
swatches.forEach((swatch) => {
  swatch.addEventListener('click', (e) => {
    playClickSound();
    swatches.forEach((s) => s.classList.remove('active'));
    swatch.classList.add('active');

    const textureKey = swatch.getAttribute('data-texture');
    if (currentOutfitGroup) {
      const isImageCard = currentOutfitGroup.userData.isImageCard;
      currentOutfitGroup.traverse((child) => {
        if (child.isMesh && child.material) {
          if (isImageCard) {
            child.material.color.setStyle(swatchColors[textureKey]);
            child.material.metalness = textureKey === 'royal-gold' ? 0.6 : 0.25;
          } else {
            child.material.map = textures[textureKey];
            child.material.metalness = textureKey === 'royal-gold' ? 0.7 : 0.18;
          }
          child.material.needsUpdate = true;
        }
      });
    }
  });
});

// Helper to open the modal with data from a card element
function openCardModal(card) {
  playClickSound();
  const outfit = card.getAttribute('data-outfit');
  // Use the card's own data-image attribute as the direct image source for the 3D model
  const imageUrl = card.getAttribute('data-image');
  const title = card.querySelector('.card-title').innerText;
  const cat = card.querySelector('.card-category').innerText;
  const desc = card.querySelector('.card-description').innerText;

  // Update modal text fields
  mTitle.innerText = title;
  mCategory.innerText = cat;
  mDesc.innerText = desc;

  // Reset swatches to first one (Sanyan)
  swatches.forEach((s) => s.classList.remove('active'));
  swatches[0].classList.add('active');

  // Open Modal
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Load 3D mannequin with the card's own image, then (re)start the render loop
  setTimeout(() => {
    loadOutfitInModal(imageUrl, outfit, 'sanyan');
    // Resize renderer to fit the container
    if (modalRenderer) {
      modalRenderer.setSize(modalContainer.clientWidth, modalContainer.clientHeight);
      modalCamera.aspect = modalContainer.clientWidth / modalContainer.clientHeight;
      modalCamera.updateProjectionMatrix();
    }
    // Restart the render loop — it stops when the modal closes,
    // so we must kick it off again each time a card is opened
    startModalLoop();
  }, 150);
}

// Card clicking to open modal
cards.forEach((card) => {
  // "Inspect Fabric" button: explicit click handler
  const exploreBtn = card.querySelector('.btn-explore-card');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent double-firing with card click
      openCardModal(card);
    });
  }

  // Clicking anywhere on the card also opens the modal
  card.addEventListener('click', () => {
    openCardModal(card);
  });
});

// Close modal
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = 'auto';
}

modalCloseBtn.addEventListener('click', () => {
  playClickSound();
  closeModal();
});
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Handle resize for modal 3D view
window.addEventListener('resize', () => {
  if (modal.classList.contains('open') && modalRenderer && modalContainer) {
    modalRenderer.setSize(modalContainer.clientWidth, modalContainer.clientHeight);
    modalCamera.aspect = modalContainer.clientWidth / modalContainer.clientHeight;
    modalCamera.updateProjectionMatrix();
  }
});


// --- 3. FABRIC PATTERN EXPERIENCE (3D CARDS SHADER PANELS) ---
const textilePanels = document.querySelectorAll('.textile-panel-card');
textilePanels.forEach((card) => {
  const container = card.querySelector('.panel-canvas-holder');
  const textureKey = card.getAttribute('data-texture');

  if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 10);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Plane mesh (fabric textile panel)
    const geom = new THREE.PlaneGeometry(1.6, 2.2, 16, 16);

    // Wave ripple vertex displacement simulation
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Give it subtle organic curves
      pos.setZ(i, Math.sin(x * 2.5) * 0.05 + Math.cos(y * 2) * 0.05);
    }
    geom.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      map: textures[textureKey],
      bumpMap: weaveBumpMap,
      bumpScale: 0.08,
      roughness: 0.65,
      metalness: textureKey === 'royal-gold' ? 0.75 : 0.15,
      side: THREE.DoubleSide,
    });

    const panelMesh = new THREE.Mesh(geom, mat);
    scene.add(panelMesh);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const light = new THREE.DirectionalLight(0xfff6e6, 1.8);
    light.position.set(1, 2, 3);
    scene.add(light);

    // Dynamic tilt on card hover
    let targetRotX = 0;
    let targetRotY = 0;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = e.clientX - rect.left - rect.width / 2;
      const cy = e.clientY - rect.top - rect.height / 2;

      targetRotY = (cx / rect.width) * 0.6;
      targetRotX = (cy / rect.height) * -0.6;
    });

    card.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
    });

    function renderPanel() {
      requestAnimationFrame(renderPanel);

      // Smooth lerp tilt rotation
      panelMesh.rotation.y = THREE.MathUtils.lerp(panelMesh.rotation.y, targetRotY, 0.1);
      panelMesh.rotation.x = THREE.MathUtils.lerp(panelMesh.rotation.x, targetRotX, 0.1);

      // Gentle floating animation
      panelMesh.position.y = Math.sin(Date.now() * 0.001) * 0.03;

      renderer.render(scene, camera);
    }
    renderPanel();

    window.addEventListener('resize', () => {
      if (container.clientWidth > 0) {
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
      }
    });
  }
});


// --- 4. VIRTUAL RUNWAY SECTION (SPOTLIGHT CATWALK SHOW) ---
const runwayContainer = document.getElementById('runway-3d-container');
const runwayLooks = [
  {
    id: 'LOOK 01 / COLLECTION',
    name: 'Metamorphic Alaari',
    desc: 'Deep crimson Buba combined with cybernetic bronze shoulder guards. Structured cuts reflecting Lagos futurism.',
    warp: 'Raw Camwood Silk',
    weft: 'Glowing Copper Filaments',
    weight: 'Heavy Structured',
    texture: 'alaari',
    camPos: { x: 0, y: 0.8, z: 6 }
  },
  {
    id: 'LOOK 02 / COLLECTION',
    name: 'Monolithic Sanyan',
    desc: 'Minimalist sand-colored drape dress. Floating panels representing spiritual safety and ancestral protection.',
    warp: 'Wild Anaphe Silk',
    weft: 'Unrefined Linen Cord',
    weight: 'Ultralight Flowing',
    texture: 'sanyan',
    camPos: { x: 1.5, y: 1.2, z: 5.5 }
  },
  {
    id: 'LOOK 03 / COLLECTION',
    name: 'Guinea Plumage (Etu)',
    desc: 'Deep indigo cape set speckled with glass beads that catch spotlight rays. Perfect balance of traditional wisdom and rave culture.',
    warp: 'Fermented Indigo Cotton',
    weft: 'Recycled Silver Core',
    weight: 'Midweight Stiff',
    texture: 'etu',
    camPos: { x: -1.2, y: 0.6, z: 5.8 }
  },
  {
    id: 'LOOK 04 / ARCHIVE',
    name: 'Royal Auric Agbada',
    desc: 'Massive structured golden outerwear with detailed Yoruba geometric embroideries. Made for cyber-royalty.',
    warp: 'Gold-leaf Raffia Fiber',
    weft: 'High-lustre Aureate Thread',
    weight: 'Extra Heavy',
    texture: 'royal-gold',
    camPos: { x: 0, y: 0.8, z: 6.2 }
  }
];

let activeLookIdx = 0;

if (runwayContainer) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050403, 0.08); // Dark atmospheric fog

  const camera = new THREE.PerspectiveCamera(40, runwayContainer.clientWidth / runwayContainer.clientHeight, 0.1, 100);
  camera.position.set(0, 0.8, 6.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(runwayContainer.clientWidth, runwayContainer.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  runwayContainer.appendChild(renderer.domElement);

  // Runway Catwalk structure
  const floorGeom = new THREE.PlaneGeometry(12, 40);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x0c0b0a,
    roughness: 0.12,
    metalness: 0.8,
  });
  const floor = new THREE.Mesh(floorGeom, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.6;
  scene.add(floor);

  // Glowing laser edge lines on catwalk
  const lineGeomLeft = new THREE.BoxGeometry(0.04, 0.01, 40);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
  const lineLeft = new THREE.Mesh(lineGeomLeft, lineMat);
  lineLeft.position.set(-2, -1.59, 0);
  scene.add(lineLeft);

  const lineRight = lineLeft.clone();
  lineRight.position.x = 2;
  scene.add(lineRight);

  // Holographic Mannequin representation
  const hologramGroup = new THREE.Group();

  // Wireframe mannequin core
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), new THREE.MeshBasicMaterial({ color: 0xd4af37, wireframe: true }));
  head.position.y = 1.6;
  hologramGroup.add(head);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.22, 1.2, 8), new THREE.MeshBasicMaterial({ color: 0xd4af37, wireframe: true }));
  torso.position.y = 0.8;
  hologramGroup.add(torso);

  hologramGroup.position.set(0, -0.6, -10); // Start way back down the catwalk
  scene.add(hologramGroup);

  // Garment placed on the mannequin
  const garmentMaterial = new THREE.MeshStandardMaterial({
    map: textures.alaari,
    bumpMap: weaveBumpMap,
    bumpScale: 0.07,
    roughness: 0.7,
    metalness: 0.15,
  });

  let runwayGarment = createFullOutfit(garmentMaterial);
  runwayGarment.scale.set(0.65, 0.65, 0.65);
  runwayGarment.position.set(0, -0.7, 0); // local offset
  hologramGroup.add(runwayGarment);

  // Dynamic Spotlights
  const spotlight = new THREE.SpotLight(0xfff5e6, 15, 20, Math.PI / 8, 0.5, 1);
  spotlight.position.set(0, 8, 2);
  spotlight.target = hologramGroup;
  scene.add(spotlight);

  const backSpotlight = new THREE.SpotLight(0xd4af37, 8, 20, Math.PI / 6, 0.5, 1);
  backSpotlight.position.set(0, 6, -10);
  backSpotlight.target = hologramGroup;
  scene.add(backSpotlight);

  // Loop & Runway Walk walk cycle
  const clock = new THREE.Clock();

  function renderRunway() {
    requestAnimationFrame(renderRunway);
    const elapsedTime = clock.getElapsedTime();

    // Slow-motion glide forward
    const zPos = -10 + (elapsedTime * 0.7) % 15;
    hologramGroup.position.z = zPos;

    // Soft slow motion sway representing model walk cycle
    hologramGroup.position.x = Math.sin(elapsedTime * 1.8) * 0.08;
    hologramGroup.rotation.y = Math.sin(elapsedTime * 1.8) * 0.05;

    // Spotlights follow
    spotlight.position.z = hologramGroup.position.z + 3;

    renderer.render(scene, camera);
  }
  renderRunway();

  // Handle Look switches
  const infoCard = document.getElementById('runway-info');

  function updateRunwayLook(idx) {
    activeLookIdx = idx;
    const look = runwayLooks[idx];

    // Fade UI out
    infoCard.classList.remove('active');
    playClickSound();

    setTimeout(() => {
      // Update specs
      infoCard.querySelector('.runway-model-id').innerText = look.id;
      infoCard.querySelector('.runway-garment-name').innerText = look.name;
      infoCard.querySelector('.runway-garment-desc').innerText = look.desc;

      const specVals = infoCard.querySelectorAll('.spec-item strong');
      specVals[0].innerText = look.warp;
      specVals[1].innerText = look.weft;
      specVals[2].innerText = look.weight;

      // Update texture & material properties
      garmentMaterial.map = textures[look.texture];
      garmentMaterial.metalness = look.texture === 'royal-gold' ? 0.75 : 0.15;
      garmentMaterial.needsUpdate = true;

      // Animate Camera to look's specified layout
      gsap.to(camera.position, {
        x: look.camPos.x,
        y: look.camPos.y,
        z: look.camPos.z,
        duration: 1.5,
        ease: 'power2.out'
      });

      // Update Pagination UI
      document.querySelector('.current-look').innerText = `0${idx + 1}`;

      // Fade UI in
      infoCard.classList.add('active');
    }, 400);
  }

  // Next / Prev Button Listeners
  document.querySelector('.btn-runway-next').addEventListener('click', () => {
    let nextIdx = (activeLookIdx + 1) % runwayLooks.length;
    updateRunwayLook(nextIdx);
  });

  document.querySelector('.btn-runway-prev').addEventListener('click', () => {
    let prevIdx = (activeLookIdx - 1 + runwayLooks.length) % runwayLooks.length;
    updateRunwayLook(prevIdx);
  });

  // Camera angles selectors
  const angleBtns = document.querySelectorAll('.angle-btn');
  angleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      angleBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      playClickSound();

      const angle = btn.getAttribute('data-angle');
      if (angle === 'front') {
        gsap.to(camera.position, { x: 0, y: 0.8, z: 6, duration: 1.2 });
      } else if (angle === 'detail') {
        // Zoom close to garment center
        gsap.to(camera.position, { x: 0, y: 0.2, z: 3.5, duration: 1.2 });
      } else if (angle === 'orbit') {
        // Orbit position showing catwalk depth
        gsap.to(camera.position, { x: 2.5, y: 1.6, z: 5, duration: 1.2 });
      }
    });
  });

  // Initial trigger
  setTimeout(() => {
    infoCard.classList.add('active');
  }, 1000);

  window.addEventListener('resize', () => {
    renderer.setSize(runwayContainer.clientWidth, runwayContainer.clientHeight);
    camera.aspect = runwayContainer.clientWidth / runwayContainer.clientHeight;
    camera.updateProjectionMatrix();
  });
}


// --- 5. CRAFTSMANSHIP SECTION (WARP & WEFT INTERACTIVE LOOM SIMULATOR) ---
const loomContainer = document.getElementById('loom-simulator');
if (loomContainer) {
  const canvas = document.createElement('canvas');
  canvas.width = loomContainer.clientWidth;
  canvas.height = loomContainer.clientHeight;
  loomContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let loomProgress = 0; // Linked to scroll or tick

  // Simulate Loom strings movement
  function drawLoom() {
    ctx.fillStyle = '#070707';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const verticalStrings = 40;
    const spacing = canvas.width / verticalStrings;

    // Draw warp (vertical threads)
    for (let i = 0; i < verticalStrings; i++) {
      const isEven = i % 2 === 0;

      // Push warp up and down dynamically
      const offset = Math.sin((loomProgress * 0.05) + (isEven ? Math.PI : 0)) * 25;

      // Left side is raw thread, right side is woven fabric
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = isEven ? '#8c6239' : '#d4af37';
      ctx.beginPath();
      ctx.moveTo(i * spacing, 0);
      ctx.lineTo(i * spacing, canvas.height / 2 + offset);
      ctx.stroke();

      ctx.lineWidth = 2.0;
      ctx.strokeStyle = isEven ? '#5c171e' : '#f5f2eb';
      ctx.beginPath();
      ctx.moveTo(i * spacing, canvas.height / 2 + offset);
      ctx.lineTo(i * spacing, canvas.height);
      ctx.stroke();
    }

    // Draw weft (horizontal shuttle weaving thread)
    const shuttleY = canvas.height / 2 + Math.sin(loomProgress * 0.05) * 25;
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ebd087';
    ctx.beginPath();
    ctx.moveTo(0, shuttleY);
    ctx.lineTo(canvas.width, shuttleY);
    ctx.stroke();

    // Draw shuttle piece sliding back and forth
    const shuttleX = (Math.sin(loomProgress * 0.08) + 1.0) / 2.0 * canvas.width;
    ctx.fillStyle = '#cd7f32';
    ctx.beginPath();
    ctx.ellipse(shuttleX, shuttleY, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    loomProgress += 1;
    requestAnimationFrame(drawLoom);
  }
  drawLoom();

  // Scroll triggering the active step in the timeline
  const timelineSteps = document.querySelectorAll('.timeline-step');

  timelineSteps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 75%',
      end: 'bottom 25%',
      onEnter: () => {
        timelineSteps.forEach((s) => s.classList.remove('active'));
        step.classList.add('active');
      },
      onEnterBack: () => {
        timelineSteps.forEach((s) => s.classList.remove('active'));
        step.classList.add('active');
      }
    });
  });

  window.addEventListener('resize', () => {
    canvas.width = loomContainer.clientWidth;
    canvas.height = loomContainer.clientHeight;
  });
}


// --- 6. STORE LOCATOR & SHOWROOM INTERACTIVE 3D GLOBE ---
const globeContainer = document.getElementById('globe-3d-container');
const showroomDetails = {
  lagos: {
    name: 'Lagos Showroom',
    address: '12 Victoria Island, Waterfront Boulevard, Lagos',
    status: 'OPEN TODAY UNTIL 8:00 PM',
    lat: 6.428,
    lon: 3.421
  },
  london: {
    name: 'London Studio',
    address: '28 Savile Row, Mayfair, London W1S 3PR',
    status: 'BY APPOINTMENT ONLY',
    lat: 51.511,
    lon: -0.141
  },
  newyork: {
    name: 'New York Showroom',
    address: '450 Mercer Street, SoHo, New York, NY 10012',
    status: 'OPEN TODAY UNTIL 7:00 PM',
    lat: 40.725,
    lon: -7.399
  },
  paris: {
    name: 'Paris Atelier',
    address: '18 Rue du Faubourg Saint-Honoré, 75008 Paris',
    status: 'OPEN TODAY UNTIL 6:30 PM',
    lat: 48.871,
    lon: 2.318
  }
};

if (globeContainer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, globeContainer.clientWidth / globeContainer.clientHeight, 0.1, 10);
  camera.position.z = 5.2;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  globeContainer.appendChild(renderer.domElement);

  // Globe outer sphere
  const globeGeom = new THREE.SphereGeometry(1.8, 48, 48);

  // Draw procedural Continental Map on Canvas for high fidelity Circuit design
  function createGlobeMapTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Space black background
    ctx.fillStyle = '#0b0908';
    ctx.fillRect(0, 0, 1024, 512);

    // Draw stylized dotted coordinate grid representing countries
    ctx.fillStyle = '#3a2d1d';
    for (let x = 0; x < 1024; x += 12) {
      for (let y = 0; y < 512; y += 12) {
        // Simulate land shapes programmatically (very rough map layout approximation)
        // Draw approximate continents
        const lat = (y - 256) / 256 * Math.PI / 2;
        const lon = (x - 512) / 512 * Math.PI;

        let isLand = false;

        // Africa (approx)
        if (lon > -0.3 && lon < 0.9 && lat > -0.6 && lat < 0.6) {
          // Exclude gulf of guinea
          if (!(lon < 0.2 && lat < 0.1 && lat > -0.1)) isLand = true;
        }
        // Europe (approx)
        if (lon > -0.2 && lon < 0.7 && lat >= 0.6 && lat < 1.3) isLand = true;
        // North America (approx)
        if (lon > -2.2 && lon < -0.9 && lat > 0.3 && lat < 1.4) isLand = true;
        // South America (approx)
        if (lon > -1.5 && lon < -0.6 && lat > -0.9 && lat <= 0.3) isLand = true;

        if (isLand) {
          ctx.fillRect(x, y, 3, 3);
        }
      }
    }

    // Latitude & longitude accent lines
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
    ctx.lineWidth = 1.0;
    for (let y = 64; y < 512; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  const globeMaterial = new THREE.MeshStandardMaterial({
    map: createGlobeMapTexture(),
    roughness: 0.45,
    metalness: 0.6,
    bumpScale: 0.05,
  });

  const globe = new THREE.Mesh(globeGeom, globeMaterial);
  scene.add(globe);

  // Showroom Markers (Pins)
  const markerGroup = new THREE.Group();
  globe.add(markerGroup);

  // Helper to convert lat/lon to 3D Cartesian coordinates
  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.sin(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    return new THREE.Vector3(x, y, z);
  }

  // Create pulsing gold pins
  const markers = [];
  Object.keys(showroomDetails).forEach((key) => {
    const loc = showroomDetails[key];
    const pos = latLonToVector3(loc.lat, loc.lon, 1.83); // slightly above surface

    // Pin core point
    const pinGeom = new THREE.SphereGeometry(0.04, 8, 8);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const pin = new THREE.Mesh(pinGeom, pinMat);
    pin.position.copy(pos);
    markerGroup.add(pin);

    // Glowing halo ring
    const ringGeom = new THREE.RingGeometry(0.05, 0.09, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffd700, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeom, ringMat);

    // Orient ring to face outwards from sphere center
    ring.position.copy(pos);
    ring.lookAt(new THREE.Vector3(0, 0, 0));
    markerGroup.add(ring);

    markers.push({ key, pin, ring, scaleFactor: 1.0 });
  });

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const direct1 = new THREE.DirectionalLight(0xfff3d6, 2.0);
  direct1.position.set(5, 3, 5);
  scene.add(direct1);

  // Orbit controls (damping only, no zooming)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.8;

  // Globe hover interaction raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onGlobeClick(event) {
    // Get mouse pos relative to canvas container
    const rect = globeContainer.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markerGroup.children);

    if (intersects.length > 0) {
      // Find matching pin
      const hitObj = intersects[0].object;
      const found = markers.find(m => m.pin === hitObj || m.ring === hitObj);
      if (found) {
        updateShowroomDetails(found.key);
      }
    }
  }
  globeContainer.addEventListener('click', onGlobeClick);

  // Update showroom text UI elements
  const locName = document.querySelector('.showroom-location-name');
  const locAddr = document.querySelector('.showroom-address');
  const locStat = document.querySelector('.showroom-status');

  function updateShowroomDetails(key) {
    const data = showroomDetails[key];
    playClickSound();

    gsap.fromTo('.showroom-details-panel',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6 }
    );

    locName.innerText = data.name;
    locAddr.innerText = data.address;
    locStat.innerHTML = `<span class="pulse-dot"></span> ${data.status}`;

    // Select form location selector dropdown if present
    const selector = document.getElementById('booking-location');
    if (selector) {
      selector.value = key;
    }
  }

  // Animation Loop
  function loop() {
    requestAnimationFrame(loop);

    // Pulsate pins halos
    markers.forEach((m) => {
      m.scaleFactor += 0.03;
      const scale = 1.0 + Math.sin(m.scaleFactor) * 0.4;
      m.ring.scale.set(scale, scale, 1.0);
      m.ring.material.opacity = 0.8 - (scale - 1.0) / 0.4 * 0.5;
    });

    controls.update();
    renderer.render(scene, camera);
  }
  loop();

  window.addEventListener('resize', () => {
    renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
    camera.aspect = globeContainer.clientWidth / globeContainer.clientHeight;
    camera.updateProjectionMatrix();
  });
}


// --- 7. APPOINTMENT BOOKING FORM LOGIC ---
const bookingForm = document.getElementById('fitting-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    playClickSound();

    const name = document.getElementById('booking-name').value;
    const email = document.getElementById('booking-email').value;
    const date = document.getElementById('booking-date').value;
    const loc = document.getElementById('booking-location').value;
    const fabric = document.getElementById('booking-fabric').value;

    // Show booking confirm alert using premium minimal design styling
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
      position: fixed;
      bottom: 40px;
      right: 40px;
      background: #110e0c;
      border: 1px solid #d4af37;
      padding: 24px 36px;
      color: #f5f2eb;
      font-family: var(--font-sans);
      box-shadow: 0 15px 40px rgba(0,0,0,0.8);
      z-index: 10000;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.5s ease;
    `;
    successMsg.innerHTML = `
      <h4 style="color:#d4af37; margin-bottom:8px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase;">Request Received</h4>
      <p style="font-size:0.85rem; color:#a09a8e; font-weight:300;">Thank you, ${name}. Our concierge will email you details shortly.</p>
    `;
    document.body.appendChild(successMsg);

    // Fade in
    setTimeout(() => {
      successMsg.style.opacity = '1';
      successMsg.style.transform = 'translateY(0)';
    }, 100);

    // Fade out
    setTimeout(() => {
      successMsg.style.opacity = '0';
      successMsg.style.transform = 'translateY(20px)';
      setTimeout(() => successMsg.remove(), 500);
    }, 5000);

    bookingForm.reset();
  });
}


// --- 8. GSAP SCROLL-TRIGGERED ANlMATIONS ---
// Animate Hero text loads
window.addEventListener('DOMContentLoaded', () => {
  const tl = gsap.timeline();

  tl.from('.brand-badge', { opacity: 0, y: 15, duration: 0.8, delay: 0.3 })
    .from('.hero-title span', {
      opacity: 0,
      y: 35,
      stagger: 0.2,
      duration: 1.0,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
    .from('.hero-btns a', {
      opacity: 0,
      y: 15,
      stagger: 0.15,
      duration: 0.8
    }, '-=0.5')
    .from('.scroll-indicator', { opacity: 0, duration: 0.8 }, '-=0.4');

  // Register section headings reveals on scroll
  sections.forEach((sec) => {
    const label = sec.querySelector('.sec-label');
    const title = sec.querySelector('.sec-title');
    const desc = sec.querySelector('.sec-desc');

    if (title) {
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'top 80%',
        }
      });

      if (label) headerTl.from(label, { opacity: 0, y: 10, duration: 0.5 });
      headerTl.from(title, { opacity: 0, y: 25, duration: 0.8, ease: 'power2.out' }, '-=0.3');
      if (desc) headerTl.from(desc, { opacity: 0, y: 15, duration: 0.6 }, '-=0.5');
    }
  });
});
