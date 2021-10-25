import { flow, pipe } from 'fp-ts/lib/function';
import * as S from 'fp-ts/lib/State';
import map from 'ramda/src/map';
import propEq from 'ramda/src/propEq';
import { assignBy, clampAfter, dec, inc, over } from '../helper';
import { D, Card, Selected } from '../../type';
// limitMoves :: (a -> Number) -> a -> Number
const limitMoves = clampAfter<number>(0, 8);

// markedSelected :: (String) -> Object -> Object
const markedSelected = (id: string) =>
  assignBy<Card, Selected>(propEq('id', id), { selected: true });

// decLeft :: () -> State AppState ()
const decLeft = <T>(): S.State<T, void> =>
  over('left', limitMoves(dec));

// incMove :: () -> State AppState ()
const incMoves = <T>(): S.State<T, void> =>
  over('moves', limitMoves(inc));

// applyMove :: () -> State AppState ()
export const applyMove = flow(decLeft, S.chain(incMoves));

// selectCard :: String -> State AppState ()
export const selectCard = (id: string) =>
  over('cards', map(markedSelected(id)));
