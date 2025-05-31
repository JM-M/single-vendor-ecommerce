import { useEffect, useState } from "react";

interface Props {
  hideThreshold?: number;
  rootElement?: HTMLElement | null;
}

const DEFAULT_PROPS = {
  hideThreshold: 100,
  rootElement: null,
};

// Custom hook for scroll behavior
export const useSticky = ({
  hideThreshold = 100,
  rootElement,
}: Props = DEFAULT_PROPS) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Get scroll position from root element or window
      const currentScrollY = rootElement
        ? rootElement.scrollTop
        : window.scrollY;

      console.log(rootElement?.offsetTop);

      // Determine if header should be sticky
      setIsSticky(currentScrollY > 0);

      // Show/hide logic
      if (currentScrollY < hideThreshold) {
        // Always show when near top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down past threshold - hide
        setIsVisible(false);
      } else {
        // Scrolling up - show
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle function to improve performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use root element or window for scroll events
    const scrollTarget = rootElement || window;
    scrollTarget.addEventListener("scroll", throttledHandleScroll, {
      passive: true,
    });

    return () => {
      scrollTarget.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [lastScrollY, hideThreshold, rootElement]);

  return { isVisible, isSticky };
};
