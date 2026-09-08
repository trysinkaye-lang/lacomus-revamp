'use client';

import { useEffect, useMemo, useState } from 'react';
import { allProducts, duo, peso, products, type Product, type ProductId } from './data';

type BagItem = { id: ProductId; quantity: number };

const heroImage = 'https://lacomusph.com/cdn/shop/files/lacomus-lifestyle-photography-10.jpg?v=1777665204&width=2200';

const faqs = [
  ['Are Lacomus perfumes authentic?', 'Purchase through the official LACOMUS website or authorised selling channels to protect the authenticity of your order.'],
  ['What does Lacomus perfume smell like?', 'Each fragrance is designed to develop in stages, opening with a distinct first impression before settling into a deeper personal trail.'],
  ['How long does the fragrance last?', 'Longevity varies with skin chemistry, weather, environment and application. Pulse points such as the wrists and neck are recommended.'],
  ['How should I apply and store my fragrance?', 'Apply to clean skin, avoid rubbing after spraying, and store the bottle in a cool, dry place away from direct sunlight and heat.'],
  ['How do I place an order?', 'Choose a fragrance, add it to your bag, continue to the official LACOMUS checkout, then complete your shipping and payment information.'],
  ['Do you accept Cash on Delivery?', 'Cash on Delivery may be available for eligible Philippine locations, subject to courier coverage and order verification.'],
  ['Do you offer free shipping?', 'Free standard shipping may be available for eligible orders or promotions. Final shipping charges are confirmed during checkout.'],
  ['How long does delivery take?', 'Delivery timing depends on location and courier conditions. The storefront currently advertises nationwide delivery and sends tracking after dispatch.'],
  ['How can I track my order?', 'Tracking details are sent using the contact information provided at checkout once the parcel has been dispatched.'],
  ['Can I return or refund my order?', 'Returns and refunds are handled according to the current LACOMUS Return and Refund Policy and its eligibility requirements.'],
];

const showcaseProducts: Product[] = [products[0], products[1], duo];

export default function Home() {
  const [bag, setBag] = useState<BagItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const saved = localStorage.getItem('lacomus-bag');
    if (!saved) return;
    try { setBag(JSON.parse(saved)); }
    catch { localStorage.removeItem('lacomus-bag'); }
  }, []);

  useEffect(() => { localStorage.setItem('lacomus-bag', JSON.stringify(bag)); }, [bag]);

  useEffect(() => {
    document.body.style.overflow = bagOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [bagOpen]);

  useEffect(() => {
    let raf = 0;
    const paint = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty('--progress', String(max > 0 ? scrollY / max : 0));
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

  function add(id: ProductId) {
    setBag((current) => current.some((item) => item.id === id)
      ? current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { id, quantity: 1 }]);
    setBagOpen(true);
  }

  function change(id: ProductId, delta: number) {
    setBag((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  }

  return (
    <main>
      <div className="progress" aria-hidden="true" />

      <div className="announcement">2–4 DAYS DELIVERY NATIONWIDE</div>

      <header className="site-header shell">
        <a className="wordmark" href="#top">LACOMUS</a>
        <nav aria-label="Primary navigation">
          <a href="#top">Home</a>
          <a href="#collection">Catalogue</a>
          <a href="#story">The Story of Lacomus</a>
          <a href="#contact">Contact Us</a>
        </nav>
        <button className="bag-link" onClick={() => setBagOpen(true)}>Bag <span>{count}</span></button>
      </header>

      <section id="top" className="home-hero shell">
        <div className="home-hero-copy">
          <p className="kicker">AFFORDABLE · SILENT · LUXURY</p>
          <h1>LACOMUS</h1>
          <p className="hero-text">Affordable luxury eau de parfum created for elegant daily wear, long-lasting presence and refined scent experiences.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#collection">Shop now</a>
            <a className="text-link" href="#story">Discover the story →</a>
          </div>
        </div>
        <figure className="home-hero-media">
          <img src={heroImage} alt="LACOMUS fragrance campaign" />
          <figcaption>EAU DE PARFUM · PHILIPPINES</figcaption>
        </figure>
      </section>

      <section className="brand-values shell" aria-label="Brand values">
        <div><span>01</span><strong>Quiet confidence</strong><p>A fragrance presence designed to be remembered without feeling overstated.</p></div>
        <div><span>02</span><strong>Everyday luxury</strong><p>Elevated presentation and scent character at a more accessible price point.</p></div>
        <div><span>03</span><strong>Made to stay</strong><p>Signature eau de parfum expressions for daily wear, occasions and personal rituals.</p></div>
      </section>

      <section className="emerald-feature">
        <div className="emerald-inner shell">
          <div className="emerald-copy">
            <p className="kicker">THE EMERALD EDITION · PRE-ORDER</p>
            <h2>Emerald<br />Pour Homme</h2>
            <p>A deeper expression of quiet power — fresh spice, cacao, mint, oud, amber and woods.</p>
            <div className="price-line"><del>{peso(1299)}</del><strong>{peso(products[2].price)}</strong></div>
            <span className="offer-note">PRE-ORDER PRICE FOR THE 1ST 100 ORDERS</span>
            <div className="hero-actions">
              <button className="button button-light" onClick={() => add('emerald')}>Add to bag</button>
              <a className="text-link light-link" href={products[2].url} target="_blank" rel="noreferrer">View Emerald →</a>
            </div>
          </div>
          <div className="emerald-media"><img src={products[2].image} alt="Lacomus Emerald Pour Homme" /></div>
        </div>
      </section>

      <section className="signature-section shell">
        <div className="section-heading">
          <p className="kicker">THE SIGNATURES</p>
          <h2>For him. For her.<br />Distinct by design.</h2>
        </div>
        <div className="signature-grid">
          <a className="signature-card" href={products[0].url} target="_blank" rel="noreferrer">
            <img src={products[0].image} alt="Lacomus Blue Sapphire Pour Homme" />
            <div><span>POUR HOMME</span><h3>Blue Sapphire</h3><p>Fresh, clean, sporty and masculine.</p><b>Discover Homme →</b></div>
          </a>
          <a className="signature-card" href={products[1].url} target="_blank" rel="noreferrer">
            <img src={products[1].image} alt="Lacomus Pink Sapphire Pour Femme" />
            <div><span>POUR FEMME</span><h3>Pink Sapphire</h3><p>Feminine, elegant, soft and captivating.</p><b>Discover Femme →</b></div>
          </a>
        </div>
      </section>

      <section className="gallery-section shell">
        <div className="section-heading compact-heading"><p className="kicker">THE GALLERY</p><h2>Fragrance, in focus.</h2></div>
        <div className="gallery-grid">
          <figure className="gallery-large"><img src={products[0].image} alt="Blue Sapphire campaign" /></figure>
          <figure><img src={products[1].image} alt="Pink Sapphire campaign" /></figure>
          <figure><img src={products[2].image} alt="Emerald campaign" /></figure>
          <figure className="gallery-wide"><img src={duo.image} alt="Blue Sapphire and Pink Sapphire bundle" /></figure>
        </div>
      </section>

      <section className="showcase-section">
        {showcaseProducts.map((product, index) => (
          <article className={`showcase shell ${index % 2 ? 'showcase-reverse' : ''}`} key={product.id}>
            <div className="showcase-media"><img src={product.image} alt={product.name} /></div>
            <div className="showcase-copy">
              <p className="kicker">{product.subtitle}</p>
              <h2>{product.name}</h2>
              <p className="mood">{product.mood}</p>
              <p>{product.description}</p>
              <div className="showcase-notes">
                {product.id !== 'duo' && <><span>OPEN · {product.notes[0]}</span><span>HEART · {product.notes[1]}</span><span>TRAIL · {product.notes[2]}</span></>}
              </div>
              <div className="showcase-buy">
                <div><strong>{peso(product.price)}</strong>{product.compareAt && <del>{peso(product.compareAt)}</del>}<small>Free Shipping Nationwide</small></div>
                <button className="button button-dark" onClick={() => add(product.id)}>Add to bag</button>
              </div>
              <a className="text-link" href={product.url} target="_blank" rel="noreferrer">View product details →</a>
            </div>
          </article>
        ))}
      </section>

      <section className="reviews-strip shell">
        <div><p className="kicker">CUSTOMERS ARE SAYING</p><strong>4.84</strong><span>★★★★★</span><small>355 verified customer reviews</small></div>
        <blockquote>Confidence without excess.</blockquote>
      </section>

      <section id="collection" className="collection-section shell">
        <div className="section-heading"><p className="kicker">THE COLLECTION</p><h2>Choose your signature.</h2></div>
        <div className="collection-grid">
          {[duo, ...products].map((product) => (
            <article className="product-card" key={product.id}>
              <a href={product.url} target="_blank" rel="noreferrer" className="product-image"><img src={product.image} alt={product.name} /></a>
              <div className="product-card-body">
                <span>{product.subtitle}</span>
                <h3>{product.name}</h3>
                <div className="card-price"><strong>{peso(product.price)}</strong>{product.compareAt && <del>{peso(product.compareAt)}</del>}</div>
                <button onClick={() => add(product.id)}>Add to bag +</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="story" className="story-section">
        <div className="story-inner shell">
          <p className="kicker">THE STORY OF LACOMUS</p>
          <h2>Luxury should feel close, considered and personal.</h2>
          <div className="story-columns">
            <p>LACOMUS is positioned around silent luxury: fragrance that does not need to compete for attention to leave an impression.</p>
            <p>The revamp keeps that original identity, but gives the storefront cleaner hierarchy, more breathing room and stronger product visibility.</p>
          </div>
          <a className="button button-light" href="https://lacomusph.com/pages/aboutus" target="_blank" rel="noreferrer">Read the LACOMUS story</a>
        </div>
      </section>

      <section className="faq-section shell">
        <div className="faq-heading"><p className="kicker">LACOMUS</p><h2>Frequently Asked Questions</h2><p>Everything you may want to know before experiencing Lacomus.</p></div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => {
            const open = openFaq === index;
            return (
              <div className={`faq-item ${open ? 'open' : ''}`} key={question}>
                <button onClick={() => setOpenFaq(open ? null : index)} aria-expanded={open}>
                  <span>{String(index + 1).padStart(2, '0')}</span><strong>{question}</strong><i>{open ? '−' : '+'}</i>
                </button>
                <div className="faq-answer"><p>{answer}</p></div>
              </div>
            );
          })}
        </div>
      </section>

      <footer id="contact" className="site-footer">
        <div className="footer-inner shell">
          <div><a className="footer-wordmark" href="#top">LACOMUS</a><p>Affordable. Silent. Luxury.</p></div>
          <div><strong>Shop</strong><a href="https://lacomusph.com/collections/all" target="_blank" rel="noreferrer">Catalogue</a><a href="https://lacomusph.com/pages/aboutus" target="_blank" rel="noreferrer">About us</a></div>
          <div><strong>Client care</strong><a href="https://lacomusph.com/pages/contact" target="_blank" rel="noreferrer">Contact</a><a href="https://lacomusph.com/policies/shipping-policy" target="_blank" rel="noreferrer">Shipping</a><a href="https://lacomusph.com/policies/refund-policy" target="_blank" rel="noreferrer">Returns</a></div>
          <div><strong>Official storefront</strong><p>Secure payment, order processing and fulfilment continue through lacomusph.com.</p><a className="text-link light-link" href="https://lacomusph.com/" target="_blank" rel="noreferrer">Visit official store →</a></div>
        </div>
        <div className="footer-bottom shell"><span>© 2026 LACOMUS CONCEPT REVAMP</span><a href="https://lacomusph.com/policies/terms-of-service" target="_blank" rel="noreferrer">Terms & Policies</a></div>
      </footer>

      <div className={`drawer-scrim ${bagOpen ? 'show' : ''}`} onClick={() => setBagOpen(false)} />
      <aside className={`bag-drawer ${bagOpen ? 'open' : ''}`} aria-hidden={!bagOpen}>
        <header><div><span>YOUR BAG</span><h2>{count ? `${count} ${count === 1 ? 'item' : 'items'}` : 'Your bag is empty'}</h2></div><button onClick={() => setBagOpen(false)} aria-label="Close bag">×</button></header>
        <div className="bag-items">
          {bag.length === 0 ? <div className="empty-bag"><p>Choose a fragrance from the collection to begin.</p><button className="button button-dark" onClick={() => setBagOpen(false)}>Continue shopping</button></div> : bag.map((item) => {
            const product = allProducts.find((p) => p.id === item.id)!;
            return <article key={item.id}><img src={product.image} alt="" /><div><span>{product.subtitle}</span><h3>{product.name}</h3><strong>{peso(product.price)}</strong><div className="quantity"><button onClick={() => change(item.id, -1)}>−</button><b>{item.quantity}</b><button onClick={() => change(item.id, 1)}>+</button></div></div></article>;
          })}
        </div>
        <footer><div><span>Concept bag total</span><strong>{peso(total)}</strong></div><p>Final pricing, stock, shipping and payment are confirmed by the official LACOMUS checkout.</p><a href="https://lacomusph.com/collections/all" target="_blank" rel="noreferrer">Continue to official checkout →</a></footer>
      </aside>
    </main>
  );
}
