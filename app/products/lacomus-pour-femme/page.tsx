import FadeContent from '../../components/react-bits/FadeContent';
import DepthCarousel from '../../components/react-bits/DepthCarousel';
import ReviewsSection from './ReviewsSection';
import styles from './product-femme.module.css';

const OFFICIAL_PRODUCT = 'https://lacomusph.com/products/lacomus-pour-femme';

const productImages = [
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/17891e69-12d7-49a7-ac06-132282220e8e.png',
  'https://lacomusph.com/cdn/shop/files/lacomus-lifestyle-photography-05.jpg?v=1777665172&width=2400',
  'https://lacomusph.com/cdn/shop/files/lacomus-lifestyle-photography-08.jpg?v=1777665186&width=2400',
  'https://lacomusph.com/cdn/shop/files/lacomus-lifestyle-photography-07.jpg?v=1777665185&width=2400',
  'https://lacomusph.com/cdn/shop/files/lacomus-brand-lifestyle-social-media-photo.png?v=1777665175&width=2400',
];

const carouselItems = productImages.slice(0, 4).map((image, index) => ({
  image,
  alt: `LACOMUS Pink Sapphire product portrait ${index + 1}`,
}));

const scentActs = [
  {
    number: 'ACT I / THE ARRIVAL',
    title: 'Bright\nwith intrigue.',
    copy: 'A polished first impression with almond, coffee and citrus brightness, sharpened by pink pepper and clove.',
    notes: 'Almond · Coffee · Bergamot · Lemon · Pink Pepper · Cloves · Orange Blossom',
    image: productImages[2],
  },
  {
    number: 'ACT II / THE HEART',
    title: 'Floral\nwith depth.',
    copy: 'White florals and rose open into a richer, textural middle—soft enough to stay close, expressive enough to be remembered.',
    notes: 'Jasmine Sambac · Tuberose · Orris · Bulgarian Rose · Chestnut · Guaiac Wood · Juniper',
    image: productImages[3],
  },
  {
    number: 'ACT III / THE MEMORY',
    title: 'Warm\nwithout excess.',
    copy: 'Tonka, cacao, vanilla and woods settle into a quiet trail of amber, musk and cashmere warmth.',
    notes: 'Tonka Bean · Cacao · Vanilla · Sandalwood · Amber · Musk · Patchouli · Cashmere Wood',
    image: productImages[4],
  },
];

export default function PourFemmePage() {
  return (
    <main className={styles.page}>
      <div className={styles.delivery}>2–4 DAYS DELIVERY NATIONWIDE</div>

      <header className={styles.topbar}>
        <a className={styles.wordmark} href="/">LACOMUS</a>
        <nav aria-label="Pink Sapphire navigation">
          <a href="#story">Story</a>
          <a href="#notes">Scent</a>
          <a href="#reviews">Reviews</a>
        </nav>
        <a className={styles.shop} href={OFFICIAL_PRODUCT} target="_blank" rel="noreferrer">Official shop ↗</a>
      </header>

      <section className={styles.hero}>
        <div className={styles.carouselStage} aria-label="LACOMUS Pink Sapphire product gallery">
          <DepthCarousel
            items={carouselItems}
            cardWidth={455}
            cardHeight={590}
            radius={2}
            tint="#18090c"
            depth={180}
            spread={88}
            tilt={12}
            tiltDirection="right"
            perspective={1700}
            visibleCards={3}
            falloff={0.12}
            blur={1.8}
            duration={820}
            ease="power3.out"
            loop
            showControls
            showIndicators={false}
            wheelNavigation={false}
          />
        </div>

        <aside className={styles.productPanel}>
          <FadeContent blur={false} duration={0.75} threshold={0.12}>
            <div className={styles.productPanelInner}>
              <div className={styles.kicker}>POUR FEMME / EAU DE PARFUM</div>
              <h1>Pink<br />Sapphire</h1>
              <p className={styles.mood}>Elegant · Warm · Captivating</p>

              <p className={styles.heroStory}>A quiet signature for the woman who carries softness with confidence—warm, polished and unforgettable without asking for attention.</p>

              <div className={styles.ratingLine}>
                <strong>★★★★★</strong>
                <span>4.8 / 5 · 355 customer reviews</span>
              </div>

              <div className={styles.commerce}>
                <div>
                  <div className={styles.price}>₱1,299.00</div>
                  <div className={styles.shipping}>Free shipping nationwide</div>
                </div>
                <a className={styles.primaryCta} href={OFFICIAL_PRODUCT} target="_blank" rel="noreferrer">Shop Pink Sapphire ↗</a>
              </div>

              <div className={styles.microLinks}>
                <a href="#notes">Experience the scent</a>
                <a href="#reviews">Customer voices</a>
              </div>
            </div>
          </FadeContent>
        </aside>
      </section>

      <section className={styles.manifesto} id="story">
        <FadeContent blur={false} duration={0.85} threshold={0.18}>
          <div className={styles.manifestoInner}>
            <p className={styles.manifestoLabel}>THE SIGNATURE / SOFT POWER</p>
            <h2>Grace<br />with presence.</h2>
            <p className={styles.manifestoCopy}>Not loud. Not fleeting. Pink Sapphire leaves a composed, feminine trail designed to stay close and be remembered.</p>
          </div>
        </FadeContent>
      </section>

      <section className={styles.cinematic} aria-label="Pink Sapphire cinematic portrait">
        <img src={productImages[0]} alt="LACOMUS Pink Sapphire resting on warm black fabric with jewelry" />
        <div className={styles.cinematicCopy}>
          <span>LACOMUS / PINK SAPPHIRE / POUR FEMME</span>
          <h3>Soft light.<br />Lasting impression.</h3>
        </div>
      </section>

      <section className={styles.journey} id="notes">
        <div className={styles.journeyHeader}>
          <p>OLFACTIVE COMPOSITION / THREE ACTS</p>
          <h2>The scent<br />unfolds slowly.</h2>
        </div>

        <div className={styles.acts}>
          {scentActs.map((act) => (
            <article className={styles.act} key={act.number}>
              <figure className={styles.actImage}>
                <img src={act.image} alt={`Pink Sapphire ${act.number.toLowerCase()}`} loading="lazy" />
              </figure>
              <div className={styles.actCopy}>
                <span className={styles.actIndex}>{act.number}</span>
                <h3>{act.title.split('\n').map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</h3>
                <p>{act.copy}</p>
                <span className={styles.actNotes}>{act.notes}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.bottlePortrait} aria-label="Pink Sapphire bottle portrait">
        <figure>
          <img src={productImages[1]} alt="LACOMUS Pink Sapphire Eau de Parfum bottle portrait" loading="lazy" />
          <figcaption className={styles.portraitMeta}>
            <span>LACOMUS / PINK SAPPHIRE</span>
            <span>POUR FEMME / EAU DE PARFUM</span>
          </figcaption>
        </figure>
      </section>

      <section className={styles.details}>
        <div className={styles.detailsIntro}>
          <p>PRODUCT RITUAL / CARE</p>
          <h2>Keep the<br />signature close.</h2>
        </div>
        <div className={styles.accordions}>
          <details open>
            <summary>Description <span>+</span></summary>
            <p>LACOMUS Pour Femme combines almond, coffee, bergamot, lemon, pink pepper, cloves and orange blossom with jasmine sambac, tuberose, orris, rose and woods, then settles into tonka bean, cacao, vanilla, sandalwood, amber, musk, patchouli and cashmere woods.</p>
          </details>
          <details>
            <summary>Care <span>+</span></summary>
            <p>Keep away from direct sunlight and heat. Store upright in a cool, dry place and close the cap tightly after use.</p>
          </details>
          <details>
            <summary>Shipping & returns <span>+</span></summary>
            <p>Orders are typically processed within 24–48 hours, excluding Sundays and holidays. For damaged or incorrect items, contact the official store promptly and keep an unboxing video when possible.</p>
          </details>
        </div>
      </section>

      <div id="reviews">
        <ReviewsSection />
      </div>

      <footer className={styles.footer}>
        <a className={styles.wordmark} href="/">LACOMUS</a>
        <p>Pink Sapphire / Pour Femme</p>
        <a href="/#collection">Return to collection ↑</a>
      </footer>
    </main>
  );
}
