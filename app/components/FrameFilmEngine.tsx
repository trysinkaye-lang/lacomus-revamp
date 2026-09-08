'use client';

import { useEffect } from 'react';

const DESKTOP_VIDEO = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/7f8d7aff-eb99-48fb-a17e-3c1063609bbb.mp4';
const MOBILE_VIDEO = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/fd73b963-87f4-4281-977c-3e52b7e37324.mp4';

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export default function FrameFilmEngine() {
  useEffect(() => {
    const film = document.querySelector<HTMLElement>('#film');
    const stage = film?.querySelector<HTMLElement>('.film-stage');
    const legacyVideo = stage?.querySelector<HTMLVideoElement>('.hero-video');
    if (!film || !stage || !legacyVideo) return;

    const isMobile = window.matchMedia('(max-width: 760px)').matches || window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const source = isMobile ? MOBILE_VIDEO : DESKTOP_VIDEO;

    // Disable the older page-level media element so its scroll listener cannot keep issuing
    // competing seeks in the background. The poster stays visible until the new scrub video is ready.
    try {
      legacyVideo.pause();
      legacyVideo.preload = 'none';
      legacyVideo.querySelectorAll('source').forEach((item) => item.remove());
      legacyVideo.removeAttribute('src');
      legacyVideo.load();
    } catch {
      // Poster fallback remains available.
    }

    const video = document.createElement('video');
    video.className = 'hero-video hero-video-scrub';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.disablePictureInPicture = true;
    video.setAttribute('aria-hidden', 'true');
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';
    video.src = source;
    legacyVideo.after(video);

    let destroyed = false;
    let raf = 0;
    let ready = false;
    let seeking = false;
    let pendingTime = 0;
    let lastSeekAt = 0;
    let lastPhase = -1;
    let firstFrameShown = false;

    const reveal = () => {
      if (destroyed || firstFrameShown) return;
      firstFrameShown = true;
      video.style.opacity = '1';
      legacyVideo.style.opacity = '0';
    };

    const applyPendingSeek = () => {
      if (destroyed || reduceMotion || !ready || seeking || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const target = Math.max(0, Math.min(video.duration - 0.03, pendingTime));
      if (Math.abs(video.currentTime - target) < 0.025) {
        reveal();
        return;
      }

      const now = performance.now();
      const minimumGap = isMobile ? 42 : 26;
      if (now - lastSeekAt < minimumGap) return;

      seeking = true;
      lastSeekAt = now;
      try {
        video.currentTime = target;
      } catch {
        seeking = false;
      }
    };

    const onSeeked = () => {
      seeking = false;
      reveal();
      if (Math.abs(video.currentTime - pendingTime) > (isMobile ? 0.055 : 0.035)) {
        applyPendingSeek();
      }
    };

    const onMetadata = () => {
      ready = true;
      video.pause();
      applyPendingSeek();
    };

    const unlock = () => {
      if (reduceMotion) return;
      const playback = video.play();
      if (playback) playback.then(() => video.pause()).catch(() => undefined);
    };

    const paint = () => {
      raf = 0;
      const rect = film.getBoundingClientRect();
      const scrollable = Math.max(1, film.offsetHeight - window.innerHeight);
      const progress = clamp01(-rect.top / scrollable);
      film.style.setProperty('--hero', String(progress));

      const phase = progress < 0.36 ? 0 : progress < 0.72 ? 1 : 2;
      if (phase !== lastPhase) {
        film.dataset.phase = String(phase);
        lastPhase = phase;
      }

      if (ready && Number.isFinite(video.duration) && video.duration > 0) {
        pendingTime = reduceMotion ? 0 : progress * video.duration;
        applyPendingSeek();
      }
    };

    const queuePaint = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    video.addEventListener('loadedmetadata', onMetadata);
    video.addEventListener('seeked', onSeeked);
    window.addEventListener('scroll', queuePaint, { passive: true });
    window.addEventListener('resize', queuePaint, { passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    queuePaint();

    return () => {
      destroyed = true;
      video.removeEventListener('loadedmetadata', onMetadata);
      video.removeEventListener('seeked', onSeeked);
      window.removeEventListener('scroll', queuePaint);
      window.removeEventListener('resize', queuePaint);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('pointerdown', unlock);
      if (raf) cancelAnimationFrame(raf);
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.remove();
      legacyVideo.style.opacity = '';
    };
  }, []);

  return null;
}
