type Hint = { color: string; shape: string };
export type Selected = { selected: boolean };

export type Card = {
  id: string;
  color: string;
  shape: string;
};

export type D = {
  cards: Array<Card>;
  hint: Hint;
  left?: number;
  moves?: number;
};
