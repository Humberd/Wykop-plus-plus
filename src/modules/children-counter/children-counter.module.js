import {getEntries} from '../../queries';

export class ChildrenCounterModule {

  init() {
    for (const entry of getEntries()) {
      this.createChildrenCounter(entry);
    }
  }

  createChildrenCounter(elem) {
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

    //add children count only to mikroblog posts
    elem.querySelector('.author .affect').appendChild(span);

    return span;
  }
}