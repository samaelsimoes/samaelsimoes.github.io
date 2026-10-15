/* Fur Elise, Beethoven. Recording: V. Gao, CC0; see src/audio/CREDITS.md. */
(() => {
  'use strict';
  const script = document.currentScript;
  const audio = new Audio(new URL('../audio/fur-elise.mp3', script.src).href);
  audio.preload = 'none';
  audio.loop = true;
  audio.volume = 0.07;
  let started = false;
  const gestures = ['wheel', 'pointerdown', 'click', 'keydown', 'touchend'];
  function start(event) {
    if (!event.isTrusted || document.hidden || started) return;
    // Call play directly in the gesture so a click can retry a blocked wheel attempt.
    audio.play().then(() => {
      started = true;
      if (document.hidden) audio.pause();
      gestures.forEach(type => window.removeEventListener(type, start));
    }).catch(() => { /* Retain the listeners for the next permitted gesture. */ });
  }
  gestures.forEach(type => window.addEventListener(type, start, { passive: true }));
  document.addEventListener('visibilitychange', () => {
    if (!started) return;
    if (document.hidden) audio.pause();
    else audio.play().catch(() => {
      started = false;
      gestures.forEach(type => window.addEventListener(type, start, { passive: true }));
    });
  });
})();
