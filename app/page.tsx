'use client';

import { useEffect, useMemo, useState } from 'react';
import { allProducts, duo, peso, products, type ProductId } from './data';

type BagItem = { id: ProductId; quantity: number };

const filmChapters = [
  {
    image: products[0].image,
    eyebrow: 'LACOMUS / FILM 01',
    title: 'SILENT LUXURY.',
    copy: 'Blue Sapphire enters through shadow, cold light and controlled presence.',
  },
  {
    image: products[1].image,
    eyebrow: 'LACOMUS / FILM 02',
    title: 'SOFT POWER.',
    copy: 'Pink Sapphire shifts the atmosphere into blush light, warmth and restraint.',
  },
  {
    image: products[2].image,
    eyebrow: 'LACOMUS / FILM 03',
    title: 'QUIET POWER.',
    copy: 'Emerald moves deeper: dark green reflections, spice, woods and depth.',
  },
  {
    image: duo.image,
    eyebrow: 'LACOMUS / FILM 04',
    title: 'TWO SIGNATURES. ONE LANGUAGE.',
    copy: 'The story closes with Blue and Pink together — distinct, balanced, unmistakable.',
  },
];

export default function Home() {
  const [bag, setBag] = useState<BagItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [finderOpen, setFinderOpen] = useState(false);
  const [match, setMatch] = useState<ProductId>('blue');

  useEffect(() => {
    const saved = localStorage.getItem('lacomus-bag');
    if (saved) {
      try { setBag(JSON.parse(saved)); }
      catch { localStorage.removeItem('lacomus-bag'); }
    }
  }, []);

  useEffect(() => { localStorage.setItem('lacomus-bag', JSON.stringify(bag)); }, [bag]);

  useEffect(() => {
    document.body.style.overflow = bagOpen || finderOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [bagOpen, finderOpen]);

  useEffect(() => {
    let raf = 0;
    const clamp = (n: number) => Math.min(1, Math.max(0, n));

    const paint = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty('--progress', String(max > 0 ? scrollY / max : 0));

      document.querySelectorAll<HTMLElement>('[data-scene]').forEach((el) => {
        const r = el.getBoundingClientRect();
        const p = clamp((innerHeight - r.top) / (r.height + innerHeight));
        el.style.setProperty('--p', String(p));
      });

      document.querySelectorAll<HTMLElement>('[data-film-track]').forEach((track) => {
        const r = track.getBoundingClientRect();
        const scrollable = Math.max(1, r.height - innerHeight);
        const p = clamp(-r.top / scrollable);
        const frames = Array.from(track.querySelectorAll<HTMLElement>('[data-film-frame]'));
        const copies = Array.from(track.querySelectorAll<HTMLElement>('[data-film-copy]'));
        const position = p * Math.max(1, frames.length - 1);

        track.style.setProperty('--film', String(p));
        track.style.setProperty('--film-position', String(position));

        frames.forEach((node, index) => {
          const distance = Math.abs(position - index);
          const opacity = clamp(1 - distance * 1.22);
          const focus = clamp(1 - distance);
          const drift = (index - position) * (index % 2 === 0 ? 1.6 : -1.6);
          const scale = 1.08 + focus * 0.055 + p * 0.018;
          node.style.opacity = String(opacity);
          node.style.transform = `scale(${scale}) translate3d(${drift}%, ${drift * -0.35}%, 0)`;
          node.style.filter = `brightness(${0.72 + focus * 0.28}) saturate(${0.82 + focus * 0.22})`;
        });

        copies.forEach((node, index) => {
          const distance = Math.abs(position - index);
          const opacity = clamp(1 - distance * 1.8);
          const y = (index - position) * 44;
          node.style.opacity = String(opacity);
          node.style.transform = `translate3d(0, ${y}px, 0)`;
          node.style.pointerEvents = opacity > 0.6 ? 'auto' : 'none';
        });

        const active = Math.min(frames.length - 1, Math.max(0, Math.round(position)));
        track.dataset.active = String(active);
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };

    paint();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const count = useMemo(() => bag.reduce((n, item) => n + item.quantity, 0), [bag]);
  const total = useMemo(() => bag.reduce((sum, item) => {
    const product = allProducts.find((p) => p.id === item.id);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0), [bag]);
  const recommended = allProducts.find((p) => p.id === match) ?? products[0];

  function add(id: ProductId) {
    setBag((current) => current.some((x) => x.id === id)
      ? current.map((x) => x.id === id ? { ...x, quantity: x.quantity + 1 } : x)
      : [...current, { id, quantity: 1 }]);
    setBagOpen(true);
  }

  function change(id: ProductId, delta: number) {
    setBag((current) => current
      .map((x) => x.id === id ? { ...x, quantity: x.quantity + delta } : x)
      .filter((x) => x.quantity > 0));
  }

  return (
    <main>
      <div className="progress" aria-hidden="true" />

      <header className="nav shell">
        <a className="brand" href="#top">LACOMUS</a>
        <nav>
          <a href="#collection">Collection</a>
          <a href="#finder">Scent Finder</a>
          <a href="#story">Story</a>
          <a href="#reviews">Reviews</a>
        </nav>
        <button className="bag-button" onClick={() => setBagOpen(true)}>Bag <span>{String(count).padStart(2, '0')}</span></button>
      </header>

      <section id="top" className="film-track" data-film-track data-active="0">
        <div className="film-stage">
          <div className="film-media" aria-hidden="true">
            {filmChapters.map((chapter, index) => (
              <img
                key={chapter.title}
                data-film-frame
                className={`film-frame film-frame-${index + 1}`}
                src={chapter.image}
                alt=""
              />
            ))}
          </div>

          <div className="film-vignette" aria-hidden="true" />
          <div className="film-light" aria-hidden="true" />
          <div className="film-grain" aria-hidden="true" />
          <div className="film-scan" aria-hidden="true" />

          <div className="film-copy shell">
            {filmChapters.map((chapter, index) => (
              <div className="film-copy-card" data-film-copy key={chapter.title}>
                <p className="eyebrow">{chapter.eyebrow}</p>
                <h1>{chapter.title}</h1>
                <p className="film-lede">{chapter.copy}</p>
                {index === 0 && (
                  <div className="actions">
                    <a className="btn light" href="#collection">Discover the collection</a>
                    <button className="text-btn" onClick={() => setFinderOpen(true)}>Find my scent ↗</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="film-meta shell" aria-hidden="true">
            <span className="film-counter"><b>01</b> / 04</span>
            <div className="film-rail"><i /></div>
            <span>SCROLL TO PLAY</span>
          </div>
        </div>
      </section>

      <section id="story" className="manifesto shell">
        <p className="eyebrow">THE PHILOSOPHY</p>
        <div>
          <h2>Luxury does not need to shout.</h2>
          <p>The experience now behaves like a scroll-controlled brand film: image, typography, lighting and pacing move together instead of behaving like ordinary product cards.</p>
        </div>
      </section>

      <section id="collection" className="collection-intro shell">
        <p className="eyebrow">THE COLLECTION</p>
        <h2>Find your signature.</h2>
        <span>03 / SIGNATURES</span>
      </section>

      {products.map((product) => (
        <article className={`scene scene-${product.id}`} key={product.id} data-scene>
          <img src={product.image} alt={`${product.name} fragrance campaign`} />
          <div className="scene-shade" />
          <div className="scene-copy shell">
            <span className="scene-no">{product.index}</span>
            <div>
              <p className="eyebrow">{product.subtitle}</p>
              <h2>{product.name}</h2>
              <p className="mood">{product.mood}</p>
              <p className="desc">{product.description}</p>
              <div className="price"><strong>{peso(product.price)}</strong>{product.compareAt && <del>{peso(product.compareAt)}</del>}</div>
              <div className="actions">
                <button className="btn ghost" onClick={() => add(product.id)}>Add to bag</button>
                <a className="text-btn" href={product.url} target="_blank" rel="noreferrer">Full details ↗</a>
              </div>
            </div>
          </div>
        </article>
      ))}

      <section className="notes shell">
        <div className="section-head">
          <p className="eyebrow">OLFACTIVE ARCHITECTURE</p>
          <h2>Read fragrance like a composition.</h2>
        </div>
        <div className="notes-grid">
          {products.map((p) => (
            <article key={p.id}>
              <span>{p.index}</span>
              <h3>{p.name}</h3>
              <dl>
                <div><dt>OPEN</dt><dd>{p.notes[0]}</dd></div>
                <div><dt>HEART</dt><dd>{p.notes[1]}</dd></div>
                <div><dt>TRAIL</dt><dd>{p.notes[2]}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section id="finder" className="finder shell">
        <div>
          <p className="eyebrow">SCENT FINDER / 30 SECONDS</p>
          <h2>Start with a feeling.</h2>
          <p>Choose the presence you want to leave behind. We’ll point you toward the closest LACOMUS signature.</p>
          <button className="btn dark" onClick={() => setFinderOpen(true)}>Find my signature</button>
        </div>
        <div className="finder-orbit" aria-hidden="true"><span>FRESH</span><span>WARM</span><span>DEEP</span><span>SOFT</span><b>L</b></div>
      </section>

      <section className="interlude"><p>THREE EXPRESSIONS.</p><h2>One unmistakable presence.</h2></section>

      <section className="duo shell" data-scene>
        <div>
          <p className="eyebrow">THE SIGNATURE DUO</p>
          <h2>Two signatures.<br />One language.</h2>
          <p>{duo.description}</p>
          <div className="price dark-price"><strong>{peso(duo.price)}</strong><del>{peso(duo.compareAt ?? duo.price)}</del></div>
          <button className="btn dark" onClick={() => add('duo')}>Add duo to bag</button>
        </div>
        <figure><img src={duo.image} alt="LACOMUS Signature Duo" /><figcaption>LACOMUS / BLUE + PINK SAPPHIRE</figcaption></figure>
      </section>

      <section id="reviews" className="reviews shell">
        <div><p className="eyebrow">VERIFIED EXPERIENCE</p><strong>4.84</strong><span>★★★★★</span><p>355 verified customer reviews on the current LACOMUS storefront.</p></div>
        <blockquote>“The strongest luxury signal is confidence without excess.”</blockquote>
      </section>

      <section className="service shell">
        <div className="section-head"><p className="eyebrow">SERVICE, WITHOUT THE NOISE</p><h2>Confidence after checkout.</h2></div>
        <div className="service-grid">
          <article><span>01</span><h3>Nationwide delivery</h3><p>Current store messaging advertises delivery across the Philippines, with final shipping details handled at checkout.</p></article>
          <article><span>02</span><h3>Order tracking</h3><p>Tracking information is sent after dispatch using the contact details supplied during checkout.</p></article>
          <article><span>03</span><h3>Customer support</h3><p>Policy and contact links remain one click away without interrupting the brand experience.</p></article>
        </div>
      </section>

      <section className="finale">
        <div><p className="eyebrow">YOUR NEXT SIGNATURE</p><h2>LEAVE<br />A TRACE.</h2><p>Choose the fragrance that feels most like you — then let the official LACOMUS store handle secure purchasing.</p><div className="actions center"><button className="btn light" onClick={() => setFinderOpen(true)}>Find my scent</button><a className="btn outline" href="https://lacomusph.com/collections/all" target="_blank" rel="noreferrer">Shop official store ↗</a></div></div>
      </section>

      <footer className="footer shell">
        <a className="brand" href="#top">LACOMUS</a>
        <p>Concept revamp / cinematic commerce / 2026</p>
        <div><a href="https://lacomusph.com/policies/privacy-policy" target="_blank" rel="noreferrer">Privacy</a><a href="https://lacomusph.com/policies/refund-policy" target="_blank" rel="noreferrer">Returns</a><a href="https://lacomusph.com/pages/contact" target="_blank" rel="noreferrer">Contact</a></div>
      </footer>

      <div className={`scrim ${bagOpen ? 'show' : ''}`} onClick={() => setBagOpen(false)} />
      <aside className={`drawer ${bagOpen ? 'open' : ''}`} aria-hidden={!bagOpen}>
        <header><div><p className="eyebrow">YOUR BAG</p><h2>{count ? `${count} ${count === 1 ? 'item' : 'items'}` : 'Empty'}</h2></div><button onClick={() => setBagOpen(false)} aria-label="Close bag">×</button></header>
        <div className="bag-list">
          {bag.length === 0 ? (
            <div className="empty"><h3>Start with a signature.</h3><button className="btn dark" onClick={() => { setBagOpen(false); setFinderOpen(true); }}>Use scent finder</button></div>
          ) : bag.map((item) => {
            const p = allProducts.find((x) => x.id === item.id)!;
            return <article key={item.id}><img src={p.image} alt="" /><div><p className="eyebrow">{p.subtitle}</p><h3>{p.name}</h3><strong>{peso(p.price)}</strong><div className="qty"><button onClick={() => change(item.id, -1)} aria-label={`Remove one ${p.name}`}>−</button><span>{item.quantity}</span><button onClick={() => change(item.id, 1)} aria-label={`Add one ${p.name}`}>+</button></div><a href={p.url} target="_blank" rel="noreferrer">Buy this fragrance ↗</a></div></article>;
          })}
        </div>
        <footer><div><span>Concept bag total</span><strong>{peso(total)}</strong></div><p>Secure checkout continues on the official LACOMUS storefront.</p><a className="checkout" href="https://lacomusph.com/collections/all" target="_blank" rel="noreferrer">Continue to official store ↗</a></footer>
      </aside>

      {finderOpen && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="finder-title">
          <div className="modal-card">
            <button className="close" onClick={() => setFinderOpen(false)} aria-label="Close scent finder">×</button>
            <p className="eyebrow">SCENT FINDER</p>
            <h2 id="finder-title">What should your presence feel like?</h2>
            <div className="choices">
              {[
                ['blue', 'Fresh & precise', 'Clean citrus, marine freshness, smooth woods.'],
                ['pink', 'Elegant & warm', 'Coffee, florals, cacao, vanilla and soft woods.'],
                ['emerald', 'Deep & distinctive', 'Spice, cacao, mint, oud, amber and woods.'],
                ['duo', 'I want both', 'Two signatures in one paired set.'],
              ].map(([id, title, copy]) => (
                <button key={id} className={match === id ? 'selected' : ''} onClick={() => setMatch(id as ProductId)}>
                  <strong>{title}</strong><span>{copy}</span>
                </button>
              ))}
            </div>
            <div className="match"><div><p className="eyebrow">YOUR MATCH</p><h3>{recommended.name}</h3><span>{recommended.mood}</span></div><div><strong>{peso(recommended.price)}</strong><button className="btn dark" onClick={() => { add(recommended.id); setFinderOpen(false); }}>Add match to bag</button></div></div>
          </div>
        </div>
      )}
    </main>
  );
}
