import { Subject } from 'rxjs';
import { Service } from 'typedi';

@Service()
export class AppEvents {

  readonly onItemsLoaded = new Subject<OnItemsLoadedPayload>();

  readonly onCommentHid = new Subject();

}

export interface OnItemsLoadedPayload {
  isInitial: boolean;
}
