import { useState, useEffect, useCallback, useRef } from 'react';
import './intro-animation.css';

const LOGO_SRC = '/grafik_logo_transparent.png';

/**
 * IntroAnimation
 *
 * Brand intro loading animation that plays every time the site is loaded, reloaded, or visited:
 * - 0s: Dim silhouette logo (15% opacity) on off-white background
 * - 0s - 1.1s: Full-colour logo sweeps in smoothly from bottom to top;
 *              thin blue line expands in exact lockstep
 * - 1.1s: Immediate upward lift (0.65s) with zero dead hold
 * - 1.75s: Transition completes, intro unmounts, site revealed
 *
 * Features:
 * - Plays on every visit, link click, or reload (no sessionStorage lockout)
 * - Dismissed immediately on click / tap or any keypress
 * - Skipped if user prefers reduced motion
 * - Hard safety timer (2.8s) to guarantee unmounting
 * - Locks body scroll while active, restores immediately when closed
 * - Uses only transform, opacity, and clip-path
 * - aria-hidden="true" set on the overlay
 * - Rendered in initial HTML so there is zero flash of page content
 */
export default function IntroAnimation() {
  const [active, setActive] = useState(true);
  const [lifting, setLifting] = useState(false);
  const closedRef = useRef(false);

  const closeIntro = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    setActive(false);
  }, []);

  const triggerLift = useCallback(() => {
    setLifting(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      closeIntro();
      return;
    }

    // Lock body scroll while intro is visible
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Dismiss immediately on any keypress
    const onKeyDown = () => {
      closeIntro();
    };

    window.addEventListener('keydown', onKeyDown, { capture: true });

    // The fill animation is 1.1s. Start lifting at 1.12s if onAnimationEnd didn't fire
    const liftTimer = setTimeout(() => {
      triggerLift();
    }, 1120);

    // After lift starts (1.12s + 0.65s transition = ~1.77s), unmount completely at 1.82s
    const finishTimer = setTimeout(() => {
      closeIntro();
    }, 1820);

    // Hard safety timer: remove intro after 2.8s no matter what
    const safetyTimer = setTimeout(() => {
      closeIntro();
    }, 2800);

    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true });
      clearTimeout(liftTimer);
      clearTimeout(finishTimer);
      clearTimeout(safetyTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [closeIntro, triggerLift]);

  if (!active) return null;

  return (
    <div
      className={`site-intro-overlay ${lifting ? 'site-intro-lifting' : ''}`}
      aria-hidden="true"
      onClick={closeIntro}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === 'transform') {
          closeIntro();
        }
      }}
    >
      <div className="site-intro-center">
        <div className="site-intro-logo-wrap">
          {/* Bottom copy: 15% opacity dim silhouette */}
          <img
            src={LOGO_SRC}
            alt=""
            className="site-intro-logo site-intro-logo-silhouette"
            draggable="false"
          />
          {/* Top copy: full colour, revealed from bottom to top */}
          <img
            src={LOGO_SRC}
            alt="Grafik Machinery"
            className="site-intro-logo site-intro-logo-reveal"
            draggable="false"
            onAnimationEnd={triggerLift}
          />
        </div>
        {/* Thin blue line growing from 0 to full width in step with fill */}
        <div className="site-intro-line" />
      </div>
    </div>
  );
}
