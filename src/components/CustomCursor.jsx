import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mouse = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const ring = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const animate = () => {
      ring.current.x +=
        (mouse.current.x - ring.current.x) * 0.12;

      ring.current.y +=
        (mouse.current.y - ring.current.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    const handleEnter = () => {
      ringRef.current?.classList.add("cursor-hover");
      dotRef.current?.classList.add("cursor-hover-dot");
    };

    const handleLeave = () => {
      ringRef.current?.classList.remove("cursor-hover");
      dotRef.current?.classList.remove("cursor-hover-dot");
    };

    // Delegated listeners on `document` instead of a one-time
    // querySelectorAll snapshot. The old version only found
    // elements that existed at mount, so buttons inside the
    // project-story modal (opened later) and the lazy-loaded
    // globe never got the hover cursor effect.
    const interactiveSelector =
      "a, button, .project-row, .archive-row";

    const handlePointerOver = (e) => {
      if (e.target.closest(interactiveSelector)) {
        handleEnter();
      }
    };

    const handlePointerOut = (e) => {
      if (e.target.closest(interactiveSelector)) {
        handleLeave();
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    animate();

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener(
        "pointerover",
        handlePointerOver
      );
      document.removeEventListener(
        "pointerout",
        handlePointerOut
      );
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="cursor-ring"
      />

      <div
        ref={dotRef}
        className="cursor-dot"
      />
    </>
  );
}