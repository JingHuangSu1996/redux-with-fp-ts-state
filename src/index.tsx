import { pipe } from 'fp-ts/lib/function';
import answer from './model/answer';
import * as S from 'fp-ts/lib/State';
import { Data } from './type';
import feedback from './model/feedback';
import { between } from './model/random';

// const state: D = {
//   left: 8,
//   moves: 0,
// };

// const state: Data = {
//   cards: [
//     { id: 'green-square', color: 'green', shape: 'square' },
//     { id: 'orange-square', color: 'orange', shape: 'square' },
//     { id: 'blue-triangle', color: 'blue', shape: 'triangle' },
//   ],
//   hint: {
//     color: 'green',
//     shape: 'square',
//   },
//   moves: 0,
//   left: 8,
//   isCorrect: null,
//   rank: 3,
// };

const state: Data = {
  seed: Date.now(),
};

let result;

// result = pipe(
//   answer<Data>('green-square'),
//   S.chain(() => answer<Data>('orange-square')),
//   S.chain(() => answer<Data>('blue-square')),
//   S.execute(state),
// );

// result = pipe(setIsCorrect(true), S.execute(state));

// result = pipe(feedback<Data>('green-square'), S.execute(state));

result = pipe(between(10, 3), S.evaluate<any>(state));
// @ts-ignore
console.log(result);
