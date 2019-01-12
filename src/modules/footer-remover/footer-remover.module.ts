import { getFooter, getSite } from '../../utils/queries';
import { AppModule } from '../app-module';
import './styles.scss';
import { Service } from 'typedi';

@Service()
export class FooterRemoverModule extends AppModule {

  static readonly MODULE_NAME = 'FooterRemoverModule';

  async init() {
    this.removeFooter();
  }

  private removeFooter() {
    getFooter().remove();
    getSite().classList.add('remove-footer');
  }
}
