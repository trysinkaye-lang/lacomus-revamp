import styles from './reviews.module.css';

const OFFICIAL_PRODUCT = 'https://lacomusph.com/products/lacomus-pour-femme';
const PRODUCT_ID = 8873526460552;
const REVIEW_COUNT = 355;
const AVERAGE_RATING = 4.84;

type ReviewPicture = {
  original?: string;
  small?: string;
  compact?: string;
  huge?: string;
};

type Review = {
  uuid: string;
  rating: number;
  body?: string;
  reviewer_name?: string;
  reviewer_initial?: string;
  verified_buyer?: boolean;
  created_at?: string;
  pictures_urls?: ReviewPicture[];
  product_id?: number;
};

async function getReviews(): Promise<Review[]> {
  const params = new URLSearchParams({
    reviews_selection: 'current_product',
    carousel_type: 'testimonials',
    star_rating: 'all',
    max_reviews: '20',
    url: 'https://lacomusph.com',
    shop_domain: 'wd7i0a-rq.myshopify.com',
    platform: 'shopify',
    primary_language: 'en',
    product_ids: String(PRODUCT_ID),
  });

  try {
    const response = await fetch(`https://cdn.judge.me/reviews/reviews_for_carousel?${params.toString()}`, {
      headers: {
        Referer: 'https://lacomusph.com/',
        'User-Agent': 'Mozilla/5.0',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];
    const data = (await response.json()) as { reviews?: Review[] };
    return (data.reviews ?? []).filter((review) => review.product_id === PRODUCT_ID);
  } catch {
    return [];
  }
}

function formatDate(value?: string) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Manila',
  }).format(new Date(value));
}

function stars(rating: number) {
  return '★★★★★'.slice(0, Math.max(0, Math.min(5, Math.round(rating))));
}

export default async function ReviewsSection() {
  const reviews = await getReviews();
  const visibleReviews = reviews.slice(0, 8);
  const media = reviews
    .flatMap((review) =>
      (review.pictures_urls ?? []).map((picture) => ({
        src: picture.huge || picture.original || picture.small || '',
        reviewer: review.reviewer_name || 'LACOMUS customer',
      })),
    )
    .filter((item) => item.src)
    .slice(0, 5);

  return (
    <section className={styles.section} aria-labelledby="customer-voices-title">
      <div className={styles.header}>
        <div className={styles.summary}>
          <p className={styles.eyebrow}>CUSTOMER VOICES / VERIFIED REVIEWS</p>
          <div className={styles.scoreRow}>
            <strong>{AVERAGE_RATING.toFixed(1)}</strong>
            <div>
              <span className={styles.stars}>★★★★★</span>
              <p>Based on {REVIEW_COUNT} customer reviews</p>
            </div>
          </div>
          <h2 id="customer-voices-title">Worn. Loved.<br />Remembered.</h2>
        </div>

        <div className={styles.context}>
          <p>Real feedback from the LACOMUS Pour Femme review feed.</p>
          <span>Reviews marked “Verified Buyer” are identified as verified purchases by the review provider.</span>
          <a href={OFFICIAL_PRODUCT} target="_blank" rel="noreferrer">View all {REVIEW_COUNT} on LACOMUS ↗</a>
        </div>
      </div>

      {media.length > 0 && (
        <div className={styles.mediaRail} aria-label="Customer review photos">
          {media.map((item, index) => (
            <figure key={`${item.src}-${index}`} className={styles.mediaCard}>
              <img src={item.src} alt={`Customer review photo from ${item.reviewer}`} loading="lazy" />
              <figcaption>Customer photo · {String(index + 1).padStart(2, '0')}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {visibleReviews.length > 0 ? (
        <div className={styles.reviewGrid}>
          {visibleReviews.map((review, index) => (
            <article className={styles.reviewCard} key={review.uuid}>
              <div className={styles.cardTop}>
                <span className={styles.cardStars} aria-label={`${review.rating} out of 5 stars`}>
                  {stars(review.rating)}
                </span>
                <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
              </div>

              <blockquote>“{review.body || 'Customer rating submitted for LACOMUS Pour Femme.'}”</blockquote>

              <footer>
                <div className={styles.avatar} aria-hidden="true">
                  {(review.reviewer_initial || review.reviewer_name?.[0] || 'L').toUpperCase()}
                </div>
                <div className={styles.reviewer}>
                  <strong>{review.reviewer_name || 'Anonymous'}</strong>
                  <span>{review.verified_buyer ? 'Verified Buyer' : 'Customer Review'}</span>
                </div>
                <time dateTime={review.created_at}>{formatDate(review.created_at)}</time>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.fallback}>
          <p>The live review feed is temporarily unavailable.</p>
          <a href={OFFICIAL_PRODUCT} target="_blank" rel="noreferrer">Read the verified reviews on LACOMUS ↗</a>
        </div>
      )}

      <div className={styles.bottomBar}>
        <span>LIVE REVIEW SOURCE / LACOMUS + JUDGE.ME</span>
        <a href={OFFICIAL_PRODUCT} target="_blank" rel="noreferrer">Read every review ↗</a>
      </div>
    </section>
  );
}
