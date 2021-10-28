import * as S from 'fp-ts/lib/State';
import * as O from 'fp-ts/lib/Option';
import compose from 'ramda/src/compose';
import lensPath from 'ramda/src/lensPath';
import _over from 'ramda/src/over';
import when from 'ramda/src/when';
import merge from 'ramda/src/merge';
import _find from 'ramda/src/find';
import { pipe, flow } from 'fp-ts/lib/function';

// inc :: Number -> Number
export const inc = (x: number): number => x + 1;

// dec :: Number -> Number
export const dec = (x: number): number => x - 1;

// decOrInc :: Boolean -> Number ->  Number
export const decOrInc = (x: boolean): ((a: number) => number) =>
  x ? inc : dec;

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

// find :: (a -> Boolean) -> Object -> Option a
export const find =
  <A>(pred: (a: A) => boolean) =>
  (o: any) => {
    const result = _find(pred, o);
    return result ? O.some(result) : O.none;
  };

// getState :: String -> State Object (Option a)
export const getState = <T>(
  key: keyof T,
): S.State<T, O.Option<T[keyof T]>> =>
  pipe(
    S.get<T>(),
    S.map((o: T) => O.fromNullable(o[key])),
  );

// liftA2(g): (fb: F<B>) => (fc: F<C>) => F<D>
export const liftA2State =
  <B, C, D, T>(g: (b: B) => (c: C) => D) =>
  (fb: S.State<T, B>, fc: S.State<T, C>): S.State<T, D> =>
    pipe(fb, S.map(g), S.ap(fc));

// liftState :: (a -> b) -> a -> State s b
export const liftState = <A, B>(fn: (a: A) => B) => pipe(fn, S.of);
