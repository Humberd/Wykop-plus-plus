import {getAllItems, getAllItemsParent, getPager} from '../../queries';
import {isElementInViewport, lazyLoadImages} from '../../utils';

export class InfiniteScrollModule {
  init() {
    this.pager = {
      isLoading: false,
      currentPage: 1,
    };

    this.removePagination();
    this.startListener();
  }

  removePagination() {
    const pager = getPager();

    if (!pager) {
      return;
    }

    pager.remove();
  }

  startListener() {
    const allItems = getAllItems();
    // TODO: get last element that is no an add
    const lastItem = allItems[allItems.length - 2];

    document.onscroll = async () => {
      if (!this.pager.isLoading && isElementInViewport(lastItem)) {
        await this.loadNextPage();
      }
    };
  }

  async loadNextPage() {
    this.pager.isLoading = true;

    const url = `${location.href}strona/${this.pager.currentPage + 1}/`;
    const response = await fetch(url);
    const html = await response.text();
    console.log(html);

    const nextPage = new DOMParser().parseFromString(html, 'text/html');
    console.log(nextPage);

    const nextPageItems = getAllItems(nextPage);
    console.log(nextPageItems);
    getAllItemsParent().append(...getAllItems(nextPage));

    lazyLoadImages();
    // console.log('appended all items from next page');
  }
}