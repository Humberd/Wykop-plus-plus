import {getAllItems, getAllItemsParent} from '../../queries';
import {lazyLoadImages} from '../../utils';

export class PageController {
  constructor(basePath, currentPage) {
    this.basePath = basePath;
    this.page = {
      isLoading: false,
      currentPage: currentPage || 1,
    };
  }

  async getNextPageItems(nextPageNumber) {
    const url = `${this.basePath}/strona/${nextPageNumber}/`;
    const response = await fetch(url);
    const html = await response.text();
    return new DOMParser().parseFromString(html, 'text/html');
  }

  async loadNextPage() {
    this.page.isLoading = true;

    const nextPageNumber = this.page.currentPage + 1;

    try {
      const nextPage = await this.getNextPageItems(nextPageNumber);
      console.log(nextPage);
      const nextPageItems = getAllItems(nextPage);

      getAllItemsParent().append(...nextPageItems);

      this.page.currentPage = nextPageNumber;

      lazyLoadImages();

      console.log(`Loading page ${nextPageNumber}: OK`);
    } catch (e) {
      console.warn(`Loading page ${nextPageNumber} FAILED`, e);
    } finally {
      this.page.isLoading = false;
    }
  }

}