"use client";
import { useEffect, useRef } from "react";

/**
 * CinematicBg — Native 4K Animated Background
 * Desktop : 3840 × 2160 (16:9)
 * Mobile  : 2160 × 3840 (9:16)
 *
 * Pure WebGL shader — no compression, no video artifacts,
 * infinite resolution, same animation on all formats.
 */
export default function CinematicBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl2", {
            antialias: false,
            powerPreference: "high-performance",
            alpha: false,
            depth: false,
            stencil: false,
        });
        if (!gl) return;

        /* ─ Vertex shader ─────────────────────────────── */
        const VS = `#version 300 es
precision highp float;
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

        /* ─ Fragment shader ────────────────────────────── */
        const FS = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2  u_res;

in  vec2 v_uv;
out vec4 fragColor;

/* ── hash / noise ── */
float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 17.5);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1,0));
  float c = hash(i + vec2(0,1));
  float d = hash(i + vec2(1,1));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p  = p * 2.1 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

/* ── aurora bands ── */
vec3 aurora(vec2 uv, float t) {
  float y    = uv.y;
  float wave = fbm(vec2(uv.x * 2.5 + t * 0.08, t * 0.04)) * 0.4 - 0.15;
  float band = smoothstep(0.0, 0.18, wave + y - 0.55)
             * smoothstep(0.0, 0.22, 0.85 - y - wave);

  vec3 c1 = vec3(0.0, 1.0, 0.5);   // signal green
  vec3 c2 = vec3(0.05, 0.5, 0.9);  // deep blue
  vec3 c3 = vec3(0.8, 1.0, 0.15);  // cyber yellow
  float m  = fbm(vec2(uv.x * 1.3, t * 0.03));
  vec3 col = mix(mix(c1, c2, m), c3, smoothstep(0.3, 0.7, m));
  return col * band * 0.85;
}

/* ── farm field depth lines ── */
float fieldLines(vec2 uv) {
  float t    = u_time * 0.025;
  float pers = 1.0 - uv.y;        // perspective
  vec2  fp   = vec2(uv.x * pers * 6.0, uv.y * 5.0 - t * pers);
  float line = abs(sin(fp.x * 3.14159));
  return smoothstep(0.92, 1.0, line) * pers * pers;
}

/* ── volumetric fog wisps ── */
float fog(vec2 uv) {
  float t = u_time * 0.012;
  return fbm(vec2(uv.x * 3.0 + t, uv.y * 2.0 - t * 0.5)) * 0.25;
}

void main() {
  vec2 uv  = v_uv;
  float ar = u_res.x / u_res.y;

  /* ── Sky gradient ── */
  vec3 skyTop    = vec3(0.0, 0.01, 0.04);
  vec3 skyHoriz  = vec3(0.0, 0.08, 0.12);
  vec3 skyBase   = mix(skyTop, skyHoriz, pow(uv.y, 0.6));

  /* ── Stars ── */
  float starMask = step(0.6, uv.y);
  vec2  sg       = floor(uv * 420.0);
  float star     = step(0.993, hash(sg));
  float twinkle  = 0.5 + 0.5 * sin(u_time * 2.0 + hash(sg) * 60.0);
  skyBase       += star * twinkle * starMask * vec3(0.8, 0.95, 1.0) * 0.9;

  /* ── Aurora ── */
  vec3 aur = aurora(uv, u_time);
  skyBase  += aur;

  /* ── Ground (farm field) ── */
  vec3 soil   = vec3(0.04, 0.12, 0.05); // dark green earth
  vec3 crop   = vec3(0.06, 0.32, 0.08);
  float fNoise = fbm(vec2(uv.x * 4.0, uv.y * 3.0 + u_time * 0.015));
  vec3 ground  = mix(soil, crop, fNoise);

  /* field scan lines */
  float fl    = fieldLines(uv);
  ground     += fl * vec3(0.0, 1.0, 0.4) * 0.6;

  /* ── Horizon glow ── */
  float hGlow = exp(-abs(uv.y - 0.42) * 10.0);
  vec3  hCol  = vec3(0.0, 0.55, 0.25) * hGlow * 1.4;

  /* ── Blend sky / ground ── */
  float split = smoothstep(0.38, 0.48, uv.y);
  vec3 scene  = mix(ground, skyBase, split) + hCol;

  /* ── Rolling fog bank at horizon ── */
  float f = fog(uv) * (1.0 - smoothstep(0.35, 0.65, abs(uv.y - 0.42)));
  scene  += f * vec3(0.0, 0.6, 0.3) * 0.35;

  /* ── Vignette ── */
  vec2 vig = uv * 2.0 - 1.0;
  float v  = 1.0 - dot(vig * vec2(0.8, 1.1), vig * vec2(0.8, 1.1)) * 0.35;
  scene   *= v;

  /* ── Tone map + gamma ── */
  scene  = scene / (scene + 0.9);
  scene  = pow(scene, vec3(0.4545));

  fragColor = vec4(scene, 1.0);
}`;

        /* ─ Compile helpers ───────────────────────────── */
        const compile = (type: number, src: string) => {
            const sh = gl.createShader(type)!;
            gl.shaderSource(sh, src);
            gl.compileShader(sh);
            if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
                console.error(gl.getShaderInfoLog(sh));
            return sh;
        };

        const vs = compile(gl.VERTEX_SHADER, VS);
        const fs = compile(gl.FRAGMENT_SHADER, FS);
        const prog = gl.createProgram()!;
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        gl.useProgram(prog);

        /* ─ Full-screen quad ─────────────────────────── */
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
        );
        const loc = gl.getAttribLocation(prog, "a_pos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(prog, "u_time");
        const uRes = gl.getUniformLocation(prog, "u_res");

        /* ─ Resize → match physical 4K pixels ────────── */
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const w = window.innerWidth;
            const h = window.innerHeight;

            /* Desktop 16:9 → target 3840×2160 */
            /* Mobile  9:16 → target 2160×3840 */
            const maxW = 3840;
            const maxH = 3840;

            canvas.width = Math.min(w * dpr, maxW);
            canvas.height = Math.min(h * dpr, maxH);
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            gl.viewport(0, 0, canvas.width, canvas.height);
        };

        resize();
        window.addEventListener("resize", resize);

        /* ─ Render loop ──────────────────────────────── */
        let rafId: number;
        let start = performance.now();

        const render = () => {
            rafId = requestAnimationFrame(render);
            const t = (performance.now() - start) / 1000;
            gl.uniform1f(uTime, t);
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };

        render();

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", resize);
            gl.deleteProgram(prog);
            gl.deleteBuffer(buf);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="cinematic-bg"
            aria-hidden="true"
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                display: "block",
                zIndex: 0,
                pointerEvents: "none",
            }}
        />
    );
}
