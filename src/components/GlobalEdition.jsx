import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

const EARTH_TEXTURE =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_atmos_2048.jpg";
const EARTH_NORMAL =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_normal_2048.jpg";
const EARTH_LIGHTS =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_lights_2048.png";

function Earth() {
  const earthRef = useRef(null);
  const [earthMap, normalMap, lightsMap] = useTexture([
    EARTH_TEXTURE,
    EARTH_NORMAL,
    EARTH_LIGHTS,
  ]);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.16;
  });

  return (
    <group ref={earthRef}>
      <mesh>
        <sphereGeometry args={[1.28, 64, 64]} />
        <meshPhongMaterial
          map={earthMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.3, 0.3)}
          specular={new THREE.Color("#222222")}
          shininess={12}
        />
      </mesh>

      <mesh scale={1.004}>
        <sphereGeometry args={[1.28, 64, 64]} />
        <meshBasicMaterial
          map={lightsMap}
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh scale={1.065}>
        <sphereGeometry args={[1.28, 64, 64]} />
        <meshBasicMaterial
          color="#4da6ff"
          transparent
          opacity={0.14}
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 3, 5]} intensity={2.4} />

      <Stars
        radius={7}
        depth={5}
        count={900}
        factor={1.15}
        saturation={0}
        fade
        speed={0.2}
      />

      <Earth />

      <OrbitControls
        enablePan={false}
        enableZoom
        enableRotate
        enableDamping
        dampingFactor={0.045}
        rotateSpeed={0.55}
        zoomSpeed={0.55}
        minDistance={3.2}
        maxDistance={5}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.75}
      />
    </>
  );
}

export default function GlobalEdition() {
  return (
    <section className="global-mini-section" aria-label="Global Edition">
      <div className="global-mini-box">
        <div className="global-mini-top">
          <span>GLOBAL EDITION</span>
          <span className="global-mini-live"><i /> LIVE</span>
        </div>

        <div className="global-mini-globe">
          <Canvas
            camera={{ position: [0, 0, 4.1], fov: 36 }}
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
          <div className="global-mini-copy">
            <span className="global-mini-kicker">ORIGIN POINT</span>
            <strong>
              CHANDIGARH <span>→</span> DIGITAL WORLD
            </strong>
          </div>
          <div className="global-mini-hint">DRAG / ZOOM</div>
        </div>
      </div>
    </section>
  );
}
