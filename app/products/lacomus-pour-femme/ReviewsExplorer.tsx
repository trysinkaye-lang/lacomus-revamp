'use client';

import { useEffect, useMemo, useState } from 'react';
import enhanced from './reviews-enhanced.module.css';

export type ReviewPicture = {
  original?: string;
  small?: string;
  compact?: string;
  huge?: string;
};

export type ReviewItem = {
  uuid: string;
  rating: number;
  body?: string;
  reviewer_name?: string;
  reviewer_initial?: string;
  verified_buyer?: boolean;
  created_at?: string;
  pictures_urls?: ReviewPicture[];
};

type Filter = 'all' | 'verified' | 'media' | '5' | '4';
type Sort = 'newest' | 'highest' | 'lowest';

type Props = {
  reviews: ReviewItem[];
  totalCount: number;
  officialProduct: string;
};

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
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)}`;
}

function reviewPhoto(review: ReviewItem) {
  const picture = review.pictures_urls?.[0];
  return picture?.huge || picture?.original || picture?.small || '';
}

export default function ReviewsExplorer({ reviews, totalCount, officialProduct }: Props) {
  const displayReviews = useMemo(
    () => reviews.filter((review) => (review.body?.trim().length ?? 0) > 0).slice(0, 8),
    [reviews],
  );
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('newest');

  useEffect(() => {
    if (paused || drawerOpen || displayReviews.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % displayReviews.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [displayReviews.length, drawerOpen, paused]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const counts = useMemo(() => ({
    all: reviews.length,
    verified: reviews.filter((review) => review.verified_buyer).length,
    media: reviews.filter((review) => (review.pictures_urls?.length ?? 0) > 0).length,
    five: reviews.filter((review) => Math.round(review.rating) === 5).length,
    four: reviews.filter((review) => Math.round(review.rating) === 4).length,
  }), [reviews]);

  const drawerReviews = useMemo(() => {
    let next = reviews.filter((review) => {
      if (filter === 'verified') return Boolean(review.verified_buyer);
      if (filter === 'media') return (review.pictures_urls?.length ?? 0) > 0;
      if (filter === '5') return Math.round(review.rating) === 5;
      if (filter === '4') return Math.round(review.rating) === 4;
      return true;
    });

    next = [...next].sort((a, b) => {
      if (sort === 'highest') return b.rating - a.rating;
      if (sort === 'lowest') return a.rating - b.rating;
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    return next;
  }, [filter, reviews, sort]);

  const review = displayReviews[active];
  const go = (direction: number) => {
    if (displayReviews.length === 0) return;
    setActive((current) => (current + direction + displayReviews.length) % displayReviews.length);
  };

  if (!review) {
    return (
      <div className={enhanced.emptyState}>
        <p>Customer reviews are temporarily unavailable.</p>
        <a href={officialProduct} target="_blank" rel="noreferrer">Read reviews on LACOMUS ↗</a>
      </div>
    );
  }

  return (
    <div className={enhanced.explorer}>
      <section
        className={enhanced.reviewStage}
        aria-label="Featured customer review"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={enhanced.reviewStageTop}>
          <span>CUSTOMER NOTE / {String(active + 1).padStart(2, '0')}</span>
          <span className={enhanced.stars}>{stars(review.rating)}</span>
        </div>

        <div className={enhanced.reviewBody} key={review.uuid}>
          {reviewPhoto(review) && (
            <figure className={enhanced.reviewPhoto}>
              <img src={reviewPhoto(review)} alt={`Customer photo from ${review.reviewer_name || 'a LACOMUS customer'}`} loading="lazy" />
            </figure>
          )}

          <div className={enhanced.reviewCopy}>
            <blockquote>“{review.body}”</blockquote>
            <footer>
              <div>
                <strong>{review.reviewer_name || 'Anonymous'}</strong>
                <span className={review.verified_buyer ? enhanced.verified : enhanced.unverified}>
                  {review.verified_buyer ? 'Verified Buyer' : 'Customer Review'}
                </span>
              </div>
              <time dateTime={review.created_at}>{formatDate(review.created_at)}</time>
            </footer>
          </div>
        </div>

        <div className={enhanced.reviewControls}>
          <button type="button" onClick={() => go(-1)} aria-label="Previous review">←</button>
          <div className={enhanced.progress} aria-label={`Review ${active + 1} of ${displayReviews.length}`}>
            {displayReviews.map((item, index) => (
              <button
                key={item.uuid}
                type="button"
                className={index === active ? enhanced.activeProgress : ''}
                onClick={() => setActive(index)}
                aria-label={`Show review ${index + 1}`}
              />
            ))}
          </div>
          <span>{String(active + 1).padStart(2, '0')} / {String(displayReviews.length).padStart(2, '0')}</span>
          <button type="button" onClick={() => go(1)} aria-label="Next review">→</button>
        </div>
      </section>

      <div className={enhanced.reviewFooterActions}>
        <p>Real customer feedback, kept quiet enough to let the fragrance remain the focus.</p>
        <button type="button" onClick={() => setDrawerOpen(true)}>Read all reviews</button>
      </div>

      {drawerOpen && (
        <div className={enhanced.drawerBackdrop} role="presentation" onMouseDown={() => setDrawerOpen(false)}>
          <aside className={enhanced.drawer} role="dialog" aria-modal="true" aria-label="All customer reviews" onMouseDown={(event) => event.stopPropagation()}>
            <div className={enhanced.drawerHeader}>
              <div>
                <span>CUSTOMER ARCHIVE</span>
                <h3>{totalCount} reviews</h3>
              </div>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close reviews">×</button>
            </div>

            <div className={enhanced.drawerToolbar}>
              <div className={enhanced.filterGroup}>
                <button className={filter === 'all' ? enhanced.activeFilter : ''} onClick={() => setFilter('all')} type="button">All <span>{counts.all}</span></button>
                <button className={filter === 'verified' ? enhanced.activeFilter : ''} onClick={() => setFilter('verified')} type="button">Verified <span>{counts.verified}</span></button>
                <button className={filter === 'media' ? enhanced.activeFilter : ''} onClick={() => setFilter('media')} type="button">Photos <span>{counts.media}</span></button>
                <button className={filter === '5' ? enhanced.activeFilter : ''} onClick={() => setFilter('5')} type="button">5★ <span>{counts.five}</span></button>
                <button className={filter === '4' ? enhanced.activeFilter : ''} onClick={() => setFilter('4')} type="button">4★ <span>{counts.four}</span></button>
              </div>
              <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} aria-label="Sort reviews">
                <option value="newest">Most recent</option>
                <option value="highest">Highest rating</option>
                <option value="lowest">Lowest rating</option>
              </select>
            </div>

            <div className={enhanced.drawerList}>
              {drawerReviews.map((item) => (
                <article className={enhanced.drawerReview} key={item.uuid}>
                  <div className={enhanced.drawerReviewTop}>
                    <span className={enhanced.stars}>{stars(item.rating)}</span>
                    <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
                  </div>
                  {reviewPhoto(item) && <img src={reviewPhoto(item)} alt={`Customer review from ${item.reviewer_name || 'a LACOMUS customer'}`} loading="lazy" />}
                  <p>“{item.body || 'Customer rating submitted for LACOMUS Pour Femme.'}”</p>
                  <div className={enhanced.drawerReviewer}>
                    <strong>{item.reviewer_name || 'Anonymous'}</strong>
                    <span className={item.verified_buyer ? enhanced.verified : enhanced.unverified}>
                      {item.verified_buyer ? 'Verified Buyer' : 'Customer Review'}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <a className={enhanced.officialLink} href={officialProduct} target="_blank" rel="noreferrer">View all {totalCount} on the official LACOMUS store ↗</a>
          </aside>
        </div>
      )}
    </div>
  );
}
