'use client';

import { useMemo, useState } from 'react';
import SpotlightCard from '../../components/react-bits/SpotlightCard';
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

function ReviewCard({ review, index, clone = false }: { review: ReviewItem; index: number; clone?: boolean }) {
  const pictureSrc = reviewPhoto(review);

  return (
    <SpotlightCard
      className={enhanced.reviewTickerCard}
      spotlightColor={index % 2 === 0 ? 'rgba(217,185,80,.11)' : 'rgba(177,63,77,.12)'}
    >
      <article className={enhanced.compactCard} aria-hidden={clone || undefined}>
        <div className={enhanced.compactTop}>
          <span className={enhanced.compactStars} aria-label={`${review.rating} out of 5 stars`}>
            {stars(review.rating)}
          </span>
          {pictureSrc && (
            <img
              className={enhanced.reviewThumb}
              src={pictureSrc}
              alt={clone ? '' : `Review photo from ${review.reviewer_name || 'a LACOMUS customer'}`}
              loading="lazy"
            />
          )}
        </div>

        <blockquote>“{review.body || 'Customer rating submitted for LACOMUS Pour Femme.'}”</blockquote>

        <footer>
          <div className={enhanced.avatar} aria-hidden="true">
            {(review.reviewer_initial || review.reviewer_name?.[0] || 'L').toUpperCase()}
          </div>
          <div className={enhanced.reviewer}>
            <strong>{review.reviewer_name || 'Anonymous'}</strong>
            <span className={review.verified_buyer ? enhanced.verified : enhanced.unverified}>
              {review.verified_buyer ? '✓ Verified Buyer' : 'Customer Review'}
            </span>
          </div>
          <time dateTime={review.created_at}>{formatDate(review.created_at)}</time>
        </footer>
      </article>
    </SpotlightCard>
  );
}

function MovingRow({ reviews, reverse = false, row }: { reviews: ReviewItem[]; reverse?: boolean; row: number }) {
  if (reviews.length === 0) return null;

  return (
    <div className={enhanced.marqueeViewport} aria-label={`Moving customer reviews row ${row}`}>
      <div className={`${enhanced.marqueeTrack} ${reverse ? enhanced.reverse : enhanced.forward}`}>
        <div className={enhanced.marqueeGroup}>
          {reviews.map((review, index) => (
            <ReviewCard key={`row-${row}-${review.uuid}`} review={review} index={index} />
          ))}
        </div>
        <div className={enhanced.marqueeGroup} aria-hidden="true">
          {reviews.map((review, index) => (
            <ReviewCard key={`row-${row}-clone-${review.uuid}`} review={review} index={index} clone />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReviewsExplorer({ reviews, totalCount, officialProduct }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('newest');

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

  const moving = filtered.slice(0, 14);
  const rowOne = moving.filter((_, index) => index % 2 === 0);
  const alternateRow = moving.filter((_, index) => index % 2 === 1);
  const rowTwo = alternateRow.length > 0 ? alternateRow : rowOne;

  return (
    <div className={enhanced.explorer}>
      <div className={enhanced.reviewToolbar}>
        <div className={enhanced.filterGroup} aria-label="Filter recent reviews">
          <button className={filter === 'all' ? enhanced.activeFilter : ''} onClick={() => setFilter('all')} type="button">All <span>{counts.all}</span></button>
          <button className={filter === 'verified' ? enhanced.activeFilter : ''} onClick={() => setFilter('verified')} type="button">Verified <span>{counts.verified}</span></button>
          <button className={filter === 'media' ? enhanced.activeFilter : ''} onClick={() => setFilter('media')} type="button">With photos <span>{counts.media}</span></button>
          <button className={filter === '5' ? enhanced.activeFilter : ''} onClick={() => setFilter('5')} type="button">5 stars <span>{counts.five}</span></button>
          <button className={filter === '4' ? enhanced.activeFilter : ''} onClick={() => setFilter('4')} type="button">4 stars <span>{counts.four}</span></button>
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
        <span>{moving.length} recent matching reviews in motion</span>
        <span>{totalCount} total reviews on the official LACOMUS product page</span>
      </div>

      {moving.length > 0 ? (
        <div className={enhanced.motionStage}>
          <div className={enhanced.motionHeading}>
            <span>CUSTOMER VOICES IN MOTION</span>
            <span>Hover to pause · swipe naturally on mobile</span>
          </div>
          <MovingRow reviews={rowOne} row={1} />
          <MovingRow reviews={rowTwo} reverse row={2} />
        </div>
      ) : (
        <div className={enhanced.emptyState}>No recent reviews match this filter.</div>
      )}

      <div className={enhanced.reviewActions}>
        <span>LIVE / LACOMUS + JUDGE.ME</span>
        <a href={officialProduct} target="_blank" rel="noreferrer">View all {totalCount} reviews on LACOMUS ↗</a>
      </div>
    </div>
  );
}
