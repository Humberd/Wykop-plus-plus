import { getAllItems, getAllItemsParent, getPager } from '../../queries';
import { lazyLoadImages } from '../../utils';

export interface Page {
  isLast: boolean;
  isLoading: boolean;
  currentPage: number
}

export class PageController {
  page: Page;

  constructor(private basePath: string,
              currentPage: number) {
    this.page = {
      isLast: this.isLastPage(document),
      isLoading: false,
      currentPage: currentPage || 1,
    };
  }

  async loadNextPage() {
    this.page.isLoading = true;

    const nextPageNumber = this.page.currentPage + 1;


    try {
      const nextPage = await this.getNextPageItems(nextPageNumber);
      const nextPageItems = getAllItems(nextPage);

      getAllItemsParent().append(...nextPageItems);

      this.page.currentPage = nextPageNumber;
      this.page.isLast = this.isLastPage(nextPage);

      lazyLoadImages();

      console.log(`Loading page ${nextPageNumber}: OK`);

    } catch (e) {
      console.warn(`Loading page ${nextPageNumber} FAILED`, e);

      throw e;
    } finally {

      this.page.isLoading = false;
    }

  }

  async getNextPageItems(nextPageNumber: number) {
    const url = this.getPageUrl(nextPageNumber);
    console.log(url);
    const response = await fetch(url);
    const html = await response.text();
    return new DOMParser().parseFromString(html, 'text/html');
  }

  getPageUrl(pageNumber: number) {
    return `${location.origin}${this.basePath}strona/${pageNumber}/`;
  }

  isLastPage(page: Document) {
    const pager = getPager(page);
    if (!pager) {
      return true;
    }
    const children = pager.querySelector('p').children;
    const lastChild = children[children.length - 1];
    return lastChild.textContent !== 'następna';
  }

}