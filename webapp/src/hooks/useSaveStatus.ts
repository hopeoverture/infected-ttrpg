import { useState, useCallback, useRef, useEffect } from 'react';
import { SaveStatus } from '@/components/game/SaveIndicator';

interface UseSaveStatusOptions {
  onSave: () => Promise<void>;
  debounceMs?: number;
}

interface UseSaveStatusReturn {
  status: SaveStatus;
  lastSaved: Date | undefined;
  save: () => void;
  markDirty: () => void;
  isOnline: boolean;
}

export function useSaveStatus({
  onSave,
  debounceMs = 2000
}: UseSaveStatusOptions): UseSaveStatusReturn {
  const [status, setStatus] = useState<SaveStatus>('saved');
  const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);
  const [isOnline, setIsOnline] = useState(true);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const retryTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isDirtyRef = useRef(false);
  const isMountedRef = useRef(true);
  const performSaveRef = useRef<(() => Promise<void>) | undefined>(undefined);

  // Track online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial status - intentional initialization from browser API
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine); // eslint-disable-line react-hooks/set-state-in-effect
      if (!navigator.onLine) {
        setStatus('offline');  
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const performSave = useCallback(async () => {
    if (!isOnline) {
      setStatus('offline');
      return;
    }

    setStatus('saving');
    try {
      await onSave();
      if (isMountedRef.current) {
        setStatus('saved');
        setLastSaved(new Date());
      }
      isDirtyRef.current = false;
    } catch (error) {
      console.error('Save failed:', error);
      if (isMountedRef.current) {
        setStatus('error');
      }
      // Retry after 5 seconds using ref to avoid closure issues
      // Clear any existing retry timeout first
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      retryTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current && isDirtyRef.current && performSaveRef.current) {
          performSaveRef.current();
        }
      }, 5000);
    }
  }, [onSave, isOnline]);

  // Keep ref updated
  useEffect(() => {
    performSaveRef.current = performSave;
  }, [performSave]);

  const save = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    performSave();
  }, [performSave]);

  const markDirty = useCallback(() => {
    isDirtyRef.current = true;
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (isDirtyRef.current && performSaveRef.current) {
        performSaveRef.current();
      }
    }, debounceMs);
  }, [debounceMs]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Save on page unload if dirty
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isDirtyRef.current && performSaveRef.current) {
        performSaveRef.current();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    status,
    lastSaved,
    save,
    markDirty,
    isOnline
  };
}

export default useSaveStatus;
