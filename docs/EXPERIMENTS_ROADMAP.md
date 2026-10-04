# The Lab: Experiments Roadmap

A curated roadmap of small, atomic 3D and micro-interaction experiments built for **The Lab** (`/experiments`). Each experiment is designed to be self-contained, lightweight, visually striking, and reusable across the portfolio (hero sections, project cards, navigation, or easter eggs).

---

## Architecture and Best Practices in Astro

All experiments follow the **Astro Island Architecture**:
1. **Isolated React Component**: Placed in `src/components/experiments/<ComponentName>.tsx`.
2. **MDX Documentation and Demo**: Placed in `src/content/experiments/<experiment-slug>.mdx`.
3. **Lazy Hydration**: Always mount with `<ComponentName client:visible />` so Three.js or heavy animation logic only loads when scrolled into view, keeping initial page load and Lighthouse scores at 100.

### Recommended Packages to Install
The project currently has `three` and `@react-three/fiber` installed. To unlock the full power of these experiments, install:
```bash
# Modern Motion library (by Matt Perry / Framer Motion)
npm install motion

# React Three Fiber helpers (materials, controls, postprocessing helpers)
npm install @react-three/drei
```

---

## Experiment Catalog and Milestones

### Phase 1: Pure Motion and Micro-Interactions (Quick Wins)
*Focus: Subtle, high-polish UI physics that do not need WebGL context.*

#### 1. Magnetic Spring Button
- **Category**: `css`
- **Estimated Build Time**: 1 hour
- **Concept**: A button or social icon whose center point dynamically attracts towards the cursor when the pointer is within a ~50px threshold, then snaps back with damped spring physics on exit.
- **Tech Recipe**:
  - `useMotionValue` for mouse position offset.
  - `useSpring` with `{ stiffness: 150, damping: 15 }`.
  - Reusable as a wrapper for CTA buttons across the portfolio.

#### 2. Radial Spotlight Border Card
- **Category**: `css`
- **Estimated Build Time**: 1 hour
- **Concept**: A dark-mode card where moving the mouse reveals a glowing gradient border and subtle inner radial backlight that follows the pointer.
- **Tech Recipe**:
  - Motion's `useMotionTemplate` binding dynamic `clientX/Y` values to CSS radial gradient coordinates:
    ```tsx
    const background = useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, rgba(120, 119, 198, 0.15), transparent 80%)`
    ```
  - Perfect drop-in replacement or enhancement for `ProjectCard.astro` or `BlogCard.astro`.

#### 3. Morphing Spring Segmented Control / Pill Switch
- **Category**: `css`
- **Estimated Build Time**: 1.5 hours
- **Concept**: A tabbed filter bar where the active indicator background pill morphs and stretches with spring inertia as you click between categories.
- **Tech Recipe**:
  - Framer Motion / Motion's `layoutId="active-pill"`.
  - Can be used to filter experiments by category (`3d`, `webgl`, `css`, `shader`) on `/experiments`.

---

### Phase 2: Atomic Three.js and R3F Visuals (Visual Impact)
*Focus: Procedural math, geometry, and real-time canvas interaction.*

#### 4. Interactive Particle Repulsion Cloud
- **Category**: `3d`
- **Estimated Build Time**: 2 hours
- **Concept**: A cloud of 2,000 tiny glowing particles arranged in a grid or sphere. Moving the cursor pushes nearby particles away (dispersion vector), and they smoothly float back to their original anchors.
- **Tech Recipe**:
  - `THREE.Points` or `THREE.InstancedMesh`.
  - Custom `useFrame` loop calculating distance between pointer raycast coordinates and particle positions:
    $$\vec{F} = \frac{\vec{r}}{\|\vec{r}\|^2 + \epsilon}$$
  - Extremely lightweight: < 15KB bundle footprint, runs at 60–120 FPS on mobile.

#### 5. Wireframe Simplex Noise Blob / Morphing Icosahedron
- **Category**: `shader` / `3d`
- **Estimated Build Time**: 2–3 hours
- **Concept**: A low-poly icosahedron with an iridescent neon wireframe. Vertices continuously distort organically using 3D Perlin/Simplex noise, accelerating its ripple on hover or click.
- **Tech Recipe**:
  - `icosahedronGeometry` with detail level 3 or 4.
  - Custom vertex shader perturbing vertices along normal:
    ```glsl
    vPosition = position + normal * (sin(position.x * 4.0 + uTime * 2.0) * 0.1);
    ```
  - Or CPU-side vertex manipulation in `useFrame` using `@react-three/drei` shader material.

#### 6. 3D Frosted Glass / Prismatic Crystal
- **Category**: `3d`
- **Estimated Build Time**: 2 hours
- **Concept**: An interactive floating diamond or pill that refracts light with chromatic aberration, internal roughness, and dynamic reflections that rotate as the user drags or tilts their mouse.
- **Tech Recipe**:
  - `@react-three/drei`'s `<MeshTransmissionMaterial />`.
  - Controls: `roughness={0.1}`, `transmission={0.95}`, `thickness={0.5}`, `chromaticAberration={0.06}`.
  - Combined with `<OrbitControls enableZoom={false} autoRotate />`.

---

### Phase 3: Hybrid Three.js and Motion (Senior Polish)
*Focus: Bridging WebGL canvases seamlessly with DOM UI layers.*

#### 7. 2.5D Parallax Gyro Card
- **Category**: `webgl` / `css`
- **Estimated Build Time**: 2 hours
- **Concept**: A card that tilts in 3D perspective following the mouse, while floating elements (badge, title, Three.js mini-canvas) float at different Z-depths with realistic parallax shadows.
- **Tech Recipe**:
  - Motion's `useTransform` translating mouse X/Y to `rotateX` and `rotateY` (-15deg to +15deg).
  - CSS `transform-style: preserve-3d;` with child elements having `translateZ(40px)`.

#### 8. Procedural Audio / Frequency Waveform Ribbon
- **Category**: `shader` / `webgl`
- **Estimated Build Time**: 3 hours
- **Concept**: A glowing wavy 3D ribbon or terrain mesh that ripples continuously like an audio equalizer. Clicking switches frequencies or simulates sound reactivity.
- **Tech Recipe**:
  - `planeGeometry` with high segment density (`[10, 10, 64, 64]`).
  - Sinusoidal wave compounding in vertex shader:
    $$z = \sin(x \cdot k_1 + t) \cdot \cos(y \cdot k_2 + t)$$

#### 9. Physics Badge Drop Box (Gravity Sandbox)
- **Category**: `3d`
- **Estimated Build Time**: 3 hours
- **Concept**: A transparent 3D box where tech icons (React, TypeScript, Astro, Docker) drop in with rigid-body physics. The user can click and drag them, or shake the canvas to toss them around.
- **Tech Recipe**:
  - `@react-three/rapier` for lightweight WebAssembly physics.
  - `<RigidBody colliders="cuboid">` wrapping rounded cube meshes.

---

## Step-by-Step Implementation Recipe

When you want to build any experiment from this list:

### Step 1: Create the Component
Create `src/components/experiments/<Name>.tsx`:
```tsx
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function Scene() {
  const meshRef = useRef(null!)
  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.5
  })
  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1.5, 0]} />
      <meshStandardMaterial wireframe color="#6366f1" />
    </mesh>
  )
}

export default function MyExperiment() {
  return (
    <div className="h-[350px] w-full rounded-xl border bg-zinc-950 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} />
        <Scene />
      </Canvas>
    </div>
  )
}
```

### Step 2: Create the Experiment Post
Create `src/content/experiments/<slug>.mdx`:
```mdx
---
title: "Wireframe Octahedron Wave"
description: "A lightweight procedural geometric wave experiment."
date: 2026-04-10
category: "3d"
tags: ["threejs", "r3f", "geometry"]
---

import MyExperiment from '../../components/experiments/MyExperiment.tsx'

# Wireframe Octahedron Wave

A technical exploration of geometry subdivision and rotation kinematics.

<MyExperiment client:visible />

### Technical Takeaways
- Hydrated on demand with `client:visible`.
- Zero impact on first contentful paint (FCP).
```

### Step 3: Verify in "The Lab"
Visit `/experiments` on your local development server—the new card will automatically show up, sorted by date, with its category pill.
