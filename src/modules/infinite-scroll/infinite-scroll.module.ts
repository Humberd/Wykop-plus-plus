import { getAllItems, getAllItemsParent } from '../../queries';
import { isElementInViewport } from '../../utils';
import { PageController, PageInfo } from './page-controller';
import { AppModule } from '../app-module';
import { AppEvents } from '../../events';
import './styles.scss'

export class InfiniteScrollModule extends AppModule {

  static readonly MODULE_NAME = 'InfiniteScrollModule';

  private pageController: PageController;

  constructor(private appEvents: AppEvents) {
    super();
  }

  async init() {
    const pageInfo = this.getPageInfo();

    this.pageController = new PageController(
        pageInfo.basePath,
        pageInfo.currentPage,
    );

    this.startOnScrollListener();
  }

  private getPageInfo(): PageInfo {
    const pathname = location.pathname;

    const regex = /^(.*)\/strona\/(\d+).*$/;
    const result = regex.exec(pathname);
    if (!result) {
      return {basePath: pathname, currentPage: 1};
    }

    return {basePath: result[1] || '/', currentPage: Number(result[2])};
  }

  private startOnScrollListener() {
    let lastItem = this.getLastItem();

    if (this.pageController.page.isLast) {
      console.log('The first page is also the last. Infinite scoll is disabled.');
      return;
    }

    const scrollHandler = async () => {
      if (!this.pageController.page.isLoading && isElementInViewport(lastItem)) {
        await this.pageController.loadNextPage();

        this.addPageBar(lastItem, this.pageController.page.currentPage);
        this.appEvents.onItemsLoaded.next();

        lastItem = this.getLastItem();

        if (this.pageController.page.isLast) {
          console.log(`Page ${this.pageController.page.currentPage} is the last one. Infinite scroll is disabled`);
          window.removeEventListener('scroll', scrollHandler);
        }
      }
    };

    window.addEventListener('scroll', scrollHandler);

  }

  private getLastItem(): Element {
    /* Need to iterate from last to first */
    for (const item of [...getAllItems()].reverse()) {
      /* When the last item is and add and user has addblock
       * it will not load the next page. This is why we need to get the last
        * non-add item */
      if (!this.isAdvertisement(item)) {
        return item;
      }
    }
  }

  private isAdvertisement(item: Element): boolean {
    return !!item.querySelector('a[href="https://www.wykop.pl/reklama/"]');
  }

  private addPageBar(lastItem: Element, pageNumber: number) {
    const elem = document.createElement('li');
    elem.classList.add('next-page-bar');
    elem.textContent = `Strona ${pageNumber}`;

    getAllItemsParent().insertBefore(elem, lastItem.nextSibling);
  }

}
