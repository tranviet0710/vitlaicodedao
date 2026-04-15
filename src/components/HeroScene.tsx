"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const HeroScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    const root = new THREE.Group();
    scene.add(root);

    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(6, 8, 10);
    scene.add(ambient, keyLight);

    const shapes = new THREE.Group();
    root.add(shapes);

    const wireMaterial = new THREE.MeshStandardMaterial({
      color: 0x6b5cff,
      emissive: 0x2a1db3,
      metalness: 0.1,
      roughness: 0.35,
      wireframe: true,
    });

    const solidMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d1d1,
      emissive: 0x003f3f,
      metalness: 0.2,
      roughness: 0.45,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4db7,
      emissive: 0x4a102f,
      metalness: 0.15,
      roughness: 0.4,
    });

    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.7, 0.45, 180, 24), wireMaterial);
    knot.position.set(-2.9, 0.8, -1);
    knot.rotation.set(0.7, 0.5, 0.1);
    shapes.add(knot);

    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.45, 0), solidMaterial);
    orb.position.set(3.1, -0.7, -0.5);
    shapes.add(orb);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.08, 16, 100),
      new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x111111,
        metalness: 0.4,
        roughness: 0.3,
      }),
    );
    ring.position.set(2.8, -0.9, -1.5);
    ring.rotation.set(1.05, 0.4, 0.2);
    shapes.add(ring);

    const bars = new THREE.Group();
    const barGeometry = new THREE.BoxGeometry(0.28, 2.6, 0.28);
    for (let index = 0; index < 11; index += 1) {
      const bar = new THREE.Mesh(
        barGeometry,
        index % 2 === 0 ? accentMaterial : solidMaterial,
      );
      const direction = index % 2 === 0 ? -1 : 1;
      bar.position.set(-4.6 + index * 0.9, direction * 2.2, -3.8 - index * 0.12);
      bar.rotation.z = THREE.MathUtils.degToRad(direction * 18);
      bars.add(bar);
    }
    root.add(bars);

    const particlesCount = 180;
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let index = 0; index < particlesCount; index += 1) {
      const stride = index * 3;
      particlePositions[stride] = (Math.random() - 0.5) * 24;
      particlePositions[stride + 1] = (Math.random() - 0.5) * 14;
      particlePositions[stride + 2] = (Math.random() - 0.5) * 12;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: 0x111111,
        size: 0.055,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9,
      }),
    );
    scene.add(particles);

    const pointer = new THREE.Vector2(0, 0);
    const targetRotation = new THREE.Vector2(0, 0);

    const updateSize = () => {
      const { clientWidth, clientHeight } = canvas;
      if (!clientWidth || !clientHeight) {
        return;
      }

      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (prefersReducedMotion) {
        return;
      }

      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      targetRotation.set(pointer.y * 0.18, pointer.x * 0.3);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let frameId = 0;
    const clock = new THREE.Clock();

    const render = () => {
      const elapsed = clock.getElapsedTime();
      const motionScale = prefersReducedMotion ? 0.2 : 1;

      knot.rotation.x = 0.7 + elapsed * 0.18 * motionScale;
      knot.rotation.y = 0.5 + elapsed * 0.28 * motionScale;

      orb.position.y = -0.7 + Math.sin(elapsed * 0.9) * 0.32 * motionScale;
      orb.rotation.x = elapsed * 0.22 * motionScale;
      orb.rotation.y = elapsed * 0.4 * motionScale;

      ring.rotation.z = 0.2 + elapsed * 0.12 * motionScale;
      bars.rotation.z = -0.2 + Math.sin(elapsed * 0.45) * 0.14 * motionScale;

      shapes.rotation.x += (targetRotation.x - shapes.rotation.x) * 0.035;
      shapes.rotation.y += (targetRotation.y - shapes.rotation.y) * 0.035;
      particles.rotation.y = elapsed * 0.02 * motionScale;
      particles.rotation.x = elapsed * 0.01 * motionScale;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("pointermove", onPointerMove);

      particlesGeometry.dispose();
      wireMaterial.dispose();
      solidMaterial.dispose();
      accentMaterial.dispose();
      ring.material.dispose();
      knot.geometry.dispose();
      orb.geometry.dispose();
      ring.geometry.dispose();
      barGeometry.dispose();
      particles.material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="h-full w-full"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,hsl(var(--background))_88%)]" />
    </div>
  );
};

export default HeroScene;
