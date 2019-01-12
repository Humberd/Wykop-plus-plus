import { Subject } from 'rxjs';
import { injectable } from 'inversify';

@injectable()
export class AppEvents {

  readonly onItemsLoaded = new Subject<OnItemsLoadedPayload>();

  readonly onCommentHid = new Subject();

}

export interface OnItemsLoadedPayload {
  isInitial: boolean;
}
