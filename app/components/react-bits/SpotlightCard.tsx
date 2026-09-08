'use client';

import type { CSSProperties, MouseEvent, PropsWithChildren } from 'react';
import { useRef } from 'react';
import styles from './SpotlightCard.module.css';

type SpotlightCardProps = PropsWithChildren<{
  className?: string;
  spotlightColor?: string;
  style?: CSSProperties;
}>;

// Adapted from React Bits SpotlightCard (MIT + Commons Clause).
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255,255,255,.12)',
  style,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    node.style.setProperty('--spot-color', spotlightColor);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`${styles.card} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
