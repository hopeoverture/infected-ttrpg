/**
 * Simple in-memory rate limiter using sliding window algorithm
 * Suitable for development and small-scale deployments
 */

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimitConfig {
  maxRequests: number;  // Maximum requests allowed
  windowMs: number;     // Time window in milliseconds
}

// In-memory store for rate limiting
// In production, use Redis or similar for multi-instance support
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let lastCleanup = Date.now();

function cleanupOldEntries(windowMs: number): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  
  lastCleanup = now;
  const cutoff = now - windowMs;
  
  for (const [key, entry] of rateLimitStore.entries()) {
    entry.timestamps = entry.timestamps.filter(t => t > cutoff);
    if (entry.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Check and update rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const { maxRequests, windowMs } = config;
  
  // Cleanup periodically
  cleanupOldEntries(windowMs);
  
  // Get or create entry
  let entry = rateLimitStore.get(identifier);
  if (!entry) {
    entry = { timestamps: [] };
    rateLimitStore.set(identifier, entry);
  }
  
  // Remove expired timestamps
  const windowStart = now - windowMs;
  entry.timestamps = entry.timestamps.filter(t => t > windowStart);
  
  // Check if limit exceeded
  if (entry.timestamps.length >= maxRequests) {
    // Calculate when the oldest request will expire
    const oldestTimestamp = entry.timestamps[0];
    const resetTime = oldestTimestamp ? oldestTimestamp + windowMs : now + windowMs;
    const retryAfter = Math.ceil((resetTime - now) / 1000);
    
    return {
      success: false,
      remaining: 0,
      reset: resetTime,
      retryAfter,
    };
  }
  
  // Add current request
  entry.timestamps.push(now);
  
  return {
    success: true,
    remaining: maxRequests - entry.timestamps.length,
    reset: now + windowMs,
  };
}

/**
 * Get client identifier from request
 * Uses IP address or falls back to a hash of headers
 */
export function getClientIdentifier(request: Request): string {
  // Try common headers for real IP (behind proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ip = forwarded.split(',')[0]?.trim();
    if (ip) return ip;
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  
  // Fallback: use a combination of headers as identifier
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const acceptLanguage = request.headers.get('accept-language') || 'unknown';
  return `anon-${simpleHash(userAgent + acceptLanguage)}`;
}

/**
 * Simple hash function for creating anonymous identifiers
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Pre-configured rate limiters for different API endpoints
export const RATE_LIMITS = {
  // GM API: 10 requests per minute (AI calls are expensive)
  gm: { maxRequests: 10, windowMs: 60 * 1000 },
  
  // Image API: 5 requests per minute (very expensive)
  image: { maxRequests: 5, windowMs: 60 * 1000 },
  
  // TTS API: 20 requests per minute (moderate cost)
  tts: { maxRequests: 20, windowMs: 60 * 1000 },
} as const;

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult, config: RateLimitConfig): HeadersInit {
  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.reset / 1000).toString(),
    ...(result.retryAfter ? { 'Retry-After': result.retryAfter.toString() } : {}),
  };
}

/**
 * Create 429 Too Many Requests response
 */
export function createRateLimitResponse(
  result: RateLimitResult,
  config: RateLimitConfig,
  endpoint: string
): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: `Rate limit exceeded for ${endpoint}. Please wait ${result.retryAfter} seconds before retrying.`,
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...createRateLimitHeaders(result, config),
      },
    }
  );
}
