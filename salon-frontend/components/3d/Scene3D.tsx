'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_URL = '/videos/hero-ribbon.mp4';

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!mountRef.current || isMobile) return;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    // Dark luxury background
    scene.background = new THREE.Color(0x0a0508);
    scene.fog = new THREE.FogExp2(0x0a0508, 0.02);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Start camera slightly back
    camera.position.z = 5;
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- VIDEO TEXTURE (RIBBON) ---
    const video = document.createElement('video');
    video.src = VIDEO_URL;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.play().catch(() => {});

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;

    // We use a plane for the ribbon video, mapped to appear floating in space.
    // Instead of a flat plane, we could curve it or use a cylinder, but a plane with alpha is simple and performant.
    // To make it look like a 3D ribbon, we'd ideally have an alpha channel in the video or use additive blending.
    const ribbonGeometry = new THREE.PlaneGeometry(16, 9);
    const ribbonMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8
    });
    
    // Ribbon layers to create depth
    const ribbons: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(ribbonGeometry, ribbonMaterial.clone());
      mesh.position.z = -i * 5;
      mesh.position.y = i * 1.5 - 1;
      mesh.position.x = (i % 2 === 0 ? 1 : -1) * 1.5;
      mesh.rotation.z = Math.sin(i) * 0.2;
      mesh.rotation.x = -0.1 * i;
      scene.add(mesh);
      ribbons.push(mesh);
    }

    // --- PARTICLES ---
    const particleCount = 600;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 30; // Random spread
    }
    for (let i = 0; i < particleCount; i++) {
      scaleArray[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

    // Custom shader for soft glowing particles
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xb76e79) } // Rose gold
      },
      vertexShader: `
        uniform float uTime;
        attribute float aScale;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.5 + pos.x) * 0.5;
          pos.x += cos(uTime * 0.3 + pos.y) * 0.5;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = (10.0 * aScale) * (10.0 / -mvPosition.z);
          // Fade based on z distance
          vAlpha = smoothstep(-20.0, 5.0, pos.z) * 0.6;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          // Soft circle
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float strength = 1.0 - (dist * 2.0);
          strength = pow(strength, 1.5);
          gl_FragColor = vec4(uColor, strength * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particlesMesh);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xb76e79, 1);
    directionalLight.position.set(5, 5, 2);
    scene.add(directionalLight);

    // --- CURSOR INTERACTION ---
    const mouse = new THREE.Vector2();
    const targetMouse = new THREE.Vector2();
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX - windowHalfX) * 0.001;
      mouse.y = (event.clientY - windowHalfY) * 0.001;
    };
    window.addEventListener('mousemove', onMouseMove);

    // --- SCROLL ANIMATION GSAP ---
    // Create a master timeline linked to the whole page scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5, // Smooth scrubbing
      }
    });

    // Animate Camera Z across the page scroll
    tl.to(camera.position, {
      z: -12,
      ease: 'none' // Linear over scroll
    }, 0);

    // Animate Ribbon Opacity/Rotation
    ribbons.forEach((r, i) => {
      tl.to(r.rotation, {
        z: r.rotation.z + 0.5,
        x: r.rotation.x + 0.2,
        ease: 'none'
      }, 0);
    });

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let rafId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation (parallax)
      targetMouse.x += (mouse.x - targetMouse.x) * 0.05;
      targetMouse.y += (mouse.y - targetMouse.y) * 0.05;

      camera.position.x += (targetMouse.x * 2 - camera.position.x) * 0.05;
      camera.position.y += (-targetMouse.y * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      ribbons.forEach((mesh, index) => {
        // Subtle floating
        mesh.position.y += Math.sin(elapsedTime * 0.5 + index) * 0.002;
        // Material opacity pulse
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(elapsedTime + index) * 0.2;
      });

      particleMaterial.uniforms.uTime.value = elapsedTime;
      // Rotate particles slowly
      particlesMesh.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    animate();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
      
      renderer.dispose();
      ribbonGeometry.dispose();
      ribbonMaterial.dispose();
      particlesGeometry.dispose();
      particleMaterial.dispose();
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isMobile]);

  // Prevent hydration mismatch by returning a matching empty div on the server
  if (!mounted) {
    return (
      <div 
        className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
        style={{ background: '#0a0508' }}
      />
    );
  }

  // Mobile fallback (2D Parallax CSS)
  if (isMobile) {
    return (
      <div className="fixed inset-0 w-full h-full -z-10 bg-[#0d0d0d] overflow-hidden">
        <video
          src={VIDEO_URL}
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0d0d] to-[#0d0d0d] opacity-80" />
      </div>
    );
  }

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      style={{ background: '#0a0508' }}
    />
  );
}
