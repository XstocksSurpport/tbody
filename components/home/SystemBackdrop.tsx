'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** Slow particle field — black canvas, no decorative styling. */
export function SystemBackdrop() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      52,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      100
    );
    camera.position.z = 2.65;

    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    mount.appendChild(renderer.domElement);

    const n = 820;
    const positions = new Float32Array(n * 3);
    for (let i = 0; i < n * 3; i++) positions[i] = (Math.random() - 0.5) * 7.5;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xa8b0b8,
      size: 0.011,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let t = 0;
    const resize = () => {
      const w = mount.clientWidth;
      const h = Math.max(mount.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    renderer.setAnimationLoop(() => {
      t += 0.00085;
      points.rotation.y = t * 0.14;
      points.rotation.x = Math.sin(t * 0.55) * 0.018;
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener('resize', resize);
      renderer.setAnimationLoop(null);
      geo.dispose();
      mat.dispose();
      const canvas = renderer.domElement;
      // React may already detach this node (Strict Mode / fast refresh / navigation).
      // removeChild throws if the canvas is no longer a child of `mount`.
      if (canvas.parentNode) {
        canvas.remove();
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-0 h-[100dvh] min-h-[100vh] w-full bg-black"
      aria-hidden
    />
  );
}
