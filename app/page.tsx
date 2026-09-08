'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { allProducts, duo, peso, products, type ProductId } from './data';

type BagItem = { id: ProductId; quantity: number };

const HERO_VIDEO = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/e853be58-e250-47be-bd1f-28eeecb49c87.mp4';
const HERO_POSTER = products[0].image;

const heroSteps = [
  {
    start: 0.0,
    end: 0.28,
    eyebrow: 'LACOMUS / SCROLL FILM',
    title: 'A DROP OF PRESENCE.',
    copy: 'Scroll slowly. The film moves with you.',
  },
  {
    start: 0.2,
    end: 0.53,
    eyebrow: 'FORM / LIQUID / LIGHT',
    title: 'FRAGRANCE TAKES FORM.',
    copy: 'A single drop becomes liquid glass, then resolves into a signature.',
  },
  {
    start: 0.48,
    end: 0.8,
    eyebrow: 'BLUE SAPPHIRE / POUR HOMME',
    title: 'SILENT LUXURY.',
    copy: 'Fresh, clean and controlled — presence without excess.',
  },
  {
    start: 0.74,
    end: 1.0,
    eyebrow: 'LACOMUS / BLUE SAPPHIRE',
    title: 'LEAVE A TRACE.',
    copy: 'The bottle is the ending of the film — and the beginning of the experience.',
  },
];

export default function Home() {
  const [bag, setBag] = useState<BagItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lacomus-bag');
    if (!saved) return;
    try {
      setBag(JSON.parse(saved));
    } catch {
      localStorage.removeItem('lacomus-bag');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lacomus-bag', JSON.stringify(bag));
  }, [bag]);

  useEffect(() => {
    document.body.style.overflow = bagOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [bagOpen]);

  useEffect(() => {
    let raf = 0;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const fadeWindow = (progress: number, start: number, end: number) => {
      const edge = Math.min(0.085, Math.max(0.04, (end - start) * 0.28));
      const fadeIn = clamp((progress - start) / edge);
      const fadeOut = clamp((end - progress) / edge);
      return Math.min(fadeIn, fadeOut);
    };

    const paint = () => {
      const pageMax = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty('--progress', String(pageMax > 0 ? scrollY / pageMax : 0));

      const hero = heroRef.current;
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const scrollable = Math.max(1, hero.offsetHeight - innerHeight);
        const progress = clamp(-rect.top / scrollable);
        hero.style.setProperty('--hero', String(progress));

        const video = videoRef.current;
        if (video && Number.isFinite(video.duration) && video.duration > 0) {
          const target = Math.min(video.duration - 0.035, Math.max(0.01, progress * video.duration));
          if (Math.abs(video.currentTime - target) > 0.025) {
            try {
              video.currentTime = target;
            } catch {
              // Some browsers reject seeks until metadata has settled; the next frame retries.
            }
          }
        }

        hero.querySelectorAll<HTMLElement>('[data-hero-step]').forEach((node) => {
          const start = Number(node.dataset.start ?? 0);
          const end = Number(node.dataset.end ?? 1);
          const opacity = fadeWindow(progress, start, end);
          const midpoint = (start + end) / 2;
          const y = (progress - midpoint) * -54;
          node.style.opacity = String(opacity);
          node.style.transform = `translate3d(0, ${y}px, 0)`;
          node.style.pointerEvents = opacity > 0.55 ? 'auto' : 'none';
        });
      }

      document.querySelectorAll<HTMLElement>('[data-story-scene]').forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const p = clamp((innerHeight - rect.top) / (rect.height + innerHeight));
        scene.style.setProperty('--p', String(p));
      });
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };

    const video = videoRef.current;
    video?.addEventListener('loadedmetadata', schedule);
    video?.addEventListener('canplay', schedule);
    paint();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);

    return () => {
      video?.removeEventListener('loadedmetadata', schedule);
      video?.removeEventListener('canplay', schedule);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  const bagCount = useMemo(() => bag.reduce((sum, item) => sum + item.quantity, 0), [bag]);
  const bagTotal = useMemo(() => bag.reduce((sum, item) => {
    const product = allProducts.find((entry) => entry.id === item.id);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0), [bag]);

  const addToBag = (id: ProductId) => {
    setBag((current) => current.some((item) => item.id === id)
      ? current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { id, quantity: 1 }]);
    setBagOpen(true);
  };

  const changeQuantity = (id: ProductId, delta: number) => {
    setBag((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  };

  return (
    <main>
      <div className="page-progress" aria-hidden="true" />

      <header className="topbar shell">
        <a className="wordmark" href="#top" aria-label="LACOMUS home">LACOMUS</a>
        <nav aria-label="Primary navigation">
          <a href="#story">Story</a>
          <a href="#collection">Collection</a>
          <a href="#duo">Duo</a>
        </nav>
        <button className="bag-button" type="button" onClick={() => setBagOpen(true)}>
          Bag <span>{String(bagCount).padStart(2, '0')}</span>
        </button>
      </header>

      <section id="top" className="scroll-film" ref={heroRef}>
        <div className="scroll-film-stage">
          <video
            ref={videoRef}
            className="hero-video"
            src={HERO_VIDEO}
            poster={HERO_POSTER}
            muted
            playsInline
            preload="auto"
            aria-label="LACOMUS Blue Sapphire perfume transformation film"
          />
          <div className="hero-vignette" aria-hidden="true" />
          <div className="hero-light" aria-hidden="true" />
          <div className="film-grain" aria-hidden="true" />

          <div className="hero-copy shell">
            {heroSteps.map((step, index) => (
              <div
                className={`hero-step hero-step-${index + 1}`}
                data-hero-step
                data-start={step.start}
                data-end={step.end}
                key={step.title}
              >
                <p className="eyebrow">{step.eyebrow}</p>
                <h1>{step.title}</h1>
                <p>{step.copy}</p>
                {index === 3 && (
                  <div className="hero-actions">
                    <a className="button button-light" href="#collection">Discover the collection</a>
                    <a className="text-link" href={products[0].url} target="_blank" rel="noreferrer">Shop Blue Sapphire ↗</a>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="film-progress shell" aria-hidden="true">
            <span>SCROLL TO CONTROL THE FILM</span>
            <div><i /></div>
            <span>00:08</span>
          </div>
        </div>
      </section>

      <section id="story" className="manifesto shell">
        <p className="eyebrow">THE LACOMUS LANGUAGE</p>
        <div className="manifesto-grid">
          <h2>Luxury should be felt, not announced.</h2>
          <div>
            <p>LACOMUS becomes a story before it becomes a storefront. Motion, light and fragrance move first; product information follows only when it matters.</p>
            <p className="microcopy">CINEMATIC COMMERCE / SCROLL-DRIVEN / QUIET CONFIDENCE</p>
          </div>
        </div>
      </section>

      <section id="collection" className="collection-intro shell">
        <p className="eyebrow">THE COLLECTION</p>
        <h2>Three signatures. Three different kinds of presence.</h2>
      </section>

      <div className="story-list">
        {products.map((product, index) => (
          <article
            className={`product-story ${index % 2 ? 'product-story-reverse' : ''}`}
            data-story-scene
            key={product.id}
          >
            <div className="product-story-media">
              <img src={product.image} alt={`${product.name} fragrance`} />
              <span className="scene-index">{product.index}</span>
            </div>
            <div className="product-story-copy">
              <p className="eyebrow">{product.subtitle}</p>
              <h2>{product.name.replace('Lacomus ', '')}</h2>
              <p className="mood">{product.mood}</p>
              <p className="description">{product.description}</p>
              <div className="note-stack">
                <div><span>OPEN</span><p>{product.notes[0]}</p></div>
                <div><span>HEART</span><p>{product.notes[1]}</p></div>
                <div><span>TRAIL</span><p>{product.notes[2]}</p></div>
              </div>
              <div className="buy-row">
                <div>
                  <strong>{peso(product.price)}</strong>
                  {product.compareAt && <del>{peso(product.compareAt)}</del>}
                </div>
                <button className="button button-outline" type="button" onClick={() => addToBag(product.id)}>Add to bag</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="transition-quote">
        <p>THREE EXPRESSIONS.</p>
        <h2>One unmistakable presence.</h2>
      </section>

      <section id="duo" className="duo-story shell" data-story-scene>
        <div className="duo-copy">
          <p className="eyebrow">THE SIGNATURE DUO</p>
          <h2>Two signatures.<br />One language.</h2>
          <p>{duo.description}</p>
          <div className="duo-price">
            <strong>{peso(duo.price)}</strong>
            {duo.compareAt && <del>{peso(duo.compareAt)}</del>}
          </div>
          <button className="button button-light" type="button" onClick={() => addToBag('duo')}>Add duo to bag</button>
        </div>
        <figure>
          <img src={duo.image} alt="LACOMUS Blue Sapphire and Pink Sapphire bundle" />
          <figcaption>BLUE SAPPHIRE + PINK SAPPHIRE</figcaption>
        </figure>
      </section>

      <section className="review-strip shell">
        <div>
          <p className="eyebrow">VERIFIED EXPERIENCE</p>
          <strong>4.84</strong>
          <span>★★★★★</span>
          <small>355 verified customer reviews on the current storefront.</small>
        </div>
        <blockquote>Confidence without excess.</blockquote>
      </section>

      <section className="finale">
        <div>
          <p className="eyebrow">LACOMUS / SILENT LUXURY</p>
          <h2>LEAVE<br />A TRACE.</h2>
          <p>Choose the fragrance that feels most like you, then continue to the official LACOMUS storefront for secure checkout.</p>
          <a className="button button-light" href="https://lacomusph.com/collections/all" target="_blank" rel="noreferrer">Shop the official store ↗</a>
        </div>
      </section>

      <footer className="footer shell">
        <a className="wordmark" href="#top">LACOMUS</a>
        <p>Concept revamp / scroll-controlled fragrance film / 2026</p>
        <div>
          <a href="https://lacomusph.com/policies/privacy-policy" target="_blank" rel="noreferrer">Privacy</a>
          <a href="https://lacomusph.com/policies/refund-policy" target="_blank" rel="noreferrer">Returns</a>
          <a href="https://lacomusph.com/pages/contact" target="_blank" rel="noreferrer">Contact</a>
        </div>
      </footer>

      <button
        className={`bag-scrim ${bagOpen ? 'show' : ''}`}
        aria-label="Close shopping bag"
        onClick={() => setBagOpen(false)}
      />
      <aside className={`bag-drawer ${bagOpen ? 'open' : ''}`} aria-hidden={!bagOpen}>
        <header>
          <div><span>YOUR BAG</span><h2>{bagCount ? `${bagCount} ${bagCount === 1 ? 'item' : 'items'}` : 'Empty'}</h2></div>
          <button type="button" aria-label="Close bag" onClick={() => setBagOpen(false)}>×</button>
        </header>
        <div className="bag-items">
          {bag.length === 0 ? (
            <div className="bag-empty">
              <p className="eyebrow">START WITH A SIGNATURE</p>
              <h3>Your bag is waiting.</h3>
              <a className="button button-dark" href="#collection" onClick={() => setBagOpen(false)}>Explore collection</a>
            </div>
          ) : bag.map((item) => {
            const product = allProducts.find((entry) => entry.id === item.id)!;
            return (
              <article key={item.id}>
                <img src={product.image} alt="" />
                <div>
                  <span>{product.subtitle}</span>
                  <h3>{product.name.replace('Lacomus ', '')}</h3>
                  <strong>{peso(product.price)}</strong>
                  <div className="quantity">
                    <button type="button" aria-label={`Remove one ${product.name}`} onClick={() => changeQuantity(item.id, -1)}>−</button>
                    <b>{item.quantity}</b>
                    <button type="button" aria-label={`Add one ${product.name}`} onClick={() => changeQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <footer>
          <div><span>Concept bag total</span><strong>{peso(bagTotal)}</strong></div>
          <p>Secure payment, inventory and fulfilment continue on the official LACOMUS store.</p>
          <a href="https://lacomusph.com/collections/all" target="_blank" rel="noreferrer">Continue to official store ↗</a>
        </footer>
      </aside>
    </main>
  );
}
