'use client';

import { useMemo, useState } from 'react';
import base from './reviews.module.css';
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

export default function ReviewsExplorer({ reviews, totalCount, officialProduct }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('newest');
  const [limit, setLimit] = useState(6);

  const counts = useMemo(() => ({
    all: reviews.length,
    verified: reviews.filter((review) => review.verified_buyer).length,
    media: reviews.filter((review) => (review.pictures_urls?.length ?? 0) > 0).length,
    five: reviews.filter((review) => Math.round(review.rating) === 5).length,
    four: reviews.filter((review) => Math.round(review.rating) === 4).length,
  }), [reviews]);

  const filtered = useMemo(() => {
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

  const visible = filtered.slice(0, limit);

  const selectFilter = (next: Filter) => {
    setFilter(next);
    setLimit(6);
  };

  return (
    <div className={enhanced.explorer}>
      <div className={enhanced.reviewToolbar}>
        <div className={enhanced.filterGroup} aria-label="Filter recent reviews">
          <button className={filter === 'all' ? enhanced.activeFilter : ''} onClick={() => selectFilter('all')} type="button">
            All <span>{counts.all}</span>
          </button>
          <button className={filter === 'verified' ? enhanced.activeFilter : ''} onClick={() => selectFilter('verified')} type="button">
            Verified <span>{counts.verified}</span>
          </button>
          <button className={filter === 'media' ? enhanced.activeFilter : ''} onClick={() => selectFilter('media')} type="button">
            With photos <span>{counts.media}</span>
          </button>
          <button className={filter === '5' ? enhanced.activeFilter : ''} onClick={() => selectFilter('5')} type="button">
            5 stars <span>{counts.five}</span>
          </button>
          <button className={filter === '4' ? enhanced.activeFilter : ''} onClick={() => selectFilter('4')} type="button">
            4 stars <span>{counts.four}</span>
          </button>
        </div>

        <label className={enhanced.sortControl}>
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
            <option value="newest">Most recent</option>
            <option value="highest">Highest rating</option>
            <option value="lowest">Lowest rating</option>
          </select>
        </label>
      </div>

      <div className={enhanced.feedMeta}>
        <span>Showing {Math.min(visible.length, filtered.length)} of {filtered.length} recent matching reviews</span>
        <span>{totalCount} total reviews on the official LACOMUS product page</span>
      </div>

      {visible.length > 0 ? (
        <div className={base.reviewGrid}>
          {visible.map((review, index) => {
            const picture = review.pictures_urls?.[0];
            const pictureSrc = picture?.huge || picture?.original || picture?.small || '';

            return (
              <article className={base.reviewCard} key={review.uuid}>
                <div className={base.cardTop}>
                  <span className={base.cardStars} aria-label={`${review.rating} out of 5 stars`}>
                    {stars(review.rating)}
                  </span>
                  <span className={base.index}>{String(index + 1).padStart(2, '0')}</span>
                </div>

                {pictureSrc && (
                  <figure className={enhanced.inlineMedia}>
                    <img src={pictureSrc} alt={`Review photo from ${review.reviewer_name || 'a LACOMUS customer'}`} loading="lazy" />
                    <figcaption>Customer photo</figcaption>
                  </figure>
                )}

                <blockquote>“{review.body || 'Customer rating submitted for LACOMUS Pour Femme.'}”</blockquote>

                <footer>
                  <div className={base.avatar} aria-hidden="true">
                    {(review.reviewer_initial || review.reviewer_name?.[0] || 'L').toUpperCase()}
                  </div>
                  <div className={base.reviewer}>
                    <strong>{review.reviewer_name || 'Anonymous'}</strong>
                    <span className={review.verified_buyer ? enhanced.verified : enhanced.unverified}>
                      {review.verified_buyer ? '✓ Verified Buyer' : 'Customer Review'}
                    </span>
                  </div>
                  <time dateTime={review.created_at}>{formatDate(review.created_at)}</time>
                </footer>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={enhanced.emptyState}>No recent reviews match this filter.</div>
      )}

      <div className={enhanced.reviewActions}>
        {visible.length < filtered.length && (
          <button type="button" onClick={() => setLimit((current) => current + 6)}>
            Show more reviews
          </button>
        )}
        <a href={officialProduct} target="_blank" rel="noreferrer">View all {totalCount} reviews on LACOMUS ↗</a>
      </div>
    </div>
  );
}
