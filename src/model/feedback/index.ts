import { pipe } from 'fp-ts/lib/function';
import * as S from 'fp-ts/lib/State';
import * as O from 'fp-ts/lib/Option';
import { getState } from '../helper';
import { Hint, Data, Card } from '../../type';
import { find as _find, propEq } from 'ramda';

// getHint :: () -> State AppState Hint
export const getHint = (): S.State<Data, O.Option<Hint>> =>
  pipe(
    getState<Data>('hint'),
    S.map(
      O.getOrElse<any>(() => ({
        color: 'unk',
        shape: 'unk',
      })),
    ),
  );

const find =
  <A>(pred: (a: A) => boolean) =>
  (o: any) => {
    const result = _find(pred, o);
    return result ? O.some(result) : O.none;
  };

export const getCard = (id: string): S.State<Data, O.Option<Card>> =>
  pipe(
    getState<Data>('cards'),
    S.map(O.chain(find(propEq('id', id)))),
    S.map(
      O.getOrElse<any>(() => ({ id, color: 'unk', shape: 'unk' })),
    ),
  );
