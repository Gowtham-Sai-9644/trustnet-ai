import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface ThreatPulse {
  x: number;
  y: number;
  currentRadius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface ScanLine {
  y: number;
  speed: number;
  alpha: number;
}

export const CinematicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let pulses: ThreatPulse[] = [];
    let scanLines: ScanLine[] = [];
    
    // Performance Scaling based on hardware concurrency
    const concurrency = navigator.hardwareConcurrency || 4;
    let particleCount = 35;
    if (concurrency < 4) {
      particleCount = 20;
    } else if (concurrency >= 8) {
      particleCount = 50;
    }

    const connectionDistance = 110;
    let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const init = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 1.2 + 0.6
        });
      }
      pulses = [];
      scanLines = [];
    };

    let lastPulseTime = 0;
    let lastScanTime = 0;

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw grid overlay
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSpacing = 50;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Spawn Threat Pulses (Every 3-4 seconds at random particle or coordinate)
      if (timestamp - lastPulseTime > 3500) {
        lastPulseTime = timestamp;
        const targetX = Math.random() * width;
        const targetY = Math.random() * height;
        const isCritical = Math.random() > 0.6; // 40% chance of threat/critical pulse
        pulses.push({
          x: targetX,
          y: targetY,
          currentRadius: 0,
          maxRadius: Math.random() * 120 + 80,
          alpha: 1,
          color: isCritical ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 229, 255, 0.3)'
        });
      }

      // 3. Spawn Grid scan lines occasionally (Every 7 seconds)
      if (timestamp - lastScanTime > 7000) {
        lastScanTime = timestamp;
        scanLines.push({
          y: 0,
          speed: Math.random() * 1.5 + 1.0,
          alpha: 0.25
        });
      }

      // 4. Draw Threat Pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.currentRadius += 1.2;
        p.alpha = 1 - p.currentRadius / p.maxRadius;
        
        if (p.alpha <= 0) {
          pulses.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = p.color.replace('0.4', String(p.alpha * 0.4)).replace('0.3', String(p.alpha * 0.3));
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.currentRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 5. Draw Scan Lines
      for (let i = scanLines.length - 1; i >= 0; i--) {
        const sl = scanLines[i];
        sl.y += sl.speed;
        if (sl.y > height) {
          scanLines.splice(i, 1);
          continue;
        }
        
        const gradient = ctx.createLinearGradient(0, sl.y - 10, 0, sl.y + 10);
        gradient.addColorStop(0, 'rgba(0, 229, 255, 0)');
        gradient.addColorStop(0.5, `rgba(0, 229, 255, ${sl.alpha * 0.15})`);
        gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, sl.y - 10, width, 20);
      }

      // 6. Draw particles and network connections
      ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce boundaries
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();

        // Node connections (optimized nested loop)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          // Fast bounding box distance check first
          if (Math.abs(dx) < connectionDistance && Math.abs(dy) < connectionDistance) {
            const dist = Math.hypot(dx, dy);
            if (dist < connectionDistance) {
              const alpha = (1 - dist / connectionDistance) * 0.08;
              ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    init();
    animationId = requestAnimationFrame(draw);

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" 
    />
  );
};

export default CinematicBackground;
