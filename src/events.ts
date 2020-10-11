import { Subject } from 'rxjs';

export class AppEvents {

  readonly onItemsLoaded = new Subject<OnItemsLoadedPayload>();

  readonly onCommentHid = new Subject();

  readonly adsRemoveRequest = new Subject<HTMLElement>();

}

export interface OnItemsLoadedPayload {
  isInitial: boolean;
}
