export interface CountryProfile {
  id: string;
  country: string;
  flagEmoji: string;
  girlName: string;
  boyName: string;
  language: string;
  food: string[];
}

export const MATCHING_PROFILES: CountryProfile[] = [
  {
    id: "canada",
    country: "Canada",
    flagEmoji: "🇨🇦",
    girlName: "Emma",
    boyName: "Ethan",
    language: "French / English",
    food: ["Poutine", "Butter Tarts"],
  },
  {
    id: "italy",
    country: "Italy",
    flagEmoji: "🇮🇹",
    girlName: "Maria",
    boyName: "Carlo",
    language: "Italian",
    food: ["Pizza", "Pasta"],
  },
  {
    id: "south-africa",
    country: "South Africa",
    flagEmoji: "🇿🇦",
    girlName: "Onika",
    boyName: "Kima",
    language: "Afrikaans",
    food: ["Biltong", "Bobotie"],
  },
  {
    id: "turkey",
    country: "Turkey",
    flagEmoji: "🇹🇷",
    girlName: "Leyla",
    boyName: "Ahmet",
    language: "Turkish",
    food: ["Kebab", "Sarma"],
  },
  {
    id: "japan",
    country: "Japan",
    flagEmoji: "🇯🇵",
    girlName: "Sakura",
    boyName: "Hiroto",
    language: "Japanese",
    food: ["Ramen", "Sushi"],
  },
  {
    id: "thailand",
    country: "Thailand",
    flagEmoji: "🇹🇭",
    girlName: "Somsri",
    boyName: "Chairat",
    language: "Thai",
    food: ["Tom Yum", "Pad Thai"],
  },
  {
    id: "australia",
    country: "Australia",
    flagEmoji: "🇦🇺",
    girlName: "Olivia",
    boyName: "Lucas",
    language: "English",
    food: ["Roast Lamb", "Meat Pies"],
  },
];
