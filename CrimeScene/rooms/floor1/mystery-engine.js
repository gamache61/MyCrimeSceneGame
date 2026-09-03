// ============================================================
//  mystery-engine.js  —  Crowsnest Castle
//  Detective: Jim "Bull" Smart
// ============================================================
const MysteryEngine = (() => {

  // ── PEOPLE ──────────────────────────────────────────────
  const SUSPECTS = [
    { id: "lord_edmund",   name: "Lord Edmund Crowsnest",  role: "Owner of Crowsnest Castle",      motive: "Financial pressure — hidden debts uncovered by the victim" },
    { id: "lady_margaret", name: "Lady Margaret Crowsnest",role: "Lady of the house",               motive: "Inheritance and a strained marriage" },
    { id: "sebastian",     name: "Sebastian Hale",          role: "Family solicitor",               motive: "Will revisions made shortly before the murder" },
    { id: "clara",         name: "Clara Ravenswood",        role: "Niece and expected heir",        motive: "Stood to inherit the entire estate" },
    { id: "dr_morton",     name: "Dr. Elias Morton",        role: "Family physician",               motive: "Concealed medical information about the victim" },
    { id: "victor",        name: "Victor Blackwell",        role: "Business partner",               motive: "Failing business partnership — facing ruin" },
    { id: "agnes",         name: "Agnes Whitlock",          role: "Castle archivist",               motive: "Knew long-hidden family secrets the victim threatened to expose" },
    { id: "thomas",        name: "Thomas Greene",           role: "Son of former groundskeeper",    motive: "Old family grievances against the Crowsnest estate" },
    { id: "isabelle",      name: "Isabelle Fournier",       role: "Visiting art dealer",            motive: "Blackmail involving forged artworks" },
    { id: "julian",        name: "Julian Cross",            role: "Private secretary",              motive: "Controlled access to the victim — and exploited it" },
    { id: "harold",        name: "Harold Finch",            role: "Head butler",                    motive: "Loyalty to a secret going back decades" },
    { id: "miriam",        name: "Miriam Locke",            role: "Housekeeper",                    motive: "Protecting someone she cared about inside the castle" },
    { id: "edgar",         name: "Edgar Bell",              role: "Night watchman",                 motive: "Bribed to look the other way — then silenced the one who knew" },
    { id: "rosalind",      name: "Rosalind Marsh",          role: "Castle cook",                    motive: "Overheard something in the kitchen she was never meant to hear" },
    { id: "owen",          name: "Owen Calloway",           role: "Groundskeeper",                  motive: "Knew every hidden entrance — and used one the night of the murder" },
    { id: "constance",     name: "Lady Constance Wray",     role: "Visiting dowager",               motive: "Gambling debts forgiven by the victim — if they stayed silent" },
    { id: "margaret_vane", name: "Mrs. Margaret Vane",      role: "Distant cousin",                 motive: "Removed from will months prior — sought revenge and restoration" },
    { id: "reginald",      name: "Sir Reginald Ashby",      role: "Castle trustee",                 motive: "Embezzlement discovered — the victim was about to report it" },
    { id: "nora",          name: "Professor Nora Holt",     role: "Academic guest",                 motive: "Researching castle archives — stumbled onto a dangerous truth" },
    { id: "vivienne",      name: "Miss Vivienne Lark",      role: "Music teacher",                  motive: "Affair with the victim exposed — threatened family reputation" },
    { id: "dmitri",        name: "Count Dmitri Sorel",      role: "Foreign noble",                  motive: "Political intrigue and a missing diplomatic document" },
    { id: "edith",         name: "Miss Edith Crane",        role: "Governess",                      motive: "Child's welfare at stake — the victim controlled her fate" },
    { id: "samuel",        name: "Reverend Samuel Fitch",   role: "Castle chaplain",                motive: "Confession heard in confidence — the victim broke the seal" },
    { id: "hugo",          name: "Mr. Hugo Pemberton",      role: "Wine merchant",                  motive: "Fraudulent shipments blamed on the victim's negligence" },
    { id: "dorothy",       name: "Dorothy Winters",         role: "Estate manager's widow",         motive: "Blamed the victim for her husband's death years ago" },
    { id: "aldous",        name: "Mr. Aldous Vane",         role: "Visiting merchant",               motive: "Business dispute over a shipment of rare goods" },
    { id: "cecily",        name: "Mrs. Cecily Drăghici",    role: "Foreign noblewoman",              motive: "Insulted at a dinner party — sought public revenge" },
  ];

  // ── ROOMS ────────────────────────────────────────────────
  const ROOMS = [
    // Floor 1
    { id: "ballroom",          name: "Ballroom",                  floor: 1 },
    { id: "library",           name: "Library",                   floor: 1 },
    { id: "livingroom",        name: "Living Room",               floor: 1 },
    { id: "chapel",            name: "Chapel",                    floor: 1 },
    { id: "washroom",          name: "Washroom",                  floor: 1 },
    { id: "storage",           name: "Storage Room",              floor: 1 },
    { id: "drawingroom",       name: "Drawing Room",              floor: 1 },
    { id: "pantry",            name: "Pantry",                    floor: 1 },
    { id: "kitchen",           name: "Kitchen",                   floor: 1 },
    { id: "livingquarters",    name: "Living Quarters Hallway",   floor: 1 },
    { id: "lq_room1",          name: "Living Quarters — Room 1",  floor: 1 },
    { id: "lq_room2",          name: "Living Quarters — Room 2",  floor: 1 },
    { id: "lq_room3",          name: "Living Quarters — Room 3",  floor: 1 },
    { id: "lq_room4",          name: "Living Quarters — Room 4",  floor: 1 },
    { id: "lq_room5",          name: "Living Quarters — Room 5",  floor: 1 },
    { id: "lq_room6",          name: "Living Quarters — Room 6",  floor: 1 },
    // Floor 2
    { id: "lord_ladies",       name: "Lord & Ladies Chambers",    floor: 2 },
    { id: "walkin_closet",     name: "Walk-in Closet",            floor: 2 },
    { id: "closetroom",        name: "Closet Room",               floor: 2 },
    { id: "balcony",           name: "Balcony",                   floor: 2 },
    { id: "medievalroom",      name: "Medieval Room",             floor: 2 },
    { id: "gothicroom",        name: "Gothic Room",               floor: 2 },
    { id: "knightsroom",       name: "Knight's Room",             floor: 2 },
    { id: "tudorroom",         name: "Tudor Room",                floor: 2 },
    { id: "crystalroom",       name: "Crystal Room",              floor: 2 },
    { id: "victoriansuite",    name: "Victorian Suite",           floor: 2 },
    { id: "celticroom",        name: "Celtic Room",               floor: 2 },
    { id: "midnightchambers",  name: "Midnight Chambers",         floor: 2 },
    { id: "romansuite",        name: "Roman Suite",               floor: 2 },
    { id: "romandressingroom", name: "Roman Dressing Room",       floor: 2 },
    // Roof & Basement
    { id: "rooftop",           name: "Rooftop",                   floor: "roof" },
    { id: "rooftop_pool",      name: "Rooftop Pool",              floor: "roof" },
    { id: "tower1",            name: "Tower 1",                   floor: "roof" },
    { id: "tower2",            name: "Tower 2",                   floor: "roof" },
    { id: "tower3",            name: "Tower 3",                   floor: "roof" },
    { id: "tower4",            name: "Tower 4",                   floor: "roof" },
    { id: "tower5",            name: "Tower 5",                   floor: "roof" },
    { id: "basement_tunnels",  name: "Basement Tunnels",          floor: "basement" },
    { id: "prison",            name: "Prison",                    floor: "basement" },
    { id: "freezer",           name: "Freezer",                   floor: 1 },
    { id: "staffquarters",     name: "Staff Quarters",            floor: 1 },
    { id: "floor1_corridor",   name: "Floor 1 Corridor",          floor: 1 },
    { id: "floor2_corridor",   name: "Floor 2 Corridor",          floor: 2 },
    { id: "barroquecloset",    name: "Baroque Closet",            floor: 2 },
    { id: "knightscloset",     name: "Knight's Closet",           floor: 2 },
    { id: "gothiccloset",      name: "Gothic Closet",             floor: 2 },
    { id: "medievaltrunk",     name: "Medieval Trunk",            floor: 2 },
    { id: "gothictrunk",       name: "Gothic Trunk",              floor: 2 },
    { id: "victoriancloset",   name: "Victorian Closet",          floor: 2 },
    { id: "lordchambers_trunk",name: "Lord & Ladies Trunk",       floor: 2 },
  ];

  // ── WEAPONS ──────────────────────────────────────────────
  // premeditated: killer planned ahead | opportunistic: grabbed in the moment
  const WEAPONS = [
    { name: "Poison",       premeditated: true  },
    { name: "Arsenic",      premeditated: true  },
    { name: "Rope",         premeditated: true  },
    { name: "Gun",          premeditated: true  },
    { name: "Dagger",       premeditated: true  },
    { name: "Blade",        premeditated: true  },
    { name: "Strychnine",   premeditated: true  },
    { name: "Cyanide",      premeditated: true  },
    { name: "Candlestick",  premeditated: false },
    { name: "Poker",        premeditated: false },
    { name: "Bottle",       premeditated: false },
    { name: "Bookend",      premeditated: false },
    { name: "Paperweight",  premeditated: false },
    { name: "Hammer",       premeditated: false },
    { name: "Axe",          premeditated: false },
    { name: "Chisel",       premeditated: false },
    { name: "Goblet",       premeditated: false },
    { name: "Vase",         premeditated: false },
    { name: "Fireplace Shovel", premeditated: false },
    { name: "Wrench",       premeditated: false },
    { name: "Letter Opener",premeditated: false },
    { name: "Curtain Rod",  premeditated: false },
    { name: "Garrote",      premeditated: true  },
    { name: "Pillow",       premeditated: true  },
  ];

  // ── CORONER CLUES ─────────────────────────────────────────
  // 3-4 autopsy fragments per weapon. None names the weapon directly —
  // the player must cross-reference to identify it.
  const CORONER_CLUES = {
    "Poison": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: the stomach lining bears chemical scarring inconsistent with natural causes. The victim did not die quickly. Whatever was administered was ingested — likely in a beverage.` },
      { type: "coroner", text: `Coroner's notes: elevated levels of an unidentified alkaloid compound detected in the bloodstream. The substance is not naturally occurring. It was introduced deliberately.` },
      { type: "coroner", text: `Toxicology addendum: the concentration of the compound suggests it was dissolved in something the victim drank willingly and in quantity. No external wounds. This death was designed to look natural.` },
      { type: "coroner", text: `Dr. Marsh's final note: the method requires advance preparation — sourcing, dissolving, administering. This was not a spontaneous act. Whoever did this planned it well in advance.` },
    ],
    "Arsenic": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: the victim's fingernails show faint white banding — a classic indicator of prolonged arsenic exposure. Death may have been the final dose in a series.` },
      { type: "coroner", text: `Coroner's notes: the liver shows acute toxic damage. The substance responsible is a heavy metal compound, likely administered in small, repeated quantities over days.` },
      { type: "coroner", text: `Toxicology report: arsenic detected at fatal levels. The method of delivery was almost certainly liquid — tea, broth, or a similar warm beverage consumed regularly by the victim.` },
      { type: "coroner", text: `Dr. Marsh notes: acquiring and administering arsenic in this manner takes patience and proximity. The killer had regular, unsuspected access to the victim's daily routine.` },
    ],
    "Rope": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: deep ligature marks encircle the neck in a pattern consistent with a cord or rope approximately two centimetres in width. Death was by asphyxiation.` },
      { type: "coroner", text: `Coroner's notes: the pressure applied was sustained — the victim did not die instantly. The killer is likely physically strong, or used leverage to compensate for strength.` },
      { type: "coroner", text: `Forensic note: fibres recovered from the ligature wound are natural — plant-based, coarse-woven. Consistent with utility rope rather than decorative cord.` },
      { type: "coroner", text: `Dr. Marsh's assessment: the rope was brought to the scene. This was not improvised. The killer knew in advance how they intended to kill.` },
    ],
    "Gun": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: a single entry wound to the torso, small calibre. The wound channel is consistent with a ball-shot firearm — older mechanism, likely pre-breech loading.` },
      { type: "coroner", text: `Coroner's notes: gunpowder residue detected around the wound margins. The shot was fired at close range — within two metres. The victim was likely facing the killer.` },
      { type: "coroner", text: `Forensic note: no exit wound was found. The projectile remains lodged in the body. Recovery and ballistic matching to a specific firearm should be possible.` },
      { type: "coroner", text: `Dr. Marsh's assessment: the use of a firearm in a castle setting suggests either desperation or confidence the shot would go unheard. The killer took a significant risk — or knew the castle's acoustics.` },
    ],
    "Dagger": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: a single penetrating wound to the upper chest, narrow and precise. The blade was thin, double-edged, and approximately twenty centimetres in length.` },
      { type: "coroner", text: `Coroner's notes: the entry angle suggests the killer was of similar height to the victim, or the victim was seated. The thrust was deliberate — not frenzied. Whoever did this knew where to strike.` },
      { type: "coroner", text: `Forensic note: traces of gilding compound recovered from the wound margin — consistent with decorative metalwork. The blade was ornamental rather than utilitarian.` },
      { type: "coroner", text: `Dr. Marsh's assessment: the wound was inflicted with a single, controlled movement. The killer did not panic. This speaks to either prior training or cold-blooded resolve.` },
    ],
    "Blade": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: dark staining of the mucous membranes and throat lining. The victim ingested a toxic substance — possibly absorbed through prolonged skin contact before ingestion.` },
      { type: "coroner", text: `Coroner's notes: the toxin shows properties consistent with certain industrial dyes used in ink manufacture. Fatally concentrated. Not commercially available in this form without modification.` },
      { type: "coroner", text: `Toxicology report: the compound was found concentrated in the victim's fingertips and mouth — suggesting they handled and then accidentally or unknowingly ingested it. A slow and unpleasant death.` },
      { type: "coroner", text: `Dr. Marsh's note: to have modified an inkwell in this way requires both chemical knowledge and access to the victim's personal writing materials. This was intimate and calculated.` },
    ],
    "Candlestick": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: blunt force trauma to the rear of the skull — a single, powerful blow. Death was rapid. The impact surface was smooth, cylindrical, and weighted at one end.` },
      { type: "coroner", text: `Coroner's notes: wax residue recovered from the wound margin. Cream-coloured, unscented — consistent with household candles. The weapon was almost certainly in the room before the killer arrived.` },
      { type: "coroner", text: `Forensic note: the blow was struck from behind and slightly above — the victim did not see it coming. There was no defensive wound on the hands or arms. No struggle preceded the killing.` },
      { type: "coroner", text: `Dr. Marsh's assessment: this has all the hallmarks of an unplanned act. The killer used what was available. Whether they came intending to kill or not, the death was swift and unpredictable.` },
    ],
    "Poker": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: multiple blunt trauma wounds to the head and upper torso — at least three distinct impacts. The weapon was long, rigid, and iron or steel.` },
      { type: "coroner", text: `Coroner's notes: soot and iron oxide traces detected in two of the wounds. The weapon had been used near an open fire before — or recently. It was not brought from outside.` },
      { type: "coroner", text: `Forensic note: the angle and force of the blows are inconsistent. First strike from the right, second from above — the victim fell between them. The killer was in a state of agitation, not calm calculation.` },
      { type: "coroner", text: `Dr. Marsh's assessment: the repetition of blows beyond what was necessary suggests emotional rage. This killing was personal. The killer did not stop when they could have.` },
    ],
    "Chisel": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: a penetrating wound consistent with a narrow, flat-bladed implement — rectangular cross-section, bevelled edge. The strike was short and direct, into soft tissue.` },
      { type: "coroner", text: `Coroner's notes: the wound channel is shallow but precise. The implement was driven with controlled force rather than a wild swing — either very close quarters or a deliberate thrust.` },
      { type: "coroner", text: `Forensic note: iron oxide and wood resin traces in the wound margin suggest the instrument had been used for manual work. This was a tool taken from somewhere in the castle, not carried as a weapon.` },
      { type: "coroner", text: `Dr. Marsh's assessment: a chisel is not a spontaneous choice — you have to know where one is kept. The killer either worked with their hands or knew who did. This narrows the field considerably.` },
    ],
    "Paperweight": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: catastrophic blunt force trauma to the skull. A single blow — massive force, irregular impact surface. The weapon was heavy and uneven.` },
      { type: "coroner", text: `Coroner's notes: stone dust and grit recovered from the wound. The object was decorative rather than manufactured as a weapon — rough edges, dense material.` },
      { type: "coroner", text: `Forensic note: the sheer weight required to cause this injury narrows the likely weapon considerably. Something fixed in a room — a bookend, a sculpture, a decorative paperweight of significant size.` },
      { type: "coroner", text: `Dr. Marsh's assessment: whoever lifted this object and brought it down with this force was acting on pure impulse or fury. No premeditation — the killer took the first heavy thing within reach.` },
    ],
    "Goblet": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: blunt force trauma to the temple — a single curved impact, consistent with the rounded base or bowl of a heavy drinking vessel. Death was rapid.` },
      { type: "coroner", text: `Coroner's notes: traces of dried wine and gilded lacquer recovered from the wound. The object was decorative — heavy enough to be lethal, likely cast metal or thick glass.` },
      { type: "coroner", text: `Forensic note: the curvature of the impact mark is consistent with a drinking cup or chalice. The object may have remained intact after the blow — it was not fragile enough to shatter.` },
      { type: "coroner", text: `Dr. Marsh's assessment: a goblet would be in any dining room, drawing room, or guest chamber. The killer grabbed what was at hand. This was not planned — but it was effective.` },
    ],
    "Bottle": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: blunt force trauma to the temple — a single blow from a rounded, smooth object. The impact pattern is curved. Death was near-immediate.` },
      { type: "coroner", text: `Coroner's notes: traces of red wine residue in the wound — the vessel was not empty when it was used. Broken glass consistent with a bottle neck was found near the body.` },
      { type: "coroner", text: `Forensic note: the swing arc and force suggest the killer was standing to the victim's left and struck in a sweeping motion. Likely during or immediately after a shared drink.` },
      { type: "coroner", text: `Dr. Marsh's assessment: the presence of shared wine speaks to a meeting that turned violent without warning. The killer did not arrive intending murder. Something was said — or discovered.` },
    ],
    "Bookend": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: a single blow to the back of the skull — precise, devastating, and consistent with a flat-faced metal object of significant mass.` },
      { type: "coroner", text: `Coroner's notes: brass filings detected in the wound margin. The object was cast metal, not wrought — likely decorative. Heavy enough to kill in a single strike.` },
      { type: "coroner", text: `Forensic note: the victim was struck from behind while standing or seated. No sign of struggle beforehand. The killer approached from the rear — either unknown to the victim, or trusted.` },
      { type: "coroner", text: `Dr. Marsh's assessment: the location of the blow suggests the victim turned their back on the killer willingly. They felt no threat. The killing was opportunistic — but the approach was cold.` },
    ],
    "Hammer": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: repeated blunt trauma to the skull — at least four distinct impact points, each circular and small in diameter. The weapon was heavy, short-handled, and struck with force.` },
      { type: "coroner", text: `Coroner's notes: the wound pattern is consistent with a tool rather than a decorative object. The circular impact face is uniform — manufactured, not ornamental.` },
      { type: "coroner", text: `Forensic note: iron oxide traces in the wounds. The implement had been used for physical work prior to the attack. This was not fetched from a display — it came from somewhere functional.` },
      { type: "coroner", text: `Dr. Marsh's assessment: the number of blows far exceeded what was necessary. The killer was in a rage, or wanted to be certain. Either way, this was not planned — it escalated.` },
    ],
    "Axe": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: a single catastrophic wound to the upper torso — deep, wide, and consistent with a heavy bladed implement swung with significant force.` },
      { type: "coroner", text: `Coroner's notes: the wound edge is clean on one side, slightly ragged on the other — suggesting the blade was sharp but not maintained. A working tool, not a decorative one.` },
      { type: "coroner", text: `Forensic note: the arc of the blow indicates the weapon had a long handle — the killer swung from above and to the right. Whoever did this had the strength and space to do so.` },
      { type: "coroner", text: `Dr. Marsh's assessment: an axe is not easily concealed. The killer either retrieved it from somewhere in the castle or arrived with it openly. Neither speaks to careful planning.` },
    ],
    "Vase": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: blunt force trauma to the side of the skull — a single blow from a curved, hollow object. The impact was hard enough to fracture the temporal bone.` },
      { type: "coroner", text: `Coroner's notes: ceramic fragments recovered from the wound. Fine glazed pottery — not common earthenware. This was a decorative piece, likely from within the room itself.` },
      { type: "coroner", text: `Forensic note: the object shattered on impact. The killer would have been left holding the neck or base of it. Whatever remained was likely discarded nearby.` },
      { type: "coroner", text: `Dr. Marsh's assessment: this was not brought as a weapon. The killer grabbed what was at hand. The blow itself was decisive — but the choice of implement was entirely circumstantial.` },
    ],
    "Strychnine": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: the victim's muscles bear signs of severe tetanic contractions. The body was found in a grotesque posture — back arched, limbs rigid. This indicates a neurotoxin, not a standard poison.` },
      { type: "coroner", text: `Toxicology findings: trace amounts of strychnine detected in gastric contents. The victim would have experienced excruciating pain before death — conscious throughout the final minutes.` },
      { type: "coroner", text: `Coroner's notes: the concentration suggests a dose meant to be lethal but administered in a way that mimicked natural causes initially. Only the peculiar muscle rigidity reveals the truth.` },
      { type: "coroner", text: `Dr. Marsh's assessment: this was deliberate cruelty disguised as mercy. The killer ensured the victim would suffer — making this personal, not merely practical.` },
    ],
    "Cyanide": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: the victim's lips and fingernails bear a faint pink discoloration — a hallmark sign of cyanide poisoning. Death came very quickly.` },
      { type: "coroner", text: `Toxicology addendum: cyanide compounds detected in the bloodstream at lethal concentrations. The victim likely lost consciousness within seconds of ingestion.` },
      { type: "coroner", text: `Coroner's notes: a bitter almond scent detected during the initial examination. The victim was poisoned with something readily available but rarely suspected in this household.` },
      { type: "coroner", text: `Dr. Marsh's final note: cyanide requires no preparation — it acts nearly instantaneously. This speaks to a killer who wanted swift execution, not prolonged agony.` },
    ],
    "Fireplace Shovel": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: multiple blunt force injuries across the shoulders and back. The wounds suggest a flat, heavy implement wielded repeatedly.` },
      { type: "coroner", text: `Coroner's notes: defensive wounds on the victim's hands indicate they attempted to shield themselves from the blows. The attack was sustained and brutal.` },
      { type: "coroner", text: `Forensic analysis: traces of ash and soot found in the wound crevices. The weapon came from near a fireplace or hearth — something used for cleaning or maintenance.` },
      { type: "coroner", text: `Dr. Marsh's assessment: this was rage made manifest. The killer did not stop after one blow. They continued striking long after the victim could no longer defend themselves.` },
    ],
    "Wrench": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: blunt force trauma consistent with an object of precise, angular shape. The wound pattern suggests repeated impacts from the same implement.` },
      { type: "coroner", text: `Coroner's notes: tool marks visible in the fractured skull bone. The implement was metallic and bore distinctive geometric edges — not a natural stone or wooden object.` },
      { type: "coroner", text: `Forensic finding: minute traces of machine oil detected in the wound channel. The killer's weapon was a tool — something used for mechanical work or repair.` },
      { type: "coroner", text: `Dr. Marsh's assessment: this weapon was not meant for violence. The killer seized whatever was available in a moment of crisis — an ordinary tool repurposed for murder.` },
    ],
    "Letter Opener": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: a single, precise puncture wound beneath the ribs. The blade penetrated directly toward the heart — suggesting either luck or considerable anatomical knowledge.` },
      { type: "coroner", text: `Coroner's notes: the wound is narrow and deep, consistent with a thin, blade-like implement. No serrated edges — the killer used something sharp and pointed.` },
      { type: "coroner", text: `Forensic analysis: microscopic metal flakes recovered from the wound. The weapon was not iron or steel, but a lighter metal alloy — possibly brass or silver.` },
      { type: "coroner", text: `Dr. Marsh's assessment: the killer knew exactly where to strike. This was not a frenzied attack, but a deliberate placement of a single, fatal blow.` },
    ],
    "Curtain Rod": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: severe blunt force trauma to the head and neck region. The wounds suggest a cylindrical, metallic object of considerable weight.` },
      { type: "coroner", text: `Coroner's notes: the victim's throat bears distinctive linear bruising — as if struck with something round and smooth. The blow would have been nearly instantaneous.` },
      { type: "coroner", text: `Forensic finding: minute scratches on the skull consistent with metal-on-bone contact. The weapon left almost no identifying marks — smooth and featureless.` },
      { type: "coroner", text: `Dr. Marsh's assessment: this was a weapon of opportunity — something heavy and within arm's reach of the killer when violence erupted.` },
    ],
    "Garrote": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: pronounced ligature marks around the victim's neck. The pattern indicates a thin cord or wire pulled with considerable force.` },
      { type: "coroner", text: `Coroner's notes: the victim's face is darkened with post-mortem lividity. Death came slowly through strangulation — the victim remained conscious for the duration.` },
      { type: "coroner", text: `Forensic analysis: fibers recovered from the wound — a mixture of silk and metal. The garrote was fashioned from materials available within the castle itself.` },
      { type: "coroner", text: `Dr. Marsh's assessment: this method required strength, proximity, and considerable ruthlessness. The killer pressed home the attack without hesitation or mercy.` },
    ],
    "Pillow": [
      { type: "coroner", text: `Dr. Marsh's autopsy report: the body shows signs of asphyxiation — the face discolored, lips darkened, eyes showing petechial hemorrhaging.` },
      { type: "coroner", text: `Coroner's notes: minimal external trauma. No defensive wounds. The victim may have been asleep or unconscious when the attack began.` },
      { type: "coroner", text: `Forensic finding: fibers consistent with bed linens discovered in the victim's mouth and airways. The killer used something soft yet effective to smother the air from their lungs.` },
      { type: "coroner", text: `Dr. Marsh's final assessment: this method suggests proximity and intimacy. The killer was close enough to apply sustained pressure without struggle.` },
    ],
  };

  // ── CLUE TEMPLATES ───────────────────────────────────────
  // Each template is a function(scenario) → string
  // Category: "document" | "physical" | "witness"

  function buildCluePool(s) {
    const v      = s.victim.name;
    const k      = s.killer.name;
    const kr     = s.killer.role;
    const room   = s.crimeRoom.name;
    const weapon = s.weapon;
    const tod    = s.timeOfDeath;

    // Innocents available for alibi clues and red herrings
    const innocents = _shuffle(
      SUSPECTS.filter(p => p.id !== s.killer.id && p.id !== s.victim.id)
    );
    const rh = innocents.slice(0, 4);   // red-herring suspects
    const ab = innocents.slice(4, 9);   // alibi suspects (up to 5)

    // ── FRAGMENT CLUES ───────────────────────────────────────
    // The killer's name never appears alone. Each fragment reveals only
    // one piece of the picture. Players must cross-reference to identify.
    //
    // Fragment A — Scene: places the crime in the room, names no one.
    // Fragment B — Object: links the weapon to an unnamed person's belongings.
    // Fragment C — Identity: names the killer but in an unrelated context,
    //              forcing the player to connect it with A and B.
    //
    // We generate 3 sets of (A, B, C) so the scenario has variety each game.

    const fragmentSets = [
      // Set 1
      [
        { type: "physical",  fragment: "scene",    text: `A ${weapon} was found concealed beneath the floorboards near the ${room} entrance. It had been recently used and hastily hidden. No fingerprints survived — but a single dark thread clings to the handle.` },
        { type: "physical",  fragment: "object",   text: `The dark thread recovered from the concealed ${weapon} is a match for a coat kept in one of the castle's private quarters. The coat belongs to whoever occupies that room — their name is not yet confirmed.` },
        { type: "document",  fragment: "identity", text: `A guest register lists the occupant of that private quarter as: ${k}. Their role: ${kr}. They signed in three days before the murder and have not requested to leave.` },
      ],
      // Set 2
      [
        { type: "witness",   fragment: "scene",    text: `Miriam Locke heard a door close sharply in the direction of the ${room} at approximately ${tod}. She saw no one — only the flicker of a lamp disappearing around the corner.` },
        { type: "document",  fragment: "object",   text: `A private letter recovered from the ${room} reads: "Return what you borrowed before morning. The other party is asking questions." It is addressed to no one by name — only "the one who knows what they did."` },
        { type: "witness",   fragment: "identity", text: `Harold Finch confirms that at ${tod}, only one person had reason to be near that wing of the castle: ${k}, who had earlier asked him which corridor was quietest at that hour.` },
      ],
      // Set 3
      [
        { type: "physical",  fragment: "scene",    text: `Soil from the flower beds directly beneath the ${room} window was tracked through the service corridor — the prints are fresh, made the night of the murder, and belong to someone who left by the window rather than the door.` },
        { type: "physical",  fragment: "object",   text: `The boot prints in the service corridor match a size and tread pattern found in only one pair of boots stored in the castle — currently claimed by a guest whose identity is recorded in the housekeeper's log.` },
        { type: "document",  fragment: "identity", text: `The housekeeper's boot log lists a single guest matching that description: ${k}. The boots were signed out the afternoon of the murder and returned the following morning, still damp.` },
      ],
      // Set 4
      [
        { type: "witness",   fragment: "scene",    text: `Edgar Bell, the night watchman, was asked to avoid the ${room} corridor between ${tod} and dawn. He thought the request odd but complied. He now believes that was a mistake.` },
        { type: "document",  fragment: "object",   text: `A note found on Edgar Bell's rounds reads: "Keep clear of the east passage tonight — a private matter is being resolved." It is unsigned, written in a hand he did not recognise at the time.` },
        { type: "witness",   fragment: "identity", text: `When shown the note again, Edgar Bell recalled: the person who handed it to him was ${k}. He had assumed at the time it was a domestic matter. He no longer assumes that.` },
      ],
      // Set 5
      [
        { type: "physical",  fragment: "scene",    text: `A wine glass in the ${room} bore two distinct sets of fingerprints. One belongs to ${v}. The second set was smudged beyond a full match — but the partial is consistent with someone who handled glassware regularly.` },
        { type: "witness",   fragment: "object",   text: `Rosalind Marsh confirms that the second set of prints is consistent with someone accustomed to fine glassware — their grip pattern matches a person who dines formally. She narrows it to a handful of guests.` },
        { type: "document",  fragment: "identity", text: `Cross-referencing the dining register with Rosalind Marsh's account, only one guest dined in formal settings every evening of their stay: ${k}, listed in the castle records as ${kr}.` },
      ],
    ];

    // Pick all 5 fragment sets — gives 15 fragment clues in the pool
    const chosenSets = _shuffle(fragmentSets);
    const fragmentClues = chosenSets.flat();

    // ── ALIBI CLUES (for innocent suspects) ─────────────────
    // Each alibi clue confirms an innocent was elsewhere — removing them
    // from suspicion once the player finds it. The killer has no alibi clue.
    const alibiClues = [
      { type: "witness",  alibi: true, text: `Harold Finch confirms that ${ab[0].name} was in the servants' hall all evening, playing cards with two of the kitchen staff. They were still there at ${tod} and could not have been in the ${room}.` },
      { type: "document", alibi: true, text: `A signed entry in the castle's visitor log places ${ab[1].name} at the front gatehouse at ${tod} — speaking with the gatekeeper. The gatekeeper has confirmed this in writing.` },
      { type: "witness",  alibi: true, text: `Rosalind Marsh states that ${ab[2].name} remained in the kitchen with her until well past ${tod}, helping prepare the following morning's cold breakfast. They did not leave her sight.` },
      { type: "physical", alibi: true, text: `A telegraph receipt shows ${ab[3].name} received and replied to a wire from London at ${tod}. The telegraph office is on the far side of the grounds — ten minutes from the ${room}. The timing makes their presence at the scene impossible.` },
      { type: "witness",  alibi: true, text: `Owen Calloway states he spoke with ${ab[4] && ab[4].name !== "Owen Calloway" ? ab[4].name : (ab[3] && ab[3].name !== "Owen Calloway" ? ab[3].name : ab[0].name)} near the stable block at the estimated time of death. They were inspecting a lame horse together. Calloway is certain of the time.` },
      { type: "document", alibi: true, text: `A physician's record shows ${ab[0].name} was attended to in their quarters that evening with a mild ailment. The attending nurse did not leave until well after ${tod}.` },
      { type: "witness",  alibi: true, text: `Miriam Locke confirms she passed ${ab[1].name} in the east corridor at ${tod} — they exchanged a brief word about the weather. She is certain of the time.` },
      { type: "physical", alibi: true, text: `${ab[2].name}'s signature appears in the library's lending ledger at a time that overlaps exactly with the murder. The ink and timestamp have been verified as authentic.` },
      { type: "witness",  alibi: true, text: `Three guests at the dinner table confirm ${ab[3].name} remained seated through the entire meal and was still there when the alarm was raised.` },
      { type: "document", alibi: true, text: `A letter posted by ${ab[4] && ab[4].name !== "Owen Calloway" ? ab[4].name : (ab[3] && ab[3].name !== "Owen Calloway" ? ab[3].name : ab[0].name)} from the castle's mail room bears a clerk's stamp timed at ${tod}. The mail room is at the opposite end of the castle from the ${room}.` },
    ];

    // ── DIRECT CLUES — Documents ─────────────────────────────
    const trueDocs = [
      { type: "document", text: `A page torn from a personal ledger shows a transaction of £12,000 between ${v} and ${k} — dated three days before the murder. No explanation is given.` },
      { type: "document", text: `A diary entry from ${v}: "I confronted ${k} about it this evening. The look on their face frightened me. I shall speak to Sebastian in the morning." There was no morning.` },
      { type: "document", text: `A partially drafted letter in ${k}'s hand, never sent: "If ${v} reveals what they know, everything I have built will be gone. I cannot allow that."` },
      { type: "document", text: `A folded note found tucked inside a book in the library, written in ${k}'s hand: "Meet me in the ${room} after midnight. Come alone. Tell no one."` },
      { type: "document", text: `${v}'s personal calendar. The final entry reads: "Speak to ${k} — resolve this tonight or go to the authorities." The entry is circled twice.` },
      { type: "document", text: `A letter from ${k} to an unnamed solicitor, recovered from the kitchen stove — only partially burned. It references "removing the obstacle" and "the matter in the ${room}."` },
      { type: "document", text: `A note in ${v}'s handwriting slipped under a door: "I know about the ${weapon}. We talk tonight or I talk to the constabulary." It was never replied to.` },
      { type: "document", text: `A private letter reads: "The situation with ${v} has become untenable. Steps must be taken." The stationery matches paper found in ${k}'s quarters.` },
      { type: "document", text: `An insurance policy found among ${k}'s papers names them as sole beneficiary of an asset previously held by ${v}. It was signed one week before the murder.` },
      { type: "document", text: `A telegram addressed to ${k} reads: "Do NOT let ${v} speak before morning. You know what is at stake." It was found stuffed behind a dresser in the ${room}.` },
      { type: "document", text: `A page from the castle's visitor register for the night of the murder has been torn out — but ${k}'s name can still be read on the impression left on the page beneath.` },
      { type: "document", text: `A receipt for a locksmith found among ${k}'s belongings, dated two days before the murder, references a lock matching the door of the ${room}.` },
      { type: "document", text: `${v}'s solicitor received a letter the morning after the murder, written by ${v} on the evening of their death: "If something happens to me, speak to ${k} first."` },
      { type: "document", text: `A handwritten note in ${k}'s room, hidden inside a hollowed book: "It ends tonight. There is no other way." The date matches the night of the murder.` },
    ];

    // ── DIRECT CLUES — Physical ───────────────────────────────
    const truePhys = [
      { type: "physical", text: `Fibres from a distinctive coat were found on the door frame of the ${room}. The coat belongs to ${k} — they claimed never to have entered that room.` },
      { type: "physical", text: `A ${weapon} bearing the initials of ${k} was found hidden behind the panelling in the ${room}. It had been wiped, but not thoroughly enough.` },
      { type: "physical", text: `Muddy boot prints leading from the ${room} toward the service corridor match the sole of ${k}'s outdoor footwear exactly.` },
      { type: "physical", text: `Traces of a substance consistent with ${weapon} residue were found on a glove recovered from the waste bin in ${k}'s quarters.` },
      { type: "physical", text: `A small key found in ${k}'s coat pocket opens a locked drawer in the ${room} — the drawer which was supposed to have been empty.` },
      { type: "physical", text: `Candle wax dripped in a trail from the ${room} to the corridor outside ${k}'s quarters. The colour matches candles used exclusively in that room.` },
      { type: "physical", text: `A scarf belonging to ${k} was found bundled beneath a chair in the ${room}. It had not been dropped — it had been hidden.` },
      { type: "physical", text: `Soil from the flower beds directly below the ${room} window was found on the underside of ${k}'s boots — despite their claim to have been inside all evening.` },
      { type: "physical", text: `A wine glass in the ${room} bears two sets of fingerprints — one belonging to ${v}, the other later identified as ${k}'s.` },
      { type: "physical", text: `A broken cufflink found on the floor of the ${room}. Miriam Locke identifies it as belonging to ${k} — she polished the pair herself days before.` },
      { type: "physical", text: `The ${weapon} bears a partial palm print consistent in size and shape with ${k}'s hand. A full match could not be established but no one else has been excluded.` },
      { type: "physical", text: `${k}'s personal writing case was found unlocked in the ${room} — somewhere they claimed never to have visited.` },
    ];

    // ── DIRECT CLUES — Witness ────────────────────────────────
    const trueWit = [
      { type: "witness", text: `Harold Finch states he saw ${k} near the ${room} at approximately ${tod}. When later asked about it, ${k} denied being anywhere near that part of the castle.` },
      { type: "witness", text: `Edgar Bell confirms he saw a figure matching ${k}'s description leaving the ${room} at ${tod}. He assumed it was routine at the time.` },
      { type: "witness", text: `The groundskeeper reports that a side gate — accessible only to someone who knew the grounds — was unlatched at ${tod}. They saw ${k} returning from that direction.` },
      { type: "witness", text: `Edgar Bell states that ${k} asked him to change his patrol route and avoid the ${room} until morning. He obliged, and has regretted it since.` },
      { type: "witness", text: `The castle cook overheard ${k} say to an unknown party: "It's been handled. Don't ask me again." — approximately thirty minutes after the estimated time of death.` },
      { type: "witness", text: `A castle guest saw ${k} carrying what appeared to be a ${weapon} wrapped in cloth toward the ${room} earlier that evening. They assumed it was being moved for storage.` },
      { type: "witness", text: `Miriam Locke noticed the door to the ${room} was ajar when she passed at ${tod}. She heard a single voice inside and later identified it as ${k}'s.` },
      { type: "witness", text: `A staff member recalls that ${k} asked them earlier that day to confirm ${v}'s whereabouts for the evening. They thought nothing of it at the time.` },
      { type: "witness", text: `A kitchen maid reports seeing ${k} leave their quarters carrying a small bundle shortly before ${tod}. They returned empty-handed an hour later.` },
      { type: "witness", text: `The castle cook recalls ${k} visiting the kitchen that evening and asking if anyone else was still awake in the castle. She found the question unsettling in hindsight.` },
      { type: "witness", text: `Owen Calloway confirms the exterior window of the ${room} was forced from outside at some point that night. Only someone familiar with that wing would have known which window had a faulty latch.` },
      { type: "witness", text: `A guest passing the corridor at ${tod} heard a brief, sharp argument behind a closed door. They recognised ${k}'s voice but did not hear the other speaker.` },
    ];

    // ── CHAIN CLUES (anonymous — need cross-referencing) ─────
    const chainClues = [
      { type: "document", text: `A partially burned page recovered from the drawing room fireplace. The surviving fragment reads: "…the ${weapon} was returned to…" — the rest is ash.` },
      { type: "physical", text: `A key found in the ${room} doesn't match any known lock in that area. Rosalind Marsh identifies it as a key to the old service passages — the same passages that lead past a private quarter used by one of the castle's guests.` },
      { type: "document", text: `An unsigned note in the library reads: "The package has been moved. Check the usual place." Cross-referenced with other clues, the "usual place" is the ${room}.` },
      { type: "physical", text: `A length of twine near the ${room} matches the cut end of a piece from the groundskeeper's shed. Owen Calloway confirms the shed was accessed without his knowledge.` },
      { type: "document", text: `A torn receipt for a ${weapon} dated several months ago. The buyer's name is missing — but the delivery address is a room within Crowsnest Castle used by only one person.` },
      { type: "physical", text: `A second handprint was found on the ${weapon} — different from the first, suggesting it was handled by more than one person. Whether the second person is a witness or an accomplice is unclear.` },
      { type: "witness", text: `Harold Finch recalls a delivery arriving three days before the murder. The recipient said it was personal. The box was the right size for a ${weapon}.` },
      { type: "document", text: `A letter in the castle archives references a dispute between ${v} and another party over "the object in question." The letter is unsigned but the paper matches stationery found in a private quarter.` },
      { type: "physical", text: `A candle stub found in the ${room} is still warm. It had been lit recently — and extinguished in haste. The wax matches candles kept in only one guest's quarters.` },
      { type: "document", text: `A page torn from the castle accounts shows a payment of £40 made in cash to an unknown party — marked only "for discretion." The handwriting has not been identified.` },
      { type: "witness", text: `Edgar Bell reports that someone asked him the location of the ${room} three days before the murder. He did not recognise the voice and assumed it was a new guest.` },
      { type: "physical", text: `A single glove was found near the scene — the left hand only. The right glove has not been located. The size rules out most of the castle's residents.` },
      { type: "document", text: `A love letter discovered in a guest's quarters is signed only with initials. It references "our secret meetings" and "the impossible choice between duty and desire." The letter is not addressed to the victim.` },
      { type: "witness", text: `Miriam Locke mentions seeing ${v} and another guest entering a private room together late one evening, weeks before the murder. The other guest's identity remains unclear.` },
      { type: "physical", text: `A portrait in the ${room} has been deliberately obscured — the face scratched away with something sharp. Behind it, written on the wall: "Lies. All lies."` },
      { type: "document", text: `A demand letter recovered from the castle archives: "You will regret what you did to me and mine. I will have recompense — or justice." It is unsigned but dated to two months before the murder.` },
      { type: "witness", text: `Harold Finch recalls ${v} saying "some secrets are worth paying to keep" during a conversation in the library. He assumed it was idle talk at the time.` },
      { type: "physical", text: `A locked strongbox found in a guest's room contains bundled banknotes totalling £300 and a list of names with sums beside them. The sums increase each month. ${v}'s name appears at the top.` },
      { type: "document", text: `A ledger page torn from the castle accounts shows "hush money" payments to an unnamed party over six months — totalling £500. The handwriting matches no one in the castle.` },
      { type: "witness", text: `Edgar Bell reports that he was offered £20 to remain silent about "certain comings and goings" in the east wing. He refused — and three days later, ${v} was murdered.` },
      { type: "physical", text: `Jewellery reported missing from ${v}'s room weeks earlier is found hidden in a guest's suitcase. When confronted, the guest claims ${v} asked them to keep it safe.` },
      { type: "document", text: `A confession written on Castle notepaper reads: "I took the money. I didn't mean to. God forgive me, I'll repay it all." The writer is not identified. It is torn and incomplete.` },
    ];

    // ── RED HERRINGS ─────────────────────────────────────────
    const redHerrings = [
      { type: "witness",  text: `${rh[0].name} was seen near the ${room} shortly before ${tod}. They claim to have been fetching something for another guest — no one has confirmed this.` },
      { type: "document", text: `A note in ${rh[1].name}'s pocket reads "Meet me at midnight — tell no one." The handwriting doesn't match any other recovered document, but the timing is suspicious.` },
      { type: "physical", text: `A glass with ${rh[0].name}'s fingerprints was found in the ${room}. They claim to have been there earlier in the day — hours before the murder.` },
      { type: "witness",  text: `${rh[2].name} was overheard arguing with ${v} in the days before the murder. The subject is unknown. ${rh[2].name} denies it took place.` },
      { type: "document", text: `A letter addressed to ${rh[1].name} reads: "If you won't do what's necessary, I will." The author is not identified. Found in the ${room}.` },
      { type: "physical", text: `A handkerchief monogrammed with ${rh[3].name}'s initials was found on the floor of the ${room}. They claim to have no memory of dropping it there.` },
      { type: "witness",  text: `Edgar Bell recalls seeing ${rh[2].name} near the ${room} at an odd hour. When approached the following morning, ${rh[2].name} offered three different explanations.` },
      { type: "document", text: `A torn page from ${rh[0].name}'s journal references "a decision that cannot be undone" and "the only path remaining." The entry is from the day of the murder.` },
      { type: "physical", text: `${rh[3].name}'s coat was found hanging near the ${room} entrance, bearing a faint smell consistent with the area where the murder took place.` },
      { type: "witness",  text: `Rosalind Marsh recalls ${rh[1].name} asking her whether the kitchen knives had been counted that evening — an unusual question she later thought significant.` },
      { type: "document", text: `A note found in the ${room} reads: "I know you were there. Don't make me say it aloud." It is addressed to ${rh[2].name} and is unsigned.` },
      { type: "witness",  text: `A guest reports that ${rh[0].name} appeared agitated at dinner and left early — before the meal had finished. No explanation was given.` },
      { type: "physical", text: `A pocket watch belonging to ${rh[1].name} was found near the scene. They claim it was stolen from their room earlier in the week.` },
      { type: "document", text: `An unsigned note slipped under ${rh[2].name}'s door reads: "Say nothing about what you saw. For both our sakes." ${rh[2].name} claims not to know who sent it.` },
      { type: "witness",  text: `Miriam Locke overheard ${rh[3].name} say "it had to be done" to themselves while passing in the corridor late that evening. When questioned, ${rh[3].name} said they were rehearsing a speech.` },
      { type: "physical", text: `A muddy boot print near the back entrance matches a size consistent with ${rh[0].name} — but also with several other guests of similar stature.` },
      { type: "document", text: `A letter from ${rh[1].name} to an unknown recipient was intercepted by the castle post: "Everything depends on tonight. Do not fail me."` },
      { type: "witness",  text: `${rh[2].name} was seen entering the castle from the gardens at an unusual hour. When asked, they said they had been unable to sleep and went for air.` },
      { type: "physical", text: `A candle partially burned was discovered in ${rh[0].name}'s quarters — but its wick matches fragments found near the ${room}. Coincidence or connection?` },
      { type: "witness",  text: `Multiple staff report seeing ${rh[1].name} moving about the corridors well after their usual bedtime. They seemed to be searching for something — or someone.` },
      { type: "document", text: `A ledger page discovered in ${rh[3].name}'s personal effects shows they owed ${v} a considerable sum of money. The debt has no explanation — personal loan? Gambling? Blackmail?` },
      { type: "physical", text: `${rh[2].name}'s right hand bears fresh scratches, consistent with violent struggle. They explain the marks as "accidental" — from gardening work that morning.` },
      { type: "witness",  text: `Harold Finch recalls that ${rh[0].name} was seen handling the ${weapon} in the days before the murder — supposedly "admiring" it in the armory. An odd choice of pastime.` },
      { type: "document", text: `A draft letter in ${rh[1].name}'s handwriting begins: "You have left me no choice but to..." The letter is unfinished and unsigned, but chilling in its implications.` },
      { type: "physical", text: `Traces of the castle's distinctive cologne — the type worn exclusively by ${rh[3].name} — were found on the victim's clothing. They claim they brushed past them earlier in the day.` },
      { type: "witness",  text: `A guest distinctly remembers ${rh[2].name} mentioning the ${room} by name weeks earlier — stating a need to "retrieve something valuable" from there. No such retrieval ever took place.` },
      { type: "document", text: `An embroidered handkerchief bearing ${rh[1].name}'s family crest was discovered beneath the victim's mattress — placed there intentionally or carelessly discarded?` },
      { type: "physical", text: `${rh[0].name}'s shoes match the distinctive tread found in the dust outside the ${room}. They claim to own several pairs of the same style — a common excuse.` },
      { type: "witness",  text: `The castle's night porter overheard ${rh[3].name} weeping behind a locked door on the evening of the murder. They insisted they were simply "upset about a personal matter."` },
      { type: "document", text: `A telegram found among ${rh[2].name}'s belongings arrives from an unknown sender the day before the murder: "The matter must be resolved tonight. No delays." Unsigned.` },
      { type: "physical", text: `Ash from a particular Turkish cigarette — smoked exclusively by ${rh[1].name} — was found on the victim's desk. ${rh[1].name} admits to visiting but claims it was days prior.` },
      { type: "witness",  text: `Rosalind Marsh swears she saw ${rh[0].name} carrying a bundle wrapped in cloth — roughly the size of the ${weapon}} — into the east wing hours before the murder. They deny it entirely.` },
      { type: "document", text: `A photograph discovered in the victim's private correspondence shows ${rh[3].name} and another figure in an embrace — clearly recent. The identity of the other person remains unclear.` },
      { type: "physical", text: `${rh[2].name}'s clothing bears tiny flecks of a rare paint pigment used only in the victim's private study. They have no explanation for how it came to be there.` },
    ];

    // ── CORONER CLUES (weapon autopsy fragments) ─────────────
    const coronerSet = CORONER_CLUES[weapon] || [];
    const coronerClues = coronerSet.map(c => ({ ...c, coroner: true }));

    // ── ASSEMBLE ─────────────────────────────────────────────
    // Pool: 15 fragments + 5 alibis + 4 coroner + direct + chain + red herrings
    const directFull = _shuffle([...trueDocs, ...truePhys, ...trueWit]);
    const full = [
      ...fragmentClues,   // 15 (must cross-reference to name killer)
      ...alibiClues,      //  5 (eliminate innocents)
      ...coronerClues,    //  4 (weapon autopsy — identify the murder weapon)
      ...directFull,      // 20 (direct evidence, spread by selection)
      ...chainClues,      // 22 (anonymous, need combining + affair/blackmail/theft)
      ...redHerrings,     // 34 (point at innocents with more sophisticated misdirection)
    ];

    return full;
  }

  // ── UTILITY ──────────────────────────────────────────────
  function _pick(arr)    { return arr[Math.floor(Math.random() * arr.length)]; }
  function _shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function _randomTime() {
    const h = 22 + Math.floor(Math.random() * 5); // 22–02
    const m = Math.floor(Math.random() * 4) * 15;  // :00 :15 :30 :45
    const hour = h >= 24 ? h - 24 : h;
    return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  // ── PUBLIC API ───────────────────────────────────────────
  async function init() {
    // Nothing async needed — placeholder for parity with existing calls
    return Promise.resolve();
  }

  function generate() {
    // Pick victim — 70% named person, 30% unnamed guest
    let victim;
    if (Math.random() < 0.7) {
      victim = { ..._pick(SUSPECTS) };
    } else {
      const gname = _pick(GUEST_NAMES);
      victim = { id: "guest_" + Date.now(), name: gname, role: "Castle guest", motive: null };
    }

    // Pick killer — always a named suspect, never the victim
    const killerPool = SUSPECTS.filter(p => p.id !== victim.id);
    const killer = { ..._pick(killerPool) };

    // Pick room and weapon
    const crimeRoom = _pick(ROOMS);
    const weaponObj  = _pick(WEAPONS);
    const weapon    = weaponObj.name;
    const timeOfDeath = _randomTime();

    const scenario = {
      version:     2,
      generatedAt: Date.now(),
      detective:   { name: "Jim Smart", nickname: "Bull" },
      victim,
      killer,
      crimeRoom,
      weapon,
      weaponPremeditated: weaponObj.premeditated,
      motive:      killer.motive,
      timeOfDeath,
      cluesRequired: 15,
      clues:       [],          // filled as player explores
      accused:     null,
      solved:      false,
    };

    // Build the pool then select a balanced 20-clue active set.
    // Always include: all 6 fragments (player must cross-reference)
    //                 all 5 alibis (player eliminates innocents)
    //                 9 more from direct/chain/red-herring pool
    const fullPool = buildCluePool(scenario);
    const fragments  = fullPool.filter(c => c.fragment);
    const alibis     = fullPool.filter(c => c.alibi);
    const remainder  = _shuffle(fullPool.filter(c => !c.fragment && !c.alibi));

    // From remainder: take a spread of types
    const remDoc  = _shuffle(remainder.filter(c => c.type === "document"));
    const remPhys = _shuffle(remainder.filter(c => c.type === "physical"));
    const remWit  = _shuffle(remainder.filter(c => c.type === "witness"));
    const remFill = _shuffle([
      ...remDoc.slice(0, 7),
      ...remPhys.slice(0, 7),
      ...remWit.slice(0, 6),
    ]);

    const coroners   = fullPool.filter(c => c.coroner);
    const selected = _shuffle([
      ...fragments,          // 15 — all fragment sets
      ...alibis,             //  5 — always present
      ...coroners,           //  4 — all coroner/weapon clues always included
      ...remFill.slice(0,16),// 16 — mixed remainder (reduced to keep total ~40)
    ]); // = 40 clues total

    // ── AUTO ASSIGN CLUES TO ROOMS ────────────────────────────────────────
    // Rules:
    //   - Crime room gets 2 clues (still the hot spot, but not a pile)
    //   - All other clues spread 1 per room across as many rooms as possible
    //   - Max 2 clues per room castle-wide

    const crimeFloor  = crimeRoom.floor;
    const sameFloor   = ROOMS.filter(r => r.id !== crimeRoom.id && r.floor === crimeFloor);
    const otherRooms  = _shuffle(ROOMS.filter(r => r.id !== crimeRoom.id && r.floor !== crimeFloor));
    const allOther    = _shuffle([...sameFloor, ...otherRooms]);

    // First pass: 2 in crime room, then 1 per room across all others
    const roomAssignments = [crimeRoom.id, crimeRoom.id];
    const roomCount = {};
    roomCount[crimeRoom.id] = 2;

    for (const r of allOther) {
      if (roomAssignments.length >= selected.length) break;
      roomAssignments.push(r.id);
      roomCount[r.id] = 1;
    }
    // Second pass: add a second clue to rooms that only have 1, if we still need more
    for (const r of allOther) {
      if (roomAssignments.length >= selected.length) break;
      if ((roomCount[r.id] || 0) < 2) {
        roomAssignments.push(r.id);
        roomCount[r.id] = (roomCount[r.id] || 0) + 1;
      }
    }

    // Attach room assignment to each clue
    scenario.cluePool = selected.map((clue, i) => ({
      ...clue,
      assignedRoom: roomAssignments[i],
      poolIndex:    i,
      collected:    false,
    }));

    // Build a quick lookup: roomId → [clue, clue, ...]
    scenario.roomClues = {};
    scenario.cluePool.forEach(clue => {
      if (!scenario.roomClues[clue.assignedRoom]) {
        scenario.roomClues[clue.assignedRoom] = [];
      }
      scenario.roomClues[clue.assignedRoom].push(clue);
    });

    return scenario;
  }

  // Check accusation — returns { correct, wrongFields[] }
  function accuse(scenario, suspectId, roomId, weaponName) {
    const wrongFields = [];
    if (suspectId !== scenario.killer.id)       wrongFields.push("suspect");
    if (roomId    !== scenario.crimeRoom.id)    wrongFields.push("room");
    if (weaponName.toLowerCase() !== (scenario.weapon || "").toLowerCase()) wrongFields.push("weapon");
    const correct = wrongFields.length === 0;
    return { correct, wrongFields };
  }

  // Returns clues assigned to this room that haven't been collected yet
  function getRoomClues(scenario, roomId) {
    if (!scenario.roomClues) return [];
    return (scenario.roomClues[roomId] || []).filter(c => !c.collected);
  }

  // Mark a clue as collected and return it formatted for the notebook
  function collectClue(scenario, clue) {
    // Mark in roomClues
    const roomList = scenario.roomClues[clue.assignedRoom] || [];
    const match = roomList.find(c => c.poolIndex === clue.poolIndex);
    if (match) match.collected = true;
    // Also mark in cluePool
    const poolMatch = scenario.cluePool.find(c => c.poolIndex === clue.poolIndex);
    if (poolMatch) poolMatch.collected = true;

    return {
      id:        `clue_${clue.poolIndex}_${clue.assignedRoom}`,
      poolIndex: clue.poolIndex,
      type:      clue.type,
      text:      clue.text,
      room:      clue.assignedRoom,
      found:     true,
      foundAt:   Date.now(),
    };
  }

  // Legacy helper kept for compatibility
  function drawClue(scenario, roomId) {
    const available = getRoomClues(scenario, roomId);
    if (!available.length) return null;
    return collectClue(scenario, available[0]);
  }

  function regeneratePool(scenario) {
    try {
      const fullPool = buildCluePool(scenario);
      const fragments = fullPool.filter(c => c.fragment);
      const alibis    = fullPool.filter(c => c.alibi);
      const remainder = _shuffle(fullPool.filter(c => !c.fragment && !c.alibi));
      const remDoc    = _shuffle(remainder.filter(c => c.type === "document"));
      const remPhys   = _shuffle(remainder.filter(c => c.type === "physical"));
      const remWit    = _shuffle(remainder.filter(c => c.type === "witness"));
      const remFill   = _shuffle([...remDoc.slice(0,3), ...remPhys.slice(0,3), ...remWit.slice(0,3)]);
      const selected  = _shuffle([...fragments, ...alibis, ...remFill.slice(0,9)]);

      // Re-attach saved assignedRoom and collected status from slim pool
      const slimMap = {};
      (scenario.cluePool || []).forEach(c => { slimMap[c.poolIndex] = c; });

      const cluePool = selected.map((clue, i) => {
        const slim = slimMap[i] || {};
        return {
          ...clue,
          poolIndex:    i,
          assignedRoom: slim.assignedRoom || clue.assignedRoom || scenario.crimeRoom.id,
          collected:    slim.collected || false,
        };
      });

      const roomClues = {};
      cluePool.forEach(clue => {
        if (!roomClues[clue.assignedRoom]) roomClues[clue.assignedRoom] = [];
        roomClues[clue.assignedRoom].push(clue);
      });

      return { cluePool, roomClues };
    } catch(e) {
      console.warn("regeneratePool failed:", e);
      return null;
    }
  }

  // ── WEAPON → 3D model kind mapping ──────────────────────────────────────
  const WEAPON_3D_KIND = {
    "Gun":              "gun",
    "Dagger":           "dagger",
    "Blade":            "blade",
    "Rope":             "rope",
    "Candlestick":      "candlestick",
    "Poker":            "poker",
    "Bottle":           "bottle",
    "Bookend":          "bookend",
    "Paperweight":      "paperweight",
    "Hammer":           "hammer",
    "Axe":              "axe",
    "Chisel":           "chisel",
    "Goblet":           "goblet",
    "Vase":             "vase",
    "Fireplace Shovel": "shovel",
    "Wrench":           "wrench",
    "Letter Opener":    "letteropener",
    "Curtain Rod":      "curtainrod",
    "Garrote":          "garrote",
    "Pillow":           "pillow",
    "Poison":           "bottle",      // vial/bottle model
    "Arsenic":          "bottle",
    "Strychnine":       "bottle",
    "Cyanide":          "bottle",
  };

  // ── Room → floor1 corridor XZ spawn positions ───────────────────────────
  // Evidence items for a room appear near the room door in the corridor
  const ROOM_SPAWN_XZ = {
    "ballroom":          { x: -2605, z: -1600 },
    "library":           { x: -1333, z: -1600 },
    "livingroom":        { x:  -174, z: -1000 },
    "chapel":            { x:  -174, z:  -350 },
    "washroom":          { x:   753, z:   300 },
    "storage":           { x:  1641, z:   400 },
    "drawingroom":       { x:  2750, z:   650 },
    "pantry":            { x:  2450, z:   800 },
    "kitchen":           { x:   737, z:  1380 },
    "livingquarters":    { x: -1183, z:  1380 },
  };
  const DEFAULT_SPAWN_XZ = { x: -1900, z: -1600 };

  // Returns array of evidence items to physically spawn in the world.
  // Always includes the murder weapon. Adds up to 4 red-herring weapons
  // from different rooms so the player has to search.
  function getEvidenceSpawns(scenario) {
    const spawns = [];

    // Murder weapon — spawn near the crime room door (or corridor default)
    const murderPos = ROOM_SPAWN_XZ[scenario.crimeRoom.id] || DEFAULT_SPAWN_XZ;
    spawns.push({
      kind:     WEAPON_3D_KIND[scenario.weapon] || "bookend",
      name:     scenario.weapon,
      isMurderWeapon: true,
      room:     scenario.crimeRoom.id,
      x: murderPos.x,
      y: -9000,   // buried underground — proximity hint only
      z: murderPos.z,
      icon: _weaponIcon(scenario.weapon),
      body: `The murder weapon. Found near the ${scenario.crimeRoom.name}.`,
    });

    // Red-herring weapons — pick 3 other weapons and random rooms
    const otherWeapons = _shuffle(WEAPONS.filter(w => w.name !== scenario.weapon)).slice(0, 3);
    const otherRooms   = _shuffle(Object.keys(ROOM_SPAWN_XZ).filter(r => r !== scenario.crimeRoom.id));
    otherWeapons.forEach((w, i) => {
      const roomId = otherRooms[i] || otherRooms[0];
      const pos    = ROOM_SPAWN_XZ[roomId] || DEFAULT_SPAWN_XZ;
      // Offset slightly so items don't stack
      spawns.push({
        kind:  WEAPON_3D_KIND[w.name] || "bookend",
        name:  w.name,
        isMurderWeapon: false,
        room:  roomId,
        x: pos.x + (i - 1) * 80,
        y: -9000,
        z: pos.z + 40,
        icon: _weaponIcon(w.name),
        body: `A ${w.name} found near the corridor. Its connection to the crime is unclear.`,
      });
    });

    return spawns;
  }

  function _weaponIcon(name) {
    const icons = {
      "Gun": "🔫", "Dagger": "🗡️", "Blade": "🗡️", "Rope": "🪢",
      "Candlestick": "🕯️", "Poker": "🔱", "Bottle": "🍾",
      "Bookend": "📚", "Paperweight": "🪨", "Hammer": "🔨",
      "Axe": "🪓", "Chisel": "🔧", "Goblet": "🏆", "Vase": "🏺",
      "Fireplace Shovel": "🔱", "Wrench": "🔧", "Letter Opener": "✉️",
      "Curtain Rod": "📏", "Garrote": "🪢", "Pillow": "🛏️",
      "Poison": "⚗️", "Arsenic": "⚗️", "Strychnine": "⚗️", "Cyanide": "⚗️",
    };
    return icons[name] || "🔍";
  }

  const WEAPON_NAMES = WEAPONS.map(w => w.name);
  return { init, generate, accuse, drawClue, getRoomClues, collectClue, regeneratePool, getEvidenceSpawns, SUSPECTS, ROOMS, WEAPONS, WEAPON_NAMES, WEAPON_3D_KIND };
})();