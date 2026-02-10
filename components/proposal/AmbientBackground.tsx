"use client";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Purple orb - top right */}
      <div
        className="orb-1 absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(108,92,231,0.4) 0%, transparent 70%)",
        }}
      />
      {/* Pink orb - bottom left */}
      <div
        className="orb-2 absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(255,77,106,0.4) 0%, transparent 70%)",
        }}
      />
      {/* Green orb - center */}
      <div
        className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(0,184,148,0.3) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
