'use client';

import {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';
import styles from './DepthCarousel.module.css';

export type DepthCarouselItem = string | { image: string; alt?: string };
type TiltDirection = 'left' | 'right';

export interface DepthCarouselProps {
  items: DepthCarouselItem[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tint?: string;
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: TiltDirection;
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  duration?: number;
  ease?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  wheelNavigation?: boolean;
  onChange?: (index: number, item: { image: string; alt?: string }) => void;
  className?: string;
}

type Config = {
  count: number;
  depth: number;
  spread: number;
  tilt: number;
  tiltDirection: TiltDirection;
  visibleCards: number;
  falloff: number;
  blur: number;
  duration: number;
  ease: string;
  loop: boolean;
  cardWidth: number;
  cardHeight: number;
  autoplayDelay: number;
};

type DragState = {
  x: number;
  startPos: number;
  lastX: number;
  lastT: number;
  v: number;
  moved: boolean;
  id: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const normalizeItem = (item: DepthCarouselItem) => (typeof item === 'string' ? { image: item, alt: '' } : item);

export default function DepthCarousel({
  items,
  cardWidth = 470,
  cardHeight = 600,
  radius = 6,
  tint = '#2b0b0b',
  depth = 210,
  spread = 98,
  tilt = 18,
  tiltDirection = 'right',
  perspective = 1600,
  visibleCards = 3,
  falloff = 0.17,
  blur = 3,
  duration = 760,
  ease = 'power3.out',
  autoplay = false,
  autoplayDelay = 4200,
  loop = true,
  showControls = true,
  showIndicators = true,
  wheelNavigation = false,
  onChange,
  className = '',
}: DepthCarouselProps) {
  const data = useMemo(() => (Array.isArray(items) ? items : []).map(normalizeItem), [items]);
  const count = data.length;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tintRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const posRef = useRef(0);
  const focusRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scaleRef = useRef(1);
  const configRef = useRef<Config>({} as Config);
  const dragRef = useRef<DragState | null>(null);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reducedMotionRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const [active, setActive] = useState(0);

  onChangeRef.current = onChange;
  configRef.current = {
    count,
    depth,
    spread,
    tilt,
    tiltDirection,
    visibleCards,
    falloff,
    blur,
    duration,
    ease,
    loop,
    cardWidth,
    cardHeight,
    autoplayDelay,
  };

  const layout = useCallback((position: number) => {
    const config = configRef.current;
    const total = config.count;
    if (!total) return;

    const direction = config.tiltDirection === 'left' ? -1 : 1;
    const scale = scaleRef.current;

    for (let index = 0; index < total; index += 1) {
      const card = cardRefs.current[index];
      if (!card) continue;

      let distance = index - position;
      if (config.loop && total > 1) {
        distance = ((distance % total) + total) % total;
        if (distance > total / 2) distance -= total;
      }

      const back = Math.max(0, distance);
      const absDistance = Math.abs(distance);
      const shown = absDistance <= config.visibleCards + 0.5;
      const translateZ = -config.depth * distance;
      const translateX = direction * config.spread * distance;
      const rotateY = direction * config.tilt * clamp(distance, 0, 1);

      let opacity = distance < 0 ? Math.max(0, 1 + distance) : 1;
      if (!shown) opacity = 0;

      const brightness = Math.max(0.22, 1 - back * config.falloff);
      const blurPx = config.blur > 0
        ? Math.min(config.blur, (back / Math.max(1, config.visibleCards)) * config.blur)
        : 0;

      card.style.transform = `translate(-50%, -50%) scale(${scale}) translateX(${translateX.toFixed(2)}px) translateZ(${translateZ.toFixed(2)}px) rotateY(${rotateY.toFixed(3)}deg)`;
      card.style.opacity = opacity.toFixed(3);
      card.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
      card.style.zIndex = String(Math.round(2000 - distance * 20));
      card.style.pointerEvents = shown && opacity > 0.05 ? 'auto' : 'none';

      const tintLayer = tintRefs.current[index];
      if (tintLayer) tintLayer.style.opacity = clamp(back * config.falloff * 1.18, 0, 0.72).toFixed(3);
    }
  }, []);

  const notify = useCallback((index: number) => {
    setActive(index);
    onChangeRef.current?.(index, data[index]);
  }, [data]);

  const tweenTo = useCallback((target: number, animate: boolean) => {
    tweenRef.current?.kill();
    const config = configRef.current;
    const proxy = { p: posRef.current };
    const seconds = animate && !reducedMotionRef.current ? config.duration / 1000 : 0;

    tweenRef.current = gsap.to(proxy, {
      p: target,
      duration: seconds,
      ease: config.ease,
      onUpdate: () => {
        posRef.current = proxy.p;
        layout(proxy.p);
      },
      onComplete: () => {
        if (config.count > 0) posRef.current = ((posRef.current % config.count) + config.count) % config.count;
        layout(posRef.current);
      },
    });
  }, [layout]);

  const setFocus = useCallback((rawIndex: number, animate = true) => {
    const config = configRef.current;
    const total = config.count;
    if (!total) return;

    const index = config.loop ? ((rawIndex % total) + total) % total : clamp(rawIndex, 0, total - 1);
    let delta = index - posRef.current;

    if (config.loop && total > 1) {
      delta = ((delta % total) + total) % total;
      if (delta > total / 2) delta -= total;
    }

    tweenTo(posRef.current + delta, animate);
    if (index !== focusRef.current) {
      focusRef.current = index;
      notify(index);
    }
  }, [notify, tweenTo]);

  const navigateBy = useCallback((step: number) => {
    setFocus(focusRef.current + step, true);
  }, [setFocus]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const config = configRef.current;
      const neededWidth = config.cardWidth + Math.abs(config.spread) * 2 + 150;
      const neededHeight = config.cardHeight + 90;
      scaleRef.current = clamp(Math.min(width / neededWidth, height / neededHeight), 0.42, 1);
      layout(posRef.current);
    });

    observer.observe(root);
    return () => observer.disconnect();
  }, [layout]);

  useEffect(() => {
    reducedMotionRef.current = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    layout(posRef.current);
  }, [layout, count, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, cardWidth, cardHeight]);

  useEffect(() => {
    if (!wheelNavigation) return;
    const root = rootRef.current;
    if (!root) return;

    const onWheel = (event: WheelEvent) => {
      if (configRef.current.count < 2) return;
      event.preventDefault();
      tweenRef.current?.kill();
      const raw = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const delta = event.deltaMode === 1 ? raw * 24 : raw;
      const step = clamp(delta / (configRef.current.cardWidth * 0.9), -0.6, 0.6);
      posRef.current += step;
      layout(posRef.current);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => setFocus(Math.round(posRef.current), true), 130);
    };

    root.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      root.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [layout, setFocus, wheelNavigation]);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (configRef.current.count < 2) return;
    tweenRef.current?.kill();
    dragRef.current = {
      x: event.clientX,
      startPos: posRef.current,
      lastX: event.clientX,
      lastT: performance.now(),
      v: 0,
      moved: false,
      id: event.pointerId,
    };
  }, []);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const config = configRef.current;
    const stepPx = Math.max(config.cardWidth * 0.55 * scaleRef.current, 40);
    const dx = event.clientX - drag.x;

    if (!drag.moved && Math.abs(dx) > 4) {
      drag.moved = true;
      rootRef.current?.setPointerCapture(drag.id);
    }
    if (!drag.moved) return;

    const now = performance.now();
    const dt = Math.max(now - drag.lastT, 1);
    drag.v = (event.clientX - drag.lastX) / dt;
    drag.lastX = event.clientX;
    drag.lastT = now;
    posRef.current = drag.startPos - dx / stepPx;
    layout(posRef.current);
  }, [layout]);

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (!drag.moved) return;

    const config = configRef.current;
    const stepPx = Math.max(config.cardWidth * 0.55 * scaleRef.current, 40);
    const projected = posRef.current - (drag.v * 180) / stepPx;
    setFocus(Math.round(projected), true);
  }, [setFocus]);

  const onKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateBy(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigateBy(1);
    }
  }, [navigateBy]);

  useEffect(() => {
    if (!autoplay || reducedMotionRef.current || count < 2) return;
    const root = rootRef.current;
    let hovered = false;
    let focused = false;

    const stop = () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    };

    const start = () => {
      stop();
      autoTimerRef.current = setInterval(() => {
        if (!hovered && !focused) navigateBy(1);
      }, Math.max(configRef.current.autoplayDelay, 900));
    };

    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };
    const onFocusIn = () => { focused = true; };
    const onFocusOut = () => { focused = false; };

    root?.addEventListener('mouseenter', onEnter);
    root?.addEventListener('mouseleave', onLeave);
    root?.addEventListener('focusin', onFocusIn);
    root?.addEventListener('focusout', onFocusOut);
    start();

    return () => {
      stop();
      root?.removeEventListener('mouseenter', onEnter);
      root?.removeEventListener('mouseleave', onLeave);
      root?.removeEventListener('focusin', onFocusIn);
      root?.removeEventListener('focusout', onFocusOut);
    };
  }, [autoplay, autoplayDelay, count, navigateBy]);

  useEffect(() => () => {
    tweenRef.current?.kill();
    if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className}`.trim()}
      style={{ '--dc-perspective': `${perspective}px` } as CSSProperties}
      role="group"
      aria-roledescription="carousel"
      aria-label="Depth carousel"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className={styles.stage}>
        {data.map((item, index) => (
          <div
            key={`${item.image}-${index}`}
            className={styles.card}
            ref={(element) => { cardRefs.current[index] = element; }}
            style={{ width: cardWidth, height: cardHeight, borderRadius: radius }}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
            aria-hidden={active !== index}
            onClick={() => setFocus(index, true)}
          >
            <img className={styles.image} src={item.image} alt={item.alt || ''} draggable={false} />
            <span
              className={styles.tint}
              ref={(element) => { tintRefs.current[index] = element; }}
              style={{ background: tint }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      {showControls && count > 1 ? (
        <>
          <button className={`${styles.arrow} ${styles.prev}`} type="button" aria-label="Previous image" onClick={(event) => { event.stopPropagation(); navigateBy(-1); }}>‹</button>
          <button className={`${styles.arrow} ${styles.next}`} type="button" aria-label="Next image" onClick={(event) => { event.stopPropagation(); navigateBy(1); }}>›</button>
        </>
      ) : null}

      {showIndicators && count > 1 ? (
        <div className={styles.dots} aria-label="Carousel pagination">
          {data.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${active === index ? styles.activeDot : ''}`}
              type="button"
              aria-label={`Go to image ${index + 1}`}
              aria-current={active === index ? 'true' : undefined}
              onClick={(event) => { event.stopPropagation(); setFocus(index, true); }}
            />
          ))}
        </div>
      ) : null}

      <span className={styles.index}>{String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
      <span className={styles.hint}>Drag · arrows · keyboard</span>
    </div>
  );
}
