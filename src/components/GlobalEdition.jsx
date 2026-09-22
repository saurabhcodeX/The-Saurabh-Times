import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";

const EARTH_RADIUS = 1.42;

const EARTH_TEXTURE =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_atmos_2048.jpg";

const EARTH_NORMAL =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_normal_2048.jpg";

const EARTH_LIGHTS =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_lights_2048.png";

const EARTH_CLOUDS =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_clouds_1024.png";


/* =========================================================
   ATMOSPHERE
   ========================================================= */

function Atmosphere() {
  return (
    <>
      <mesh scale={1.055}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 48]} />

        <meshBasicMaterial
          color="#4d9cff"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.085}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 48]} />

        <meshBasicMaterial
          color="#86c5ff"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}


/* =========================================================
   EARTH SURFACE
   ========================================================= */

function EarthSurface() {
  const [day, normal, lights] = useTexture([
    EARTH_TEXTURE,
    EARTH_NORMAL,
    EARTH_LIGHTS,
  ]);

  day.colorSpace = THREE.SRGBColorSpace;
  lights.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh>
      <sphereGeometry
        args={[EARTH_RADIUS, 96, 64]}
      />

      <meshStandardMaterial
        map={day}
        normalMap={normal}
        normalScale={new THREE.Vector2(0.55, 0.55)}
        roughness={0.88}
        metalness={0}
        emissive={new THREE.Color("#ff9d42")}
        emissiveMap={lights}
        emissiveIntensity={0.72}
      />
    </mesh>
  );
}


/* =========================================================
   CLOUD LAYER
   ========================================================= */

function CloudLayer() {
  const clouds = useTexture(EARTH_CLOUDS);

  const cloudRef = useRef(null);

  clouds.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.006;
    }
  });

  return (
    <mesh
      ref={cloudRef}
      scale={1.012}
    >
      <sphereGeometry
        args={[EARTH_RADIUS, 96, 64]}
      />

      <meshPhongMaterial
        map={clouds}
        transparent
        opacity={0.16}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}


/* =========================================================
   EARTH
   ========================================================= */

function Earth() {
  const earthRef = useRef(null);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.045;
    }
  });

  return (
    <group ref={earthRef}>
      <EarthSurface />

      <CloudLayer />

      <Atmosphere />
    </group>
  );
}


/* =========================================================
   THREE.JS SCENE
   ========================================================= */

function GlobeScene() {
  return (
    <>
      {/* Lighting */}

      <ambientLight intensity={0.34} />

      <directionalLight
        position={[-4, 2.5, 5]}
        intensity={2.7}
      />

      <directionalLight
        position={[3, -1, -4]}
        intensity={0.35}
      />


      {/* Stars */}

      <Stars
        radius={8}
        depth={5}
        count={650}
        factor={1.35}
        saturation={0}
        fade
        speed={0.12}
      />


      {/* Earth */}

      <Earth />


      {/* Mouse / Touch Controls */}

      <OrbitControls
        makeDefault

        enablePan={false}

        enableZoom={true}

        enableRotate={true}

        enableDamping={true}

        dampingFactor={0.055}

        rotateSpeed={0.48}

        zoomSpeed={0.38}

        /*
         * Keeps the globe large.
         * User cannot zoom so far out that
         * the Earth becomes tiny.
         */

        minDistance={2.55}

        maxDistance={3.08}

        /*
         * Prevent extreme vertical rotation.
         */

        minPolarAngle={Math.PI * 0.29}

        maxPolarAngle={Math.PI * 0.71}
      />
    </>
  );
}


/* =========================================================
   GLOBAL EDITION COMPONENT
   ========================================================= */

export default function GlobalEdition() {
  return (
    <section
      className="global-mini-section"
      aria-label="Global Edition"
    >
      <div className="global-mini-box">

        {/* =================================================
            TOP META BAR
            ================================================= */}

        <div className="global-mini-meta">
          <span>03 / 06</span>

          <span>GLOBAL EDITION</span>

          <span>EST. 2026</span>
        </div>


        {/* =================================================
            MAIN CONTENT
            ================================================= */}

        <div className="global-mini-content">

          {/* LEFT EDITORIAL */}

          <div className="global-mini-editorial">

            <span className="global-mini-kicker">
              A SMALL WORLD
            </span>

            <h2>
              BIG
              <br />
              IDEAS<span>.</span>
            </h2>

            <div className="global-mini-rule" />

            <p>
              From Chandigarh to the digital world.
            </p>

          </div>


          {/* GLOBE */}

          <div className="global-mini-orbit">

            <div className="global-mini-circle">

              <Canvas
                camera={{
                  position: [0, 0.05, 2.95],
                  fov: 31,
                }}

                dpr={[1, 1.6]}

                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference:
                    "high-performance",
                }}
              >

                <Suspense fallback={null}>
                  <GlobeScene />
                </Suspense>

              </Canvas>

            </div>


            {/* Decorative orbit dots */}

            <span
              className="
                global-mini-orbit-dot
                global-mini-orbit-dot-left
              "
            />

            <span
              className="
                global-mini-orbit-dot
                global-mini-orbit-dot-right
              "
            />

          </div>

        </div>


        {/* =================================================
            FOOTER
            ================================================= */}

        <div className="global-mini-footer">

          <span>
            WEB DEVELOPMENT
          </span>

          <strong>
            THE SAURABH TIMES
          </strong>

          <span>
            DRAG / ZOOM IN
          </span>

        </div>

      </div>
    </section>
  );
}