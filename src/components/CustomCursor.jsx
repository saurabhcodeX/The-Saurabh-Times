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

    window.addEventListener("mousemove", move);

    const interactiveElements =
      document.querySelectorAll(
        "a, button, .project-row, .archive-row"
      );

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", handleEnter);
      element.addEventListener("mouseleave", handleLeave);
    });

    animate();

    return () => {
      window.removeEventListener("mousemove", move);

      interactiveElements.forEach((element) => {
        element.removeEventListener(
          "mouseenter",
          handleEnter
        );

        element.removeEventListener(
          "mouseleave",
          handleLeave
        );
      });
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