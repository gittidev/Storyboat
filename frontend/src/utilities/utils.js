export const getRandom = (items) => {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

export const promptIdeas = [
  "dog",
  "girl",
  "ocean",
  "river",
  "mountain",
  "shopping",
  "king",
  "princess",
];

export const loaderMessages = [
  "SSAFY",
  "777조",
  "소설 작성 웹페이지 ",
  "잘 만들어봐요",
];
