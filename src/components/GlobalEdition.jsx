import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  Html,
  Line,
  OrbitControls,
  Stars,
  useTexture,
} from "@react-three/drei";

import * as THREE from "three";


/* =====================================================
   CONFIG
===================================================== */

const EARTH_RADIUS = 1.55;

const EARTH_TEXTURE =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_atmos_2048.jpg";

const EARTH_NORMAL =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_normal_2048.jpg";

const EARTH_LIGHTS =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_lights_2048.png";

const EARTH_CLOUDS =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r186/examples/textures/planets/earth_clouds_1024.png";


/* =====================================================
   GEO HELPERS
===================================================== */

function latLngToVector3(
  lat,
  lng,
  radius = EARTH_RADIUS
) {
  const phi =
    (90 - lat) *
    (Math.PI / 180);

  const theta =
    (lng + 180) *
    (Math.PI / 180);

  return new THREE.Vector3(
    -(
      radius *
      Math.sin(phi) *
      Math.cos(theta)
    ),

    radius * Math.cos(phi),

    radius *
      Math.sin(phi) *
      Math.sin(theta)
  );
}


function createArc(
  start,
  end,
  radius = EARTH_RADIUS
) {
  const startPoint =
    latLngToVector3(
      start.lat,
      start.lng,
      radius + 0.025
    );

  const endPoint =
    latLngToVector3(
      end.lat,
      end.lng,
      radius + 0.025
    );

  const middle =
    startPoint
      .clone()
      .add(endPoint)
      .normalize()
      .multiplyScalar(
        radius + 0.42
      );

  const curve =
    new THREE.QuadraticBezierCurve3(
      startPoint,
      middle,
      endPoint
    );

  return curve.getPoints(48);
}


/* =====================================================
   ATMOSPHERE
===================================================== */

function Atmosphere() {
  return (
    <>
      <mesh scale={1.055}>
        <sphereGeometry
          args={[
            EARTH_RADIUS,
            64,
            48,
          ]}
        />

        <meshBasicMaterial
          color="#4d8dff"
          transparent
          opacity={0.085}
          side={THREE.BackSide}
          blending={
            THREE.AdditiveBlending
          }
          depthWrite={false}
        />
      </mesh>


      <mesh scale={1.085}>
        <sphereGeometry
          args={[
            EARTH_RADIUS,
            64,
            48,
          ]}
        />

        <meshBasicMaterial
          color="#7db7ff"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          blending={
            THREE.AdditiveBlending
          }
          depthWrite={false}
        />
      </mesh>
    </>
  );
}


/* =====================================================
   CLOUD LAYER
===================================================== */

function CloudLayer() {
  const clouds =
    useTexture(EARTH_CLOUDS);

  const cloudRef =
    useRef(null);

  useEffect(() => {
    clouds.colorSpace =
      THREE.SRGBColorSpace;
  }, [clouds]);


  useFrame((_, delta) => {
    if (!cloudRef.current) {
      return;
    }

    cloudRef.current.rotation.y +=
      delta * 0.006;
  });


  return (
    <mesh
      ref={cloudRef}
      scale={1.012}
    >
      <sphereGeometry
        args={[
          EARTH_RADIUS,
          64,
          48,
        ]}
      />

      <meshPhongMaterial
        map={clouds}
        transparent
        opacity={0.18}
        depthWrite={false}
        blending={
          THREE.AdditiveBlending
        }
      />
    </mesh>
  );
}


/* =====================================================
   EARTH SURFACE
===================================================== */

function EarthSurface() {
  const [
    dayTexture,
    normalTexture,
    lightsTexture,
  ] = useTexture([
    EARTH_TEXTURE,
    EARTH_NORMAL,
    EARTH_LIGHTS,
  ]);


  const normalScale =
    useMemo(
      () =>
        new THREE.Vector2(
          0.65,
          0.65
        ),
      []
    );


  const emissiveColor =
    useMemo(
      () =>
        new THREE.Color(
          "#ffb35c"
        ),
      []
    );


  useEffect(() => {
    dayTexture.colorSpace =
      THREE.SRGBColorSpace;

    lightsTexture.colorSpace =
      THREE.SRGBColorSpace;
  }, [
    dayTexture,
    lightsTexture,
  ]);


  return (
    <mesh>
      <sphereGeometry
        args={[
          EARTH_RADIUS,
          64,
          48,
        ]}
      />

      <meshStandardMaterial
        map={dayTexture}
        normalMap={normalTexture}
        normalScale={normalScale}
        roughness={0.92}
        metalness={0}
        emissive={emissiveColor}
        emissiveMap={lightsTexture}
        emissiveIntensity={0.85}
      />
    </mesh>
  );
}


/* =====================================================
   GLOBE HALO
===================================================== */

function GlobeHalo() {
  return (
    <mesh scale={1.18}>
      <sphereGeometry
        args={[
          EARTH_RADIUS,
          32,
          24,
        ]}
      />

      <meshBasicMaterial
        color="#173b75"
        transparent
        opacity={0.025}
        side={THREE.BackSide}
        blending={
          THREE.AdditiveBlending
        }
        depthWrite={false}
      />
    </mesh>
  );
}


/* =====================================================
   PROJECT MARKER
===================================================== */

function ProjectMarker({
  project,
  onOpen,
  active,
  onHover,
}) {
  const [hovered, setHovered] =
    useState(false);

  const groupRef =
    useRef(null);

  const pulseRef =
    useRef(null);


  const position = useMemo(() => {
    if (!project.location) {
      return [0, 0, 0];
    }

    return latLngToVector3(
      project.location.lat,
      project.location.lng,
      EARTH_RADIUS + 0.075
    ).toArray();
  }, [project.location]);


  useFrame((state) => {
    if (!pulseRef.current) {
      return;
    }

    const time =
      state.clock.elapsedTime;

    const pulse =
      1 +
      Math.sin(
        time * 3.1 +
          project.id.length
      ) *
        0.16;

    pulseRef.current.scale.setScalar(
      pulse
    );

    pulseRef.current.material.opacity =
      0.2 +
      (
        Math.sin(
          time * 3.1 +
            project.id.length
        ) +
        1
      ) *
        0.08;


    if (groupRef.current) {
      const target =
        hovered || active
          ? 1.22
          : 1;

      groupRef.current.scale.lerp(
        new THREE.Vector3(
          target,
          target,
          target
        ),
        0.14
      );
    }
  });


  if (!project.location) {
    return null;
  }


  const isActive =
    hovered || active;


  return (
    <group
      ref={groupRef}
      position={position}

      onPointerEnter={(event) => {
        event.stopPropagation();

        setHovered(true);

        onHover?.(project);

        document.body.style.cursor =
          "pointer";
      }}

      onPointerLeave={() => {
        setHovered(false);

        onHover?.(null);

        document.body.style.cursor =
          "";
      }}

      onClick={(event) => {
        event.stopPropagation();

        onOpen?.(project);
      }}
    >

      {/* =========================================
          OUTER PULSE
      ========================================= */}

      <mesh ref={pulseRef}>
        <sphereGeometry
          args={[
            0.075,
            16,
            16,
          ]}
        />

        <meshBasicMaterial
          color="#ff3b2f"
          transparent
          opacity={0.28}
          blending={
            THREE.AdditiveBlending
          }
          depthWrite={false}
        />
      </mesh>


      {/* =========================================
          CORE
      ========================================= */}

      <mesh>
        <sphereGeometry
          args={[
            isActive
              ? 0.055
              : 0.038,
            20,
            20,
          ]}
        />

        <meshBasicMaterial
          color={
            isActive
              ? "#ffffff"
              : "#ff3b2f"
          }
        />
      </mesh>


      {/* =========================================
          VERTICAL BEAM
      ========================================= */}

      <mesh
        position={[
          0,
          0.075,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.006,
            0.006,
            0.14,
            8,
          ]}
        />

        <meshBasicMaterial
          color="#ff4b40"
          transparent
          opacity={0.65}
        />
      </mesh>


      {/* =========================================
          LABEL
      ========================================= */}

      <Html
        distanceFactor={5.2}
        position={[
          0.075,
          0.11,
          0,
        ]}
        center={false}
        zIndexRange={[
          20,
          0,
        ]}
      >
        <div
          className={
            `global-edition-marker-label${
              isActive
                ? " is-active"
                : ""
            }`
          }
        >
          <span className="marker-index">
            {project.number}
          </span>

          <span className="marker-title">
            {project.title}
          </span>

          <span className="marker-location">
            {project.location.label}
          </span>
        </div>
      </Html>

    </group>
  );
}


/* =====================================================
   PROJECT ARCS
===================================================== */

function GlobeArcs({
  projects,
}) {
  const arcs = useMemo(() => {
    const locations =
      projects
        .filter(
          (project) =>
            project.location
        )
        .map(
          (project) =>
            project.location
        );


    const unique =
      locations.filter(
        (
          location,
          index,
          array
        ) =>
          index ===
          array.findIndex(
            (item) =>
              item.lat ===
                location.lat &&
              item.lng ===
                location.lng
          )
      );


    if (unique.length < 2) {
      return [];
    }


    const result = [];


    for (
      let i = 0;
      i < unique.length - 1;
      i += 1
    ) {
      result.push({
        key: `${i}-${i + 1}`,

        points: createArc(
          unique[i],
          unique[i + 1]
        ),
      });
    }


    if (unique.length > 2) {
      result.push({
        key: "closing-arc",

        points: createArc(
          unique[
            unique.length - 1
          ],
          unique[0]
        ),
      });
    }


    return result;
  }, [projects]);


  return (
    <>
      {arcs.map((arc) => (
        <Line
          key={arc.key}
          points={arc.points}
          color="#d84b42"
          transparent
          opacity={0.32}
          lineWidth={0.75}
        />
      ))}
    </>
  );
}


/* =====================================================
   EARTH
===================================================== */

function Earth({
  projects,
  onOpen,
  hoveredProject,
  setHoveredProject,
}) {
  return (
    <group>
      <EarthSurface />

      <CloudLayer />

      <GlobeHalo />

      <Atmosphere />

      <GlobeArcs
        projects={projects}
      />


      {projects.map(
        (project) => (
          <ProjectMarker
            key={project.id}
            project={project}
            onOpen={onOpen}
            active={
              hoveredProject?.id ===
              project.id
            }
            onHover={
              setHoveredProject
            }
          />
        )
      )}
    </group>
  );
}


/* =====================================================
   GLOBE SCENE
===================================================== */

function GlobeScene({
  projects,
  onOpen,
  interacting,
  onInteractionStart,
  onInteractionEnd,
  hoveredProject,
  setHoveredProject,
}) {
  return (
    <>
      {/* =========================================
          SPACE BACKGROUND
      ========================================= */}

      <color
        attach="background"
        args={["#05070b"]}
      />


      {/* =========================================
          LIGHTING
      ========================================= */}

      <ambientLight
        intensity={0.18}
      />


      <directionalLight
        position={[
          -4,
          2,
          5,
        ]}
        intensity={2.5}
        color="#ffffff"
      />


      <directionalLight
        position={[
          4,
          -1,
          -3,
        ]}
        intensity={0.45}
        color="#5b7fc4"
      />


      {/* =========================================
          STARS
      ========================================= */}

      <Stars
        radius={18}
        depth={12}
        count={850}
        factor={2.1}
        saturation={0}
        fade
        speed={0.18}
      />


      {/* =========================================
          EARTH
      ========================================= */}

      <Earth
        projects={projects}
        onOpen={onOpen}
        hoveredProject={
          hoveredProject
        }
        setHoveredProject={
          setHoveredProject
        }
      />


      {/* =========================================
          CONTROLS
      ========================================= */}

      <OrbitControls
        makeDefault

        enablePan={false}

        enableDamping

        dampingFactor={0.045}

        rotateSpeed={0.55}

        zoomSpeed={0.58}

        minDistance={3.2}

        maxDistance={5.8}

        minPolarAngle={
          Math.PI * 0.2
        }

        maxPolarAngle={
          Math.PI * 0.8
        }

        autoRotate={
          !interacting
        }

        autoRotateSpeed={0.42}

        onStart={
          onInteractionStart
        }

        onEnd={
          onInteractionEnd
        }

        touches={{
          ONE:
            THREE.TOUCH.ROTATE,

          TWO:
            THREE.TOUCH.DOLLY_PAN,
        }}
      />
    </>
  );
}


/* =====================================================
   MAIN GLOBAL EDITION
===================================================== */

export default function GlobalEdition({
  projects = [],
  onOpen,
}) {
  const sectionRef =
    useRef(null);

  const resumeTimer =
    useRef(null);


  const [
    visible,
    setVisible,
  ] = useState(false);


  const [
    interacting,
    setInteracting,
  ] = useState(false);


  const [
    hoveredProject,
    setHoveredProject,
  ] = useState(null);


  /* ================================================
     ONLY RENDER THREE.JS WHEN NEAR VIEWPORT
  ================================================ */

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
          rootMargin: "300px",
          threshold: 0.05,
        }
      );


    observer.observe(element);


    return () => {
      observer.disconnect();
    };
  }, []);


  /* ================================================
     CLEANUP
  ================================================ */

  useEffect(() => {
    return () => {
      document.body.style.cursor =
        "";

      if (resumeTimer.current) {
        window.clearTimeout(
          resumeTimer.current
        );
      }
    };
  }, []);


  /* ================================================
     MANUAL INTERACTION START
  ================================================ */

  const handleInteractionStart =
    () => {
      if (resumeTimer.current) {
        window.clearTimeout(
          resumeTimer.current
        );
      }

      setInteracting(true);
    };


  /* ================================================
     MANUAL INTERACTION END
  ================================================ */

  const handleInteractionEnd =
    () => {
      if (resumeTimer.current) {
        window.clearTimeout(
          resumeTimer.current
        );
      }


      resumeTimer.current =
        window.setTimeout(() => {
          setInteracting(false);
        }, 650);
    };


  /* ================================================
     PROJECTS WITH LOCATIONS
  ================================================ */

  const locatedProjects =
    useMemo(
      () =>
        projects.filter(
          (project) =>
            project.location
        ),
      [projects]
    );


  return (
    <section
      ref={sectionRef}
      id="global-edition"
      className="global-edition"
    >

      <div className="global-edition-frame">

        {/* ======================================
            HEADER
        ====================================== */}

        <header className="global-edition-header">

          <div>

            <p className="global-edition-kicker">
              02 / GLOBAL EDITION
            </p>


            <h2>
              Projects, ideas & digital work
              <span>
                {" "}
                across the map.
              </span>
            </h2>

          </div>


          <div className="global-edition-status">

            <span className="global-status-dot" />

            LIVE / DIGITAL ATLAS

          </div>

        </header>


        {/* ======================================
            MAIN LAYOUT
        ====================================== */}

        <div className="global-edition-layout">

          {/* ====================================
              GLOBE
          ==================================== */}

          <div className="global-edition-stage">

            <div className="global-edition-stage-top">

              <span>
                EARTH / 001
              </span>

              <span>
                {
                  interacting
                    ? "MANUAL CONTROL"
                    : "AUTO ROTATION"
                }
              </span>

            </div>


            {visible ? (
              <Canvas
                className="global-edition-canvas"

                camera={{
                  position: [
                    0,
                    0.15,
                    4.45,
                  ],

                  fov: 38,
                }}

                dpr={[1, 1.5]}

                gl={{
                  antialias: true,
                  alpha: false,
                  powerPreference:
                    "high-performance",
                }}

                onPointerMissed={() =>
                  setHoveredProject(
                    null
                  )
                }
              >

                <Suspense fallback={null}>

                  <GlobeScene
                    projects={
                      locatedProjects
                    }

                    onOpen={onOpen}

                    interacting={
                      interacting
                    }

                    onInteractionStart={
                      handleInteractionStart
                    }

                    onInteractionEnd={
                      handleInteractionEnd
                    }

                    hoveredProject={
                      hoveredProject
                    }

                    setHoveredProject={
                      setHoveredProject
                    }
                  />

                </Suspense>

              </Canvas>
            ) : (
              <div className="global-edition-placeholder">

                <span>
                  LOADING ATLAS
                </span>

              </div>
            )}


            <div className="global-edition-controls">

              <span>
                DRAG TO ROTATE
              </span>

              <span>
                SCROLL TO ZOOM
              </span>

              <span>
                CLICK A MARKER
              </span>

            </div>

          </div>


          {/* ====================================
              CAPTION / PROJECT INDEX
          ==================================== */}

          <aside className="global-edition-caption">

            <div className="global-edition-caption-top">

              <span>
                FIELD NOTES
              </span>

              <span>
                2026
              </span>

            </div>


            <div className="global-edition-caption-main">

              <p className="global-edition-location">
                ORIGIN POINT
              </p>


              <h3>
                FROM
                <br />
                CHANDIGARH
                <br />
                TO THE
                <br />
                DIGITAL WORLD.
              </h3>


              <p className="global-edition-caption-copy">
                A visual map of selected
                work, experiments and
                ideas — connected by one
                digital workspace and built
                from Chandigarh.
              </p>

            </div>


            <div className="global-edition-project-list">

              {locatedProjects.map(
                (project) => (
                  <button
                    key={project.id}
                    type="button"

                    className={
                      hoveredProject?.id ===
                      project.id
                        ? "is-active"
                        : ""
                    }

                    onMouseEnter={() =>
                      setHoveredProject(
                        project
                      )
                    }

                    onMouseLeave={() =>
                      setHoveredProject(
                        null
                      )
                    }

                    onFocus={() =>
                      setHoveredProject(
                        project
                      )
                    }

                    onBlur={() =>
                      setHoveredProject(
                        null
                      )
                    }

                    onClick={() =>
                      onOpen?.(project)
                    }
                  >

                    <span>
                      {project.number}
                    </span>

                    <strong>
                      {project.title}
                    </strong>

                    <small>
                      {
                        project
                          .location
                          .label
                      }
                    </small>

                  </button>
                )
              )}

            </div>


            <div className="global-edition-footer">

              <span>
                EXPLORE THE WORK
              </span>

              <span>
                →
              </span>

            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}