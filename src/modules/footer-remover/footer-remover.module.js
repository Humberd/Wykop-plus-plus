import {getFooter, getSite} from '../../queries';

export class FooterRemoverModule {
  init() {
    this.removeFooter();
  }

  removeFooter() {
    getFooter().remove();
    getSite().classList.add('remove-footer');

  }
}