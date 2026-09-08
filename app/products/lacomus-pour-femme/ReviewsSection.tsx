import ReviewsExplorer, { type ReviewItem, type ReviewPicture } from './ReviewsExplorer';
import styles from './reviews.module.css';
import enhanced from './reviews-enhanced.module.css';

const OFFICIAL_PRODUCT = 'https://lacomusph.com/products/lacomus-pour-femme';
const PRODUCT_ID = 8873526460552;
const REVIEW_COUNT = 355;
const AVERAGE_RATING = 4.84;

type Review = ReviewItem & {
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

export default async function ReviewsSection() {
  const reviews = await getReviews();
  const media = reviews
    .flatMap((review) =>
      (review.pictures_urls ?? []).map((picture: ReviewPicture) => ({
        src: picture.huge || picture.original || picture.small || '',
        reviewer: review.reviewer_name || 'LACOMUS customer',
      })),
    )
    .filter((item) => item.src)
    .slice(0, 6);

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
          <p>Real feedback from women wearing Pink Sapphire.</p>
          <span>The design now follows familiar beauty-commerce review patterns: verified-purchase trust signals, customer media, filters, sorting, and readable review cards.</span>
          <a href={OFFICIAL_PRODUCT} target="_blank" rel="noreferrer">View all {REVIEW_COUNT} on LACOMUS ↗</a>
        </div>
      </div>

      {media.length > 0 && (
        <div className={enhanced.mediaBlock}>
          <div className={enhanced.mediaHeading}>
            <div>
              <span>COMMUNITY GALLERY</span>
              <h3>Seen in the wild.</h3>
            </div>
            <p>Customer-uploaded photos from the live LACOMUS review feed.</p>
          </div>

          <div className={styles.mediaRail} aria-label="Customer review photos">
            {media.map((item, index) => (
              <figure key={`${item.src}-${index}`} className={styles.mediaCard}>
                <img src={item.src} alt={`Customer review photo from ${item.reviewer}`} loading="lazy" />
                <figcaption>Customer photo · {String(index + 1).padStart(2, '0')}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {reviews.length > 0 ? (
        <ReviewsExplorer reviews={reviews} totalCount={REVIEW_COUNT} officialProduct={OFFICIAL_PRODUCT} />
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
