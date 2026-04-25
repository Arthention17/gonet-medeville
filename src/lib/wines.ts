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
    description: "Vieilli 20 ans en cuves béton avant mise en bouteille. Le plus vieux Sauternes commercialisé au monde — l'antiquaire du Sauternais. Seulement 5 000 bouteilles par millésime, élevées dans la patience absolue.",
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
    description: "Pur Chardonnay du Mesnil-sur-Oger, classé Grand Cru. Quatorze ans sur lattes, dosage extra-brut. La cristalline pureté de la craie champenoise — un blanc de blancs d'une tension rare.",
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
    description: "Micro-domaine de trois hectares cerné par les vignes du Premier Grand Cru Classé Château Margaux. Dense, profond, d'une finesse rare — une élégance discrète qui se révèle à la garde.",
    blend: "70% Cab. Sauv. · 27% Merlot · 3% Petit Verdot",
    surface: "2,9 hectares · Margaux",
    accent: "#8B2635",
    image: "/bottles/eyrins.png",
  },
  {
    id: "respide",
    prefix: "Château",
    name: "Respide-Medeville",
    appellation: "GRAVES",
    subtitle: "Blanc",
    year: "2021",
    description: "Graves blanc d'exception sur un terroir de graves profondes. Notes de fleurs blanches, fruits à chair blanche, finale minérale ciselée — l'élégance bordelaise dans sa version la plus pure.",
    blend: "50% Sémillon · 48% Sauvignon · 2% Muscadelle",
    surface: "15 hectares · Toulenne",
    accent: "#6B7F5E",
    image: "/bottles/respide.png",
  },
];
