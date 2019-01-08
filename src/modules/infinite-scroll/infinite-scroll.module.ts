import { getAllItems, getAllItemsParent } from '../../queries';
import { isElementInViewport } from '../../utils';
import { PageController } from './page-controller';
import { AppModule } from '../app-module';
import { ChildrenCounterModule } from '../children-counter/children-counter.module';
import { CommentsHiderModule } from '../comments-hider/comments-hider.module';

export class InfiniteScrollModule extends AppModule {
  private pageController: PageController;

  constructor(private commentsHiderModule: CommentsHiderModule,
              private childrenCounterModule: ChildrenCounterModule) {
    super();
  }

  async init() {
    const urlData = this.parseCurrentUrl();
    console.log(`UrlData`, urlData);

    this.pageController = new PageController(
        urlData.basePath,
        urlData.currentPage,
    );

    this.startOnScrollListener();
  }

  parseCurrentUrl() {
    const pathname = location.pathname;

    const regex = /^(.*)\/strona\/(\d+).*$/;
    const result = regex.exec(pathname);
    if (!result) {
      return {basePath: pathname, currentPage: 1};
    }

    return {basePath: result[1] || '/', currentPage: Number(result[2])};
  }

  startOnScrollListener() {
    let lastItem = this.getLastItem();

    if (this.pageController.page.isLast) {
      console.log(
          'The first page is also the last. Infinite scoll is disabled.');
      return;
    }

    const scrollHandler = async () => {
      if (!this.pageController.page.isLoading &&
          isElementInViewport(lastItem)) {
        await this.pageController.loadNextPage();

        this.addPageBar(lastItem, this.pageController.page.currentPage);
        this.updateUrl(this.pageController.page.currentPage);
        // this.commentsHiderModule.addCommentButtons();
        this.childrenCounterModule.init();

        lastItem = this.getLastItem();

        if (this.pageController.page.isLast) {
          console.log(
              `Page ${this.pageController.page.currentPage} is the last one. Infinite scroll is disabled`);
          window.removeEventListener('scroll', scrollHandler);
        }
      }
    };

    window.addEventListener('scroll', scrollHandler);

  }

  getLastItem() {
    /* Need to iterate from last to first */
    for (const item of [...getAllItems()].reverse()) {
      /* When the last item is and add and user has addblock
       * it will not load the next page. This is why we need to get the last
        * non-add item */
      if (!this.isAdd(item)) {
        return item;
      }
    }
  }

  isAdd(item: Element) {
    return item.querySelector('a[href="https://www.wykop.pl/reklama/"]');
  }

  addPageBar(lastItem: Element, pageNumber: number) {
    const elem = document.createElement('li');
    elem.classList.add('next-page-bar');
    elem.textContent = `Strona ${pageNumber}`;

    getAllItemsParent().insertBefore(elem, lastItem.nextSibling);
  }

  updateUrl(pageNumber: number) {
    history.replaceState(null, null,
        this.pageController.getPageUrl(pageNumber));
  }

}
