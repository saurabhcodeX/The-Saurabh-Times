import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Canvas } from "@react-three/fiber";

import {
  Html,
  Line,
  OrbitControls,
  Stars,
  useTexture,
} from "@react-three/drei";

import * as THREE from "three";

/*
=====================================================
GLOBAL EDITION
Interactive editorial globe for The Saurabh Times
=====================================================
*/

const EARTH_TEXTURE =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_atmos_2048.jpg";

const EARTH_NORMAL =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_normal_2048.jpg";

const EARTH_RADIUS = 1.55;

/*
=====================================================
UTILITIES
=====================================================
*/

function latLngToVector3(
  latitude,
  longitude,
  radius = EARTH_RADIUS
) {
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = (longitude + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius *
      Math.sin(phi) *
      Math.cos(theta),

    radius * Math.cos(phi),

    radius *
      Math.sin(phi) *
      Math.sin(theta)
  );
}

function createArc(start, end) {
  const startPoint = latLngToVector3(
    start.lat,
    start.lng,
    EARTH_RADIUS + 0.035
  );

  const endPoint = latLngToVector3(
    end.lat,
    end.lng,
    EARTH_RADIUS + 0.035
  );

  const midpoint = startPoint
    .clone()
    .add(endPoint)
    .normalize()
    .multiplyScalar(EARTH_RADIUS + 0.34);

  const curve =
    new THREE.QuadraticBezierCurve3(
      startPoint,
      midpoint,
      endPoint
    );

  return curve.getPoints(30);
}

/*
=====================================================
ATMOSPHERE
=====================================================
*/

function EarthAtmosphere() {
  return (
    <mesh scale={1.045}>
      <sphereGeometry
        args={[EARTH_RADIUS, 48, 48]}
      />

      <meshBasicMaterial
        color="#76aee8"
        transparent
        opacity={0.13}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/*
=====================================================
MARKER
=====================================================
*/

function ProjectMarker({
  project,
  onOpen,
}) {
  const [hovered, setHovered] =
    useState(false);

  const position = useMemo(
    () =>
      latLngToVector3(
        project.location.lat,
        project.location.lng,
        EARTH_RADIUS + 0.045
      ),
    [project.location]
  );

  const handlePointerOver = (event) => {
    event.stopPropagation();

    setHovered(true);

    document.body.style.cursor =
      "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);

    document.body.style.cursor =
      "";
  };

  const handleClick = (event) => {
    event.stopPropagation();

    setHovered(false);

    document.body.style.cursor =
      "";

    onOpen(project);
  };

  return (
    <group position={position}>
      {/* Main glowing point */}
      <mesh
        scale={hovered ? 1.55 : 1}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry
          args={[0.045, 16, 16]}
        />

        <meshStandardMaterial
          color="#e45a50"
          emissive="#9d251d"
          emissiveIntensity={
            hovered ? 2.5 : 1.35
          }
          roughness={0.3}
        />
      </mesh>

      {/* Soft glow */}
      <mesh
        scale={hovered ? 2.3 : 1.65}
        raycast={() => null}
      >
        <sphereGeometry
          args={[0.045, 12, 12]}
        />

        <meshBasicMaterial
          color="#e45a50"
          transparent
          opacity={0.16}
          blending={
            THREE.AdditiveBlending
          }
          depthWrite={false}
        />
      </mesh>

      {/* Editorial label */}
      <Html
        center
        distanceFactor={5.2}
        occlude
        style={{
          pointerEvents: "none",
          whiteSpace: "nowrap",
          transform:
            "translateY(-20px)",
        }}
      >
        <div
          className={`global-edition-marker-label${
            hovered
              ? " is-active"
              : ""
          }`}
        >
          <span>
            {project.number}
          </span>

          <strong>
            {project.location.label}
          </strong>
        </div>
      </Html>
    </group>
  );
}

/*
=====================================================
EARTH
=====================================================
*/

function Earth({
  projects,
  onOpen,
}) {
  const [
    earthTexture,
    normalTexture,
  ] = useTexture([
    EARTH_TEXTURE,
    EARTH_NORMAL,
  ]);

  useEffect(() => {
    earthTexture.colorSpace =
      THREE.SRGBColorSpace;

    earthTexture.anisotropy = 2;

    normalTexture.anisotropy = 2;
  }, [
    earthTexture,
    normalTexture,
  ]);

  /*
  Connect unique locations.
  This avoids drawing five identical arcs
  when multiple projects share Chandigarh.
  */
  const arcs = useMemo(() => {
    const unique = [];
    const seen = new Set();

    projects.forEach((project) => {
      const key =
        `${project.location.lat}:` +
        `${project.location.lng}`;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(project);
      }
    });

    return unique
      .slice(0, 4)
      .flatMap((project, index) => {
        const next =
          unique[index + 1];

        if (!next) {
          return [];
        }

        return [
          {
            id:
              `${project.id}-${next.id}`,

            points: createArc(
              project.location,
              next.location
            ),
          },
        ];
      });
  }, [projects]);

  return (
    <group>
      {/* Earth */}
      <mesh rotation={[0, -0.42, 0]}>
        <sphereGeometry
          args={[
            EARTH_RADIUS,
            64,
            48,
          ]}
        />

        <meshStandardMaterial
          map={earthTexture}
          normalMap={normalTexture}
          normalScale={
            new THREE.Vector2(
              0.42,
              0.42
            )
          }
          roughness={0.84}
          metalness={0.03}
        />
      </mesh>

      {/* Atmospheric shell */}
      <EarthAtmosphere />

      {/* Project connection arcs */}
      {arcs.map((arc) => (
        <Line
          key={arc.id}
          points={arc.points}
          color="#d26a62"
          transparent
          opacity={0.42}
          lineWidth={1}
        />
      ))}

      {/* Project markers */}
      {projects.map((project) => (
        <ProjectMarker
          key={project.id}
          project={project}
          onOpen={onOpen}
        />
      ))}
    </group>
  );
}

/*
=====================================================
GLOBE SCENE
=====================================================
*/

function GlobeScene({
  projects,
  onOpen,
  onInteractionStart,
  onInteractionEnd,
}) {
  return (
    <>
      <color
        attach="background"
        args={["#05070a"]}
      />

      {/* Lighting */}
      <ambientLight
        intensity={0.58}
      />

      <directionalLight
        position={[4, 3, 5]}
        intensity={2.3}
        color="#f5f0e7"
      />

      <pointLight
        position={[-4, -2, -4]}
        intensity={0.9}
        color="#456b95"
      />

      {/* Space */}
      <Stars
        radius={18}
        depth={18}
        count={650}
        factor={1.6}
        saturation={0}
        fade
        speed={0.16}
      />

      <Suspense fallback={null}>
        <Earth
          projects={projects}
          onOpen={onOpen}
        />
      </Suspense>

      {/* Camera interaction */}
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.055}

        minDistance={3.25}
        maxDistance={5.7}

        rotateSpeed={0.52}
        zoomSpeed={0.55}

        autoRotate
        autoRotateSpeed={0.34}

        minPolarAngle={
          Math.PI * 0.12
        }

        maxPolarAngle={
          Math.PI * 0.88
        }

        onStart={onInteractionStart}
        onEnd={onInteractionEnd}
      />
    </>
  );
}

/*
=====================================================
MAIN COMPONENT
=====================================================
*/

export default function GlobalEdition({
  projects,
  onOpen,
}) {
  const sectionRef =
    useRef(null);

  const resumeTimerRef =
    useRef(null);

  const [visible, setVisible] =
    useState(false);

  const [interacting, setInteracting] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState(null);

  /*
  -----------------------------------------------
  Only render the expensive WebGL scene when
  the section is near the viewport.
  -----------------------------------------------
  */

  useEffect(() => {
    const element =
      sectionRef.current;

    if (!element) {
      return undefined;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          setVisible(
            entry.isIntersecting
          );
        },
        {
          rootMargin:
            "300px 0px",
          threshold: 0.01,
        }
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
  -----------------------------------------------
  Cleanup interaction timer.
  -----------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(
          resumeTimerRef.current
        );
      }

      document.body.style.cursor =
        "";
    };
  }, []);

  /*
  -----------------------------------------------
  Project locations.
  Uses existing project objects.
  -----------------------------------------------
  */

  const globeProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.location &&
          Number.isFinite(
            project.location.lat
          ) &&
          Number.isFinite(
            project.location.lng
          )
      ),
    [projects]
  );

  const handleInteractionStart =
    () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(
          resumeTimerRef.current
        );
      }

      setInteracting(true);
    };

  const handleInteractionEnd =
    () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(
          resumeTimerRef.current
        );
      }

      /*
      Keep auto-rotation paused very
      briefly after release so the globe
      doesn't immediately "snap" back.
      */

      resumeTimerRef.current =
        window.setTimeout(() => {
          setInteracting(false);
        }, 900);
    };

  const handleProjectOpen =
    (project) => {
      setSelectedProject(project);

      onOpen(project);
    };

  return (
    <section
      ref={sectionRef}
      id="global-edition"
      className="global-edition reveal"
      aria-labelledby="global-edition-title"
    >
      <div className="global-edition-frame">
        {/* -----------------------------------------
            HEADER
        ----------------------------------------- */}

        <header className="global-edition-header">
          <div>
            <span className="global-edition-kicker">
              SPECIAL FEATURE / DIGITAL EDITION
            </span>

            <h2 id="global-edition-title">
              GLOBAL EDITION
            </h2>
          </div>

          <p>
            Projects, ideas &amp; digital
            work across the map.
          </p>
        </header>

        {/* -----------------------------------------
            GLOBE + CAPTION
        ----------------------------------------- */}

        <div className="global-edition-layout">
          <div className="global-edition-stage">
            <div className="global-edition-canvas">
              {visible ? (
                <Canvas
                  camera={{
                    position: [
                      0,
                      0,
                      4.55,
                    ],
                    fov: 38,
                  }}
                  dpr={[
                    1,
                    1.5,
                  ]}
                  gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference:
                      "high-performance",
                  }}
                  frameloop="always"
                  onCreated={({
                    gl,
                  }) => {
                    gl.outputColorSpace =
                      THREE.SRGBColorSpace;

                    gl.toneMapping =
                      THREE.ACESFilmicToneMapping;
                  }}
                >
                  <GlobeScene
                    projects={
                      globeProjects
                    }
                    onOpen={
                      handleProjectOpen
                    }
                    onInteractionStart={
                      handleInteractionStart
                    }
                    onInteractionEnd={
                      handleInteractionEnd
                    }
                  />
                </Canvas>
              ) : (
                <div className="global-edition-idle">
                  <span>
                    GLOBAL EDITION
                  </span>

                  <small>
                    ENTERING ORBIT…
                  </small>
                </div>
              )}

              {/* Interaction hints */}
              <div className="global-edition-controls">
                <span>
                  DRAG TO ROTATE
                </span>

                <span>
                  SCROLL / PINCH TO ZOOM
                </span>
              </div>

              {interacting && (
                <div className="global-edition-interacting">
                  MANUAL ORBIT
                </div>
              )}
            </div>
          </div>

          <aside className="global-edition-caption">
            <div className="global-edition-caption-top">
              <span>
                FIG. 06
              </span>

              <span>
                {globeProjects.length
                  .toString()
                  .padStart(2, "0")}{" "}
                SIGNALS
              </span>
            </div>

            <div>
              <p className="global-edition-caption-title">
                FROM CHANDIGARH TO THE
                DIGITAL WORLD
              </p>

              <p className="global-edition-caption-copy">
                A visual map of the
                places and ideas connected
                to the projects in this
                edition. Each signal marks
                a project in the portfolio.
                Select one to open its
                existing project story.
              </p>
            </div>

            <div className="global-edition-location">
              <span>
                ACTIVE SIGNAL
              </span>

              <strong>
                {selectedProject
                  ? selectedProject.title
                  : "PORTFOLIO / GLOBAL INDEX"}
              </strong>

              <small>
                {selectedProject?.location
                  ?.label ||
                  "CHANDIGARH · INDIA"}
              </small>
            </div>
          </aside>
        </div>

        {/* -----------------------------------------
            FOOTER
        ----------------------------------------- */}

        <footer className="global-edition-footer">
          <span>
            THE SAURABH TIMES /
            CARTOGRAPHY DESK
          </span>

          <span>
            INTERACTIVE DIGITAL FEATURE
          </span>

          <span>
            {globeProjects.length} PROJECT
            SIGNALS
          </span>
        </footer>
      </div>
    </section>
  );
}