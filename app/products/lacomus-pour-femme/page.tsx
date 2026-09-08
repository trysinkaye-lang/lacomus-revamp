import FadeContent from '../../components/react-bits/FadeContent';
import GlareHover from '../../components/react-bits/GlareHover';
import styles from '../lacomus-pour-homme/product.module.css';

const OFFICIAL_PRODUCT = 'https://lacomusph.com/products/lacomus-pour-femme';

const productImages = [
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/17891e69-12d7-49a7-ac06-132282220e8e.png',
  'https://lacomusph.com/cdn/shop/files/lacomus-lifestyle-photography-05.jpg?v=1777665172&width=2400',
  'https://lacomusph.com/cdn/shop/files/lacomus-lifestyle-photography-08.jpg?v=1777665186&width=2400',
  'https://lacomusph.com/cdn/shop/files/lacomus-lifestyle-photography-07.jpg?v=1777665185&width=2400',
  'https://lacomusph.com/cdn/shop/files/lacomus-brand-lifestyle-social-media-photo.png?v=1777665175&width=2400',
];

const notes = [
  { label: 'Open', value: 'Almond · Coffee · Bergamot · Lemon · Pink Pepper · Cloves · Orange Blossom' },
  { label: 'Heart', value: 'Jasmine Sambac · Tuberose · Orris · Bulgarian Rose · Chestnut · Guaiac Wood · Juniper' },
  { label: 'Trail', value: 'Tonka Bean · Cacao · Vanilla · Sandalwood · Amber · Musk · Patchouli · Cashmere Wood' },
];

export default function PourFemmePage() {
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
        <div className={styles.gallery} aria-label="LACOMUS Pour Femme product gallery">
          {productImages.slice(0, 4).map((src, index) => (
            <figure className={`${styles.galleryCard} ${index === 0 ? styles.galleryPrimary : ''}`} key={src}>
              <GlareHover
                width="100%"
                height="100%"
                background="transparent"
                borderColor="transparent"
                borderRadius="0"
                glareOpacity={0.09}
                glareSize={180}
                transitionDuration={850}
              >
                <img src={src} alt={`LACOMUS Pour Femme product view ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} />
              </GlareHover>
              <span>{String(index + 1).padStart(2, '0')}</span>
            </figure>
          ))}
        </div>

        <aside className={styles.productPanel}>
          <FadeContent blur={false} duration={0.7} threshold={0.12}>
            <div className={styles.kicker}>POUR FEMME / EAU DE PARFUM</div>
            <h1>Pink<br />Sapphire</h1>
            <p className={styles.mood}>Elegant · Warm · Captivating</p>

            <div className={styles.rating}>
              <span>★★★★★</span>
              <p>Rated 4.8/5 · 355 customer reviews</p>
            </div>

            <div className={styles.price}>₱1,299.00</div>
            <p className={styles.shipping}>Free Shipping Nationwide</p>

            <div className={styles.actions}>
              <a className={styles.primaryCta} href={OFFICIAL_PRODUCT} target="_blank" rel="noreferrer">Buy on official store ↗</a>
              <a className={styles.secondaryCta} href="/#collection">Back to collection</a>
            </div>

            <p className={styles.intro}>Crafted for the modern woman — effortless, refined, and undeniably captivating. Pink Sapphire opens delicately, moves through a polished floral-aromatic heart, and settles into a warm, lingering base designed to stay close throughout the day.</p>

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
                <p>LACOMUS Pour Femme combines almond, coffee, bergamot, lemon, pink pepper, cloves and orange blossom with jasmine sambac, tuberose, orris, rose and woods, then settles into tonka bean, cacao, vanilla, sandalwood, amber, musk, patchouli and cashmere woods. The result is soft yet confident, refined yet memorable.</p>
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
          <p>THE SIGNATURE / SOFT POWER</p>
          <h2>Grace<br />with presence.</h2>
          <span>Warmth in the opening. Florals at the heart. A polished trail made for quiet confidence.</span>
        </FadeContent>
      </section>

      <section className={styles.editorial}>
        {productImages.slice(4).map((src, index) => (
          <figure key={src}>
            <img src={src} alt={`LACOMUS Pour Femme editorial view ${index + 1}`} loading="lazy" />
          </figure>
        ))}
      </section>

      <section className={styles.reviews}>
        <div>
          <p>VERIFIED REVIEWS</p>
          <h2>4.8 / 5</h2>
        </div>
        <div className={styles.reviewCopy}>
          <strong>355 customer reviews on the official LACOMUS product page.</strong>
          <p>The revamp keeps the product story cinematic while purchases and the complete verified-review feed remain on LACOMUS’ official storefront.</p>
          <a href={OFFICIAL_PRODUCT} target="_blank" rel="noreferrer">Read verified reviews ↗</a>
        </div>
      </section>

      <footer className={styles.footer}>
        <a className={styles.wordmark} href="/">LACOMUS</a>
        <p>Pink Sapphire / Pour Femme</p>
        <a href="/#collection">Return to collection ↑</a>
      </footer>
    </main>
  );
}
