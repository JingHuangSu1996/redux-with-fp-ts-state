import { constant, flow, pipe } from 'fp-ts/lib/function';
import * as S from 'fp-ts/lib/State';
import * as O from 'fp-ts/lib/Option';
import propEq from 'ramda/src/propEq';
import always from 'ramda/src/always';
import omit from 'ramda/src/omit';
import equals from 'ramda/src/equals';
import {
  clampAfter,
  decOrInc,
  find,
  getState,
  liftA2State,
  over,
} from '../helper';
import { Hint, Data, Card } from '../../type';

// limitRank :: (a -> Number) -> a -> Number
const limitRank = clampAfter<number>(0, 4);

// getHint :: () -> State AppState Hint
const getHint = (): S.State<Data, O.Option<Hint>> =>
  pipe(
    getState<Data>('hint'),
    S.map(
      O.getOrElse<any>(() => ({
        color: 'unk',
        shape: 'unk',
      })),
    ),
  );

// getCard :: () -> State AppState Card
const getCard = (id: string): S.State<Data, O.Option<Card>> =>
  pipe(
    getState<Data>('cards'),
    S.map(O.chain(find(propEq('id', id)))),
    S.map(
      O.getOrElse<any>(() => ({ id, color: 'unk', shape: 'unk' })),
    ),
  );

// setIsCorrect :: Boolean -> State AppState ()
const setIsCorrect = <T>(isCorrect: boolean): S.State<T, void> =>
  over('isCorrect', constant(isCorrect));

// cardToHint :: String -> State AppState Hint
const cardToHint = (id: string) =>
  pipe(getCard(id), S.map(omit(['id'])));

// validateAnswer :: String -> State AppState Boolean
const validateAnswer = (id: string) =>
  // @ts-ignore
  liftA2State(equals)(getHint(), cardToHint(id));

// adjustRank :: Boolean -> State AppState ()
const adjustRank = flow(decOrInc, limitRank);

// updateRank :: Boolean -> State AppState ()
const updateRank = <T>(isCorrect: boolean): S.State<T, void> =>
  over('rank', adjustRank(isCorrect));

// applyFeedback :: Boolean -> State AppState ()
const applyFeedback = (isCorrect: boolean) =>
  liftA2State(always)(setIsCorrect(isCorrect), updateRank(isCorrect));

// feedback :: String -> State AppState ()
const feedback = <T>(id: string): S.State<T, void> =>
  // @ts-ignore
  pipe(validateAnswer(id), S.chain(applyFeedback));

export default feedback;
