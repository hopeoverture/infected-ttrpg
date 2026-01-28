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
  Gender
} from '@/lib/types';
import { createGame } from '@/lib/supabase/games';
import CharacterPortrait from '@/components/game/CharacterPortrait';
import CreationNarrationUI from '@/components/game/CreationNarrationUI';
import { useCreationNarration } from '@/hooks/useCreationNarration';
import { SCENARIOS, getScenariosByTimeframe, getDifficultyStyle, GameScenario } from '@/lib/scenarios';

type CreationStep = 'background' | 'appearance' | 'attributes' | 'skills' | 'story';

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
  const [background, setBackground] = useState<Background | null>(null);
  const [appearance, setAppearance] = useState<CharacterAppearance>({ ...DEFAULT_APPEARANCE });
  const [artStyle, setArtStyle] = useState<ArtStyle>('cinematic');
  const [attributes, setAttributes] = useState<Attributes>({ grit: 3, reflex: 3, wits: 3, nerve: 3 });
  const [skills, setSkills] = useState<Skills>({ ...DEFAULT_SKILLS });
  const [motivation, setMotivation] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<GameScenario | null>(SCENARIOS[0] || null);
  const [customScenario, setCustomScenario] = useState('');
  const [scenarioTab, setScenarioTab] = useState<'premade' | 'custom'>('premade');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);

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
      case 'attributes':
        return attributePoints === 0;
      case 'skills':
        return skillPoints === 0;
      case 'story':
        return motivation.trim().length > 0 && (
          scenarioTab === 'premade' ? selectedScenario !== null : customScenario.trim().length > 0
        );
    }
  };

  const STEPS: CreationStep[] = ['background', 'appearance', 'attributes', 'skills', 'story'];

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

  const startGame = async () => {
    if (!background) return;
    
    // Stop any narration before starting
    narration.stop();
    
    setIsCreating(true);
    setError(null);

    try {
      const gameId = await createGame({
        name,
        background,
        attributes,
        skills,
        motivation,
        scenario: scenarioTab === 'custom' ? 'custom' : (selectedScenario?.id || 'day-one-classic'),
        customScenario: scenarioTab === 'custom' ? customScenario : undefined,
        portraitUrl: portraitUrl || undefined,
        appearance,
        artStyle
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
          {step === 'attributes' && 'Attributes'}
          {step === 'skills' && 'Skills'}
          {step === 'story' && 'Story'}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Step 1: Background */}
        {step === 'background' && (
          <div className="animate-fade-in">
            <div className="panel mb-8">
              <h2 className="text-2xl font-bold text-center mb-6">WHO ARE YOU?</h2>
              
              <div className="mb-6">
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

        {/* Step 3: Attributes */}
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

              <div className={`text-center text-lg ${skillPoints === 0 ? 'text-success' : 'text-gold'}`}>
                Points remaining: {skillPoints}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Story */}
        {step === 'story' && (
          <div className="animate-fade-in">
            <div className="panel mb-8">
              <h2 className="text-2xl font-bold text-center mb-6">YOUR STORY</h2>

              <div className="mb-6">
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

              <div>
                <label className="panel-label">Starting Scenario</label>
                
                {/* Tab Selection */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setScenarioTab('premade')}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      scenarioTab === 'premade' 
                        ? 'border-gold bg-gold/10 text-primary' 
                        : 'border-subtle hover:border-medium text-secondary'
                    }`}
                  >
                    📚 Premade Stories
                  </button>
                  <button
                    onClick={() => setScenarioTab('custom')}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      scenarioTab === 'custom' 
                        ? 'border-gold bg-gold/10 text-primary' 
                        : 'border-subtle hover:border-medium text-secondary'
                    }`}
                  >
                    ✏️ Custom
                  </button>
                </div>

                {scenarioTab === 'premade' ? (
                  <div className="space-y-6">
                    {/* Timeframe Groups */}
                    {Object.entries(getScenariosByTimeframe()).map(([timeframe, scenarios]) => {
                      if (scenarios.length === 0) return null;
                      const timeframeLabels: Record<string, { label: string; desc: string }> = {
                        'day-one': { label: '🌅 Day One', desc: 'The outbreak begins' },
                        'early': { label: '📅 Early Days', desc: '1-2 weeks in' },
                        'established': { label: '🏕️ Established', desc: '1+ months in' },
                        'late': { label: '❄️ Late Stage', desc: '6+ months in' }
                      };
                      const info = timeframeLabels[timeframe] || { label: timeframe, desc: '' };
                      
                      return (
                        <div key={timeframe}>
                          <div className="flex items-center gap-2 mb-3">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">
                              {info.label}
                            </h4>
                            <span className="text-xs text-muted">— {info.desc}</span>
                          </div>
                          <div className="grid gap-3">
                            {scenarios.map((s) => {
                              const diffStyle = getDifficultyStyle(s.difficulty);
                              const isSelected = selectedScenario?.id === s.id;
                              
                              return (
                                <button
                                  key={s.id}
                                  onClick={() => setSelectedScenario(s)}
                                  className={`text-left p-4 rounded-lg border transition-all ${
                                    isSelected 
                                      ? 'border-gold bg-gold/10' 
                                      : 'border-subtle hover:border-medium'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="text-2xl">{s.icon}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium">{s.name}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${diffStyle.bg} ${diffStyle.color}`}>
                                          {diffStyle.label}
                                        </span>
                                      </div>
                                      <div className="text-sm text-gold italic">{s.tagline}</div>
                                      <div className="text-sm text-secondary mt-1 line-clamp-2">
                                        {s.description}
                                      </div>
                                      {isSelected && (
                                        <div className="mt-3 pt-3 border-t border-subtle">
                                          <div className="text-xs text-muted uppercase tracking-wider mb-2">
                                            Themes
                                          </div>
                                          <div className="flex flex-wrap gap-1">
                                            {s.themes.map((theme) => (
                                              <span 
                                                key={theme}
                                                className="text-xs px-2 py-0.5 rounded bg-surface border border-subtle text-secondary"
                                              >
                                                {theme}
                                              </span>
                                            ))}
                                          </div>
                                          <div className="text-xs text-muted uppercase tracking-wider mt-3 mb-2">
                                            Key NPCs
                                          </div>
                                          <div className="flex flex-wrap gap-2">
                                            {s.npcs.slice(0, 3).map((npc) => (
                                              <span 
                                                key={npc.name}
                                                className="text-xs text-secondary"
                                                title={npc.role}
                                              >
                                                {npc.name} ({npc.role})
                                              </span>
                                            ))}
                                            {s.npcs.length > 3 && (
                                              <span className="text-xs text-muted">
                                                +{s.npcs.length - 3} more
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    {isSelected && (
                                      <span className="text-gold">✓</span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-secondary">
                      Describe your starting situation. The GM will craft a unique story based on your description.
                    </p>
                    <textarea
                      value={customScenario}
                      onChange={(e) => setCustomScenario(e.target.value)}
                      placeholder="Where are you when the story begins? What's happening around you? Who else is there? What immediate danger or goal do you face?"
                      className="input min-h-[160px]"
                      maxLength={1000}
                    />
                    <div className="text-xs text-muted text-right">
                      {customScenario.length}/1000
                    </div>
                  </div>
                )}
              </div>
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
            onClick={prevStep}
            disabled={step === 'background' || isCreating}
            className="btn disabled:opacity-30"
          >
            ← Back
          </button>

          {step !== 'story' ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="btn btn-primary disabled:opacity-30"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={startGame}
              disabled={!canProceed() || isCreating}
              className="btn btn-primary disabled:opacity-30"
            >
              {isCreating ? 'Creating...' : 'BEGIN SURVIVAL'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
