'use client';

import { useState } from 'react';
import FadeContent from './react-bits/FadeContent';
import GlareHover from './react-bits/GlareHover';

const HOMME_IMAGE = 'https://cdn.shopify.com/s/files/1/0712/6129/0632/files/HRS03073_1.jpg?v=1777867751';
const FEMME_IMAGE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3HqpkL4qwLWJklalLjBpcIwd3mK/hf_20260908_092605_eb19eae5-b1a7-48e7-944e-59bd66bd136e.png';

type Category = 'homme' | 'femme';

export default function FragranceCategories() {
  const [active, setActive] = useState<Category | null>(null);

  return (
    <section id="collection" className="fragrance-categories" aria-labelledby="fragrance-category-title">
      <div className="category-intro shell">
        <FadeContent blur={false} duration={0.8} threshold={0.18}>
          <div className="category-intro-grid">
            <p>THE POUR COLLECTION / 2026</p>
            <h2 id="fragrance-category-title">Choose your signature.</h2>
            <span>Two expressions. One language of quiet presence.</span>
          </div>
        </FadeContent>
      </div>

      <div
        className={`category-split ${active ? `category-split-${active}` : ''}`}
        onMouseLeave={() => setActive(null)}
      >
        <a
          className="category-card category-card-homme"
          href="#fragrance-blue"
          onMouseEnter={() => setActive('homme')}
          onFocus={() => setActive('homme')}
          onBlur={() => setActive(null)}
        >
          <GlareHover
            className="category-glare"
            width="100%"
            height="100%"
            background="transparent"
            borderColor="transparent"
            borderRadius="0"
            glareOpacity={0.12}
            glareSize={190}
            transitionDuration={900}
          >
            <img src={HOMME_IMAGE} alt="LACOMUS Pour Homme beside coffee and a laptop on a wooden desk" loading="lazy" />
            <div className="category-shade category-shade-homme" aria-hidden="true" />
            <div className="category-number" aria-hidden="true">01</div>
            <div className="category-copy">
              <span>BLUE SAPPHIRE · EMERALD</span>
              <h3>Pour Homme</h3>
              <p>Signature fragrance for him</p>
              <strong>Explore Homme <i>→</i></strong>
            </div>
          </GlareHover>
        </a>

        <a
          className="category-card category-card-femme"
          href="#fragrance-pink"
          onMouseEnter={() => setActive('femme')}
          onFocus={() => setActive('femme')}
          onBlur={() => setActive(null)}
        >
          <GlareHover
            className="category-glare"
            width="100%"
            height="100%"
            background="transparent"
            borderColor="transparent"
            borderRadius="0"
            glareOpacity={0.12}
            glareSize={190}
            transitionDuration={900}
          >
            <img src={FEMME_IMAGE} alt="LACOMUS Pink Sapphire feminine fragrance campaign" loading="lazy" />
            <div className="category-shade category-shade-femme" aria-hidden="true" />
            <div className="category-number" aria-hidden="true">02</div>
            <div className="category-copy">
              <span>PINK SAPPHIRE</span>
              <h3>Pour Femme</h3>
              <p>Signature fragrance for her</p>
              <strong>Explore Femme <i>→</i></strong>
            </div>
          </GlareHover>
        </a>
      </div>

      <style jsx>{`
        .fragrance-categories {
          position: relative;
          background: #07090c;
          overflow: hidden;
          scroll-margin-top: 70px;
        }

        .category-intro {
          padding: 112px 0 48px;
        }

        .category-intro-grid {
          display: grid;
          grid-template-columns: 0.72fr 1.7fr 0.9fr;
          gap: 34px;
          align-items: end;
        }

        .category-intro p,
        .category-intro span {
          margin: 0;
          font-size: 8px;
          line-height: 1.7;
          letter-spacing: 0.21em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.48);
        }

        .category-intro h2 {
          margin: 0;
          max-width: 840px;
          font-size: clamp(58px, 7.5vw, 118px);
          line-height: 0.82;
          letter-spacing: -0.055em;
          text-wrap: balance;
        }

        .category-intro span {
          max-width: 250px;
          justify-self: end;
          text-align: right;
        }

        .category-split {
          display: flex;
          width: 100%;
          min-height: 82svh;
          background: #050608;
        }

        .category-card {
          position: relative;
          flex: 1 1 50%;
          min-width: 0;
          overflow: hidden;
          isolation: isolate;
          transition: flex-basis 820ms cubic-bezier(.2,.75,.2,1), filter 520ms ease;
          outline: none;
        }

        .category-split-homme .category-card-homme,
        .category-split-femme .category-card-femme {
          flex-basis: 58%;
        }

        .category-split-homme .category-card-femme,
        .category-split-femme .category-card-homme {
          flex-basis: 42%;
          filter: saturate(0.82) brightness(0.78);
        }

        .category-card :global(.category-glare) {
          position: relative;
          width: 100% !important;
          height: 82svh !important;
          min-height: 650px;
          overflow: hidden;
        }

        .category-card img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.025);
          transition: transform 1.15s cubic-bezier(.2,.75,.2,1), filter 650ms ease;
        }

        .category-card-homme img {
          object-position: 52% center;
        }

        .category-card-femme img {
          object-position: 52% center;
        }

        .category-card:hover img,
        .category-card:focus-visible img {
          transform: scale(1.075);
        }

        .category-shade {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        .category-shade-homme {
          background:
            linear-gradient(0deg, rgba(4,6,9,.88) 0%, rgba(4,6,9,.2) 42%, rgba(4,6,9,.05) 72%),
            linear-gradient(90deg, rgba(3,5,8,.2), transparent 50%);
        }

        .category-shade-femme {
          background:
            linear-gradient(0deg, rgba(12,5,6,.9) 0%, rgba(12,5,6,.22) 43%, rgba(12,5,6,.04) 72%),
            linear-gradient(270deg, rgba(28,10,8,.12), transparent 54%);
        }

        .category-copy {
          position: absolute;
          z-index: 2;
          left: clamp(28px, 4vw, 78px);
          bottom: clamp(38px, 6svh, 76px);
          right: clamp(28px, 4vw, 78px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .category-copy > span {
          margin-bottom: 11px;
          font-size: 8px;
          letter-spacing: .22em;
          color: rgba(255,255,255,.58);
        }

        .category-copy h3 {
          margin: 0 0 12px;
          font-size: clamp(50px, 5.7vw, 94px);
          line-height: .84;
          letter-spacing: -.045em;
          color: #f5f0e8;
        }

        .category-copy p {
          margin: 0 0 20px;
          font-size: 9px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: rgba(255,255,255,.72);
        }

        .category-copy strong {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: #fff;
        }

        .category-copy strong::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: rgba(255,255,255,.7);
          transform-origin: left;
          transition: transform 420ms cubic-bezier(.2,.75,.2,1);
        }

        .category-copy i {
          font-style: normal;
          transition: transform 420ms cubic-bezier(.2,.75,.2,1);
        }

        .category-card:hover .category-copy i,
        .category-card:focus-visible .category-copy i {
          transform: translateX(7px);
        }

        .category-card:hover .category-copy strong::after,
        .category-card:focus-visible .category-copy strong::after {
          transform: scaleX(.62);
        }

        .category-number {
          position: absolute;
          z-index: 2;
          top: 28px;
          left: 30px;
          font-size: 8px;
          letter-spacing: .2em;
          color: rgba(255,255,255,.52);
        }

        @media (max-width: 900px) {
          .category-intro {
            padding: 88px 0 34px;
          }

          .category-intro-grid {
            grid-template-columns: 1fr;
            gap: 13px;
          }

          .category-intro h2 {
            font-size: clamp(52px, 11vw, 84px);
            max-width: 680px;
          }

          .category-intro span {
            justify-self: start;
            text-align: left;
          }
        }

        @media (max-width: 760px) {
          .category-intro {
            padding: 74px 0 26px;
          }

          .category-intro h2 {
            font-size: clamp(46px, 14vw, 68px);
            line-height: .86;
          }

          .category-split {
            display: block;
            min-height: 0;
          }

          .category-card {
            display: block;
            width: 100%;
            min-height: 74svh;
            filter: none !important;
          }

          .category-card :global(.category-glare) {
            height: 74svh !important;
            min-height: 540px;
          }

          .category-card img {
            transform: scale(1.02);
          }

          .category-card:hover img,
          .category-card:focus-visible img {
            transform: scale(1.04);
          }

          .category-card-homme img {
            object-position: 53% center;
          }

          .category-card-femme img {
            object-position: 57% center;
          }

          .category-copy {
            left: 22px;
            right: 22px;
            bottom: 34px;
          }

          .category-copy h3 {
            font-size: clamp(52px, 16vw, 76px);
          }

          .category-number {
            left: 22px;
            top: 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-card,
          .category-card img,
          .category-copy i,
          .category-copy strong::after {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
