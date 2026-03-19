'use client';

import { useEffect, useRef } from 'react';

export const LivingGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const gridSize = 40;

    const cells: { x: number; y: number; life: number; color: string }[] = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const colors = ['#6D28D9', '#A855F7', '#00FF94', '#1F1F1F'];
    let animationFrameId = 0;
    let isDisposed = false;

    const animate = () => {
      if (isDisposed) return;
      ctx.clearRect(0, 0, width, height);

      // Subtle full-page grid (keeps the page visually divided)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
        ctx.stroke();
      }

      // Add new active cell randomly
      if (Math.random() > 0.92) {
        const cols = Math.ceil(width / gridSize);
        const rows = Math.ceil(height / gridSize);
        cells.push({
          x: Math.floor(Math.random() * cols) * gridSize,
          y: Math.floor(Math.random() * rows) * gridSize,
          life: 1.0,
          color: colors[Math.floor(Math.random() * colors.length)] ?? '#6D28D9',
        });
      }

      // Update and draw cells
      for (let i = cells.length - 1; i >= 0; i--) {
        const cell = cells[i];
        if (!cell) continue;
        ctx.fillStyle = cell.color;
        ctx.globalAlpha = cell.life * 0.2;
        ctx.fillRect(cell.x, cell.y, gridSize, gridSize);

        // Cell outline to show the grid only where boxes are active
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cell.x + 0.5, cell.y + 0.5, gridSize - 1, gridSize - 1);

        // Pixel accent
        if (cell.life > 0.8) {
          ctx.fillStyle = '#fff';
          ctx.globalAlpha = cell.life * 0.5;
          ctx.fillRect(cell.x + 2, cell.y + 2, 4, 4);
        }

        cell.life -= 0.01;
        if (cell.life <= 0) cells.splice(i, 1);
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      isDisposed = true;
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-60" />;
};
