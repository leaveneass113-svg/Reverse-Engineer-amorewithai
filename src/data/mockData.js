export const INITIAL_CHARACTERS = [
  {
    id: "char-elena-vance",
    name: "Elena Vance",
    role: "Archivist & Scholar",
    avatar: "/assets/character_elena.jpg",
    bio: "Head curator of the private archives at Blackwood Estate. Quietly brilliant, possessing a sharp intellect and a vulnerability she guards behind ancient manuscripts and velvet gowns.",
    traits: ["Intelligent", "Observant", "Reserved", "Passionate"],
    voice: "Sophia",
    storiesCount: 3,
    createdAt: "2026-10-15T10:30:00Z"
  },
  {
    id: "char-julian-thorne",
    name: "Julian Thorne",
    role: "Lord of Blackwood",
    avatar: "/assets/character_julian.jpg",
    bio: "The enigmatic master of Blackwood Manor. Aristocratic, fiercely protective, haunted by family secrets and captivated by Elena's refusal to bow to his command.",
    traits: ["Commanding", "Brooding", "Protective", "Charismatic"],
    voice: "Liam",
    storiesCount: 3,
    createdAt: "2026-10-15T11:00:00Z"
  },
  {
    id: "char-genevieve-dubois",
    name: "Lady Genevieve",
    role: "Rival Antiquarian",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "A Parisian socialite and antique collector with a penchant for high-stakes games and uncovering forbidden historical lore before anyone else.",
    traits: ["Ambitious", "Sharp-tongued", "Mysterious", "Calculating"],
    voice: "Emma",
    storiesCount: 1,
    createdAt: "2026-10-20T14:20:00Z"
  }
];

export const INITIAL_RELATIONSHIPS = [
  {
    id: "rel-1",
    char1Id: "char-elena-vance",
    char2Id: "char-julian-thorne",
    kind: "Lovers",
    description: "An intoxicating pull forbidden by oath, simmering behind closed library doors."
  },
  {
    id: "rel-2",
    char1Id: "char-elena-vance",
    char2Id: "char-genevieve-dubois",
    kind: "Rivals",
    description: "Competing to translate the forgotten codex of Blackwood."
  },
  {
    id: "rel-3",
    char1Id: "char-julian-thorne",
    char2Id: "char-genevieve-dubois",
    kind: "Exes",
    description: "A diplomatic engagement ended in cold civility years ago."
  }
];

export const INITIAL_STORIES = [
  {
    id: "8760f9fd-3c2e-4ed2-8d4a-ac1f0249cbee",
    title: "Midnight Whispers: A Dark Academia Romance",
    subtitle: "In the shadowed corridors of Blackwood Manor, silence was never safe.",
    cover: "/assets/story_cover_midnight.jpg",
    author: "Evelyn Reed",
    tags: ["Dark Academia", "Forbidden Romance", "Slow Burn", "Aristocracy"],
    wordCount: 4850,
    estimatedMinutes: 18,
    progress: 35,
    lastRead: "Just now",
    characters: ["Elena Vance", "Julian Thorne"],
    chapters: [
      {
        number: 1,
        title: "The Restricted Vault",
        paragraphs: [
          "The grandfather clock in the gallery chimed midnight, twelve low iron notes that seemed to vibrate directly through the parquetry floor. In the private library of Blackwood Manor, Elena Vance did not lift her quill.",
          "Dust motes danced in the solitary pool of amber illumination cast by her desk lamp. Before her lay the leather-bound ledger—its vellum pages yellowed with centuries of unread secrets. She had been warned twice by the estate steward: the fourth floor east wing was strictly off-limits to guests after sundown.",
          "A quiet rustle behind the mahogany shelves caught her breath. The air grew perceptibly cooler, carrying the faint, intoxicating scent of cedarwood, bitter espresso, and rain.",
          "\"You read with an intensity that borders on heresy, Miss Vance.\"",
          "Elena turned. Julian Thorne stood in the threshold of the arches. His dark charcoal waistcoat was unbuttoned at the throat, his collar slightly loosened. In the dim candlelight, the angles of his jaw were cast in sharp relief.",
          "\"Lord Thorne,\" Elena said, keeping her voice as steady as her pulse would allow. \"I understood the archives were cataloged at your discretion.\"",
          "\"At my discretion, yes,\" Julian replied softly, taking two deliberate steps into the room until he stood just inches from the edge of her mahogany writing desk. \"Not in secret. And certainly not when the house sleeps.\"",
          "His gaze dipped to the open manuscript between her trembling hands, then lifted back to her eyes—unflinching, obsidian, and filled with an ember she hadn't dared to ignite."
        ]
      },
      {
        number: 2,
        title: "Shadows and Cider",
        paragraphs: [
          "Neither moved. The storm outside lashed against the cathedral stained-glass windows, rain cascading like melted silver down the gothic panes.",
          "\"I was verifying the 1892 lineage record,\" Elena whispered, though in the vast quiet of the library, the whisper resonated like a confession.",
          "Julian leaned in, one palm resting firmly against the aged wood beside her inkwell. The proximity was intoxicating. Elena could hear the faint rhythm of his breathing, steady yet edged with tension.",
          "\"The records do not change at midnight, Elena,\" he murmured, his voice dropping into that low, velvet cadence that made her fingers curl against the velvet fabric of her dress. \"What were you truly searching for?\"",
          "\"Answers you have refused to speak aloud.\"",
          "A ghost of a smile touched Julian's lips—dangerous, appreciative, and entirely unrepentant. He reached out, his thumb gently grazing the ink stain on her index finger. A tremor shot up her spine at the contact, warm and electric."
        ]
      },
      {
        number: 3,
        title: "The Unspoken Vow",
        paragraphs: [
          "\"You ask questions that will tear down this entire house,\" he warned, though he did not pull his hand away. Instead, his fingers curled around hers, lifting her hand from the page with deliberate reverence.",
          "\"Perhaps this house has stood in the dark for far too long,\" she countered, refusing to avert her eyes.",
          "\"And what if the darkness is what keeps you safe?\" Julian's thumb traced the line of her wrist, measuring the wild, erratic cadence of her heartbeat. \"What if I am what keeps you safe?\"",
          "The distance between them vanished like mist before fire. In that quiet sanctuary of ancient books and forgotten promises, Elena knew there was no returning to the scholar she had been when she first arrived at Blackwood."
        ]
      }
    ]
  },
  {
    id: "story-velvet-oath",
    title: "The Velvet Oath",
    subtitle: "A arranged marriage of convenience between two sworn rivals in Renaissance Venice.",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    author: "Elena & Julian",
    tags: ["Enemies to Lovers", "Historical Romance", "Venice", "Intrigue"],
    wordCount: 3200,
    estimatedMinutes: 12,
    progress: 100,
    lastRead: "Yesterday",
    characters: ["Elena Vance", "Julian Thorne", "Lady Genevieve"],
    chapters: [
      {
        number: 1,
        title: "The Gondola at Dusk",
        paragraphs: [
          "The lagoon mirrored the twilight sky in hues of bruised amethyst and gold. Elena pulled her silk cloak tighter against the evening damp, watching the cloaked figure steer the gondola into the shadowed canal.",
          "\"You took a significant risk coming alone,\" Julian's voice drifted through the fog, silhouetted against the lantern light.",
          "\"I take risks only when the prize justifies the danger,\" Elena replied."
        ]
      }
    ]
  }
];

export const SURPRISE_PROMPTS = [
  "A cold thunderstorm traps a quiet archivist and a brooding billionaire in a secluded mountain estate library with only one fireplace lit.",
  "An arranged royal marriage between sworn rival kingdoms, where the icy prince discovers his new bride is a covert master spy.",
  "Two rival surgeons who have competed for chief of medicine for five years are forced into sharing a single hotel room during a blizzard conference.",
  "A Victorian lady secretly writes scandalous romance novels under a pseudonym, until London's most notorious rake discovers her manuscript.",
  "A bodyguard sworn to silence begins to lose his professional detachment when his high-profile client refuses to leave his side during a dangerous gala.",
  "An ancient vampire lord hires a mortal forensic historian to decipher an ancient diary that contains the secret of his lost humanity."
];

export const AUDIO_VOICES = [
  { id: "Sophia", name: "Sophia", tone: "Warm, Breathless & Intimate", gender: "Female", pitch: 1.1, rate: 0.95 },
  { id: "Liam", name: "Liam", tone: "Deep, Velvety & Commanding", gender: "Male", pitch: 0.85, rate: 0.95 },
  { id: "Emma", name: "Emma", tone: "Refined, Melodic & Expressive", gender: "Female", pitch: 1.0, rate: 1.0 },
  { id: "Alexander", name: "Alexander", tone: "Crisp, Aristocratic & Intense", gender: "Male", pitch: 0.9, rate: 0.98 },
  { id: "Narrator", name: "The Narrator", tone: "Neutral, Cinematic & Atmospheric", gender: "Neutral", pitch: 1.0, rate: 1.0 }
];
