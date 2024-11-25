// Function to generate a random nickname
export function generateNickname(): string {
  const adjectives = ["Cool", "Super", "Awesome", "Mighty", "Brave"];
  const nouns = ["Lion", "Tiger", "Bear", "Eagle", "Shark"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 100);
  return `${adjective}${noun}${number}`;
}

export function randomColor(): string {
  const red = Math.floor(Math.random() * 150 + 50);
  const green = Math.floor(Math.random() * 150 + 50);
  const blue = Math.floor(Math.random() * 150 + 50);
  return `rgb(${red}, ${green}, ${blue})`;
}
