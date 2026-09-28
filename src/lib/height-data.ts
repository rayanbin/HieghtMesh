// Shared data and types for the Height Comparison app

export const CM_PER_INCH = 2.54;
export const CM_PER_FOOT = 30.48;

export type CharType = 'male' | 'female' | 'child' | 'object' | 'superhero' | 'monster' | 'animal';
export type Page = 'home' | 'calculator' | 'exercises' | 'celebrities';

export interface Character {
  id: number;
  name: string;
  height: number; // cm
  type: CharType;
  color: string;
  icon?: string;
  imageUrl?: string;      // Wikipedia profile image URL
  isCalcTarget?: boolean;
}

export function ftInToCm(ft: number, inch: number): number {
  return (ft * 12 + inch) * CM_PER_INCH;
}

export function cmToFtIn(cm: number): { ft: number; inch: number } {
  // FIX: round total inches FIRST, then derive feet/inches.
  // Computing feet and inches from the unrounded value then rounding inches
  // independently produces invalid output like 5'12" for 182 cm.
  const totalInches = Math.round(cm / CM_PER_INCH);
  return { ft: Math.floor(totalInches / 12), inch: totalInches % 12 };
}

export function formatMetric(cm: number): string {
  if (cm >= 1000) return `${(cm / 100).toFixed(cm >= 10000 ? 0 : 1)} m`;
  return `${cm.toFixed(0)} cm`;
}

export function formatImperial(cm: number): string {
  const { ft, inch } = cmToFtIn(cm);
  if (ft >= 20) return `${ft.toFixed(0)} ft`;
  return `${ft}'${inch.toFixed(0)}"`;
}

// ---- Dynamic ruler scaling helpers ----
// Tight ceilings so the ruler hugs the tallest item without wasted space.
// Spec: ≤220cm → 250cm, ≤500cm → 600cm, ≤30000cm → 35000cm, ≤44300cm → 50000cm
const NICE_STEPS = [1, 1.2, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7.5, 10];

export function niceCeil(val: number): number {
  if (val <= 0) return 200;
  const mag = Math.pow(10, Math.floor(Math.log10(val)));
  const norm = val / mag;
  // pick the smallest nice step that is >= norm * 1.05 (5% headroom for labels)
  const target = norm * 1.05;
  for (const step of NICE_STEPS) {
    if (step >= target) return step * mag;
  }
  return 10 * mag;
}

export function computeRulerMax(maxHeight: number): number {
  if (maxHeight <= 0) return 200;
  return niceCeil(maxHeight * 1.08);
}

export function computeStep(maxCm: number, targetDivisions = 10): number {
  const target = maxCm / targetDivisions;
  const mag = Math.pow(10, Math.floor(Math.log10(target)));
  const norm = target / mag;
  let nice: number;
  if (norm < 1.5) nice = 1;
  else if (norm < 3.5) nice = 2;
  else if (norm < 7.5) nice = 5;
  else nice = 10;
  return nice * mag;
}

export function computeFtStep(maxCm: number, targetDivisions = 10): number {
  const maxFt = maxCm / CM_PER_FOOT;
  const target = maxFt / targetDivisions;
  const mag = Math.pow(10, Math.floor(Math.log10(target)));
  const norm = target / mag;
  let nice: number;
  if (norm < 1.5) nice = 1;
  else if (norm < 3.5) nice = 2;
  else if (norm < 7.5) nice = 5;
  else nice = 10;
  return nice * mag;
}

// ---- Silhouette SVG path generator (category-based) ----
export function silhouettePaths(type: CharType): string {
  if (type === 'female') {
    return `
      <ellipse cx="50" cy="20" rx="11" ry="13"/>
      <path d="M40 18 Q50 8 60 18 L58 30 L42 30 Z"/>
      <rect x="46" y="32" width="8" height="6" rx="2"/>
      <path d="M32 42 Q50 38 68 42 L64 60 Q58 64 50 64 Q42 64 36 60 Z"/>
      <path d="M36 60 Q42 66 50 66 Q58 66 64 60 L65 88 Q58 95 50 95 Q42 95 35 88 Z"/>
      <path d="M34 42 L28 95 L32 97 L38 55 Z"/>
      <path d="M66 42 L72 95 L68 97 L62 55 Z"/>
      <path d="M37 88 Q42 100 41 110 L43 200 L49 200 L50 108 L51 200 L57 200 L59 110 Q58 100 63 88 Z"/>
    `;
  }
  if (type === 'child') {
    // Scaled torso/head ratios — larger head relative to body
    return `
      <ellipse cx="50" cy="28" rx="15" ry="17"/>
      <rect x="46" y="44" width="8" height="5" rx="2"/>
      <path d="M34 51 Q50 48 66 51 L62 110 Q50 114 38 110 Z"/>
      <path d="M34 52 L28 92 L32 94 L38 62 Z"/>
      <path d="M66 52 L72 92 L68 94 L62 62 Z"/>
      <path d="M42 110 L43 200 L49 200 L50 116 L51 200 L57 200 L58 110 Z"/>
    `;
  }
  if (type === 'superhero') {
    // Hulking wide avatar — broad shoulders, muscular torso (for Hulk, Superman, etc.)
    return `
      <ellipse cx="50" cy="18" rx="14" ry="16"/>
      <rect x="44" y="30" width="12" height="8" rx="3"/>
      <path d="M18 44 Q50 36 82 44 L78 100 Q50 108 22 100 Z"/>
      <path d="M22 46 L14 100 L20 104 L30 60 Z"/>
      <path d="M78 46 L86 100 L80 104 L70 60 Z"/>
      <path d="M36 100 L38 200 L48 200 L50 108 L52 200 L62 200 L64 100 Z"/>
    `;
  }
  if (type === 'monster') {
    // Hunched, oversized, menacing silhouette
    return `
      <ellipse cx="50" cy="22" rx="16" ry="18"/>
      <path d="M34 16 L40 28 L44 18 Z M66 16 L60 28 L56 18 Z"/>
      <rect x="44" y="34" width="12" height="8" rx="2"/>
      <path d="M14 48 Q50 40 86 48 L82 110 Q50 118 18 110 Z"/>
      <path d="M18 50 L8 110 L14 114 L28 64 Z"/>
      <path d="M82 50 L92 110 L86 114 L72 64 Z"/>
      <path d="M34 110 L36 200 L48 200 L50 118 L52 200 L64 200 L66 110 Z"/>
    `;
  }
  if (type === 'animal') {
    // Quadruped silhouette (for giraffe, bear, etc.) — wide stance
    return `
      <ellipse cx="50" cy="36" rx="18" ry="14"/>
      <path d="M28 36 Q20 12 32 8 L36 36 Z"/>
      <path d="M72 36 Q80 12 68 8 L64 36 Z"/>
      <rect x="20" y="48" width="60" height="40" rx="10"/>
      <path d="M22 80 L18 200 L28 200 L32 80 Z"/>
      <path d="M78 80 L82 200 L72 200 L68 80 Z"/>
      <path d="M40 80 L42 200 L50 200 L52 80 Z"/>
      <path d="M58 80 L60 200 L68 200 L70 80 Z"/>
    `;
  }
  // male (default)
  return `
    <ellipse cx="50" cy="20" rx="12" ry="14"/>
    <rect x="46" y="32" width="8" height="7" rx="2"/>
    <path d="M28 42 Q50 38 72 42 L68 96 Q50 102 32 96 Z"/>
    <path d="M28 44 L22 96 L26 98 L34 58 Z"/>
    <path d="M72 44 L78 96 L74 98 L66 58 Z"/>
    <path d="M38 96 L40 200 L48 200 L50 104 L52 200 L60 200 L62 96 Z"/>
  `;
}

export function silhouetteSVG(type: CharType, color: string): string {
  return `<svg viewBox="0 0 100 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;">
    <g fill="${color}">${silhouettePaths(type)}</g>
  </svg>`;
}

// ---- Data: celebrities with known heights ----
export const CELEB_DB: Record<string, number> = {
  'Cristiano Ronaldo': 187, 'Lionel Messi': 170, 'LeBron James': 206,
  "Shaquille O'Neal": 216, 'Usain Bolt': 195, 'Michael Jordan': 198,
  'Kobe Bryant': 198, 'Stephen Curry': 188, 'Conor McGregor': 175,
  'Mike Tyson': 178, 'Floyd Mayweather': 173, 'Roger Federer': 185,
  'Rafael Nadal': 185, 'Novak Djokovic': 188, 'Taylor Swift': 180,
  'Ariana Grande': 153, 'Tom Cruise': 170, 'Emma Watson': 165,
  'Robert Downey Jr.': 174, 'Dwayne Johnson': 196, 'Vin Diesel': 182,
  'Brad Pitt': 180, 'Angelina Jolie': 169, 'Jennifer Lawrence': 175,
  'Scarlett Johansson': 160, 'Chris Hemsworth': 191, 'Chris Evans': 183,
  'Tom Hanks': 183, 'Leonardo DiCaprio': 183, 'Kanye West': 173,
  'Jay-Z': 187, 'Beyoncé': 169, 'Rihanna': 173, 'Adele': 175,
  'Ed Sheeran': 173, 'Justin Bieber': 175, 'Selena Gomez': 165,
  'Katy Perry': 173, 'Lady Gaga': 155, 'Kim Kardashian': 159,
  'Kylie Jenner': 168, 'Kendall Jenner': 178, 'Gigi Hadid': 178,
  'Cara Delevingne': 173, 'Barack Obama': 185, 'Donald Trump': 191,
  'Joe Biden': 183, 'Elon Musk': 187, 'Jeff Bezos': 171,
  'Mark Zuckerberg': 175, 'Bill Gates': 177, 'Steve Jobs': 188,
  'Albert Einstein': 175, 'Isaac Newton': 173, 'Napoleon Bonaparte': 168,
  'Abraham Lincoln': 193, 'Robert Wadlow': 272, 'Sultan Kösen': 251,
  'Yao Ming': 226,
};

export const CELEB_QUICK = [
  { name: 'Cristiano Ronaldo', height: 187, type: 'male' as CharType, color: '#677a85' },
  { name: 'Lionel Messi', height: 170, type: 'male' as CharType, color: '#677a85' },
  { name: 'LeBron James', height: 206, type: 'male' as CharType, color: '#677a85' },
  { name: "Shaquille O'Neal", height: 216, type: 'male' as CharType, color: '#677a85' },
  { name: 'Taylor Swift', height: 180, type: 'female' as CharType, color: '#a4743f' },
  { name: 'Ariana Grande', height: 153, type: 'female' as CharType, color: '#a4743f' },
  { name: 'Tom Cruise', height: 170, type: 'male' as CharType, color: '#677a85' },
  { name: 'Dwayne Johnson', height: 196, type: 'male' as CharType, color: '#677a85' },
  { name: 'Robert Wadlow', height: 272, type: 'male' as CharType, color: '#677a85' },
  { name: 'Yao Ming', height: 226, type: 'male' as CharType, color: '#677a85' },
];

// ---- Entities & objects (cm) ----
export const ENTITIES = [
  { name: 'Door Frame', height: 203, icon: '🚪' },
  { name: 'Standard Bicycle', height: 110, icon: '🚲' },
  { name: 'Basketball Hoop', height: 305, icon: '🏀' },
  { name: 'Emperor Penguin', height: 120, icon: '🐧' },
  { name: 'Giraffe', height: 500, icon: '🦒' },
  { name: 'Brown Bear', height: 250, icon: '🐻' },
  { name: 'T-Rex', height: 400, icon: '🦖' },
  { name: 'Telephone Pole', height: 1100, icon: '📡' },
  { name: '3-Story Building', height: 1000, icon: '🏢' },
  { name: 'Blue Whale', height: 3000, icon: '🐋' },
  { name: 'Statue of Liberty', height: 9300, icon: '🗽' },
  { name: 'Big Ben Tower', height: 9600, icon: '🕰️' },
  { name: 'Eiffel Tower', height: 30000, icon: '🗼' },
  { name: 'Empire State Bldg', height: 44300, icon: '🏙️' },
];

export const PRESET_COLORS = [
  '#677a85', '#a4743f', '#487d97', '#99ceea', '#b6c9d6',
  '#f5bb80', '#394c56', '#8a9297', '#5a8eaa', '#c9956a',
  '#7a8a93', '#41484c',
];

// =====================================================================
// PROGRAMMATIC DATASETS — one-click comparison cards
// =====================================================================

export interface DatasetCharacter {
  name: string;
  height: number;
  type: CharType;
  color: string;
  icon?: string;
  imageUrl?: string;
  reach?: number;       // UFC reach span in cm
  note?: string;        // optional comparison note
}

export interface Dataset {
  id: string;
  title: string;
  description: string;
  emoji: string;
  characters: DatasetCharacter[];
}

// ---- Dataset 1: Couples Gap ----
export const COUPLES_DATASET: Dataset = {
  id: 'couples',
  title: 'Couples Height Gap',
  description: 'Classic short-tall couples',
  emoji: '💑',
  characters: [
    { name: 'Partner A (5\'2")', height: 157, type: 'female', color: '#a4743f', note: '5\'2"' },
    { name: 'Partner B (6\'0")', height: 183, type: 'male', color: '#677a85', note: '6\'0"' },
  ],
};

// ---- Dataset 2: Hollywood Celebrities ----
export const HOLLYWOOD_DATASET: Dataset = {
  id: 'hollywood',
  title: 'Hollywood Celebrities',
  description: 'Top Hollywood actors',
  emoji: '🎬',
  characters: [
    { name: 'Tom Holland', height: 173, type: 'male', color: '#677a85' },
    { name: 'Zendaya', height: 178, type: 'female', color: '#677a85' },
    { name: 'Tom Cruise', height: 170, type: 'male', color: '#677a85' },
    { name: 'Dwayne Johnson', height: 196, type: 'superhero', color: '#677a85' },
    { name: 'Chris Hemsworth', height: 191, type: 'superhero', color: '#677a85' },
    { name: 'Scarlett Johansson', height: 160, type: 'female', color: '#a4743f' },
  ],
};

// ---- Dataset 3: Bollywood Celebrities ----
export const BOLLYWOOD_DATASET: Dataset = {
  id: 'bollywood',
  title: 'Bollywood Celebrities',
  description: 'Top Bollywood stars',
  emoji: '🌟',
  characters: [
    { name: 'Shah Rukh Khan', height: 173, type: 'male', color: '#677a85' },
    { name: 'Deepika Padukone', height: 174, type: 'female', color: '#a4743f' },
    { name: 'Amitabh Bachchan', height: 188, type: 'male', color: '#677a85' },
    { name: 'Priyanka Chopra', height: 169, type: 'female', color: '#677a85' },
    { name: 'Hrithik Roshan', height: 182, type: 'male', color: '#677a85' },
    { name: 'Aishwarya Rai', height: 170, type: 'female', color: '#677a85' },
  ],
};

// ---- Dataset 4: Anime & Superheroes ----
export const ANIME_DATASET: Dataset = {
  id: 'anime',
  title: 'Anime & Superheroes',
  description: 'Fictional characters',
  emoji: '🦸',
  characters: [
    { name: 'Goku', height: 175, type: 'superhero', color: '#677a85' },
    { name: 'Levi Ackerman', height: 160, type: 'male', color: '#677a85' },
    { name: 'Gojo Satoru', height: 190, type: 'superhero', color: '#677a85' },
    { name: 'Wolverine', height: 160, type: 'superhero', color: '#677a85' },
    { name: 'Hulk', height: 274, type: 'monster', color: '#677a85' },
    { name: 'Superman', height: 191, type: 'superhero', color: '#677a85' },
    { name: 'Batman', height: 188, type: 'male', color: '#1f2937' },
    { name: 'Thor', height: 198, type: 'superhero', color: '#a4743f' },
  ],
};

// ---- Dataset 5: Sports Stars & UFC Reach ----
export const SPORTS_DATASET: Dataset = {
  id: 'sports',
  title: 'Sports Stars & UFC Reach',
  description: 'Athletes with reach spans',
  emoji: '⚽',
  characters: [
    { name: 'Lionel Messi', height: 170, type: 'male', color: '#677a85' },
    { name: 'Cristiano Ronaldo', height: 187, type: 'male', color: '#677a85' },
    { name: 'Shaheen Afridi', height: 198, type: 'male', color: '#677a85' },
    { name: 'LeBron James', height: 206, type: 'superhero', color: '#677a85' },
    { name: 'Jon Jones', height: 193, type: 'male', color: '#677a85', reach: 215, note: 'UFC reach 215 cm' },
    { name: 'Conor McGregor', height: 175, type: 'male', color: '#a4743f', reach: 188, note: 'UFC reach 188 cm' },
    { name: 'Khabib Nurmagomedov', height: 178, type: 'male', color: '#677a85', reach: 178, note: 'UFC reach 178 cm' },
    { name: 'Yao Ming', height: 226, type: 'superhero', color: '#677a85' },
  ],
};

export const ALL_DATASETS: Dataset[] = [
  COUPLES_DATASET,
  HOLLYWOOD_DATASET,
  BOLLYWOOD_DATASET,
  ANIME_DATASET,
  SPORTS_DATASET,
];
