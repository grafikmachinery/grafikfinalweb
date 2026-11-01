import { useState, useEffect, useCallback, useRef } from 'react';
import './intro-animation.css';

const LOGO_SRC = '/grafik_logo_transparent.png';

/**
 * IntroAnimation
 *
 * First-visit brand intro loading animation for the live website:
 * - 0s: Dim silhouette logo (15% opacity) on off-white background
 * - 0s - 1.1s: Full-colour logo sweeps in smoothly from bottom to top;
 *              thin blue line expands in exact lockstep
 * - 1.1s: When the fill finishes, the entire screen immediately sweeps
 *         upward (0.65s) with no dead hold time
 * - 1.75s: Transition completes, intro unmounts, live site revealed
 *
 * Features:
 * - Runs once per browser session (sessionStorage: site_intro_seen)
 * - Overridden by ?intro=1 query parameter
 * - Dismissed on click / tap or any keypress
 * - Skipped if user prefers reduced motion
 * - Hard safety timer (2.8s) to guarantee unmounting
 * - Locks body scroll while active, restores immediately when closed
 * - Uses only transform, opacity, and clip-path
 * - aria-hidden="true" set on the overlay
 * - SSR-safe (returns null during static prerender)
 */
export default function IntroAnimation() {
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return false;

    // Respect reduced motion
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return false;

    // Check query param ?intro=1
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('intro') === '1') {
        return true;
      }
    } catch {
      // Ignore URL parsing errors
    }

    // Check sessionStorage
    try {
      if (sessionStorage.getItem('site_intro_seen')) {
        return false;
      }
    } catch {
      // Ignore storage access errors
    }

    return true;
  });

  const [lifting, setLifting] = useState(false);
  const closedRef = useRef(false);

  const closeIntro = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    document.body.style.overflow = '';
    setActive(false);
  }, []);

  const triggerLift = useCallback(() => {
    setLifting(true);
  }, []);

  useEffect(() => {
    if (!active) return;

    // Mark as seen for this session
    try {
      sessionStorage.setItem('site_intro_seen', 'true');
    } catch {
      // Ignore storage access errors
    }

    // Lock body scroll while intro is visible
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Dismiss on any keypress
    const onKeyDown = () => {
      closeIntro();
    };

    window.addEventListener('keydown', onKeyDown, { capture: true });

    // The fill animation is 1.1s. Start lifting right at 1.12s if not already started
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
  }, [active, closeIntro, triggerLift]);

  if (!active) return null;

  return (
    <div
      className={`site-intro-overlay ${lifting ? 'site-intro-lifting' : ''}`}
      aria-hidden="true"
      onClick={closeIntro}
      onTransitionEnd={(e) => {
        // When the lift-off transition completes on the overlay, close immediately
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
