import { useState, useRef } from 'react';

export default function GlowCard({ children, className = '' }) {
  const [glowStyle, setGlowStyle] = useState({});
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlowStyle({
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(47,129,247,0.07), transparent 60%)`,
    });
  };

  const handleMouseLeave = () => {
    setGlowStyle({});
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={glowStyle}
    >
      {children}
    </div>
  );
}
