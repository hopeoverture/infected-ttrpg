// Premade game scenarios with story structure
// Each scenario provides a framework while allowing player creativity

export interface ScenarioNPC {
  name: string;
  role: string;
  personality: string;
  secret?: string; // Hidden info the GM can reveal
  fate?: 'survives' | 'dies' | 'turns' | 'variable'; // Suggested arc
}

export interface StoryBeat {
  act: number;
  title: string;
  description: string;
  possibleEvents: string[];
  tension: 'low' | 'medium' | 'high' | 'extreme' | 'variable';
}

export interface ScenarioLocation {
  name: string;
  description: string;
  dangers: string[];
  resources: string[];
}

export interface GameScenario {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  difficulty: 'standard' | 'challenging' | 'brutal';
  timeframe: 'day-one' | 'early' | 'established' | 'late';
  themes: string[];
  startingLocation: ScenarioLocation;
  keyLocations: ScenarioLocation[];
  npcs: ScenarioNPC[];
  storyBeats: StoryBeat[];
  potentialTwists: string[];
  winConditions: string[];
  toneGuidance: string;
}

export const SCENARIOS: GameScenario[] = [
  // ===== DAY ONE SCENARIOS =====
  {
    id: 'day-one-classic',
    name: 'Day One',
    tagline: 'Wake up as the world ends',
    description: 'You wake to sirens and screaming. The TV shows chaos. Your phone buzzes with emergency alerts. The infection has reached your city, and everything you knew is about to change forever.',
    icon: '🌅',
    difficulty: 'standard',
    timeframe: 'day-one',
    themes: ['confusion', 'denial', 'first contact', 'escape'],
    startingLocation: {
      name: 'Your Apartment',
      description: 'A modest apartment in a residential neighborhood. Morning light streams through windows showing smoke rising in the distance.',
      dangers: ['Infected neighbor in hallway', 'Panicked crowds outside', 'Gridlocked traffic'],
      resources: ['Kitchen supplies', 'Basic first aid', 'Your personal belongings']
    },
    keyLocations: [
      {
        name: 'Main Street',
        description: 'The commercial heart of the neighborhood, now descending into chaos.',
        dangers: ['Spreading infection', 'Looters', 'Car accidents'],
        resources: ['Pharmacy', 'Hardware store', 'Abandoned vehicles']
      },
      {
        name: 'Community Center',
        description: 'An emergency shelter has been set up, but is it safe?',
        dangers: ['Overcrowding', 'Hidden infected', 'Failing security'],
        resources: ['Medical station', 'Food supplies', 'Information']
      },
      {
        name: 'Highway Overpass',
        description: 'A vantage point overlooking the city. The scale of destruction becomes clear.',
        dangers: ['Exposed position', 'Desperate survivors', 'Military checkpoints'],
        resources: ['Clear sightlines', 'Abandoned cars', 'Escape routes']
      }
    ],
    npcs: [
      {
        name: 'Mrs. Chen',
        role: 'Elderly neighbor',
        personality: 'Kind but frail. Has been watching the news all night.',
        secret: 'Her husband was bitten yesterday and is locked in their bedroom.',
        fate: 'variable'
      },
      {
        name: 'Marcus Webb',
        role: 'Off-duty paramedic',
        personality: 'Calm under pressure, takes charge naturally.',
        secret: 'Already lost his family. Has nothing left to lose.',
        fate: 'survives'
      },
      {
        name: 'Jenny & Tyler',
        role: 'Young siblings (12 and 8)',
        personality: 'Scared, looking for their parents who went to work.',
        secret: 'Their mother works at the hospital where the outbreak started.',
        fate: 'variable'
      }
    ],
    storyBeats: [
      {
        act: 1,
        title: 'The Awakening',
        description: 'Player realizes something is very wrong. Must escape their immediate surroundings.',
        possibleEvents: ['First infected encounter', 'Neighbor needs help', 'Building evacuation'],
        tension: 'medium'
      },
      {
        act: 2,
        title: 'Into the Streets',
        description: 'Navigating the chaos outside. Society is breaking down in real-time.',
        possibleEvents: ['Traffic jam horror', 'Helping or avoiding others', 'Finding supplies'],
        tension: 'high'
      },
      {
        act: 3,
        title: 'False Hope',
        description: 'Reaching what seems like safety, only to find new dangers.',
        possibleEvents: ['Shelter overrun', 'Military abandons post', 'Betrayal by survivors'],
        tension: 'extreme'
      },
      {
        act: 4,
        title: 'The Long Night',
        description: 'Finding or creating a defensible position to survive until dawn.',
        possibleEvents: ['Siege scenario', 'Difficult choices about who to save', 'First real victory'],
        tension: 'high'
      }
    ],
    potentialTwists: [
      'The military quarantine includes shooting survivors trying to leave',
      'Someone in the group was bitten but is hiding it',
      'The emergency broadcast gives wrong information',
      'A loved one contacts the player - they\'re trapped somewhere dangerous'
    ],
    winConditions: [
      'Survive the first 24 hours',
      'Establish a safe shelter',
      'Form a survival group'
    ],
    toneGuidance: 'Emphasize confusion and disorientation. No one knows what\'s happening. Rumors conflict. Authority figures are overwhelmed or absent. The horror comes from normalcy shattering.'
  },

  {
    id: 'hospital-outbreak',
    name: 'Patient Zero',
    tagline: 'Ground zero was the ER',
    description: 'You\'re at Mercy General Hospital when the first infected arrives. Within hours, the building becomes a deathtrap. Escape seems impossible with infected in the halls and military cordoning the exits.',
    icon: '🏥',
    difficulty: 'challenging',
    timeframe: 'day-one',
    themes: ['claustrophobia', 'medical horror', 'institutional failure', 'ethical dilemmas'],
    startingLocation: {
      name: 'Hospital Wing',
      description: 'A sterile corridor now splattered with blood. Alarms blare. Lights flicker.',
      dangers: ['Infected patients', 'Locked-down sections', 'Hazmat teams'],
      resources: ['Medical supplies', 'Gurneys for barricades', 'Staff keycards']
    },
    keyLocations: [
      {
        name: 'Emergency Room',
        description: 'Where it all started. A warzone of overturned beds and abandoned triage.',
        dangers: ['Heavy infected presence', 'Biohazard contamination', 'Dying patients'],
        resources: ['Trauma supplies', 'Ambulance bay access', 'Communications']
      },
      {
        name: 'Morgue (Basement)',
        description: 'The dead don\'t always stay dead. But it connects to maintenance tunnels.',
        dangers: ['Reanimated corpses', 'Complete darkness if power fails', 'Locked doors'],
        resources: ['Chemical supplies', 'Body bags (makeshift armor?)', 'Tunnel access']
      },
      {
        name: 'Rooftop Helipad',
        description: 'A helicopter sits abandoned. But reaching it means going up through infected floors.',
        dangers: ['Exposed approach', 'Limited fuel', 'Military attention'],
        resources: ['Potential escape', 'Radio equipment', 'Clear vantage point']
      },
      {
        name: 'Pharmacy',
        description: 'Locked behind security glass. Everyone wants what\'s inside.',
        dangers: ['Other desperate survivors', 'Alarms attracting infected', 'Addicts'],
        resources: ['Painkillers', 'Antibiotics', 'Adrenaline']
      }
    ],
    npcs: [
      {
        name: 'Dr. Amara Okonkwo',
        role: 'Infectious disease specialist',
        personality: 'Brilliant but paralyzed by guilt. She identified the pathogen but was ignored.',
        secret: 'Has notes that could be crucial for a cure - or prove the outbreak was preventable.',
        fate: 'variable'
      },
      {
        name: 'Security Chief Vance',
        role: 'Hospital security head',
        personality: 'Gruff, by-the-book. Following orders even when they stop making sense.',
        secret: 'His orders are to ensure no one leaves the building. He\'s supposed to die here.',
        fate: 'dies'
      },
      {
        name: 'Lily Chen',
        role: 'Pediatric patient (10 years old)',
        personality: 'Brave beyond her years. In for a routine procedure when chaos began.',
        secret: 'Her father is a news reporter who was covering "the mystery illness" downtown.',
        fate: 'survives'
      },
      {
        name: 'Father Miguel',
        role: 'Hospital chaplain',
        personality: 'Crisis of faith made manifest. Struggling to find meaning in the horror.',
        secret: 'Knows the morgue layout perfectly. Has keys to areas no one else can access.',
        fate: 'turns'
      }
    ],
    storyBeats: [
      {
        act: 1,
        title: 'Code Black',
        description: 'The hospital goes into lockdown. Player must understand the situation and find allies.',
        possibleEvents: ['First transformation witnessed', 'Finding other survivors', 'Barricading'],
        tension: 'high'
      },
      {
        act: 2,
        title: 'Hunting for Escape',
        description: 'Every exit is blocked or dangerous. Must explore for alternatives.',
        possibleEvents: ['Elevator shaft descent', 'Air duct crawling', 'Negotiating with hostile survivors'],
        tension: 'high'
      },
      {
        act: 3,
        title: 'The Morgue Passage',
        description: 'The only way out is through the basement. Where the first bodies were taken.',
        possibleEvents: ['Mass reanimation', 'Flooding/darkness', 'Finding terrible evidence'],
        tension: 'extreme'
      },
      {
        act: 4,
        title: 'Breakthrough',
        description: 'A chance at freedom - but at what cost?',
        possibleEvents: ['Military confrontation', 'Helicopter escape attempt', 'Choosing who gets out'],
        tension: 'extreme'
      }
    ],
    potentialTwists: [
      'The infection was already spreading before the "first" patient arrived',
      'Military plans to destroy the hospital to contain the outbreak',
      'Dr. Okonkwo\'s research suggests someone created this deliberately',
      'A survivor reveals they were bitten hours ago and feels fine (immune?)'
    ],
    winConditions: [
      'Escape the hospital',
      'Save Dr. Okonkwo and her research',
      'Get Lily to safety'
    ],
    toneGuidance: 'Claustrophobic horror. Every hallway could have infected. Medical environments become grotesque. Emphasize the betrayal of a place meant to heal becoming a place of death.'
  },

  {
    id: 'school-lockdown',
    name: 'Lockdown',
    tagline: 'Class is permanently dismissed',
    description: 'When the outbreak hits, your high school goes into emergency lockdown. But the infected are already inside. Students, teachers, and staff must band together or fall apart in this desperate siege.',
    icon: '🏫',
    difficulty: 'standard',
    timeframe: 'day-one',
    themes: ['coming of age', 'authority collapse', 'group dynamics', 'innocence lost'],
    startingLocation: {
      name: 'Classroom Wing',
      description: 'Rows of classrooms with heavy doors. An announcement just told everyone to shelter in place.',
      dangers: ['Infected students', 'Panicking crowds', 'Locked fire exits'],
      resources: ['Desks for barricades', 'Science lab supplies', 'Vending machines']
    },
    keyLocations: [
      {
        name: 'Gymnasium',
        description: 'Large open space where survivors are gathering. But can it be defended?',
        dangers: ['Too many entry points', 'Infected in locker rooms', 'Internal conflict'],
        resources: ['Sports equipment (weapons)', 'First aid station', 'Bleacher barricades']
      },
      {
        name: 'Cafeteria',
        description: 'Food and water supplies. Also where the lunch lady turned first.',
        dangers: ['Kitchen access points', 'Grease fires', 'Desperate hungry survivors'],
        resources: ['Food stores', 'Kitchen knives', 'Industrial equipment']
      },
      {
        name: 'Principal\'s Office',
        description: 'Communications hub with PA system and outside phone line.',
        dangers: ['Isolated location', 'Glass windows', 'Principal may be infected'],
        resources: ['Phone/radio', 'PA system', 'Building keys']
      },
      {
        name: 'Auto Shop',
        description: 'Separate building with tools, vehicles, and a garage door to outside.',
        dangers: ['Crossing open ground', 'Loud equipment attracts infected', 'Fuel is volatile'],
        resources: ['Tools (weapons)', 'Vehicles', 'Welding equipment']
      }
    ],
    npcs: [
      {
        name: 'Coach Davis',
        role: 'PE teacher and former Marine',
        personality: 'Takes charge immediately. Protective but makes hard calls.',
        secret: 'His own son is among the infected. He hasn\'t told anyone.',
        fate: 'survives'
      },
      {
        name: 'Ms. Rodriguez',
        role: 'Chemistry teacher',
        personality: 'Quiet intellectual now revealing unexpected resourcefulness.',
        secret: 'Knows how to make explosives and chemical weapons from lab supplies.',
        fate: 'variable'
      },
      {
        name: 'Jake Morrison',
        role: 'Star quarterback, class bully',
        personality: 'Arrogant but crumbling. His confidence was always a facade.',
        secret: 'His little sister is somewhere in the building and he\'ll do anything to find her.',
        fate: 'variable'
      },
      {
        name: 'Destiny Williams',
        role: 'Quiet sophomore, AV club president',
        personality: 'Overlooked genius. Knows the building\'s infrastructure better than anyone.',
        secret: 'Has been sneaking around the school for years. Knows every hidden passage.',
        fate: 'survives'
      }
    ],
    storyBeats: [
      {
        act: 1,
        title: 'Shelter in Place',
        description: 'Lockdown begins. Gathering survivors, assessing the situation.',
        possibleEvents: ['Infection in classroom', 'Students scattered', 'Authority figures absent'],
        tension: 'medium'
      },
      {
        act: 2,
        title: 'Society of Survivors',
        description: 'Groups form. Decisions must be made about leadership and strategy.',
        possibleEvents: ['Power struggles', 'Resource gathering missions', 'Communication attempts'],
        tension: 'medium'
      },
      {
        act: 3,
        title: 'The Breach',
        description: 'Defenses fail somewhere. The infected get in.',
        possibleEvents: ['Running battle through halls', 'Sacrifices', 'Last stands'],
        tension: 'extreme'
      },
      {
        act: 4,
        title: 'Escape or Fortress',
        description: 'Choose to flee into the unknown or make a final stand.',
        possibleEvents: ['Vehicle escape', 'Rooftop rescue', 'Successful fortification'],
        tension: 'high'
      }
    ],
    potentialTwists: [
      'The school was chosen as an emergency shelter - buses of infected are coming',
      'A group of students locks themselves in with supplies and won\'t share',
      'The "rescue" helicopter is actually military here to quarantine, not save',
      'Someone discovers this school was testing ground for the pathogen'
    ],
    winConditions: [
      'Escape the school grounds',
      'Establish the school as a viable shelter',
      'Save as many students as possible'
    ],
    toneGuidance: 'Familiar spaces made horrific. The social dynamics of high school persist even in apocalypse. Heroes emerge from unexpected places. The loss of young lives should hit hard.'
  },

  // ===== EARLY OUTBREAK (1-2 WEEKS) =====
  {
    id: 'supply-run',
    name: 'The Last Run',
    tagline: 'Your camp is starving',
    description: 'Two weeks in. Your survivor camp is running out of food. A small team must venture into the overrun city to find supplies. What should be a simple mission becomes a fight for survival.',
    icon: '🛒',
    difficulty: 'challenging',
    timeframe: 'early',
    themes: ['scarcity', 'trust', 'urban exploration', 'moral compromise'],
    startingLocation: {
      name: 'Outskirts Rally Point',
      description: 'A parking lot at the edge of the city. Your vehicle. Your supplies. Your last chance.',
      dangers: ['Open sightlines', 'Approaching horde', 'Vehicle breakdown'],
      resources: ['Vehicle', 'Basic weapons', 'Empty bags to fill']
    },
    keyLocations: [
      {
        name: 'Supermarket',
        description: 'Mostly looted but rumors say the back warehouse is untouched.',
        dangers: ['Other scavengers', 'Infected nest', 'Structural collapse'],
        resources: ['Canned goods', 'Water', 'Medicine aisle']
      },
      {
        name: 'Apartment Complex',
        description: 'Hundreds of units. Some still have supplies. Some still have residents.',
        dangers: ['Door-by-door horror', 'Trapped survivors', 'Hive-like infected behavior'],
        resources: ['Personal supplies', 'Weapons', 'Potentially useful survivors']
      },
      {
        name: 'Police Station',
        description: 'Abandoned but fortified. Whatever\'s inside could change everything.',
        dangers: ['Remaining officers (friendly?)', 'Armory traps', 'Holding cells'],
        resources: ['Weapons cache', 'Body armor', 'Communications equipment']
      },
      {
        name: 'The Bridge',
        description: 'Only way back to camp. But something has made it home.',
        dangers: ['Massive infected presence', 'Structural damage', 'Bottleneck'],
        resources: ['Abandoned vehicles', 'No choice - must cross']
      }
    ],
    npcs: [
      {
        name: 'Ricky "Wheels" Delgado',
        role: 'Driver, former delivery guy',
        personality: 'Optimistic despite everything. Treats runs like his old job.',
        secret: 'Has a morphine addiction from a crash injury. Running low.',
        fate: 'variable'
      },
      {
        name: 'Harper Quinn',
        role: 'Scout, ex-military',
        personality: 'Cold, efficient, doesn\'t attach. But watches over the group.',
        secret: 'Left her unit behind to die. Carries guilt that manifests as recklessness.',
        fate: 'dies'
      },
      {
        name: 'The Collector',
        role: 'Unknown survivor encountered in city',
        personality: 'Eerie calm. Has been "collecting" useful items and people.',
        secret: 'Has been feeding survivors to the infected to study them.',
        fate: 'variable'
      }
    ],
    storyBeats: [
      {
        act: 1,
        title: 'Into the Dead Zone',
        description: 'Entering the city. First contact with urban infected.',
        possibleEvents: ['Vehicle complications', 'Split decision on route', 'First major encounter'],
        tension: 'medium'
      },
      {
        act: 2,
        title: 'The Haul',
        description: 'Searching locations for supplies. Every noise could be death.',
        possibleEvents: ['Trapped survivor situation', 'Other scavengers', 'Jackpot find'],
        tension: 'high'
      },
      {
        act: 3,
        title: 'Complications',
        description: 'Something goes wrong. The plan falls apart.',
        possibleEvents: ['Vehicle destroyed', 'Team member lost', 'Overwhelming horde'],
        tension: 'extreme'
      },
      {
        act: 4,
        title: 'The Long Way Home',
        description: 'Must reach safety with whatever (and whoever) you have left.',
        possibleEvents: ['Bridge battle', 'Sacrifice for escape', 'Triumphant return or limping home'],
        tension: 'high'
      }
    ],
    potentialTwists: [
      'Your camp has been attacked while you were gone',
      'The supplies you find are contaminated with the infection',
      'Another group offers trade but wants something terrible in return',
      'Ricky is bitten early on but it\'s developing slowly - is he immune?'
    ],
    winConditions: [
      'Return with enough supplies to sustain the camp',
      'Bring back all team members alive',
      'Discover something game-changing (cure research, working radio, etc.)'
    ],
    toneGuidance: 'Heist-movie tension meets survival horror. Every decision matters. The city is a graveyard full of treasures guarded by the dead. Trust is earned through action.'
  },

  {
    id: 'convoy',
    name: 'The Convoy',
    tagline: 'Keep moving or die',
    description: 'Your group travels in a small convoy, staying ahead of the spreading infection. Each stop brings new dangers and difficult choices. Fuel is running low. Tensions are high. And the road ahead is uncertain.',
    icon: '🚐',
    difficulty: 'challenging',
    timeframe: 'early',
    themes: ['journey', 'leadership', 'resource management', 'community'],
    startingLocation: {
      name: 'Highway Rest Stop',
      description: 'A brief respite. Two vehicles, eight survivors, and too many miles to go.',
      dangers: ['Infected in restrooms', 'Other travelers', 'Exposed position'],
      resources: ['Vending machines', 'Map boards', 'Fuel (if station works)']
    },
    keyLocations: [
      {
        name: 'Roadblock',
        description: 'Military checkpoint, long abandoned. Vehicles and bodies everywhere.',
        dangers: ['Booby traps', 'Infected soldiers', 'Blocked path'],
        resources: ['Military supplies', 'Vehicles', 'Weapons']
      },
      {
        name: 'Small Town',
        description: 'Appears abandoned. Too quiet. The residents have a system.',
        dangers: ['Hostile survivors', 'Hidden infected', 'Traps for outsiders'],
        resources: ['Full stores', 'Fuel depot', 'Potential allies or enemies']
      },
      {
        name: 'The Farm',
        description: 'Isolated homestead with crops and livestock. A family held out here.',
        dangers: ['Family\'s paranoia', 'Barn full of infected', 'Hard to leave'],
        resources: ['Fresh food', 'Animals', 'Shelter']
      },
      {
        name: 'River Crossing',
        description: 'Bridge is out. Must find another way across with vehicles.',
        dangers: ['Ferry risk', 'Infected in water', 'Losing vehicles'],
        resources: ['Boats', 'Fishing supplies', 'Defensible islands']
      }
    ],
    npcs: [
      {
        name: 'Big Earl',
        role: 'Truck driver, unofficial leader',
        personality: 'Gruff but fair. Keeps everyone moving. Secretly terrified.',
        secret: 'His wife is bitten. He\'s keeping her sedated in the back of his truck.',
        fate: 'variable'
      },
      {
        name: 'Diana Reyes',
        role: 'Doctor, single mother',
        personality: 'Competent and caring. Her daughter Mia (6) is her world.',
        secret: 'Has enough sedatives to end things peacefully if it comes to that.',
        fate: 'survives'
      },
      {
        name: 'Andre & Kenji',
        role: 'Young couple, social media influencers',
        personality: 'Initially useless, constantly filming. Growing into survivors.',
        secret: 'Their footage could expose what really happened if they survive.',
        fate: 'variable'
      },
      {
        name: 'Old Walt',
        role: 'Vietnam veteran, survivalist',
        personality: 'Prepared for this his whole life. Knows things. Shares little.',
        secret: 'Knows of a bunker. Won\'t share location until he trusts the group.',
        fate: 'dies'
      }
    ],
    storyBeats: [
      {
        act: 1,
        title: 'On the Road',
        description: 'Establishing convoy dynamics. First major stop decision.',
        possibleEvents: ['Vehicle trouble', 'Group conflict', 'Fork in the road'],
        tension: 'low'
      },
      {
        act: 2,
        title: 'Strangers',
        description: 'Encountering other survivors. Friend or foe?',
        possibleEvents: ['Ambush', 'Trade opportunity', 'Plea for help'],
        tension: 'medium'
      },
      {
        act: 3,
        title: 'Breaking Point',
        description: 'Resources critical. Group threatens to splinter.',
        possibleEvents: ['Mutiny', 'Sacrifice', 'Desperate gamble'],
        tension: 'high'
      },
      {
        act: 4,
        title: 'Journey\'s End',
        description: 'Reaching a destination - or realizing the journey is the point.',
        possibleEvents: ['Safe haven found', 'Final stand', 'New beginning'],
        tension: 'variable'
      }
    ],
    potentialTwists: [
      'The "safe zone" on the radio is a trap set by raiders',
      'Earl\'s wife wakes up - but she\'s not infected, just sick with something else',
      'Old Walt\'s bunker exists but someone else found it first',
      'The infection is mutating - infected are getting smarter'
    ],
    winConditions: [
      'Find a permanent safe haven',
      'Keep the convoy together',
      'Reach the coast/mountains/border (pick one)'
    ],
    toneGuidance: 'Road movie meets zombie apocalypse. Each stop is a vignette. The real story is the relationships forged and broken. The destination matters less than who survives the journey.'
  },

  // ===== ESTABLISHED APOCALYPSE (1+ MONTHS) =====
  {
    id: 'week-in-camp',
    name: 'Safe Haven',
    tagline: 'Build something worth dying for',
    description: 'One month since Day One. Your community has established a camp in a defensible location. But safety is an illusion. Resources dwindle. Threats approach. Leadership is questioned. Can you hold what you\'ve built?',
    icon: '🏕️',
    difficulty: 'standard',
    timeframe: 'established',
    themes: ['community', 'politics', 'defense', 'hope vs despair'],
    startingLocation: {
      name: 'The Camp',
      description: 'A warehouse complex converted into a survivor settlement. 40+ people call it home.',
      dangers: ['Internal conflict', 'Resource depletion', 'Perimeter breaches'],
      resources: ['Established defenses', 'Community', 'Stored supplies (dwindling)']
    },
    keyLocations: [
      {
        name: 'The Wall',
        description: 'Makeshift fortifications surrounding the camp. Your first and last line of defense.',
        dangers: ['Weak points', 'Climbers', 'Mass assault'],
        resources: ['Guard posts', 'Alarm systems', 'Choke points']
      },
      {
        name: 'The Pit',
        description: 'Where infected bodies are burned. Also where justice is sometimes served.',
        dangers: ['Disease', 'Mental toll', 'What happens there at night'],
        resources: ['Fire', 'Grim necessity']
      },
      {
        name: 'The Radio Tower',
        description: 'Rigged communication equipment. Sometimes you hear other survivors. Sometimes worse.',
        dangers: ['Attracts attention', 'False hope', 'Could bring enemies'],
        resources: ['Communication', 'News/intelligence', 'Potential allies']
      },
      {
        name: 'The Greenhouse',
        description: 'An attempt at sustainability. Growing food takes time you might not have.',
        dangers: ['Contamination', 'Theft', 'Hope if it fails'],
        resources: ['Fresh food eventually', 'Seeds', 'Purpose']
      }
    ],
    npcs: [
      {
        name: 'Mayor Carla Vance',
        role: 'Elected leader',
        personality: 'Democratic idealist. Believes they can rebuild society properly.',
        secret: 'Her decisions led to 12 deaths last week. She\'s barely holding together.',
        fate: 'variable'
      },
      {
        name: 'Sergeant Bo Hendricks',
        role: 'Security chief',
        personality: 'Pragmatist who sees democracy as luxury. Might take over if given reason.',
        secret: 'Has been in contact with another settlement. They want to absorb the camp.',
        fate: 'variable'
      },
      {
        name: 'Rev. Isaiah',
        role: 'Spiritual leader',
        personality: 'The infection is divine punishment. Growing cult following.',
        secret: 'Has been letting infected in at night to "test the faithful."',
        fate: 'dies'
      },
      {
        name: 'Tomás Guerrero',
        role: 'Scavenger leader',
        personality: 'Charismatic, takes risks. His team brings back most supplies.',
        secret: 'Has been skimming supplies and trading with outsiders for personal gain.',
        fate: 'variable'
      }
    ],
    storyBeats: [
      {
        act: 1,
        title: 'Daily Life',
        description: 'Establishing routine, relationships, and underlying tensions.',
        possibleEvents: ['Work assignments', 'Council meeting', 'Minor breach'],
        tension: 'low'
      },
      {
        act: 2,
        title: 'Cracks Form',
        description: 'Internal problems threaten to tear the community apart.',
        possibleEvents: ['Theft discovered', 'Leadership challenge', 'Sickness outbreak'],
        tension: 'medium'
      },
      {
        act: 3,
        title: 'External Threat',
        description: 'Something from outside forces the community to unite or break.',
        possibleEvents: ['Horde approaches', 'Raiders attack', 'Another settlement contacts'],
        tension: 'high'
      },
      {
        act: 4,
        title: 'The Battle for Tomorrow',
        description: 'Fighting for the camp\'s future, whatever form that takes.',
        possibleEvents: ['Defense of camp', 'Civil war', 'Evacuation'],
        tension: 'extreme'
      }
    ],
    potentialTwists: [
      'The camp was built on a mass grave that\'s starting to stir',
      'A child is immune and others want to take them for "research"',
      'The military is coming - to rescue or exterminate, unclear which',
      'Someone has been murdering survivors and blaming the infected'
    ],
    winConditions: [
      'Successfully defend the camp from major threat',
      'Resolve leadership crisis',
      'Establish sustainable food/water supply'
    ],
    toneGuidance: 'The Walking Dead-style community drama. The infected are almost secondary to human conflict. Leadership is burden. Every decision has consequences. There are no good options, only less bad ones.'
  },

  {
    id: 'the-cure',
    name: 'The Cure',
    tagline: 'A rumor worth dying for',
    description: 'Word spreads of a scientist who cracked it. A cure. A vaccine. Something. The catch: they\'re holed up in the university across the city, surrounded by hordes. Is it worth risking everything on a rumor?',
    icon: '💉',
    difficulty: 'brutal',
    timeframe: 'established',
    themes: ['hope', 'sacrifice', 'science vs faith', 'the greater good'],
    startingLocation: {
      name: 'The Outskirts',
      description: 'Edge of the university district. The campus is visible through binoculars. So are the thousands of infected.',
      dangers: ['Massive horde', 'Other seekers', 'False hope'],
      resources: ['Observation point', 'Planning time', 'Choice to turn back']
    },
    keyLocations: [
      {
        name: 'University Gates',
        description: 'Barricaded entrance. Someone fortified it. Someone is still there.',
        dangers: ['Defensive traps', 'Trigger-happy guards', 'Horde attention'],
        resources: ['Potential entry', 'Signs of life', 'Communication attempt']
      },
      {
        name: 'The Quad',
        description: 'Open ground filled with wandering infected. Must cross.',
        dangers: ['No cover', 'Massive numbers', 'Being spotted'],
        resources: ['Distractions possible', 'Multiple paths', 'Drainage tunnels']
      },
      {
        name: 'Science Building',
        description: 'Where Dr. Chen works. If she\'s still alive. Fortified like a vault.',
        dangers: ['Failed experiments', 'Security systems', 'Infected test subjects'],
        resources: ['Laboratory', 'The cure (maybe)', 'Dr. Chen\'s research']
      },
      {
        name: 'Clock Tower',
        description: 'Highest point on campus. Perfect for signals. Or last stands.',
        dangers: ['Climb is exposed', 'Structure is weak', 'Draws all attention'],
        resources: ['Visibility', 'Bell (distraction)', 'Rope/pulley system']
      }
    ],
    npcs: [
      {
        name: 'Dr. Lin Chen',
        role: 'Virologist with answers',
        personality: 'Brilliant but broken. Months alone have taken their toll.',
        secret: 'The cure works. But it requires a fresh infected brain. Meaning a sacrifice.',
        fate: 'variable'
      },
      {
        name: 'Captain Rhodes',
        role: 'Military survivor',
        personality: 'Obsessed with the mission. Will let nothing stop extraction.',
        secret: 'His orders are to get the cure OR destroy all evidence of its existence.',
        fate: 'dies'
      },
      {
        name: 'Zoe',
        role: 'Feral child survivor',
        personality: 'Hasn\'t spoken in months. Survived alone. Knows the campus intimately.',
        secret: 'Immune to the infection. Doesn\'t know it.',
        fate: 'survives'
      }
    ],
    storyBeats: [
      {
        act: 1,
        title: 'The Approach',
        description: 'Planning the infiltration. Every strategy has flaws.',
        possibleEvents: ['Scouting missions', 'Contact attempts', 'Other teams spotted'],
        tension: 'medium'
      },
      {
        act: 2,
        title: 'Into the Horde',
        description: 'Crossing the infected-filled campus. Stealth or speed.',
        possibleEvents: ['Silent takedowns', 'Desperate sprints', 'Near-death experiences'],
        tension: 'extreme'
      },
      {
        act: 3,
        title: 'The Truth',
        description: 'Finding Dr. Chen. Learning what the cure actually requires.',
        possibleEvents: ['Ethical dilemma', 'Other factions arrive', 'Time pressure'],
        tension: 'high'
      },
      {
        act: 4,
        title: 'Extraction',
        description: 'Getting out with the cure - and the terrible knowledge of what it costs.',
        possibleEvents: ['Fighting retreat', 'Sacrifice play', 'Pyrrhic victory'],
        tension: 'extreme'
      }
    ],
    potentialTwists: [
      'The cure works but has horrific side effects',
      'Dr. Chen is infected but stable - she experimented on herself',
      'The military will use the cure as a weapon, not salvation',
      'Zoe is the key - her immunity could create a better cure, but it would take years'
    ],
    winConditions: [
      'Secure the cure or research',
      'Get Dr. Chen to safety',
      'Survive the extraction'
    ],
    toneGuidance: 'Mission impossible meets moral philosophy. The cure exists but at what cost? Every step closer increases danger and moral complexity. Is saving humanity worth losing your own?'
  },

  {
    id: 'sanctuary',
    name: 'Sanctuary',
    tagline: 'Paradise has a price',
    description: 'You\'ve found it. A walled community with food, water, medicine, and safety. They welcome you with open arms. But something isn\'t right. The smiles are too wide. The rules are too strict. What is Sanctuary hiding?',
    icon: '🏛️',
    difficulty: 'challenging',
    timeframe: 'established',
    themes: ['utopia/dystopia', 'freedom vs security', 'conformity', 'cult dynamics'],
    startingLocation: {
      name: 'The Gates of Sanctuary',
      description: 'Massive reinforced walls. Gardens visible beyond. Armed guards with smiles.',
      dangers: ['Surveillance', 'Indoctrination', 'No easy exit'],
      resources: ['Safety', 'Food', 'Medical care']
    },
    keyLocations: [
      {
        name: 'The Welcome Center',
        description: 'Where newcomers are processed. Given new clothes. Assigned housing. Briefed on rules.',
        dangers: ['Monitoring', 'Separation from group', 'Confiscation of weapons'],
        resources: ['Information', 'Supplies', 'Contact with other newcomers']
      },
      {
        name: 'The Founder\'s House',
        description: 'Where Shepherd lives. Off-limits to most. What happens inside?',
        dangers: ['Heavy security', 'True believers', 'The Shepherd himself'],
        resources: ['Answers', 'Potential escape route', 'Evidence']
      },
      {
        name: 'The North Field',
        description: 'Agricultural area. Also where "the Departed" are taken.',
        dangers: ['What\'s buried there', 'Guard patrols', 'True purpose'],
        resources: ['Food stores', 'Tools', 'Disturbing evidence']
      },
      {
        name: 'The Old Church',
        description: 'Where "therapy" happens. Survivors speak of it in whispers.',
        dangers: ['Psychological horror', 'Reconditioning', 'Witnessing too much'],
        resources: ['Understanding Sanctuary\'s methods', 'Potential allies among staff']
      }
    ],
    npcs: [
      {
        name: 'The Shepherd (David)',
        role: 'Sanctuary\'s founder and leader',
        personality: 'Charismatic, paternal, absolutely certain of his righteousness.',
        secret: 'Uses infected as "punishment" for rule-breakers. Has one locked in the basement.',
        fate: 'variable'
      },
      {
        name: 'Sister Ruth',
        role: 'The Shepherd\'s second-in-command',
        personality: 'True believer. Enforces rules with gentle firmness and ruthless efficiency.',
        secret: 'Was David\'s first victim/follower. Stockholm syndrome fully set.',
        fate: 'turns'
      },
      {
        name: 'Marcus Cole',
        role: 'Longtime resident, secret skeptic',
        personality: 'Appears devout. Has been planning escape for months.',
        secret: 'His daughter tried to leave. He doesn\'t know what happened to her.',
        fate: 'survives'
      },
      {
        name: 'Dr. Emilia Worth',
        role: 'Sanctuary\'s doctor',
        personality: 'Provides excellent care. Seems uncomfortable with some practices.',
        secret: 'Knows the full truth. Stays because she\'s saving lives. Compromised.',
        fate: 'variable'
      }
    ],
    storyBeats: [
      {
        act: 1,
        title: 'Welcome to Paradise',
        description: 'Arrival and integration. Everything seems perfect. Too perfect.',
        possibleEvents: ['Orientation', 'Subtle wrong notes', 'Meeting residents'],
        tension: 'low'
      },
      {
        act: 2,
        title: 'Cracks in the Facade',
        description: 'Noticing inconsistencies. Finding fellow skeptics.',
        possibleEvents: ['Witnessing punishment', 'Finding evidence', 'Being watched'],
        tension: 'medium'
      },
      {
        act: 3,
        title: 'The Revelation',
        description: 'Discovering the true horror of Sanctuary\'s methods.',
        possibleEvents: ['The North Field secret', 'The church basement', 'The Shepherd\'s confession'],
        tension: 'high'
      },
      {
        act: 4,
        title: 'Revolution or Escape',
        description: 'Choosing to fight from within or flee into the dangerous outside.',
        possibleEvents: ['Uprising', 'Stealth escape', 'Confronting the Shepherd'],
        tension: 'extreme'
      }
    ],
    potentialTwists: [
      'The Shepherd was right about one thing - someone in your group is infected',
      'Sanctuary has made contact with military who support their methods',
      'Escape reveals the outside is worse - temptation to return',
      'The Shepherd is dying and succession crisis threatens to destroy everything'
    ],
    winConditions: [
      'Escape Sanctuary with evidence of their crimes',
      'Liberate Sanctuary from the Shepherd\'s control',
      'Expose the truth to all residents'
    ],
    toneGuidance: 'Psychological horror over physical. The community is welcoming until it isn\'t. Rules seem reasonable until you see them enforced. The question isn\'t if something is wrong, but how deep it goes.'
  },

  // ===== LATE APOCALYPSE (6+ MONTHS) =====
  {
    id: 'winter-is-coming',
    name: 'Dead Winter',
    tagline: 'The cold kills as surely as the infected',
    description: 'Six months in. Winter approaches. Your group has survived the infected, but nature itself may finish what the dead started. Find shelter, stockpile supplies, and pray for spring.',
    icon: '❄️',
    difficulty: 'brutal',
    timeframe: 'late',
    themes: ['nature as enemy', 'preparation', 'isolation', 'endurance'],
    startingLocation: {
      name: 'The Failing Camp',
      description: 'Summer shelter that won\'t survive winter. Temperature is dropping.',
      dangers: ['Exposure', 'Dwindling supplies', 'Group morale'],
      resources: ['What you\'ve gathered', 'Knowledge of area', 'Time (limited)']
    },
    keyLocations: [
      {
        name: 'The Lodge',
        description: 'Mountain retreat. Defensible, with fireplace. But occupied.',
        dangers: ['Current occupants', 'Remote location', 'Avalanche risk'],
        resources: ['Sturdy shelter', 'Heating', 'Hunting grounds']
      },
      {
        name: 'The Town Below',
        description: 'Small ski town. Supplies but also infected - do they freeze?',
        dangers: ['Frozen infected (dormant until warmth)', 'Other scavengers', 'Treacherous roads'],
        resources: ['Winter gear', 'Food stores', 'Vehicles with chains']
      },
      {
        name: 'The Dam',
        description: 'Hydroelectric facility. Power and shelter, if it still works.',
        dangers: ['Structural concerns', 'Former workers (infected?)', 'Isolation'],
        resources: ['Electricity', 'Industrial shelter', 'Defensible position']
      },
      {
        name: 'The Hot Springs',
        description: 'Natural thermal area. Warmth without fire. Too good to be true?',
        dangers: ['Volcanic instability', 'Attracts others', 'False security'],
        resources: ['Warmth', 'Water', 'Morale boost']
      }
    ],
    npcs: [
      {
        name: 'Old Man Winter (Erik)',
        role: 'Survivalist hermit',
        personality: 'Paranoid but skilled. Has survived alone. Might help.',
        secret: 'Has a bunker stocked for years. Entrance is trapped and hidden.',
        fate: 'variable'
      },
      {
        name: 'The Frost Family',
        role: 'Family group holding the lodge',
        personality: 'Protective of their claim. Not evil, just scared.',
        secret: 'Their patriarch is dying. They\'ll need help soon.',
        fate: 'variable'
      },
      {
        name: 'Snowplow Mike',
        role: 'Former city worker',
        personality: 'Knows roads, infrastructure. Keeps his plow running.',
        secret: 'Uses the plow to clear paths for "clients." Charges high prices.',
        fate: 'survives'
      }
    ],
    storyBeats: [
      {
        act: 1,
        title: 'First Frost',
        description: 'Temperature drops. Current situation becomes untenable.',
        possibleEvents: ['Supply inventory', 'Scouting for shelter', 'First cold death'],
        tension: 'medium'
      },
      {
        act: 2,
        title: 'The Migration',
        description: 'Moving to winter shelter. Dangers of travel in cold.',
        possibleEvents: ['Blizzard', 'Frozen infected awakening', 'Vehicle failure'],
        tension: 'high'
      },
      {
        act: 3,
        title: 'Deep Freeze',
        description: 'Worst of winter. Trapped by weather. Cabin fever.',
        possibleEvents: ['Food rationing', 'Mental breakdowns', 'Desperate hunts'],
        tension: 'high'
      },
      {
        act: 4,
        title: 'The Thaw',
        description: 'Spring approaches. But so do the dormant infected.',
        possibleEvents: ['Mass awakening', 'Final supply crisis', 'Hope of renewal'],
        tension: 'extreme'
      }
    ],
    potentialTwists: [
      'The infected don\'t freeze - they migrate south and are returning',
      'The dam breaks, flooding the valley and destroying shelter options',
      'Old Man Winter\'s bunker is a trap - he\'s been luring survivors for supplies',
      'Spring reveals a changed world - the infection has evolved over winter'
    ],
    winConditions: [
      'Survive the entire winter',
      'Establish sustainable winter shelter',
      'Maintain group cohesion through isolation'
    ],
    toneGuidance: 'The Shining meets The Road. Nature is the primary antagonist. Cold is ever-present. Resources are everything. The infected become almost secondary to survival itself. Isolation breeds madness.'
  },

  {
    id: 'new-world',
    name: 'New World',
    tagline: 'What do we build from the ashes?',
    description: 'One year since Day One. The initial chaos has settled into a new normal. Pockets of civilization are emerging. Your community must decide what kind of world to build - and what to do about those building something different.',
    icon: '🌱',
    difficulty: 'standard',
    timeframe: 'late',
    themes: ['rebuilding', 'civilization', 'ideology', 'legacy'],
    startingLocation: {
      name: 'New Hope Settlement',
      description: 'A functioning small town. Walls, farms, 200 survivors. Democracy, barely.',
      dangers: ['External threats', 'Internal politics', 'Ideological conflict'],
      resources: ['Established infrastructure', 'Community', 'Hope']
    },
    keyLocations: [
      {
        name: 'The Council Hall',
        description: 'Where decisions are made. Every voice theoretically equal.',
        dangers: ['Political manipulation', 'Paralysis by debate', 'Coups'],
        resources: ['Governance', 'Records', 'Communication center']
      },
      {
        name: 'The Neutral Zone',
        description: 'Trading post between settlements. Uneasy peace.',
        dangers: ['Spies', 'Provocateurs', 'Trade disputes turning violent'],
        resources: ['Rare supplies', 'Information', 'Diplomatic channels']
      },
      {
        name: 'Fort Ironside',
        description: 'Militaristic neighboring settlement. Order through strength.',
        dangers: ['Expansionist ideology', 'Superior firepower', 'Absorbs or destroys'],
        resources: ['Military technology', 'Trained fighters', 'Uncomfortable ally?']
      },
      {
        name: 'The Free People',
        description: 'Nomadic group rejecting settlement. Trading and raiding.',
        dangers: ['Unpredictable', 'Information sellers', 'Potential raiders'],
        resources: ['Outside perspective', 'Scavenged goods', 'Mobility']
      }
    ],
    npcs: [
      {
        name: 'Councilor Maya Stone',
        role: 'Idealist leader',
        personality: 'Believes in democracy, rights, rebuilding properly.',
        secret: 'Her compromises have cost lives. Starting to doubt her principles.',
        fate: 'variable'
      },
      {
        name: 'General Drake',
        role: 'Fort Ironside commander',
        personality: 'Order above all. Sees New Hope as weak. Plans annexation.',
        secret: 'Genuinely believes he\'s saving people. Not a monster, just wrong.',
        fate: 'variable'
      },
      {
        name: 'Whisper',
        role: 'Free People information broker',
        personality: 'Knows everything. Sells to everyone. Loyal to no one.',
        secret: 'Building a network to unite settlements through information, not force.',
        fate: 'survives'
      },
      {
        name: 'Dr. Anna Kowalski',
        role: 'Scientist working on cure',
        personality: 'Hopeful that science can end this. Needs resources.',
        secret: 'Close to breakthrough but it requires collaboration with Ironside\'s resources.',
        fate: 'variable'
      }
    ],
    storyBeats: [
      {
        act: 1,
        title: 'The Status Quo',
        description: 'Understanding the political landscape. Building relationships.',
        possibleEvents: ['Council participation', 'Trade mission', 'Border incident'],
        tension: 'low'
      },
      {
        act: 2,
        title: 'Rising Tensions',
        description: 'Conflict between settlements escalates.',
        possibleEvents: ['Diplomatic mission', 'Proxy conflicts', 'Refugees arriving'],
        tension: 'medium'
      },
      {
        act: 3,
        title: 'Crisis Point',
        description: 'War seems inevitable. Unless something changes.',
        possibleEvents: ['Assassination attempt', 'United against common threat', 'Betrayal'],
        tension: 'high'
      },
      {
        act: 4,
        title: 'The New Order',
        description: 'Shaping what the future looks like.',
        possibleEvents: ['Peace conference', 'Final battle', 'Revolutionary change'],
        tension: 'variable'
      }
    ],
    potentialTwists: [
      'The Free People discover a massive horde heading toward all settlements',
      'Dr. Kowalski\'s cure works but Ironside wants to weaponize it',
      'Councilor Stone is Drake\'s sister - family reunion complicates everything',
      'A pre-outbreak government official arrives claiming authority'
    ],
    winConditions: [
      'Maintain New Hope\'s independence and values',
      'Achieve lasting peace between settlements',
      'Secure resources for long-term survival'
    ],
    toneGuidance: 'Political drama in apocalypse clothing. The infected are managed threats. The real story is human civilization reforming. What mistakes will be repeated? What new world is worth building?'
  }
];

// Helper to get scenario by ID
export function getScenario(id: string): GameScenario | undefined {
  return SCENARIOS.find(s => s.id === id);
}

// Group scenarios by timeframe for UI
export function getScenariosByTimeframe() {
  return {
    'day-one': SCENARIOS.filter(s => s.timeframe === 'day-one'),
    'early': SCENARIOS.filter(s => s.timeframe === 'early'),
    'established': SCENARIOS.filter(s => s.timeframe === 'established'),
    'late': SCENARIOS.filter(s => s.timeframe === 'late')
  };
}

// Get difficulty badge styling
export function getDifficultyStyle(difficulty: GameScenario['difficulty']) {
  switch (difficulty) {
    case 'standard': return { label: 'Standard', color: 'text-green-400', bg: 'bg-green-400/10' };
    case 'challenging': return { label: 'Challenging', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    case 'brutal': return { label: 'Brutal', color: 'text-red-400', bg: 'bg-red-400/10' };
  }
}
