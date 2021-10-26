import { flow, pipe } from 'fp-ts/lib/function';
import * as S from 'fp-ts/lib/State';
import map from 'ramda/src/map';
import propEq from 'ramda/src/propEq';
import { assignBy, clampAfter, dec, inc, over } from '../helper';
import { Data, Card, Selected } from '../../type';

// limitMoves :: (a -> Number) -> a -> Number
const limitMoves = clampAfter<number>(0, 8);

// markedSelected ::) -> Object -> Object
const markedSelected = (id: string) =>
  assignBy<Card, Selected>(propEq('id', id), { selected: true });

// decLeft :: () -> State AppState ()
const decLeft = <T>(): S.State<T, void> =>
  over('left', limitMoves(dec));

// incMove :: () -> State AppState ()
const incMoves = <T>(): S.State<T, void> =>
  over('moves', limitMoves(inc));

// applyMove :: () -> State AppState ()
const applyMove = <T>() =>
  pipe(decLeft<T>(), S.chain<T, void, void>(incMoves));

// selectCard :: String -> State AppState ()
const selectCard = <T>(id: string): S.State<T, void> =>
  over('cards', map(markedSelected(id)));

// answer :: String -> State AppState ()
const answer = <T>(id: string): S.State<T, void> =>
  // @ts-ignore
  pipe(S.of(id), S.chain<T>(selectCard), S.chain<T>(applyMove));

export default answer;
