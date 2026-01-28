'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Background,
  BACKGROUNDS,
  Attributes,
  Skills,
  DEFAULT_SKILLS,
  DEFAULT_APPEARANCE,
  CharacterAppearance,
  ArtStyle,
  SkillName,
  AgeRange,
  BodyType,
  Gender,
  PersonalityTrait,
  Fear,
  CopingMechanism,
  MoralCode,
  SurvivalPhilosophy,
  CharacterPersonality,
  CharacterConnections,
  LostLovedOne,
  NPCBond,
  Character,
  PERSONALITY_TRAITS,
  FEARS,
  COPING_MECHANISMS,
  MORAL_CODES,
  SURVIVAL_PHILOSOPHIES
} from '@/lib/types';
import { GamePreferences, DEFAULT_PREFERENCES } from '@/lib/types/game-preferences';
import { FullGeneratedScenario } from '@/lib/types/generated-scenario';
import { createCharacter } from '@/lib/supabase/characters';
import { createGame } from '@/lib/supabase/games';
import CharacterPortrait from '@/components/game/CharacterPortrait';
import CreationNarrationUI from '@/components/game/CreationNarrationUI';
import PreferencesStep from '@/components/game/PreferencesStep';
import ScenarioSelectionStep from '@/components/game/ScenarioSelectionStep';
import CharacterVoiceStep from '@/components/game/CharacterVoiceStep';
import GMVoiceStep from '@/components/game/GMVoiceStep';
import { useCreationNarration } from '@/hooks/useCreationNarration';
// Note: Old premade scenarios still available in '@/lib/scenarios' for reference/existing games

type CreationStep = 'background' | 'appearance' | 'psychology' | 'connections' | 'attributes' | 'skills' | 'voice' | 'preferences' | 'gm-voice' | 'scenario';

const SKILL_GROUPS = {
  grit: ['brawl', 'endure', 'athletics'] as SkillName[],
  reflex: ['shoot', 'stealth', 'drive'] as SkillName[],
  wits: ['notice', 'craft', 'tech', 'medicine', 'survival', 'knowledge'] as SkillName[],
  nerve: ['persuade', 'deceive', 'resolve', 'intimidate', 'animals'] as SkillName[]
};

const SKILL_NAMES: Record<SkillName, string> = {
  brawl: 'Brawl',
  endure: 'Endure',
  athletics: 'Athletics',
  shoot: 'Shoot',
  stealth: 'Stealth',
  drive: 'Drive',
  notice: 'Notice',
  craft: 'Craft',
  tech: 'Tech',
  medicine: 'Medicine',
  survival: 'Survival',
  knowledge: 'Knowledge',
  persuade: 'Persuade',
  deceive: 'Deceive',
  resolve: 'Resolve',
  intimidate: 'Intimidate',
  animals: 'Animals'
};

// Appearance options
const GENDERS: { value: Gender; label: string; icon: string }[] = [
  { value: 'male', label: 'Male', icon: '♂' },
  { value: 'female', label: 'Female', icon: '♀' },
  { value: 'androgynous', label: 'Androgynous', icon: '⚥' }
];

const AGE_RANGES: { value: AgeRange; label: string; desc: string }[] = [
  { value: 'young', label: 'Young Adult', desc: '18-25' },
  { value: 'adult', label: 'Adult', desc: '26-40' },
  { value: 'middle-aged', label: 'Middle-Aged', desc: '41-55' },
  { value: 'older', label: 'Older', desc: '56+' }
];

const BODY_TYPES: { value: BodyType; label: string; icon: string }[] = [
  { value: 'slight', label: 'Slight', icon: '🧍' },
  { value: 'average', label: 'Average', icon: '🧍' },
  { value: 'athletic', label: 'Athletic', icon: '💪' },
  { value: 'heavy', label: 'Heavy', icon: '🧍' }
];

const SKIN_TONES = [
  { value: 'pale', label: 'Pale', color: '#FFE4C4' },
  { value: 'fair', label: 'Fair', color: '#FFDAB9' },
  { value: 'light', label: 'Light', color: '#DEB887' },
  { value: 'medium', label: 'Medium', color: '#D2A679' },
  { value: 'olive', label: 'Olive', color: '#C19A6B' },
  { value: 'tan', label: 'Tan', color: '#B5834A' },
  { value: 'brown', label: 'Brown', color: '#8B6914' },
  { value: 'dark', label: 'Dark', color: '#654321' },
  { value: 'deep', label: 'Deep', color: '#3D2914' }
];

const HAIR_STYLES = [
  'Bald', 'Buzzcut', 'Short', 'Medium', 'Long', 'Very Long',
  'Mohawk', 'Ponytail', 'Braids', 'Dreadlocks', 'Curly', 'Wavy',
  'Slicked Back', 'Messy', 'Undercut', 'Shaved Sides'
];

const HAIR_COLORS = [
  { value: 'black', label: 'Black', color: '#0a0a0a' },
  { value: 'dark brown', label: 'Dark Brown', color: '#3b2314' },
  { value: 'brown', label: 'Brown', color: '#5c4033' },
  { value: 'light brown', label: 'Light Brown', color: '#8b6914' },
  { value: 'auburn', label: 'Auburn', color: '#922724' },
  { value: 'red', label: 'Red', color: '#b7410e' },
  { value: 'strawberry blonde', label: 'Strawberry', color: '#cc7722' },
  { value: 'blonde', label: 'Blonde', color: '#e6be8a' },
  { value: 'platinum', label: 'Platinum', color: '#e5e4e2' },
  { value: 'gray', label: 'Gray', color: '#808080' },
  { value: 'white', label: 'White', color: '#f5f5f5' },
  { value: 'dyed blue', label: 'Blue', color: '#4169e1' },
  { value: 'dyed purple', label: 'Purple', color: '#800080' },
  { value: 'dyed green', label: 'Green', color: '#228b22' }
];

const FACIAL_HAIR_OPTIONS = [
  'None', 'Stubble', 'Goatee', 'Full Beard', 'Mustache', 
  'Van Dyke', 'Soul Patch', 'Mutton Chops', 'Unkempt'
];

const DISTINGUISHING_FEATURES = [
  'Scar on face', 'Scar on neck', 'Missing eye', 'Eye patch',
  'Burn marks', 'Tattoos (face)', 'Tattoos (neck)', 'Tattoos (arms)',
  'Piercings', 'Glasses', 'Freckles', 'Birthmark',
  'Broken nose', 'Weathered skin', 'Gaunt face', 'Wrinkles',
  'Heterochromia', 'Vitiligo', 'Intense eyes', 'Kind eyes'
];

const ART_STYLES: { value: ArtStyle; label: string; desc: string }[] = [
  { value: 'cinematic', label: 'Cinematic', desc: 'Movie-like dramatic lighting' },
  { value: 'realistic', label: 'Realistic', desc: 'Photorealistic detail' },
  { value: 'graphic-novel', label: 'Graphic Novel', desc: 'Bold comic book style' },
  { value: 'gritty', label: 'Gritty', desc: 'Raw documentary feel' },
  { value: 'painted', label: 'Painted', desc: 'Digital art aesthetic' }
];

export default function NewGame() {
  const router = useRouter();
  const [step, setStep] = useState<CreationStep>('background');
  
  // Narration hook for atmospheric voice-over
  const narration = useCreationNarration({ enabled: true });
  const isFirstMount = useRef(true);

  // Play intro narration on mount
  useEffect(() => {
    // Small delay to let page render first
    const timer = setTimeout(() => {
      narration.playIntro();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Play narration when step changes (skip initial mount - intro handles that)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    // Stop any current audio before playing new step narration
    narration.stop();
    narration.playForStep(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  
  // Character data
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [background, setBackground] = useState<Background | null>(null);
  const [appearance, setAppearance] = useState<CharacterAppearance>({ ...DEFAULT_APPEARANCE });
  const [artStyle, setArtStyle] = useState<ArtStyle>('cinematic');
  const [attributes, setAttributes] = useState<Attributes>({ grit: 3, reflex: 3, wits: 3, nerve: 3 });
  const [skills, setSkills] = useState<Skills>({ ...DEFAULT_SKILLS });
  const [motivation, setMotivation] = useState('');

  // Game preferences and generated scenario
  const [preferences, setPreferences] = useState<GamePreferences>(DEFAULT_PREFERENCES);
  const [generatedScenario, setGeneratedScenario] = useState<FullGeneratedScenario | null>(null);
  const [, setGenerationId] = useState<string | null>(null); // Stored for potential future use
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);

  // Personality & psychology
  const [primaryTrait, setPrimaryTrait] = useState<PersonalityTrait | null>(null);
  const [secondaryTrait, setSecondaryTrait] = useState<PersonalityTrait | null>(null);
  const [greatestFear, setGreatestFear] = useState<Fear | null>(null);
  const [copingMechanism, setCopingMechanism] = useState<CopingMechanism | null>(null);
  const [darkSecret, setDarkSecret] = useState('');

  // Connections & relationships
  const [lostLovedOne, setLostLovedOne] = useState<LostLovedOne | null>(null);
  const [hauntingMemory, setHauntingMemory] = useState('');
  const [whoTheyProtect, setWhoTheyProtect] = useState('');
  const [sentimentalItem, setSentimentalItem] = useState('');
  const [trustedNPC, setTrustedNPC] = useState<NPCBond | null>(null);
  const [waryNPC, setWaryNPC] = useState<NPCBond | null>(null);

  // Moral stance
  const [moralCode, setMoralCode] = useState<MoralCode | null>(null);
  const [survivalPhilosophy, setSurvivalPhilosophy] = useState<SurvivalPhilosophy | null>(null);

  // Voice settings
  const [characterVoiceId, setCharacterVoiceId] = useState<string | null>(null);

  const attributePoints = 12 - (attributes.grit + attributes.reflex + attributes.wits + attributes.nerve);
  const skillPoints = 12 - Object.values(skills).reduce((a, b) => a + b, 0);

  const updateAppearance = <K extends keyof CharacterAppearance>(key: K, value: CharacterAppearance[K]) => {
    setAppearance(prev => ({ ...prev, [key]: value }));
    // Clear portrait when appearance changes so user can regenerate
    setPortraitUrl(null);
  };

  const toggleFeature = (feature: string) => {
    setAppearance(prev => ({
      ...prev,
      distinguishingFeatures: prev.distinguishingFeatures.includes(feature)
        ? prev.distinguishingFeatures.filter(f => f !== feature)
        : [...prev.distinguishingFeatures, feature].slice(0, 5) // Max 5 features
    }));
    setPortraitUrl(null);
  };

  const updateAttribute = (attr: keyof Attributes, delta: number) => {
    const newValue = attributes[attr] + delta;
    if (newValue >= 1 && newValue <= 4) {
      const newTotal = (attributes.grit + attributes.reflex + attributes.wits + attributes.nerve) + delta;
      if (newTotal <= 12) {
        setAttributes({ ...attributes, [attr]: newValue });
      }
    }
  };

  const updateSkill = (skill: SkillName, delta: number) => {
    const baseMax = 3;
    const bonusSkill = background ? BACKGROUNDS[background].bonus : null;
    const max = skill === bonusSkill ? 4 : baseMax;
    
    const newValue = skills[skill] + delta;
    if (newValue >= 0 && newValue <= max) {
      const newTotal = Object.values(skills).reduce((a, b) => a + b, 0) + delta;
      if (newTotal <= 12) {
        setSkills({ ...skills, [skill]: newValue });
      }
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'background':
        return name.trim().length > 0 && background !== null;
      case 'appearance':
        return true; // Appearance is optional, all have defaults
      case 'psychology':
        return primaryTrait !== null && greatestFear !== null && copingMechanism !== null;
      case 'connections':
        return true; // All connections are optional
      case 'attributes':
        return attributePoints === 0;
      case 'skills':
        return skillPoints === 0 && motivation.trim().length > 0;
      case 'voice':
        return true; // Voice is optional, default will be used
      case 'preferences':
        return preferences.themes.length > 0;
      case 'gm-voice':
        return true; // GM voice is optional, default will be used
      case 'scenario':
        return generatedScenario !== null; // Must select a generated scenario
    }
  };

  const STEPS: CreationStep[] = ['background', 'appearance', 'psychology', 'connections', 'attributes', 'skills', 'voice', 'preferences', 'gm-voice', 'scenario'];

  const nextStep = () => {
    const currentIndex = STEPS.indexOf(step);
    const nextStepValue = STEPS[currentIndex + 1];
    if (currentIndex < STEPS.length - 1 && nextStepValue) {
      setStep(nextStepValue);
    }
  };

  const prevStep = () => {
    const currentIndex = STEPS.indexOf(step);
    const prevStepValue = STEPS[currentIndex - 1];
    if (currentIndex > 0 && prevStepValue) {
      setStep(prevStepValue);
    }
  };

  // Build personality object from state
  const buildPersonality = (): CharacterPersonality | undefined => {
    if (!primaryTrait || !greatestFear || !copingMechanism) return undefined;
    return {
      primaryTrait,
      secondaryTrait: secondaryTrait || undefined,
      greatestFear,
      copingMechanism,
      darkSecret: darkSecret || undefined
    };
  };

  // Build connections object from state
  const buildConnections = (): CharacterConnections | undefined => {
    const bonds: NPCBond[] = [];
    if (trustedNPC?.name) bonds.push(trustedNPC);
    if (waryNPC?.name) bonds.push(waryNPC);

    const hasAnyConnection = lostLovedOne?.name || hauntingMemory || whoTheyProtect || sentimentalItem || bonds.length > 0;
    if (!hasAnyConnection) return undefined;

    return {
      lostLovedOne: lostLovedOne?.name ? lostLovedOne : undefined,
      hauntingMemory: hauntingMemory || undefined,
      whoTheyProtect: whoTheyProtect || undefined,
      sentimentalItem: sentimentalItem || undefined,
      bonds: bonds.length > 0 ? bonds : undefined
    };
  };

  // Build full character object for scenario generation
  const buildCharacter = (): Character => {
    return {
      name,
      nickname: nickname || undefined,
      background: background || 'civilian',
      attributes,
      skills,
      motivation,
      appearance,
      artStyle,
      personality: buildPersonality(),
      connections: buildConnections(),
      moralCode: moralCode || undefined,
      survivalPhilosophy: survivalPhilosophy || undefined,
      portraitUrl: portraitUrl || undefined,
      voiceId: characterVoiceId || undefined
    } as Character;
  };

  // Handle scenario selection from ScenarioSelectionStep
  const handleScenarioSelected = (scenario: FullGeneratedScenario, genId: string) => {
    setGeneratedScenario(scenario);
    setGenerationId(genId);
  };

  const saveCharacterOnly = async () => {
    if (!background || !primaryTrait || !greatestFear || !copingMechanism) return;

    narration.stop();
    setIsCreating(true);
    setError(null);

    try {
      const characterId = await createCharacter({
        name,
        nickname: nickname || undefined,
        background,
        attributes,
        skills,
        motivation,
        portraitUrl: portraitUrl || undefined,
        appearance,
        artStyle,
        personality: buildPersonality(),
        connections: buildConnections(),
        moralCode: moralCode || undefined,
        survivalPhilosophy: survivalPhilosophy || undefined,
        voiceId: characterVoiceId || undefined
      });

      router.push(`/characters/${characterId}`);
    } catch (err) {
      console.error('Failed to save character:', err);
      setError(err instanceof Error ? err.message : 'Failed to save character. Please try again.');
      setIsCreating(false);
    }
  };

  const startGame = async () => {
    if (!background || !generatedScenario) return;

    // Stop any narration before starting
    narration.stop();

    setIsCreating(true);
    setError(null);

    try {
      const gameId = await createGame({
        name,
        nickname: nickname || undefined,
        background,
        attributes,
        skills,
        motivation,
        scenario: 'generated',
        generatedScenario,
        preferences,
        portraitUrl: portraitUrl || undefined,
        appearance,
        artStyle,
        personality: buildPersonality(),
        connections: buildConnections(),
        moralCode: moralCode || undefined,
        survivalPhilosophy: survivalPhilosophy || undefined,
        voiceId: characterVoiceId || undefined
      });

      router.push(`/game/${gameId}`);
    } catch (err) {
      console.error('Failed to create game:', err);
      setError(err instanceof Error ? err.message : 'Failed to create game. Please try again.');
      setIsCreating(false);
    }
  };

  // Build appearance summary for portrait generation
  const getAppearanceSummary = (): string => {
    const parts = [
      `${appearance.age} ${appearance.gender}`,
      `${appearance.bodyType} build`,
      `${appearance.skinTone} skin`,
      `${appearance.hairColor} ${appearance.hairStyle.toLowerCase()} hair`
    ];
    if (appearance.facialHair && appearance.facialHair !== 'None') {
      parts.push(appearance.facialHair.toLowerCase());
    }
    if (appearance.distinguishingFeatures.length > 0) {
      parts.push(appearance.distinguishingFeatures.join(', ').toLowerCase());
    }
    return parts.join(', ');
  };

  return (
    <div className="min-h-screen">
      {/* Narration UI - mute button and subtitles */}
      <CreationNarrationUI
        isPlaying={narration.isPlaying}
        isLoading={narration.isLoading}
        isMuted={narration.isMuted}
        subtitle={narration.currentSubtitle}
        onToggleMute={narration.toggleMute}
        onSkip={narration.stop}
      />

      {/* Header */}
      <header className="border-b border-subtle">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-secondary hover:text-primary transition-colors">
            ← Back
          </Link>
          <h1 className="text-xl font-bold tracking-wider">NEW GAME</h1>
          <div className="w-16" />
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => {
                  const currentIndex = STEPS.indexOf(step);
                  if (i < currentIndex) setStep(s);
                }}
                disabled={i > STEPS.indexOf(step)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  step === s ? 'bg-gold' : 
                  STEPS.indexOf(step) > i ? 'bg-success cursor-pointer hover:bg-success/80' : 'bg-border-medium'
                }`}
                title={s.charAt(0).toUpperCase() + s.slice(1)}
              />
              {i < STEPS.length - 1 && <div className="w-8 md:w-12 h-0.5 bg-border-subtle mx-1" />}
            </div>
          ))}
        </div>
        <div className="text-center text-xs text-muted mt-2">
          {step === 'background' && 'Identity'}
          {step === 'appearance' && 'Appearance'}
          {step === 'psychology' && 'Psychology'}
          {step === 'connections' && 'Connections'}
          {step === 'attributes' && 'Attributes'}
          {step === 'skills' && 'Skills'}
          {step === 'voice' && 'Character Voice'}
          {step === 'preferences' && 'Preferences'}
          {step === 'gm-voice' && 'GM Voice'}
          {step === 'scenario' && 'Scenario'}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Step 1: Background */}
        {step === 'background' && (
          <div className="animate-fade-in">
            <div className="panel mb-8">
              <h2 className="text-2xl font-bold text-center mb-6">WHO ARE YOU?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="panel-label">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your character's name"
                    className="input"
                    maxLength={30}
                  />
                </div>
                <div>
                  <label className="panel-label">Nickname <span className="text-muted">(optional)</span></label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="What do people call you?"
                    className="input"
                    maxLength={20}
                  />
                </div>
              </div>

              <div>
                <label className="panel-label">Background</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {(Object.keys(BACKGROUNDS) as Background[]).map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setBackground(bg)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        background === bg 
                          ? 'border-gold bg-gold/10' 
                          : 'border-subtle hover:border-medium'
                      }`}
                    >
                      <div className="font-medium">{BACKGROUNDS[bg].name}</div>
                      <div className="text-xs text-muted">+1 {SKILL_NAMES[BACKGROUNDS[bg].bonus]}</div>
                    </button>
                  ))}
                </div>

                {background && (
                  <div className="panel bg-card mt-4">
                    <h3 className="font-semibold text-gold mb-2">{BACKGROUNDS[background].name}</h3>
                    <p className="text-secondary text-sm mb-3 italic">
                      &ldquo;{BACKGROUNDS[background].description}&rdquo;
                    </p>
                    <div className="text-sm">
                      <span className="text-muted">Starting Gear: </span>
                      {BACKGROUNDS[background].gear.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Appearance */}
        {step === 'appearance' && (
          <div className="animate-fade-in">
            <div className="panel mb-8">
              <h2 className="text-2xl font-bold text-center mb-2">APPEARANCE</h2>
              <p className="text-center text-secondary mb-6">
                Customize how your character looks
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Left column - options */}
                <div className="space-y-6">
                  {/* Gender */}
                  <div>
                    <label className="panel-label">Presentation</label>
                    <div className="flex gap-2">
                      {GENDERS.map((g) => (
                        <button
                          key={g.value}
                          onClick={() => updateAppearance('gender', g.value)}
                          className={`flex-1 p-3 rounded-lg border transition-all ${
                            appearance.gender === g.value
                              ? 'border-gold bg-gold/10'
                              : 'border-subtle hover:border-medium'
                          }`}
                        >
                          <div className="text-lg">{g.icon}</div>
                          <div className="text-sm">{g.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="panel-label">Age</label>
                    <div className="grid grid-cols-2 gap-2">
                      {AGE_RANGES.map((a) => (
                        <button
                          key={a.value}
                          onClick={() => updateAppearance('age', a.value)}
                          className={`p-2 rounded-lg border transition-all text-left ${
                            appearance.age === a.value
                              ? 'border-gold bg-gold/10'
                              : 'border-subtle hover:border-medium'
                          }`}
                        >
                          <div className="text-sm font-medium">{a.label}</div>
                          <div className="text-xs text-muted">{a.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body Type */}
                  <div>
                    <label className="panel-label">Build</label>
                    <div className="flex gap-2">
                      {BODY_TYPES.map((b) => (
                        <button
                          key={b.value}
                          onClick={() => updateAppearance('bodyType', b.value)}
                          className={`flex-1 p-2 rounded-lg border transition-all ${
                            appearance.bodyType === b.value
                              ? 'border-gold bg-gold/10'
                              : 'border-subtle hover:border-medium'
                          }`}
                        >
                          <div className="text-sm">{b.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skin Tone */}
                  <div>
                    <label className="panel-label">Skin Tone</label>
                    <div className="flex flex-wrap gap-2">
                      {SKIN_TONES.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => updateAppearance('skinTone', s.value)}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            appearance.skinTone === s.value
                              ? 'border-gold scale-110'
                              : 'border-transparent hover:border-medium'
                          }`}
                          style={{ backgroundColor: s.color }}
                          title={s.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hair Style */}
                  <div>
                    <label className="panel-label">Hair Style</label>
                    <select
                      value={appearance.hairStyle}
                      onChange={(e) => updateAppearance('hairStyle', e.target.value)}
                      className="input"
                      title="Hair style"
                      aria-label="Hair style"
                    >
                      {HAIR_STYLES.map((style) => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hair Color */}
                  <div>
                    <label className="panel-label">Hair Color</label>
                    <div className="flex flex-wrap gap-2">
                      {HAIR_COLORS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => updateAppearance('hairColor', c.value)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            appearance.hairColor === c.value
                              ? 'border-gold scale-110'
                              : 'border-transparent hover:border-medium'
                          }`}
                          style={{ backgroundColor: c.color }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Facial Hair (conditionally shown) */}
                  {appearance.gender !== 'female' && (
                    <div>
                      <label className="panel-label">Facial Hair</label>
                      <select
                        value={appearance.facialHair || 'None'}
                        onChange={(e) => updateAppearance('facialHair', e.target.value)}
                        className="input"
                        title="Facial hair style"
                        aria-label="Facial hair style"
                      >
                        {FACIAL_HAIR_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Right column - portrait and features */}
                <div className="space-y-6">
                  {/* Portrait Preview */}
                  <div className="text-center">
                    <label className="panel-label">Portrait</label>
                    <div className="flex justify-center mb-4">
                      <CharacterPortrait
                        portraitUrl={portraitUrl}
                        characterName={name || 'Survivor'}
                        characterBackground={background || 'survivor'}
                        appearance={appearance}
                        artStyle={artStyle}
                        size="large"
                        editable={name.trim().length > 0}
                        onPortraitChange={setPortraitUrl}
                      />
                    </div>
                    <p className="text-xs text-muted">
                      Click to generate AI portrait
                    </p>
                  </div>

                  {/* Art Style */}
                  <div>
                    <label className="panel-label">Art Style</label>
                    <div className="space-y-2">
                      {ART_STYLES.map((style) => (
                        <button
                          key={style.value}
                          onClick={() => {
                            setArtStyle(style.value);
                            setPortraitUrl(null);
                          }}
                          className={`w-full p-3 rounded-lg border transition-all text-left ${
                            artStyle === style.value
                              ? 'border-gold bg-gold/10'
                              : 'border-subtle hover:border-medium'
                          }`}
                        >
                          <div className="font-medium text-sm">{style.label}</div>
                          <div className="text-xs text-muted">{style.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Distinguishing Features */}
                  <div>
                    <label className="panel-label">
                      Distinguishing Features
                      <span className="text-muted ml-2">({appearance.distinguishingFeatures.length}/5)</span>
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      {DISTINGUISHING_FEATURES.map((feature) => (
                        <button
                          key={feature}
                          onClick={() => toggleFeature(feature)}
                          disabled={
                            !appearance.distinguishingFeatures.includes(feature) && 
                            appearance.distinguishingFeatures.length >= 5
                          }
                          className={`px-3 py-1 rounded-full text-xs transition-all ${
                            appearance.distinguishingFeatures.includes(feature)
                              ? 'bg-gold text-black'
                              : 'bg-card border border-subtle hover:border-medium disabled:opacity-30'
                          }`}
                        >
                          {feature}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Appearance Summary */}
              <div className="mt-6 p-4 bg-card rounded-lg border border-subtle">
                <label className="panel-label mb-2">Summary</label>
                <p className="text-secondary text-sm">{getAppearanceSummary()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Psychology */}
        {step === 'psychology' && (
          <div className="animate-fade-in">
            <div className="panel mb-8">
              <h2 className="text-2xl font-bold text-center mb-2">PSYCHOLOGY</h2>
              <p className="text-center text-secondary mb-6">
                What drives you? What haunts you?
              </p>

              <div className="space-y-6">
                {/* Primary Trait */}
                <div>
                  <label className="panel-label">Primary Personality Trait</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {(Object.keys(PERSONALITY_TRAITS) as PersonalityTrait[]).map((trait) => (
                      <button
                        key={trait}
                        onClick={() => setPrimaryTrait(trait)}
                        className={`p-3 rounded-lg border transition-all text-left ${
                          primaryTrait === trait
                            ? 'border-gold bg-gold/10'
                            : 'border-subtle hover:border-medium'
                        }`}
                      >
                        <div className="font-medium text-sm">{PERSONALITY_TRAITS[trait].name}</div>
                        <div className="text-xs text-muted line-clamp-2">{PERSONALITY_TRAITS[trait].description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secondary Trait */}
                <div>
                  <label className="panel-label">Secondary Trait <span className="text-muted">(optional)</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {(Object.keys(PERSONALITY_TRAITS) as PersonalityTrait[])
                      .filter(t => t !== primaryTrait)
                      .map((trait) => (
                        <button
                          key={trait}
                          onClick={() => setSecondaryTrait(secondaryTrait === trait ? null : trait)}
                          className={`p-3 rounded-lg border transition-all text-left ${
                            secondaryTrait === trait
                              ? 'border-gold bg-gold/10'
                              : 'border-subtle hover:border-medium'
                          }`}
                        >
                          <div className="font-medium text-sm">{PERSONALITY_TRAITS[trait].name}</div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Greatest Fear */}
                <div>
                  <label className="panel-label">Greatest Fear</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(Object.keys(FEARS) as Fear[]).map((fear) => (
                      <button
                        key={fear}
                        onClick={() => setGreatestFear(fear)}
                        className={`p-3 rounded-lg border transition-all text-left ${
                          greatestFear === fear
                            ? 'border-danger bg-danger/10'
                            : 'border-subtle hover:border-medium'
                        }`}
                      >
                        <div className="font-medium text-sm">{FEARS[fear].name}</div>
                        <div className="text-xs text-muted line-clamp-2">{FEARS[fear].description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coping Mechanism */}
                <div>
                  <label className="panel-label">How do you cope?</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(Object.keys(COPING_MECHANISMS) as CopingMechanism[]).map((coping) => (
                      <button
                        key={coping}
                        onClick={() => setCopingMechanism(coping)}
                        className={`p-3 rounded-lg border transition-all text-left ${
                          copingMechanism === coping
                            ? 'border-gold bg-gold/10'
                            : 'border-subtle hover:border-medium'
                        }`}
                      >
                        <div className="font-medium text-sm">{COPING_MECHANISMS[coping].name}</div>
                        <div className="text-xs text-muted line-clamp-2">{COPING_MECHANISMS[coping].description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dark Secret */}
                <div>
                  <label className="panel-label">Dark Secret <span className="text-muted">(optional)</span></label>
                  <input
                    type="text"
                    value={darkSecret}
                    onChange={(e) => setDarkSecret(e.target.value)}
                    placeholder="Something you've never told anyone..."
                    className="input"
                    maxLength={150}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Connections */}
        {step === 'connections' && (
          <div className="animate-fade-in">
            <div className="panel mb-8">
              <h2 className="text-2xl font-bold text-center mb-2">CONNECTIONS</h2>
              <p className="text-center text-secondary mb-6">
                Who did you lose? Who keeps you going?
              </p>

              <div className="space-y-6">
                {/* Lost Loved One */}
                <div className="p-4 bg-card rounded-lg border border-subtle">
                  <label className="panel-label">Lost Loved One <span className="text-muted">(optional)</span></label>
                  <p className="text-xs text-muted mb-3">Someone taken by the outbreak</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={lostLovedOne?.name || ''}
                      onChange={(e) => setLostLovedOne(prev => ({
                        name: e.target.value,
                        relationship: prev?.relationship || 'spouse',
                        fate: prev?.fate || 'dead'
                      }))}
                      placeholder="Their name"
                      className="input"
                      maxLength={30}
                    />
                    <select
                      value={lostLovedOne?.relationship || ''}
                      onChange={(e) => setLostLovedOne(prev => prev ? { ...prev, relationship: e.target.value } : null)}
                      className="input"
                      disabled={!lostLovedOne?.name}
                      title="Relationship to lost loved one"
                      aria-label="Relationship to lost loved one"
                    >
                      <option value="">Relationship</option>
                      <option value="spouse">Spouse/Partner</option>
                      <option value="child">Child</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="friend">Close Friend</option>
                      <option value="mentor">Mentor</option>
                    </select>
                    <select
                      value={lostLovedOne?.fate || ''}
                      onChange={(e) => setLostLovedOne(prev => prev ? { ...prev, fate: e.target.value as LostLovedOne['fate'] } : null)}
                      className="input"
                      disabled={!lostLovedOne?.name}
                      title="Fate of lost loved one"
                      aria-label="Fate of lost loved one"
                    >
                      <option value="">Their fate</option>
                      <option value="dead">Dead</option>
                      <option value="turned">Turned</option>
                      <option value="missing">Missing</option>
                    </select>
                  </div>
                </div>

                {/* Haunting Memory */}
                <div>
                  <label className="panel-label">Haunting Memory <span className="text-muted">(optional)</span></label>
                  <textarea
                    value={hauntingMemory}
                    onChange={(e) => setHauntingMemory(e.target.value)}
                    placeholder="A moment you can't forget... something that changed you..."
                    className="input min-h-[80px]"
                    maxLength={200}
                  />
                </div>

                {/* Who They Protect */}
                <div>
                  <label className="panel-label">Someone to Protect <span className="text-muted">(optional)</span></label>
                  <input
                    type="text"
                    value={whoTheyProtect}
                    onChange={(e) => setWhoTheyProtect(e.target.value)}
                    placeholder="Who are you surviving for?"
                    className="input"
                    maxLength={50}
                  />
                </div>

                {/* Sentimental Item */}
                <div>
                  <label className="panel-label">Sentimental Item <span className="text-muted">(optional)</span></label>
                  <input
                    type="text"
                    value={sentimentalItem}
                    onChange={(e) => setSentimentalItem(e.target.value)}
                    placeholder="An item with no practical value but infinite meaning"
                    className="input"
                    maxLength={50}
                  />
                  <p className="text-xs text-muted mt-1">No mechanical benefit, but it matters to you</p>
                </div>

                {/* NPC Bonds */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-card rounded-lg border border-subtle">
                    <label className="panel-label text-success">Someone You Trust <span className="text-muted">(optional)</span></label>
                    <p className="text-xs text-muted mb-2">The GM may introduce this NPC into your story</p>
                    <input
                      type="text"
                      value={trustedNPC?.name || ''}
                      onChange={(e) => setTrustedNPC(e.target.value ? { name: e.target.value, type: 'trust' } : null)}
                      placeholder="Their name"
                      className="input mb-2"
                      maxLength={30}
                    />
                    {trustedNPC?.name && (
                      <input
                        type="text"
                        value={trustedNPC?.description || ''}
                        onChange={(e) => setTrustedNPC(prev => prev ? { ...prev, description: e.target.value } : null)}
                        placeholder="How do you know them?"
                        className="input"
                        maxLength={50}
                      />
                    )}
                  </div>
                  <div className="p-4 bg-card rounded-lg border border-subtle">
                    <label className="panel-label text-warning">Someone You&apos;re Wary Of <span className="text-muted">(optional)</span></label>
                    <p className="text-xs text-muted mb-2">A potential source of conflict or betrayal</p>
                    <input
                      type="text"
                      value={waryNPC?.name || ''}
                      onChange={(e) => setWaryNPC(e.target.value ? { name: e.target.value, type: 'wary' } : null)}
                      placeholder="Their name"
                      className="input mb-2"
                      maxLength={30}
                    />
                    {waryNPC?.name && (
                      <input
                        type="text"
                        value={waryNPC?.description || ''}
                        onChange={(e) => setWaryNPC(prev => prev ? { ...prev, description: e.target.value } : null)}
                        placeholder="Why don't you trust them?"
                        className="input"
                        maxLength={50}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Attributes */}
        {step === 'attributes' && (
          <div className="animate-fade-in">
            <div className="panel mb-8">
              <h2 className="text-2xl font-bold text-center mb-2">ATTRIBUTES</h2>
              <p className="text-center text-secondary mb-6">
                Distribute 12 points (1-4 each)
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {(['grit', 'reflex', 'wits', 'nerve'] as const).map((attr) => (
                  <div key={attr} className="text-center">
                    <div className="text-xs uppercase tracking-wider text-muted mb-2">
                      {attr}
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => updateAttribute(attr, -1)}
                        disabled={attributes[attr] <= 1}
                        className="w-8 h-8 rounded-lg bg-card border border-subtle hover:border-medium disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold w-8">{attributes[attr]}</span>
                      <button
                        onClick={() => updateAttribute(attr, 1)}
                        disabled={attributes[attr] >= 4 || attributePoints <= 0}
                        className="w-8 h-8 rounded-lg bg-card border border-subtle hover:border-medium disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-xs text-muted mt-2">
                      {attr === 'grit' && 'Melee, toughness'}
                      {attr === 'reflex' && 'Ranged, agility'}
                      {attr === 'wits' && 'Perception, tech'}
                      {attr === 'nerve' && 'Willpower, social'}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`text-center text-lg ${attributePoints === 0 ? 'text-success' : 'text-gold'}`}>
                Points remaining: {attributePoints}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Skills */}
        {step === 'skills' && (
          <div className="animate-fade-in">
            <div className="panel mb-8">
              <h2 className="text-2xl font-bold text-center mb-2">SKILLS</h2>
              <p className="text-center text-secondary mb-6">
                Distribute 12 points (0-3 each, background bonus can reach 4)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {(['grit', 'reflex', 'wits', 'nerve'] as const).map((attr) => (
                  <div key={attr}>
                    <div className="text-xs uppercase tracking-wider text-muted mb-3 border-b border-subtle pb-2">
                      {attr} Skills
                    </div>
                    {SKILL_GROUPS[attr].map((skill) => {
                      const isBonus = background && BACKGROUNDS[background].bonus === skill;
                      return (
                        <div key={skill} className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${isBonus ? 'text-gold' : ''}`}>
                            {SKILL_NAMES[skill]}
                            {isBonus && ' ★'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateSkill(skill, -1)}
                              disabled={skills[skill] <= 0}
                              className="w-6 h-6 rounded bg-card border border-subtle hover:border-medium disabled:opacity-30 text-sm"
                            >
                              -
                            </button>
                            <span className="w-4 text-center">{skills[skill]}</span>
                            <button
                              onClick={() => updateSkill(skill, 1)}
                              disabled={skills[skill] >= (isBonus ? 4 : 3) || skillPoints <= 0}
                              className="w-6 h-6 rounded bg-card border border-subtle hover:border-medium disabled:opacity-30 text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className={`text-center text-lg mb-6 ${skillPoints === 0 ? 'text-success' : 'text-gold'}`}>
                Points remaining: {skillPoints}
              </div>

              {/* Motivation - moved from story step */}
              <div className="border-t border-subtle pt-6 mt-6">
                <label className="panel-label">Why do you keep going?</label>
                <input
                  type="text"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="What drives you to survive?"
                  className="input"
                  maxLength={100}
                />
              </div>

              {/* Moral Code */}
              <div className="mt-6">
                <label className="panel-label">Moral Code <span className="text-muted">(optional)</span></label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(Object.keys(MORAL_CODES) as MoralCode[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setMoralCode(moralCode === code ? null : code)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        moralCode === code
                          ? 'border-gold bg-gold/10'
                          : 'border-subtle hover:border-medium'
                      }`}
                    >
                      <div className="font-medium text-sm">{MORAL_CODES[code].name}</div>
                      <div className="text-xs text-muted line-clamp-2">{MORAL_CODES[code].description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Survival Philosophy */}
              <div className="mt-6">
                <label className="panel-label">Survival Philosophy <span className="text-muted">(optional)</span></label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {(Object.keys(SURVIVAL_PHILOSOPHIES) as SurvivalPhilosophy[]).map((phil) => (
                    <button
                      key={phil}
                      type="button"
                      onClick={() => setSurvivalPhilosophy(survivalPhilosophy === phil ? null : phil)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        survivalPhilosophy === phil
                          ? 'border-gold bg-gold/10'
                          : 'border-subtle hover:border-medium'
                      }`}
                    >
                      <div className="font-medium text-sm">{SURVIVAL_PHILOSOPHIES[phil].name}</div>
                      <div className="text-xs text-muted line-clamp-2">{SURVIVAL_PHILOSOPHIES[phil].description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Character Voice */}
        {step === 'voice' && (
          <div className="animate-fade-in">
            <div className="panel mb-8">
              <CharacterVoiceStep
                characterName={name || 'Survivor'}
                characterGender={appearance.gender}
                selectedVoiceId={characterVoiceId}
                onVoiceSelect={setCharacterVoiceId}
              />
            </div>
          </div>
        )}

        {/* Step 8: Preferences */}
        {step === 'preferences' && (
          <div className="animate-fade-in">
            <div className="panel mb-8">
              <h2 className="text-2xl font-bold text-center mb-2">GAME PREFERENCES</h2>
              <p className="text-center text-secondary mb-6">
                Customize your experience. These settings will shape how the AI tells your story.
              </p>
              <PreferencesStep
                preferences={preferences}
                onChange={setPreferences}
              />
            </div>
          </div>
        )}

        {/* Step 9: GM Voice */}
        {step === 'gm-voice' && (
          <div className="animate-fade-in">
            <div className="panel mb-8">
              <GMVoiceStep
                selectedVoiceId={preferences.gmVoiceId || 'adam'}
                onVoiceSelect={(voiceId) => setPreferences(prev => ({ ...prev, gmVoiceId: voiceId }))}
                tone={preferences.tone}
              />
            </div>
          </div>
        )}

        {/* Step 10: Scenario Selection */}
        {step === 'scenario' && background && (
          <div className="animate-fade-in">
            <div className="panel mb-8">
              <ScenarioSelectionStep
                character={buildCharacter()}
                preferences={preferences}
                onScenarioSelected={handleScenarioSelected}
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-danger/20 border border-danger text-danger">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 'background' || isCreating}
            className="btn disabled:opacity-30"
          >
            ← Back
          </button>

          {step !== 'scenario' ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceed()}
              className="btn btn-primary disabled:opacity-30"
            >
              Continue →
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={saveCharacterOnly}
                disabled={!canProceed() || isCreating || !primaryTrait || !greatestFear || !copingMechanism}
                className="btn border-gold text-gold hover:bg-gold/10 disabled:opacity-30"
                title="Save character to your library without starting a game"
              >
                {isCreating ? 'Saving...' : 'Save Character Only'}
              </button>
              <button
                type="button"
                onClick={startGame}
                disabled={!canProceed() || isCreating}
                className="btn btn-primary disabled:opacity-30"
              >
                {isCreating ? 'Creating...' : 'BEGIN SURVIVAL'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
