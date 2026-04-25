"use client";

export default function ConsoleVideoBg() {
  return (
    <div className="video-bg-wrapper">
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{ opacity: 1, filter: 'none' }}
      >
        <source src="/VIDEO2.mp4" type="video/mp4" />
      </video>
      <div className="video-bg-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
    </div>
  );
}
