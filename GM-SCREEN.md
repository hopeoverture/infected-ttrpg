# INFECTED — GM Screen Reference

---

## PANEL 1: CORE RESOLUTION

### Dice Pool
Roll **Attribute + Skill** in d6s. **5-6 = Hit**. Sixes explode (max +3 bonus dice).

| Hits | Result |
|:----:|--------|
| 0 | **Failure** — Things go wrong |
| 1 | **Partial** — Success with cost/complication |
| 2 | **Success** — Clean result |
| 3+ | **Strong** — Bonus effect |

**Critical Failure**: More than half dice show 1s AND no hits = catastrophe.

**Push**: Reroll non-hits. Each 1 on Push = 1 Stress. Must accept result.

---

### Guts (Meta-Currency)
**Session Start**: Reset to 3 | **Max**: 5 | **Earning Cap**: +2/session

*Track earned this session: [ ] [ ] — stop earning when both marked*

**Spend 1 Guts to:**
- Reroll failed roll (no Stress from 1s)
- Reduce damage by 2 (after armor)
- Find useful item/escape route
- "Just enough" — 1 ammo/dose/use left
- Ignore wound penalties for 1 roll
- Flashback (see Panel 4)

**Earning Triggers (+1 Guts each, until cap):**
- Roll 3+ sixes on any roll
- Risk yourself for another PC (1/scene)
- Ghost Run (dangerous objective, no combat)
- Decisive Victory (combat ≤2 rounds, no Critical)
- Clever solution (no combat/major resources)

---

### Complication Table (d6)
| d6 | Complication |
|:--:|--------------|
| 1 | **Noise** — +2 Threat |
| 2 | **Time** — Takes twice as long |
| 3 | **Cost** — Extra resource used |
| 4 | **Attention** — Someone notices |
| 5 | **Injury** — 1 Bruised or 1 Stress |
| 6 | **Choice** — Hard choice offered |

---

## PANEL 2: COMBAT

### Initiative
Roll **NERVE + Notice**. Highest hits first. Ties = simultaneous.

### Actions Per Turn
- **1 Action** — Attack, reload, maneuver, use item
- **1 Move** — One range band
- **1 Free** — Speak, drop item, draw weapon

**Trade-offs:**
- Move → Action: Two Actions, but **Exposed** (+1 die vs you)
- Action → Move: Two Moves (fleeing)

---

### Attack & Damage
| Attack Type | Roll |
|-------------|------|
| Melee | GRIT + Brawl |
| Ranged | REFLEX + Shoot |
| Thrown | REFLEX + Athletics |

| Hits | Damage |
|:----:|--------|
| 0 | Miss |
| 1 | Base damage |
| 2 | Base + 1 |
| 3 | Base + 2 |
| 4+ | Base + 3, extra effect |

---

### Defense Options
| Defense | Cost | Roll |
|---------|------|------|
| **Passive** | — | Attacker just rolls |
| **Active Defense** | Action | REFLEX + Athletics, cancel hits |
| **Dive for Cover** | Move | Get behind cover immediately |
| **Parry** (melee) | Action | GRIT + Brawl, cancel hits; 2+ = free counter at -1 die |

---

### Range Bands
| Range | Ranged Mod | Notes |
|-------|:----------:|-------|
| **Engaged** | Can't shoot | Grappling only |
| **Melee** | -2 dice | Arm's reach |
| **Close** | — | Same room, ~10m |
| **Medium** | -1 die | Across street, ~30m |
| **Far** | -2 dice | ~100m |
| **Extreme** | -3 dice | Sniper, scope required |

---

### Cover
| Type | Attacker Penalty |
|------|:----------------:|
| Light (furniture, brush) | -1 die |
| Heavy (concrete, engine block) | -2 dice |
| Full | Can't target |

---

### Positioning Bonuses
| Situation | Effect |
|-----------|--------|
| **Flanking** (2 allies, different sides) | +1 die each |
| **High Ground** | +1 die ranged down, -1 die ranged up |
| **Bottleneck** | Negates Outnumbered penalties |

### Outnumbered
| Situation | Effect |
|-----------|--------|
| 2v1 | Attackers +1 die |
| 3v1 | Attackers +1 die, defender -1 die |
| 4+v1 | Attackers +1 die, defender -2 dice |

---

## PANEL 3: WOUNDS & CONDITIONS

### Wound Track
```
Bruised:   [ ][ ][ ][ ](+GRIT-2)  No penalty
Bleeding:  [ ][ ][ ]              -1 die (after combat)
Broken:    [ ][ ]                 -2 dice (after combat)
Critical:  [ ]                    Dying (10 min to stabilize)
```
**Penalty cap**: -3 dice total | **Adrenaline**: Penalties kick in 10 min after combat

### Damage → Wound Severity
| Damage | Severity |
|:------:|----------|
| 1-2 | Bruised |
| 3-4 | Bleeding |
| 5-6 | Broken |
| 7+ | Critical |

If that row is full, wound **escalates** to next severity.

---

### Armor
| Type | Reduction | Stealth | Durability |
|------|:---------:|:-------:|:----------:|
| Heavy Clothing | 1 | — | 3 |
| Light Armor | 2 | -1 die | 4 |
| Heavy Armor | 3 | -2 dice | 5 |
| Improvised | 1 | -1 die | 2 |

**Degrades**: Loses 1 Durability when absorbing 4+ damage (before reduction).

---

### Status Conditions
| Condition | Effect | Cleared |
|-----------|--------|---------|
| **Prone** | -2 melee attack, +1 vs you (close), -2 vs you (far) | Stand (Move) |
| **Staggered** | -1 die next action | After 1 action |
| **Slowed** | Half move, -1 REFLEX | End of scene |
| **Grappled** | Can't move, -1 die vs grappler | Escape roll |
| **Blinded** | -3 dice attack, -2 defense | Remove cause |
| **Stunned** | Lose Action, -2 defense | After 1 round |
| **Burning** | 2 dmg/round | Extinguish (Action + GRIT + Athletics) |
| **Exhausted** | -1 die physical, can't Push | Full rest |

---

### Healing Reference
| Wound | Natural | With Rest | With Medicine |
|-------|---------|-----------|---------------|
| Bruised | 1 day | Downtime: heal 2 | — |
| Bleeding | 1 week | Downtime: heal 1 | WITS+Med: heal 1 (2+ hits: also convert 1 Broken) |
| Broken | 1 month | — | Surgery (NERVE+Med -1): begins healing |
| Critical | Never | — | Stabilize first, then Surgery → Broken |

---

## PANEL 4: THREAT & INFECTION

### Threat Track
```
0 [□□□□□□□□□□] 10
   Safe → → → SWARM
```

### Noise → Threat
| Action | Threat |
|--------|:------:|
| Hand signals, slow movement | +0 |
| Whispers, suppressed shot | +1 |
| Talking, jogging, glass breaking | +2 |
| Shouting, running, melee combat | +3 |
| Gunshot (unsuppressed) | +4-5 |
| Sustained firefight, car alarm | +6 |
| Explosion, vehicle crash | +7-8 |

**Decay**: -1/scene of silence, -2/scene in secure location

---

### Threat Consequences (Tactical Mode)
| Threat | Consequence |
|:------:|-------------|
| 3+ | Distant Notice — clock starts |
| 5+ | Investigation — hostiles approaching |
| 7+ | Encounter — they arrive |
| 10 | Swarm — run or die |

### Threat Dice (Dread Mode)
Roll dice = Threat level. Any 6 = encounter. Multiple 6s = worse.

---

### Encounter Table (2d6)
| Roll | Encounter |
|:----:|-----------|
| 2 | **Horde** — RUN |
| 3-4 | Swarm + hostile survivors heard shots |
| 5-6 | Swarm (1d6+2 Infected) |
| 7 | 1d6 Infected, 1d6 minutes away |
| 8-9 | 1d3 Infected, already close |
| 10-11 | Hostile survivors (1d4), investigating |
| 12 | Neutral survivors — tense standoff |

---

### Infection Check
**Trigger**: Bite, blood in wound/eyes/mouth

Roll **GRIT + Endure**:
| Hits | Result |
|:----:|--------|
| 0 | **Infected** — Symptoms 1d6 min, turned 2d6 min |
| 1 | **Fighting it** — Symptoms 1d6×10 min, 2nd check at -2 dice |
| 2+ | **Clear** (still +1 Stress) |

**Amputation**: Within 60 seconds = auto-success. WITS+Med check or Critical wound from blood loss.

---

### Flashback Rules
**Cost**: 1 Guts

**Simple (auto-success):**
- Grabbed common item (rope, lighter, knife, duct tape, bandages, flashlight, map, basic tools)
- Told someone a meeting place
- Scouted a route
- Memorized available info

**Complex (requires roll):**
- Set trap/distraction (Craft)
- Planted something (Stealth)
- Bribed someone (Persuade)

**Never allowed:**
- Contradicts established facts
- Impossible items (ammo, medicine, electronics, weapons)

---

## PANEL 5: ENEMIES

### Infected Stats

| Type | GRIT | REF | NERVE | Attack | Damage | Wounds | Special |
|------|:----:|:---:|:-----:|:------:|:------:|--------|---------|
| **Rage** | 3 | 4 | 2 | 4 dice | 3 | ☐☐☐ / ☐ | Relentless, Infectious |
| **Fresh** | 2 | 5 | 4 | 5 dice | 2 | ☐☐ / ☐ | Frenzied (+2 init) |
| **Bloated** | 5 | 2 | 1 | 3 dice | 4 | ☐☐☐☐☐ / ☐☐ / ☐ | Rupture (blood spray on death), Sluggish (1 init die) |

*Infected roll only NERVE for initiative (no Notice skill).*

### Swarm (3-6 Infected)
- **Attack**: +2 dice
- **Wounds**: ☐☐☐ | ☐☐☐ | ☐☐☐ (9 total)
- **Damage taken**: 1 box per 2 damage (round up)
- **Degradation**: -1 die per 3 boxes marked

### Horde (10+)
Don't fight. 6 dice auto-attack. Total retreat required.

---

### Human Threats

| Type | Attributes | Skills | Armor | Gear |
|------|------------|--------|-------|------|
| **Survivor** | All 2s | Shoot 1, Brawl 1, Notice 1 | — | Melee + pistol |
| **Raider** | GRIT 3, REF 3, rest 2 | Shoot 2, Brawl 2 | Light (2) | Rifle/shotgun, radio |
| **Military** | All 3s | Shoot 3, Athletics 2, Notice 2 | Heavy (3) | Rifle, sidearm, NVGs |

---

### Quick NPC Generator

**Attitude (d6):** 1-2 Hostile | 3-4 Suspicious | 5 Neutral | 6 Friendly

**Want (d6):**
1. Food/Water
2. Medicine
3. Weapons
4. Information
5. Help/Labor
6. To be left alone

**Secret (d6):**
1. Bitten (hiding it)
2. Has hidden cache
3. Knows safe route
4. Murdered someone
5. Former military/police
6. Protecting someone nearby

---

## PANEL 6: SCAVENGING & RESOURCES

### Search Types
| Type | Time | Threat | Modifier |
|------|:----:|:------:|:--------:|
| Quick Sweep | 5 min | +1 | -1 die |
| Standard | 15 min | +2 | — |
| Thorough | 30 min | +3 | +1 die |
| Ransack | 1 hour | +4 | +2 dice |

### Search Results (WITS + Notice)
| Hits | Find |
|:----:|------|
| 0 | Nothing (possible complication) |
| 1 | Scraps — 1 small item, 1 day food |
| 2 | Useful — weapon, tool, 3 days supplies |
| 3 | Cache — multiple items, 1 week supplies |
| 4+ | Jackpot — rare item, large cache |

### Scarcity Modifiers
| Scarcity | Mod | Examples |
|----------|:---:|---------|
| Picked Clean | -2 | Cities, obvious spots |
| Sparse | -1 | Suburbs, passed-through |
| Moderate | — | Off beaten path |
| Untouched | +1 | Remote, dangerous |
| Pristine | +2 | Sealed bunkers, military |

**Depletion**: Each search drops location 1 scarcity step.

---

### Location Loot
| Location | Common | Rare |
|----------|--------|------|
| Residential | Food, clothes, basic meds | Hunting weapons, keys |
| Grocery | Canned food, batteries | Pharmacy meds |
| Hardware | Tools, parts | Generators, fuel |
| Hospital | Medicine, bandages | Rare drugs, suppressants |
| Police/Military | Weapons, ammo, armor | Heavy weapons, vehicles |
| Gas Station | Fuel, snacks | Vehicles, propane |
| Wilderness | Water, plants, firewood | Game, herbs |

---

### Carrying Capacity
**Significant Items**: GRIT + 4

Counts as significant: Each weapon, 3 days food/water, ammo (per 50), kits

**Backpack**: +3 capacity, but Action to access

**Vehicle Stash**: +10 items (total, not per person)

---

## PANEL 7: WEAPONS QUICK REF

### Melee
| Weapon | Dmg | Properties |
|--------|:---:|------------|
| Unarmed | 1 | Fast |
| Knife | 2 | Fast, Quiet |
| Machete | 3 | — |
| Bat | 2 | Two-handed, Brutal |
| Crowbar | 2 | Tool |
| Fire Axe | 4 | Two-handed, Slow |
| Spear | 3 | Two-handed, Reach |
| Sledgehammer | 5 | Two-handed, Slow, Brutal |

### Ranged
| Weapon | Dmg | Range | Noise | Notes |
|--------|:---:|-------|:-----:|-------|
| Pistol | 3 | Close/Med | +5 | — |
| Pistol (supp.) | 3 | Close/Med | +2 | 15 uses |
| Revolver | 4 | Close/Med | +5 | Slow |
| SMG | 3 | Close/Med | +5 | Fast |
| Shotgun | 5 | Close/Med | +6 | Spread |
| Rifle | 4 | Med/Far | +6 | — |
| Hunting Rifle | 5 | Far/Extreme | +6 | Slow, scoped |
| Bow | 3 | Med/Far | +1 | Slow, Quiet |
| Crossbow | 4 | Med/Far | +1 | Slow, Quiet |

**Slow (ranged)**: 2 Actions to reload/ready
**Slow (melee)**: Can't attack if you moved this turn
**Fast**: Attack twice at -1 die each
**Spread**: +1 die Close, -1 die Far+
**Brutal**: +1 dmg vs unarmored

---

## PANEL 8: ENVIRONMENTAL & MISC

### Light Levels
| Level | Notice | Stealth | Examples |
|-------|:------:|:-------:|---------|
| Dark | -2 | +2 | No moon, unlit interior |
| Dim | -1 | +1 | Moonlight, candles |
| Bright | — | — | Daylight, flashlight |

**Flashlight**: +2 Threat beacon in darkness

---

### Hazard Stages (All Follow This Pattern)
| Stage | Effect |
|-------|--------|
| Impaired | -1 die, minor symptoms |
| Struggling | -2 dice, serious symptoms, taking damage |
| Critical | -3 dice, major damage, death risk |

---

### Environmental Damage
| Hazard | Damage |
|--------|--------|
| Small fire | 2/round |
| Large fire | 4/round |
| Inferno | 6/round |
| Fall 10ft | 2 |
| Fall 20ft | 4 |
| Fall 30ft | 6 |
| Fall 40ft+ | 8+ |

---

### Stress
**Slots**: NERVE + 3

**Gain from**: Horror (1-2), Push 1s (1 each), exhaustion, failed Resolve

**Breaking Point** (when full): Roll NERVE + Resolve
- 2+ hits: Hold together, clear 1 Stress
- 1 hit: Panic reaction, clear 2 after
- 0 hits: Breakdown, out of scene, clear all

**Screaming = +4 Threat**

---

### Chase Track
```
[CAUGHT] ← 1 ← 2 ← 3 ← 4 ← 5 ← 6 → 7 → [ESCAPED]
         Bumper Close Near Far Distant Very Far
```
Both roll REFLEX + Drive (+ vehicle Speed). Winner moves track.
- Win by 1: Move 1 position
- Win by 2+: Move 2 positions

**Heat**: +1/round. At Heat 3+: roll complication. At Heat 7+: GM forces decisive event.

---

### Downtime Activities (2/day in safe location)
| Activity | Effect |
|----------|--------|
| Rest | Heal 2 Bruised OR 1 Bleeding |
| Medical Treatment | WITS+Med: heal Bleeding, maybe convert Broken |
| Surgery | NERVE+Med -1: fix Broken/Critical |
| Stress Relief | Clear 1-2 Stress (varies by method) |
| Maintain Gear | WITS+Craft: restore Durability |
| Craft | Per crafting rules |
| Scout | WITS+Notice: learn about area |
| Train | Mark 1 progress (3 = +1 skill) |

---

*INFECTED v1.1.0 — GM Screen*
