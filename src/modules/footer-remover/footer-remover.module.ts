import { getFooter, getSite } from '../../queries';
import { AppModule } from '../app-module';

export class FooterRemoverModule extends AppModule {

  constructor() {
    super('FooterRemoverModule');
  }

  async init() {
    this.removeFooter();
  }

  removeFooter() {
    getFooter().remove();
    getSite().classList.add('remove-footer');
  }
}
