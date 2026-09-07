export interface Hotspot {
  id: string;
  type: "dragdrop" | "video" | "audio" | "game";
  label: string;
  subLabel?: string;
  top: string; // percentage string, e.g. "75%"
  left: string; // percentage string, e.g. "50%"
  icon?: string;
}

export interface EBookPageData {
  pageNumber: number;
  title: string;
  subtopic: string;
  image: string;
  keywords: string[];
  contentSummary: string;
  hotspots?: Hotspot[];
}

export const EBOOK_PAGES: EBookPageData[] = [
  {
    pageNumber: 128,
    title: "Unit 15: Friends From Around The World",
    subtopic: "Listening & Speaking: World Map (Part 1)",
    image: "/material_pages/page_128.jpg",
    keywords: ["canada", "ethan", "emma", "french", "poutine", "butter tarts", "italy", "carlo", "maria", "italian", "pizza", "pasta", "south africa", "onika", "kima", "afrikaans", "biltong", "bobotie", "sakura", "hiroto", "japan", "sushi", "ramen"],
    contentSummary: "Listening and speaking lesson introducing children from Canada, Italy, South Africa, and Japan. Includes country names, languages, and traditional foods.",
    hotspots: [
      {
        id: "dragdrop-128",
        type: "dragdrop",
        label: "Launch Matching Activity",
        subLabel: "Match Girl/Boy names, Country, Language & Food",
        top: "85%",
        left: "48%",
      },
    ],
  },
  {
    pageNumber: 129,
    title: "Friends From Around The World (Part 2)",
    subtopic: "Listening & Speaking: World Map (Part 2)",
    image: "/material_pages/page_129.jpg",
    keywords: ["turkey", "ahmet", "leyla", "turkish", "kebab", "sarma", "japan", "hiroto", "sakura", "japanese", "ramen", "sushi", "thailand", "chairat", "somsri", "thai", "tom yum", "pad thai", "australia", "lucas", "olivia", "english", "roast lamb", "meat pies", "drag and drop", "matching table"],
    contentSummary: "World map continuation showing Turkey, Japan, Thailand, and Australia. Features the matching table activity for cultural demographics.",
    hotspots: [
      {
        id: "dragdrop-129",
        type: "dragdrop",
        label: "Launch Matching Activity",
        subLabel: "Interactive Drag & Drop Table",
        top: "76%",
        left: "50%",
      },
    ],
  },
  {
    pageNumber: 130,
    title: "Country Spotlight: Japan & India",
    subtopic: "Reading: Let's Read",
    image: "/material_pages/page_130.jpg",
    keywords: ["japan", "kimigayo", "hinomaru", "japanese", "chopsticks", "sushi", "bowing", "kimono", "india", "jana gana mana", "tiranga", "hindi", "sari", "dhoti", "namaste", "asia", "video", "animation"],
    contentSummary: "Reading passage comparing Japanese and Indian traditions, national anthems, flags, cuisine, clothing, and polite greetings.",
    hotspots: [
      {
        id: "video-130",
        type: "video",
        label: "Watch Japan & India Video",
        subLabel: "Interactive Animated Cultural Showcase",
        top: "45%",
        left: "50%",
      },
    ],
  },
  {
    pageNumber: 131,
    title: "Why Do People Have Different Colour Skin?",
    subtopic: "Reading: Diversity & Unity",
    image: "/material_pages/page_131.jpg",
    keywords: ["skin colour", "sophie", "father", "melanin", "sunlight", "human race", "equality", "diversity"],
    contentSummary: "Reading lesson exploring why humans have different skin tones and celebrating equality across cultures.",
  },
  {
    pageNumber: 132,
    title: "Writing: Korea & Philippines Mind Map",
    subtopic: "Writing: Let's Write",
    image: "/material_pages/page_132.jpg",
    keywords: ["korea", "philippines", "mind map", "koreans", "filipinos", "won", "peso", "rice", "christians"],
    contentSummary: "Writing activity featuring mind maps for Korea and the Philippines with currency, food, and culture facts.",
  },
  {
    pageNumber: 133,
    title: "Writing: Pen Pal Hong Hanh from Vietnam",
    subtopic: "Writing: Profile Cards",
    image: "/material_pages/page_133.jpg",
    keywords: ["hong hanh", "vietnam", "ho chi minh city", "vietnamese", "dong", "buddhist", "pen pal", "nisha"],
    contentSummary: "Profile card detailing Nisha's pen pal Hong Hanh from Ho Chi Minh City, Vietnam.",
  },
  {
    pageNumber: 134,
    title: "Grammar: Prepositions of Location",
    subtopic: "Grammar: Let's Practise",
    image: "/material_pages/page_134.jpg",
    keywords: ["grammar", "prepositions", "location", "near", "over", "under", "beside", "bucket", "head"],
    contentSummary: "Grammar practice focusing on prepositions of location such as near, over, under, and beside.",
  },
  {
    pageNumber: 135,
    title: "Poem: The Crayon Box That Talked",
    subtopic: "Language Arts: Poem Recitation",
    image: "/material_pages/page_135.jpg",
    keywords: ["crayon box", "shane derolf", "poem", "red", "yellow", "green", "blue", "black", "white", "orange", "unique", "together", "audio", "recite"],
    contentSummary: "Popular poem by Shane DeRolf teaching unity, diversity, and togetherness through talking crayons.",
    hotspots: [
      {
        id: "audio-135",
        type: "audio",
        label: "Listen to Poem Audio",
        subLabel: "Narration with Karaoke Text Highlighting",
        top: "60%",
        left: "59%",
      },
    ],
  },
  {
    pageNumber: 136,
    title: "Star Challenge Board Game (Left Board)",
    subtopic: "Gamification: Board Game (Part 1)",
    image: "/material_pages/page_136.jpg",
    keywords: ["star challenge", "game", "dice", "token", "spelling", "citizen", "honest", "pronouns", "idioms", "hit the sack", "on cloud nine"],
    contentSummary: "Left section of the Star Challenge digital board game containing spelling, grammar, and idiom tiles.",
    hotspots: [
      {
        id: "game-136",
        type: "game",
        label: "Play Star Challenge Game",
        subLabel: "Interactive 3D Board Game with Dice & Trivia",
        top: "56%",
        left: "86%",
      },
    ],
  },
  {
    pageNumber: 137,
    title: "Star Challenge Board Game (Right Board)",
    subtopic: "Gamification: Board Game (Part 2)",
    image: "/material_pages/page_137.jpg",
    keywords: ["star challenge", "instructions", "bounce", "score", "spelling", "pollution", "endangered", "respect", "feeling blue"],
    contentSummary: "Right section of the Star Challenge board game containing rules, tiles, and star challenge squares.",
    hotspots: [
      {
        id: "game-137",
        type: "game",
        label: "Play Star Challenge Game",
        subLabel: "Launch Interactive Board Game",
        top: "52%",
        left: "14%",
      },
    ],
  },
  {
    pageNumber: 138,
    title: "Language Arts: The Gratitude Song",
    subtopic: "Review & Unit Conclusion",
    image: "/material_pages/page_138.jpg",
    keywords: ["gratitude song", "sing", "friends", "honest", "trust", "unit 15 summary"],
    contentSummary: "Closing song and reflection on gratitude, trust, and friendship across cultures.",
  },
];
