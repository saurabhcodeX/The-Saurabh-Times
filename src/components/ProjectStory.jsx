import { useEffect } from "react";

export default function ProjectStory({
  project,
  onClose,
}) {
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [project, onClose]);

  if (!project) return null;

  const isResearch = project.research;

  return (
    <div
      className="story-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
    >
      <div className="story-page">

        {/* HEADER */}
        <header className="story-header">
          <span className="story-brand">
            THE SAURABH TIMES
          </span>

          <span className="story-edition">
            {isResearch
              ? "RESEARCH EDITION"
              : "SPECIAL PROJECT EDITION"}
            {" · "}
            {project.year}
          </span>

          <button
            type="button"
            className="story-close"
            onClick={onClose}
          >
            CLOSE ×
          </button>
        </header>

        {/* META */}
        <div className="story-meta">
          <span>
            {isResearch
              ? "RESEARCH /"
              : "CASE STUDY /"}
            {" "}
            {project.number}
          </span>

          <span>{project.category}</span>

          <span>DIGITAL EDITION</span>
        </div>

        {/* HERO */}
        <section className="story-hero">

          <div className="story-hero-copy">
            <span className="story-kicker">
              {isResearch
                ? "RESEARCH REPORT"
                : "SELECTED WORK"}
            </span>

            <h1>
              {project.title}
            </h1>

            <p className="story-lead">
              {project.subtitle}
            </p>
          </div>

          <div className="story-hero-index">
            <span>FILE</span>
            <strong>
              {project.number}
            </strong>
            <small>
              {project.year}
            </small>
          </div>

        </section>

        {/* IMAGE */}
        <figure className="story-image">
          <img
            src={project.image}
            alt={`${project.title} project`}
            loading="lazy"
            decoding="async"
          />

          <figcaption>
            FIG. 01 —{" "}
            {isResearch
              ? "RESEARCH DOCUMENTATION"
              : "PROJECT DOCUMENTATION"}
          </figcaption>
        </figure>

        {/* OVERVIEW */}
        <section className="story-section">
          <div className="story-section-label">
            <span>01</span>
            <small>OVERVIEW</small>
          </div>

          <div className="story-section-body">
            <h2>
              {isResearch ? (
                <>
                  INVESTIGATING
                  <br />
                  <em>THE SIGNAL.</em>
                </>
              ) : (
                <>
                  BUILDING WITH
                  <br />
                  <em>INTENTION.</em>
                </>
              )}
            </h2>

            <p>
              {project.description}
            </p>

            {!isResearch && (
              <p>
                The project was developed with a
                strong focus on usability,
                responsive behaviour and visual
                clarity. Every part of the interface
                was considered to create a digital
                experience that feels purposeful
                rather than generic.
              </p>
            )}

            {isResearch && (
              <p>
                The research investigates deepfake
                detection by combining information
                from multiple modalities instead of
                relying on visual evidence alone.
              </p>
            )}
          </div>
        </section>

        {/* CHALLENGE */}
        <section className="story-section">
          <div className="story-section-label">
            <span>02</span>
            <small>
              {isResearch
                ? "RESEARCH PROBLEM"
                : "THE CHALLENGE"}
            </small>
          </div>

          <div className="story-section-body">
            <h2>
              {isResearch ? (
                <>
                  DETECTING
                  <br />
                  <em>WHAT LOOKS REAL.</em>
                </>
              ) : (
                <>
                  SOLVING THE
                  <br />
                  <em>RIGHT PROBLEM.</em>
                </>
              )}
            </h2>

            <p>
              {isResearch
                ? "The central challenge is identifying manipulated media reliably when visual and audio signals may each contain different evidence."
                : "The goal was to create an interface that communicates information clearly while remaining responsive and easy to navigate across different devices."}
            </p>

            {!isResearch && (
              <div className="story-objectives">
                <div>
                  <span>01</span>
                  <strong>SIMPLE.</strong>
                </div>

                <div>
                  <span>02</span>
                  <strong>USEFUL.</strong>
                </div>

                <div>
                  <span>03</span>
                  <strong>MEMORABLE.</strong>
                </div>
              </div>
            )}

            {isResearch && (
              <div className="story-objectives">
                <div>
                  <span>01</span>
                  <strong>VISUAL FEATURES</strong>
                </div>

                <div>
                  <span>02</span>
                  <strong>AUDIO FEATURES</strong>
                </div>

                <div>
                  <span>03</span>
                  <strong>CROSS-MODAL ANALYSIS</strong>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* APPROACH */}
        <section className="story-section">
          <div className="story-section-label">
            <span>03</span>
            <small>
              {isResearch
                ? "METHODOLOGY"
                : "THE APPROACH"}
            </small>
          </div>

          <div className="story-section-body">
            <h2>
              {isResearch ? (
                <>
                  MULTIPLE SIGNALS.
                  <br />
                  <em>ONE VERDICT.</em>
                </>
              ) : (
                <>
                  FROM IDEA
                  <br />
                  <em>TO INTERFACE.</em>
                </>
              )}
            </h2>

            <div className="story-approach">
              {isResearch ? (
                <>
                  <div className="story-approach-item">
                    <span>01</span>

                    <div>
                      <strong>
                        VISUAL ANALYSIS
                      </strong>

                      <p>
                        CNN-based visual features
                        are used to capture
                        spatial information from
                        media.
                      </p>
                    </div>
                  </div>

                  <div className="story-approach-item">
                    <span>02</span>

                    <div>
                      <strong>
                        AUDIO ANALYSIS
                      </strong>

                      <p>
                        MFCC and Transformer-based
                        audio features capture
                        information from the
                        speech signal.
                      </p>
                    </div>
                  </div>

                  <div className="story-approach-item">
                    <span>03</span>

                    <div>
                      <strong>
                        CROSS-MODAL ATTENTION
                      </strong>

                      <p>
                        Cross-modal attention
                        connects visual and audio
                        representations for a
                        combined decision.
                      </p>
                    </div>
                  </div>

                  <div className="story-approach-item">
                    <span>04</span>

                    <div>
                      <strong>
                        EXPLAINABLE AI
                      </strong>

                      <p>
                        XAI techniques help make
                        model decisions more
                        interpretable.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="story-approach-item">
                    <span>01</span>

                    <div>
                      <strong>
                        STRUCTURE
                      </strong>

                      <p>
                        Defined the content hierarchy
                        and overall information flow.
                      </p>
                    </div>
                  </div>

                  <div className="story-approach-item">
                    <span>02</span>

                    <div>
                      <strong>
                        DESIGN
                      </strong>

                      <p>
                        Created a visual system focused
                        on readability and consistency.
                      </p>
                    </div>
                  </div>

                  <div className="story-approach-item">
                    <span>03</span>

                    <div>
                      <strong>
                        DEVELOPMENT
                      </strong>

                      <p>
                        Translated the interface into
                        a responsive React experience.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* TECHNOLOGY */}
        <section className="story-section">
          <div className="story-section-label">
            <span>04</span>
            <small>
              {isResearch
                ? "RESEARCH STACK"
                : "TECHNOLOGY"}
            </small>
          </div>

          <div className="story-section-body">
            <h2>
              THE
              <br />
              <em>TOOLBOX.</em>
            </h2>

            <div className="story-tech">
              {project.tags.map(
                (tag, index) => (
                  <div
                    className="story-tech-item"
                    key={tag}
                  >
                    <span>
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <strong>{tag}</strong>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* RESULT */}
        <section className="story-section story-result">
          <div className="story-section-label">
            <span>05</span>
            <small>
              {isResearch
                ? "RESEARCH DIRECTION"
                : "THE RESULT"}
            </small>
          </div>

          <div className="story-section-body">
            <h2>
              {isResearch ? (
                <>
                  MAKING AI
                  <br />
                  <em>EXPLAINABLE.</em>
                </>
              ) : (
                <>
                  BUILT TO
                  <br />
                  <em>WORK.</em>
                </>
              )}
            </h2>

            <p>
              {isResearch
                ? "The proposed multimodal approach combines complementary visual and audio evidence while introducing explainability as an important part of the detection workflow."
                : "The final result is a responsive digital experience designed to work across different screen sizes while keeping the interface clear, useful and engaging."}
            </p>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="story-actions">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="story-action"
            >
              VIEW LIVE PROJECT ↗
            </a>
          )}

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="story-action"
            >
              VIEW SOURCE ↗
            </a>
          )}

          {!project.live &&
            !project.github && (
              <div className="story-research-note">
                IEEE RESEARCH ENTRY ·
                MULTIMODAL DEEPFAKE DETECTION
              </div>
            )}

          <button
            type="button"
            className="story-action"
            onClick={onClose}
          >
            ← BACK TO ARCHIVE
          </button>
        </div>

        {/* FOOTER */}
        <footer className="story-footer">
          <span>
            THE SAURABH TIMES
          </span>

          <span>
            {project.number} / 05
          </span>

          <span>
            DIGITAL EDITION · 2026
          </span>
        </footer>

      </div>
    </div>
  );
}