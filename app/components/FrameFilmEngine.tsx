'use client';

import { useEffect } from 'react';

const DESKTOP_SHEETS = [
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/2897d7bc-3ca8-44a9-a52b-54d9f00a4619.webp',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/6943d680-bbae-47c4-8872-45e05d585ca0.webp',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/45f96f52-bd8b-4442-b5ce-876ccd65e796.webp',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/5af88e02-7373-464c-9716-4100a347cfa7.webp',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/01630d0e-67fb-42e7-aa7b-199701d3b8cd.webp',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/3d9591dd-8bb1-4e75-9aac-36685081190f.webp',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/4fc469ff-be4f-4b8b-ba30-ac2a3fe9b0f6.webp',
];

const MOBILE_SHEETS = [
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/85ca0077-2958-409b-a851-467fa10ac909.webp',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/4ff6a2c0-63d0-4af1-a140-b5e6481d61b9.webp',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/ee038889-a741-43e7-8897-9bcb6d52c343.webp',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/d07f3102-2bd6-4d58-90a4-30d98e7a79b8.webp',
];

type FilmConfig = {
  sheets: string[];
  frameWidth: number;
  frameHeight: number;
  totalFrames: number;
  focusX: number;
  focusY: number;
  maxCanvasWidth: number;
  maxCanvasHeight: number;
  dprCap: number;
};

const FRAMES_PER_SHEET = 16;
const SHEET_COLUMNS = 4;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export default function FrameFilmEngine() {
  useEffect(() => {
    const film = document.querySelector<HTMLElement>('#film');
    const stage = film?.querySelector<HTMLElement>('.film-stage');
    const video = stage?.querySelector<HTMLVideoElement>('.hero-video');
    if (!film || !stage || !video) return;

    const isMobile = window.matchMedia('(max-width: 760px)').matches || window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const config: FilmConfig = isMobile
      ? {
          sheets: MOBILE_SHEETS,
          frameWidth: 960,
          frameHeight: 540,
          totalFrames: 64,
          focusX: 0.61,
          focusY: 0.5,
          maxCanvasWidth: 1280,
          maxCanvasHeight: 1080,
          dprCap: 1.25,
        }
      : {
          sheets: DESKTOP_SHEETS,
          frameWidth: 1280,
          frameHeight: 720,
          totalFrames: 97,
          focusX: 0.5,
          focusY: 0.5,
          maxCanvasWidth: 1920,
          maxCanvasHeight: 1080,
          dprCap: 1.5,
        };

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-frame-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    stage.insertBefore(canvas, video);

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      canvas.remove();
      return;
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    let destroyed = false;
    let raf = 0;
    let desiredFrame = 0;
    let drawnFrame = -1;
    let lastPhase = -1;
    const cache = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();

    try {
      video.pause();
      video.preload = 'none';
      video.querySelectorAll('source').forEach((source) => source.remove());
      video.removeAttribute('src');
      video.style.willChange = 'auto';
      video.load();
    } catch {
      // The poster stays visible until the first sprite sheet is ready.
    }

    const resizeCanvas = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, config.dprCap);
      const nextWidth = Math.max(1, Math.min(Math.round(rect.width * dpr), config.maxCanvasWidth));
      const nextHeight = Math.max(1, Math.min(Math.round(rect.height * dpr), config.maxCanvasHeight));
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        drawnFrame = -1;
      }
    };

    const pruneCache = (center: number) => {
      cache.forEach((image, index) => {
        if (Math.abs(index - center) > 1) {
          image.src = '';
          cache.delete(index);
        }
      });
    };

    const drawFrame = (frameIndex: number) => {
      const safeFrame = Math.max(0, Math.min(config.totalFrames - 1, frameIndex));
      const sheetIndex = Math.min(config.sheets.length - 1, Math.floor(safeFrame / FRAMES_PER_SHEET));
      const image = cache.get(sheetIndex);
      if (!image || !image.complete || image.naturalWidth === 0) return false;

      resizeCanvas();

      const localFrame = safeFrame % FRAMES_PER_SHEET;
      const column = localFrame % SHEET_COLUMNS;
      const row = Math.floor(localFrame / SHEET_COLUMNS);
      const frameX = column * config.frameWidth;
      const frameY = row * config.frameHeight;

      const destinationAspect = canvas.width / canvas.height;
      const sourceAspect = config.frameWidth / config.frameHeight;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = config.frameWidth;
      let sourceHeight = config.frameHeight;

      if (sourceAspect > destinationAspect) {
        sourceWidth = config.frameHeight * destinationAspect;
        sourceX = (config.frameWidth - sourceWidth) * config.focusX;
      } else if (sourceAspect < destinationAspect) {
        sourceHeight = config.frameWidth / destinationAspect;
        sourceY = (config.frameHeight - sourceHeight) * config.focusY;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        image,
        frameX + sourceX,
        frameY + sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      drawnFrame = safeFrame;
      canvas.classList.add('is-ready');
      video.style.opacity = '0';
      return true;
    };

    const loadSheet = (index: number) => {
      if (index < 0 || index >= config.sheets.length || cache.has(index) || loading.has(index)) return;
      loading.add(index);
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        if (destroyed) return;
        loading.delete(index);
        cache.set(index, image);
        const desiredSheet = Math.min(config.sheets.length - 1, Math.floor(desiredFrame / FRAMES_PER_SHEET));
        if (index === desiredSheet) drawFrame(desiredFrame);
        pruneCache(desiredSheet);
      };
      image.onerror = () => loading.delete(index);
      image.src = config.sheets[index];
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

      desiredFrame = reducedMotion ? 0 : Math.round(progress * (config.totalFrames - 1));
      const sheetIndex = Math.min(config.sheets.length - 1, Math.floor(desiredFrame / FRAMES_PER_SHEET));
      loadSheet(sheetIndex);

      const localFrame = desiredFrame % FRAMES_PER_SHEET;
      if (localFrame >= 7) loadSheet(sheetIndex + 1);
      if (localFrame <= 3) loadSheet(sheetIndex - 1);

      if (drawnFrame !== desiredFrame) drawFrame(desiredFrame);
    };

    const queuePaint = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onResize = () => {
      resizeCanvas();
      queuePaint();
    };

    loadSheet(0);
    loadSheet(1);
    resizeCanvas();
    queuePaint();

    window.addEventListener('scroll', queuePaint, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      destroyed = true;
      window.removeEventListener('scroll', queuePaint);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
      cache.forEach((image) => {
        image.src = '';
      });
      cache.clear();
      canvas.remove();
      video.style.opacity = '';
    };
  }, []);

  return null;
}
