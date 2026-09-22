import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  LazyMotion,
  domAnimation,
  m,
} from "framer-motion";

import CustomCursor from "./components/CustomCursor";
import ProjectStory from "./components/ProjectStory";

import portraitImg from "./assets/portrait.jpg";

import { projects } from "./data/projects";

import "./index.css";

const GlobalEdition = lazy(
  () => import("./components/GlobalEdition")
);

/* =====================================================
   HEADER
===================================================== */

function Header({ onPrint }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMenuOpen(false);
  }, []);

  return (
    <header className="site-header">

      <div className="masthead">

        <button
          type="button"
          className="masthead-small masthead-button"
          onClick={() => scrollToSection("about")}
        >
          EST. 2026
        </button>

        <button
          type="button"
          className="masthead-title masthead-button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          THE SAURABH TIMES
        </button>

        <button
          type="button"
          className="masthead-small masthead-button"
          onClick={() => scrollToSection("contact")}
        >
          DIGITAL EDITION
        </button>

      </div>

      <div className="header-meta">

        <span>
          VOL. 01
        </span>

        <button
          type="button"
          onClick={() => scrollToSection("work")}
        >
          PORTFOLIO / CREATIVE DEVELOPMENT
        </button>

        <span>
          INDIA
        </span>

        <button
          type="button"
          className="print-button"
          onClick={onPrint}
        >
          🖨 PRINT EDITION
        </button>

      </div>

      <div className="mobile-menu-row">

        <button
          type="button"
          className={`mobile-menu-button${
            menuOpen ? " active" : ""
          }`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            menuOpen
              ? "Close navigation"
              : "Open navigation"
          }
        >
          <span />
          <span />
        </button>

      </div>

      {menuOpen && (
        <nav
          className="mobile-nav"
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          <button
            type="button"
            onClick={() => scrollToSection("work")}
          >
            01 / SELECTED WORK
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("about")}
          >
            02 / ABOUT
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("archive")}
          >
            03 / ARCHIVE
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("contact")}
          >
            04 / CONTACT
          </button>

          <button
            type="button"
            onClick={onPrint}
          >
            05 / PRINT EDITION
          </button>
        </nav>
      )}

    </header>
  );
}

/* =====================================================
   HERO
===================================================== */

function Hero() {
  return (
    <section className="hero reveal">

      <div className="hero-topline">

        <span>
          FRONT PAGE
        </span>

        <span>
          SELECTED WORK · 2026
        </span>

      </div>

      <div className="hero-grid">

        <div className="hero-main">

          <p className="eyebrow">
            CREATIVE DEVELOPER / DESIGNER
          </p>

          <h1>
            DIGITAL
            <br />
            STORIES
            <br />
            <em>BUILT</em>
          </h1>

          <p className="hero-description">
            I design and build digital experiences
            where technology meets visual
            storytelling.
          </p>

        </div>

        <div className="hero-side">

          <div className="portrait-frame">

            <img
              src={portraitImg}
              alt="Saurabh — developer"
              loading="eager"
              decoding="async"
            />

          </div>

          <div className="portrait-caption">

            <span>
              FIG. 01
            </span>

            <span>
              SAURABH / DEVELOPER
            </span>

          </div>

        </div>

      </div>

      <div className="hero-bottom">

        <span>
          REACT · JAVASCRIPT · UI / UX
        </span>

        <span>
          SCROLL TO EXPLORE ↓
        </span>

      </div>

    </section>
  );
}

/* =====================================================
   TICKER
===================================================== */

function Ticker() {
  return (
    <div
      className="ticker"
      aria-label="Portfolio availability"
    >

      <div className="ticker-track">

        <span>
          AVAILABLE FOR OPPORTUNITIES
        </span>

        <span>✦</span>

        <span>
          WEB DEVELOPMENT
        </span>

        <span>✦</span>

        <span>
          CREATIVE TECHNOLOGY
        </span>

        <span>✦</span>

        <span>
          AVAILABLE FOR OPPORTUNITIES
        </span>

        <span>✦</span>

      </div>

    </div>
  );
}

/* =====================================================
   PROJECT CARD
===================================================== */

function ProjectCard({
  project,
  onOpen,
}) {
  const handleOpen = useCallback(() => {
    onOpen(project);
  }, [onOpen, project]);

  return (
    <m.article
      className="editorial-project"
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          handleOpen();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${project.title}`}
      whileHover={{
        y: -4,
        rotate: 1.2,
        scale: 1.015,
      }}
      whileTap={{
        scale: 0.995,
      }}
      transition={{
        duration: 0.18,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        transformOrigin: "center center",
      }}
    >

      <div className="editorial-project-number">
        {project.number}
      </div>

      <div className="editorial-project-main">

        <div className="editorial-project-meta">

          <span>
            {project.category}
          </span>

          <span>
            {project.year}
          </span>

        </div>

        <h3>
          {project.title}
        </h3>

        <p>
          {project.headline ||
            project.subtitle}
        </p>

        <div className="editorial-project-tech">

          {project.tags
            ?.slice(0, 4)
            .map((tag) => (
              <span key={tag}>
                {tag}
              </span>
            ))}

        </div>

      </div>

      <div className="editorial-project-image">

        <img
          src={project.image}
          alt=""
          loading="lazy"
          decoding="async"
        />

        <div className="editorial-image-overlay">

          <span>
            OPEN STORY
          </span>

          <span>
            ↗
          </span>

        </div>

      </div>

      <div
        className="editorial-project-arrow"
        aria-hidden="true"
      >
        ↗
      </div>

    </m.article>
  );
}

/* =====================================================
   SELECTED WORK
===================================================== */

function FeaturedWork({ onOpen }) {
  return (
    <section
      className="section featured reveal"
      id="work"
    >

      <div className="section-heading">

        <div>

          <span className="section-number">
            01
          </span>

          <h2>
            SELECTED WORK
          </h2>

        </div>

        <p>
          A selection of digital products,
          interfaces, experiments and research.
        </p>

      </div>

      <div className="editorial-projects">

        {projects.map((project) => (
          <ProjectCard
            key={project.id || project.number}
            project={project}
            onOpen={onOpen}
          />
        ))}

      </div>

    </section>
  );
}

/* =====================================================
   ABOUT
===================================================== */

function About() {
  return (
    <section
      className="section about reveal"
      id="about"
    >

      <div className="section-heading">

        <div>

          <span className="section-number">
            02
          </span>

          <h2>
            ABOUT
          </h2>

        </div>

      </div>

      <div className="about-grid">

        <div className="about-title">

          <h2>
            CODE IS
            <br />
            <em>MY MEDIUM.</em>
          </h2>

        </div>

        <div className="about-copy">

          <p>
            I am a developer interested in
            building digital experiences that
            are functional, responsive and
            visually distinctive.
          </p>

          <p>
            My work combines frontend
            development, interface design and
            experimentation with modern web
            technologies.
          </p>

          <p>
            I enjoy turning ideas into interfaces
            that feel intentional rather than
            generic.
          </p>

        </div>

      </div>

    </section>
  );
}

/* =====================================================
   SKILLS
===================================================== */

function Skills() {
  const skills = [
    "React",
    "JavaScript",
    "HTML",
    "CSS",
    "Vite",
    "Git",
    "GitHub",
    "Responsive Design",
    "UI / UX",
    "REST APIs",
  ];

  return (
    <section className="section skills reveal">

      <div className="section-heading">

        <div>

          <span className="section-number">
            03
          </span>

          <h2>
            TOOLBOX
          </h2>

        </div>

      </div>

      <div className="skills-grid">

        {skills.map((skill, index) => (
          <div
            className="skill-item"
            key={skill}
          >

            <span>
              {String(index + 1).padStart(
                2,
                "0"
              )}
            </span>

            <strong>
              {skill}
            </strong>

          </div>
        ))}

      </div>

    </section>
  );
}

/* =====================================================
   ARCHIVE
   Uses the SAME projects array.
   No duplicate project data.
===================================================== */

function Archive({ onOpen }) {
  return (
    <section
      className="section archive reveal"
      id="archive"
    >

      <div className="section-heading">

        <div>

          <span className="section-number">
            04
          </span>

          <h2>
            ARCHIVE
          </h2>

        </div>

        <p>
          The complete project and research
          index.
        </p>

      </div>

      <div className="archive-table">

        <div className="archive-header">

          <span>
            NO.
          </span>

          <span>
            PROJECT
          </span>

          <span>
            TYPE
          </span>

          <span>
            YEAR
          </span>

        </div>

        {projects.map((project) => (

          <button
            type="button"
            className="archive-row"
            key={project.id || project.number}
            onClick={() => onOpen(project)}
            aria-label={`Open ${project.title}`}
          >

            <span>
              {project.number}
            </span>

            <strong>
              {project.title}
            </strong>

            <span>
              {project.category}
            </span>

            <span>
              {project.year}
            </span>

          </button>

        ))}

      </div>

    </section>
  );
}

/* =====================================================
   CLASSIFIEDS
===================================================== */

function Classifieds() {
  const listings = [
    {
      number: "01",
      label: "WANTED",
      text: "Bugs to fix. Coffee accepted as payment.",
    },
    {
      number: "02",
      label: "AVAILABLE",
      text: "Frontend developer with an unhealthy interest in clean interfaces.",
    },
    {
      number: "03",
      label: "SEEKING",
      text: "Interesting problems, ambitious products and better ways to build.",
    },
    {
      number: "04",
      label: "NOTICE",
      text: "Will turn confusing requirements into interfaces people actually understand.",
    },
  ];

  return (
    <section
      className="section classifieds reveal"
      id="classifieds"
    >

      <div className="section-heading">

        <div>

          <span className="section-number">
            05
          </span>

          <h2>
            CLASSIFIEDS
          </h2>

        </div>

        <p>
          Small ads · Big ideas.
        </p>

      </div>

      <div className="classifieds-grid">

        {listings.map((listing) => (
          <article
            className="classified-item"
            key={listing.number}
          >

            <div className="classified-number">
              {listing.number}
            </div>

            <div className="classified-content">

              <span>
                {listing.label}
              </span>

              <p>
                {listing.text}
              </p>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}

/* =====================================================
   CONTACT
===================================================== */

function Contact() {
  return (
    <section
      className="section contact reveal"
      id="contact"
    >

      <div className="contact-label">
        06 / CONTACT
      </div>

      <div className="contact-header">

        <div>

          <span className="contact-kicker">
            GET IN TOUCH
          </span>

          <h2>
            LET'S BUILD
            <br />
            SOMETHING
            <br />
            <em>INTERESTING.</em>
          </h2>

        </div>

        <div className="contact-note">

          <span>
            OPEN FOR
          </span>

          <strong>
            DEVELOPMENT
            <br />
            OPPORTUNITIES
          </strong>

          <small>
            Based in India · Available remotely
          </small>

        </div>

      </div>

      <div className="contact-intro">

        <p>
          Have an idea, project or opportunity?
          I'd be happy to hear from you.
        </p>

        <a
          href="mailto:saurabhpandey1344@gmail.com"
          className="contact-email"
        >
          saurabhpandey1344@gmail.com

          <span>
            ↗
          </span>

        </a>

      </div>

      <div className="contact-links">

        <a
          href="mailto:saurabhpandey1344@gmail.com"
          className="contact-link"
        >

          <span className="contact-link-number">
            01
          </span>

          <span className="contact-link-name">
            EMAIL
          </span>

          <span className="contact-link-arrow">
            ↗
          </span>

        </a>

        <a
          href="https://github.com/saurabhcodeX"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
        >

          <span className="contact-link-number">
            02
          </span>

          <span className="contact-link-name">
            GITHUB
          </span>

          <span className="contact-link-arrow">
            ↗
          </span>

        </a>

        <a
          href="https://www.linkedin.com/in/saurabh-kumar-pandey-234324321/"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
        >

          <span className="contact-link-number">
            03
          </span>

          <span className="contact-link-name">
            LINKEDIN
          </span>

          <span className="contact-link-arrow">
            ↗
          </span>

        </a>

        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
        >

          <span className="contact-link-number">
            04
          </span>

          <span className="contact-link-name">
            RESUME
          </span>

          <span className="contact-link-arrow">
            ↗
          </span>

        </a>

      </div>

    </section>
  );
}

/* =====================================================
   FOOTER
===================================================== */

function Footer({ onPrint }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">

      <div className="footer-main">

        <strong>
          THE SAURABH TIMES
        </strong>

        <span>
          DIGITAL EDITION
        </span>

        <span>
          © {year}
        </span>

      </div>

      <div className="footer-bottom">

        <span>
          DESIGNED + DEVELOPED BY SAURABH
        </span>

        <button
          type="button"
          onClick={onPrint}
        >
          🖨 PRINT EDITION
        </button>

        <span>
          END OF EDITION
        </span>

      </div>

    </footer>
  );
}

/* =====================================================
   APP
===================================================== */

export default function App() {

  const [
    activeProject,
    setActiveProject,
  ] = useState(null);

  /* -----------------------------------------------
     Open project
  ------------------------------------------------ */

  const openProject = useCallback(
    (project) => {
      setActiveProject(project);
    },
    []
  );

  /* -----------------------------------------------
     Close project
  ------------------------------------------------ */

  const closeProject = useCallback(() => {
    setActiveProject(null);
  }, []);

  /* -----------------------------------------------
     Native print

     The actual newspaper transformation is handled
     by @media print in index.css.
  ------------------------------------------------ */

  const handlePrint = useCallback(() => {

    if (activeProject) {
      setActiveProject(null);
    }

    requestAnimationFrame(() => {
      window.print();
    });

  }, [activeProject]);

  /* -----------------------------------------------
     Lock background scrolling while story is open
  ------------------------------------------------ */

  useEffect(() => {

    if (!activeProject) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };

  }, [activeProject]);

  /* -----------------------------------------------
     Keep Escape handling at application level
  ------------------------------------------------ */

  useEffect(() => {

    if (!activeProject) return;

    const handleKeyDown = (event) => {

      if (event.key === "Escape") {
        closeProject();
      }

    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, [
    activeProject,
    closeProject,
  ]);

  return (
    <LazyMotion features={domAnimation}>

      <CustomCursor />

      <Header
        onPrint={handlePrint}
      />

      <main>

        <Hero />

        <Ticker />

        {/* =========================================
            MINI GLOBAL EDITION

            Small boxed 3D globe.
            No large loading screen.
        ========================================= */}

        <Suspense fallback={null}>
          <GlobalEdition />
        </Suspense>

        <FeaturedWork
          onOpen={openProject}
        />

        <About />

        <Skills />

        <Archive
          onOpen={openProject}
        />

        <Classifieds />

        <Contact />

      </main>

      <Footer
        onPrint={handlePrint}
      />

      {/* -------------------------------------------
          Only the selected project gets rendered.
          No story DOM exists when nothing is open.
      -------------------------------------------- */}

      {activeProject && (
        <ProjectStory
          project={activeProject}
          onClose={closeProject}
        />
      )}

    </LazyMotion>
  );
}