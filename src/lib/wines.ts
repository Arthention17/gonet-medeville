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
  score?: string;
}

export const wines: Wine[] = [
  {
    id: "theophile",
    prefix: "Cuvee",
    name: "Theophile",
    appellation: "CHAMPAGNE GRAND CRU",
    subtitle: "Extra Brut",
    year: "2009",
    description: "60% Chardonnay du Mesnil-sur-Oger, 40% Pinot Noir d'Ambonnay. Fermente en futs anciens, eleve six ans sur lattes. Monumental et vigoureux.",
    blend: "60% Chardonnay · 40% Pinot Noir",
    surface: "Grand Cru · Le Mesnil & Ambonnay",
    accent: "#C9A96E",
    image: "/bottles/champagne.png",
    score: "95/100 Gault&Millau",
  },
  {
    id: "gilette",
    prefix: "Chateau",
    name: "Gilette",
    appellation: "SAUTERNES",
    subtitle: "Creme de Tete",
    year: "1989",
    description: "Vieilli 20 ans en cuves beton avant mise en bouteille. Une patience unique au monde pour un vin legendaire — l'antiquaire du Sauternes.",
    blend: "90% Semillon · 8% Sauvignon · 2% Muscadelle",
    surface: "4,5 hectares · Preignac",
    accent: "#D4A017",
    image: "/bottles/gilette.png",
  },
  {
    id: "eyrins",
    prefix: "Chateau des",
    name: "Eyrins",
    appellation: "MARGAUX",
    subtitle: "Grand Vin de Bordeaux",
    year: "2022",
    description: "3 hectares de graves profondes entoures par les vignes de Chateau Margaux. Dense, profond, d'une finesse rare.",
    blend: "70% Cab. Sauv. · 27% Merlot · 3% Petit Verdot",
    surface: "2,9 hectares · Margaux",
    accent: "#8B2635",
    image: "/bottles/eyrins.png",
  },
  {
    id: "respide",
    prefix: "Chateau",
    name: "Respide-Medeville",
    appellation: "GRAVES",
    subtitle: "Blanc",
    year: "2021",
    description: "Sur un terroir de graves profondes, un blanc envoutant aux notes de fleurs blanches. Equilibre entre fraicheur et opulence.",
    blend: "50% Semillon · 48% Sauvignon · 2% Muscadelle",
    surface: "15 hectares · Toulenne",
    accent: "#6B7F5E",
    image: "/bottles/respide.png",
  },
];

// Extended collection for catalog sections
export const champagnes = [
  { name: "Tradition", type: "1er Cru Brut", blend: "70% Chardonnay, 25% Pinot Noir, 5% Meunier", score: "92/100" },
  { name: "Blanc de Noirs", type: "1er Cru Brut", blend: "100% Pinot Noir (Bisseuil & Ambonnay)", score: "93/100" },
  { name: "Rose", type: "1er Cru Extra Brut", blend: "70% Chardonnay, 27% Pinot Noir, 3% vin rouge", score: "94/100" },
  { name: "Theophile", type: "Grand Cru Extra Brut", blend: "60% Chardonnay, 40% Pinot Noir", score: "95/100" },
  { name: "Champ d'Alouette", type: "Grand Cru Extra Brut", blend: "100% Chardonnay, Le Mesnil-sur-Oger", score: "96/100" },
  { name: "Grande Ruelle", type: "Grand Cru Extra Brut", blend: "100% Pinot Noir, Ambonnay", score: "96/100" },
  { name: "Athenais", type: "Coteaux Champenois Rouge", blend: "100% Pinot Noir, Ambonnay", score: "94/100" },
];

export const bordeaux = [
  { name: "Chateau Gilette", appellation: "Sauternes", detail: "Creme de Tete · 20 ans en cuves" },
  { name: "Chateau Les Justices", appellation: "Sauternes", detail: "Eleve en inox · Plus accessible" },
  { name: "Chateau des Eyrins", appellation: "Margaux", detail: "Entoure par Chateau Margaux" },
  { name: "Chateau Respide-Medeville", appellation: "Graves", detail: "Rouge & Blanc" },
  { name: "Cru Monplaisir", appellation: "Bordeaux Superieur", detail: "Merlot dominant · Sans bois" },
];
