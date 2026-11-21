import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getPlayerAppearance, type PlayerAppearance } from '../utils/playerAppearance';
import { getTeamKitConfig, type TeamKitConfig } from '../utils/teamKits2026';

interface PlayerAvatar3DProps {
  jerseyColor?: string;
  shortsColor?: string;
  skinColor?: string;
  playerName?: string;
  position?: string;
  teamName?: string;
  nationality?: string;
  squadNumber?: number | string;
  appearance?: PlayerAppearance;
  height?: number;
  width?: number;
  interactive?: boolean;
}

/**
 * Creates dynamic high-resolution jersey texture strictly matching the club's 2026 Local kit:
 * - Two-color patterns (stripes, diagonal sashes, halves, hoops, shoulder/side panels)
 * - Sleeve cuff borders and collar neckline trims
 * - Player's official dorsal number on front & back
 * - ZERO logos, crests, brand badges or commercial text
 */
function createCustomJerseyTexture(
  kitConfig: TeamKitConfig,
  squadNumber: number | string | undefined,
  isGoalkeeper: boolean
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const baseColor = isGoalkeeper ? kitConfig.gkJerseyColor : kitConfig.primaryColor;
  const secColor = isGoalkeeper ? kitConfig.gkCollarColor : kitConfig.secondaryColor;
  const collarColor = isGoalkeeper ? kitConfig.gkCollarColor : kitConfig.collarColor;
  const cuffColor = isGoalkeeper ? kitConfig.gkCuffColor : kitConfig.cuffColor;

  // 1. Fill base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 1024, 1024);

  if (!isGoalkeeper) {
    const pattern = kitConfig.pattern;

    if (pattern === 'stripes') {
      // Alianza Lima, Comerciantes Unidos, Juan Pablo II, FC Cajamarca, Deportivo Moquegua
      ctx.fillStyle = secColor;
      const stripeW = 512 / 8; // 64px width
      // Front stripes (0 to 512)
      for (let i = 1; i < 8; i += 2) {
        ctx.fillRect(i * stripeW, 0, stripeW, 1024);
      }
      // Back stripes (512 to 1024)
      for (let i = 1; i < 8; i += 2) {
        ctx.fillRect(512 + i * stripeW, 0, stripeW, 1024);
      }
    } else if (pattern === 'sash') {
      // Sporting Cristal, Alianza Atlético Sullana (Diagonal sash crossing torso)
      ctx.fillStyle = secColor;

      // Front diagonal sash: from left shoulder to right hip
      ctx.beginPath();
      ctx.moveTo(35, 0);
      ctx.lineTo(135, 0);
      ctx.lineTo(512, 740);
      ctx.lineTo(512, 880);
      ctx.lineTo(430, 1024);
      ctx.lineTo(330, 1024);
      ctx.lineTo(0, 360);
      ctx.lineTo(0, 220);
      ctx.closePath();
      ctx.fill();

      // Back diagonal sash: matching diagonal band across back
      ctx.beginPath();
      ctx.moveTo(512 + 35, 0);
      ctx.lineTo(512 + 135, 0);
      ctx.lineTo(1024, 740);
      ctx.lineTo(1024, 880);
      ctx.lineTo(512 + 430, 1024);
      ctx.lineTo(512 + 330, 1024);
      ctx.lineTo(512, 360);
      ctx.lineTo(512, 220);
      ctx.closePath();
      ctx.fill();
    } else if (pattern === 'halves') {
      // FBC Melgar rojinegro (Half red / half black vertical split)
      ctx.fillStyle = secColor;
      // Front: left half (0 to 256)
      ctx.fillRect(0, 0, 256, 1024);
      // Back: left half (512 to 768)
      ctx.fillRect(512, 0, 256, 1024);
    } else if (pattern === 'hoops') {
      // ADT Tarma (Horizontal hoops across chest and torso)
      ctx.fillStyle = secColor;
      ctx.fillRect(0, 260, 1024, 65);
      ctx.fillRect(0, 370, 1024, 65);
      ctx.fillRect(0, 480, 1024, 65);
      ctx.fillRect(0, 590, 1024, 65);
    } else if (pattern === 'shoulder_panels') {
      ctx.fillStyle = secColor;
      if (kitConfig.clubKey.includes('cusco')) {
        // Cusco FC: Black sleeves and shoulder panel
        ctx.fillRect(0, 0, 1024, 250);
      } else if (kitConfig.clubKey.includes('garcilaso')) {
        // Deportivo Garcilaso: Navy lateral side panels
        ctx.fillRect(0, 0, 65, 1024);
        ctx.fillRect(447, 0, 65, 1024);
        ctx.fillRect(512, 0, 65, 1024);
        ctx.fillRect(959, 0, 65, 1024);
      } else if (kitConfig.clubKey.includes('huancayo')) {
        // Sport Huancayo: Angular white shoulder blocks
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(180, 0); ctx.lineTo(100, 240); ctx.lineTo(0, 250); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(332, 0); ctx.lineTo(512, 0); ctx.lineTo(512, 250); ctx.lineTo(412, 240); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(512, 0); ctx.lineTo(692, 0); ctx.lineTo(612, 240); ctx.lineTo(512, 250); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(844, 0); ctx.lineTo(1024, 0); ctx.lineTo(1024, 250); ctx.lineTo(924, 240); ctx.closePath(); ctx.fill();
      }
    } else if (pattern === 'solid_trim') {
      // Universitario, Cienciano, Atlético Grau, Sport Boys, Los Chankas, UTC
      // Colored borders on sleeve edges and waist hem
      ctx.fillStyle = cuffColor;
      ctx.fillRect(0, 220, 45, 260);
      ctx.fillRect(467, 220, 45, 260);
      ctx.fillRect(512, 220, 45, 260);
      ctx.fillRect(979, 220, 45, 260);
      // Hem border line
      ctx.fillRect(0, 990, 1024, 34);
    }

    // Collar neckline curved border on chest & back
    ctx.strokeStyle = collarColor;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(260, 130, 85, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(760, 130, 85, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  }

  // Draw Dorsal Number (Front & Back) with high contrast
  const numStr = squadNumber !== undefined && squadNumber !== '' ? String(squadNumber) : '10';

  const cleanHex = baseColor.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 128;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 128;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 128;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const numColor = brightness > 155 ? '#0F172A' : '#FFFFFF';
  const outlineColor = brightness > 155 ? '#FFFFFF' : '#0F172A';

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 170px "Arial Black", Impact, sans-serif';

  // Back Number (Right half of texture)
  ctx.lineWidth = 18;
  ctx.strokeStyle = outlineColor;
  ctx.strokeText(numStr, 760, 520);
  ctx.fillStyle = numColor;
  ctx.fillText(numStr, 760, 520);

  // Front Number (Left half of texture, smaller)
  ctx.font = '900 95px "Arial Black", Impact, sans-serif';
  ctx.lineWidth = 12;
  ctx.strokeStyle = outlineColor;
  ctx.strokeText(numStr, 260, 360);
  ctx.fillStyle = numColor;
  ctx.fillText(numStr, 260, 360);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  return texture;
}

/**
 * Generates an authentic sock canvas texture with the iconic triple horizontal stripes
 * as seen in the Sketchfab 3D Football Player model.
 */
function createSockCanvasTexture(baseColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Main sock body
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 512);

  // Top ribbed cuff (white band)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 256, 120);

  // Triple horizontal stripes (black/dark-grey athletic stripes)
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 20, 256, 16);
  ctx.fillRect(0, 52, 256, 16);
  ctx.fillRect(0, 84, 256, 16);

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  return texture;
}

/**
 * Creates sculpted 3D hair matching the high-poly ZBrush aesthetic of the Sketchfab reference model:
 * (https://sketchfab.com/3d-models/male-head-with-hair-and-beard-b06a252310ea4435a1002e2be47267fa)
 * Precisely calibrated to player-01.glb runtime Three.js head-bone local space:
 * - Undercut / pompadour with dynamic sweeping locks (TubeGeometry over CatmullRom splines)
 * - Layered volume from forehead hairline arching back across crown to occiput
 * - Clipper fade side panels with stepped groove texturing
 * - Crisp sideburns integrating directly with beard
 */
function createSculptedHair(
  hairStyle: string,
  hairMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();

  // Cranial base shell (smooth skull cap)
  const skullGeo = new THREE.SphereGeometry(0.082, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.58);
  skullGeo.scale(0.98, 1.18, 1.08);
  const skull = new THREE.Mesh(skullGeo, hairMat);
  skull.position.set(0, 0.078, -0.008);
  group.add(skull);

  if (hairStyle === 'buzz_cut') {
    // Tight athletic buzz cut with defined hairline
    const frontLineGeo = new THREE.BoxGeometry(0.085, 0.014, 0.015);
    const frontLine = new THREE.Mesh(frontLineGeo, hairMat);
    frontLine.position.set(0, 0.092, 0.082);
    frontLine.rotation.x = -0.32;
    group.add(frontLine);
    return group;
  }

  if (hairStyle === 'afro_crop') {
    // Dense volumetric textured afro crop
    const afroGeo = new THREE.SphereGeometry(0.092, 18, 14);
    afroGeo.scale(1.0, 1.14, 1.06);
    const afro = new THREE.Mesh(afroGeo, hairMat);
    afro.position.set(0, 0.088, -0.005);
    group.add(afro);

    // Micro curls on crown
    for (let i = 0; i < 16; i++) {
      const curlGeo = new THREE.SphereGeometry(0.015, 6, 6);
      const curl = new THREE.Mesh(curlGeo, hairMat);
      const angle = (i / 16) * Math.PI * 2;
      const rad = 0.060;
      curl.position.set(
        Math.cos(angle) * rad,
        0.138 + Math.sin(i * 3) * 0.010,
        -0.008 + Math.sin(angle) * rad * 0.85
      );
      group.add(curl);
    }
    return group;
  }

  // --- SIGNATURE SKETCHFAB SCULPTED UNDERCUT / SWEPT-BACK POMPADOUR ---
  // 1. Central Crest Lock (Major sweeping volume)
  const centerLockSpline = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.00, 0.085, 0.086),
    new THREE.Vector3(0.00, 0.145, 0.055),
    new THREE.Vector3(0.00, 0.148, -0.010),
    new THREE.Vector3(0.00, 0.110, -0.070),
    new THREE.Vector3(0.00, 0.065, -0.085),
  ]);
  const centerLockGeo = new THREE.TubeGeometry(centerLockSpline, 16, 0.018, 8, false);
  const centerLock = new THREE.Mesh(centerLockGeo, hairMat);
  group.add(centerLock);

  // 2. Right Paramedian Sweeping Lock
  const rightLockSpline = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.028, 0.082, 0.080),
    new THREE.Vector3(0.032, 0.140, 0.048),
    new THREE.Vector3(0.032, 0.142, -0.012),
    new THREE.Vector3(0.026, 0.105, -0.068),
    new THREE.Vector3(0.020, 0.062, -0.082),
  ]);
  const rightLockGeo = new THREE.TubeGeometry(rightLockSpline, 14, 0.015, 7, false);
  const rightLock = new THREE.Mesh(rightLockGeo, hairMat);
  group.add(rightLock);

  // 3. Left Paramedian Sweeping Lock (Mirrored)
  const leftLockSpline = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.028, 0.082, 0.080),
    new THREE.Vector3(-0.032, 0.140, 0.048),
    new THREE.Vector3(-0.032, 0.142, -0.012),
    new THREE.Vector3(-0.026, 0.105, -0.068),
    new THREE.Vector3(-0.020, 0.062, -0.082),
  ]);
  const leftLockGeo = new THREE.TubeGeometry(leftLockSpline, 14, 0.015, 7, false);
  const leftLock = new THREE.Mesh(leftLockGeo, hairMat);
  group.add(leftLock);

  // 4. Right Lateral Flow Lock (Temples to back)
  const rightLatSpline = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.058, 0.075, 0.052),
    new THREE.Vector3(0.062, 0.118, 0.025),
    new THREE.Vector3(0.058, 0.115, -0.030),
    new THREE.Vector3(0.045, 0.075, -0.070),
  ]);
  const rightLatGeo = new THREE.TubeGeometry(rightLatSpline, 12, 0.012, 6, false);
  const rightLat = new THREE.Mesh(rightLatGeo, hairMat);
  group.add(rightLat);

  // 5. Left Lateral Flow Lock (Temples to back)
  const leftLatSpline = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.058, 0.075, 0.052),
    new THREE.Vector3(-0.062, 0.118, 0.025),
    new THREE.Vector3(-0.058, 0.115, -0.030),
    new THREE.Vector3(-0.045, 0.075, -0.070),
  ]);
  const leftLatGeo = new THREE.TubeGeometry(leftLatSpline, 12, 0.012, 6, false);
  const leftLat = new THREE.Mesh(leftLatGeo, hairMat);
  group.add(leftLat);

  // 6. Signature Front Pompadour Tuft / Flick (Dynamic forward volume from Sketchfab sculpt)
  const flickGeo = new THREE.ConeGeometry(0.022, 0.044, 7);
  flickGeo.scale(1.2, 1.0, 0.7);
  const flick = new THREE.Mesh(flickGeo, hairMat);
  flick.position.set(0.00, 0.125, 0.072);
  flick.rotation.set(-0.38, 0.0, 0.0);
  group.add(flick);

  // 7. Undercut Fade Side Panels (stepped ridges mimicking high fade clipper work)
  const sideStepGeo = new THREE.BoxGeometry(0.010, 0.052, 0.046);
  const rightSideFade = new THREE.Mesh(sideStepGeo, hairMat);
  rightSideFade.position.set(0.074, 0.070, 0.008);
  rightSideFade.rotation.set(0.0, -0.05, -0.08);

  const leftSideFade = rightSideFade.clone();
  leftSideFade.position.x = -0.074;
  leftSideFade.rotation.set(0.0, 0.05, 0.08);
  group.add(rightSideFade, leftSideFade);

  // 8. Tapered Sideburns (transitioning into beard)
  const sideburnGeo = new THREE.BoxGeometry(0.010, 0.042, 0.020);
  const rightSideburn = new THREE.Mesh(sideburnGeo, hairMat);
  rightSideburn.position.set(0.072, 0.035, 0.018);

  const leftSideburn = rightSideburn.clone();
  leftSideburn.position.x = -0.072;
  group.add(rightSideburn, leftSideburn);

  return group;
}

/**
 * Creates sculpted facial hair matching the Sketchfab reference:
 * (https://sketchfab.com/3d-models/male-head-with-hair-and-beard-b06a252310ea4435a1002e2be47267fa)
 * Precisely calibrated to player-01.glb runtime Three.js head-bone local space:
 * - Upper lip: y=0.022, z=0.106
 * - Chin point: y=-0.022, z=0.085
 * - Jaw angles: x=±0.070, y=0.025, z=0.005
 */
function createSculptedBeard(
  facialHair: string,
  facialHairMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();

  if (facialHair === 'clean') {
    return group;
  }

  // 1. CHEVRON / HORSESHOE SCULPTED MUSTACHE
  if (
    facialHair === 'full_beard' ||
    facialHair === 'mustache' ||
    facialHair === 'goatee' ||
    facialHair === 'stubble'
  ) {
    const mustacheGroup = new THREE.Group();

    // Right Mustache Wing (curves over upper lip down to mouth corner)
    const rightWingCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.003, 0.024, 0.108),
      new THREE.Vector3(0.018, 0.022, 0.105),
      new THREE.Vector3(0.030, 0.008, 0.096),
    ]);
    const rightWingGeo = new THREE.TubeGeometry(rightWingCurve, 10, 0.0065, 8, false);
    const rightWing = new THREE.Mesh(rightWingGeo, facialHairMat);
    mustacheGroup.add(rightWing);

    // Left Mustache Wing (Mirrored)
    const leftWingCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.003, 0.024, 0.108),
      new THREE.Vector3(-0.018, 0.022, 0.105),
      new THREE.Vector3(-0.030, 0.008, 0.096),
    ]);
    const leftWingGeo = new THREE.TubeGeometry(leftWingCurve, 10, 0.0065, 8, false);
    const leftWing = new THREE.Mesh(leftWingGeo, facialHairMat);
    mustacheGroup.add(leftWing);

    // Central philtrum ridge
    const philtrumGeo = new THREE.BoxGeometry(0.014, 0.009, 0.012);
    const philtrum = new THREE.Mesh(philtrumGeo, facialHairMat);
    philtrum.position.set(0.00, 0.024, 0.108);
    mustacheGroup.add(philtrum);

    group.add(mustacheGroup);
  }

  if (facialHair === 'mustache') {
    return group;
  }

  // 2. SOUL PATCH (Triangular tuft under lower lip in mental crease)
  if (facialHair === 'full_beard' || facialHair === 'goatee' || facialHair === 'stubble') {
    const soulPatchGeo = new THREE.ConeGeometry(0.008, 0.016, 6);
    soulPatchGeo.scale(1.2, 1.0, 0.7);
    const soulPatch = new THREE.Mesh(soulPatchGeo, facialHairMat);
    soulPatch.position.set(0.00, 0.002, 0.096);
    soulPatch.rotation.set(Math.PI - 0.22, 0, 0);
    group.add(soulPatch);
  }

  // 3. CHIN BEARD BASE & SIGNATURE SKETCHFAB SCULPTED CHIN LOCKS
  if (facialHair === 'full_beard' || facialHair === 'goatee') {
    // Chin anterior pad (fits over chin point y=-0.022, z=0.085)
    const chinPadGeo = new THREE.BoxGeometry(0.044, 0.028, 0.024);
    const chinPad = new THREE.Mesh(chinPadGeo, facialHairMat);
    chinPad.position.set(0.00, -0.022, 0.085);
    group.add(chinPad);

    // SIGNATURE SKETCHFAB FEATURE: Sculpted downward-pointing chin locks!
    // Central chin lock
    const centerChinLockGeo = new THREE.ConeGeometry(0.013, 0.038, 8);
    centerChinLockGeo.scale(1.1, 1.0, 0.8);
    const centerChinLock = new THREE.Mesh(centerChinLockGeo, facialHairMat);
    centerChinLock.position.set(0.00, -0.044, 0.080);
    centerChinLock.rotation.set(Math.PI - 0.12, 0, 0);
    group.add(centerChinLock);

    // Right chin lock
    const rightChinLockGeo = new THREE.ConeGeometry(0.009, 0.030, 6);
    const rightChinLock = new THREE.Mesh(rightChinLockGeo, facialHairMat);
    rightChinLock.position.set(0.015, -0.040, 0.074);
    rightChinLock.rotation.set(Math.PI - 0.18, 0, 0.20);
    group.add(rightChinLock);

    // Left chin lock
    const leftChinLockGeo = new THREE.ConeGeometry(0.009, 0.030, 6);
    const leftChinLock = new THREE.Mesh(leftChinLockGeo, facialHairMat);
    leftChinLock.position.set(-0.015, -0.040, 0.074);
    leftChinLock.rotation.set(Math.PI - 0.18, 0, -0.20);
    group.add(leftChinLock);
  }

  // 4. MANDIBULAR JAW & CHEEK ENVELOPE (Full Beard & Stubble)
  if (facialHair === 'full_beard' || facialHair === 'stubble') {
    // Right Jawline tube from ear angle to chin pad
    const rightJawCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.068, 0.028, 0.005),
      new THREE.Vector3(0.052, 0.002, 0.045),
      new THREE.Vector3(0.026, -0.018, 0.075),
    ]);
    const rightJawGeo = new THREE.TubeGeometry(rightJawCurve, 10, 0.0075, 7, false);
    const rightJaw = new THREE.Mesh(rightJawGeo, facialHairMat);
    group.add(rightJaw);

    // Left Jawline tube (Mirrored)
    const leftJawCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.068, 0.028, 0.005),
      new THREE.Vector3(-0.052, 0.002, 0.045),
      new THREE.Vector3(-0.026, -0.018, 0.075),
    ]);
    const leftJawGeo = new THREE.TubeGeometry(leftJawCurve, 10, 0.0075, 7, false);
    const leftJaw = new THREE.Mesh(leftJawGeo, facialHairMat);
    group.add(leftJaw);

    // Right cheek beard strip
    const rightCheekGeo = new THREE.BoxGeometry(0.008, 0.028, 0.036);
    const rightCheek = new THREE.Mesh(rightCheekGeo, facialHairMat);
    rightCheek.position.set(0.062, 0.022, 0.038);
    rightCheek.rotation.set(0.18, 0.08, -0.12);

    // Left cheek beard strip
    const leftCheek = rightCheek.clone();
    leftCheek.position.x = -0.062;
    leftCheek.rotation.set(0.18, -0.08, 0.12);
    group.add(rightCheek, leftCheek);
  }

  return group;
}

/**
 * Creates masculine facial anatomy details matching the Sketchfab sculpture:
 * - Athletic supraorbital brow ridge (cresta supraciliar) creating natural eye socket depth
 * - Sculpted directional 3D eyebrows matching hair color
 */
function createFacialSculptDetails(
  skinColor: string,
  hairColor: string
): THREE.Group {
  const group = new THREE.Group();

  const skinToneMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinColor),
    roughness: 0.55,
    metalness: 0.02,
  });

  const browMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(hairColor),
    roughness: 0.85,
    metalness: 0.05,
  });

  // 1. Supraorbital Brow Ridge (Cresta Supraciliar, sits at y=0.068, z=0.098)
  const browRidgeGeo = new THREE.BoxGeometry(0.084, 0.014, 0.018);
  const browRidge = new THREE.Mesh(browRidgeGeo, skinToneMat);
  browRidge.position.set(0.00, 0.068, 0.098);
  browRidge.rotation.x = -0.15;
  group.add(browRidge);

  // 2. 3D Sculpted Athletic Eyebrows
  // Right Eyebrow
  const rightEyebrowGeo = new THREE.BoxGeometry(0.032, 0.008, 0.012);
  const rightEyebrow = new THREE.Mesh(rightEyebrowGeo, browMat);
  rightEyebrow.position.set(0.026, 0.072, 0.104);
  rightEyebrow.rotation.set(-0.15, 0.05, -0.10);

  // Left Eyebrow
  const leftEyebrowGeo = new THREE.BoxGeometry(0.032, 0.008, 0.012);
  const leftEyebrow = new THREE.Mesh(leftEyebrowGeo, browMat);
  leftEyebrow.position.set(-0.026, 0.072, 0.104);
  leftEyebrow.rotation.set(-0.15, -0.05, 0.10);

  group.add(rightEyebrow, leftEyebrow);

  return group;
}

export const PlayerAvatar3D: React.FC<PlayerAvatar3DProps> = ({
  jerseyColor = '#C8102E',
  shortsColor = '#FFFFFF',
  skinColor: manualSkinColor,
  playerName = '',
  position = '',
  teamName = '',
  nationality = 'Perú',
  squadNumber = 10,
  appearance: customAppearance,
  height = 380,
  width = 290,
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGlError, setHasWebGlError] = useState(false);

  // Derive visual traits
  const appearance: PlayerAppearance =
    customAppearance ||
    getPlayerAppearance(playerName, position, teamName, nationality);

  const activeSkinColor = manualSkinColor || appearance.skinColor;
  const isGoalkeeper = appearance.isGoalkeeper;

  // Clean uniform colors (pure club tones, zero brand logos/crests)
  const activeJerseyColor = isGoalkeeper ? appearance.gkJerseyColor : jerseyColor;
  const activeShortsColor = isGoalkeeper ? appearance.gkShortsColor : shortsColor;

  useEffect(() => {
    if (!interactive || !mountRef.current) return;

    const currentMount = mountRef.current;
    const scene = new THREE.Scene();

    // 1. CAMERA: Perfectly framed full body view matching Sketchfab showcase
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.12, 3.15);
    camera.lookAt(0, 0.05, 0);

    // 2. RENDERER
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'default',
        preserveDrawingBuffer: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const canvasElement = renderer.domElement;
      canvasElement.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        try {
          if (currentMount && currentMount.contains(canvasElement)) {
            currentMount.removeChild(canvasElement);
          }
        } catch {}
        setHasWebGlError(true);
      });

      currentMount.appendChild(canvasElement);
    } catch {
      setHasWebGlError(true);
      return;
    }

    // 3. BROADCAST STUDIO LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.2);
    keyLight.position.set(2.5, 3.5, 3.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbfdbfe, 1.2);
    fillLight.position.set(-2.5, 2.0, 2.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(0, 3.0, -3.0);
    scene.add(rimLight);

    // 4. CHARACTER ROOT GROUP
    const playerGroup = new THREE.Group();

    // Mixer for idle animation
    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();

    // 5. LOAD REAL 3D RIGGED CHARACTER MODEL (GLB)
    const loader = new GLTFLoader();
    loader.load(
      '/models/player-01.glb',
      (gltf) => {
        const model = gltf.scene;

        // Scale and anchor feet to ground
        model.scale.set(0.85, 0.85, 0.85);
        model.position.set(0, -0.73, 0);

        // Resolve authentic 2026 kit configuration from Football Kit Archive
        const kitConfig = getTeamKitConfig(teamName);

        // Custom Jersey Texture with Number and 2-color Pattern
        const jerseyTex = createCustomJerseyTexture(
          kitConfig,
          squadNumber,
          isGoalkeeper
        );

        const jerseyMat = new THREE.MeshStandardMaterial({
          map: jerseyTex,
          roughness: 0.42,
          metalness: 0.04,
        });

        const shortsMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(isGoalkeeper ? kitConfig.gkShortsColor : (activeShortsColor || kitConfig.shortsColor)),
          roughness: 0.45,
          metalness: 0.04,
        });

        const sockColor = isGoalkeeper
          ? kitConfig.gkJerseyColor
          : (activeShortsColor || kitConfig.shortsColor) === '#FFFFFF'
          ? (activeJerseyColor || kitConfig.primaryColor)
          : (activeShortsColor || kitConfig.shortsColor);

        const sockTex = createSockCanvasTexture(sockColor);
        const socksMat = new THREE.MeshStandardMaterial({
          map: sockTex,
          roughness: 0.5,
          metalness: 0.02,
        });

        // Dedicated Collar Material matching official 2026 kit border
        const collarMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(isGoalkeeper ? kitConfig.gkCollarColor : kitConfig.collarColor),
          roughness: 0.38,
          metalness: 0.05,
        });

        // Dedicated Sleeve Cuff Material matching official 2026 kit border
        const cuffMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(isGoalkeeper ? kitConfig.gkCuffColor : kitConfig.cuffColor),
          roughness: 0.38,
          metalness: 0.05,
        });

        const skinMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(activeSkinColor),
          roughness: 0.55,
          metalness: 0.02,
        });

        const bootsMat = new THREE.MeshStandardMaterial({
          color: 0x18181b,
          roughness: 0.35,
          metalness: 0.25,
        });

        const hairMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(appearance.hairColor),
          roughness: 0.85,
          metalness: 0.05,
        });

        const facialHairMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(appearance.facialHairColor),
          roughness: 0.9,
        });

        // Traverse & customize character parts
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const name = mesh.name.toLowerCase();

            if (name.includes('shirt')) {
              mesh.material = jerseyMat;
            } else if (name.includes('shorts')) {
              mesh.material = shortsMat;
            } else if (name.includes('collar')) {
              mesh.material = collarMat;
            } else if (name.includes('cuff')) {
              mesh.material = cuffMat;
            } else if (name.includes('socks')) {
              mesh.material = socksMat;
            } else if (name.includes('trim')) {
              mesh.material = cuffMat;
            } else if (name.includes('body')) {
              mesh.material = skinMat;
            } else if (name.includes('boot')) {
              mesh.material = bootsMat;
            }
          }
        });

        // --- ATTACH SCULPTED HAIR, BEARD & FACIAL ANATOMY (Exact Sketchfab Aesthetic) ---
        const headBone = model.getObjectByName('head');
        if (headBone) {
          // 1. Sculpted 3D Hair (Pompadour / Undercut / Swept-Back Locks)
          const sculptedHairGroup = createSculptedHair(appearance.hairStyle, hairMat);
          headBone.add(sculptedHairGroup);

          // 2. Sculpted Facial Hair (Chevron Mustache, Soul Patch & Chin Locks)
          const sculptedBeardGroup = createSculptedBeard(appearance.facialHair, facialHairMat);
          headBone.add(sculptedBeardGroup);

          // 3. Masculine Facial Anatomy (Supraorbital Brow Ridge & 3D Eyebrows)
          const facialDetailsGroup = createFacialSculptDetails(activeSkinColor, appearance.hairColor);
          headBone.add(facialDetailsGroup);
        }

        // --- ATTACH CAPTAIN'S ARMBAND ON LEFT UPPER ARM ---
        const upperArmBone = model.getObjectByName('upperarm_l');
        if (upperArmBone && !isGoalkeeper) {
          const armbandGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.05, 16);
          const armbandMat = new THREE.MeshStandardMaterial({
            color: 0x111827,
            roughness: 0.4,
          });
          const armband = new THREE.Mesh(armbandGeo, armbandMat);
          armband.position.set(0, 0.12, 0);

          const stripeGeo = new THREE.TorusGeometry(0.056, 0.005, 6, 16);
          const stripe = new THREE.Mesh(stripeGeo, new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
          stripe.rotation.x = Math.PI / 2;
          armband.add(stripe);

          upperArmBone.add(armband);
        }

        // --- ATTACH GOALKEEPER GLOVES ON HAND BONES ---
        if (isGoalkeeper) {
          const handBoneL = model.getObjectByName('hand_l');
          const handBoneR = model.getObjectByName('hand_r');

          const createGoalkeeperGlove = (isLeft: boolean) => {
            const glove = new THREE.Group();
            const backGeo = new THREE.BoxGeometry(0.095, 0.11, 0.05);
            const backMat = new THREE.MeshStandardMaterial({
              color: new THREE.Color(appearance.gkGlovesColor),
              roughness: 0.35,
              metalness: 0.2,
            });
            const back = new THREE.Mesh(backGeo, backMat);
            glove.add(back);

            const palmGeo = new THREE.BoxGeometry(0.09, 0.105, 0.015);
            const palmMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
            const palm = new THREE.Mesh(palmGeo, palmMat);
            palm.position.set(0, 0, 0.025);
            glove.add(palm);

            const thumbGeo = new THREE.BoxGeometry(0.03, 0.055, 0.035);
            const thumb = new THREE.Mesh(thumbGeo, backMat);
            thumb.position.set(isLeft ? 0.05 : -0.05, -0.01, 0.01);
            glove.add(thumb);

            return glove;
          };

          if (handBoneL) {
            const gloveL = createGoalkeeperGlove(true);
            gloveL.position.set(0, 0.06, 0);
            handBoneL.add(gloveL);
          }
          if (handBoneR) {
            const gloveR = createGoalkeeperGlove(false);
            gloveR.position.set(0, 0.06, 0);
            handBoneR.add(gloveR);
          }
        }

        // Setup Idle Animation (Subtle breathing/stance)
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const idleClip =
            gltf.animations.find((a) => a.name.toLowerCase().includes('idle')) ||
            gltf.animations[0];
          const action = mixer.clipAction(idleClip);
          action.play();
        }

        playerGroup.add(model);
      },
      undefined,
      (err) => {
        console.warn('Could not load player-01.glb, fallback active', err);
      }
    );

    // =========================================================================
    // 6. 3D CLASSIC SOCCER BALL AT FEET
    // =========================================================================
    const ballGroup = new THREE.Group();
    ballGroup.position.set(0.06, -0.61, 0.30);

    const ballSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.125, 24, 20),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.25,
        metalness: 0.04,
      })
    );
    ballGroup.add(ballSphere);

    // Classic black pentagonal patches
    const patchMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
    const patchGeo = new THREE.CircleGeometry(0.036, 5);

    const patchPositions = [
      [0, 0, 0.126, 0, 0, 0],
      [0, 0, -0.126, 0, Math.PI, 0],
      [0.126, 0, 0, 0, Math.PI / 2, 0],
      [-0.126, 0, 0, 0, -Math.PI / 2, 0],
      [0, 0.126, 0, -Math.PI / 2, 0, 0],
      [0.075, 0.08, 0.06, -0.6, 0.8, 0],
      [-0.075, 0.08, 0.06, -0.6, -0.8, 0],
      [0.075, -0.08, 0.06, 0.6, 0.8, 0],
      [-0.075, -0.08, 0.06, 0.6, -0.8, 0],
    ];

    patchPositions.forEach(([px, py, pz, rx, ry, rz]) => {
      const patch = new THREE.Mesh(patchGeo, patchMat);
      patch.position.set(px, py, pz);
      patch.rotation.set(rx, ry, rz);
      ballGroup.add(patch);
    });

    playerGroup.add(ballGroup);

    // =========================================================================
    // 7. REALISTIC GROUND SHADOWS
    // =========================================================================
    // Ball direct contact shadow
    const ballShadowGeo = new THREE.CircleGeometry(0.14, 24);
    const ballShadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.65,
    });
    const ballShadow = new THREE.Mesh(ballShadowGeo, ballShadowMat);
    ballShadow.rotation.x = -Math.PI / 2;
    ballShadow.position.set(0.06, -0.725, 0.30);
    scene.add(ballShadow);

    // Player Directional Cast Shadow
    const playerShadowGeo = new THREE.CircleGeometry(0.46, 32);
    playerShadowGeo.scale(1.0, 1.8, 1.0);
    const playerShadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.32,
    });
    const playerShadow = new THREE.Mesh(playerShadowGeo, playerShadowMat);
    playerShadow.rotation.x = -Math.PI / 2;
    playerShadow.rotation.z = Math.PI / 3.8;
    playerShadow.position.set(-0.14, -0.728, -0.10);
    scene.add(playerShadow);

    // Foot contact shadows
    const footShadowGeo = new THREE.CircleGeometry(0.11, 16);
    footShadowGeo.scale(0.8, 1.6, 1.0);
    const footShadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
    });
    const leftFootShadow = new THREE.Mesh(footShadowGeo, footShadowMat);
    leftFootShadow.rotation.x = -Math.PI / 2;
    leftFootShadow.position.set(-0.16, -0.726, 0.05);
    scene.add(leftFootShadow);

    const rightFootShadow = leftFootShadow.clone();
    rightFootShadow.position.x = 0.16;
    scene.add(rightFootShadow);

    scene.add(playerGroup);

    // =========================================================================
    // 8. 360° TURNTABLE DRAG ROTATION & IDLE ORBIT
    // =========================================================================
    let isDragging = false;
    let previousMouseX = 0;
    let targetRotationY = 0;
    let lastInteractTime = Date.now();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      lastInteractTime = Date.now();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      targetRotationY += deltaX * 0.015;
      previousMouseX = e.clientX;
      lastInteractTime = Date.now();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
        lastInteractTime = Date.now();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMouseX;
      targetRotationY += deltaX * 0.015;
      previousMouseX = e.touches[0].clientX;
      lastInteractTime = Date.now();
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // =========================================================================
    // 9. ANIMATION & RENDER LOOP
    // =========================================================================
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }

      // Smooth damped rotation towards target
      playerGroup.rotation.y += (targetRotationY - playerGroup.rotation.y) * 0.1;

      // Gentle auto-rotation when user is not dragging
      if (!isDragging && Date.now() - lastInteractTime > 1500) {
        targetRotationY += 0.004;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);

      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (renderer) {
        try {
          renderer.dispose();
          if (currentMount && currentMount.contains(renderer.domElement)) {
            currentMount.removeChild(renderer.domElement);
          }
        } catch {}
      }

      scene.clear();
    };
  }, [
    interactive,
    width,
    height,
    activeSkinColor,
    activeJerseyColor,
    activeShortsColor,
    isGoalkeeper,
    appearance,
    squadNumber,
    teamName,
  ]);

  // Fallback for non-interactive list cards
  if (!interactive || hasWebGlError) {
    return (
      <div
        className="relative flex flex-col items-center justify-center select-none"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="relative flex flex-col items-center">
          {/* Head & Sculpted Hair/Beard */}
          <div
            className="w-8 h-9 rounded-t-xl rounded-b-md shadow-md relative border border-black/10"
            style={{ backgroundColor: activeSkinColor }}
          >
            {/* Hair Pompadour Quiff */}
            <div
              className="absolute -top-2 inset-x-0 h-4 rounded-t-xl shadow-sm overflow-hidden"
              style={{ backgroundColor: appearance.hairColor }}
            >
              <div className="w-full h-1 bg-white/10" />
            </div>

            {/* Brow & Eyebrows */}
            <div className="absolute top-2 inset-x-1.5 flex justify-between">
              <div
                className="w-2 h-0.5 rounded-sm"
                style={{ backgroundColor: appearance.hairColor }}
              />
              <div
                className="w-2 h-0.5 rounded-sm"
                style={{ backgroundColor: appearance.hairColor }}
              />
            </div>

            {/* Facial Hair (Beard & Mustache) */}
            {appearance.facialHair !== 'clean' && (
              <>
                {/* Mustache */}
                <div
                  className="absolute bottom-2.5 inset-x-2 h-1 rounded-sm"
                  style={{ backgroundColor: appearance.facialHairColor }}
                />
                {/* Chin Beard with Point */}
                <div
                  className="absolute -bottom-1 inset-x-1.5 h-3 rounded-b-md opacity-90 flex justify-center items-end"
                  style={{ backgroundColor: appearance.facialHairColor }}
                >
                  <div
                    className="w-1.5 h-1.5 -mb-0.5 rotate-45"
                    style={{ backgroundColor: appearance.facialHairColor }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Jersey */}
          <div
            className="w-14 h-14 rounded-t-lg shadow-lg relative flex items-center justify-center border-t border-white/20 mt-0.5"
            style={{ backgroundColor: activeJerseyColor }}
          >
            <div className="absolute top-0 w-5 h-2 rounded-b-full bg-white/40" />
            <span className="text-white font-black text-xs drop-shadow">
              {squadNumber || 10}
            </span>
          </div>

          {/* Shorts */}
          <div
            className="w-12 h-8 rounded-b-lg shadow-md flex justify-between px-1 -mt-0.5"
            style={{ backgroundColor: activeShortsColor }}
          >
            <div className="w-4 h-full border-r border-black/10" />
            <div className="w-4 h-full border-l border-black/10" />
          </div>

          {/* Socks & Cleats */}
          <div className="flex justify-between w-10 mt-0.5">
            <div className="w-3 flex flex-col items-center">
              <div className="w-full h-1 bg-black/80" />
              <div
                className="w-full h-6 rounded-b"
                style={{ backgroundColor: activeJerseyColor }}
              />
              <div className="w-4 h-2 bg-zinc-900 rounded-sm -ml-0.5" />
            </div>
            <div className="w-3 flex flex-col items-center">
              <div className="w-full h-1 bg-black/80" />
              <div
                className="w-full h-6 rounded-b"
                style={{ backgroundColor: activeJerseyColor }}
              />
              <div className="w-4 h-2 bg-zinc-900 rounded-sm -mr-0.5" />
            </div>
          </div>

          {/* 3D Ball */}
          <div className="w-5 h-5 rounded-full bg-white border border-slate-900 flex items-center justify-center -mt-1 shadow">
            <div className="w-2 h-2 bg-zinc-900 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="relative cursor-grab active:cursor-grabbing select-none"
      style={{ width: `${width}px`, height: `${height}px` }}
      title="Arrastra para girar 360°"
    />
  );
};
