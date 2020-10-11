import { AppModule } from '../app-module';
import './styles.scss';
import { AppEvents } from '../../events';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

export class AdsHiderModule extends AppModule {
  static readonly MODULE_NAME = 'AdsHiderModule';

  constructor(private appEvents: AppEvents) {
    super();
  }

  async init() {
    this.appEvents.adsRemoveRequest
        .subscribe(element => this.removeAdFor(element));

    this.appEvents.onItemsLoaded
        .subscribe(() => this.removeAdFor(document.body));

    this.removeInitialAds();
  }

  private removeInitialAds(): void {
    let checkCount = 0;
    timer(0, 500)
        .pipe(takeWhile(() => ++checkCount < 16))
        .subscribe(() => this.appEvents.adsRemoveRequest.next(document.body));

  }

  private removeAdFor(element: HTMLElement): void {
    const elementsToRemove = [
      ...element.querySelectorAll('iframe'),
    ];

    elementsToRemove.forEach(iframe => {
      iframe.remove();
    });

    console.log(`Removed ${elementsToRemove.length} ads`);
  }
}
