import { pipe } from 'fp-ts/lib/function';
import answer from './model/answer';
import * as S from 'fp-ts/lib/State';
import { Data } from './type';

// const state: D = {
//   left: 8,
//   moves: 0,
// };

const state: Data = {
  cards: [
    { id: 'green-square', color: 'green', shape: 'square' },
    { id: 'orange-square', color: 'orange', shape: 'square' },
    { id: 'blue-triangle', color: 'blue', shape: 'triangle' },
  ],
  hint: {
    color: 'green',
    shape: 'square',
  },
  moves: 0,
  left: 8,
};

let result;

result = pipe(
  answer<Data>('green-square'),
  S.chain(() => answer<Data>('orange-square')),
  S.chain(() => answer<Data>('blue-square')),
  S.execute(state),
);

// @ts-ignore
console.log(result);
