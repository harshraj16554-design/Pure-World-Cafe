import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SceneSettings } from '../types';

interface CoffeeScene3DProps {
  scrollProgress: number; // 0.0 to 1.0 representing the pinned scroll choreography
  activeChapter: number;
  sceneSettings: SceneSettings;
}

export const CoffeeScene3D: React.FC<CoffeeScene3DProps> = ({
  scrollProgress,
  activeChapter,
  sceneSettings,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(scrollProgress);
  const currentProgressRef = useRef(scrollProgress);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    targetProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- SCENE, CAMERA, RENDERER ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0a09, 0.038);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.3, 7.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- ULTRA-REALISTIC STUDIO LIGHTING RIG ---
    const ambientLight = new THREE.AmbientLight(0xfff6ec, 0.9);
    scene.add(ambientLight);

    // Warm Key Light (Morning window sunlight on barista counter)
    const keyLight = new THREE.DirectionalLight(0xffecd2, 2.6);
    keyLight.position.set(5.5, 8.5, 4.5);
    scene.add(keyLight);

    // Cool Sky Fill Light (Separates porcelain shadows)
    const fillLight = new THREE.DirectionalLight(0xd4be9e, 1.4);
    fillLight.position.set(-5.5, 4.0, -2.5);
    scene.add(fillLight);

    // Sharp Back Rim Light (Fresnel highlight on cup lip, liquid meniscus, and ice edges)
    const rimLight = new THREE.DirectionalLight(0xffffff, 3.2);
    rimLight.position.set(0, 7.0, -5.5);
    scene.add(rimLight);

    // Dedicated Top Spotlight onto liquid surface
    const spotLight = new THREE.SpotLight(0xffdfb8, 3.8, 14, Math.PI / 5, 0.45, 1.2);
    spotLight.position.set(0, 6.5, 2.2);
    scene.add(spotLight);

    // --- PROCEDURAL HIGH-DYNAMIC STUDIO ENVIRONMENT MAP ---
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const envCtx = envCanvas.getContext('2d')!;

    // Rich luxury studio ambient base
    envCtx.fillStyle = '#0c0a08';
    envCtx.fillRect(0, 0, 1024, 512);

    // Overhead studio softbox
    const softboxGrad = envCtx.createRadialGradient(512, 90, 10, 512, 90, 240);
    softboxGrad.addColorStop(0, '#ffffff');
    softboxGrad.addColorStop(0.35, '#fff7ed');
    softboxGrad.addColorStop(0.7, '#e2cbaf');
    softboxGrad.addColorStop(1, 'rgba(12, 10, 8, 0)');
    envCtx.fillStyle = softboxGrad;
    envCtx.fillRect(0, 0, 1024, 300);

    // Warm amber counter bounce light
    const bounceGrad = envCtx.createRadialGradient(240, 280, 5, 240, 280, 180);
    bounceGrad.addColorStop(0, 'rgba(235, 185, 110, 0.7)');
    bounceGrad.addColorStop(1, 'rgba(12, 10, 8, 0)');
    envCtx.fillStyle = bounceGrad;
    envCtx.fillRect(0, 120, 480, 320);

    // Cool rim specular fill
    const rimGrad = envCtx.createRadialGradient(800, 250, 5, 800, 250, 170);
    rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    rimGrad.addColorStop(1, 'rgba(12, 10, 8, 0)');
    envCtx.fillStyle = rimGrad;
    envCtx.fillRect(600, 100, 424, 320);

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTexture;

    // --- MASTER COFFEE RIG GROUP ---
    const cupGroup = new THREE.Group();
    scene.add(cupGroup);

    // Micro-imperfection bump map for hand-glazed artisanal porcelain
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 256;
    bumpCanvas.height = 256;
    const bCtx = bumpCanvas.getContext('2d')!;
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 450; i++) {
      const bx = Math.random() * 256;
      const by = Math.random() * 256;
      const br = 1.5 + Math.random() * 3.5;
      bCtx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
      bCtx.beginPath();
      bCtx.arc(bx, by, br, 0, Math.PI * 2);
      bCtx.fill();
    }
    const ceramicBumpTexture = new THREE.CanvasTexture(bumpCanvas);
    ceramicBumpTexture.wrapS = THREE.RepeatWrapping;
    ceramicBumpTexture.wrapT = THREE.RepeatWrapping;
    ceramicBumpTexture.repeat.set(4, 4);

    // Ultra-realistic glazed porcelain ceramic
    const ceramicMat = new THREE.MeshPhysicalMaterial({
      color: 0x161210,
      roughness: 0.08,
      metalness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      ior: 1.54,
      reflectivity: 0.98,
      bumpMap: ceramicBumpTexture,
      bumpScale: 0.0025,
    });

    // 24k Gold Leaf Trim Material
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xedc76a,
      metalness: 0.98,
      roughness: 0.12,
    });

    // --- COFFEE CUP LATHE GEOMETRY (Authentic profile with inner curved floor) ---
    const cupPoints: THREE.Vector2[] = [];
    cupPoints.push(new THREE.Vector2(0, 0.02));
    cupPoints.push(new THREE.Vector2(0.96, 0.04));
    cupPoints.push(new THREE.Vector2(1.16, 0.32));
    cupPoints.push(new THREE.Vector2(1.36, 0.92));
    cupPoints.push(new THREE.Vector2(1.50, 1.55));
    cupPoints.push(new THREE.Vector2(1.54, 1.88)); // Lip apex
    cupPoints.push(new THREE.Vector2(1.46, 1.86)); // Smooth inner lip bevel
    cupPoints.push(new THREE.Vector2(1.42, 1.55));
    cupPoints.push(new THREE.Vector2(1.28, 0.92));
    cupPoints.push(new THREE.Vector2(1.08, 0.35));
    cupPoints.push(new THREE.Vector2(0.86, 0.18));
    cupPoints.push(new THREE.Vector2(0, 0.18));

    const cupGeom = new THREE.LatheGeometry(cupPoints, 64);
    const cupMesh = new THREE.Mesh(cupGeom, ceramicMat);
    cupGroup.add(cupMesh);

    // Gold Trim Ring around lip
    const goldRimGeom = new THREE.TorusGeometry(1.51, 0.024, 18, 72);
    goldRimGeom.rotateX(Math.PI / 2);
    goldRimGeom.translate(0, 1.87, 0);
    const goldRimMesh = new THREE.Mesh(goldRimGeom, goldTrimMat);
    cupGroup.add(goldRimMesh);

    // Ergonomic Ceramic Handle
    const handleCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(1.38, 1.58, 0),
      new THREE.Vector3(2.42, 1.48, 0),
      new THREE.Vector3(2.34, 0.42, 0),
      new THREE.Vector3(1.14, 0.42, 0)
    );
    const handleGeom = new THREE.TubeGeometry(handleCurve, 42, 0.142, 20, false);
    const handleMesh = new THREE.Mesh(handleGeom, ceramicMat);
    cupGroup.add(handleMesh);

    // Ceramic Saucer Plate with recessed foot ring
    const saucerPoints: THREE.Vector2[] = [];
    saucerPoints.push(new THREE.Vector2(0, -0.09));
    saucerPoints.push(new THREE.Vector2(1.25, -0.09));
    saucerPoints.push(new THREE.Vector2(1.32, -0.14)); // Recessed foot ring
    saucerPoints.push(new THREE.Vector2(1.38, -0.14));
    saucerPoints.push(new THREE.Vector2(1.42, -0.09));
    saucerPoints.push(new THREE.Vector2(1.88, 0.05));
    saucerPoints.push(new THREE.Vector2(2.56, 0.24));
    saucerPoints.push(new THREE.Vector2(2.65, 0.30));
    saucerPoints.push(new THREE.Vector2(2.57, 0.28));
    saucerPoints.push(new THREE.Vector2(1.75, 0.02));
    saucerPoints.push(new THREE.Vector2(1.05, -0.05));
    saucerPoints.push(new THREE.Vector2(0, -0.05));
    const saucerGeom = new THREE.LatheGeometry(saucerPoints, 64);
    const saucerMesh = new THREE.Mesh(saucerGeom, ceramicMat);
    saucerMesh.position.y = -0.06;
    cupGroup.add(saucerMesh);

    // Saucer Gold Rim
    const saucerGoldRim = new THREE.TorusGeometry(2.58, 0.022, 18, 72);
    saucerGoldRim.rotateX(Math.PI / 2);
    saucerGoldRim.translate(0, 0.27, 0);
    const saucerGoldMesh = new THREE.Mesh(saucerGoldRim, goldTrimMat);
    cupGroup.add(saucerGoldMesh);

    // Soft Ambient Occlusion Contact Shadow on Ground (Multi-pass radial falloff)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const shadowCtx = shadowCanvas.getContext('2d')!;

    // Soft penumbra
    const sGrad = shadowCtx.createRadialGradient(256, 256, 20, 256, 256, 240);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
    sGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0.38)');
    sGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.12)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowCtx.fillStyle = sGrad;
    shadowCtx.fillRect(0, 0, 512, 512);

    // Sharp contact ring right beneath the saucer foot ring
    shadowCtx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
    shadowCtx.lineWidth = 14;
    shadowCtx.beginPath();
    shadowCtx.arc(256, 256, 92, 0, Math.PI * 2);
    shadowCtx.stroke();

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlaneGeom = new THREE.PlaneGeometry(6.8, 6.8);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowPlaneGeom, shadowPlaneMat);
    shadowMesh.rotateX(-Math.PI / 2);
    shadowMesh.position.y = -0.21;
    cupGroup.add(shadowMesh);

    // --- DYNAMIC CAPILLARY MENISCUS COFFEE LIQUID SURFACE ---
    const liquidCanvas = document.createElement('canvas');
    liquidCanvas.width = 1024;
    liquidCanvas.height = 1024;
    const liquidCtx = liquidCanvas.getContext('2d')!;

    const liquidTexture = new THREE.CanvasTexture(liquidCanvas);
    liquidTexture.wrapS = THREE.ClampToEdgeWrapping;
    liquidTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Physical Crema Bump Map (Gives real 3D micro-relief to foam bubbles & tiger streaks)
    const liquidBumpCanvas = document.createElement('canvas');
    liquidBumpCanvas.width = 1024;
    liquidBumpCanvas.height = 1024;
    const liquidBumpCtx = liquidBumpCanvas.getContext('2d')!;

    const liquidBumpTexture = new THREE.CanvasTexture(liquidBumpCanvas);
    liquidBumpTexture.wrapS = THREE.ClampToEdgeWrapping;
    liquidBumpTexture.wrapT = THREE.ClampToEdgeWrapping;

    const liquidMat = new THREE.MeshPhysicalMaterial({
      map: liquidTexture,
      bumpMap: liquidBumpTexture,
      bumpScale: 0.007,
      roughness: 0.12,
      metalness: 0.04,
      clearcoat: 0.96,
      clearcoatRoughness: 0.035,
      ior: 1.34,
      reflectivity: 0.96,
    });

    // High-resolution tessellated liquid cylinder for real-time 3D wave simulation & capillary meniscus
    const liquidGeom = new THREE.CylinderGeometry(1.455, 1.435, 0.08, 64, 20);
    const liquidMesh = new THREE.Mesh(liquidGeom, liquidMat);
    liquidMesh.position.y = 1.63;
    cupGroup.add(liquidMesh);

    // Save initial vertex positions to calculate dynamic fluid displacements in real-time
    const initialLiquidPos = Float32Array.from(liquidGeom.attributes.position.array);

    // Dynamic high-resolution liquid canvas drawer with authentic espresso crema, tigratura & motion shearing
    const renderLiquidTexture = (progress: number, time: number, motionSpeed = 0) => {
      liquidCtx.clearRect(0, 0, 1024, 1024);
      liquidBumpCtx.fillStyle = '#808080';
      liquidBumpCtx.fillRect(0, 0, 1024, 1024);

      const cx = 512;
      const cy = 512;

      // 1. BASE ESPRESSO LIQUOR & EXTRACTION DEPTH
      const baseGrad = liquidCtx.createRadialGradient(cx, cy, 30, cx, cy, 510);
      if (progress < 0.45) {
        // Authentic freshly pulled espresso: rich tawny hazelnut froth over deep reddish-brown liquor
        baseGrad.addColorStop(0, '#743c1c');
        baseGrad.addColorStop(0.2, '#5e2e14');
        baseGrad.addColorStop(0.5, '#421d0a');
        baseGrad.addColorStop(0.82, '#281105');
        baseGrad.addColorStop(0.96, '#180802'); // Wet oil ring near wall
        baseGrad.addColorStop(1, '#0e0401');
      } else if (progress < 0.68) {
        // Milk blending in -> velvety flat white / cafe latte tone
        baseGrad.addColorStop(0, '#a26b48');
        baseGrad.addColorStop(0.35, '#82502f');
        baseGrad.addColorStop(0.7, '#583019');
        baseGrad.addColorStop(0.92, '#34190c');
        baseGrad.addColorStop(1, '#1a0b04');
      } else {
        // Sub-zero cold brew / Kyoto drip crystalline clarity
        baseGrad.addColorStop(0, '#422212');
        baseGrad.addColorStop(0.55, '#281309');
        baseGrad.addColorStop(0.9, '#140803');
        baseGrad.addColorStop(1, '#080301');
      }

      liquidCtx.fillStyle = baseGrad;
      liquidCtx.beginPath();
      liquidCtx.arc(cx, cy, 508, 0, Math.PI * 2);
      liquidCtx.fill();

      // 2. CONVECTIVE FLUID SWIRLS & TIGRATURA (TIGER STRIPING)
      liquidCtx.save();
      liquidCtx.translate(cx, cy);

      // Subtle breathing motion of hot coffee convection
      const convTime = time * 0.35;
      const ribbonCount = 10;
      for (let r = 0; r < ribbonCount; r++) {
        const rAngle = (r / ribbonCount) * Math.PI * 2 + Math.sin(convTime + r * 0.8) * 0.18;
        const radDist = 140 + (r % 3) * 90 + Math.sin(convTime * 0.8 + r) * 25;
        const rx = Math.cos(rAngle) * radDist;
        const ry = Math.sin(rAngle) * radDist;

        // Color swirl: alternating golden hazelnut froth and dark extraction currents
        const swirlGrad = liquidCtx.createRadialGradient(rx, ry, 15, rx, ry, 180);
        if (r % 2 === 0) {
          swirlGrad.addColorStop(0, 'rgba(235, 172, 110, 0.28)');
          swirlGrad.addColorStop(0.5, 'rgba(195, 126, 70, 0.12)');
          swirlGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          swirlGrad.addColorStop(0, 'rgba(38, 16, 6, 0.32)');
          swirlGrad.addColorStop(0.5, 'rgba(65, 28, 11, 0.15)');
          swirlGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        liquidCtx.fillStyle = swirlGrad;
        liquidCtx.beginPath();
        liquidCtx.arc(rx, ry, 180, 0, Math.PI * 2);
        liquidCtx.fill();

        // Corresponding subtle height variation on bump map
        const bumpSwirl = liquidBumpCtx.createRadialGradient(cx + rx, cy + ry, 10, cx + rx, cy + ry, 160);
        bumpSwirl.addColorStop(0, r % 2 === 0 ? 'rgba(150, 150, 150, 0.3)' : 'rgba(110, 110, 110, 0.3)');
        bumpSwirl.addColorStop(1, 'rgba(128, 128, 128, 0)');
        liquidBumpCtx.fillStyle = bumpSwirl;
        liquidBumpCtx.fillRect(0, 0, 1024, 1024);
      }

      // Tigratura Mottling Flecks (fine micro-streaks of dark roast oil)
      liquidCtx.fillStyle = 'rgba(45, 18, 7, 0.38)';
      for (let f = 0; f < 36; f++) {
        const fAngle = f * 0.42 + Math.sin(convTime * 0.5 + f) * 0.08;
        const fDist = 90 + (f * 17) % 360;
        const fx = Math.cos(fAngle) * fDist;
        const fy = Math.sin(fAngle) * fDist;
        liquidCtx.beginPath();
        liquidCtx.ellipse(fx, fy, 14 + (f % 10), 4 + (f % 5), fAngle + Math.PI / 4, 0, Math.PI * 2);
        liquidCtx.fill();
      }
      liquidCtx.restore();

      // 3. CELLULAR MICRO-FOAM MATRIX (Dense microscopic bubble froth)
      const totalBubbles = 220;
      for (let b = 0; b < totalBubbles; b++) {
        const bAngle = b * 0.175 + Math.sin(convTime * 0.4 + b * 0.2) * 0.02;
        // Surface tension causes 75% of bubbles to cluster densely near the outer capillary meniscus rim (dist 390 - 495)
        const isRim = b % 4 !== 0;
        const bDist = isRim ? 400 + (b * 11) % 92 : 80 + (b * 23) % 290;
        const bx = cx + Math.cos(bAngle) * bDist;
        const by = cy + Math.sin(bAngle) * bDist;
        const bRadius = isRim ? 3.0 + (b % 4.8) : 2.0 + (b % 3.2);

        // Dark surfactant boundary ring (cell wall)
        liquidCtx.fillStyle = 'rgba(28, 11, 4, 0.55)';
        liquidCtx.beginPath();
        liquidCtx.arc(bx, by, bRadius + 1.2, 0, Math.PI * 2);
        liquidCtx.fill();

        // Warm golden micro-foam cell body
        liquidCtx.fillStyle = isRim ? 'rgba(240, 182, 126, 0.42)' : 'rgba(215, 155, 98, 0.35)';
        liquidCtx.beginPath();
        liquidCtx.arc(bx, by, bRadius, 0, Math.PI * 2);
        liquidCtx.fill();

        // Pinpoint specular highlight glint
        liquidCtx.fillStyle = 'rgba(255, 255, 255, 0.82)';
        liquidCtx.beginPath();
        liquidCtx.arc(bx - bRadius * 0.35, by - bRadius * 0.35, bRadius * 0.32, 0, Math.PI * 2);
        liquidCtx.fill();

        // PHYSICAL BUMP RELIEF FOR BUBBLE DOMES
        const bGrad = liquidBumpCtx.createRadialGradient(bx, by, 0.5, bx, by, bRadius + 1);
        bGrad.addColorStop(0, '#ffffff'); // Peak height
        bGrad.addColorStop(0.7, '#b0b0b0');
        bGrad.addColorStop(1, '#606060'); // Dark edge dip
        liquidBumpCtx.fillStyle = bGrad;
        liquidBumpCtx.beginPath();
        liquidBumpCtx.arc(bx, by, bRadius + 1, 0, Math.PI * 2);
        liquidBumpCtx.fill();
      }

      // 4. LATTE ART BLOOM (Triggered during Milk Flow stage: 0.48 - 0.68)
      if (progress > 0.46) {
        const latteBloom = Math.min(Math.max((progress - 0.46) / 0.16, 0), 1);
        liquidCtx.save();
        liquidCtx.translate(cx, cy);
        liquidCtx.rotate(-Math.PI / 4 + Math.sin(time * 0.2) * 0.04);

        // 9-tier barista rosetta floret with organic feathery microfoam marbling
        const petals = 9;
        for (let p = 0; p < petals; p++) {
          const petalScale = (1 - p * 0.09) * latteBloom;
          const offsetY = (p * 42 - 96) * latteBloom;

          // Velvet white microfoam
          liquidCtx.fillStyle = `rgba(255, 252, 245, ${0.94 * latteBloom})`;
          liquidCtx.beginPath();
          liquidCtx.ellipse(0, offsetY, 86 * petalScale, 40 * petalScale, 0, 0, Math.PI * 2);
          liquidCtx.fill();

          // Crema contrast halo
          liquidCtx.fillStyle = `rgba(142, 88, 52, ${0.42 * latteBloom})`;
          liquidCtx.beginPath();
          liquidCtx.ellipse(0, offsetY + 10, 36 * petalScale, 18 * petalScale, 0, 0, Math.PI * 2);
          liquidCtx.fill();

          // Bump map height for raised microfoam
          liquidBumpCtx.save();
          liquidBumpCtx.translate(cx, cy);
          liquidBumpCtx.rotate(-Math.PI / 4 + Math.sin(time * 0.2) * 0.04);
          liquidBumpCtx.fillStyle = `rgba(210, 210, 210, ${0.75 * latteBloom})`;
          liquidBumpCtx.beginPath();
          liquidBumpCtx.ellipse(0, offsetY, 86 * petalScale, 40 * petalScale, 0, 0, Math.PI * 2);
          liquidBumpCtx.fill();
          liquidBumpCtx.restore();
        }

        // Rosetta central stem line
        liquidCtx.strokeStyle = `rgba(255, 252, 245, ${0.96 * latteBloom})`;
        liquidCtx.lineWidth = 14 * latteBloom;
        liquidCtx.lineCap = 'round';
        liquidCtx.beginPath();
        liquidCtx.moveTo(0, -210 * latteBloom);
        liquidCtx.lineTo(0, 250 * latteBloom);
        liquidCtx.stroke();

        liquidCtx.restore();
      }

      // 5. SUGAR DISSOLVE RIPPLE RINGS (Triggered during Sugar stage: 0.86 - 0.96)
      if (progress > 0.85 && progress < 0.98) {
        const sugarProgress = Math.min(Math.max((progress - 0.85) / 0.10, 0), 1);
        for (let r = 0; r < 5; r++) {
          const ringRadius = ((time * 75 + r * 85) % 400) * sugarProgress;
          const ringAlpha = Math.max(0, 0.55 * (1 - ringRadius / 400)) * sugarProgress;
          liquidCtx.strokeStyle = `rgba(255, 230, 160, ${ringAlpha})`;
          liquidCtx.lineWidth = 6.5;
          liquidCtx.beginPath();
          liquidCtx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
          liquidCtx.stroke();
        }
      }

      liquidTexture.needsUpdate = true;
      liquidBumpTexture.needsUpdate = true;
    };

    // --- 3D POURING MILK STREAM ---
    const milkPoints = [
      new THREE.Vector3(2.4, 5.5, 0.9),
      new THREE.Vector3(1.6, 4.2, 0.6),
      new THREE.Vector3(0.8, 2.9, 0.25),
      new THREE.Vector3(0.08, 1.70, 0.02),
    ];
    const milkCurve = new THREE.CatmullRomCurve3(milkPoints);
    const milkGeom = new THREE.TubeGeometry(milkCurve, 48, 0.09, 16, false);
    const milkMat = new THREE.MeshPhysicalMaterial({
      color: 0xfffcf5,
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 0.95,
      transmission: 0.1,
      transparent: true,
      opacity: 0,
    });
    const milkStream = new THREE.Mesh(milkGeom, milkMat);
    scene.add(milkStream);

    // Dynamic splash ripple ring at impact
    const splashGeom = new THREE.RingGeometry(0.06, 0.42, 28);
    splashGeom.rotateX(-Math.PI / 2);
    const splashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const splashRing = new THREE.Mesh(splashGeom, splashMat);
    splashRing.position.set(0.08, 1.65, 0.02);
    cupGroup.add(splashRing);

    // --- 3D TRANSLUCENT ICE CUBES ---
    const iceGroup = new THREE.Group();
    scene.add(iceGroup);

    const iceMat = new THREE.MeshPhysicalMaterial({
      color: 0xe8f4ff,
      transmission: 0.92,
      opacity: 0.94,
      transparent: true,
      roughness: 0.07,
      ior: 1.33,
      metalness: 0.04,
      clearcoat: 0.9,
    });

    const iceCubes: THREE.Mesh[] = [];
    const iceConfigs = [
      { x: -0.35, y: 7.5, z: 0.25, rot: [0.4, 0.8, 0.3], targetY: 1.74 },
      { x: 0.38, y: 8.8, z: -0.28, rot: [0.8, 0.3, 0.7], targetY: 1.70 },
      { x: 0.08, y: 10.2, z: 0.38, rot: [0.3, 0.6, 0.9], targetY: 1.78 },
    ];

    iceConfigs.forEach((cfg) => {
      const cubeGeom = new THREE.BoxGeometry(0.56, 0.56, 0.56);
      const cube = new THREE.Mesh(cubeGeom, iceMat);
      cube.position.set(cfg.x, cfg.y, cfg.z);
      cube.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      iceGroup.add(cube);
      iceCubes.push(cube);
    });

    // Ice splash water droplets
    const dropletCount = 28;
    const dropletGeom = new THREE.SphereGeometry(0.038, 8, 8);
    const dropletMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      transparent: true,
      opacity: 0,
      roughness: 0.04,
    });
    const droplets: THREE.Mesh[] = [];
    for (let i = 0; i < dropletCount; i++) {
      const drop = new THREE.Mesh(dropletGeom, dropletMat);
      drop.position.set(0, 1.65, 0);
      scene.add(drop);
      droplets.push(drop);
    }

    // --- VOLUMETRIC STEAM PARTICLES ---
    const steamCount = 95;
    const steamGeom = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      const r = Math.random() * 0.85;
      const th = Math.random() * Math.PI * 2;
      steamPositions[i * 3] = Math.cos(th) * r;
      steamPositions[i * 3 + 1] = 1.7 + Math.random() * 2.8;
      steamPositions[i * 3 + 2] = Math.sin(th) * r;
    }
    steamGeom.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

    const steamCanvas = document.createElement('canvas');
    steamCanvas.width = 128;
    steamCanvas.height = 128;
    const sCtx = steamCanvas.getContext('2d')!;
    const stmGrad = sCtx.createRadialGradient(64, 64, 4, 64, 64, 60);
    stmGrad.addColorStop(0, 'rgba(255, 248, 240, 0.85)');
    stmGrad.addColorStop(0.35, 'rgba(245, 235, 220, 0.4)');
    stmGrad.addColorStop(0.75, 'rgba(220, 205, 190, 0.1)');
    stmGrad.addColorStop(1, 'rgba(200, 190, 180, 0)');
    sCtx.fillStyle = stmGrad;
    sCtx.fillRect(0, 0, 128, 128);
    const steamTexture = new THREE.CanvasTexture(steamCanvas);

    const steamMat = new THREE.PointsMaterial({
      size: 0.72,
      map: steamTexture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const steamParticles = new THREE.Points(steamGeom, steamMat);
    scene.add(steamParticles);

    // --- SUGAR CRYSTAL PARTICLES ---
    const sugarCount = 120;
    const sugarGeom = new THREE.BufferGeometry();
    const sugarPositions = new Float32Array(sugarCount * 3);
    for (let i = 0; i < sugarCount; i++) {
      sugarPositions[i * 3] = (Math.random() - 0.5) * 1.5;
      sugarPositions[i * 3 + 1] = 4.8 + Math.random() * 3.5;
      sugarPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    sugarGeom.setAttribute('position', new THREE.BufferAttribute(sugarPositions, 3));

    const sugarMat = new THREE.PointsMaterial({
      size: 0.095,
      color: 0xfff6d8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const sugarParticles = new THREE.Points(sugarGeom, sugarMat);
    scene.add(sugarParticles);

    // --- 3D ULTRA-REALISTIC ROASTED COFFEE BEANS ---
    const beanGroup = new THREE.Group();
    scene.add(beanGroup);

    // Sculpted organic coffee bean geometry with realistic cleft & domed dorsal side
    const beanGeom = new THREE.SphereGeometry(0.32, 28, 24);
    const posAttr = beanGeom.attributes.position;
    for (let p = 0; p < posAttr.count; p++) {
      let x = posAttr.getX(p);
      let y = posAttr.getY(p) * 1.55; // Oblong length
      let z = posAttr.getZ(p) * 0.82; // Thickness

      // Ventral (inner crease) side vs Dorsal (back) side
      if (z > 0.03) {
        // Flatten inner face
        z = z * 0.44;
        // Indent longitudinal fissure / center cleft
        const distFromCenter = Math.abs(x);
        if (distFromCenter < 0.12) {
          const indent = (0.12 - distFromCenter) * 1.5;
          z -= indent;
        }
      } else {
        // Rounded domed back
        z = z * 1.08;
      }

      // Taper ends
      const endCurve = 1.0 - Math.pow(Math.abs(y) / 0.5, 3) * 0.16;
      x *= endCurve;

      posAttr.setXYZ(p, x, y, z);
    }
    beanGeom.computeVertexNormals();

    // Roasted bean physical material with oily gloss sheen
    const beanMat = new THREE.MeshPhysicalMaterial({
      color: 0x30180d,
      roughness: 0.28,
      metalness: 0.08,
      clearcoat: 0.45,
      clearcoatRoughness: 0.12,
    });

    const beanCreaseMat = new THREE.MeshBasicMaterial({
      color: 0x110704,
    });

    const beanCount = 14;
    const beans: {
      mesh: THREE.Group;
      radiusOffset: number;
      baseY: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      orbitSpeed: number;
      phase: number;
    }[] = [];

    for (let i = 0; i < beanCount; i++) {
      const singleBeanRig = new THREE.Group();

      const bMesh = new THREE.Mesh(beanGeom, beanMat);
      singleBeanRig.add(bMesh);

      // Deep dark inner cleft line
      const seamGeom = new THREE.BoxGeometry(0.04, 0.86, 0.16);
      const seamMesh = new THREE.Mesh(seamGeom, beanCreaseMat);
      seamMesh.position.z = 0.03;
      singleBeanRig.add(seamMesh);

      // Staggered vertical heights and diverse orbit distances outside cup
      const radiusOffset = 0.25 + (i % 4) * 0.45; // safe offset outside cup
      const baseY = -0.4 + (i % 5) * 0.55;

      singleBeanRig.scale.setScalar(0.72 + (i % 3) * 0.15);
      beanGroup.add(singleBeanRig);

      beans.push({
        mesh: singleBeanRig,
        radiusOffset,
        baseY,
        rotSpeedX: (Math.random() - 0.5) * 1.5,
        rotSpeedY: (Math.random() - 0.5) * 2.0,
        rotSpeedZ: (Math.random() - 0.5) * 1.2,
        orbitSpeed: 0.28 + (i % 3) * 0.12,
        phase: (i / beanCount) * Math.PI * 2,
      });
    }

    // --- RESIZE & RESPONSIVE CAMERA HANDLER ---
    const updateResponsiveCamera = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const aspect = width / height;
      camera.aspect = aspect;

      // Adjust camera distance & FOV for mobile phone portrait vs desktop widescreen
      const isMobile = width < 768 || aspect < 1.0;
      if (isMobile) {
        camera.fov = 50;
        camera.position.set(0, 2.0, 9.4);
      } else {
        camera.fov = 42;
        camera.position.set(0, 2.3, 7.8);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    updateResponsiveCamera();
    window.addEventListener('resize', updateResponsiveCamera);

    // --- MOUSE & TOUCH PARALLAX TRACKERS ---
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.45;
      mouseRef.current.targetY = y * 0.35;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleTouchMove = (e: TouchEvent) => {
      if (!container || !e.touches[0]) return;
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.35;
      mouseRef.current.targetY = y * 0.25;
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // --- FLUID INERTIA & MOTION SLOSH VARIABLES ---
    let prevCupX = 1.45;
    let sloshVelX = 0;
    let sloshAngleX = 0;
    let prevProg = 0;

    // --- ANIMATION CLOCK & LOOP ---
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.08);

      // Smooth lerp on scroll progress for velvety lag-free movement
      const targetProg = targetProgressRef.current;
      currentProgressRef.current += (targetProg - currentProgressRef.current) * 0.088;
      const progress = currentProgressRef.current;

      const scrollVelocity = progress - prevProg;
      prevProg = progress;
      const motionSpeed = Math.abs(scrollVelocity);

      // Smooth mouse parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Dynamic liquid texture with motion-reactive fluid shearing
      renderLiquidTexture(progress, elapsedTime, motionSpeed);

      // =========================================================================
      // USER-SPECIFIED CHOREOGRAPHY TIMELINE:
      //
      // 1. Entry: on scrolling, coffee enters from RIGHT (x: 4.2 -> 1.5) with transition
      // 2. Quote appears (progress 0.08 - 0.20)
      // 3. On further scroll, quote disappears, ONLY 3D coffee moves to LEFT (x: 1.5 -> -1.45)
      // 4. Steam moves (progress 0.28 - 0.40) & chapter details appear on right
      // 5. Text disappears, coffee moves to CENTER-RIGHT (x: -1.45 -> 0.85)
      // 6. Milk flows in & Rosetta blooms (progress 0.48 - 0.62) & details appear on left
      // 7. Text disappears, coffee moves to RIGHT (x: 0.85 -> 1.5)
      // 8. Ice cube drop & sub-zero splash (progress 0.69 - 0.82) & details on left
      // 9. Text disappears, coffee moves to LEFT (x: 1.5 -> -1.3)
      // 10. Sugar dissolve & golden shimmer (progress 0.88 - 0.96) & details on right
      // 11. Full 360 cinematic presentation & floating beans orbit (progress 0.96 - 1.0)
      // =========================================================================

      let targetX = 1.45;
      let targetY = 0.05;
      let targetRotX = 0.24;
      let targetRotY = 0.2;
      let targetRotZ = 0;

      if (progress < 0.08) {
        // Stage 1: Entrance from the RIGHT
        const t = Math.min(progress / 0.08, 1);
        targetX = 4.2 - t * 2.75; // 4.2 -> 1.45
        targetY = 0.05 + Math.sin(t * Math.PI) * 0.15;
        targetRotX = 0.24;
        targetRotY = 0.8 - t * 0.6; // rotating into position
      } else if (progress < 0.20) {
        // Stage 2: Stationed on the RIGHT while Hero Quote is visible on the left
        targetX = 1.45;
        targetY = 0.05 + Math.sin(elapsedTime * 0.8) * 0.04;
        targetRotX = 0.24;
        targetRotY = 0.2 + Math.sin(elapsedTime * 0.4) * 0.08;
      } else if (progress < 0.28) {
        // Stage 3: All text disappears -> Coffee glides from RIGHT to LEFT
        const t = (progress - 0.20) / 0.08;
        // Smooth easeInOut
        const ease = t * t * (3 - 2 * t);
        targetX = 1.45 - ease * 2.90; // 1.45 -> -1.45
        targetY = 0.05 + Math.sin(ease * Math.PI) * 0.25;
        targetRotX = 0.24 + ease * 0.32; // tilts forward to reveal hot crema
        targetRotY = 0.2 - ease * 0.4;
      } else if (progress < 0.40) {
        // Stage 4: Stationed on the LEFT while Steam & Roast details appear on right
        targetX = -1.45;
        targetY = 0.05 + Math.sin(elapsedTime * 0.8) * 0.04;
        targetRotX = 0.56; // tilted so user looks into hot coffee
        targetRotY = -0.2 + Math.sin(elapsedTime * 0.5) * 0.06;
      } else if (progress < 0.48) {
        // Stage 5: Text disappears -> Coffee glides from LEFT to CENTER-RIGHT
        const t = (progress - 0.40) / 0.08;
        const ease = t * t * (3 - 2 * t);
        targetX = -1.45 + ease * 2.30; // -1.45 -> 0.85
        targetY = 0.05 + Math.sin(ease * Math.PI) * 0.2;
        targetRotX = 0.56 - ease * 0.15;
        targetRotY = -0.2 + ease * 0.35;
      } else if (progress < 0.62) {
        // Stage 6: Stationed on CENTER-RIGHT while Milk Flows In
        targetX = 0.85;
        targetY = 0.05;
        targetRotX = 0.42;
        targetRotY = 0.15 + Math.sin(elapsedTime * 0.3) * 0.04;
      } else if (progress < 0.69) {
        // Stage 7: Text disappears -> Coffee glides from CENTER-RIGHT to RIGHT
        const t = (progress - 0.62) / 0.07;
        const ease = t * t * (3 - 2 * t);
        targetX = 0.85 + ease * 0.65; // 0.85 -> 1.50
        targetY = 0.05;
        targetRotX = 0.42 - ease * 0.18; // levels upright for ice drop
        targetRotY = 0.15 - ease * 0.15;
      } else if (progress < 0.82) {
        // Stage 8: Stationed on the RIGHT while Ice Cubes Drop
        targetX = 1.50;
        targetY = 0.05;
        targetRotX = 0.24;
        targetRotY = Math.sin(elapsedTime * 0.3) * 0.05;
      } else if (progress < 0.88) {
        // Stage 9: Text disappears -> Coffee glides from RIGHT to LEFT
        const t = (progress - 0.82) / 0.06;
        const ease = t * t * (3 - 2 * t);
        targetX = 1.50 - ease * 2.80; // 1.50 -> -1.30
        targetY = 0.05 + Math.sin(ease * Math.PI) * 0.2;
        targetRotX = 0.24 + ease * 0.18;
        targetRotY = ease * 0.3;
      } else if (progress < 0.95) {
        // Stage 10: Stationed on LEFT while Sugar Dissolves
        targetX = -1.30;
        targetY = 0.05;
        targetRotX = 0.42;
        targetRotY = 0.3 + Math.sin(elapsedTime * 0.4) * 0.05;
      } else {
        // Stage 11: Text disappears -> Coffee Centers for 360 Full Odyssey
        const t = (progress - 0.95) / 0.05;
        const ease = t * t * (3 - 2 * t);
        targetX = -1.30 + ease * 1.30; // -1.30 -> 0.0
        targetY = 0.05;
        targetRotX = 0.32;
        targetRotY = 0.3 + elapsedTime * 0.45; // 360 spin!
      }

      // Responsive scaling and positioning for mobile screens vs desktop widescreen
      const isMobile = window.innerWidth < 768;
      const xFactor = isMobile ? 0.44 : 1.0;
      const cupScale = isMobile ? 0.74 : 1.0;
      cupGroup.scale.setScalar(cupScale);

      // Apply coordinates with mouse & touch parallax
      cupGroup.position.x = (targetX * xFactor) + mouseRef.current.x * 0.45;
      cupGroup.position.y = (isMobile ? targetY + (targetX > 0 ? 0.12 : -0.12) : targetY) + mouseRef.current.y * 0.35;
      cupGroup.position.z = 0;

      cupGroup.rotation.x = targetRotX;
      cupGroup.rotation.y = targetRotY + mouseRef.current.x * 0.25;
      cupGroup.rotation.z = targetRotZ + mouseRef.current.y * 0.15;

      // --- FLUID INERTIA & REAL-TIME SLOSHING PHYSICS ---
      const cupDispX = cupGroup.position.x - prevCupX;
      prevCupX = cupGroup.position.x;

      sloshVelX += -cupDispX * 26.0;
      sloshVelX += -sloshAngleX * 18.0 * delta; // restoring gravity
      sloshVelX *= 0.88; // fluid viscosity damping
      sloshAngleX += sloshVelX * delta;

      // Slosh tilt & gravity-aligned leveling inside the tilted cup
      liquidMesh.rotation.z = sloshAngleX * 0.44;
      liquidMesh.rotation.x = -cupGroup.rotation.x * 0.28;

      // --- REAL-TIME 3D FLUID VERTEX WAVE & RIPPLE DISPLACEMENT ---
      const posAttr = liquidGeom.attributes.position;
      const vertCount = posAttr.count;
      for (let i = 0; i < vertCount; i++) {
        const initY = initialLiquidPos[i * 3 + 1];
        if (initY > 0.02) { // Top liquid surface vertices
          const px = posAttr.getX(i);
          const pz = posAttr.getZ(i);
          const r = Math.sqrt(px * px + pz * pz);

          // 1. Motion slosh wave across movement axis
          let dynamicH = (px / 1.45) * sloshAngleX * 0.065;

          // 2. Motion scrolling concentric capillary ripples propagating outward
          dynamicH += Math.sin(r * 18.0 - elapsedTime * 10.0) * Math.min(motionSpeed * 4.5, 0.045);

          // 3. Natural convective micro-rippling
          dynamicH += Math.sin(px * 5.5 + elapsedTime * 2.2) * Math.cos(pz * 5.5 + elapsedTime * 2.0) * 0.005;

          // 4. Pouring milk impact crater & radiating ripples (progress 0.47 - 0.63)
          if (progress >= 0.47 && progress <= 0.63) {
            dynamicH += Math.sin(r * 22.0 - elapsedTime * 16.0) * Math.exp(-r * 1.8) * 0.038;
          }

          // 5. Ice cube impact splash waves (progress 0.68 - 0.84)
          if (progress >= 0.68 && progress <= 0.84) {
            dynamicH += Math.sin(r * 16.0 - elapsedTime * 12.0) * Math.exp(-r * 1.4) * 0.042;
          }

          // Capillary meniscus rise against the porcelain wall
          const meniscus = Math.pow(Math.max(0, (r - 1.15) / 0.305), 3) * 0.038;

          posAttr.setY(i, 0.04 + dynamicH + meniscus);
        }
      }
      posAttr.needsUpdate = true;
      liquidGeom.computeVertexNormals();

      // --- 1. STEAM SIMULATION ---
      // Steam moves intensely during stage 4 (progress 0.25 - 0.44)
      const steamPos = steamGeom.attributes.position.array as Float32Array;
      const steamSpeedMultiplier = sceneSettings.steamSpeed || 1.0;
      let targetSteamOpacity = 0.08;
      if (progress >= 0.24 && progress <= 0.44) {
        targetSteamOpacity = 0.78 * sceneSettings.steamDensity;
      } else if (progress > 0.44 && progress <= 0.62) {
        targetSteamOpacity = 0.35;
      }
      steamMat.opacity += (targetSteamOpacity - steamMat.opacity) * 0.06;

      for (let i = 0; i < steamCount; i++) {
        steamPos[i * 3 + 1] += 0.018 * steamSpeedMultiplier * (1 + (i % 3) * 0.2);
        steamPos[i * 3] += Math.sin(elapsedTime * 2.2 + steamPos[i * 3 + 1] * 2.5) * 0.006;
        steamPos[i * 3 + 2] += Math.cos(elapsedTime * 2.0 + steamPos[i * 3 + 1] * 2.2) * 0.006;

        if (steamPos[i * 3 + 1] > 5.2) {
          const r = Math.random() * 0.7;
          const th = Math.random() * Math.PI * 2;
          steamPos[i * 3] = cupGroup.position.x + Math.cos(th) * r;
          steamPos[i * 3 + 1] = cupGroup.position.y + 1.68;
          steamPos[i * 3 + 2] = cupGroup.position.z + Math.sin(th) * r;
        }
      }
      steamGeom.attributes.position.needsUpdate = true;

      // --- 2. MILK POUR STREAM SIMULATION ---
      // Milk flows in during progress 0.48 - 0.62
      if (progress >= 0.47 && progress <= 0.63) {
        const streamT = Math.sin(((progress - 0.47) / 0.16) * Math.PI);
        milkMat.opacity = Math.min(streamT * 1.15, 0.96);
        splashMat.opacity = Math.min(streamT * 0.85, 0.7);
        splashRing.scale.setScalar(1 + Math.sin(elapsedTime * 14) * 0.28);
        milkStream.position.x = cupGroup.position.x * 0.85 + Math.sin(elapsedTime * 12) * 0.015;
        milkStream.position.y = cupGroup.position.y;
      } else {
        milkMat.opacity = 0;
        splashMat.opacity = 0;
      }

      // --- 3. ICE CUBE DROP SIMULATION ---
      // Ice drops down during progress 0.69 - 0.82
      if (progress >= 0.68 && progress <= 0.84) {
        iceGroup.visible = true;
        const dropNorm = (progress - 0.68) / 0.14; // 0.0 -> 1.0

        iceCubes.forEach((cube, idx) => {
          const cfg = iceConfigs[idx];
          const cubeProgress = Math.min(Math.max((dropNorm - idx * 0.18) / 0.5, 0), 1);
          const currentY = cfg.y - (cfg.y - cfg.targetY) * Math.sin(cubeProgress * Math.PI * 0.5);
          cube.position.y = currentY;
          cube.position.x = cfg.x + cupGroup.position.x;
          cube.position.z = cfg.z + cupGroup.position.z;

          cube.rotation.x += 0.02 * (1 - cubeProgress);
          cube.rotation.y += 0.03 * (1 - cubeProgress);

          // Splash droplets spray out when ice impacts liquid
          if (cubeProgress > 0.72 && cubeProgress < 0.96) {
            dropletMat.opacity = 0.8;
            droplets.forEach((drop, dIdx) => {
              const dAngle = (dIdx / dropletCount) * Math.PI * 2;
              const dDist = 0.2 + (cubeProgress - 0.72) * 3.6;
              drop.position.x = Math.cos(dAngle) * dDist + cupGroup.position.x;
              drop.position.y = 1.66 + Math.sin((cubeProgress - 0.72) * 5) * 0.85;
              drop.position.z = Math.sin(dAngle) * dDist + cupGroup.position.z;
            });
          } else {
            dropletMat.opacity = 0;
          }
        });
      } else if (progress > 0.84) {
        // Resting chilled inside drink
        iceGroup.visible = true;
        iceCubes.forEach((cube, idx) => {
          const cfg = iceConfigs[idx];
          cube.position.y = cfg.targetY + Math.sin(elapsedTime * 1.5 + idx) * 0.03;
          cube.position.x = cfg.x + cupGroup.position.x;
          cube.position.z = cfg.z + cupGroup.position.z;
          cube.scale.setScalar(0.78);
        });
        dropletMat.opacity = 0;
      } else {
        iceGroup.visible = false;
        dropletMat.opacity = 0;
      }

      // --- 4. SUGAR CRYSTAL DISSOLVE SIMULATION ---
      // Sugar falls and dissolves during progress 0.87 - 0.96
      const sugarPos = sugarGeom.attributes.position.array as Float32Array;
      if (progress >= 0.86 && progress <= 0.97) {
        sugarMat.opacity = 0.9;
        for (let i = 0; i < sugarCount; i++) {
          sugarPos[i * 3 + 1] -= 0.048 * (1 + (i % 4) * 0.25);
          if (sugarPos[i * 3 + 1] < 1.65) {
            sugarPos[i * 3 + 1] = 4.5 + Math.random() * 2.5;
            sugarPos[i * 3] = cupGroup.position.x + (Math.random() - 0.5) * 1.2;
            sugarPos[i * 3 + 2] = cupGroup.position.z + (Math.random() - 0.5) * 1.2;
          }
        }
        sugarGeom.attributes.position.needsUpdate = true;
      } else {
        sugarMat.opacity = 0;
      }

      // --- 5. FLOATING COFFEE BEANS (ORBITING SMOOTHLY AROUND CUP, NEVER CLIPPING) ---
      if (sceneSettings.showBeans) {
        beanGroup.visible = true;
        const orbitMultiplier = sceneSettings.beanOrbitSpeed || 1.0;

        // Dynamically follow the moving cup's center coordinates
        const cupCenterX = cupGroup.position.x;
        const cupCenterY = cupGroup.position.y;
        const cupCenterZ = cupGroup.position.z;

        // Safe clearance radius ensures beans orbit strictly around the outside of the cup, saucer, and handle
        const safeBaseRadius = isMobile ? 2.85 : 3.25;

        beans.forEach((b) => {
          const currentAngle = b.phase + elapsedTime * b.orbitSpeed * orbitMultiplier + progress * 2.4;
          const currentRadius = safeBaseRadius + b.radiusOffset * (isMobile ? 0.8 : 1.0);

          let beanX = cupCenterX + Math.cos(currentAngle) * currentRadius;
          let beanZ = cupCenterZ + Math.sin(currentAngle) * currentRadius;
          let beanY = cupCenterY + b.baseY + Math.sin(elapsedTime * 1.5 + b.phase) * 0.28;

          // Mathematical clearance barrier:
          // Saucer rim extends to 2.6, handle extends to 2.4
          const dx = beanX - cupCenterX;
          const dz = beanZ - cupCenterZ;
          const distXZ = Math.sqrt(dx * dx + dz * dz);
          const relY = beanY - cupCenterY;
          const minReqClearance = (relY > -0.3 && relY < 2.1) ? (isMobile ? 2.65 : 3.05) : (isMobile ? 2.1 : 2.4);

          if (distXZ < minReqClearance && distXZ > 0.001) {
            const pushFactor = minReqClearance / distXZ;
            beanX = cupCenterX + dx * pushFactor;
            beanZ = cupCenterZ + dz * pushFactor;
          }

          b.mesh.position.set(beanX, beanY, beanZ);

          // Gentle natural tumbling on all 3 axes
          b.mesh.rotation.x += 0.012 * b.rotSpeedX;
          b.mesh.rotation.y += 0.016 * b.rotSpeedY;
          b.mesh.rotation.z += 0.01 * b.rotSpeedZ;
        });
      } else {
        beanGroup.visible = false;
      }

      // Lighting presets
      if (sceneSettings.lightingMood === 'moody_barista') {
        ambientLight.intensity = 0.55;
        keyLight.color.setHex(0xe88d43);
        rimLight.color.setHex(0xffaa5e);
      } else if (sceneSettings.lightingMood === 'cyber_roast') {
        ambientLight.intensity = 0.6;
        keyLight.color.setHex(0xff8008);
        rimLight.color.setHex(0x00d2ff);
      } else if (sceneSettings.lightingMood === 'crisp_morning') {
        ambientLight.intensity = 1.0;
        keyLight.color.setHex(0xffffff);
        rimLight.color.setHex(0xfff6ea);
      } else {
        // warm_sunlight default
        ambientLight.intensity = 0.9;
        keyLight.color.setHex(0xffecd2);
        rimLight.color.setHex(0xffffff);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', updateResponsiveCamera);

      cupGeom.dispose();
      goldRimGeom.dispose();
      handleGeom.dispose();
      saucerGeom.dispose();
      saucerGoldRim.dispose();
      shadowPlaneGeom.dispose();
      liquidGeom.dispose();
      milkGeom.dispose();
      splashGeom.dispose();
      steamGeom.dispose();
      sugarGeom.dispose();
      beanGeom.dispose();

      ceramicMat.dispose();
      ceramicBumpTexture.dispose();
      envTexture.dispose();
      goldTrimMat.dispose();
      shadowPlaneMat.dispose();
      shadowTexture.dispose();
      liquidMat.dispose();
      liquidTexture.dispose();
      liquidBumpTexture.dispose();
      milkMat.dispose();
      splashMat.dispose();
      iceMat.dispose();
      steamMat.dispose();
      steamTexture.dispose();
      sugarMat.dispose();
      beanMat.dispose();
      beanCreaseMat.dispose();

      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [sceneSettings]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
