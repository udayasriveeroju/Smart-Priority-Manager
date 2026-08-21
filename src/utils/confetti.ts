import confetti from 'canvas-confetti';

export function fireTaskConfetti(originElement?: HTMLElement | null) {
  let origin = { x: 0.5, y: 0.6 };

  if (originElement) {
    const rect = originElement.getBoundingClientRect();
    origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };
  }

  // Multi-stage celebratory confetti
  confetti({
    particleCount: 45,
    spread: 60,
    origin,
    colors: ['#FF3366', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'],
    ticks: 200,
    gravity: 1.1,
    scalar: 0.9,
    shapes: ['circle', 'square'],
  });

  setTimeout(() => {
    confetti({
      particleCount: 25,
      angle: 60,
      spread: 55,
      origin: { x: Math.max(0.1, origin.x - 0.1), y: origin.y },
      colors: ['#F59E0B', '#10B981', '#38BDF8'],
    });
  }, 120);
}
