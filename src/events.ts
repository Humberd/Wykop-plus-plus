import { Subject } from 'rxjs';

export class AppEvents {

  readonly onItemsLoaded = new Subject<OnItemsLoadedPayload>();

  readonly onCommentHid = new Subject();
}

export interface OnItemsLoadedPayload {
  isInitial: boolean;
}
