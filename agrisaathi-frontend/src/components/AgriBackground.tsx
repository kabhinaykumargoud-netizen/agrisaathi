"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AgriBackground() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // ── Renderer ──────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x87ceeb);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.3;
        mount.appendChild(renderer.domElement);

        // ── Scene & Camera ─────────────────────────────────────────
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);
        scene.fog = new THREE.Fog(0xc8e8ff, 90, 240);

        const camera = new THREE.PerspectiveCamera(
            58, window.innerWidth / window.innerHeight, 0.1, 600
        );
        // Side-angle cinematic view — see river on right, field in centre, wheel on left
        camera.position.set(-8, 14, 52);
        camera.lookAt(10, 2, 0);

        // ── Lights ─────────────────────────────────────────────────
        // Bright midday sun
        const sun = new THREE.DirectionalLight(0xfff5e0, 3.8);
        sun.position.set(40, 80, 30);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        sun.shadow.camera.near = 0.5;
        sun.shadow.camera.far = 300;
        sun.shadow.camera.left = -120;
        sun.shadow.camera.right = 120;
        sun.shadow.camera.top = 120;
        sun.shadow.camera.bottom = -120;
        sun.shadow.bias = -0.001;
        scene.add(sun);

        // Sky fill (blue bounce)
        scene.add(new THREE.HemisphereLight(0x87ceeb, 0x4a7c2e, 1.6));

        // Soft ambient
        scene.add(new THREE.AmbientLight(0xffeedd, 0.6));

        // ── Sky Dome ───────────────────────────────────────────────
        const skyUniforms = { uTime: { value: 0 } };
        const skyDome = new THREE.Mesh(
            new THREE.SphereGeometry(300, 32, 16),
            new THREE.ShaderMaterial({
                uniforms: skyUniforms,
                side: THREE.BackSide,
                depthWrite: false,
                vertexShader: `
                    varying vec3 vWorld;
                    void main() {
                        vWorld = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }`,
                fragmentShader: `
                    varying vec3 vWorld;
                    uniform float uTime;
                    void main() {
                        float y = normalize(vWorld).y;
                        vec3 sky   = vec3(0.40, 0.72, 0.98);
                        vec3 horiz = vec3(0.85, 0.94, 1.00);
                        vec3 col = mix(horiz, sky, smoothstep(0.0, 0.55, y));
                        // Sun disc
                        vec3 sunDir = normalize(vec3(0.45, 0.88, 0.32));
                        float sv = dot(normalize(vWorld), sunDir);
                        col += smoothstep(0.9995, 1.0, sv) * vec3(1.8, 1.6, 0.9);
                        col += smoothstep(0.990, 0.9995, sv) * vec3(0.5, 0.35, 0.10) * 0.5;
                        // Soft white clouds
                        float cx = vWorld.x * 0.003 + uTime * 0.003;
                        float cz = vWorld.z * 0.003;
                        float c1 = smoothstep(0.45, 0.75, sin(cx * 4.1) * cos(cz * 3.7) * max(0.0,y));
                        float c2 = smoothstep(0.45, 0.75, sin(cx * 3.3 + 1.2) * cos(cz * 2.9 + 0.8) * max(0.0,y));
                        col = mix(col, vec3(1.0,1.0,1.0), (c1 + c2) * 0.55);
                        gl_FragColor = vec4(col, 1.0);
                    }`,
            })
        );
        scene.add(skyDome);

        // ── Ground — main field ────────────────────────────────────
        const groundGeo = new THREE.PlaneGeometry(260, 180, 1, 1);
        const groundMat = new THREE.MeshLambertMaterial({ color: 0x5a8a30 }); // green field
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        ground.receiveShadow = true;
        scene.add(ground);

        // Tilled soil strip behind tractor
        const soilGeo = new THREE.PlaneGeometry(110, 14, 1, 1);
        const soilMat = new THREE.MeshLambertMaterial({ color: 0x6b3a1e });
        const soil = new THREE.Mesh(soilGeo, soilMat);
        soil.rotation.x = -Math.PI / 2;
        soil.position.set(0, 0.02, 8);
        soil.receiveShadow = true;
        scene.add(soil);

        // ── Crop rows (wheat strips — instanced quads) ─────────────
        const rowMat = new THREE.MeshLambertMaterial({ color: 0x8fbc45, side: THREE.DoubleSide });
        for (let row = -5; row <= 5; row++) {
            if (Math.abs(row) < 2) continue; // leave plough lane clear
            const rowMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(110, 0.5, 1, 1),
                rowMat
            );
            rowMesh.rotation.x = -Math.PI / 2;
            rowMesh.position.set(0, 0.03, row * 4.5 - 18);
            rowMesh.receiveShadow = true;
            scene.add(rowMesh);
        }

        // ── River ──────────────────────────────────────────────────
        const riverUniforms = { uTime: { value: 0 } };
        const riverGeo = new THREE.PlaneGeometry(280, 22, 80, 8);
        const riverMesh = new THREE.Mesh(
            riverGeo,
            new THREE.ShaderMaterial({
                uniforms: riverUniforms,
                transparent: true,
                side: THREE.FrontSide,
                vertexShader: `
                    varying vec2 vUv;
                    uniform float uTime;
                    void main() {
                        vUv = uv;
                        vec3 p = position;
                        p.z += sin(p.x * 0.15 + uTime * 1.2) * 0.18
                             + sin(p.x * 0.35 + uTime * 0.8) * 0.08;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
                    }`,
                fragmentShader: `
                    varying vec2 vUv;
                    uniform float uTime;
                    void main() {
                        // Animated ripple pattern
                        float wave = sin(vUv.x * 28.0 - uTime * 2.5) * 0.5 + 0.5;
                        float wave2 = sin(vUv.x * 14.0 + vUv.y * 6.0 - uTime * 1.8) * 0.5 + 0.5;
                        float ripple = wave * 0.3 + wave2 * 0.15;
                        vec3 deep   = vec3(0.10, 0.28, 0.55);
                        vec3 shallow = vec3(0.25, 0.55, 0.75);
                        vec3 highlight = vec3(0.80, 0.92, 1.00);
                        vec3 col = mix(deep, shallow, vUv.y);
                        col = mix(col, highlight, ripple * 0.4);
                        // Sun reflection streak
                        float sunRef = smoothstep(0.35, 0.65, vUv.x)
                                     * smoothstep(0.0, 0.15, vUv.y)
                                     * smoothstep(1.0, 0.75, vUv.y)
                                     * (0.6 + 0.4 * sin(uTime * 3.0));
                        col += sunRef * vec3(1.0, 0.97, 0.75) * 0.55;
                        gl_FragColor = vec4(col, 0.92);
                    }`,
            })
        );
        riverMesh.rotation.x = -Math.PI / 2;
        riverMesh.position.set(0, 0.05, -42);
        scene.add(riverMesh);

        // River banks
        const bankMat = new THREE.MeshLambertMaterial({ color: 0x7a5c30 });
        const bankNear = new THREE.Mesh(new THREE.BoxGeometry(280, 0.6, 3), bankMat);
        bankNear.position.set(0, -0.25, -30.5);
        scene.add(bankNear);
        const bankFar = new THREE.Mesh(new THREE.BoxGeometry(280, 0.6, 3), bankMat);
        bankFar.position.set(0, -0.25, -53);
        scene.add(bankFar);

        // ── Persian / Ferry Wheel (irrigation wheel) ───────────────
        // Placed near the river bank, left side of scene
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(-32, 0, -31);

        const spokeMat = new THREE.MeshLambertMaterial({ color: 0x5c3310 });
        const rimMat = new THREE.MeshLambertMaterial({ color: 0x7a4418 });
        const bucketMat = new THREE.MeshLambertMaterial({ color: 0xc87020 });
        const axleMat = new THREE.MeshLambertMaterial({ color: 0x4a2a08 });

        const WHEEL_R = 7.5;
        const SPOKE_N = 12;

        // Outer rim circle
        for (let seg = 0; seg < 48; seg++) {
            const a1 = (seg / 48) * Math.PI * 2;
            const a2 = ((seg + 1) / 48) * Math.PI * 2;
            const rimSeg = new THREE.Mesh(
                new THREE.BoxGeometry(
                    Math.abs(WHEEL_R * (a2 - a1)) * 1.05, 0.35, 0.35
                ),
                rimMat
            );
            rimSeg.position.set(
                Math.cos((a1 + a2) / 2) * WHEEL_R,
                Math.sin((a1 + a2) / 2) * WHEEL_R,
                0
            );
            rimSeg.rotation.z = (a1 + a2) / 2 + Math.PI / 2;
            wheelGroup.add(rimSeg);
        }

        // Inner hub ring
        for (let seg = 0; seg < 24; seg++) {
            const a1 = (seg / 24) * Math.PI * 2;
            const a2 = ((seg + 1) / 24) * Math.PI * 2;
            const hubSeg = new THREE.Mesh(
                new THREE.BoxGeometry(Math.abs(1.5 * (a2 - a1)) * 1.1, 0.22, 0.22),
                axleMat
            );
            hubSeg.position.set(
                Math.cos((a1 + a2) / 2) * 1.5,
                Math.sin((a1 + a2) / 2) * 1.5,
                0
            );
            hubSeg.rotation.z = (a1 + a2) / 2 + Math.PI / 2;
            wheelGroup.add(hubSeg);
        }

        // Spokes
        for (let k = 0; k < SPOKE_N; k++) {
            const ang = (k / SPOKE_N) * Math.PI * 2;
            const spoke = new THREE.Mesh(
                new THREE.CylinderGeometry(0.12, 0.12, WHEEL_R - 1.5, 6),
                spokeMat
            );
            spoke.position.set(
                Math.cos(ang) * ((WHEEL_R + 1.5) / 2),
                Math.sin(ang) * ((WHEEL_R + 1.5) / 2),
                0
            );
            spoke.rotation.z = ang + Math.PI / 2;
            wheelGroup.add(spoke);
        }

        // Buckets / pots on rim
        for (let k = 0; k < SPOKE_N; k++) {
            const ang = (k / SPOKE_N) * Math.PI * 2;
            const bucket = new THREE.Mesh(
                new THREE.CylinderGeometry(0.28, 0.18, 0.55, 7),
                bucketMat
            );
            bucket.position.set(
                Math.cos(ang) * WHEEL_R,
                Math.sin(ang) * WHEEL_R,
                0
            );
            wheelGroup.add(bucket);
        }

        // Axle post support (left & right side walls)
        const postL = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 10, 0.4),
            axleMat
        );
        postL.position.set(-0.6, 5, -0.8);
        wheelGroup.add(postL);
        const postR = postL.clone();
        postR.position.set(-0.6, 5, 0.8);
        wheelGroup.add(postR);

        // Connecting beam
        const crossBeam = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.35, 2.0),
            axleMat
        );
        crossBeam.position.set(-0.6, 9.8, 0);
        wheelGroup.add(crossBeam);

        // Center axle cylinder
        const axle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.25, 2.0, 12),
            axleMat
        );
        axle.rotation.x = Math.PI / 2;
        axle.position.set(0, 0, 0);
        wheelGroup.add(axle);

        // Water channel leading from wheel to field
        const channelMat = new THREE.MeshLambertMaterial({ color: 0x7a5c30 });
        const channel = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.3, 16),
            channelMat
        );
        channel.position.set(-32, 0.1, -22);
        scene.add(channel);

        scene.add(wheelGroup);

        // ── (Tractor Section Removed for Pure Wheat View) ──
        // Smoke puffs (simple spheres)
        const puffMat = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.35 });
        const puffs: { mesh: THREE.Mesh; age: number; ox: number; oy: number; oz: number }[] = [];
        for (let p = 0; p < 6; p++) {
            const m = new THREE.Mesh(new THREE.SphereGeometry(0.25 + Math.random() * 0.25, 6, 6), puffMat.clone());
            scene.add(m);
            puffs.push({ mesh: m, age: p * 0.3, ox: 0, oy: 0, oz: 0 });
        }

        // ── Trees ──────────────────────────────────────────────────
        function addTree(tx: number, tz: number, height: number, spread: number, color: number) {
            const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5c3a1a });
            const leafMat = new THREE.MeshLambertMaterial({ color });
            const tg = new THREE.Group();

            const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.22, 0.35, height * 0.45, 7),
                trunkMat
            );
            trunk.position.y = height * 0.225;
            trunk.castShadow = true;
            tg.add(trunk);

            // Layered canopy
            for (let layer = 0; layer < 3; layer++) {
                const r = spread * (1.0 - layer * 0.22);
                const yOff = height * 0.38 + layer * height * 0.18;
                const coneMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(color).offsetHSL(0, 0, (layer - 1) * 0.06) });
                const cone = new THREE.Mesh(new THREE.ConeGeometry(r, height * 0.38, 7), coneMat);
                cone.position.y = yOff;
                cone.castShadow = true;
                tg.add(cone);
            }

            tg.position.set(tx, 0, tz);
            scene.add(tg);
            return tg;
        }

        // Trees along the river bank
        const treesData: Array<{ x: number; z: number; h: number; s: number; col: number }> = [
            { x: -70, z: -34, h: 9, s: 3.8, col: 0x2d7a20 },
            { x: -50, z: -33, h: 11, s: 4.2, col: 0x3a8c25 },
            { x: -30, z: -35, h: 8, s: 3.4, col: 0x257018 },
            { x: -14, z: -32, h: 10, s: 3.9, col: 0x2e8c22 },
            { x: 5, z: -33, h: 9, s: 3.6, col: 0x3a9928 },
            { x: 22, z: -34, h: 12, s: 4.5, col: 0x2a7715 },
            { x: 40, z: -33, h: 10, s: 3.8, col: 0x308020 },
            { x: 58, z: -35, h: 9, s: 3.5, col: 0x286018 },
            { x: 72, z: -32, h: 11, s: 4.0, col: 0x358a24 },
            // Far bank
            { x: -62, z: -56, h: 8, s: 3.2, col: 0x1f6010 },
            { x: -38, z: -58, h: 10, s: 4.0, col: 0x2a7018 },
            { x: 10, z: -57, h: 9, s: 3.5, col: 0x246815 },
            { x: 45, z: -56, h: 11, s: 4.2, col: 0x287520 },
        ];
        const treeGroups = treesData.map(d => addTree(d.x, d.z, d.h, d.s, d.col));

        // A palm-ish tree near the wheel
        const palmBaseMat = new THREE.MeshLambertMaterial({ color: 0x8b6914 });
        const palmTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 8, 8), palmBaseMat);
        palmTrunk.position.set(-26, 4, -31);
        scene.add(palmTrunk);
        const palmLeafMat = new THREE.MeshLambertMaterial({ color: 0x3da820, side: THREE.DoubleSide });
        for (let pl = 0; pl < 7; pl++) {
            const pAng = (pl / 7) * Math.PI * 2;
            const palmLeaf = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 0.7), palmLeafMat);
            palmLeaf.position.set(-26 + Math.cos(pAng) * 1.8, 8.4, -31 + Math.sin(pAng) * 1.8);
            palmLeaf.rotation.z = Math.sin(pAng) * 0.55;
            palmLeaf.rotation.x = -0.45;
            palmLeaf.rotation.y = pAng;
            palmLeaf.castShadow = true;
            scene.add(palmLeaf);
        }

        // ── Birds (V-shape silhouettes, flying across sky) ─────────
        const birdMat = new THREE.MeshBasicMaterial({ color: 0x111122, side: THREE.DoubleSide });
        function makeBird(): THREE.Group {
            const bg = new THREE.Group();
            const wings = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.22), birdMat);
            bg.add(wings);
            return bg;
        }

        const BIRD_N = 14;
        interface BirdData { g: THREE.Group; speed: number; height: number; offset: number; row: number; col: number }
        const birds: BirdData[] = [];
        for (let b = 0; b < BIRD_N; b++) {
            const bg = makeBird();
            const flock = Math.floor(b / 5);
            birds.push({
                g: bg,
                speed: 0.12 + Math.random() * 0.07,
                height: 28 + flock * 5 + Math.random() * 4,
                offset: Math.random() * Math.PI * 2,
                row: Math.floor(b % 5) - 2,
                col: flock * 3 + Math.floor(b % 5) * 0.7,
            });
            scene.add(bg);
        }

        // ── Mouse Parallax ─────────────────────────────────────────
        const mouse = { x: 0, y: 0 };
        const camTarget = { x: 0, y: 0 };
        const onMouse = (e: MouseEvent) => {
            mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", onMouse);

        // ── Resize ─────────────────────────────────────────────────
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onResize);

        // ── Animate ────────────────────────────────────────────────
        let rafId: number;
        let t = 0;
        const wheelRotSpeed = 0.45; // radians/s  – visible spin
        const tractorSpeed = 0.055; // units/frame

        const animate = () => {
            rafId = requestAnimationFrame(animate);
            t += 0.016;

            // Sky time
            skyUniforms.uTime.value = t;
            (riverUniforms.uTime as THREE.IUniform).value = t;

            // ── Wheel spin ─────────────────────────────────────
            wheelGroup.rotation.z += wheelRotSpeed * 0.016;

            // ── (Tractor Movement Logic Removed) ──

            // ── Trees sway ─────────────────────────────────────
            treeGroups.forEach((tg, i) => {
                const sway = Math.sin(t * 0.8 + i * 0.7) * 0.025;
                tg.rotation.z = sway;
                tg.rotation.x = Math.sin(t * 0.5 + i * 0.4) * 0.015;
            });

            // ── Birds ──────────────────────────────────────────
            birds.forEach((bd, i) => {
                const bx = ((t * bd.speed * 22 + bd.offset * 30 + 120) % 260) - 130;
                const bz = -60 - bd.row * 5;
                bd.g.position.set(bx, bd.height, bz);
                // Wing flap using scale Y
                const flap = Math.sin(t * 8.0 + i * 1.1) * 0.4 + 0.6;
                bd.g.scale.set(1, flap, 1);
                bd.g.rotation.y = Math.PI; // face forward
            });

            // ── Camera gentle drift + mouse parallax ────────────
            camTarget.x += (mouse.x * 6 - camTarget.x) * 0.045;
            camTarget.y += (-mouse.y * 3 - camTarget.y) * 0.045;

            camera.position.x = -8 + camTarget.x + Math.sin(t * 0.06) * 0.8;
            camera.position.y = 14 + camTarget.y + Math.sin(t * 0.04) * 0.4;
            camera.lookAt(10 + camTarget.x * 0.3, 2, 0);

            renderer.render(scene, camera);
        };
        animate();

        // ── Cleanup ────────────────────────────────────────────────
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("resize", onResize);
            renderer.dispose();
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            ref={mountRef}
            id="agri-bg"
            aria-hidden="true"
            style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
        />
    );
}
