'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ParticleSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const currentContainer = containerRef.current;
    
    // Setup Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particles (represented as thin short lines resembling hair strands)
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    interface ParticleVelocity {
      x: number;
      y: number;
      z: number;
      oscillatorScale: number;
      timeOffset: number;
    }
    const velocities: ParticleVelocity[] = [];
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Random positions spread across screen
      positions[i] = (Math.random() - 0.5) * 20;     // x
      positions[i+1] = (Math.random() - 0.5) * 20;   // y
      positions[i+2] = (Math.random() - 0.5) * 10 - 5; // z
      
      // Gentle upwards drift and slight horizontal sway
      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: Math.random() * 0.02 + 0.01,
        z: (Math.random() - 0.5) * 0.01,
        oscillatorScale: Math.random() * 0.05,
        timeOffset: Math.random() * Math.PI * 2
      });
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Material resembling glowing rose gold strands
    // Use a soft sprite/point material for a dreamy look
    const material = new THREE.PointsMaterial({
      color: 0xB76E79, // Rose gold
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    camera.position.z = 5;
    
    // Mouse interaction parameters
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates (-1 to +1)
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Smoothly interpolate camera target towards mouse position for parallax
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      const positions = particles.geometry.attributes.position.array;
      
      for (let i = 0, j = 0; i < particleCount; i++, j += 3) {
        const vel = velocities[i];
        
        // Update positions
        positions[j] += vel.x + Math.sin(time + vel.timeOffset) * vel.oscillatorScale; // x drift & sway
        positions[j+1] += vel.y; // y rise
        positions[j+2] += vel.z; // z drift
        
        // Reset particles that drift too far up or out of bounds
        if (positions[j+1] > 10) {
          positions[j+1] = -10;
          positions[j] = (Math.random() - 0.5) * 20;
        }
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentContainer && renderer.domElement) {
        currentContainer.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-50"
      aria-hidden="true"
    />
  );
};

export default ParticleSystem;
