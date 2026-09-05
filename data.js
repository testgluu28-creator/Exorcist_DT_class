/* ===================================================================
 * Exorcist talent page — data
 * ===================================================================
 *
 * Everything hardcoded about the class lives here, so the page itself
 * (index.html) holds only behaviour. Edit this file, reload, done.
 *
 * It is a .js file rather than .json for two practical reasons: a JSON
 * file would have to be fetched, which browsers refuse for pages opened
 * straight off disk (file://), and JSON does not allow comments. What
 * follows is a plain object literal — JSON with comments and without the
 * quotes around keys.
 *
 * Two things are NOT here, because they are colours rather than data:
 *   - region colours   — the CSS variables --combat / --support / --hybrid
 *   - status colours   — the CSS rules .nd.st-wip, .nd.st-finished, ...
 * Adding a region or a status means adding its colour to the <style> block
 * in index.html too. Everything else below takes effect on reload alone.
 * =================================================================== */
window.EXORCIST_DATA = {

  /* ---- canvas the tree is drawn on ---- */
  layout: {
    canvasWidth: 1380,       // grow these if the tree outgrows the sheet
    canvasHeight: 1920,
    sidePadding: 60,         // node x coordinates are drawn at x + sidePadding
    zoomMin: 0.5,            // how far the tree pane may be zoomed out (50%)
    zoomMax: 3               // ...and in (300%)
  },

  /* ---- build rules ---- */
  rules: {
    maxPoints: 30,
    /* Tags that grant incantation slot points, and how many each is worth. */
    slotPointTags: { 'inc-n_slot_1point': 1, 'inc-n_slot_2points': 2 }
  },

  /* ---- the three vertical bands ----
     `id` is what a node stores in its `region` field and is also the CSS
     variable / class name, so renaming one means touching the CSS too. */
  regions: [
    { id: 'combat',  label: 'Combat',    bandFrom: 0,   bandTo: 510,  bandLabel: 'Left \u00b7 Combat' },
    { id: 'support', label: 'Support',   bandFrom: 510, bandTo: 880,  bandLabel: 'Centre \u00b7 Support' },
    { id: 'hybrid',  label: 'Hybrid/CC', bandFrom: 880, bandTo: 1380, bandLabel: 'Right \u00b7 Hybrid/CC' }
  ],

  /* ---- kinds of node ----
     shape:  'square' or 'circle'
     radius: half the node's size in px
     glyph:  letter drawn inside it, or omitted for none */
  nodeTypes: [
    { id: 'root',      shape: 'square', radius: 20, glyph: 'S'  },
    { id: 'keystone',  shape: 'square', radius: 19, glyph: 'K'  },
    { id: 'keymod',    shape: 'circle', radius: 12 },
    { id: 'ability',   shape: 'square', radius: 17, glyph: 'CA' },
    { id: 'abilmod',   shape: 'circle', radius: 12 },
    { id: 'blitz',     shape: 'square', radius: 16, glyph: 'B'  },
    { id: 'blitzmod',  shape: 'circle', radius: 12 },
    { id: 'aura',      shape: 'square', radius: 16, glyph: 'A'  },
    { id: 'stat',      shape: 'circle', radius: 11, glyph: 'X'  },
    { id: 'default',   shape: 'circle', radius: 13 }
  ],

  /* ---- design status of a node, shown in the editor only ----
     The empty id must stay: it means "nothing to say". */
  statuses: [
    { id: '',            label: '\u2014 none \u2014' },
    { id: 'wip',         label: 'Work in progress' },
    { id: 'almost_done', label: 'Almost done' },
    { id: 'finished',    label: 'Finished' }
  ],

  /* ---- tags, grouped by what they do ----
     The groups drive the filter menus, the tag picker and the two
     composition panes. A tag typed by hand that is not listed here still
     works — it is treated as part of Misc. */
  tagGroups: [
  { group: 'Damage', tags: [
    'rending+', 'cleave+', 'range_damage+', 'give_brittle', 'melee_damage+', 'DoT_damage+',
    'DoT_stacks+', 'damage_vs_daemon+', 'attack_speed+', 'weakspot_damage+', 'vulner_debuff',
    'crit_damage+', 'range_crit_chance+', 'melee_crit_chance+'
  ] },
  { group: 'CC', tags: [
    'CC_duration+', 'mtrgt_CC', 'AoE_CC', 'stagger+'
  ] },
  { group: 'Survivability', tags: [
    'mobility+', 'tough_dmgr+', 'dmgr+', 'toughness+', 'suppression+', 'gain_toughness'
  ] },
  { group: 'Class Mechanics', tags: [
    'soulfire_economy', 'soulfire_on_CC', 'soulfire_on_kill', 'inc-n_slot_1point',
    'incantation_power+', 'inc-n_slot_2points'
  ] },
  { group: 'Support', tags: [
    'aura_radius+', 'team_damage_absorb', 'selfless', 'support', 'utility'
  ] },
  { group: 'Misc', tags: [
    'ability_charges+', 'ability_cooldown+', 'ability_cooldown-'
  ] }
  ],

  /* ---- tag housekeeping ----
     Rename a tag by adding old -> new here rather than editing the tag in
     tagGroups alone: every tree file and stored copy is migrated on load,
     so nothing has to be fixed up by hand. Same for retiring one. */
  tagRenames: {
  'crit_chance+': 'melee_crit_chance+',
  'damage_absorb': 'team_damage_absorb',
  'do_CC': 'mtrgt_CC',
  'incantation_slot_point': 'inc-n_slot_1point',
  'ranged_damage+': 'range_damage+',
  'toughness_on_CC': 'gain_toughness',
  'vulnerability_debuff': 'vulner_debuff'
},
  tagRetired: ['combat_keystone', 'hybrid_keystone', 'peril_safety', 'start', 'support_keystone'],

  /* ---- incantation slots ----
     unlockAt is how many slot points the build needs before the slot counts
     as unlocked (slot points come from rules.slotPointTags above). */
  incantationSlots: [
    { level: 1, label: 'Lv I',   unlockAt: 0 },
    { level: 2, label: 'Lv II',  unlockAt: 2 },
    { level: 3, label: 'Lv III', unlockAt: 4 }
  ],

  /* ---- incantations ----
     id     must be unique and never change: it is what a saved build stores
     side   'support' or 'combat' — which half of the dropdown it sits in
     level  the lowest slot that offers it; it also appears in higher ones */
  incantations: [
  {id:'sup_tough_up', side:'support', level:1, name:'Tough_up',
   desc:'Up to 33% toughness restored (single target).'},
  {id:'sup_corr_down', side:'support', level:1, name:'Corr_down',
   desc:"Up to 33% of a wound's worth of corruption removed (single target). Cannot remove corruption from a fully corrupted wound."},
  {id:'sup_dot_minus_temp', side:'support', level:1, name:'DoT_minus_temp',
   desc:'5s of invulnerability from any kind of DoT (single target).'},
  {id:'sup_dot_minus_temp_grp', side:'support', level:2, name:'DoT_minus_temp_grp',
   desc:'3s of invulnerability from any kind of DoT, for everyone in a small radius.'},
  {id:'sup_tough_up_grp', side:'support', level:2, name:'Tough_up_grp',
   desc:'25% toughness restored for everyone in a small radius.'},
  {id:'sup_corr_down_grp', side:'support', level:2, name:'Corr_down_grp',
   desc:"25% of a wound's worth of corruption removed for everyone in a small radius. Cannot remove corruption from a fully corrupted wound."},
  {id:'sup_tough_up_grp_plus', side:'support', level:3, name:'Tough_up_grp+',
   desc:'25% toughness restored, larger radius.'},
  {id:'sup_corr_down_grp_plus', side:'support', level:3, name:'Corr_down_grp+',
   desc:"25% of a wound's worth of corruption removed, larger radius."},
  {id:'sup_death_minus_temp', side:'support', level:3, name:'Death_minus_temp',
   desc:"Gives an ally a temporary, single-use Until Death talent (the same as the Zealot talent of that name) for 10s. Should be gated behind a rather limited resource, as it is a powerful tool. If they do not use it you are refunded 50% of the resources spent. Used on a Zealot who already has the talent it resets their cooldown; if the talent is off cooldown it cannot be applied to them and no SFs are spent. Costs A LOT of SFs."},
  {id:'cmb_mind_wipe', side:'combat', level:1, name:'Mind wipe',
   desc:'Stops one non-boss enemy in place for 3s and leaves it unable to attack. The effect ends immediately if a player damages it directly (DoTs do not count as direct damage, damage-dealing AoEs do). Used on bosses it counts as a 0 HP damage, medium-strength stagger attack. Increases Peril, costs a fair amount of SFs.'},
  {id:'cmb_blinding_flash', side:'combat', level:1, name:'Blinding Flash',
   desc:"Medium stagger to every regular mob targeting you within a short radius, similar to the Arbite's shield. Increases Peril, costs a fair amount of SFs."},
  {id:'cmb_suffocate', side:'combat', level:2, name:'Suffocate',
   desc:'Like BB in needing direct line of sight, but with no charge-up and no channeling lock. Works only on human-sized, non-boss foes and takes some time to complete. Once applied the target loses HP at a constant rate, immobilised and unable to attack, and you are free to do anything else except cast another incantation — doing so cancels Suffocate and frees the victim with whatever HP it has left. A mix of BB and a limited version of the Arbitrator\u2019s Dog Pounce. Increases Peril, costs a fair amount of SFs.'},
  {id:'cmb_sanctic_conduit', side:'combat', level:3, name:'Sanctic Conduit',
   desc:'Channels divine energies through every ally in coherency at once, in cones aligned with the direction each of them faces, causing medium stagger and applying SB stacks. Increases Peril, costs a medium amount of SFs.'}
],

  /* ---- weapons ----
     slot must match one of weaponSlots below. An empty desc shows as
     "No description yet." in the tooltip. */
  weaponSlots: [
    { id: 'primary',   label: 'Primary weapon' },
    { id: 'secondary', label: 'Secondary weapon' }
  ],
  weapons: [
  {id:'wpn_force_sword', slot:'primary', name:'Force sword',
   desc:"Psyker's Force Sword."},
  {id:'wpn_force_greatsword', slot:'primary', name:'Force greatsword',
   desc:"Psyker's Force greatsword."},
  {id:'wpn_combat_blade', slot:'primary', name:'Combat Blade', desc:''},
  {id:'wpn_dueling_sword', slot:'primary', name:'Dueling Sword', desc:''},
  {id:'wpn_force_lance', slot:'primary', name:'Force Lance/Halberd',
   desc:'Identity: a quick, hassle-free short distance gap closer. An assassin weapon with above average single target damage. Takes skill to use efficiently and is not good at horde clearing; intended for aggressive, combat-oriented builds.'},
  {id:'wpn_force_battle_hammer', slot:'primary', name:'Force Battle Hammer',
   desc:'Identity: a slower, clunkier but safer personal defence weapon for more support-minded players, with decent damage (including anti-armour damage) and a fair amount of stagger.'},
  {id:'wpn_voidblast_staff', slot:'secondary', name:'Voidblast staff',
   desc:"Psyker's Voidblast staff."},
  {id:'wpn_voidstrike_staff', slot:'secondary', name:'Voidstrike staff',
   desc:"Psyker's Voidstrike staff."},
  {id:'wpn_heavy_laspistol', slot:'secondary', name:'Heavy laspistol', desc:''},
  {id:'wpn_recon_lasgun', slot:'secondary', name:'Recon lasgun', desc:''},
  {id:'wpn_telekine_shield_staff', slot:'secondary', name:'Telekine Shield Staff',
   desc:'A utility-focused staff.'},
  {id:'wpn_demonbane_staff', slot:'secondary', name:'Demonbane Staff',
   desc:'An AoE CC and burst AoE damage staff.'}
],

  /* ---- the built-in tree ----
     Used the first time a browser opens the page, and by "Reset to the
     built-in tree". To adopt a layout you exported, drop the `data.tree`
     object from that export in here (its nodes and edges arrays). */
  defaultTree: {
    nodes: [
    {"id": 0, "x": 690, "y": 70, "type": "root", "region": "support", "name": "Exorcist", "tags": [], "desc": "Ecclesiarchy exorcist seconded to Grendyl's retinue. 200 HP / 85 Toughness / 5% crit."},
    {"id": 1, "x": 340, "y": 178, "type": "default", "region": "combat", "name": "Rite of Wrath", "tags": ["melee_damage+"], "desc": "+5% Melee Damage."},
    {"id": 2, "x": 690, "y": 178, "type": "default", "region": "support", "name": "Attentive Ministry", "tags": ["support"], "desc": "Allies in coherency gain +5% Toughness from all replenishment sources."},
    {"id": 3, "x": 1040, "y": 178, "type": "default", "region": "hybrid", "name": "Braced Litany", "tags": ["toughness+"], "desc": "+15 Toughness."},
    {"id": 4, "x": 230, "y": 286, "type": "default", "region": "combat", "name": "Kindled Ire", "tags": ["DoT_damage+"], "desc": "Soulblaze you apply deals +15% damage."},
    {"id": 5, "x": 450, "y": 286, "type": "default", "region": "combat", "name": "Keen Sight", "tags": ["melee_crit_chance+"], "desc": "+3% Critical Hit Chance."},
    {"id": 6, "x": 580, "y": 286, "type": "default", "region": "support", "name": "Warding Hand", "tags": ["support"], "desc": "+20% revive and assist speed (stacks with base)."},
    {"id": 7, "x": 800, "y": 286, "type": "default", "region": "support", "name": "Soul Thrift", "tags": ["soulfire_economy"], "desc": "-10% Soulfire cost on all Incantations."},
    {"id": 8, "x": 1040, "y": 286, "type": "default", "region": "hybrid", "name": "Staggering Word", "tags": ["stagger+"], "desc": "+15% Impact with all weapons."},
    {"id": 9, "x": 1260, "y": 286, "type": "default", "region": "hybrid", "name": "Wary Step", "tags": ["mobility+"], "desc": "+5% Movement Speed."},
    {"id": 10, "x": 340, "y": 394, "type": "blitz", "region": "combat", "name": "Dominate", "tags": ["mtrgt_CC"], "desc": "Pulls nearby mobs into an AoE and freezes them for 5s, forming an obstacle. Nearby mobs are slowed. Direct damage frees a target. Costs 1 SE."},
    {"id": 11, "x": 690, "y": 394, "type": "blitz", "region": "support", "name": "Sanctic Dome", "tags": ["support"], "desc": "Telekine Dome that halts daemonic entry. On dissipation, restores 50-100% of HP allies lost inside it. Costs 2-3 SE."},
    {"id": 12, "x": 1040, "y": 394, "type": "blitz", "region": "hybrid", "name": "Telekine Palm", "tags": ["utility"], "desc": "Manipulate objects at range, clear hazard patches, or extract a downed ally to your position. Costs 1-2 SE."},
    {"id": 13, "x": 230, "y": 502, "type": "blitzmod", "region": "combat", "name": "Grip of Iron", "tags": ["CC_duration+"], "desc": "Dominate holds targets for +2s."},
    {"id": 14, "x": 450, "y": 502, "type": "blitzmod", "region": "combat", "name": "Immolating Grasp", "tags": ["DoT_stacks+"], "desc": "Enemies held by Dominate gain 4 stacks of Soulblaze."},
    {"id": 15, "x": 580, "y": 502, "type": "blitzmod", "region": "support", "name": "Consecrated Ground", "tags": ["support"], "desc": "Sanctic Dome also cleanses 25% of a wound of Corruption on dissipation."},
    {"id": 16, "x": 800, "y": 502, "type": "blitzmod", "region": "support", "name": "Ember Thrift", "tags": ["soulfire_economy"], "desc": "Sanctic Dome costs 1 fewer Soul Ember."},
    {"id": 17, "x": 930, "y": 502, "type": "blitzmod", "region": "hybrid", "name": "Far Reach", "tags": ["utility"], "desc": "Telekine Palm range +50%. Hazard clearing radius +40%."},
    {"id": 18, "x": 1150, "y": 502, "type": "blitzmod", "region": "hybrid", "name": "Sundering Pull", "tags": ["mtrgt_CC"], "desc": "Extracting an ally staggers enemies along the path."},
    {"id": 19, "x": 230, "y": 610, "type": "default", "region": "combat", "name": "Anathema", "tags": ["damage_vs_daemon+"], "desc": "+20% damage to Daemonhosts and Infested."},
    {"id": 20, "x": 450, "y": 610, "type": "default", "region": "combat", "name": "Searing Focus", "tags": ["DoT_stacks+"], "desc": "Critical hits apply 2 stacks of Soulblaze."},
    {"id": 21, "x": 690, "y": 610, "type": "stat", "region": "support", "name": "Toughness Boost", "tags": ["toughness+"], "desc": "+20 Toughness."},
    {"id": 22, "x": 580, "y": 610, "type": "default", "region": "support", "name": "Litany Unbroken", "tags": ["incantation_power+"], "desc": "Single-target Incantations restore an extra 8% Toughness."},
    {"id": 23, "x": 1040, "y": 610, "type": "default", "region": "hybrid", "name": "Cowing Presence", "tags": ["suppression+"], "desc": "Staggering an enemy suppresses others within 4m."},
    {"id": 24, "x": 1260, "y": 610, "type": "default", "region": "hybrid", "name": "White Noise", "tags": ["suppression+"], "desc": "Suppression you inflict lasts 1.5s longer, and suppressed shooters move 15% slower."},
    {"id": 25, "x": 340, "y": 718, "type": "aura", "region": "combat", "name": "Psyniscience", "tags": ["utility"], "desc": "Specialists and Disablers within 25m are outlined for all allies in coherency, through walls."},
    {"id": 26, "x": 690, "y": 718, "type": "aura", "region": "support", "name": "Unyielding Vigil", "tags": ["support"], "desc": "Allies in coherency gain +15% Toughness from all replenishment; downed allies lose downed-health 25% slower."},
    {"id": 27, "x": 1040, "y": 718, "type": "aura", "region": "hybrid", "name": "Litany of Abjuration", "tags": ["support"], "desc": "Allies in coherency: +25% Corruption resistance; DoTs on them expire 30% faster."},
    {"id": 28, "x": 340, "y": 826, "type": "ability", "region": "combat", "name": "Dome of Banishment", "tags": ["DoT_damage+"], "desc": "Pulls non-boss enemies into an AoE and applies 10 Soulblaze, +5 per ally also inside."},
    {"id": 29, "x": 690, "y": 826, "type": "ability", "region": "support", "name": "Distort Vision", "tags": ["utility"], "desc": "Invisible for 7s and spawn an improved decoy that absorbs aggro. Support Incantations do not break stealth until they resolve."},
    {"id": 30, "x": 1040, "y": 826, "type": "ability", "region": "hybrid", "name": "Telekine Fling", "tags": ["mtrgt_CC"], "desc": "Grip, lift and hurl a human-sized enemy. Charge time and swing width set distance and AoE. Impact kills the thrown target and staggers everything it hits."},
    {"id": 31, "x": 230, "y": 934, "type": "abilmod", "region": "combat", "name": "Widening Gyre", "tags": ["DoT_stacks+"], "desc": "Dome of Banishment applies +4 Soulblaze per ally inside."},
    {"id": 32, "x": 450, "y": 934, "type": "abilmod", "region": "combat", "name": "Hungering Dome", "tags": ["soulfire_on_kill"], "desc": "Enemies dying inside Dome of Banishment each grant Soulfire."},
    {"id": 33, "x": 580, "y": 934, "type": "abilmod", "region": "support", "name": "Lingering Shade", "tags": ["support"], "desc": "Distort Vision decoy lasts +4s and taunts nearby enemies."},
    {"id": 34, "x": 800, "y": 934, "type": "abilmod", "region": "support", "name": "Veiled Ministry", "tags": ["incantation_power+"], "desc": "Incantations cast from stealth cost 40% less Soulfire."},
    {"id": 35, "x": 930, "y": 934, "type": "abilmod", "region": "hybrid", "name": "Wider Arc", "tags": ["mtrgt_CC"], "desc": "Telekine Fling ballistic throws gain +50% impact radius."},
    {"id": 36, "x": 1150, "y": 934, "type": "abilmod", "region": "hybrid", "name": "Unburdened Grip", "tags": ["ability_cooldown+"], "desc": "Killing the thrown target refunds 20% Ability cooldown."},
    {"id": 37, "x": 340, "y": 1042, "type": "abilmod", "region": "combat", "name": "Banishment Echo", "tags": ["ability_cooldown+"], "desc": "Dome of Banishment cooldown -20%."},
    {"id": 38, "x": 690, "y": 1042, "type": "abilmod", "region": "support", "name": "Parting Pulse", "tags": ["mtrgt_CC"], "desc": "Decoy's expiry pulse staggers in a 8m radius and restores 15% Toughness to allies in it."},
    {"id": 39, "x": 1040, "y": 1042, "type": "abilmod", "region": "hybrid", "name": "Second Grip", "tags": ["ability_charges+"], "desc": "+1 charge of Telekine Fling."},
    {"id": 40, "x": 120, "y": 1042, "type": "stat", "region": "combat", "name": "Melee Damage Boost", "tags": ["melee_damage+"], "desc": "+10% Melee Damage."},
    {"id": 41, "x": 1260, "y": 1042, "type": "stat", "region": "hybrid", "name": "Impact Boost", "tags": ["stagger+"], "desc": "+10% Impact."},
    {"id": 42, "x": 230, "y": 1150, "type": "default", "region": "combat", "name": "Zealot's Cadence", "tags": ["attack_speed+"], "desc": "+8% Attack Speed after a Soulblaze kill."},
    {"id": 43, "x": 450, "y": 1150, "type": "default", "region": "combat", "name": "Rent Faith", "tags": ["rending+"], "desc": "+10% Rending against burning enemies."},
    {"id": 44, "x": 580, "y": 1150, "type": "default", "region": "support", "name": "Deeper Communion", "tags": ["inc-n_slot_1point"], "desc": "Counts toward unlocking your Level II Incantation slot."},
    {"id": 45, "x": 800, "y": 1150, "type": "default", "region": "support", "name": "Unstinting Hand", "tags": ["support"], "desc": "Incantations cast on an ally below 50% HP also grant them +20% damage resistance for 5s."},
    {"id": 46, "x": 930, "y": 1150, "type": "default", "region": "hybrid", "name": "Breaking Word", "tags": ["vulner_debuff"], "desc": "Staggered enemies take +8% damage from all sources."},
    {"id": 47, "x": 1150, "y": 1150, "type": "default", "region": "hybrid", "name": "Toll of Control", "tags": ["gain_toughness"], "desc": "Staggering an Elite restores 8% Toughness."},
    {"id": 48, "x": 120, "y": 1258, "type": "default", "region": "combat", "name": "Pyre Unbound", "tags": ["DoT_damage+"], "desc": "Soulblaze stacks past the normal cap, to 12."},
    {"id": 49, "x": 340, "y": 1258, "type": "default", "region": "combat", "name": "Weakspot Doctrine", "tags": ["weakspot_damage+"], "desc": "+15% Weakspot Damage."},
    {"id": 50, "x": 690, "y": 1258, "type": "default", "region": "support", "name": "Wider Communion", "tags": ["aura_radius+"], "desc": "+35% coherency radius. You also see exact HP and Toughness values on allies, not just cues."},
    {"id": 51, "x": 580, "y": 1258, "type": "default", "region": "support", "name": "Vigil Eternal", "tags": ["support"], "desc": "Reviving an ally restores 30% Toughness to every ally in coherency. Allies in coherency also take -5% damage while you are above 50% Peril."},
    {"id": 52, "x": 1040, "y": 1258, "type": "default", "region": "hybrid", "name": "Seal the Breach", "tags": [], "desc": "Consumes 2 Soul Embers to negate a Peril Overload, venting 50% Peril and staggering within 5m. 20s lockout. Will not fire while holding Quell."},
    {"id": 53, "x": 1260, "y": 1258, "type": "default", "region": "hybrid", "name": "Confound", "tags": ["mtrgt_CC"], "desc": "Elites and Monstrosities you stagger stay staggered 50% longer and cannot call for reinforcements while staggered."},
    {"id": 54, "x": 120, "y": 610, "type": "default", "region": "combat", "name": "Ember Draught", "tags": ["soulfire_on_kill"], "desc": "Melee kills generate Soulfire."},
    {"id": 55, "x": 1260, "y": 718, "type": "default", "region": "hybrid", "name": "Weapon Jinx", "tags": ["mtrgt_CC"], "desc": "Enemies you stagger attack 20% slower for 3s."},
    {"id": 56, "x": 690, "y": 1150, "type": "default", "region": "support", "name": "Patient Litany", "tags": ["soulfire_economy"], "desc": "Soulfire regenerates 25% faster while no ally is below 50% Toughness."},
    {"id": 57, "x": 340, "y": 1150, "type": "default", "region": "combat", "name": "Ranged Doctrine", "tags": ["range_damage+"], "desc": "+8% Ranged Damage."},
    {"id": 58, "x": 120, "y": 1150, "type": "default", "region": "combat", "name": "Wrathful Cadence", "tags": ["attack_speed+"], "desc": "+6% Attack Speed while burning enemies are nearby."},
    {"id": 59, "x": 1040, "y": 1150, "type": "stat", "region": "hybrid", "name": "Toughness Boost", "tags": ["toughness+"], "desc": "+20 Toughness."},
    {"id": 60, "x": 230, "y": 1258, "type": "default", "region": "combat", "name": "Kindler", "tags": ["DoT_stacks+"], "desc": "Heavy attacks apply 1 stack of Soulblaze."},
    {"id": 61, "x": 450, "y": 1258, "type": "default", "region": "combat", "name": "Immolate", "tags": ["DoT_damage+"], "desc": "Soulblaze spreads to a nearby enemy when its target dies."},
    {"id": 62, "x": 800, "y": 1258, "type": "default", "region": "support", "name": "Unspoken Rite", "tags": ["incantation_power+"], "desc": "AoE Incantations affect an extra 3m, and Corruption-removing Incantations remove an extra 10% of a wound."},
    {"id": 63, "x": 930, "y": 1258, "type": "default", "region": "hybrid", "name": "Grim Composure", "tags": ["toughness+"], "desc": "+10% Toughness Damage Reduction while above 75% Peril."},
    {"id": 64, "x": 1150, "y": 1258, "type": "default", "region": "hybrid", "name": "Measured Force", "tags": ["gain_toughness"], "desc": "Freezing an enemy with Dominate restores 5% Toughness per target, up to 20%."},
    {"id": 65, "x": 285, "y": 1366, "type": "keystone", "region": "combat", "name": "Vessel of Sorrows", "tags": [], "desc": "Combat keystone. While at 3/3 Soul Embers (Soulblaze state), gain escalating offensive bonuses that decay one tier each time you spend an Ember."},
    {"id": 66, "x": 175, "y": 1474, "type": "keymod", "region": "combat", "name": "Ashen Crown", "tags": ["melee_crit_chance+"], "desc": "Each Soulblaze tier grants +4% Critical Hit Chance."},
    {"id": 67, "x": 285, "y": 1474, "type": "keymod", "region": "combat", "name": "Unspent Wrath", "tags": ["DoT_damage+"], "desc": "Each Soulblaze tier grants +8% damage to burning targets."},
    {"id": 68, "x": 395, "y": 1474, "type": "keymod", "region": "combat", "name": "Cinder Hoard", "tags": ["soulfire_on_kill"], "desc": "Soulblaze kills generate +30% Soulfire."},
    {"id": 69, "x": 230, "y": 1582, "type": "keymod", "region": "combat", "name": "Wrath Sustained", "tags": ["DoT_stacks+"], "desc": "Soulblaze tiers decay one step slower."},
    {"id": 70, "x": 340, "y": 1582, "type": "keymod", "region": "combat", "name": "Last Ember", "tags": ["melee_crit_chance+"], "desc": "+10% Critical Hit Chance while at 3/3 Soul Embers."},
    {"id": 71, "x": 285, "y": 1690, "type": "keymod", "region": "combat", "name": "Final Pyre", "tags": ["DoT_damage+"], "desc": "Soulblaze on Elites deals +25% damage."},
    {"id": 72, "x": 690, "y": 1366, "type": "keystone", "region": "support", "name": "Sanctic Bond", "tags": [], "desc": "Support keystone. Absorb a portion of the damage allies in coherency suffer; the absorbed damage is converted into Peril rather than Toughness loss."},
    {"id": 73, "x": 580, "y": 1474, "type": "keymod", "region": "support", "name": "Willing Burden", "tags": ["team_damage_absorb"], "desc": "Absorb an additional 10% of allies' incoming damage."},
    {"id": 74, "x": 690, "y": 1474, "type": "keymod", "region": "support", "name": "Tempered Vessel", "tags": ["toughness+"], "desc": "+20% Toughness Damage Reduction while Sanctic Bond is active."},
    {"id": 75, "x": 800, "y": 1474, "type": "keymod", "region": "support", "name": "Vow Unbroken", "tags": ["inc-n_slot_1point"], "desc": "Counts toward unlocking your Level III Incantation slot."},
    {"id": 76, "x": 635, "y": 1582, "type": "keymod", "region": "support", "name": "Shared Suffering", "tags": ["team_damage_absorb"], "desc": "Absorbed damage is split evenly across all bonded allies rather than paid by you alone."},
    {"id": 77, "x": 745, "y": 1582, "type": "keymod", "region": "support", "name": "Anchored Faith", "tags": ["support"], "desc": "Bonded allies cannot be reduced below 1 HP by a single hit once per 60s."},
    {"id": 78, "x": 690, "y": 1690, "type": "keymod", "region": "support", "name": "Martyr's Ledger", "tags": ["team_damage_absorb"], "desc": "Peril gained from Sanctic Bond is halved."},
    {"id": 79, "x": 1095, "y": 1366, "type": "keystone", "region": "hybrid", "name": "Weaken the Veil", "tags": [], "desc": "Hybrid keystone. Enemies you stagger, freeze or disable become Unhallowed: they take increased damage from all sources and grant you Soulfire when they die."},
    {"id": 80, "x": 985, "y": 1474, "type": "keymod", "region": "hybrid", "name": "Rites of Unmaking", "tags": ["vulner_debuff"], "desc": "Unhallowed enemies take an additional +10% damage."},
    {"id": 81, "x": 1095, "y": 1474, "type": "keymod", "region": "hybrid", "name": "Warden's Toll", "tags": ["soulfire_on_CC"], "desc": "Unhallowed enemies grant +50% Soulfire on death."},
    {"id": 82, "x": 1205, "y": 1474, "type": "keymod", "region": "hybrid", "name": "Spreading Doubt", "tags": ["mtrgt_CC"], "desc": "Killing an Unhallowed enemy staggers others within 5m."},
    {"id": 83, "x": 1040, "y": 1582, "type": "keymod", "region": "hybrid", "name": "Hollow Ranks", "tags": ["suppression+"], "desc": "Unhallowed enemies suppress their neighbours."},
    {"id": 84, "x": 1150, "y": 1582, "type": "keymod", "region": "hybrid", "name": "Steady Hand", "tags": ["ability_cooldown+"], "desc": "-15% Ability cooldown while any Unhallowed enemy lives."},
    {"id": 85, "x": 1095, "y": 1690, "type": "keymod", "region": "hybrid", "name": "Silence the Choir", "tags": ["mtrgt_CC"], "desc": "Unhallowed Specialists are silenced: they cannot use ranged or special attacks."}
    ],
    edges: [[0, 2], [1, 4], [1, 5], [1, 6], [2, 5], [2, 6], [2, 7], [3, 7], [3, 8], [3, 9], [4, 10], [5, 10], [6, 11], [7, 11], [8, 12], [9, 12], [10, 13], [10, 14], [10, 15], [11, 14], [11, 15], [11, 16], [11, 17], [12, 16], [12, 17], [12, 18], [13, 19], [13, 54], [14, 19], [14, 20], [14, 22], [15, 20], [15, 21], [15, 22], [16, 21], [17, 23], [18, 23], [18, 24], [19, 25], [20, 25], [21, 26], [22, 21], [22, 26], [23, 27], [23, 55], [24, 27], [24, 55], [25, 28], [26, 29], [27, 30], [28, 31], [28, 32], [28, 33], [29, 32], [29, 33], [29, 34], [29, 35], [30, 34], [30, 35], [30, 36], [31, 37], [31, 40], [32, 37], [33, 38], [34, 38], [35, 39], [36, 39], [36, 41], [37, 42], [37, 43], [37, 44], [37, 57], [37, 58], [38, 43], [38, 44], [38, 45], [38, 46], [38, 56], [39, 45], [39, 46], [39, 47], [39, 59], [40, 42], [40, 57], [40, 58], [41, 47], [41, 59], [42, 48], [42, 49], [42, 57], [42, 60], [43, 61], [44, 50], [44, 51], [44, 56], [45, 62], [46, 52], [46, 59], [46, 63], [47, 53], [47, 64], [48, 60], [48, 65], [49, 61], [49, 65], [50, 62], [50, 72], [51, 50], [51, 72], [52, 64], [52, 79], [53, 79], [54, 19], [54, 25], [55, 30], [56, 45], [56, 50], [56, 51], [56, 62], [57, 43], [57, 49], [57, 60], [57, 61], [58, 42], [58, 48], [59, 47], [59, 52], [59, 53], [59, 63], [59, 64], [60, 49], [60, 65], [62, 72], [63, 52], [64, 53], [64, 79], [65, 66], [65, 67], [65, 68], [66, 69], [67, 69], [67, 70], [68, 70], [69, 71], [70, 71], [72, 73], [72, 74], [72, 75], [73, 76], [74, 76], [74, 77], [75, 77], [76, 78], [77, 78], [79, 80], [79, 81], [79, 82], [80, 83], [81, 83], [81, 84], [82, 84], [83, 85], [84, 85]]
  }
};
