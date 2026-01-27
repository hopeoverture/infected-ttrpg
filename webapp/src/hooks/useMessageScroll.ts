import { useState, useCallback, useRef, useEffect, RefObject } from 'react';

interface UseMessageScrollOptions {
  containerRef: RefObject<HTMLElement | null>;
  threshold?: number; // How far from bottom to consider "at bottom"
}

interface UseMessageScrollReturn {
  isAtBottom: boolean;
  scrollToBottom: (smooth?: boolean) => void;
  scrollToMessage: (messageId: string, smooth?: boolean) => void;
  checkScrollPosition: () => void;
}

export function useMessageScroll({ 
  containerRef, 
  threshold = 100 
}: UseMessageScrollOptions): UseMessageScrollReturn {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isAutoScrollingRef = useRef(false);

  const checkScrollPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsAtBottom(distanceFromBottom <= threshold);
  }, [containerRef, threshold]);

  const scrollToBottom = useCallback((smooth = true) => {
    const container = containerRef.current;
    if (!container) return;

    isAutoScrollingRef.current = true;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });

    // Reset flag after animation
    setTimeout(() => {
      isAutoScrollingRef.current = false;
      setIsAtBottom(true);
    }, smooth ? 500 : 0);
  }, [containerRef]);

  const scrollToMessage = useCallback((messageId: string, smooth = true) => {
    const container = containerRef.current;
    if (!container) return;

    const messageElement = container.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
      isAutoScrollingRef.current = true;
      messageElement.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'center'
      });

      // Highlight briefly
      messageElement.classList.add('ring-2', 'ring-gold');
      setTimeout(() => {
        messageElement.classList.remove('ring-2', 'ring-gold');
        isAutoScrollingRef.current = false;
      }, 1500);
    }
  }, [containerRef]);

  // Listen for scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!isAutoScrollingRef.current) {
        checkScrollPosition();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef, checkScrollPosition]);

  // Initial check
  useEffect(() => {
    checkScrollPosition();
  }, [checkScrollPosition]);

  return {
    isAtBottom,
    scrollToBottom,
    scrollToMessage,
    checkScrollPosition
  };
}

export default useMessageScroll;
