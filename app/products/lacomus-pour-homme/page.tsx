import FadeContent from '../../components/react-bits/FadeContent';
import DepthCarousel from '../../components/react-bits/DepthCarousel';
import styles from './product.module.css';

const OFFICIAL_PRODUCT = 'https://lacomusph.com/products/lacomus-pour-homme';

const productImages = [
  'https://lacomusph.com/cdn/shop/files/pourhommenew.jpg?v=1779268404&width=2400',
  'https://lacomusph.com/cdn/shop/files/5.png?v=1779466411&width=2400',
  'https://lacomusph.com/cdn/shop/files/4.png?v=1779466411&width=2400',
  'https://lacomusph.com/cdn/shop/files/7.png?v=1779466411&width=2400',
  'https://lacomusph.com/cdn/shop/files/pourhommenew_bb45ed1f-e0c4-487a-8082-9ea862807ce7.jpg?v=1779466410&width=2400',
  'https://lacomusph.com/cdn/shop/files/6.png?v=1779466411&width=2400',
];

const carouselItems = productImages.slice(0, 4).map((image, index) => ({
  image,
  alt: `LACOMUS Pour Homme product view ${index + 1}`,
}));

const notes = [
  { label: 'Open', value: 'Bergamot · Lemon · Coffee · Bitter Orange' },
  { label: 'Heart', value: 'Lavender · Geranium · Marine Accord · Tonka Bean' },
  { label: 'Trail', value: 'Cedarwood · Amber · Vanilla · Musk' },
];

export default function PourHommePage() {
  return (
    <main className={styles.page}>
      <div className={styles.delivery}>2–4 DAYS DELIVERY NATIONWIDE</div>

      <header className={styles.topbar}>
        <a className={styles.wordmark} href="/">LACOMUS</a>
        <nav aria-label="Product navigation">
          <a href="/#james">James Torres</a>
          <a href="/#collection">Collection</a>
          <a href="/#gallery">Gallery</a>
        </nav>
        <a className={styles.shop} href={OFFICIAL_PRODUCT} target="_blank" rel="noreferrer">Official shop ↗</a>
      </header>

      <section className={styles.hero}>
        <div aria-label="LACOMUS Pour Homme product gallery">
          <DepthCarousel
            items={carouselItems}
            cardWidth={470}
            cardHeight={600}
            radius={4}
            tint="#07111d"
            depth={205}
            spread={96}
            tilt={18}
            tiltDirection="right"
            perspective={1600}
            visibleCards={3}
            falloff={0.17}
            blur={2.6}
            duration={760}
            ease="power3.out"
            loop
            showControls
            showIndicators
            wheelNavigation={false}
          />
        </div>

        <aside className={styles.productPanel}>
          <FadeContent blur={false} duration={0.7} threshold={0.12}>
            <div className={styles.kicker}>POUR HOMME / EAU DE PARFUM</div>
            <h1>Blue<br />Sapphire</h1>
            <p className={styles.mood}>Fresh · Clean · Sporty · Masculine</p>

            <div className={styles.rating}>
              <span>★★★★★</span>
              <p>Rated 4.9/5 · 332 customer reviews</p>
            </div>

            <div className={styles.price}>₱1,299.00</div>
            <p className={styles.shipping}>Free Shipping Nationwide</p>

            <div className={styles.actions}>
              <a className={styles.primaryCta} href={OFFICIAL_PRODUCT} target="_blank" rel="noreferrer">Buy on official store ↗</a>
              <a className={styles.secondaryCta} href="/#collection">Back to collection</a>
            </div>

            <p className={styles.intro}>For the man who does not chase attention — he commands it. A fresh opening, a refined aromatic heart, and a deep trail designed to stay close while leaving a precise impression.</p>

            <div className={styles.noteGrid}>
              {notes.map((note, index) => (
                <div className={styles.note} key={note.label}>
                  <span>0{index + 1} / {note.label}</span>
                  <p>{note.value}</p>
                </div>
              ))}
            </div>

            <div className={styles.accordions}>
              <details open>
                <summary>Description <span>+</span></summary>
                <p>LACOMUS Pour Homme opens with bergamot, lemon, coffee and bitter orange, moves into lavender, geranium, marine accord and tonka bean, then settles into cedarwood, amber, vanilla and musk. It is designed for everyday wear with a balance of freshness, depth and quiet power.</p>
              </details>
              <details>
                <summary>Care <span>+</span></summary>
                <p>Keep away from sunlight and heat. Store in a cool, dry place, close the cap tightly after use, do not shake the bottle, and keep it upright.</p>
              </details>
              <details>
                <summary>Shipping & returns <span>+</span></summary>
                <p>Orders are typically processed within 24–48 hours, excluding Sundays and holidays. For damaged or incorrect items, the official store asks customers to contact them within 48 hours and recommends recording an unboxing video.</p>
              </details>
            </div>
          </FadeContent>
        </aside>
      </section>

      <section className={styles.manifesto}>
        <FadeContent blur={false} duration={0.8} threshold={0.2}>
          <p>THE SIGNATURE / QUIET POWER</p>
          <h2>Presence<br />without excess.</h2>
          <span>Freshness up front. Depth in the trail. Built for the man who prefers precision over noise.</span>
        </FadeContent>
      </section>

      <section className={styles.editorial}>
        {productImages.slice(4).map((src, index) => (
          <figure key={src}>
            <img src={src} alt={`LACOMUS Pour Homme editorial view ${index + 1}`} loading="lazy" />
          </figure>
        ))}
      </section>

      <section className={styles.reviews}>
        <div>
          <p>VERIFIED REVIEWS</p>
          <h2>4.9 / 5</h2>
        </div>
        <div className={styles.reviewCopy}>
          <strong>332 customer reviews on the official LACOMUS product page.</strong>
          <p>We keep the revamp focused on the product experience and send purchases and the complete verified-review feed to LACOMUS’ official storefront.</p>
          <a href={OFFICIAL_PRODUCT} target="_blank" rel="noreferrer">Read verified reviews ↗</a>
        </div>
      </section>

      <footer className={styles.footer}>
        <a className={styles.wordmark} href="/">LACOMUS</a>
        <p>Blue Sapphire / Pour Homme</p>
        <a href="/#collection">Return to collection ↑</a>
      </footer>
    </main>
  );
}
