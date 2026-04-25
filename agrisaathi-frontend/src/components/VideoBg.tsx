"use client";

export default function VideoBg() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background: "#000",
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          minWidth: "100%",
          minHeight: "100%",
          objectFit: "cover",
          transform: "translate(-50%, -50%)",
          filter: "brightness(0.9) contrast(1.1)",
        }}
      >
        <source src="/animation.mp4" type="video/mp4" />
      </video>

      {/* Light Cinematic Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: "radial-gradient(circle at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
