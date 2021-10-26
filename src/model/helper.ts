import * as S from 'fp-ts/lib/State';
import * as O from 'fp-ts/lib/Option';
import compose from 'ramda/src/compose';
import lensPath from 'ramda/src/lensPath';
import _over from 'ramda/src/over';
import when from 'ramda/src/when';
import merge from 'ramda/src/merge';
import { pipe } from 'fp-ts/lib/function';

// inc :: Number -> Number
export const inc = (x: number): number => x + 1;

// dec :: Number -> Number
export const dec = (x: number): number => x - 1;

// clamp :: (Number, Number) -> Number -> Number
export const clamp =
  (min: number, max: number) =>
  (x: number): number =>
    Math.min(Math.max(min, x), max);

// clampAfter :: Number -> Number -> (a -> Number) -> a -> Number
export const clampAfter =
  <A>(min: number, max: number) =>
  (fn: (a: A) => number) =>
    compose(clamp(min, max), fn);

// mapProps :: (Array, (a -> a)) -> Object -> Object
export const mapProps = <A>(target: Array<string>, fn: (a: A) => A) =>
  _over(lensPath(target), fn);

// over :: (String, (a -> b)) -> Object -> State(Object, _)
export const over = <A>(key: string, fn: (a: A) => A) =>
  S.modify(mapProps([key], fn));

// assignBy :: ((a -> Boolean), Object) -> Object -> Object
export const assignBy = <A extends object, U extends object>(
  pred: (a: A) => boolean,
  obj: U,
) => when(pred, merge(obj));

// getState :: String -> State Object (Option a)
export const getState = <T>(
  key: keyof T,
): S.State<T, O.Option<T[keyof T]>> =>
  pipe(
    S.get<T>(),
    S.map((o: T) => O.fromNullable(o[key])),
  );
