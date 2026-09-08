'use client';

import { useEffect } from 'react';

const HERO_VIDEO_HQ = 'https://d8j0ntlcm91z4.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/hf_20260908_155625_1f61fd16-4ee0-4d31-9189-da7bc1af548c.mp4';

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
    const legacyVideo = stage?.querySelector<HTMLVideoElement>('.hero-video');
    if (!film || !stage || !legacyVideo) return;

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
          dprCap: 1.2,
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
          dprCap: 1.35,
        };

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-frame-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    stage.insertBefore(canvas, legacyVideo);

    const context = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!context) {
      canvas.remove();
      return;
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    // Keep the page's original video element only as the poster fallback. The page-level
    // legacy scroll listener keeps a ref to this element, so stripping its sources prevents
    // it from performing expensive hidden seeks while the frame engine is active.
    try {
      legacyVideo.pause();
      legacyVideo.preload = 'none';
      legacyVideo.querySelectorAll('source').forEach((source) => source.remove());
      legacyVideo.removeAttribute('src');
      legacyVideo.style.willChange = 'auto';
      legacyVideo.load();
    } catch {
      // The poster remains available until the first decoded frame is ready.
    }

    // A separate HQ video is never touched by the page's legacy scroll handler. It is used
    // only after scrolling stops, giving the viewer a cleaner frame than the compressed sprites.
    const hqVideo = document.createElement('video');
    hqVideo.className = 'hero-video hero-video-hq';
    hqVideo.muted = true;
    hqVideo.playsInline = true;
    hqVideo.preload = 'auto';
    hqVideo.src = HERO_VIDEO_HQ;
    hqVideo.setAttribute('aria-hidden', 'true');
    hqVideo.style.opacity = '0';
    hqVideo.style.pointerEvents = 'none';
    legacyVideo.after(hqVideo);

    let destroyed = false;
    let raf = 0;
    let desiredFrame = 0;
    let drawnFrame = -1;
    let lastPhase = -1;
    let lastProgress = 0;
    let lastScrollY = window.scrollY;
    let idleTimer = 0;
    let seekToken = 0;

    const sheetBlobs = new Map<number, Blob>();
    const sheetPromises = new Map<number, Promise<Blob>>();
    const bitmapCache = new Map<number, ImageBitmap>();
    const bitmapPromises = new Map<number, Promise<ImageBitmap | null>>();

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

    const loadSheetBlob = (index: number) => {
      if (index < 0 || index >= config.sheets.length) return Promise.reject(new Error('sheet out of range'));
      const cached = sheetBlobs.get(index);
      if (cached) return Promise.resolve(cached);
      const pending = sheetPromises.get(index);
      if (pending) return pending;

      const request = fetch(config.sheets[index], { cache: 'force-cache' })
        .then((response) => {
          if (!response.ok) throw new Error(`sheet ${index} failed`);
          return response.blob();
        })
        .then((blob) => {
          sheetBlobs.set(index, blob);
          sheetPromises.delete(index);
          return blob;
        })
        .catch((error) => {
          sheetPromises.delete(index);
          throw error;
        });

      sheetPromises.set(index, request);
      return request;
    };

    const trimBitmaps = (centerFrame: number) => {
      bitmapCache.forEach((bitmap, frame) => {
        if (Math.abs(frame - centerFrame) > 8) {
          bitmap.close();
          bitmapCache.delete(frame);
        }
      });
    };

    const decodeFrame = (frameIndex: number) => {
      const safeFrame = Math.max(0, Math.min(config.totalFrames - 1, frameIndex));
      const cached = bitmapCache.get(safeFrame);
      if (cached) return Promise.resolve(cached);
      const pending = bitmapPromises.get(safeFrame);
      if (pending) return pending;

      const sheetIndex = Math.min(config.sheets.length - 1, Math.floor(safeFrame / FRAMES_PER_SHEET));
      const localFrame = safeFrame % FRAMES_PER_SHEET;
      const column = localFrame % SHEET_COLUMNS;
      const row = Math.floor(localFrame / SHEET_COLUMNS);
      const frameX = column * config.frameWidth;
      const frameY = row * config.frameHeight;

      const promise = loadSheetBlob(sheetIndex)
        .then((blob) => createImageBitmap(blob, frameX, frameY, config.frameWidth, config.frameHeight))
        .then((bitmap) => {
          if (destroyed) {
            bitmap.close();
            return null;
          }
          bitmapCache.set(safeFrame, bitmap);
          bitmapPromises.delete(safeFrame);
          trimBitmaps(desiredFrame);
          return bitmap;
        })
        .catch(() => {
          bitmapPromises.delete(safeFrame);
          return null;
        });

      bitmapPromises.set(safeFrame, promise);
      return promise;
    };

    const drawBitmap = (bitmap: ImageBitmap, frameIndex: number) => {
      resizeCanvas();

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

      context.drawImage(
        bitmap,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      drawnFrame = frameIndex;
      canvas.classList.add('is-ready');
      legacyVideo.style.opacity = '0';
    };

    const requestFrame = (frameIndex: number) => {
      const safeFrame = Math.max(0, Math.min(config.totalFrames - 1, frameIndex));
      const cached = bitmapCache.get(safeFrame);
      if (cached) {
        drawBitmap(cached, safeFrame);
        return;
      }

      decodeFrame(safeFrame).then((bitmap) => {
        if (!bitmap || destroyed || desiredFrame !== safeFrame) return;
        drawBitmap(bitmap, safeFrame);
      });
    };

    const warmNearbyFrames = (frameIndex: number, direction: number) => {
      const ahead = direction >= 0 ? [1, 2, 3, -1] : [-1, -2, -3, 1];
      ahead.forEach((offset) => {
        void decodeFrame(frameIndex + offset);
      });
    };

    const showHQFrame = () => {
      if (destroyed || reducedMotion || !Number.isFinite(lastProgress)) return;
      const token = ++seekToken;

      const seek = () => {
        if (destroyed || token !== seekToken || !Number.isFinite(hqVideo.duration) || hqVideo.duration <= 0) return;
        const target = Math.max(0, Math.min(hqVideo.duration - 0.04, lastProgress * hqVideo.duration));
        try {
          hqVideo.currentTime = target;
        } catch {
          return;
        }
      };

      const reveal = () => {
        if (destroyed || token !== seekToken) return;
        const apply = () => {
          if (destroyed || token !== seekToken) return;
          hqVideo.style.opacity = '1';
          canvas.classList.add('is-hq-idle');
        };
        if ('requestVideoFrameCallback' in hqVideo) {
          hqVideo.requestVideoFrameCallback(() => apply());
        } else {
          requestAnimationFrame(apply);
        }
      };

      hqVideo.addEventListener('seeked', reveal, { once: true });
      if (hqVideo.readyState >= 1) seek();
      else hqVideo.addEventListener('loadedmetadata', seek, { once: true });
    };

    const scheduleHQFrame = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(showHQFrame, isMobile ? 220 : 150);
    };

    const hideHQFrame = () => {
      seekToken += 1;
      hqVideo.style.opacity = '0';
      canvas.classList.remove('is-hq-idle');
    };

    const paint = () => {
      raf = 0;
      const rect = film.getBoundingClientRect();
      const scrollable = Math.max(1, film.offsetHeight - window.innerHeight);
      const progress = clamp01(-rect.top / scrollable);
      lastProgress = progress;
      film.style.setProperty('--hero', String(progress));

      const phase = progress < 0.36 ? 0 : progress < 0.72 ? 1 : 2;
      if (phase !== lastPhase) {
        film.dataset.phase = String(phase);
        lastPhase = phase;
      }

      desiredFrame = reducedMotion ? 0 : Math.round(progress * (config.totalFrames - 1));
      const direction = window.scrollY >= lastScrollY ? 1 : -1;
      lastScrollY = window.scrollY;

      requestFrame(desiredFrame);
      warmNearbyFrames(desiredFrame, direction);
      scheduleHQFrame();
    };

    const queuePaint = () => {
      hideHQFrame();
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onResize = () => {
      hideHQFrame();
      resizeCanvas();
      if (drawnFrame >= 0) requestFrame(drawnFrame);
      queuePaint();
    };

    // Cache compressed sprite bytes in the background without retaining giant decoded sheets.
    // This removes most visible network stalls while keeping memory usage much lower.
    const prefetchAllSheets = () => {
      config.sheets.forEach((_, index) => {
        void loadSheetBlob(index).catch(() => undefined);
      });
    };

    void decodeFrame(0).then((bitmap) => {
      if (bitmap && !destroyed) drawBitmap(bitmap, 0);
    });
    void decodeFrame(1);
    void decodeFrame(2);
    resizeCanvas();
    queuePaint();

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(prefetchAllSheets, { timeout: 1800 });
    } else {
      window.setTimeout(prefetchAllSheets, 500);
    }

    window.addEventListener('scroll', queuePaint, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      destroyed = true;
      seekToken += 1;
      window.clearTimeout(idleTimer);
      window.removeEventListener('scroll', queuePaint);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
      bitmapCache.forEach((bitmap) => bitmap.close());
      bitmapCache.clear();
      sheetBlobs.clear();
      hqVideo.pause();
      hqVideo.removeAttribute('src');
      hqVideo.load();
      hqVideo.remove();
      canvas.remove();
      legacyVideo.style.opacity = '';
    };
  }, []);

  return null;
}
