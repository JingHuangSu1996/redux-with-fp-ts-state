import { pipe } from 'fp-ts/lib/function';
import { selectCard } from './model/answer';
import * as S from 'fp-ts/lib/State';
import { D } from './type';

// const state: D = {
//   left: 8,
//   moves: 0,
// };

const state: D = {
  cards: [
    { id: 'green-square', color: 'green', shape: 'square' },
    { id: 'orange-square', color: 'orange', shape: 'square' },
    { id: 'blue-triangle', color: 'blue', shape: 'triangle' },
  ],
  hint: {
    color: 'green',
    shape: 'square',
  },
};

let result;

// @ts-ignore
result = pipe(S.chain(selectCard('blue-triangle')), S.execute(state));

console.log(result);
