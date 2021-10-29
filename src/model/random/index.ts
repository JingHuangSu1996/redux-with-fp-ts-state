import { flow, pipe } from 'fp-ts/lib/function';
import * as S from 'fp-ts/lib/State';
import assoc from 'ramda/src/assoc';
import converge from 'ramda/src/converge';
import always from 'ramda/src/always';
import { Data } from '../../type';
import { liftA2State, liftState_ } from '../helper';

// nextSeed :: Number -> Number
const nextSeed = (seed: number): number =>
  (seed * 1103515245 + 12345) & 0x7fffffff;

// value :: Number -> Number
const value = (seed: number): number => (seed >>> 16) / 0x7fff;

// normalize :: (Number, Number) -> Number -> Number
const normalize =
  (min: number, max: number) =>
  (x: number): number =>
    Math.floor(x * (max - min)) + min;

// getNextSeed :: () -> State AppState Number
const getNextSeed = (): S.State<Data, number> =>
  S.gets(({ seed }) => nextSeed(seed));

// updateSeed :: Number -> State AppState Number
const updateSeed = (seed: number) => S.modify(assoc('seed', seed));

// nextValue :: Number -> State AppState Number
const nextValue = (seed: number): S.State<Data, number> =>
  converge(liftA2State(always), [liftState_(value), updateSeed])(
    seed,
  );

// random :: () -> State AppState Number
const random = flow(getNextSeed, S.chain(nextValue));

// between :: (number, number) -> State AppState number
export const between = (min: number, max: number) =>
  pipe(random(), S.map(normalize(min, max)));
