'use client';

import { useState, useRef, useEffect } from 'react';

export type GutsUse = 
  | 'reroll' 
  | 'reduce-damage' 
  | 'find-item' 
  | 'just-enough' 
  | 'last-stand' 
  | 'flashback';

interface GutsOption {
  id: GutsUse;
  name: string;
  icon: string;
  description: string;
}

const GUTS_OPTIONS: GutsOption[] = [
  {
    id: 'reroll',
    name: 'Reroll',
    icon: '🎲',
    description: 'Reroll all dice on your last roll'
  },
  {
    id: 'reduce-damage',
    name: 'Reduce Damage',
    icon: '🛡️',
    description: 'Reduce incoming damage by 1 level'
  },
  {
    id: 'find-item',
    name: 'Find Item',
    icon: '🔍',
    description: 'Find a specific needed item nearby'
  },
  {
    id: 'just-enough',
    name: 'Just Enough',
    icon: '🎯',
    description: 'Have just enough ammo or supplies'
  },
  {
    id: 'last-stand',
    name: 'Last Stand',
    icon: '💀',
    description: 'Keep fighting for one more action at 0 HP'
  },
  {
    id: 'flashback',
    name: 'Flashback',
    icon: '💭',
    description: 'Narrate a past event that helps now'
  }
];

interface GutsSpendingMenuProps {
  currentGuts: number;
  maxGuts: number;
  onSpend: (use: GutsUse) => void;
  disabled?: boolean;
}

export default function GutsSpendingMenu({
  currentGuts,
  maxGuts,
  onSpend,
  disabled = false
}: GutsSpendingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSpend = (use: GutsUse) => {
    onSpend(use);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Guts Display & Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || currentGuts === 0}
        className="w-full text-left p-2 rounded-lg hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className="panel-label mb-1">Guts</div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: maxGuts }).map((_, i) => (
              <div
                key={i}
                className={`guts-pip ${i < currentGuts ? 'guts-pip-filled' : ''}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted">
            {currentGuts > 0 ? 'Spend ▼' : 'Empty'}
          </span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && currentGuts > 0 && (
        <div 
          className="absolute bottom-full left-0 right-0 mb-2 bg-elevated border border-medium rounded-lg shadow-xl overflow-hidden z-50 animate-fade-in"
          role="menu"
        >
          <div className="p-2 border-b border-subtle">
            <div className="text-xs text-muted uppercase tracking-wider">
              Spend 1 Guts to...
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {GUTS_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSpend(option.id)}
                className="w-full px-3 py-2 text-left hover:bg-card transition-colors flex items-start gap-3"
                role="menuitem"
              >
                <span className="text-lg flex-shrink-0">{option.icon}</span>
                <div>
                  <div className="font-medium text-sm">{option.name}</div>
                  <div className="text-xs text-muted">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
