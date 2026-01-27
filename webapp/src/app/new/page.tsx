'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Background, 
  BACKGROUNDS, 
  Attributes, 
  Skills, 
  DEFAULT_SKILLS,
  SkillName,
  SKILL_ATTRIBUTES
} from '@/lib/types';

type CreationStep = 'background' | 'attributes' | 'skills' | 'story';

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

export default function NewGame() {
  const router = useRouter();
  const [step, setStep] = useState<CreationStep>('background');
  
  // Character data
  const [name, setName] = useState('');
  const [background, setBackground] = useState<Background | null>(null);
  const [attributes, setAttributes] = useState<Attributes>({ grit: 3, reflex: 3, wits: 3, nerve: 3 });
  const [skills, setSkills] = useState<Skills>({ ...DEFAULT_SKILLS });
  const [motivation, setMotivation] = useState('');
  const [scenario, setScenario] = useState<'day-one' | 'week-in' | 'custom'>('day-one');
  const [customScenario, setCustomScenario] = useState('');

  const attributePoints = 12 - (attributes.grit + attributes.reflex + attributes.wits + attributes.nerve);
  const skillPoints = 12 - Object.values(skills).reduce((a, b) => a + b, 0);

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
      case 'attributes':
        return attributePoints === 0;
      case 'skills':
        return skillPoints === 0;
      case 'story':
        return motivation.trim().length > 0 && (scenario !== 'custom' || customScenario.trim().length > 0);
    }
  };

  const nextStep = () => {
    const steps: CreationStep[] = ['background', 'attributes', 'skills', 'story'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: CreationStep[] = ['background', 'attributes', 'skills', 'story'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const startGame = () => {
    // TODO: Create game in storage and navigate
    console.log('Starting game with:', {
      name,
      background,
      attributes,
      skills,
      motivation,
      scenario,
      customScenario
    });
    router.push('/game/new-game-id');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-subtle">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-secondary hover:text-primary transition-colors">
            ← Back
          </Link>
          <h1 className="text-xl font-bold tracking-wider">NEW GAME</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          {['background', 'attributes', 'skills', 'story'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${
                step === s ? 'bg-gold' : 
                ['background', 'attributes', 'skills', 'story'].indexOf(step) > i ? 'bg-success' : 'bg-border-medium'
              }`} />
              {i < 3 && <div className="w-12 h-0.5 bg-border-subtle mx-1" />}
            </div>
          ))}
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
                      "{BACKGROUNDS[background].description}"
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

        {/* Step 2: Attributes */}
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

        {/* Step 3: Skills */}
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

        {/* Step 4: Story */}
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
                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    scenario === 'day-one' ? 'border-gold bg-gold/10' : 'border-subtle hover:border-medium'
                  }`}>
                    <input
                      type="radio"
                      name="scenario"
                      checked={scenario === 'day-one'}
                      onChange={() => setScenario('day-one')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Day One</div>
                      <div className="text-sm text-secondary">Wake up as the outbreak begins. Everything changes today.</div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    scenario === 'week-in' ? 'border-gold bg-gold/10' : 'border-subtle hover:border-medium'
                  }`}>
                    <input
                      type="radio"
                      name="scenario"
                      checked={scenario === 'week-in'}
                      onChange={() => setScenario('week-in')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Week In</div>
                      <div className="text-sm text-secondary">Already surviving. Society has collapsed. Things are getting worse.</div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    scenario === 'custom' ? 'border-gold bg-gold/10' : 'border-subtle hover:border-medium'
                  }`}>
                    <input
                      type="radio"
                      name="scenario"
                      checked={scenario === 'custom'}
                      onChange={() => setScenario('custom')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Custom</div>
                      <div className="text-sm text-secondary mb-2">Describe your starting situation...</div>
                      {scenario === 'custom' && (
                        <textarea
                          value={customScenario}
                          onChange={(e) => setCustomScenario(e.target.value)}
                          placeholder="Where are you? What's happening? Who's with you?"
                          className="input min-h-[80px]"
                          maxLength={500}
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={step === 'background'}
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
              disabled={!canProceed()}
              className="btn btn-primary disabled:opacity-30"
            >
              BEGIN SURVIVAL
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
