(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  let animationFrame = 0;
  let currentY = window.scrollY;
  let targetY = currentY;
  let previousTime = 0;

  const getMaxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const clamp = value => Math.min(getMaxScroll(), Math.max(0, value));

  const stop = () => {
    if (!animationFrame) return;
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    previousTime = 0;
  };

  const animate = time => {
    const elapsed = previousTime ? Math.min(32, Math.max(1, time - previousTime)) : 16;
    previousTime = time;
    const progress = 1 - Math.exp(-elapsed / 82);

    currentY += (targetY - currentY) * progress;
    if (Math.abs(targetY - currentY) < 0.35) {
      currentY = targetY;
      targetY = currentY;
    }

    window.scrollTo({ top: currentY, left: 0, behavior: 'instant' });
    currentY = window.scrollY;

    if (currentY === targetY) {
      animationFrame = 0;
      previousTime = 0;
      return;
    }

    animationFrame = requestAnimationFrame(animate);
  };

  const start = () => {
    if (animationFrame) return;
    previousTime = 0;
    animationFrame = requestAnimationFrame(animate);
  };

  window.addEventListener('wheel', event => {
    if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    if (!animationFrame) {
      currentY = window.scrollY;
      targetY = currentY;
    }

    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const nextTarget = clamp(targetY + event.deltaY * unit);
    if (Math.abs(nextTarget - currentY) < 1) return;

    targetY = nextTarget;
    event.preventDefault();
    start();
  }, { passive: false });

  const cancel = () => {
    stop();
    currentY = window.scrollY;
    targetY = currentY;
  };

  window.addEventListener('pointerdown', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  window.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) cancel();
  });
  window.addEventListener('resize', () => {
    targetY = clamp(targetY);
    currentY = clamp(currentY);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancel();
  });
})();
