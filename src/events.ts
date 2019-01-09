// @ts-ignore
import { Subject } from 'rxjs';

export class AppEvents {

  readonly onItemsLoaded = new Subject();

  readonly onCommentHidden = new Subject();

}
