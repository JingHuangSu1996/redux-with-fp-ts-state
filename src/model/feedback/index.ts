import { constant, flow, pipe } from 'fp-ts/lib/function';
import * as S from 'fp-ts/lib/State';
import * as O from 'fp-ts/lib/Option';
import propEq from 'ramda/src/propEq';
import omit from 'ramda/src/omit';
import equals from 'ramda/src/equals';
import { find, getState, liftA2State, over } from '../helper';
import { Hint, Data, Card } from '../../type';

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
export const setIsCorrect = <T>(
  isCorrect: boolean,
): S.State<T, void> => over('isCorrect', constant(isCorrect));

// cardToHint :: String -> State AppState Hint
const cardToHint = (id: string) =>
  pipe(getCard(id), S.map(omit(['id'])));

// validateAnswer :: String -> State AppState Boolean
export const validateAnswer = (id: string) =>
  // @ts-ignore
  liftA2State(equals)(getHint(), cardToHint(id));

// feedback :: String -> State AppState ()
const feedback = <T>(id: string): S.State<T, void> =>
  // @ts-ignore
  pipe(validateAnswer(id), S.chain(setIsCorrect));

export default feedback;
