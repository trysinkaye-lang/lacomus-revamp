'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';

interface FadeContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  blur?: boolean;
  duration?: number;
  ease?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
}

// Adapted from React Bits FadeContent (MIT + Commons Clause).
// The desktop animation keeps the React Bits/GSAP behavior, while touch and
// reduced-motion devices skip the expensive animation path for smoother scroll.
export default function FadeContent({
  children,
  blur = false,
  duration = 0.9,
  ease = 'power2.out',
  delay = 0,
  threshold = 0.14,
  initialOpacity = 0,
  className = '',
  style,
  ...props
}: FadeContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 760;

    if (reducedMotion || coarsePointer) {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      el.style.filter = 'none';
      el.style.transform = 'none';
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const [{ gsap }, scrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled || !ref.current) return;

      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const node = ref.current;
      const startPct = (1 - threshold) * 100;

      gsap.set(node, {
        autoAlpha: initialOpacity,
        y: 28,
        filter: blur ? 'blur(10px)' : 'blur(0px)',
        willChange: 'opacity, filter, transform',
      });
      node.style.visibility = 'visible';

      const tween = gsap.to(node, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration,
        delay,
        ease,
        paused: true,
        onComplete: () => {
          node.style.willChange = 'auto';
        },
      });

      const trigger = ScrollTrigger.create({
        trigger: node,
        start: `top ${startPct}%`,
        once: true,
        onEnter: () => tween.play(),
      });

      cleanup = () => {
        trigger.kill();
        tween.kill();
        gsap.killTweensOf(node);
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [blur, delay, duration, ease, initialOpacity, threshold]);

  return (
    <div ref={ref} className={className} style={{ visibility: 'hidden', ...style }} {...props}>
      {children}
    </div>
  );
}
