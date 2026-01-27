'use client';

import Image from 'next/image';
import { Character } from '@/lib/types';

export type MobileTab = 'story' | 'character' | 'world' | 'log';

interface MobileNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  character: Character;
  threat: number;
  hasUnread?: boolean;
}

export default function MobileNav({
  activeTab,
  onTabChange,
  character,
  threat,
  hasUnread = false
}: MobileNavProps) {
  // Calculate status indicators
  const healthStatus = character.wounds.critical ? 'critical' :
    character.wounds.broken > 0 ? 'danger' :
    character.wounds.bleeding > 0 ? 'warning' : 'ok';
  
  const threatStatus = threat >= 8 ? 'critical' :
    threat >= 5 ? 'danger' :
    threat >= 3 ? 'warning' : 'ok';

  const tabs: { id: MobileTab; label: string; icon: string; indicator?: string }[] = [
    { 
      id: 'story', 
      label: 'Story', 
      icon: '📜',
      indicator: hasUnread ? 'unread' : undefined
    },
    { 
      id: 'character', 
      label: 'Character', 
      icon: '👤',
      indicator: healthStatus !== 'ok' ? healthStatus : undefined
    },
    { 
      id: 'world', 
      label: 'World', 
      icon: '🗺️',
      indicator: threatStatus !== 'ok' ? threatStatus : undefined
    },
    { 
      id: 'log', 
      label: 'Log', 
      icon: '📋'
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background blur */}
      <div className="absolute inset-0 bg-bg-surface/95 backdrop-blur-lg border-t border-subtle" />
      
      {/* Safe area padding for notched phones */}
      <div className="relative flex items-center justify-around px-2 pb-safe">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-2 px-4 transition-colors relative ${
              activeTab === tab.id 
                ? 'text-gold' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            <span className="text-xl relative">
              {tab.icon}
              {/* Status indicator dot */}
              {tab.indicator && (
                <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                  tab.indicator === 'unread' ? 'bg-info' :
                  tab.indicator === 'critical' ? 'bg-danger animate-pulse' :
                  tab.indicator === 'danger' ? 'bg-danger' :
                  tab.indicator === 'warning' ? 'bg-warning' :
                  'bg-muted'
                }`} />
              )}
            </span>
            <span className="text-[10px] mt-0.5">{tab.label}</span>
            
            {/* Active indicator bar */}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gold rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

// Character mini-panel for mobile
export function CharacterMiniStatus({ character, threat }: { character: Character; threat: number }) {
  const totalWounds = character.wounds.bruised + character.wounds.bleeding + character.wounds.broken + (character.wounds.critical ? 1 : 0);
  const maxWounds = character.woundCapacity.bruised + character.woundCapacity.bleeding + character.woundCapacity.broken + 1;
  const woundPercent = (totalWounds / maxWounds) * 100;
  const stressPercent = (character.stress / character.maxStress) * 100;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-surface border-b border-subtle md:hidden">
      {/* Character Avatar */}
      <div className="w-10 h-10 rounded-full bg-card border-2 border-subtle overflow-hidden flex-shrink-0 relative">
        {character.portraitUrl ? (
          <Image 
            src={character.portraitUrl} 
            alt={character.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            👤
          </div>
        )}
      </div>

      {/* Stats Bars */}
      <div className="flex-1 space-y-1">
        {/* Health */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted w-6">HP</span>
          <div className="flex-1 h-1.5 bg-bg-card rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                woundPercent > 75 ? 'bg-danger' :
                woundPercent > 50 ? 'bg-warning' :
                'bg-success'
              }`}
              style={{ width: `${100 - woundPercent}%` }}
            />
          </div>
        </div>
        
        {/* Stress */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted w-6">STR</span>
          <div className="flex-1 h-1.5 bg-bg-card rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                stressPercent > 80 ? 'bg-info animate-pulse' :
                stressPercent > 50 ? 'bg-info' :
                'bg-info/50'
              }`}
              style={{ width: `${stressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Threat Indicator */}
      <div className="flex-shrink-0 text-center">
        <div className={`text-lg font-bold ${
          threat >= 8 ? 'text-danger animate-pulse' :
          threat >= 5 ? 'text-warning' :
          threat >= 3 ? 'text-gold' :
          'text-muted'
        }`}>
          {threat}
        </div>
        <div className="text-[8px] text-muted uppercase">THREAT</div>
      </div>

      {/* Guts */}
      <div className="flex-shrink-0">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`w-1.5 h-3 rounded-sm ${
                i <= character.guts ? 'bg-gold' : 'bg-border-medium'
              }`}
            />
          ))}
        </div>
        <div className="text-[8px] text-muted text-center mt-0.5">GUTS</div>
      </div>
    </div>
  );
}
