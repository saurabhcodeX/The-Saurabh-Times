import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";

const EARTH_TEXTURE =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_atmos_2048.jpg";

const EARTH_NORMAL =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_normal_2048.jpg";

const EARTH_LIGHTS =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_lights_2048.png";

function Earth() {
  const earthRef = useRef();

  const [earthMap, normalMap, lightsMap] = useTexture([
    EARTH_TEXTURE,
    EARTH_NORMAL,
    EARTH_LIGHTS,
  ]);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={earthRef}>
      {/* Earth */}
      <mesh>
        <sphereGeometry args={[1.35, 64, 64]} />

        <meshPhongMaterial
          map={earthMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.35, 0.35)}
          specular={new THREE.Color("#333333")}
          shininess={8}
        />
      </mesh>

      {/* Night lights */}
      <mesh scale={1.003}>
        <sphereGeometry args={[1.35, 64, 64]} />

        <meshBasicMaterial
          map={lightsMap}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmosphere */}
      <mesh scale={1.075}>
        <sphereGeometry args={[1.35, 64, 64]} />

        <meshBasicMaterial
          color="#4da6ff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function GlobeScene() {
  return (
    <>
      <ambientLight intensity={0.45} />

      <directionalLight
        position={[4, 2, 5]}
        intensity={2}
      />

      <Stars
        radius={8}
        depth={5}
        count={700}
        factor={1.2}
        saturation={0}
        fade
        speed={0.25}
      />

      <Earth />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3.4}
        maxDistance={5}
        rotateSpeed={0.5}
        zoomSpeed={0.5}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

export default function GlobalEdition() {
  return (
    <section className="global-mini-section">
      <div className="global-mini-box">
        <div className="global-mini-top">
          <span>GLOBAL EDITION</span>
          <span>03 / 06</span>
        </div>

        <div className="global-mini-globe">
          <Canvas
            camera={{
              position: [0, 0, 4.2],
              fov: 38,
            }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            <Suspense fallback={null}>
              <GlobeScene />
            </Suspense>
          </Canvas>
        </div>

        <div className="global-mini-bottom">
          <div>
            <strong>FROM CHANDIGARH</strong>
            <span>TO THE DIGITAL WORLD</span>
          </div>

          <span className="global-mini-arrow">↗</span>
        </div>
      </div>
    </section>
  );
}