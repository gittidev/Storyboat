// utils.ts

export const getRandom = <T>(items: T[]): T => {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

export const promptIdeas: string[] = [
  "dog",
  "girl",
  "ocean",
  "river",
  "mountain",
  "shopping",
  "king",
  "princess",
];

export const loaderMessages: string[] = [
  // "SSAFY",
  // "777조",
  "  ",
  "  ",
];
