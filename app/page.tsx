'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { peso, products } from './data';

const HERO_VIDEO = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/e853be58-e250-47be-bd1f-28eeecb49c87.mp4';
const HERO_POSTER = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/3a2421a2-54a6-4574-9e9d-d883afdd3644.png';
const JAMES_IMAGE = 'https://lacomusph.com/cdn/shop/files/lacomus-lifestyle-photography-10.jpg?v=1777665204&width=2200';

const gallery = [
  {
    src: 'https://lacomusph.com/cdn/shop/files/HRS07386.jpg?v=1783715351&width=2200',
    alt: 'LACOMUS editorial fragrance portrait',
  },
  {
    src: 'https://lacomusph.com/cdn/shop/files/HRS04564.jpg?v=1783715218&width=2200',
    alt: 'LACOMUS studio fragrance portrait',
  },
  {
    src: 'https://lacomusph.com/cdn/shop/files/lacomus-perfume-model-shoot-08.jpg?v=1777665195&width=2200',
    alt: 'LACOMUS outdoor fragrance lifestyle portrait',
  },
  {
    src: 'https://lacomusph.com/cdn/shop/files/HRS04133_feb928e7-f7cf-4f93-8680-8f94a35d8691.jpg?v=1785033348&width=2200',
    alt: 'LACOMUS luxury lifestyle portrait',
  },
];

type ChatMessage = {
  from: 'bot' | 'user';
  text: string;
};

const starterMessage: ChatMessage = {
  from: 'bot',
  text: 'Welcome to LACOMUS. I can help you explore Blue Sapphire, Pink Sapphire, Emerald, prices, delivery, or the official store.',
};

function conciergeAnswer(raw: string) {
  const input = raw.toLowerCase();
  const blue = products.find((product) => product.id === 'blue')!;
  const pink = products.find((product) => product.id === 'pink')!;
  const emerald = products.find((product) => product.id === 'emerald')!;

  if (input.includes('blue') || input.includes('homme')) {
    return `Blue Sapphire is ${blue.mood.toLowerCase()}. It is currently listed at ${peso(blue.price)} on the LACOMUS store.`;
  }
  if (input.includes('pink') || input.includes('femme')) {
    return `Pink Sapphire is ${pink.mood.toLowerCase()}. It is currently listed at ${peso(pink.price)}. LACOMUS has not yet published its complete official scent-note breakdown.`;
  }
  if (input.includes('emerald') || input.includes('green')) {
    return `Emerald is ${emerald.mood.toLowerCase()} with spice, cacao, mint, oud, amber and woods. The current listed price is ${peso(emerald.price)}.`;
  }
  if (input.includes('price') || input.includes('cost') || input.includes('how much')) {
    return `Blue Sapphire: ${peso(blue.price)}. Pink Sapphire: ${peso(pink.price)}. Emerald: ${peso(emerald.price)} at the current listed promotional price.`;
  }
  if (input.includes('deliver') || input.includes('shipping') || input.includes('ship')) {
    return 'The official LACOMUS storefront currently advertises 2–4 days delivery nationwide. Final courier timing can still vary by location and order conditions.';
  }
  if (input.includes('buy') || input.includes('shop') || input.includes('order') || input.includes('checkout')) {
    return 'You can complete your purchase through the official LACOMUS store. Use the Shop button below to continue securely.';
  }
  if (input.includes('recommend') || input.includes('choose') || input.includes('which')) {
    return 'For fresh and clean, start with Blue Sapphire. For soft and feminine, start with Pink Sapphire. For darker spice, woods and oud, explore Emerald.';
  }

  return 'I can help with Blue Sapphire, Pink Sapphire, Emerald, prices, delivery, choosing a scent, or getting to the official LACOMUS shop.';
}

export default function Home() {
  const filmRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);

  useEffect(() => {
    const film = filmRef.current;
    const video = videoRef.current;
    if (!film || !video) return;

    let raf = 0;
    let lastSeek = -1;
    let lastSeekAt = 0;
    let lastPhase = -1;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 760;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const clamp = (value: number) => Math.min(1, Math.max(0, value));

    const unlockVideo = () => {
      if (reduceMotion) return;
      const play = video.play();
      if (play) play.then(() => video.pause()).catch(() => undefined);
    };

    const paint = () => {
      raf = 0;

      const pageMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty('--progress', String(window.scrollY / pageMax));

      const rect = film.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / scrollable);
      film.style.setProperty('--hero', String(progress));

      const phase = progress < 0.36 ? 0 : progress < 0.72 ? 1 : 2;
      if (phase !== lastPhase) {
        film.dataset.phase = String(phase);
        lastPhase = phase;
      }

      if (!reduceMotion && video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
        const target = Math.min(video.duration - 0.04, progress * video.duration);
        const now = performance.now();
        const minimumGap = coarsePointer ? 46 : 24;
        const minimumDelta = coarsePointer ? 0.055 : 0.025;

        if (Math.abs(target - lastSeek) >= minimumDelta && now - lastSeekAt >= minimumGap) {
          try {
            video.currentTime = target;
            lastSeek = target;
            lastSeekAt = now;
          } catch {
            // The poster remains visible until the browser allows media seeking.
          }
        }
      }
    };

    const queuePaint = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onMetadata = () => {
      video.pause();
      try { video.currentTime = 0.001; } catch { /* browser will retry on scroll */ }
      queuePaint();
    };

    video.addEventListener('loadedmetadata', onMetadata);
    window.addEventListener('scroll', queuePaint, { passive: true });
    window.addEventListener('resize', queuePaint, { passive: true });
    window.addEventListener('touchstart', unlockVideo, { once: true, passive: true });
    window.addEventListener('pointerdown', unlockVideo, { once: true, passive: true });
    queuePaint();

    return () => {
      video.removeEventListener('loadedmetadata', onMetadata);
      window.removeEventListener('scroll', queuePaint);
      window.removeEventListener('resize', queuePaint);
      window.removeEventListener('touchstart', unlockVideo);
      window.removeEventListener('pointerdown', unlockVideo);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  function sendMessage(text: string) {
    const cleaned = text.trim();
    if (!cleaned) return;
    setMessages((current) => [
      ...current,
      { from: 'user', text: cleaned },
      { from: 'bot', text: conciergeAnswer(cleaned) },
    ]);
    setChatInput('');
  }

  function submitChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(chatInput);
  }

  return (
    <main>
      <div className="page-progress" aria-hidden="true" />

      <header className="topbar shell">
        <a className="wordmark" href="#film">LACOMUS</a>
        <nav aria-label="Primary navigation">
          <a href="#james">James Torres</a>
          <a href="#gallery">Gallery</a>
          <button type="button" onClick={() => setChatOpen(true)}>Concierge</button>
        </nav>
        <a className="shop-link" href="https://lacomusph.com/collections/all" target="_blank" rel="noreferrer">Shop ↗</a>
      </header>

      <section id="film" ref={filmRef} className="scroll-film" data-phase="0">
        <div className="film-stage">
          <video
            ref={videoRef}
            className="hero-video"
            src={HERO_VIDEO}
            poster={HERO_POSTER}
            preload="auto"
            muted
            playsInline
            aria-label="LACOMUS Blue Sapphire cinematic perfume transformation"
          />
          <div className="film-shade" aria-hidden="true" />

          <div className="film-copy shell" aria-live="off">
            <div className="film-copy-step film-copy-step-0">
              <span>FORM / LIQUID / LIGHT</span>
              <h1>Fragrance takes form.</h1>
              <p>A single drop becomes liquid glass.</p>
            </div>
            <div className="film-copy-step film-copy-step-1">
              <span>BLUE SAPPHIRE / POUR HOMME</span>
              <h1>Quiet presence.</h1>
              <p>The film stays in control. The product stays visible.</p>
            </div>
            <div className="film-copy-step film-copy-step-2">
              <span>LACOMUS / SILENT LUXURY</span>
              <h1>Leave a trace.</h1>
              <p>Scroll once more to enter the brand story.</p>
            </div>
          </div>

          <div className="scroll-cue" aria-hidden="true">
            <span>SCROLL</span>
            <i>↓</i>
          </div>
        </div>
      </section>

      <section id="james" className="james-section">
        <img src={JAMES_IMAGE} alt="LACOMUS luxury fragrance lifestyle campaign" loading="eager" />
        <div className="james-shade" aria-hidden="true" />
        <div className="james-copy shell">
          <p>PORTRAIT / LACOMUS</p>
          <h2>James<br />Torres</h2>
          <div className="james-brand">LACOMUS</div>
          <span>Affordable silent luxury. Presence without excess.</span>
          <a href="https://lacomusph.com/collections/all" target="_blank" rel="noreferrer">Explore LACOMUS ↗</a>
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <div className="gallery-heading shell">
          <div>
            <p>EDITORIAL / 2026</p>
            <h2>The Gallery</h2>
          </div>
          <span>Swipe on mobile →</span>
        </div>

        <div className="gallery-rail" aria-label="LACOMUS editorial gallery">
          {gallery.map((image, index) => (
            <figure key={image.src} className={`gallery-card gallery-card-${index + 1}`}>
              <img src={image.src} alt={image.alt} loading="lazy" />
              <figcaption>{String(index + 1).padStart(2, '0')} / LACOMUS</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <footer className="site-footer shell">
        <a className="wordmark" href="#film">LACOMUS</a>
        <p>More chapters will be added next.</p>
        <a href="https://lacomusph.com/" target="_blank" rel="noreferrer">Official store ↗</a>
      </footer>

      <button
        className={`chat-launcher ${chatOpen ? 'chat-launcher-hidden' : ''}`}
        type="button"
        onClick={() => setChatOpen(true)}
        aria-label="Open LACOMUS concierge"
      >
        <span>Chat with us</span>
        <i aria-hidden="true" />
      </button>

      <aside className={`chat-panel ${chatOpen ? 'chat-panel-open' : ''}`} aria-hidden={!chatOpen}>
        <header>
          <div>
            <span>LACOMUS</span>
            <strong>Concierge</strong>
          </div>
          <button type="button" onClick={() => setChatOpen(false)} aria-label="Close concierge">×</button>
        </header>

        <div className="chat-messages" aria-live="polite">
          {messages.map((message, index) => (
            <p key={`${message.from}-${index}`} className={`chat-message chat-message-${message.from}`}>{message.text}</p>
          ))}
        </div>

        <div className="chat-quick-actions">
          <button type="button" onClick={() => sendMessage('Which scent should I choose?')}>Choose a scent</button>
          <button type="button" onClick={() => sendMessage('What are the prices?')}>Prices</button>
          <button type="button" onClick={() => sendMessage('How long is delivery?')}>Delivery</button>
        </div>

        <form onSubmit={submitChat}>
          <input
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            placeholder="Ask about LACOMUS..."
            aria-label="Message LACOMUS concierge"
          />
          <button type="submit" aria-label="Send message">↑</button>
        </form>

        <a className="chat-shop" href="https://lacomusph.com/collections/all" target="_blank" rel="noreferrer">Shop official LACOMUS ↗</a>
      </aside>
    </main>
  );
}
