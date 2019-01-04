import {getAllItems, getAllItemsParent, getPager} from '../../queries';
import {isElementInViewport} from '../../utils';
import {PageController} from './page-controller';

export class InfiniteScrollModule {
  init() {
    const urlData = this.parseCurrentUrl();
    console.log(`UrlData`, urlData);
    this.pageController = new PageController(
        urlData.basePath,
        urlData.currentPage,
    );

    this.removePaginationBar();
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

  removePaginationBar() {
    const pager = getPager();

    if (!pager) {
      return;
    }

    pager.remove();
  }

  startOnScrollListener() {
    let lastItem = this.getLastItem();

    document.onscroll = async () => {
      if (!this.pageController.page.isLoading &&
          isElementInViewport(lastItem)) {
        await this.pageController.loadNextPage();
        this.addPageBar(lastItem, this.pageController.page.currentPage);
        lastItem = this.getLastItem();
      }
    };
  }

  getLastItem() {
    const allItems = getAllItems();
    // TODO: get last element that is no an add
    return allItems[allItems.length - 2];
  }

  addPageBar(lastItem, pageNumber) {
    const elem = document.createElement('li');
    elem.classList.add('next-page-bar');
    elem.textContent = `Strona ${pageNumber}`;

    getAllItemsParent().insertBefore(elem, lastItem.nextSibling);
  }

}