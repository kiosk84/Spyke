import React, { useRef, useEffect } from 'react';

// Hardcoded brand color from tailwind config
const accentColor = '#00BFFF'; // brand-cyan

// Helper to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentRgb = hexToRgb(accentColor);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !accentRgb) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[];

    const initialize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const numberOfParticles = (canvas.height * canvas.width) / 11000;

      for (let i = 0; i < numberOfParticles; i++) {
        const radius = Math.random() * 1.5 + 1;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const dx = (Math.random() - 0.5) * 0.4;
        const dy = (Math.random() - 0.5) * 0.4;
        
        particles.push({ x, y, dx, dy, radius, color: accentColor });
      }
    };

    const connect = () => {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const distance = Math.sqrt(
                    (particles[a].x - particles[b].x) * (particles[a].x - particles[b].x) +
                    (particles[a].y - particles[b].y) * (particles[a].y - particles[b].y)
                );
                
                const connectionDistance = 120;
                if (distance < connectionDistance) {
                    opacityValue = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    };

    const drawParticle = (particle: Particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = particle.color;
      ctx.fill();
    };
    
    const update = () => {
        for (const particle of particles) {
            if (particle.x + particle.radius > canvas.width || particle.x - particle.radius < 0) {
                particle.dx = -particle.dx;
            }
            if (particle.y + particle.radius > canvas.height || particle.y - particle.radius < 0) {
                particle.dy = -particle.dy;
            }

            particle.x += particle.dx;
            particle.y += particle.dy;

            drawParticle(particle);
        }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      update();
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    initialize();
    animate();

    const handleResize = () => {
      cancelAnimationFrame(animationFrameId);
      initialize();
      animate();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [accentRgb]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default ParticleBackground;