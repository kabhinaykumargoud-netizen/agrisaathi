"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ClayBackground() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // SCENE
        const scene = new THREE.Scene();

        // CAMERA
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // RENDERER
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // GEOMETRY - Floating Blobs
        const geometry = new THREE.IcosahedronGeometry(1, 15);

        const colors = [0x00FF7F, 0xFFFF00, 0x00ccff, 0xff00ff];
        const blobs: THREE.Mesh[] = [];

        for (let i = 0; i < 4; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: colors[i],
                shininess: 100,
                emissive: colors[i],
                emissiveIntensity: 0.2,
                transparent: true,
                opacity: 0.6
            });
            const blob = new THREE.Mesh(geometry, material);

            // Random positions
            blob.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5
            );

            // Random scale
            const s = 1.5 + Math.random() * 2;
            blob.scale.set(s, s, s);

            scene.add(blob);
            blobs.push(blob);
        }

        // LIGHTS
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0x00FF7F, 1);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        // Shader for deformation
        blobs.forEach((blob, idx) => {
            // We'll just use a simple pulse for now without complex shaders to ensure it works
            // But let's add some vertex noise simulation in the loop
        });

        // ANIMATION
        let rafId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            rafId = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            blobs.forEach((blob, i) => {
                blob.position.x += Math.sin(elapsed * 0.5 + i) * 0.005;
                blob.position.y += Math.cos(elapsed * 0.3 + i) * 0.005;
                blob.rotation.x += 0.002;
                blob.rotation.y += 0.001;

                // Pulsing scale
                const pulse = 1 + Math.sin(elapsed * 0.8 + i) * 0.05;
                blob.scale.setScalar(blob.scale.x * pulse / (blob.scale.x * pulse / blob.scale.x));
                // Just move them around
            });

            renderer.render(scene, camera);
        };

        animate();

        // RESIZE
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", handleResize);
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
                background: "radial-gradient(circle at center, #0a1015 0%, #05080a 100%)",
                overflow: "hidden"
            }}
        />
    );
}
