import { AppModule } from '../app-module';
import './styles.scss';
import { AppEvents } from '../../services/events';
import { Service } from 'typedi';

@Service()
export class ChildrenCounterModule extends AppModule {

  static readonly MODULE_NAME = 'ChildrenCounterModule';

  constructor(private appEvents: AppEvents) {
    super();
  }

  async init() {
    this.listenForEvents();
  }

  private listenForEvents() {
    this.appEvents.onItemsLoaded
        .asObservable()
        .subscribe(payload => this.addChildrenCounters(payload.data));
  }

  private addChildrenCounters(entries: NodeListOf<Element>) {

    let appliedCounter = 0;

    for (const entry of entries) {

      this.createChildrenCounter(entry);

      appliedCounter++;
    }


    console.log(`Added ${appliedCounter}/${entries.length} children counters`);

  }

  createChildrenCounter(elem: Element): Element {
    const span = document.createElement('span');
    span.classList.add('child-counter');

    const moreElem = elem.querySelector('.sub .more a');

    let childCount;
    if (!moreElem) {
      childCount = elem.querySelectorAll('.sub > li').length;
    } else {
      try {
        childCount = Number(/\((\d+)\)/g.exec(moreElem.textContent)[1]) + 2;
      } catch (e) {
        childCount = elem.querySelectorAll('.sub > li').length;
      }
    }

    span.textContent = `(${childCount} dzieci)`;

    elem.querySelector('.author .affect').appendChild(span);

    return span;
  }
}
