export interface Wine {
  id: string;
  prefix: string;
  name: string;
  appellation: string;
  subtitle: string;
  year: string;
  description: string;
  blend: string;
  surface: string;
  accent: string;
  image: string;
}

export const wines: Wine[] = [
  {
    id: "gilette",
    prefix: "Château",
    name: "Gilette",
    appellation: "SAUTERNES",
    subtitle: "Crème de Tête",
    year: "1989",
    description: "Vieilli 20 ans en cuves béton avant mise en bouteille. Une patience unique au monde pour un vin légendaire — l'antiquaire du Sauternes.",
    blend: "90% Sémillon · 8% Sauvignon · 2% Muscadelle",
    surface: "4,5 hectares · Preignac",
    accent: "#D4A017",
    image: "/bottles/gilette.png",
  },
  {
    id: "champagne",
    prefix: "Champagne",
    name: "Champ d'Alouette",
    appellation: "CHAMPAGNE GRAND CRU",
    subtitle: "Extra Brut · Le Mesnil-sur-Oger",
    year: "2007",
    description: "100% Chardonnay du Mesnil-sur-Oger. 14 ans sur lattes. La pureté cristalline de la craie champenoise.",
    blend: "100% Chardonnay · Grand Cru",
    surface: "12 hectares · 8 villages",
    accent: "#C9A96E",
    image: "/bottles/champagne.png",
  },
  {
    id: "eyrins",
    prefix: "Château des",
    name: "Eyrins",
    appellation: "MARGAUX",
    subtitle: "Grand Vin de Bordeaux",
    year: "2022",
    description: "3 hectares entourés par les vignes de Château Margaux. Dense, profond, d'une finesse et d'une élégance rare.",
    blend: "70% Cab. Sauv. · 27% Merlot · 3% Petit Verdot",
    surface: "2,9 hectares · Margaux",
    accent: "#8B2635",
    image: "/bottles/eyrins.png",
  },
  {
    id: "respide",
    prefix: "Château",
    name: "Respide-Médeville",
    appellation: "GRAVES",
    subtitle: "Blanc",
    year: "2021",
    description: "Sur un terroir de graves profondes, un blanc envoûtant aux notes de fleurs blanches.",
    blend: "50% Sémillon · 48% Sauvignon · 2% Muscadelle",
    surface: "15 hectares · Toulenne",
    accent: "#6B7F5E",
    image: "/bottles/respide.png",
  },
];
