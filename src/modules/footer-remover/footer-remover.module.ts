import { getFooter, getSite } from '../../queries';
import { AppModule } from '../app-module';
import { AppEvents } from '../../events';
import './styles.scss';

export class FooterRemoverModule extends AppModule {

  static readonly MODULE_NAME = 'FooterRemoverModule';

  constructor(private appEvents: AppEvents) {
    super();
  }

  async init() {
    this.removeFooter();
  }

  private removeFooter() {
    getFooter().remove();
    getSite().classList.add('remove-footer');
  }
}
