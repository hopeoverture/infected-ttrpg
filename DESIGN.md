# INFECTED — Apocalyptic Survival TTRPG

> *Fast infection. Scarce resources. Every sound is a gamble.*

**Inspirations**: The Last of Us, 28 Days Later, 28 Weeks Later  
**Tone**: Cinematic horror, tactical survival, high lethality  
**System**: D6 dice pool

---

## TABLE OF CONTENTS

1. **Core Resolution** — Dice mechanics, pushing, critical failures
2. **Guts** — Meta-currency, flashbacks
3. **Attributes & Skills** — Character capabilities (4 attributes, 17 skills)
4. **Combat** — Initiative, actions, attacks, defense, range, cover, maneuvers, ammo, conditions
5. **Stealth & Infiltration** — Light levels, detection, silent takedowns, distractions
6. **Vehicles & Chases** — Driving, pursuits, vehicle combat, crashes
7. **Environmental Hazards** — Exposure, fire, water, collapse, starvation, disease
8. **Wounds & Death** — Damage, wound tracks, armor, dying
9. **Stress & Panic** — Mental pressure, breaking points
10. **Noise & Threat** — The core tension system
11. **Infection** — The Rage, exposure, symptoms, treatment
12. **Equipment & Durability** — Weapons, armor, degradation, maintenance
13. **Resources & Carrying** — Capacity, group supplies, scavenging
14. **Crafting** — Recipes, time, noise, components
15. **Downtime & Recovery** — Rest, healing, activities
16. **The Infected** — Enemy types and stats
17. **Human Threats** — NPC survivors, raiders, military
18. **GM Tools** — Encounters, locations, complications, NPC generator
19. **Character Creation** — Full walkthrough
20. **Advancement** — Milestones, scars, bonds
21. **Running the Game** — Session structure, pacing, tone
22. **Designer Notes** — Philosophy and playtest questions

---

## CORE RESOLUTION

### Dice Pool
Roll **Attribute + Skill** in d6s. Each die showing **5 or 6** is a **Hit**.

| Hits | Result |
|------|--------|
| 0 | **Failure** — Things go wrong, possibly badly |
| 1 | **Partial Success** — You do it, but there's a cost or complication |
| 2+ | **Success** — You accomplish your goal cleanly |
| 3+ | **Strong Success** — Bonus effect, extra damage, or narrative advantage |

**Sixes Explode**: Each 6 rolled adds +1 bonus die (roll it immediately). **Maximum +3 bonus dice** from explosions per roll (prevents runaway results). Bonus dice still count 5s and 6s as hits, but don't trigger further explosions.

**Ones Hurt**: If *more than half* your dice show 1s (and you have no hits), it's a **Critical Failure** — something catastrophic happens. Critical Failures are only checked on initial rolls, never on Pushed rolls or bonus dice.

### Pushing Your Luck
After any roll, you may **Push** — reroll all dice that didn't show hits. But:
- Any 1s rolled on the Push deal **1 Stress** to you
- You *must* accept the new result

---

## GUTS (Meta-Currency)

Every survivor has **Guts** — that desperate will to live when everything goes wrong.

### Starting Guts
Each character begins each session with **3 Guts**.

### Spending Guts
Spend 1 Guts to:
- **Reroll** any failed roll (0 hits). You may use this before Push, or instead of Push. Unlike Pushing, a Guts Reroll does **not** cause Stress from 1s — it's a clean second chance.
- **Reduce damage** taken by 2 (declare after damage is rolled, applied **after** armor reduction)
- **Find what you need** — discover a useful item, escape route, or opportunity (GM has veto for absurdity)
- **Just enough** — you have exactly 1 round of ammo, 1 dose of medicine, or 1 use of a resource you thought was empty
- **Last stand** — ignore all wound penalties for one roll (typically used outside combat when wounds are slowing you down, or in the desperate moments as adrenaline fades)
- **Flashback** — declare a past preparation (see below)

### Flashbacks
When you need something you didn't explicitly prepare, spend **1 Guts** to declare a flashback:

> *"Actually, before we left the safe house, I grabbed that rope from the garage..."*

**Simple Flashback** (auto-success):
- Grabbed a common item (see list below)
- Told someone a meeting place
- Scouted a route you could have taken
- Memorized information from available sources

**Common Items** (can flashback without a roll): rope, lighter, matches, knife, duct tape, bandages, cloth, water bottle, flashlight, map, pen/pencil, basic tools (screwdriver, pliers), bag, food (1 day), batteries, candles.

**NOT Common** (require Complex Flashback or are impossible): ammunition, firearms, medicine/drugs, antibiotics, radios, electronics, fuel, explosives, armor, specialized tools, keys to specific locations.

**Complex Flashback** (requires roll):
- Set up a distraction or trap (Craft check)
- Planted something in enemy territory (Stealth check)
- Bribed or convinced someone (Persuade check)
- Prepared something difficult (appropriate skill check)

If the roll fails, the Guts is still spent but the preparation went wrong somehow — GM decides whether it simply didn't work (passive failure) or created an active complication (the trap was found, the person you bribed told someone, etc.).

**Flashback Rules:**
- Cannot contradict established facts
- Cannot flashback to something impossible ("I actually brought a tank")
- GM has final say on plausibility

**Flashback Yes/No/Maybe:**
| Situation | Allowed? |
|-----------|----------|
| "I grabbed rope from the garage" | ✅ Yes (common item, plausible) |
| "I told Maria to meet us at the bridge" | ✅ Yes (simple communication) |
| "I hid a gun in their base last week" | 🔶 Maybe (needs Stealth roll, plausible timing) |
| "I planted a bomb in their leader's room" | 🔶 Maybe (needs roll, might be implausible) |
| "I have a grenade" (after being searched) | ❌ No (contradicts established facts) |
| "I already killed their leader yesterday" | ❌ No (changes major story elements) |

### Guts Economy

**Session Start**: Reset to **3 Guts**. Whatever you had last session doesn't matter — everyone starts fresh at 3.

**During Play**: Earn Guts through the triggers below. **Earning is capped at +2 per session** — once you've earned 2 Guts this session (through any combination of triggers), you can't earn more until next session.

**Maximum Guts**: 5. Even if you haven't hit the earning cap, you can't exceed 5 Guts.

**Example**: You start at 3. You earn +1 from a Ghost Run (now at 4, earned 1). You spend 2 Guts (now at 2). You earn +1 from a critical success (now at 3, earned 2). You've hit the earning cap — no more earning this session, even if you do more heroic things.

### Earning Triggers
- **Critical success**: Roll 3+ sixes on any roll = +1 Guts
- **Heroic action**: Risk yourself for another PC = +1 Guts (max 1 per scene)
- **Ghost run**: Complete a *dangerous* objective without combat = +1 Guts. Must involve real risk (Ambient Threat 3+, hostile presence, or GM-designated danger). Routine scavenging in safe areas doesn't count.
- **Clever solution**: Solve a significant problem without combat or major resource expenditure = +1 Guts
- **Decisive victory**: End a combat encounter in 2 rounds or fewer without any PC taking a Critical wound = +1 Guts. Rewards efficient, well-planned violence. This prevents Guts inflation even in highly successful sessions.

---

## ATTRIBUTES (4)

Each rated 1-5 (human average is 2).

| Attribute | Governs |
|-----------|---------|
| **GRIT** | Physical toughness, endurance, melee power, resisting injury/infection |
| **REFLEX** | Speed, agility, ranged combat, dodging, fine motor skills |
| **WITS** | Perception, awareness, technical skills, crafting, problem-solving |
| **NERVE** | Willpower, composure under pressure, social manipulation, resisting fear |

---

## SKILLS (17)

Each rated 0-4. Untrained = roll Attribute only.

### GRIT Skills
| Skill | Covers |
|-------|--------|
| **Brawl** | Melee combat, unarmed fighting, grappling |
| **Endure** | Resisting exhaustion, pain, disease, harsh conditions |
| **Athletics** | Running, jumping, climbing, swimming *(Note: Usually rolled with GRIT, but throwing and dodging use REFLEX + Athletics)* |

### REFLEX Skills
| Skill | Covers |
|-------|--------|
| **Shoot** | Firearms, bows, crossbows |
| **Stealth** | Moving quietly, hiding, tailing |
| **Drive** | Vehicles, mounts, chases |

### WITS Skills
| Skill | Covers |
|-------|--------|
| **Notice** | Spotting threats, searching, reading situations |
| **Craft** | Building, repairing, jury-rigging, creating items |
| **Tech** | Electronics, computers, mechanical systems, hacking |
| **Medicine** | Treating wounds, diagnosing illness, drugs *(Note: Surgery uses NERVE + Medicine, not WITS)* |
| **Survival** | Tracking, foraging, navigation, weather reading, setting snares |
| **Knowledge** | History, science, geography, pre-outbreak expertise, identifying things |

### NERVE Skills
| Skill | Covers |
|-------|--------|
| **Persuade** | Convincing, negotiating, inspiring, diplomacy |
| **Deceive** | Lying, bluffing, disguise, misdirection, feigning |
| **Resolve** | Resisting fear, panic, manipulation, holding it together |
| **Intimidate** | Threatening, coercing, interrogating, displays of force |
| **Animals** | Calming animals, training, commanding, reading animal behavior |

### Skill Notes

**Medicine vs Tech**: Medicine covers biological/medical knowledge — wounds, disease, drugs, surgery. Tech covers machines and electronics — computers, radios, generators, locks, vehicles (repair, not driving).

**Survival vs Notice**: Notice is about perceiving what's there. Survival is about interpreting the wilderness — which plants are edible, what tracks mean, how to find water, predicting weather.

**Intimidate vs Persuade**: Persuade makes people *want* to help you. Intimidate makes them *afraid* not to. Different approaches, different consequences if it fails.

**Knowledge Specializations**: When you put at least 1 point in Knowledge, choose 2 areas of expertise from your background:
- Academic (history, science, literature)
- Medical (anatomy, diseases, pharmacology) 
- Military (tactics, weapons, fortifications)
- Technical (engineering, electronics, mechanics)
- Criminal (security systems, fences, underworld)
- Outdoors (wildlife, terrain, weather patterns)
- Local (specific region's geography, people, secrets)
- Trade (specific profession's insider knowledge)

You get **+1 bonus die** when your Knowledge check relates to your specializations (this is in addition to your normal WITS + Knowledge pool).

---

## COMBAT

Combat is fast, brutal, and best avoided. When it happens, make it count.

**Round Duration**: A combat round is roughly **6 seconds**. This matters for time-sensitive effects (infection spreading, building collapsing, etc.). Ten rounds ≈ 1 minute.

### Initiative

**Standard Initiative**: Roll **NERVE + Notice**. Highest hits acts first. Re-roll each round, or keep static (GM choice based on pacing).

*Initiative uses NERVE, not REFLEX — reacting first in combat is about reading the situation and having the composure to act decisively, not just raw speed. This also prevents REFLEX from dominating character builds.*

**Ties**: If two combatants have equal hits, they act **simultaneously** — both declare actions, both resolve at the same time. If they attack each other, both can be hit. If this feels awkward, the GM can break ties with higher NERVE, or just have players go before NPCs.

**Side-Based Initiative**: GM rolls dice equal to the **enemy's best NERVE + relevant skill** (Notice for humans, nothing for infected) vs. party's best NERVE + Notice. Winner's side acts first, players choose order among themselves. Sides alternate. *(Use Side-Based for faster play with many combatants; use Standard when individual turn order matters.)*

**Ambush/Surprise**: If one side is unaware, the other side gets a **free round** before initiative begins. Ambushers act in any order, then roll initiative normally.

**Delay**: You may hold your turn to act later in the round. Declare "I'm waiting." Act anytime after, interrupting if needed. If you don't act by round end, you lose the turn.

### Actions Per Turn

- **1 Action** — Attack, use item, maneuver, reload, complex task
- **1 Move** — One zone/range band, or repositioning within a zone
- **1 Free** — Speak briefly, drop item, quick glance, draw holstered weapon

**Trading Actions:**
- Sacrifice **Move for Action**: Take two Actions, but you're **Exposed** (+1 die to attacks against you until your next turn)
- Sacrifice **Action for Move**: Take two Moves (useful for fleeing)

### Attack Rolls

- **Melee**: GRIT + Brawl
- **Ranged**: REFLEX + Shoot
- **Thrown**: REFLEX + Athletics (includes throwing knives, hatchets, grenades, rocks, etc.)

**Damage**: Weapon base damage + extra hits scored (minimum weapon damage on any hit)

| Hits | Damage Result |
|------|---------------|
| 0 | Miss — no damage |
| 1 | Hit — weapon base damage |
| 2 | Solid hit — base + 1 |
| 3 | Strong hit — base + 2 |
| 4+ | Devastating — base + 3, possible extra effect |

**Example**: You attack with a knife (base damage 2) and roll 3 hits. That's a Strong Hit: 2 base + 2 bonus = **4 damage**.

### Defense Options

**Passive Defense**: No roll. Attacker's hits determine if they hit. This is the default.

**Active Defense** (Reaction): If you still have your Action available this round, spend it to defend. Roll REFLEX + Athletics. Each hit cancels one of the attacker's hits. 

*Turn order note: If you use Active Defense before your turn, you've spent your Action — when your turn comes, you only have Move and Free actions remaining. If you Delayed, Active Defense spends the Action you were holding.*

**Dive for Cover** (Reaction): If cover is within reach, spend your **Move** to get behind it. Gain cover bonus immediately, but you're now behind that cover.

**Parry** (Melee only): If wielding a melee weapon, spend your **Action** to parry. Roll GRIT + Brawl. Each hit cancels one attacker hit. On 2+ hits, you get a **free immediate counterattack** at -1 die (this doesn't cost an additional Action — it's your reward for an excellent parry).

*Parry vs Active Defense: In melee, Parry is usually better — it uses GRIT + Brawl (likely your combat stats) and can counterattack. Use Active Defense against ranged attacks, when unarmed, or when your Athletics is much better than your Brawl.*

### Range Bands

| Range | Description | Ranged Modifier | Notes |
|-------|-------------|-----------------|-------|
| **Engaged** | Grappling distance | Can't use ranged | In a grapple or clinch |
| **Melee** | Within arm's reach | -2 dice ranged | Melee attacks possible |
| **Close** | Same room, ~10m | — | Standard ranged |
| **Medium** | Across street, ~30m | -1 die | |
| **Far** | Distant, ~100m | -2 dice | |
| **Extreme** | Sniper range, 100m+ | -3 dice | Scoped weapon required |

**Movement**: One Move action = one range band change. Melee ↔ Close ↔ Medium ↔ Far ↔ Extreme.

*Note: Engaged is not a range band you move through — it's a special state that only exists during a grapple. You enter Engaged by initiating a grapple, and return to Melee range when the grapple ends.*

**Weapon Range Notation**: When a weapon lists two ranges (e.g., "Close/Med"), it's effective at both with no penalty. Beyond the listed ranges, apply the standard range penalties.

### Positioning & Tactics

**Flanking**: Two allies attacking the same target from different directions. Each attacker gets **+1 die**.

**Surrounded**: 3+ enemies in **melee** range specifically. Defender can't retreat without pushing through. *(For the dice penalties, see Being Outnumbered below — Surrounded is about positioning, Outnumbered is about the numbers.)*

**High Ground**: Elevated position (rooftop, stairs, balcony).
- +1 die to ranged attacks downward
- -1 die to ranged attacks upward  
- +1 die to melee if you have reach advantage

**Bottleneck / Holding a Position**: Narrow passage (doorway, hallway, gap) or defensive point where only 1-2 enemies can engage at once. Negates Surrounded and Outnumbered penalties — numbers don't help if they can't all reach you.

**Back to Wall**: Can't be flanked from behind, but also can't retreat.

### Cover & Concealment

| Cover Type | Attacker Penalty | Examples |
|------------|------------------|----------|
| **Light Cover** | -1 die | Furniture, brush, car door |
| **Heavy Cover** | -2 dice | Concrete wall, engine block, thick tree |
| **Full Cover** | Can't be targeted | Completely behind solid obstacle |

*(These penalties apply to the attacker's roll, not the defender's.)*

**Concealment** (visual obstruction, not protection):
- Smoke, darkness, foliage: -1 to -2 dice to target
- Doesn't reduce damage if hit

**Destroying Cover**: Attacks can target cover instead of person. Cover has Durability (see Equipment). When destroyed, no longer provides protection.

---

## COMBAT MANEUVERS

Beyond basic attacks, these tactical options give combat depth.

### Opposed vs Flat Checks
Some maneuvers are **opposed rolls** (you vs target), others are **flat checks** (you just need hits).

**Opposed rolls** (Grapple, Escape): You win if you have **more hits** than your opponent. If you have 0 hits, you lose even if they also have 0 (you failed to execute; they didn't need to resist). Ties go to the defender/status quo.

**Flat checks** (Disarm, Shove, Choke, Throw, Tackle): Just roll and count your hits. The target doesn't roll to resist — these are quick actions where you either succeed or don't.

### Grapple
Grab and restrain an opponent.

**Initiate**: GRIT + Brawl vs target's GRIT + Brawl (or Athletics)
- **Win** (more hits): Target is **Grappled**
- **Tie** (equal hits): You're both locked up, roll again next round
- **Lose** (fewer hits, or you had 0): Target escapes your attempt, may counterattack

**While Grappling**:
- Both combatants are at **Engaged** range
- Neither can move without dragging the other
- Grappler can: Attack (Brawl only, +1 die), Choke (see below), Throw (see below)
- Grappled target can: Attack grappler at -1 die, Attempt escape

**Escape**: Action to roll GRIT + Brawl or REFLEX + Athletics vs grappler's GRIT + Brawl
- Win = break free, can move
- Lose = still grappled

**Choke** (while grappling): Roll GRIT + Brawl (flat check).
- 2+ hits: Target takes 1 Stress and is **Choking**
- Choking: Each round, target rolls GRIT + Endure or takes 1 damage and 1 Stress
- 3 rounds of choking = unconscious

**Throw** (while grappling): Roll GRIT + Brawl (flat check).
- 2+ hits: Throw target one zone. They're **Prone** and take 1 damage.
- 1 hit: Target stumbles but stays in grapple
- Into hazard: Add hazard damage (wall +1, fire +2, off ledge = falling)

### Disarm
Knock a weapon from their hands.

**Roll**: GRIT + Brawl (flat check)
- **2+ hits**: Weapon flies 1 zone away (your choice of direction)
- **1 hit**: Weapon drops at their feet
- **0 hits**: Failed. Target may make immediate counterattack if they have Actions remaining.

**Disarming ranged weapons**: -1 die (harder to grab a gun than a sword)

### Shove
Push an enemy back or into something.

**Roll**: GRIT + Athletics (not opposed — flat check to overpower them)
- **2+ hits**: Target moves one zone in direction you choose
- **1 hit**: Target staggers but doesn't move
- **0 hits**: You overextend. -1 die to defense until your next turn.

**Shove into Hazard**:
- Wall/obstacle: +1 damage, target is **Staggered**
- Furniture: +1 damage, target is **Prone**
- Fire: +2 damage, target may catch fire
- Ledge/drop: Target falls (see Falling damage)
- Other enemy: Both take 1 damage, both **Staggered**

### Tackle / Charge
Aggressive rush combining movement and attack.

**Requirements**: Must move at least one zone toward target.

**Roll**: GRIT + Brawl (to attack) or GRIT + Athletics (just to knock down, no damage). This is a normal attack roll, not opposed.
- **+1 die** bonus from momentum
- **If you hit (1+ hits)**: Target takes damage (if Brawl) AND is **Prone** (or **Grappled**, your choice)
- **Trade-off**: You're **Exposed** until your next turn

### Called Shot
Aim for a specific body part or weak point.

**Declare before rolling**. Take a penalty for precision:

| Target | Penalty | Effect on Hit |
|--------|---------|---------------|
| **Torso** | — | Standard damage |
| **Legs** | -1 die | -1 to final damage (minimum 1), target is **Slowed** |
| **Arms** | -1 die | -1 to final damage (minimum 1), target drops held item |
| **Head** | -2 dice | +2 damage, ignores torso armor (helmets still protect) |
| **Weapon** | -2 dice | Disarm (weapon damaged or knocked away) |
| **Weak Point** | -2 dice | Ignore armor entirely |

### Suppressing Fire
Pin enemies down with sustained fire.

**Requirements**: Ranged weapon, expend 5+ rounds of ammo (or one burst)

**Roll**: REFLEX + Shoot (no damage roll)

**Effect**: Choose a zone. Until your next turn, anyone in that zone or trying to cross it must either:
- **Stay down**: Remain in cover, can't attack or move
- **Risk it**: You shoot at them — the hits you scored on your Suppressing Fire roll become the damage they take (e.g., 3 hits = 3 damage)
- **Flee**: Move away from you (not toward/across)

**Threat**: +4-5 (this is loud and sustained)

### Overwatch / Prepared Action
Ready an action for a specific trigger.

**Declare**: "When [trigger], I [action]."
- "When someone comes through that door, I shoot."
- "When the infected gets close to Maria, I tackle it."
- "When the lights go out, I run."

**Resolution**: When trigger occurs, your action happens immediately, interrupting normal initiative.

**Limitations**:
- If trigger doesn't occur, action is lost
- Can only prepare one action at a time
- Trigger must be specific and observable

### Fighting Retreat
Fall back while keeping enemies at bay.

**How it works**: Declare you're doing a Fighting Retreat. You sacrifice your **Action** for this turn. Use your normal **Move** to retreat one zone while facing enemies.

**Benefit**: Any enemy that follows you into your new zone provokes a **free attack** from you (one attack per enemy, once per retreat).

**Trade-off**: You can't take other Actions while retreating (your Action is spent maintaining defensive posture). If you want to retreat faster, you must flee normally (no free attacks).

### Dual Wielding
Fight with a weapon in each hand.

**Requirements**: Two one-handed weapons

**Attack**: Roll once with -1 die, but deal damage with both weapons if you hit (add both base damages together, then add hit bonus once).

*Example: Two knives (2 damage each) with 2 hits = (2+2) base + 1 bonus = **5 damage**.*

**Defense**: +1 die to Parry attempts

### Shield Use
Shields provide defense and offense.

**Passive**: +1 die to Active Defense and Parry rolls while holding shield (doesn't help if you don't actively defend)

**Shield Bash** (Action): GRIT + Brawl. On hit, 2 damage and target is **Staggered**.

**Shield Wall** (with ally): When adjacent to ally with shield, both get +2 dice to defense vs ranged attacks from the front.

**Durability**: Shields have Durability. A shield loses 1 Durability when you use it to defend against an attack dealing 4+ damage (before your defense reduces it).

---

## AMMUNITION & RELOADING

Every bullet matters.

### Tracking Ammunition

**Abstract System** (recommended for most play):
- Track **magazines/clips**, not individual rounds
- Each magazine = "full" or "empty"
- Partial magazines: Mark as "low" (1-2 shots left)

**Precise System** (for desperate scarcity):
- Track individual rounds
- More bookkeeping, more tension

### Reloading

| Action | Time | Notes |
|--------|------|-------|
| **Normal Reload** | 1 Action | Swap magazines properly |
| **Speed Reload** | Free Action | Drop current mag (lost), slam new one |
| **Revolver Reload** | 1 Action | Per 2 rounds loaded |
| **Single Round** | Free Action | Load one round (shotgun, bolt-action) |
| **Belt-Fed** | 2 Actions | Machine guns, mounted weapons |

### Running Dry

**Last Round Warning**: GM may tell you "your gun clicks — last round" or you can ask "am I low?"

**Empty in Combat**:
- On a **Critical Failure**, weapon jams or runs empty (GM choice)
- When empty, you can: Reload, switch weapons, melee with gun as club (2 damage, -1 die)

**Clearing Jams**: 1 Action + WITS + Tech (or Shoot) check
- 1+ hits: Cleared
- 0 hits: Still jammed, try again or field strip (1 minute)

### Ammunition Scarcity

Track ammo by type:

| Ammo Type | Weapons | Scarcity |
|-----------|---------|----------|
| **9mm / .45** | Pistols, SMGs | Common early, scarce later |
| **5.56 / .308** | Rifles | Uncommon |
| **12 gauge** | Shotguns | Uncommon |
| **Arrows/Bolts** | Bows, crossbows | Craftable, recoverable (50%) |
| **.22 LR** | Small rifles, pistols | Common, low damage |
| **Specialty** | Sniper, military | Rare |

---

## WEAPON PROPERTIES

Weapons have properties beyond base damage.

| Property | Effect |
|----------|--------|
| **One-Handed** | Can use offhand for shield, light, grapple |
| **Two-Handed** | Requires both hands (damage already factored into weapon stats) |
| **Reach** | Can attack enemies one range band further (melee at Close, or attack past an ally) |
| **Fast** | Can attack twice per Action at -1 die each (two separate attack rolls; if both hit, apply damage separately) |
| **Slow (ranged)** | Reload/ready takes 2 Actions (bolt-action rifles, crossbows) |
| **Slow (melee)** | Requires wind-up; can't attack with this weapon if you used your Move this turn (heavy weapons like fire axes, sledgehammers) |
| **Spread** | +1 die at Close range, -1 die at Far+, can hit multiple adjacent targets |
| **Armor Piercing** | Ignore 1 point of armor |
| **Loud** | +1 additional Threat per shot |
| **Quiet** | -3 Threat (suppressed) or no Threat (melee/bow) |
| **Unreliable** | Jams on any roll with 2+ ones showing |
| **Brutal** | +1 damage vs unarmored targets |
| **Unwieldy** | -1 die to attacks if you moved this turn |
| **Throwable** | Can be thrown (REFLEX + Athletics) at Close range for melee damage; weapon lands in target's zone |
| **Tool** | Can be used for non-combat tasks (prying, breaking locks, etc.) — gives +1 die to relevant Craft/Tech checks |

### Weapon Table (Complete Reference)

*See Equipment & Durability section for Durability values.*

| Weapon | Damage | Range | Properties | Noise |
|--------|--------|-------|------------|-------|
| **Unarmed** | 1 | Melee | Fast | +2 |
| **Knife/Shiv** | 2 | Melee | Fast, One-Handed, Quiet | +1 |
| **Machete** | 3 | Melee | One-Handed | +2 |
| **Hatchet** | 3 | Melee (Close if thrown) | One-Handed, Throwable | +2 |
| **Baseball Bat** | 2 | Melee | Two-Handed, Brutal | +2 |
| **Crowbar** | 2 | Melee | One-Handed, tool | +2 |
| **Fire Axe** | 4 | Melee | Two-Handed, Slow (melee) | +3 |
| **Spear** | 3 | Melee | Two-Handed, Reach | +2 |
| **Sledgehammer** | 5 | Melee | Two-Handed, Slow (melee), Brutal | +3 |
| **Pistol** | 3 | Close/Med | One-Handed, Loud | +5 |
| **Pistol (suppressed)** | 3 | Close/Med | One-Handed, Quiet | +2 |
| **Revolver** | 4 | Close/Med | One-Handed, Loud, Slow (ranged) | +5 |
| **SMG** | 3 | Close/Med | Two-Handed, Fast, Loud | +5 |
| **Shotgun** | 5 | Close/Med | Two-Handed, Spread, Loud | +6 |
| **Rifle** | 4 | Med/Far | Two-Handed, Loud | +6 |
| **Hunting Rifle** | 5 | Far/Extreme | Two-Handed, Slow (ranged), Loud | +6 |
| **Bow** | 3 | Med/Far | Two-Handed, Quiet, Slow (ranged) | +1 |
| **Crossbow** | 4 | Med/Far | Two-Handed, Quiet, Slow (ranged) | +1 |
| **Molotov** | 4 | Close/Med | Thrown, fire, one-use | +4 |
| **Improvised** | 2 | Melee | Unreliable, breaks on crit fail | +2 |

**Note on Quiet property**: The Noise column shows the base Threat generated. "Quiet" weapons generate minimal Threat (+1-2) compared to Loud weapons (+5-6). The Quiet property does NOT mean zero Threat — even silent kills can be noticed if the body falls, etc.

---

## STATUS CONDITIONS

Conditions affect what you can do.

| Condition | Effect | Cleared By |
|-----------|--------|------------|
| **Prone** | **You**: -2 dice to your melee attacks, can't move normally. **Attackers**: +1 die at Close/Med range, -2 dice at Far+ range. | Stand up (Move action) |
| **Staggered** | -1 die to next action | Automatic after one action |
| **Slowed** | Half movement, -1 die to REFLEX | End of scene, or medical treatment |
| **Grappled** | Can't move, can only attack grappler at -1 die | Escape roll |
| **Pinned** | Can't move or attack, defender is controlling you | Grappler releases or you escape |
| **Blinded** | -3 dice to attacks, can't target beyond Close, -2 defense | Remove cause (wipe eyes, lights return) |
| **Deafened** | Can't hear (coordination penalty), immune to sound-based effects | End of scene, or medical |
| **Stunned** | Lose next Action, can only Move (staggering), -2 defense | Automatic after one round |
| **Disoriented** | -2 dice to all rolls | End of scene or 1 minute |
| **Burning** | 2 damage/round | Action to extinguish (GRIT + Athletics) or water |
| **Bleeding Out** | Dying (see Critical wounds) | Stabilization |
| **Choking** | GRIT + Endure each round or 1 damage + 1 Stress | Escape grapple, or 3 fails = unconscious |
| **Exhausted** | -1 die to all physical rolls, can't Push | Full rest |

### Condition Stacking
- Same condition doesn't stack (can't be double-Staggered)
- Different conditions do stack (Prone + Slowed + Blinded = very bad day)

### "End of Scene" Duration
Conditions that last until "end of scene" clear when the current combat or tense situation resolves — typically when you have a moment to catch your breath, even if just a minute or two. During ongoing combat, treat "end of scene" as ~10 rounds if you need a number.

---

## INFECTION RISK IN COMBAT

Fighting infected means risking exposure.

### When to Check for Infection

| Situation | Infection Check? |
|-----------|------------------|
| Bitten by infected | **Always** |
| Scratched/clawed by infected | Only if you have an open wound |
| Infected blood spray (killed in melee) | **50% chance** (roll d6: 1-3 = check) |
| Grappled by infected 2+ rounds | **Automatic** (they will bite) |
| Blood contact with open wound | **Always** |
| Blood contact with intact skin | No (wash it off quickly) |
| Blood in eyes/mouth | **Always** |

### Protective Measures

| Protection | Effect |
|------------|--------|
| **Face covering** (mask, goggles) | Negate blood spray to face, negate eyes/mouth exposure |
| **Long sleeves/gloves** | First scratch/bite to arms = damage only, no infection check. Clothing torn after. |
| **Heavy jacket/armor** | First bite to torso = damage only, no check. May negate scratches entirely. |
| **Full hazmat/riot gear** | No infection unless gear is breached |

### The Bite
When bitten:
1. Take damage (usually 3)
2. Make Infection Check (GRIT + Endure) immediately
3. Remember: you may have only **minutes** if you fail

### Blood Spray
When you kill an infected in melee range:
1. Roll d6: 1-3 = blood spray
2. If sprayed, check if you have protection
3. If unprotected face, make Infection Check

**Avoid spray**: Declare you're being careful (-1 die to attack) = no spray risk

---

## ENVIRONMENTAL COMBAT

The world is a weapon.

### Using the Environment

**Improvised Weapons**: Anything grabbed in desperation
- -1 die to attack
- 2 damage (or more for heavy objects, GM discretion)
- Breaks on critical failure

**Thrown Objects**: REFLEX + Athletics
- Light (bottle, brick): 1 damage, Close range
- Heavy (chair, fire extinguisher): 2 damage, Close range, -1 die
- Very heavy: 3 damage, only if target is close and you're strong

### Environmental Hazards in Combat

| Hazard | Effect |
|--------|--------|
| **Slippery surface** | REFLEX + Athletics when moving/pushed or fall Prone |
| **Debris/rubble** | Half movement speed, or Athletics check to move normally |
| **Darkness** | See Light Levels in Stealth section |
| **Smoke** | -1 to -2 dice to attacks, concealment |
| **Fire** | 2-4 damage per round in fire, may spread |
| **Water (deep)** | Must swim (GRIT + Athletics), can't use most ranged weapons |
| **Narrow space** | Can't use Two-Handed weapons, no flanking |
| **Unstable floor** | May collapse under heavy impact (see Structural Collapse) |

### Shoving Into Hazards

Combine Shove maneuver with environment:

| Destination | Additional Effect |
|-------------|-------------------|
| Solid wall | +1 damage |
| Window | Crash through, 1 damage + glass hazard |
| Furniture | +1 damage, Prone |
| Fire | +2 damage, may catch fire |
| Ledge/drop | Falling damage |
| Spikes/debris | +2 damage |
| Other person | Both take 1 damage, both Staggered |
| Into infected | Both must deal with each other |

### Destructible Objects

| Object | Durability | Notes |
|--------|------------|-------|
| Interior door | 3 | Can be breached/kicked |
| Exterior door | 5 | Needs tools or heavy weapon |
| Reinforced door | 8+ | Very difficult |
| Window | 1 | Easy to break |
| Furniture | 2-3 | Provides Light Cover until destroyed |
| Drywall | 2 | Can punch/shoot through |
| Brick/concrete | 8+ | Need explosives or heavy work |
| Vehicle window | 1 | Easy |
| Vehicle body | 4-6 | Heavy Cover until destroyed |

### Using Fire

**Starting Fires**: Lighter + fuel + Action. Or Molotov.

**Fire Spread**: Dry/flammable environment = fire spreads one zone per minute. Wet/stone = doesn't spread.

**Fire as Weapon**:
- Burning torch: 2 damage + fire
- Molotov: 4 damage + fire to zone, +4 Threat
- Pushing enemy into fire: Shove damage + 2 fire + may catch

**Fire as Barrier**: Infected (and most humans) won't voluntarily cross fire. Creates temporary safe zone but also Threat and resource cost.

---

## MULTIPLE COMBATANTS

Numbers matter in the apocalypse.

### Being Outnumbered

| Situation | Effect |
|-----------|--------|
| **2 vs 1** | Attackers each get +1 die |
| **3 vs 1** | Attackers each get +1 die, defender -1 die to all rolls |
| **4+ vs 1** | Attackers +1 die, defender -2 dice to all rolls (attacks and defenses), can only actively defend against 2 attacks per round |

### Fighting Groups

**Focus Fire**: All allies attack the same target this round. You benefit from Flanking (+1 die each if from different directions) and Combined Attack (+2 damage if all hit). Concentrating fire overwhelms single targets quickly.

**Split Attention**: Engaging multiple enemies = each gets less of your focus
- Attack one, others get free movement
- Defend against one, others get +1 die

*(For negating outnumbered penalties, see Bottleneck under Positioning & Tactics.)*

### Finishing Moves

**Coup de Grace / Execute**: Against a **helpless** target (unconscious, restrained, Pinned, willing, or Incapacitated with all wound slots filled):
- No roll required
- 1 Action = instant kill
- Melee only (ranged requires an attack roll, but with +2 dice bonus since target can't dodge)
- This is how you finish off a downed infected before it can recover

**Mercy**: You can always choose to **knock out** instead of kill:
- Target is unconscious for 1d6 × 10 minutes
- They'll wake up (maybe angry, maybe grateful)
- Doesn't work on infected — they don't stay down

**Last Words**: Before execution, the target may speak briefly. This creates dramatic moments:
- An NPC reveals information with their dying breath
- A villain curses you
- An infected victim begs you to end it
- Don't rush these moments — they have weight

**PvP Execution**: If a PC tries to execute another PC:
- The target player must **consent** to their character's death
- If they don't consent, the execution fails (weapon jams, hesitation, interruption)
- This is a safety tool, not a mechanical rule

### Coordinated Tactics

**Combined Attack** (2+ allies): Declare targeting same enemy. If **all** attackers hit, add +2 total damage (applied to one attack of your choice, not per attacker). If even one attacker misses, the coordination fails — no bonus, but individual hits still deal their normal damage.

**Distract and Strike**: One ally spends their Action to distract an enemy (yelling, feinting, waving arms) — this makes the distracting ally **Exposed** (+1 die to attacks against them) but gives another ally **+2 dice** to attack that distracted enemy this round.

**Covering Fire**: One ally uses Suppressing Fire, others can move through danger zone safely.

### Swarm Rules (Reminder)

For large groups of weak enemies (5+ infected), use Swarm rules in The Infected section rather than tracking individuals.

---

## STEALTH & INFILTRATION

Stealth is survival. The best fight is the one you avoid entirely.

### Light Levels (Simplified)
Three levels keep tracking easy:

| Light Level | Notice | Stealth | Examples |
|-------------|--------|---------|----------|
| **Dark** | -2 dice | +2 dice | Night (no moon), unlit interior, basement |
| **Dim** | -1 die | +1 die | Moonlight, dusk, candlelight, distant streetlight |
| **Bright** | — | — | Daylight, direct flashlight, well-lit room |

**Flashlights**: Illuminate a cone (Close range). You can see, but you're also visible. +2 Threat beacon in darkness — use sparingly.

**Night Vision Goggles**: Treat Dark as Bright for you. But: tunnel vision (-1 die to Notice outside the goggles' field), and sudden bright light = 1 round of blindness.

### Detection States
Enemies exist in one of four awareness states:

| State | Description | Behavior |
|-------|-------------|----------|
| **Unaware** | Don't know you exist | Routine behavior, easy to ambush |
| **Suspicious** | Heard/saw something odd | Investigating passively, heightened attention |
| **Alert** | Know something's wrong | Actively searching, calling others, weapons ready |
| **Hunting** | Know where you are | Pursuing, attacking, no more hiding |

**Transitioning States:**
- **Unaware → Suspicious**: Failed Stealth check, small noise, glimpsed movement
- **Suspicious → Alert**: Confirmed evidence (saw you, found a body, heard talking)
- **Alert → Hunting**: Direct visual contact, attacked
- **Any → Unaware**: Time passes without confirmation (1-10 minutes depending on enemy)

**Infected States**: Infected are typically **Unaware** until triggered by noise/sight, then immediately **Hunting**. They don't do "Suspicious" — they either don't notice or they charge.

### Group Stealth
When the group moves together:

**Default — Group Average**: Everyone rolls Stealth. Use the **average hits** (round down) as the group result. One bad roll hurts but doesn't doom everyone.

**Lead and Follow**: One PC leads (makes the roll), others follow their exact path:
- Leader rolls normally
- -1 die per 2 followers (not per follower — less punishing)
- Followers can split off to roll independently if they want

**Overwatch**: Group splits — some move, some watch:
- Watchers roll Notice to spot danger
- If danger spotted, movers get **+1 die** to avoid it
- Watchers can provide covering fire if stealth fails

**Stealth Failure = Alert, Not Hunting**: When stealth fails against humans, enemies become **Alert** (searching) not **Hunting** (attacking). This gives the group **one round** to hide, flee, or prepare an ambush. Only direct visual contact or obvious aggression triggers Hunting.

**Exception — Infected**: Infected skip Alert and go straight to Hunting if they detect you. Don't get caught.

### Stealth Rewards
**Ghost Run Bonus**: If the group completes an objective (scavenge a location, pass through an area, rescue someone) without triggering combat:
- Everyone gains **+1 Guts**
- This reward stacks — multiple Ghost Runs in a session are valid
- **Natural balance**: Stealth means less loot (can't search bodies, must move carefully), so combat still has advantages
- **GM guidance**: Vary your scenarios. Some objectives should require or reward combat. If every session is Ghost Runs, add situations where fighting is faster, necessary, or more rewarding.

### Silent Takedowns
To neutralize an enemy without raising alarm:

**Requirements:**
- Target must be **Unaware** or you must have **Advantage** (flanking, distraction)
- You must be in **Melee** range
- You must have a melee weapon (or accept penalties for unarmed)

**Roll**: REFLEX + Stealth vs. target's WITS + Notice (opposed)

**Margin** = your hits minus their hits.

| Margin | Result |
|--------|--------|
| **+2 or more** | **Silent Kill** — Target eliminated, no sound, no Threat |
| **+1** | **Messy Kill** — Target down, but made some noise (+1 Threat) |
| **0 (tie)** | **Struggle** — Grappled, target will break free and yell next round unless you finish them |
| **Negative** | **Botched** — Target yells, combat begins, +3 Threat |

**Infected Takedowns**: Infected don't have Notice skill — roll 4 dice for their detection. They're reactive, not perceptive.

### Distractions
Create noise elsewhere to draw attention.

**Thrown Object** (rock, bottle, etc.):
- Roll REFLEX + Athletics to land it where you want
- Creates noise at target location (typically +2 Threat there)
- Suspicious/Alert enemies investigate the noise
- Hunting enemies may split their attention

**Noise Trap** (cans on wire, car alarm trigger):
- Set up during Downtime or with a quick Craft check
- Triggered by tripwire or remote
- Creates +3-4 Threat at trap location
- Excellent for diversion or early warning

**Environmental Distractions**:
- Turn on a generator, radio, or alarm elsewhere
- Start a small fire (risky but very distracting)
- Break something loud in another room

**Distraction Duration**: Enemies stay distracted for 1d6 rounds unless they find the source and determine it's false, or until they hear something more interesting (like you).

### Stealth Movement Speeds

| Movement | Stealth Modifier | Speed |
|----------|------------------|-------|
| **Creeping** | +1 die | Half move |
| **Careful** | — | Normal move |
| **Rushing** | -1 die | Double move |
| **Running** | Can't stealth | Triple move, +3 Threat |

---

## VEHICLES & CHASES

In the apocalypse, a working vehicle is worth killing for.

### Vehicle Stats

| Stat | Description |
|------|-------------|
| **Speed** | Dice bonus/penalty in chases |
| **Durability** | Wound track for the vehicle |
| **Capacity** | Passengers + cargo slots |
| **Fuel** | Consumption rate and tank size |
| **Noise** | Threat generated when engine is running (add once when you start the engine or enter a scene with engine running — not per round) |
| **Handling** | Modifier to Drive checks |

### Vehicle Examples

| Vehicle | Speed | Durability | Capacity | Fuel | Noise | Handling |
|---------|-------|------------|----------|------|-------|----------|
| **Motorcycle** | +2 | ☐☐☐ | 1+small | High | +3 | +1 |
| **Sedan** | +1 | ☐☐☐☐☐ | 4+trunk | Medium | +3 | — |
| **Pickup Truck** | — | ☐☐☐☐☐☐ | 3+bed | Medium | +4 | — |
| **SUV** | — | ☐☐☐☐☐☐ | 6+cargo | High | +4 | — |
| **Van** | -1 | ☐☐☐☐☐☐☐ | 8+large cargo | High | +4 | -1 |
| **Military Humvee** | — | ☐☐☐☐☐☐☐☐ | 4+gear | Very High | +5 | — |
| **Bus** | -2 | ☐☐☐☐☐☐☐☐☐ | 30+ | Very High | +5 | -2 |
| **Bicycle** | -1 | ☐☐ | 1+small | None | +1 | +1 |
| **Horse** | — | (use animal) | 1+saddle | (food/water) | +2 | — |

### Driving
Basic driving doesn't require rolls. Roll REFLEX + Drive when:
- Navigating dangerous terrain (debris, narrow gaps, rough road)
- Performing maneuvers (sharp turns, jumps, reversing fast)
- Chases (see below)
- Combat driving

**Drive Failure Consequences:**
- **Partial (1 hit)**: Lose ground, minor damage (1 Durability), or stall
- **Failure (0 hits)**: Crash (see Crashes) or lose control for 1 round
- **Critical Failure**: Serious crash, vehicle may be disabled

### Chases
When pursuit matters, use the **Chase Track**:

```
[CAUGHT] ← Bumper ← Close ← Near ← Far ← Distant → Very Far → [ESCAPED]
    1        2        3       4      5       6          7
```

**Starting Position**: GM sets based on circumstances:
- Ambush/close start: Position 2-3
- Normal pursuit: Position 4 (Near)
- Head start: Position 5-6

**Chase Rounds**:
1. Both sides roll REFLEX + Drive (+ vehicle Speed modifier)
2. **Winner moves the track** in their favor:
   - **Win by 1**: Move 1 position
   - **Win by 2+**: Move 2 positions
   - **Tie**: No movement, tension builds
3. Check for **Chase Heat** (see below)

**Chase Heat**: Chases get more dangerous the longer they go.
- Each round of chase: +1 Threat AND +1 Heat
- At **Heat 3+**: Roll a Complication each round
- At **Heat 5+**: Something dramatic happens (bridge out, horde on road, vehicle malfunction)

**Chase Maneuvers** (risky actions for advantage):
| Maneuver | Risk | Reward |
|----------|------|--------|
| **Shortcut** | -1 die, crash on failure | Win = move 2 extra positions |
| **Roadblock** | Uses Action, Craft/Drive check | Pursuer must pass Drive or lose 1 position |
| **Ram** | See Ramming rules | Damage target, may disable |
| **Bootleg Turn** | -2 dice Drive check | Reverse direction instantly (lose pursuers who overshoot) |
| **Chicken** | Both roll NERVE + Resolve | Loser swerves, loses 1 position. Tie = both crash. |

**Chase Complications** (roll d6 when Heat requires):
1. **Debris** — Drive check or -1 position
2. **Infected on road** — Drive check or stop to deal with them (+2 Threat)
3. **Other vehicles** — Navigate around, -1 die this round
4. **Terrain change** — Road quality shifts, Speed modifiers change
5. **Fuel warning** — Burn extra fuel, or -1 die to conserve
6. **Witness** — Other survivors see the chase, consequences later

**Ending Chases**:
- **Position 1 (Caught)**: Pursuer catches quarry. Combat, capture, or ram.
- **Position 7 (Escaped)**: Quarry escapes. Chase ends.
- **Either vehicle disabled**: Chase ends, situation resolves differently.
- **Voluntary end**: Either side can break off (requires successful Drive check if closely pursued).
- **Chase Escalation (Heat 7+)**: If the chase is still going, the GM should introduce a decisive element — the road forks (choose now), a bridge appears (cross or don't), a horde blocks one path, fuel gauge hits empty. This isn't a hard "end in 2 rounds" rule — it's permission for the GM to force interesting choices when a chase has gone long.

### Vehicle Combat

**Driver's Turn**:
- Drive (maintain control, perform maneuvers, chase rolls)
- OR take another action (but vehicle goes straight, may need Drive check to avoid obstacles)

**Passenger Actions**:
- Attack: -1 die to ranged attacks due to vehicle movement
- Reload, use items, navigate: Normal
- Lean out for better shot: -0 dice but attackers target you at +1 die

**Shooting at Vehicles**:
- **Hit the vehicle**: Normal attack roll. Damage reduces vehicle Durability.
- **Hit occupants**: -2 dice (they're behind metal/glass). Cover rules apply.
- **Called shot to tires**: -2 dice, 2+ damage = tire blown (see Breakdowns)

### Ramming
Deliberate collision as a weapon.

**Attacker rolls**: REFLEX + Drive
- **2+ hits**: Successful ram. Damage = vehicle Speed modifier + 2, **minimum 3** (so even slow vehicles deal at least 3 damage).
- **1 hit**: Glancing blow. Half damage to target, 1 Durability to your vehicle.
- **0 hits**: Miss, or you take the damage instead.

**Ramming Pedestrians**: Automatic hit if they can't dodge. Damage = 4 + Speed. They roll REFLEX + Athletics to dive aside (success = half damage, strong success = no damage).

### Vehicle Damage & Breakdowns
When a vehicle loses all Durability, it's **Disabled**. Mark damage left to right — thresholds trigger effects:

| Boxes Marked | Effect |
|--------------|--------|
| **1-2** | **Damaged** — Cosmetic, maybe a warning light |
| **3-4** | **Compromised** — -1 Handling, one system unreliable |
| **5-6** | **Critical** — -2 Handling, Speed -1, may stall |
| **All** | **Disabled** — Stops working. May be repairable. |

*Vehicles with fewer boxes hit thresholds faster. A 3-box motorcycle is Compromised after just 2 damage.*

**Component Damage** (GM can assign based on attack type):
- **Engine hit**: Speed -1, may stall (Drive check each round)
- **Tires blown**: Handling -2, can't exceed half Speed
- **Fuel leak**: Lose fuel rapidly, fire risk
- **Windows broken**: Occupants lose cover bonus

### Crashes
When you lose control or hit something:

**Crash Severity** (based on Speed when crashing):
- **Low Speed** (parking, crawling): 2 damage to vehicle, 1 damage to occupants
- **Medium Speed** (city driving): 4 damage to vehicle, 2 damage to occupants
- **High Speed** (highway): 6 damage to vehicle, 4 damage to occupants
- **Extreme** (racing, chase): 8 damage to vehicle, 6 damage to occupants

**Seatbelts**: Reduce occupant damage by 2.
**Airbags**: Reduce occupant damage by 1 (one-time use).
**Ejection**: If no seatbelt and high/extreme speed crash, GRIT + Athletics check or ejected (damage +2, land 1d6 × 10 feet away).

### Fuel & Maintenance
**Fuel Consumption** (per day of travel):
- Light use (short trips): 1 unit
- Medium use (half day): 2 units
- Heavy use (full day travel): 3-4 units
- Chase/combat: +1 unit per extended scene

**Finding Fuel**:
- Most vehicles encountered are empty (siphoned or used)
- Scavenging for fuel: WITS + Notice, -2 dice in picked-clean areas
- A full tank is a major find worth protecting

**Vehicle Maintenance**:
- Downtime activity: WITS + Craft to restore Durability
- Requires tools and possibly Parts
- Neglected vehicles lose 1 Durability per **month** (not week — less punishing)

### Vehicles as Assets
Vehicles are worth more than just transportation:

**Mobile Shelter**:
- Sleep in vehicle = partial Downtime benefits (can Rest, but cramped)
- Locked vehicle = relatively safe from infected (they can't open doors easily)
- Running engine = heat/AC but burns fuel and +3 Threat

**Mobile Stash**:
- Vehicle trunk/bed = **10 Significant Items** of shared group storage (not +10 per person — 10 total for the vehicle)
- Doesn't count against personal carry limits
- Risk: If you lose the vehicle, you lose the stash

**Vehicular Manslaughter**:
When driving through infected on foot:
- Roll REFLEX + Drive
- Each hit = one infected struck (4 damage each, likely fatal)
- **Risk**: Each infected struck = 1 Durability damage to vehicle
- At Speed, can clear a path through a small group

**Escape Vehicle**:
Having a working vehicle ready is a **backup plan**:
- If things go bad, run for the vehicle
- Reduces "cornered" feeling
- Vehicles should feel like valuable lifelines, not just transport

---

## ENVIRONMENTAL HAZARDS

The world itself wants you dead.

### Quick Reference — Hazard Stages
All environmental hazards follow a **three-stage pattern** for easy tracking:

| Stage | General Effect | Time to Progress |
|-------|----------------|------------------|
| **Impaired** | -1 die, minor symptoms | After 1 scene of exposure |
| **Struggling** | -2 dice, serious symptoms, taking damage | After 2-3 scenes |
| **Critical** | -3 dice, major damage, risk of death | After prolonged exposure |

*Use "scenes of exposure" instead of specific hours when you want faster pacing.*

### Exposure (Heat & Cold)

**Extreme Cold** (below freezing, blizzard, etc.):

| Stage | Effect |
|-------|--------|
| **Chilled** | -1 die to REFLEX rolls, 1 Stress |
| **Hypothermic** | -2 dice to all physical rolls, 1 Bruised per scene |
| **Critical** | GRIT + Endure each scene or take Bleeding wound, -3 dice |

**Mitigation**: Proper clothing (delays 1 stage), shelter (stops progression), fire/heat (reverses 1 stage per scene of warmth).

**Extreme Heat** (desert, heatwave, no shade):

| Stage | Effect |
|-------|--------|
| **Overheated** | -1 die to GRIT rolls, 1 Stress, double water consumption |
| **Heat Exhaustion** | -2 dice to all physical rolls, 1 Bruised per scene |
| **Heat Stroke** | GRIT + Endure each scene or take Bleeding wound, collapse |

**Mitigation**: Water (double ration = delay 1 stage), shade (stops progression), rest during peak heat.

### Fire & Smoke

**Fire Damage** (per round of contact):
- **Small fire** (torch, small flames): 2 damage
- **Large fire** (burning room, bonfire): 4 damage
- **Inferno** (fully engulfed building): 6 damage

**Catching Fire**: If you take fire damage and fail REFLEX + Athletics, you catch fire (2 damage per round until extinguished). **Stop, drop, roll**: GRIT + Athletics to extinguish (or water, smothering).

**Smoke Inhalation**:
- Light smoke: -1 die to all rolls
- Heavy smoke: -2 dice, 1 Bruised per minute without protection
- Thick smoke: Can't see (treat as Dark), 2 damage per minute

**Smoke rises**: Stay low for reduced effects.

**Fire Spread**: In dry/flammable environments, fire spreads 1 zone per minute unless contained. Excellent distraction, terrible for enclosed spaces.

### Water Hazards

**Swimming**: Roll Athletics (GRIT + Athletics) to swim. Failure = start drowning.
- Calm water: Standard roll
- Rough water: -1 die
- Rapids/flood: -2 dice
- Carrying gear: -1 die per 3 significant items

**Drowning**:
- Each round underwater without air: GRIT + Endure
- Failure: 1 Stress and -1 die to subsequent checks
- Three failures: Unconscious, Critical wound
- Rescued within 2 rounds of unconscious: Revivable

**Wet Gear**:
- Firearms: -2 dice until dried/cleaned, may jam
- Electronics: May be ruined (50% chance)
- Food: May be spoiled
- Clothing: Exposure penalties until dry

**Contaminated Water**:
- Drinking: GRIT + Endure or become sick
- Sickness: -1 die to all rolls for 1d6 days, 1 Stress per day
- Boiling/purification tablets negate the risk

### Structural Collapse

**Warning Signs** (Notice check to spot):
- Creaking, groaning, dust falling
- Visible cracks, sagging
- Water damage, fire damage

**Collapse Triggers**:
- Explosions, loud impacts
- Too much weight
- Fire weakening structure
- Time (decrepit buildings)

**When Collapse Happens**:
- GM announces collapse is imminent (usually 1 round warning)
- REFLEX + Athletics to escape
  - **2+ hits**: Escape unharmed
  - **1 hit**: Escape, but 2 damage (debris)
  - **0 hits**: Caught. 4 damage, trapped until rescued or dig out (GRIT + Athletics)

**Being Trapped**:
- Trapped characters can't move, limited actions
- Rescue: GRIT + Athletics from outside, may require tools
- Self-rescue: GRIT + Athletics at -2 dice
- Fire/flooding while trapped is extremely dangerous

### Starvation & Dehydration

**Food Deprivation**:

| Days Without Food | Effect |
|-------------------|--------|
| 1-2 | Hungry. 1 Stress per day. |
| 3-4 | Starving. -1 die to GRIT rolls, 1 Stress per day. |
| 5-7 | Weakened. -2 dice to physical rolls, 1 Bruised per day. |
| 8+ | Critical. GRIT + Endure daily or take Bleeding wound. |

**Water Deprivation** (faster):

| Time Without Water | Effect |
|--------------------|--------|
| 12 hours | Thirsty. 1 Stress. |
| 24 hours | Dehydrated. -1 die to all rolls, 2 Stress. |
| 48 hours | Critical. -2 dice, 1 Bleeding per 12 hours. |
| 72+ hours | GRIT + Endure or death. |

**Hot weather**: Double the rate of dehydration effects.

**Recovery**: Effects reverse one stage per day of adequate food/water. Severe cases may require medical attention.

### Disease & Infection (Non-Rage)

**Wound Infection** (untreated Bleeding/Broken wounds):
- Each day untreated: 20% chance of infection
- Infected wound: -1 die to all rolls, 1 Stress per day
- Untreated infection (1 week): Wound worsens by one level, may become septic
- Sepsis: Fever, -2 dice to all rolls, GRIT + Endure daily or take additional Bleeding wound. Fatal within days without antibiotics.

**Contaminated Food/Water**:
- Symptoms: 1d6 hours after consumption
- Effect: Vomiting, diarrhea, -2 dice to all rolls for 1d6 days
- Severe cases: 1 Bleeding per day until recovered

**Prevention**:
- Clean and bandage wounds promptly
- Boil water or use purification
- Cook food thoroughly
- Antibiotics treat infections (3-day course)

### Falling

| Fall Distance | Damage |
|---------------|--------|
| 10 feet (3m) | 2 |
| 20 feet (6m) | 4 |
| 30 feet (10m) | 6 |
| 40+ feet | 8+ (Critical likely) |

**Soft landing** (water, mattresses, brush): Reduce damage by 2.
**Controlled fall** (REFLEX + Athletics before landing): Reduce damage by hits scored.

### Radiation (Optional)
For campaigns involving nuclear elements:

**Radiation Exposure**:
- Low: 1 Stress, -1 die for 24 hours
- Medium: 2 Bleeding, -2 dice for days, long-term health effects
- High: Critical wound, likely fatal without treatment

**Protection**: Distance, shielding, limited time. Hazmat gear provides immunity to low/medium.

---

## WOUNDS & DEATH

No hit points. Characters have a **Wound Track** with multiple slots at each severity level.

### Wound Track
All characters have the same wound track structure:

```
Bruised:    [ ] [ ] [ ] [ ]     (No penalty)
Bleeding:   [ ] [ ] [ ]         (-1 die after combat)
Broken:     [ ] [ ]             (-2 dice after combat)
Critical:   [ ]                 (Dying)
```

**GRIT Bonus**: Add extra Bruised slots equal to GRIT - 2 (minimum 0).
- GRIT 1-2: No bonus (4 Bruised slots)
- GRIT 3: 5 Bruised slots
- GRIT 4: 6 Bruised slots
- GRIT 5: 7 Bruised slots

### Taking Damage
When you take damage, mark wounds starting from the **severity determined by the damage amount**, filling left to right. If that row is full, the wound **escalates** to the next severity.

| Damage | Wound Severity |
|--------|----------------|
| 1-2 | Bruised |
| 3-4 | Bleeding |
| 5-6 | Broken |
| 7+ | Critical |

**Example**: You take 4 damage (Bleeding). Mark the leftmost empty Bleeding slot. If all Bleeding slots are full, mark a Broken slot instead.

### Wound Penalties (Delayed)
**During combat**: Adrenaline keeps you going. Wound penalties don't apply.

**Adrenaline Window**: Penalties kick in **10 minutes after combat ends**. This gives time to treat wounds before they slow you down.

**After adrenaline fades**, wounds catch up with you:
- **Bleeding**: -1 die to all physical rolls
- **Broken**: -2 dice to rolls using the affected area (GM determines: arms, legs, torso, head)

Penalties from multiple wounds **stack**, but **cap at -3 dice total**. Even badly wounded, you can still function (barely).

**Patch Up** (temporary relief):
- Spend 1 Action + bandage/cloth to patch a **Bleeding or Broken** wound
- No roll required, just supplies
- **Effect**: Suppress that wound's penalty (-1 or -2 dice) for 1 hour
- Doesn't heal the wound, just masks the pain
- Can patch up during the adrenaline window to prevent penalties entirely (until the patch wears off)
- Bruised wounds have no penalties, so they don't need patching

### Armor
**Armor reduces damage** before wound severity is determined.

| Armor Type | Damage Reduction | Stealth Penalty |
|------------|------------------|-----------------|
| Heavy Clothing | 1 | None |
| Light Armor | 2 | -1 die |
| Heavy Armor | 3 | -2 dice (also -1 die to Athletics) |
| Improvised | 1 | -1 die |

*For Durability values, see Equipment section. Armor degrades (loses 1 Durability) when the **incoming damage before reduction** is 4+. This means armor wears down from any solid hit, not just heavy blows — reflecting the reality that stopping damage takes a toll on protective gear.*

### Death
- **Critical wound**: You're dying. Must be stabilized (WITS + Medicine, or first aid supplies) within **10 minutes** or you die.
- **All slots filled**: If you take damage and have no slots remaining at any level, you're **Dead**.
- **Critical while Critical**: If you already have a Critical wound and take 7+ damage again, you die instantly. No stabilization possible.

**Death is permanent.** Have a backup character ready.

---

## STRESS & PANIC

### Stress Track
Characters have **Stress Slots** equal to **NERVE + 3**.

Gain Stress from:
- Witnessing horror (infected feeding, friend dying): 1-2 Stress
- Pushing rolls (1s on pushed dice): 1 Stress per 1
- Exhaustion (no sleep, starving): 1 Stress per day
- Failed Resolve checks: 1 Stress
- Infection exposure (even if you pass): 1 Stress

### Breaking Point
When Stress Slots are full, roll **NERVE + Resolve**:
- **2+ Hits**: You hold it together. Clear 1 Stress immediately.
- **1 Hit**: Panic reaction (GM chooses: freeze, flee, scream, lash out). Clear 2 Stress after the reaction resolves (next round).
- **0 Hits**: Full breakdown. You're out of the scene (catatonic, hysterical, or fled). Clear all Stress when you rejoin play.

**Screaming during panic = automatic +4 Threat.**

### Stress Relief
See **Downtime** section for recovery options.

---

## NOISE & THREAT

### Threat Level
A shared tracker (0-10) representing how much attention the group has drawn. **Players should track this** — it keeps them engaged with the tension.

| Action | Threat Generated |
|--------|------------------|
| Hand signals, slow movement | 0 |
| Whispers, suppressed weapon, careful looting | +1 |
| Normal talking, jogging, breaking glass | +2 |
| Shouting, running, melee combat | +3 |
| Unsuppressed gunshot, car alarm, explosion | +4-6 |
| Sustained firefight, vehicle crash | +6-8 |

### Threat Consequences

**Option A — Thresholds** (predictable):
| Threat | Consequence |
|--------|-------------|
| 3+ | **Distant Notice** — Something heard you. Clock starts. |
| 5+ | **Investigation** — Hostiles moving toward your location. |
| 7+ | **Encounter** — They arrive. Roll encounter type. |
| 10 | **Swarm** — Overwhelming force. Run or die. |

**Option B — Threat Dice** (unpredictable):
At the end of each scene (or when dramatically appropriate), GM rolls dice equal to current Threat level.
- **Any 6s** = Encounter triggered
- **Multiple 6s** = Worse encounter (more enemies, worse timing)
- This creates tension even at low Threat — you're never truly safe.

**Choose your mode:**
| Mode | System | Best For |
|------|--------|----------|
| **Tactical Mode** | Fixed Thresholds | Strategic groups who want to plan around known danger levels |
| **Dread Mode** | Threat Dice | Horror-focused groups who want constant tension and uncertainty |

Pick one at campaign start. You can switch between sessions if the group wants to try the other style.

### Threat Decay
- **-1 Threat per scene** of silence/stillness (no specific time tracking needed)
- **-2 Threat per scene** if in a **secure location** (barricaded, underground)
- Some zones have **Ambient Threat** (minimum floor that won't decay)

### Threat Modifiers
| Condition | Effect |
|-----------|--------|
| Heavy rain/thunder | Noise generates -1 Threat |
| Open area (sound carries) | Noise generates +1 Threat |
| Horde zone | Ambient Threat 5+ |
| Distraction (alarm, fire) | Redirect attention, pause Threat decay elsewhere |

### Quick Threat Reference
```
0    [□□□□□□□□□□] 10
     ↑        ↑
   Safe    SWARM
```
Mark boxes as Threat rises. Easy visual tracker.

---

## INFECTION

### The Rage
Fast-acting viral infection. Victims turn within **minutes**, not hours.

### Exposure
Any of these requires an **Infection Check** (GRIT + Endure):
- Bitten by Infected
- Infected blood in open wound
- Infected blood in eyes/mouth

| Hits | Result |
|------|--------|
| 0 | **Infected.** Symptoms in 1d6 minutes. Turned in 2d6 minutes. |
| 1 | **Fighting it.** Symptoms in 1d6 × 10 minutes. Second check at -2 dice or turn. |
| 2+ | **Clear.** This time. |

Even a successful check causes **1 Stress** — the fear never goes away.

### Symptoms
- Stage 1 (minutes): Fever, aggression, -1 die to NERVE rolls
- Stage 2 (minutes later): Bloodshot eyes, incoherent speech, -2 dice to all rolls
- Stage 3: **Turned.** No longer a player character.

### Treatment
There is no cure. Only prevention:
- **Amputation** (if bitten on limb): Immediate amputation (within 60 seconds / ~10 combat rounds) = automatic success, but lose the limb permanently. Requires WITS + Medicine check or the victim takes a Critical wound from blood loss.
- **Experimental Suppressants** (rare): Delay symptoms, don't stop them. Buys hours. Each dose is incredibly valuable.

---

## EQUIPMENT & DURABILITY

### Durability Track
Weapons, armor, and tools have a **Durability** rating (typically 3-6). Mark durability loss when:
- **Weapons**: Critical failure on attack, or 1 Durability per session of use without maintenance (mark at session end)
- **Armor**: Absorbs 5+ damage in a single hit
- **Tools**: Critical failure on skill check using the tool
- **Improvised items**: Any use (they're fragile)

When all Durability is marked, the item is **Broken**:
- **Weapons**: -2 dice to attacks, jams on any 1s rolled
- **Armor**: Damage reduction halved (round down)
- **Tools**: -2 dice to relevant checks

**Destroyed**: If a Broken item would lose more Durability, it's destroyed and useless.

**Armor Durability Reminder**: Armor loses 1 Durability when absorbing 4+ damage (before reduction). See Armor section under Wounds & Death.

### Weapon Durability Table

*For full weapon stats (damage, range, properties, noise), see the Combat section.*

| Weapon | Durability | Notes |
|--------|------------|-------|
| **Unarmed** | — | Always available |
| **Knife/Shiv** | 4 | Concealable, small item |
| **Machete/Axe** | 5 | Can breach doors |
| **Baseball Bat** | 3 | Common |
| **Crowbar** | 6 | Also a tool |
| **Fire Axe** | 5 | Heavy |
| **Spear** | 4 | Craftable |
| **Sledgehammer** | 6 | Very heavy |
| **Pistol** | 5 | 12-15 round magazine |
| **Pistol (suppressed)** | 4 | Suppressor has 15 uses before degraded (crafted suppressors: 10 uses) |
| **Revolver** | 6 | Reliable |
| **SMG** | 4 | 20-30 round magazine |
| **Shotgun** | 5 | 6-8 shells |
| **Rifle** | 5 | 20-30 round magazine |
| **Hunting Rifle** | 5 | Scoped |
| **Bow** | 4 | Arrows 50% recoverable |
| **Crossbow** | 4 | Bolts 50% recoverable |
| **Molotov** | 1 | One use |
| **Improvised** | 2 | Breaks on critical failure |

### Armor Table

| Armor | Reduction | Durability | Notes |
|-------|-----------|------------|-------|
| Heavy Clothing | 1 | 3 | No movement penalty |
| Light Armor | 2 | 4 | -1 die to Stealth |
| Heavy Armor | 3 | 5 | -2 dice to Stealth, -1 die to Athletics |
| Improvised | 1 | 2 | Bulky, -1 die to Stealth |
| Riot Shield | +1 die to Active Defense/Parry | 4 | Requires one hand (see Shield Use) |

### Maintenance
During Downtime, you can maintain equipment:
- **WITS + Craft** check
- **2+ Hits**: Restore 2 Durability
- **1 Hit**: Restore 1 Durability
- **0 Hits**: No progress, may need parts
- Requires appropriate tools and/or parts

---

## RESOURCES & CARRYING

### Carrying Capacity
Characters can carry a number of **Significant Items** equal to **GRIT + 4**.

**Significant Items** include:
- Each weapon
- Armor (if worn, doesn't count)
- 3 days of food/water
- First aid kit
- Tool kit
- Radio
- 50 rounds of ammunition (per type)

**Small items** (knife, lighter, bandages, individual doses) don't count unless you're carrying absurd quantities.

**Backpack/Bag**: +3 carrying capacity, but takes an Action to access items inside.

### Group Supplies
The group may maintain a **Stash** at a safe location:
- Unlimited storage
- Must be secured (risk of theft, discovery)
- Takes time to access (travel to location)

Track group supplies separately:
- **Food**: Days of supply (1 per person per day)
- **Water**: Days of supply (1 per person per day)
- **Ammo**: By type (pistol, rifle, shotgun, arrows)
- **Medicine**: Doses (bandages, antibiotics, painkillers, suppressants)
- **Fuel**: Gallons/liters
- **Parts**: Generic crafting components

### Scavenging

Searching takes time, makes noise, and depletes locations.

#### Search Types

| Search Type | Time | Threat | Roll Modifier | Notes |
|-------------|------|--------|---------------|-------|
| **Quick Sweep** | 5 min | +1 | -1 die | Grab and go |
| **Standard Search** | 15 min | +2 | — | Normal scavenging |
| **Thorough Search** | 30 min | +3 | +1 die | Leave no drawer unopened |
| **Ransack** | 1 hour | +4 | +2 dice | Tear the place apart |

#### Search Roll
Roll **WITS + Notice** (or **WITS + Survival** for wilderness foraging):

| Hits | Result |
|------|--------|
| 0 | **Nothing** — Wasted time. GM may add a complication (Threat, hazard, encounter). |
| 1 | **Scraps** — 1 small item, 1 day food, 1 component, or minor find |
| 2 | **Useful** — Weapon, tool, 3 days supplies, 2-3 components |
| 3 | **Cache** — Multiple useful items, 1 week supplies, or 4-5 components |
| 4+ | **Jackpot** — Rare item, large cache, exactly what you needed, or player's choice |

#### Scarcity Modifiers

| Scarcity | Modifier | Examples |
|----------|----------|----------|
| **Picked Clean** | -2 dice | Abandoned cities, refugee routes, obvious buildings |
| **Sparse** | -1 die | Suburbs, rural areas, places others have passed through |
| **Moderate** | — | Off the beaten path, overlooked locations |
| **Untouched** | +1 die | Remote areas, locked rooms, places too dangerous for others |
| **Pristine** | +2 dice | Sealed bunkers, military caches, places no one's found |

#### Location Depletion
Each search **depletes** a location by 1 scarcity step. A Moderate location becomes Sparse after one search, Picked Clean after two. Once Picked Clean, there's nothing left worth finding.

**Location Recovery**: Depleted locations don't recover unless restocked (supplies delivered, new inhabitants move in, etc.)

#### Targeted Searches
Looking for something specific? Declare what you want:

| Target | Modifier | On Success |
|--------|----------|------------|
| **General supplies** | — | Whatever's there |
| **Specific category** (food, medicine, weapons) | -1 die | Find that category if available |
| **Specific item** (antibiotics, 9mm ammo, car battery) | -2 dice | Find it if plausible for location |

*GM has final say on what's plausible. You won't find antibiotics in a hardware store.*

#### Location Loot Tables
What you find depends on where you look:

| Location Type | Common Finds | Rare Finds | Component Types |
|---------------|--------------|------------|-----------------|
| **Residential** | Food, clothing, basic meds, kitchen tools | Weapons (hunting/home defense), cash, keys | Fabric, Medical, Mechanical |
| **Grocery/Retail** | Canned food, water, batteries, general supplies | Pharmacy meds, camping gear | Medical, Chemical, Fabric |
| **Hardware Store** | Tools, parts, building materials | Generators, fuel, weapons (axes, etc.) | Mechanical, Structural, Chemical |
| **Hospital/Pharmacy** | Medicine, bandages, medical equipment | Surgical tools, rare drugs, suppressants | Medical, Chemical, Electrical |
| **Police/Military** | Weapons, ammo, armor, radios | Tactical gear, vehicles, heavy weapons | Mechanical, Electrical |
| **Gas Station** | Fuel, snacks, road maps | Vehicles, propane, tools | Chemical, Mechanical |
| **Office Building** | Paper, batteries, first aid kits | Electronics, server rooms, ID cards | Electrical, Fabric |
| **Warehouse** | Bulk goods (depends on type), pallets | Forklifts, industrial equipment | Structural, Mechanical |
| **Wilderness** | Water sources, edible plants, firewood | Game (hunting), medicinal herbs, shelter materials | Fabric (hides), Structural (wood) |
| **Vehicles** | Fuel (if any), maps, personal items | Tools, weapons, keys to other vehicles | Mechanical, Electrical, Chemical |

#### Dangerous Locations
Some places are dangerous but rewarding:

| Danger Level | Risk | Reward |
|--------------|------|--------|
| **Low** | Ambient Threat 1-2 | Normal scarcity |
| **Medium** | Ambient Threat 3-4, possible encounters | +1 scarcity step better |
| **High** | Ambient Threat 5+, likely encounters | +2 scarcity steps better |
| **Extreme** | Horde territory, military lockdown | Pristine loot if you survive |

*A Picked Clean hospital (Medium danger) might actually be Moderate. Worth the risk?*

---

## CRAFTING

### Requirements
1. **Components** — Specific types and quantities
2. **Time** — Uninterrupted work
3. **Tools** — Most items need a tool kit; some need specialized tools
4. **Check** — WITS + Craft (some items use other skills)

### Component Types
Track components by category:

| Type | Symbol | Examples | Primary Sources |
|------|--------|----------|-----------------|
| **Mechanical** | ⚙️ | Gears, springs, screws, pipes, wire, nails | Hardware, garages, workshops |
| **Medical** | ➕ | Bandages, alcohol, syringes, gauze, pills | Hospitals, pharmacies, homes |
| **Chemical** | ⚗️ | Fuel, bleach, fertilizer, solvents, gunpowder | Gas stations, farms, cleaning |
| **Electrical** | ⚡ | Batteries, wires, circuits, bulbs, motors | Electronics, offices, vehicles |
| **Fabric** | 🧵 | Cloth, rope, leather, thread, padding | Clothing stores, homes, vehicles |
| **Structural** | 🪵 | Wood, metal sheets, nails, tape, planks | Hardware, construction sites |

**Tracking Options:**
- **Simple**: Track generic "Parts" — substitute for any type
- **Standard**: Track the 6 categories (recommended)
- **Detailed**: Track specific items within categories (maximum realism)

### Crafted vs. Found Quality
Crafted items are functional but often inferior to professionally manufactured gear. A crafted shiv (Durability 3) won't match a factory knife (Durability 4). This is intentional — scavenging quality gear is valuable, and crafting is for when you can't find what you need.

**Exception**: A **Quality** result (3+ hits) on the crafting check produces gear equal to or better than found equivalents.

### Crafting Check
Roll **WITS + Craft** (unless noted otherwise):

| Hits | Result |
|------|--------|
| 0 | **Failure** — Lose half your components (round up). Item not made. |
| 1 | **Flawed** — Item works, but has a drawback (see Flaws table) |
| 2 | **Success** — Item crafted as intended |
| 3+ | **Quality** — Bonus Durability, enhanced effect, or extra feature |

#### Crafting Flaws (d6 or GM choice)
| d6 | Flaw |
|----|------|
| 1 | **Fragile**: -2 Durability |
| 2 | **Unreliable**: Fails on any 1s rolled when used |
| 3 | **Loud**: +1 Threat when used |
| 4 | **Slow**: Takes an extra Action to use |
| 5 | **Weak**: -1 to effect (damage, healing, etc.) |
| 6 | **Ugly**: Works fine, but looks terrible (social penalty if relevant) |

### Scrounging (Missing Components)
Don't have everything? Attempt with penalties:
- **Missing 1 component**: -1 die
- **Missing 2 components**: -2 dice
- **Missing 3+ components**: Can't attempt

*Scrounged items are always Flawed even on success (roll on Flaws table).*

### Crafting Noise
| Activity | Threat |
|----------|--------|
| **Silent** (bandages, sorting, planning) | +0 |
| **Quiet** (sewing, careful assembly) | +1 |
| **Moderate** (sawing, hammering softly, cooking) | +2 |
| **Loud** (drilling, welding, forging) | +3-4 |
| **Very Loud** (power tools, gunsmithing, explosives) | +4-5 |

---

### CRAFTING RECIPES

#### Medical & Survival

| Item | Components | Time | Difficulty | Noise | Effect |
|------|------------|------|------------|-------|--------|
| **Bandage** | Fabric ×1 + Medical ×1 | 5 min | Easy (+1) | Silent | Stops bleeding, allows wound treatment |
| **Splint** | Structural ×1 + Fabric ×1 | 10 min | Standard | Quiet | Required for Broken limb Surgery; without it, Surgery on limbs is at -2 dice |
| **Tourniquet** | Fabric ×1 + Mechanical ×1 | 5 min | Standard | Silent | Stops Bleeding wound on limb immediately (no roll); if left on more than 1 hour, limb must be amputated or take 1 Broken wound when removed |
| **Herbal Remedy** | Foraged herbs ×3 | 20 min | Hard (-1), Survival | Quiet | Reduces illness penalties by 1 die for 24 hours |
| **Antiseptic** | Chemical ×2 + Medical ×1 | 15 min | Standard | Quiet | Prevents wound infection |
| **Painkiller (crude)** | Chemical ×1 + Medical ×1 | 30 min | Hard (-1) | Quiet | Suppresses 1 wound penalty for 4 hours |
| **Stimulant** | Chemical ×2 | 20 min | Hard (-1) | Quiet | Ignore Exhausted for 8 hours, then crash |

#### Food & Water

| Item | Components | Time | Difficulty | Noise | Effect |
|------|------------|------|------------|-------|--------|
| **Purified Water** | Contaminated water + heat source | 20 min | Easy (+1) | Moderate | Safe to drink (per gallon) |
| **Water Filter** | Fabric ×2 + Mechanical ×1 + container | 30 min | Standard | Quiet | Purifies water without fire, 20 uses |
| **Preserved Food** | Fresh food + Chemical ×1 (salt/sugar) | 1 hour | Standard | Moderate | Extends food life to 2 weeks |
| **Smoked Meat** | Raw meat + fire + Structural ×1 | 4 hours | Standard, Survival | Moderate | Extends meat life to 1 month |
| **Trail Rations** | Mixed food + Fabric ×1 (wrapping) | 30 min | Easy (+1) | Quiet | Compact, 3 days food per unit |
| **Snare/Trap (hunting)** | Mechanical ×1 + Fabric ×1 | 15 min | Standard, Survival | Quiet | Catches small game if set properly |

#### Weapons & Ammunition

| Item | Components | Time | Difficulty | Noise | Effect |
|------|------------|------|------------|-------|--------|
| **Shiv** | Mechanical ×1 + Fabric ×1 | 10 min | Standard | Quiet | 2 damage, Durability 3 |
| **Club (reinforced)** | Structural ×1 + Mechanical ×1 | 15 min | Standard | Moderate | 3 damage, Durability 4 |
| **Spear** | Structural ×2 + Mechanical ×1 | 20 min | Standard | Moderate | 3 damage, Reach, Durability 4 |
| **Bow** | Structural ×2 + Fabric ×1 | 1 hour | Hard (-1) | Moderate | 3 damage, Quiet, Durability 4 |
| **Arrows (×5)** | Structural ×1 + Mechanical ×1 | 15 min | Standard | Quiet | Standard arrows |
| **Crossbow** | Mechanical ×3 + Structural ×1 | 2 hours | Hard (-1) | Loud | 4 damage, Quiet, Slow, Durability 4 |
| **Reloaded Ammo (×10)** | Brass ×10 + Chemical ×1 + Mechanical ×1 | 30 min | Hard (-1) | Quiet | Requires reloading tools |
| **Improvised Shotgun Shells (×4)** | Shells + Chemical ×1 + Mechanical ×1 | 20 min | Hard (-1) | Quiet | Unreliable property |

#### Explosives & Distractions

| Item | Components | Time | Difficulty | Noise | Effect |
|------|------------|------|------------|-------|--------|
| **Molotov Cocktail** | Chemical ×1 (fuel) + Fabric ×1 + bottle | 10 min | Standard | Quiet | 4 fire damage, area |
| **Smoke Bomb** | Chemical ×2 + container | 15 min | Hard (-1) | Quiet | Creates smoke cloud, 3 rounds |
| **Flashbang (improvised)** | Chemical ×2 + Electrical ×1 | 30 min | Hard (-1) | Moderate | Blinds/deafens 1 round |
| **Pipe Bomb** | Chemical ×2 + Mechanical ×2 | 1 hour | Hard (-1) | Moderate | 6 damage, area, very loud |
| **Noise Maker** | Electrical ×1 + Mechanical ×1 | 15 min | Standard | Quiet | Remote-triggered +4 Threat elsewhere |
| **Alarm Trap** | Mechanical ×2 + Electrical ×1 | 20 min | Standard | Quiet | Tripwire triggers loud alarm |

#### Traps & Defenses

| Item | Components | Time | Difficulty | Noise | Effect |
|------|------------|------|------------|-------|--------|
| **Tripwire Alarm** | Fabric ×1 + Mechanical ×1 | 10 min | Easy (+1) | Quiet | Alerts when triggered |
| **Snare Trap** | Fabric ×1 + Structural ×1 | 15 min | Standard | Quiet | Captures/slows target |
| **Spike Trap** | Mechanical ×2 + Structural ×1 | 30 min | Standard | Moderate | 3 damage, hidden |
| **Bear Trap** | Mechanical ×3 | 1 hour | Hard (-1) | Loud | 4 damage, immobilizes |
| **Barricade (light)** | Structural ×2 | 15 min | Easy (+1) | Moderate | Blocks door, Durability 3 |
| **Barricade (heavy)** | Structural ×4 + Mechanical ×1 | 1 hour | Standard | Loud | Serious barrier, Durability 6 |
| **Safe Room Door** | Structural ×4 + Mechanical ×3 | 4 hours | Hard (-1) | Very Loud | Durability 10, lockable |

#### Gear & Tools

| Item | Components | Time | Difficulty | Noise | Effect |
|------|------------|------|------------|-------|--------|
| **Lockpick Set** | Mechanical ×2 | 20 min | Hard (-1) | Quiet | 5 uses; then -2 dice (worn), 5 more uses then broken |
| **Improvised Silencer** | Mechanical ×1 + Fabric ×1 | 30 min | Hard (-1) | Moderate | 10 uses (vs 15 for found), -3 Threat on shots |
| **Torch** | Structural ×1 + Fabric ×1 + Chemical ×1 | 10 min | Easy (+1) | Quiet | 1 hour light, +2 Threat beacon |
| **Lantern** | Mechanical ×1 + Chemical ×1 | 30 min | Standard | Quiet | 4 hours light, refillable |
| **Radio Repair** | Electrical ×2 + Mechanical ×1 | 1 hour | Standard, Tech | Moderate | Fixes broken radio |
| **Generator Repair** | Mechanical ×3 + Electrical ×2 | 2 hours | Hard (-1), Tech | Loud | Fixes broken generator |
| **Vehicle Repair (minor)** | Mechanical ×2 | 1 hour | Standard | Moderate | Restores 2 vehicle Durability |
| **Vehicle Repair (major)** | Mechanical ×4 + Electrical ×1 | 4 hours | Hard (-1) | Loud | Restores 4 vehicle Durability |

#### Armor & Protection

| Item | Components | Time | Difficulty | Noise | Effect |
|------|------------|------|------------|-------|--------|
| **Padded Clothing** | Fabric ×3 | 30 min | Easy (+1) | Quiet | 1 armor, no penalty |
| **Improvised Armor** | Fabric ×2 + Structural ×2 | 1 hour | Standard | Moderate | 2 armor, -1 Stealth, Durability 2 |
| **Reinforced Armor** | Structural ×3 + Fabric ×2 + Mechanical ×1 | 2 hours | Hard (-1) | Loud | 3 armor, -2 Stealth, Durability 3 |
| **Riot Shield** | Structural ×3 + Mechanical ×1 | 1 hour | Standard | Loud | +2 Defense, Durability 4 |
| **Face Guard** | Structural ×1 + Fabric ×1 | 20 min | Standard | Moderate | Blocks blood spray infection |
| **Hazmat Suit Repair** | Fabric ×2 + Chemical ×1 | 1 hour | Hard (-1) | Quiet | Patches holes in hazmat gear |

#### Shelter & Camp

| Item | Components | Time | Difficulty | Noise | Effect |
|------|------------|------|------------|-------|--------|
| **Lean-to Shelter** | Structural ×3 | 30 min | Easy (+1), Survival | Moderate | Basic weather protection |
| **Hidden Camp** | Structural ×2 + Fabric ×2 | 1 hour | Standard, Survival | Quiet | Camouflaged, -2 to be spotted |
| **Fire Pit** | Structural ×2 | 15 min | Easy (+1) | Moderate | Cooking, warmth, +2 Threat when lit |
| **Smokeless Fire** | Structural ×3 | 30 min | Hard (-1), Survival | Moderate | Only +1 Threat when lit |
| **Rain Collector** | Fabric ×2 + Structural ×1 | 30 min | Standard | Quiet | Collects 1 day water per day of rain |
| **Watch Tower** | Structural ×6 + Mechanical ×2 | 4 hours | Standard | Very Loud | +2 Notice for lookouts |
| **Perimeter Fence** | Structural ×8 + Mechanical ×2 | 8 hours | Standard | Very Loud | Slows intruders, early warning |

---

### UPGRADING EQUIPMENT

Improve existing gear with components and work:

| Upgrade | Base Item | Components | Time | Difficulty | Effect |
|---------|-----------|------------|------|------------|--------|
| **Sharpen Blade** | Any blade | Mechanical ×1 | 15 min | Easy (+1) | +1 damage for 1 day |
| **Reinforce Handle** | Melee weapon | Structural ×1 + Fabric ×1 | 20 min | Standard | +1 Durability |
| **Extended Magazine** | Firearm | Mechanical ×2 | 30 min | Hard (-1) | +50% ammo capacity |
| **Scope Mount** | Rifle | Mechanical ×1 + scope | 30 min | Standard | Enables Extreme range |
| **Sling** | Any weapon | Fabric ×1 | 10 min | Easy (+1) | Quick-draw as Free action |
| **Suppress** | Pistol/Rifle | Mechanical ×2 + Fabric ×1 | 1 hour | Hard (-1) | Adds Quiet property, 10 uses |
| **Armor Patch** | Any armor | Same type as armor ×1 | 20 min | Standard | Restore 1 Durability |
| **Waterproof Bag** | Backpack | Fabric ×1 + Chemical ×1 | 30 min | Quiet | Contents stay dry |

---

### CRAFTING SKILL VARIANTS

Some recipes use different skills:

| Skill | Used For |
|-------|----------|
| **Craft** | Most items (default) |
| **Survival** | Hunting traps, shelters, foraging recipes, fire-building |
| **Medicine** | Advanced medical items, drug synthesis |
| **Tech** | Electronics, radios, generators, complex mechanical |

If a recipe lists a skill, use WITS + that skill instead of WITS + Craft.

---

## DOWNTIME & RECOVERY

When the group reaches a **Safe Location** (secured building, hidden camp, allied settlement), they enter **Downtime**. Each character can perform **2 Downtime Activities** per day of rest.

### Downtime Activities

**Rest**
- Requirement: Safe location, 8 hours
- Effect: Heal 2 Bruised wounds, or 1 Bleeding wound
- *Rest is reliable but slow — one Downtime activity for one Bleeding wound*

**Medical Treatment**
- Requirement: Medicine supplies + WITS + Medicine check
- 2+ Hits: Heal 1 Bleeding **and** convert 1 Broken to Bleeding (two benefits)
- 1 Hit: Heal 1 Bleeding
- 0 Hits: No effect, medicine still consumed
- *Medical Treatment is riskier but can do more — on a strong success, you heal Bleeding AND start fixing Broken wounds*

**Surgery** (Broken or Critical wounds)
- Requirement: Medical supplies + clean environment + **NERVE + Medicine** (-1 die)
- *Surgery uses NERVE, not WITS — it requires steady hands and composure under pressure, not just knowledge. This also prevents Medicine from being a single-attribute superpower.*
- **For Broken wounds:**
  - 2+ Hits: Wound begins healing (heals after 1 week of rest)
  - 1 Hit: Partial success, heals after 2 weeks
  - 0 Hits: Complication, takes a Bleeding wound
- **For Critical wounds** (must be stabilized first):
  - 2+ Hits: Critical wound converts to Broken (then heals per Broken rules)
  - 1 Hit: Stable but not improving; can attempt again after 1 week
  - 0 Hits: Complication — takes another Bleeding wound, still Critical

**Stress Relief**
- Choose an activity that helps your character decompress:
  - **Talk it out**: Share fears with another PC. Both clear 1 Stress.
  - **Vice**: Alcohol, drugs, etc. Clear 2 Stress, but -1 die to all rolls next day.
  - **Hobby**: Reading, music, art. Clear 1 Stress.
  - **Isolation**: Time alone. Clear 1 Stress.
  - **Physical exertion**: Training, sparring. Clear 1 Stress, +1 die to next Athletics check.
- **Bonded PC**: If you do an activity with a PC you Trust (from Bonds), clear +1 additional Stress.

**Maintain Equipment**
- Roll WITS + Craft
- 2+ Hits: Restore 2 Durability to one item
- 1 Hit: Restore 1 Durability
- Requires tools; some repairs require Parts

**Craft Item**
- As per Crafting rules
- Time counts against Downtime (30-min craft = uses part of 1 activity)

**Scout/Recon**
- Roll WITS + Notice or REFLEX + Stealth
- 2+ Hits: Learn about nearby threats, resources, or routes
- 1 Hit: Partial info
- 0 Hits: You're spotted or learn nothing

**Scavenge**
- Leave safe location to search nearby
- Roll per Scavenging rules
- Adds Threat to area if done repeatedly

**Train**
- Work on a skill with a mentor or through practice
- Mark 1 progress toward that skill (3 progress = +1 to the skill, then reset)
- Track progress separately for each skill being trained

**Stand Watch**
- Spend a Downtime activity keeping guard
- Allows others to rest safely
- If threats approach, you get a WITS + Notice check to warn the group

### Natural Healing
Without medical attention:
- **Bruised**: Heals after 1 day of rest
- **Bleeding**: Heals after 1 week (can become infected without treatment)
- **Broken**: Heals after 1 month (requires proper setting or may heal wrong)
- **Critical**: Cannot heal naturally. Must be stabilized first (WITS + Medicine or first aid supplies, within 10 minutes), then requires Surgery to convert to Broken before it can heal. See Surgery under Downtime Activities.

---

## THE INFECTED

*Most infected have simplified wound tracks — they don't have Bleeding or Broken slots. Any damage that would go to those slots goes to the next available slot instead. This makes them faster to run and reflects that they don't feel pain normally. Exception: Some special infected (like Bloated) have additional wound slots noted in their stat blocks — use those as written.*

### Rage Infected (Common)
Fast, aggressive, no self-preservation. Hunt by sound and sight.

| Stat | Value |
|------|-------|
| GRIT | 3 |
| REFLEX | 4 |
| NERVE | 2 |
| Wounds | Bruised ☐☐☐, Critical ☐ |
| Attack | 4 dice (claws/bite), Damage 3 |
| Special | **Relentless** — Ignores wound penalties. **Infectious** — Bite/blood triggers check. |

*Infected don't roll NERVE + Notice for initiative — they roll only their NERVE dice (no Notice skill). Standard infected roll 2 dice for initiative.*

### Fresh Infected
Recently turned. Faster, but less durable.

| Stat | Value |
|------|-------|
| GRIT | 2 |
| REFLEX | 5 |
| NERVE | 4 |
| Wounds | Bruised ☐☐, Critical ☐ |
| Attack | 5 dice, Damage 2 |
| Special | **Frenzied** — +2 dice to initiative rolls. Their newly-turned rage makes them explosively reactive. |

### Bloated Infected
Long-term infected. Slower, tougher, explosive.

| Stat | Value |
|------|-------|
| GRIT | 5 |
| REFLEX | 2 |
| NERVE | 1 |
| Wounds | Bruised ☐☐☐☐☐, Bleeding ☐☐, Critical ☐ |
| Attack | 3 dice, Damage 4 |
| Special | **Rupture** — When killed, sprays blood (everyone in Melee range makes Infection Check). **Sluggish** — Only 1 die for initiative. |

### Swarm (3-6 Infected)
Treat as single entity with:
- +2 dice to attacks
- Combined Wounds (use Swarm track below)
- -1 die per row cleared

**Swarm Wounds**: ☐☐☐ | ☐☐☐ | ☐☐☐ (9 total, -1 die per 3)

**Swarm Damage**: Ignore normal damage severity rules. Each **2 points of damage marks 1 box** (round up). A 4-damage hit marks 2 boxes; a 5-damage hit marks 3 boxes. This represents the difficulty of putting down multiple infected — you're wounding and slowing them, not cleanly killing each one. Swarms feel like a threatening mass, not target practice.

### Large Group (7-9 Infected)
Use **two Swarms** acting on the same initiative, or one Swarm plus 1-3 individual infected. GM's choice based on pacing — two Swarms is faster to run, individuals add tactical variety.

### Horde (10+)
Don't fight. Run.
- Automatic 6 dice attack against anyone caught
- Requires **total retreat** or environmental escape
- Used for "Threat 10" scenarios

---

## HUMAN THREATS

### Hostile Survivor
Desperate, dangerous, but rational.

| Stat | Value |
|------|-------|
| Attributes | GRIT 2, REFLEX 2, WITS 2, NERVE 2 |
| Skills | Shoot 1, Brawl 1, Notice 1 |
| Wounds | Standard human track |
| Gear | Varies (often melee + pistol) |
| Behavior | May negotiate, ambush, or flee if outmatched |

### Raider
Organized, aggressive, takes what they want.

| Stat | Value |
|------|-------|
| Attributes | GRIT 3, REFLEX 3, WITS 2, NERVE 2 |
| Skills | Shoot 2, Brawl 2, Athletics 1 |
| Wounds | Standard + Light Armor (2 reduction) |
| Gear | Rifle or shotgun, melee backup, radio |
| Behavior | Coordinates with others, won't retreat easily |

### Militia/Military
Trained, equipped, following orders.

| Stat | Value |
|------|-------|
| Attributes | GRIT 3, REFLEX 3, WITS 3, NERVE 3 |
| Skills | Shoot 3, Athletics 2, Notice 2, Endure 2 |
| Wounds | Standard + Heavy Armor (3 reduction) |
| Gear | Rifle, sidearm, body armor, radio, NVGs |
| Behavior | Follows ROE, may detain or shoot on sight depending on orders |

---

## GM TOOLS

### Encounter Table (roll 2d6 when Threat triggers)

| Roll | Encounter |
|------|-----------|
| 2 | Horde — RUN |
| 3-4 | Swarm (1d6 Infected) + hostile survivors heard gunfire |
| 5-6 | Swarm (1d6+2 Infected) |
| 7 | 1d6 Infected, approaching slowly (1d6 minutes away) |
| 8-9 | 1d3 Infected, already close (this room/next room) |
| 10-11 | Hostile survivors (1d4), investigating |
| 12 | Neutral survivors, also hiding — tense standoff |

### Location Templates

| Location | Ambient Threat | Scarcity | Typical Finds |
|----------|----------------|----------|---------------|
| **Suburbs** | 2 | Sparse | Food, tools, vehicles |
| **Urban center** | 5 | Picked Clean | Shortcuts, rooftop paths |
| **Hospital** | 4 | Moderate | Medicine, medical tools |
| **Military checkpoint** | 3 | Moderate | Weapons, ammo, armor |
| **Police station** | 3 | Sparse | Weapons, radios, cells for safety |
| **Supermarket** | 4 | Picked Clean (food) / Moderate (other) | Food if lucky, carts, supplies |
| **Wilderness** | 1 | Sparse | Hunting, water, exposure risk |
| **Underground/Sewers** | 2 | Picked Clean | Hidden routes, sound echoes (+1 Threat) |
| **School** | 3 | Moderate | Supplies, large spaces, barricadeable |
| **Factory/Warehouse** | 3 | Moderate (parts) | Parts, tools, machinery |

### Complication Table (for Partial Successes)

| d6 | Complication |
|----|--------------|
| 1 | **Noise** — +2 Threat |
| 2 | **Time** — Takes twice as long |
| 3 | **Cost** — Uses extra resource (ammo, durability, supplies) |
| 4 | **Attention** — Someone notices (infected, survivor, or unknown) |
| 5 | **Injury** — Minor harm (1 Bruised) or 1 Stress |
| 6 | **Choice** — GM offers a hard choice (succeed fully but pay a price, or partial result) |

### Quick NPC Generator

**Attitude** (d6): 1-2 Hostile, 3-4 Suspicious, 5 Neutral, 6 Friendly

**Want** (d6):
1. Food/Water
2. Medicine
3. Weapons/Protection
4. Information
5. Labor/Help
6. To be left alone

**Secret** (d6):
1. Bitten/infected (hiding it)
2. Has a hidden cache
3. Knows a safe route
4. Murdered someone
5. Former military/police
6. Protecting someone hidden nearby

---

## CHARACTER CREATION

### Step 1: Concept
Who were you before? Who are you now?

### Step 2: Attributes
Distribute **12 points** among GRIT, REFLEX, WITS, NERVE.
- Minimum 1, Maximum 4 at creation
- Human average is 2

### Step 3: Skills
Distribute **12 points** among skills.
- Maximum 3 at creation
- At least 1 point in a combat skill recommended (you will need it)
- If you take Knowledge, choose 2 specializations

### Step 4: Background
Choose a **Background** for starting equipment and one skill bonus. The background bonus is applied **after** skill point distribution and **can** raise a skill to 4 at creation (exceeding the normal creation cap of 3, but not the absolute cap of 4).

| Background | Bonus | Starting Gear |
|------------|-------|---------------|
| **Survivor** | +1 Endure | Backpack, knife, 3 days food, lighter, crowbar |
| **Soldier** | +1 Shoot | Pistol (12 rounds), light armor, combat knife, radio |
| **Medic** | +1 Medicine | First aid kit (5 uses), antibiotics (2 doses), flashlight, surgical tools |
| **Mechanic** | +1 Craft | Tool kit, duct tape, parts (5), crowbar, work gloves |
| **Scout** | +1 Stealth | Binoculars, rope (50ft), suppressed pistol (8 rounds), map |
| **Leader** | +1 Persuade | Radio (short range), map, flare gun (3 flares), notebook |
| **Hunter** | +1 Survival | Bow (12 arrows), hunting knife, 3 days food, camouflage clothing |
| **Criminal** | +1 Deceive | Lockpicks, pistol (6 rounds), 2 days food, fake ID |
| **Veterinarian** | +1 Animals | Medical kit (animal), leash/muzzle, 2 days food, sedatives (3 doses) |
| **Professor** | +1 Knowledge | Notebook, reference books, flashlight, reading glasses, pen |
| **Enforcer** | +1 Intimidate | Baseball bat, leather jacket, brass knuckles, cigarettes, switchblade |
| **Ranger** | +1 Survival | Rifle (10 rounds), compass, water filter, 3 days food, fire starter |

### Step 5: Derived Stats
- **Stress Slots** = NERVE + 3
- **Carrying Capacity** = GRIT + 4
- **Guts** = 3 (resets each session)
- **Wound Track** = Standard + GRIT bonus to Bruised slots

### Step 6: Bonds
Name **two other PCs** and your relationship:
- One you **Trust** — Once per session, reduce their Stress by 1 when you help them. Downtime activities together clear +1 Stress.
- One you're **Wary of** — If they betray or endanger the group, you saw it coming (+2 dice to your first reaction: noticing the betrayal, dodging their attack, escaping, or countering their action)

### Step 7: Details
- Name
- Appearance (3 distinctive features)
- One item of sentimental value (no mechanical benefit, but matters to you)
- Why do you keep going?

---

## ADVANCEMENT

No XP. Characters advance through **survival milestones**:

### Skill Advancement
- **Survive a session**: +1 skill point (max 4 in any skill)
- **Find a mentor/training opportunity**: Learn a new skill at rating 1
- **Downtime training**: 3 Train activities toward the same skill = +1 to that skill

### Attribute Advancement
- **Survive a major threat** (horde escape, hostile takeover, base defense): +1 to one attribute (max 5)
- **Lose someone close**: +1 NERVE or GRIT (trauma hardens you)

### Scars & Marks
- Every **Critical wound** survived leaves a scar — describe it
- Every **Broken wound** may leave lasting effects (GM discretion): limp, chronic pain, reduced range of motion
- Scars are proof you've lived. Wear them.

### Bonds Evolution
- If a Trusted PC dies or betrays you: Gain +1 NERVE, but you must choose a new bond (or carry the loss as a permanent -1 Stress slot from grief). Any unused once-per-session Trust benefit is lost.
- If you resolve tension with a Wary PC: Convert to Trust, or remove the bond entirely
- When forming new bonds (new PC joins, or replacing a lost bond): Takes effect at the start of the next session, not immediately

---

## RUNNING THE GAME

### Session Structure
1. **Recap** — What happened last time? Where are we?
2. **Objective** — What does the group need/want? (supplies, safety, rescue, escape)
3. **Journey** — Travel, encounters, resource management
4. **Crisis** — The main threat or challenge of the session
5. **Resolution** — Outcome, consequences, new situation
6. **Downtime** — If they reach safety, recovery and preparation

### Pacing Tension
- **Threat should fluctuate** — Let it rise and fall. Constant high threat is exhausting, not tense.
- **Resources should deplete** — Track ammo, food, medicine. Abundance kills tension.
- **Quiet moments matter** — Character scenes between danger build investment.
- **Infected aren't the only threat** — Humans, environment, disease, starvation.

### When PCs Die
- Make it matter. Deaths should have weight.
- Give the player a moment — last words, final action, meaningful end.
- The new character should arrive organically (survivor they rescue, person at next location, etc.)
- Consider: the dead PC's gear and bonds carry forward as story elements.

### Tone Calibration
Before the campaign, discuss with players:
- How dark? (hopeful survival vs. grim inevitability)
- Lines and veils (topics to avoid or fade-to-black)
- PvP? (if allowed, when and how)
- Character death frequency expectation

---

## DESIGNER NOTES

### Philosophy
- **Resources matter.** Every bullet, every bandage, every minute of noise is a decision.
- **Combat is dangerous.** Fighting should be a last resort or a calculated risk, not a default.
- **Tension over horror.** The infected are a pressure system, not jump scares.
- **Player agency in death.** Deaths should feel earned — bad decisions, bad luck, or heroic sacrifice. Guts exists to prevent pure bad-luck deaths.
- **Delayed consequences.** Wound penalties after combat lets fights be cinematic while still being dangerous.

### Inspirations to Capture
- The crafting loop and quiet tension of The Last of Us
- The sheer speed and panic of 28 Days Later
- The societal collapse and "humans are the real monsters" of both
- The resource anxiety of survival horror games

### Playtest Questions (v0.6 Addressed)
These questions have been analyzed and adjustments made:

- ✅ **Guts economy**: Increased to 3 starting, added objective earning triggers (critical success, ghost run)
- ✅ **Wound penalties**: Capped at -3, added adrenaline window (10 min) and Patch Up rule
- ✅ **Threat tracking**: Simplified decay to "per scene", added Threat Dice option, player tracking
- ✅ **Crafting**: Defined component types, failure only loses half components, added Scrounging
- ✅ **Fight length**: Math checks out (2-4 rounds), added Coup de Grace for finishing
- ✅ **Chases**: Extended to 7-position track, added Heat escalation mechanic
- ✅ **Environmental hazards**: Simplified to 3 stages, use "scenes" instead of specific hours
- ✅ **Stealth**: Simplified to 3 light levels, group stealth uses average, added Ghost Run reward
- ✅ **Flashbacks**: All cost 1 Guts now, simple auto-succeed, complex require roll
- ✅ **Vehicles**: Added shelter/stash rules, vehicular manslaughter, reduced maintenance burden

**New playtest questions for v1.1:**
- Does the +2 Guts earning cap feel restrictive, or does it properly control resource inflation?
- Does the "dangerous objective" requirement for Ghost Run (Ambient Threat 3+) feel fair?
- Does the Decisive Victory reward (+1 Guts for fast combat) encourage good tactics or create perverse incentives?
- Does Swarm damage at 1 box per 2 damage make Swarms appropriately threatening without being impossible?
- Does Surgery using NERVE + Medicine feel right thematically? Does it create more balanced medic characters?
- Does armor degrading at 4+ damage (instead of 5+) make armor maintenance too costly?
- Does initiative using NERVE + Notice create more diverse character builds? Does it feel right in play?
- Is the Common Items flashback list complete enough? Are players trying to abuse edge cases?
- Does the Chase Escalation guidance (Heat 7+) help GMs end stalemates naturally?
- Which Threat mode (Tactical vs Dread) does your group prefer?

---

*Version 1.0 — Major crafting/scavenging overhaul: search types with time/Threat, location depletion, targeted searches, loot tables by location, danger/reward scaling, 50+ recipes organized by category, component types in all recipes, upgrades system, crafting flaws table, skill variants*

*Version 1.0.1 — Clarifications pass: exploding dice don't chain, critical failures only on initial rolls, parry counterattack is free, Active Defense works with Delay, flashback failure outcomes, Last Stand timing, Bloated as exception to simplified infected tracks, Swarm damage is 1:1, consolidated Execute/Coup de Grace, Critical wound surgery procedure, Vehicle noise timing, Knowledge specialization is bonus die, Bond loss rules*

*Version 1.0.2 — Second clarifications pass: thrown weapons use Athletics (not Shoot), added Throwable property, split Slow into ranged/melee variants, clarified suppressor uses (found 15, crafted 10), Silent Takedown margin calculation, Guts Reroll vs Push distinction, weapon range notation, background skill bonus can exceed creation cap, Wary Bond reaction specifics, Splint requirement for Surgery, crafted vs found quality note, Fighting Retreat mechanics, Distract and Strike procedure, tourniquet time limit, Patch Up applies to Bleeding/Broken only, Medical Treatment 2+ hits does both heal and convert, Vehicle Stash is 10 total items, round duration (~6 seconds), Herbal Remedy wording, Lockpick degradation stages*

*Version 1.0.3 — Combat clarity pass: initiative ties (both act, both can be hit), Side-Based initiative balanced (enemies use skill too), Active Defense turn order (you keep Move/Free), Parry vs Active Defense guidance, Engaged is grapple-only state, damage calculation example, cover penalties clarified (attacker's roll), opposed roll win/lose defined (more hits wins, 0 always loses), Suppressing Fire damage explained (hits = damage), Fast attacks are separate rolls, Dual Wielding example, Shield only helps active defenses, outnumbered penalties apply to all rolls, head shot vs helmets, "end of scene" = ~10 rounds, Focus Fire specifics, Combined Attack partial hits, Athletics cross-attribute note*

*Version 1.0.4 — Consistency/simplification pass: clarified which maneuvers are opposed vs flat checks (Grapple/Escape = opposed; Disarm/Shove/Choke/Throw/Tackle = flat), merged Surrounded/Outnumbered (Surrounded = positioning, Outnumbered = penalties), merged Bottleneck/Holding a Position, fixed Prone wording (your penalties vs attacker bonuses), Riot Shield standardized to +1 die, armor degradation trigger clarified (incoming 5+), added Tool property definition, Called Shot -1 damage clarified (minimum 1), Train downtime now tracks 3 progress, ramming minimum 3 clarified, Guts damage reduction after armor, Breaking Point stress timing, weapon durability = 1/session without maintenance, simplified scarcity depletion (1 step per search)*

*Version 1.0.5 — Fixes: Quiet property corrected to -3 Threat (matches weapon table math), shield degradation trigger defined (5+ damage attacks), Active Defense wording clarified ("Action available" not "haven't acted"), infected takedown detection simplified ("roll 4 dice"), added Large Group (7-9 infected) guidance, removed confusing Disarm flavor text*

*Version 1.1.0 — Balance pass: Guts earning cap (+2 per session max), Ghost Run requires dangerous objective (Ambient Threat 3+), added Decisive Victory combat reward (+1 Guts for fast clean wins), Swarm damage changed to 1 box per 2 damage (round up) for more threatening hordes, Surgery now uses NERVE + Medicine (not WITS) to prevent Medicine skill dominance, armor/shield durability triggers lowered to 4+ damage (from 5+) for realistic wear, initiative changed to NERVE + Notice (from REFLEX) to reduce REFLEX attribute dominance, added explicit Common Items list for flashbacks to prevent abuse*
