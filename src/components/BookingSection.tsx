"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TouchTexture — encodes mouse velocity into a texture for shader distortion
// ─────────────────────────────────────────────────────────────────────────────
class TouchTexture {
  size: number;
  width: number;
  height: number;
  maxAge: number;
  radius: number;
  trail: Array<{ x: number; y: number; age: number; force: number; vx: number; vy: number }>;
  last: { x: number; y: number } | null;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  texture!: any; // THREE.Texture

  constructor() {
    this.size   = 64;
    this.width  = this.height = this.size;
    this.maxAge = 64;
    this.radius = 0.25 * this.size;
    this.trail  = [];
    this.last   = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  init(THREE: any) {
    this.canvas      = document.createElement("canvas");
    this.canvas.width  = this.width;
    this.canvas.height = this.height;
    this.ctx         = this.canvas.getContext("2d")!;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.texture     = new THREE.Texture(this.canvas);
  }

  update() {
    this.clear();
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const p = this.trail[i];
      const f = (p.force / this.maxAge) * (1 - p.age / this.maxAge);
      p.x  += p.vx * f;
      p.y  += p.vy * f;
      p.age++;
      if (p.age > this.maxAge) this.trail.splice(i, 1);
      else this.drawPoint(p);
    }
    this.texture.needsUpdate = true;
  }

  clear() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  addTouch(point: { x: number; y: number }) {
    let force = 0, vx = 0, vy = 0;
    if (this.last) {
      const dx = point.x - this.last.x;
      const dy = point.y - this.last.y;
      if (dx === 0 && dy === 0) return;
      const d  = Math.sqrt(dx * dx + dy * dy);
      vx = dx / d; vy = dy / d;
      force = Math.min(d * d * 20000, 2.0);
    }
    this.last = { ...point };
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
  }

  drawPoint(p: { x: number; y: number; age: number; force: number; vx: number; vy: number }) {
    const pos = { x: p.x * this.width, y: (1 - p.y) * this.height };
    let intensity = 1;
    if (p.age < this.maxAge * 0.3)
      intensity = Math.sin((p.age / (this.maxAge * 0.3)) * (Math.PI / 2));
    else {
      const t = 1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
      intensity = -t * (t - 2);
    }
    intensity *= p.force;
    const r      = this.radius;
    const color  = `${((p.vx + 1) / 2) * 255},${((p.vy + 1) / 2) * 255},${intensity * 255}`;
    const offset = this.size * 5;
    this.ctx.shadowOffsetX = offset;
    this.ctx.shadowOffsetY = offset;
    this.ctx.shadowBlur    = r;
    this.ctx.shadowColor   = `rgba(${color},${0.2 * intensity})`;
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255,0,0,1)";
    this.ctx.arc(pos.x - offset, pos.y - offset, r, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Vertex + Fragment shaders — brand green (#55A53B) on deep black
// ─────────────────────────────────────────────────────────────────────────────
const VERT = `
  varying vec2 vUv;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    vUv = uv;
  }
`;

const FRAG = `
  uniform float      uTime;
  uniform vec2       uResolution;
  uniform vec3       uColor1;   // brand green
  uniform vec3       uColor2;   // dark accent green
  uniform vec3       uColor3;   // mid green
  uniform vec3       uColor4;   // near black
  uniform vec3       uBase;     // deep black base
  uniform float      uSpeed;
  uniform float      uIntensity;
  uniform sampler2D  uTouch;

  varying vec2 vUv;

  #define PI 3.14159265359

  float grain(vec2 uv, float t) {
    vec2 g = uv * uResolution * 0.5;
    return fract(sin(dot(g + t, vec2(12.9898, 78.233))) * 43758.5453) * 2.0 - 1.0;
  }

  vec3 gradient(vec2 uv, float t) {
    float sp = uSpeed;

    vec2 c1 = vec2(0.5 + sin(t*sp*0.40)*0.42, 0.5 + cos(t*sp*0.50)*0.42);
    vec2 c2 = vec2(0.5 + cos(t*sp*0.55)*0.48, 0.5 + sin(t*sp*0.42)*0.48);
    vec2 c3 = vec2(0.5 + sin(t*sp*0.33)*0.44, 0.5 + cos(t*sp*0.58)*0.44);
    vec2 c4 = vec2(0.5 + cos(t*sp*0.47)*0.36, 0.5 + sin(t*sp*0.37)*0.36);
    vec2 c5 = vec2(0.5 + sin(t*sp*0.62)*0.38, 0.5 + cos(t*sp*0.64)*0.40);
    vec2 c6 = vec2(0.5 + cos(t*sp*0.38)*0.50, 0.5 + sin(t*sp*0.44)*0.50);
    vec2 c7 = vec2(0.5 + sin(t*sp*0.70)*0.32, 0.5 + cos(t*sp*0.46)*0.45);
    vec2 c8 = vec2(0.5 + cos(t*sp*0.52)*0.41, 0.5 + sin(t*sp*0.60)*0.38);

    float R = 0.50;

    float i1 = 1.0 - smoothstep(0.0, R, length(uv-c1));
    float i2 = 1.0 - smoothstep(0.0, R, length(uv-c2));
    float i3 = 1.0 - smoothstep(0.0, R, length(uv-c3));
    float i4 = 1.0 - smoothstep(0.0, R, length(uv-c4));
    float i5 = 1.0 - smoothstep(0.0, R, length(uv-c5));
    float i6 = 1.0 - smoothstep(0.0, R, length(uv-c6));
    float i7 = 1.0 - smoothstep(0.0, R, length(uv-c7));
    float i8 = 1.0 - smoothstep(0.0, R, length(uv-c8));

    // Rotating radial overlays for organic blending
    vec2 rv1 = uv - 0.5;
    float a1 = t * sp * 0.14;
    rv1 = vec2(rv1.x*cos(a1)-rv1.y*sin(a1), rv1.x*sin(a1)+rv1.y*cos(a1)) + 0.5;

    vec2 rv2 = uv - 0.5;
    float a2 = -t * sp * 0.11;
    rv2 = vec2(rv2.x*cos(a2)-rv2.y*sin(a2), rv2.x*sin(a2)+rv2.y*cos(a2)) + 0.5;

    float ri1 = 1.0 - smoothstep(0.0, 0.85, length(rv1-0.5));
    float ri2 = 1.0 - smoothstep(0.0, 0.85, length(rv2-0.5));

    vec3 col = vec3(0.0);
    // Green blobs on dark field
    col += uColor1 * i1 * (0.50 + 0.50*sin(t*sp));
    col += uColor2 * i2 * (0.50 + 0.50*cos(t*sp*1.2));
    col += uColor3 * i3 * (0.50 + 0.50*sin(t*sp*0.8));
    col += uColor4 * i4 * (0.50 + 0.50*cos(t*sp*1.4));
    col += uColor1 * i5 * (0.50 + 0.50*sin(t*sp*1.1));
    col += uColor2 * i6 * (0.50 + 0.50*cos(t*sp*0.9));
    col += uColor3 * i7 * (0.50 + 0.50*sin(t*sp*1.3));
    col += uColor4 * i8 * (0.50 + 0.50*cos(t*sp*1.5));
    col += mix(uColor1, uColor2, ri1) * 0.30;
    col += mix(uColor3, uColor4, ri2) * 0.25;

    col  = clamp(col, 0.0, 1.0) * uIntensity;

    // Saturation boost
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(lum), col, 1.40);
    col = pow(col, vec3(0.90));

    // Dark base blending — green blobs float on near-black
    float bri = length(col);
    col = mix(uBase, col, max(bri * 1.1, 0.10));

    float mb = 1.0;
    float b  = length(col);
    if (b > mb) col *= mb / b;
    return col;
  }

  void main() {
    vec2 uv = vUv;

    // Mouse ripple distortion
    vec4 touch = texture2D(uTouch, uv);
    float vx = -(touch.r * 2.0 - 1.0);
    float vy = -(touch.g * 2.0 - 1.0);
    float iv = touch.b;
    uv.x += vx * 0.7 * iv;
    uv.y += vy * 0.7 * iv;

    // Organic wave on top of touch
    vec2 cen  = vec2(0.5);
    float d   = length(uv - cen);
    float rip = sin(d * 18.0 - uTime * 2.8) * 0.035 * iv;
    float wav = sin(d * 13.0 - uTime * 2.0) * 0.025 * iv;
    uv       += vec2(rip + wav);

    vec3 col  = gradient(uv, uTime);
    col      += grain(uv, uTime) * 0.06;

    // Gentle hue oscillation
    col.r += sin(uTime * 0.4) * 0.015;
    col.g += cos(uTime * 0.5) * 0.018;
    col.b += sin(uTime * 0.35) * 0.012;

    // Re-apply base in final pass
    float bri2 = length(col);
    col = mix(uBase, col, max(bri2 * 1.1, 0.10));
    col = clamp(col, 0.0, 1.0);
    float mb2 = 1.0;
    float b2  = length(col);
    if (b2 > mb2) col *= mb2 / b2;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Learn More Button — magnetic + icon director + smooth scroll
// ─────────────────────────────────────────────────────────────────────────────
const MAG_STRENGTH = 0.28;
const MAG_SPRING   = { stiffness: 160, damping: 20, mass: 0.08 };

function LearnMoreButton() {
  const ref     = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, MAG_SPRING);
  const y    = useSpring(rawY, MAG_SPRING);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - (r.left + r.width  / 2)) * MAG_STRENGTH);
    rawY.set((e.clientY - (r.top  + r.height / 2)) * MAG_STRENGTH);
  };

  const onLeave = () => {
    setHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  const handleClick = () => {
    const footer = document.querySelector("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      className="cursor-pointer"
    >
      <button
        onClick={handleClick}
        className="group relative flex items-center gap-2.5 overflow-hidden border border-white/25 px-8 py-3.5 text-sm font-medium tracking-[0.12em] text-white/60 transition-all duration-300 hover:border-white/60 hover:bg-white/8 hover:text-white"
        style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
      >
        {/* Scan-line sweep on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
          }}
          initial={{ x: "-120%" }}
          animate={{ x: hovered ? "220%" : "-120%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        <span className="relative tracking-[0.12em]">LEARN MORE</span>

        {/* Icon: ArrowUpRight → rotates to ArrowDown on hover */}
        <span className="relative flex h-4 w-4 items-center justify-center overflow-hidden">
          <motion.span
            className="absolute"
            animate={{ y: hovered ? "-120%" : "0%", opacity: hovered ? 0 : 1 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <ArrowUpRight className="h-4 w-4" />
          </motion.span>
          <motion.span
            className="absolute"
            animate={{ y: hovered ? "0%" : "120%", opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4" />
          </motion.span>
        </span>
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function BookingSection() {
  const mountRef  = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf: number;
    let renderer: ReturnType<typeof import("three")["WebGLRenderer"]["prototype"]["constructor"]> | null = null;

    const boot = async () => {
      const THREE = await import("three");

      const mount = mountRef.current;
      if (!mount) return;

      // ── Renderer ──────────────────────────────────────────────────────────
      const W = window.innerWidth;
      const H = window.innerHeight;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        depth: false,
      });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const canvas = renderer.domElement;
      canvas.style.position = "absolute";
      canvas.style.inset = "0";
      mount.appendChild(canvas);

      // ── Scene / Camera ────────────────────────────────────────────────────
      const scene  = new THREE.Scene();
      scene.background = new THREE.Color(0x060806);
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 10000);
      camera.position.z = 50;

      const getViewSize = () => {
        const fov = (camera.fov * Math.PI) / 180;
        const h   = Math.abs(camera.position.z * Math.tan(fov / 2) * 2);
        return { width: h * camera.aspect, height: h };
      };

      // ── Touch texture ─────────────────────────────────────────────────────
      const touch = new TouchTexture();
      touch.init(THREE);

      // ── Uniforms ──────────────────────────────────────────────────────────
      // #55A53B = (85,165,59) → (0.333, 0.647, 0.231)
      // dark green accents
      const uniforms = {
        uTime:       { value: 0 },
        uResolution: { value: new THREE.Vector2(W, H) },
        uColor1:     { value: new THREE.Vector3(0.333, 0.647, 0.231) }, // #55A53B brand green
        uColor2:     { value: new THREE.Vector3(0.180, 0.420, 0.118) }, // #2E6B1E deep green
        uColor3:     { value: new THREE.Vector3(0.098, 0.235, 0.063) }, // #193C10 darker green
        uColor4:     { value: new THREE.Vector3(0.039, 0.039, 0.039) }, // #0a0a0a near black
        uBase:       { value: new THREE.Vector3(0.024, 0.031, 0.020) }, // #060806 deep black-green
        uSpeed:      { value: 1.1 },
        uIntensity:  { value: 1.7 },
        uTouch:      { value: touch.texture },
      };

      const vs = getViewSize();
      const geo = new THREE.PlaneGeometry(vs.width, vs.height, 1, 1);
      const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      // ── Clock / loop ──────────────────────────────────────────────────────
      const clock = new THREE.Clock();
      const tick  = () => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(clock.getDelta(), 0.1);
        touch.update();
        uniforms.uTime.value += dt;
        renderer!.render(scene, camera);
      };
      tick();
      setVisible(true);

      // ── Resize ────────────────────────────────────────────────────────────
      const onResize = () => {
        const nW = window.innerWidth;
        const nH = window.innerHeight;
        camera.aspect = nW / nH;
        camera.updateProjectionMatrix();
        renderer!.setSize(nW, nH);
        uniforms.uResolution.value.set(nW, nH);
        const nvs = getViewSize();
        geo.dispose();
        mesh.geometry = new THREE.PlaneGeometry(nvs.width, nvs.height, 1, 1);
      };

      // ── Mouse / Touch ─────────────────────────────────────────────────────
      const onMouse = (e: MouseEvent) => {
        touch.addTouch({ x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight });
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${e.clientX - 24}px, ${e.clientY - 24}px)`;
        }
      };
      const onTouchMove = (e: TouchEvent) => {
        const t = e.touches[0];
        touch.addTouch({ x: t.clientX / window.innerWidth, y: 1 - t.clientY / window.innerHeight });
      };

      window.addEventListener("resize",    onResize);
      window.addEventListener("mousemove", onMouse);
      window.addEventListener("touchmove", onTouchMove, { passive: true });

      // cleanup
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize",    onResize);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("touchmove", onTouchMove);
        renderer!.dispose();
        canvas.remove();
      };
    };

    const cleanupPromise = boot();
    return () => {
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, []);

  return (
    <section
      id="book"
      className="relative h-screen w-full overflow-hidden"
      style={{ cursor: "none" }}
    >
      {/* ── WebGL canvas mount ── */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* ── Scan-line overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,1) 2px,rgba(255,255,255,1) 3px)",
        }}
      />

      {/* ── Vignette ── */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(6,8,6,0.85) 100%)",
        }}
      />

      {/* ── Content ── */}
      <motion.div
        className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        {/* Section label */}
        <motion.div
          className="mb-6 flex items-center gap-3"
          initial={{ opacity: 0, y: -12 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <div className="h-px w-8 bg-[#55A53B]" />
          <span
            className="text-[10px] tracking-[0.35em] text-[#55A53B]"
            style={{ fontFamily: "var(--font-orbitron), monospace" }}
          >
            06 / INITIATE SESSION
          </span>
          <div className="h-px w-8 bg-[#55A53B]" />
        </motion.div>

        {/* Main headline */}
        <motion.h2
          className="mb-5 text-6xl font-extrabold leading-[1.05] tracking-tight text-white md:text-8xl"
          style={{ fontFamily: "var(--font-geist), sans-serif" }}
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.9 }}
        >
          Your home,
          <br />
          <span className="text-[#55A53B]">Spotless.</span>
        </motion.h2>

        {/* Subheading */}
        <motion.p
          className="mb-10 max-w-md text-sm leading-relaxed text-white/55 md:text-base"
          style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
          initial={{ opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.95, duration: 0.8 }}
        >
          Florida&apos;s most meticulous cleaning collective. We bring the
          standard — eco-friendly, methodical, guaranteed.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="mb-14 flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 12 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.15, duration: 0.7 }}
        >
          <a
            href="#book"
            className="group relative overflow-hidden border border-[#55A53B] px-8 py-3.5 text-sm font-semibold tracking-[0.12em] text-white transition-all duration-300 hover:text-[#0a0a0a]"
            style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
          >
            <span
              className="absolute inset-0 -translate-x-full bg-[#55A53B] transition-transform duration-300 group-hover:translate-x-0"
            />
            <span className="relative">SCHEDULE YOUR CLEAN</span>
          </a>

          <LearnMoreButton />
        </motion.div>

        {/* Status metrics bar */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          {[
            { label: "AVAILABILITY",  value: "OPEN"          },
            { label: "RESPONSE TIME", value: "< 24 HRS"      },
            { label: "SERVICE ZONE",  value: "S. FLORIDA"    },
            { label: "ECO RATING",    value: "100% GREEN"    },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span
                className="text-[9px] tracking-[0.3em] text-white/35"
                style={{ fontFamily: "var(--font-orbitron), monospace" }}
              >
                {label}
              </span>
              <span
                className="text-xs font-bold tracking-[0.15em] text-[#55A53B]"
                style={{ fontFamily: "var(--font-orbitron), monospace" }}
              >
                {value}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Corner brackets decoration ── */}
      {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map(
        (pos, i) => (
          <div
            key={i}
            className={`pointer-events-none absolute z-20 h-6 w-6 ${pos}`}
            style={{
              borderTop:   i < 2 ? "1px solid rgba(85,165,59,0.4)" : "none",
              borderBottom:i >= 2 ? "1px solid rgba(85,165,59,0.4)" : "none",
              borderLeft:  i % 2 === 0 ? "1px solid rgba(85,165,59,0.4)" : "none",
              borderRight: i % 2 === 1 ? "1px solid rgba(85,165,59,0.4)" : "none",
            }}
          />
        )
      )}

      {/* ── Custom cursor ring ── */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-[9999]"
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "1.5px solid rgba(85,165,59,0.8)",
          boxShadow: "0 0 16px 4px rgba(85,165,59,0.25), inset 0 0 10px 1px rgba(85,165,59,0.08)",
          backdropFilter: "blur(1px)",
          top: 0,
          left: 0,
          transform: "translate(-200px,-200px)",
          transition: "width 0.15s, height 0.15s",
        }}
      />
    </section>
  );
}
