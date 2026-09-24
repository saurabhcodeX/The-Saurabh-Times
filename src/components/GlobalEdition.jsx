import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";

const EARTH_RADIUS = 1.48;

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
      {/* Main blue atmospheric rim */}
      <mesh scale={1.045}>
        <sphereGeometry
          args={[EARTH_RADIUS, 96, 64]}
        />

        <meshBasicMaterial
          color="#35a9ff"
          transparent
          opacity={0.24}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer soft glow */}
      <mesh scale={1.09}>
        <sphereGeometry
          args={[EARTH_RADIUS, 96, 64]}
        />

        <meshBasicMaterial
          color="#63c4ff"
          transparent
          opacity={0.08}
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
        args={[EARTH_RADIUS, 128, 80]}
      />

      <meshStandardMaterial
        map={day}
        normalMap={normal}

        normalScale={
          new THREE.Vector2(0.38, 0.38)
        }

        roughness={0.76}
        metalness={0}

        /* Subtle city lights */
        emissive={
          new THREE.Color("#ffb35a")
        }

        emissiveMap={lights}

        emissiveIntensity={0.38}
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
    if (!cloudRef.current) return;

    cloudRef.current.rotation.y +=
      delta * 0.008;
  });

  return (
    <mesh
      ref={cloudRef}
      scale={1.014}
    >
      <sphereGeometry
        args={[EARTH_RADIUS, 128, 80]}
      />

      <meshPhongMaterial
        map={clouds}
        transparent
        opacity={0.10}
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
    if (!earthRef.current) return;

    earthRef.current.rotation.y +=
      delta * 0.032;
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
   GLOBE SCENE
   ========================================================= */

function GlobeScene() {
  return (
    <>

      {/* Soft base light */}
      <ambientLight
        intensity={0.52}
      />


      {/* Main sunlight */}
      <directionalLight
        position={[-4, 3, 5]}
        intensity={3.8}
      />


      {/* Soft blue fill */}
      <directionalLight
        position={[4, -1, -3]}
        intensity={0.22}
        color="#6dbbff"
      />


      {/* Small warm sunlight */}
      <pointLight
        position={[-4, 1, 4]}
        intensity={0.55}
        color="#fff0d0"
      />


      {/* =================================================
          SPACE / SKY
          ================================================= */}

      <Stars
        radius={9}
        depth={7}
        count={1100}
        factor={1.35}
        saturation={0}
        fade
        speed={0.08}
      />


      {/* Earth */}
      <Earth />


      {/* =================================================
          INTERACTION
          ================================================= */}

      <OrbitControls
        makeDefault

        enablePan={false}

        enableRotate={true}

        enableZoom={true}

        enableDamping={true}

        dampingFactor={0.055}

        rotateSpeed={0.42}

        zoomSpeed={0.30}

        /*
         * Don't allow the Earth
         * to become too small.
         */

        minDistance={2.62}

        maxDistance={3.15}

        /*
         * Vertical rotation limits.
         */

        minPolarAngle={
          Math.PI * 0.25
        }

        maxPolarAngle={
          Math.PI * 0.75
        }
      />

    </>
  );
}


/* =========================================================
   GLOBAL EDITION
   ========================================================= */

export default function GlobalEdition() {
  return (
    <section
      className="global-mini-section"
      aria-label="Global Edition"
    >

      <div className="global-mini-box">

        <span className="global-mini-corner global-mini-corner-tl" />
        <span className="global-mini-corner global-mini-corner-tr" />
        <span className="global-mini-corner global-mini-corner-bl" />
        <span className="global-mini-corner global-mini-corner-br" />


        {/* =================================================
            HEADER
            ================================================= */}

        <div className="global-mini-meta">

          <span>
            03 / 06
          </span>

          <span>
            <span className="global-mini-meta-live" />
            GLOBAL EDITION
          </span>

          <span>
            EST. 2026
          </span>

        </div>


        {/* =================================================
            EDITORIAL ANNOTATIONS
            ================================================= */}

        <div className="global-mini-annotation global-mini-annotation-top">
          <span>IDEAS TRAVEL</span>
          <span>FASTER THAN</span>
          <span>BORDERS</span>
        </div>

        <div className="global-mini-annotation global-mini-annotation-bottom">
          <span className="global-mini-annotation-mark">✦</span>
          <span>A WIDER</span>
          <span>PERSPECTIVE</span>
        </div>


        {/* =================================================
            MAIN CONTENT
            ================================================= */}

        <div className="global-mini-content">


          {/* =================================================
              LEFT EDITORIAL
              ================================================= */}

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
              From Chandigarh to the
              digital world.
            </p>


            <div className="global-mini-location">

              <span className="global-mini-location-dot" />

              <span>
                DIGITAL / GLOBAL / IMPACT
              </span>

            </div>

          </div>


          {/* =================================================
              GLOBE
              ================================================= */}

          <div className="global-mini-orbit">


            <div className="global-mini-orbit-label">
              LIVE PLANETARY VIEW
            </div>


            <div className="global-mini-circle">

              <Canvas
                camera={{
                  position: [
                    0,
                    0.02,
                    3.05,
                  ],

                  fov: 31,
                }}

                dpr={[1, 1.5]}

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


            {/* Orbit dots */}

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
            DRAG / ZOOM / EXPLORE ↗
          </span>

        </div>

      </div>

    </section>
  );
}