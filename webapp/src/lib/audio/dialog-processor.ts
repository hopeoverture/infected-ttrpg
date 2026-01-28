/**
 * Dialog Processor
 * Parses narrative text into speaker-attributed segments for multi-voice TTS
 */

import { DialogSegment } from '@/lib/types/voice';

// Regex patterns for detecting quoted speech
const QUOTED_SPEECH_PATTERN = /"([^"]+)"/g;
// Note: Single quoted speech detection reserved for future use
// const SINGLE_QUOTED_SPEECH_PATTERN = /'([^']+)'/g;

// Common speech attribution patterns
const SPEECH_ATTRIBUTION_PATTERNS = [
  // "text," said Name / Name said, "text"
  /,?\s*(?:said|says|asked|asks|replied|replies|whispered|whispers|shouted|shouts|muttered|mutters|growled|growls|hissed|hisses|called|calls|cried|cries|answered|answers|responded|responds|exclaimed|exclaims|demanded|demands)\s+(\w+)/i,
  // Name said/says/asked etc.
  /(\w+)\s+(?:said|says|asked|asks|replied|replies|whispered|whispers|shouted|shouts|muttered|mutters|growled|growls|hissed|hisses|called|calls|cried|cries|answered|answers|responded|responds|exclaimed|exclaims|demanded|demands)/i,
];

// Patterns that indicate the player is speaking
const PLAYER_SPEECH_INDICATORS = [
  /^you\s+(?:say|ask|reply|whisper|shout|mutter|growl|hiss|call|cry|answer|respond|exclaim|demand)/i,
  /you\s+(?:say|ask|reply|whisper|shout|mutter)/i,
];

/**
 * Attempts to extract the speaker name from text surrounding a quote
 */
function extractSpeaker(
  textBefore: string,
  textAfter: string,
  knownNPCs: Map<string, string> // name -> npcId
): { speaker: 'gm' | 'player' | 'npc'; speakerId?: string; speakerName?: string } {
  // Check for player speech first
  for (const pattern of PLAYER_SPEECH_INDICATORS) {
    if (pattern.test(textBefore) || pattern.test(textAfter)) {
      return { speaker: 'player' };
    }
  }

  // Check for NPC attribution
  const combinedContext = `${textBefore} ${textAfter}`;

  for (const pattern of SPEECH_ATTRIBUTION_PATTERNS) {
    const match = combinedContext.match(pattern);
    if (match && match[1]) {
      const potentialName = match[1].trim();

      // Check if this matches a known NPC
      for (const [name, npcId] of knownNPCs) {
        if (name.toLowerCase() === potentialName.toLowerCase() ||
            name.toLowerCase().startsWith(potentialName.toLowerCase())) {
          return { speaker: 'npc', speakerId: npcId, speakerName: name };
        }
      }

      // Unknown speaker but has a name - treat as NPC
      const firstChar = potentialName[0];
      if (potentialName.length > 1 && firstChar && firstChar === firstChar.toUpperCase()) {
        return { speaker: 'npc', speakerName: potentialName };
      }
    }
  }

  // Default to GM narration
  return { speaker: 'gm' };
}

/**
 * Split text into segments, preserving narrative flow
 */
function splitIntoSegments(text: string): string[] {
  // Split on sentence boundaries while preserving quotes
  const segments: string[] = [];
  let current = '';
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    current += char;

    if (char === '"') {
      inQuote = !inQuote;
    }

    // End segment on sentence-ending punctuation (if not in quote)
    if (!inQuote && (char === '.' || char === '!' || char === '?')) {
      // Check for abbreviations and ellipsis
      const nextChar = text[i + 1];
      if (nextChar === '.' || nextChar === '"') {
        continue;
      }

      const trimmed = current.trim();
      if (trimmed) {
        segments.push(trimmed);
      }
      current = '';
    }
  }

  // Add any remaining text
  const trimmed = current.trim();
  if (trimmed) {
    segments.push(trimmed);
  }

  return segments;
}

/**
 * Parse narrative text into dialog segments for multi-voice playback
 */
export function parseNarrativeToSegments(
  narrative: string,
  knownNPCs: Map<string, string> = new Map()
): DialogSegment[] {
  const segments: DialogSegment[] = [];
  const textSegments = splitIntoSegments(narrative);

  for (const text of textSegments) {
    // Check if this segment contains quoted speech
    const quoteMatch = text.match(QUOTED_SPEECH_PATTERN);

    if (quoteMatch && quoteMatch.length > 0) {
      // Split the segment around the quote
      let remaining = text;
      let lastIndex = 0;

      // Reset regex
      QUOTED_SPEECH_PATTERN.lastIndex = 0;

      let match;
      while ((match = QUOTED_SPEECH_PATTERN.exec(text)) !== null) {
        const beforeQuote = text.slice(lastIndex, match.index);
        const quotedText = match[1] ?? '';

        // Skip empty quotes
        if (!quotedText.trim()) {
          lastIndex = match.index + match[0].length;
          continue;
        }

        // Add any narrative before the quote
        if (beforeQuote.trim()) {
          segments.push({
            speaker: 'gm',
            text: beforeQuote.trim(),
            isQuoted: false
          });
        }

        // Determine who is speaking
        const afterQuote = text.slice(match.index + match[0].length, match.index + match[0].length + 50);
        const speakerInfo = extractSpeaker(beforeQuote, afterQuote, knownNPCs);

        // Add the quoted speech
        segments.push({
          ...speakerInfo,
          text: quotedText,
          isQuoted: true
        });

        lastIndex = match.index + match[0].length;
      }

      // Add any remaining narrative after the last quote
      remaining = text.slice(lastIndex).trim();

      // Clean up attribution phrases from remaining text
      if (remaining) {
        // Remove standalone speech verbs at the start
        remaining = remaining.replace(/^,?\s*(?:said|says|asked|asks|replied|replies|whispered|whispers|shouted|shouts)\s+\w+\.?\s*/i, '');
        remaining = remaining.trim();

        if (remaining) {
          segments.push({
            speaker: 'gm',
            text: remaining,
            isQuoted: false
          });
        }
      }
    } else {
      // No quotes - this is pure narration
      segments.push({
        speaker: 'gm',
        text: text,
        isQuoted: false
      });
    }
  }

  return mergeConsecutiveSegments(segments);
}

/**
 * Merge consecutive segments from the same speaker
 */
function mergeConsecutiveSegments(segments: DialogSegment[]): DialogSegment[] {
  if (segments.length === 0) return [];

  const firstSegment = segments[0];
  if (!firstSegment) return [];

  const merged: DialogSegment[] = [];
  let current = { ...firstSegment };

  for (let i = 1; i < segments.length; i++) {
    const next = segments[i];
    if (!next) continue;

    // Merge if same speaker and both non-quoted (or both quoted from same speaker)
    if (current.speaker === next.speaker &&
        current.speakerId === next.speakerId &&
        current.isQuoted === next.isQuoted) {
      current.text += ' ' + next.text;
    } else {
      merged.push(current);
      current = { ...next };
    }
  }

  merged.push(current);
  return merged;
}

/**
 * Use pre-parsed dialog segments from GM response if available,
 * otherwise parse the narrative text
 */
export function getDialogSegments(
  narrative: string,
  gmDialogSegments?: DialogSegment[],
  knownNPCs?: Map<string, string>
): DialogSegment[] {
  // If GM already provided parsed segments, use those
  if (gmDialogSegments && gmDialogSegments.length > 0) {
    return gmDialogSegments;
  }

  // Otherwise, parse the narrative ourselves
  return parseNarrativeToSegments(narrative, knownNPCs);
}

/**
 * Calculate approximate duration for a text segment (for timing/sequencing)
 * Based on average speaking rate of ~150 words per minute
 */
export function estimateSegmentDuration(text: string): number {
  const words = text.split(/\s+/).length;
  const wordsPerSecond = 150 / 60; // ~2.5 words per second
  return Math.max(1, words / wordsPerSecond);
}
