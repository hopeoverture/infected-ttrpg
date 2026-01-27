/**
 * Rate limiter tests - run with: npx tsx src/lib/rate-limit.test.ts
 */

import { checkRateLimit, RATE_LIMITS } from './rate-limit';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testRateLimiter() {
  console.log('🧪 Testing rate limiter...\n');

  // Test 1: Basic rate limiting
  console.log('Test 1: Basic rate limiting (5 requests, limit 5)');
  const testConfig = { maxRequests: 5, windowMs: 60000 };
  const testId = `test-${Date.now()}`;
  
  for (let i = 1; i <= 6; i++) {
    const result = checkRateLimit(`${testId}-basic`, testConfig);
    console.log(`  Request ${i}: success=${result.success}, remaining=${result.remaining}`);
    
    if (i <= 5 && !result.success) {
      console.error('  ❌ FAIL: Should have succeeded');
      process.exit(1);
    }
    if (i === 6 && result.success) {
      console.error('  ❌ FAIL: Should have been rate limited');
      process.exit(1);
    }
  }
  console.log('  ✅ PASS\n');

  // Test 2: Different identifiers don't share limits
  console.log('Test 2: Separate limits per identifier');
  const idA = `${testId}-A`;
  const idB = `${testId}-B`;
  
  // Fill up limit for A
  for (let i = 0; i < 5; i++) {
    checkRateLimit(idA, testConfig);
  }
  
  // B should still work
  const resultB = checkRateLimit(idB, testConfig);
  if (!resultB.success) {
    console.error('  ❌ FAIL: Different identifiers should have separate limits');
    process.exit(1);
  }
  console.log('  ✅ PASS\n');

  // Test 3: Window expiration
  console.log('Test 3: Window expiration (using short window)');
  const shortConfig = { maxRequests: 2, windowMs: 100 }; // 100ms window
  const shortId = `${testId}-short`;
  
  checkRateLimit(shortId, shortConfig);
  checkRateLimit(shortId, shortConfig);
  
  const limitedResult = checkRateLimit(shortId, shortConfig);
  if (limitedResult.success) {
    console.error('  ❌ FAIL: Should be rate limited');
    process.exit(1);
  }
  
  console.log('  Waiting 150ms for window to expire...');
  await delay(150);
  
  const afterWait = checkRateLimit(shortId, shortConfig);
  if (!afterWait.success) {
    console.error('  ❌ FAIL: Should have succeeded after window expired');
    process.exit(1);
  }
  console.log('  ✅ PASS\n');

  // Test 4: Retry-After header
  console.log('Test 4: Retry-After calculation');
  const retryConfig = { maxRequests: 1, windowMs: 5000 };
  const retryId = `${testId}-retry`;
  
  checkRateLimit(retryId, retryConfig);
  const limitedWithRetry = checkRateLimit(retryId, retryConfig);
  
  if (limitedWithRetry.success) {
    console.error('  ❌ FAIL: Should be rate limited');
    process.exit(1);
  }
  if (!limitedWithRetry.retryAfter || limitedWithRetry.retryAfter < 1) {
    console.error('  ❌ FAIL: Should have valid retryAfter');
    process.exit(1);
  }
  console.log(`  retryAfter=${limitedWithRetry.retryAfter}s`);
  console.log('  ✅ PASS\n');

  // Test 5: Pre-configured limits
  console.log('Test 5: Pre-configured limits exist');
  console.log(`  GM: ${RATE_LIMITS.gm.maxRequests} requests / ${RATE_LIMITS.gm.windowMs}ms`);
  console.log(`  Image: ${RATE_LIMITS.image.maxRequests} requests / ${RATE_LIMITS.image.windowMs}ms`);
  console.log(`  TTS: ${RATE_LIMITS.tts.maxRequests} requests / ${RATE_LIMITS.tts.windowMs}ms`);
  console.log('  ✅ PASS\n');

  console.log('🎉 All tests passed!');
}

testRateLimiter().catch(console.error);
