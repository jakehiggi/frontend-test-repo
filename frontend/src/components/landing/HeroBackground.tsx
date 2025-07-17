import { useEffect, useState } from "react";

export function HeroBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated grid background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * 0.01}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {/* Large background circles */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            top: '10%',
            left: '10%',
            transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
            filter: 'blur(40px)',
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '0s'
          }}
        />
        
        <div 
          className="absolute w-80 h-80 rounded-full opacity-10"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            top: '40%',
            right: '10%',
            transform: `translate(${mousePos.x * -0.015}px, ${mousePos.y * 0.015}px)`,
            filter: 'blur(35px)',
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />

        <div 
          className="absolute w-64 h-64 rounded-full opacity-15"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #10b981)',
            bottom: '20%',
            left: '30%',
            transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * -0.01}px)`,
            filter: 'blur(30px)',
            animation: 'float 10s ease-in-out infinite',
            animationDelay: '4s'
          }}
        />

        {/* Smaller accent shapes */}
        <div 
          className="absolute w-32 h-32 rounded-2xl opacity-20"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            top: '20%',
            right: '30%',
            transform: `rotate(45deg) translate(${mousePos.x * 0.03}px, ${mousePos.y * 0.03}px)`,
            filter: 'blur(20px)',
            animation: 'float 7s ease-in-out infinite',
            animationDelay: '1s'
          }}
        />

        <div 
          className="absolute w-24 h-24 rounded-xl opacity-25"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            bottom: '30%',
            right: '20%',
            transform: `rotate(-30deg) translate(${mousePos.x * -0.02}px, ${mousePos.y * 0.02}px)`,
            filter: 'blur(15px)',
            animation: 'float 5s ease-in-out infinite',
            animationDelay: '3s'
          }}
        />
      </div>

      {/* Subtle radial overlay */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 0.1}% ${mousePos.y * 0.1}%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
        }}
      />

      {/* Bottom gradient fade */}
    </div>
  );
}