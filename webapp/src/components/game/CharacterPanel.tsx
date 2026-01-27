'use client';

import { Character, BACKGROUNDS } from '@/lib/types';
import CharacterPortrait from './CharacterPortrait';

interface CharacterPanelProps {
  character: Character;
}

function WoundSlots({ 
  current, 
  max, 
  type 
}: { 
  current: number; 
  max: number; 
  type: 'bruised' | 'bleeding' | 'broken' | 'critical' 
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div 
          key={i} 
          className={`wound-slot wound-slot-${type} ${i < current ? 'wound-slot-filled' : ''}`}
        />
      ))}
    </div>
  );
}

function StressSlots({ current, max }: { current: number; max: number }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {Array.from({ length: max }).map((_, i) => (
        <div 
          key={i} 
          className={`stress-slot ${i < current ? 'stress-slot-filled' : ''}`}
        />
      ))}
    </div>
  );
}

function AttributeDisplay({ name, value }: { name: string; value: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm uppercase">{name}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full ${i <= value ? 'bg-gold' : 'bg-border-medium'}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium w-4">{value}</span>
      </div>
    </div>
  );
}

export default function CharacterPanel({ character }: CharacterPanelProps) {
  const background = BACKGROUNDS[character.background];
  const totalWoundPenalty = Math.min(3, character.wounds.bleeding + character.wounds.broken * 2);

  return (
    <div className="p-4">
      {/* Character Header */}
      <div className="text-center mb-4 pb-4 border-b border-subtle">
        <div className="mx-auto mb-2">
          <CharacterPortrait
            portraitUrl={character.portraitUrl}
            characterName={character.name}
            characterBackground={character.background}
            size="small"
            editable={false}
          />
        </div>
        <h2 className="font-semibold text-lg">{character.name}</h2>
        <div className="text-sm text-secondary">{background.name}</div>
      </div>

      {/* Attributes */}
      <div className="panel-section">
        <div className="panel-label">Attributes</div>
        <div className="space-y-2">
          <AttributeDisplay name="GRIT" value={character.attributes.grit} />
          <AttributeDisplay name="REFLEX" value={character.attributes.reflex} />
          <AttributeDisplay name="WITS" value={character.attributes.wits} />
          <AttributeDisplay name="NERVE" value={character.attributes.nerve} />
        </div>
      </div>

      {/* Wounds */}
      <div className="panel-section">
        <div className="panel-label">Wounds</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted">Bruised</span>
            <WoundSlots 
              current={character.wounds.bruised} 
              max={character.woundCapacity.bruised} 
              type="bruised" 
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted">Bleeding</span>
            <WoundSlots 
              current={character.wounds.bleeding} 
              max={character.woundCapacity.bleeding} 
              type="bleeding" 
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted">Broken</span>
            <WoundSlots 
              current={character.wounds.broken} 
              max={character.woundCapacity.broken} 
              type="broken" 
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted">Critical</span>
            <WoundSlots 
              current={character.wounds.critical ? 1 : 0} 
              max={1} 
              type="critical" 
            />
          </div>
        </div>
        {totalWoundPenalty > 0 && (
          <div className="mt-2 text-xs text-warning">
            ⚠ -{totalWoundPenalty} die (after combat)
          </div>
        )}
      </div>

      {/* Stress */}
      <div className="panel-section">
        <div className="flex justify-between items-center mb-2">
          <span className="panel-label mb-0">Stress</span>
          <span className="text-xs text-muted">{character.stress}/{character.maxStress}</span>
        </div>
        <StressSlots current={character.stress} max={character.maxStress} />
      </div>

      {/* Armor */}
      {character.armor && (
        <div className="panel-section">
          <div className="panel-label">Armor</div>
          <div className="text-sm font-medium">{character.armor.name}</div>
          <div className="text-xs text-secondary mb-2">
            Reduction: {character.armor.reduction} | Stealth: -{character.armor.stealthPenalty}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: character.armor.maxDurability }).map((_, i) => (
              <div 
                key={i}
                className={`w-3 h-3 rounded-sm border ${
                  i < character.armor!.durability 
                    ? 'bg-info border-info' 
                    : 'border-border-medium'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Weapons */}
      <div className="panel-section">
        <div className="panel-label">Weapons</div>
        {character.weapons.map(weapon => (
          <div key={weapon.id} className="mb-3 last:mb-0">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">► {weapon.name}</span>
            </div>
            <div className="text-xs text-secondary">
              Dmg {weapon.damage} | {weapon.range} | +{weapon.noise} Threat
            </div>
            {weapon.ammo !== undefined && (
              <div className="text-xs text-muted mt-1">
                Ammo: {weapon.ammo}/{weapon.maxAmmo}
              </div>
            )}
            <div className="flex gap-1 mt-1">
              {Array.from({ length: weapon.maxDurability }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-sm ${
                    i < weapon.durability ? 'bg-muted' : 'border border-border-medium'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Inventory */}
      <div className="panel-section">
        <div className="flex justify-between items-center mb-2">
          <span className="panel-label mb-0">Inventory</span>
          <span className="text-xs text-muted">
            {character.inventory.filter(i => i.isSignificant).length}/{character.carryingCapacity}
          </span>
        </div>
        <div className="space-y-1">
          {character.inventory.map(item => (
            <div key={item.id} className="text-sm text-secondary flex justify-between">
              <span>{item.name}</span>
              {item.quantity > 1 && <span className="text-muted">×{item.quantity}</span>}
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-subtle text-xs text-muted">
          Food: {character.food} days | Water: {character.water} days
        </div>
      </div>

      {/* Skills (Collapsed) */}
      <div className="panel-section border-b-0">
        <details>
          <summary className="panel-label cursor-pointer hover:text-secondary">
            Skills ▼
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {Object.entries(character.skills)
              .filter(([_, value]) => value > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([skill, value]) => (
                <div key={skill} className="flex justify-between">
                  <span className="capitalize">{skill}</span>
                  <span className="text-muted">{value}</span>
                </div>
              ))
            }
          </div>
        </details>
      </div>
    </div>
  );
}
