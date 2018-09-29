export const adjectives = [
  "beautiful",
  "ugly",
  "bright",
  "smart",
  "dumb",
  "angry",
  "happy",
  "sad",
  "dark",
  "white",
  "black",
  "red",
  "yellow",
  "gray",
  "green",
  "dynamic",
  "horrible",
];

export const nouns = [
  "monkey",
  "whale",
  "banana",
  "apple",
  "grape",
  "dolphin",
  "horse",
  "elephant",
  "lion",
  "tiger",
  "eagle",
  "dragon",
  "puma",
  "leopard",
  "dog",
  "cat",
];

export const generateNickname = () => {
  const seedAdjective = Math.round(Math.random() * (adjectives.length - 1));
  const seedNoun = Math.round(Math.random() * (nouns.length - 1));
  const nickname = `${adjectives[seedAdjective]} ${nouns[seedNoun]}`;

  return nickname[0].toUpperCase().concat(nickname.slice(1));
};
