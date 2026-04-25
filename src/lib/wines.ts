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
    id: "champagne",
    prefix: "Champagne",
    name: "Tradition",
    appellation: "CHAMPAGNE 1ER CRU",
    subtitle: "Brut",
    year: "NV",
    description: "70% Chardonnay, 25% Pinot Noir, 5% Meunier. Vinifie parcelle par parcelle sur les coteaux de Bisseuil. Frais, rond, une bulle fine et persistante.",
    blend: "70% Chardonnay · 25% Pinot Noir · 5% Meunier",
    surface: "12 hectares · 8 villages",
    accent: "#C9A96E",
    image: "/bottles/champagne.png",
    score: "92/100",
  },
  {
    id: "eyrins",
    prefix: "Chateau des",
    name: "Eyrins",
    appellation: "MARGAUX",
    subtitle: "Grand Vin de Bordeaux",
    year: "2022",
    description: "3 hectares de graves profondes entoures par les vignes de Chateau Margaux. Dense, profond, d'une finesse rare. 1300 caisses par an.",
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
    description: "Sur un terroir de graves profondes au sous-sol argileux, un blanc envoutant aux notes de fleurs blanches et de peche.",
    blend: "50% Semillon · 48% Sauvignon · 2% Muscadelle",
    surface: "15 hectares · Toulenne",
    accent: "#6B7F5E",
    image: "/bottles/respide.png",
  },
];

// CHAMPAGNES — 6 effervescents
export const champagnes = [
  { name: "Tradition", type: "1er Cru · Brut", blend: "70% Chardonnay, 25% Pinot Noir, 5% Meunier", detail: "Dosage 6g/l · 2 ans sur lattes", score: "92" },
  { name: "Blanc de Noirs", type: "1er Cru · Brut", blend: "100% Pinot Noir", detail: "Bisseuil & Ambonnay · Fermente en futs", score: "93" },
  { name: "Rose", type: "1er Cru · Extra Brut", blend: "70% Chardonnay, 27% Pinot Noir, 3% vin rouge", detail: "Seulement 900 bouteilles", score: "94" },
  { name: "Theophile", type: "Grand Cru · Extra Brut", blend: "60% Chardonnay, 40% Pinot Noir", detail: "Mesnil & Ambonnay · Fermente en futs anciens", score: "95" },
  { name: "Champ d'Alouette", type: "Grand Cru · Extra Brut", blend: "100% Chardonnay, Le Mesnil-sur-Oger", detail: "8+ ans sur lattes · 80 caisses", score: "96" },
  { name: "La Grande Ruelle", type: "Grand Cru · Extra Brut", blend: "100% Pinot Noir, Ambonnay", detail: "Blanc de Noirs millesime · 80 caisses", score: "96" },
];

// VIN TRANQUILLE DE CHAMPAGNE
export const coteaux = {
  name: "Athenais",
  type: "Coteaux Champenois Rouge · Grand Cru",
  blend: "100% Pinot Noir, Ambonnay",
  detail: "Vignes de 97 ans · Seulement 4 futs (80 caisses)",
  description: "Un vin rouge hypnotique, dense, mur, aux notes de fraise. Parmi les meilleurs vins tranquilles de Champagne.",
  score: "94",
};

// BORDEAUX — tous les domaines
export const bordeauxWines = [
  { name: "Chateau Gilette", appellation: "Sauternes", detail: "Creme de Tete · 20 ans en cuves beton", color: "#D4A017" },
  { name: "Chateau Les Justices", appellation: "Sauternes", detail: "Eleve en inox · Vignes de 40 ans", color: "#D4A017" },
  { name: "Chateau des Eyrins", appellation: "Margaux", detail: "Entoure par Chateau Margaux · 1300 caisses", color: "#8B2635" },
  { name: "Chateau Respide-Medeville", appellation: "Graves", detail: "Rouge & Blanc · 15 hectares", color: "#6B7F5E" },
  { name: "Dame de Respide", appellation: "Graves", detail: "Second vin de Respide-Medeville", color: "#6B7F5E" },
  { name: "Cru Monplaisir", appellation: "Bordeaux Superieur", detail: "Merlot dominant · Sans bois · Inox", color: "#722F37" },
  { name: "Domaine des Justices", appellation: "Graves / Bordeaux", detail: "Blanc sec, Rouge & Rose", color: "#7A8B6F" },
];
