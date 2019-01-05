import { getEntries } from '../../queries';
import { AppModule } from '../app-module';

export class ChildrenCounterModule extends AppModule {
  constructor() {
    super('ChildrenCounterModule');
  }

  async init() {
    for (const entry of getEntries()) {
      if (entry.classList.contains('children-counter-applied')) {
        continue;
      }
      entry.classList.add('children-counter-applied');

      this.createChildrenCounter(entry);
    }
  }

  createChildrenCounter(elem: Element) {
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
